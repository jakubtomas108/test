---
marp: true
---

# Google Spreadsheets jako databáze??

Aneb jak použít Google tabulky jako zdroj dat pro webovou stránku

---

## Proč?

- Tabulka umožňuje snadnou obsluhu pro vetšinu lidí
- Jednoduché navrhnutí struktury nad (potencionálně rapid prototyping)
- Autentifikace pomocí Google účtu out-of-the-box
- Mraky možností, co můžeme s GAPI dělat

---

## První krok je vytvořit novou Google aplikace

- Otevřeme si https://console.developers.google.com/
- Vytvoříme si nový projekt
- Povolíme Sheets API
- Vytvoříme si OAuth consent screen
- Vygenerujeme si pro aplikace API key
- Vygenerujeme si OAuth client ID

---

## Další krok je správně pracovat s knihovnou GAPI

- Knihovna se do aplikace/stránky přidá pomocí script tagu
- Inicializujeme GAPI
- Ověříme uživatele, případně předchozí přihlášení
- Načteme GAPI Sheets
- Poté můžeme dělat cokoliv nám GAPI dovolí, viz. dokumentace

---

## Zdroje

- https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
- https://console.developers.google.com/

---

<center>
<img src='https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/video/caring_for_your_kitten_video/650x350_caring_for_your_kitten_video.jpg' width='500'>
<img src='https://media.giphy.com/media/gngO1gmBhS9na/giphy.gif' width='500'>
</center>
