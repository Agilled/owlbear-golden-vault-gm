// src/common.js
var K = { ns: "pl.goldenvault.gm" };
K.stats = `${K.ns}/stats`;
K.label = `${K.ns}/label`;
var PORTAL = "de.resident-uhlig.portals/destination-id";
var labelOf = (i) => i.text && i.text.plainText || i.name || "?";
var labelsOn = () => {
  try {
    return localStorage.getItem("gv-labels") !== "0";
  } catch {
    return true;
  }
};
var setLabels = (v) => {
  try {
    localStorage.setItem("gv-labels", v ? "1" : "0");
  } catch {
  }
};
var statColor = (s) => {
  const r = s.max ? s.hp / s.max : 1;
  return s.hp <= 0 ? "#555555" : r <= 0.25 ? "#b3261e" : r <= 0.5 ? "#c77700" : "#2e7d32";
};

export {
  K,
  PORTAL,
  labelOf,
  labelsOn,
  setLabels,
  statColor
};
