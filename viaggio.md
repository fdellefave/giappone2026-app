# Giappone 2026 — fonte dati

Unica fonte di verità del viaggio (5–18 novembre 2026, Federico + un amico). Il sito
https://fdellefave.github.io/giappone2026-app/ si genera da questo file con `python3 build.py`.
Dopo ogni modifica: build, controllo degli avvisi, commit e push su `fdellefave/giappone2026-app`.
Questo file vive solo qui: non tenerne copie nel progetto Claude «Giappone».

## Sintassi

- Sezioni `##`, voci `### id`, campi `chiave: valore` (una riga ciascuno).
- Giorno `### AAAA-MM-GG`: campi `percorso` (città separate da `>`), `dorme` (id alloggio o `volo`), `con`,
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
    · `fuso: roma` (orario italiano) · `foto: titolo` (pagina di Wikipedia in inglese da cui prendere la foto)
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
- Nei giorni col gruppo (7–10/11) si segue il programma del gruppo: solo note e indicazioni, niente riordini.
- A piedi le tratte sotto i 3 km, oltre coi mezzi (con mezzo e minuti); 10–15 km a piedi al giorno.
- Due 30enni un po' nerd: templi in 1–2 h, cose «wow», sale giochi e quartieri otaku, vita serale, cibo buono non
  da trappola turistica (ma i must-see restano). Niente musei d'arte moderna o cose occidentali. Sì natura, giardini
  zen, samurai e katane, spettacoli serali giapponesi anche strani.
- Giornate troppo piene: si toglie la cosa meno utile.
- Ogni posto con link diretto (Tripadvisor, o la piattaforma più nota); link verificati, mai inventati.
- Il sito è pubblico: mai link di conferma, numeri di prenotazione, PIN, numeri di passaporto o dati di pagamento.
- App: poco testo a colpo d'occhio (titolo corto + dettagli a scomparsa), niente simboli giapponesi.
  Un posto = una sola riga: lo spostamento per arrivarci sta dentro la tappa. «Indicazioni» = da dove sei a lì,
  senza mezzo preimpostato. Ogni mattina si parte dall'hotel. Deposito e ritiro valigie sempre come tappe esplicite.
  Ricerca globale che capisce nomi scritti male. Una sola pagina (l'itinerario), niente schede: cosa manca da
  prenotare o sistemare si vede come numero rosso sul giorno e sulla tappa. Ogni nome giapponese ha la sua
  spiegazione tra parentesi direttamente nel titolo della tappa (es. «Kiyomizu-dera (tempio)»).
  Meteo sotto il titolo del giorno (Open-Meteo, senza chiave): com'è adesso in ogni città del giorno e, nei 16 giorni
  prima, le previsioni per quella data; si aggiorna all'apertura (max 1 volta l'ora) e ogni 3 ore.
  iOS 26 sfoca da solo una fascia sotto la barra di stato nell'app installata: la barra dei giorni parte 40 px più in basso.

Già verificato (non riproporre):
- Escluse Kanazawa (doppione di Kyoto) e Nara/Himeji (al loro posto la giornata nerd a Osaka il 15/11).
- Statua del Gundam di Odaiba rimossa ad agosto 2026; Nintendo Museum (Uji) solo a lotteria; illuminazione di
  Eikan-dō dal 20/11 (dopo Kyoto); Tofuku-ji, Kuromon, Hama-rikyu, Ōkochi-Sansō e Hida-no-Sato tolti apposta.
- Il torneo di sumo di novembre è a Fukuoka (fuori rotta). Asakusa Sumo Club (~$100) tolto su richiesta: al suo posto la serata ad Akihabara.
- Lake Bake: bar interno chiuso, solo asporto. Omen (udon a Ginkaku-ji) chiuso il giovedì: il 12/11 non si va.
- Super Potato di Osaka = negozio Otaroad a Nipponbashi (Den Den Town).
- Shibuya Sky: biglietti 2 settimane prima alle 00:00 giapponesi. Bus Nōhi per Shirakawa-go: prenotazioni 1 mese prima.
- Le coordinate dei posti non sono disponibili: la mappa del sito usa ricerche Google Maps.
- Pagamenti (dalle email di conferma, 3/10): hotel, Airbnb e treni Klook li ha prenotati Federico per 2 persone.
  Klook: pagati il 7/9, i biglietti vengono confermati quando apre la vendita ufficiale (un mese prima).
  Booking: Super Hotel già pagato; gli altri li addebita Booking sulla carta. I prezzi veri degli hotel sono in yen.

Punti aperti: sono nella sezione «Da fare», ognuno agganciato alla sua tappa (l'app li mostra come notifiche).
- Chi ha pagato i voli e la quota del cottage non risulta dalle email: chiedere a Federico se serve nei conti.

## Info

partenza: 2026-11-05T15:05+01:00
cambio: 185
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
  L'annuncio offre il deposito bagagli: da confermare con l'host.
  Ingresso autonomo con cassetta delle chiavi dalle 15:00.
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
  breve: tramonto alle 16:42 con la Skytree
  A 5′ a piedi dal tempio. La Skytree è la torre della tv, 634 m.
- 17:00 vedere Senso-ji (tempio) illuminato | posto: senso-ji
  breve: vuoto e scenografico
- 17:30 sposta Super Potato, Akihabara | via mezzi: #senso-ji > #super-potato-akiba (Senso-ji → Akihabara)
  breve: treno 5′ + a piedi 8′
  come: 7′ a piedi alla stazione Asakusa della Tsukuba Express (treno veloce per Akihabara), treno fino ad Akihabara (5′), 5′ a piedi
  costo: ~¥210 a testa con la Suica
  Akihabara è il quartiere di elettronica, manga e videogiochi.
- 17:50 fare Super Potato (videogiochi retro) | posto: super-potato-akiba
  breve: 3 piani di console e cartucce + sala giochi anni '80–'90
  Il negozio di videogiochi retro più famoso di Tokyo: Famicom (il NES giapponese), Super Nintendo, Game Boy, Sega. All'ultimo piano una piccola sala giochi d'epoca.
  orari: chiude verso le 20
- 18:50 sposta Radio Kaikan | via piedi: #super-potato-akiba > #radio-kaikan (Super Potato → Radio Kaikan)
  breve: a piedi 5′
- 18:55 fare Radio Kaikan (figure e manga) | posto: radio-kaikan
  breve: 10 piani di negozi di figure, modellini e carte da collezione
  Al piano terra e in tutto il quartiere ci sono i gachapon (distributori di gadget a capsule, ¥100–500).
- 19:45 sposta Kyushu Jangara | via piedi: #radio-kaikan > #kyushu-jangara (Radio Kaikan → ramen)
  breve: a piedi 8′
- 20:00 cibo Kyushu Jangara (ramen) | posto: kyushu-jangara
  breve: cena: ramen col brodo di maiale denso
  Ramen tonkotsu (brodo di ossa di maiale, cremoso) in stile Kyushu; c'è anche la versione vegana. Niente prenotazioni.
  orari: 11–22, ultimo ordine 21:45
- 20:45 sposta Sale giochi di Akihabara | via piedi: #kyushu-jangara > #hey-akihabara (Ramen → sale giochi)
  breve: a piedi 5′
- 20:50 fare Sale giochi di Akihabara | posto: hey-akihabara
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

#### Guida
senso: Arrivo e prima immersione: Asakusa (la Tokyo antica, col tempio Senso-ji), poi serata nerd ad Akihabara (il quartiere dei videogiochi): giochi retro, figure, ramen e sale giochi. Chiusura con la testa di Godzilla. Giornata lunga per il jet lag: con calma.
mangiare:
  • Pranzo: Fūunji, tsukemen (ramen da intingere), tra i migliori di Tokyo (Tabelog 3,77). Chiude alle 15: se siete in ritardo, Kura Sushi ad Asakusa (sushi su nastro, si ordina dal tablet)
  • Cena: Kyushu Jangara ad Akihabara, ramen col brodo di maiale (11–22)
prenotare:
  • Messaggio all'host dell'Airbnb per lasciare le valigie alle 13:30
  • Carta Suica (tessera per metro e treni) già sul telefono
attenzione:
  • Da Fūunji c'è coda e alle 15 chiude
  • Il Senso-ji chiude la sala alle 17, ma la zona resta aperta e illuminata
anticipo:
  • Kappabashi (la via dei negozi da cucina e del cibo finto in plastica), fino alle 17
  • Distributori di gadget a capsule (gachapon) ovunque ad Akihabara
stanchi: • Dopo cena saltate le sale giochi e la testa di Godzilla: treno JR per Shinjuku (18′) e a letto
camminata: ~10 km · mezzi ~1 h 30 in tutto · pause: pranzo 45′, cena 45′

### 2026-11-07
percorso: tokyo > kawaguchiko
dorme: cottage-pastorale
con: voi due + il gruppo
- 08:30 hotel Check-out dall'Airbnb | alloggio: airbnb-shinjuku
  breve: entro le 10 · colazione al konbini (minimarket)
  Colazione al konbini (i minimarket aperti 24 h: 7-Eleven, Lawson, FamilyMart).
- 08:40 sposta Stazione JR di Shinjuku | via piedi: @airbnb-shinjuku > Shinjuku Station, Tokyo (Airbnb → stazione di Shinjuku)
  breve: a piedi 20′ con le valigie · al binario alle 9:15
  alternativa: taxi 7′ (~¥1.000)
- 09:30 viaggio Treno Fuji Excursion per Kawaguchiko (lago del Fuji) | foto: Fuji Excursion | treno: fuji-7 | prenotato | dove: Shinjuku Station, Tokyo
  breve: 9:30 → 11:28 · diretto
  Treno diretto per il Monte Fuji fino a Kawaguchiko (il paese sul lago ai piedi del Fuji).
  Alle 11:14 passa da Shimoyoshida, la stazione della pagoda Chureito.
- 11:30 bagagli Valigie negli armadietti della stazione | città: kawaguchiko | deposito | dove: Kawaguchiko Station
  breve: stazione di Kawaguchiko · o con la navetta dell'host
  Armadietti a gettoni nella stazione; in alternativa l'host del cottage può portarle con la navetta.
- 11:40 sposta Lake Bake | via taxi: Kawaguchiko Station > #lake-bake (Stazione → Lake Bake)
  breve: taxi 10′ · ~¥2.000
- 12:00 cibo Lake Bake (panetteria sul lago) | posto: lake-bake
  breve: pane sul lago e picnic vista Fuji
  Panetteria sul lago (chiusa il mercoledì). Il bar interno è chiuso: pane da asporto e picnic sulla riva.
  alternativa: se il Fuji è nitido e per domani danno brutto, pagoda [[chureito]] subito (treno 15′)
- 13:30 sposta Stazione di Kawaguchiko | via taxi: #lake-bake > Kawaguchiko Station (Lake Bake → stazione)
  breve: taxi 10′
- 13:50 bagagli Ritiro valigie dagli armadietti | ritiro | dove: Kawaguchiko Station
  breve: prima che arrivino gli amici
- 14:00 fare Arrivano gli amici | dove: Kawaguchiko Station
  breve: dal bus delle 8:40 da Takayama
- 14:10 sposta Cottage Pastorale | via taxi: Kawaguchiko Station > @cottage-pastorale (Stazione → Cottage)
  breve: navetta dell'host o taxi ~10′
  Il cottage è sulla sponda nord del lago.
- 15:00 hotel Check-in al Cottage Pastorale | alloggio: cottage-pastorale
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
  • Chiedere all'host del cottage navetta dalla stazione e deposito valigie
  • Contanti per la cena
attenzione:
  • Il Tenku no Torii chiude verso le 16 ed è a 20–30′ di salita: se il gruppo arriva tardi, meglio rimandarlo
  • Il 7/11 è il primo giorno del festival degli aceri: folla
  • Il bus turistico smette verso le 17:45: poi solo taxi (pochi)
anticipo:
  • Pagoda Chureito (la foto simbolo del Fuji) subito, treno 15′, se il Fuji è limpido e per domani danno brutto
  • Santuario Kawaguchi Asama (cedri secolari), vicino al cottage
stanchi: • Saltate il Tenku no Torii: viale degli aceri + cena bastano
camminata: ~10 km (salita al Tenku no Torii) · treno 2 h · pause: pranzo 1 h 15, cena 1 h

### 2026-11-08
percorso: kawaguchiko
dorme: cottage-pastorale
con: voi due + il gruppo
- 08:00 fare Giro del lago in bici | foto: Lake Kawaguchi | dove: Lake Kawaguchi
  breve: col gruppo · bici tramite il cottage
  La pagoda Chureito e Honcho Street si fanno il 9/11.
- 13:00 cibo Miura Udon (spaghettoni udon) | posto: miura-udon
  breve: pranzo, se passate da Fujiyoshida · solo 10–14
  Udon spessi e sodi tipici della zona (Tabelog 3,65). Chiuso il mercoledì.
- 14:00 vedere Panorami sul Fuji | foto: Mount Fuji | dove: Oishi Park, Fujikawaguchiko
  breve: per esempio Oishi Park, sulla sponda nord
- 16:00 fare Onsen (bagno termale) o funivia sul lago | posto: funivia-kachi-kachi
  breve: terme con vista Fuji o funivia sul lago
  Onsen: le terme giapponesi (si entra lavati e nudi). La funivia porta a un belvedere sul lago e sul Fuji: solo se il Fuji è scoperto.
  costo: funivia andata e ritorno ¥1.000
  orari: funivia fino alle 17
- 18:00 hotel Relax al cottage | alloggio: cottage-pastorale
- 20:00 cibo Cena col gruppo

#### Guida
senso: Giornata col gruppo intorno al lago: bici, panorami sul Fuji, terme.
mangiare:
  • Pranzo: se passate da Fujiyoshida, Miura Udon (udon spessi e sodi tipici della zona, Tabelog 3,65; solo 10–14)
  • Cena col gruppo
prenotare:
  • Bici tramite il cottage
  • Contanti per terme e funivia
attenzione:
  • Il Fuji è più limpido al mattino: foto prima delle 10
  • Domenica + festival degli aceri = folla ovunque
anticipo:
  • Funivia Kachi Kachi (panorama sul lago e sul Fuji, fino alle 17): solo se il Fuji è scoperto
  • Onsen (terme) prima di cena
stanchi: • Saltate la funivia, tenete bici e cena
camminata: ~5 km a piedi + 15–20 km in bici · pause: pranzo 1 h, cottage 1 h, cena 1 h 30

### 2026-11-09
percorso: kawaguchiko > tokyo
dorme: saibo
con: voi due + il gruppo
- 06:45 hotel Check-out dal cottage (proposta) | alloggio: cottage-pastorale
  breve: proposta al gruppo: uscire presto con le valigie
  Il check-out sarebbe entro le 10, ma dopo Honcho Street servono ~40′ per tornare al cottage.
- 06:55 bagagli Valigie negli armadietti della stazione (proposta) | deposito | dove: Kawaguchiko Station
  breve: stazione di Kawaguchiko, taxi dal cottage ~10′
- 07:05 sposta Pagoda Chureito | via mezzi: Kawaguchiko Station > #chureito (Stazione → pagoda Chureito)
  breve: treno locale 15′ + a piedi 10′ e ~400 scalini
  come: treno locale Fujikyu da Kawaguchiko a Shimoyoshida (~15′, col gruppo), 10′ a piedi (700 m) e ~400 scalini
  costo: treno ¥310
  Se tenete il check-out alle 10: taxi dal cottage alla stazione (~10′) e niente armadietti.
- 08:00 vedere Pagoda Chureito | posto: chureito
  breve: la foto simbolo del Giappone
  Pagoda rossa a 5 piani col Fuji dietro.
- 08:45 sposta Honcho Street | via piedi: #chureito > #honcho-street (Chureito → Honcho Street)
  breve: a piedi 15′ · 1 km
- 09:00 vedere Honcho Street | posto: honcho-street
  breve: la via col Fuji enorme in fondo
  attenzione: il check-out del cottage è entro le 10 ma da qui servono ~40′. Proposta: check-out alle 6:45 e valigie in stazione
- 09:45 sposta Lago Kawaguchi | via mezzi: Shimoyoshida Station, Fujiyoshida > Lake Kawaguchi (Shimoyoshida → lago)
  breve: treno 15′ fino a Kawaguchiko
- 10:15 vedere Tempo libero al lago | foto: Lake Kawaguchi | dove: Lake Kawaguchi
- 12:00 cibo Pranzo al lago | dove: Kawaguchiko Station
  breve: poi alla stazione
- 13:45 bagagli Ritiro valigie dagli armadietti | ritiro | dove: Kawaguchiko Station
  breve: prima del treno
- 14:09 viaggio Treno Fuji Excursion per Shinjuku (Tokyo) | foto: Fuji Excursion | treno: fuji-9 | prenotare | dove: Kawaguchiko Station
  breve: 14:09 → 16:07 (o 15:00 → 16:59)
  Lo compra il gruppo il 9/10: verificate che prenda anche i vostri 2 posti.
- 16:10 sposta Hotel Saibo | città: tokyo | via mezzi: Shinjuku Station, Tokyo > @saibo (Shinjuku → Hotel Saibo)
  breve: metro 22′ senza cambi
  come: 7′ a piedi ai binari della metro Toei, metro linea Toei Shinjuku fino a Hamachō (22′), 6′ a piedi
  costo: ~¥280
- 16:45 hotel Check-in all'Hotel Saibo | alloggio: saibo
  breve: valigie in camera
  Ningyōchō è un quartiere tranquillo vicino a Tokyo Station.
- 18:00 cibo Spuntino a Ningyōchō (quartiere antico) | foto: Ningyōchō | dove: Ningyocho, Tokyo
  breve: quartiere di botteghe di dolci
- 18:20 sposta teamLab Planets | via mezzi: @saibo > #teamlab (Hotel Saibo → teamLab)
  breve: metro ~35′ o taxi 20′
  come: metro Hibiya line fino a Ginza, 5′ a piedi a Ginza-itchōme, metro Yūrakuchō line fino a Toyosu, 12′ a piedi
  alternativa: taxi 20′ (~¥3.000)
- 19:00 fare teamLab Planets (museo di luci digitali) | posto: teamlab | prenotato
  breve: col gruppo · ingresso 19:00–19:30
  Museo d'arte digitale: stanze di luci e specchi, si cammina nell'acqua.
  attenzione: acqua fino al ginocchio (pantaloncini in prestito gratis); armadietti piccoli (23×34×37 cm): la valigia resta in hotel
- 21:00 cibo Cena da SUMO (ristorante a tema)
  breve: ristorante a tema sumo, col gruppo
  attenzione: non risulta nel file del gruppo: da verificare
- 22:30 sposta Hotel Saibo | via mezzi: #teamlab > @saibo (teamLab → Hotel Saibo)
  breve: metro ~35′ o taxi 20′

#### Guida
senso: Mattina col gruppo alla pagoda Chureito (la foto simbolo del Fuji), pomeriggio in treno a Tokyo, sera a teamLab (museo di luci digitali dove si cammina nell'acqua).
mangiare:
  • Pranzo al lago prima del treno
  • Cena col gruppo da SUMO (da verificare), o dopo le 21 vicino all'hotel
prenotare:
  • Treno Fuji Excursion del pomeriggio: lo compra il gruppo il 9/10 alle 3:00 italiane, verificate che prendano anche i vostri 2 posti
  • teamLab già prenotato dal gruppo
  • Pantaloni arrotolabili per teamLab
attenzione:
  • Il check-out del cottage è entro le 10 ma dal centro al cottage servono 40′: proposta al gruppo di uscire alle 6:45 con le valigie e lasciarle in stazione
  • A teamLab gli armadietti sono piccoli: la valigia resta in hotel
anticipo: • Giro a Ningyōchō (quartiere tradizionale con botteghe di dolci) prima di teamLab
stanchi: • Giornata già leggera, niente da tagliare
camminata: ~10 km (400 scalini della Chureito) · treni ~3 h · pause: lago 1 h 30, pranzo 1 h, cena 1 h

### 2026-11-10
percorso: tokyo > kamakura > tokyo > kyoto
dorme: apa-kyoto
con: voi due + il gruppo, la sera solo voi due
- 06:30 hotel Check-out dall'Hotel Saibo | alloggio: saibo
  breve: alle 6:30, prima del treno del gruppo
- 06:32 bagagli Valigie in deposito all'Hotel Saibo | alloggio: saibo | deposito
  breve: le riprendete alle 18:40
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
- 16:40 vedere Tramonto sul mare a Koshigoe | foto: Enoshima | dove: Koshigoe Beach, Kamakura
- 17:05 sposta Hotel Saibo | via mezzi: Koshigoe Station, Kamakura > @saibo (Koshigoe → Hotel Saibo)
  breve: trenino + treno + metro ~1 h 20
  come: Enoden fino a Fujisawa (15′), treno JR fino a Shimbashi (45′) col gruppo, metro Toei Asakusa fino a Ningyōchō (10′)
  attenzione: partite da Fujisawa entro le 17:45 per non perdere lo Shinkansen
- 18:40 bagagli Ritiro valigie all'Hotel Saibo | città: tokyo | alloggio: saibo | ritiro
  breve: poi taxi per Tokyo Station
- 18:45 sposta Gransta, Tokyo Station | via taxi: @saibo > #gransta (Hotel Saibo → Tokyo Station)
  breve: taxi 10′ (a piedi 25′)
- 19:00 cibo Ekiben (cestino da treno) da Gransta | posto: gransta
  breve: la cena da mangiare in treno
  Ekiben: il cestino-pranzo da treno. A Gransta, dentro la stazione, ce ne sono oltre 150 tipi.
- 20:09 viaggio Shinkansen (treno superveloce) Tokyo → Kyoto | foto: Tōkaidō Shinkansen | treno: shink-10 | prenotato
  breve: 20:09 → 22:21 · Nozomi 287
  Lo Shinkansen è il treno superveloce. Cena a bordo con l'ekiben.
  attenzione: valigia oltre 160 cm (somma dei lati): serve il posto con spazio bagagli, verificate il biglietto
- 22:21 sposta APA Hotel Kyoto | città: kyoto | via piedi: Kyoto Station > @apa-kyoto (Stazione di Kyoto → APA Hotel)
  breve: a piedi 7′ dall'uscita Central
- 22:30 hotel Check-in all'APA Hotel Kyoto | alloggio: apa-kyoto
  breve: 3 notti
  Saluti agli amici: volano il 12.
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
  • Shinkansen già pagato: valigia oltre 160 cm (somma dei lati) = serve il posto con spazio bagagli
  • Avvisare l'Hotel Saibo che ritirate le valigie alle 18:40
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
- 09:45 cibo Colazione vicino al santuario | dove: Fushimi Inari Station, Kyoto
  breve: seduti, con calma
  Ieri siete arrivati alle 22:21: pausa lunga.
- 11:00 sposta Higashiyama | via mezzi: #fushimi-inari > Gojozaka, Higashiyama, Kyoto (Fushimi Inari → Higashiyama)
  breve: treno 10′ + a piedi 15′
  come: treno Keihan (linea locale) da Fushimi-Inari a Kiyomizu-Gojō (10′), poi 15′ a piedi (1,2 km)
- 11:45 cibo Pranzo a Higashiyama (quartiere storico) | dove: Gojozaka, Higashiyama, Kyoto
  breve: tra Gojō-zaka e Matsubara-dōri
  Higashiyama è il quartiere storico a est.
- 12:45 sposta Kiyomizu-dera | via piedi: Gojozaka, Higashiyama, Kyoto > #kiyomizu-dera (Pranzo → Kiyomizu-dera)
  breve: a piedi 10′ in salita
- 13:00 vedere Kiyomizu-dera (tempio) | posto: kiyomizu-dera
  breve: tempio di legno su palafitte
  La terrazza di legno guarda tutta la città.
- 14:15 vedere Sannenzaka e Ninenzaka (vicoli antichi) | posto: sannenzaka
  breve: vicoli antichi · pausa tè alle 15:30
  Vicoli in salita con case di legno e negozietti.
- 16:15 sposta Pagoda di Yasaka | via piedi: Ninenzaka, Kyoto > #pagoda-yasaka (Ninenzaka → pagoda di Yasaka)
  breve: a piedi 10′
- 16:30 vedere Pagoda di Yasaka | posto: pagoda-yasaka
  breve: tramonto alle 16:55
  La foto classica di Kyoto, dalla salita di Yasaka-dōri.
- 17:00 sposta Hanami-kōji | via piedi: #pagoda-yasaka > #hanami-koji (Pagoda → Hanami-kōji)
  breve: a piedi 10′
- 17:10 vedere Gion (quartiere delle geisha) e Hanami-kōji | posto: hanami-koji
  breve: la via delle geisha, lanterne accese
  attenzione: niente foto alle geisha da vicino e niente vicoli privati (multe)
- 18:00 fare Gion Corner (spettacolo di arti tradizionali) | posto: gion-corner | prenotare
  breve: 1 h di arti tradizionali
  Assaggi di danza delle maiko (apprendiste geisha), teatro comico e marionette.
  costo: ~¥5.500 a testa
  prenotazione: ore 18:00 per 2, biglietti non rimborsabili
- 19:00 sposta Pontochō | via piedi: #gion-corner > #pontocho (Gion Corner → Pontochō)
  breve: a piedi 15′
- 19:15 cibo Izakaya (osteria) a Pontochō | posto: pontocho
  breve: cena nel vicolo dei ristoranti sul fiume
  Izakaya: osteria giapponese, piattini da condividere e birra.
- 20:45 fare Bar lungo il canale (Kiyamachi-dōri) | posto: kiyamachi
  breve: bar e osterie lungo il canale
  Bar in piedi e birra artigianale, fino a mezzanotte.
  alternativa: [[kodai-ji]] illuminato (17–22, ¥800)
- 23:00 sposta Hotel | via mezzi: #kiyamachi > @apa-kyoto (Kiyamachi → hotel)
  breve: taxi 12′ o metro
  come: taxi 12′ (~¥1.500), oppure 12′ a piedi fino a Shijō, metro Karasuma fino a Kyoto (4′), 7′ a piedi

#### Guida
senso: Kyoto classica: santuario dei portali rossi all'alba, tempio su palafitte, vicoli antichi, quartiere delle geisha al tramonto, spettacolo di arti tradizionali e serata nei bar lungo il canale.
mangiare:
  • Colazione seduti vicino a Fushimi Inari dopo la salita
  • Pranzo in zona Higashiyama (quartiere storico) verso le 11:45
  • Cena in una izakaya (osteria giapponese, piattini da condividere) a Pontochō, il vicolo dei ristoranti sul fiume
prenotare:
  • Gion Corner ore 18:00 per 2 (non rimborsabile)
  • Contanti per i locali piccoli
attenzione:
  • Fushimi Inari dopo le 9 si riempie: partite presto
  • Foliage in ritardo nel 2026: aceri ancora verdi a metà novembre
  • A Gion non si fotografano le geisha da vicino e non si entra nei vicoli privati (multe)
anticipo: • Kōdai-ji illuminato (tempio con giardino e bambù illuminati, 17–22, ¥800) dopo cena
stanchi: • Saltate Kiyamachi: cena a Gion e a letto. Non tagliate Kiyomizu
camminata: ~13 km (salita a Fushimi) · mezzi 30′ · pause: colazione 1 h 15, pranzo 1 h, tè 30′, Gion Corner 1 h, cena 1 h 15

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
- 12:45 sposta Ginkakuji-michi | via taxi: #kinkaku-ji > Ginkakuji-michi, Kyoto (Kinkaku-ji → Ginkakuji-michi)
  breve: taxi 25′ o bus 40′
  costo: taxi ~¥3.000 (7 km) · bus 204 con la Suica
- 13:15 cibo Pranzo in Ginkakuji-michi | dove: Ginkakuji-michi, Kyoto
  breve: la via davanti al Padiglione d'Argento
  Omen (udon famosi) oggi è chiuso: è giovedì.
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
- 17:15 sposta Mercato di Nishiki | via mezzi: Keage Station, Kyoto > #nishiki (Keage → Nishiki)
  breve: metro 8′ + a piedi 8′
  come: metro Tōzai line da Keage a Kyoto Shiyakusho-mae (il municipio), 8′ a piedi
- 17:30 cibo Mercato di Nishiki | posto: nishiki
  breve: via coperta di banchi di cibo · chiude 17–18
  alternativa: [[samurai-ninja-museum]] (armature, prova con la katana; fino alle 18:30)
- 19:00 cibo Ramen Sen no Kaze | posto: sen-no-kaze | via piedi: #nishiki > #sen-no-kaze (Nishiki → Sen no Kaze)
  breve: cena in via Shinkyōgoku
  Molto amato su Tripadvisor (voto Tabelog basso, 3,10).
  orari: 12–21, chiuso martedì e mercoledì
- 20:00 sposta Hotel | via mezzi: #sen-no-kaze > @apa-kyoto (Sen no Kaze → hotel)
  breve: metro 4′ + a piedi 7′ (o taxi 10′)
  come: metro Karasuma da Shijō a Kyoto
- 20:30 hotel Relax, a letto presto | alloggio: apa-kyoto
  breve: domani treno alle 8:31
  L'APA ha un bagno pubblico interno (15:00–01:00), un sentō (bagno pubblico giapponese) in piccolo.

#### Guida
senso: Kyoto natura e zen: bambù e scimmie ad Arashiyama, giardino di rocce, Padiglione d'Oro e d'Argento, Sentiero del Filosofo, tramonto sui vecchi binari tra gli alberi. È il giorno più pesante.
mangiare:
  • Pranzo in Ginkakuji-michi (la via davanti al Padiglione d'Argento). Omen (udon famosi) oggi è chiuso: è giovedì
  • Cena: Ramen Sen no Kaze, 12–21 (molto amato su Tripadvisor; voto Tabelog basso, 3,10)
prenotare:
  • Contanti: il parco delle scimmie (¥800) accetta solo contanti
  • Scarpe comode: ~15 km
attenzione:
  • Il bosco di bambù è vuoto solo prima delle 8:30
  • Nanzen-ji: ultimo ingresso 16:40
anticipo:
  • Tenryū-ji (giardino zen con laghetto) alle 8:30
  • Eikan-dō (il tempio degli aceri) fino alle 16
  • Samurai & Ninja Museum dopo il tramonto
stanchi:
  • Taxi da Ginkaku-ji a Nanzen-ji, saltando il Sentiero (−2,5 km)
  • Se piove: Toei Kyoto Studio Park (set dei film di samurai con spettacoli di ninja)
camminata: ~15 km (salita al parco delle scimmie), il massimo del viaggio · mezzi ~1 h 30 · pause: pranzo 1 h, cena 1 h

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
  Hotel moderno con onsen (le terme) sul tetto.
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
- 18:00 sposta Kitchen Hida | via piedi: @alpina > #kitchen-hida (Hotel → Kitchen Hida)
  breve: a piedi 12′
- 18:15 cibo Steak House Kitchen Hida | posto: kitchen-hida | prenotare
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
percorso: takayama
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
- 08:10 viaggio Bus per Shirakawa-go | treno: bus-14 | prenotare | dove: Takayama Nohi Bus Center
  breve: 8:10 → 9:00
  Bus Nōhi, con prenotazione.
  costo: ¥2.600 a testa
  prenotazione: dal 14/10, su japanbusonline.com
- 09:00 sposta Belvedere Shiroyama | via piedi: Shirakawa-go Bus Terminal > #belvedere-shiroyama (Bus → belvedere)
  breve: a piedi 20′ in salita (o navetta ~¥200)
- 09:20 vedere Belvedere Shiroyama | posto: belvedere-shiroyama
  breve: il villaggio visto dall'alto
  Andateci per primo: luce bassa e pochi gruppi.
- 09:50 sposta Villaggio di Shirakawa-go | via piedi: #belvedere-shiroyama > #shirakawa-go (Belvedere → villaggio)
  breve: a piedi 15′ in discesa
- 10:00 vedere Shirakawa-go (villaggio dei tetti di paglia) | posto: shirakawa-go
  breve: patrimonio UNESCO
  Case gasshō, coi tetti di paglia a punta («mani giunte»). Entrate in [[casa-wada]], l'unica grande casa visitabile.
  attenzione: restate sui sentieri: risaie e case private sono protette. Il sabato è il giorno più affollato
- 12:15 cibo Pranzo a Shirakawa-go | foto: Shirakawa-gō | dove: Shirakawa-go Ogimachi
  breve: verso mezzogiorno, prima della folla
- 13:30 viaggio Bus per Takayama | treno: bus-14 | prenotare | via mezzi: Shirakawa-go Bus Terminal > @alpina (Shirakawa-go → hotel)
  breve: ~50′ · corsa tra le 13:30 e le 14:30
  Corsa da fissare. All'arrivo 3′ a piedi all'hotel.
- 14:30 hotel Pomeriggio lento all'Alpina | alloggio: alpina
  breve: riposo · onsen sul tetto verso le 16:30
  alternativa: passeggiata tra i templi di Higashiyama, a est del centro
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
senso: Mercato sul fiume all'alba e gita a Shirakawa-go, il villaggio delle case col tetto di paglia; pomeriggio di riposo e terme.
mangiare:
  • Al mercato: mochi grigliati (dolcetti di riso) e sottaceti
  • Pranzo a Shirakawa-go verso le 12, prima della folla
  • Cena: Kyōya, cucina di montagna in una casa antica (hoba miso, Hida beef; Tabelog 3,33)
prenotare:
  • Bus Takayama ↔ Shirakawa-go: prenotabile dal 14/10, andata 8:10 e ritorno sono 2 prenotazioni separate
  • Kyōya ore 18:00 per 2 (telefono o tramite hotel)
attenzione:
  • Il sabato è il giorno più affollato a Shirakawa-go
  • Le case abitate non si visitano, le risaie non si calpestano
anticipo: • Passeggiata nella zona dei templi di Takayama (Higashiyama, a est del centro)
stanchi: • Saltate il mercato e prendete un bus più tardi; non tagliate Shirakawa-go
camminata: ~9 km (salita al belvedere) · bus 1 h 40 · pause: pranzo 1 h, riposo 2 h, terme 1 h, cena 1 h 30

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
  Shin-Osaka è la stazione dello Shinkansen di Osaka, diversa dalla stazione centrale.
- 12:00 sposta Hotel Hillarys | città: osaka | via mezzi: Shin-Osaka Station > @hillarys (Shin-Osaka → Hotel Hillarys)
  breve: metro 15′ + a piedi 4′
  come: metro Midōsuji da Shin-Osaka a Shinsaibashi
- 12:20 bagagli Valigie all'Hotel Hillarys | alloggio: hillarys | deposito
  breve: check-in dalle 15
- 12:25 sposta Dōtonbori | via piedi: @hillarys > #dotonbori (Hotel → Dōtonbori)
  breve: a piedi 10′
- 12:35 cibo Street food a Dōtonbori | posto: dotonbori
  breve: takoyaki (polpette di polpo)
  Dōtonbori è il canale coi neon giganti, il cuore di Osaka.
- 13:30 sposta Den Den Town | via piedi: #dotonbori > #den-den-town (Dōtonbori → Den Den Town)
  breve: a piedi 15′
- 13:45 fare Den Den Town (quartiere nerd) | posto: den-den-town
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
- 18:00 sposta Fukutaro | via piedi: @hillarys > #fukutaro (Hotel → Fukutaro)
  breve: a piedi 12′
- 18:15 cibo Fukutaro (okonomiyaki) | posto: fukutaro
  breve: la frittata-pizza di Osaka · niente prenotazioni, c'è coda
  Okonomiyaki: la frittata-pizza di Osaka cotta sulla piastra; negiyaki: la versione al cipollotto. Tabelog 3,72, il più votato di Namba.
- 19:30 vedere Dōtonbori di notte | posto: hozenji-yokocho | via piedi: #fukutaro > #hozenji-yokocho (Fukutaro → Hōzenji Yokochō)
  breve: neon, insegna Glico e il vicolo delle lanterne
  Hōzenji Yokochō: vicolo lastricato di lanterne con una statua coperta di muschio, a 3′ a piedi.
- 21:00 fare Round1 (centro giochi) o bar di Ura-Namba | posto: round1 | via piedi: #hozenji-yokocho > #round1 (Hōzenji → Round1)
  breve: centro giochi enorme o vicoli di bar
  Round1 Sennichimae: sale giochi fino alle 0:50, bowling, karaoke. In alternativa [[ura-namba]]: vicoli di bar e osterie economiche.
- 23:30 sposta Hotel | via piedi: #round1 > @hillarys (Round1 → hotel)
  breve: a piedi 15′

#### Guida
senso: Giornata nerd a Osaka: quartiere dei videogiochi retro, quartiere anni '50 con la torre, poi neon di Dōtonbori e sale giochi la sera.
mangiare:
  • Pranzo: street food a Dōtonbori, takoyaki (polpette di polpo)
  • Spuntino: kushikatsu (spiedini fritti) da Daruma a Shinsekai (Tabelog 3,46, contanti)
  • Cena: Fukutaro, okonomiyaki (frittata-pizza cotta sulla piastra), Tabelog 3,72; la domenica aperto dalle 12; c'è coda
prenotare:
  • Treni del mattino già pagati
  • Contanti per Daruma e le sale giochi
attenzione:
  • Da Daruma è vietato intingere due volte nella salsa comune
  • Domani USJ: non fate troppo tardi
anticipo:
  • Castello di Osaka (bello da fuori; dentro museo dei samurai, 1 h)
  • Namba Grand Kagetsu (teatro della comicità di Osaka: in giapponese ma molto fisico)
stanchi: • Saltate Shinsekai: Den Den Town, cena e Dōtonbori sono vicini all'hotel
camminata: ~11 km · treni ~4 h al mattino + metro 25′ · pause: check-in 30′, cena 1 h 15

### 2026-11-16
percorso: osaka > tokyo
dorme: super-hotel
con: voi due
- 07:15 hotel Check-out dall'Hotel Hillarys | alloggio: hillarys
- 07:20 sposta Armadietti di Universal Studios | via mezzi: @hillarys > Universal Studios Japan lockers (Hotel → Universal Studios)
  breve: metro + treno ~35′
  come: 4′ a piedi, metro Midōsuji da Shinsaibashi a Umeda (6′, la stazione centrale di Osaka), treno JR da Osaka a Universal City (~15′, diretto o cambio a Nishikujō)
- 07:55 bagagli Valigie negli armadietti grandi | deposito | dove: Universal Studios Japan lockers
  breve: fuori dai cancelli · sono pochi: arrivate presto
- 08:00 fare Super Nintendo World | posto: usj | prenotare
  breve: il mondo di Mario dentro Universal Studios
  Mario Kart, Yoshi, Donkey Kong Country (montagne russe nella miniera).
  attenzione: serve l'Area Timed Entry (il biglietto a orario per l'area Nintendo) o l'Express Pass che la include
  prenotazione: biglietti USJ + Express Pass per 2
- 11:00 fare Altre attrazioni di Universal Studios | posto: usj
- 12:00 cibo Pranzo nel parco | posto: usj
  breve: prima delle 11:30 o dopo le 13:30
- 14:00 fare Harry Potter, Jurassic Park, Minion | posto: usj
- 16:00 fare Hollywood Dream, poi uscita | posto: usj
  breve: montagne russe · uscita entro le 18:10
- 18:10 bagagli Ritiro valigie dagli armadietti | ritiro | dove: Universal Studios Japan lockers
  breve: poi treno per Shin-Osaka
- 18:20 sposta Shin-Osaka | via mezzi: Universal City Station, Osaka > Shin-Osaka Station (Universal Studios → Shin-Osaka)
  breve: treno ~30′ con 2 cambi
  come: treno JR da Universal City, cambi a Nishikujō e Osaka
  Comprate un ekiben (cestino da treno) per la cena.
- 20:00 viaggio Shinkansen (treno superveloce) Osaka → Tokyo | foto: Tōkaidō Shinkansen | treno: shink-16 | prenotato | dove: Shin-Osaka Station
  breve: 20:00 → 22:24 · Nozomi 280
  Ultimo treno utile alle 21:24.
- 22:30 sposta Super Hotel Hamamatsuchō | città: tokyo | via mezzi: Tokyo Station > @super-hotel (Tokyo Station → Super Hotel)
  breve: treno 6′ + a piedi 4′
  come: treno JR (linea Yamanote o Keihin-Tōhoku) fino a Hamamatsuchō
- 22:50 hotel Check-in al Super Hotel | alloggio: super-hotel
  breve: entro le 24:00 · valigie in camera

#### Guida
senso: Universal Studios Japan con Super Nintendo World (il mondo di Mario), poi Shinkansen per Tokyo la sera.
mangiare:
  • Pranzo nel parco prima delle 11:30 o dopo le 13:30
  • Cena: ekiben (cestino da treno) comprato a Shin-Osaka
prenotare:
  • Biglietti USJ + Area Timed Entry (orario d'ingresso all'area Nintendo) o Express Pass, per 2
  • Shinkansen già pagato
attenzione:
  • Senza Area Timed Entry nell'area Nintendo non si entra
  • Armadietti grandi limitati: arrivate all'apertura
  • Uscita entro le 18:15
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
  breve: colazione: sushi, frittata dolce, ostriche · contanti
  L'ex mercato del pesce. Tamagoyaki: frittata dolce arrotolata.
  alternativa: go-kart per le strade (serve la patente internazionale)
- 10:15 sposta Ginza | via piedi: #tsukiji > Ginza, Tokyo (Tsukiji → Ginza)
  breve: a piedi 12′
- 10:30 vedere Ginza | foto: Ginza | dove: Ginza, Tokyo
  breve: vetrine e grandi magazzini
  Il quartiere elegante dei grandi magazzini.
  alternativa: [[kabuki-za]], un solo atto di teatro kabuki (~1 h, sottotitoli in inglese)
- 12:00 cibo Depachika (food hall) di Ginza Mitsukoshi | posto: depachika-ginza
  breve: pranzo nella food hall
  Depachika: i piani interrati dei grandi magazzini, enormi food hall di piatti pronti.
- 13:00 sposta Harajuku | via mezzi: #depachika-ginza > #takeshita-dori (Ginza → Harajuku)
  breve: metro 15′ + a piedi 10′
  come: metro Ginza line da Ginza a Omotesandō
- 13:30 vedere Harajuku (quartiere della moda giovane) | posto: takeshita-dori
  breve: via Takeshita e santuario Meiji nel bosco
  Takeshita-dōri: moda kawaii, crêpe e purikura (cabine per foto-adesivi). Poi [[meiji-jingu]], il grande santuario nel bosco (40′).
- 15:00 sposta Shibuya Sky | via piedi: #meiji-jingu > #shibuya-sky (Harajuku → Shibuya Sky)
  breve: a piedi 20′ da Cat Street
  [[cat-street]]: via pedonale di negozi streetwear.
- 15:40 vedere Shibuya Sky (terrazza panoramica) | posto: shibuya-sky | prenotare
  breve: sul tetto di un grattacielo · tramonto 16:30
  prenotazione: biglietti dal 2/11 alle 16:00 italiane, ingresso 15:40, per 2
- 17:00 fare Shibuya PARCO | posto: shibuya-parco
  breve: 6° piano: Nintendo, Pokémon, Capcom, Jump
  A 5′ a piedi da Shibuya Sky.
- 18:00 sposta Omoide Yokochō | via mezzi: Shibuya Station, Tokyo > #omoide-yokocho (Shibuya → Omoide Yokochō)
  breve: treno 7′ + a piedi 3′
  come: treno JR Yamanote (la linea circolare di Tokyo) da Shibuya a Shinjuku
- 18:15 cibo Omoide Yokochō (vicolo degli spiedini) | posto: omoide-yokocho
  breve: cena veloce: spiedini alla brace
  Vicolo di chioschi fumosi.
- 18:50 sposta Samurai Restaurant | via piedi: #omoide-yokocho > #samurai-restaurant (Omoide Yokochō → Samurai Restaurant)
  breve: a piedi 7′
- 19:00 fare Samurai Restaurant Time | posto: samurai-restaurant | prenotare
  breve: show di samurai e ninja · 2 h
  Show kitsch con tamburi taiko, samurai, ninja e carri al neon a Kabukichō (nell'ex Robot Restaurant).
  costo: da ¥8.000 con 2 drink
  prenotazione: ore 19:00 per 2
- 21:10 fare Golden Gai (vicoli di micro-bar) | posto: golden-gai | via piedi: #samurai-restaurant > #golden-gai (Samurai → Golden Gai)
  breve: micro-bar per l'ultimo giro
  6 vicoli con oltre 200 bar da 5–10 posti, a 5′ a piedi. Passate dalla [[godzilla]].
  costo: molti bar chiedono un coperto (¥500–1.000)
  alternativa: karaoke (Big Echo, Karaoke-kan)
- 23:30 sposta Hotel | via mezzi: #golden-gai > @super-hotel (Golden Gai → hotel)
  breve: treno 26′ + a piedi 4′ · ultimo treno ~0:30
  come: treno JR Yamanote da Shinjuku a Hamamatsuchō

#### Guida
senso: Ultimo giorno pieno a Tokyo: mercato del pesce, Ginza, Harajuku, terrazza panoramica di Shibuya al tramonto, show dei samurai e bar minuscoli a Shinjuku.
mangiare:
  • Colazione: mercato di Tsukiji (sushi, frittata dolce, ostriche; contanti)
  • Pranzo: depachika di Ginza (food hall nei sotterranei dei grandi magazzini)
  • Cena veloce: Omoide Yokochō (vicolo di spiedini alla brace) prima dello show
prenotare:
  • Shibuya Sky: biglietti il 2/11 alle 16:00 italiane, ingresso 15:40, per 2
  • Samurai Restaurant Time ore 19:00 per 2
  • Patente internazionale (modello Ginevra 1949) solo se fate il go-kart
attenzione:
  • Tsukiji chiude mercoledì e domenica (martedì è aperto)
  • Golden Gai: molti bar chiedono un coperto (¥500–1.000)
  • Ultimo treno verso l'hotel ~0:30
anticipo:
  • Kabuki-za: un solo atto di teatro kabuki (~1 h, sottotitoli in inglese)
  • Karaoke dopo Golden Gai (Big Echo, Karaoke-kan)
stanchi: • Saltate Harajuku, andate dritti a Shibuya
camminata: ~13 km con la metro per Tsukiji (~15 km tutto a piedi) · mezzi ~1 h · pause: pranzo 1 h, show 2 h seduti, bar 1 h

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

Prezzi: totale della camera per 2 persone, nella valuta in cui è stata prenotata. `pagato`: sì / no / gruppo.

### airbnb-shinjuku
nome: Airbnb Shinjuku (Ōkubo)
città: tokyo
dal: 2026-11-06
al: 2026-11-07
prezzo: €80,56
euro: 80.56
pagato: no
pagato da: Federico
diviso: sì
pagamento: Airbnb addebita da solo il 15/10
cancellazione: gratuita fino al 23/10 alle 15:00
indirizzo: Ōkubo 2-13-5, Shinjuku-ku, Tokyo 169-0072
arrivo: Stazione Higashi-Shinjuku (metro Ōedo) a piedi 5′ · JR Shinjuku a piedi 20′
orari: Check-in dalle 15:00 con cassetta delle chiavi (istruzioni nell'app dal 4/11) · check-out entro le 10:00
nota: L'annuncio offre il deposito bagagli: chiedere all'host per le 13:30 del 6/11.
app: https://www.airbnb.it/trips
maps: 2-13-5 Okubo, Shinjuku City, Tokyo

### cottage-pastorale
nome: Cottage Pastorale (col gruppo)
città: kawaguchiko
dal: 2026-11-07
al: 2026-11-09
prezzo: €200 a testa
euro: 200
pagato: gruppo
diviso: no
pagamento: quota a testa, da saldare col gruppo
indirizzo: Kawaguchi 3064, Fujikawaguchiko (sponda nord del lago)
arrivo: Navetta dell'host dalla stazione di Kawaguchiko · taxi ~10′
orari: Check-in dalle 15:00 · check-out entro le 10:00
maps: Kawaguchi 3064, Fujikawaguchiko, Yamanashi

### saibo
nome: Hotel Nihonbashi Saibo
città: tokyo
dal: 2026-11-09
al: 2026-11-10
prezzo: ¥16.835
yen: 16835
pagato: no
pagato da: Federico
diviso: sì
pagamento: Booking addebita da solo sulla carta
cancellazione: gratuita fino al 7/11
indirizzo: Nihonbashi Ningyōchō 3-3-16, Chūō-ku, Tokyo
arrivo: Ningyōchō (metro Hibiya / Toei Asakusa) a piedi 2′ · Hamachō (metro Toei Shinjuku) a piedi 6′
orari: Check-in 15:00–24:00 · check-out entro le 10:00 · deposito bagagli
nota: Colazione non inclusa (¥1.500 a testa). Tassa di soggiorno da pagare in hotel.
app: https://secure.booking.com/mytrips.html
maps: Hotel Nihonbashi Saibo, Ningyocho, Tokyo

### apa-kyoto
nome: APA Hotel Kyoto Eki Horikawadori
città: kyoto
dal: 2026-11-10
al: 2026-11-13
prezzo: ¥54.570
yen: 54570
pagato: no
pagato da: Federico
diviso: sì
pagamento: Booking addebita da solo sulla carta
cancellazione: gratuita fino all'8/11
indirizzo: Aburanokōji, Shiokōji-dōri, Shimogyō-ku, Kyoto
arrivo: Stazione di Kyoto, uscita Central, a piedi 7′ · metro Karasuma uscita C7 a piedi 5′
orari: Check-in dalle 15:00 · check-out entro le 10:00 · deposito bagagli
nota: Colazione non inclusa (¥1.800 a testa). Bagno pubblico interno 6–10 e 15–1.
app: https://secure.booking.com/mytrips.html
maps: APA Hotel Kyoto Eki Horikawadori

### alpina
nome: Spa Hotel Alpina Hida Takayama
città: takayama
dal: 2026-11-13
al: 2026-11-15
prezzo: ¥55.566
yen: 55566
pagato: no
pagato da: Federico
diviso: sì
pagamento: Booking addebita da solo sulla carta · in hotel ¥600 di tassa delle terme
cancellazione: gratuita fino al 10/11
indirizzo: Nadamachi 5-41, Takayama (Gifu)
arrivo: Stazione di Takayama a piedi 3′ · bus Nōhi accanto alla stazione
orari: Check-in 15:00–23:00 · check-out entro le 10:00 · onsen sul tetto fino all'1:00
nota: Colazione inclusa. Con tatuaggi visibili l'onsen può essere vietato.
app: https://secure.booking.com/mytrips.html
maps: Spa Hotel Alpina Hida Takayama

### hillarys
nome: Hotel Hillarys Shinsaibashi
città: osaka
dal: 2026-11-15
al: 2026-11-16
prezzo: ¥11.857
yen: 11857
pagato: no
pagato da: Federico
diviso: sì
pagamento: Booking addebita da solo sulla carta
cancellazione: gratuita fino all'11/11
indirizzo: Higashi-Shinsaibashi 1-17-11, Chūō-ku, Osaka
arrivo: Shinsaibashi (metro Midōsuji) a piedi 4′ · Nagahoribashi a piedi 7′
orari: Check-in dalle 15:00 · check-out entro le 10:00 · deposito bagagli
nota: Colazione inclusa. Tassa di soggiorno da pagare in hotel.
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
cancellazione: gratuita fino al 14/11
indirizzo: Hamamatsuchō 2-2-1, Minato-ku, Tokyo
arrivo: JR Hamamatsuchō a piedi 4′ · Daimon (metro Ōedo / Toei Asakusa) a piedi 2′ · monorotaia per Haneda
orari: Check-in 15:00–24:00 · check-out entro le 10:00
nota: Colazione inclusa. Sulla fattura dell'hotel comparirà ¥51.062 (lo sconto Booking non viene mostrato). Tassa di soggiorno a parte.
app: https://secure.booking.com/mytrips.html
maps: Super Hotel Tokyo Hamamatsucho

## Treni

Prezzi: totale per 2 persone. `stato`: pagato / da comprare / sul posto. `conferma`: giorno in cui Klook emette i biglietti.

### fuji-7
data: 2026-11-07
tratta: Shinjuku → Kawaguchiko
mezzo: Fuji Excursion 11 (treno espresso diretto, solo posti prenotati)
orario: 9:30 → 11:28
prezzo: €53,67
euro: 53.67
stato: pagato
pagato da: Federico
conferma: 2026-10-07
link: https://s.klook.com/c/V3Mr8Oq2y0
nota: Passa da Shimoyoshida (stazione della pagoda Chureito) alle 11:14.

### fuji-9
data: 2026-11-09
tratta: Kawaguchiko → Shinjuku
mezzo: Fuji Excursion (treno espresso diretto, solo posti prenotati)
orario: 14:09 → 16:07 (o 15:00 → 16:59)
prezzo: ~€30
stato: da comprare
nota: Lo compra il gruppo il 9/10 alle 10:00 giapponesi (3:00 italiane): verificare che prenda anche i vostri 2 posti.

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
prezzo: €175,76
euro: 175.76
stato: pagato
pagato da: Federico
conferma: 2026-10-10
link: https://s.klook.com/c/D1Zn6JaV1o
nota: Valigia oltre 160 cm (somma dei lati): serve il posto con spazio bagagli.

### hida-13
data: 2026-11-13
tratta: Kyoto → Takayama
mezzo: Treno espresso Hida 25, diretto (binario 0 a Kyoto)
orario: 8:31 → 12:14
prezzo: €102,09
euro: 102.09
stato: pagato
pagato da: Federico
conferma: 2026-10-13
link: https://s.klook.com/c/g3BJGnMMw8
nota: Zero cambi con le valigie; panorama sulle gole del fiume Hida.

### bus-14
data: 2026-11-14
tratta: Takayama ⇄ Shirakawa-go
mezzo: Bus Nōhi (con prenotazione)
orario: andata 8:10 → 9:00 · ritorno su una corsa 13:30–14:30
prezzo: ¥2.600 a tratta a testa (~€14)
stato: da comprare
link: https://japanbusonline.com/CourseSearch/11900040002?afcd=MDI=
nota: Prenotabile dal 14/10; andata e ritorno sono due prenotazioni, per 2 persone.

### hida-15
data: 2026-11-15
tratta: Takayama → Nagoya
mezzo: Treno espresso Hida 4
orario: 8:00 → 10:34
prezzo: €163,98 insieme allo Shinkansen per Shin-Osaka
euro: 163.98
stato: pagato
pagato da: Federico
conferma: 2026-10-15
link: https://s.klook.com/c/Z3Or7m_o3k
nota: Un solo biglietto Klook fino a Shin-Osaka, con cambio di 24′ a Nagoya.

### shink-15
data: 2026-11-15
tratta: Nagoya → Shin-Osaka
mezzo: Shinkansen Nozomi 247 (treno superveloce)
orario: 10:58 → 11:48
prezzo: compreso nel biglietto del treno Hida
stato: pagato
pagato da: Federico
conferma: 2026-10-15
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
nota: Ultimo treno utile alle 21:24.

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
(prenotare / gestire), `giorno`, `apre` e `entro` (date), `quando` (testo), `costo`, `link`, `priorità`, `nota`.
Senza `tappa` la cosa finisce sulla prima tappa del primo giorno (la partenza). I controlli dei biglietti Klook
li genera build.py dai treni con `conferma`.

### fuji-9
tappa: 2026-11-09 14:09
cosa: Fuji Excursion 9/11 Kawaguchiko → Shinjuku, per 2
tipo: prenotare
giorno: 2026-11-09
entro: 2026-10-09
quando: lo compra il gruppo il 9/10
costo: ~€30 in due
priorità: alta
nota: Verificare che prendano anche i vostri due posti (corse 14:09 → 16:07 o 15:00 → 16:59, solo posti prenotati).

### usj
tappa: 2026-11-16 08:00
cosa: Universal Studios Japan + Express Pass, per 2
tipo: prenotare
giorno: 2026-11-16
quando: subito: gli Express Pass finiscono
costo: ~€130–195 a testa
link: https://www.usj.co.jp/web/en/us
priorità: alta
nota: Serve l'Area Timed Entry o un Express Pass che include Super Nintendo World, altrimenti nell'area Nintendo non si entra. Orari del 16/11 sul sito ufficiale.

### bus-nohi
tappa: 2026-11-14 08:10, 2026-11-14 13:30
cosa: Bus Nōhi Takayama ⇄ Shirakawa-go 14/11, per 2
tipo: prenotare
giorno: 2026-11-14
apre: 2026-10-14
quando: dal 14/10
costo: ¥2.600 a tratta a testa
link: https://japanbusonline.com/CourseSearch/11900040002?afcd=MDI=
priorità: alta
nota: Andata 8:10 → 9:00 e ritorno su una corsa tra 13:30 e 14:30: due prenotazioni di sola andata.

### shibuya-sky
tappa: 2026-11-17 15:40
cosa: Shibuya Sky 17/11, ingresso 15:40, per 2
tipo: prenotare
giorno: 2026-11-17
apre: 2026-11-02
quando: 2/11 alle 16:00 italiane
costo: ~¥2.500 a testa
link: https://www.shibuya-scramble-square.com/sky/ticket/
priorità: alta
nota: In vendita 2 settimane prima alle 00:00 giapponesi: gli slot del tramonto finiscono subito.

### kitchen-hida
tappa: 2026-11-13 18:15
cosa: Steak House Kitchen Hida 13/11 ore 18:00, per 2
tipo: prenotare
giorno: 2026-11-13
quando: subito, online
costo: ~¥10.000 a testa
link: http://kitchenhida.com/
priorità: media
nota: Ultimo ordine 19:45, chiuso il mercoledì.

### kyoya
tappa: 2026-11-14 18:00
cosa: Kyōya 14/11 ore 18:00, per 2
tipo: prenotare
giorno: 2026-11-14
quando: subito, per telefono o tramite l'hotel
priorità: media
nota: Aperto 17:00–20:00, chiuso il martedì.

### gion-corner
tappa: 2026-11-11 18:00
cosa: Gion Corner 11/11 ore 18:00, per 2
tipo: prenotare
giorno: 2026-11-11
quando: quando siete sicuri (non rimborsabile)
costo: ~¥5.500 a testa
link: https://www.kyoto-gioncorner.com/global/en.html
priorità: media
nota: 1 h di arti tradizionali.

### samurai
tappa: 2026-11-17 19:00
cosa: Samurai Restaurant Time 17/11 ore 19:00, per 2
tipo: prenotare
giorno: 2026-11-17
entro: 2026-11-03
quando: 1–2 settimane prima
costo: da ¥8.000 a testa con 2 drink
link: https://samurai-restaurant.tokyo/
priorità: media
nota: Show di 2 h a Kabukichō.

### airbnb
tappa: 2026-11-06 13:30
cosa: Airbnb: chiedere all'host il deposito valigie alle 13:30 del 6/11
tipo: gestire
giorno: 2026-11-06
quando: prima della partenza
link: https://www.airbnb.it/trips
priorità: media
nota: L'annuncio offre il deposito; il check-in è dalle 15:00. Il 15/10 Airbnb addebita €80,56.

### saibo
tappa: 2026-11-10 06:32
cosa: Hotel Saibo: avvisare che lasciate le valigie dalle 6:30 alle 18:40 del 10/11
tipo: gestire
giorno: 2026-11-10
quando: prima della partenza
link: https://secure.booking.com/mytrips.html
priorità: media
nota: Check-out alle 6:30, ritiro verso le 18:40, prima dello Shinkansen delle 20:09.

### hotel-carta
cosa: Controllare la carta su Booking per gli addebiti degli hotel
tipo: gestire
entro: 2026-11-07
quando: prima delle scadenze di cancellazione
link: https://secure.booking.com/mytrips.html
priorità: media
nota: Booking addebita da solo APA, Saibo, Alpina e Hillarys (¥138.828 in tutto, ~€750). Se volete pagare con Revolut, cambiate la carta nell'app Booking.

### cottage-checkout
tappa: 2026-11-09 06:45
cosa: Proporre al gruppo il check-out alle 6:45 con le valigie in stazione
tipo: gestire
priorità: media
nota: Il check-out del cottage è entro le 10, ma dopo Honcho Street servono ~40′ per tornare al cottage e poi c'è il treno.

### cena-sumo
tappa: 2026-11-09 21:00
cosa: Chiedere al gruppo se la cena da SUMO è confermata
tipo: gestire
priorità: bassa
nota: Non risulta nel file del gruppo.

### tenku
tappa: 2026-11-07 15:30
cosa: Decidere col gruppo se salire al Tenku no Torii
tipo: gestire
priorità: bassa
nota: Chiude verso le 16 e ci sono 20–30′ di salita: si va solo se il gruppo arriva puntuale alle 14.

### controlli
cosa: Controlli di inizio novembre
tipo: gestire
entro: 2026-11-01
quando: ~1/11
priorità: media
nota: Linea di Takayama (traininfo.jr-central.co.jp) · orari USJ del 16/11 · meteo e foliage.

### documenti
cosa: Visit Japan Web, e-SIM, Suica, assicurazione (per tutti e due)
tipo: gestire
entro: 2026-11-04
quando: prima della partenza
link: https://www.vjw.digital.go.jp/
priorità: media
nota: QR di Visit Japan Web salvati sul telefono.

### contanti
cosa: Contanti in yen
tipo: gestire
entro: 2026-11-04
quando: prima della partenza
priorità: media
nota: Solo contanti in molti posti: Hoto Fudo, Monkey Park, Tsukiji, Golden Gai, banchi di street food.

### patente
cosa: Patente internazionale Ginevra 1949 (solo per il go-kart del 17/11)
tipo: gestire
entro: 2026-11-04
quando: prima della partenza
priorità: bassa
nota: Cartacea, insieme alla patente italiana; il modello Vienna 1968 non vale in Giappone.

## Budget

Stima a persona in euro.

- Volo andata e ritorno: 1226 | da bozza
- Alloggi 12 notti: 747 | metà delle camere (¥187.569 + €80,56 l'Airbnb) + quota del cottage €200
- Treni e bus lunghi: 364 | metà dei biglietti Klook (€678) + Fuji Excursion del 9/11 + Kamakura
- Trasporti in città: 150 | metro e bus con la Suica ~€6 al giorno + bus Shirakawa-go ~€28
- Cibo (~13 giorni): 520 | ~€40 al giorno, comprese le cene da Kitchen Hida e Kyōya
- Attività e spettacoli: 210 | Samurai Restaurant ~€43 · Gion Corner ~€30 · Shibuya Sky ~€14 · teamLab · sale giochi
- USJ + Express: 180 | prezzo variabile, ~€130–195 a testa
- Onsen e sentō: 15 | l'onsen dell'Alpina è incluso
- Assicurazione + e-SIM: 75
- Extra (shopping, imprevisti): 500

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

### azuma-bashi
nome: Ponte Azuma-bashi (tramonto + Skytree)
tipo: 🌅 Panorama
città: tokyo
giorno: 6/11
nota: 16:30, tramonto 16:42
maps: Azumabashi Bridge Tokyo
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
sito: https://www.japan.travel/en/spot/2178/
foto: Famicom

### radio-kaikan
nome: Akihabara Radio Kaikan
tipo: 🎮 Figure e manga
città: tokyo
giorno: 6/11
nota: 10 piani di figure, modellini e carte da collezione
maps: Akihabara Radio Kaikan
sito: https://en.jal.japantravel.com/tokyo/akiba-radio-kaikan/25669
foto: Akihabara

### kyushu-jangara
nome: Kyushu Jangara Akihabara (ramen)
tipo: 🍜 Ristorante
città: tokyo
giorno: 6/11
nota: Ramen tonkotsu (brodo di maiale) · 11–22, ultimo ordine 21:45
maps: 九州じゃんがら 秋葉原本店 Sotokanda 3-11-6
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
nota: 17:10, quando si accendono le lanterne
maps: Hanamikoji Street Gion Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1956593-Reviews-Hanamikoji_Street-Kyoto_Kyoto_Prefecture_Kinki.html
foto: Gion

### gion-corner
nome: Gion Corner
tipo: 🎭 Spettacolo
città: kyoto
giorno: 11/11
nota: 18:00, 1 h di arti tradizionali · DA PRENOTARE per 2
maps: Gion Corner Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d324291-Reviews-Gion_Corner-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kyoto-gioncorner.com/global/en.html
foto: Maiko

### pontocho
nome: Pontochō
tipo: 🍶 Cena
città: kyoto
giorno: 11/11
nota: Izakaya (osterie giapponesi) sul fiume, 19:15
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
nota: Armature, katana, shuriken · fino alle 18:30
maps: Samurai Ninja Museum Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d13551788-Reviews-Samurai_Ninja_Museum_With_Experience-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://mai-ko.com/samurai/
foto: Samurai

### sen-no-kaze
nome: Ramen Sen no Kaze
tipo: 🍜 Ristorante
città: kyoto
giorno: 12/11
nota: Cena 19:00 · 12–21, chiuso mar–mer · Tabelog basso, Tripadvisor alto
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
sito: https://shirakawa-go.gr.jp/en/
foto: Shirakawa-gō

### belvedere-shiroyama
nome: Belvedere Shiroyama (Ogimachi)
tipo: 🌄 Panorama
città: takayama
giorno: 14/11
nota: Prima tappa, 20′ in salita o navetta
maps: Ogimachi Castle Ruins Observatory Shirakawa
sito: https://www.vill.shirakawa.lg.jp/1470.htm
foto: Shirakawa-gō

### casa-wada
nome: Casa Wada
tipo: 🏡 Casa storica
città: takayama
giorno: 14/11
nota: La più grande casa col tetto di paglia visitabile
maps: Wada House Shirakawa-go
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
sito: http://www.dotonbori.or.jp/ja/
foto: Dōtonbori

### den-den-town
nome: Den Den Town (Nipponbashi)
tipo: 🎮 Otaku
città: osaka
giorno: 15/11
nota: 13:30
maps: Den Den Town Nipponbashi Osaka
sito: https://www.nippombashi.jp/
foto: Den Den Town

### super-potato
nome: Super Potato — Otaroad
tipo: 🎮 Retro game
città: osaka
giorno: 15/11
nota: Weekend 10–20 · Nipponbashi 3-8-18
maps: スーパーポテト オタロード店 大阪市浪速区日本橋3-8-18
sito: https://www.superpotato.com/shop/otaroad/
foto: Den Den Town

### mandarake
nome: Mandarake Grand Chaos
tipo: 🎮 Manga e figure
città: osaka
giorno: 15/11
nota: 12–20
maps: Mandarake Grand Chaos Osaka
sito: https://www.mandarake.co.jp/dir/gcs/
foto: Mandarake

### shinsekai
nome: Shinsekai
tipo: 🏮 Quartiere retrò
città: osaka
giorno: 15/11
nota: 15:30
maps: Shinsekai Osaka
sito: https://shinsekai.net/
foto: Shinsekai

### tsutenkaku
nome: Torre Tsūtenkaku
tipo: 🌅 Panorama
città: osaka
giorno: 15/11
nota: Al tramonto · 10–20, ¥1.000
maps: Tsutenkaku Osaka
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
nota: Cena 18:15 · la domenica aperto dalle 12 · niente prenotazioni
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
sito: https://www.round1.co.jp/
foto: Round One Corporation

### namba-grand-kagetsu
nome: Namba Grand Kagetsu (alternativa)
tipo: 🎭 Comicità
città: osaka
giorno: 15/11
nota: Comici in coppia (manzai) e commedia slapstick, in giapponese ma molto fisica
maps: Namba Grand Kagetsu
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
foto: Harajuku

### shibuya-sky
nome: Shibuya Sky
tipo: 🌅 Panorama
città: tokyo
giorno: 17/11
nota: 15:40, tramonto 16:30 · biglietti dal 2/11 alle 16:00 italiane
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
nota: Spiedini alla brace, 18:15
maps: Omoide Yokocho Shinjuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133673-d1173749-Reviews-Omoide_Yokocho-Nishishinjuku_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://shinjuku-omoide.com/
foto: Omoide Yokochō

### samurai-restaurant
nome: Samurai Restaurant Time
tipo: 🎭 Spettacolo
città: tokyo
giorno: 17/11
nota: 19:00, 2 h · DA PRENOTARE per 2
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
- Nōhi Bus: Compagnia dei bus Takayama ↔ Shirakawa-go, con prenotazione
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
