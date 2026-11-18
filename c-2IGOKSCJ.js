// src/stats.js
var T = (re, ac, hp, atk) => ({ re, ac, hp, atk });
var STATS = [
  // ---------- The Stygian Gambit ----------
  T(/^Crab$/i, null),
  T(/^(Strażnik \(patrol\)|Strażnik posążka|Ochrona)/, 11, 32, "2\xD7 buzdygan +4 (1k6+2)"),
  T(/^Virgil/, 12, 67, "top\xF3r +6 (2k12+4), r\xF3g +6"),
  T(/^Quentin/, 15, 9, "rapier +3 (1k8+1)"),
  T(/^Emrys|lew\)/i, 12, 26, "ugryz. +5 (1k8+3)"),
  T(/^Pawian/, 12, 3, "ugryz. +1 (1k4\u22121)"),
  T(/^Kolczasty diabeł/, 13, 22, "kolce +4 (1k4+2+1k6 ogie\u0144)"),
  T(/^Verity/, 12, 27, "2\xD7 miecz +4 (1k6+2)"),
  T(/^(Przewoźnik|Recepcja|Pracownik|Kasjer|Barman|Akrobata|Obsługa)/, 10, 4, "pa\u0142ka +2 (1k4)"),
  T(/^(Whipp|Wumpus|Rythil|Ruthie|Nightshade|Lysa|Lowell|Lorna|Lahdia|Karn|Karlton|Jetta|Georgie|Anaïs)/, 11, 9, "bez broni"),
  // ---------- Reach for the Stars ----------
  T(/^Mimik/, 12, 58, "ugryz. +5 (1k8+3+1k8 kwas)"),
  T(/^Pełzająca dłoń/, 12, 2, "pazur +3 (1k4+1)"),
  T(/^Kijanka/, 12, 10, "ugryz. +4 (1k4+2)"),
  T(/^Ożywiona zbroja/, 18, 33, "2\xD7 uderz. +4 (1k6+2)"),
  T(/^Dywan/, 12, 33, "duszenie +5 (2k6+3)"),
  T(/^Latający miecz/, 17, 17, "miecz +3 (1k8+1)"),
  T(/^Zala/, 15, 45, "2\xD7 pazury +4 (1k6+3)"),
  T(/^Bełkoczący/, 9, 67, "ugryz. +2 (5k6)"),
  T(/^Xander/, 13, 33, "2\xD7 sztylet +4 (1k4+2)"),
  T(/^(Kura|Kultysta)/, 12, 9, "sejmitar +3 (1k6+1)"),
  T(/^Szary szlam|szlam/i, 8, 22, "nibyn\xF3\u017Cka +3 (1k6+1+2k6 kwas)"),
  T(/^Stirge/, 14, 2, "wysys. +5 (1k4+3)"),
  T(/^Esquire/, 15, 75, "2\xD7 hak +6 (2k6+4)"),
  T(/^Farenhel/, 11, 45, "dotyk +5 (4k6+3)"),
  T(/^Ghul/, 12, 22, "pazury +4 (2k4+2, parali\u017C ST10)"),
  T(/^Markos/, 12, 55, "2\xD7 ostrze +4 (1k6+2+1k6 trucizna)"),
  T(/^Fragment Krokulmara/, 13, 10, "regeneracja 10 PW"),
  T(/^Bezgłowe ciało/, 18, 52, "2\xD7 miecz +5 (2k6+3)"),
  // ---------- Prisoner 13 ----------
  T(/^Więzień 13$/, 17, 102, "2\xD7 cios +6 (2k8+3)"),
  T(/^Yula/, 17, 58, "jak weteran: 2\xD7 miecz +5"),
  T(/^Strażnik/, 17, 58, "2\xD7 miecz +5 (1k8+3)"),
  T(/^Naczelniczka|Marthannis/, 12, 40, "KP 15 z mage armor; czary ST 14"),
  T(/^Spektator/, 14, 39, "2 promienie ST 13"),
  T(/^(Kucharz|Szef kuchni|Radn)/, 10, 4, "pa\u0142ka +2 (1k4)")
];
function matchStats(name) {
  for (const s of STATS) if (s.re.test(name)) return s.ac == null ? null : { ac: s.ac, hp: s.hp, max: s.hp, atk: s.atk };
  return null;
}

export {
  matchStats
};
