/* Giappone 2026 — guida tascabile. Tutti i dati arrivano da data.json, generato da viaggio.md con build.py:
   qui non c'è nessun dato del viaggio scritto a mano.
   Per provare un'ora diversa: aggiungere ?ora=2026-11-11T10:00+09:00 all'indirizzo. */
(function () {
  "use strict";

  var CITY = { tokyo: "Tokyo", kawaguchiko: "Kawaguchiko", kamakura: "Kamakura", kyoto: "Kyoto", takayama: "Takayama", osaka: "Osaka", roma: "Roma" };
  var TYPE = {
    vedere: { n: "Da vedere", i: "pin" }, fare: { n: "Esperienza", i: "sparkles" }, cibo: { n: "Mangiare", i: "food" },
    sposta: { n: "Spostamento", i: "walk" }, viaggio: { n: "Treno, bus o volo", i: "train" }, hotel: { n: "Alloggio", i: "bed" }
  };
  var MODE = { transit: ["train", "Con i mezzi"], walking: ["walk", "A piedi"], driving: ["taxi", "In taxi"] };
  var GUIDE = [["mangiare", "Dove mangiare"], ["prenotare", "Da avere con sé"], ["attenzione", "Attenzione"],
    ["anticipo", "Se avanza tempo"], ["stanchi", "Se siete stanchi"], ["camminata", "A piedi e pause"]];
  var MONTHS = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var WDAYS = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var WD3 = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  var D = null, RATE = 185, TL = [], TRAINS = {}, HOTELS = {};
  var S = { tab: "programma", day: 0, open: {}, tips: false, seg: "fare", sub: null, q: "", pday: "", mstop: 0 };
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
  function goto(q, mode) { return "https://www.google.com/maps/dir/?api=1&travelmode=" + (mode || "transit") + "&destination=" + encodeURIComponent(q); }
  function eur(n, approx) { return n == null ? "—" : (approx ? "≈ " : "") + "€" + Math.round(n).toLocaleString("it-IT"); }
  function eur2(n) { return "€" + n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function yen(n) { return "¥" + Math.round(n).toLocaleString("it-IT"); }
  function cityVar(c) { return "var(--" + (CITY[c] ? c : "roma") + ")"; }
  function shortName(n) { return String(n).replace(/\s*\([^)]*\)\s*$/, ""); }
  function toast(msg) {
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
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
  function stateOf(d, i) {
    if (phase() === "before") return "";
    var c = curIndex(), p = tlPos(d, i);
    if (phase() === "after") return "past";
    return p < c ? "past" : (p === c ? "now" : "");
  }
  function currentDay() {
    var ph = phase();
    if (ph === "before") return 0;
    if (ph === "after") return D.days.length - 1;
    return TL[Math.max(0, curIndex())].d;
  }

  // ---------- testi ----------
  function richText(t) {
    return esc(t).replace(/\[\[([a-z0-9-]+)\]\]/g, function (_, id) {
      var p = D.places[id];
      return p ? '<a class="inl" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(shortName(p.name)) + "</a>" : id;
    });
  }
  function bulletsHtml(t) {
    var lines = String(t).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.every(function (l) { return l.indexOf("•") === 0; })) {
      return "<ul>" + lines.map(function (l) { return "<li>" + esc(l.replace(/^•\s*/, "")) + "</li>"; }).join("") + "</ul>";
    }
    return lines.map(function (l) { return "<p>" + esc(l.replace(/^•\s*/, "")) + "</p>"; }).join("");
  }
  function itemIcon(it) {
    if (it.k === "sposta") {
      var m = it.routes && it.routes[0] ? it.routes[0].mode : "walking";
      return MODE[m][0];
    }
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
  function statusPill(it) {
    if (it.status === "todo") return '<span class="pill todo">Da prenotare</span>';
    if (it.status === "paid") return '<span class="pill ok">' + icon("check") + "Pagato</span>";
    if (it.status === "ok") return '<span class="pill ok">' + icon("check") + "Prenotato</span>";
    return "";
  }

  // ---------- programma ----------
  function dayStrip(sel) {
    var today = tokyoToday(), ph = phase(), cd = ph === "live" ? currentDay() : -1;
    var h = '<div class="daystrip" role="toolbar" aria-label="Giorni del viaggio">';
    D.days.forEach(function (x, j) {
      var past = ph === "after" || (ph === "live" && j < cd);
      var d = isoDate(x.id);
      h += '<button type="button" class="daychip' + (j === cd || (ph !== "live" && x.id === today) ? " today" : "") + (past ? " past" : "") +
        '" data-day="' + j + '" aria-pressed="' + (j === sel) + '" style="--c:' + cityVar(mainCity(j)) + '" aria-label="' + esc(dLong(x.id)) + '">' +
        '<span class="w">' + WD3[d.getDay()] + '</span><span class="d">' + d.getDate() + "</span></button>";
    });
    return h + "</div>";
  }
  function mainCity(i) {
    var r = D.days[i].route.filter(function (c) { return c !== "roma"; });
    return r.length ? r[r.length - 1] : "roma";
  }

  function renderProgram() {
    var i = S.day, d = D.days[i], ph = phase(), cd = currentDay();
    var h = dayStrip(i);
    if (ph === "before") h += beforeCard();

    h += '<header class="dayhead"><div class="dayhead-top"><span class="kicker">Giorno ' + d.n + " · " + esc(dLong(d.id)) + "</span>";
    h += '<div class="navbtns"><button type="button" class="navbtn" data-day="' + (i - 1) + '" aria-label="Giorno prima"' + (i > 0 ? "" : " disabled") + ">" + icon("left") + "</button>";
    h += '<button type="button" class="navbtn" data-day="' + (i + 1) + '" aria-label="Giorno dopo"' + (i < D.days.length - 1 ? "" : " disabled") + ">" + icon("right") + "</button></div></div>";
    h += "<h1" + (d.route.length > 2 ? ' class="long"' : "") + ">" + d.route.map(function (c, k) {
      return (k ? ' <span class="sep">›</span> ' : "") + '<span class="c" style="--c:' + cityVar(c) + '">' + esc(CITY[c]) + "</span>";
    }).join("") + "</h1>";
    var walk = (d.guide.camminata || "").split(" · ")[0];
    h += '<div class="facts"><span>' + icon("bed") + esc(d.sleepName) + "</span><span>" + icon("users") + esc(d.with) + "</span>" +
      (walk ? "<span>" + icon("walk") + esc(walk.replace(/\s*\(.*\)$/, "")) + "</span>" : "") + "</div>";
    if (d.guide.senso) h += '<p class="summary">' + esc(d.guide.senso) + "</p>";
    if (ph === "live" && i !== cd) h += '<p style="margin:12px 0 0"><button type="button" class="chip-now" data-now="1">' + icon("locate") + "Vai a dove siete adesso</button></p>";
    h += "</header>";

    if (ph === "live" && i === cd) h += nowCard();
    if (ph === "after" && i === D.days.length - 1) h += '<div class="nowcard"><span class="lab">Viaggio finito</span><span class="big">Bentornati!</span></div>';

    h += '<div class="plan" style="margin-top:14px">';
    d.items.forEach(function (it, k) { h += stopHtml(i, k, it); });
    h += "</div>";

    h += '<div class="legend" aria-label="Legenda">' + Object.keys(TYPE).map(function (k) {
      return '<span style="--tc:var(--t-' + k + ')"><i></i>' + TYPE[k].n + "</span>";
    }).join("") + "</div>";

    h += tipsHtml(d);
    h += '<div class="btns" style="margin-top:12px"><button type="button" class="btn block" data-go="mappa">' + icon("map") + "<span>Le tappe di questo giorno sulla mappa</span></button></div>";
    return h;
  }

  function beforeCard() {
    var left = TL[0].at - now(), days = Math.ceil(left / 86400000);
    var todo = sortedTodo().filter(function (t) { return !store("todo:" + t.id); }).slice(0, 3);
    var h = '<div class="nowcard" style="margin-top:12px"><span class="lab">Prima di partire</span><span class="big">' +
      (days > 1 ? "Mancano " + days + " giorni" : (days === 1 ? "Si parte domani" : "Si parte oggi")) + "</span>";
    if (todo.length) {
      h += '<div class="deadlines">' + todo.map(function (t) {
        return '<div class="deadline"><span>' + esc(t.task) + "</span><b>" + esc(todoWhenShort(t)) + "</b></div>";
      }).join("") + "</div>";
    }
    return h + '<div class="btns"><button type="button" class="btn small" data-go="prenotazioni">' + icon("ticket") + "<span>Cosa manca da prenotare</span></button></div></div>";
  }

  function nowCard() {
    var c = curIndex(), cur = TL[c], nx = TL[c + 1];
    var it = D.days[cur.d].items[cur.i];
    var h = '<div class="nowcard"><span class="lab">Adesso dovreste essere qui</span>';
    h += '<div class="nowline"><span class="t">' + esc(it.t) + '</span><span class="x">' + (it.k === "sposta" ? "In viaggio verso " : "") + esc(it.title) +
      (it.short ? "<small>" + esc(it.short) + "</small>" : "") + "</span></div>";
    var btns = '<button type="button" class="btn small" data-jump="' + cur.d + "-" + cur.i + '">Dettagli</button>';
    if (nx) {
      var n2 = D.days[nx.d].items[nx.i];
      h += '<div class="nowline"><span class="t">' + esc(n2.t) + '</span><span class="x">' + (n2.k === "sposta" ? "Poi verso " : "Poi: ") + esc(n2.title) +
        "<small>" + esc(inMinutes(nx.at - now())) + (n2.short ? " · " + esc(n2.short) : "") + "</small></span></div>";
      var nr = n2.routes && n2.routes[0];
      if (nr) btns += link(nr.url, "Indicazioni per la prossima", "small ghost", MODE[nr.mode][0]);
      else if (n2.dest) btns += link(goto(n2.dest), "Indicazioni per la prossima", "small ghost", "nav");
    }
    return h + '<div class="btns">' + btns + "</div></div>";
  }

  function stopHtml(di, ii, it) {
    var key = di + "-" + ii, st = stateOf(di, ii), open = !!S.open[key];
    var h = '<div class="stop k-' + it.k + (st ? " " + st : "") + '" id="s-' + key + '" style="--tc:var(--t-' + it.k + ')">';
    h += '<button type="button" class="row" data-open="' + key + '" aria-expanded="' + open + '" aria-controls="p-' + key + '">';
    h += '<span class="t">' + esc(it.t) + '</span><span class="dot">' + icon(itemIcon(it)) + "</span>";
    var pill = st === "now" ? '<span class="pill now">Adesso</span>' : statusPill(it);
    h += '<span class="main"><span class="ttl">' + esc(it.title) + "</span>" + (it.short ? '<span class="sub">' + esc(it.short) + "</span>" : "") +
      (pill ? '<span class="pills">' + pill + "</span>" : "") + "</span>";
    h += '<span class="end">' + icon("down", "chev") + "</span></button>";
    h += '<div class="panel" id="p-' + key + '"' + (open ? "" : " hidden") + ">" + panelHtml(it) + "</div></div>";
    return h;
  }

  function panelHtml(it) {
    var h = "", kv = "", warn = "";
    (it.details || []).forEach(function (x) {
      if (x.k === "text") h += "<p>" + richText(x.text) + "</p>";
      else if (x.k === "attenzione") warn += '<div class="note-warn">' + icon("alert") + "<span>" + richText(x.text) + "</span></div>";
      else kv += "<div><dt>" + esc(x.label) + "</dt><dd>" + richText(x.text) + "</dd></div>";
    });
    if (kv) h += '<dl class="kv2">' + kv + "</dl>";
    h += warn;

    var t = it.train && TRAINS[it.train];
    if (t) h += trainBox(t);
    var ho = it.hotel && HOTELS[it.hotel];
    if (ho && it.k === "hotel") h += hotelBox(ho);

    var b = "";
    (it.routes || []).forEach(function (r) {
      b += link(r.url, MODE[r.mode][1], "go", MODE[r.mode][0]);
    });
    if (!(it.routes || []).length && it.dest && it.k !== "viaggio") b += link(goto(it.dest), "Portami qui", "go", "nav");
    if (!(it.routes || []).length && it.dest && it.k === "viaggio") b += link(mapsQ(it.dest), "Apri in Maps", "", "pin");
    var p = it.place && D.places[it.place];
    if (p) {
      if (p.ta) b += link(p.ta, "Tripadvisor", "", "star");
      if (p.tabelog) b += link(p.tabelog, "Tabelog" + (p.score ? " " + esc(p.score) : ""), "", "star");
      if (p.web && !p.ta && !p.tabelog) b += link(p.web, "Sito ufficiale", "", "ext");
      if (!p.ta && !p.tabelog && !p.web) b += link(p.maps, "Apri in Maps", "", "pin");
    }
    if (t && t.link) b += link(t.link, /klook/.test(t.link) ? "Biglietto Klook" : "Prenota", "", "ticket");
    if (ho && it.k === "hotel") {
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

  function tipsHtml(d) {
    var g = d.guide || {};
    var secs = GUIDE.filter(function (x) { return g[x[0]]; });
    if (!secs.length) return "";
    var h = '<section class="tips"><button type="button" data-tips="1" aria-expanded="' + S.tips + '"><span>Consigli per la giornata</span>' + icon("down") + "</button>";
    h += '<div class="body"' + (S.tips ? "" : " hidden") + ">";
    secs.forEach(function (x) { h += "<div><h3>" + esc(x[1]) + "</h3>" + bulletsHtml(g[x[0]]) + "</div>"; });
    return h + "</div></section>";
  }

  // ---------- mappa ----------
  function hotelById(id) { return HOTELS[id]; }
  function dayStops(i) {
    var d = D.days[i], stops = [], seen = {};
    function add(s) {
      if (!s.q || seen[s.q]) return;
      seen[s.q] = 1; stops.push(s);
    }
    var prev = i > 0 ? D.days[i - 1].sleep : null;
    if (prev && HOTELS[prev] && !(d.items[0] && d.items[0].hotel === prev && d.items[0].k === "hotel")) {
      add({ name: HOTELS[prev].name, q: HOTELS[prev].q, hotel: true, sub: "Alloggio della notte" });
    }
    d.items.forEach(function (it, k) {
      if (it.k === "sposta" || it.k === "viaggio") return;
      var p = it.place && D.places[it.place];
      if (p && !p.map) return;
      if (it.k === "hotel" && it.hotel) {
        var h = hotelById(it.hotel);
        add({ name: h.name, q: h.q, hotel: true, sub: it.t + " · " + it.title, d: i, i: k });
        return;
      }
      if (!it.dest) return;
      add({ name: p ? shortName(p.name) : it.title, q: it.dest, sub: it.t + (it.short ? " · " + it.short : ""), place: p, d: i, i: k, k: it.k });
    });
    var last = d.sleep && HOTELS[d.sleep];
    if (last) add({ name: last.name, q: last.q, hotel: true, sub: "Dormite qui" });
    return stops;
  }
  function routeChunks(stops) {
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
  function renderMap() {
    var i = S.day, d = D.days[i], stops = dayStops(i);
    var h = dayStrip(i);
    h += '<header class="page-head"><h1 class="page-title">Mappa</h1><p class="page-sub">' + esc(dLong(d.id)) + " · " + esc(d.route.map(function (c) { return CITY[c]; }).join(" › ")) + "</p></header>";
    if (stops.length < 2) return h + '<p class="empty">Oggi è un giorno di volo: niente tappe da mostrare.</p>';
    if (S.mstop == null || S.mstop >= stops.length) S.mstop = 0;
    // in viaggio: la mappa parte dalla prossima tappa
    if (S.mstopAuto && phase() === "live" && currentDay() === i) {
      var c = TL[curIndex()];
      for (var k = 0; k < stops.length; k++) if (stops[k].d === i && stops[k].i >= c.i) { S.mstop = k; break; }
    }
    S.mstopAuto = false;
    var sel = stops[S.mstop];
    h += '<div class="mapframe"><iframe title="Mappa: ' + esc(sel.name) + '" src="https://www.google.com/maps?q=' + encodeURIComponent(sel.q) +
      '&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>';
    var ch = routeChunks(stops);
    h += '<div class="btns" style="margin-top:10px">' + ch.map(function (x) {
      return link(x.url, ch.length > 1 ? "Giro a piedi, tappe " + x.from + "–" + x.to : "Tutto il giro in Google Maps", "go block", "route");
    }).join("") + "</div>";
    h += '<div class="mlist">';
    var num = 0;
    stops.forEach(function (s, k) {
      var st = s.d != null ? stateOf(s.d, s.i) : "";
      if (!s.hotel) num++;
      h += '<div class="mitem' + (k === S.mstop ? " on" : "") + (st ? " " + st : "") + '" style="--tc:var(--t-' + (s.hotel ? "hotel" : s.k || "vedere") + ')">';
      h += '<span class="n">' + (s.hotel ? icon("bed") : num) + "</span>";
      h += '<button type="button" class="nm" data-mstop="' + k + '">' + esc(s.name) + "<small>" + esc(s.sub || "") + "</small></button>";
      h += '<div class="btns">' + link(goto(s.q), "Portami qui", "small go", "nav");
      if (s.place) h += link(s.place.link.url, s.place.link.label === "Google Maps" ? "Maps" : s.place.link.label, "small", s.place.link.label === "Google Maps" ? "pin" : "star");
      h += "</div></div>";
    });
    h += "</div>";
    h += '<p class="foot-note">Tocca un nome per vederlo sulla mappa. «Portami qui» apre le indicazioni con i mezzi da dove siete in quel momento.</p>';
    return h;
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
    var h = '<article class="card' + (done ? " done" : "") + '"><div class="card-top"><h3>' + esc(t.task) + "</h3>" + (done ? "" : todoPill(t)) + "</div>";
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
      h += '<article class="card"><div class="card-top"><div><div class="meta">' + esc(dLong(t.date)) + "</div><h3>" + esc(t.route) + "</h3></div>" + trainPill(t) + "</div>";
      h += '<dl class="kv"><dt>Mezzo</dt><dd>' + esc(t.line) + "</dd><dt>Orario</dt><dd class=\"num\">" + esc(t.time) + "</dd>" +
        (t.price ? "<dt>Prezzo</dt><dd>" + esc(t.price) + (t.eur ? " per 2" : "") + "</dd>" : "") +
        "<dt>Biglietto</dt><dd>" + esc(trainState(t)) + "</dd>" + (t.note ? "<dt>Nota</dt><dd>" + esc(t.note) + "</dd>" : "") + "</dl>";
      if (extra) h += '<div class="btns">' + extra + "</div>";
      h += '<div class="btns">' + (t.link ? link(t.link, /klook/.test(t.link) ? "Biglietto Klook" : "Prenota", t.status === "da comprare" ? "go" : "", "ticket") : "") +
        (di >= 0 ? '<button type="button" class="btn" data-day="' + di + '" data-go="programma">' + icon("cal") + "<span>Vedi il giorno</span></button>" : "") + "</div></article>";
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
      h += '<div class="btns">' + link(goto(x.q), "Portami qui", "go", "nav") +
        (x.address ? '<button type="button" class="btn" data-copy="' + esc(x.address) + '">' + icon("copy") + "<span>Copia indirizzo</span></button>" : "") +
        (x.app ? link(x.app, /airbnb/.test(x.app) ? "App Airbnb" : "App Booking", "", "ext") : "") +
        (di >= 0 ? '<button type="button" class="btn" data-day="' + di + '" data-go="programma">' + icon("cal") + "<span>Vedi il giorno</span></button>" : "") + "</div></article>";
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
      var e = hotelEur(x);
      rows.push({ what: x.name, when: dm(x.in), eur: e, approx: x.eur == null, paid: x.paid === "sì", how: x.payment });
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
    h += '<span class="meta">Spese per tutti e due anticipate da ' + esc(who) + "</span><span class=\"bigsum\">" + eur(tot, true) + "</span>";
    h += '<div class="money-rows"><div class="money-row"><span>Già pagato</span><b>' + eur(paid, true) + "</b></div>" +
      '<div class="money-row"><span>Da addebitare<small>Airbnb il 15/10, hotel su Booking</small></span><b>' + eur(tot - paid, true) + "</b></div>" +
      '<div class="money-row total"><span>Quota dell\'' + esc(other) + " (metà)</span><b>" + eur(tot / 2, true) + "</b></div></div>";
    h += "</div>";
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
    ["posti", "pin", "Posti e link", "Tutti i luoghi e i ristoranti, con Tripadvisor e Maps"],
    ["parole", "book", "Parole giapponesi", "Treni, cibo e parole utili spiegate"],
    ["regole", "alert", "Emergenze e regole", "Numeri utili, soldi, treni, templi e onsen"],
    ["percorso", "route", "Il percorso", "Le città del viaggio, giorno per giorno"],
    ["versione", "refresh", "Aggiornamenti", "Quando sono stati aggiornati i dati"]
  ];
  function renderInfo() {
    if (S.sub) {
      return '<button type="button" class="btn back" data-sub="">' + icon("left") + "<span>Info</span></button>" +
        ({ posti: renderPlaces, parole: renderGloss, regole: renderRules, percorso: renderRoute, versione: renderVersion }[S.sub])();
    }
    var h = '<header class="page-head"><h1 class="page-title">Info</h1></header>';
    h += '<input class="search" id="q-all" type="search" placeholder="Cerca un posto o una parola (es. izakaya)" value="' + esc(S.q) + '" autocomplete="off">';
    h += '<div id="qres">' + searchResults() + "</div>";
    h += '<div class="menu">' + SUBS.map(function (s) {
      return '<button type="button" data-sub="' + s[0] + '"><span class="mi">' + icon(s[1]) + '</span><span><span class="ml">' + esc(s[2]) +
        '</span><span class="md">' + esc(s[3]) + "</span></span>" + icon("right", "chev") + "</button>";
    }).join("") + "</div>";
    return h;
  }
  function placeCard(p) {
    var h = '<article class="card"><div class="meta">' + esc(p.city) + (p.day ? " · " + esc(p.day) : "") + "</div><h3>" + esc(p.name) + "</h3>";
    if (p.note) h += '<div class="note">' + esc(p.note.replace(/\s*·\s*DA PRENOTARE.*$/i, "")) + "</div>";
    h += '<div class="btns">' + link(goto(p.q), "Portami qui", "small go", "nav");
    if (p.ta) h += link(p.ta, "Tripadvisor", "small", "star");
    if (p.tabelog) h += link(p.tabelog, "Tabelog" + (p.score ? " " + esc(p.score) : ""), "small", "star");
    if (p.web) h += link(p.web, "Sito", "small", "ext");
    return h + "</div></article>";
  }
  function searchResults() {
    var q = S.q.toLowerCase().trim();
    if (q.length < 2) return "";
    var ps = Object.keys(D.places).map(function (k) { return D.places[k]; }).filter(function (p) {
      return (p.name + " " + p.city + " " + p.note).toLowerCase().indexOf(q) >= 0;
    }).slice(0, 12);
    var gs = D.glossary.filter(function (g) { return (g.term + " " + g.means).toLowerCase().indexOf(q) >= 0; }).slice(0, 12);
    if (!ps.length && !gs.length) return '<p class="empty">Niente trovato per «' + esc(S.q) + "».</p>";
    var h = "";
    if (gs.length) h += '<h2 class="section-title">Parole</h2><dl class="gloss">' + gs.map(function (g) { return "<div><dt>" + esc(g.term) + "</dt><dd>" + esc(g.means) + "</dd></div>"; }).join("") + "</dl>";
    if (ps.length) h += '<h2 class="section-title">Posti</h2><div class="list">' + ps.map(placeCard).join("") + "</div>";
    return h;
  }
  function renderPlaces() {
    var all = Object.keys(D.places).map(function (k) { return D.places[k]; });
    var days = [];
    all.forEach(function (p) { if (p.day && days.indexOf(p.day) < 0) days.push(p.day); });
    var h = '<header class="page-head"><h1 class="page-title">Posti e link</h1></header><div class="filters"><button type="button" data-pday="" aria-pressed="' + (S.pday === "") + '">Tutti</button>';
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
      h += '<button type="button" class="card" style="text-align:left;cursor:pointer;border:0;box-shadow: inset 4px 0 0 ' + cityVar(mainCity(i)) + '" data-day="' + i + '" data-go="programma"><span class="meta">' +
        esc(dLong(d.id)) + "</span><strong>" + esc(d.route.map(function (c) { return CITY[c]; }).join(" › ")) + "</strong></button>";
    });
    return h + "</div>";
  }
  function renderVersion() {
    return '<header class="page-head"><h1 class="page-title">Aggiornamenti</h1></header><div class="list"><article class="card"><dl class="kv"><dt>Dati aggiornati</dt><dd>' + esc(D.generated) +
      '</dd></dl></article><article class="card"><h3>Come si aggiorna</h3><p class="note">Chiedete a Claude la modifica: aggiorna il file dei dati e ripubblica il sito. ' +
      "Alla prossima apertura con internet arriva la versione nuova; senza rete resta l'ultima scaricata, che funziona anche offline.</p></article></div>";
  }

  // ---------- montaggio ----------
  function render(keepScroll) {
    if (!D) return;
    var html = { programma: renderProgram, mappa: renderMap, prenotazioni: renderBookings, soldi: renderMoney, info: renderInfo }[S.tab]();
    view.innerHTML = html;
    document.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-current", t.dataset.tab === S.tab ? "page" : "false"); });
    var c = counts(), badge = document.getElementById("badge");
    if (badge) { badge.hidden = !c.book || phase() !== "before"; badge.textContent = c.book; }
    if (!keepScroll) window.scrollTo(0, 0);
    if (S.tab === "programma" || S.tab === "mappa") {
      var chip = view.querySelector('.daychip[aria-pressed="true"]');
      if (chip && chip.parentNode) chip.parentNode.scrollLeft = chip.offsetLeft - chip.parentNode.clientWidth / 2 + chip.clientWidth / 2;
    }
    if (S.tab === "soldi") conv("yen");
    store("state", { tab: S.tab, day: S.day, seg: S.seg });
  }
  function scrollToStop(key) {
    var el = document.getElementById("s-" + key);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }
  // Va al giorno e alla tappa di adesso, con la tappa aperta.
  function jumpToNow() {
    if (phase() !== "live") return false;
    var cur = TL[curIndex()];
    S.tab = "programma"; S.day = cur.d; S.open = {}; S.open[cur.d + "-" + cur.i] = true; S.mstopAuto = true;
    render();
    scrollToStop(cur.d + "-" + cur.i);
    return true;
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, [data-day]");
    if (!t || t.tagName === "A") return;
    var ds = t.dataset;
    if (ds.tab) {
      if (ds.tab === S.tab && ds.tab === "programma" && jumpToNow()) return;
      S.tab = ds.tab; S.sub = null; S.q = ""; if (ds.tab === "mappa") S.mstopAuto = true; render(); return;
    }
    if (ds.open) {
      var open = !S.open[ds.open]; S.open[ds.open] = open;
      t.setAttribute("aria-expanded", open);
      var p = document.getElementById("p-" + ds.open); if (p) p.hidden = !open;
      return;
    }
    if (ds.day !== undefined && ds.day !== "") {
      var n = parseInt(ds.day, 10);
      if (n >= 0 && n < D.days.length) { S.day = n; S.mstop = 0; S.open = {}; if (ds.go) S.tab = ds.go; if (S.tab === "mappa") S.mstopAuto = true; render(); }
      return;
    }
    if (ds.now) { jumpToNow(); return; }
    if (ds.jump) {
      S.open[ds.jump] = true;
      var pp = document.getElementById("p-" + ds.jump), rr = document.querySelector('[data-open="' + ds.jump + '"]');
      if (pp) pp.hidden = false; if (rr) rr.setAttribute("aria-expanded", "true");
      scrollToStop(ds.jump); return;
    }
    if (ds.tips) { S.tips = !S.tips; t.setAttribute("aria-expanded", S.tips); t.nextElementSibling.hidden = !S.tips; return; }
    if (ds.mstop !== undefined) { S.mstop = parseInt(ds.mstop, 10); render(true); return; }
    if (ds.go) { S.tab = ds.go; S.sub = null; if (ds.go === "mappa") S.mstopAuto = true; render(); return; }
    if (ds.seg) { S.seg = ds.seg; render(true); return; }
    if (ds.todo) { store("todo:" + ds.todo, !store("todo:" + ds.todo)); render(true); return; }
    if (ds.sub !== undefined) { S.sub = ds.sub || null; S.q = ""; S.pday = ""; render(); return; }
    if (ds.pday !== undefined) { S.pday = ds.pday; render(true); return; }
    if (ds.yen) { document.getElementById("yen").value = ds.yen; conv("yen"); return; }
    if (ds.copy) {
      var txt = ds.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast("Indirizzo copiato"); }, function () {});
    }
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "q-all") { S.q = t.value; document.getElementById("qres").innerHTML = searchResults(); }
    if (t.id === "yen") conv("yen");
    if (t.id === "eur") conv("eur");
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { lastHidden = Date.now(); return; }
    if (!D) return;
    // tornando nell'app dopo un po', si riparte da dove dovreste essere adesso
    if (Date.now() - lastHidden > 10 * 60000 && jumpToNow()) return;
    if (S.tab === "programma" || S.tab === "mappa") render(true);
  });
  setInterval(function () {
    if (D && !document.hidden && (S.tab === "programma") && phase() === "live") {
      // aggiorna passato/adesso senza chiudere le tappe aperte
      var y = window.scrollY; render(true); window.scrollTo(0, y);
    }
  }, 60000);

  function boot(data) {
    D = data;
    RATE = D.rate || 185;
    D.trains.forEach(function (t) { TRAINS[t.id] = t; });
    D.hotels.forEach(function (h) { HOTELS[h.id] = h; });
    buildTimeline();
    var saved = store("state") || {};
    S.seg = saved.seg || "fare";
    if (jumpToNow()) return;
    S.tab = saved.tab && { programma: 1, mappa: 1, prenotazioni: 1, soldi: 1, info: 1 }[saved.tab] ? saved.tab : "programma";
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
