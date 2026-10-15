# Giappone 2026 — fonte dati

Unica fonte di verità del viaggio (5–18 novembre 2026, Federico + un amico). Il sito
https://fdellefave.github.io/giappone2026-app/ si genera da questo file con `python3 build.py`.
Dopo ogni modifica: build, controllo degli avvisi, commit e push su `fdellefave/giappone2026-app`.
Questo file vive solo qui: non tenerne copie nel progetto Claude «Giappone».

## Sintassi

- Sezioni `##`, voci `### id`, campi `chiave: valore` (una riga ciascuno).
- Giorno `### AAAA-MM-GG`: campi `percorso` (città separate da `>`), `dorme` (id alloggio o `volo`), `con`,
  `gruppo` (quando siete col gruppo: `tutto`, `14:00-`, `-18:20` o `06:35-18:20`),
  `fuso` (solo se non è Tokyo: `roma`). Città: roma, tokyo, kawaguchiko, kamakura, kyoto, takayama, osaka.
- Tappa: `- HH:MM tipo Titolo | attributo | attributo`, poi righe di dettaglio rientrate di 2 spazi.
  - tipi: `vedere` (luoghi) · `fare` (esperienze, spettacoli, giochi, terme) · `cibo` · `sposta` (spostamento in
    città: il titolo è la destinazione) · `viaggio` (treno, bus o volo lungo) · `hotel` · `bagagli` (valigie
    lasciate o riprese: serve l'attributo `deposito` o `ritiro`, che si può mettere anche su un check-in/out)
  - Uno `sposta` che arriva proprio alla tappa dopo (stessa destinazione) diventa il suo «come arrivarci»: l'app
    non lo mostra come riga a sé. Se la tappa dopo è un treno, mettere al treno `dove:` la stazione di partenza.
  - Ogni mattina l'app mette da sola come prima riga l'hotel della notte prima.
  - Titolo corto: solo il posto o la cosa. Tutto il resto va nei dettagli.
  - attributi: `posto: id` (link della sezione Posti) · `treno: id` · `alloggio: id` · `prenotare` · `prenotato`
    · `città: id` (da qui in poi si è in quella città) · `dove: testo` (ricerca Google Maps se non c'è un posto)
    · `zona: id` (sezione Zone, per le tappe senza posto) · `fuso: roma` (orario italiano) · `foto: titolo` (pagina di Wikipedia in inglese da cui prendere la foto)
    · `via mezzi|piedi|taxi: DA > A (etichetta)` = indicazioni Google Maps
    (DA e A: `#posto`, `@alloggio` o testo libero).
  - righe di dettaglio: `breve:` (riga corta sotto il titolo, si vede sempre), poi `come:`, `costo:`, `orari:`,
    `binario:`, `bagagli:`, `prenotazione:`, `attenzione:`, `alternativa:` oppure testo libero.
    `[[id]]` nel testo = link a un posto della sezione Posti.
- Posti: `foto: titolo` = pagina di Wikipedia in inglese (posto, piatto o zona) da cui l'app prende la foto;
  se il titolo non esiste l'app mostra l'icona del tipo.
- `#### Guida` dentro un giorno: campi `senso, mangiare, prenotare, attenzione, anticipo, stanchi, camminata`.
  Testo su una riga, oppure punti su righe seguenti che iniziano con `  • `.
- Testo che vede l'utente: italiano semplice, ogni termine giapponese spiegato tra parentesi, prezzi in yen
  con euro quando servono (1 € ≈ 185 ¥). Niente kanji.

## Note per Claude

Regole di Federico:
- Nei giorni col gruppo (7–10/11) si segue il programma del gruppo: solo note e indicazioni, niente riordini. Le decisioni le prende il gruppo: niente cose «da fare» per proporre o decidere col gruppo.
- A piedi le tratte sotto i 3 km, oltre coi mezzi (con mezzo e minuti); 10–15 km a piedi al giorno.
- Due 30enni un po' nerd: templi in 1–2 h, cose «wow», sale giochi e quartieri otaku, vita serale, cibo buono non
  da trappola turistica (ma i must-see restano). Niente musei d'arte moderna o cose occidentali. Sì natura, giardini
  zen, samurai e katane, spettacoli serali giapponesi anche strani.
- Giornate troppo piene: si toglie la cosa meno utile.
- Ogni posto con link diretto (Tripadvisor, o la piattaforma più nota); link verificati, mai inventati.
- Il sito è pubblico: mai link di conferma, numeri di prenotazione, PIN, numeri di passaporto o dati di pagamento.
  Numero di conferma e PIN di Booking, codice e telefono dell'host Airbnb: solo nell'app sul telefono (riquadro «Codici delle prenotazioni», salvati in locale), mai qui.
- App: poco testo a colpo d'occhio (titolo corto + dettagli a scomparsa), niente simboli giapponesi.
  Un posto = una sola riga: lo spostamento per arrivarci sta dentro la tappa. «Indicazioni» = da dove sei a lì,
  senza mezzo preimpostato. Ogni mattina si parte dall'hotel. Deposito e ritiro valigie sempre come tappe esplicite.
  Ricerca globale che capisce nomi scritti male. Una sola pagina (l'itinerario), niente schede: cosa manca da
  prenotare o sistemare si vede come numero rosso sul giorno e sulla tappa. Ogni nome giapponese ha la sua
  spiegazione tra parentesi direttamente nel titolo della tappa (es. «Kiyomizu-dera (tempio)»).
  Meteo sotto il titolo del giorno (Open-Meteo, senza chiave): com'è adesso in ogni città del giorno e, nei 16 giorni
  prima, le previsioni per quella data; si aggiorna all'apertura (max 1 volta l'ora) e ogni 3 ore.
  Ogni tappa ha la sua zona (sezione Zone): le tappe di fila nella stessa zona hanno un titoletto con orario e durata.
  Gruppo: campo `gruppo` del giorno → fascia «col gruppo» sotto le città, pillola rosa sulle tappe, avviso quando vi unite o vi staccate.
  Ogni alloggio dice di chi è (vostro, prenotato da Federico / del gruppo); «Dormite: …» nella testata si apre con tutti i dettagli.
  In basso a destra due pulsanti di vetro: la lente (ricerca) e i tre puntini (menu: adesso, da prenotare, hotel, treni e voli,
  attività, codici, yen ↔ euro, numeri utili, impostazioni con Google Maps / Mappe di Apple, tema, testo). In fondo al giorno solo il giro e i consigli.
  Sopra i giorni, la linea delle città (dalla città della notte prima a quella della sera) e sotto, a parte, le gite in giornata
  (città in mezzo al `percorso`, es. `takayama > shirakawago > takayama`, con `città:` sulle tappe di andata e ritorno; se si parte e si torna nella stessa città la fascia è larga quanto quella città).
  iOS 26 sfoca da solo una fascia sotto la barra di stato nell'app installata: la barra parte 14 px più in basso (40 px lasciavano troppo vuoto).

Già verificato (non riproporre):
- Escluse Kanazawa (doppione di Kyoto) e Nara/Himeji (al loro posto la giornata nerd a Osaka il 15/11).
- Statua del Gundam di Odaiba rimossa ad agosto 2026; Nintendo Museum (Uji) solo a lotteria; illuminazione di
  Eikan-dō dal 20/11 (dopo Kyoto); Tofuku-ji, Kuromon, Hama-rikyu, Ōkochi-Sansō e Hida-no-Sato tolti apposta.
- Go-kart per le strade di Tokyo escluso su richiesta (niente patente internazionale).
- Samurai Restaurant Time (verificato il 4/10): spettacoli 10:50, 14:00, 16:30, niente alle 19 · chiuso giovedì e domenica secondo alcune fonti. Scelto lo spettacolo delle 14 il 17/11 (martedì), così Shibuya Sky resta al tramonto.
- Tokyo Skytree aggiunta il 6/11 dopo il ponte Azuma-bashi (al posto del Senso-ji illuminato). Biglietti presi il 10/10 (link eTicket solo nell'email, mai qui).
- Cena da SUMO (ristorante a tema) del 9/11 tolta su richiesta (10/10). Il torneo di sumo di novembre è a Fukuoka (fuori rotta). Asakusa Sumo Club (~$100) tolto su richiesta: al suo posto la serata ad Akihabara.
- Lake Bake: bar interno chiuso, solo asporto. Omen (udon a Ginkaku-ji) chiuso il giovedì: il 12/11 non si va.
- Super Potato di Osaka = negozio Otaroad a Nipponbashi (Den Den Town).
- Bagagli (15/10): a testa uno zaino formato Ryanair e un trolley piccolo, sotto i 160 cm (somma dei lati): sugli Shinkansen non serve il posto con spazio bagagli.
- Shibuya Sky: biglietti 2 settimane prima alle 00:00 giapponesi.
- Attività extra (15/10). Regola di Federico: al massimo 2 attività al giorno sotto i €20 o fino a €45 a testa (le cose da €5–10 veloci non contano), solo se hanno senso, con voto oltre 4/5 e tante recensioni.
  Gion Corner tolto (recensioni basse): al suo posto il tour di Gion «Storie di geisha» delle 17 (~$30, Tripadvisor 4,9 su 1.354).
  Samurai & Ninja Museum promosso a tappa il 12/11 alle 17:35 (~¥3.300, Tripadvisor 4,7 su 2.186): Nishiki a quell'ora chiude.
  Scartati: Art Aquarium di Ginza (Tripadvisor 3,4), crociera Tombori a Dōtonbori (3,8), sumo show di Osaka (Sumo Studio, Hanazonochō: 4,9–5 ma ~¥9.600–12.000, sopra il tetto; Hirakuza ¥12.500), Kyoto Sumo Club (~€92), tour del sakè a Takayama (poche recensioni; ci sono già le distillerie di Sanmachi).
- Shirakawa-go (15/10): corse Nōhi con prenotazione esaurite; 12go vendeva solo le corse senza prenotazione (8:50, 15:15), Headout e Civitatis nulla sotto €50. Presa la gita Nōhi Ainokura + Shirakawa-go dell'8:30 (rientro 15:50), pagata da Federico, ¥18.000 per 2.
- Le coordinate dei posti non sono disponibili: la mappa del sito usa ricerche Google Maps.
- Revisione completa (15/10 pomeriggio). Il documento «Dove mangiare» (Claude Docs) era stato fatto su un itinerario vecchio: i pasti ora sono decisi qui e il documento è stato allineato. Pasti fissati: Vermillion e SANSHIKI (11/11), Onikai 19:30 (11/11), Daigin Shokudō e Kotetsu 19:00 (12/11, al posto di Sen no Kaze, ora alternativa), Irori 12:30 a Shirakawa-go, Fukutaro a pranzo e manzo di Kobe da Ishida a Umeda 18:30 (15/11), sushi omakase da Sushi Tokyo Ten 19:00 (17/11, Omoide Yokochō dopo cena), monjayaki a Tsukishima dopo teamLab (9/11, solo suggerimento: giorno del gruppo). Kotte Ushi di Kami-sannomachi 82 è quello giusto (chiuso solo il martedì).
- Conferme Booking lette il 5/10: tutte le 5 camere hanno 1 letto alla francese (131–150 cm) per 2 adulti; cancellazioni e telefoni aggiornati negli Alloggi.
- Pagamenti (dalle email di conferma, 3/10): hotel, Airbnb e treni Klook li ha prenotati Federico per 2 persone.
  Nagomi (10/10): sostituisce il Cottage Pastorale per il 7–9/11, prenotata dal gruppo, €115,50 a testa.
  Fuji Excursion 9/11 (10/10): preso da Federico per 2, Fujisan 14:16 → Shinjuku 16:08, €51,68.
  Klook: pagati il 7/9, i biglietti vengono confermati quando apre la vendita ufficiale (un mese prima).
  10/10: tutti gli alloggi sono pagati (Nagomi compresa), €686 a testa in tutto. Assicurazione Heymondo €44 a testa e Visit Japan Web fatti.

Messaggio del gruppo (13/10): 7 del gruppo dormono al Cottage Pastorale (navetta dalla stazione il 7/11, bici l'8/11, transfer alla stazione Fujisan il 9/11: solo per i loro ospiti). PDF dei biglietti e guide per il ritiro dei Fuji Excursion sul drive condiviso del gruppo. Il resto (Kanazawa, Shirakawa-go del 4/11, Nara, Osaka, ristoranti col gruppo) riguarda giorni senza di voi.

Back office (14/10): admin.html, dal PC, modifica questo file e pubblica da solo (viaggio.md + data.json generato
con build.py nel browser, commit su main col token GitHub di Federico salvato solo sul suo PC). Le note scritte lì sono
nella sezione «Note»: leggerle all'inizio della chat, possono contenere decisioni o aggiornamenti.

Messaggi agli alloggi (14/10): Federico ha scritto a tutti e 7 con orari di arrivo e partenza (con margine) e le richieste: deposito valigie (Airbnb, Nagomi, Saibo, Alpina, Hillarys), arrivo tardi (APA, Super Hotel), orario della colazione (Alpina, Hillarys). Le risposte da verificare sono le voci «risposta-…» in «Da fare».

Punti aperti: sono nella sezione «Da fare», ognuno agganciato alla sua tappa (l'app li mostra come notifiche). Quando una cosa è fatta: `fatto: AAAA-MM-GG` (non cancellarla).
- Chi ha pagato i voli e la quota di Nagomi non risulta dalle email: chiedere a Federico se serve nei conti.

## Info

partenza: 2026-11-05T15:05+01:00
cambio: 185
alloggi a testa: 686
viaggiatori: Federico, amico

## Giorni

### 2026-11-05
percorso: roma
dorme: volo
con: voi due
fuso: roma
- 11:00 viaggio Aeroporto di Fiumicino | foto: Leonardo da Vinci–Fiumicino Airport | dove: Aeroporto di Roma Fiumicino Terminal 1
  breve: check-in e controlli
  Pranzo in aeroporto prima dei controlli.
- 15:05 viaggio Volo AZ792 Roma → Tokyo Haneda | foto: ITA Airways | prenotato
  breve: 15:05 → 11:20 di domani (ora di Tokyo) · ~12 h
  Provate a dormire nella seconda metà del volo: si atterra a mezzogiorno e domani è lunga.

#### Guida
senso: Partenza da Roma: volo alle 15:05 da Fiumicino, arrivo a Tokyo domani alle 11:20.
mangiare: • Pranzo in aeroporto prima dei controlli
prenotare:
  • Passaporto
  • Visit Japan Web (il modulo online d'ingresso in Giappone): QR salvati sul telefono
  • e-SIM attiva
  • Un po' di yen in contanti
attenzione: • Dormite nella seconda metà del volo: si atterra a mezzogiorno e domani è lunga
camminata: ~2 km · volo ~12 h

### 2026-11-06
percorso: tokyo
dorme: airbnb-shinjuku
con: voi due
- 11:20 viaggio Atterraggio a Haneda, Terminal 3 | foto: Haneda Airport | dove: Haneda Airport Terminal 3
  breve: passaporti e dogana ~1 h
  Tenete pronti i QR di Visit Japan Web (il modulo online d'ingresso) per passaporti e dogana.
  Attivate l'e-SIM e la Suica sul telefono (la tessera ricaricabile per metro e treni).
- 12:30 sposta Airbnb Shinjuku | via mezzi: Haneda Airport Terminal 3 > @airbnb-shinjuku (Aeroporto → Airbnb)
  breve: treno + metro ~55′
  come: treno Keikyu (la linea privata dell'aeroporto) fino a Daimon, metro linea Ōedo fino a Higashi-Shinjuku, 5′ a piedi
  costo: ~¥800 a testa con la Suica
- 13:30 bagagli Valigie all'Airbnb | alloggio: airbnb-shinjuku | deposito
  breve: deposito valigie · check-in dalle 15
  Confermato dall'host (14/10): il deposito bagagli è self-service, si possono lasciare a qualsiasi ora. Le istruzioni le manda l'host se gli scrivete qualche giorno prima.
  Ingresso autonomo con cassetta delle chiavi dalle 15:00.
  alternativa: se l'host dice di no, deposito Radical Storage (negozi convenzionati) intorno a Ōkubo, ~¥750–850 a valigia per tutto il giorno, si prenota online. Sceglietene uno aperto fino alle 23 o 24 ore su 24: le riprendete tornando da Godzilla. Meglio non portarle in giro: da Fūunji si fa la coda in un locale minuscolo.
- 13:40 sposta Fūunji | via piedi: @airbnb-shinjuku > #fuunji (Airbnb → Fūunji)
  breve: a piedi 28′ · 2,3 km
- 14:10 cibo Fūunji (ramen) | posto: fuunji
  breve: ramen tsukemen · chiude alle 15
  Tsukemen: spaghettoni di ramen da intingere in un brodo denso. Tabelog 3,77 (Tabelog = il Tripadvisor giapponese).
  attenzione: c'è coda e alle 15:00 chiude
  alternativa: se uscite dall'Airbnb dopo le 14, sushi su nastro da [[kura-sushi]] ad Asakusa
- 15:00 sposta Senso-ji, Asakusa | via mezzi: #fuunji > #senso-ji (Fūunji → Senso-ji)
  breve: treno + metro ~35′
  come: treno JR linea Chūō da Shinjuku a Kanda (10′), metro Ginza line fino ad Asakusa (10′)
- 15:35 vedere Senso-ji (tempio) e Nakamise (bancarelle) | posto: senso-ji
  breve: il tempio più antico di Tokyo
  Senso-ji è il tempio buddista più antico di Tokyo; Nakamise è la via di bancarelle che porta al tempio.
  orari: sala principale fino alle 17, la zona resta aperta
- 16:30 vedere Ponte Azuma-bashi | posto: azuma-bashi
  breve: tramonto alle 16:42 · la Skytree di fronte
  A 5′ a piedi dal tempio. Dal ponte si guarda il tramonto sul fiume con di fronte la Tokyo Skytree (la torre della tv, 634 m), dove si sale subito dopo.
- 16:50 sposta Tokyo Skytree | via piedi: #azuma-bashi > #skytree (Azuma-bashi → Skytree)
  breve: a piedi 15′ · 1,2 km, attraversando il ponte
- 17:05 vedere Tokyo Skytree (torre panoramica) | posto: skytree | prenotato
  breve: Tokyo di notte da 350 m · ~1 h
  Si sale al Tembo Deck (la terrazza a 350 m) appena dopo il tramonto: tutta Tokyo illuminata. La Tembo Galleria (il corridoio a spirale a 450 m) è un supplemento, non serve.
  costo: Tembo Deck ¥2.100 a testa (giorno feriale) · con la Galleria a 450 m ¥3.100
  orari: 10–21, ultimo ingresso alle 20
  prenotazione: biglietti presi per 2, con data e ora. Il biglietto elettronico (eTicket) si apre dal link nell'email, da mostrare all'ingresso
- 18:15 sposta Super Potato, Akihabara | via mezzi: #skytree > #super-potato-akiba (Skytree → Akihabara)
  breve: metro + treno ~25′
  come: metro linea Toei Asakusa dalla stazione Oshiage (sotto la Skytree) ad Asakusabashi (8′), treno JR linea Sōbu fino ad Akihabara (2′), 5′ a piedi
  costo: ~¥330 a testa con la Suica
  Akihabara è il quartiere di elettronica, manga e videogiochi.
- 18:40 fare Super Potato (videogiochi retro) | posto: super-potato-akiba
  breve: 3 piani di console e cartucce + sala giochi anni '80–'90
  Il negozio di videogiochi retro più famoso di Tokyo: Famicom (il NES giapponese), Super Nintendo, Game Boy, Sega. All'ultimo piano una piccola sala giochi d'epoca.
  orari: chiude verso le 20
- 19:20 sposta Radio Kaikan | via piedi: #super-potato-akiba > #radio-kaikan (Super Potato → Radio Kaikan)
  breve: a piedi 5′
- 19:25 fare Radio Kaikan (figure e manga) | posto: radio-kaikan
  breve: 10 piani di negozi di figure, modellini e carte da collezione
  Al piano terra e in tutto il quartiere ci sono i gachapon (distributori di gadget a capsule, ¥100–500).
- 20:00 sposta Kyushu Jangara | via piedi: #radio-kaikan > #kyushu-jangara (Radio Kaikan → ramen)
  breve: a piedi 8′
- 20:10 cibo Kyushu Jangara (ramen) | posto: kyushu-jangara
  breve: cena: ramen col brodo di maiale denso
  Ramen tonkotsu (brodo di ossa di maiale, cremoso) in stile Kyushu; c'è anche la versione vegana. Niente prenotazioni.
  orari: 11–22, ultimo ordine 21:45
- 20:55 sposta Sale giochi di Akihabara | via piedi: #kyushu-jangara > #hey-akihabara (Ramen → sale giochi)
  breve: a piedi 5′
- 21:00 fare Sale giochi di Akihabara | posto: hey-akihabara
  breve: HEY, GiGO e Taito Station, aperte fino a tardi
  [[hey-akihabara]] (giochi retro e sparatutto, fino alle 23:45), [[gigo-akihabara]] (pupazzi da pescare con la gru, giochi musicali), [[taito-station]].
- 22:00 sposta Testa di Godzilla, Shinjuku | via mezzi: Akihabara Station, Tokyo > #godzilla (Akihabara → Godzilla)
  breve: treno JR 18′
  come: treno JR linea Sōbu da Akihabara a Shinjuku, poi 7′ a piedi
- 22:25 vedere Testa di Godzilla (statua gigante) | posto: godzilla
  breve: sull'Hotel Gracery, a Kabukichō
  Kabukichō è il quartiere dei locali notturni di Shinjuku.
- 22:40 sposta Airbnb | via piedi: #godzilla > @airbnb-shinjuku (Godzilla → Airbnb)
  breve: a piedi 12′ · 1 km
  Se le valigie sono al deposito di Radical Storage, passate a riprenderle: è sulla strada.

#### Guida
senso: Arrivo e prima immersione: Asakusa (la Tokyo antica, col tempio Senso-ji), tramonto sul fiume e Tokyo di notte dalla Skytree (la torre della tv), poi serata nerd ad Akihabara (il quartiere dei videogiochi): giochi retro, figure, ramen e sale giochi. Chiusura con la testa di Godzilla. Giornata lunga per il jet lag: con calma.
mangiare:
  • Pranzo: Fūunji, tsukemen (ramen da intingere), tra i migliori di Tokyo (Tabelog 3,77). Chiude alle 15: se siete in ritardo, Kura Sushi ad Asakusa (sushi su nastro, si ordina dal tablet)
  • Cena: Kyushu Jangara ad Akihabara, ramen col brodo di maiale (11–22)
prenotare:
  • Istruzioni del deposito valigie self-service dall'host dell'Airbnb (scrivergli qualche giorno prima)
  • Carta Suica (tessera per metro e treni) già sul telefono
attenzione:
  • Da Fūunji c'è coda e alle 15 chiude
  • Il Senso-ji chiude la sala alle 17: arrivate entro le 16
  • Ad Akihabara Super Potato e Radio Kaikan chiudono verso le 20: niente soste lunghe sulla Skytree
anticipo:
  • Kappabashi (la via dei negozi da cucina e del cibo finto in plastica), fino alle 17
  • Distributori di gadget a capsule (gachapon) ovunque ad Akihabara
stanchi: • Sulla Skytree (biglietto già preso) restate poco e andate dritti ad Akihabara · dopo cena saltate le sale giochi e la testa di Godzilla: treno JR per Shinjuku (18′) e a letto
camminata: ~10 km · mezzi ~1 h 30 in tutto · pause: pranzo 45′, cena 45′

### 2026-11-07
percorso: tokyo > kawaguchiko
dorme: nagomi
con: voi due + il gruppo
gruppo: 14:00-
- 08:30 hotel Check-out dall'Airbnb | alloggio: airbnb-shinjuku
  breve: entro le 10 · colazione al konbini (minimarket)
  Colazione al konbini (i minimarket aperti 24 h: 7-Eleven, Lawson, FamilyMart).
- 08:40 sposta Stazione JR di Shinjuku | via piedi: @airbnb-shinjuku > Shinjuku Station, Tokyo (Airbnb → stazione di Shinjuku)
  breve: a piedi 20′ con le valigie · ritiro biglietti alle 9:00 · al binario 10 alle 9:15
  alternativa: taxi 7′ (~¥1.000)
- 09:30 viaggio Treno Fuji Excursion per Kawaguchiko (lago del Fuji) | foto: Fuji Excursion | treno: fuji-7 | prenotato | dove: Shinjuku Station, Tokyo
  breve: 9:30 → 11:28 · diretto
  Treno diretto per il Monte Fuji fino a Kawaguchiko (il paese sul lago ai piedi del Fuji).
  Alle 11:14 passa da Shimoyoshida, la stazione della pagoda Chureito.
  attenzione: per salire servono i biglietti di carta. Prima del treno ritirateli alle macchinette JR di Shinjuku scansionando il QR dell'app Klook, e ritirate anche quelli del ritorno del 9/11: nella zona del Fuji le stazioni non sono JR e non si possono ritirare. La guida al ritiro è sul drive condiviso del gruppo.
- 11:30 bagagli Valigie negli armadietti della stazione | città: kawaguchiko | deposito | dove: Kawaguchiko Station | zona: kawaguchiko-stazione
  breve: stazione di Kawaguchiko
  Armadietti a gettoni nella stazione.
  alternativa: se gli armadietti sono pieni, Fujikanko Travel, a 1′ dalla stazione: deposito con persona 9:00–17:30, ¥800 a valigia grande. Nello stesso palazzo (Fujikan, davanti alla stazione) ci sono 18 armadietti grandi da ¥800 (80 × 44 × 60 cm).
- 11:40 sposta Lake Bake | via taxi: Kawaguchiko Station > #lake-bake (Stazione → Lake Bake)
  breve: taxi 10′ · ~¥2.000
- 12:00 cibo Lake Bake (panetteria sul lago) | posto: lake-bake
  breve: pane sul lago e picnic vista Fuji
  Panetteria sul lago (chiusa il mercoledì). Il bar interno è chiuso: pane da asporto e picnic sulla riva.
  alternativa: se il Fuji è nitido e per domani danno brutto, pagoda [[chureito]] subito (treno 15′)
- 13:30 sposta Stazione di Kawaguchiko | via taxi: #lake-bake > Kawaguchiko Station (Lake Bake → stazione)
  breve: taxi 10′
- 13:50 bagagli Ritiro valigie dagli armadietti | ritiro | dove: Kawaguchiko Station | zona: kawaguchiko-stazione
  breve: prima che arrivino gli amici
- 14:00 fare Arrivano gli amici | dove: Kawaguchiko Station | zona: kawaguchiko-stazione
  breve: dal bus delle 8:40 da Takayama
  Chi dorme al Cottage Pastorale (7 del gruppo) ha la navetta della struttura dalla stazione; voi andate a Nagomi in taxi o bus.
- 14:10 sposta Nagomi | via taxi: Kawaguchiko Station > @nagomi (Stazione → Nagomi)
  breve: taxi ~10′ · o bus fino a Kawaguchi-kyoku-mae + 5′ a piedi
  La casa è sulla sponda nord del lago, a 600 m dal santuario Kawaguchi Asama (dove parte la salita al Tenku no Torii).
- 15:00 hotel Check-in a Nagomi (casa del gruppo) | alloggio: nagomi
  breve: check-in dalle 16 · prima solo valigie, se l'host è d'accordo
  attenzione: il check-in è dalle 16:00: chiesto all'host di lasciare le valigie all'arrivo, tra le 14 e le 15 (messaggio inviato il 14/10, attesa risposta)
- 15:30 vedere Tenku no Torii (portale sul Fuji) | posto: tenku-no-torii
  breve: il portale nel cielo · chiude verso le 16
  Un torii (il portale rosso dei santuari) affacciato sul Fuji, sopra il santuario Kawaguchi Asama.
  attenzione: chiude verso le 16:00, ci sono 20–30′ di salita e nel weekend non si sale in auto: rischio di trovarlo chiuso
- 16:30 sposta Momiji Corridor | via taxi: Kawaguchi Asama Shrine, Fujikawaguchiko > #momiji-corridor (Tenku no Torii → viale degli aceri)
  breve: bus turistico o taxi
  come: bus turistico Red Line (fino alle ~17:45) o taxi
- 17:00 vedere Momiji Corridor (viale degli aceri) | posto: momiji-corridor
  breve: viale degli aceri rossi illuminato
  Festival del foliage dal 7/11: illuminato dal tramonto alle 21:00.
- 18:45 sposta Hoto Fudo | via taxi: #momiji-corridor > #hoto-fudo (Viale degli aceri → Hoto Fudo)
  breve: taxi ~8′ o a piedi 40′
  attenzione: i taxi sono pochi
- 19:00 cibo Hoto Fudo (zuppa hoto) | posto: hoto-fudo
  breve: cena col gruppo: tagliatelle in brodo con zucca · solo contanti
  Hoto: zuppa di tagliatelle larghe con zucca e verdure, il piatto tipico del Fuji.
  attenzione: chiude alle 20:00, o prima se finiscono i noodles

#### Guida
senso: Si va al Monte Fuji: treno diretto la mattina, pranzo sul lago, dal pomeriggio col gruppo (portale nel cielo, viale degli aceri illuminato, cena tipica).
mangiare:
  • Pranzo: Lake Bake, panetteria sul lago (Tabelog 3,62): pane e dolci da asporto, picnic sulla riva. Se piove: Hoto Fudo Higashi-Koiji, vicino alla stazione
  • Cena col gruppo: Hoto Fudo, hoto (zuppa di tagliatelle larghe con zucca e verdure). Solo contanti
prenotare:
  • Treno Fuji Excursion già pagato
  • Risposta di Nagomi sulle valigie prima delle 16 (chiesto il 14/10)
  • Contanti per la cena
attenzione:
  • Il Tenku no Torii chiude verso le 16 ed è a 20–30′ di salita: se il gruppo arriva tardi, meglio rimandarlo
  • Il 7/11 è il primo giorno del festival degli aceri: folla
  • Il bus turistico smette verso le 17:45: poi solo taxi (pochi)
anticipo:
  • Pagoda Chureito (la foto simbolo del Fuji) subito, treno 15′, se il Fuji è limpido e per domani danno brutto
  • Santuario Kawaguchi Asama (cedri secolari), a 600 m dalla casa
stanchi: • Saltate il Tenku no Torii: viale degli aceri + cena bastano
camminata: ~10 km (salita al Tenku no Torii) · treno 2 h · pause: pranzo 1 h 15, cena 1 h

### 2026-11-08
percorso: kawaguchiko
dorme: nagomi
con: voi due + il gruppo
gruppo: tutto
- 08:00 fare Giro del lago in bici | foto: Lake Kawaguchi | dove: Lake Kawaguchi | zona: lago-kawaguchi
  breve: col gruppo · 5 bici gratis alla casa
  La pagoda Chureito e Honcho Street si fanno il 9/11.
  Chi dorme al Cottage Pastorale noleggia le bici lì (solo per i loro ospiti): voi usate le 5 gratis di Nagomi.
- 13:00 cibo Miura Udon (spaghettoni udon) | posto: miura-udon
  breve: pranzo, se passate da Fujiyoshida · solo 10–14
  Udon spessi e sodi tipici della zona (Tabelog 3,65). Chiuso il mercoledì.
- 14:00 vedere Panorami sul Fuji | foto: Mount Fuji | dove: Oishi Park, Fujikawaguchiko | zona: kawaguchiko-nord
  breve: per esempio Oishi Park, sulla sponda nord
- 16:00 fare Onsen (bagno termale) o funivia sul lago | posto: funivia-kachi-kachi
  breve: terme con vista Fuji o funivia sul lago
  Onsen: le terme giapponesi (si entra lavati e nudi). La funivia porta a un belvedere sul lago e sul Fuji: solo se il Fuji è scoperto.
  costo: funivia andata e ritorno ¥1.000
  orari: funivia fino alle 17
- 18:00 hotel Relax a Nagomi | alloggio: nagomi
- 20:00 cibo Cena col gruppo

#### Guida
senso: Giornata col gruppo intorno al lago: bici, panorami sul Fuji, terme.
mangiare:
  • Pranzo: se passate da Fujiyoshida, Miura Udon (udon spessi e sodi tipici della zona, Tabelog 3,65; solo 10–14)
  • Cena col gruppo
prenotare:
  • Bici: 5 gratis a Nagomi, le altre a noleggio
  • Contanti per terme e funivia
attenzione:
  • Il Fuji è più limpido al mattino: foto prima delle 10
  • Domenica + festival degli aceri = folla ovunque
anticipo:
  • Funivia Kachi Kachi (panorama sul lago e sul Fuji, fino alle 17): solo se il Fuji è scoperto
  • Onsen (terme) prima di cena
stanchi: • Saltate la funivia, tenete bici e cena
camminata: ~5 km a piedi + 15–20 km in bici · pause: pranzo 1 h, casa 1 h, cena 1 h 30

### 2026-11-09
percorso: kawaguchiko > tokyo
dorme: saibo
con: voi due + il gruppo
gruppo: tutto
- 06:45 hotel Check-out da Nagomi (proposta) | alloggio: nagomi
  breve: proposta al gruppo: uscire presto con le valigie
  Il check-out sarebbe entro le 10, ma dopo Honcho Street servono ~40′ per tornare alla casa.
  Il gruppo del Cottage Pastorale ha chiesto il transfer della struttura fino alla stazione Fujisan (Monte Fuji) al check-out: vale solo per i loro ospiti, non per Nagomi.
- 06:55 bagagli Valigie negli armadietti della stazione (proposta) | deposito | dove: Kawaguchiko Station | zona: kawaguchiko-stazione
  breve: stazione di Kawaguchiko, taxi da Nagomi ~10′
  alternativa: alle 7 il deposito con persona è ancora chiuso: se gli armadietti della stazione sono pieni, provate quelli grandi del palazzo Fujikan davanti alla stazione (¥800). Se non si trova posto: check-out alle 10, poi taxi da Nagomi alla stazione e niente armadietti.
- 07:05 sposta Pagoda Chureito | via mezzi: Kawaguchiko Station > #chureito (Stazione → pagoda Chureito)
  breve: treno locale 15′ + a piedi 10′ e ~400 scalini
  come: treno locale Fujikyu da Kawaguchiko a Shimoyoshida (~15′, col gruppo), 10′ a piedi (700 m) e ~400 scalini
  costo: treno ¥310
  Se tenete il check-out alle 10: taxi da Nagomi alla stazione (~10′) e niente armadietti.
- 08:00 vedere Pagoda Chureito | posto: chureito
  breve: la foto simbolo del Giappone
  Pagoda rossa a 5 piani col Fuji dietro.
- 08:45 sposta Honcho Street | via piedi: #chureito > #honcho-street (Chureito → Honcho Street)
  breve: a piedi 15′ · 1 km
- 09:00 vedere Honcho Street | posto: honcho-street
  breve: la via col Fuji enorme in fondo
  attenzione: il check-out di Nagomi è entro le 10 ma da qui servono ~40′. Proposta: check-out alle 6:45 e valigie in stazione
- 09:45 sposta Lago Kawaguchi | via mezzi: Shimoyoshida Station, Fujiyoshida > Lake Kawaguchi (Shimoyoshida → lago)
  breve: treno 15′ fino a Kawaguchiko
- 10:15 vedere Tempo libero al lago | foto: Lake Kawaguchi | dove: Lake Kawaguchi | zona: lago-kawaguchi
- 12:00 cibo Pranzo al lago | dove: Kawaguchiko Station | zona: kawaguchiko-stazione
  breve: poi alla stazione
- 13:30 bagagli Ritiro valigie dagli armadietti | ritiro | dove: Kawaguchiko Station | zona: kawaguchiko-stazione
  breve: prima del treno locale
- 13:40 sposta Stazione Fujisan (Monte Fuji) | via mezzi: Kawaguchiko Station > Mt. Fuji Station, Fujiyoshida (Kawaguchiko → stazione Fujisan)
  breve: treno locale Fujikyu ~10′, 2 fermate (dopo Fujikyu Highland)
  come: treno locale Fujikyu (la ferrovia del Fuji) da Kawaguchiko a Fujisan, si paga con la Suica (tessera per metro e treni). Controllate in stazione l'orario del treno locale: deve arrivare prima delle 14:16
  alternativa: salire già a Kawaguchiko sullo stesso Fuji Excursion (parte da lì qualche minuto prima), ma il vostro biglietto vale da Fujisan: serve un biglietto in più per il tratto Kawaguchiko → Fujisan, da chiedere in biglietteria
- 14:16 viaggio Treno Fuji Excursion per Shinjuku (Tokyo) | foto: Fuji Excursion | treno: fuji-9 | prenotato | dove: Mt. Fuji Station, Fujiyoshida
  breve: 14:16 → 16:08 · dalla stazione Fujisan (Monte Fuji)
  Biglietto per 2 già preso, posti prenotati. Il treno parte da Kawaguchiko e si sale a Fujisan, due fermate dopo (in mezzo c'è Fujikyu Highland, il parco divertimenti).
- 16:10 sposta Hotel Saibo | città: tokyo | via mezzi: Shinjuku Station, Tokyo > @saibo (Shinjuku → Hotel Saibo)
  breve: metro 22′ senza cambi
  come: 7′ a piedi ai binari della metro Toei, metro linea Toei Shinjuku fino a Hamachō (22′), 6′ a piedi
  costo: ~¥280
- 16:45 hotel Check-in all'Hotel Saibo | alloggio: saibo
  breve: valigie in camera
  Ningyōchō è un quartiere tranquillo vicino a Tokyo Station.
- 18:00 cibo Spuntino a Ningyōchō (quartiere antico) | foto: Ningyōchō | dove: Ningyocho, Tokyo | zona: ningyocho
  breve: quartiere di botteghe di dolci
- 18:20 sposta teamLab Planets | via mezzi: @saibo > #teamlab (Hotel Saibo → teamLab)
  breve: metro ~35′ o taxi 20′
  come: metro Hibiya line fino a Ginza, 5′ a piedi a Ginza-itchōme, metro Yūrakuchō line fino a Toyosu, 12′ a piedi
  alternativa: taxi 20′ (~¥3.000)
- 19:00 fare teamLab Planets (museo di luci digitali) | posto: teamlab | prenotato
  breve: col gruppo · ingresso 19:00–19:30
  Museo d'arte digitale: stanze di luci e specchi, si cammina nell'acqua.
  attenzione: acqua fino al ginocchio (pantaloncini in prestito gratis); armadietti piccoli (23×34×37 cm): la valigia resta in hotel
  prenotazione: fatta dal gruppo, i biglietti sono sul drive condiviso del gruppo (link nella descrizione della chat)
- 20:50 sposta Tsukishima | via mezzi: #teamlab > #monja-kondo (teamLab → Tsukishima)
  breve: metro 3′ + a piedi 5′
  come: 12′ a piedi alla stazione Toyosu, metro Yūrakuchō line fino a Tsukishima (1 fermata, 3′), uscita 10, 3′ a piedi
- 21:05 cibo Monjayaki a Tsukishima | posto: monja-kondo
  breve: cena: la frittella di Tokyo sulla piastra · se il gruppo non ha altri piani
  Monjayaki: la versione di Tokyo dell'okonomiyaki, più liquida: si cuoce da soli sulla piastra al tavolo e si mangia con la spatolina. Tsukishima (quartiere sull'acqua a una fermata da Toyosu) ha una via intera di locali di monja.
  orari: Kondō 17–22, ultimo ordine 21:30 · si prenota online anche in giornata, fino alle 21
  alternativa: se uscite tardi da teamLab, nella stessa via ci sono locali di monja aperti fino alle 23
- 22:15 sposta Hotel Saibo | via taxi: #monja-kondo > @saibo (Tsukishima → Hotel Saibo)
  breve: taxi ~12′ (~¥1.800)
  alternativa: metro ~30′: Yūrakuchō line fino a Ginza-itchōme, 5′ a piedi a Ginza, Hibiya line fino a Ningyōchō

#### Guida
senso: Mattina col gruppo alla pagoda Chureito (la foto simbolo del Fuji), pomeriggio in treno a Tokyo, sera a teamLab (museo di luci digitali dove si cammina nell'acqua).
mangiare:
  • Pranzo al lago prima del treno
  • Cena dopo teamLab: monjayaki (la frittella di Tokyo cotta sulla piastra) a Tsukishima, una fermata da Toyosu, da Kondō (prenotabile online anche in giornata), se il gruppo non decide altro
prenotare:
  • Treno Fuji Excursion del pomeriggio già preso (si sale a Fujisan alle 14:16)
  • teamLab già prenotato dal gruppo
  • Pantaloni arrotolabili per teamLab
attenzione:
  • Il check-out di Nagomi è entro le 10 ma dal centro alla casa servono 40′: proposta al gruppo di uscire alle 6:45 con le valigie e lasciarle in stazione
  • A teamLab gli armadietti sono piccoli: la valigia resta in hotel
anticipo: • Giro a Ningyōchō (quartiere tradizionale con botteghe di dolci) prima di teamLab
stanchi: • Giornata già leggera, niente da tagliare
camminata: ~10 km (400 scalini della Chureito) · treni ~3 h · pause: lago 1 h 30, pranzo 1 h, cena 1 h

### 2026-11-10
percorso: tokyo > kamakura > tokyo > kyoto
dorme: apa-kyoto
con: voi due + il gruppo, la sera solo voi due
gruppo: 06:35-18:20
- 06:30 hotel Check-out dall'Hotel Saibo | alloggio: saibo
  breve: alle 6:30, prima del treno del gruppo
- 06:32 bagagli Valigie in deposito all'Hotel Saibo | alloggio: saibo | deposito
  breve: le riprendete alle 18:40
  prenotazione: confermato dall'hotel (14/10): reception aperta 24 ore su 24 e le due valigie restano in deposito fino al ritiro della sera
- 06:35 sposta Kamakura-kōkō-mae | via mezzi: @saibo > #kokomae (Hotel Saibo → Kamakura-kōkō-mae)
  breve: metro + treno + trenino ~1 h 20
  come: 2′ a piedi alla stazione Ningyōchō, metro Toei Asakusa fino a Shimbashi (10′), treno JR Tōkaidō fino a Fujisawa (~45′), Enoden fino a Kamakura-kōkō-mae (20′)
  Salite sul treno del gruppo a Shimbashi, la fermata dopo Tokyo. L'Enoden è il trenino storico sul mare.
  costo: JR ¥990 + biglietto giornaliero Enoden ¥800
- 08:00 vedere Passaggio a livello di Slam Dunk | città: kamakura | posto: kokomae
  breve: foto col trenino sul mare
  Il passaggio a livello sul mare dell'anime Slam Dunk, alla stazione Kamakura-kōkō-mae.
  attenzione: ci sono gli steward: foto dal marciapiede
- 08:45 sposta Hōkoku-ji | via mezzi: #kokomae > #hokoku-ji (Kōkō-mae → Hōkoku-ji)
  breve: trenino 20′ + bus 10′
  come: Enoden fino a Kamakura (20′), bus dalla fermata 4 fino a Jōmyōji (10′)
- 09:30 vedere Hōkoku-ji (tempio del bambù) | posto: hokoku-ji
  breve: il tempio col boschetto di bambù
  costo: ¥400, tè matcha nel bambù a parte
  attenzione: può chiudere se piove
- 10:30 sposta Komachi-dōri | via piedi: #hokoku-ji > #komachi-dori (Hōkoku-ji → Komachi-dōri)
  breve: a piedi 25′ · 2 km
- 11:00 cibo Komachi-dōri (via dello street food) | posto: komachi-dori
  breve: street food e shopping · pranzo verso le 12:30
  La via dello street food di Kamakura: si mangia fermi davanti al banco.
- 13:30 sposta Grande Buddha | via mezzi: Kamakura Station > #grande-buddha (Komachi-dōri → Grande Buddha)
  breve: trenino 5′ + a piedi 7′
  come: Enoden da Kamakura a Hase, poi 7′ a piedi
- 13:45 vedere Grande Buddha di Kōtoku-in (tempio) | posto: grande-buddha
  breve: statua di bronzo di 13 m all'aperto
  costo: ¥300
- 14:20 sposta Hase-dera | via piedi: #grande-buddha > #hase-dera (Grande Buddha → Hase-dera)
  breve: a piedi 8′ · 600 m
- 14:30 vedere Hase-dera (tempio sul mare) | posto: hase-dera
  breve: tempio con terrazza sul mare · chiude alle 16:30
- 16:15 sposta Spiaggia di Koshigoe | via mezzi: #hase-dera > Koshigoe Beach, Kamakura (Hase-dera → Koshigoe)
  breve: trenino 10′
- 16:40 vedere Tramonto sul mare a Koshigoe | foto: Enoshima | dove: Koshigoe Beach, Kamakura | zona: enoden-costa
- 17:05 sposta Hotel Saibo | via mezzi: Koshigoe Station, Kamakura > @saibo (Koshigoe → Hotel Saibo)
  breve: trenino + treno + metro ~1 h 20
  come: Enoden fino a Fujisawa (15′), treno JR fino a Shimbashi (45′) col gruppo, metro Toei Asakusa fino a Ningyōchō (10′)
  attenzione: partite da Fujisawa entro le 17:45 per non perdere lo Shinkansen
- 18:40 bagagli Ritiro valigie all'Hotel Saibo | città: tokyo | alloggio: saibo | ritiro
  breve: poi taxi per Tokyo Station
  Il gruppo lo salutate a Shimbashi, scendendo dal treno (loro volano il 12): da qui siete solo voi due.
- 18:45 sposta Gransta, Tokyo Station | via taxi: @saibo > #gransta (Hotel Saibo → Tokyo Station)
  breve: taxi 10′ (a piedi 25′)
- 19:00 cibo Ekiben (cestino da treno) da Gransta | posto: gransta
  breve: la cena da mangiare in treno
  Ekiben: il cestino-pranzo da treno. A Gransta, dentro la stazione, ce ne sono oltre 150 tipi.
- 20:09 viaggio Shinkansen (treno superveloce) Tokyo → Kyoto | foto: Tōkaidō Shinkansen | treno: shink-10 | prenotato
  breve: 20:09 → 22:21 · Nozomi 287
  Lo Shinkansen è il treno superveloce. Cena a bordo con l'ekiben.
  bagagli: trolley piccolo nella cappelliera, zaino sotto i piedi
- 22:21 sposta APA Hotel Kyoto | città: kyoto | via piedi: Kyoto Station > @apa-kyoto (Stazione di Kyoto → APA Hotel)
  breve: a piedi 7′ dall'uscita Central
- 22:30 hotel Check-in all'APA Hotel Kyoto | alloggio: apa-kyoto
  breve: 3 notti
- 22:40 cibo Honke Daiichi Asahi (ramen) | posto: daiichi-asahi | via piedi: @apa-kyoto > #daiichi-asahi (APA Hotel → ramen Daiichi Asahi)
  breve: ramen se avete fame · a piedi 13′, fino all'1:00
  Tabelog 3,74. Chiuso il giovedì.

#### Guida
senso: Gita a Kamakura (cittadina sul mare a un'ora da Tokyo, piena di templi) col gruppo, poi Shinkansen (treno superveloce) per Kyoto la sera.
mangiare:
  • Pranzo: street food a Komachi-dōri (la via dei chioschi): mangiate fermi davanti al banco
  • Cena: ekiben (il cestino da treno) comprato in stazione a Tokyo e mangiato sullo Shinkansen
  • Fame all'arrivo a Kyoto: ramen da Honke Daiichi Asahi (Tabelog 3,74, fino all'1:00)
prenotare:
  • Biglietto giornaliero del trenino Enoden ¥800
  • Shinkansen già pagato
  • Deposito valigie all'Hotel Saibo: confermato (reception aperta 24 ore su 24)
attenzione:
  • Il tempio del bambù (Hōkoku-ji) può chiudere con la pioggia
  • Hase-dera chiude alle 16:30
  • Partire da Fujisawa entro le 17:45 per non perdere lo Shinkansen
  • Al passaggio a livello ci sono gli steward: foto dal marciapiede
anticipo: • Più tempo a Hase-dera (grotta e terrazza) o una puntata a Enoshima (isoletta collegata da un ponte)
stanchi: • Con la pioggia saltate Hōkoku-ji: tenete Buddha, Hase-dera e Komachi-dōri
camminata: ~12 km · treni ~4 h (Shinkansen compreso) · pausa: pranzo 1 h

### 2026-11-11
percorso: kyoto
dorme: apa-kyoto
con: voi due
- 06:50 sposta Fushimi Inari | via mezzi: @apa-kyoto > #fushimi-inari (Hotel → Fushimi Inari)
  breve: a piedi 7′ + treno 5′
  come: a piedi alla stazione di Kyoto (7′), treno JR Nara line fino a Inari (5′)
- 07:15 vedere Fushimi Inari (santuario dei portali rossi) | posto: fushimi-inari
  breve: i 10.000 portali rossi · fino alle 9:30
  Santuario coi portali rossi in fila sulla collina: all'alba è vuoto. Salite fino al bivio di Yotsutsuji (~45′, vista sulla città) e tornate giù (~4 km in tutto).
  La cima aggiunge un'ora di gradini senza un panorama migliore.
  attenzione: dopo le 9 si riempie
- 09:45 cibo Vermillion (caffè) | posto: vermillion
  breve: colazione seduti, con calma · dalle 9
  Caffè a due passi dall'ingresso del santuario: espresso, matcha, dolci e piatti leggeri. Ieri siete arrivati alle 22:21: pausa lunga.
  alternativa: konbini (minimarket) davanti alla stazione JR Inari
- 11:00 sposta SANSHIKI | via mezzi: #vermillion > #sanshiki (Fushimi Inari → SANSHIKI)
  breve: treno 10′ + a piedi 4′
  come: treno Keihan (linea locale) da Fushimi-Inari a Kiyomizu-Gojō (10′), poi 4′ a piedi
- 11:20 cibo SANSHIKI (udon e tempura) | posto: sanshiki
  breve: pranzo appena apre · udon fatti a mano
  Udon (spaghettoni di grano spessi) in stile Sanuki, con tempura (fritto leggero); la bukkake fredda (udon con poco brodo versato sopra) costa ~¥700. Tabelog 3,53 su 297 recensioni. Locale piccolo: meglio presto.
  costo: ~¥1.000–2.000 a testa · solo contanti
  orari: 11–15 · chiuso il martedì
  alternativa: Nakau (catena di donburi e udon), all'incrocio Kawaramachi-Gojō, 5′ a piedi
- 12:30 sposta Kiyomizu-dera | via piedi: #sanshiki > #kiyomizu-dera (SANSHIKI → Kiyomizu-dera)
  breve: a piedi 25′ in salita per Gojō-zaka · 1,6 km
- 13:00 vedere Kiyomizu-dera (tempio) | posto: kiyomizu-dera
  breve: tempio di legno su palafitte
  La terrazza di legno guarda tutta la città.
- 14:15 vedere Sannenzaka e Ninenzaka (vicoli antichi) | posto: sannenzaka
  breve: vicoli antichi · pausa tè alle 15:00
  Vicoli in salita con case di legno e negozietti.
- 15:50 sposta Pagoda di Yasaka | via piedi: Ninenzaka, Kyoto > #pagoda-yasaka (Ninenzaka → pagoda di Yasaka)
  breve: a piedi 10′
- 16:00 vedere Pagoda di Yasaka | posto: pagoda-yasaka
  breve: luce del tardo pomeriggio
  La foto classica di Kyoto, dalla salita di Yasaka-dōri. Il tramonto (16:55) lo vedete durante il tour.
- 16:25 sposta Ritrovo del tour (Shijō) | via piedi: #pagoda-yasaka > #tour-geisha (Pagoda → ritrovo del tour)
  breve: a piedi 25′ · 2 km
  come: giù per Yasaka-dōri fino al santuario Yasaka, poi dritti lungo Shijō-dōri (la via principale) oltre il ponte sul fiume Kamo
- 17:00 fare Tour di Gion (quartiere delle geisha) con guida | posto: tour-geisha | prenotare
  breve: 2 h a piedi al tramonto · finisce al santuario Yasaka
  Al posto di Gion Corner (recensioni basse): una guida vi porta per Gion mentre si accendono le lanterne e vi spiega la vita di geisha e maiko (apprendiste geisha), le case da tè e come riconoscerle. Tappe: statua di Izumo no Okuni (la fondatrice del teatro kabuki), teatro Minamiza, ponte Tatsumi sul canale Shirakawa, [[hanami-koji]] e santuario Yasaka.
  Tripadvisor 4,9 su 1.354 recensioni, Viator 4,9 su 2.177. In inglese.
  costo: ~$30 a testa (~€26)
  prenotazione: turno delle 17:00 per 2 · cancellazione gratuita fino a 24 h prima
  attenzione: la guida aspetta col cartello davanti a Ben's Cookies e non aspetta i ritardatari · niente foto alle geisha da vicino e niente vicoli privati (multe)
  alternativa: free tour di Gion di Civitatis (9,2 su 2.084 opinioni, gratis + mancia), ritrovo al teatro Minamiza
- 19:00 sposta Onikai | via piedi: Yasaka Shrine, Kyoto > #onikai (Santuario Yasaka → Onikai)
  breve: a piedi 15′ · 1,1 km lungo Shijō-dōri
- 19:30 cibo Onikai (izakaya) | posto: onikai | prenotare
  breve: cena: cucina di Kyoto in osteria · prenotare alle 19:30
  Izakaya: osteria giapponese, piattini da condividere e birra. Onikai fa cucina di Kyoto con tante verdure locali. Tabelog 3,60 su 677 recensioni.
  costo: ~¥4.000–6.000 a testa · carte accettate
  orari: 17–23, ultimo ordine 22:00, aperto tutti i giorni
  prenotazione: ore 19:30 per 2, solo online su Tabelog (il telefono non risponde)
  alternativa: Ichiran Kawaramachi (ramen, fino alle 22), 3′ a piedi
- 21:00 vedere Pontochō (vicolo sul fiume) | posto: pontocho | via piedi: #onikai > #pontocho (Onikai → Pontochō)
  breve: il vicolo delle lanterne · a 3′
  Il vicolo stretto dei ristoranti affacciati sul fiume Kamo, illuminato dalle lanterne.
- 21:20 fare Bar lungo il canale (Kiyamachi-dōri) | posto: kiyamachi
  breve: bar e osterie lungo il canale
  Bar in piedi e birra artigianale, fino a mezzanotte.
  alternativa: [[kodai-ji]] illuminato (17–22, ¥800)
- 23:00 sposta Hotel | via mezzi: #kiyamachi > @apa-kyoto (Kiyamachi → hotel)
  breve: taxi 12′ o metro
  come: taxi 12′ (~¥1.500), oppure 12′ a piedi fino a Shijō, metro Karasuma fino a Kyoto (4′), 7′ a piedi

#### Guida
senso: Kyoto classica: santuario dei portali rossi all'alba, tempio su palafitte, vicoli antichi, quartiere delle geisha al tramonto con una guida che ne racconta i segreti e serata nei bar lungo il canale.
mangiare:
  • Colazione: Vermillion, caffè vicino all'ingresso di Fushimi Inari (dalle 9)
  • Pranzo: SANSHIKI, udon fatti a mano e tempura (Tabelog 3,53), a 4′ dalla stazione Kiyomizu-Gojō; solo contanti
  • Cena: Onikai, izakaya (osteria, piattini da condividere) di cucina di Kyoto a 3′ da Pontochō (Tabelog 3,60), alle 19:30
prenotare:
  • Tour di Gion con guida, turno delle 17:00 per 2 (cancellazione gratuita fino a 24 h prima)
  • Onikai ore 19:30 per 2 (online su Tabelog)
  • Contanti per SANSHIKI e i locali piccoli
attenzione:
  • Fushimi Inari dopo le 9 si riempie: partite presto
  • Foliage in ritardo nel 2026: aceri ancora verdi a metà novembre
  • A Gion non si fotografano le geisha da vicino e non si entra nei vicoli privati (multe)
anticipo: • Kōdai-ji illuminato (tempio con giardino e bambù illuminati, 17–22, ¥800) dopo cena
stanchi: • Saltate Pontochō e Kiyamachi: cena e a letto. Non tagliate Kiyomizu
camminata: ~14 km (salita a Fushimi, tour a passo lento) · mezzi 30′ · pause: colazione 1 h 15, pranzo 1 h, tè 30′, cena 1 h 15

### 2026-11-12
percorso: kyoto
dorme: apa-kyoto
con: voi due
- 07:10 sposta Bosco di bambù | via mezzi: @apa-kyoto > #bambu-arashiyama (Hotel → bosco di bambù)
  breve: treno 15′ + a piedi 10′
  come: a piedi alla stazione di Kyoto (7′), treno JR Sagano line fino a Saga-Arashiyama (15′), 10′ a piedi
- 07:50 vedere Bosco di bambù di Arashiyama | posto: bambu-arashiyama
  breve: vuoto solo a quest'ora
  Arashiyama è il quartiere verde a ovest di Kyoto.
  alternativa: [[tenryu-ji]] (giardino zen con laghetto), apre alle 8:30
- 08:30 sposta Monkey Park | via piedi: #bambu-arashiyama > #monkey-park (Bambù → Monkey Park)
  breve: a piedi 15′, dal ponte Togetsukyō
- 09:00 vedere Monkey Park (parco delle scimmie) | posto: monkey-park
  breve: scimmie libere e vista su Kyoto
  20–30′ di salita.
  costo: ¥800, solo contanti
- 10:00 sposta Ryōan-ji | via mezzi: Arashiyama Station Randen, Kyoto > #ryoan-ji (Monkey Park → Ryōan-ji)
  breve: tram storico ~30′
  come: 10′ a piedi alla stazione del Randen (il tram storico di Kyoto) di Arashiyama, cambio a Katabiranotsuji, fino a Ryōanji (~30′), 7′ a piedi
- 10:50 vedere Ryōan-ji (tempio del giardino zen) | posto: ryoan-ji
  breve: il giardino zen delle 15 rocce · 30–40′
  costo: ¥600
- 11:30 sposta Kinkaku-ji | via piedi: #ryoan-ji > #kinkaku-ji (Ryōan-ji → Kinkaku-ji)
  breve: a piedi 20′ · 1,5 km
- 12:00 vedere Kinkaku-ji (Padiglione d'Oro) | posto: kinkaku-ji
  breve: tempio d'oro sul laghetto · 40′
  Tempio ricoperto di foglia d'oro su un laghetto.
  costo: ¥500
- 12:45 sposta Daigin Shokudō | via taxi: #kinkaku-ji > #daigin (Kinkaku-ji → Daigin Shokudō)
  breve: taxi 25′ o bus 40′
  costo: taxi ~¥3.000 (7 km) · bus 204 con la Suica
- 13:15 cibo Daigin Shokudō (trattoria) | posto: daigin
  breve: pranzo veloce ed economico · ~¥1.000
  Shokudō: la trattoria giapponese di quartiere, con piatti unici (teishoku: riso, zuppa, sottaceti e un piatto di carne o pesce), udon e donburi (ciotole di riso condito). Menù in inglese e piatti finti in vetrina; insegna arancione e nera senza scritte in inglese. Omen (udon famosi) oggi è chiuso: è giovedì.
  orari: 11–20:40 · chiuso il mercoledì
- 14:15 vedere Ginkaku-ji (Padiglione d'Argento) | posto: ginkaku-ji
  breve: tempio con giardino di sabbia e muschio · 45′
  Giardino di sabbia e muschio.
  costo: ¥500
- 15:00 vedere Sentiero del Filosofo | posto: sentiero-filosofo | via piedi: #ginkaku-ji > #nanzen-ji (Ginkaku-ji → Nanzen-ji)
  breve: 2 km lungo un canale alberato · ~35′
  Si passa da [[honen-in]] (tempietto nel bosco, gratis).
  alternativa: [[eikan-do]] (il tempio degli aceri), ultimo ingresso alle 16
- 15:50 vedere Nanzen-ji (tempio zen) | posto: nanzen-ji
  breve: grande tempio zen con acquedotto dell'800
  orari: ultimo ingresso 16:40
- 16:35 sposta Keage Incline | via piedi: #nanzen-ji > #keage-incline (Nanzen-ji → Keage Incline)
  breve: a piedi 8′
- 16:45 vedere Keage Incline (vecchi binari tra gli alberi) | posto: keage-incline
  breve: al tramonto, 16:55
- 17:10 sposta Samurai & Ninja Museum | via mezzi: Keage Station, Kyoto > #samurai-ninja-museum (Keage → museo dei samurai)
  breve: metro 8′ + a piedi 14′
  come: metro Tōzai line da Keage a Kyoto Shiyakusho-mae (il municipio), poi 14′ a piedi verso sud (1,1 km)
- 17:35 fare Samurai & Ninja Museum (armature e katane) | posto: samurai-ninja-museum | prenotare
  breve: visita guidata 30′ + armatura, katana e shuriken · ~1 h
  Piccolo museo di armature, elmi e katane originali con una guida in inglese (30′), poi si prova: armatura da samurai, posa con la katana, lancio degli shuriken (le stelle dei ninja) al bersaglio. Mezz'ora quasi tutta in piedi ma senza camminare: giusto per la fine della giornata più lunga.
  Tripadvisor 4,7 su 2.186 recensioni, 6° su 2.275 cose da fare a Kyoto.
  costo: biglietto base ~¥3.300 a testa (~€18), un po' meno online
  orari: visite guidate ogni 15′; chiusura tra le 18:30 e le 19:30 a seconda delle fonti: prenotate l'ingresso delle 17:30–17:45 e controllate l'orario sul sito
  prenotazione: biglietto base per 2, sul sito ufficiale o su GetYourGuide
- 18:35 cibo Mercato di Nishiki | posto: nishiki | via piedi: #samurai-ninja-museum > #nishiki (Museo → Nishiki)
  breve: di passaggio verso la cena · a 4′ dal museo
  Via coperta di banchi di cibo: chiude verso le 17–18, a quest'ora resta aperto solo qualche banco. Assaggio veloce se trovate qualcosa, poi dritti al ramen.
- 19:00 cibo Kotetsu (spiedini fritti) | posto: kotetsu | prenotare | via piedi: #nishiki > #kotetsu (Nishiki → Kotetsu)
  breve: cena: kushiage · a piedi 12′ · prenotare alle 19:00
  Kushiage: spiedini di carne, pesce e verdure impanati e fritti al momento, uno alla volta. Tabelog 3,58; le recensioni lo chiamano il locale di kushiage più amato di Kyoto.
  costo: ~¥3.000–4.000 a testa · solo contanti
  orari: 18–24 · chiuso il mercoledì
  prenotazione: ore 19:00 per 2, solo online su Tabelog (il telefono non risponde)
  alternativa: [[sen-no-kaze]] (ramen in via Shinkyōgoku, 12–21)
- 20:15 sposta Hotel | via mezzi: #kotetsu > @apa-kyoto (Kotetsu → hotel)
  breve: taxi 10′ (~¥1.300) o metro ~25′
  come: 10′ a piedi a Shijō, metro Karasuma fino a Kyoto (4′), 7′ a piedi
- 20:30 hotel Relax, a letto presto | alloggio: apa-kyoto
  breve: domani treno alle 8:31
  L'APA ha un bagno pubblico interno (15:00–01:00), un sentō (bagno pubblico giapponese) in piccolo.

#### Guida
senso: Kyoto natura e zen: bambù e scimmie ad Arashiyama, giardino di rocce, Padiglione d'Oro e d'Argento, Sentiero del Filosofo, tramonto sui vecchi binari tra gli alberi, poi armature e katane al museo dei samurai. È il giorno più pesante.
mangiare:
  • Pranzo: Daigin Shokudō, trattoria economica sotto il Padiglione d'Argento (~¥1.000). Omen (udon famosi) oggi è chiuso: è giovedì
  • Cena: Kotetsu, kushiage (spiedini impanati e fritti al momento), Tabelog 3,58, alle 19:00; solo contanti
prenotare:
  • Samurai & Ninja Museum, ingresso delle 17:30–17:45 per 2 (~¥3.300 a testa)
  • Kotetsu ore 19:00 per 2 (online su Tabelog)
  • Contanti: il parco delle scimmie (¥800) accetta solo contanti
  • Scarpe comode: ~15 km
attenzione:
  • Il bosco di bambù è vuoto solo prima delle 8:30
  • Nanzen-ji: ultimo ingresso 16:40
anticipo:
  • Tenryū-ji (giardino zen con laghetto) alle 8:30
  • Eikan-dō (il tempio degli aceri) fino alle 16
stanchi:
  • Taxi da Ginkaku-ji a Nanzen-ji, saltando il Sentiero (−2,5 km)
  • Il museo dei samurai si fa quasi da fermi: non è quello da tagliare
  • Se piove: Toei Kyoto Studio Park (set dei film di samurai con spettacoli di ninja)
camminata: ~15 km (salita al parco delle scimmie), il massimo del viaggio · mezzi ~1 h 30 · pause: pranzo 1 h, museo 1 h, cena 1 h

### 2026-11-13
percorso: kyoto > takayama
dorme: alpina
con: voi due
- 07:45 hotel Check-out dall'APA Hotel | alloggio: apa-kyoto
  breve: colazione e spuntino in stazione
- 07:50 sposta Stazione di Kyoto | via piedi: @apa-kyoto > Kyoto Station (Hotel → stazione di Kyoto)
  breve: a piedi 7′ con le valigie · binario 0 alle 8:15
- 08:31 viaggio Treno Hida (espresso di montagna) Kyoto → Takayama | foto: Hida (train) | treno: hida-13 | prenotato | dove: Kyoto Station
  breve: 8:31 → 12:14 · diretto
  Takayama è una cittadina antica di legno tra le montagne. Zero cambi con le valigie.
  binario: 0 a Kyoto
  Chiedete da che lato si vede il fiume.
- 12:15 sposta Spa Hotel Alpina | città: takayama | via piedi: Takayama Station > @alpina (Stazione → Spa Hotel Alpina)
  breve: a piedi 3′
- 12:20 bagagli Valigie allo Spa Hotel Alpina | alloggio: alpina | deposito
  breve: check-in dalle 15
  prenotazione: chiesto all'hotel di lasciarle tra le 12 e le 13 e di fare il check-in tra le 17 e le 18:30 (messaggio inviato il 14/10, attesa risposta)
  Hotel moderno con onsen (le terme) sul tetto.
  alternativa: armadietti grandi nella stazione di Takayama (~¥700–900 al giorno) o nel terminal dei bus Nōhi accanto (armadietti in 3 punti), entrambi a 3′ dall'hotel.
- 12:30 sposta Kotte Ushi | via piedi: @alpina > #kotte-ushi (Hotel → Kotte Ushi)
  breve: a piedi 12′
- 12:45 cibo Kotte Ushi (sushi di manzo) | posto: kotte-ushi
  breve: sushi di Hida beef, pranzo veloce
  Hida beef: il manzo pregiato locale, scottato e servito su riso. Chiuso il martedì.
- 13:25 sposta Takayama Jinya | via piedi: #kotte-ushi > #jinya (Kotte Ushi → Jinya)
  breve: a piedi 5′
- 13:30 vedere Takayama Jinya (palazzo del governatore) | posto: jinya
  breve: l'antico palazzo del governatore · 45′
  orari: 8:45–16:30
  costo: ¥440
- 14:25 sposta Sanmachi-suji | via piedi: #jinya > #sanmachi (Jinya → Sanmachi)
  breve: a piedi 5′
- 14:30 vedere Sanmachi (vie antiche) e distillerie di sakè | posto: sanmachi
  breve: case di legno + assaggi di sakè (vino di riso)
  Le 3 vie di case di legno di epoca Edo (1603–1868).
  Distillerie: [[sake-harada]] (~¥450 con bicchierino ricordo), [[sake-hirase]] (~¥1.000 per oltre 20 sakè), [[sake-funasaka]] (assaggi self-service).
  attenzione: niente profumo forte prima delle distillerie (rovina il sakè)
  alternativa: [[showa-kan]] (museo della vita anni '50)
- 16:40 vedere Ponte Nakabashi | posto: nakabashi
  breve: ponte rosso · tramonto 16:50
- 17:00 sposta Hotel | via piedi: #nakabashi > @alpina (Nakabashi → hotel)
  breve: a piedi 12′
- 17:15 hotel Check-in allo Spa Hotel Alpina | alloggio: alpina | ritiro
  breve: riprendete le valigie dal deposito
- 17:45 sposta Kitchen Hida | via piedi: @alpina > #kitchen-hida (Hotel → Kitchen Hida)
  breve: a piedi 12′
- 18:00 cibo Steak House Kitchen Hida | posto: kitchen-hida | prenotare
  breve: bistecca di manzo di Hida · ~¥10.000 a testa
  Tabelog 3,78: la bistecca di Hida beef più votata della città.
  orari: ultimo ordine 19:45, chiuso il mercoledì
  prenotazione: ore 18:00 per 2, online
- 20:00 sposta Hotel | via piedi: #kitchen-hida > @alpina (Kitchen Hida → hotel)
  breve: a piedi 12′
- 20:15 fare Onsen sul tetto (bagno termale) | foto: Onsen | alloggio: alpina
  breve: terme panoramiche dell'hotel, fino all'1:00
  attenzione: con tatuaggi visibili l'ingresso può essere negato

#### Guida
senso: Treno panoramico tra le montagne fino a Takayama: città antica di legno, assaggi di sakè, manzo di Hida e terme sul tetto dell'hotel.
mangiare:
  • Pranzo: sushi di Hida beef (manzo locale scottato su riso) da Kotte Ushi (Tabelog 3,43)
  • Cena: Steak House Kitchen Hida (Tabelog 3,78), la bistecca di Hida beef più votata della città, ~€55 a testa
prenotare:
  • Kitchen Hida ore 18:00 per 2 (online)
  • Treno Hida 25 già pagato
attenzione:
  • Sul treno chiedete da che lato si vede il fiume
  • Il palazzo Jinya chiude alle 16:30
  • Prima delle distillerie niente profumo forte (rovina il sakè)
  • Takayama la sera si spegne presto
anticipo: • Showa-kan (museo della vita anni '50: giocattoli e negozi d'epoca)
stanchi: • Saltate il Jinya, solo Sanmachi (le vie antiche); la sera resta uguale
camminata: ~8 km · treno 3 h 45 seduti · pause: pranzo 45′, cena 1 h 30, terme 1 h

### 2026-11-14
percorso: takayama > shirakawago > takayama
dorme: alpina
con: voi due
- 06:50 sposta Mercato Miyagawa | via piedi: @alpina > #mercato-miyagawa (Hotel → mercato Miyagawa)
  breve: a piedi 12′
- 07:00 cibo Mercato mattutino Miyagawa | posto: mercato-miyagawa
  breve: bancarelle sul fiume · 40′ bastano
  Sottaceti e mochi grigliati (dolcetti di riso).
  orari: 7–12
- 07:45 sposta Stazione dei bus Nōhi | via piedi: #mercato-miyagawa > Takayama Nohi Bus Center (Mercato → stazione dei bus)
  breve: a piedi 12′ · accanto alla stazione dei treni
- 08:30 viaggio Gita in bus a Ainokura e Shirakawa-go | treno: bus-14 | prenotato | dove: Takayama Nohi Bus Center
  breve: 8:30 → rientro 15:50 · cambiate il biglietto al bancone entro le 8:15
  Gita Nōhi: bus con assistente (parla giapponese), tempo libero nei due villaggi. Inclusi l'ingresso al Minkaen (museo all'aperto delle case gasshō) e la navetta per il belvedere. Pranzo escluso.
  come: biglietto elettronico nell'email di Japan Bus Online: meglio stamparlo, altrimenti dal telefono
  attenzione: con neve o traffico il bus può tardare molto. Si può restare a Shirakawa-go, ma senza rimborso del ritorno
- 10:00 vedere Ainokura (villaggio dei tetti di paglia) | posto: ainokura | città: shirakawago
  breve: prima tappa · più piccolo e tranquillo di Shirakawa-go
  Villaggio gasshō di Gokayama (valle vicina, UNESCO), pochi turisti. Orari delle soste decisi dall'assistente: segnatevi l'ora di ripartenza.
- 11:30 vedere Shirakawa-go (villaggio dei tetti di paglia) | posto: shirakawa-go
  breve: patrimonio UNESCO · tempo libero fino a metà pomeriggio
  Case gasshō, coi tetti di paglia a punta («mani giunte»). Entrate in [[casa-wada]], l'unica grande casa visitabile, e nel Minkaen (incluso).
  attenzione: restate sui sentieri: risaie e case private sono protette. Il sabato è il giorno più affollato
- 12:30 cibo Irori (cucina di montagna) | posto: irori | prenotare
  breve: pranzo attorno al focolare · prenotare alle 12:30
  In una casa tradizionale col focolare (irori): set di Hida beef (il manzo locale) col miso o di tofu alla griglia. Tabelog 3,47 su 359 recensioni. A 1′ dal terminal dei bus di Ogimachi. Il pranzo non è incluso nella gita.
  costo: ~¥1.500–3.000 a testa · carte JCB e AMEX e PayPay, non Visa e Mastercard: portate contanti
  orari: pranzo 10–14
  prenotazione: ore 12:30 per 2, online su Tabelog
  alternativa: Yuinosato (crocchette, spiedini, onigiri al miso, 9:30–16), pranzo in piedi
- 13:45 vedere Belvedere Shiroyama | posto: belvedere-shiroyama
  breve: il villaggio visto dall'alto · navetta inclusa
  La navetta per il belvedere passa ogni 20′ circa: tenete d'occhio l'ora del bus.
- 15:00 viaggio Rientro a Takayama | treno: bus-14 | prenotato | città: takayama | via piedi: Takayama Nohi Bus Center > @alpina (Stazione dei bus → hotel)
  breve: 15:00 → 15:50 · poi 3′ a piedi all'hotel
- 16:00 hotel Riposo all'Alpina | alloggio: alpina
  breve: onsen sul tetto verso le 16:30
- 17:45 sposta Kyōya | via piedi: @alpina > #kyoya (Hotel → Kyōya)
  breve: a piedi 15′
- 18:00 cibo Kyōya (cucina di montagna) | posto: kyoya | prenotare
  breve: in una casa antica · manzo e miso alla brace
  Hoba miso (miso cotto su una foglia sul braciere) e Hida beef. Tabelog 3,33.
  orari: 17–20, chiuso il martedì
  prenotazione: ore 18:00 per 2, per telefono o tramite l'hotel
- 19:45 sposta Hotel | via piedi: #kyoya > @alpina (Kyōya → hotel)
  breve: a piedi 15′
- 20:00 hotel Valigia pronta, a letto presto | alloggio: alpina
  breve: domani check-out alle 7:40, treno alle 8:00

#### Guida
senso: Mercato sul fiume all'alba, poi gita in bus a Ainokura e Shirakawa-go, i villaggi delle case col tetto di paglia; rientro alle 15:50, terme e cena di montagna.
mangiare:
  • Al mercato: mochi grigliati (dolcetti di riso) e sottaceti
  • Pranzo: Irori a Shirakawa-go, Hida beef col miso attorno al focolare (Tabelog 3,47), alle 12:30; non è incluso nella gita
  • Cena: Kyōya, cucina di montagna in una casa antica (hoba miso, Hida beef; Tabelog 3,33)
prenotare:
  • Irori ore 12:30 per 2 (online su Tabelog)
  • Kyōya ore 18:00 per 2 (telefono o tramite hotel)
attenzione:
  • Il sabato è il giorno più affollato a Shirakawa-go
  • Portate il biglietto della gita stampato
  • Le case abitate non si visitano, le risaie non si calpestano
anticipo: • Passeggiata nella zona dei templi di Takayama (Higashiyama, a est del centro)
stanchi: • Saltate il mercato: il bus della gita parte comunque alle 8:30
camminata: ~7 km (belvedere con la navetta) · bus ~3 h in tutto · pause: pranzo 1 h, riposo 1 h, terme 1 h, cena 1 h 30

### 2026-11-15
percorso: takayama > osaka
dorme: hillarys
con: voi due
- 07:40 hotel Check-out dall'Alpina | alloggio: alpina | via piedi: @alpina > Takayama Station (Hotel → stazione di Takayama)
  breve: colazione veloce · 3′ a piedi alla stazione
- 08:00 viaggio Treno Hida (espresso) Takayama → Nagoya | foto: Hida (train) | treno: hida-15 | prenotato
  breve: 8:00 → 10:34 · Hida 4
- 10:58 viaggio Shinkansen (treno superveloce) Nagoya → Osaka | foto: Tōkaidō Shinkansen | treno: shink-15 | prenotato
  breve: 10:58 → 11:48 · Nozomi 247 · cambio di 24′
  come: dal binario 4 al 17 seguendo i cartelli dello Shinkansen, passando dai tornelli di cambio (si infilano i biglietti)
  Shin-Osaka è la stazione dello Shinkansen di Osaka, diversa dalla stazione centrale.
- 12:00 sposta Hotel Hillarys | città: osaka | via mezzi: Shin-Osaka Station > @hillarys (Shin-Osaka → Hotel Hillarys)
  breve: metro 15′ + a piedi 4′
  come: metro Midōsuji da Shin-Osaka a Shinsaibashi
- 12:20 bagagli Valigie all'Hotel Hillarys | alloggio: hillarys | deposito
  breve: check-in dalle 15
  prenotazione: confermato dall'hotel (14/10): deposito valigie gratis prima del check-in
  Check-in anticipato chiesto: l'hotel farà il possibile per avere la camera pronta prima, ma non è garantito (di solito ¥1.000, ~€5,40). Chiedete alla reception: se la camera è pronta salite, altrimenti valigie in deposito e check-in alle 17:30 come da programma.
  alternativa: deposito Radical Storage vicino alla stazione di Shinsaibashi (si prenota online), oppure gli armadietti extra-large del centro commerciale Namba City (a 10′, ¥600–800).
- 12:25 sposta Fukutaro | via piedi: @hillarys > #fukutaro (Hotel → Fukutaro)
  breve: a piedi 12′, passando da Dōtonbori
  Dōtonbori è il canale coi neon giganti, il cuore di Osaka.
- 12:40 cibo Fukutaro (okonomiyaki) | posto: fukutaro
  breve: pranzo: la frittata-pizza di Osaka · niente prenotazioni, c'è coda
  Okonomiyaki: la frittata-pizza di Osaka cotta sulla piastra; negiyaki: la versione al cipollotto. Tabelog 3,72, il più votato di Namba. La domenica apre alle 12: a pranzo la coda è più corta che la sera.
  alternativa: takoyaki (polpette di polpo) in piedi lungo [[dotonbori]]
- 13:45 sposta Den Den Town | via piedi: #fukutaro > #den-den-town (Fukutaro → Den Den Town)
  breve: a piedi 12′
- 14:00 fare Den Den Town (quartiere nerd) | posto: den-den-town
  breve: videogiochi retro, manga e figure
  L'Akihabara di Osaka: [[super-potato]] (videogiochi retro, weekend 10–20), [[mandarake]] (manga, figure e giochi usati, 12–20), Animate (negozio di anime), sale giochi.
- 15:15 sposta Shinsekai | via piedi: #den-den-town > #shinsekai (Den Den Town → Shinsekai)
  breve: a piedi 12′
- 15:30 vedere Shinsekai (quartiere retrò) | posto: shinsekai
  breve: quartiere retrò anni '50 · torre al tramonto (16:55)
  [[tsutenkaku]] al tramonto (¥1.000) e sale giochi d'epoca.
  Assaggio di kushikatsu (spiedini fritti) da [[daruma]], solo contanti.
  attenzione: da Daruma è vietato intingere due volte nella salsa comune
- 17:10 sposta Hotel Hillarys | via mezzi: #tsutenkaku > @hillarys (Shinsekai → Hotel Hillarys)
  breve: metro 8′ + a piedi 4′
  come: metro Midōsuji da Dōbutsuen-mae a Shinsaibashi
- 17:30 hotel Check-in all'Hotel Hillarys | alloggio: hillarys | ritiro
  breve: riprendete le valigie dal deposito
- 18:00 sposta Kobe Steak Ishida, Umeda | via mezzi: @hillarys > #kobe-ishida (Hotel → Umeda)
  breve: metro 6′ + a piedi 5′
  come: 4′ a piedi a Shinsaibashi, metro Midōsuji fino a Umeda (6′), poi al palazzo LINKS UMEDA accanto alla stazione JR di Osaka, 8° piano
- 18:30 cibo Kobe Steak Ishida (manzo di Kobe) | posto: kobe-ishida | prenotare
  breve: cena speciale: manzo di Kobe cotto davanti a voi · prenotare alle 18:30
  Teppanyaki: il cuoco cuoce la carne sulla piastra davanti al bancone. Il manzo di Kobe è il wagyu (manzo giapponese) più famoso: marmorizzato e tenerissimo.
  costo: cena da ~¥13.000 a testa (~€70) · +10% se prenotate online con My Concierge Japan
  orari: cena 16:30–23, ultimo ordine 21:30, aperto tutti i giorni
  prenotazione: ore 18:30 per 2, online su My Concierge Japan (pagamento anticipato) o per telefono
- 20:00 sposta Dōtonbori | via mezzi: #kobe-ishida > #hozenji-yokocho (Umeda → Dōtonbori)
  breve: metro 8′ + a piedi 5′
  come: metro Midōsuji da Umeda a Namba (8′)
- 20:15 vedere Dōtonbori di notte | posto: hozenji-yokocho
  breve: neon, insegna Glico e il vicolo delle lanterne
  Hōzenji Yokochō: vicolo lastricato di lanterne con una statua coperta di muschio, a 3′ dal canale. Se c'è ancora posto: takoyaki (polpette di polpo) da un banco lungo il canale.
- 21:15 fare Round1 (centro giochi) o bar di Ura-Namba | posto: round1 | via piedi: #hozenji-yokocho > #round1 (Hōzenji → Round1)
  breve: centro giochi enorme o vicoli di bar
  Round1 Sennichimae: sale giochi fino alle 0:50, bowling, karaoke. In alternativa [[ura-namba]]: vicoli di bar e osterie economiche.
- 23:30 sposta Hotel | via piedi: #round1 > @hillarys (Round1 → hotel)
  breve: a piedi 15′

#### Guida
senso: Giornata nerd a Osaka: okonomiyaki, quartiere dei videogiochi retro, quartiere anni '50 con la torre, cena di manzo di Kobe, poi neon di Dōtonbori e sale giochi la sera.
mangiare:
  • Pranzo: Fukutaro, okonomiyaki (frittata-pizza cotta sulla piastra), Tabelog 3,72; la domenica apre alle 12, c'è coda
  • Spuntino: kushikatsu (spiedini fritti) da Daruma a Shinsekai (Tabelog 3,46, contanti)
  • Cena speciale: manzo di Kobe al teppanyaki (cotto sulla piastra davanti a voi) da Kobe Steak Ishida a Umeda, ~€70 a testa, alle 18:30
  • Takoyaki (polpette di polpo) a Dōtonbori dopo cena, se c'è posto
prenotare:
  • Treni del mattino già pagati
  • Kobe Steak Ishida ore 18:30 per 2 (My Concierge Japan o telefono)
  • Contanti per Daruma e le sale giochi
attenzione:
  • Da Daruma è vietato intingere due volte nella salsa comune
  • Domani USJ: non fate troppo tardi
anticipo:
  • Castello di Osaka (bello da fuori; dentro museo dei samurai, 1 h)
  • Namba Grand Kagetsu (teatro della comicità di Osaka: in giapponese ma molto fisico)
stanchi: • Saltate Shinsekai: Den Den Town, cena e Dōtonbori sono vicini all'hotel
camminata: ~11 km · treni ~4 h al mattino + metro 45′ · pause: pranzo 1 h, check-in 30′, cena 1 h 30

### 2026-11-16
percorso: osaka > tokyo
dorme: super-hotel
con: voi due
- 07:15 hotel Check-out dall'Hotel Hillarys | alloggio: hillarys
  breve: colazione dalle 6:45 · anche da asporto
  La colazione (inclusa) inizia alle 6:45: scendete presto, oppure chiedete al personale della colazione di prepararla da portare via e mangiatela in treno o in coda a Universal Studios.
- 07:20 sposta Armadietti di Universal Studios | via mezzi: @hillarys > Universal Studios Japan lockers (Hotel → Universal Studios)
  breve: metro + treno ~35′
  come: 4′ a piedi, metro Midōsuji da Shinsaibashi a Umeda (6′, la stazione centrale di Osaka), treno JR da Osaka a Universal City (~15′, diretto o cambio a Nishikujō)
- 07:55 bagagli Valigie negli armadietti grandi | deposito | dove: Universal Studios Japan lockers | zona: usj
  breve: fuori dai cancelli · sono pochi: arrivate presto
  alternativa: se gli armadietti XL (¥1.500, davanti ai controlli di sicurezza) sono finiti, nella CityWalk (la via dei negozi davanti al parco) ci sono due depositi con persona: Keepen Azukaru Tokorona (8:00–22:30, ¥1.500 a valigia grande) e The Backstage Dressing Room (9:00–22:00, ¥1.000). Gli armadietti del parco si svuotano entro 2 h dalla chiusura.
- 08:00 fare Super Nintendo World | posto: usj | prenotare
  breve: il mondo di Mario dentro Universal Studios
  Mario Kart, Yoshi, Donkey Kong Country (montagne russe nella miniera).
  attenzione: serve l'Area Timed Entry (il biglietto a orario per l'area Nintendo) o l'Express Pass che la include
  prenotazione: biglietti USJ + Express Pass per 2
- 11:00 fare Altre attrazioni di Universal Studios | posto: usj
- 12:00 cibo Pranzo nel parco | posto: usj
  breve: prima delle 11:30 o dopo le 13:30
  Kinopio's Cafe (il locale di Toad dentro Super Nintendo World) si prenota dall'app di USJ il giorno stesso, se ci sono posti; altrimenti Mel's Drive-In (hamburger).
  attenzione: nel parco non si entra con cibo da fuori: colazione abbondante prima
- 14:00 fare Harry Potter, Jurassic Park, Minion | posto: usj
- 16:00 fare Hollywood Dream, poi uscita | posto: usj
  breve: montagne russe · uscita entro le 18:10
- 18:10 bagagli Ritiro valigie dagli armadietti | ritiro | dove: Universal Studios Japan lockers | zona: usj
  breve: poi treno per Shin-Osaka
- 18:20 sposta Shin-Osaka | via mezzi: Universal City Station, Osaka > Shin-Osaka Station (Universal Studios → Shin-Osaka)
  breve: treno ~30′ con 2 cambi
  come: treno JR da Universal City, cambi a Nishikujō e Osaka
  Per la cena: ekiben (cestino da treno) o butaman (panini al vapore col maiale) di 551 Hōrai, dentro i tornelli dello Shinkansen (fino alle 21).
- 20:00 viaggio Shinkansen (treno superveloce) Osaka → Tokyo | foto: Tōkaidō Shinkansen | treno: shink-16 | prenotato | dove: Shin-Osaka Station
  breve: 20:00 → 22:24 · Nozomi 280
  attenzione: la reception del Super Hotel chiude alle 24:00 e chi non è arrivato perde la prenotazione. Il Nozomi delle 21:24 arriva a Tokyo verso le 23:45: troppo tirato. Se perdete il treno delle 20:00, prendete il primo dopo, entro le 21 circa.
- 22:30 sposta Super Hotel Hamamatsuchō | città: tokyo | via mezzi: Tokyo Station > @super-hotel (Tokyo Station → Super Hotel)
  breve: treno 6′ + a piedi 4′
  come: treno JR (linea Yamanote o Keihin-Tōhoku) fino a Hamamatsuchō
- 22:50 hotel Check-in al Super Hotel | alloggio: super-hotel
  breve: entro le 24:00 · valigie in camera
  attenzione: alle 24:00 la reception chiude: chi non è arrivato perde la prenotazione e non si può fare il check-in dopo (email dell'hotel). Se siete in ritardo, telefonate prima delle 24.

#### Guida
senso: Universal Studios Japan con Super Nintendo World (il mondo di Mario), poi Shinkansen per Tokyo la sera.
mangiare:
  • Pranzo nel parco prima delle 11:30 o dopo le 13:30: Kinopio's Cafe in Super Nintendo World (dall'app USJ) o Mel's Drive-In
  • Cena: ekiben (cestino da treno) o butaman (panini al vapore col maiale) di 551 Hōrai, dentro i tornelli dello Shinkansen a Shin-Osaka (fino alle 21)
prenotare:
  • Biglietti USJ + Area Timed Entry (orario d'ingresso all'area Nintendo) o Express Pass, per 2
  • Shinkansen già pagato
attenzione:
  • Senza Area Timed Entry nell'area Nintendo non si entra
  • Armadietti grandi limitati: arrivate all'apertura
  • Uscita entro le 18:10
  • Orari del parco del 16/11 sul sito USJ
stanchi: • Solo Super Nintendo World + 2 attrazioni con l'Express Pass
camminata: ~11 km nel parco + code in piedi · treni ~3 h · pausa: pranzo 45′

### 2026-11-17
percorso: tokyo
dorme: super-hotel
con: voi due
- 08:30 sposta Tsukiji | via piedi: @super-hotel > #tsukiji (Hotel → Tsukiji a piedi) | via mezzi: @super-hotel > #tsukiji (Hotel → Tsukiji in metro)
  breve: a piedi 30′ o metro 5′
  come: a piedi 2,5 km, oppure metro Ōedo da Daimon a Tsukijishijō
- 09:00 cibo Mercato esterno di Tsukiji | posto: tsukiji
  breve: colazione: tonno, frittata dolce, ciotole di pesce crudo · contanti
  L'ex mercato del pesce. Tamagoyaki: frittata dolce arrotolata.
  Dove: Maguroya Kurogin (tonno, dalle 7:30), Yamachō (tamagoyaki su stecco ~¥200), Marukita (kaisendon, ciotola di riso col pesce crudo, ~¥2.500). I banchi di sushi seduti aprono verso le 10:30: la cena di sushi è stasera.
- 10:15 sposta Ginza | via piedi: #tsukiji > Ginza, Tokyo (Tsukiji → Ginza)
  breve: a piedi 12′
- 10:30 vedere Ginza | foto: Ginza | dove: Ginza, Tokyo | zona: ginza
  breve: vetrine e grandi magazzini
  Il quartiere elegante dei grandi magazzini.
  alternativa: [[kabuki-za]], un solo atto di teatro kabuki (~1 h, sottotitoli in inglese)
- 11:45 cibo Depachika (food hall) di Ginza Mitsukoshi | posto: depachika-ginza
  breve: pranzo nella food hall · senza perdere tempo
  Depachika: i piani interrati dei grandi magazzini, enormi food hall di piatti pronti.
- 12:55 sposta Samurai Restaurant | via mezzi: #depachika-ginza > #samurai-restaurant (Ginza → Samurai Restaurant)
  breve: metro 17′ + a piedi 8′
  come: metro linea Marunouchi da Ginza a Shinjuku-sanchōme, poi a piedi verso Kabukichō
- 13:30 fare Samurai Restaurant Time | posto: samurai-restaurant | prenotare
  breve: show di samurai e ninja · ingresso 13:30, show 14:00–15:40
  Show kitsch con tamburi taiko, samurai, ninja e carri al neon a Kabukichō (il quartiere dei locali notturni), nei locali dell'ex Robot Restaurant. Compresi un pasto o 2 drink.
  costo: ~¥10.000 a testa (prezzo pieno sul sito ufficiale; online ci sono sconti)
  prenotazione: spettacolo delle 14:00 per 2, ingresso dalle 13:30 · portate un documento
  attenzione: lo spettacolo serale delle 19 non c'è più: gli spettacoli sono alle 10:50, 14:00 e 16:30
- 15:40 sposta Shibuya Sky | via mezzi: #samurai-restaurant > #shibuya-sky (Kabukichō → Shibuya Sky)
  breve: treno 7′ + a piedi ~15′
  come: a piedi alla stazione JR di Shinjuku (8′), treno JR Yamanote (la linea circolare di Tokyo) fino a Shibuya (7′), Shibuya Scramble Square è sopra la stazione
- 16:00 vedere Shibuya Sky (terrazza panoramica) | posto: shibuya-sky | prenotare
  breve: sul tetto di un grattacielo · tramonto alle 16:31
  Si arriva con la luce del giorno, si vede il tramonto e Tokyo che si accende.
  prenotazione: biglietti dal 2/11 alle 16:00 italiane, ingresso 16:00, per 2
- 17:20 fare Shibuya PARCO | posto: shibuya-parco
  breve: 6° piano: Nintendo, Pokémon, Capcom, Jump
  A 5′ a piedi da Shibuya Sky.
- 17:50 sposta Harajuku | via piedi: #shibuya-parco > #takeshita-dori (Shibuya → Harajuku a piedi)
  breve: a piedi 20′ lungo Cat Street
  [[cat-street]]: via pedonale di negozi streetwear tra Shibuya e Harajuku.
- 18:10 vedere Harajuku (quartiere della moda giovane) | posto: takeshita-dori
  breve: via Takeshita illuminata · 30′
  Takeshita-dōri: moda kawaii, crêpe e purikura (cabine per foto-adesivi). Il santuario Meiji chiude al tramonto: a quest'ora non si visita.
- 18:40 sposta Sushi Tokyo Ten, Shibuya | via mezzi: Harajuku Station, Tokyo > #sushi-ten (Harajuku → Shibuya Stream)
  breve: treno 3′ + a piedi 8′
  come: treno JR Yamanote da Harajuku a Shibuya (1 fermata), uscita sud verso Shibuya Stream (il grattacielo sul fiume), 3° piano
- 19:00 cibo Sushi Tokyo Ten (sushi omakase) | posto: sushi-ten | prenotare
  breve: cena speciale: sushi scelto dal cuoco · prenotare alle 19:00
  Omakase: «lascio fare a te», il cuoco serve al bancone un pezzo alla volta, ~90′. Tabelog 3,56.
  costo: omakase ¥9.900 a testa (~€54) · con aragosta ¥13.200 · solo carta, niente contanti
  prenotazione: ore 19:00 per 2 su TableCheck, serve la carta di credito
  attenzione: arrivate puntuali (in ritardo e senza avvisare il posto va ad altri); chi disdice il giorno stesso paga tutto
  alternativa: Uogashi Nihon-Ichi Dōgenzaka (sushi in piedi, set da ¥1.200, fino alle 23)
- 20:35 sposta Omoide Yokochō | via mezzi: Shibuya Station, Tokyo > #omoide-yokocho (Shibuya → Omoide Yokochō)
  breve: treno 7′ + a piedi 5′
  come: treno JR Yamanote da Shibuya a Shinjuku, uscita ovest
- 20:50 fare Omoide Yokochō (vicolo degli spiedini) | posto: omoide-yokocho
  breve: un giro e una birra tra i chioschi
  Vicolo di chioschi fumosi con spiedini alla brace: dopo il sushi bastano una birra e uno spiedino.
- 21:30 fare Golden Gai (vicoli di micro-bar) | posto: golden-gai | via piedi: #omoide-yokocho > #golden-gai (Omoide Yokochō → Golden Gai)
  breve: micro-bar per l'ultimo giro
  6 vicoli con oltre 200 bar da 5–10 posti, a 10′ a piedi da Omoide Yokochō. Passate dalla [[godzilla]].
  costo: molti bar chiedono un coperto (¥500–1.000)
  alternativa: karaoke (Big Echo, Karaoke-kan)
- 23:30 sposta Hotel | via mezzi: #golden-gai > @super-hotel (Golden Gai → hotel)
  breve: treno 26′ + a piedi 4′ · ultimo treno ~0:30
  come: treno JR Yamanote da Shinjuku a Hamamatsuchō

#### Guida
senso: Ultimo giorno pieno a Tokyo: mercato del pesce, Ginza, show dei samurai nel primo pomeriggio, terrazza panoramica di Shibuya al tramonto, Harajuku illuminata, cena di sushi e bar minuscoli a Shinjuku.
mangiare:
  • Colazione: mercato di Tsukiji (tonno, frittata dolce, ciotole di pesce crudo; contanti)
  • Pranzo: depachika di Ginza (food hall nei sotterranei dei grandi magazzini)
  • Nello show sono compresi un pasto o 2 drink
  • Cena speciale: sushi omakase (scelto dal cuoco) da Sushi Tokyo Ten a Shibuya, ¥9.900 (~€54), alle 19:00; dopo, una birra a Omoide Yokochō (vicolo degli spiedini)
prenotare:
  • Shibuya Sky: biglietti il 2/11 alle 16:00 italiane, ingresso 16:00, per 2
  • Samurai Restaurant Time, spettacolo delle 14:00 per 2 (biglietti da 4 settimane prima)
  • Sushi Tokyo Ten ore 19:00 per 2 (TableCheck, con carta)
attenzione:
  • Tsukiji chiude mercoledì e domenica (martedì è aperto)
  • Golden Gai: molti bar chiedono un coperto (¥500–1.000)
  • Ultimo treno verso l'hotel ~0:30
anticipo:
  • Kabuki-za: un solo atto di teatro kabuki (~1 h, sottotitoli in inglese)
  • Karaoke dopo Golden Gai (Big Echo, Karaoke-kan)
stanchi: • Saltate Harajuku: da PARCO restate a Shibuya fino alla cena
camminata: ~13 km con la metro per Tsukiji (~15 km tutto a piedi) · mezzi ~1 h · pause: pranzo 50′, show 2 h seduti, cena 1 h 30, bar 1 h

### 2026-11-18
percorso: tokyo > roma
dorme: volo
con: voi due
- 07:20 sposta Zōjō-ji | via piedi: @super-hotel > #zojo-ji (Hotel → Zōjō-ji)
  breve: a piedi 8′
- 07:30 vedere Zōjō-ji (tempio) e Tokyo Tower | posto: zojo-ji
  breve: la foto classica, gratis
- 08:15 cibo Colazione in hotel | alloggio: super-hotel
  breve: e ultimi acquisti
- 09:30 hotel Check-out dal Super Hotel | alloggio: super-hotel
  breve: entro le 10
- 09:45 sposta Aeroporto di Haneda | via mezzi: @super-hotel > Haneda Airport Terminal 3 (Hotel → aeroporto Haneda)
  breve: monorotaia ~15′ · ~¥500
  come: Tokyo Monorail da Hamamatsuchō al Terminal 3
- 10:15 viaggio Rimborso tax-free e check-in | dove: Haneda Airport Terminal 3
  breve: check-in ITA entro le 12:20
  attenzione: il rimborso tax-free (l'IVA sugli acquisti) si fa al terminale apposito PRIMA di imbarcare le valigie
- 13:20 viaggio Volo AZ793 Tokyo → Roma | foto: ITA Airways | prenotato
  breve: 13:20 → 20:25 (ora italiana)
- 20:25 viaggio Arrivo a Fiumicino | fuso: roma | dove: Aeroporto di Roma Fiumicino
  breve: bentornati

#### Guida
senso: Ultima foto al tempio con la Tokyo Tower dietro, poi aeroporto: volo alle 13:20.
mangiare:
  • Colazione in hotel
  • Pranzo in aeroporto dopo i controlli
prenotare: • Passaporto e scontrini tax-free
attenzione:
  • Rimborso tax-free al terminale apposito PRIMA di imbarcare le valigie
  • Il check-in ITA chiude alle 12:20
stanchi: • Saltate Zōjō-ji e dormite
camminata: ~3 km · monorotaia 15′

## Alloggi

Prezzi: totale della camera per 2 persone, nella valuta in cui è stata prenotata. `pagato`: sì / no / gruppo
(per gli alloggi del gruppo `saldato: sì` quando la quota è pagata). Il totale vero addebitato è in Info (`alloggi a testa`).

### airbnb-shinjuku
nome: Airbnb Shinjuku (Ōkubo)
città: tokyo
dal: 2026-11-06
al: 2026-11-07
prezzo: €80,56
euro: 80.56
pagato: sì
pagato da: Federico
diviso: sì
pagamento: pagato
cancellazione: gratuita fino al 23/10 alle 15:00
indirizzo: Ōkubo 2-13-5, Shinjuku-ku, Tokyo 169-0072
arrivo: Stazione Higashi-Shinjuku (metro Ōedo) a piedi 5′ · JR Shinjuku a piedi 20′
orari: Check-in dalle 15:00 con cassetta delle chiavi (istruzioni nell'app dal 4/11) · check-out entro le 10:00
camera: Monolocale per 2 ospiti
nota: La conferma Airbnb dice «deposito bagagli disponibile»: confermato dall'host il 14/10: deposito self-service, valigie a qualsiasi ora. Le istruzioni arrivano se gli scrivete un promemoria qualche giorno prima del check-in. Il telefono dell'host e il codice di conferma sono nell'app (solo sul telefono).
app: https://www.airbnb.it/trips
maps: 2-13-5 Okubo, Shinjuku City, Tokyo

### nagomi
nome: Nagomi (casa giapponese ristrutturata, col gruppo)
città: kawaguchiko
dal: 2026-11-07
al: 2026-11-09
prezzo: €115,50 a testa
euro: 115.5
pagato: gruppo
diviso: no
pagamento: quota a testa, pagata
saldato: sì
indirizzo: Kawaguchi 1575-4, Fujikawaguchiko (Yamanashi), sponda nord del lago, 600 m dal santuario Kawaguchi Asama
arrivo: Taxi dalla stazione di Kawaguchiko ~10′ (4,6 km) · bus fino alla fermata Kawaguchi-kyoku-mae (10–15′) + 5′ a piedi
orari: Check-in dalle 16:00 (va comunicata prima l'ora d'arrivo) · check-out entro le 10:00 · silenzio dalle 21 alle 8
camera: Casa intera per il gruppo: 4 camere, 2 bagni, cucina, vista sul Fuji dal piano di sopra
nota: 5 bici gratis, stufa a pellet (da novembre), proiettore con Netflix, lavatrice con asciugatrice. Barbecue vietato in giardino (c'è una griglia interna). Strada d'accesso stretta. Eventuali danni fino a ¥15.000.
maps: Kawaguchi 1575-4, Fujikawaguchiko, Yamanashi

### saibo
nome: Hotel Nihonbashi Saibo
città: tokyo
dal: 2026-11-09
al: 2026-11-10
prezzo: ¥16.835
yen: 16835
pagato: sì
pagato da: Federico
diviso: sì
pagamento: pagato
cancellazione: gratuita fino al 7/11 alle 23:59, poi nessun rimborso
indirizzo: Nihonbashi Ningyōchō 3-3-16, Chūō-ku, Tokyo
arrivo: Ningyōchō (metro Hibiya / Toei Asakusa) a piedi 2′ · Hamachō (metro Toei Shinjuku) a piedi 6′
telefono: +81 3 3668 2323
camera: Matrimoniale standard, 1 letto alla francese (131–150 cm), non fumatori
orari: Check-in 15:00–24:00 · check-out entro le 10:00 · reception aperta 24 ore su 24 · deposito bagagli
nota: Colazione non inclusa (¥1.500 a testa). Tassa di soggiorno da pagare in hotel. Risposta del 14/10: preso nota dell'arrivo del 9/11 (tra le 16:30 e le 17:30); reception aperta 24 ore su 24, quindi il check-out alle 6:30 del 10/11 va bene; tengono le due valigie fino al ritiro della sera.
app: https://secure.booking.com/mytrips.html
maps: Hotel Nihonbashi Saibo, Ningyocho, Tokyo

### apa-kyoto
nome: APA Hotel Kyoto Eki Horikawadori
città: kyoto
dal: 2026-11-10
al: 2026-11-13
prezzo: ¥54.570
yen: 54570
pagato: sì
pagato da: Federico
diviso: sì
pagamento: pagato
cancellazione: gratuita fino all'8/11 alle 23:59, poi rimborso di €207,43 (si perde la prima notte)
indirizzo: Aburanokōji, Shiokōji-dōri, Shimogyō-ku, Kyoto
arrivo: Stazione di Kyoto, uscita Central, a piedi 7′ · metro Karasuma uscita C7 a piedi 5′
telefono: +81 75 341 6111
camera: Doppia, 1 letto alla francese (131–150 cm), non fumatori
orari: Check-in dalle 15:00 · check-out entro le 10:00 · deposito bagagli
nota: Colazione non inclusa (¥1.800 a testa, 6:30–10:00, ultimo ordine 9:30). Bagno pubblico interno 6–10 e 15–1 (con tatuaggi visibili può essere vietato). Messaggio del 14/10 (arrivo tra le 22:15 e le 23 del 10/11, check-out tra le 7:30 e le 8:15 del 13/11): l'hotel ha confermato che tiene la prenotazione.
app: https://secure.booking.com/mytrips.html
maps: APA Hotel Kyoto Eki Horikawadori

### alpina
nome: Spa Hotel Alpina Hida Takayama
città: takayama
dal: 2026-11-13
al: 2026-11-15
prezzo: ¥55.566
yen: 55566
pagato: sì
pagato da: Federico
diviso: sì
pagamento: pagato · tassa di soggiorno da pagare in hotel
cancellazione: gratuita fino al 10/11 alle 23:59, poi rimborso di €164,42 (si perde la prima notte)
indirizzo: Nadamachi 5-41, Takayama (Gifu)
arrivo: Stazione di Takayama a piedi 3′ · bus Nōhi accanto alla stazione
telefono: +81 577 33 0033
camera: Matrimoniale standard, 1 letto alla francese (131–150 cm), non fumatori
orari: Check-in 15:00–23:00 · check-out 5:00–10:00 · onsen sul tetto fino all'1:00
nota: Colazione inclusa. Con tatuaggi visibili l'onsen può essere vietato. Messaggio del 14/10: valigie tra le 12 e le 13 del 13/11, check-in tra le 17 e le 18:30, check-out tra le 7:15 e le 7:45 del 15/11, chiesto l'orario della colazione; attesa risposta.
app: https://secure.booking.com/mytrips.html
maps: Spa Hotel Alpina Hida Takayama

### hillarys
nome: Hotel Hillarys Shinsaibashi
città: osaka
dal: 2026-11-15
al: 2026-11-16
prezzo: ¥11.857
yen: 11857
pagato: sì
pagato da: Federico
diviso: sì
pagamento: pagato
cancellazione: gratuita fino all'11/11 alle 23:59, poi nessun rimborso
indirizzo: Higashi-Shinsaibashi 1-17-11, Chūō-ku, Osaka
arrivo: Shinsaibashi (metro Midōsuji) a piedi 4′ · Nagahoribashi a piedi 7′
telefono: +81 6 6281 8000
camera: Matrimoniale standard, 1 letto alla francese (131–150 cm), non fumatori
orari: Check-in dalle 15:00 · check-out entro le 10:00 · deposito bagagli
nota: Colazione inclusa. Tassa di soggiorno da pagare in hotel. Wi-Fi solo nelle aree comuni. Risposte del 14/10: deposito valigie gratis prima del check-in; check-in anticipato possibile dalle 12:00 a ¥1.000, chiesto: faranno il possibile, non garantito. Colazione dalle 6:45, anche da asporto (chiederlo al personale della colazione).
app: https://secure.booking.com/mytrips.html
maps: Hotel Hillarys Shinsaibashi, Osaka

### super-hotel
nome: Super Hotel Tokyo Hamamatsuchō
città: tokyo
dal: 2026-11-16
al: 2026-11-18
prezzo: ¥48.741
yen: 48741
pagato: sì
pagato da: Federico
diviso: sì
pagamento: pagato il 28/7
cancellazione: gratuita fino al 14/11 alle 23:59, poi nessun rimborso
indirizzo: Hamamatsuchō 2-2-1, Minato-ku, Tokyo
arrivo: JR Hamamatsuchō a piedi 4′ · Daimon (metro Ōedo / Toei Asakusa) a piedi 2′ · monorotaia per Haneda
telefono: +81 3 6361 9000
camera: Assegnata all'arrivo, 1 letto alla francese (131–150 cm)
orari: Check-in 15:00–24:00, poi la reception chiude: chi non arriva entro le 24 perde la prenotazione · check-out entro le 10:00 · deposito valigie il giorno d'arrivo dalle 7:00 e dopo il check-out dalle 7:00 alle 24:00
nota: Colazione inclusa. Sulla fattura dell'hotel comparirà ¥51.062 (lo sconto Booking non viene mostrato). Tassa di soggiorno a parte. Email automatica dell'hotel: niente check-in dopo le 24:00 (la prenotazione si cancella da sola), cancellazione a pagamento dal giorno prima. Il messaggio del 14/10 (arrivo tra le 22:30 e le 23:30) è in regola.
app: https://secure.booking.com/mytrips.html
maps: Super Hotel Tokyo Hamamatsucho

## Treni

Prezzi: totale per 2 persone. `stato`: pagato / da comprare / sul posto. `conferma`: giorno in cui Klook emette i biglietti.
`emesso`: giorno in cui è arrivato il biglietto (spunta il controllo Klook). `posti` e `binari`: dal biglietto, l'app li mostra sulla tappa.

### fuji-7
data: 2026-11-07
tratta: Shinjuku → Kawaguchiko
mezzo: Fuji Excursion 11 (treno espresso diretto, solo posti prenotati)
orario: 9:30 → 11:28
posti: carrozza 1, posti 5A e 5B
binari: parte dal 10 a Shinjuku
prezzo: €53,67
euro: 53.67
stato: pagato
pagato da: Federico
conferma: 2026-10-07
emesso: 2026-10-15
link: https://s.klook.com/c/V3Mr8Oq2y0
nota: Passa da Shimoyoshida (stazione della pagoda Chureito) alle 11:14.

### fuji-9
data: 2026-11-09
tratta: Fujisan (Monte Fuji) → Shinjuku
mezzo: Fuji Excursion 32 (treno espresso diretto, solo posti prenotati)
orario: 14:16 → 16:08
posti: carrozza 2, posti 8C e 8D
binari: arriva al 7 a Shinjuku
prezzo: €51,68
euro: 51.68
stato: pagato
pagato da: Federico
emesso: 2026-10-15
nota: Si sale alla stazione Fujisan, due fermate dopo Kawaguchiko (in mezzo Fujikyu Highland): da Kawaguchiko treno locale Fujikyu (~10′).

### kamakura-10
data: 2026-11-10
tratta: Tokyo → Fujisawa → Kamakura
mezzo: Treno JR Tōkaidō + Enoden (trenino sul mare)
orario: ~1 h 15
prezzo: ¥990 + biglietto giornaliero Enoden ¥800 a testa
stato: sul posto
nota: Si paga con la Suica; il biglietto giornaliero Enoden si compra alla stazione di Fujisawa.

### shink-10
data: 2026-11-10
tratta: Tokyo → Kyoto
mezzo: Shinkansen Nozomi 287 (treno superveloce)
orario: 20:09 → 22:21
posti: carrozza 12, posti 3A e 3B
binari: parte dal 16 a Tokyo, arriva al 13 a Kyoto
prezzo: €175,76
euro: 175.76
stato: pagato
pagato da: Federico
conferma: 2026-10-10
emesso: 2026-10-15
link: https://s.klook.com/c/D1Zn6JaV1o
nota: Bagagli piccoli (trolley e zaino): vanno nella cappelliera, non serve il posto con spazio bagagli.

### hida-13
data: 2026-11-13
tratta: Kyoto → Takayama
mezzo: Treno espresso Hida 25, diretto
orario: 8:31 → 12:14
posti: carrozza 2, posti 2A e 2B
binari: parte dallo 0 a Kyoto
prezzo: €102,09
euro: 102.09
stato: pagato
pagato da: Federico
conferma: 2026-10-13
emesso: 2026-10-15
link: https://s.klook.com/c/g3BJGnMMw8
nota: Zero cambi con le valigie; panorama sulle gole del fiume Hida.

### bus-14
data: 2026-11-14
tratta: Takayama → Ainokura → Shirakawa-go → Takayama
mezzo: Gita in bus Nōhi «Shirakawa-go & Gokayama Ainokura» (senza pasto, con assistente)
orario: 8:30 → 15:50, partenza e arrivo al Takayama Nohi Bus Center
prezzo: ¥18.000 per 2 (¥9.000 a testa, ~€49)
stato: pagato
pagato da: Federico
conferma: 2026-10-15
emesso: 2026-10-15
link: https://japanbusonline.com/en/CourseDetail/index/12102010001
nota: Comprata su Japan Bus Online il 15/10 (le corse Nōhi con prenotazione erano esaurite). Biglietto elettronico nell'email: da cambiare al bancone del Nohi Bus Center almeno 10′ prima; meglio stamparlo. Cancellazione ¥100 a testa fino alla partenza.

### hida-15
data: 2026-11-15
tratta: Takayama → Nagoya
mezzo: Treno espresso Hida 4
orario: 8:00 → 10:34
posti: carrozza 2, posti 5A e 5B
binari: arriva al 4 a Nagoya
prezzo: €163,98 insieme allo Shinkansen per Shin-Osaka
euro: 163.98
stato: pagato
pagato da: Federico
conferma: 2026-10-15
emesso: 2026-10-15
link: https://s.klook.com/c/Z3Or7m_o3k
nota: Un solo biglietto Klook fino a Shin-Osaka, con cambio di 24′ a Nagoya.

### shink-15
data: 2026-11-15
tratta: Nagoya → Shin-Osaka
mezzo: Shinkansen Nozomi 247 (treno superveloce)
orario: 10:58 → 11:48
posti: carrozza 12, posti 3A e 3B
binari: parte dal 17 a Nagoya, arriva al 22 a Shin-Osaka
prezzo: compreso nel biglietto del treno Hida
stato: pagato
pagato da: Federico
conferma: 2026-10-15
emesso: 2026-10-15
link: https://s.klook.com/c/Z3Or7m_o3k

### shink-16
data: 2026-11-16
tratta: Shin-Osaka → Tokyo
mezzo: Shinkansen Nozomi 280 (treno superveloce)
orario: 20:00 → 22:24
prezzo: €182,50
euro: 182.50
stato: pagato
pagato da: Federico
conferma: 2026-10-16
link: https://s.klook.com/c/vw7g65Km1W
nota: Il Super Hotel accetta check-in solo fino alle 24:00: col Nozomi delle 21:24 (arrivo verso le 23:45) non si fa in tempo. Se si perde quello delle 20:00, prendere il primo dopo, entro le 21 circa.

## Voli

### az792
data: 2026-11-05
tratta: Roma Fiumicino → Tokyo Haneda
mezzo: ITA Airways AZ792, diretto
orario: 15:05 → 11:20 del 6/11 (ora di Tokyo)
stato: prenotato
nota: Ricevuta nella cartella del viaggio sul PC.

### az793
data: 2026-11-18
tratta: Tokyo Haneda → Roma Fiumicino
mezzo: ITA Airways AZ793, diretto
orario: 13:20 → 20:25 (ora italiana)
stato: prenotato
nota: Check-in in aeroporto entro le 12:20.

## Da fare

Campi: `tappa` (AAAA-MM-GG HH:MM della tappa a cui si riferisce, anche più di una separate da virgola: l'app mette lì la notifica), `cosa`, `tipo`
(prenotare / gestire), `giorno`, `apre` e `entro` (date), `quando` (testo), `costo`, `link`, `priorità` (alta / media / bassa), `nota`,
`fatto` (data in cui è stata fatta: resta come storico e l'app la mostra già spuntata su tutti i telefoni).
Senza `tappa` la cosa finisce sulla prima tappa del primo giorno (la partenza). I controlli dei biglietti Klook
li genera build.py dai treni con `conferma`.

### usj
tappa: 2026-11-16 08:00
cosa: Universal Studios Japan + Express Pass, per 2
tipo: prenotare
giorno: 2026-11-16
quando: subito: gli Express Pass finiscono
costo: ~€130–195 a testa
link: Biglietti (negozio ufficiale USJ) = https://store.usj.co.jp/en/us/c/ticket ; Express Pass (negozio ufficiale) = https://store.usj.co.jp/en/us/c/expresspass ; Cos'è l'Express Pass = https://www.usj.co.jp/web/en/us/tickets/express-pass
priorità: alta
nota: Dal 2025 il biglietto d'ingresso (Studio Pass) si compra solo online, non più alla cassa. Serve l'Area Timed Entry o un Express Pass che include Super Nintendo World, altrimenti nell'area Nintendo non si entra. Orari del 16/11 sul sito ufficiale.

### bus-nohi
tappa: 2026-11-14 08:30, 2026-11-14 15:00
cosa: Bus Nōhi Takayama ⇄ Shirakawa-go 14/11, per 2
tipo: prenotare
giorno: 2026-11-14
apre: 2026-10-14
quando: dal 14/10
costo: ¥2.800 a tratta a testa
link: Prenota su Japan Bus Online = https://japanbusonline.com/CourseSearch/11900040002?afcd=MDI= ; Sito ufficiale Nōhi Bus = https://www.nouhibus.co.jp/english/
priorità: alta
nota: Corse con prenotazione esaurite il 15/10: presa al loro posto la gita Nōhi Ainokura + Shirakawa-go (8:30 → 15:50), ¥9.000 a testa.
fatto: 2026-10-15

### shibuya-sky
tappa: 2026-11-17 16:00
cosa: Shibuya Sky 17/11, ingresso 16:00, per 2
tipo: prenotare
giorno: 2026-11-17
apre: 2026-11-02
quando: 2/11 alle 16:00 italiane
costo: ~¥2.500 a testa
link: Biglietti (sito ufficiale Shibuya Sky) = https://www.shibuya-scramble-square.com/sky/ticket/
priorità: alta
nota: In vendita 2 settimane prima alle 00:00 giapponesi: gli slot del tramonto finiscono subito.

### kitchen-hida
tappa: 2026-11-13 18:00
cosa: Steak House Kitchen Hida 13/11 ore 18:00, per 2
tipo: prenotare
giorno: 2026-11-13
quando: subito
costo: ~¥10.000 a testa
link: Prenota online (Savor Japan) = https://savorjapan.com/0001035098 ; Chiama il ristorante = tel:+81577362911
priorità: media
nota: Prenotazione online su Savor Japan (portale di prenotazione in inglese) o per telefono allo 0577-36-2911. Ultimo ordine 19:45, chiuso il mercoledì.

### kyoya
tappa: 2026-11-14 18:00
cosa: Kyōya 14/11 ore 18:00, per 2
tipo: prenotare
giorno: 2026-11-14
quando: subito, per telefono o tramite l'hotel
link: Chiama il ristorante = tel:+81577347660 ; Scheda su Tabelog = https://tabelog.com/gifu/A2104/A210401/21000305/
priorità: media
nota: Telefono 0577-34-7660: non ha un sito, si prenota per telefono o chiedendo alla reception dell'Alpina. Aperto 17:00–20:00, chiuso il martedì.

### tour-geisha
tappa: 2026-11-11 17:00
cosa: Tour di Gion con guida «Storie di geisha» 11/11 ore 17:00, per 2
tipo: prenotare
giorno: 2026-11-11
quando: quando volete: cancellazione gratuita fino a 24 h prima
costo: ~$30 a testa (~€26)
link: Prenota su GetYourGuide = https://www.getyourguide.com/kyoto-l96826/kyoto-night-walking-tour-gion-stories-of-geisha-t563565/ ; Lo stesso tour su Viator = https://www.viator.com/en-AU/tours/Kyoto/Kyoto-Gion-Night-Walking-Tour-Stories-of-Geisha/d332-175777P12 ; Recensioni (Tripadvisor) = https://www.tripadvisor.com/AttractionProductReview-g298564-d26638683-Kyoto_Gion_Geisha_District_Walking_Tour_The_Stories_of_Geisha-Kyoto_Kyoto_Prefectu.html ; Alternativa gratis + mancia (Civitatis) = https://www.civitatis.com/it/kyoto/free-tour-quartiere-gion/
priorità: media
nota: Sostituisce Gion Corner. Tour di 2 h in inglese, ritrovo da Ben's Cookies Kyoto Shijo (la guida ha un cartello), fine al santuario Yasaka. Scegliete il turno delle 17:00: se non c'è, va bene anche uno più tardi spostando la cena. Tripadvisor 4,9 su 1.354, Viator 4,9 su 2.177. In alternativa il free tour di Gion di Civitatis (9,2 su 2.084 opinioni, ritrovo al teatro Minamiza): gratis con mancia, orario da vedere sul sito.

### samurai-museum
tappa: 2026-11-12 17:35
cosa: Samurai & Ninja Museum 12/11, ingresso 17:30–17:45, per 2
tipo: prenotare
giorno: 2026-11-12
quando: qualche giorno prima (online costa un po' meno)
costo: ~¥3.300 a testa (~€18)
link: Sito ufficiale = https://mai-ko.com/samurai/ ; Su GetYourGuide = https://www.getyourguide.com/kyoto-l96826/kyoto-samurai-ninja-museum-guided-tour-t1079387/ ; Recensioni (Tripadvisor) = https://www.tripadvisor.com/Attraction_Review-g298564-d13551788-Reviews-Samurai_Ninja_Museum_With_Experience-Kyoto_Kyoto_Prefecture_Kinki.html
priorità: bassa
nota: Biglietto base: visita guidata di 30′ in inglese, prova dell'armatura, posa con la katana e lancio degli shuriken. L'orario di chiusura cambia tra le fonti (18:30–19:30): prima di prenotare controllate che l'ingresso delle 17:30 ci sia.

### samurai
tappa: 2026-11-17 13:30
cosa: Samurai Restaurant Time 17/11, spettacolo delle 14 (ingresso ore 13:30), per 2
tipo: prenotare
giorno: 2026-11-17
apre: 2026-10-20
entro: 2026-11-03
quando: dal 20/10 (4 settimane prima), entro inizio novembre
costo: ~¥10.000 a testa con pasto o 2 drink
link: Sito ufficiale = https://samurai-restaurant.tokyo/ ; Con cancellazione gratuita (GetYourGuide) = https://www.getyourguide.com/samurai-restaurant-tokyo-l221944/
priorità: media
nota: Spettacolo 14:00–15:40, si entra dalle 13:30. Spettacoli solo alle 10:50, 14:00 e 16:30 (quello delle 19 non c'è più). In vendita fino a 4 settimane prima; sul sito ufficiale niente rimborsi, sulle piattaforme (es. GetYourGuide) spesso cancellazione gratuita fino a 24 h prima.

### controlli
cosa: Controlli di inizio novembre
tipo: gestire
entro: 2026-11-01
quando: ~1/11
priorità: media
nota: Linea di Takayama (traininfo.jr-central.co.jp) · orari USJ del 16/11 · meteo e foliage.

### ritiro-fuji
tappa: 2026-11-07 09:30
cosa: Ritirare i biglietti di carta dei due Fuji Excursion (7/11 e 9/11) a Shinjuku
tipo: gestire
giorno: 2026-11-07
quando: 7/11 prima del treno delle 9:30
priorità: alta
nota: Macchinette JR della stazione di Shinjuku (o di un'altra stazione JR di Tokyo): si scansiona il QR del biglietto. Senza biglietto di carta non si sale. Quelli del 9/11 vanno ritirati subito, perché le stazioni della zona del Fuji (Kawaguchiko, Fujisan) non sono JR. Guida passo passo sul drive condiviso del gruppo.

### documenti
cosa: e-SIM, Suica e app utili (per tutti e due)
tipo: gestire
entro: 2026-11-04
quando: prima della partenza
priorità: media
nota: Visit Japan Web (il modulo online per l'ingresso in Giappone) e assicurazione Heymondo già fatti: tenete i QR di Visit Japan Web salvati sul telefono. App consigliate dal gruppo: Suica (tessera per metro e treni, già nel Wallet), Tabelog (recensioni dei ristoranti), Kuli Kuli (traduce menù e cartelli), Flush (bagni pubblici vicini), Payke (legge gli ingredienti di cibi e cosmetici), Bounce (depositi bagagli), Japan Travel di Navitime (percorsi coi mezzi, di riserva).

### contanti
cosa: Contanti in yen
tipo: gestire
entro: 2026-11-04
quando: prima della partenza
priorità: media
nota: Solo contanti in molti posti: Hoto Fudo, Monkey Park, Tsukiji, Golden Gai, banchi di street food.

### istruzioni-airbnb
tappa: 2026-11-06 13:30
cosa: Airbnb: promemoria all'host per le istruzioni del deposito valigie
tipo: gestire
giorno: 2026-11-06
entro: 2026-11-03
quando: verso il 2–3/11
link: App Airbnb = https://www.airbnb.it/trips
priorità: media
nota: L'host ha confermato (14/10) che il deposito bagagli è self-service e si può usare a qualsiasi ora, e ha chiesto di scrivergli vicino al check-in per mandare le istruzioni. Arrivo previsto tra le 13 e le 14:30 del 6/11.
### risposta-nagomi
tappa: 2026-11-07 15:00
cosa: Nagomi: controllare la risposta sulle valigie prima delle 16
tipo: gestire
giorno: 2026-11-07
entro: 2026-10-21
quando: entro il 21/10 (messaggio inviato il 14/10)
priorità: media
nota: Chiesto il 14/10: arrivo tra le 14 e le 15 del 7/11 e valigie in casa prima del check-in delle 16. La risposta arriva a chi ha la prenotazione del gruppo. Se non si può, armadietti della stazione di Kawaguchiko fino al rientro.

### risposta-alpina
tappa: 2026-11-13 12:20
cosa: Spa Hotel Alpina: controllare la risposta su valigie e orario della colazione
tipo: gestire
giorno: 2026-11-13
entro: 2026-10-21
quando: entro il 21/10 (messaggio inviato il 14/10)
link: App Booking = https://secure.booking.com/mytrips.html
priorità: media
nota: Chiesto il 14/10: valigie tra le 12 e le 13 del 13/11, check-in tra le 17 e le 18:30, check-out tra le 7:15 e le 7:45 del 15/11 (treno delle 8:00) e da che ora c'è la colazione. Se non tengono le valigie: armadietti della stazione di Takayama.

### risposta-hillarys
tappa: 2026-11-15 12:20
cosa: Hotel Hillarys: orario della colazione e check-in anticipato (sì o no)
tipo: gestire
giorno: 2026-11-15
entro: 2026-10-21
quando: entro il 21/10 (messaggio inviato il 14/10)
link: App Booking = https://secure.booking.com/mytrips.html
priorità: media
nota: Risposte del 14/10: deposito valigie gratis confermato; check-in anticipato chiesto, l'hotel farà il possibile (non garantito); colazione dalle 6:45, anche da asporto.
fatto: 2026-10-14

### sushi-ten
tappa: 2026-11-17 19:00
cosa: Sushi Tokyo Ten Shibuya 17/11 ore 19:00, per 2
tipo: prenotare
giorno: 2026-11-17
quando: subito: prenotazioni online già aperte
costo: omakase ¥9.900 a testa (~€54)
link: Prenota su TableCheck = https://www.tablecheck.com/en/shops/sushitokyo-ten-shibuya/reserve
priorità: alta
nota: Serve la carta di credito; il locale non accetta contanti. Disdetta il giorno stesso = si paga tutto. Corso omakase da ¥9.900 (quello con aragosta ¥13.200).

### kobe-ishida
tappa: 2026-11-15 18:30
cosa: Kobe Steak Ishida LINKS UMEDA 15/11 ore 18:30, per 2
tipo: prenotare
giorno: 2026-11-15
quando: subito: è domenica sera
costo: cena da ~¥13.000 a testa (~€70) + 10% se prenotate online
link: Prenota online (My Concierge Japan) = https://mycon-jp.net/reservation/kobebeef-ishida-osaka/en ; Scheda del ristorante = https://myconciergejapan.com/restaurants/kobe-steak-ishida-links-umeda ; Chiama il ristorante = tel:+81661478325
priorità: alta
nota: My Concierge Japan è il partner ufficiale per le prenotazioni in inglese: si paga in anticipo (PayPal o carta) col 10% di commissione; gli extra si pagano al ristorante. Per telefono niente commissione. Aperto tutti i giorni, cena 16:30–23, ultimo ordine 21:30.

### onikai
tappa: 2026-11-11 19:30
cosa: Onikai (izakaya a Kyoto) 11/11 ore 19:30, per 2
tipo: prenotare
giorno: 2026-11-11
quando: subito: prenotazioni online già aperte
costo: ~¥4.000–6.000 a testa
link: Prenota su Tabelog = https://tabelog.com/en/kyoto/A2601/A260201/26002004/
priorità: media
nota: Solo online (il telefono non risponde), serve un account Tabelog gratuito. Aperto tutti i giorni 17–23. Il tour di Gion finisce alle 19 al santuario Yasaka, a 15′ a piedi.

### kotetsu
tappa: 2026-11-12 19:00
cosa: Kushiage Kotetsu (Kyoto) 12/11 ore 19:00, per 2
tipo: prenotare
giorno: 2026-11-12
quando: subito: prenotazioni online già aperte
costo: ~¥3.000–4.000 a testa, solo contanti
link: Prenota su Tabelog = https://tabelog.com/en/kyoto/A2601/A260201/26020610/
priorità: media
nota: Solo online (il telefono non risponde). Aperto 18–24, chiuso il mercoledì. Solo contanti.

### irori
tappa: 2026-11-14 12:30
cosa: Irori (Shirakawa-go) 14/11 ore 12:30, per 2
tipo: prenotare
giorno: 2026-11-14
quando: qualche giorno prima
costo: ~¥1.500–3.000 a testa
link: Prenota su Tabelog = https://tabelog.com/en/gifu/A2104/A210404/21003222/
priorità: bassa
nota: Prenotazione online istantanea. Pranzo 10–14. Carte JCB e AMEX e PayPay, non Visa e Mastercard. Se non c'è posto: pranzo in piedi da Yuinosato (crocchette e spiedini).

## Note

Note e aggiornamenti, scritti di solito dal back office (admin.html dal PC). L'app li mostra nel giorno indicato
(«Note del giorno» in fondo) e tutte insieme nel menu «Note e aggiornamenti». Il sito è pubblico: niente dati privati.
Campi: `data` (AAAA-MM-GG HH:MM, quando è stata scritta), `giorno` (facoltativo, AAAA-MM-GG del viaggio), `titolo`,
`testo` (si va a capo con righe rientrate di 2 spazi).

## Altre spese

Campi: `cosa`, `prezzo` (testo), `euro` (totale per 2), `stato` (pagato / da pagare), `pagato da`, `nota`.

### assicurazione
cosa: Assicurazione di viaggio Heymondo
prezzo: €44 a testa
euro: 88
stato: pagato
nota: Polizza nell'email e nell'app Heymondo (non sul sito: contiene i dati personali).

## Budget

Stima a persona in euro.

- Volo andata e ritorno: 1226 | da bozza
- Alloggi 12 notti: 686 | tutti pagati: totale vero addebitato, Nagomi compresa
- Treni e bus lunghi: 375 | metà dei biglietti Klook (€678) + Fuji Excursion del 9/11 (€51,68, pagato) + Kamakura
- Trasporti in città: 171 | metro e bus con la Suica ~€6 al giorno + gita Shirakawa-go ~€49
- Cibo (~13 giorni): 580 | ~€40 al giorno, comprese le cene da Kitchen Hida e Kyōya, più manzo di Kobe (~€75) e sushi omakase (~€54)
- Attività e spettacoli: 236 | Skytree ~€12 · Samurai Restaurant ~€43 · tour di Gion ~€26 · Samurai & Ninja Museum ~€18 · Shibuya Sky ~€14 · teamLab · sale giochi
- USJ + Express: 180 | prezzo variabile, ~€130–195 a testa
- Onsen e sentō: 15 | l'onsen dell'Alpina è incluso
- Assicurazione + e-SIM: 75 | assicurazione Heymondo €44 (pagata) + e-SIM
- Extra (shopping, imprevisti): 500

## Zone

Quartieri e zone delle tappe: l'app raggruppa le tappe consecutive nella stessa zona e mostra quanto ci state.
Campi: `nome`, `cosa` (spiegazione breve), `posti` (id della sezione Posti e `@id` degli alloggi, separati da virgola).
Le tappe senza posto prendono la zona con l'attributo `zona: id`.

### okubo
nome: Ōkubo
cosa: quartiere tranquillo dietro Shinjuku, dov'è l'Airbnb
posti: @airbnb-shinjuku

### shinjuku-sud
nome: Shinjuku sud
cosa: a sud della stazione di Shinjuku, verso Yoyogi
posti: fuunji

### asakusa
nome: Asakusa
cosa: la Tokyo antica, col tempio Senso-ji
posti: senso-ji, azuma-bashi, kura-sushi

### oshiage
nome: Oshiage (Skytree)
cosa: di là dal fiume rispetto ad Asakusa, sotto la torre della tv
posti: skytree

### akihabara
nome: Akihabara
cosa: il quartiere di videogiochi, manga ed elettronica
posti: super-potato-akiba, radio-kaikan, kyushu-jangara, hey-akihabara

### shinjuku-notte
nome: Shinjuku est (Kabukichō)
cosa: il quartiere dei locali notturni, con Golden Gai e il vicolo degli spiedini
posti: godzilla, omoide-yokocho, samurai-restaurant, golden-gai

### ningyocho
nome: Ningyōchō
cosa: quartiere tradizionale di Nihonbashi, dov'è l'Hotel Saibo
posti: @saibo

### toyosu
nome: Toyosu
cosa: isole artificiali sulla baia di Tokyo
posti: teamlab

### stazione-tokyo
nome: Stazione di Tokyo
cosa: la stazione centrale, da cui partono gli Shinkansen
posti: gransta

### tsukiji
nome: Tsukiji
cosa: l'ex mercato del pesce
posti: tsukiji

### ginza
nome: Ginza
cosa: il quartiere elegante dei grandi magazzini
posti: depachika-ginza

### harajuku
nome: Harajuku
cosa: moda giovane e la via Takeshita-dōri
posti: takeshita-dori, meiji-jingu

### shibuya
nome: Shibuya
cosa: il grande incrocio e i grattacieli
posti: shibuya-sky, shibuya-parco, sushi-ten

### hamamatsucho
nome: Hamamatsuchō e Shiba
cosa: zona dell'hotel finale, vicino alla Tokyo Tower
posti: @super-hotel, zojo-ji

### kawaguchiko-stazione
nome: Kawaguchiko, zona stazione
cosa: sponda est del lago, intorno alla stazione
posti: funivia-kachi-kachi

### kawaguchiko-nord
nome: Kawaguchiko, sponda nord
cosa: il lato del lago con la vista sul Fuji, dov'è Nagomi
posti: @nagomi, lake-bake, tenku-no-torii, momiji-corridor, hoto-fudo

### lago-kawaguchi
nome: Lago Kawaguchi
cosa: in giro intorno al lago
posti:

### fujiyoshida
nome: Fujiyoshida
cosa: la cittadina accanto, con la pagoda e la via col Fuji in fondo
posti: chureito, honcho-street, miura-udon

### enoden-costa
nome: Costa dell'Enoden
cosa: il trenino sul mare tra Kamakura ed Enoshima
posti: kokomae

### kamakura-est
nome: Kamakura est
cosa: templi tra le colline, a est della stazione
posti: hokoku-ji

### kamakura-centro
nome: Kamakura centro
cosa: la stazione e la via dello street food
posti: komachi-dori

### hase
nome: Hase
cosa: il Grande Buddha e il tempio sul mare
posti: grande-buddha, hase-dera

### kyoto-stazione
nome: Stazione di Kyoto
cosa: zona dell'hotel
posti: @apa-kyoto, daiichi-asahi

### fushimi
nome: Fushimi
cosa: a sud di Kyoto, il santuario dei portali rossi
posti: fushimi-inari, vermillion

### higashiyama
nome: Higashiyama
cosa: il quartiere storico in collina, coi templi e i vicoli antichi
posti: kiyomizu-dera, sannenzaka, pagoda-yasaka, sanshiki

### gion
nome: Gion e Pontochō
cosa: il quartiere delle geisha e il vicolo delle osterie sul fiume
posti: tour-geisha, hanami-koji, onikai, pontocho, kiyamachi

### arashiyama
nome: Arashiyama
cosa: bambù, fiume e montagne a ovest di Kyoto
posti: bambu-arashiyama, monkey-park

### kinkakuji
nome: Kinkaku-ji e Ryōan-ji
cosa: i templi del nord-ovest
posti: ryoan-ji, kinkaku-ji

### kyoto-est
nome: Collina est (Ginkaku-ji → Nanzen-ji)
cosa: lungo il Sentiero del Filosofo, in discesa
posti: daigin, ginkaku-ji, sentiero-filosofo, nanzen-ji, keage-incline

### kawaramachi
nome: Centro di Kyoto (Kawaramachi)
cosa: vie dei negozi e mercato coperto
posti: samurai-ninja-museum, nishiki, sen-no-kaze, kotetsu

### takayama-stazione
nome: Stazione di Takayama
cosa: zona dell'hotel
posti: @alpina

### takayama-centro
nome: Centro storico di Takayama
cosa: vie di case in legno, distillerie e mercati
posti: kotte-ushi, jinya, sanmachi, nakabashi, kitchen-hida, mercato-miyagawa, kyoya

### shirakawa
nome: Shirakawa-go
cosa: il villaggio dei tetti di paglia, in montagna
posti: belvedere-shiroyama, shirakawa-go, irori

### ainokura
nome: Ainokura (Gokayama)
cosa: piccolo villaggio dei tetti di paglia nella valle di Gokayama
posti: ainokura

### shinsaibashi
nome: Shinsaibashi
cosa: zona dell'hotel, accanto a Namba
posti: @hillarys

### namba
nome: Namba e Dōtonbori
cosa: insegne luminose, street food e vita notturna
posti: dotonbori, hozenji-yokocho, fukutaro, round1

### nipponbashi
nome: Nipponbashi
cosa: Den Den Town, il quartiere nerd di Osaka
posti: den-den-town

### shinsekai
nome: Shinsekai
cosa: il quartiere retrò anni '50
posti: shinsekai

### usj
nome: Universal Studios Japan
cosa: il parco divertimenti sulla baia di Osaka
posti: usj

### umeda
nome: Umeda
cosa: il quartiere dei grattacieli intorno alla stazione centrale di Osaka
posti: kobe-ishida

### tsukishima
nome: Tsukishima
cosa: quartiere sull'acqua famoso per il monjayaki, a una fermata da Toyosu
posti: monja-kondo

## Posti

### fuunji
nome: Fūunji (風雲児)
tipo: 🍜 Ristorante
città: tokyo
giorno: 6/11
nota: Tsukemen, pranzo 14:10 · chiude 15:00, coda · contanti
maps: 風雲児 東京都渋谷区代々木2-14-3
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g14133713-d1679642-Reviews-Fuunji-Yoyogi_Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
tabelog: https://tabelog.com/tokyo/A1304/A130401/13044091/
voto: 3,77
foto: Tsukemen

### kura-sushi
nome: Kura Sushi Asakusa ROX (piano B)
tipo: 🍣 Ristorante
città: tokyo
giorno: 6/11
nota: Sushi su nastro, flagship, 4° piano di Asakusa ROX, fino alle 23
maps: くら寿司 浅草ROX店 東京都台東区浅草1-25-15
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g1066461-d19976904-Reviews-Kura_Sushi_Global_Flagship_Store_Asakusa-Taito_Tokyo_Tokyo_Prefecture_Kanto.html
tabelog: https://tabelog.com/tokyo/A1311/A131102/13243597/
voto: 3,08
mappa: no
foto: Conveyor belt sushi

### senso-ji
nome: Senso-ji + Nakamise
tipo: ⛩ Tempio
città: tokyo
giorno: 6/11
nota: Sala principale fino alle 17, area sempre aperta; illuminato la sera
maps: Senso-ji Asakusa Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134311-d320447-Reviews-Senso_ji_Temple-Asakusa_Taito_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.senso-ji.jp/english/
foto: Sensō-ji

### skytree
nome: Tokyo Skytree (torre panoramica)
città: tokyo
giorno: 6/11
nota: Tembo Deck a 350 m dopo il tramonto · ¥2.100 · biglietto con data e ora
maps: Tokyo Skytree
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134337-d1872416-Reviews-Tokyo_Skytree-Oshiage_Sumida_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.tokyo-skytree.jp/en/
foto: Tokyo Skytree

### azuma-bashi
nome: Ponte Azuma-bashi (tramonto + Skytree)
tipo: 🌅 Panorama
città: tokyo
giorno: 6/11
nota: 16:30, tramonto 16:42
maps: Azumabashi Bridge Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1023181-d3676886-Reviews-Azuma_Bridge-Tokyo_Prefecture_Kanto.html
foto: Azuma Bridge

### kappabashi
nome: Kappabashi (se in anticipo)
tipo: 🛍 Shopping
città: tokyo
giorno: 6/11
nota: Articoli da cucina e cibo finto in plastica, negozi fino alle 17
maps: Kappabashi Dougu Street Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066461-d324970-Reviews-Kappabashi_Street_Kappabashi_Dogugai-Taito_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://kappabashi.or.jp/en/overview
mappa: no
foto: Kappabashi

### super-potato-akiba
nome: Super Potato Akihabara
tipo: 🎮 Retro game
città: tokyo
giorno: 6/11
nota: 3 piani di videogiochi retro + sala giochi anni '80–'90
maps: Super Potato Akihabara
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d13608105-Reviews-Super_Potato-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.japan.travel/en/spot/2178/
foto: Famicom

### radio-kaikan
nome: Akihabara Radio Kaikan
tipo: 🎮 Figure e manga
città: tokyo
giorno: 6/11
nota: 10 piani di figure, modellini e carte da collezione
maps: Akihabara Radio Kaikan
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d25190470-Reviews-Akihabara_Radio_Kaikan-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://en.jal.japantravel.com/tokyo/akiba-radio-kaikan/25669
foto: Akihabara

### kyushu-jangara
nome: Kyushu Jangara Akihabara (ramen)
tipo: 🍜 Ristorante
città: tokyo
giorno: 6/11
nota: Ramen tonkotsu (brodo di maiale) · 11–22, ultimo ordine 21:45
maps: 九州じゃんがら 秋葉原本店 Sotokanda 3-11-6
tabelog: https://tabelog.com/tokyo/A1310/A131001/13000344/
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g1066443-d1688751-Reviews-Kyushu_Jangara_Ramen_Akihabara_Honten-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://visit-chiyoda.tokyo/app/en/spot/detail/927
foto: Ramen

### hey-akihabara
nome: HEY — Hirose Entertainment Yard
tipo: 🕹 Sala giochi
città: tokyo
giorno: 6/11
nota: Cabinati retro e moderni, fino alle 23:45
maps: HEY Hirose Entertainment Yard Akihabara
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d10094606-Reviews-Hey-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.taito.co.jp/store/00001703
foto: Akihabara

### gigo-akihabara
nome: GiGO Akihabara
tipo: 🕹 Sala giochi
città: tokyo
giorno: 6/11
nota: UFO catcher, ritmo, picchiaduro
maps: GiGO Akihabara
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d10094610-Reviews-GiGO_Akihabara_1st-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.gigo.co.jp/en/shops/akihabara3
foto: Akihabara

### taito-station
nome: Taito Station Akihabara
tipo: 🕹 Sala giochi
città: tokyo
giorno: 6/11
nota: Fino alle 23–23:30
maps: Taito Station Akihabara
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d10429337-Reviews-Taito_Station_Akihabara-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.taito.co.jp/store/00001802
foto: Akihabara

### godzilla
nome: Testa di Godzilla (Hotel Gracery)
tipo: 📸 Foto
città: tokyo
giorno: 6/11
nota: Kabukichō, 7′ dalla stazione di Shinjuku
maps: Godzilla Head Hotel Gracery Shinjuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133667-d8048204-Reviews-Godzilla_Road_Head-Kabukicho_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://gracery.com/shinjuku/page/godzilla/en/
foto: Shinjuku Toho Building

### lake-bake
nome: Lake Bake
tipo: 🥐 Panetteria
città: kawaguchiko
giorno: 7/11
nota: Pranzo · 🚨 caffè interno temporaneamente chiuso (solo asporto) · chiuso mer.
maps: Lake Bake 富士河口湖町大石2585-85
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g1165976-d7486115-Reviews-Lake_Bake-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanashi_Prefecture_Koshinetsu_.html
tabelog: https://tabelog.com/en/yamanashi/A1903/A190303/19004468/
voto: 3,62
sito: http://lakebake.com/shop.html
foto: Lake Kawaguchi

### tenku-no-torii
nome: Tenku no Torii
tipo: ⛩ Panorama
città: kawaguchiko
giorno: 7/11
nota: Col gruppo 15:30 · chiude verso le 16:00
maps: Tenku no Torii Fujikawaguchiko
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1165976-d26832180-Reviews-Tenku_no_torii-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanashi_Prefecture_Koshi.html
sito: https://en.kawaguchiko.net/?p=9830
foto: Torii

### momiji-corridor
nome: Momiji Corridor (festival del foliage)
tipo: 🍁 Natura
città: kawaguchiko
giorno: 7/11
nota: Illuminazione dal tramonto alle 21:00
maps: Momiji Corridor Kawaguchiko
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1165976-d10019717-Reviews-Fuji_Lake_Kawaguchi_Koyo_Festival-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanas.html
sito: https://en.kawaguchiko.net/event-en/fujikawaguchiko-momiji-festival/
foto: Acer palmatum

### hoto-fudo
nome: Hoto Fudo — Kawaguchiko Kita (sede principale)
tipo: 🍲 Ristorante
città: kawaguchiko
giorno: 7/11
nota: Cena col gruppo · 11–20, chiude prima se finiscono i noodles · contanti
maps: ほうとう不動 河口湖北本店 富士河口湖町河口707
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g1165976-d1703447-Reviews-Houtou_Fudou_Kawaguchikokita_Honten-Fujikawaguchiko_machi_Minamitsuru_gun_Yamana.html
tabelog: https://tabelog.com/en/yamanashi/A1903/A190303/19000116/
voto: 3,48
foto: Hōtō

### hoto-fudo-higashi
nome: Hoto Fudo — Higashi-Koiji (alternativa)
tipo: 🍲 Ristorante
città: kawaguchiko
giorno: 7/11
nota: Edificio bianco «a nuvola», più vicino alla stazione
maps: ほうとう不動 東恋路店 富士河口湖町船津東恋路2458
tripadvisor: https://tripadvisor.com/Restaurant_Review-g1165976-d4357940-Reviews-or30-Houtou_Fudou_Higashikoiji-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanashi_.html
tabelog: https://tabelog.com/en/yamanashi/A1903/A190303/19004418/
voto: 3,48
mappa: no
foto: Hōtō

### funivia-kachi-kachi
nome: Mt. Fuji Panoramic Ropeway (Kachi Kachi)
tipo: 🚠 Panorama
città: kawaguchiko
giorno: 8/11
nota: 8:30–17:00, A/R ¥1.000 · solo se il Fuji è scoperto
maps: Mt. Fuji Panoramic Ropeway
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1165976-d1368670-Reviews-Mt_Fuji_Panoramic_Ropeway-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanashi_Prefec.html
sito: https://www.mtfujiropeway.jp/
foto: Lake Kawaguchi

### miura-udon
nome: Miura Udon
tipo: 🍜 Ristorante
città: kawaguchiko
giorno: 8/11
nota: Yoshida udon (udon spessi e sodi della zona) · solo pranzo 10–14, chiuso mer.
maps: みうらうどん 富士吉田市下吉田1-22-5
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g681223-d7434035-Reviews-Miura_Udon-Fujiyoshida_Yamanashi_Prefecture_Koshinetsu_Chubu.html
tabelog: https://tabelog.com/yamanashi/A1903/A190301/19000359/
voto: 3,65
foto: Udon

### chureito
nome: Chureito Pagoda
tipo: ⛩ Panorama
città: kawaguchiko
giorno: 9/11
nota: Col gruppo alle 8:00 · ~400 scalini
maps: Chureito Pagoda Fujiyoshida
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g681223-d12132064-Reviews-Chureito_Pagoda-Fujiyoshida_Yamanashi_Prefecture_Koshinetsu_Chubu.html
sito: https://fujiyoshida.net/spot/12
foto: Arakurayama Sengen Park

### honcho-street
nome: Honcho Street
tipo: 📸 Foto
città: kawaguchiko
giorno: 9/11
nota: Il Fuji in fondo alla via
maps: Honcho Street Fujiyoshida
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g681223-d20342844-Reviews-Honcho_Nichome_Shotengai-Fujiyoshida_Yamanashi_Prefecture_Koshinetsu_Chubu.html
sito: https://fujiyoshida.net/en/see-and-do/410
foto: Fujiyoshida

### teamlab
nome: teamLab Planets TOKYO
tipo: ✨ Esperienza
città: tokyo
giorno: 9/11
nota: 19:00, prenotato dal gruppo
maps: teamLab Planets TOKYO Toyosu
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134359-d14951238-Reviews-TeamLab_Planets_TOKYO-Toyosu_Koto_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.teamlab.art/e/planets/
foto: TeamLab

### kokomae
nome: Kamakura-kōkō-mae (passaggio a livello)
tipo: 📸 Foto
città: kamakura
giorno: 10/11
nota: 8:00 col gruppo
maps: Kamakurakokomae Station
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d8400753-Reviews-Kamakura_Kokomae_Station-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://www.enoden.co.jp/en/train/station/kamakurakokomae/
foto: Kamakurakōkōmae Station

### hokoku-ji
nome: Hōkoku-ji (tempio del bambù)
tipo: 🎋 Tempio
città: kamakura
giorno: 10/11
nota: ¥400, tè matcha nel bambù · può chiudere col maltempo
maps: Hokokuji Temple Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d1311119-Reviews-Hokoku_ji_Temple-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://houkokuji.or.jp/?p=29
foto: Hōkoku-ji (Kamakura)

### komachi-dori
nome: Komachi-dōri
tipo: 🍡 Street food
città: kamakura
giorno: 10/11
nota: Pranzo 12:30 · mangiare fermi davanti al banco
maps: Komachi-dori Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d1755776-Reviews-Kamakura_Komachidori-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://visit.trip-kamakura.com/things-to-do/komachi-street/
foto: Kamakura

### grande-buddha
nome: Grande Buddha di Kōtoku-in
tipo: 🗿 Tempio
città: kamakura
giorno: 10/11
nota: 8–17, ¥300
maps: Kotoku-in Great Buddha Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d319975-Reviews-Kotoku_in_Great_Buddha_of_Kamakura-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://www.kotoku-in.jp/en/
foto: Kōtoku-in

### hase-dera
nome: Hase-dera
tipo: ⛩ Tempio
città: kamakura
giorno: 10/11
nota: Terrazza sul mare · chiude alle 16:30
maps: Hasedera Temple Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d319981-Reviews-Hasedera_Temple-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://www.hasedera.jp/en/
foto: Hase-dera (Kamakura)

### gransta
nome: Gransta Tokyo — Ekibenya Matsuri
tipo: 🍱 Ekiben
città: tokyo
giorno: 10/11
nota: Cestini da treno per la cena sullo Shinkansen
maps: Ekibenya Matsuri Gransta Tokyo Station
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14129528-d3335816-Reviews-GRANSTA_TOKYO-Marunouchi_Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.gransta.jp/mall/gransta_tokyo/ekibenyamatsuri/
foto: Ekiben

### daiichi-asahi
nome: Honke Daiichi Asahi (ramen)
tipo: 🍜 Ristorante
città: kyoto
giorno: 10/11
nota: Se avete fame all'arrivo · 6:00–1:00, chiuso gio.
maps: 本家 第一旭 たかばし 京都市下京区東塩小路向畑町845
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d3178693-Reviews-Honke_Daiichi_Asahi_Main_Store-Kyoto_Kyoto_Prefecture_Kinki.html
tabelog: https://tabelog.com/en/kyoto/A2601/A260101/26000873/
voto: 3,74
foto: Ramen

### fushimi-inari
nome: Fushimi Inari Taisha
tipo: ⛩ Santuario
città: kyoto
giorno: 11/11
nota: 7:15, fino a Yotsutsuji
maps: Fushimi Inari Taisha Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321456-Reviews-Fushimi_Inari_taisha_Shrine-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://inari.jp/en/
foto: Fushimi Inari-taisha

### kiyomizu-dera
nome: Kiyomizu-dera
tipo: ⛩ Tempio
città: kyoto
giorno: 11/11
nota: 13:00
maps: Kiyomizu-dera Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321401-Reviews-Kiyomizu_dera_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kiyomizudera.or.jp/en/
foto: Kiyomizu-dera

### sannenzaka
nome: Sannenzaka e Ninenzaka
tipo: 🏮 Vicoli
città: kyoto
giorno: 11/11
nota: Tè verso le 15:30
maps: Sannenzaka Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386121-Reviews-Sannenzaka_Ninenzaka-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://ja.kyoto.travel/komafuda/show.php?id=2239&lang=en
foto: Sannenzaka

### pagoda-yasaka
nome: Pagoda di Yasaka (Hōkan-ji)
tipo: 📸 Foto
città: kyoto
giorno: 11/11
nota: 16:30, tramonto 16:55
maps: Yasaka Pagoda Hokanji Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386172-Reviews-Yasaka_Pagoda-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://kyoto.travel/en/destinations/hokanji-templeyasaka-pagoda/
foto: Hōkan-ji

### hanami-koji
nome: Hanami-kōji (Gion)
tipo: 🏮 Quartiere
città: kyoto
giorno: 11/11
nota: Col tour delle 17, quando si accendono le lanterne
maps: Hanamikoji Street Gion Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1956593-Reviews-Hanamikoji_Street-Kyoto_Kyoto_Prefecture_Kinki.html
foto: Gion

### tour-geisha
nome: Tour di Gion «Storie di geisha»
tipo: 🏮 Tour a piedi
città: kyoto
giorno: 11/11
nota: 17:00, 2 h con guida · ritrovo da Ben's Cookies (Shijō), fine al santuario Yasaka · DA PRENOTARE per 2
maps: Ben's Cookies Kyoto Shijo
tripadvisor: https://www.tripadvisor.com/AttractionProductReview-g298564-d26638683-Kyoto_Gion_Geisha_District_Walking_Tour_The_Stories_of_Geisha-Kyoto_Kyoto_Prefectu.html
sito: https://www.getyourguide.com/kyoto-l96826/kyoto-night-walking-tour-gion-stories-of-geisha-t563565/
foto: Maiko

### pontocho
nome: Pontochō
tipo: 🍶 Cena
città: kyoto
giorno: 11/11
nota: Passeggiata dopo cena, 21:00
maps: Pontocho Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321442-Reviews-Pontocho_District-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://ja.kyoto.travel/komafuda/show.php?id=2203&lang=en
foto: Pontochō

### kiyamachi
nome: Kiyamachi-dōri
tipo: 🍺 Vita notturna
città: kyoto
giorno: 11/11
nota: Bar e osterie lungo il canale
maps: Kiyamachi-dori Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d3837245-Reviews-Kiyamachi_Street-Kyoto_Kyoto_Prefecture_Kinki.html
foto: Takase River

### kodai-ji
nome: Kōdai-ji illuminato (facoltativo)
tipo: 🍁 Tempio
città: kyoto
giorno: 11/11
nota: 17–22, ¥800
maps: Kodaiji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321402-Reviews-Kodai_ji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kodaiji.com/e_index.html
mappa: no
foto: Kōdai-ji

### bambu-arashiyama
nome: Bosco di bambù di Arashiyama
tipo: 🎋 Natura
città: kyoto
giorno: 12/11
nota: 7:50, vuoto solo a quest'ora
maps: Arashiyama Bamboo Grove
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1497822-Reviews-Bamboo_Forest_Street-Kyoto_Kyoto_Prefecture_Kinki.html
foto: Arashiyama

### tenryu-ji
nome: Tenryū-ji (giardino zen, facoltativo)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: Apre alle 8:30
maps: Tenryuji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386106-Reviews-Tenryu_ji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.tenryuji.com/en/
mappa: no
foto: Tenryū-ji

### monkey-park
nome: Monkey Park Iwatayama
tipo: 🐒 Natura
città: kyoto
giorno: 12/11
nota: 9:00 · ¥800 contanti, 20–30′ di salita
maps: Monkey Park Iwatayama Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d665440-Reviews-Monkey_Park_Iwatayama-Kyoto_Kyoto_Prefecture_Kinki.html
sito: http://www.monkeypark.jp/eng-index.html
foto: Japanese macaque

### ryoan-ji
nome: Ryōan-ji (giardino zen delle 15 rocce)
tipo: 🪨 Tempio
città: kyoto
giorno: 12/11
nota: 10:50 · ¥600
maps: Ryoanji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386112-Reviews-Ryoan_ji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: http://www.ryoanji.jp/smph/eng/
foto: Ryōan-ji

### kinkaku-ji
nome: Kinkaku-ji (Padiglione d'Oro)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: 12:00 · ¥500
maps: Kinkakuji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321400-Reviews-Kinkakuji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.shokoku-ji.jp/en/kinkakuji/
foto: Kinkaku-ji

### ginkaku-ji
nome: Ginkaku-ji (Padiglione d'Argento)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: 14:15 · ¥500
maps: Ginkakuji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321398-Reviews-Ginkakuji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.shokoku-ji.jp/en/ginkakuji/
foto: Ginkaku-ji

### sentiero-filosofo
nome: Sentiero del Filosofo
tipo: 🚶 Passeggiata
città: kyoto
giorno: 12/11
nota: 2 km verso sud
maps: Philosopher's Path Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d545965-Reviews-Philosopher_s_Walk-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://kyoto.travel/en/destinations/philosophers-path-tetsugakunomichi/
foto: Philosopher's Walk

### honen-in
nome: Hōnen-in
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: Piccolo tempio nel bosco, ingresso libero
maps: Honen-in Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d968349-Reviews-Honen_in-Kyoto_Kyoto_Prefecture_Kinki.html
sito: http://www.honen-in.jp/
foto: Hōnen-in

### eikan-do
nome: Eikan-dō (facoltativo)
tipo: 🍁 Tempio
città: kyoto
giorno: 12/11
nota: Ultimo ingresso 16:00
maps: Eikando Zenrinji Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d479881-Reviews-Eikando_Zenrinji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.eikando.or.jp/English/index_eng.html
mappa: no
foto: Eikan-dō Zenrin-ji

### nanzen-ji
nome: Nanzen-ji (Sanmon + acquedotto)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: Ultimo ingresso 16:40
maps: Nanzenji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321091-Reviews-Nanzen_ji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://nanzenji.or.jp/
foto: Nanzen-ji

### keage-incline
nome: Keage Incline
tipo: 🌅 Passeggiata
città: kyoto
giorno: 12/11
nota: Al tramonto, 16:45
maps: Keage Incline Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1975187-Reviews-Keage_Incline-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://biwakososui.city.kyoto.lg.jp/en/place/detail/23
foto: Keage Incline

### nishiki
nome: Mercato di Nishiki
tipo: 🍢 Street food
città: kyoto
giorno: 12/11
nota: Banchi fino alle 17–18
maps: Nishiki Market Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d554672-Reviews-Nishiki_Market_Shopping_District-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kyoto-nishiki.or.jp/en/about/
foto: Nishiki Market

### samurai-ninja-museum
nome: Samurai & Ninja Museum
tipo: ⚔️ Museo
città: kyoto
giorno: 12/11
nota: 17:35 · armature, katana, shuriken · ~¥3.300 · DA PRENOTARE per 2
maps: Samurai Ninja Museum Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d13551788-Reviews-Samurai_Ninja_Museum_With_Experience-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://mai-ko.com/samurai/
foto: Samurai

### sen-no-kaze
nome: Ramen Sen no Kaze
tipo: 🍜 Ristorante
città: kyoto
giorno: 12/11
nota: Alternativa per la cena del 12/11 · 12–21, chiuso mar–mer · Tabelog basso, Tripadvisor alto
maps: らーめん千の風 京都市中京区新京極通四条上ル中之町580
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d3788802-Reviews-Ramen_Sen_no_Kaze_Kyoto-Kyoto_Kyoto_Prefecture_Kinki.html
tabelog: https://tabelog.com/en/kyoto/A2601/A260202/26016307/
voto: 3,10
foto: Ramen

### toei-studio-park
nome: Toei Kyoto Studio Park (se piove)
tipo: ⚔️ Samurai
città: kyoto
giorno: 12/11
nota: Set dei film di samurai, spettacoli di ninja
maps: Toei Kyoto Studio Park
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321414-Reviews-Toei_Kyoto_Studio_Park-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://global.toei-eigamura.com/
mappa: no
foto: Toei Kyoto Studio Park

### kotte-ushi
nome: Hida Kotte Ushi (sushi di Hida beef)
tipo: 🍣 Street food
città: takayama
giorno: 13/11
nota: Pranzo 12:45 · si è spostato a Kami-sannomachi 82 · chiuso mar.
maps: こって牛 高山市上三之町82
tripadvisor: https://www.tripadvisor.ca/Restaurant_Review-g298113-d7729529-Reviews-Hida_Kotte_Ushi-Takayama_Gifu_Prefecture_Tokai_Chubu.html
tabelog: https://tabelog.com/en/gifu/A2104/A210401/21023203/
voto: 3,43
sito: https://takayama-kotteushi.jp/
foto: Hida beef

### jinya
nome: Takayama Jinya
tipo: 🏯 Storia
città: takayama
giorno: 13/11
nota: 13:30 · 8:45–16:30, ¥440
maps: Takayama Jinya
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d320174-Reviews-Takayama_Jinya-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://jinya.gifu.jp/en/
foto: Takayama Jin'ya

### sanmachi
nome: Sanmachi-suji
tipo: 🏮 Quartiere
città: takayama
giorno: 13/11
nota: Case in legno di epoca Edo (1603–1868)
maps: Sanmachi Suji Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d320175-Reviews-Sanmachi_Suji-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://www.hida.jp/english/touristattractions/takayamacity/historyandculture/4000153.html
foto: Takayama, Gifu

### sake-harada
nome: Distilleria Harada
tipo: 🍶 Sakè
città: takayama
giorno: 13/11
nota: ~¥450 con bicchierino ricordo
maps: Harada Sake Brewery Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8769811-Reviews-Harada_Sake_Brewery-Takayama_Gifu_Prefecture_Tokai_Chubu.html
foto: Sake

### sake-hirase
nome: Distilleria Hirase
tipo: 🍶 Sakè
città: takayama
giorno: 13/11
nota: ~¥1.000 per oltre 20 sakè
maps: Hirase Sake Brewery Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8714368-Reviews-Hirase_Shuzo_Brewery-Takayama_Gifu_Prefecture_Tokai_Chubu.html
foto: Sake

### sake-funasaka
nome: Distilleria Funasaka
tipo: 🍶 Sakè
città: takayama
giorno: 13/11
nota: Banco e macchinette self-service
maps: Funasaka Sake Brewery Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8145940-Reviews-Funasaka_Shuzo_Brewery-Takayama_Gifu_Prefecture_Tokai_Chubu.html
foto: Sake

### nakabashi
nome: Ponte Nakabashi
tipo: 🌅 Foto
città: takayama
giorno: 13/11
nota: Ponte rosso al tramonto, 16:40
maps: Nakabashi Bridge Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8586387-Reviews-Nakabashi_Bridge-Takayama_Gifu_Prefecture_Tokai_Chubu.html
foto: Takayama, Gifu

### showa-kan
nome: Showa-kan (alternativa)
tipo: 🕹 Museo
città: takayama
giorno: 13/11
nota: Vita giapponese anni '50
maps: Takayama Showakan
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d3385796-Reviews-Takayama_Showakan-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://showakan.jp/takayama/
mappa: no
foto: Shōwa era

### kitchen-hida
nome: Steak House Kitchen Hida
tipo: 🥩 Ristorante
città: takayama
giorno: 13/11
nota: Cena 18:15 · chiuso mer. · DA PRENOTARE per 2
maps: キッチン飛騨 高山市本町1-66
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298113-d1479770-Reviews-Kitchen_Hida-Takayama_Gifu_Prefecture_Tokai_Chubu.html
tabelog: https://tabelog.com/en/gifu/A2104/A210401/21000080/
voto: 3,78
sito: http://kitchenhida.com/
foto: Hida beef

### mercato-miyagawa
nome: Mercato mattutino Miyagawa
tipo: 🍡 Mercato
città: takayama
giorno: 14/11
nota: 7:00–12:00
maps: Miyagawa Morning Market Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d1516746-Reviews-Hida_Takayama_Miyagawa_Morning_Market-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://www.asaichi.net/language/english.html
foto: Takayama, Gifu

### shirakawa-go
nome: Shirakawa-go (villaggio)
tipo: 🏡 UNESCO
città: takayama
giorno: 14/11
nota: Case gasshō, col tetto di paglia a punta
maps: Shirakawa-go Ogimachi
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1119912-d1407426-Reviews-The_Historic_Villages_of_Shirakawa_go_Gassho_Style_Houses-Shirakawa_mura_Ono_gun.html
sito: https://shirakawa-go.gr.jp/en/
foto: Shirakawa-gō

### belvedere-shiroyama
nome: Belvedere Shiroyama (Ogimachi)
tipo: 🌄 Panorama
città: takayama
giorno: 14/11
nota: Prima tappa, 20′ in salita o navetta
maps: Ogimachi Castle Ruins Observatory Shirakawa
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1119912-d3749769-Reviews-Shirakawago_Shiroyama_Observatory_Deck-Shirakawa_mura_Ono_gun_Gifu_Prefecture_Ch.html
sito: https://www.vill.shirakawa.lg.jp/1470.htm
foto: Shirakawa-gō

### ainokura
nome: Ainokura (villaggio)
tipo: 🏡 UNESCO
città: takayama
giorno: 14/11
nota: Villaggio gasshō di Gokayama, piccolo e tranquillo
maps: Ainokura Gassho-zukuri Village
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1021438-d1407505-Reviews-Ainokura_Gassho_Community-Nanto_Toyama_Prefecture_Hokuriku_Chubu.html
sito: https://gokayama-info.jp/en/%e3%81%bf%e3%81%a9%e3%81%93%e3%82%8d/%e4%ba%94%e7%ae%87%e5%b1%b1%e3%81%a8%e4%b8%96%e7%95%8c%e9%81%ba%e7%94%a3/world-heritage-ainokura-gassho-style-village
foto: Gokayama

### casa-wada
nome: Casa Wada
tipo: 🏡 Casa storica
città: takayama
giorno: 14/11
nota: La più grande casa col tetto di paglia visitabile
maps: Wada House Shirakawa-go
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1119912-d324182-Reviews-Wada_House-Shirakawa_mura_Ono_gun_Gifu_Prefecture_Tokai_Chubu.html
sito: https://www.vill.shirakawa.lg.jp/1484.htm
foto: Gasshō-zukuri

### kyoya
nome: Kyōya
tipo: 🍲 Ristorante
città: takayama
giorno: 14/11
nota: Cena 18:00 · hoba miso, Hida beef · chiuso mar. · DA PRENOTARE per 2
maps: 飛騨高山 京や 高山市大新町1-77
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298113-d3616009-Reviews-Hidatakayama_Kyoya-Takayama_Gifu_Prefecture_Tokai_Chubu.html
tabelog: https://tabelog.com/gifu/A2104/A210401/21000305/
voto: 3,33
foto: Hida beef

### dotonbori
nome: Dōtonbori
tipo: 🌃 Quartiere
città: osaka
giorno: 15/11
nota: Street food a pranzo, neon la sera
maps: Dotonbori Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14135010-d325333-Reviews-Dotombori_District-Dotombori_Chuo_Osaka_Osaka_Prefecture_Kinki.html
sito: http://www.dotonbori.or.jp/ja/
foto: Dōtonbori

### den-den-town
nome: Den Den Town (Nipponbashi)
tipo: 🎮 Otaku
città: osaka
giorno: 15/11
nota: 13:30
maps: Den Den Town Nipponbashi Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134994-d321314-Reviews-Nipponbashi_Denden_Town-Nippombashi_Chuo_Osaka_Osaka_Prefecture_Kinki.html
sito: https://www.nippombashi.jp/
foto: Den Den Town

### super-potato
nome: Super Potato — Otaroad
tipo: 🎮 Retro game
città: osaka
giorno: 15/11
nota: Weekend 10–20 · Nipponbashi 3-8-18
maps: スーパーポテト オタロード店 大阪市浪速区日本橋3-8-18
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298566-d28449079-Reviews-Super_Potato_Ota_Road-Osaka_Osaka_Prefecture_Kinki.html
sito: https://www.superpotato.com/shop/otaroad/
foto: Den Den Town

### mandarake
nome: Mandarake Grand Chaos
tipo: 🎮 Manga e figure
città: osaka
giorno: 15/11
nota: 12–20
maps: Mandarake Grand Chaos Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298566-d9727254-Reviews-Mandarake_Grandchaos-Osaka_Osaka_Prefecture_Kinki.html
sito: https://www.mandarake.co.jp/dir/gcs/
foto: Mandarake

### shinsekai
nome: Shinsekai
tipo: 🏮 Quartiere retrò
città: osaka
giorno: 15/11
nota: 15:30
maps: Shinsekai Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298566-d1407290-Reviews-Shinsekai-Osaka_Osaka_Prefecture_Kinki.html
sito: https://shinsekai.net/
foto: Shinsekai

### tsutenkaku
nome: Torre Tsūtenkaku
tipo: 🌅 Panorama
città: osaka
giorno: 15/11
nota: Al tramonto · 10–20, ¥1.000
maps: Tsutenkaku Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298566-d1195795-Reviews-Tsutenkaku-Osaka_Osaka_Prefecture_Kinki.html
sito: https://www.tsutenkaku.co.jp/
foto: Tsūtenkaku

### daruma
nome: Kushikatsu Daruma — Shinsekai Sōhonten
tipo: 🍢 Ristorante
città: osaka
giorno: 15/11
nota: Assaggio di spiedini fritti · contanti · mai intingere due volte
maps: 串かつだるま 新世界総本店 大阪市浪速区恵美須東2-3-9
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298566-d1678754-Reviews-Ganso_Kushikatsu_Daruma_Shinsekai_Sohonten-Osaka_Osaka_Prefecture_Kinki.html
tabelog: https://tabelog.com/osaka/A2701/A270206/27004260/
voto: 3,46
sito: https://www.kushikatu-daruma.com/location/
foto: Kushikatsu

### fukutaro
nome: Fukutaro Honten (okonomiyaki)
tipo: 🥞 Ristorante
città: osaka
giorno: 15/11
nota: Pranzo 12:40 · la domenica aperto dalle 12 · niente prenotazioni
maps: 福太郎 本店 大阪市中央区千日前2-3-17
tripadvisor: https://www.tripadvisor.com.sg/Restaurant_Review-g14135003-d3610195-Reviews-Fukutaro_Honten-Sennichimae_Chuo_Osaka_Osaka_Prefecture_Kinki.html
tabelog: https://tabelog.com/en/osaka/A2701/A270202/27002665/
voto: 3,72
sito: https://k226600.gorp.jp/
foto: Okonomiyaki

### hozenji-yokocho
nome: Hōzenji Yokochō
tipo: 🏮 Vicolo
città: osaka
giorno: 15/11
nota: Statua di Fudō (divinità buddista) coperta di muschio
maps: Hozenji Yokocho Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134988-d2710498-Reviews-Hozenji_Yokocho-Namba_Chuo_Osaka_Osaka_Prefecture_Kinki.html
foto: Dōtonbori

### ura-namba
nome: Ura-Namba
tipo: 🍺 Vita notturna
città: osaka
giorno: 15/11
nota: Vicoli di bar e osterie economiche
maps: Ura Namba Osaka
foto: Namba

### round1
nome: Round1 Stadium Sennichimae
tipo: 🕹 Sala giochi
città: osaka
giorno: 15/11
nota: Fino alle 0:50, bowling, karaoke
maps: Round1 Stadium Sennichimae Osaka
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134988-d12967346-Reviews-Round_One_Stadium_Sennichimae-Namba_Chuo_Osaka_Osaka_Prefecture_Kinki.html
sito: https://www.round1.co.jp/
foto: Round One Corporation

### namba-grand-kagetsu
nome: Namba Grand Kagetsu (alternativa)
tipo: 🎭 Comicità
città: osaka
giorno: 15/11
nota: Comici in coppia (manzai) e commedia slapstick, in giapponese ma molto fisica
maps: Namba Grand Kagetsu
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14127623-d1195814-Reviews-Nanba_Grand_Kagetsu-Chuo_Osaka_Osaka_Prefecture_Kinki.html
sito: https://ngk.yoshimoto.co.jp/
mappa: no
foto: Namba Grand Kagetsu

### usj
nome: Universal Studios Japan + Super Nintendo World
tipo: 🎢 Parco
città: osaka
giorno: 16/11
nota: Area Timed Entry o Express per 2 · DA PRENOTARE
maps: Universal Studios Japan
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298566-d320976-Reviews-Universal_Studios_Japan-Osaka_Osaka_Prefecture_Kinki.html
sito: https://www.usj.co.jp/web/en/us
foto: Super Nintendo World

### tsukiji
nome: Mercato esterno di Tsukiji
tipo: 🍣 Mercato
città: tokyo
giorno: 17/11
nota: Colazione alle 9:00 · contanti · chiuso mer/dom
maps: Tsukiji Outer Market Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14129610-d1373675-Reviews-Tsukiji_Jogai_Market-Tsukiji_Chuo_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.tsukiji.or.jp/english/
foto: Tsukiji fish market

### kabuki-za
nome: Kabuki-za (alternativa: un atto singolo)
tipo: 🎭 Teatro
città: tokyo
giorno: 17/11
nota: A novembre il Kaomise, il programma più importante dell'anno; un solo atto ~1 h
maps: Kabukiza Theater Ginza
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14129573-d1373683-Reviews-Kabukiza_Theater-Ginza_Chuo_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.kabuki-bito.jp/eng/theatres/kabukiza/
mappa: no
foto: Kabuki-za

### depachika-ginza
nome: Depachika di Ginza Mitsukoshi
tipo: 🍱 Pranzo
città: tokyo
giorno: 17/11
nota: Food hall nel seminterrato
maps: Ginza Mitsukoshi depachika
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14129573-d605050-Reviews-Ginza_Mitsukoshi-Ginza_Chuo_Tokyo_Tokyo_Prefecture_Kanto.html
foto: Depachika

### takeshita-dori
nome: Takeshita-dōri
tipo: 🛍 Harajuku
città: tokyo
giorno: 17/11
nota: Moda, crêpe, purikura (cabine per foto-adesivi)
maps: Takeshita Street Harajuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d1373790-Reviews-Takeshita_Street-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.takeshita-street.com/
foto: Takeshita Street

### meiji-jingu
nome: Meiji Jingū
tipo: ⛩ Santuario
città: tokyo
giorno: 17/11
nota: 40′ nel bosco
maps: Meiji Jingu Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d1373780-Reviews-Meiji_Jingu_Shrine-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.meijijingu.or.jp/en/
foto: Meiji Shrine

### cat-street
nome: Cat Street
tipo: 🚶 Passeggiata
città: tokyo
giorno: 17/11
nota: Harajuku → Shibuya a piedi, 20′
maps: Cat Street Shibuya Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d610349-Reviews-Shibuya_Cat_Street-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
foto: Harajuku

### shibuya-sky
nome: Shibuya Sky
tipo: 🌅 Panorama
città: tokyo
giorno: 17/11
nota: 16:00, tramonto 16:31 · biglietti dal 2/11 alle 16:00 italiane
maps: Shibuya Sky
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d19274143-Reviews-Shibuya_Sky-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.shibuya-scramble-square.com/en/
foto: Shibuya Scramble Square

### shibuya-parco
nome: Shibuya PARCO (6° piano)
tipo: 🎮 Shopping nerd
città: tokyo
giorno: 17/11
nota: Nintendo, Pokémon, Capcom, Jump Shop
maps: Shibuya PARCO
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g27462805-d2152004-Reviews-Shibuya_PARCO-Udagawacho_Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://en.shibuya.parco.jp/
foto: Shibuya

### omoide-yokocho
nome: Omoide Yokochō
tipo: 🍢 Cena veloce
città: tokyo
giorno: 17/11
nota: Spiedini alla brace e birra, 20:50
maps: Omoide Yokocho Shinjuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133673-d1173749-Reviews-Omoide_Yokocho-Nishishinjuku_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://shinjuku-omoide.com/
foto: Omoide Yokochō

### samurai-restaurant
nome: Samurai Restaurant Time
tipo: 🎭 Spettacolo
città: tokyo
giorno: 17/11
nota: Spettacolo delle 14:00 (ingresso 13:30), ~1 h 40 · DA PRENOTARE per 2
maps: Samurai Restaurant Kabukicho Shinjuku
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g14133667-d27827586-Reviews-SAMURAI_RESTAURANT-Kabukicho_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://samurai-restaurant.tokyo/
foto: Taiko

### golden-gai
nome: Golden Gai
tipo: 🍸 Vita notturna
città: tokyo
giorno: 17/11
nota: Micro-bar, coperto ¥500–1.000
maps: Shinjuku Golden Gai
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133667-d480651-Reviews-Shinjuku_Golden_Gai-Kabukicho_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://goldengai.jp/
foto: Golden Gai

### zojo-ji
nome: Zōjō-ji + Tokyo Tower
tipo: ⛩ Tempio
città: tokyo
giorno: 18/11
nota: 7:30, foto classica
maps: Zojoji Temple Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066451-d320446-Reviews-Zojoji_Temple-Minato_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.zojoji.or.jp/en/
foto: Zōjō-ji

### vermillion
nome: Vermillion Espresso Bar
tipo: ☕ Caffè
città: kyoto
giorno: 11/11
nota: Colazione 9:45 · 9–17 · a due passi dall'ingresso di Fushimi Inari
maps: Vermillion Espresso Bar Fushimi Inari Kyoto
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d5964170-Reviews-Vermillion_espresso_bar_info-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://insidekyoto.com/vermillion-cafe
foto: Espresso

### sanshiki
nome: SANSHIKI (udon)
tipo: 🍜 Ristorante
città: kyoto
giorno: 11/11
nota: Pranzo 11:20 · 11–15, chiuso mar. · solo contanti
maps: 讃式 京都市東山区五条橋東2-9-4
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d9652076-Reviews-Sanshiki-Kyoto_Kyoto_Prefecture_Kinki.html
tabelog: https://tabelog.com/en/kyoto/A2601/A260301/26023919/
voto: 3,53
foto: Udon

### onikai
nome: Onikai (izakaya)
tipo: 🍶 Ristorante
città: kyoto
giorno: 11/11
nota: Cena 19:30 · 17–23, ultimo ordine 22 · DA PRENOTARE per 2 (online)
maps: おにかい 京都市中京区河原町通四条上ル米屋町388
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d7460060-Reviews-Onikai-Kyoto_Kyoto_Prefecture_Kinki.html
tabelog: https://tabelog.com/en/kyoto/A2601/A260201/26002004/
voto: 3,60
foto: Izakaya

### daigin
nome: Daigin Shokudō (trattoria)
tipo: 🍱 Ristorante
città: kyoto
giorno: 12/11
nota: Pranzo 13:15 · 11–20:40, chiuso mer. · ~¥1.000
maps: 大銀食堂 京都市左京区浄土寺東田町60
tabelog: https://tabelog.com/en/kyoto/A2601/A260302/26007440/
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d7437466-Reviews-Daigin_Shokudo-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://insidekyoto.com/daigin-shokudo-northern-higashiyama
foto: Teishoku

### kotetsu
nome: Kushiage Kotetsu
tipo: 🍢 Ristorante
città: kyoto
giorno: 12/11
nota: Cena 19:00 · 18–24, chiuso mer. · solo contanti · DA PRENOTARE per 2 (online)
maps: 串揚げ専門店 コテツ 京都市下京区船頭町232-2
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298564-d7460418-Reviews-Kotetsu-Kyoto_Kyoto_Prefecture_Kinki.html
tabelog: https://tabelog.com/en/kyoto/A2601/A260201/26020610/
voto: 3,58
foto: Kushikatsu

### irori
nome: Irori (Shirakawa-go)
tipo: 🍲 Ristorante
città: takayama
giorno: 14/11
nota: Pranzo 12:30 · 10–14 · carte JCB/AMEX e PayPay · DA PRENOTARE per 2 (online)
maps: いろり 白川村荻町374-1
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g1119912-d5036818-Reviews-Irori-Shirakawa_mura_Ono_gun_Gifu_Prefecture_Tokai_Chubu.html
tabelog: https://tabelog.com/en/gifu/A2104/A210404/21003222/
voto: 3,47
foto: Irori

### kobe-ishida
nome: Kobe Steak Ishida LINKS UMEDA
tipo: 🥩 Ristorante
città: osaka
giorno: 15/11
nota: Cena 18:30 · manzo di Kobe al teppanyaki · DA PRENOTARE per 2
maps: Kobe Beef Steak Ishida LINKS UMEDA, Osaka
tabelog: https://tabelog.com/en/osaka/A2701/A270101/27114781/
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g298566-d19617987-Reviews-Ishida_Links_Umeda-Osaka_Osaka_Prefecture_Kinki.html
sito: https://myconciergejapan.com/restaurants/kobe-steak-ishida-links-umeda
foto: Kobe beef

### sushi-ten
nome: Sushi Tokyo Ten Shibuya
tipo: 🍣 Ristorante
città: tokyo
giorno: 17/11
nota: Cena 19:00 · omakase ¥9.900 · solo carta · DA PRENOTARE per 2 (TableCheck)
maps: Sushi Tokyo Ten Shibuya Stream
tabelog: https://tabelog.com/en/tokyo/A1303/A130301/13225919/
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g1066456-d23934063-Reviews-Sushi_Tokyo_Ten_Shibuya-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.tablecheck.com/en/shops/sushitokyo-ten-shibuya/reserve
voto: 3,56
foto: Sushi

### monja-kondo
nome: Monja Kondō Honten (Tsukishima)
tipo: 🥞 Ristorante
città: tokyo
giorno: 9/11
nota: Cena dopo teamLab · 17–22, ultimo ordine 21:30 · prenotabile online anche in giornata
maps: もんじゃ近どう 本店 東京都中央区月島3-12-10
tabelog: https://tabelog.com/tokyo/A1313/A131302/13012771/
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g14129637-d6060617-Reviews-Kondo_Honten-Tsukishima_Chuo_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.hotpepper.jp/strJ000103075/
foto: Monjayaki

## Glossario


### Trasporti
- Shinkansen: Il treno superveloce (fino a 300 km/h) che collega le grandi città
- Nozomi: Il tipo di Shinkansen più veloce (Nozomi 287 = numero del treno)
- JR: Japan Railways, le ferrovie principali (treni urbani, regionali e Shinkansen)
- Yamanote: La linea JR circolare del centro di Tokyo (Shinjuku, Shibuya, Hamamatsuchō…)
- Metro / Toei: A Tokyo ci sono due reti di metro: Tokyo Metro e Toei (es. linea Ōedo, linea Asakusa); stessa Suica
- Keikyu: Treno privato che parte dall'aeroporto di Haneda e prosegue nella metro di Tokyo
- Fuji Excursion: Treno espresso diretto Shinjuku ↔ lago Kawaguchiko, solo posti prenotati
- Fujikyu: Ferrovia locale del Fuji (Ōtsuki – Shimoyoshida – Kawaguchiko)
- Enoden: Trenino storico sul mare tra Fujisawa e Kamakura
- Randen: Tram storico di Kyoto che va ad Arashiyama
- Keihan: Linea ferroviaria privata di Kyoto (Fushimi Inari, Gion, Kiyomizu-Gojō)
- Hida (treno): Treno espresso tra le montagne per Takayama
- Nōhi Bus: Compagnia dei bus di Takayama (corse per Shirakawa-go e gite organizzate)
- Midōsuji: La linea principale della metro di Osaka (Shin-Osaka, Umeda, Shinsaibashi, Namba)
- Suica: Tessera ricaricabile (anche sull'iPhone, nel Wallet) per metro, treni locali, bus e conbini
- Shin-Osaka: La stazione dello Shinkansen di Osaka, diversa dalla stazione centrale (Osaka/Umeda)

### Parole utili
- -eki: Stazione (Kyoto-eki = stazione di Kyoto)
- -ji / -dera: Tempio buddista (Senso-ji, Kiyomizu-dera)
- Jinja / -gū / Taisha: Santuario shintoista (Meiji Jingū, Fushimi Inari Taisha)
- Torii: Il portale rosso all'ingresso dei santuari shintoisti
- -dōri / -suji: Via, strada (Takeshita-dōri, Sanmachi-suji)
- Yokochō: Vicolo pieno di localini e bancarelle (Omoide Yokochō)
- -bashi: Ponte (Azuma-bashi, Nakabashi)
- -zaka: Salita, strada in pendenza (Sannenzaka, Ninenzaka)
- Konbini: Minimarket aperti 24 h (7-Eleven, Lawson, FamilyMart): cibo, bancomat, bagni
- Depachika: I piani interrati dei grandi magazzini: enormi food hall di piatti pronti
- Onsen: Terme naturali; si entra nudi e lavati, tatuaggi spesso vietati
- Sentō: Bagno pubblico di quartiere (acqua calda normale, non termale)
- Izakaya: Osteria giapponese: tanti piattini da condividere e birra
- Purikura: Cabine per foto-adesivi con ritocchi digitali
- Gachapon: Distributori di gadget a capsule (¥100–500)
- Kawaii: «Carino»: lo stile tenero e colorato di Harajuku
- Gasshō-zukuri: Le case col tetto di paglia a punta di Shirakawa-go («mani giunte in preghiera»)
- Maiko / geiko: Apprendista geisha / geisha (a Kyoto si dice geiko)
- Kabuki: Teatro tradizionale con trucco e costumi vistosi, solo attori uomini
- Momiji / kōyō: Gli aceri rossi / il foliage d'autunno

### Cibo
- Ramen: Spaghetti in brodo con carne e uova
- Tsukemen: Ramen «da intingere»: spaghetti freddi a parte e brodo denso caldo
- Udon: Spaghettoni spessi di grano
- Hoto: Zuppa di tagliatelle larghe con zucca e verdure, tipica del Fuji
- Okonomiyaki: Frittata-pizza di cavolo e pastella cotta sulla piastra, tipica di Osaka
- Negiyaki: Okonomiyaki con tanto cipollotto al posto del cavolo
- Takoyaki: Polpette di pastella con un pezzo di polpo
- Kushikatsu: Spiedini impanati e fritti; la salsa è comune: si intinge una volta sola
- Hida beef: Manzo pregiato della zona di Takayama, molto marmorizzato
- Hoba miso: Miso con verdure e carne cotto su una grande foglia sul braciere
- Tamagoyaki: Frittata giapponese dolce, arrotolata a strati
- Mochi: Dolcetti morbidi di riso pestato
- Matcha: Tè verde in polvere
- Ekiben: Il cestino-pranzo da treno, venduto in stazione
- Sakè: Il vino di riso; nelle distillerie si assaggia a pagamento

### App e servizi
- Tabelog: Il sito di recensioni dei ristoranti più usato dai giapponesi: sopra 3,5 è già molto buono
- Klook: Sito dove avete comprato i biglietti dei treni
- Visit Japan Web: Il modulo online per immigrazione e dogana: si mostra il QR all'arrivo
- Tax-free: Acquisti senza IVA (10%) per turisti; il rimborso si fa all'aeroporto prima di imbarcare le valigie
- Area Timed Entry: Il biglietto a orario per entrare nell'area Nintendo di Universal Studios Japan
