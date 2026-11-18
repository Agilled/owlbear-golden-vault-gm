import {
  K,
  PORTAL,
  labelOf,
  labelsOn,
  statColor
} from "./c-RSYCSEIU.js";

// src/background.js
import OBR, { buildLabel } from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
var syncing = false;
var again = false;
async function syncLabels() {
  if (syncing) {
    again = true;
    return;
  }
  syncing = true;
  try {
    do {
      again = false;
      if (!await OBR.scene.isReady()) break;
      const local = await OBR.scene.local.getItems((i) => i.metadata[K.label] !== void 0);
      const isGM = await OBR.player.getRole() === "GM";
      if (!isGM || !labelsOn()) {
        if (local.length) await OBR.scene.local.deleteItems(local.map((i) => i.id));
        break;
      }
      const dpi = await OBR.scene.grid.getDpi();
      const tokens = await OBR.scene.items.getItems((i) => i.metadata[K.stats] !== void 0);
      const want = /* @__PURE__ */ new Map();
      for (const t of tokens) {
        const s = t.metadata[K.stats];
        want.set(t.id, { text: `KP ${s.ac} \xB7 PW ${s.hp}/${s.max}`, color: statColor(s), t });
      }
      const byOwner = new Map(local.map((l) => [l.metadata[K.label], l]));
      const del = local.filter((l) => !want.has(l.metadata[K.label])).map((l) => l.id);
      if (del.length) await OBR.scene.local.deleteItems(del);
      const upd = [], add = [];
      for (const [id, w] of want) {
        const l = byOwner.get(id);
        if (!l) {
          const sx = Math.abs(w.t.scale?.x ?? 1);
          add.push(
            buildLabel().plainText(w.text).position({ x: w.t.position.x, y: w.t.position.y - dpi * 0.55 * sx }).attachedTo(id).layer("TEXT").locked(true).disableHit(true).disableAttachmentBehavior(["VISIBLE", "SCALE", "ROTATION"]).fontSize(22).fontWeight(700).fillColor("#ffffff").backgroundColor(w.color).backgroundOpacity(0.9).padding(6).cornerRadius(8).pointerHeight(0).metadata({ [K.label]: id }).build()
          );
        } else if (l.text.plainText !== w.text || l.style.backgroundColor !== w.color) {
          upd.push([l.id, w]);
        }
      }
      if (add.length) await OBR.scene.local.addItems(add);
      if (upd.length) {
        const m = new Map(upd);
        await OBR.scene.local.updateItems(upd.map((u) => u[0]), (ds) => {
          for (const d of ds) {
            const w = m.get(d.id);
            d.text.plainText = w.text;
            d.style.backgroundColor = w.color;
          }
        });
      }
    } while (again);
  } catch (e) {
    console.error("[GV]", e);
  }
  syncing = false;
}
OBR.onReady(async () => {
  OBR.contextMenu.create({
    id: `${K.ns}/link`,
    icons: [{ icon: "icon.svg", label: "GV: po\u0142\u0105cz jako teleport \u2194", filter: { min: 2, max: 2, roles: ["GM"] } }],
    onClick: async (ctx) => {
      const [a, b] = ctx.items;
      await OBR.scene.items.updateItems([a.id, b.id], (ds) => {
        for (const d of ds) d.metadata[PORTAL] = d.id === a.id ? b.id : a.id;
      });
      OBR.notification.show(`Teleport po\u0142\u0105czony: ${labelOf(a)} \u2194 ${labelOf(b)}`, "SUCCESS");
    }
  });
  OBR.contextMenu.create({
    id: `${K.ns}/unlink`,
    icons: [{ icon: "icon.svg", label: "GV: roz\u0142\u0105cz teleport", filter: { min: 1, roles: ["GM"], every: [{ key: ["metadata", PORTAL], operator: "!=", value: void 0 }] } }],
    onClick: async (ctx) => {
      await OBR.scene.items.updateItems(ctx.items.map((i) => i.id), (ds) => {
        for (const d of ds) delete d.metadata[PORTAL];
      });
      OBR.notification.show("Teleport roz\u0142\u0105czony", "INFO");
    }
  });
  OBR.contextMenu.create({
    id: `${K.ns}/hp`,
    icons: [{ icon: "icon.svg", label: "GV: PW / KP", filter: { min: 1, max: 1, roles: ["GM"], every: [{ key: "layer", value: "CHARACTER" }] } }],
    embed: { url: "embed.html", height: 96 }
  });
  OBR.scene.onReadyChange((r) => r && syncLabels());
  OBR.scene.items.onChange(() => syncLabels());
  OBR.broadcast.onMessage(`${K.ns}/labels`, () => syncLabels());
  window.addEventListener("storage", () => syncLabels());
  syncLabels();
});
