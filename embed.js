import {
  matchStats
} from "./c-2IGOKSCJ.js";
import {
  K,
  labelOf,
  statColor
} from "./c-RSYCSEIU.js";

// src/embed.js
import OBR from "https://cdn.jsdelivr.net/npm/@owlbear-rodeo/sdk@3.1.0/+esm";
var $ = (s) => document.querySelector(s);
var id = null;
var cur = 0;
async function load() {
  const sel = await OBR.player.getSelection() || [];
  id = sel[0];
  const [it] = id ? await OBR.scene.items.getItems([id]) : [];
  if (!it) return;
  const s = it.metadata[K.stats] || matchStats(labelOf(it)) || { ac: 10, hp: 10, max: 10, atk: "" };
  $("#nm").textContent = labelOf(it) + (it.metadata[K.stats] ? "" : " (brak statystyk)");
  cur = s.hp;
  $("#ac").value = s.ac;
  $("#hp").value = s.hp;
  $("#max").value = s.max;
  $("#atk").textContent = s.atk || "";
  $("#hp").style.borderColor = statColor(s);
}
async function save(patch) {
  await OBR.scene.items.updateItems([id], (ds) => {
    for (const d of ds) {
      const s = { ac: +$("#ac").value, hp: +$("#hp").value, max: +$("#max").value, atk: $("#atk").textContent, ...patch };
      s.hp = Math.max(0, Math.min(s.max, s.hp));
      d.metadata[K.stats] = s;
    }
  });
  load();
}
OBR.onReady(() => {
  load();
  document.querySelectorAll("[data-d]").forEach((b) => b.onclick = () => save({ hp: cur + +b.dataset.d }));
  ["ac", "max"].forEach((k) => $("#" + k).onchange = () => save({}));
  $("#hp").onchange = () => {
    const v = $("#hp").value.trim();
    save({ hp: /^[+-]/.test(v) ? cur + Number(v) : Number(v) });
  };
});
