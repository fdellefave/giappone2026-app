# Giappone 2026 — guida tascabile

Sito per iPhone del viaggio in Giappone (5–18 novembre 2026): programma giorno per giorno con orari,
spostamenti con le indicazioni Google Maps già impostate, mappa delle tappe di ogni giorno, link a
Tripadvisor / Tabelog, treni, alloggi, cose da fare, glossario e convertitore yen/euro.
Si installa sulla Home (Safari → Condividi → «Aggiungi alla schermata Home») e funziona anche senza rete
dopo la prima apertura.

## Come è fatto

```
viaggio.md     ← unica fonte dei dati (giorni, tappe, alloggi, treni, posti, cose da fare, budget, glossario)
build.py       ← legge viaggio.md, controlla i riferimenti e scrive data.json
data.json      ← generato: non modificarlo a mano
index.html, app.js, app.css, sw.js, manifest.webmanifest, icons/   ← il sito
```

La sintassi di `viaggio.md` è spiegata in cima al file.

## Aggiornare

```
python3 build.py            # deve finire con «ok» e nessun ERRORE
git add -A && git commit -m "…" && git push
```

GitHub Pages ripubblica in un minuto. Se cambiano `index.html`, `app.js` o `app.css`, aumentare
`VERSION` in `sw.js`, così i telefoni scaricano la nuova versione.

Il sito è pubblico: in `viaggio.md` non vanno link di conferma Booking/Airbnb, numeri di passaporto
o dati di pagamento.
