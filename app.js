/* Giappone 2026 — guida tascabile. Tutti i dati arrivano da data.json, generato dal master Excel
   con tools/excel_to_json.py. Qui non c'è nessun dato del viaggio scritto a mano. */
(function () {
  "use strict";

  var CITY = {
    tokyo: { k: "東京", n: "Tokyo" }, kawaguchiko: { k: "河口湖", n: "Kawaguchiko" }, kamakura: { k: "鎌倉", n: "Kamakura" },
    kyoto: { k: "京都", n: "Kyoto" }, takayama: { k: "高山", n: "Takayama" }, osaka: { k: "大阪", n: "Osaka" },
    roma: { k: "ローマ", n: "Roma" }, transit: { k: "移動", n: "In viaggio" }
  };
  var WD = { Lun: "lunedì", Mar: "martedì", Mer: "mercoledì", Gio: "giovedì", Ven: "venerdì", Sab: "sabato", Dom: "domenica" };
  var GUIDE = [
    ["senso", "La giornata in breve"], ["mangiare", "Dove mangiare"], ["prenotare", "Da prenotare / da avere"],
    ["attenzione", "Attenzione"], ["anticipo", "Se avanza tempo"], ["stanchi", "Se siete stanchi"], ["camminata", "A piedi e pause"]
  ];
  var MODE_ICON = { transit: "🚇", walking: "🚶", driving: "🚕" };
  var MODE_TXT = { transit: "Indicazioni con i mezzi", walking: "Indicazioni a piedi", driving: "Indicazioni in taxi" };
  var DEPARTURE = Date.UTC(2026, 10, 5, 14, 5); // 5/11 15:05 ora di Roma (UTC+1)
  var EUR_YEN = 185;

  var D = null;
  var S = { tab: "giorno", day: null, sub: null, q: "", pday: "", mstop: 0 };
  var view = document.getElementById("view");

  // ---------- utilità ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem("g26:" + k)); localStorage.setItem("g26:" + k, JSON.stringify(v)); } catch (e) { return null; } }
  function cityVar(c) { return "var(--" + (CITY[c] && c !== "transit" ? c : "roma") + ")"; }
  function eur(n) { return n == null ? "—" : "€" + Math.round(n).toLocaleString("it-IT"); }
  function mapsQ(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  function a(href, label, cls) { return '<a class="btn ' + (cls || "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(label) + "</a>"; }
  function tokyoNow() {
    var p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    return { date: o.year + "-" + o.month + "-" + o.day, hm: o.hour + ":" + o.minute };
  }
  function fmtDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
  }
  function textToHtml(t) {
    var lines = String(t).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    var bullets = lines.filter(function (l) { return l.indexOf("•") === 0; });
    if (bullets.length && bullets.length === lines.length) {
      return "<ul>" + lines.map(function (l) { return "<li>" + esc(l.replace(/^•\s*/, "")) + "</li>"; }).join("") + "</ul>";
    }
    return lines.map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("");
  }

  // ---------- giorni ----------
  function dayRoute(i) {
    var d = D.days[i], prev = i > 0 ? D.days[i - 1].sleepCity : null, r = [];
    [prev].concat(d.cities).concat([d.sleepCity]).forEach(function (c) {
      if (c && c !== "transit" && r[r.length - 1] !== c) r.push(c);
    });
    if (i === 0) r = ["roma"];
    return r;
  }
  function mainCity(i) { var r = dayRoute(i); return r[r.length - 1] === "roma" && i > 0 ? r[r.length - 2] || "roma" : r[r.length - 1]; }
  function defaultDay() {
    var now = tokyoNow(), i;
    for (i = 0; i < D.days.length; i++) if (D.days[i].id === now.date) return i;
    return now.date > D.days[D.days.length - 1].id ? D.days.length - 1 : 0;
  }
  function currentBlock(day) {
    var now = tokyoNow();
    if (now.date !== day.id) return -1;
    for (var i = 0; i < day.blocks.length; i++) if (day.blocks[i].from <= now.hm && now.hm < day.blocks[i].to) return i;
    return -1;
  }

  function renderDay() {
    var i = S.day, d = D.days[i], route = dayRoute(i), mc = mainCity(i), now = tokyoNow();
    var h = dayStrip(i);

    var prev = i > 0 ? D.days[i - 1] : null, next = i < D.days.length - 1 ? D.days[i + 1] : null;
    h += '<section class="board" style="--c:' + cityVar(mc) + '" aria-label="Giorno ' + d.n + '">';
    h += '<div class="board-top"><div><div class="board-k" lang="ja">' + esc(CITY[mc].k) + '</div><div class="board-name">' + esc(CITY[mc].n) + "</div></div>";
    h += '<div class="board-date">Giorno ' + d.n + "<strong>" + esc(d.dm) + "</strong>" + esc(WD[d.wd] || d.wd) + "</div></div>";
    h += '<div class="board-nav"><button type="button" data-day="' + (i - 1) + '"' + (prev ? "" : " disabled") + "><small>giorno prima</small>" +
      (prev ? esc(prev.dm + " " + CITY[mainCity(i - 1)].n) : "—") + "</button>";
    h += '<button type="button" data-day="' + (i + 1) + '"' + (next ? "" : " disabled") + "><small>giorno dopo</small>" +
      (next ? esc(next.dm + " " + CITY[mainCity(i + 1)].n) : "—") + "</button></div>";
    h += '<div class="board-meta">';
    h += '<div class="row"><span class="lab">Percorso</span><span class="route">' + route.map(function (c, k) {
      return (k ? '<span class="sep">›</span>' : "") + '<span><span class="dot" style="--c:' + cityVar(c) + '"></span>' + esc(CITY[c].n) + "</span>";
    }).join("") + "</span></div>";
    h += '<div class="row"><span class="lab">Dormite</span><span>' + esc(d.sleep || "—") + "</span></div>";
    h += '<div class="row"><span class="lab">Con</span><span>' + esc(d.with) + "</span></div>";
    h += "</div></section>";

    h += nowCard(i);

    var cur = currentBlock(d);
    h += '<div class="line" aria-label="Programma">';
    d.blocks.forEach(function (b, k) {
      var c = b.kind === "long" ? "transit" : (b.city || mc);
      h += '<div class="stop k-' + b.kind + (k === cur ? " is-now" : "") + '" style="--c:' + cityVar(c) + '">';
      h += '<div class="t">' + esc(b.time || b.from) + '</div><div class="rail"><span class="node"></span></div><div class="body"><div class="card">';
      b.segs.forEach(function (s) { h += '<div class="seg-' + s.k + '">' + esc(s.t) + "</div>"; });
      if (b.routes && b.routes.length) {
        h += '<div class="routes">' + b.routes.map(function (r) {
          return '<a class="btn route m-' + r.mode + '" href="' + esc(r.url) + '" target="_blank" rel="noopener"><span aria-hidden="true">' +
            (MODE_ICON[r.mode] || "🧭") + "</span><span>" + esc(r.label) + '<small>' + esc(MODE_TXT[r.mode] || "Indicazioni") + "</small></span></a>";
        }).join("") + "</div>";
      }
      var foot = "";
      if (k === cur) foot += '<span class="pill info">Adesso</span>';
      if (b.status === "ok") foot += '<span class="pill ok">Prenotato</span>';
      if (b.status === "todo") foot += '<span class="pill todo">Da prenotare</span>';
      if (b.link) foot += a(b.link.url, b.link.label === "Maps" ? "Apri in Maps" : "Apri su " + b.link.label);
      if (b.stayLink) foot += '<span class="pill muted">Prenotazione nell\'app Booking / Airbnb</span>';
      if (foot) h += '<div class="foot">' + foot + "</div>";
      h += "</div></div></div>";
    });
    h += "</div>";

    if (dayStops(i).length) {
      h += '<div class="btns" style="margin-top:6px"><button type="button" class="btn transit" data-day="' + i + '" data-go="mappa">Vedi le tappe di oggi sulla mappa</button></div>';
    }

    var g = d.guide || {}, any = GUIDE.some(function (x) { return g[x[0]]; });
    if (any) {
      h += '<h2 class="section-title">Guida del giorno</h2><div class="guide">';
      GUIDE.forEach(function (x, k) {
        if (!g[x[0]]) return;
        h += '<section class="gsec' + (k === 0 ? " lead" : "") + '"><h3>' + esc(x[1]) + "</h3>" + textToHtml(g[x[0]]) + "</section>";
      });
      h += "</div>";
    }
    return h;
  }

  // ---------- mappa del giorno ----------
  var SKIP = /facoltativo|se in anticipo|alternativa|piano B|se piove|prenotazione|^Enoden/i;
  function hotelQ(h) { return /Appartamento|Cottage/i.test(h.name) ? (h.address || h.name) : h.name + ", " + h.city; }
  function hotelFor(dateIso, kind) {
    return D.hotels.find(function (x) { return kind === "start" ? (x.in < dateIso && dateIso <= x.out) : (x.in <= dateIso && dateIso < x.out); });
  }
  function dayStops(i) {
    var d = D.days[i], stops = [];
    var places = D.places.filter(function (p) {
      return p.day === d.dm && !SKIP.test(p.name) && !/Trasporto/.test(p.type) && !/NON è disponibile/.test(p.note);
    });
    if (!places.length) return [];
    var h0 = hotelFor(d.id, "start"), h1 = hotelFor(d.id, "end");
    if (h0) stops.push({ name: h0.name, q: hotelQ(h0), hotel: true });
    places.forEach(function (p) { stops.push({ name: p.name, q: p.q || p.name, place: p }); });
    if (h1) stops.push({ name: h1.name, q: hotelQ(h1), hotel: true });
    return stops;
  }
  function routeChunks(stops) {
    // Google Maps accetta al massimo 9 tappe intermedie: oltre si divide il giro in più parti.
    var out = [], start = 0;
    while (start < stops.length - 1) {
      var end = Math.min(start + 9, stops.length - 1), part = stops.slice(start, end + 1);
      var u = "https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=" + encodeURIComponent(part[0].q) +
        "&destination=" + encodeURIComponent(part[part.length - 1].q);
      if (part.length > 2) u += "&waypoints=" + encodeURIComponent(part.slice(1, -1).map(function (s) { return s.q; }).join("|"));
      out.push({ from: start + 1, to: end + 1, url: u });
      start = end;
    }
    return out;
  }
  function embedUrl(q) { return "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed"; }

  function dayStrip(i) {
    var now = tokyoNow(), h = '<div class="daystrip" role="toolbar" aria-label="Giorni del viaggio">';
    D.days.forEach(function (x, j) {
      h += '<button type="button" class="daychip' + (x.id === now.date ? " today" : "") + '" data-day="' + j + '" aria-pressed="' + (j === i) +
        '" style="--c:' + cityVar(mainCity(j)) + '"><span class="d">' + esc(x.dm) + '</span><span class="w">' + esc(x.wd) + "</span></button>";
    });
    return h + "</div>";
  }

  function renderMapTab() {
    var i = S.day, d = D.days[i], mc = mainCity(i), stops = dayStops(i);
    var h = dayStrip(i);
    h += '<h1 class="page-title">Mappa · ' + esc(d.dm) + " " + esc(CITY[mc].n) + "</h1>";
    if (!stops.length) {
      return h + '<p class="empty">Oggi non ci sono tappe da visitare: è un giorno di volo.</p>';
    }
    var sel = Math.min(S.mstop || 0, stops.length - 1);
    var chunks = routeChunks(stops);
    h += '<p class="page-sub">' + stops.length + " tappe in ordine di visita, dall'alloggio di partenza a quello della sera. " +
      "Il pulsante blu le apre tutte insieme in Google Maps.</p>";
    h += '<div class="btns">' + chunks.map(function (c) {
      return a(c.url, chunks.length > 1 ? "Tappe " + c.from + "–" + c.to + " su Google Maps" : "Tutte le tappe su Google Maps", "transit");
    }).join("") + "</div>";
    h += '<div class="mapframe"><iframe title="Mappa: ' + esc(stops[sel].name) + '" src="' + esc(embedUrl(stops[sel].q)) +
      '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>';
    h += '<p class="foot-note" style="margin-top:6px">Sulla mappa: <strong>' + esc(stops[sel].name) + "</strong>. Tocca una tappa per spostarla.</p>";
    h += '<ol class="stops">';
    var num = 0;
    stops.forEach(function (s, k) {
      var p = s.place, next = stops[k + 1];
      if (!s.hotel) num++;
      h += '<li class="mstop' + (k === sel ? " on" : "") + (s.hotel ? " hotel" : "") + '" style="--c:' + cityVar(mc) + '">';
      h += '<button type="button" class="mstop-main" data-mstop="' + k + '"><span class="n">' + (s.hotel ? "宿" : num) +
        '</span><span class="nm">' + esc(s.name) + (p && p.note ? '<small>' + esc(p.note) + "</small>" : (s.hotel ? "<small>Alloggio</small>" : "")) + "</span></button>";
      h += '<div class="btns mstop-btns">';
      if (p && p.ta) h += a(p.ta, "Tripadvisor");
      else if (p && p.tabelog) h += a(p.tabelog, "Tabelog");
      h += a(mapsQ(s.q), "Apri in Maps");
      if (next) h += a("https://www.google.com/maps/dir/?api=1&travelmode=transit&origin=" + encodeURIComponent(s.q) + "&destination=" + encodeURIComponent(next.q), "Come arrivare alla prossima", "solid");
      h += "</div></li>";
    });
    h += "</ol>";
    return h;
  }

  function nowCard(i) {
    var now = Date.now();
    if (now < DEPARTURE) {
      var days = Math.ceil((DEPARTURE - now) / 86400000);
      var urgent = D.todo.filter(function (t) { return /🔴/.test(t.prio) && !store("todo:" + t.id); }).slice(0, 2);
      var h = '<div class="now"><span class="lab">Prima di partire</span><span class="big">Mancano ' + days + (days === 1 ? " giorno" : " giorni") + "</span>";
      if (urgent.length) h += '<span class="small">Da fare: ' + urgent.map(function (t) { return esc(t.task.replace(/\s*\(×2\)/, "")); }).join(" · ") + "</span>";
      h += '<button type="button" class="btn" data-go="fare">Apri la lista</button></div>';
      return h;
    }
    return "";
  }

  function placeItem(p) {
    var h = '<div class="item"><h3>' + esc(p.name) + '</h3><div class="meta">' + esc(p.type) + " · " + esc(p.city) + " · " + esc(p.day) + "</div>";
    if (p.note) h += '<div class="note">' + esc(p.note) + "</div>";
    h += '<div class="btns">';
    if (p.maps) h += a(p.maps, "Maps");
    if (p.ta) h += a(p.ta, "Tripadvisor");
    if (p.tabelog) h += a(p.tabelog, "Tabelog" + (p.score ? " " + p.score : ""));
    if (p.web) h += a(p.web, "Sito");
    return h + "</div></div>";
  }

  // ---------- treni ----------
  function renderTrains() {
    var h = '<h1 class="page-title">Treni e bus</h1><p class="page-sub">Le tratte lunghe. Gli spostamenti in città sono nel programma di ogni giorno.</p><div class="list">';
    D.trains.forEach(function (t) {
      var st = t.status === "ok" ? '<span class="pill ok">Prenotato</span>' : (t.status === "todo" ? '<span class="pill todo">Da comprare</span>' : "");
      h += '<article class="ticket"><div class="ticket-head"><span>' + (t.date ? esc(fmtDate(t.date)) : "") + "</span>" + st + "</div>";
      h += '<div class="ticket-route">' + esc(t.route.replace(/→/g, " → ").replace(/⇄/g, " ⇄ ")) + '</div><div class="ticket-line">' + esc(t.line) + "</div>";
      h += '<div class="ticket-perf"></div><div class="ticket-body"><dl class="kv"><dt>Durata</dt><dd class="num">' + esc(t.time) +
        "</dd><dt>Prezzo</dt><dd>" + esc(t.eur) + (t.yen ? " · " + esc(t.yen) : "") + "</dd></dl>";
      if (t.note) h += '<div class="note">' + esc(t.note) + "</div>";
      var day = D.days.findIndex(function (d) { return d.id === t.date; });
      h += '<div class="btns">' + (t.link ? a(t.link, "Biglietto Klook", "solid") : "") +
        (day >= 0 ? '<button type="button" class="btn" data-day="' + day + '" data-go="giorno">Vedi il giorno</button>' : "") + "</div>";
      h += "</div></article>";
    });
    return h + "</div>";
  }

  // ---------- alloggi ----------
  function renderHotels() {
    var today = tokyoNow().date;
    var h = '<h1 class="page-title">Alloggi</h1><p class="page-sub">Le prenotazioni si aprono dall\'app Booking o Airbnb: i link di conferma non sono sul sito perché è pubblico.</p><div class="list">';
    D.hotels.forEach(function (x) {
      var tonight = today >= x.in && today < x.out;
      var dayIdx = D.days.findIndex(function (d) { return d.id === x.in; });
      var c = dayIdx >= 0 ? D.days[dayIdx].sleepCity : "roma";
      var paid = /^PAGATO/i.test(x.paid) ? '<span class="pill ok">Pagato</span>' : (x.paid ? '<span class="pill todo">Da pagare</span>' : '<span class="pill muted">Quota del gruppo</span>');
      h += '<article class="item cityline" style="--c:' + cityVar(c) + '"><div class="btns">' + (tonight ? '<span class="pill info">Stanotte</span>' : "") + paid + "</div>";
      h += "<h3>" + esc(x.name) + '</h3><div class="meta num">' + esc(fmtDate(x.in)) + " → " + esc(fmtDate(x.out)) + " · " + x.nights + (x.nights === 1 ? " notte" : " notti") +
        (x.price ? " · " + eur(x.price) + " in totale" : "") + "</div>";
      h += '<dl class="kv">';
      if (x.address) h += "<dt>Indirizzo</dt><dd>" + esc(x.address) + "</dd>";
      if (x.access) h += "<dt>Come arrivare</dt><dd>" + esc(x.access) + "</dd>";
      if (x.hours) h += "<dt>Orari</dt><dd>" + esc(x.hours) + "</dd>";
      h += '</dl><div class="btns">' + a(mapsQ(x.address || x.name), "Apri in Maps", "solid") +
        (x.address ? '<button type="button" class="btn" data-copy="' + esc(x.address) + '">Copia indirizzo</button>' : "") +
        (dayIdx >= 0 ? '<button type="button" class="btn" data-day="' + dayIdx + '" data-go="giorno">Vedi il giorno</button>' : "") + "</div></article>";
    });
    return h + "</div>";
  }

  // ---------- da fare ----------
  function renderTodo() {
    var h = '<h1 class="page-title">Da fare</h1>';
    var left = DEPARTURE - Date.now();
    if (left > 0) {
      var d = Math.floor(left / 86400000), hh = Math.floor(left % 86400000 / 3600000);
      h += '<div class="countdown"><span>Partenza da Fiumicino il 5 novembre alle 15:05</span><span class="big">' + d + " giorni " + hh + " ore</span></div>";
    }
    var items = D.todo.slice().sort(function (x, y) { return (store("todo:" + x.id) ? 1 : 0) - (store("todo:" + y.id) ? 1 : 0); });
    var done = items.filter(function (t) { return store("todo:" + t.id); }).length;
    h += '<p class="page-sub" style="margin-top:14px">' + done + " di " + items.length + " fatte · le spunte restano salvate su questo telefono.</p><div class=\"list\">";
    items.forEach(function (t) {
      var on = !!store("todo:" + t.id);
      var prio = /🔴/.test(t.prio) ? '<span class="pill todo">Urgente</span>' : (/🟢/.test(t.prio) ? '<span class="pill muted">Bassa</span>' : '<span class="pill info">Media</span>');
      h += '<div class="item todo' + (on ? " done" : "") + '"><input type="checkbox" id="cb-' + esc(t.id) + '" data-todo="' + esc(t.id) + '"' + (on ? " checked" : "") + ">";
      h += '<label for="cb-' + esc(t.id) + '"><h3>' + esc(t.task) + '</h3><div class="btns">' + prio + '<span class="pill muted">' + esc(t.when) + "</span></div>";
      if (t.note) h += '<span class="note">' + esc(t.note) + "</span>";
      h += "</label></div>";
    });
    return h + "</div>";
  }

  // ---------- altro ----------
  var SUBS = [
    ["posti", "所", "Posti e link", "Ristoranti e luoghi, con Tripadvisor e Maps"],
    ["mappa", "図", "Mappa del viaggio", "Il percorso città per città"],
    ["glossario", "辞", "Glossario", "Le parole giapponesi spiegate"],
    ["soldi", "円", "Yen ed euro", "Convertitore e budget"],
    ["info", "助", "Info utili", "Emergenze e regole pratiche"],
    ["aggiorna", "新", "Aggiornamenti", "Versione dei dati"]
  ];
  function renderMore() {
    if (S.sub) return '<button type="button" class="btn back" data-sub="">Torna ad Altro</button>' + ({
      posti: renderPlaces, mappa: renderMap, glossario: renderGloss, soldi: renderMoney, info: renderInfo, aggiorna: renderUpdate
    }[S.sub])();
    var h = '<h1 class="page-title">Altro</h1><p class="page-sub">Tutto quello che non sta nel programma del giorno.</p><div class="menu">';
    SUBS.forEach(function (s) {
      h += '<button type="button" data-sub="' + s[0] + '"><span class="mk" lang="ja" aria-hidden="true">' + s[1] + '</span><span class="ml">' + esc(s[2]) + '</span><span class="md">' + esc(s[3]) + "</span></button>";
    });
    return h + "</div>";
  }

  function renderPlaces() {
    var days = [];
    D.places.forEach(function (p) { if (days.indexOf(p.day) < 0) days.push(p.day); });
    var h = '<h1 class="page-title">Posti e link</h1><input class="search" id="q-posti" type="search" placeholder="Cerca un posto, un piatto, una città" value="' + esc(S.q) + '">';
    h += '<div class="filters"><button type="button" class="btn" data-pday="" aria-pressed="' + (S.pday === "") + '">Tutti</button>';
    days.forEach(function (d) { h += '<button type="button" class="btn" data-pday="' + esc(d) + '" aria-pressed="' + (S.pday === d) + '">' + esc(d) + "</button>"; });
    h += '</div><div class="list" id="plist">' + placesList() + "</div>";
    return h;
  }
  function placesList() {
    var q = S.q.toLowerCase().trim();
    var list = D.places.filter(function (p) {
      return (!S.pday || p.day === S.pday) && (!q || (p.name + " " + p.type + " " + p.city + " " + p.note).toLowerCase().indexOf(q) >= 0);
    });
    return list.length ? list.map(placeItem).join("") : '<p class="empty">Nessun posto trovato. Prova con un altro nome o togli il filtro del giorno.</p>';
  }

  function renderGloss() {
    var h = '<h1 class="page-title">Glossario</h1><input class="search" id="q-gloss" type="search" placeholder="Cerca una parola (es. izakaya)" value="' + esc(S.q) + '"><div id="glist">' + glossList() + "</div>";
    return h;
  }
  function glossList() {
    var q = S.q.toLowerCase().trim(), cats = {}, order = [];
    D.glossary.forEach(function (g) {
      if (q && (g.term + " " + g.means).toLowerCase().indexOf(q) < 0) return;
      if (!cats[g.cat]) { cats[g.cat] = []; order.push(g.cat); }
      cats[g.cat].push(g);
    });
    if (!order.length) return '<p class="empty">Parola non trovata. Se manca, aggiungila al foglio Glossario dell\'Excel.</p>';
    return order.map(function (c) {
      return '<h2 class="section-title">' + esc(c) + '</h2><dl class="gloss">' + cats[c].map(function (g) {
        return "<dt>" + esc(g.term) + "</dt><dd>" + esc(g.means) + "</dd>";
      }).join("") + "</dl>";
    }).join("");
  }

  function renderMoney() {
    var h = '<h1 class="page-title">Yen ed euro</h1><p class="page-sub">Cambio usato per tutto il viaggio: 1 € ≈ ' + EUR_YEN + " ¥.</p>";
    h += '<div class="conv"><label class="sr" for="yen" hidden>Yen</label><input id="yen" inputmode="decimal" placeholder="¥" value="1000" aria-label="Yen">' +
      '<span aria-hidden="true">=</span><input id="eur" inputmode="decimal" placeholder="€" aria-label="Euro"></div>';
    h += '<div class="btns" style="margin-top:10px">' + [500, 1000, 3000, 5000, 10000].map(function (y) { return '<button type="button" class="btn" data-yen="' + y + '">¥' + y.toLocaleString("it-IT") + "</button>"; }).join("") + "</div>";
    var tot = D.budget.reduce(function (s, b) { return s + (b.eur || 0); }, 0), max = Math.max.apply(null, D.budget.map(function (b) { return b.eur || 0; }));
    h += '<h2 class="section-title">Budget a persona (stime)</h2><div class="list">';
    D.budget.forEach(function (b) {
      h += '<div class="item"><div style="display:flex;justify-content:space-between;gap:10px"><strong>' + esc(b.item) + '</strong><strong class="num">' + eur(b.eur) + "</strong></div>" +
        '<div class="bar"><span style="width:' + Math.round((b.eur || 0) / max * 100) + '%"></span></div>' + (b.note ? '<div class="meta">' + esc(b.note) + "</div>" : "") + "</div>";
    });
    h += '</div><div class="total"><span>Totale a persona</span><span class="num">' + eur(tot) + "</span></div>";
    return h;
  }

  function renderInfo() {
    var h = '<h1 class="page-title">Info utili</h1><div class="list">';
    h += '<div class="item"><h3>Emergenze</h3><dl class="kv"><dt>Polizia</dt><dd class="num">110</dd><dt>Ambulanza e pompieri</dt><dd class="num">119</dd>' +
      '<dt>Ambasciata</dt><dd>' + a(mapsQ("Ambasciata d'Italia Tokyo"), "Ambasciata d'Italia a Tokyo in Maps") + "</dd></dl></div>";
    h += '<div class="item"><h3>Soldi</h3><p class="note">Molti locali piccoli, mercati, templi e sale giochi vogliono contanti. Gli ATM dei conbini (7-Eleven) accettano le carte estere. Le mance non si danno.</p></div>';
    h += '<div class="item"><h3>Treni e metro</h3><p class="note">La Suica nel Wallet dell\'iPhone vale per metro, treni locali, bus e conbini. Per gli Shinkansen e gli espressi prenotati servono i biglietti Klook. Sulle scale mobili a Tokyo si sta a sinistra, a Osaka a destra.</p></div>';
    h += '<div class="item"><h3>Templi e onsen</h3><p class="note">Nei templi spesso ci si toglie le scarpe. Negli onsen si entra lavati e nudi, l\'asciugamano piccolo non va in acqua; i tatuaggi grandi possono essere un problema.</p></div>';
    h += '<div class="item"><h3>Rifiuti e strada</h3><p class="note">I cestini in strada sono rari: tenete un sacchetto. Mangiare camminando è malvisto nelle vie affollate (Kamakura, Kyoto).</p></div>';
    return h + "</div>";
  }

  function renderUpdate() {
    return '<h1 class="page-title">Aggiornamenti</h1><div class="list"><div class="item"><dl class="kv"><dt>Dati</dt><dd>versione ' + esc(D.version) +
      "</dd><dt>Generati</dt><dd>" + esc(D.generated) + "</dd><dt>Dal file</dt><dd>" + esc(D.source) + '</dd></dl></div><div class="item"><h3>Come si aggiorna</h3>' +
      '<p class="note">Il sito legge tutto dal file Excel master. Si modifica l\'Excel (o si chiede a Claude di farlo), si rilancia lo script che rigenera i dati e si pubblica. ' +
      "Chi ha il sito aperto vede la nuova versione alla prossima apertura con internet; senza rete resta disponibile l'ultima scaricata.</p></div></div>";
  }

  function renderMap() {
    var P = { tokyo: [139.69, 35.68], kawaguchiko: [138.76, 35.50], kamakura: [139.55, 35.32], kyoto: [135.77, 35.01], takayama: [137.25, 36.14], shirakawa: [136.91, 36.26], osaka: [135.50, 34.69] };
    var W = 560, H = 430;
    function xy(c) { return [34 + (P[c][0] - 135.2) / (140.1 - 135.2) * (W - 68), 40 + (36.5 - P[c][1]) / (36.5 - 34.5) * (H - 90)]; }
    var legs = [["tokyo", "kawaguchiko", "7/11"], ["kawaguchiko", "tokyo", "9/11"], ["tokyo", "kamakura", "10/11"], ["kamakura", "kyoto", "10/11"],
      ["kyoto", "takayama", "13/11"], ["takayama", "shirakawa", "14/11"], ["takayama", "osaka", "15/11"], ["osaka", "tokyo", "16/11"]];
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Schema del percorso tra le città">';
    legs.forEach(function (l, k) {
      var p1 = xy(l[0]), p2 = xy(l[1]), bend = (k % 2 ? 1 : -1) * 22;
      var mx = (p1[0] + p2[0]) / 2 + bend, my = (p1[1] + p2[1]) / 2 - bend;
      s += '<path d="M' + p1[0] + " " + p1[1] + " Q" + mx + " " + my + " " + p2[0] + " " + p2[1] + '" fill="none" stroke="var(--transit)" stroke-width="4" stroke-dasharray="' + (l[1] === "shirakawa" ? "6 7" : "0") + '" opacity=".7"/>';
    });
    var labels = { tokyo: ["東京", "Tokyo", -16, -18], kawaguchiko: ["河口湖", "Kawaguchiko", -14, -20], kamakura: ["鎌倉", "Kamakura", -16, 34],
      kyoto: ["京都", "Kyoto", 16, 34], takayama: ["高山", "Takayama", 16, -18], shirakawa: ["白川郷", "Shirakawa-go", -14, -20], osaka: ["大阪", "Osaka", 16, 36] };
    Object.keys(P).forEach(function (c) {
      var p = xy(c), L = labels[c], col = CITY[c] ? cityVar(c) : "var(--takayama)", anchor = L[2] < 0 ? "end" : "start";
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="var(--panel)" stroke="' + col + '" stroke-width="6"/>';
      s += '<text x="' + (p[0] + L[2]) + '" y="' + (p[1] + L[3]) + '" text-anchor="' + anchor + '" font-size="26" font-weight="900">' + L[0] + "</text>";
      s += '<text x="' + (p[0] + L[2]) + '" y="' + (p[1] + L[3] + 20) + '" text-anchor="' + anchor + '" font-size="17" fill-opacity=".75">' + L[1] + "</text>";
    });
    s += "</svg>";
    var h = '<h1 class="page-title">Mappa del viaggio</h1><p class="page-sub">Schema delle tappe (le distanze sono indicative). Per le mappe vere usate «Mappa del giorno» in ogni giornata.</p>';
    h += '<div class="mapwrap">' + s + '</div><div class="list" style="margin-top:12px">';
    D.days.forEach(function (d, i) {
      var r = dayRoute(i);
      h += '<button type="button" class="item cityline" style="--c:' + cityVar(mainCity(i)) + ';text-align:left;cursor:pointer" data-day="' + i + '" data-go="giorno"><strong>' +
        esc(d.dm + " " + d.wd) + '</strong><span class="meta">' + esc(r.map(function (c) { return CITY[c].n; }).join(" › ")) + "</span></button>";
    });
    return h + "</div>";
  }

  // ---------- montaggio ----------
  function render(keepScroll) {
    if (!D) return;
    var html = { giorno: renderDay, mappa: renderMapTab, treni: renderTrains, alloggi: renderHotels, fare: renderTodo, altro: renderMore }[S.tab]();
    view.innerHTML = html;
    document.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-current", t.dataset.tab === S.tab ? "page" : "false"); });
    if (!keepScroll) window.scrollTo(0, 0);
    if (S.tab === "giorno" || S.tab === "mappa") {
      var chip = view.querySelector('.daychip[aria-pressed="true"]');
      if (chip) chip.scrollIntoView({ inline: "center", block: "nearest" });
      var nowEl = view.querySelector(".stop.is-now");
      if (nowEl && !keepScroll) nowEl.scrollIntoView({ block: "center" });
    }
    if (S.sub === "soldi" && S.tab === "altro") conv("yen");
    store("state", { tab: S.tab, day: S.day, sub: S.sub });
  }

  function conv(from) {
    var y = document.getElementById("yen"), e = document.getElementById("eur");
    if (!y || !e) return;
    var v = parseFloat(String((from === "yen" ? y : e).value).replace(/\./g, "").replace(",", "."));
    if (isNaN(v)) return;
    if (from === "yen") e.value = (v / EUR_YEN).toFixed(2).replace(".", ",");
    else y.value = Math.round(v * EUR_YEN);
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, [data-day]");
    if (!t) return;
    if (t.dataset.tab) { S.tab = t.dataset.tab; S.sub = null; S.q = ""; render(); return; }
    if (t.dataset.day !== undefined && t.dataset.day !== "") {
      var n = parseInt(t.dataset.day, 10);
      if (n >= 0 && n < D.days.length) { S.day = n; S.mstop = 0; if (t.dataset.go) S.tab = t.dataset.go; render(); }
      return;
    }
    if (t.dataset.mstop !== undefined) { S.mstop = parseInt(t.dataset.mstop, 10); render(true); return; }
    if (t.dataset.go) { S.tab = t.dataset.go; S.sub = null; render(); return; }
    if (t.dataset.sub !== undefined) { S.sub = t.dataset.sub || null; S.q = ""; S.pday = ""; render(); return; }
    if (t.dataset.pday !== undefined) { S.pday = t.dataset.pday; render(true); return; }
    if (t.dataset.yen) { document.getElementById("yen").value = t.dataset.yen; conv("yen"); return; }
    if (t.dataset.copy) {
      var txt = t.dataset.copy, done = function () { t.textContent = "Copiato"; };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
    }
  });
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.dataset && t.dataset.todo) { store("todo:" + t.dataset.todo, t.checked); render(true); }
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "q-posti") { S.q = t.value; document.getElementById("plist").innerHTML = placesList(); }
    if (t.id === "q-gloss") { S.q = t.value; document.getElementById("glist").innerHTML = glossList(); }
    if (t.id === "yen") conv("yen");
    if (t.id === "eur") conv("eur");
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && D && S.tab === "giorno") render(true); });

  function boot(data) {
    D = data;
    var saved = store("state") || {};
    S.tab = saved.tab || "giorno";
    S.sub = saved.sub || null;
    var live = tokyoNow().date >= D.days[0].id && tokyoNow().date <= D.days[D.days.length - 1].id;
    S.day = live || saved.day == null ? defaultDay() : Math.min(saved.day, D.days.length - 1);
    render();
  }

  fetch("data.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(boot).catch(function () {
    view.innerHTML = '<div class="empty"><h1 class="page-title">Dati non disponibili</h1><p>Non riesco a leggere data.json. Se sei offline, apri il sito una volta con internet: da lì in poi funziona anche senza rete.</p><button type="button" class="btn solid" onclick="location.reload()">Riprova</button></div>';
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
