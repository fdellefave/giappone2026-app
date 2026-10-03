/* Giappone 2026 — guida tascabile. Tutti i dati arrivano da data.json, generato da viaggio.md con build.py:
   qui non c'è nessun dato del viaggio scritto a mano.
   Per provare un'ora diversa: aggiungere ?ora=2026-11-11T10:00+09:00 all'indirizzo. */
(function () {
  "use strict";

  var CITY = { tokyo: "Tokyo", kawaguchiko: "Kawaguchiko", kamakura: "Kamakura", kyoto: "Kyoto", takayama: "Takayama", osaka: "Osaka", roma: "Roma" };
  var TYPE = {
    vedere: { n: "Da vedere", i: "pin" }, fare: { n: "Esperienza", i: "sparkles" }, cibo: { n: "Mangiare", i: "food" },
    sposta: { n: "Spostamento", i: "walk" }, viaggio: { n: "Treno, bus o volo", i: "train" }, hotel: { n: "Hotel", i: "bed" },
    bagagli: { n: "Valigie", i: "luggage" }
  };
  var MODE = { transit: ["train", "Con i mezzi"], walking: ["walk", "A piedi"], driving: ["taxi", "In taxi"] };
  var GUIDE = [["mangiare", "Dove mangiare"], ["prenotare", "Da avere con sé"], ["attenzione", "Attenzione"],
    ["anticipo", "Se avanza tempo"], ["stanchi", "Se siete stanchi"], ["camminata", "A piedi e pause"]];
  // Le schede in basso: l'itinerario completo e quattro mini-itinerari dello stesso giorno.
  var TABS = {
    itinerario: { title: null, empty: "" },
    attivita: { title: "Attività", empty: "Oggi niente visite in programma.", has: function (it) { return it.k === "vedere" || it.k === "fare"; } },
    ristoranti: { title: "Dove mangiare", empty: "Oggi niente pasti in programma.", has: function (it) { return it.k === "cibo"; } },
    hotel: { title: "Hotel e valigie", empty: "", has: function (it) { return it.k === "hotel" || it.k === "bagagli" || !!it.bag; } },
    trasporti: { title: "Treni e spostamenti", empty: "Oggi niente spostamenti.", has: function (it) { return it.k === "sposta" || it.k === "viaggio"; } }
  };
  var DAYTABS = ["itinerario", "attivita", "ristoranti", "hotel", "trasporti"];
  var FOOD_PLACE = /Ristorante|Cena|Street food|Panetteria|Ekiben|Mercato|Pranzo|Ramen|Cibo/i;
  var MONTHS = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var WDAYS = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var WD3 = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  var D = null, RATE = 185, TL = [], TRAINS = {}, HOTELS = {}, USED = {};
  var S = { tab: "itinerario", day: 0, open: {}, tips: false, seg: "fare", sub: null, pday: "", q: "", searching: false };
  var PHOTO = store("photos") || {}; // titolo Wikipedia → indirizzo della miniatura ("" = nessuna foto)
  var view = document.getElementById("view");
  var lastHidden = 0;

  // ---------- utilità ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem("g26:" + k));
      localStorage.setItem("g26:" + k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function icon(name, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function link(href, label, cls, ic) {
    return '<a class="btn ' + (cls || "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + (ic ? icon(ic) : "") + "<span>" + label + "</span></a>";
  }
  function mapsQ(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  // Indicazioni da dove siete fino a q: il mezzo (a piedi, mezzi, taxi) lo scegliete in Google Maps.
  function goto(q) { return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q); }
  function eur(n, approx) { return n == null ? "—" : (approx ? "≈ " : "") + "€" + Math.round(n).toLocaleString("it-IT"); }
  function eur2(n) { return "€" + n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function yen(n) { return "¥" + Math.round(n).toLocaleString("it-IT"); }
  function cityVar(c) { return "var(--" + (CITY[c] ? c : "roma") + ")"; }
  function shortName(n) { return String(n).replace(/\s*\([^)]*\)\s*$/, ""); }
  function toast(msg) {
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  // ---------- foto (miniature di Wikipedia, salvate dal service worker per l'offline) ----------
  function photoOf(it) { var u = it && it.photo && PHOTO[it.photo]; return u || null; }
  function loadPhotos() {
    var want = {};
    Object.keys(D.places).forEach(function (k) { if (D.places[k].photo) want[D.places[k].photo] = 1; });
    D.days.forEach(function (d) { d.items.forEach(function (it) { if (it.photo) want[it.photo] = 1; }); });
    var todo = Object.keys(want).filter(function (t) { return !(t in PHOTO); });
    if (!todo.length) { warmPhotos(); return; }
    var chunks = [];
    for (var k = 0; k < todo.length; k += 40) chunks.push(todo.slice(k, k + 40));
    Promise.all(chunks.map(function (ch) {
      var u = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=480&titles=" +
        encodeURIComponent(ch.join("|"));
      return fetch(u).then(function (r) { return r.json(); }).then(function (j) {
        var q = j.query || {}, map = {}, by = {};
        (q.normalized || []).concat(q.redirects || []).forEach(function (n) { map[n.from] = n.to; });
        Object.keys(q.pages || {}).forEach(function (id) { var pg = q.pages[id]; by[pg.title] = pg.thumbnail ? pg.thumbnail.source : ""; });
        ch.forEach(function (t) { var x = t; for (var g = 0; g < 4 && map[x]; g++) x = map[x]; PHOTO[t] = by[x] || ""; });
      });
    })).then(function () {
      store("photos", PHOTO);
      if (DAYTABS.indexOf(S.tab) >= 0 && !S.searching) { var y = window.scrollY; render(true); window.scrollTo(0, y); }
      warmPhotos();
    }).catch(function () { /* offline: si riprova alla prossima apertura */ });
  }
  function warmPhotos() {
    setTimeout(function () {
      Object.keys(PHOTO).forEach(function (t) { if (PHOTO[t]) fetch(PHOTO[t], { mode: "no-cors" }).catch(function () {}); });
    }, 2500);
  }

  // ---------- ora ----------
  var OVERRIDE = (function () {
    var m = /[?&]ora=([^&]+)/.exec(location.search);
    if (!m) return null;
    var t = Date.parse(decodeURIComponent(m[1]).replace(" ", "+"));
    return isNaN(t) ? null : t - Date.now();
  })();
  function now() { return Date.now() + (OVERRIDE || 0); }
  function partsIn(ms, tz) {
    var p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ms));
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    return { date: o.year + "-" + o.month + "-" + o.day, hm: o.hour + ":" + o.minute };
  }
  function tokyoToday() { return partsIn(now(), "Asia/Tokyo").date; }
  function romeToday() { return partsIn(now(), "Europe/Rome").date; }
  function isoDate(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function dLong(iso) { var d = isoDate(iso); return WDAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  function dShort(iso) { var d = isoDate(iso); return WD3[d.getDay()] + " " + d.getDate() + "/" + (d.getMonth() + 1); }
  function dm(iso) { var d = isoDate(iso); return d.getDate() + "/" + (d.getMonth() + 1); }
  function daysUntil(iso, today) { return Math.round((isoDate(iso) - isoDate(today)) / 86400000); }
  function inMinutes(ms) {
    var m = Math.round(ms / 60000);
    if (m < 1) return "adesso";
    if (m < 60) return "tra " + m + "′";
    var h = Math.floor(m / 60), r = m % 60;
    return "tra " + h + " h" + (r ? " " + r + "′" : "");
  }

  // Linea del tempo di tutto il viaggio: ogni tappa con il suo istante assoluto (fuso di Roma o di Tokyo).
  function buildTimeline() {
    TL = [];
    D.days.forEach(function (d, di) {
      d.items.forEach(function (it, ii) { TL.push({ d: di, i: ii, at: Date.parse(it.at) }); });
    });
    TL.sort(function (a, b) { return a.at - b.at; });
  }
  function phase() {
    var n = now();
    if (n < TL[0].at) return "before";
    if (n > TL[TL.length - 1].at + 3 * 3600000) return "after";
    return "live";
  }
  function curIndex() {
    var n = now(), k = -1;
    for (var j = 0; j < TL.length; j++) if (TL[j].at <= n) k = j;
    return k;
  }
  function tlPos(d, i) {
    for (var j = 0; j < TL.length; j++) if (TL[j].d === d && TL[j].i === i) return j;
    return -1;
  }
  function itemAt(e) { return D.days[e.d].items[e.i]; }
  // La tappa da mostrare come «adesso»: se siete in viaggio verso un posto, è quel posto.
  // Di notte (più di 3 ore dopo l'ultima tappa) si guarda già alla prima tappa del mattino.
  function resting() {
    var c = curIndex();
    return c >= 0 && TL[c + 1] && now() - TL[c].at > 3 * 3600000;
  }
  function nowTarget() {
    var c = curIndex();
    if (c < 0) return null;
    if (resting()) return { d: TL[c + 1].d, i: TL[c + 1].i, travel: false, rest: true };
    var e = TL[c], it = itemAt(e);
    if (it.merged && TL[c + 1]) return { d: TL[c + 1].d, i: TL[c + 1].i, travel: true };
    return { d: e.d, i: e.i, travel: false };
  }
  function stateOf(d, i) {
    var ph = phase();
    if (ph === "before") return "";
    if (ph === "after") return "past";
    var c = curIndex(), p = tlPos(d, i), it = D.days[d].items[i];
    if (resting()) return p <= c ? "past" : "";
    if (it.leg != null && TL[c] && TL[c].d === d && TL[c].i === it.leg) return "travel";
    return p < c ? "past" : (p === c ? "now" : "");
  }
  function currentDay() {
    var ph = phase();
    if (ph === "before") return 0;
    if (ph === "after") return D.days.length - 1;
    var t = nowTarget();
    return t ? t.d : TL[0].d;
  }

  // ---------- testi e icone ----------
  function richText(t) {
    return esc(t).replace(/\[\[([a-z0-9-]+)\]\]/g, function (_, id) {
      var p = D.places[id];
      return p ? '<a class="inl" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(shortName(p.name)) + "</a>" : id;
    });
  }
  function plain(t) { return String(t || "").replace(/\[\[([a-z0-9-]+)\]\]/g, function (_, id) { return D.places[id] ? shortName(D.places[id].name) : id; }); }
  function bulletsHtml(t) {
    var lines = String(t).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.every(function (l) { return l.indexOf("•") === 0; })) {
      return "<ul>" + lines.map(function (l) { return "<li>" + esc(l.replace(/^•\s*/, "")) + "</li>"; }).join("") + "</ul>";
    }
    return lines.map(function (l) { return "<p>" + esc(l.replace(/^•\s*/, "")) + "</p>"; }).join("");
  }
  function moveIcon(it) { var m = it.routes && it.routes[0] ? it.routes[0].mode : "walking"; return MODE[m][0]; }
  function itemIcon(it) {
    if (it.k === "sposta") return moveIcon(it);
    if (it.k === "viaggio") {
      if (it.train) return it.train.indexOf("bus") === 0 ? "bus" : "train";
      return "plane";
    }
    if (it.k === "vedere" && it.place) {
      var ty = D.places[it.place].type || "";
      if (/⛩|🗿|🏯|🎋|🪨/.test(ty)) return "landmark";
      if (/📸|🌅|🌄/.test(ty)) return "camera";
      if (/🍁|🐒|🚶/.test(ty)) return "trees";
    }
    if (it.k === "fare" && it.place) {
      var t2 = D.places[it.place].type || "";
      if (/🕹|🎮/.test(t2)) return "game";
      if (/🎭/.test(t2)) return "drama";
      if (/🍺|🍸/.test(t2)) return "beer";
      if (/🚠/.test(t2)) return "mountain";
    }
    if (it.k === "fare" && /onsen/i.test(it.title)) return "bath";
    return TYPE[it.k].i;
  }
  function pillsFor(it, st) {
    var p = "";
    if (st === "now") p += '<span class="pill now">Adesso</span>';
    if (st === "travel") p += '<span class="pill now">In arrivo</span>';
    if (it.start) p += '<span class="pill muted">Partenza</span>';
    if (it.bag === "in") p += '<span class="pill bag">' + icon("luggage") + "Lasciate le valigie</span>";
    if (it.bag === "out") p += '<span class="pill bag">' + icon("luggage") + "Riprendete le valigie</span>";
    if (it.status === "todo") p += '<span class="pill todo">Da prenotare</span>';
    if (it.status === "paid") p += '<span class="pill ok">' + icon("check") + "Pagato</span>";
    if (it.status === "ok") p += '<span class="pill ok">' + icon("check") + "Prenotato</span>";
    return p;
  }

  // ---------- parti comuni delle schede del giorno ----------
  function mainCity(i) {
    var r = D.days[i].route.filter(function (c) { return c !== "roma"; });
    return r.length ? r[r.length - 1] : "roma";
  }
  function topBar(sel) {
    var today = tokyoToday(), ph = phase(), cd = ph === "live" ? currentDay() : -1;
    var h = '<div class="topbar"><div class="daystrip" role="toolbar" aria-label="Giorni del viaggio">';
    D.days.forEach(function (x, j) {
      var past = ph === "after" || (ph === "live" && j < cd);
      var d = isoDate(x.id);
      h += '<button type="button" class="daychip' + (j === cd || (ph !== "live" && x.id === today) ? " today" : "") + (past ? " past" : "") +
        '" data-day="' + j + '" aria-pressed="' + (j === sel) + '" style="--c:' + cityVar(mainCity(j)) + '" aria-label="' + esc(dLong(x.id)) + '">' +
        '<span class="w">' + WD3[d.getDay()] + '</span><span class="d">' + d.getDate() + "</span></button>";
    });
    return h + '</div><button type="button" class="sbtn" data-search="1" aria-label="Cerca">' + icon("search") + "</button></div>";
  }
  function dayHead(i, tab) {
    var d = D.days[i], ph = phase(), cd = currentDay();
    var h = '<header class="dayhead"><div class="dayhead-top"><span class="kicker">Giorno ' + d.n + " · " + esc(dLong(d.id)) + "</span>";
    h += '<div class="navbtns"><button type="button" class="navbtn" data-day="' + (i - 1) + '" aria-label="Giorno prima"' + (i > 0 ? "" : " disabled") + ">" + icon("left") + "</button>";
    h += '<button type="button" class="navbtn" data-day="' + (i + 1) + '" aria-label="Giorno dopo"' + (i < D.days.length - 1 ? "" : " disabled") + ">" + icon("right") + "</button></div></div>";
    var cities = d.route.map(function (c, k) {
      return (k ? ' <span class="sep">›</span> ' : "") + '<span class="c" style="--c:' + cityVar(c) + '">' + esc(CITY[c]) + "</span>";
    }).join("");
    if (tab === "itinerario") {
      h += "<h1" + (d.route.length > 2 ? ' class="long"' : "") + ">" + cities + "</h1>";
      var walk = (d.guide.camminata || "").split(" · ")[0];
      h += '<div class="facts"><span>' + icon("bed") + esc(d.sleepName) + "</span><span>" + icon("users") + esc(d.with) + "</span>" +
        (walk ? "<span>" + icon("walk") + esc((walk.match(/^[~\d.,\s–-]+km/) || [walk])[0]) + " a piedi</span>" : "") + "</div>";
      if (d.guide.senso) h += '<p class="summary">' + esc(d.guide.senso) + "</p>";
    } else {
      h += "<h1>" + esc(TABS[tab].title) + '</h1><p class="cities">' + cities + "</p>";
    }
    if (ph === "live" && i !== cd) h += '<p style="margin:12px 0 0"><button type="button" class="chip-now" data-now="1">' + icon("locate") + "Vai a oggi, a dove siete adesso</button></p>";
    return h + "</header>";
  }

  // ---------- itinerario e mini-itinerari ----------
  function renderDayTab() {
    var tab = S.tab, i = S.day, d = D.days[i], ph = phase(), cd = currentDay();
    var h = topBar(i);
    if (tab === "itinerario" && ph === "before") h += beforeCard();
    h += dayHead(i, tab);

    if (tab === "itinerario") {
      if (ph === "live" && i === cd) h += nowCard();
      if (ph === "after" && i === D.days.length - 1) h += '<div class="nowcard"><span class="lab">Viaggio finito</span><span class="big">Bentornati!</span></div>';
      if (!store("hinted")) h += '<p class="hint">' + icon("info") + "<span>Tocca una tappa per foto, dettagli e indicazioni. Scorri il dito a destra o a sinistra per cambiare giorno. In alto a destra cerchi qualsiasi cosa.</span></p>";
    }
    if (tab === "hotel") h += tonightCard(i);

    var rows = "";
    d.items.forEach(function (it, k) {
      if (tab === "itinerario") { if (!it.merged) rows += stopHtml(i, k, it, true); }
      else if (TABS[tab].has(it)) rows += stopHtml(i, k, it, false);
    });
    if (rows) h += '<div class="plan' + (tab === "trasporti" ? " moves" : "") + '">' + rows + "</div>";
    else if (TABS[tab].empty) h += '<p class="empty">' + esc(TABS[tab].empty) + "</p>";

    if (tab === "attivita" || tab === "ristoranti") h += extraPlaces(i, tab);
    if (tab === "trasporti") h += dayTrainsNote(i);
    if (tab === "itinerario") {
      h += '<div class="legend" aria-label="Legenda">' + Object.keys(TYPE).map(function (k) {
        return '<span style="--tc:var(--t-' + k + ')"><i></i>' + TYPE[k].n + "</span>";
      }).join("") + "</div>";
      h += tipsHtml(d);
      h += tourHtml(i);
    }
    return h;
  }

  function beforeCard() {
    var left = TL[0].at - now(), days = Math.ceil(left / 86400000);
    var todo = sortedTodo().filter(function (t) { return !store("todo:" + t.id); }).slice(0, 3);
    var h = '<div class="nowcard" style="margin-top:4px"><span class="lab">Prima di partire</span><span class="big">' +
      (days > 1 ? "Mancano " + days + " giorni" : (days === 1 ? "Si parte domani" : "Si parte oggi")) + "</span>";
    if (todo.length) {
      h += '<div class="deadlines">' + todo.map(function (t) {
        return '<div class="deadline"><span>' + esc(t.task) + "</span><b>" + esc(todoWhenShort(t)) + "</b></div>";
      }).join("") + "</div>";
    }
    return h + '<div class="btns"><button type="button" class="btn small" data-info="prenotazioni">' + icon("ticket") + "<span>Cosa manca da prenotare</span></button></div></div>";
  }

  function nextStop(c) {
    for (var j = c + 1; j < TL.length; j++) {
      var it = itemAt(TL[j]);
      if (!it.merged) return { e: TL[j], it: it, leg: it.leg != null ? D.days[TL[j].d].items[it.leg] : null };
    }
    return null;
  }
  function nowCard() {
    var c = curIndex(), e = TL[c], it = itemAt(e), tgt = nowTarget();
    if (tgt.rest) {
      var nx0 = D.days[tgt.d].items[tgt.i], sl = D.days[e.d].sleep && HOTELS[D.days[e.d].sleep];
      return '<div class="nowcard"><span class="lab">Riposo</span>' + (sl ? '<div class="nowline"><span class="t">' + icon("moon") + '</span><span class="x">Dormite all\'' + esc(sl.name) + "</span></div>" : "") +
        '<div class="nowline"><span class="t">' + esc(nx0.t) + '</span><span class="x">Si riparte: ' + esc(nx0.title) + "<small>" + esc(inMinutes(TL[c + 1].at - now())) + "</small></span></div>" +
        '<div class="btns"><button type="button" class="btn small" data-jump="' + tgt.d + "-" + tgt.i + '">Programma di domani</button></div></div>';
    }
    var h = '<div class="nowcard"><span class="lab">' + (tgt.travel ? "Adesso siete in viaggio" : "Adesso dovreste essere qui") + "</span>";
    if (tgt.travel) {
      var dest = D.days[tgt.d].items[tgt.i];
      h += '<div class="nowline"><span class="t">' + esc(it.t) + '</span><span class="x">Verso ' + esc(dest.title) + "<small>" + esc(it.short || "") + " · arrivo previsto " + esc(dest.t) + "</small></span></div>";
    } else {
      h += '<div class="nowline"><span class="t">' + esc(it.t) + '</span><span class="x">' + esc(it.title) + (it.short ? "<small>" + esc(it.short) + "</small>" : "") + "</span></div>";
    }
    var btns = '<button type="button" class="btn small" data-jump="' + tgt.d + "-" + tgt.i + '">Dettagli</button>';
    var nx = tgt.travel ? null : nextStop(c);
    if (nx) {
      var start = nx.leg ? nx.leg : nx.it;
      var when = nx.leg ? "si parte alle " + nx.leg.t + " (" + inMinutes(Date.parse(nx.leg.at) - now()) + ")" : inMinutes(nx.e.at - now());
      h += '<div class="nowline"><span class="t">' + esc(start.t) + '</span><span class="x">Poi: ' + esc(nx.it.title) + "<small>" + esc(when) +
        (nx.leg && nx.leg.short ? " · " + esc(nx.leg.short) : "") + "</small></span></div>";
      if (nx.it.dest) btns += link(goto(nx.it.dest), "Indicazioni per la prossima", "small ghost", "nav");
    } else if (tgt.travel) {
      var dd = D.days[tgt.d].items[tgt.i];
      if (dd.dest) btns += link(goto(dd.dest), "Indicazioni", "small ghost", "nav");
    }
    return h + '<div class="btns">' + btns + "</div></div>";
  }

  function stopHtml(di, ii, it, withLeg) {
    var key = di + "-" + ii, st = stateOf(di, ii), open = !!S.open[key];
    var leg = withLeg && it.leg != null ? D.days[di].items[it.leg] : null;
    var cls = "stop k-" + it.k + (st ? " " + st : "") + (leg ? " has-leg" : "");
    var h = '<div class="' + cls + '" id="s-' + key + '" style="--tc:var(--t-' + it.k + ')">';
    if (leg) {
      var lst = stateOf(di, it.leg);
      h += '<button type="button" class="leg' + (lst === "past" || st === "past" ? " past" : "") + '" data-open="' + key + '" aria-label="Come arrivarci">' +
        '<span class="lt">' + esc(leg.t) + '</span><span class="li">' + icon(moveIcon(leg)) + '</span><span class="lx">' + esc(leg.short || "spostamento") + "</span></button>";
    }
    h += '<button type="button" class="row" data-open="' + key + '" aria-expanded="' + open + '" aria-controls="p-' + key + '">';
    var ph = it.k !== "sposta" && photoOf(it);
    h += '<span class="t">' + esc(it.t) + "</span>" + (ph ? '<span class="dot ph"><img src="' + esc(ph) + '" alt="" loading="lazy" decoding="async"><span class="tb">' +
      icon(itemIcon(it)) + "</span></span>" : '<span class="dot">' + icon(itemIcon(it)) + "</span>");
    var pills = pillsFor(it, st);
    h += '<span class="main"><span class="ttl">' + esc(it.title) + "</span>" + (it.short ? '<span class="sub">' + esc(it.short) + "</span>" : "") +
      (pills ? '<span class="pills">' + pills + "</span>" : "") + "</span>";
    h += '<span class="end">' + icon("down", "chev") + "</span></button>";
    h += '<div class="panel" id="p-' + key + '"' + (open ? "" : " hidden") + ">" + panelHtml(it, leg) + "</div></div>";
    return h;
  }

  function detailsHtml(list, inLeg) {
    var h = "", kv = "", warn = "";
    (list || []).forEach(function (x) {
      if (x.k === "text" || (inLeg && x.k === "come")) h += "<p>" + richText(x.text) + "</p>";
      else if (x.k === "attenzione") warn += '<div class="note-warn">' + icon("alert") + "<span>" + richText(x.text) + "</span></div>";
      else kv += "<div><dt>" + esc(x.label) + "</dt><dd>" + richText(x.text) + "</dd></div>";
    });
    return h + (kv ? '<dl class="kv2">' + kv + "</dl>" : "") + warn;
  }
  function panelHtml(it, leg) {
    var h = "";
    var ph = photoOf(it);
    if (ph) h += '<figure class="pfig"><img src="' + esc(ph) + '" alt="" loading="lazy" decoding="async"><figcaption>Foto: Wikipedia</figcaption></figure>';
    h += detailsHtml(it.details);
    if (leg) {
      h += '<div class="howto"><div class="howto-t">' + icon(moveIcon(leg)) + "<span><b>Come arrivarci</b><small>partenza alle " + esc(leg.t) +
        (leg.short ? " · " + esc(leg.short) : "") + "</small></span></div>" + detailsHtml(leg.details, true) + "</div>";
    }
    var t = it.train && TRAINS[it.train];
    if (t) h += trainBox(t);
    var ho = it.hotel && HOTELS[it.hotel];
    if (ho && (it.k === "hotel" || it.k === "bagagli")) h += hotelBox(ho);

    var b = "";
    if (it.dest) b += link(goto(it.dest), it.k === "viaggio" && it.train ? "Indicazioni per la stazione" : "Indicazioni", "go wide", "nav");
    var p = it.place && D.places[it.place];
    if (p) {
      if (p.ta) b += link(p.ta, "Tripadvisor", "", "star");
      if (p.tabelog) b += link(p.tabelog, "Tabelog" + (p.score ? " " + esc(p.score) : ""), "", "star");
      if (p.web && !p.ta && !p.tabelog) b += link(p.web, "Sito ufficiale", "", "ext");
      if (!p.ta && !p.tabelog && !p.web) b += link(p.maps, "Apri in Maps", "", "pin");
    }
    if (t && t.link) b += link(t.link, /klook/.test(t.link) ? "Biglietto Klook" : "Prenota", "", "ticket");
    if (ho && (it.k === "hotel" || it.k === "bagagli")) {
      if (ho.address) b += '<button type="button" class="btn" data-copy="' + esc(ho.address) + '">' + icon("copy") + "<span>Copia indirizzo</span></button>";
      if (ho.app) b += link(ho.app, /airbnb/.test(ho.app) ? "App Airbnb" : "App Booking", "", "ext");
    }
    if (b) h += '<div class="btns">' + b + "</div>";
    return h || '<p class="sub" style="color:var(--muted)">Nessun dettaglio.</p>';
  }

  function trainState(t) {
    var today = romeToday();
    if (t.status === "pagato") {
      var s = "Pagato" + (t.payer ? " da " + t.payer : "");
      if (t.confirm) s += today < t.confirm ? ". Klook emette i biglietti il " + dm(t.confirm) + ": controllate l'email" : ". Biglietti nell'app Klook";
      return s;
    }
    if (t.status === "da comprare") return "Da comprare";
    if (t.status === "sul posto") return "Si paga sul posto con la Suica";
    return "Prenotato";
  }
  function trainBox(t) {
    return '<div class="infobox"><span class="ttl2">' + esc(t.line) + '</span><dl class="kv">' +
      (t.price ? "<dt>Prezzo</dt><dd>" + esc(t.price) + (t.eur ? " per 2" : "") + "</dd>" : "") +
      "<dt>Biglietto</dt><dd>" + esc(trainState(t)) + "</dd></dl></div>";
  }
  function hotelBox(h) {
    return '<div class="infobox"><span class="ttl2">' + esc(h.name) + '</span><dl class="kv">' +
      (h.address ? "<dt>Indirizzo</dt><dd>" + esc(h.address) + "</dd>" : "") + (h.hours ? "<dt>Orari</dt><dd>" + esc(h.hours) + "</dd>" : "") +
      "<dt>Pagamento</dt><dd>" + esc(hotelPayText(h)) + "</dd></dl></div>";
  }
  function hotelPayText(h) {
    if (h.paid === "sì") return "Pagato" + (h.payer ? " da " + h.payer : "") + " · " + h.price;
    if (h.paid === "gruppo") return h.payment || "Quota del gruppo";
    return h.price + " · " + h.payment;
  }
  function tonightCard(i) {
    var d = D.days[i], x = HOTELS[d.sleep];
    if (!x) return '<div class="card tonight"><span class="meta">Stanotte</span><h3>In volo</h3></div>';
    var night = Math.round((isoDate(d.id) - isoDate(x.in)) / 86400000) + 1;
    var h = '<article class="card tonight" style="box-shadow: inset 4px 0 0 ' + cityVar(x.cityId) + '"><span class="meta">Stanotte · notte ' + night + " di " + x.nights + "</span><h3>" + esc(x.name) + "</h3>";
    h += '<dl class="kv">' + (x.address ? "<dt>Indirizzo</dt><dd>" + esc(x.address) + "</dd>" : "") + (x.hours ? "<dt>Orari</dt><dd>" + esc(x.hours) + "</dd>" : "") +
      (x.access ? "<dt>Come arrivare</dt><dd>" + esc(x.access) + "</dd>" : "") + "<dt>Pagamento</dt><dd>" + esc(hotelPayText(x)) + "</dd></dl>";
    h += '<div class="btns">' + link(goto(x.q), "Indicazioni", "go", "nav") +
      (x.address ? '<button type="button" class="btn" data-copy="' + esc(x.address) + '">' + icon("copy") + "<span>Copia indirizzo</span></button>" : "") +
      (x.app ? link(x.app, /airbnb/.test(x.app) ? "App Airbnb" : "App Booking", "", "ext") : "") + "</div></article>";
    return h;
  }
  function extraPlaces(i, tab) {
    var dmS = D.days[i].dm;
    var list = Object.keys(D.places).map(function (k) { return D.places[k]; }).filter(function (p) {
      if (p.day !== dmS || USED[p.id]) return false;
      var food = FOOD_PLACE.test(p.type);
      return tab === "ristoranti" ? food : !food;
    });
    if (!list.length) return "";
    return '<h2 class="section-title">' + (tab === "ristoranti" ? "Alternative per mangiare" : "Se avanza tempo") + '</h2><div class="list">' + list.map(placeCard).join("") + "</div>";
  }
  function dayTrainsNote(i) {
    var d = D.days[i], out = "";
    D.trains.forEach(function (t) {
      if (t.date === d.id && t.status === "sul posto") out += '<div class="card"><span class="meta">' + esc(t.route) + "</span><h3>" + esc(t.line) + '</h3><p class="note">' + esc(t.price) + " · " + esc(t.note) + "</p></div>";
    });
    return out ? '<h2 class="section-title">Biglietti da fare sul posto</h2><div class="list">' + out + "</div>" : "";
  }
  function tipsHtml(d) {
    var g = d.guide || {};
    var secs = GUIDE.filter(function (x) { return g[x[0]]; });
    if (!secs.length) return "";
    var h = '<section class="tips"><button type="button" data-tips="1" aria-expanded="' + S.tips + '"><span>Consigli per la giornata</span>' + icon("down") + "</button>";
    h += '<div class="body"' + (S.tips ? "" : " hidden") + ">";
    secs.forEach(function (x) { h += "<div><h3>" + esc(x[1]) + "</h3>" + bulletsHtml(g[x[0]]) + "</div>"; });
    return h + "</div></section>";
  }

  // ---------- giro del giorno su Google Maps ----------
  function dayStops(i) {
    var d = D.days[i], stops = [], seen = {};
    function add(q) { if (q && !seen[q]) { seen[q] = 1; stops.push(q); } }
    d.items.forEach(function (it) {
      if (it.k === "sposta" || it.k === "viaggio") return;
      var p = it.place && D.places[it.place];
      if (p && !p.map) return;
      add(it.dest);
    });
    var last = d.sleep && HOTELS[d.sleep];
    if (last) add(last.q);
    return stops;
  }
  function routeChunks(stops) {
    var out = [], start = 0;
    while (start < stops.length - 1) {
      var end = Math.min(start + 9, stops.length - 1), part = stops.slice(start, end + 1);
      var u = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(part[0]) + "&destination=" + encodeURIComponent(part[part.length - 1]);
      if (part.length > 2) u += "&waypoints=" + encodeURIComponent(part.slice(1, -1).join("|"));
      out.push({ from: start + 1, to: end + 1, url: u });
      start = end;
    }
    return out;
  }
  function tourHtml(i) {
    var stops = dayStops(i);
    if (stops.length < 3) return "";
    var ch = routeChunks(stops);
    return '<div class="tour"><div class="tour-t">' + icon("route") + "<span><b>Tutto il giro di oggi</b><small>" + stops.length +
      " tappe in ordine, dall'hotel del mattino a quello della sera</small></span></div>" + '<div class="btns">' + ch.map(function (x, n) {
        return link(x.url, ch.length > 1 ? "Parte " + (n + 1) + " (tappe " + x.from + "–" + x.to + ")" : "Apri in Google Maps", "go block", "map");
      }).join("") + "</div></div>";
  }

  // ---------- prenotazioni ----------
  function todoDate(t) { return t.opens && t.opens >= romeToday() ? t.opens : (t.due || t.day || "9999"); }
  function sortedTodo() {
    var P = { alta: 0, media: 1, bassa: 2 };
    return D.todo.slice().sort(function (a, b) {
      var da = (a.opens || a.due) ? todoDate(a) : "9998", db = (b.opens || b.due) ? todoDate(b) : "9998";
      if (da !== db) return da < db ? -1 : 1;
      if (P[a.prio] !== P[b.prio]) return P[a.prio] - P[b.prio];
      return (a.day || "") < (b.day || "") ? -1 : 1;
    });
  }
  function todoWhenShort(t) {
    var today = romeToday();
    if (t.opens && today < t.opens) return "dal " + dm(t.opens);
    if (t.due) return "entro il " + dm(t.due);
    if (/^subito/i.test(t.when)) return "subito";
    return t.day ? "per il " + dm(t.day) : "";
  }
  function todoPill(t) {
    var today = romeToday();
    if (t.opens && today < t.opens) {
      var o = daysUntil(t.opens, today);
      return '<span class="pill ' + (o <= 3 ? "warn" : "info") + '">Apre il ' + dm(t.opens) + "</span>";
    }
    if (t.due) {
      var n = daysUntil(t.due, today);
      if (n < 0) return '<span class="pill todo">Scaduto il ' + dm(t.due) + "</span>";
      return '<span class="pill ' + (n <= 7 ? "todo" : "muted") + '">' + (n === 0 ? "Entro oggi" : "Entro il " + dm(t.due)) + "</span>";
    }
    if (/^subito/i.test(t.when) || t.prio === "alta") return '<span class="pill todo">Subito</span>';
    return "";
  }
  function counts() {
    var c = { book: 0, manage: 0, booked: 0 };
    D.todo.forEach(function (t) { if (!store("todo:" + t.id)) c[t.kind === "prenotare" ? "book" : "manage"]++; });
    c.booked = D.flights.length + D.hotels.length + D.trains.filter(function (t) { return t.status === "pagato" || t.status === "prenotato"; }).length;
    return c;
  }
  function renderBookings() {
    var c = counts();
    var h = '<header class="page-head"><h1 class="page-title">Prenotazioni</h1><p class="page-sub">Cosa manca, cosa è pagato e da chi.</p></header>';
    h += '<div class="stats"><div class="stat red"><b>' + c.book + "</b><span>da prenotare</span></div>" +
      '<div class="stat"><b>' + c.manage + "</b><span>da sistemare</span></div>" +
      '<div class="stat green"><b>' + c.booked + "</b><span>già prenotati</span></div></div>";
    var segs = [["fare", "Da fare"], ["treni", "Treni e voli"], ["alloggi", "Alloggi"]];
    h += '<div class="seg" role="group" aria-label="Sezione">' + segs.map(function (s) {
      return '<button type="button" data-seg="' + s[0] + '" aria-pressed="' + (S.seg === s[0]) + '">' + s[1] + "</button>";
    }).join("") + "</div>";
    if (S.seg === "treni") h += bookTrains();
    else if (S.seg === "alloggi") h += bookHotels();
    else h += bookTodo();
    return h;
  }
  function todoCard(t) {
    var done = !!store("todo:" + t.id);
    var meta = [];
    if (t.day) meta.push("per " + dShort(t.day).toLowerCase());
    if (t.when && !/^subito$/i.test(t.when)) meta.push(t.when);
    if (t.cost) meta.push(t.cost);
    var h = '<article class="card' + (done ? " done" : "") + '" id="todo-' + esc(t.id) + '"><div class="card-top"><h3>' + esc(t.task) + "</h3>" + (done ? "" : todoPill(t)) + "</div>";
    if (meta.length) h += '<div class="meta">' + esc(meta.join(" · ")) + "</div>";
    if (t.note && !done) h += '<div class="note">' + esc(t.note) + "</div>";
    h += '<div class="btns">' + (t.link && !done ? link(t.link, t.kind === "prenotare" ? "Prenota" : "Apri", "go", "ext") : "") +
      '<button type="button" class="check" data-todo="' + esc(t.id) + '" aria-pressed="' + done + '"><span class="box">' + icon("check") + "</span>Fatto</button></div></article>";
    return h;
  }
  function bookTodo() {
    var all = sortedTodo();
    var book = all.filter(function (t) { return t.kind === "prenotare" && !store("todo:" + t.id); });
    var man = all.filter(function (t) { return t.kind === "gestire" && !store("todo:" + t.id); });
    var done = all.filter(function (t) { return store("todo:" + t.id); });
    var h = "";
    h += '<h2 class="section-title">Da prenotare</h2><div class="list">' + (book.length ? book.map(todoCard).join("") : '<p class="empty">Tutto prenotato.</p>') + "</div>";
    h += '<h2 class="section-title">Da sistemare</h2><div class="list">' + (man.length ? man.map(todoCard).join("") : '<p class="empty">Niente da sistemare.</p>') + "</div>";
    if (done.length) h += '<h2 class="section-title">Fatto</h2><div class="list">' + done.map(todoCard).join("") + "</div>";
    h += '<p class="foot-note">«Fatto» si salva solo su questo telefono. Quando prenotate qualcosa ditelo a Claude: lo segna nel programma per tutti e due.</p>';
    return h;
  }
  function trainPill(t) {
    if (t.status === "pagato") return '<span class="pill ok">' + icon("check") + "Pagato</span>";
    if (t.status === "prenotato") return '<span class="pill ok">' + icon("check") + "Prenotato</span>";
    if (t.status === "da comprare") return '<span class="pill todo">Da comprare</span>';
    return '<span class="pill muted">Sul posto</span>';
  }
  function dayIndex(iso) { return D.days.findIndex(function (d) { return d.id === iso; }); }
  function bookTrains() {
    var h = '<h2 class="section-title">Voli</h2><div class="list">';
    D.flights.forEach(function (f) {
      h += '<article class="card"><div class="card-top"><div><div class="meta">' + esc(dLong(f.date)) + "</div><h3>" + esc(f.route) + "</h3></div>" + trainPill(f) + "</div>" +
        '<dl class="kv"><dt>Volo</dt><dd>' + esc(f.line) + "</dd><dt>Orario</dt><dd>" + esc(f.time) + "</dd>" + (f.note ? "<dt>Nota</dt><dd>" + esc(f.note) + "</dd>" : "") + "</dl></article>";
    });
    h += '</div><h2 class="section-title">Treni e bus</h2><div class="list">';
    var today = romeToday();
    D.trains.forEach(function (t) {
      var di = dayIndex(t.date);
      var extra = t.status === "pagato" && t.confirm && today < t.confirm ? '<span class="pill warn">Biglietto dal ' + dm(t.confirm) + "</span>" : "";
      h += '<article class="card" id="train-' + esc(t.id) + '"><div class="card-top"><div><div class="meta">' + esc(dLong(t.date)) + "</div><h3>" + esc(t.route) + "</h3></div>" + trainPill(t) + "</div>";
      h += '<dl class="kv"><dt>Mezzo</dt><dd>' + esc(t.line) + "</dd><dt>Orario</dt><dd class=\"num\">" + esc(t.time) + "</dd>" +
        (t.price ? "<dt>Prezzo</dt><dd>" + esc(t.price) + (t.eur ? " per 2" : "") + "</dd>" : "") +
        "<dt>Biglietto</dt><dd>" + esc(trainState(t)) + "</dd>" + (t.note ? "<dt>Nota</dt><dd>" + esc(t.note) + "</dd>" : "") + "</dl>";
      if (extra) h += '<div class="btns">' + extra + "</div>";
      h += '<div class="btns">' + (t.link ? link(t.link, /klook/.test(t.link) ? "Biglietto Klook" : "Prenota", t.status === "da comprare" ? "go" : "", "ticket") : "") +
        (di >= 0 ? '<button type="button" class="btn" data-day="' + di + '" data-go="trasporti">' + icon("cal") + "<span>Vedi il giorno</span></button>" : "") + "</div></article>";
    });
    return h + "</div>";
  }
  function hotelEur(h) { return h.eur != null ? h.eur : (h.yen != null ? h.yen / RATE : null); }
  function bookHotels() {
    var today = tokyoToday(), h = '<div class="list" style="margin-top:12px">';
    D.hotels.forEach(function (x) {
      var tonight = today >= x.in && today < x.out, di = dayIndex(x.in);
      var pill = x.paid === "sì" ? '<span class="pill ok">' + icon("check") + "Pagato</span>" :
        (x.paid === "gruppo" ? '<span class="pill muted">Quota del gruppo</span>' : '<span class="pill warn">Da addebitare</span>');
      h += '<article class="card" style="box-shadow: inset 4px 0 0 ' + cityVar(x.cityId) + '"><div class="card-top"><div><div class="meta">' + esc(x.city) + " · " +
        esc(dShort(x.in)) + " → " + esc(dShort(x.out)) + " · " + x.nights + (x.nights === 1 ? " notte" : " notti") + "</div><h3>" + esc(x.name) + "</h3></div>" +
        '<div class="btns" style="justify-content:flex-end">' + (tonight ? '<span class="pill info">Stanotte</span>' : "") + pill + "</div></div>";
      var e = hotelEur(x);
      h += '<dl class="kv"><dt>Prezzo</dt><dd>' + esc(x.price) + (x.yen ? " (" + eur(e, true) + ")" : "") + "</dd>" +
        (x.payer ? "<dt>Pagato da</dt><dd>" + esc(x.payer) + (x.paid === "sì" ? "" : " (carta)") + "</dd>" : "") +
        (x.payment ? "<dt>Pagamento</dt><dd>" + esc(x.payment) + "</dd>" : "") +
        (x.cancel ? "<dt>Cancellazione</dt><dd>" + esc(x.cancel) + "</dd>" : "") +
        (x.address ? "<dt>Indirizzo</dt><dd>" + esc(x.address) + "</dd>" : "") +
        (x.access ? "<dt>Come arrivare</dt><dd>" + esc(x.access) + "</dd>" : "") +
        (x.hours ? "<dt>Orari</dt><dd>" + esc(x.hours) + "</dd>" : "") +
        (x.note ? "<dt>Note</dt><dd>" + esc(x.note) + "</dd>" : "") + "</dl>";
      h += '<div class="btns">' + link(goto(x.q), "Indicazioni", "go", "nav") +
        (x.address ? '<button type="button" class="btn" data-copy="' + esc(x.address) + '">' + icon("copy") + "<span>Copia indirizzo</span></button>" : "") +
        (x.app ? link(x.app, /airbnb/.test(x.app) ? "App Airbnb" : "App Booking", "", "ext") : "") +
        (di >= 0 ? '<button type="button" class="btn" data-day="' + di + '" data-go="hotel">' + icon("cal") + "<span>Vedi il giorno</span></button>" : "") + "</div></article>";
    });
    h += "</div>";
    return h + '<p class="foot-note">I numeri di prenotazione e i PIN sono nelle app Booking e Airbnb: qui non ci sono perché il sito è pubblico.</p>';
  }

  // ---------- soldi ----------
  function sharedCosts() {
    var rows = [];
    D.trains.forEach(function (t) {
      if (t.eur && t.payer) rows.push({ what: "Treno " + t.route, when: dm(t.date), eur: t.eur, approx: false, paid: t.status === "pagato", how: "Klook" });
    });
    D.hotels.forEach(function (x) {
      if (!x.shared) return;
      rows.push({ what: x.name, when: dm(x.in), eur: hotelEur(x), approx: x.eur == null, paid: x.paid === "sì", how: x.payment });
    });
    return rows;
  }
  function renderMoney() {
    var h = '<header class="page-head"><h1 class="page-title">Soldi</h1><p class="page-sub">Cambio fisso del viaggio: 1 € ≈ ' + RATE + " ¥.</p></header>";
    h += '<div class="conv"><div class="conv-row"><span class="cur">¥</span><input id="yen" inputmode="decimal" value="1000" aria-label="Yen"></div>' +
      '<div class="conv-row"><span class="cur">€</span><input id="eur" inputmode="decimal" aria-label="Euro"></div>' +
      '<div class="btns">' + [500, 1000, 3000, 5000, 10000].map(function (y) { return '<button type="button" class="btn small" data-yen="' + y + '">' + yen(y) + "</button>"; }).join("") + "</div></div>";
    var rows = sharedCosts(), tot = 0, paid = 0;
    rows.forEach(function (r) { tot += r.eur; if (r.paid) paid += r.eur; });
    var who = (D.travellers[0] || "Federico"), other = (D.travellers[1] || "amico");
    h += '<h2 class="section-title">Conti tra voi</h2><div class="card">';
    h += '<span class="meta">Spese per tutti e due anticipate da ' + esc(who) + '</span><span class="bigsum">' + eur(tot, true) + "</span>";
    h += '<div class="money-rows"><div class="money-row"><span>Già pagato</span><b>' + eur(paid, true) + "</b></div>" +
      '<div class="money-row"><span>Da addebitare<small>Airbnb il 15/10, hotel su Booking</small></span><b>' + eur(tot - paid, true) + "</b></div>" +
      '<div class="money-row total"><span>Quota dell\'' + esc(other) + " (metà)</span><b>" + eur(tot / 2, true) + "</b></div></div></div>";
    h += '<h2 class="section-title">Nel dettaglio</h2><div class="card"><div class="money-rows">';
    rows.forEach(function (r) {
      h += '<div class="money-row"><span>' + esc(r.what) + "<small>" + esc(r.when) + " · " + (r.paid ? "pagato" : esc(r.how || "da addebitare")) + "</small></span><b>" +
        (r.approx ? eur(r.eur, true) : eur2(r.eur)) + "</b></div>";
    });
    h += "</div></div>";
    h += '<p class="foot-note">Gli hotel sono in yen: l\'importo in euro dipende dal cambio della carta. Fuori dai conti: voli, quota del cottage (si salda col gruppo) e quello che pagate sul posto.</p>';
    var btot = D.budget.reduce(function (s, b) { return s + (b.eur || 0); }, 0), max = Math.max.apply(null, D.budget.map(function (b) { return b.eur || 0; }));
    h += '<h2 class="section-title">Budget a persona (stima)</h2><div class="card"><div class="money-rows">';
    D.budget.forEach(function (b) {
      h += '<div class="money-row" style="display:block"><div style="display:flex;justify-content:space-between;gap:10px"><span>' + esc(b.item) + "</span><b>" + eur(b.eur) + "</b></div>" +
        '<div class="bar"><span style="width:' + Math.round((b.eur || 0) / max * 100) + '%"></span></div>' + (b.note ? '<small style="color:var(--muted);font-size:13px">' + esc(b.note) + "</small>" : "") + "</div>";
    });
    h += '<div class="money-row total"><span>Totale a persona</span><b>' + eur(btot) + "</b></div></div></div>";
    return h;
  }
  function conv(from) {
    var y = document.getElementById("yen"), e = document.getElementById("eur");
    if (!y || !e) return;
    var raw = String((from === "yen" ? y : e).value).replace(/\s/g, "");
    var v = parseFloat(from === "yen" ? raw.replace(/[.,]/g, "") : raw.replace(/\./g, "").replace(",", "."));
    if (isNaN(v)) { (from === "yen" ? e : y).value = ""; return; }
    if (from === "yen") e.value = (v / RATE).toFixed(2).replace(".", ",");
    else y.value = Math.round(v * RATE);
  }

  // ---------- info ----------
  var SUBS = [
    ["prenotazioni", "ticket", "Prenotazioni e cose da fare", "Cosa manca, treni, voli e alloggi, chi ha pagato"],
    ["soldi", "wallet", "Soldi", "Convertitore yen/euro, conti tra voi, budget"],
    ["posti", "pin", "Tutti i posti e i link", "Luoghi e ristoranti con Tripadvisor e Maps"],
    ["parole", "book", "Parole giapponesi", "Treni, cibo e parole utili spiegate"],
    ["regole", "alert", "Emergenze e regole", "Numeri utili, soldi, treni, templi e onsen"],
    ["percorso", "route", "Il percorso", "Le città del viaggio, giorno per giorno"],
    ["versione", "refresh", "Aggiornamenti", "Quando sono stati aggiornati i dati"]
  ];
  function renderInfo() {
    if (S.sub) {
      return '<button type="button" class="btn back" data-sub="">' + icon("left") + "<span>Info</span></button>" +
        ({ prenotazioni: renderBookings, soldi: renderMoney, posti: renderPlaces, parole: renderGloss, regole: renderRules, percorso: renderRoute, versione: renderVersion }[S.sub])();
    }
    var c = counts();
    var h = '<header class="page-head"><h1 class="page-title">Info</h1></header>';
    h += '<button type="button" class="fake-search" data-search="1">' + icon("search") + "<span>Cerca tappe, posti, treni, parole…</span></button>";
    h += '<div class="menu">' + SUBS.map(function (s) {
      var badge = s[0] === "prenotazioni" && c.book ? '<b class="mbadge">' + c.book + "</b>" : "";
      return '<button type="button" data-sub="' + s[0] + '"><span class="mi">' + icon(s[1]) + '</span><span><span class="ml">' + esc(s[2]) + badge +
        '</span><span class="md">' + esc(s[3]) + "</span></span>" + icon("right", "chev") + "</button>";
    }).join("") + "</div>";
    return h;
  }
  function placeCard(p) {
    var h = '<article class="card"><div class="meta">' + esc(p.city) + (p.day ? " · " + esc(p.day) : "") + "</div><h3>" + esc(p.name) + "</h3>";
    if (p.note) h += '<div class="note">' + esc(p.note.replace(/\s*·\s*DA PRENOTARE.*$/i, "")) + "</div>";
    h += '<div class="btns">' + link(goto(p.q), "Indicazioni", "small go", "nav");
    if (p.ta) h += link(p.ta, "Tripadvisor", "small", "star");
    if (p.tabelog) h += link(p.tabelog, "Tabelog" + (p.score ? " " + esc(p.score) : ""), "small", "star");
    if (p.web) h += link(p.web, "Sito", "small", "ext");
    return h + "</div></article>";
  }
  function renderPlaces() {
    var all = Object.keys(D.places).map(function (k) { return D.places[k]; });
    var days = [];
    all.forEach(function (p) { if (p.day && days.indexOf(p.day) < 0) days.push(p.day); });
    var h = '<header class="page-head"><h1 class="page-title">Tutti i posti</h1></header><div class="filters"><button type="button" data-pday="" aria-pressed="' + (S.pday === "") + '">Tutti</button>';
    days.forEach(function (d) { h += '<button type="button" data-pday="' + esc(d) + '" aria-pressed="' + (S.pday === d) + '">' + esc(d) + "</button>"; });
    h += '</div><div class="list" style="margin-top:12px">' + all.filter(function (p) { return !S.pday || p.day === S.pday; }).map(placeCard).join("") + "</div>";
    return h;
  }
  function renderGloss() {
    var cats = {}, order = [];
    D.glossary.forEach(function (g) { if (!cats[g.cat]) { cats[g.cat] = []; order.push(g.cat); } cats[g.cat].push(g); });
    return '<header class="page-head"><h1 class="page-title">Parole giapponesi</h1></header>' + order.map(function (c) {
      return '<h2 class="section-title">' + esc(c) + '</h2><dl class="gloss">' + cats[c].map(function (g) {
        return "<div><dt>" + esc(g.term) + "</dt><dd>" + esc(g.means) + "</dd></div>";
      }).join("") + "</dl>";
    }).join("");
  }
  function renderRules() {
    var h = '<header class="page-head"><h1 class="page-title">Emergenze e regole</h1></header><div class="list">';
    h += '<article class="card"><h3>Emergenze</h3><dl class="kv"><dt>Polizia</dt><dd><a href="tel:110">110</a></dd><dt>Ambulanza e pompieri</dt><dd><a href="tel:119">119</a></dd></dl>' +
      '<div class="btns">' + link(mapsQ("Ambasciata d'Italia Tokyo"), "Ambasciata d'Italia a Tokyo", "small", "pin") + "</div></article>";
    h += '<article class="card"><h3>Soldi</h3><p class="note">Molti locali piccoli, mercati, templi e sale giochi vogliono contanti. Gli ATM dei konbini (7-Eleven) accettano le carte estere. Le mance non si danno.</p></article>';
    h += '<article class="card"><h3>Treni e metro</h3><p class="note">La Suica nel Wallet dell\'iPhone vale per metro, treni locali, bus e konbini. Per Shinkansen ed espressi prenotati servono i biglietti Klook. Sulle scale mobili a Tokyo si sta a sinistra, a Osaka a destra.</p></article>';
    h += '<article class="card"><h3>Valigie</h3><p class="note">Nelle stazioni ci sono armadietti a gettoni o con la Suica (quelli grandi finiscono presto la mattina). Gli hotel tengono le valigie prima del check-in e dopo il check-out.</p></article>';
    h += '<article class="card"><h3>Templi e onsen</h3><p class="note">Nei templi spesso ci si toglie le scarpe. Negli onsen (terme) si entra lavati e nudi, l\'asciugamano piccolo non va in acqua; i tatuaggi grandi possono essere un problema.</p></article>';
    h += '<article class="card"><h3>Rifiuti e strada</h3><p class="note">I cestini in strada sono rari: tenete un sacchetto. Mangiare camminando è malvisto nelle vie affollate (Kamakura, Kyoto).</p></article>';
    return h + "</div>";
  }
  function renderRoute() {
    var P = { tokyo: [139.69, 35.68], kawaguchiko: [138.76, 35.50], kamakura: [139.55, 35.32], kyoto: [135.77, 35.01], takayama: [137.25, 36.14], shirakawa: [136.91, 36.26], osaka: [135.50, 34.69] };
    var W = 560, H = 420;
    function xy(c) { return [40 + (P[c][0] - 135.2) / (140.1 - 135.2) * (W - 80), 40 + (36.5 - P[c][1]) / (36.5 - 34.5) * (H - 90)]; }
    var legs = [["tokyo", "kawaguchiko"], ["kawaguchiko", "tokyo"], ["tokyo", "kamakura"], ["kamakura", "kyoto"], ["kyoto", "takayama"], ["takayama", "shirakawa"], ["takayama", "osaka"], ["osaka", "tokyo"]];
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Schema del percorso tra le città">';
    legs.forEach(function (l, k) {
      var p1 = xy(l[0]), p2 = xy(l[1]), bend = (k % 2 ? 1 : -1) * 22, mx = (p1[0] + p2[0]) / 2 + bend, my = (p1[1] + p2[1]) / 2 - bend;
      s += '<path d="M' + p1[0] + " " + p1[1] + " Q" + mx + " " + my + " " + p2[0] + " " + p2[1] + '" fill="none" stroke="var(--t-viaggio)" stroke-width="3.5" stroke-dasharray="' + (l[1] === "shirakawa" ? "6 7" : "0") + '" opacity=".6"/>';
    });
    var L = { tokyo: ["Tokyo", -14, -14], kawaguchiko: ["Kawaguchiko", -14, -16], kamakura: ["Kamakura", -14, 30], kyoto: ["Kyoto", 14, 30], takayama: ["Takayama", 14, -14], shirakawa: ["Shirakawa-go", -14, -16], osaka: ["Osaka", 14, 30] };
    Object.keys(P).forEach(function (c) {
      var p = xy(c), l = L[c], col = CITY[c] ? cityVar(c) : "var(--takayama)";
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="var(--card)" stroke="' + col + '" stroke-width="5"/>';
      s += '<text x="' + (p[0] + l[1]) + '" y="' + (p[1] + l[2]) + '" text-anchor="' + (l[1] < 0 ? "end" : "start") + '" font-size="19" font-weight="700">' + l[0] + "</text>";
    });
    s += "</svg>";
    var h = '<header class="page-head"><h1 class="page-title">Il percorso</h1><p class="page-sub">Schema indicativo, non in scala.</p></header><div class="routemap">' + s + '</div><div class="list" style="margin-top:12px">';
    D.days.forEach(function (d, i) {
      h += '<button type="button" class="card" style="text-align:left;cursor:pointer;border:0;box-shadow: inset 4px 0 0 ' + cityVar(mainCity(i)) + '" data-day="' + i + '" data-go="itinerario"><span class="meta">' +
        esc(dLong(d.id)) + "</span><strong>" + esc(d.route.map(function (c) { return CITY[c]; }).join(" › ")) + "</strong></button>";
    });
    return h + "</div>";
  }
  function renderVersion() {
    return '<header class="page-head"><h1 class="page-title">Aggiornamenti</h1></header><div class="list"><article class="card"><dl class="kv"><dt>Dati aggiornati</dt><dd>' + esc(D.generated) +
      '</dd></dl></article><article class="card"><h3>Come si aggiorna</h3><p class="note">Chiedete a Claude la modifica: aggiorna il file dei dati e ripubblica il sito. ' +
      "Alla prossima apertura con internet arriva la versione nuova; senza rete resta l'ultima scaricata, che funziona anche offline.</p></article>" +
      '<article class="card"><h3>Foto</h3><p class="note">Le foto delle tappe sono miniature di Wikipedia (Wikimedia Commons): si scaricano la prima volta con internet e poi restano sul telefono.</p></article></div>';
  }

  // ---------- ricerca globale ----------
  // Capisce i nomi scritti a metà o con errori: confronta parole normalizzate (senza accenti e trattini,
  // «ou»/«oo» → «o») con una distanza di modifica che tollera 1–3 lettere sbagliate, più qualche sinonimo italiano.
  var IDX = [];
  var STOP = { di: 1, il: 1, la: 1, lo: 1, le: 1, gli: 1, per: 1, da: 1, del: 1, della: 1, dei: 1, in: 1, e: 1, a: 1, al: 1, the: 1, un: 1, una: 1, con: 1, che: 1, dove: 1, come: 1 };
  var TAGS = {
    cibo: "mangiare ristorante ristoranti cibo pranzo cena colazione food",
    hotel: "hotel albergo alloggio dormire camera checkin checkout",
    bagagli: "valigie valigia bagagli armadietti locker deposito",
    viaggio: "treno treni stazione biglietto viaggio",
    sposta: "spostamento indicazioni come arrivare",
    vedere: "visitare vedere visita", fare: "attivita esperienza fare"
  };
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ")
      .replace(/ou/g, "o").replace(/oo/g, "o").replace(/uu/g, "u").trim();
  }
  function words(s) { var w = norm(s).split(" ").filter(function (x) { return x && !STOP[x]; }); var u = {}; w.forEach(function (x) { u[x] = 1; }); return Object.keys(u); }
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i]; var best = i;
      for (j = 1; j <= b.length; j++) {
        var c = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v; if (v < best) best = v;
      }
      if (best > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[b.length];
  }
  function tokScore(t, ws) {
    var best = 0, max = t.length <= 4 ? 1 : (t.length <= 7 ? 2 : 3);
    for (var k = 0; k < ws.length; k++) {
      var w = ws[k], s = 0;
      if (w === t) s = 1;
      else if (w.indexOf(t) === 0) s = t.length >= 3 ? 0.9 : 0.5;
      else if (t.length >= 4 && w.indexOf(t) > 0) s = 0.7;
      else if (t.length >= 3) {
        var d = dist(t, w, max);
        if (d <= max) s = 0.85 - d * 0.15;
        else if (w.length > t.length) { var d2 = dist(t, w.slice(0, t.length), Math.max(1, max - 1)); if (d2 <= Math.max(1, max - 1)) s = 0.7 - d2 * 0.15; }
      }
      if (s > best) { best = s; if (best === 1) break; }
    }
    return best;
  }
  function addDoc(doc) {
    doc.tw = words(doc.title); doc.aw = words(doc.title + " " + doc.text);
    doc.tc = norm(doc.title).replace(/ /g, ""); doc.ac = norm(doc.title + " " + doc.text).replace(/ /g, "");
    IDX.push(doc);
  }
  function buildIndex() {
    IDX = [];
    D.days.forEach(function (d, di) {
      var dayWords = d.dm + " " + dLong(d.id) + " " + d.route.map(function (c) { return CITY[c]; }).join(" ");
      d.items.forEach(function (it, ii) {
        if (it.merged) return;
        var p = it.place && D.places[it.place], leg = it.leg != null ? d.items[it.leg] : null, t = it.train && TRAINS[it.train], h = it.hotel && HOTELS[it.hotel];
        var text = [it.short, (it.details || []).map(function (x) { return plain(x.text); }).join(" "), p ? p.name + " " + p.note : "",
          leg ? leg.title + " " + (leg.short || "") + " " + (leg.details || []).map(function (x) { return plain(x.text); }).join(" ") : "",
          t ? t.line + " " + t.route : "", h ? h.name : "", TAGS[it.k] || "", it.bag ? TAGS.bagagli : "", dayWords].join(" ");
        addDoc({ kind: "item", d: di, i: ii, k: it.k, title: it.title, sub: dShort(d.id) + " · " + it.t + (it.short ? " · " + it.short : ""), text: text, w: 1 });
      });
      addDoc({ kind: "day", d: di, title: dLong(d.id) + " · " + d.route.map(function (c) { return CITY[c]; }).join(" › "), sub: "Giorno " + d.n, text: d.guide.senso || "", w: 0.6 });
    });
    Object.keys(D.places).forEach(function (k) {
      var p = D.places[k];
      if (USED[k]) return;
      addDoc({ kind: "place", id: k, title: shortName(p.name), sub: p.city + (p.day ? " · " + p.day : "") + " · non in programma", text: p.name + " " + p.note + " " + p.type + " " + p.city, w: 0.85 });
    });
    D.hotels.forEach(function (x) { addDoc({ kind: "hotel", id: x.id, title: x.name, sub: x.city + " · " + dShort(x.in) + " → " + dShort(x.out), text: x.address + " " + x.city + " " + TAGS.hotel, w: 1.05 }); });
    D.trains.forEach(function (t) { addDoc({ kind: "train", id: t.id, title: t.route, sub: dShort(t.date) + " · " + t.time + " · " + t.line, text: t.line + " " + t.note + " " + TAGS.viaggio, w: 1 }); });
    D.flights.forEach(function (t) { addDoc({ kind: "flight", id: t.id, title: t.route, sub: dShort(t.date) + " · " + t.time, text: t.line + " volo aereo aeroporto", w: 1 }); });
    D.todo.forEach(function (t) { addDoc({ kind: "todo", id: t.id, title: t.task, sub: "Da fare · " + todoWhenShort(t), text: t.note + " prenotare prenotazione da fare", w: 0.9 }); });
    D.glossary.forEach(function (g) { addDoc({ kind: "gloss", title: g.term, sub: g.means, text: g.means, w: 0.8 }); });
  }
  function score(doc, toks, qc) {
    var base = 0;
    if (qc.length >= 3 && doc.tc.indexOf(qc) >= 0) base = doc.tc.indexOf(qc) === 0 ? 3.5 : 3;
    else if (qc.length >= 4 && doc.ac.indexOf(qc) >= 0) base = 1.4;
    else if (toks.length === 1 && qc.length >= 5) {
      var max = qc.length <= 7 ? 2 : 3, cand = [doc.tc.slice(0, qc.length + 1)];
      for (var w = 0; w + 1 < doc.tw.length; w++) cand.push(doc.tw[w] + doc.tw[w + 1]);
      for (var c = 0; c < cand.length; c++) if (dist(qc, cand[c], max) <= max) { base = 2.2; break; }
    }
    var tot = 0, miss = 0;
    toks.forEach(function (t) {
      var s = Math.max(tokScore(t, doc.tw) * 1.6, tokScore(t, doc.aw));
      if (!s) miss++;
      tot += s;
    });
    if (miss * 2 > toks.length && !base) return 0;
    var sc = base + (tot / toks.length) * (miss ? 0.5 : 1);
    return sc * doc.w;
  }
  function search(q) {
    var toks = words(q), qc = toks.join("");
    if (!toks.length) return [];
    return IDX.map(function (doc) { return { doc: doc, s: score(doc, toks, qc) }; })
      .filter(function (r) { return r.s >= 0.55; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, 30);
  }
  var KIND = { item: ["Nel programma", "cal"], day: ["Giorno", "cal"], place: ["Posto", "pin"], hotel: ["Hotel", "bed"], train: ["Treno", "train"], flight: ["Volo", "plane"], todo: ["Da fare", "ticket"], gloss: ["Parola", "book"] };
  function resultsHtml(q) {
    if (!norm(q)) {
      return '<p class="s-hint">Scrivi un posto, un piatto, una città, un treno o una parola: va bene anche scritta male.</p><div class="s-sugg">' +
        ["bambù", "ramen", "shinkansen", "valigie", "onsen", "kiomizu", "hotel kyoto", "sumo"].map(function (x) { return '<button type="button" data-sq="' + esc(x) + '">' + esc(x) + "</button>"; }).join("") + "</div>";
    }
    var res = search(q);
    if (!res.length) return '<p class="s-hint">Niente trovato per «' + esc(q) + "». Prova con un'altra parola.</p>";
    return '<div class="s-list">' + res.map(function (r, n) {
      var d = r.doc, k = KIND[d.kind], tc = d.kind === "item" ? "var(--t-" + d.k + ")" : "var(--blue)";
      var ic = d.kind === "item" ? itemIcon(D.days[d.d].items[d.i]) : k[1];
      var h = '<button type="button" class="s-item" data-res="' + n + '" style="--tc:' + tc + '"><span class="s-ic">' + icon(ic) + '</span><span class="s-tx"><b>' + esc(d.title) +
        "</b><small>" + esc(d.sub) + '</small></span><span class="s-k">' + esc(k[0]) + "</span></button>";
      if (d.kind === "place") {
        var p = D.places[d.id];
        h += '<div class="s-extra" hidden data-for="' + n + '"><div class="btns">' + link(goto(p.q), "Indicazioni", "small go", "nav") +
          (p.ta ? link(p.ta, "Tripadvisor", "small", "star") : "") + (p.tabelog ? link(p.tabelog, "Tabelog", "small", "star") : "") + (p.web ? link(p.web, "Sito", "small", "ext") : "") + "</div></div>";
      }
      return h;
    }).join("") + "</div>";
  }
  var LAST = [];
  function openSearch() {
    S.searching = true;
    var ov = document.getElementById("search");
    if (!ov) {
      ov = document.createElement("div"); ov.id = "search"; ov.className = "search-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Cerca");
      ov.innerHTML = '<div class="s-top"><label class="s-box">' + icon("search") + '<input id="gq" type="search" placeholder="Cerca qualsiasi cosa" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"></label>' +
        '<button type="button" class="s-close" data-sclose="1">Chiudi</button></div><div class="s-body" id="sres"></div>';
      document.body.appendChild(ov);
    }
    ov.hidden = false;
    document.body.classList.add("noscroll");
    var inp = document.getElementById("gq");
    inp.value = S.q || "";
    updateResults();
    inp.focus();
  }
  function closeSearch() {
    S.searching = false;
    var ov = document.getElementById("search");
    if (ov) ov.hidden = true;
    document.body.classList.remove("noscroll");
  }
  function updateResults() {
    var q = document.getElementById("gq").value;
    S.q = q;
    LAST = norm(q) ? search(q) : [];
    document.getElementById("sres").innerHTML = resultsHtml(q);
  }
  function goResult(n, btn) {
    var d = LAST[n] && LAST[n].doc;
    if (!d) return;
    if (d.kind === "place") { var ex = document.querySelector('.s-extra[data-for="' + n + '"]'); if (ex) ex.hidden = !ex.hidden; return; }
    if (d.kind === "gloss") { btn.classList.toggle("open"); return; }
    closeSearch();
    if (d.kind === "item") {
      S.tab = "itinerario"; S.day = d.d; S.open = {}; S.open[d.d + "-" + d.i] = true; S.sub = null;
      render(); scrollToStop(d.d + "-" + d.i); return;
    }
    if (d.kind === "day") { S.tab = "itinerario"; S.day = d.d; S.open = {}; render(); return; }
    if (d.kind === "hotel") { var x = HOTELS[d.id]; S.tab = "hotel"; S.day = Math.max(0, dayIndex(x.in)); S.open = {}; render(); return; }
    if (d.kind === "train" || d.kind === "flight") {
      var t = (d.kind === "train" ? TRAINS[d.id] : D.flights.filter(function (f) { return f.id === d.id; })[0]);
      var di = Math.max(0, dayIndex(t.date)), it = -1;
      D.days[di].items.forEach(function (x, k) { if ((d.kind === "train" && x.train === d.id) || (d.kind === "flight" && x.k === "viaggio" && /Volo/.test(x.title) && it < 0)) it = k; });
      S.tab = d.kind === "train" ? "trasporti" : "itinerario"; S.day = di; S.open = {};
      if (it >= 0) S.open[di + "-" + it] = true;
      render(); if (it >= 0) scrollToStop(di + "-" + it); return;
    }
    if (d.kind === "todo") {
      S.tab = "info"; S.sub = "prenotazioni"; S.seg = "fare"; render();
      var el = document.getElementById("todo-" + d.id); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 20);
    }
  }

  // ---------- montaggio ----------
  function render(keepScroll) {
    if (!D) return;
    var html = S.tab === "info" ? renderInfo() : renderDayTab();
    view.innerHTML = html;
    document.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-current", t.dataset.tab === S.tab ? "page" : "false"); });
    var c = counts(), badge = document.getElementById("badge");
    if (badge) { badge.hidden = !c.book || phase() !== "before"; badge.textContent = c.book; }
    if (!keepScroll) window.scrollTo(0, 0);
    var chip = view.querySelector('.daychip[aria-pressed="true"]');
    if (chip && chip.parentNode) chip.parentNode.scrollLeft = chip.offsetLeft - chip.parentNode.clientWidth / 2 + chip.clientWidth / 2;
    if (S.tab === "info" && S.sub === "soldi") conv("yen");
    store("state", { tab: S.tab, day: S.day, seg: S.seg });
  }
  function scrollToStop(key) {
    var el = document.getElementById("s-" + key);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }
  // Va al giorno e alla tappa di adesso, con la tappa aperta.
  function jumpToNow() {
    if (phase() !== "live") return false;
    var tgt = nowTarget();
    if (!tgt) return false;
    S.tab = "itinerario"; S.day = tgt.d; S.open = {}; S.open[tgt.d + "-" + tgt.i] = true; S.sub = null;
    render();
    scrollToStop(tgt.d + "-" + tgt.i);
    return true;
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, [data-day]");
    if (!t || t.tagName === "A") return;
    var ds = t.dataset;
    if (ds.search) { openSearch(); return; }
    if (ds.sclose) { closeSearch(); return; }
    if (ds.sq) { var gi = document.getElementById("gq"); gi.value = ds.sq; updateResults(); return; }
    if (ds.res !== undefined) { goResult(parseInt(ds.res, 10), t); return; }
    if (ds.tab) {
      if (ds.tab === S.tab && ds.tab === "itinerario" && jumpToNow()) return;
      S.tab = ds.tab; S.sub = null; render(); return;
    }
    if (ds.open) {
      var open = !S.open[ds.open]; S.open[ds.open] = open;
      if (!store("hinted")) { store("hinted", true); var hn = view.querySelector(".hint"); if (hn) hn.remove(); }
      var row = document.querySelector('.row[data-open="' + ds.open + '"]'); if (row) row.setAttribute("aria-expanded", open);
      var p = document.getElementById("p-" + ds.open); if (p) p.hidden = !open;
      return;
    }
    if (ds.day !== undefined && ds.day !== "") {
      var n = parseInt(ds.day, 10);
      if (n >= 0 && n < D.days.length) { S.day = n; S.open = {}; if (ds.go) { S.tab = ds.go; S.sub = null; } render(); }
      return;
    }
    if (ds.now) { jumpToNow(); return; }
    if (ds.jump) {
      S.open[ds.jump] = true;
      var pp = document.getElementById("p-" + ds.jump), rr = document.querySelector('.row[data-open="' + ds.jump + '"]');
      if (pp) pp.hidden = false; if (rr) rr.setAttribute("aria-expanded", "true");
      scrollToStop(ds.jump); return;
    }
    if (ds.tips) { S.tips = !S.tips; t.setAttribute("aria-expanded", S.tips); t.nextElementSibling.hidden = !S.tips; return; }
    if (ds.info) { S.tab = "info"; S.sub = ds.info; render(); return; }
    if (ds.go) { S.tab = ds.go; S.sub = null; render(); return; }
    if (ds.seg) { S.seg = ds.seg; render(true); return; }
    if (ds.todo) { store("todo:" + ds.todo, !store("todo:" + ds.todo)); render(true); return; }
    if (ds.sub !== undefined) { S.sub = ds.sub || null; S.pday = ""; render(); return; }
    if (ds.pday !== undefined) { S.pday = ds.pday; render(true); return; }
    if (ds.yen) { document.getElementById("yen").value = ds.yen; conv("yen"); return; }
    if (ds.copy) {
      var txt = ds.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast("Indirizzo copiato"); }, function () {});
    }
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "gq") updateResults();
    if (t.id === "yen") conv("yen");
    if (t.id === "eur") conv("eur");
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && S.searching) closeSearch();
    if (ev.key === "Enter" && ev.target.id === "gq") { ev.target.blur(); if (LAST.length) goResult(0, document.querySelector('.s-item[data-res="0"]')); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { lastHidden = Date.now(); return; }
    if (!D || S.searching) return;
    // tornando nell'app dopo un po', si riparte da dove dovreste essere adesso
    if (Date.now() - lastHidden > 10 * 60000 && jumpToNow()) return;
    if (DAYTABS.indexOf(S.tab) >= 0) render(true);
  });
  // la striscia dei giorni prende un'ombra solo quando la pagina è scorsa
  window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 4); }, { passive: true });

  // scorrere il dito a destra o a sinistra cambia giorno
  var sw = null;
  view.addEventListener("touchstart", function (e) {
    if (DAYTABS.indexOf(S.tab) < 0 || e.touches.length !== 1 || e.target.closest(".daystrip")) { sw = null; return; }
    sw = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  view.addEventListener("touchend", function (e) {
    if (!sw) return;
    var dx = e.changedTouches[0].clientX - sw.x, dy = e.changedTouches[0].clientY - sw.y, dt = Date.now() - sw.t;
    sw = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6 || dt > 700) return;
    var n = S.day + (dx < 0 ? 1 : -1);
    if (n < 0 || n >= D.days.length) return;
    S.day = n; S.open = {}; render();
  }, { passive: true });

  setInterval(function () {
    if (D && !document.hidden && !S.searching && DAYTABS.indexOf(S.tab) >= 0 && phase() === "live") {
      // aggiorna passato/adesso senza chiudere le tappe aperte
      var y = window.scrollY; render(true); window.scrollTo(0, y);
    }
  }, 60000);

  function boot(data) {
    D = data;
    RATE = D.rate || 185;
    D.trains.forEach(function (t) { TRAINS[t.id] = t; });
    D.hotels.forEach(function (h) { HOTELS[h.id] = h; });
    D.days.forEach(function (d) { d.items.forEach(function (it) { if (it.place) USED[it.place] = 1; }); });
    buildTimeline();
    buildIndex();
    setTimeout(loadPhotos, 300);
    var saved = store("state") || {};
    S.seg = saved.seg || "fare";
    if (jumpToNow()) return;
    var ok = { itinerario: 1, attivita: 1, ristoranti: 1, hotel: 1, trasporti: 1, info: 1 };
    S.tab = saved.tab && ok[saved.tab] ? saved.tab : "itinerario";
    S.day = saved.day != null && saved.day < D.days.length ? saved.day : currentDay();
    render();
  }

  fetch("data.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(boot).catch(function () {
    view.innerHTML = '<div class="empty"><h1 class="page-title">Dati non disponibili</h1><p>Non riesco a leggere i dati. Se siete offline, aprite il sito una volta con internet: da lì in poi funziona anche senza rete.</p><button type="button" class="btn go" onclick="location.reload()">Riprova</button></div>';
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
    // quando arriva una versione nuova del sito, la si carica subito (una volta sola)
    var reloaded = false, hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (reloaded || !D || !hadController) return;
      reloaded = true;
      if (document.hidden || performance.now() < 15000) location.reload();
    });
  }
})();
