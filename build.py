#!/usr/bin/env python3
"""Genera data.json (letto dal sito) da viaggio.md, la fonte unica dei dati del viaggio.

Uso:  python3 build.py            → scrive data.json e stampa gli avvisi
      python3 build.py --check    → solo controlli, non scrive nulla

Controlla che ogni riferimento (posto:, alloggio:, treno:, #posto, @alloggio, [[posto]], città) esista,
che tipi e chiavi dei dettagli siano noti e che gli orari di ogni giorno siano in ordine.
Nessuna dipendenza esterna.
"""
import datetime as dt
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "viaggio.md"
OUT = ROOT / "data.json"

CITIES = {"roma": "Roma", "tokyo": "Tokyo", "kawaguchiko": "Kawaguchiko", "kamakura": "Kamakura",
          "kyoto": "Kyoto", "takayama": "Takayama", "osaka": "Osaka"}
TYPES = ("vedere", "fare", "cibo", "sposta", "viaggio", "hotel", "bagagli")
DETAIL = {"come": "Come arrivare", "costo": "Costo", "orari": "Orari", "binario": "Binario", "bagagli": "Valigie",
          "prenotazione": "Prenotazione", "attenzione": "Attenzione", "alternativa": "In alternativa"}
MODE = {"mezzi": "transit", "piedi": "walking", "taxi": "driving"}
GUIDE_KEYS = ["senso", "mangiare", "prenotare", "attenzione", "anticipo", "stanchi", "camminata"]
WD = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
TZ = {"tokyo": "+09:00", "roma": "+01:00"}  # novembre 2026: Italia con l'ora solare

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def sections(text):
    """{'Giorni': [righe], ...} per le sezioni '## '."""
    out, cur = {}, None
    for line in text.splitlines():
        if line.startswith("## "):
            cur = line[3:].strip()
            out[cur] = []
        elif cur is not None:
            out[cur].append(line)
    return out


def entries(lines):
    """Voci '### id' con le loro righe."""
    out, cur = [], None
    for line in lines:
        if line.startswith("### "):
            cur = [line[4:].strip(), []]
            out.append(cur)
        elif cur is not None:
            cur[1].append(line)
    return out


KV = re.compile(r"^([a-zà-ù ]+):\s*(.*)$")
REF = re.compile(r"\[\[([a-z0-9-]+)\]\]")


def fields(lines):
    d = {}
    for line in lines:
        m = KV.match(line.strip())
        if m and line == line.lstrip():
            d[m.group(1).strip()] = m.group(2).strip()
    return d


def num(s):
    try:
        return float(str(s).replace(",", "."))
    except (TypeError, ValueError):
        return None


def iso(s, where):
    if not s:
        return None
    try:
        return dt.date.fromisoformat(s).isoformat()
    except ValueError:
        err(f"{where}: data non valida «{s}» (serve AAAA-MM-GG)")
        return None


def gmaps(q):
    return "https://www.google.com/maps/search/?api=1&query=" + quote(q)


def goto(q):
    """Indicazioni da dove sono adesso fino a q (Google Maps sceglie il punto di partenza)."""
    return "https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=" + quote(q)


def parse_places(lines):
    places = {}
    for pid, body in entries(lines):
        f = fields(body)
        if pid in places:
            err(f"Posti: id doppio «{pid}»")
        if f.get("città") not in CITIES:
            err(f"Posti/{pid}: città sconosciuta «{f.get('città')}»")
        p = {
            "id": pid, "name": f.get("nome", pid), "type": f.get("tipo", ""), "cityId": f.get("città"),
            "city": CITIES.get(f.get("città"), f.get("città")), "day": f.get("giorno", ""), "note": f.get("nota", ""),
            "q": f.get("maps", f.get("nome", pid)), "ta": f.get("tripadvisor"), "tabelog": f.get("tabelog"),
            "score": f.get("voto"), "web": f.get("sito"), "map": f.get("mappa", "sì") != "no", "photo": f.get("foto"),
        }
        p["maps"] = gmaps(p["q"])
        p["link"] = best_link(p)
        places[pid] = p
    return places


def best_link(p):
    if p.get("ta"):
        return {"url": p["ta"], "label": "Tripadvisor"}
    if p.get("tabelog"):
        return {"url": p["tabelog"], "label": "Tabelog"}
    if p.get("web"):
        return {"url": p["web"], "label": "Sito ufficiale"}
    return {"url": p["maps"], "label": "Google Maps"}


def parse_hotels(lines):
    hotels = {}
    for hid, body in entries(lines):
        f = fields(body)
        try:
            d_in, d_out = dt.date.fromisoformat(f["dal"]), dt.date.fromisoformat(f["al"])
        except (KeyError, ValueError):
            err(f"Alloggi/{hid}: date «dal»/«al» mancanti o non valide")
            continue
        paid = f.get("pagato", "")
        if paid not in ("sì", "no", "gruppo"):
            err(f"Alloggi/{hid}: «pagato» deve essere sì, no o gruppo")
        hotels[hid] = {
            "id": hid, "name": f.get("nome", hid), "cityId": f.get("città"), "city": CITIES.get(f.get("città"), ""),
            "in": d_in.isoformat(), "out": d_out.isoformat(), "nights": (d_out - d_in).days,
            "price": f.get("prezzo", ""), "yen": num(f.get("yen")), "eur": num(f.get("euro")),
            "paid": paid, "payer": f.get("pagato da", ""), "shared": f.get("diviso", "no") == "sì",
            "payment": f.get("pagamento", ""), "cancel": f.get("cancellazione", ""), "note": f.get("nota", ""),
            "address": f.get("indirizzo", ""), "access": f.get("arrivo", ""), "hours": f.get("orari", ""),
            "app": f.get("app"), "q": f.get("maps", f.get("nome", hid)), "phone": f.get("telefono", ""),
            "room": f.get("camera", ""),
        }
    return hotels


def parse_trains(lines, where="Treni"):
    trains = {}
    for tid, body in entries(lines):
        f = fields(body)
        st = f.get("stato", "")
        if st not in ("pagato", "prenotato", "da comprare", "sul posto"):
            err(f"{where}/{tid}: stato sconosciuto «{st}»")
        trains[tid] = {
            "id": tid, "date": iso(f.get("data"), f"{where}/{tid}"), "route": f.get("tratta", ""),
            "line": f.get("mezzo", ""), "time": f.get("orario", ""), "price": f.get("prezzo", ""),
            "eur": num(f.get("euro")), "payer": f.get("pagato da", ""), "confirm": iso(f.get("conferma"), f"{where}/{tid}"),
            "link": f.get("link"), "note": f.get("nota", ""), "status": st,
        }
    return trains


def parse_links(v, where):
    """«link: URL» oppure «link: Etichetta = URL ; Etichetta = URL» (il primo è il pulsante principale)."""
    out = []
    for part in [x.strip() for x in (v or "").split(" ; ") if x.strip()]:
        lab, _, url = part.rpartition(" = ") if " = " in part else ("", "", part)
        if not re.match(r"^(https?://|tel:)", url):
            err(f"{where}: link non valido «{url[:50]}»")
        out.append({"label": lab.strip(), "url": url.strip()})
    return out


def parse_todo(lines):
    out = []
    for tid, body in entries(lines):
        f = fields(body)
        where = f"Da fare/{tid}"
        if f.get("tipo") not in ("prenotare", "gestire"):
            err(f"{where}: tipo deve essere prenotare o gestire")
        out.append({"id": tid, "task": f.get("cosa", tid), "kind": f.get("tipo"), "day": iso(f.get("giorno"), where),
                    "opens": iso(f.get("apre"), where), "due": iso(f.get("entro"), where), "when": f.get("quando", ""),
                    "cost": f.get("costo", ""), "link": None, "links": parse_links(f.get("link"), where),
                    "prio": f.get("priorità", "media"), "note": f.get("nota", ""), "slot": f.get("tappa")})
        out[-1]["link"] = out[-1]["links"][0]["url"] if out[-1]["links"] else None
    return out


def parse_budget(lines):
    out = []
    for line in lines:
        m = re.match(r"^- (.+?):\s*([\d.]+)\s*(?:\|\s*(.*))?$", line.strip())
        if m:
            out.append({"item": m.group(1), "eur": float(m.group(2)), "note": (m.group(3) or "").strip()})
    return out


def parse_glossary(lines):
    out, cat = [], ""
    for line in lines:
        if line.startswith("### "):
            cat = line[4:].strip()
        m = re.match(r"^- (.+?):\s+(.+)$", line.strip())
        if m:
            out.append({"term": m.group(1), "means": m.group(2), "cat": cat})
    return out


ITEM = re.compile(r"^- (\d{2}:\d{2}) ([a-z]+) (.+)$")
VIA = re.compile(r"^via (mezzi|piedi|taxi):\s*(.+?)\s*>\s*(.+?)(?:\s*\((.+)\))?$")


def resolve(ref, places, hotels, where):
    if ref.startswith("#"):
        p = places.get(ref[1:])
        if not p:
            err(f"{where}: posto sconosciuto «{ref}»")
            return ref[1:]
        return p["q"]
    if ref.startswith("@"):
        h = hotels.get(ref[1:])
        if not h:
            err(f"{where}: alloggio sconosciuto «{ref}»")
            return ref[1:]
        return h["q"]
    return ref


def check_refs(text, places, where):
    for pid in REF.findall(text):
        if pid not in places:
            err(f"{where}: [[{pid}]] non è nella sezione Posti")


def parse_item(line, details, did, city, places, hotels, trains, tz_day):
    m = ITEM.match(line.strip())
    if not m:
        err(f"{did}: riga non riconosciuta «{line.strip()[:60]}»")
        return None, city
    t, kind, rest = m.groups()
    where = f"{did} {t}"
    if kind not in TYPES:
        err(f"{where}: tipo sconosciuto «{kind}» (validi: {', '.join(TYPES)})")
    parts = [p.strip() for p in rest.split(" | ")]
    item = {"t": t, "k": kind, "title": parts[0], "tz": tz_day}
    for a in parts[1:]:
        if a.startswith("posto: "):
            pid = a[7:].strip()
            if pid not in places:
                err(f"{where}: posto sconosciuto «{pid}»")
            else:
                item["place"] = pid
        elif a.startswith("alloggio: "):
            hid = a[10:].strip()
            if hid not in hotels:
                err(f"{where}: alloggio sconosciuto «{hid}»")
            item["hotel"] = hid
        elif a.startswith("treno: "):
            tid = a[7:].strip()
            if tid not in trains:
                err(f"{where}: treno sconosciuto «{tid}»")
            else:
                item["train"] = tid
        elif a.startswith("città: "):
            c = a[7:].strip()
            if c not in CITIES:
                err(f"{where}: città sconosciuta «{c}»")
            city = c
        elif a.startswith("foto: "):
            item["photo"] = a[6:].strip()
        elif a.startswith("dove: "):
            item["q"] = a[6:].strip()
        elif a.startswith("zona: "):
            item["zone"] = a[6:].strip()
        elif a.startswith("fuso: "):
            z = a[6:].strip()
            if z not in TZ:
                err(f"{where}: fuso sconosciuto «{z}»")
            item["tz"] = z
        elif a == "prenotare":
            item["status"] = "todo"
        elif a == "prenotato":
            item["status"] = "ok"
        elif a == "deposito":
            item["bag"] = "in"
        elif a == "ritiro":
            item["bag"] = "out"
        elif a.startswith("via "):
            v = VIA.match(a)
            if not v:
                err(f"{where}: «via» non riconosciuto «{a[:50]}»")
                continue
            mode_it, o, d, lab = v.groups()
            dq = resolve(d, places, hotels, where)
            url = ("https://www.google.com/maps/dir/?api=1&origin=" + quote(resolve(o, places, hotels, where)) +
                   "&destination=" + quote(dq) + "&travelmode=" + MODE[mode_it])
            item.setdefault("routes", []).append({"label": lab or "Indicazioni", "mode": MODE[mode_it], "url": url, "to": dq})
        else:
            err(f"{where}: attributo sconosciuto «{a[:40]}»")
    det = []
    for dl in details:
        s = dl.strip()
        m2 = KV.match(s)
        if m2 and m2.group(1) == "breve":
            item["short"] = m2.group(2).strip()
        elif m2 and m2.group(1) in DETAIL:
            det.append({"k": m2.group(1), "label": DETAIL[m2.group(1)], "text": m2.group(2).strip()})
        elif m2 and " " not in m2.group(1) and len(m2.group(1)) < 14:
            err(f"{where}: chiave di dettaglio sconosciuta «{m2.group(1)}:»")
        else:
            det.append({"k": "text", "text": s})
        check_refs(s, places, where)
    if det:
        item["details"] = det
    if item.get("status") == "ok" and "train" in item and trains[item["train"]]["status"] == "pagato":
        item["status"] = "paid"
    # destinazione per «Portami qui» e per la mappa
    if "place" in item and "photo" not in item and places[item["place"]].get("photo"):
        item["photo"] = places[item["place"]]["photo"]
    if "place" in item:
        item["dest"] = places[item["place"]]["q"]
    elif "q" in item:
        item["dest"] = item["q"]
    elif "hotel" in item and item["hotel"] in hotels:
        item["dest"] = hotels[item["hotel"]]["q"]
    elif kind == "sposta" and item.get("routes"):
        item["dest"] = item["routes"][0]["to"]
    if kind == "bagagli" and "bag" not in item:
        err(f"{where}: per le valigie serve «deposito» o «ritiro»")
    item["city"] = "transit" if kind == "viaggio" else city
    if kind == "sposta" and not item.get("routes"):
        warn(f"{where}: spostamento senza «via»")
    return item, city


def morning_and_legs(did, items, prev_sleep, hotels):
    """Ogni mattina si parte dall'hotel; lo spostamento verso la tappa successiva diventa il suo «come arrivarci»."""
    if items and prev_sleep in hotels and items[0]["k"] not in ("hotel", "bagagli"):
        h, first = hotels[prev_sleep], items[0]
        items.insert(0, {"t": first["t"], "k": "hotel", "title": h["name"], "short": "si parte da qui",
                         "hotel": prev_sleep, "dest": h["q"], "start": True, "tz": first["tz"], "at": first["at"],
                         "city": h["cityId"]})
    for i, it in enumerate(items[:-1]):
        nx = items[i + 1]
        if it["k"] == "sposta" and nx["k"] not in ("sposta",) and it.get("dest") and it["dest"] == nx.get("dest"):
            it["merged"] = True
            nx["leg"] = i
        elif it["k"] == "sposta":
            warn(f"{did} {it['t']}: lo spostamento «{it['title']}» non porta alla tappa dopo (resta una riga a sé)")


def parse_days(lines, places, hotels, trains):
    days = []
    prev_sleep = None
    for n, (did, body) in enumerate(entries(lines), start=1):
        try:
            date = dt.date.fromisoformat(did)
        except ValueError:
            err(f"Giorni: data non valida «{did}»")
            continue
        head, guide_l, mode = [], [], "head"
        raw_items = []  # [riga, [dettagli]]
        for line in body:
            if line.startswith("#### Guida"):
                mode = "guide"
            elif mode != "guide" and line.startswith("- "):
                mode = "items"
                raw_items.append([line, []])
            elif mode == "items" and line.startswith("  ") and line.strip():
                raw_items[-1][1].append(line)
            elif mode == "head":
                head.append(line)
            elif mode == "guide":
                guide_l.append(line)
            elif line.strip():
                err(f"{did}: riga fuori posto «{line.strip()[:60]}»")
        f = fields(head)
        route = [c.strip() for c in f.get("percorso", "").split(">") if c.strip()]
        for c in route:
            if c not in CITIES:
                err(f"{did}: città sconosciuta nel percorso «{c}»")
        sleep = f.get("dorme", "")
        if sleep not in hotels and sleep != "volo":
            err(f"{did}: alloggio sconosciuto in «dorme: {sleep}»")
        tz_day = f.get("fuso", "tokyo")
        if tz_day not in TZ:
            err(f"{did}: fuso sconosciuto «{tz_day}»")
        city = route[0] if route else "tokyo"
        items, last = [], None
        for line, det in raw_items:
            item, city = parse_item(line, det, did, city, places, hotels, trains, tz_day)
            if not item:
                continue
            item["at"] = f"{did}T{item['t']}:00{TZ[item['tz']]}"
            if last and item["tz"] == last["tz"] and item["t"] < last["t"]:
                warn(f"{did}: orario fuori ordine {item['t']} dopo {last['t']}")
            last = item
            items.append(item)
        morning_and_legs(did, items, prev_sleep, hotels)
        prev_sleep = f.get("dorme", "")
        guide, key = {}, None
        for line in guide_l:
            m = KV.match(line.strip())
            if m and not line.startswith(" ") and m.group(1) in GUIDE_KEYS:
                key = m.group(1)
                guide[key] = m.group(2).strip()
            elif key and line.strip().startswith("•"):
                guide[key] = (guide[key] + "\n" + line.strip()).strip()
            elif line.strip():
                warn(f"{did}: riga della guida ignorata «{line.strip()[:50]}»")
        h = hotels.get(sleep)
        # «gruppo: 14:00-» / «gruppo: tutto» / «gruppo: 06:35-18:20»: quando siete insieme al gruppo
        grp = None
        gv = f.get("gruppo", "").strip()
        if gv:
            if gv == "tutto":
                grp = {"from": "00:00", "to": "23:59"}
            else:
                mg = re.match(r"^(\d\d:\d\d)?\s*-\s*(\d\d:\d\d)?$", gv)
                if not mg:
                    err(f"{did}: «gruppo» deve essere tutto, HH:MM-, -HH:MM o HH:MM-HH:MM")
                else:
                    grp = {"from": mg.group(1) or "00:00", "to": mg.group(2) or "23:59"}
            if grp:
                for it in items:
                    if grp["from"] <= it["t"] <= grp["to"] and it["tz"] == "tokyo":
                        it["group"] = True
        days.append({
            "id": did, "n": n, "dm": f"{date.day}/{date.month}", "wd": WD[date.weekday()], "route": route,
            "sleep": sleep, "sleepName": h["name"] if h else ("In volo" if sleep == "volo" else sleep),
            "with": f.get("con", ""), "group": grp, "tz": tz_day, "items": items, "guide": guide,
        })
    return days


def parse_zones(lines, places, hotels):
    """Zone (quartieri): ogni posto o alloggio appartiene a una sola zona."""
    zones, owner = {}, {}
    for zid, body in entries(lines):
        f = fields(body)
        zones[zid] = {"name": f.get("nome", zid), "what": f.get("cosa", "")}
        for m in [x.strip() for x in f.get("posti", "").split(",") if x.strip()]:
            ok = m[1:] in hotels if m.startswith("@") else m in places
            if not ok:
                err(f"Zone/{zid}: «{m}» non esiste")
            if m in owner:
                err(f"Zone/{zid}: «{m}» è già nella zona «{owner[m]}»")
            owner[m] = zid
    return zones, owner


def assign_zones(days, zones, owner):
    """Zona di ogni tappa: attributo «zona», poi il posto, poi l'alloggio. Treni, voli e spostamenti non ne hanno."""
    for d in days:
        for it in d["items"]:
            where = f"{d['id']} {it['t']}"
            if it.get("zone"):
                if it["zone"] not in zones:
                    err(f"{where}: zona sconosciuta «{it['zone']}»")
                continue
            z = None
            if it.get("place"):
                z = owner.get(it["place"])
            elif it.get("hotel") and it["k"] in ("hotel", "bagagli", "fare", "cibo"):
                z = owner.get("@" + it["hotel"])
            if z:
                it["zone"] = z
            elif it["k"] not in ("viaggio", "sposta") and it.get("city") not in ("roma", "transit"):
                warn(f"{where}: «{it['title']}» senza zona")


def attach_todos(todo, days, trains):
    """Ogni cosa da fare va sulla sua tappa (notifica nel giorno giusto).
    Senza «tappa» va sulla prima tappa del primo giorno (la partenza)."""
    seen_links = set()
    for t in trains.values():
        if t["status"] != "pagato" or not t.get("confirm") or (t.get("link") in seen_links):
            continue
        seen_links.add(t.get("link"))
        cd = dt.date.fromisoformat(t["confirm"])
        for d in days:
            for it in d["items"]:
                if it.get("train") == t["id"]:
                    todo.append({"id": "klook-" + t["id"], "task": "Controllare che Klook emetta il biglietto", "kind": "gestire",
                                 "day": d["id"], "opens": t["confirm"], "due": None, "when": f"dal {cd.day}/{cd.month}: arriva un'email col voucher",
                                 "cost": "", "link": t.get("link"), "prio": "alta", "slot": f"{d['id']} {it['t']}",
                                 "note": "Pagato il 7/9: Klook emette i biglietti quando apre la vendita ufficiale. "
                                         "Se la conferma non arriva, rimborsa e il treno va ricomprato subito."})
                    break
    for t in todo:
        if not t.get("slot"):
            first = next((it for it in days[0]["items"] if not it.get("merged") and not it.get("start")), None)
            if first:
                t["slot"] = f"{days[0]['id']} {first['t']}"
            else:
                t["general"] = True
                continue
        t["at"] = []
        for slot in [x.strip() for x in t["slot"].split(",") if x.strip()]:
            try:
                date, hm = slot.split()
            except ValueError:
                err(f"Da fare/{t['id']}: «tappa» deve essere AAAA-MM-GG HH:MM")
                continue
            found = None
            for di, d in enumerate(days):
                if d["id"] != date:
                    continue
                for ii, it in enumerate(d["items"]):
                    if it["t"] == hm and not it.get("merged") and not it.get("start"):
                        found = (di, ii)
                        break
            if not found:
                err(f"Da fare/{t['id']}: nessuna tappa alle {hm} del {date}")
                continue
            t["at"].append({"d": found[0], "i": found[1]})
            t["day"] = t.get("day") or date
            days[found[0]]["items"][found[1]].setdefault("todos", []).append(t["id"])
        # controllo di coerenza: date e orari scritti nel testo devono essere quelli della tappa
        txt = t.get("task", "")
        dates = {f"2026-{int(mo):02d}-{int(dd):02d}" for dd, mo in re.findall(r"\b(\d{1,2})/(1[01])\b", txt)}
        slot_dates = {x.split()[0] for x in t["slot"].split(",") if x.strip()}
        if dates and not dates & slot_dates:
            err(f"Da fare/{t['id']}: il testo parla del {', '.join(sorted(dates))} ma la tappa è il {', '.join(sorted(slot_dates))}")
        for hh, mm in re.findall(r"\bore (\d{1,2})[:.](\d{2})", txt):
            if not any(x.strip().endswith(f"{int(hh):02d}:{mm}") for x in t["slot"].split(",")):
                err(f"Da fare/{t['id']}: il testo dice ore {hh}:{mm} ma la tappa è alle {t['slot']}")


def main():
    text = SRC.read_text(encoding="utf-8")
    S = sections(text)
    for need in ("Giorni", "Alloggi", "Treni", "Voli", "Posti", "Da fare", "Budget", "Glossario", "Info"):
        if need not in S:
            err(f"manca la sezione «## {need}»")
    if errors:
        print("\n".join("ERRORE: " + e for e in errors))
        return 1
    places = parse_places(S["Posti"])
    hotels = parse_hotels(S["Alloggi"])
    trains = parse_trains(S["Treni"])
    flights = parse_trains(S["Voli"], "Voli")
    days = parse_days(S["Giorni"], places, hotels, trains)
    zones, owner = parse_zones(S.get("Zone", []), places, hotels)
    assign_zones(days, zones, owner)
    info = fields(S["Info"])
    day_dm = {d["dm"] for d in days}
    for pid, p in places.items():
        if p["day"] and p["day"] not in day_dm:
            err(f"Posti/{pid}: giorno «{p['day']}» fuori dal viaggio")
    todo = parse_todo(S["Da fare"])
    attach_todos(todo, days, trains)
    data = {
        "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "departure": info.get("partenza"), "rate": float(info.get("cambio", 185)),
        "travellers": [x.strip() for x in info.get("viaggiatori", "").split(",") if x.strip()],
        "days": days, "hotels": list(hotels.values()), "trains": list(trains.values()), "flights": list(flights.values()),
        "todo": todo, "budget": parse_budget(S["Budget"]),
        "places": places, "zones": zones, "glossary": parse_glossary(S["Glossario"]),
    }
    for w in warnings:
        print("avviso:", w)
    if errors:
        print("\n".join("ERRORE: " + e for e in errors))
        return 1
    n_items = sum(len(d["items"]) for d in days)
    n_routes = sum(len(it.get("routes", [])) for d in days for it in d["items"])
    print(f"ok: {len(days)} giorni · {n_items} tappe · {n_routes} indicazioni · {len(places)} posti · "
          f"{len(hotels)} alloggi · {len(trains)} treni · {len(flights)} voli · {len(todo)} cose da fare · "
          f"{len(data['glossary'])} termini")
    if "--check" not in sys.argv:
        OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print("scritto", OUT.name)
    return 0


if __name__ == "__main__":
    sys.exit(main())
