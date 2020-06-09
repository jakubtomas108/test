import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CLIENT_ID =
  "997130227311-q00c4t5vu5hfh6qgkfikc29eclg8gkl7.apps.googleusercontent.com";

const API_KEY = "AIzaSyD0613MLv6wuTtylswEmoa0HOYeTRnW4Zc";
const SHEET_ID = "1YhK09FEictvdajy3sNZnd8ZXL_FbUSbr-WkijPTjcp4";

export const Main: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [questions, setQuestions] = useState<any>([]);
  const [answers, setAnswers] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");

  // ? INICIALIZACE GAPI
  const initGapiClient = (): void => {
    gapi.load("client:auth2", () =>
      gapi.auth2
        .init({
          client_id: CLIENT_ID,
        })
        .then((resp) => {
          console.log("GAPI INITIALIZED", { resp });
          // ? V tomto bodě je možné např. ověřit, zda-li už byl uživatel přihlášen
        })
        .catch((err: any) => {
          console.log("initGapiClient", { err });
        })
    );
  };

  // ? AUTENTIFIKACE
  const authenticate = (): void => {
    gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly",
      })
      .then((resp) => {
        console.log("AUTH SUCCESS", { resp });
        setIsUserLoggedIn(true);
        loadGapiSheetsClient();
      })
      .catch((err) => {
        console.log("auth error", { err });
      });
  };

  // ? NACTENI GOOGLE SHEETS API
  const loadGapiSheetsClient = (): void => {
    gapi.client.setApiKey(API_KEY);

    gapi.client
      .load(
        "https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest",
        "sheets"
      )
      .then(
        (resp) => {
          console.log("SHEETS API LOADED", { resp });
          getDataFromSheet("Questions");
        },
        (err) => {
          console.log("error loading sheets api", { err });
        }
      );
  };

  // ? ZISKANI DAT ZE SHEETU
  const getDataFromSheet = (typeOfData: string): void => {
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: SHEET_ID,
        range: `${typeOfData}!A1:A`,
      })
      .then(
        (data) => {
          console.log("DATA FETCHED", { data });
          parseData(data.result.values, typeOfData);
        },
        (err) => {
          console.log("error getting data from sheet", { err });
        }
      );
  };

  // ? PARSOVANI DAT
  const parseData = (values: any[][] = [], typeOfData: string): void => {
    const result = values.map((value) => value[0]);

    if (typeOfData === "Questions") {
      setQuestions(result);
      return;
    }

    setAnswers(result);
  };

  // ? UKLADANI DO SHEETU
  const saveDataToSheet = () => {
    gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId: SHEET_ID,
        range: `Answers!A${answers.length + 1}`,
        valueInputOption: "RAW",
        resource: {
          values: [[inputValue]],
        },
      })
      .then((resp) => {
        console.log("DATA SAVED TO SHEET", { resp });
        setInputValue("");
        getDataFromSheet("Questions");
        getDataFromSheet("Answers");
      })
      .catch((err) => {
        console.log("error saving data to sheet", { err });
      });
  };

  useEffect(() => {
    initGapiClient();
  }, []);

  return (
    <Wrapper>
      {isUserLoggedIn ? (
        <div>
          <div style={{ display: "flex", margin: "auto" }}>
            <ul>
              {questions.map((entry: string) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
            <ul>
              {answers.map((entry: string) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
          <br />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={saveDataToSheet}>Ulozit</button>
        </div>
      ) : (
        <button onClick={authenticate}>Prihlasit se</button>
      )}
    </Wrapper>
  );
};
