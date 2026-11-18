import {
  matchStats
} from "./c-2IGOKSCJ.js";
import {
  K,
  PORTAL,
  labelOf,
  labelsOn,
  setLabels,
  statColor
} from "./c-RSYCSEIU.js";

// src/popover.js
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
var $ = (s) => document.querySelector(s);
var esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var msg = (t, ok = true) => {
  const m = $("#msg");
  m.textContent = t;
  m.className = ok ? "ok" : "err";
};
var ping = () => OBR.broadcast.sendMessage(`${K.ns}/labels`, {}, { destination: "LOCAL" });
async function fill(overwrite) {
  const items = await OBR.scene.items.getItems((i) => i.layer === "CHARACTER");
  const hit = [], miss = [];
  for (const i of items) {
    if (!overwrite && i.metadata[K.stats]) continue;
    const s = matchStats(labelOf(i));
    if (s) hit.push([i.id, s]);
    else if (!/^BG •/.test(labelOf(i))) miss.push(labelOf(i));
  }
  if (hit.length) {
    const m = new Map(hit);
    await OBR.scene.items.updateItems([...m.keys()], (ds) => {
      for (const d of ds) d.metadata[K.stats] = m.get(d.id);
    });
  }
  msg(`Uzupe\u0142niono: ${hit.length}. Bez dopasowania (gracze/bohaterowie bez walki): ${miss.length ? miss.join(", ") : "\u2014"}`);
  render();
}
async function render() {
  const q = $("#q").value.trim().toLowerCase();
  const items = (await OBR.scene.items.getItems((i) => i.metadata[K.stats] !== void 0)).filter((i) => !q || labelOf(i).toLowerCase().includes(q)).sort((a, b) => labelOf(a).localeCompare(labelOf(b), "pl", { numeric: true }));
  $("#count").textContent = items.length;
  $("#list").innerHTML = items.map((i) => {
    const s = i.metadata[K.stats];
    return `<div class="row${i.visible ? "" : " hid"}" data-id="${i.id}">
      <button class="nm" title="${esc(s.atk || "")}">${esc(labelOf(i))}</button>
      <span class="ac">KP ${s.ac}</span>
      <button data-d="-5">\u22125</button><button data-d="-1">\u22121</button>
      <input type="text" inputmode="numeric" title="liczba = nowe PW, \u22127 / +3 = zmiana" value="${s.hp}" style="border-color:${statColor(s)}">
      <span class="mx">/${s.max}</span>
      <button data-d="1">+1</button>
    </div>`;
  }).join("") || `<p class="dim">Brak token\xF3w ze statystykami w tej scenie \u2014 kliknij \u201EUzupe\u0142nij\u201D.</p>`;
}
async function setHp(id, f) {
  await OBR.scene.items.updateItems([id], (ds) => {
    for (const d of ds) {
      const s = { ...d.metadata[K.stats] };
      s.hp = Math.max(0, Math.min(s.max, Math.round(f(s.hp))));
      d.metadata[K.stats] = s;
    }
  });
}
var dupArm = null;
async function dups() {
  const items = await OBR.scene.items.getItems((i) => i.type === "IMAGE" && ["CHARACTER", "PROP", "MOUNT"].includes(i.layer));
  const seen = /* @__PURE__ */ new Map(), extra = [];
  for (const i of items) {
    const key = [i.type, i.layer, labelOf(i), i.image?.url, Math.round(i.position.x), Math.round(i.position.y), i.attachedTo || ""].join("|");
    if (seen.has(key)) extra.push(i);
    else seen.set(key, i);
  }
  if (!extra.length) {
    msg("Brak duplikat\xF3w w tej scenie.");
    return;
  }
  if (dupArm !== extra.length) {
    dupArm = extra.length;
    msg(`Znaleziono ${extra.length} duplikat(\xF3w): ${[...new Set(extra.map(labelOf))].join(", ")}. Kliknij jeszcze raz, aby usun\u0105\u0107 (Ctrl+Z cofa).`, false);
    return;
  }
  dupArm = null;
  await OBR.scene.items.deleteItems(extra.map((i) => i.id));
  msg(`Usuni\u0119to ${extra.length} duplikat(\xF3w).`);
}
async function link() {
  const sel = await OBR.player.getSelection() || [];
  if (sel.length !== 2) {
    msg("Zaznacz dok\u0142adnie 2 elementy (Shift+klik), potem kliknij ponownie.", false);
    return;
  }
  const [a, b] = sel;
  await OBR.scene.items.updateItems(sel, (ds) => {
    for (const d of ds) d.metadata[PORTAL] = d.id === a ? b : a;
  });
  msg("Teleport \u2194 po\u0142\u0105czony. Przeci\u0105gnij token na znacznik, by przetestowa\u0107.");
}
var ROUTE = "local.golden-vault/route";
async function linkRoutes() {
  const items = await OBR.scene.items.getItems((i) => i.metadata[ROUTE] !== void 0);
  const g = /* @__PURE__ */ new Map();
  for (const i of items) {
    const r = i.metadata[ROUTE];
    if (!g.has(r)) g.set(r, []);
    g.get(r).push(i);
  }
  const ok = [], bad = [];
  const pairs = /* @__PURE__ */ new Map();
  for (const [r, arr] of g) {
    if (arr.length !== 2) {
      bad.push(`${r} (${arr.length} szt.)`);
      continue;
    }
    const [a, b] = arr;
    if (a.metadata[PORTAL] === b.id && b.metadata[PORTAL] === a.id) continue;
    pairs.set(a.id, b.id);
    pairs.set(b.id, a.id);
    ok.push(r);
  }
  if (pairs.size) await OBR.scene.items.updateItems([...pairs.keys()], (ds) => {
    for (const d of ds) d.metadata[PORTAL] = pairs.get(d.id);
  });
  msg(`Po\u0142\u0105czono: ${ok.length ? ok.join(", ") : "nic nowego"}${bad.length ? ". Pomini\u0119to (nie para \u2014 u\u017Cyj \u201EUsu\u0144 duplikaty\u201D): " + bad.join(", ") : ""}`, !bad.length);
}
async function listPortals() {
  const items = await OBR.scene.items.getItems((i) => i.metadata[PORTAL] !== void 0);
  const ids = new Set(items.map((i) => i.id));
  const by = new Map(items.map((i) => [i.id, i]));
  const done = /* @__PURE__ */ new Set(), out = [];
  for (const i of items) {
    if (done.has(i.id)) continue;
    const d = i.metadata[PORTAL];
    done.add(i.id);
    if (ids.has(d)) {
      done.add(d);
      out.push(`\u2713 ${labelOf(i)} \u2194 ${labelOf(by.get(d))}`);
    } else out.push(`\u2717 ${labelOf(i)} \u2192 (cel nie istnieje)`);
  }
  msg(out.length ? out.join(" \xB7 ") : "Brak teleport\xF3w w tej scenie.", !out.some((o) => o.startsWith("\u2717")));
}
OBR.onReady(async () => {
  if (await OBR.player.getRole() !== "GM") {
    document.body.innerHTML = "<p>Panel tylko dla GM.</p>";
    return;
  }
  $("#lbl").checked = labelsOn();
  $("#lbl").onchange = (e) => {
    setLabels(e.target.checked);
    ping();
  };
  $("#fill").onclick = () => fill(false);
  $("#refill").onclick = () => fill(true);
  $("#heal").onclick = async () => {
    const ids = (await OBR.scene.items.getItems((i) => i.metadata[K.stats] !== void 0)).map((i) => i.id);
    await OBR.scene.items.updateItems(ids, (ds) => {
      for (const d of ds) d.metadata[K.stats] = { ...d.metadata[K.stats], hp: d.metadata[K.stats].max };
    });
    msg("Wszystkim przywr\xF3cono pe\u0142ne PW.");
  };
  $("#clear").onclick = async () => {
    const ids = (await OBR.scene.items.getItems((i) => i.metadata[K.stats] !== void 0)).map((i) => i.id);
    await OBR.scene.items.updateItems(ids, (ds) => {
      for (const d of ds) delete d.metadata[K.stats];
    });
    msg("Usuni\u0119to statystyki z token\xF3w tej sceny.");
  };
  $("#dups").onclick = dups;
  $("#link").onclick = link;
  $("#portals").onclick = listPortals;
  $("#routes").onclick = linkRoutes;
  $("#q").oninput = render;
  $("#list").onclick = async (e) => {
    const row = e.target.closest(".row");
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.classList.contains("nm")) {
      await OBR.player.select([id]);
      const b = await OBR.scene.items.getItemBounds([id]);
      const pad = 600;
      OBR.viewport.animateToBounds({ ...b, min: { x: b.min.x - pad, y: b.min.y - pad }, max: { x: b.max.x + pad, y: b.max.y + pad }, width: b.width + 2 * pad, height: b.height + 2 * pad });
    } else if (e.target.dataset.d) {
      const d = +e.target.dataset.d;
      setHp(id, (h) => h + d);
    }
  };
  $("#list").onchange = (e) => {
    if (e.target.tagName !== "INPUT") return;
    const v = e.target.value.trim();
    const id = e.target.closest(".row").dataset.id;
    setHp(id, (h) => /^[+-]/.test(v) ? h + Number(v) : Number(v));
  };
  OBR.scene.items.onChange(() => {
    if (document.activeElement?.tagName !== "INPUT" || document.activeElement.id === "q") render();
  });
  OBR.scene.onReadyChange((r) => r && render());
  if (await OBR.scene.isReady()) render();
});
