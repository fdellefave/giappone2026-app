# Giappone 2026 — guida tascabile

Sito per iPhone del viaggio in Giappone (5–18 novembre 2026). Una sola pagina: l'itinerario, giorno per giorno.
Ogni tappa è una scheda che si apre con foto, dettagli, come arrivarci e «Indicazioni» su Google Maps; tra una
scheda e l'altra c'è lo spostamento. Le tappe con qualcosa da prenotare o sistemare sono in rosso e i giorni in
alto hanno un pallino col numero. Sotto il titolo del giorno c'è il meteo delle città (adesso e, da 16 giorni prima,
le previsioni per quella data). In fondo al giorno: tutto il giro su Google Maps e i consigli. I tre puntini in basso aprono il menu:
adesso, cose da fare, hotel, treni, attività, codici (solo sul telefono), cambio, numeri utili, impostazioni. L'app si apre da sola sulla tappa di adesso (fusi di Roma e Tokyo). La lente in basso a destra cerca
qualsiasi cosa, anche scritta male; «da prenotare» elenca tutto ciò che manca.
Si installa sulla Home (Safari → Condividi → «Aggiungi alla schermata Home») e funziona anche senza rete
dopo la prima apertura.

## Back office dal computer

`admin.html` (https://fdellefave.github.io/giappone2026-app/admin.html, link anche dal menu dell'app su schermi larghi)
è la versione per il PC: panoramica con scadenze e calendario, ogni giorno con le tappe da modificare (ora, tipo,
titolo, attributi, dettagli, consigli), cose da fare da spuntare per tutti e due, note e aggiornamenti, alloggi, treni,
voli, posti, zone, budget, glossario, «Note per Claude» e il file intero come testo. Ricerca su tutto (Ctrl+K),
anteprima del telefono con le modifiche non ancora pubblicate, elenco delle modifiche con il confronto riga per riga.

«Pubblica» (Ctrl+S) controlla tutto con lo stesso `build.py` eseguito nel browser (Pyodide, Python in WebAssembly) e
fa un solo commit su main con `viaggio.md` e `data.json`. Se nel frattempo qualcuno ha cambiato il file su GitHub, unisce
le voci diverse e chiede quale tenere solo se è stata cambiata la stessa voce. Avvisa se una riga nuova sembra un dato
privato (codici, PIN, carte). Le modifiche non pubblicate restano salvate nel browser.

Serve un token GitHub «fine-grained» solo per questo repository con **Contents: Read and write**; resta nel browser del
PC («Accesso a GitHub», l'icona con la chiave). Il back office non va in cache: serve la rete.

## Come è fatto

```
viaggio.md     ← unica fonte dei dati (giorni, tappe, alloggi, treni, posti, cose da fare, budget, glossario)
build.py       ← legge viaggio.md, controlla i riferimenti e scrive data.json
data.json      ← generato: non modificarlo a mano
index.html, app.js, app.css, sw.js, manifest.webmanifest, icons/   ← l'app per il telefono
admin.html, admin.js, admin.css, admin-worker.js                  ← il back office per il computer
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
