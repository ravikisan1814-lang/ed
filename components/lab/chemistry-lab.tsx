"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { MeaningPanel, CollapsibleControls, LabCard, ResultBadge } from "./ui";

const CATEGORY_COLORS: Record<string, number> = {
  nonmetal: 0x22c55e, nobleGas: 0xa855f7, alkaliMetal: 0xef4444, alkalineEarth: 0xf97316,
  metalloid: 0xeab308, halogen: 0x14b8a6, metal: 0x3b82f6, transitionMetal: 0x6366f1,
  lanthanide: 0xec4899, actinide: 0xf43f5e,
};
const CATEGORY_LABELS: Record<string, string> = {
  nonmetal: "Nonmetal", nobleGas: "Noble Gas", alkaliMetal: "Alkali Metal", alkalineEarth: "Alkaline Earth",
  metalloid: "Metalloid", halogen: "Halogen", metal: "Metal", transitionMetal: "Transition Metal",
  lanthanide: "Lanthanide", actinide: "Actinide",
};

const ALL_ELEMENTS = [
  { number:1,symbol:"H",name:"Hydrogen",mass:1.008,category:"nonmetal",electronConfig:"1s1",phase:"gas",row:1,col:1,valency:1 },
  { number:2,symbol:"He",name:"Helium",mass:4.003,category:"nobleGas",electronConfig:"1s2",phase:"gas",row:1,col:18,valency:0 },
  { number:3,symbol:"Li",name:"Lithium",mass:6.941,category:"alkaliMetal",electronConfig:"[He] 2s1",phase:"solid",row:2,col:1,valency:1 },
  { number:4,symbol:"Be",name:"Beryllium",mass:9.012,category:"alkalineEarth",electronConfig:"[He] 2s2",phase:"solid",row:2,col:2,valency:2 },
  { number:5,symbol:"B",name:"Boron",mass:10.81,category:"metalloid",electronConfig:"[He] 2s2 2p1",phase:"solid",row:2,col:13,valency:3 },
  { number:6,symbol:"C",name:"Carbon",mass:12.011,category:"nonmetal",electronConfig:"[He] 2s2 2p2",phase:"solid",row:2,col:14,valency:4 },
  { number:7,symbol:"N",name:"Nitrogen",mass:14.007,category:"nonmetal",electronConfig:"[He] 2s2 2p3",phase:"gas",row:2,col:15,valency:3 },
  { number:8,symbol:"O",name:"Oxygen",mass:15.999,category:"nonmetal",electronConfig:"[He] 2s2 2p4",phase:"gas",row:2,col:16,valency:2 },
  { number:9,symbol:"F",name:"Fluorine",mass:18.998,category:"halogen",electronConfig:"[He] 2s2 2p5",phase:"gas",row:2,col:17,valency:1 },
  { number:10,symbol:"Ne",name:"Neon",mass:20.180,category:"nobleGas",electronConfig:"[He] 2s2 2p6",phase:"gas",row:2,col:18,valency:0 },
  { number:11,symbol:"Na",name:"Sodium",mass:22.990,category:"alkaliMetal",electronConfig:"[Ne] 3s1",phase:"solid",row:3,col:1,valency:1 },
  { number:12,symbol:"Mg",name:"Magnesium",mass:24.305,category:"alkalineEarth",electronConfig:"[Ne] 3s2",phase:"solid",row:3,col:2,valency:2 },
  { number:13,symbol:"Al",name:"Aluminium",mass:26.982,category:"metal",electronConfig:"[Ne] 3s2 3p1",phase:"solid",row:3,col:13,valency:3 },
  { number:14,symbol:"Si",name:"Silicon",mass:28.086,category:"metalloid",electronConfig:"[Ne] 3s2 3p2",phase:"solid",row:3,col:14,valency:4 },
  { number:15,symbol:"P",name:"Phosphorus",mass:30.974,category:"nonmetal",electronConfig:"[Ne] 3s2 3p3",phase:"solid",row:3,col:15,valency:3 },
  { number:16,symbol:"S",name:"Sulfur",mass:32.06,category:"nonmetal",electronConfig:"[Ne] 3s2 3p4",phase:"solid",row:3,col:16,valency:2 },
  { number:17,symbol:"Cl",name:"Chlorine",mass:35.45,category:"halogen",electronConfig:"[Ne] 3s2 3p5",phase:"gas",row:3,col:17,valency:1 },
  { number:18,symbol:"Ar",name:"Argon",mass:39.948,category:"nobleGas",electronConfig:"[Ne] 3s2 3p6",phase:"gas",row:3,col:18,valency:0 },
  { number:19,symbol:"K",name:"Potassium",mass:39.098,category:"alkaliMetal",electronConfig:"[Ar] 4s1",phase:"solid",row:4,col:1,valency:1 },
  { number:20,symbol:"Ca",name:"Calcium",mass:40.078,category:"alkalineEarth",electronConfig:"[Ar] 4s2",phase:"solid",row:4,col:2,valency:2 },
  { number:21,symbol:"Sc",name:"Scandium",mass:44.956,category:"transitionMetal",electronConfig:"[Ar] 3d1 4s2",phase:"solid",row:4,col:3,valency:3 },
  { number:22,symbol:"Ti",name:"Titanium",mass:47.867,category:"transitionMetal",electronConfig:"[Ar] 3d2 4s2",phase:"solid",row:4,col:4,valency:4 },
  { number:23,symbol:"V",name:"Vanadium",mass:50.942,category:"transitionMetal",electronConfig:"[Ar] 3d3 4s2",phase:"solid",row:4,col:5,valency:5 },
  { number:24,symbol:"Cr",name:"Chromium",mass:51.996,category:"transitionMetal",electronConfig:"[Ar] 3d5 4s1",phase:"solid",row:4,col:6,valency:6 },
  { number:25,symbol:"Mn",name:"Manganese",mass:54.938,category:"transitionMetal",electronConfig:"[Ar] 3d5 4s2",phase:"solid",row:4,col:7,valency:7 },
  { number:26,symbol:"Fe",name:"Iron",mass:55.845,category:"transitionMetal",electronConfig:"[Ar] 3d6 4s2",phase:"solid",row:4,col:8,valency:3 },
  { number:27,symbol:"Co",name:"Cobalt",mass:58.933,category:"transitionMetal",electronConfig:"[Ar] 3d7 4s2",phase:"solid",row:4,col:9,valency:3 },
  { number:28,symbol:"Ni",name:"Nickel",mass:58.693,category:"transitionMetal",electronConfig:"[Ar] 3d8 4s2",phase:"solid",row:4,col:10,valency:2 },
  { number:29,symbol:"Cu",name:"Copper",mass:63.546,category:"transitionMetal",electronConfig:"[Ar] 3d10 4s1",phase:"solid",row:4,col:11,valency:2 },
  { number:30,symbol:"Zn",name:"Zinc",mass:65.38,category:"transitionMetal",electronConfig:"[Ar] 3d10 4s2",phase:"solid",row:4,col:12,valency:2 },
  { number:31,symbol:"Ga",name:"Gallium",mass:69.723,category:"metal",electronConfig:"[Ar] 3d10 4s2 4p1",phase:"solid",row:4,col:13,valency:3 },
  { number:32,symbol:"Ge",name:"Germanium",mass:72.64,category:"metalloid",electronConfig:"[Ar] 3d10 4s2 4p2",phase:"solid",row:4,col:14,valency:4 },
  { number:33,symbol:"As",name:"Arsenic",mass:74.922,category:"metalloid",electronConfig:"[Ar] 3d10 4s2 4p3",phase:"solid",row:4,col:15,valency:3 },
  { number:34,symbol:"Se",name:"Selenium",mass:78.96,category:"nonmetal",electronConfig:"[Ar] 3d10 4s2 4p4",phase:"solid",row:4,col:16,valency:2 },
  { number:35,symbol:"Br",name:"Bromine",mass:79.904,category:"halogen",electronConfig:"[Ar] 3d10 4s2 4p5",phase:"liquid",row:4,col:17,valency:1 },
  { number:36,symbol:"Kr",name:"Krypton",mass:83.798,category:"nobleGas",electronConfig:"[Ar] 3d10 4s2 4p6",phase:"gas",row:4,col:18,valency:0 },
  { number:37,symbol:"Rb",name:"Rubidium",mass:85.468,category:"alkaliMetal",electronConfig:"[Kr] 5s1",phase:"solid",row:5,col:1,valency:1 },
  { number:38,symbol:"Sr",name:"Strontium",mass:87.62,category:"alkalineEarth",electronConfig:"[Kr] 5s2",phase:"solid",row:5,col:2,valency:2 },
  { number:39,symbol:"Y",name:"Yttrium",mass:88.906,category:"transitionMetal",electronConfig:"[Kr] 4d1 5s2",phase:"solid",row:5,col:3,valency:3 },
  { number:40,symbol:"Zr",name:"Zirconium",mass:91.224,category:"transitionMetal",electronConfig:"[Kr] 4d2 5s2",phase:"solid",row:5,col:4,valency:4 },
  { number:41,symbol:"Nb",name:"Niobium",mass:92.906,category:"transitionMetal",electronConfig:"[Kr] 4d4 5s1",phase:"solid",row:5,col:5,valency:5 },
  { number:42,symbol:"Mo",name:"Molybdenum",mass:95.96,category:"transitionMetal",electronConfig:"[Kr] 4d5 5s1",phase:"solid",row:5,col:6,valency:6 },
  { number:43,symbol:"Tc",name:"Technetium",mass:98,category:"transitionMetal",electronConfig:"[Kr] 4d5 5s2",phase:"solid",row:5,col:7,valency:7 },
  { number:44,symbol:"Ru",name:"Ruthenium",mass:101.07,category:"transitionMetal",electronConfig:"[Kr] 4d7 5s1",phase:"solid",row:5,col:8,valency:4 },
  { number:45,symbol:"Rh",name:"Rhodium",mass:102.91,category:"transitionMetal",electronConfig:"[Kr] 4d8 5s1",phase:"solid",row:5,col:9,valency:4 },
  { number:46,symbol:"Pd",name:"Palladium",mass:106.42,category:"transitionMetal",electronConfig:"[Kr] 4d10",phase:"solid",row:5,col:10,valency:4 },
  { number:47,symbol:"Ag",name:"Silver",mass:107.87,category:"transitionMetal",electronConfig:"[Kr] 4d10 5s1",phase:"solid",row:5,col:11,valency:1 },
  { number:48,symbol:"Cd",name:"Cadmium",mass:112.41,category:"transitionMetal",electronConfig:"[Kr] 4d10 5s2",phase:"solid",row:5,col:12,valency:2 },
  { number:49,symbol:"In",name:"Indium",mass:114.82,category:"metal",electronConfig:"[Kr] 4d10 5s2 5p1",phase:"solid",row:5,col:13,valency:3 },
  { number:50,symbol:"Sn",name:"Tin",mass:118.71,category:"metal",electronConfig:"[Kr] 4d10 5s2 5p2",phase:"solid",row:5,col:14,valency:4 },
  { number:51,symbol:"Sb",name:"Antimony",mass:121.76,category:"metalloid",electronConfig:"[Kr] 4d10 5s2 5p3",phase:"solid",row:5,col:15,valency:3 },
  { number:52,symbol:"Te",name:"Tellurium",mass:127.60,category:"metalloid",electronConfig:"[Kr] 4d10 5s2 5p4",phase:"solid",row:5,col:16,valency:2 },
  { number:53,symbol:"I",name:"Iodine",mass:126.90,category:"halogen",electronConfig:"[Kr] 4d10 5s2 5p5",phase:"solid",row:5,col:17,valency:1 },
  { number:54,symbol:"Xe",name:"Xenon",mass:131.29,category:"nobleGas",electronConfig:"[Kr] 4d10 5s2 5p6",phase:"gas",row:5,col:18,valency:0 },
  { number:55,symbol:"Cs",name:"Caesium",mass:132.91,category:"alkaliMetal",electronConfig:"[Xe] 6s1",phase:"solid",row:6,col:1,valency:1 },
  { number:56,symbol:"Ba",name:"Barium",mass:137.33,category:"alkalineEarth",electronConfig:"[Xe] 6s2",phase:"solid",row:6,col:2,valency:2 },
  { number:57,symbol:"La",name:"Lanthanum",mass:138.91,category:"lanthanide",electronConfig:"[Xe] 5d1 6s2",phase:"solid",row:9,col:4,valency:3 },
  { number:58,symbol:"Ce",name:"Cerium",mass:140.12,category:"lanthanide",electronConfig:"[Xe] 4f1 5d1 6s2",phase:"solid",row:9,col:5,valency:4 },
  { number:59,symbol:"Pr",name:"Praseodymium",mass:140.91,category:"lanthanide",electronConfig:"[Xe] 4f3 6s2",phase:"solid",row:9,col:6,valency:3 },
  { number:60,symbol:"Nd",name:"Neodymium",mass:144.24,category:"lanthanide",electronConfig:"[Xe] 4f4 6s2",phase:"solid",row:9,col:7,valency:3 },
  { number:61,symbol:"Pm",name:"Promethium",mass:145,category:"lanthanide",electronConfig:"[Xe] 4f5 6s2",phase:"solid",row:9,col:8,valency:3 },
  { number:62,symbol:"Sm",name:"Samarium",mass:150.36,category:"lanthanide",electronConfig:"[Xe] 4f6 6s2",phase:"solid",row:9,col:9,valency:3 },
  { number:63,symbol:"Eu",name:"Europium",mass:151.96,category:"lanthanide",electronConfig:"[Xe] 4f7 6s2",phase:"solid",row:9,col:10,valency:3 },
  { number:64,symbol:"Gd",name:"Gadolinium",mass:157.25,category:"lanthanide",electronConfig:"[Xe] 4f7 5d1 6s2",phase:"solid",row:9,col:11,valency:3 },
  { number:65,symbol:"Tb",name:"Terbium",mass:158.93,category:"lanthanide",electronConfig:"[Xe] 4f9 6s2",phase:"solid",row:9,col:12,valency:3 },
  { number:66,symbol:"Dy",name:"Dysprosium",mass:162.50,category:"lanthanide",electronConfig:"[Xe] 4f10 6s2",phase:"solid",row:9,col:13,valency:3 },
  { number:67,symbol:"Ho",name:"Holmium",mass:164.93,category:"lanthanide",electronConfig:"[Xe] 4f11 6s2",phase:"solid",row:9,col:14,valency:3 },
  { number:68,symbol:"Er",name:"Erbium",mass:167.26,category:"lanthanide",electronConfig:"[Xe] 4f12 6s2",phase:"solid",row:9,col:15,valency:3 },
  { number:69,symbol:"Tm",name:"Thulium",mass:168.93,category:"lanthanide",electronConfig:"[Xe] 4f13 6s2",phase:"solid",row:9,col:16,valency:3 },
  { number:70,symbol:"Yb",name:"Ytterbium",mass:173.05,category:"lanthanide",electronConfig:"[Xe] 4f14 6s2",phase:"solid",row:9,col:17,valency:3 },
  { number:71,symbol:"Lu",name:"Lutetium",mass:174.97,category:"lanthanide",electronConfig:"[Xe] 4f14 5d1 6s2",phase:"solid",row:9,col:18,valency:3 },
  { number:72,symbol:"Hf",name:"Hafnium",mass:178.49,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d2 6s2",phase:"solid",row:6,col:4,valency:4 },
  { number:73,symbol:"Ta",name:"Tantalum",mass:180.95,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d3 6s2",phase:"solid",row:6,col:5,valency:5 },
  { number:74,symbol:"W",name:"Tungsten",mass:183.84,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d4 6s2",phase:"solid",row:6,col:6,valency:6 },
  { number:75,symbol:"Re",name:"Rhenium",mass:186.21,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d5 6s2",phase:"solid",row:6,col:7,valency:7 },
  { number:76,symbol:"Os",name:"Osmium",mass:190.23,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d6 6s2",phase:"solid",row:6,col:8,valency:4 },
  { number:77,symbol:"Ir",name:"Iridium",mass:192.22,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d7 6s2",phase:"solid",row:6,col:9,valency:4 },
  { number:78,symbol:"Pt",name:"Platinum",mass:195.08,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d9 6s1",phase:"solid",row:6,col:10,valency:4 },
  { number:79,symbol:"Au",name:"Gold",mass:196.97,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d10 6s1",phase:"solid",row:6,col:11,valency:3 },
  { number:80,symbol:"Hg",name:"Mercury",mass:200.59,category:"transitionMetal",electronConfig:"[Xe] 4f14 5d10 6s2",phase:"liquid",row:6,col:12,valency:2 },
  { number:81,symbol:"Tl",name:"Thallium",mass:204.38,category:"metal",electronConfig:"[Xe] 4f14 5d10 6s2 6p1",phase:"solid",row:6,col:13,valency:3 },
  { number:82,symbol:"Pb",name:"Lead",mass:207.2,category:"metal",electronConfig:"[Xe] 4f14 5d10 6s2 6p2",phase:"solid",row:6,col:14,valency:4 },
  { number:83,symbol:"Bi",name:"Bismuth",mass:208.98,category:"metal",electronConfig:"[Xe] 4f14 5d10 6s2 6p3",phase:"solid",row:6,col:15,valency:5 },
  { number:84,symbol:"Po",name:"Polonium",mass:209,category:"metal",electronConfig:"[Xe] 4f14 5d10 6s2 6p4",phase:"solid",row:6,col:16,valency:4 },
  { number:85,symbol:"At",name:"Astatine",mass:210,category:"halogen",electronConfig:"[Xe] 4f14 5d10 6s2 6p5",phase:"solid",row:6,col:17,valency:1 },
  { number:86,symbol:"Rn",name:"Radon",mass:222,category:"nobleGas",electronConfig:"[Xe] 4f14 5d10 6s2 6p6",phase:"gas",row:6,col:18,valency:0 },
  { number:87,symbol:"Fr",name:"Francium",mass:223,category:"alkaliMetal",electronConfig:"[Rn] 7s1",phase:"solid",row:7,col:1,valency:1 },
  { number:88,symbol:"Ra",name:"Radium",mass:226,category:"alkalineEarth",electronConfig:"[Rn] 7s2",phase:"solid",row:7,col:2,valency:2 },
  { number:89,symbol:"Ac",name:"Actinium",mass:227,category:"actinide",electronConfig:"[Rn] 6d1 7s2",phase:"solid",row:10,col:4,valency:3 },
  { number:90,symbol:"Th",name:"Thorium",mass:232.04,category:"actinide",electronConfig:"[Rn] 6d2 7s2",phase:"solid",row:10,col:5,valency:4 },
  { number:91,symbol:"Pa",name:"Protactinium",mass:231.04,category:"actinide",electronConfig:"[Rn] 5f2 6d1 7s2",phase:"solid",row:10,col:6,valency:5 },
  { number:92,symbol:"U",name:"Uranium",mass:238.03,category:"actinide",electronConfig:"[Rn] 5f3 6d1 7s2",phase:"solid",row:10,col:7,valency:6 },
  { number:93,symbol:"Np",name:"Neptunium",mass:237,category:"actinide",electronConfig:"[Rn] 5f4 6d1 7s2",phase:"solid",row:10,col:8,valency:5 },
  { number:94,symbol:"Pu",name:"Plutonium",mass:244,category:"actinide",electronConfig:"[Rn] 5f6 7s2",phase:"solid",row:10,col:9,valency:4 },
  { number:95,symbol:"Am",name:"Americium",mass:243,category:"actinide",electronConfig:"[Rn] 5f7 7s2",phase:"solid",row:10,col:10,valency:3 },
  { number:96,symbol:"Cm",name:"Curium",mass:247,category:"actinide",electronConfig:"[Rn] 5f7 6d1 7s2",phase:"solid",row:10,col:11,valency:3 },
  { number:97,symbol:"Bk",name:"Berkelium",mass:247,category:"actinide",electronConfig:"[Rn] 5f9 7s2",phase:"solid",row:10,col:12,valency:4 },
  { number:98,symbol:"Cf",name:"Californium",mass:251,category:"actinide",electronConfig:"[Rn] 5f10 7s2",phase:"solid",row:10,col:13,valency:3 },
  { number:99,symbol:"Es",name:"Einsteinium",mass:252,category:"actinide",electronConfig:"[Rn] 5f11 7s2",phase:"solid",row:10,col:14,valency:3 },
  { number:100,symbol:"Fm",name:"Fermium",mass:257,category:"actinide",electronConfig:"[Rn] 5f12 7s2",phase:"solid",row:10,col:15,valency:3 },
  { number:101,symbol:"Md",name:"Mendelevium",mass:258,category:"actinide",electronConfig:"[Rn] 5f13 7s2",phase:"solid",row:10,col:16,valency:3 },
  { number:102,symbol:"No",name:"Nobelium",mass:259,category:"actinide",electronConfig:"[Rn] 5f14 7s2",phase:"solid",row:10,col:17,valency:3 },
  { number:103,symbol:"Lr",name:"Lawrencium",mass:266,category:"actinide",electronConfig:"[Rn] 5f14 6d1 7s2",phase:"solid",row:10,col:18,valency:3 },
  { number:104,symbol:"Rf",name:"Rutherfordium",mass:267,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d2 7s2",phase:"solid",row:7,col:4,valency:4 },
  { number:105,symbol:"Db",name:"Dubnium",mass:268,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d3 7s2",phase:"solid",row:7,col:5,valency:5 },
  { number:106,symbol:"Sg",name:"Seaborgium",mass:269,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d4 7s2",phase:"solid",row:7,col:6,valency:6 },
  { number:107,symbol:"Bh",name:"Bohrium",mass:270,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d5 7s2",phase:"solid",row:7,col:7,valency:7 },
  { number:108,symbol:"Hs",name:"Hassium",mass:277,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d6 7s2",phase:"solid",row:7,col:8,valency:8 },
  { number:109,symbol:"Mt",name:"Meitnerium",mass:278,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d7 7s2",phase:"solid",row:7,col:9,valency:6 },
  { number:110,symbol:"Ds",name:"Darmstadtium",mass:281,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d8 7s2",phase:"solid",row:7,col:10,valency:6 },
  { number:111,symbol:"Rg",name:"Roentgenium",mass:282,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d9 7s2",phase:"solid",row:7,col:11,valency:5 },
  { number:112,symbol:"Cn",name:"Copernicium",mass:285,category:"transitionMetal",electronConfig:"[Rn] 5f14 6d10 7s2",phase:"solid",row:7,col:12,valency:2 },
  { number:113,symbol:"Nh",name:"Nihonium",mass:286,category:"metal",electronConfig:"[Rn] 5f14 6d10 7s2 7p1",phase:"solid",row:7,col:13,valency:3 },
  { number:114,symbol:"Fl",name:"Flerovium",mass:289,category:"metal",electronConfig:"[Rn] 5f14 6d10 7s2 7p2",phase:"solid",row:7,col:14,valency:4 },
  { number:115,symbol:"Mc",name:"Moscovium",mass:290,category:"metal",electronConfig:"[Rn] 5f14 6d10 7s2 7p3",phase:"solid",row:7,col:15,valency:5 },
  { number:116,symbol:"Lv",name:"Livermorium",mass:293,category:"metal",electronConfig:"[Rn] 5f14 6d10 7s2 7p4",phase:"solid",row:7,col:16,valency:4 },
  { number:117,symbol:"Ts",name:"Tennessine",mass:294,category:"halogen",electronConfig:"[Rn] 5f14 6d10 7s2 7p5",phase:"solid",row:7,col:17,valency:1 },
  { number:118,symbol:"Og",name:"Oganesson",mass:294,category:"nobleGas",electronConfig:"[Rn] 5f14 6d10 7s2 7p6",phase:"solid",row:7,col:18,valency:0 },
] as const;

const MOLECULES: Record<string, { name: string; displayName: string; atoms: Array<{ symbol: string; pos: [number, number, number]; color: number; radius: number }>; bonds: Array<{ from: [number, number, number]; to: [number, number, number]; type: string }> }> = {
  water: { name: "H2O", displayName: "Water",
    atoms: [{ symbol:"O", pos:[0,0,0], color:0xef4444, radius:0.4 }, { symbol:"H", pos:[0.76,0,0], color:0xffffff, radius:0.28 }, { symbol:"H", pos:[-0.76,0,0], color:0xffffff, radius:0.28 }],
    bonds: [{ from:[0,0,0], to:[0.76,0,0], type:"single" }, { from:[0,0,0], to:[-0.76,0,0], type:"single" }] },
  co2: { name: "CO2", displayName: "Carbon Dioxide",
    atoms: [{ symbol:"C", pos:[0,0,0], color:0x52525b, radius:0.38 }, { symbol:"O", pos:[1.16,0,0], color:0xef4444, radius:0.35 }, { symbol:"O", pos:[-1.16,0,0], color:0xef4444, radius:0.35 }],
    bonds: [{ from:[0,0,0], to:[1.16,0,0], type:"double" }, { from:[0,0,0], to:[-1.16,0,0], type:"double" }] },
  methane: { name: "CH4", displayName: "Methane",
    atoms: [{ symbol:"C", pos:[0,0,0], color:0x52525b, radius:0.38 }, { symbol:"H", pos:[0.63,0.63,0.63], color:0xffffff, radius:0.25 }, { symbol:"H", pos:[-0.63,-0.63,0.63], color:0xffffff, radius:0.25 }, { symbol:"H", pos:[0.63,-0.63,-0.63], color:0xffffff, radius:0.25 }, { symbol:"H", pos:[-0.63,0.63,-0.63], color:0xffffff, radius:0.25 }],
    bonds: [{ from:[0,0,0], to:[0.63,0.63,0.63], type:"single" }, { from:[0,0,0], to:[-0.63,-0.63,0.63], type:"single" }, { from:[0,0,0], to:[0.63,-0.63,-0.63], type:"single" }, { from:[0,0,0], to:[-0.63,0.63,-0.63], type:"single" }] },
};

function PeriodicTable3D({ onSelectElement, searchQuery, filterCategory, autoRotate }: { onSelectElement: (el: typeof ALL_ELEMENTS[0]) => void; searchQuery: string; filterCategory: string; autoRotate: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled || !mount || mount.clientWidth === 0) return;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
      camera.position.set(12, 10, 16);
      camera.lookAt(7, 2, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.5;
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      scene.add(new THREE.GridHelper(30, 30, 0x334155, 0x1e293b).translateY(-1.5));
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hoveredIdx = -1;

      function buildMeshes() {
        for (const obj of scene.children) { if ((obj as any)?.userData?.isElement) scene.remove(obj); }
        const boxGeo = new THREE.BoxGeometry(0.85, 1.1, 0.15);
        for (const el of ALL_ELEMENTS) {
          const color = CATEGORY_COLORS[el.category] ?? 0x6b7280;
          const mesh = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.5, emissive: color, emissiveIntensity: 0.05 }));
          const isLanth = el.row === 9, isAct = el.row === 10;
          mesh.position.set((el.col - 1) * 1.05, (isLanth || isAct ? -(isAct ? 2 : 1) : el.row - 1) * 1.25, 0);
          mesh.userData = { element: el, index: el.number, isElement: true };
          scene.add(mesh);
        }
      }
      buildMeshes();

      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      function onMouseMove(e: MouseEvent) {
        if (!mount) return;
        const rect = mount.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const meshes = scene.children.filter((c) => (c as any)?.userData?.isElement) as THREE.Mesh[];
        const intersects = raycaster.intersectObjects(meshes);
        if (hoveredIdx !== -1) {
          const prev = meshes.find((m) => m.userData.index === hoveredIdx);
          if (prev?.material instanceof THREE.MeshStandardMaterial) { prev.material.emissiveIntensity = 0.05; prev.scale.setScalar(1); }
        }
        if (intersects.length > 0) {
          const mesh = intersects[0].object as THREE.Mesh;
          if (mesh.material instanceof THREE.MeshStandardMaterial) { mesh.material.emissiveIntensity = 0.5; mesh.scale.setScalar(1.2); }
          hoveredIdx = mesh.userData.index;
        } else { hoveredIdx = -1; }
      }
      function onClick() {
        if (hoveredIdx === -1) return;
        const mesh = (scene.children.filter((c) => (c as any)?.userData?.isElement) as THREE.Mesh[]).find((m) => m.userData.index === hoveredIdx);
        if (mesh?.userData?.element) onSelectElement(mesh.userData.element as typeof ALL_ELEMENTS[0]);
      }
      mount.addEventListener("mousemove", onMouseMove);
      mount.addEventListener("click", onClick);

      const animate = () => { if (!cancelled) { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); } };
      animate();

      return () => {
        cancelled = true;
        observer.disconnect();
        controls.dispose();
        renderer.dispose();
        mount.removeEventListener("mousemove", onMouseMove);
        mount.removeEventListener("click", onClick);
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
        scene.traverse((obj: any) => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) { if (Array.isArray(obj.material)) for (const m of obj.material) m.dispose(); else obj.material.dispose(); } });
      };
    })();
    return () => { cancelled = true; };
  }, [autoRotate]);

  return <div ref={mountRef} className="w-full rounded-xl border border-border bg-card overflow-hidden" style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} />;
}

function MolecularModel3D({ moleculeKey }: { moleculeKey: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const mol = MOLECULES[moleculeKey];
      if (!mol) return;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);
      const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
      camera.position.set(4, 3, 5);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dl = new THREE.DirectionalLight(0xffffff, 1.4);
      dl.position.set(5, 8, 5);
      scene.add(dl);
      for (const atom of mol.atoms) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(atom.radius, 32, 24), new THREE.MeshStandardMaterial({ color: atom.color, metalness: 0.2, roughness: 0.4, emissive: atom.color, emissiveIntensity: 0.1 }));
        m.position.set(...atom.pos);
        scene.add(m);
      }
      for (const bond of mol.bonds) {
        const from = new THREE.Vector3(...bond.from);
        const to = new THREE.Vector3(...bond.to);
        const dir = to.clone().sub(from);
        const len = dir.length();
        const center = from.clone().add(to).multiplyScalar(0.5);
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, len, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.3, roughness: 0.6 }));
        mesh.position.copy(center);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        scene.add(mesh);
      }
      scene.add(new THREE.GridHelper(10, 20, 0x334155, 0x1e293b).translateY(-2));
      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      const animate = () => { if (!cancelled) { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); } };
      animate();
      return () => {
        cancelled = true;
        observer.disconnect();
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    })();
    return () => { cancelled = true; };
  }, [moleculeKey]);

  return <div ref={mountRef} className="w-full rounded-xl border border-border bg-card overflow-hidden" style={{ height: "clamp(300px, 50vh, 600px)", width: "100%" }} />;
}

function PeriodicTable2D({ onSelectElement, searchQuery, filterCategory }: { onSelectElement: (el: typeof ALL_ELEMENTS[number]) => void; searchQuery: string; filterCategory: string }) {
  const query = searchQuery.toLowerCase();
  const cat = filterCategory;
  const filtered = ALL_ELEMENTS.filter((el) => {
    const ms = !query || el.symbol.toLowerCase().includes(query) || el.name.toLowerCase().includes(query) || String(el.number).includes(query);
    const mc = !cat || el.category === cat;
    return ms && mc;
  });
  const rows = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 9, label: "Lanthanides" }, { num: 10, label: "Actinides" }];
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-1 min-w-max">
        {rows.map((row) => {
          const els = filtered.filter((el) => el.row === row.num);
          if (els.length === 0) return null;
          return (
            <div key={row.num} className="flex items-center gap-1">
              <span className="text-xs text-slate-500 w-20 text-right pr-2">{row.label ?? `Period ${row.num}`}</span>
              <div className="flex gap-1">
                {Array.from({ length: 18 }, (_, i) => i + 1).map((col) => {
                  const el = els.find((e) => e.col === col);
                  if (!el) return <div key={col} className="w-[52px] h-[58px]" />;
                  const color = CATEGORY_COLORS[el.category] ?? 0x6b7280;
                  return (
                    <button key={col} className="w-[52px] h-[58px] rounded-lg border hover:border-slate-500 transition-all duration-200 flex flex-col items-center justify-center gap-0.5 hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: `#${color.toString(16).padStart(6, "0")}20`, borderColor: `#${color.toString(16).padStart(6, "0")}60` }}
                      onClick={() => onSelectElement(el)}>
                      <span className="text-[10px] text-slate-400">{el.number}</span>
                      <span className="text-sm font-bold" style={{ color: `#${color.toString(16).padStart(6, "0")}` }}>{el.symbol}</span>
                      <span className="text-[9px] text-slate-300 truncate w-full px-1 text-center">{el.name}</span>
                      <span className="text-[8px] text-slate-500">{el.mass}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChemistryLab() {
  const [selectedElement, setSelectedElement] = useState<typeof ALL_ELEMENTS[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [selectedMolecule, setSelectedMolecule] = useState("water");

  const handleSelectElement = useCallback((el: typeof ALL_ELEMENTS[number]) => {
    setSelectedElement(el);
  }, []);

  const categories = [
    { key: "", label: "All" }, { key: "nonmetal", label: "Nonmetals" }, { key: "nobleGas", label: "Noble Gases" },
    { key: "alkaliMetal", label: "Alkali Metals" }, { key: "alkalineEarth", label: "Alkaline Earth" },
    { key: "metalloid", label: "Metalloids" }, { key: "halogen", label: "Halogens" },
    { key: "metal", label: "Metals" }, { key: "transitionMetal", label: "Transition Metals" },
    { key: "lanthanide", label: "Lanthanides" }, { key: "actinide", label: "Actinides" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Chemistry Lab</h2>
        <p className="text-sm text-muted-foreground">Interactive periodic table and molecular geometry visualizations.</p>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Search by name, symbol, or number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <button onClick={() => setAutoRotate(!autoRotate)}
          className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg border transition-all text-sm ${autoRotate ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "border-border text-muted-foreground hover:border-blue-500/30"}`}>
          Auto-Rotate {autoRotate ? "ON" : "OFF"}
        </button>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["3d", "2d"] as const).map((m) => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`flex-1 min-w-[80px] px-3 py-2 text-sm font-medium transition-all ${viewMode === m ? "bg-muted text-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <LabCard title="Periodic Table" subtitle="118 Elements">
        {viewMode === "3d" ? (
          <PeriodicTable3D onSelectElement={handleSelectElement} searchQuery={searchQuery} filterCategory={filterCategory} autoRotate={autoRotate} />
        ) : (
          <PeriodicTable2D onSelectElement={handleSelectElement} searchQuery={searchQuery} filterCategory={filterCategory} />
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.filter((c) => c.key).map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => setFilterCategory(filterCategory === cat.key ? "" : cat.key)}>
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: `#${CATEGORY_COLORS[cat.key]?.toString(16).padStart(6, "0") ?? "6b7280"}` }} />
              {cat.label}
            </div>
          ))}
        </div>
      </LabCard>

      {selectedElement && (
        <LabCard title={`${selectedElement.symbol} — ${selectedElement.name}`} subtitle={`#${selectedElement.number}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <ResultBadge label="Atomic Mass" value={String(selectedElement.mass)} />
            <ResultBadge label="Category" value={CATEGORY_LABELS[selectedElement.category] ?? selectedElement.category} />
            <ResultBadge label="Phase" value={selectedElement.phase} />
            <ResultBadge label="Valency" value={String(selectedElement.valency)} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Electron Config:</span> <code className="text-blue-400">{selectedElement.electronConfig}</code></p>
          <button type="button" onClick={() => setSelectedElement(null)} className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">Close</button>
        </LabCard>
      )}

      <LabCard title="3D Molecular Models" subtitle="Sphere-and-stick representation">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1"><MolecularModel3D moleculeKey={selectedMolecule} /></div>
          <div className="w-full sm:w-48 flex flex-col gap-3">
            <select value={selectedMolecule} onChange={(e) => setSelectedMolecule(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              {Object.entries(MOLECULES).map(([key, mol]) => <option key={key} value={key}>{mol.displayName} ({mol.name})</option>)}
            </select>
            <MeaningPanel title={MOLECULES[selectedMolecule]?.displayName ?? "Molecule"}
              meaning="Molecular geometry determines chemical reactivity. VSEPR theory predicts shape from electron pair repulsion."
              points={["H2O: bent (104.5 deg), polar", "CO2: linear (180 deg), nonpolar", "CH4: tetrahedral (109.5 deg), nonpolar"]} color="green" />
            <CollapsibleControls label="Atom Colors">
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="text-red-400">●</span> Oxygen (O)</p>
                <p><span className="text-gray-400">●</span> Carbon (C)</p>
                <p><span className="text-white">●</span> Hydrogen (H)</p>
              </div>
            </CollapsibleControls>
          </div>
        </div>
      </LabCard>
    </div>
  );
}
