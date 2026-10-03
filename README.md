# Giappone 2026 — guida tascabile

Sito per iPhone del viaggio in Giappone (5–18 novembre 2026): programma giorno per giorno (ogni tappa è una
riga corta che si apre con dettagli, link e indicazioni Google Maps), l'app si apre da sola sulla tappa di
adesso e mette in grigio quelle passate (fusi di Roma e Tokyo), foto delle tappe da Wikipedia, giro del giorno
su Google Maps, prenotazioni con cosa manca
e chi ha pagato, conti tra i due viaggiatori, convertitore yen/euro e glossario.
Si installa sulla Home (Safari → Condividi → «Aggiungi alla schermata Home») e funziona anche senza rete
dopo la prima apertura.

## Come è fatto

```
viaggio.md     ← unica fonte dei dati (giorni, tappe, alloggi, treni, posti, cose da fare, budget, glossario)
build.py       ← legge viaggio.md, controlla i riferimenti e scrive data.json
data.json      ← generato: non modificarlo a mano
index.html, app.js, app.css, sw.js, manifest.webmanifest, icons/   ← il sito
```

La sintassi di `viaggio.md` è spiegata in cima al file. Per provare l'app a un'ora qualsiasi del viaggio:
`?ora=2026-11-11T10:00+09:00` in fondo all'indirizzo.

## Aggiornare

```
python3 build.py            # deve finire con «ok» e nessun ERRORE
git add -A && git commit -m "…" && git push
```

GitHub Pages ripubblica in un minuto. Se cambiano `index.html`, `app.js` o `app.css`, aumentare
`VERSION` in `sw.js`, così i telefoni scaricano la nuova versione.

Il sito è pubblico: in `viaggio.md` non vanno link di conferma, numeri di prenotazione, PIN, numeri di
passaporto o dati di pagamento.

Icone: [Lucide](https://lucide.dev) (licenza ISC). Foto: miniature di Wikipedia/Wikimedia Commons, caricate dal
telefono e salvate per l'uso offline.
