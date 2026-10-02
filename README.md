# Giappone 2026 — guida tascabile

Sito per iPhone del viaggio in Giappone (5–18 novembre 2026): programma giorno per giorno con orari e
spostamenti, link a Tripadvisor / Tabelog / Maps, treni, alloggi, cose da fare, posti, glossario e
convertitore yen/euro. Si installa sulla Home (Safari → Condividi → «Aggiungi alla schermata Home») e
funziona anche senza rete dopo la prima apertura.

Questo repo contiene solo il sito pubblicato. I dati (`data.json`) si generano dal master Excel, che resta
nel repo privato `Giappone2026`, con:

```
python tools/excel_to_json.py Giappone_2026_MASTER_vX.Y.xlsx -o <percorso di questo repo>/data.json
```

Poi commit e push qui: GitHub Pages ripubblica in un minuto. Se cambiano `index.html`, `app.js` o
`app.css`, aumentare `VERSION` in `sw.js`. I link di conferma Booking/Airbnb non vengono mai pubblicati.
