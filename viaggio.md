# Giappone 2026 — fonte dati

Unica fonte di verità del viaggio (5–18 novembre 2026, Federico + un amico). Il sito
https://fdellefave.github.io/giappone2026-app/ si genera da questo file con `python3 build.py`.
Dopo ogni modifica: build, controllo degli avvisi, commit e push su `fdellefave/giappone2026-app`.
Questo file vive solo qui: non tenerne copie nel progetto Claude «Giappone».

## Sintassi

- Sezioni `##`, voci `### id`, campi `chiave: valore` (una riga ciascuno).
- Giorno `### AAAA-MM-GG`: campi `percorso` (città separate da `>`), `dorme` (id alloggio o `volo`), `con`.
  Città: roma, tokyo, kawaguchiko, kamakura, kyoto, takayama, osaka.
- Tappa: `- HH:MM SIMBOLO testo | attributo | attributo`
  - `*` attività · `>` spostamento in città · `>>` treno, bus o volo lungo · `@` alloggio
  - `posto: id` (link della sezione Posti: Tripadvisor, poi Tabelog, poi Maps) · `treno: id` · `alloggio: id`
  - `prenotare` = da prenotare · `prenotato` · `città: id` = da questa tappa in poi si è in quella città
  - `via mezzi|piedi|taxi: DA > A (etichetta)` = pulsante Google Maps con le indicazioni.
    DA e A: `#posto`, `@alloggio` o testo libero cercabile su Google Maps.
- `#### Guida` dentro un giorno: campi `senso, mangiare, prenotare, attenzione, anticipo, stanchi, camminata`.
  Testo su una riga, oppure punti su righe seguenti che iniziano con `  • `.
- Testo che vede l'utente: italiano semplice, ogni termine giapponese spiegato tra parentesi, prezzi in yen
  con euro quando servono (1 € ≈ 185 ¥).

## Note per Claude

Regole di Federico:
- Nei giorni col gruppo (7–10/11) si segue il programma del gruppo: solo note e indicazioni, niente riordini.
- A piedi le tratte sotto i 3 km, oltre coi mezzi (con mezzo e minuti); 10–15 km a piedi al giorno.
- Due 30enni un po' nerd: templi in 1–2 h, cose «wow», sale giochi e quartieri otaku, vita serale, cibo buono non
  da trappola turistica (ma i must-see restano). Niente musei d'arte moderna o cose occidentali. Sì natura, giardini
  zen, samurai e katane, spettacoli serali giapponesi anche strani.
- Giornate troppo piene: si toglie la cosa meno utile.
- Ogni posto con link diretto (Tripadvisor, o la piattaforma più nota); link verificati, mai inventati.
- Il sito è pubblico: mai link di conferma Booking/Airbnb, numeri di passaporto o dati di pagamento.
- Voli, treni e hotel sono prenotati per entrambi: tra le cose da fare solo ciò che manca a tutti e due.

Già verificato (non riproporre):
- Escluse Kanazawa (doppione di Kyoto) e Nara/Himeji (al loro posto la giornata nerd a Osaka il 15/11).
- Statua del Gundam di Odaiba rimossa ad agosto 2026; Nintendo Museum (Uji) solo a lotteria; illuminazione di
  Eikan-dō dal 20/11 (dopo Kyoto); Tofuku-ji, Kuromon, Hama-rikyu, Ōkochi-Sansō e Hida-no-Sato tolti apposta.
- Il torneo di sumo di novembre è a Fukuoka (fuori rotta): per questo l'Asakusa Sumo Club.
- Lake Bake: bar interno chiuso, solo asporto. Omen (udon a Ginkaku-ji) chiuso il giovedì: il 12/11 non si va.
- Super Potato di Osaka = negozio Otaroad a Nipponbashi (Den Den Town).
- Shibuya Sky: biglietti 2 settimane prima alle 00:00 giapponesi. Bus Nōhi per Shirakawa-go: prenotazioni 1 mese prima.
- Le coordinate dei posti non sono disponibili: la mappa del sito usa ricerche Google Maps.

Punti aperti:
- 7/11: Tenku no Torii alle 15:30 rischia la chiusura (verso le 16). Decide il gruppo.
- 9/11: check-out del cottage entro le 10 ma il giro Chureito–Honcho finisce lontano: proposta check-out alle 6:45.
- 9/11: cena da SUMO (ristorante a tema) non risulta nel file del gruppo: verificare.
- 9/11: Fuji Excursion del ritorno lo compra il gruppo il 9/10: verificare i vostri 2 posti.

## Info

partenza: 2026-11-05T15:05+01:00
cambio: 185

## Giorni

### 2026-11-05
percorso: roma
dorme: volo
con: 👬 amico
- 11:00 * Arrivo all'aeroporto di Fiumicino, check-in
- 15:05 >> ✈️ Volo AZ792 Roma → Tokyo Haneda (~12 h): provate a dormire nella seconda metà | prenotato

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
con: 👬 amico
- 11:20 * Atterraggio a Haneda (aeroporto di Tokyo), Terminal 3 · controllo passaporti + dogana (~1 h) · carta Suica sul telefono (la tessera ricaricabile per metro e treni) · e-SIM
- 12:30 > 🚆 Treno Keikyu (la linea privata dell'aeroporto) fino alla stazione Daimon, poi metro linea Ōedo fino a Higashi-Shinjuku · ~55′, ~¥800 · 🚶 5′ all'Airbnb | via mezzi: Haneda Airport Terminal 3 > @airbnb-shinjuku (Aeroporto → Airbnb)
- 13:30 @ Airbnb Shinjuku: lasciate le valigie (l'annuncio offre il deposito, da confermare con l'host) · ingresso autonomo con cassetta delle chiavi dalle 15:00 | alloggio: airbnb-shinjuku
- 13:40 > 🚶 A piedi a Fūunji, 28′ (2,3 km) | via piedi: @airbnb-shinjuku > #fuunji (Airbnb → Fūunji)
- 14:10 * Pranzo da Fūunji: tsukemen (spaghettoni di ramen da intingere in un brodo denso), Tabelog 3,77 (Tabelog = il Tripadvisor giapponese); chiude alle 15:00, c'è coda · se uscite dall'Airbnb dopo le 14:00, piano B: sushi su nastro da Kura Sushi ad Asakusa | posto: fuunji
- 15:00 > 🚆 Treno JR linea Chūō da Shinjuku a Kanda 10′ + 🚇 metro Ginza line fino ad Asakusa 10′ (~35′ in tutto) | via mezzi: #fuunji > #senso-ji (Fūunji → Senso-ji)
- 15:35 * Senso-ji (il tempio buddista più antico di Tokyo; sala principale fino alle 17) + Nakamise (la via di bancarelle che porta al tempio) · 16:30 ponte Azuma-bashi (🚶 5′): tramonto alle 16:42 con la Skytree (la torre tv di 634 m) | posto: senso-ji
- 17:00 * Senso-ji illuminato, vuoto e scenografico
- 17:40 > 🚶 Al Sumo Club, 10′ (700 m) | via piedi: #senso-ji > #sumo-club (Senso-ji → Sumo Club)
- 18:00 * Asakusa Sumo Club fino alle 19:40: spettacolo di sumo con ex lottatori professionisti, potete sfidarli sul ring, cena a volontà con chanko-nabe (lo stufato dei lottatori) · da ~$100 | posto: sumo-club | prenotare
- 19:45 > 🚶 Ad Akihabara, 30′ (2,5 km) · se siete cotti: treno Tsukuba Express 5′ | via piedi: #sumo-club > #hey-akihabara (Sumo Club → Akihabara)
- 20:15 * Akihabara (il quartiere di elettronica, manga e videogiochi): sale giochi HEY (giochi retro, fino alle 23:45), GiGO, Taito Station | posto: hey-akihabara
- 22:00 > 🚆 Treno JR linea Sōbu da Akihabara a Shinjuku 18′ | via mezzi: Akihabara Station, Tokyo > #godzilla (Akihabara → Godzilla)
- 22:25 * Testa di Godzilla gigante sull'Hotel Gracery a Kabukichō (il quartiere dei locali notturni di Shinjuku) | posto: godzilla
- 22:40 > 🚶 All'Airbnb, 12′ (1 km) | via piedi: #godzilla > @airbnb-shinjuku (Godzilla → Airbnb)

#### Guida
senso: Arrivo e prima immersione: Asakusa (la Tokyo antica, col tempio Senso-ji), cena-spettacolo di sumo, sale giochi ad Akihabara (il quartiere nerd) e la testa di Godzilla. Giornata lunga per il jet lag: con calma.
mangiare:
  • Pranzo: Fūunji, tsukemen (ramen da intingere), tra i migliori di Tokyo (Tabelog 3,77). Chiude alle 15: se siete in ritardo, Kura Sushi ad Asakusa (sushi su nastro, si ordina dal tablet)
  • Cena: compresa nel Sumo Club (stufato dei lottatori a volontà + sushi e fritti)
prenotare:
  • 🚨 Asakusa Sumo Club ore 18:00 per 2
  • Messaggio all'host dell'Airbnb per lasciare le valigie alle 13:30
  • Carta Suica (tessera per metro e treni) già sul telefono
attenzione:
  • Da Fūunji c'è coda e alle 15 chiude
  • Il Senso-ji chiude la sala alle 17, ma la zona resta aperta e illuminata
anticipo:
  • Kappabashi (la via dei negozi da cucina e del cibo finto in plastica), fino alle 17
  • Distributori di gadget a capsule (gachapon) ovunque ad Akihabara
stanchi: • Dopo il sumo prendete il treno per Akihabara (5′) invece di camminare, o andate dritti a casa: Akihabara si recupera il 17/11
camminata: ~13 km · mezzi ~2 h in tutto · pause: pranzo 45′, Sumo Club seduti 1 h 40

### 2026-11-07
percorso: tokyo > kawaguchiko
dorme: cottage-pastorale
con: 👥 gruppo + amico
- 08:30 @ Check-out dall'Airbnb (entro le 10) · colazione al conbini (i minimarket aperti 24 h: 7-Eleven, Lawson, FamilyMart) | alloggio: airbnb-shinjuku
- 08:40 > 🚶 Alla stazione JR di Shinjuku, 20′ (1,6 km) con le valigie, o 🚕 taxi 7′ (~¥1.000) · al binario alle 9:15 | via piedi: @airbnb-shinjuku > Shinjuku Station, Tokyo (Airbnb → stazione di Shinjuku)
- 09:30 >> 🚆 Fuji Excursion (treno diretto per il Monte Fuji) 9:30 → 11:28: Shinjuku → Kawaguchiko (il paese sul lago ai piedi del Fuji); passa alle 11:14 da Shimoyoshida, la stazione della pagoda Chureito | treno: fuji-7 | prenotato
- 11:30 > 🧳 Valigie negli armadietti della stazione (o navetta dell'host del cottage) · 🚕 taxi a Lake Bake 10′ (3,7 km, ~¥2.000) | città: kawaguchiko | via taxi: Kawaguchiko Station > #lake-bake (Stazione → Lake Bake)
- 12:00 * Pranzo da Lake Bake (panetteria sul lago, chiusa il mercoledì; il bar interno è chiuso: pane da asporto e picnic sulla riva con vista Fuji) · in alternativa, se il Fuji è nitido e domani danno brutto: pagoda Chureito (treno 15′) | posto: lake-bake
- 13:30 > 🚕 Taxi alla stazione, 10′ | via taxi: #lake-bake > Kawaguchiko Station (Lake Bake → stazione)
- 14:00 * 👥 Arrivano gli amici da Takayama (bus delle 8:40)
- 14:10 > 🚕 Tutti al Cottage Pastorale (sponda nord del lago; l'host fa navetta dalla stazione) | via taxi: Kawaguchiko Station > @cottage-pastorale (Stazione → Cottage)
- 15:00 @ Check-in al Cottage Pastorale | alloggio: cottage-pastorale
- 15:30 * Tenku no Torii («il portale nel cielo»: un torii, il portale rosso dei santuari, affacciato sul Fuji, sopra il santuario Kawaguchi Asama) · 🚨 chiude verso le 16:00, 20–30′ di salita e nel weekend non si sale in auto: rischio di arrivare a chiusura | posto: tenku-no-torii
- 16:30 > 🚌 Bus turistico Red Line (fino alle ~17:45) o 🚕 taxi | via taxi: Kawaguchi Asama Shrine, Fujikawaguchiko > #momiji-corridor (Tenku no Torii → viale degli aceri)
- 17:00 * Momiji Corridor (viale degli aceri rossi; festival del foliage dal 7/11, illuminato dal tramonto alle 21:00) | posto: momiji-corridor
- 18:45 > 🚕 Taxi ~8′ (pochi taxi) o 🚶 40′ (~3 km) | via taxi: #momiji-corridor > #hoto-fudo (Viale degli aceri → Hoto Fudo)
- 19:00 * Cena col gruppo da Hoto Fudo (hoto: zuppa di tagliatelle larghe con zucca, il piatto tipico del Fuji) · 🚨 chiude alle 20:00 o prima se finiscono i noodles · solo contanti | posto: hoto-fudo

#### Guida
senso: Si va al Monte Fuji: treno diretto la mattina, pranzo sul lago, dal pomeriggio col gruppo (portale nel cielo, viale degli aceri illuminato, cena tipica).
mangiare:
  • Pranzo: Lake Bake, panetteria sul lago (Tabelog 3,62): pane e dolci da asporto, picnic sulla riva. Se piove: Hoto Fudo Higashi-Koiji, vicino alla stazione
  • Cena col gruppo: Hoto Fudo, hoto (zuppa di tagliatelle larghe con zucca e verdure). Solo contanti
prenotare:
  • Treno Fuji Excursion già prenotato ✅
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
con: 👥 gruppo + amico
- 08:00 * 🚲 Giro del lago in bici col gruppo (bici tramite il cottage) · la pagoda Chureito e Honcho Street (la via col Fuji in fondo) si fanno il 9/11
- 13:00 * Pranzo · se passate da Fujiyoshida: Miura Udon (udon spessi tipici della zona, solo 10–14) | posto: miura-udon
- 14:00 * Punti panoramici sul Fuji
- 16:00 * Onsen (terme giapponesi) con vista Fuji · o funivia Kachi Kachi (funivia panoramica sul lago, andata e ritorno ¥1.000, fino alle 17) | posto: funivia-kachi-kachi
- 18:00 * Relax al cottage
- 20:00 * Cena col gruppo

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
con: 👥 gruppo + amico
- 07:00 > 🚕 Cottage → stazione di Kawaguchiko (~10′) · 🚃 treno locale Fujikyu fino a Shimoyoshida (~15′, ¥310) col gruppo | via mezzi: @cottage-pastorale > Shimoyoshida Station, Fujiyoshida (Cottage → Shimoyoshida)
- 07:45 > 🚶 10′ (700 m) + ~400 scalini | via piedi: Shimoyoshida Station, Fujiyoshida > #chureito (Stazione → pagoda Chureito)
- 08:00 * Pagoda Chureito (pagoda rossa a 5 piani col Fuji dietro, la foto simbolo del Giappone) col gruppo | posto: chureito
- 08:45 > 🚶 15′ (1 km) | via piedi: #chureito > #honcho-street (Chureito → Honcho Street)
- 09:00 * Honcho Street (via di negozi col Fuji enorme in fondo) · 🚨 il check-out del cottage è entro le 10 ma da qui servono ~40′: proposta, check-out alle 6:45 e valigie in stazione | posto: honcho-street
- 09:45 > 🚃 Treno Shimoyoshida → Kawaguchiko 15′ | via mezzi: Shimoyoshida Station, Fujiyoshida > Kawaguchiko Station (Shimoyoshida → Kawaguchiko)
- 10:15 * Tempo libero al lago
- 12:00 * Pranzo al lago, poi stazione di Kawaguchiko
- 14:09 >> 🚆 Fuji Excursion (treno diretto) Kawaguchiko → Shinjuku «dopo pranzo»: corse 14:09 → 16:07 o 15:00 → 16:59 · lo compra il gruppo il 9/10 | treno: fuji-9 | prenotare
- 16:10 > 🚶 7′ ai binari della metro Toei · 🚇 metro linea Toei Shinjuku fino a Hamachō, 22′ senza cambi (~¥280) · 🚶 6′ all'hotel | città: tokyo | via mezzi: Shinjuku Station, Tokyo > @saibo (Shinjuku → Hotel Saibo)
- 16:45 @ Check-in all'Hotel Nihonbashi Saibo (Ningyōchō, quartiere tranquillo vicino a Tokyo Station) · valigia in camera | alloggio: saibo
- 18:00 * Spuntino veloce a Ningyōchō
- 18:20 > 🚇 A teamLab ~35′: metro Hibiya line fino a Ginza, 🚶 5′ a Ginza-itchōme, metro Yurakuchō line fino a Toyosu, 🚶 12′ · o 🚕 taxi 20′ (~¥3.000) | via mezzi: @saibo > #teamlab (Hotel Saibo → teamLab)
- 19:00 * teamLab Planets (museo d'arte digitale: stanze di luci e specchi, si cammina nell'acqua) col gruppo · ingresso 19:00–19:30 · acqua fino al ginocchio (pantaloncini in prestito gratis) · armadietti piccoli 23×34×37 cm | posto: teamlab | prenotato
- 21:00 * Cena col gruppo da SUMO (ristorante a tema sumo) · 🚨 non risulta nel file del gruppo: verificare
- 22:30 > 🚇 Rientro ~35′ (stessa strada) o 🚕 20′ | via mezzi: #teamlab > @saibo (teamLab → Hotel Saibo)

#### Guida
senso: Mattina col gruppo alla pagoda Chureito (la foto simbolo del Fuji), pomeriggio in treno a Tokyo, sera a teamLab (museo di luci digitali dove si cammina nell'acqua).
mangiare:
  • Pranzo al lago prima del treno
  • Cena col gruppo da SUMO (da verificare), o dopo le 21 vicino all'hotel
prenotare:
  • 🚨 Treno Fuji Excursion del pomeriggio: lo compra il gruppo il 9/10 alle 3:00 italiane, verificate che prendano anche i vostri 2 posti
  • teamLab già prenotato dal gruppo ✅
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
con: 👥 gruppo + amico, la sera 👬
- 06:30 @ Check-out dall'Hotel Saibo · valigie in deposito in hotel | alloggio: saibo
- 06:35 > 🚶 2′ alla stazione Ningyōchō · 🚇 metro Toei Asakusa fino a Shimbashi 10′ · 🚆 treno JR Tōkaidō fino a Fujisawa ~45′ (salite sul treno del gruppo a Shimbashi, la fermata dopo Tokyo; ¥990) · 🚃 Enoden (il trenino storico sul mare) fino a Kamakura-kōkō-mae 20′ (biglietto giornaliero ¥800) | via mezzi: @saibo > #kokomae (Hotel Saibo → Kamakura-kōkō-mae)
- 08:00 * Kamakura-kōkō-mae: il passaggio a livello sul mare dell'anime Slam Dunk, foto col trenino | città: kamakura | posto: kokomae
- 08:45 > 🚃 Enoden fino a Kamakura 20′ + 🚌 bus dalla fermata 4 fino a Jōmyōji 10′ | via mezzi: #kokomae > #hokoku-ji (Kōkō-mae → Hōkoku-ji)
- 09:30 * Hōkoku-ji (tempio con un boschetto di bambù, ¥400; chiuso se piove) | posto: hokoku-ji
- 10:30 > 🚶 A Komachi-dōri, 25′ (2 km) | via piedi: #hokoku-ji > #komachi-dori (Hōkoku-ji → Komachi-dōri)
- 11:00 * Komachi-dōri (la via dello street food di Kamakura): shopping + pranzo alle 12:30 | posto: komachi-dori
- 13:30 > 🚃 Enoden da Kamakura a Hase 5′ + 🚶 7′ | via mezzi: Kamakura Station > #grande-buddha (Komachi-dōri → Grande Buddha)
- 13:45 * Grande Buddha di Kōtoku-in (statua di bronzo di 13 m all'aperto) | posto: grande-buddha
- 14:20 > 🚶 8′ (600 m) | via piedi: #grande-buddha > #hase-dera (Grande Buddha → Hase-dera)
- 14:30 * Hase-dera (tempio con terrazza vista mare) · chiude alle 16:30 | posto: hase-dera
- 16:15 > 🚃 Enoden da Hase a Koshigoe 10′ | via mezzi: #hase-dera > Koshigoe Station, Kamakura (Hase-dera → Koshigoe)
- 16:40 * 🌅 Tramonto sul mare a Koshigoe
- 17:05 > 🚃 Enoden fino a Fujisawa 15′ · 🚆 treno JR fino a Shimbashi 45′ col gruppo · 🚇 metro Toei Asakusa fino a Ningyōchō 10′ · partire da Fujisawa entro le 17:45 | via mezzi: Koshigoe Station, Kamakura > @saibo (Koshigoe → Hotel Saibo)
- 18:40 @ Ritiro delle valigie all'Hotel Saibo | città: tokyo | alloggio: saibo
- 18:45 > 🚕 Taxi a Tokyo Station 10′ (2 km; a piedi 25′) | via taxi: @saibo > Tokyo Station (Hotel Saibo → Tokyo Station)
- 19:00 * Ekiben (il cestino-pranzo da treno) da Gransta, dentro la stazione: oltre 150 tipi | posto: gransta
- 20:09 >> 🚄 Shinkansen (treno superveloce) Tokyo → Kyoto 20:09 → 22:21 · cena a bordo con l'ekiben · 🚨 valigia oltre 160 cm (somma dei lati): serve il posto con spazio bagagli, verificare il biglietto | treno: shink-10 | prenotato
- 22:21 > 🚶 7′ (550 m) dall'uscita Central della stazione | città: kyoto | via piedi: Kyoto Station > @apa-kyoto (Stazione di Kyoto → APA Hotel)
- 22:30 @ Check-in all'APA Hotel Kyoto Eki Horikawadori (saluti agli amici: volano il 12) · fame? ramen da Honke Daiichi Asahi (🚶 13′, fino all'1:00) | alloggio: apa-kyoto | via piedi: @apa-kyoto > #daiichi-asahi (APA Hotel → ramen Daiichi Asahi)

#### Guida
senso: Gita a Kamakura (cittadina sul mare a un'ora da Tokyo, piena di templi) col gruppo, poi Shinkansen (treno superveloce) per Kyoto la sera.
mangiare:
  • Pranzo: street food a Komachi-dōri (la via dei chioschi): mangiate fermi davanti al banco
  • Cena: ekiben (il cestino da treno) comprato in stazione a Tokyo e mangiato sullo Shinkansen
  • Fame all'arrivo a Kyoto: ramen da Honke Daiichi Asahi (Tabelog 3,74, fino all'1:00)
prenotare:
  • Biglietto giornaliero del trenino Enoden ¥800
  • Shinkansen già prenotato ✅: valigia oltre 160 cm (somma dei lati) = serve il posto con spazio bagagli
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
con: 👬 amico
- 06:50 > 🚶 Hotel → stazione di Kyoto 7′ · 🚆 treno JR Nara line fino a Inari 5′ | via mezzi: @apa-kyoto > #fushimi-inari (Hotel → Fushimi Inari)
- 07:15 * Fushimi Inari fino alle 9:30 (santuario coi 10.000 portali rossi in fila sulla collina; all'alba è vuoto): salite fino al bivio di Yotsutsuji (~45′, vista sulla città) e tornate giù (~4 km in tutto); la cima aggiunge un'ora di gradini senza panorama migliore | posto: fushimi-inari
- 09:45 * Colazione seduti vicino al santuario e pausa (ieri arrivo alle 22:21)
- 11:00 > 🚃 Treno Keihan (linea locale) da Fushimi-Inari a Kiyomizu-Gojō 10′ · 🚶 15′ (1,2 km) | via mezzi: #fushimi-inari > Gojozaka, Higashiyama, Kyoto (Fushimi Inari → Higashiyama)
- 11:45 * Pranzo in zona Higashiyama (il quartiere storico a est, tra Gojō-zaka e Matsubara-dōri)
- 12:45 > 🚶 10′ (700 m in salita) | via piedi: Gojozaka, Higashiyama, Kyoto > #kiyomizu-dera (Pranzo → Kiyomizu-dera)
- 13:00 * Kiyomizu-dera (tempio di legno su palafitte con terrazza sulla città) · 14:15 Sannenzaka e Ninenzaka (vicoli in salita con case di legno e negozietti) · 15:30 pausa tè | posto: kiyomizu-dera
- 16:15 > 🚶 10′ (600 m) | via piedi: Ninenzaka, Kyoto > #pagoda-yasaka (Ninenzaka → pagoda di Yasaka)
- 16:30 * Pagoda di Yasaka al tramonto (16:55): la foto classica di Kyoto, dalla salita di Yasaka-dōri | posto: pagoda-yasaka
- 17:00 > 🚶 10′ (800 m) | via piedi: #pagoda-yasaka > #hanami-koji (Pagoda → Hanami-kōji)
- 17:10 * Gion e Hanami-kōji (la via delle geisha) mentre si accendono le lanterne | posto: hanami-koji
- 18:00 * Gion Corner (teatro su Hanami-kōji): 1 h di assaggi di arti tradizionali, danza delle maiko (apprendiste geisha), teatro comico, marionette (~¥5.500) | posto: gion-corner | prenotare
- 19:00 > 🚶 A Pontochō, 15′ (1,2 km) | via piedi: #gion-corner > #pontocho (Gion Corner → Pontochō)
- 19:15 * Cena a Pontochō (vicolo stretto di ristoranti sul fiume) in una izakaya (osteria giapponese: piattini da condividere + birra) | posto: pontocho
- 20:45 * Kiyamachi-dōri (via lungo il canale): bar in piedi, birra artigianale e osterie fino a mezzanotte | posto: kiyamachi
- 23:00 > Rientro (3 km): 🚕 taxi 12′ (~¥1.500) o 🚶 12′ fino a Shijō + 🚇 metro Karasuma fino a Kyoto 4′ + 🚶 7′ | via mezzi: #kiyamachi > @apa-kyoto (Kiyamachi → hotel)

#### Guida
senso: Kyoto classica: santuario dei portali rossi all'alba, tempio su palafitte, vicoli antichi, quartiere delle geisha al tramonto, spettacolo di arti tradizionali e serata nei bar lungo il canale.
mangiare:
  • Colazione seduti vicino a Fushimi Inari dopo la salita
  • Pranzo in zona Higashiyama (quartiere storico) verso le 11:45
  • Cena in una izakaya (osteria giapponese, piattini da condividere) a Pontochō, il vicolo dei ristoranti sul fiume
prenotare:
  • 🚨 Gion Corner ore 18:00 per 2 (non rimborsabile)
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
con: 👬 amico
- 07:10 > 🚶 Hotel → stazione di Kyoto 7′ · 🚆 treno JR Sagano line fino a Saga-Arashiyama 15′ · 🚶 10′ al bambù | via mezzi: @apa-kyoto > #bambu-arashiyama (Hotel → bosco di bambù)
- 07:50 * Bosco di bambù di Arashiyama (il quartiere verde a ovest di Kyoto; vuoto solo a quest'ora) | posto: bambu-arashiyama
- 08:30 > 🚶 Al ponte Togetsukyō e al Monkey Park, 15′ (1,2 km) | via piedi: #bambu-arashiyama > #monkey-park (Bambù → Monkey Park)
- 09:00 * Monkey Park Iwatayama (collina con scimmie libere e vista su Kyoto): 20–30′ di salita, ¥800 in contanti | posto: monkey-park
- 10:00 > 🚶 Alla stazione del Randen (il tram storico di Kyoto) di Arashiyama 10′ · 🚃 Randen, cambio a Katabiranotsuji, fino a Ryōanji ~30′ · 🚶 7′ | via mezzi: Arashiyama Station Randen, Kyoto > #ryoan-ji (Monkey Park → Ryōan-ji)
- 10:50 * Ryōan-ji (il giardino zen più famoso: 15 rocce su ghiaia rastrellata; ¥600, 30–40′) | posto: ryoan-ji
- 11:30 > 🚶 A Kinkaku-ji, 20′ (1,5 km) | via piedi: #ryoan-ji > #kinkaku-ji (Ryōan-ji → Kinkaku-ji)
- 12:00 * Kinkaku-ji (il Padiglione d'Oro, tempio ricoperto di foglia d'oro su un laghetto; ¥500, 40′) | posto: kinkaku-ji
- 12:45 > 🚕 Taxi a Ginkaku-ji 25′ (7 km, ~¥3.000) · o bus 204 ~40′ | via taxi: #kinkaku-ji > #ginkaku-ji (Kinkaku-ji → Ginkaku-ji in taxi) | via mezzi: #kinkaku-ji > #ginkaku-ji (Kinkaku-ji → Ginkaku-ji in bus)
- 13:15 * Pranzo nella via Ginkakuji-michi (davanti al Padiglione d'Argento)
- 14:15 * Ginkaku-ji (il Padiglione d'Argento, con giardino di sabbia e muschio; ¥500, 45′) | posto: ginkaku-ji
- 15:00 * Sentiero del Filosofo (passeggiata di 2 km lungo un canale alberato, ~35′ con le soste) · Hōnen-in (tempietto nel bosco, gratis) · Eikan-dō (tempio famoso per gli aceri) facoltativo, ultimo ingresso 16 | posto: sentiero-filosofo | via piedi: #ginkaku-ji > #nanzen-ji (Ginkaku-ji → Nanzen-ji)
- 15:50 * Nanzen-ji (grande tempio zen: portone Sanmon e acquedotto in mattoni dell'800; ultimo ingresso 16:40) | posto: nanzen-ji
- 16:35 > 🚶 8′ (600 m) | via piedi: #nanzen-ji > #keage-incline (Nanzen-ji → Keage Incline)
- 16:45 * Keage Incline (vecchi binari in salita tra gli alberi) al tramonto (16:55) | posto: keage-incline
- 17:15 > 🚇 Metro Tōzai line da Keage a Kyoto Shiyakusho-mae (il municipio) 8′ · 🚶 8′ | via mezzi: Keage Station, Kyoto > #nishiki (Keage → Nishiki)
- 17:30 * Mercato di Nishiki (via coperta di banchi di cibo, chiude 17–18) o Samurai & Ninja Museum (armature, prova con la katana; fino alle 18:30) | posto: nishiki
- 19:00 * Cena da Ramen Sen no Kaze (via Shinkyōgoku, 12–21, chiuso mar–mer) | posto: sen-no-kaze | via piedi: #nishiki > #sen-no-kaze (Nishiki → Sen no Kaze)
- 20:00 > 🚇 Metro Karasuma da Shijō a Kyoto 4′ + 🚶 7′ (o 🚕 10′) | via mezzi: #sen-no-kaze > @apa-kyoto (Sen no Kaze → hotel)
- 20:30 * Relax o sentō (bagno pubblico giapponese), a letto presto: domani treno alle 8:31

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
con: 👬 amico
- 07:45 @ Check-out dall'APA Hotel · colazione + spuntino in stazione | alloggio: apa-kyoto
- 07:50 > 🚶 Alla stazione con le valigie, 7′ · al binario 0 alle 8:15 | via piedi: @apa-kyoto > Kyoto Station (Hotel → stazione di Kyoto)
- 08:31 >> 🚆 Treno Hida 25 DIRETTO 8:31 → 12:14: Kyoto (binario 0) → Takayama (cittadina antica di legno tra le montagne), zero cambi con le valigie | treno: hida-13 | prenotato
- 12:15 > 🚶 All'hotel 3′ (250 m) | città: takayama | via piedi: Takayama Station > @alpina (Stazione → Spa Hotel Alpina)
- 12:20 @ Valigie allo Spa Hotel Alpina (check-in dalle 15:00; hotel moderno con onsen, le terme, sul tetto) | alloggio: alpina
- 12:30 > 🚶 A Sanmachi, 12′ (900 m) | via piedi: @alpina > #kotte-ushi (Hotel → Kotte Ushi)
- 12:45 * Pranzo: sushi di Hida beef (il manzo pregiato locale, scottato su riso) da Kotte Ushi, nei vicoli di Sanmachi; chiuso il martedì | posto: kotte-ushi
- 13:25 > 🚶 5′ (400 m) | via piedi: #kotte-ushi > #jinya (Kotte Ushi → Jinya)
- 13:30 * Takayama Jinya (l'antico palazzo del governatore; 8:45–16:30, ¥440, 45′) | posto: jinya
- 14:25 > 🚶 5′ | via piedi: #jinya > #sanmachi (Jinya → Sanmachi)
- 14:30 * Sanmachi-suji (le 3 vie di case di legno antiche) + giro delle distillerie di sakè: Harada (~¥450 con bicchierino ricordo), Hirase (~¥1.000 per 20+ sakè), Funasaka (assaggi self-service) · in alternativa Showa-kan (museo della vita anni '50) | posto: sanmachi
- 16:40 * Ponte rosso Nakabashi al tramonto (16:50) | posto: nakabashi
- 17:00 > 🚶 All'hotel 12′ (1 km) | via piedi: #nakabashi > @alpina (Nakabashi → hotel)
- 17:15 @ Check-in allo Spa Hotel Alpina | alloggio: alpina
- 18:00 > 🚶 12′ (900 m) | via piedi: @alpina > #kitchen-hida (Hotel → Kitchen Hida)
- 18:15 * Cena: Steak House Kitchen Hida, Hida beef frollato (Tabelog 3,78; ultimo ordine 19:45, ~¥10.000 a testa, chiuso mer.) | posto: kitchen-hida | prenotare
- 20:00 > 🚶 All'hotel 12′ | via piedi: #kitchen-hida > @alpina (Kitchen Hida → hotel)
- 20:15 * Onsen panoramico sul tetto dell'Alpina (fino all'1:00)

#### Guida
senso: Treno panoramico tra le montagne fino a Takayama: città antica di legno, assaggi di sakè, manzo di Hida e terme sul tetto dell'hotel.
mangiare:
  • Pranzo: sushi di Hida beef (manzo locale scottato su riso) da Kotte Ushi (Tabelog 3,43)
  • Cena: Steak House Kitchen Hida (Tabelog 3,78), la bistecca di Hida beef più votata della città, ~€55 a testa
prenotare:
  • 🚨 Kitchen Hida ore 18:00 per 2 (online)
  • Treno Hida 25 già prenotato ✅
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
con: 👬 amico
- 06:50 > 🚶 Al mercato, 12′ (1 km) | via piedi: @alpina > #mercato-miyagawa (Hotel → mercato Miyagawa)
- 07:00 * Mercato mattutino Miyagawa (bancarelle sul fiume, 7–12): sottaceti, mochi grigliati (dolcetti di riso) · 40′ bastano | posto: mercato-miyagawa
- 07:45 > 🚶 Alla stazione dei bus Nōhi, 12′ (1 km, accanto alla stazione dei treni) | via piedi: #mercato-miyagawa > Takayama Nohi Bus Center (Mercato → stazione dei bus)
- 08:10 >> 🚌 Bus Nōhi 8:10 → Shirakawa-go 9:00 (~50′, ¥2.600) · prenotabile dal 14/10 | treno: bus-14 | prenotare | via mezzi: Takayama Nohi Bus Center > Shirakawa-go Bus Terminal (Bus per Shirakawa-go)
- 09:00 > 🚶 Al belvedere Shiroyama, 20′ in salita (1 km; o navetta ~¥200) | via piedi: Shirakawa-go Bus Terminal > #belvedere-shiroyama (Bus → belvedere)
- 09:30 * Shirakawa-go (villaggio patrimonio UNESCO con case dai tetti di paglia a punta, dette gasshō, «mani giunte»): prima il belvedere (luce bassa, pochi gruppi), poi il villaggio e casa Wada (l'unica grande casa visitabile) · restate sui sentieri: risaie e case private sono protette | posto: shirakawa-go
- 12:15 * Pranzo a Shirakawa-go
- 13:30 >> 🚌 Bus Shirakawa-go → Takayama (~50′) · corsa tra le 13:30 e le 14:30, da fissare · 🚶 3′ all'hotel | treno: bus-14 | prenotare | via mezzi: Shirakawa-go Bus Terminal > @alpina (Shirakawa-go → hotel)
- 14:30 * Pomeriggio lento: riposo all'Alpina · onsen sul tetto verso le 16:30
- 17:45 > 🚶 A Kyōya, 15′ (1,2 km) | via piedi: @alpina > #kyoya (Hotel → Kyōya)
- 18:00 * Cena da Kyōya (cucina rustica di montagna in una casa antica: hoba miso, cioè miso cotto su una foglia sul braciere, e Hida beef; 17–20, chiuso mar.) | posto: kyoya | prenotare
- 19:45 > 🚶 All'hotel 15′ | via piedi: #kyoya > @alpina (Kyōya → hotel)
- 20:00 * Valigia pronta · a letto presto (domani treno alle 8:00, check-out alle 7:40)

#### Guida
senso: Mercato sul fiume all'alba e gita a Shirakawa-go, il villaggio delle case col tetto di paglia; pomeriggio di riposo e terme.
mangiare:
  • Al mercato: mochi grigliati (dolcetti di riso) e sottaceti
  • Pranzo a Shirakawa-go verso le 12, prima della folla
  • Cena: Kyōya, cucina di montagna in una casa antica (hoba miso, Hida beef; Tabelog 3,33)
prenotare:
  • 🚨 Bus Takayama ↔ Shirakawa-go: prenotabile dal 14/10, andata 8:10 e ritorno sono 2 prenotazioni separate
  • 🚨 Kyōya ore 18:00 per 2 (telefono o tramite hotel)
attenzione:
  • Il sabato è il giorno più affollato a Shirakawa-go
  • Le case abitate non si visitano, le risaie non si calpestano
anticipo: • Passeggiata nella zona dei templi di Takayama (Higashiyama, a est del centro)
stanchi: • Saltate il mercato e prendete un bus più tardi; non tagliate Shirakawa-go
camminata: ~9 km (salita al belvedere) · bus 1 h 40 · pause: pranzo 1 h, riposo 2 h, terme 1 h, cena 1 h 30

### 2026-11-15
percorso: takayama > osaka
dorme: hillarys
con: 👬 amico
- 07:40 @ Check-out dall'Alpina (colazione veloce) · 🚶 3′ alla stazione | alloggio: alpina | via piedi: @alpina > Takayama Station (Hotel → stazione di Takayama)
- 08:00 >> 🚆 Treno Hida Takayama 8:00 → Nagoya 10:34 | treno: hida-15 | prenotato
- 10:58 >> 🚄 Cambio a Nagoya (~24′) · Shinkansen (treno superveloce) Nagoya → Shin-Osaka (la stazione dello Shinkansen di Osaka) 10:58 → 11:48 | treno: shink-15 | prenotato
- 12:00 > 🚇 Metro Midōsuji da Shin-Osaka a Shinsaibashi 15′ + 🚶 4′ | città: osaka | via mezzi: Shin-Osaka Station > @hillarys (Shin-Osaka → Hotel Hillarys)
- 12:20 @ Valigie all'Hotel Hillarys Shinsaibashi | alloggio: hillarys
- 12:25 > 🚶 A Dōtonbori, 10′ (700 m) | via piedi: @hillarys > #dotonbori (Hotel → Dōtonbori)
- 12:35 * Dōtonbori (il canale coi neon giganti, cuore di Osaka): street food, takoyaki (polpette di polpo) | posto: dotonbori
- 13:30 > 🚶 A Den Den Town, 15′ (1,3 km) | via piedi: #dotonbori > #super-potato (Dōtonbori → Den Den Town)
- 13:45 * Den Den Town (il quartiere nerd di Osaka, l'Akihabara locale): Super Potato (negozio di videogiochi retro, weekend 10–20), Mandarake Grand Chaos (manga, figure e giochi usati, 12–20), Animate (negozio di anime), sale giochi | posto: den-den-town
- 15:15 > 🚶 A Shinsekai, 12′ (1 km) | via piedi: #super-potato > #tsutenkaku (Den Den Town → Shinsekai)
- 15:30 * Shinsekai (quartiere retrò anni '50): torre Tsūtenkaku al tramonto (16:55; ¥1.000), sale giochi d'epoca · assaggio di kushikatsu (spiedini fritti) da Daruma: vietato intingere due volte nella salsa comune | posto: daruma
- 17:10 > 🚇 Metro Midōsuji da Dōbutsuen-mae a Shinsaibashi 8′ (3 km) + 🚶 4′ | via mezzi: #tsutenkaku > @hillarys (Shinsekai → Hotel Hillarys)
- 17:30 @ Check-in all'Hotel Hillarys Shinsaibashi | alloggio: hillarys
- 18:00 > 🚶 12′ (1 km) | via piedi: @hillarys > #fukutaro (Hotel → Fukutaro)
- 18:15 * Cena da Fukutaro: okonomiyaki (la frittata-pizza di Osaka cotta sulla piastra) e negiyaki (versione al cipollotto); Tabelog 3,72, il più votato di Namba; niente prenotazioni: coda | posto: fukutaro
- 19:30 * Dōtonbori di notte (insegne al neon, l'omino della Glico) + Hōzenji Yokochō (vicolo lastricato di lanterne con una statua coperta di muschio), 🚶 3′ | posto: hozenji-yokocho | via piedi: #fukutaro > #hozenji-yokocho (Fukutaro → Hōzenji Yokochō)
- 21:00 * Ura-Namba (vicoli di bar e osterie economiche) o Round1 Sennichimae (centro giochi enorme: sale giochi fino alle 0:50, bowling, karaoke), 🚶 5′ | posto: round1 | via piedi: #hozenji-yokocho > #round1 (Hōzenji → Round1)
- 23:30 > 🚶 All'hotel 15′ (1,2 km) | via piedi: #round1 > @hillarys (Round1 → hotel)

#### Guida
senso: Giornata nerd a Osaka: quartiere dei videogiochi retro, quartiere anni '50 con la torre, poi neon di Dōtonbori e sale giochi la sera.
mangiare:
  • Pranzo: street food a Dōtonbori, takoyaki (polpette di polpo)
  • Spuntino: kushikatsu (spiedini fritti) da Daruma a Shinsekai (Tabelog 3,46, contanti)
  • Cena: Fukutaro, okonomiyaki (frittata-pizza cotta sulla piastra), Tabelog 3,72; la domenica aperto dalle 12; c'è coda
prenotare:
  • Treni del mattino già prenotati ✅
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
con: 👬 amico
- 07:15 @ Check-out dall'Hotel Hillarys | alloggio: hillarys
- 07:20 > 🚶 4′ · 🚇 metro Midōsuji da Shinsaibashi a Umeda (la stazione centrale di Osaka) 6′ · 🚆 treno JR da Osaka a Universal City ~15′ (diretto o cambio a Nishikujō) · ~35′ in tutto · 🧳 valigie negli armadietti grandi fuori dai cancelli | via mezzi: @hillarys > #usj (Hotel → Universal Studios)
- 08:00 * Super Nintendo World (l'area di Mario dentro Universal Studios Japan): Mario Kart, Yoshi, Donkey Kong Country (montagne russe nella miniera) · 🚨 serve l'Area Timed Entry (il biglietto a orario per l'area Nintendo) o l'Express Pass che la include, per 2 | posto: usj | prenotare
- 11:00 * USJ: attrazioni varie
- 12:00 * Pranzo nel parco (prima delle 11:30 o dopo le 13:30)
- 14:00 * Harry Potter · Jurassic Park · Minion
- 16:00 * Hollywood Dream (montagne russe) · uscita entro le 18:15 · ritiro valigie dagli armadietti
- 18:20 > 🚆 Treno JR da Universal City a Shin-Osaka ~30′ (cambi a Nishikujō e Osaka) · ekiben (cestino da treno) per la cena | via mezzi: Universal City Station, Osaka > Shin-Osaka Station (Universal Studios → Shin-Osaka)
- 20:00 >> 🚄 Shinkansen da Shin-Osaka 20:00 → Tokyo 22:24 (ultimo utile 21:24) | treno: shink-16 | prenotato
- 22:30 > 🚆 Treno JR (linea Yamanote o Keihin-Tōhoku) fino a Hamamatsuchō 6′ · 🚶 4′ | città: tokyo | via mezzi: Tokyo Station > @super-hotel (Tokyo Station → Super Hotel)
- 22:50 @ Check-in al Super Hotel Tokyo Hamamatsuchō (entro le 24:00) | alloggio: super-hotel

#### Guida
senso: Universal Studios Japan con Super Nintendo World (il mondo di Mario), poi Shinkansen per Tokyo la sera.
mangiare:
  • Pranzo nel parco prima delle 11:30 o dopo le 13:30
  • Cena: ekiben (cestino da treno) comprato a Shin-Osaka
prenotare:
  • 🚨 Biglietti USJ + Area Timed Entry (orario d'ingresso all'area Nintendo) o Express Pass, per 2
  • Shinkansen già prenotato ✅
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
con: 👬 amico
- 08:30 > 🚶 A Tsukiji, 30′ (2,5 km) · per risparmiare gambe 🚇 metro Ōedo da Daimon a Tsukijishijō 5′ | via piedi: @super-hotel > #tsukiji (Hotel → Tsukiji a piedi) | via mezzi: @super-hotel > #tsukiji (Hotel → Tsukiji in metro)
- 09:00 * Mercato esterno di Tsukiji (l'ex mercato del pesce: banchi di sushi, tamagoyaki cioè frittata dolce, ostriche; contanti) · in alternativa go-kart per le strade (serve patente internazionale) | posto: tsukiji
- 10:15 > 🚶 A Ginza, 12′ (1 km) | via piedi: #tsukiji > #depachika-ginza (Tsukiji → Ginza)
- 10:30 * Ginza (il quartiere elegante dei grandi magazzini): vetrine e negozi monomarca · in alternativa Kabuki-za, un solo atto di teatro kabuki | posto: kabuki-za
- 12:00 * Pranzo a Ginza: depachika (i piani interrati dei grandi magazzini, enormi food hall di piatti pronti) | posto: depachika-ginza
- 13:00 > 🚇 Metro Ginza line da Ginza a Omotesandō 15′ (7 km) · 🚶 10′ a Harajuku | via mezzi: #depachika-ginza > #takeshita-dori (Ginza → Harajuku)
- 13:30 * Harajuku (il quartiere della moda giovane): Takeshita-dōri (via di moda kawaii, crêpe e purikura, le cabine per foto-adesivi) · Meiji Jingū (grande santuario nel bosco, 40′) | posto: takeshita-dori
- 15:00 > 🚶 A Shibuya passando da Cat Street (via pedonale di negozi streetwear), 20′ (1,5 km) | via piedi: #meiji-jingu > #shibuya-sky (Harajuku → Shibuya Sky)
- 15:40 * Shibuya Sky (terrazza panoramica sul tetto di un grattacielo) al tramonto (16:30) · 17:00 PARCO 6° piano (🚶 5′): negozi Nintendo, Pokémon, Capcom, Jump | posto: shibuya-sky | prenotare
- 18:00 > 🚆 Treno JR Yamanote (la linea circolare di Tokyo) da Shibuya a Shinjuku 7′ · 🚶 3′ | via mezzi: Shibuya Station, Tokyo > #omoide-yokocho (Shibuya → Omoide Yokochō)
- 18:15 * Cena veloce a Omoide Yokochō (vicolo di chioschi fumosi di spiedini alla brace) | posto: omoide-yokocho
- 18:50 > 🚶 7′ (500 m) | via piedi: #omoide-yokocho > #samurai-restaurant (Omoide Yokochō → Samurai Restaurant)
- 19:00 * Samurai Restaurant Time (a Kabukichō, nell'ex Robot Restaurant): show kitsch con tamburi taiko, samurai, ninja e carri al neon, 2 h, da ¥8.000 con 2 drink | posto: samurai-restaurant | prenotare
- 21:10 * Testa di Godzilla + Golden Gai (6 vicoli con oltre 200 micro-bar da 5–10 posti, 🚶 5′) per l'ultimo giro | posto: golden-gai | via piedi: #samurai-restaurant > #golden-gai (Samurai → Golden Gai)
- 23:30 > 🚆 Yamanote da Shinjuku a Hamamatsuchō 26′ + 🚶 4′ · ultimo treno ~0:30 | via mezzi: #golden-gai > @super-hotel (Golden Gai → hotel)

#### Guida
senso: Ultimo giorno pieno a Tokyo: mercato del pesce, Ginza, Harajuku, terrazza panoramica di Shibuya al tramonto, show dei samurai e bar minuscoli a Shinjuku.
mangiare:
  • Colazione: mercato di Tsukiji (sushi, frittata dolce, ostriche; contanti)
  • Pranzo: depachika di Ginza (food hall nei sotterranei dei grandi magazzini)
  • Cena veloce: Omoide Yokochō (vicolo di spiedini alla brace) prima dello show
prenotare:
  • 🚨 Shibuya Sky: biglietti il 2/11 alle 16:00 italiane, ingresso 15:40, per 2
  • 🚨 Samurai Restaurant Time ore 19:00 per 2
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
con: 👬 amico
- 07:20 > 🚶 A Zōjō-ji, 8′ (600 m) | via piedi: @super-hotel > #zojo-ji (Hotel → Zōjō-ji)
- 07:30 * Zōjō-ji (grande tempio con la Tokyo Tower dietro: la foto classica, gratis) · 08:15 colazione in hotel + ultimi acquisti | posto: zojo-ji
- 09:30 @ Check-out dal Super Hotel (entro le 10) | alloggio: super-hotel
- 09:45 > 🚝 Monorotaia Tokyo Monorail da Hamamatsuchō all'aeroporto Haneda Terminal 3 ~15′ (~¥500) | via mezzi: @super-hotel > Haneda Airport Terminal 3 (Hotel → aeroporto Haneda)
- 10:15 * 🚨 Rimborso tax-free (l'IVA sugli acquisti) al terminale apposito PRIMA di imbarcare le valigie · il check-in ITA chiude alle 12:20
- 13:20 >> ✈️ Volo AZ793 Tokyo Haneda → Roma Fiumicino (arrivo 20:25) | prenotato

#### Guida
senso: Ultima foto al tempio con la Tokyo Tower dietro, poi aeroporto: volo alle 13:20.
mangiare:
  • Colazione in hotel
  • Pranzo in aeroporto dopo i controlli
prenotare: • Passaporto e scontrini tax-free
attenzione:
  • 🚨 Rimborso tax-free al terminale apposito PRIMA di imbarcare le valigie
  • Il check-in ITA chiude alle 12:20
stanchi: • Saltate Zōjō-ji e dormite
camminata: ~3 km · monorotaia 15′

## Alloggi

### airbnb-shinjuku
nome: Airbnb Shinjuku (Ōkubo)
città: tokyo
dal: 2026-11-06
al: 2026-11-07
prezzo: 80.56
pagato: no, addebito automatico il 15/10 (cancellazione gratuita fino al 23/10)
indirizzo: Ōkubo 2-13-5, Shinjuku-ku, Tokyo 169-0072
arrivo: Stazione Higashi-Shinjuku (metro Ōedo) 🚶 5′ · JR Shinjuku 🚶 20′
orari: Check-in dalle 15:00 con cassetta delle chiavi (istruzioni nell'app dal 4/11) · check-out entro le 10:00
maps: 2-13-5 Okubo, Shinjuku City, Tokyo

### cottage-pastorale
nome: Cottage Pastorale (gruppo)
città: kawaguchiko
dal: 2026-11-07
al: 2026-11-09
prezzo: 200
pagato: quota del gruppo
indirizzo: Kawaguchi 3064, Fujikawaguchiko (sponda nord del lago)
arrivo: Navetta dell'host dalla stazione di Kawaguchiko · taxi ~10′
orari: Check-in dalle 15:00 · check-out entro le 10:00
maps: Kawaguchi 3064, Fujikawaguchiko, Yamanashi

### saibo
nome: Hotel Nihonbashi Saibo
città: tokyo
dal: 2026-11-09
al: 2026-11-10
prezzo: 94
pagato: no
indirizzo: Nihonbashi Ningyōchō 3-3-16, Chūō-ku, Tokyo
arrivo: Ningyōchō (metro Hibiya / Toei Asakusa) 🚶 2′ · Hamachō (metro Toei Shinjuku) 🚶 6′
orari: Check-in 15:00–24:00 · check-out entro le 10:00 · deposito bagagli
maps: Hotel Nihonbashi Saibo, Ningyocho, Tokyo

### apa-kyoto
nome: APA Hotel Kyoto Eki Horikawadori
città: kyoto
dal: 2026-11-10
al: 2026-11-13
prezzo: 305
pagato: no
indirizzo: Shiokōji-dōri / Aburanokōji, Shimogyō-ku, Kyoto
arrivo: Stazione di Kyoto, uscita Central 🚶 7′ · metro Karasuma uscita C7 🚶 5′
orari: Check-in dalle 15:00 · check-out entro le 10:00 · deposito bagagli
maps: APA Hotel Kyoto Eki Horikawadori

### alpina
nome: Spa Hotel Alpina Hida Takayama
città: takayama
dal: 2026-11-13
al: 2026-11-15
prezzo: 314
pagato: no
indirizzo: Nadamachi 5-41, Takayama (Gifu)
arrivo: Stazione di Takayama 🚶 3′ · bus Nōhi accanto alla stazione
orari: Check-in dalle 15:00 · check-out entro le 10:00 · onsen sul tetto fino all'1:00
maps: Spa Hotel Alpina Hida Takayama

### hillarys
nome: Hotel Hillarys Shinsaibashi
città: osaka
dal: 2026-11-15
al: 2026-11-16
prezzo: 66
pagato: no
indirizzo: Higashi-Shinsaibashi 1-17-11, Chūō-ku, Osaka
arrivo: Shinsaibashi (metro Midōsuji) 🚶 4′ · Nagahoribashi 🚶 7′
orari: Check-in 15:00–24:00 · check-out entro le 10:00 · deposito bagagli
maps: Hotel Hillarys Shinsaibashi, Osaka

### super-hotel
nome: Super Hotel Tokyo Hamamatsuchō
città: tokyo
dal: 2026-11-16
al: 2026-11-18
prezzo: 272
pagato: sì
indirizzo: Hamamatsuchō 2-2-1, Minato-ku, Tokyo
arrivo: JR Hamamatsuchō 🚶 4′ · Daimon (metro Ōedo / Toei Asakusa) 🚶 2′ · monorotaia per Haneda
orari: Check-in 15:00–24:00 · check-out entro le 10:00
maps: Super Hotel Tokyo Hamamatsucho

## Treni

### fuji-7
data: 2026-11-07
tratta: Shinjuku → Kawaguchiko
mezzo: Fuji Excursion (treno espresso diretto, solo posti prenotati)
orario: 9:30 → 11:28
prezzo: €53,67
stato: prenotato
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
prezzo: ¥990 + biglietto giornaliero Enoden ¥800 (~€10)
stato: sul posto
nota: Si paga con la Suica; il biglietto giornaliero Enoden si compra alla stazione di Fujisawa.

### shink-10
data: 2026-11-10
tratta: Tokyo → Kyoto
mezzo: Shinkansen (treno superveloce) Tōkaidō
orario: 20:09 → 22:21
prezzo: €175,76
stato: prenotato
link: https://s.klook.com/c/D1Zn6JaV1o
nota: Valigia oltre 160 cm (somma dei lati): serve il posto con spazio bagagli.

### hida-13
data: 2026-11-13
tratta: Kyoto → Takayama
mezzo: Treno espresso Hida 25, diretto (binario 0 a Kyoto)
orario: 8:31 → 12:14
prezzo: €102,09
stato: prenotato
link: https://s.klook.com/c/g3BJGnMMw8
nota: Zero cambi con le valigie; panorama sulle gole del fiume Hida.

### bus-14
data: 2026-11-14
tratta: Takayama ⇄ Shirakawa-go
mezzo: Bus Nōhi (con prenotazione)
orario: andata 8:10 → 9:00 · ritorno su una corsa 13:30–14:30
prezzo: ¥2.600 a tratta (~€14)
stato: da comprare
link: https://japanbusonline.com/CourseSearch/11900040002?afcd=MDI=
nota: Prenotabile dal 14/10; andata e ritorno sono due prenotazioni, per 2 persone.

### hida-15
data: 2026-11-15
tratta: Takayama → Nagoya
mezzo: Treno espresso Hida
orario: 8:00 → 10:34
prezzo: €82
stato: prenotato
link: https://s.klook.com/c/Z3Or7m_o3k
nota: Stesso link Klook della tratta Nagoya → Shin-Osaka (cambio di 24′).

### shink-15
data: 2026-11-15
tratta: Nagoya → Shin-Osaka
mezzo: Shinkansen (treno superveloce) Tōkaidō
orario: 10:58 → 11:48
prezzo: €82
stato: prenotato
link: https://s.klook.com/c/Z3Or7m_o3k

### shink-16
data: 2026-11-16
tratta: Shin-Osaka → Tokyo
mezzo: Shinkansen (treno superveloce) Tōkaidō
orario: 20:00 → 22:24
prezzo: €182,50
stato: prenotato
link: https://s.klook.com/c/vw7g65Km1W
nota: Ultimo treno utile alle 21:24.

## Da fare

### usj
cosa: USJ 16/11: biglietti + Express Pass con ingresso garantito a Super Nintendo World (×2)
quando: Subito (gli slot escono ~2 settimane prima)
priorità: alta
nota: Senza Area Timed Entry nell'area Nintendo non si entra · prezzo variabile, ~€130–195 a testa · orari del 16/11 sul sito ufficiale.

### fuji-9
cosa: Fuji Excursion 9/11 Kawaguchiko → Shinjuku (×2)
quando: Lo compra il gruppo il 9/10
priorità: alta
nota: Verificare che prendano anche i vostri due posti (corse 14:09 → 16:07 o 15:00 → 16:59, solo posti prenotati).

### bus-nohi
cosa: Bus Nōhi Takayama ⇄ Shirakawa-go 14/11 (×2)
quando: Dal 14/10
priorità: alta
nota: Andata 8:10 → 9:00 · ritorno su una corsa 13:30–14:30 · due prenotazioni di sola andata · japanbusonline.com.

### shibuya-sky
cosa: Shibuya Sky 17/11, ingresso ~15:40 (×2)
quando: 2/11 alle 16:00 italiane
priorità: alta
nota: In vendita 2 settimane prima alle 00:00 giapponesi · ¥2.500 · gli slot del tramonto finiscono subito.

### sumo-club
cosa: Asakusa Sumo Club 6/11 ore 18:00 (×2)
quando: Subito (2–3 settimane prima)
priorità: media
nota: ~100 min con cena, da ~$100 a testa; lo slot delle 18 si riempie per primo · asakusa-sumo.com.

### kitchen-hida
cosa: Steak House Kitchen Hida 13/11 ore 18:00 (×2)
quando: Subito (online)
priorità: media
nota: Ultimo ordine 19:45, chiuso mer., ~¥10.000 a testa.

### kyoya
cosa: Kyōya 14/11 ore 18:00 (×2)
quando: Subito (telefono o tramite hotel)
priorità: media
nota: 17:00–20:00, chiuso mar.

### samurai
cosa: Samurai Restaurant Time 17/11 ore 19:00 (×2)
quando: 1–2 settimane prima
priorità: media
nota: Show di 2 h a Kabukichō, da ¥8.000 con 2 drink.

### gion-corner
cosa: Gion Corner 11/11 ore 18:00 (×2)
quando: Quando siete sicuri
priorità: media
nota: 1 h di arti tradizionali, ~¥5.500, biglietti non rimborsabili.

### pagare-hotel
cosa: Pagare gli hotel non ancora pagati (Revolut)
quando: Prima della fine della cancellazione gratuita
priorità: media
nota: Da pagare: Saibo, APA Kyoto, Alpina, Hillarys. Airbnb: addebito automatico il 15/10. Super Hotel già pagato.

### airbnb
cosa: Airbnb Shinjuku: deposito valigie alle ~13:30 del 6/11
quando: Prima della partenza
priorità: media
nota: L'annuncio offre il deposito; chiedere all'host come lasciare le valigie prima del check-in delle 15:00.

### saibo
cosa: Hotel Saibo: custodia valigie il 10/11
quando: Prima della partenza
priorità: media
nota: Check-out alle 6:30, ritiro verso le 18:40, prima dello Shinkansen delle 20:09.

### controlli
cosa: Controlli di inizio novembre
quando: ~1/11
priorità: media
nota: Linea di Takayama (traininfo.jr-central.co.jp) · orari USJ del 16/11 · meteo e foliage.

### documenti
cosa: Visit Japan Web, e-SIM, Suica, assicurazione (×2)
quando: Prima della partenza
priorità: media
nota: QR di Visit Japan Web salvati sul telefono.

### contanti
cosa: Contanti in yen
quando: Prima della partenza
priorità: media
nota: Solo contanti in molti posti: Hoto Fudo, Monkey Park, Tsukiji, Golden Gai, banchi di street food.

### patente
cosa: Patente internazionale modello Ginevra 1949 (solo se fate il go-kart il 17/11)
quando: Prima della partenza
priorità: bassa
nota: Cartacea, insieme alla patente italiana; il modello Vienna 1968 non vale in Giappone.

## Budget

- Volo andata e ritorno: 1226 | da bozza
- Alloggi 12 notti: 765.78 | camere doppie divise in due (€1.131,56 / 2) + quota del cottage €200
- Treni e bus lunghi: 723.02 | €678,02 biglietti Klook + ~€30 Fuji Excursion 9/11 + ~€15 Kamakura
- Trasporti in città: 150 | metro e bus con la Suica ~€6 al giorno + bus Shirakawa-go ~€28
- Cibo (~13 giorni): 520 | ~€40 al giorno, comprese le cene da Kitchen Hida e Kyōya
- Attività e spettacoli: 300 | Sumo Club ~€90 · Samurai Restaurant ~€43 · Gion Corner ~€30 · Shibuya Sky ~€14 · teamLab
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

### senso-ji
nome: Senso-ji + Nakamise
tipo: ⛩ Tempio
città: tokyo
giorno: 6/11
nota: Sala principale fino alle 17, area sempre aperta; illuminato la sera
maps: Senso-ji Asakusa Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134311-d320447-Reviews-Senso_ji_Temple-Asakusa_Taito_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.senso-ji.jp/english/

### azuma-bashi
nome: Ponte Azuma-bashi (tramonto + Skytree)
tipo: 🌅 Panorama
città: tokyo
giorno: 6/11
nota: 16:30, tramonto 16:42
maps: Azumabashi Bridge Tokyo

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

### sumo-club
nome: Asakusa Sumo Club
tipo: 🎭 Spettacolo
città: tokyo
giorno: 6/11
nota: 18:00, ~100 min con cena chanko-nabe · DA PRENOTARE per 2
maps: Asakusa Sumo Club 東京都台東区浅草2-10-12
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134311-d27189884-Reviews-Asakusa_Sumo_Club-Asakusa_Taito_Tokyo_Tokyo_Prefecture_Kanto.html
tabelog: https://tabelog.com/en/tokyo/A1311/A131102/13292875/
voto: 3,02
sito: https://asakusa-sumo.com/reserve/

### hey-akihabara
nome: HEY — Hirose Entertainment Yard
tipo: 🕹 Sala giochi
città: tokyo
giorno: 6/11
nota: Cabinati retro e moderni, fino alle 23:45
maps: HEY Hirose Entertainment Yard Akihabara
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d10094606-Reviews-Hey-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.taito.co.jp/store/00001703

### gigo-akihabara
nome: GiGO Akihabara
tipo: 🕹 Sala giochi
città: tokyo
giorno: 6/11
nota: UFO catcher, ritmo, picchiaduro
maps: GiGO Akihabara
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066443-d10094610-Reviews-GiGO_Akihabara_1st-Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.gigo.co.jp/en/shops/akihabara3

### taito-station
nome: Taito Station Akihabara
tipo: 🕹 Sala giochi
città: tokyo
giorno: 6/11
nota: Fino alle 23–23:30
maps: Taito Station Akihabara
sito: https://www.taito.co.jp/store/00001802

### godzilla
nome: Testa di Godzilla (Hotel Gracery)
tipo: 📸 Foto
città: tokyo
giorno: 6/11
nota: Kabukichō, 7′ dalla stazione di Shinjuku
maps: Godzilla Head Hotel Gracery Shinjuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133667-d8048204-Reviews-Godzilla_Road_Head-Kabukicho_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://gracery.com/shinjuku/page/godzilla/en/

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

### tenku-no-torii
nome: Tenku no Torii
tipo: ⛩ Panorama
città: kawaguchiko
giorno: 7/11
nota: Col gruppo 15:30 · chiude verso le 16:00
maps: Tenku no Torii Fujikawaguchiko
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1165976-d26832180-Reviews-Tenku_no_torii-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanashi_Prefecture_Koshi.html
sito: https://en.kawaguchiko.net/?p=9830

### momiji-corridor
nome: Momiji Corridor (festival del foliage)
tipo: 🍁 Natura
città: kawaguchiko
giorno: 7/11
nota: Illuminazione dal tramonto alle 21:00
maps: Momiji Corridor Kawaguchiko
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1165976-d10019717-Reviews-Fuji_Lake_Kawaguchi_Koyo_Festival-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanas.html
sito: https://en.kawaguchiko.net/event-en/fujikawaguchiko-momiji-festival/

### hoto-fudo
nome: Hoto Fudo — Kawaguchiko Kita (sede principale)
tipo: 🍲 Ristorante
città: kawaguchiko
giorno: 7/11
nota: Cena col gruppo · 11–20, chiude prima se finiscono i noodles · contanti
maps: ほうとう不動 河口湖北本店 富士河口湖町河口707
tabelog: https://tabelog.com/en/yamanashi/A1903/A190303/19000116/
voto: 3,48

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

### funivia-kachi-kachi
nome: Mt. Fuji Panoramic Ropeway (Kachi Kachi)
tipo: 🚠 Panorama
città: kawaguchiko
giorno: 8/11
nota: 8:30–17:00, A/R ¥1.000 · solo se il Fuji è scoperto
maps: Mt. Fuji Panoramic Ropeway
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1165976-d1368670-Reviews-Mt_Fuji_Panoramic_Ropeway-Fujikawaguchiko_machi_Minamitsuru_gun_Yamanashi_Prefec.html
sito: https://www.mtfujiropeway.jp/

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

### chureito
nome: Chureito Pagoda
tipo: ⛩ Panorama
città: kawaguchiko
giorno: 9/11
nota: Col gruppo alle 8:00 · ~400 scalini
maps: Chureito Pagoda Fujiyoshida
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g681223-d12132064-Reviews-Chureito_Pagoda-Fujiyoshida_Yamanashi_Prefecture_Koshinetsu_Chubu.html
sito: https://fujiyoshida.net/spot/12

### honcho-street
nome: Honcho Street
tipo: 📸 Foto
città: kawaguchiko
giorno: 9/11
nota: Il Fuji in fondo alla via
maps: Honcho Street Fujiyoshida
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g681223-d20342844-Reviews-Honcho_Nichome_Shotengai-Fujiyoshida_Yamanashi_Prefecture_Koshinetsu_Chubu.html
sito: https://fujiyoshida.net/en/see-and-do/410

### teamlab
nome: teamLab Planets TOKYO
tipo: ✨ Esperienza
città: tokyo
giorno: 9/11
nota: 19:00, prenotato dal gruppo
maps: teamLab Planets TOKYO Toyosu
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14134359-d14951238-Reviews-TeamLab_Planets_TOKYO-Toyosu_Koto_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.teamlab.art/e/planets/

### kokomae
nome: Kamakura-kōkō-mae (passaggio a livello)
tipo: 📸 Foto
città: kamakura
giorno: 10/11
nota: 8:00 col gruppo
maps: Kamakurakokomae Station
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d8400753-Reviews-Kamakura_Kokomae_Station-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://www.enoden.co.jp/en/train/station/kamakurakokomae/

### hokoku-ji
nome: Hōkoku-ji (tempio del bambù)
tipo: 🎋 Tempio
città: kamakura
giorno: 10/11
nota: ¥400, tè matcha nel bambù · può chiudere col maltempo
maps: Hokokuji Temple Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d1311119-Reviews-Hokoku_ji_Temple-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://houkokuji.or.jp/?p=29

### komachi-dori
nome: Komachi-dōri
tipo: 🍡 Street food
città: kamakura
giorno: 10/11
nota: Pranzo 12:30 · mangiare fermi davanti al banco
maps: Komachi-dori Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d1755776-Reviews-Kamakura_Komachidori-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://visit.trip-kamakura.com/things-to-do/komachi-street/

### grande-buddha
nome: Grande Buddha di Kōtoku-in
tipo: 🗿 Tempio
città: kamakura
giorno: 10/11
nota: 8–17, ¥300
maps: Kotoku-in Great Buddha Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d319975-Reviews-Kotoku_in_Great_Buddha_of_Kamakura-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://www.kotoku-in.jp/en/

### hase-dera
nome: Hase-dera
tipo: ⛩ Tempio
città: kamakura
giorno: 10/11
nota: Terrazza sul mare · chiude alle 16:30
maps: Hasedera Temple Kamakura
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g303156-d319981-Reviews-Hasedera_Temple-Kamakura_Kanagawa_Prefecture_Kanto.html
sito: https://www.hasedera.jp/en/

### gransta
nome: Gransta Tokyo — Ekibenya Matsuri
tipo: 🍱 Ekiben
città: tokyo
giorno: 10/11
nota: Cestini da treno per la cena sullo Shinkansen
maps: Ekibenya Matsuri Gransta Tokyo Station
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14129528-d3335816-Reviews-GRANSTA_TOKYO-Marunouchi_Chiyoda_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.gransta.jp/mall/gransta_tokyo/ekibenyamatsuri/

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

### fushimi-inari
nome: Fushimi Inari Taisha
tipo: ⛩ Santuario
città: kyoto
giorno: 11/11
nota: 7:15, fino a Yotsutsuji
maps: Fushimi Inari Taisha Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321456-Reviews-Fushimi_Inari_taisha_Shrine-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://inari.jp/en/

### kiyomizu-dera
nome: Kiyomizu-dera
tipo: ⛩ Tempio
città: kyoto
giorno: 11/11
nota: 13:00
maps: Kiyomizu-dera Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321401-Reviews-Kiyomizu_dera_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kiyomizudera.or.jp/en/

### sannenzaka
nome: Sannenzaka e Ninenzaka
tipo: 🏮 Vicoli
città: kyoto
giorno: 11/11
nota: Tè verso le 15:30
maps: Sannenzaka Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386121-Reviews-Sannenzaka_Ninenzaka-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://ja.kyoto.travel/komafuda/show.php?id=2239&lang=en

### pagoda-yasaka
nome: Pagoda di Yasaka (Hōkan-ji)
tipo: 📸 Foto
città: kyoto
giorno: 11/11
nota: 16:30, tramonto 16:55
maps: Yasaka Pagoda Hokanji Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386172-Reviews-Yasaka_Pagoda-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://kyoto.travel/en/destinations/hokanji-templeyasaka-pagoda/

### hanami-koji
nome: Hanami-kōji (Gion)
tipo: 🏮 Quartiere
città: kyoto
giorno: 11/11
nota: 17:10, quando si accendono le lanterne
maps: Hanamikoji Street Gion Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1956593-Reviews-Hanamikoji_Street-Kyoto_Kyoto_Prefecture_Kinki.html

### gion-corner
nome: Gion Corner
tipo: 🎭 Spettacolo
città: kyoto
giorno: 11/11
nota: 18:00, 1 h di arti tradizionali · DA PRENOTARE per 2
maps: Gion Corner Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d324291-Reviews-Gion_Corner-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kyoto-gioncorner.com/global/en.html

### pontocho
nome: Pontochō
tipo: 🍶 Cena
città: kyoto
giorno: 11/11
nota: Izakaya (osterie giapponesi) sul fiume, 19:15
maps: Pontocho Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321442-Reviews-Pontocho_District-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://ja.kyoto.travel/komafuda/show.php?id=2203&lang=en

### kiyamachi
nome: Kiyamachi-dōri
tipo: 🍺 Vita notturna
città: kyoto
giorno: 11/11
nota: Bar e osterie lungo il canale
maps: Kiyamachi-dori Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d3837245-Reviews-Kiyamachi_Street-Kyoto_Kyoto_Prefecture_Kinki.html

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

### bambu-arashiyama
nome: Bosco di bambù di Arashiyama
tipo: 🎋 Natura
città: kyoto
giorno: 12/11
nota: 7:50, vuoto solo a quest'ora
maps: Arashiyama Bamboo Grove
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1497822-Reviews-Bamboo_Forest_Street-Kyoto_Kyoto_Prefecture_Kinki.html

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

### monkey-park
nome: Monkey Park Iwatayama
tipo: 🐒 Natura
città: kyoto
giorno: 12/11
nota: 9:00 · ¥800 contanti, 20–30′ di salita
maps: Monkey Park Iwatayama Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d665440-Reviews-Monkey_Park_Iwatayama-Kyoto_Kyoto_Prefecture_Kinki.html
sito: http://www.monkeypark.jp/eng-index.html

### ryoan-ji
nome: Ryōan-ji (giardino zen delle 15 rocce)
tipo: 🪨 Tempio
città: kyoto
giorno: 12/11
nota: 10:50 · ¥600
maps: Ryoanji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1386112-Reviews-Ryoan_ji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: http://www.ryoanji.jp/smph/eng/

### kinkaku-ji
nome: Kinkaku-ji (Padiglione d'Oro)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: 12:00 · ¥500
maps: Kinkakuji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321400-Reviews-Kinkakuji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.shokoku-ji.jp/en/kinkakuji/

### ginkaku-ji
nome: Ginkaku-ji (Padiglione d'Argento)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: 14:15 · ¥500
maps: Ginkakuji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321398-Reviews-Ginkakuji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.shokoku-ji.jp/en/ginkakuji/

### sentiero-filosofo
nome: Sentiero del Filosofo
tipo: 🚶 Passeggiata
città: kyoto
giorno: 12/11
nota: 2 km verso sud
maps: Philosopher's Path Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d545965-Reviews-Philosopher_s_Walk-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://kyoto.travel/en/destinations/philosophers-path-tetsugakunomichi/

### honen-in
nome: Hōnen-in
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: Piccolo tempio nel bosco, ingresso libero
maps: Honen-in Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d968349-Reviews-Honen_in-Kyoto_Kyoto_Prefecture_Kinki.html
sito: http://www.honen-in.jp/

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

### nanzen-ji
nome: Nanzen-ji (Sanmon + acquedotto)
tipo: ⛩ Tempio
città: kyoto
giorno: 12/11
nota: Ultimo ingresso 16:40
maps: Nanzenji Temple Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d321091-Reviews-Nanzen_ji_Temple-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://nanzenji.or.jp/

### keage-incline
nome: Keage Incline
tipo: 🌅 Passeggiata
città: kyoto
giorno: 12/11
nota: Al tramonto, 16:45
maps: Keage Incline Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d1975187-Reviews-Keage_Incline-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://biwakososui.city.kyoto.lg.jp/en/place/detail/23

### nishiki
nome: Mercato di Nishiki
tipo: 🍢 Street food
città: kyoto
giorno: 12/11
nota: Banchi fino alle 17–18
maps: Nishiki Market Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d554672-Reviews-Nishiki_Market_Shopping_District-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://www.kyoto-nishiki.or.jp/en/about/

### samurai-ninja-museum
nome: Samurai & Ninja Museum
tipo: ⚔️ Museo
città: kyoto
giorno: 12/11
nota: Armature, katana, shuriken · fino alle 18:30
maps: Samurai Ninja Museum Kyoto
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298564-d13551788-Reviews-Samurai_Ninja_Museum_With_Experience-Kyoto_Kyoto_Prefecture_Kinki.html
sito: https://mai-ko.com/samurai/

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

### jinya
nome: Takayama Jinya
tipo: 🏯 Storia
città: takayama
giorno: 13/11
nota: 13:30 · 8:45–16:30, ¥440
maps: Takayama Jinya
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d320174-Reviews-Takayama_Jinya-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://jinya.gifu.jp/en/

### sanmachi
nome: Sanmachi-suji
tipo: 🏮 Quartiere
città: takayama
giorno: 13/11
nota: Case in legno di epoca Edo (1603–1868)
maps: Sanmachi Suji Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d320175-Reviews-Sanmachi_Suji-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://www.hida.jp/english/touristattractions/takayamacity/historyandculture/4000153.html

### sake-harada
nome: Distilleria Harada
tipo: 🍶 Sakè
città: takayama
giorno: 13/11
nota: ~¥450 con bicchierino ricordo
maps: Harada Sake Brewery Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8769811-Reviews-Harada_Sake_Brewery-Takayama_Gifu_Prefecture_Tokai_Chubu.html

### sake-hirase
nome: Distilleria Hirase
tipo: 🍶 Sakè
città: takayama
giorno: 13/11
nota: ~¥1.000 per oltre 20 sakè
maps: Hirase Sake Brewery Takayama

### sake-funasaka
nome: Distilleria Funasaka
tipo: 🍶 Sakè
città: takayama
giorno: 13/11
nota: Banco e macchinette self-service
maps: Funasaka Sake Brewery Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8145940-Reviews-Funasaka_Shuzo_Brewery-Takayama_Gifu_Prefecture_Tokai_Chubu.html

### nakabashi
nome: Ponte Nakabashi
tipo: 🌅 Foto
città: takayama
giorno: 13/11
nota: Ponte rosso al tramonto, 16:40
maps: Nakabashi Bridge Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d8586387-Reviews-Nakabashi_Bridge-Takayama_Gifu_Prefecture_Tokai_Chubu.html

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

### mercato-miyagawa
nome: Mercato mattutino Miyagawa
tipo: 🍡 Mercato
città: takayama
giorno: 14/11
nota: 7:00–12:00
maps: Miyagawa Morning Market Takayama
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g298113-d1516746-Reviews-Hida_Takayama_Miyagawa_Morning_Market-Takayama_Gifu_Prefecture_Tokai_Chubu.html
sito: https://www.asaichi.net/language/english.html

### shirakawa-go
nome: Shirakawa-go (villaggio)
tipo: 🏡 UNESCO
città: takayama
giorno: 14/11
nota: Case gasshō, col tetto di paglia a punta
maps: Shirakawa-go Ogimachi
sito: https://shirakawa-go.gr.jp/en/

### belvedere-shiroyama
nome: Belvedere Shiroyama (Ogimachi)
tipo: 🌄 Panorama
città: takayama
giorno: 14/11
nota: Prima tappa, 20′ in salita o navetta
maps: Ogimachi Castle Ruins Observatory Shirakawa
sito: https://www.vill.shirakawa.lg.jp/1470.htm

### casa-wada
nome: Casa Wada
tipo: 🏡 Casa storica
città: takayama
giorno: 14/11
nota: La più grande casa col tetto di paglia visitabile
maps: Wada House Shirakawa-go
sito: https://www.vill.shirakawa.lg.jp/1484.htm

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

### dotonbori
nome: Dōtonbori
tipo: 🌃 Quartiere
città: osaka
giorno: 15/11
nota: Street food a pranzo, neon la sera
maps: Dotonbori Osaka
sito: http://www.dotonbori.or.jp/ja/

### den-den-town
nome: Den Den Town (Nipponbashi)
tipo: 🎮 Otaku
città: osaka
giorno: 15/11
nota: 13:30
maps: Den Den Town Nipponbashi Osaka
sito: https://www.nippombashi.jp/

### super-potato
nome: Super Potato — Otaroad
tipo: 🎮 Retro game
città: osaka
giorno: 15/11
nota: Weekend 10–20 · Nipponbashi 3-8-18
maps: スーパーポテト オタロード店 大阪市浪速区日本橋3-8-18
sito: https://www.superpotato.com/shop/otaroad/

### mandarake
nome: Mandarake Grand Chaos
tipo: 🎮 Manga e figure
città: osaka
giorno: 15/11
nota: 12–20
maps: Mandarake Grand Chaos Osaka
sito: https://www.mandarake.co.jp/dir/gcs/

### shinsekai
nome: Shinsekai
tipo: 🏮 Quartiere retrò
città: osaka
giorno: 15/11
nota: 15:30
maps: Shinsekai Osaka
sito: https://shinsekai.net/

### tsutenkaku
nome: Torre Tsūtenkaku
tipo: 🌅 Panorama
città: osaka
giorno: 15/11
nota: Al tramonto · 10–20, ¥1.000
maps: Tsutenkaku Osaka
sito: https://www.tsutenkaku.co.jp/

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

### hozenji-yokocho
nome: Hōzenji Yokochō
tipo: 🏮 Vicolo
città: osaka
giorno: 15/11
nota: Statua di Fudō (divinità buddista) coperta di muschio
maps: Hozenji Yokocho Osaka

### ura-namba
nome: Ura-Namba
tipo: 🍺 Vita notturna
città: osaka
giorno: 15/11
nota: Vicoli di bar e osterie economiche
maps: Ura Namba Osaka

### round1
nome: Round1 Stadium Sennichimae
tipo: 🕹 Sala giochi
città: osaka
giorno: 15/11
nota: Fino alle 0:50, bowling, karaoke
maps: Round1 Stadium Sennichimae Osaka
sito: https://www.round1.co.jp/

### namba-grand-kagetsu
nome: Namba Grand Kagetsu (alternativa)
tipo: 🎭 Comicità
città: osaka
giorno: 15/11
nota: Comici in coppia (manzai) e commedia slapstick, in giapponese ma molto fisica
maps: Namba Grand Kagetsu
sito: https://ngk.yoshimoto.co.jp/
mappa: no

### usj
nome: Universal Studios Japan + Super Nintendo World
tipo: 🎢 Parco
città: osaka
giorno: 16/11
nota: Area Timed Entry o Express per 2 · DA PRENOTARE
maps: Universal Studios Japan
sito: https://www.usj.co.jp/web/en/us

### tsukiji
nome: Mercato esterno di Tsukiji
tipo: 🍣 Mercato
città: tokyo
giorno: 17/11
nota: Colazione alle 9:00 · contanti · chiuso mer/dom
maps: Tsukiji Outer Market Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14129610-d1373675-Reviews-Tsukiji_Jogai_Market-Tsukiji_Chuo_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.tsukiji.or.jp/english/

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

### depachika-ginza
nome: Depachika di Ginza Mitsukoshi
tipo: 🍱 Pranzo
città: tokyo
giorno: 17/11
nota: Food hall nel seminterrato
maps: Ginza Mitsukoshi depachika

### takeshita-dori
nome: Takeshita-dōri
tipo: 🛍 Harajuku
città: tokyo
giorno: 17/11
nota: Moda, crêpe, purikura (cabine per foto-adesivi)
maps: Takeshita Street Harajuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d1373790-Reviews-Takeshita_Street-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.takeshita-street.com/

### meiji-jingu
nome: Meiji Jingū
tipo: ⛩ Santuario
città: tokyo
giorno: 17/11
nota: 40′ nel bosco
maps: Meiji Jingu Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d1373780-Reviews-Meiji_Jingu_Shrine-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.meijijingu.or.jp/en/

### cat-street
nome: Cat Street
tipo: 🚶 Passeggiata
città: tokyo
giorno: 17/11
nota: Harajuku → Shibuya a piedi, 20′
maps: Cat Street Shibuya Tokyo

### shibuya-sky
nome: Shibuya Sky
tipo: 🌅 Panorama
città: tokyo
giorno: 17/11
nota: 15:40, tramonto 16:30 · biglietti dal 2/11 alle 16:00 italiane
maps: Shibuya Sky
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066456-d19274143-Reviews-Shibuya_Sky-Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.shibuya-scramble-square.com/en/

### shibuya-parco
nome: Shibuya PARCO (6° piano)
tipo: 🎮 Shopping nerd
città: tokyo
giorno: 17/11
nota: Nintendo, Pokémon, Capcom, Jump Shop
maps: Shibuya PARCO
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g27462805-d2152004-Reviews-Shibuya_PARCO-Udagawacho_Shibuya_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://en.shibuya.parco.jp/

### omoide-yokocho
nome: Omoide Yokochō
tipo: 🍢 Cena veloce
città: tokyo
giorno: 17/11
nota: Spiedini alla brace, 18:15
maps: Omoide Yokocho Shinjuku
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133673-d1173749-Reviews-Omoide_Yokocho-Nishishinjuku_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://shinjuku-omoide.com/

### samurai-restaurant
nome: Samurai Restaurant Time
tipo: 🎭 Spettacolo
città: tokyo
giorno: 17/11
nota: 19:00, 2 h · DA PRENOTARE per 2
maps: Samurai Restaurant Kabukicho Shinjuku
tripadvisor: https://www.tripadvisor.com/Restaurant_Review-g14133667-d27827586-Reviews-SAMURAI_RESTAURANT-Kabukicho_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://samurai-restaurant.tokyo/

### golden-gai
nome: Golden Gai
tipo: 🍸 Vita notturna
città: tokyo
giorno: 17/11
nota: Micro-bar, coperto ¥500–1.000
maps: Shinjuku Golden Gai
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g14133667-d480651-Reviews-Shinjuku_Golden_Gai-Kabukicho_Shinjuku_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://goldengai.jp/

### zojo-ji
nome: Zōjō-ji + Tokyo Tower
tipo: ⛩ Tempio
città: tokyo
giorno: 18/11
nota: 7:30, foto classica
maps: Zojoji Temple Tokyo
tripadvisor: https://www.tripadvisor.com/Attraction_Review-g1066451-d320446-Reviews-Zojoji_Temple-Minato_Tokyo_Tokyo_Prefecture_Kanto.html
sito: https://www.zojoji.or.jp/en/

## Glossario


### Trasporti
- Shinkansen: Il treno superveloce (fino a 300 km/h) che collega le grandi città
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
- Conbini: Minimarket aperti 24 h (7-Eleven, Lawson, FamilyMart): cibo, bancomat, bagni
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
- Sumo: La lotta giapponese: vince chi spinge l'avversario fuori dal cerchio o lo fa toccare terra
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
- Chanko-nabe: Lo stufato ricco che mangiano i lottatori di sumo
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
