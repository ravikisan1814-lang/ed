/**
 * Migration script: seeds NEB Grade 11 syllabus structure for Physics, Chemistry,
 * Biology, and Mathematics with full chapter → sub-chapter → topic hierarchy.
 *
 * Usage:
 *   node scripts/migrate-syllabus.mjs
 *
 * Requires env vars (set in .env.local or shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const envPath = join(projectRoot, ".env.local");

function loadEnv() {
  const env = { ...process.env };
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(k in env) || !env[k]) env[k] = v;
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const OWNER_CONTACT = "ravikisan1814@gmail.com";

// ── Syllabus data — full hierarchy with topics ──────────────────────────────

const SYLLABUS = {
  physics: {
    name: "Physics",
    slug: "physics",
    description: "Mechanics, heat, waves, optics, electricity, magnetism and modern physics.",
    chapters: [
      {
        slug: "physical-quantities",
        name: "Physical Quantities",
        description: "Precision, significant figures, dimensions and dimensional analysis.",
        topics: [
          { slug: "precision-significant-figures", name: "Precision and Significant Figures" },
          { slug: "dimensional-analysis", name: "Dimensions and Dimensional Analysis" },
        ],
      },
      {
        slug: "vectors",
        name: "Vectors",
        description: "Triangle, parallelogram and polygon laws of vectors; resolution; scalar and vector products.",
        topics: [
          { slug: "triangle-parallelogram-polygon-laws", name: "Triangle, Parallelogram and Polygon Laws of Vectors" },
          { slug: "resolution-of-vectors", name: "Resolution of Vectors and Unit Vectors" },
          { slug: "scalar-vector-product", name: "Scalar and Vector Products" },
        ],
      },
      {
        slug: "kinematics",
        name: "Kinematics",
        description: "Instantaneous velocity/acceleration, relative velocity, equations of motion, projectile motion.",
        topics: [
          { slug: "instantaneous-velocity-acceleration", name: "Instantaneous Velocity and Acceleration" },
          { slug: "relative-velocity", name: "Relative Velocity" },
          { slug: "equations-of-motion", name: "Equations of Motion (Graphical Treatment)" },
          { slug: "free-fall", name: "Motion of a Freely Falling Body" },
          { slug: "projectile-motion", name: "Projectile Motion and Its Applications" },
        ],
      },
      {
        slug: "dynamics",
        name: "Dynamics",
        description: "Momentum, impulse, Newton's laws, torque, equilibrium, friction.",
        topics: [
          { slug: "linear-momentum-impulse", name: "Linear Momentum and Impulse" },
          { slug: "conservation-linear-momentum", name: "Conservation of Linear Momentum" },
          { slug: "newtons-laws-application", name: "Application of Newton's Laws" },
          { slug: "torque-equilibrium", name: "Moment, Torque and Equilibrium" },
          { slug: "solid-friction", name: "Solid Friction" },
        ],
      },
      {
        slug: "work-energy-power",
        name: "Work, Energy and Power",
        description: "Work, power, kinetic/potential energy, conservation of energy, collisions.",
        topics: [
          { slug: "work-constant-variable-force", name: "Work Done by Constant and Variable Force" },
          { slug: "power", name: "Power" },
          { slug: "work-energy-theorem", name: "Work-Energy Theorem" },
          { slug: "conservation-energy", name: "Conservation of Energy" },
          { slug: "conservative-nonconservative-forces", name: "Conservative and Non-conservative Forces" },
          { slug: "collisions", name: "Elastic and Inelastic Collisions" },
        ],
      },
      {
        slug: "circular-motion",
        name: "Circular Motion",
        description: "Angular quantities, centripetal acceleration/force, conical pendulum, banking.",
        topics: [
          { slug: "angular-displacement-velocity", name: "Angular Displacement, Velocity and Acceleration" },
          { slug: "angular-linear-relation", name: "Relation between Angular and Linear Quantities" },
          { slug: "centripetal-acceleration-force", name: "Centripetal Acceleration and Force" },
          { slug: "conical-pendulum", name: "Conical Pendulum" },
          { slug: "vertical-circle", name: "Motion in a Vertical Circle" },
          { slug: "banking-of-roads", name: "Applications of Banking" },
        ],
      },
      {
        slug: "gravitation",
        name: "Gravitation",
        description: "Newton's law, gravitational field/potential, satellite motion, GPS.",
        topics: [
          { slug: "newton-law-gravitation", name: "Newton's Law of Gravitation" },
          { slug: "gravitational-field-strength", name: "Gravitational Field Strength" },
          { slug: "gravitational-potential-energy", name: "Gravitational Potential and Potential Energy" },
          { slug: "variation-of-g", name: "Variation of 'g' with Altitude and Depth" },
          { slug: "centre-mass-gravity", name: "Centre of Mass and Centre of Gravity" },
          { slug: "satellite-motion", name: "Motion of a Satellite" },
          { slug: "escape-velocity", name: "Escape Velocity" },
          { slug: "geostationary-satellite", name: "Geostationary Satellite" },
          { slug: "gps", name: "GPS" },
        ],
      },
      {
        slug: "elasticity",
        name: "Elasticity",
        description: "Hooke's law, stress-strain, elastic moduli, Poisson's ratio.",
        topics: [
          { slug: "hookes-law", name: "Hooke's Law and Force Constant" },
          { slug: "stress-strain", name: "Stress and Strain" },
          { slug: "elastic-modulus", name: "Elastic Modulus: Young's, Bulk, Shear" },
          { slug: "poissons-ratio", name: "Poisson's Ratio" },
          { slug: "elastic-potential-energy", name: "Elastic Potential Energy" },
        ],
      },
      {
        slug: "heat-temperature",
        name: "Heat and Temperature",
        description: "Molecular concept of thermal energy, Zeroth law, mercury thermometer.",
        topics: [
          { slug: "thermal-energy-concept", name: "Molecular Concept of Thermal Energy" },
          { slug: "zeroth-law", name: "Zeroth Law of Thermodynamics" },
          { slug: "mercury-thermometer", name: "Thermal Equilibrium and Mercury Thermometer" },
        ],
      },
      {
        slug: "thermal-expansion",
        name: "Thermal Expansion",
        description: "Linear, cubical and superficial expansion; Dulong and Petit method.",
        topics: [
          { slug: "linear-expansion", name: "Linear Expansion" },
          { slug: "cubical-superficial-expansion", name: "Cubical and Superficial Expansion" },
          { slug: "liquid-expansion", name: "Liquid Expansion: Absolute and Apparent" },
          { slug: "dulong-petit", name: "Dulong and Petit Method" },
        ],
      },
      {
        slug: "quantity-heat",
        name: "Quantity of Heat",
        description: "Specific heat, latent heat, Newton's law of cooling, triple point.",
        topics: [
          { slug: "newtons-law-cooling", name: "Newton's Law of Cooling" },
          { slug: "specific-heat-capacity", name: "Specific Heat Capacity" },
          { slug: "change-of-phases", name: "Change of Phases and Latent Heat" },
          { slug: "latent-heat-fusion-vaporization", name: "Specific Latent Heat of Fusion and Vaporization" },
          { slug: "triple-point", name: "Triple Point" },
        ],
      },
      {
        slug: "rate-heat-flow",
        name: "Rate of Heat Flow",
        description: "Conduction, convection, radiation, Stefan-Boltzmann law.",
        topics: [
          { slug: "conduction", name: "Conduction and Thermal Conductivity" },
          { slug: "convection", name: "Convection" },
          { slug: "radiation", name: "Radiation and Ideal Radiator" },
          { slug: "black-body-radiation", name: "Black-body Radiation" },
          { slug: "stefan-boltzmann-law", name: "Stefan-Boltzmann Law" },
        ],
      },
      {
        slug: "ideal-gas",
        name: "Ideal Gas",
        description: "Ideal gas equation, kinetic-molecular model, Boltzmann constant, heat capacities.",
        topics: [
          { slug: "ideal-gas-equation", name: "Ideal Gas Equation" },
          { slug: "kinetic-molecular-model", name: "Kinetic-Molecular Model of an Ideal Gas" },
          { slug: "gas-pressure-derivation", name: "Derivation of Pressure Exerted by Gas" },
          { slug: "rms-speed-boltzmann", name: "Boltzmann Constant and RMS Speed" },
          { slug: "heat-capacities", name: "Heat Capacities of Gases and Solids" },
        ],
      },
      {
        slug: "reflection-curved-mirrors",
        name: "Reflection at Curved Mirrors",
        description: "Real and virtual images, mirror formula.",
        topics: [
          { slug: "real-virtual-images", name: "Real and Virtual Images" },
          { slug: "mirror-formula", name: "Mirror Formula" },
        ],
      },
      {
        slug: "refraction-plane-surfaces",
        name: "Refraction at Plane Surfaces",
        description: "Laws of refraction, refractive index, lateral shift, total internal reflection.",
        topics: [
          { slug: "laws-refraction", name: "Laws of Refraction and Refractive Index" },
          { slug: "lateral-shift", name: "Lateral Shift" },
          { slug: "total-internal-reflection", name: "Total Internal Reflection" },
        ],
      },
      {
        slug: "refraction-prisms",
        name: "Refraction through Prisms",
        description: "Minimum deviation, prism formula, small-angle prism.",
        topics: [
          { slug: "minimum-deviation", name: "Minimum Deviation Condition" },
          { slug: "prism-refractive-index", name: "Relation between Angle of Prism and Refractive Index" },
          { slug: "small-angle-prism", name: "Deviation in Small-Angle Prism" },
        ],
      },
      {
        slug: "lenses",
        name: "Lenses",
        description: "Spherical lenses, lens maker's formula, power of a lens.",
        topics: [
          { slug: "spherical-lenses", name: "Spherical Lenses and Angular Magnification" },
          { slug: "lens-makers-formula", name: "Lens Maker's Formula" },
          { slug: "power-of-lens", name: "Power of a Lens" },
        ],
      },
      {
        slug: "dispersion",
        name: "Dispersion",
        description: "Pure spectrum, dispersive power, chromatic and spherical aberration, achromatism.",
        topics: [
          { slug: "pure-spectrum", name: "Pure Spectrum and Dispersive Power" },
          { slug: "chromatic-spherical-aberration", name: "Chromatic and Spherical Aberration" },
          { slug: "achromatism", name: "Achromatism and Its Applications" },
        ],
      },
      {
        slug: "electric-charges",
        name: "Electric Charges",
        description: "Electric charges, charging by induction, Coulomb's law.",
        topics: [
          { slug: "electric-charges-basics", name: "Electric Charges" },
          { slug: "charging-by-induction", name: "Charging by Induction" },
          { slug: "coulombs-law", name: "Coulomb's Law" },
          { slug: "multiple-charges-force", name: "Force between Multiple Electric Charges" },
        ],
      },
      {
        slug: "electric-field",
        name: "Electric Field",
        description: "Electric field due to point charges, Gauss's law and applications.",
        topics: [
          { slug: "field-point-charges", name: "Electric Field due to Point Charges" },
          { slug: "gauss-law", name: "Gauss's Law and Electric Flux" },
          { slug: "gauss-law-applications", name: "Application of Gauss's Law" },
        ],
      },
      {
        slug: "electric-potential",
        name: "Potential, Potential Difference and Potential Energy",
        description: "Potential difference, equipotential surfaces, potential gradient.",
        topics: [
          { slug: "potential-difference", name: "Potential Difference and Potential due to a Point Charge" },
          { slug: "equipotential-surfaces", name: "Equipotential Lines and Surfaces" },
          { slug: "potential-gradient", name: "Potential Gradient" },
        ],
      },
      {
        slug: "capacitor",
        name: "Capacitor",
        description: "Capacitance, parallel plate capacitor, combination, energy, dielectric effect.",
        topics: [
          { slug: "capacitance-basics", name: "Capacitance and Capacitor" },
          { slug: "parallel-plate-capacitor", name: "Parallel Plate Capacitor" },
          { slug: "capacitor-combination", name: "Combination of Capacitors" },
          { slug: "capacitor-energy", name: "Energy of a Charged Capacitor" },
          { slug: "dielectric-effect", name: "Effect of a Dielectric" },
        ],
      },
      {
        slug: "dc-circuits",
        name: "DC Circuits",
        description: "Electric current, drift velocity, Ohm's law, resistances, EMF, power.",
        topics: [
          { slug: "electric-current-drift", name: "Electric Current and Drift Velocity" },
          { slug: "ohms-law", name: "Ohm's Law and Resistance" },
          { slug: "resistance-series-parallel", name: "Resistances in Series and Parallel" },
          { slug: "potential-divider", name: "Potential Divider" },
          { slug: "emf-internal-resistance", name: "EMF of a Source and Internal Resistance" },
          { slug: "work-power-circuits", name: "Work and Power in Electrical Circuits" },
        ],
      },
      {
        slug: "nuclear-physics",
        name: "Nuclear Physics",
        description: "Nucleus, mass number, isotopes, mass defect, binding energy, fission and fusion.",
        topics: [
          { slug: "nucleus-discovery", name: "Discovery of Nucleus" },
          { slug: "nuclear-properties", name: "Nuclear Density, Mass Number, Atomic Number" },
          { slug: "mass-defect-binding-energy", name: "Mass Defect, Packing Fraction and BE per Nucleon" },
          { slug: "nuclear-fission-fusion", name: "Nuclear Fission and Fusion" },
        ],
      },
      {
        slug: "solids",
        name: "Solids",
        description: "Energy bands, conductors/insulators/semiconductors, intrinsic and extrinsic semiconductors.",
        topics: [
          { slug: "energy-bands", name: "Energy Bands in Solids" },
          { slug: "conductors-insulators-semiconductors", name: "Metals, Insulators and Semiconductors" },
          { slug: "intrinsic-extrinsic-semiconductors", name: "Intrinsic and Extrinsic Semiconductors" },
        ],
      },
      {
        slug: "modern-physics-trends",
        name: "Recent Trends in Physics",
        description: "Particle physics, quarks, leptons, Big Bang, dark matter, black holes, gravitational waves.",
        topics: [
          { slug: "particle-physics", name: "Particle Physics: Particles and Antiparticles" },
          { slug: "quarks-leptons", name: "Quarks (Baryons and Mesons) and Leptons" },
          { slug: "big-bang-hubble", name: "Big Bang and Hubble's Law" },
          { slug: "dark-matter-black-holes", name: "Dark Matter, Black Holes and Gravitational Waves" },
        ],
      },
    ],
  },
  chemistry: {
    name: "Chemistry",
    slug: "chemistry",
    description: "General, inorganic, organic and applied chemistry.",
    chapters: [
      {
        slug: "foundation-fundamentals",
        name: "Foundation and Fundamentals",
        description: "Introduction to chemistry, atoms, molecules, amu, radicals, percentage composition.",
        topics: [
          { slug: "intro-chemistry", name: "Introduction to Chemistry" },
          { slug: "importance-scope", name: "Importance and Scope of Chemistry" },
          { slug: "basic-concepts-atoms-molecules", name: "Atoms, Molecules and Basic Concepts" },
          { slug: "percentage-composition", name: "Percentage Composition from Molecular Formula" },
        ],
      },
      {
        slug: "stoichiometry",
        name: "Stoichiometry",
        description: "Dalton's atomic theory, laws of stoichiometry, mole concept, limiting reactant, yield.",
        topics: [
          { slug: "daltons-atomic-theory", name: "Dalton's Atomic Theory" },
          { slug: "laws-stoichiometry", name: "Laws of Stoichiometry" },
          { slug: "avogadros-law", name: "Avogadro's Law and Deductions" },
          { slug: "mole-concept", name: "Mole and Its Relations" },
          { slug: "limiting-reactant", name: "Limiting Reactant and Excess Reactant" },
          { slug: "yield-calculations", name: "Theoretical, Experimental and % Yield" },
          { slug: "empirical-molecular-formula", name: "Empirical and Molecular Formula Calculations" },
        ],
      },
      {
        slug: "atomic-structure",
        name: "Atomic Structure",
        description: "Rutherford and Bohr models, quantum numbers, orbitals, electronic configurations.",
        topics: [
          { slug: "rutherfords-model", name: "Rutherford's Atomic Model" },
          { slug: "bohrs-model", name: "Bohr's Atomic Model" },
          { slug: "hydrogen-spectrum", name: "Spectrum of Hydrogen Atom" },
          { slug: "quantum-model", name: "Quantum Mechanical Model" },
          { slug: "heisenberg-uncertainty", name: "Heisenberg's Uncertainty Principle" },
          { slug: "quantum-numbers", name: "Quantum Numbers" },
          { slug: "orbitals-shapes", name: "Orbitals and Shape of s and p Orbitals" },
          { slug: "electronic-configurations", name: "Aufbau, Pauli and Hund's Rules" },
        ],
      },
      {
        slug: "periodic-table",
        name: "Classification of Elements and Periodic Table",
        description: "Modern periodic law, IUPAC classification, periodic trends.",
        topics: [
          { slug: "modern-periodic-law", name: "Modern Periodic Law and Table" },
          { slug: "iupac-classification", name: "IUPAC Classification of Elements" },
          { slug: "effective-nuclear-charge", name: "Nuclear Charge and Effective Nuclear Charge" },
          { slug: "periodic-trends", name: "Periodic Trends: Radii, IE, EA, Electronegativity" },
        ],
      },
      {
        slug: "chemical-bonding",
        name: "Chemical Bonding and Shapes of Molecules",
        description: "Ionic, covalent, coordinate bonds; VSEPR theory; hybridization; hydrogen bonding.",
        topics: [
          { slug: "valence-shell-octet", name: "Valence Shell and Octet Theory" },
          { slug: "ionic-bond", name: "Ionic Bond and Its Properties" },
          { slug: "covalent-bond", name: "Covalent and Coordinate Covalent Bond" },
          { slug: "lewis-dot-structures", name: "Lewis Dot Structures" },
          { slug: "resonance", name: "Resonance" },
          { slug: "vsepr-theory", name: "VSEPR Theory and Molecular Shapes" },
          { slug: "valence-bond-theory", name: "Valence Bond Theory" },
          { slug: "hybridization", name: "Hybridization (s and p orbitals)" },
          { slug: "bond-characteristics", name: "Bond Length, Ionic Character, Dipole Moment" },
          { slug: "hydrogen-bonding", name: "Hydrogen Bonding and Its Application" },
        ],
      },
      {
        slug: "oxidation-reduction",
        name: "Oxidation and Reduction",
        description: "Redox concepts, oxidation number, balancing redox reactions, electrolysis.",
        topics: [
          { slug: "redox-concepts", name: "General and Electronic Concept of Redox" },
          { slug: "oxidation-number", name: "Oxidation Number and Rules" },
          { slug: "balancing-redox", name: "Balancing Redox Reactions" },
          { slug: "electrolysis", name: "Electrolysis: Qualitative and Quantitative Aspect" },
        ],
      },
      {
        slug: "states-of-matter",
        name: "States of Matter",
        description: "Gas laws, kinetic theory, liquid and solid states.",
        topics: [
          { slug: "kinetic-theory-gas", name: "Kinetic Theory of Gas" },
          { slug: "gas-laws", name: "Gas Laws (Boyle's, Charles', Avogadro's, Dalton's, Graham's)" },
          { slug: "ideal-gas-equation", name: "Ideal Gas Equation" },
          { slug: "real-gas-deviation", name: "Deviation of Real Gas from Ideality" },
          { slug: "liquid-state", name: "Liquid State: Properties and Liquid Crystals" },
          { slug: "solid-state", name: "Solid State: Types and Crystal Lattices" },
        ],
      },
      {
        slug: "chemical-equilibrium",
        name: "Chemical Equilibrium",
        description: "Dynamic equilibrium, law of mass action, Kp and Kc, Le Chatelier's principle.",
        topics: [
          { slug: "equilibrium-concepts", name: "Physical and Chemical Equilibrium" },
          { slug: "law-of-mass-action", name: "Law of Mass Action" },
          { slug: "equilibrium-constant", name: "Equilibrium Constant and Its Importance" },
          { slug: "kp-kc-relation", name: "Relationship between Kp and Kc" },
          { slug: "le-chateliers-principle", name: "Le Chatelier's Principle" },
        ],
      },
      {
        slug: "chemistry-nonmetals",
        name: "Chemistry of Non-Metals",
        description: "Hydrogen, oxygen, ozone, nitrogen, halogens, carbon, phosphorus, sulphur.",
        topics: [
          { slug: "hydrogen", name: "Hydrogen: Isotopes, Heavy Water and Uses" },
          { slug: "oxygen-allotropes", name: "Allotropes of Oxygen and Types of Oxides" },
          { slug: "ozone", name: "Ozone: Occurrence, Structure and Depletion" },
          { slug: "nitrogen-ammonia", name: "Nitrogen and Ammonia" },
          { slug: "halogens", name: "Halogens: Characteristics and Properties" },
          { slug: "carbon", name: "Carbon: Allotropes and Carbon Monoxide" },
          { slug: "phosphorus", name: "Phosphorus and Phosphine" },
          { slug: "sulphur", name: "Sulphur, Hydrogen Sulphide and Sulphuric Acid" },
        ],
      },
      {
        slug: "chemistry-metals",
        name: "Chemistry of Metals",
        description: "Metallurgical principles, alkali metals, alkaline earth metals.",
        topics: [
          { slug: "metallurgical-principles", name: "Metallurgical Principles" },
          { slug: "alkali-metals", name: "Alkali Metals and Sodium Compounds" },
          { slug: "alkaline-earth-metals", name: "Alkaline Earth Metals" },
        ],
      },
      {
        slug: "bio-inorganic-chemistry",
        name: "Bio-Inorganic Chemistry",
        description: "Metal ions in biological systems, ion pumps, metal toxicity.",
        topics: [
          { slug: "bio-inorganic-intro", name: "Introduction to Bio-Inorganic Chemistry" },
          { slug: "nutrients-metals", name: "Micro and Macro Nutrients" },
          { slug: "metal-ions-biological", name: "Importance of Metal Ions in Biological Systems" },
          { slug: "ion-pumps", name: "Ion Pumps" },
          { slug: "metal-toxicity", name: "Metal Toxicity" },
        ],
      },
      {
        slug: "organic-basic-concepts",
        name: "Basic Concepts of Organic Chemistry",
        description: "Tetra-covalency, catenation, classification, IUPAC nomenclature, cracking.",
        topics: [
          { slug: "intro-organic", name: "Introduction to Organic Chemistry" },
          { slug: "tetra-covalency-catenation", name: "Tetra-covalency and Catenation of Carbon" },
          { slug: "classification-organic", name: "Classification of Organic Compounds" },
          { slug: "functional-groups-homologous", name: "Functional Groups and Homologous Series" },
          { slug: "structural-formulas", name: "Structural, Contracted and Bond-line Structures" },
          { slug: "cracking-reforming", name: "Cracking and Reforming; Octane and Cetane Numbers" },
        ],
      },
      {
        slug: "organic-fundamental-principles",
        name: "Fundamental Principles of Organic Chemistry",
        description: "Isomerism, reaction mechanisms, inductive and resonance effects.",
        topics: [
          { slug: "iupac-nomenclature", name: "IUPAC Nomenclature" },
          { slug: "qualitative-analysis", name: "Qualitative Analysis (Lassaigne's Test)" },
          { slug: "isomerism", name: "Isomerism: Definition and Classification" },
          { slug: "structural-isomerism", name: "Structural Isomerism" },
          { slug: "geometrical-optical-isomerism", name: "Geometrical and Optical Isomerism" },
          { slug: "reaction-mechanisms", name: "Reaction Mechanisms and Electronic Effects" },
        ],
      },
      {
        slug: "hydrocarbons",
        name: "Hydrocarbons",
        description: "Alkanes, alkenes, alkynes: preparation, properties and tests for unsaturation.",
        topics: [
          { slug: "alkanes", name: "Alkanes: Preparation and Properties" },
          { slug: "alkenes", name: "Alkenes: Preparation and Addition Reactions" },
          { slug: "alkynes", name: "Alkynes: Preparation and Properties" },
          { slug: "tests-unsaturation", name: "Tests for Unsaturation" },
          { slug: "kolbe-electrolysis", name: "Kolbe's Electrolysis" },
        ],
      },
      {
        slug: "aromatic-hydrocarbons",
        name: "Aromatic Hydrocarbons",
        description: "Benzene: Huckel's rule, Kekule structure, electrophilic substitution.",
        topics: [
          { slug: "aromatic-intro", name: "Introduction to Aromatic Compounds" },
          { slug: "huckel-rule", name: "Huckel's Rule of Aromaticity" },
          { slug: "benzene-structure", name: "Kekule Structure of Benzene" },
          { slug: "benzene-preparation", name: "Preparation of Benzene" },
          { slug: "benzene-properties", name: "Electrophilic Substitution in Benzene" },
        ],
      },
      {
        slug: "applied-chemistry",
        name: "Applied Chemistry",
        description: "Chemical industry, manufacturing processes (Haber, Ostwald, Contact, Solvay), fertilizers.",
        topics: [
          { slug: "chemical-industry", name: "Chemical Industry and Its Importance" },
          { slug: "ammonia-haber", name: "Ammonia by Haber's Process" },
          { slug: "nitric-acid-ostwald", name: "Nitric Acid by Ostwald's Process" },
          { slug: "sulphuric-acid-contact", name: "Sulphuric Acid by Contact Process" },
          { slug: "sodium-compounds", name: "Sodium Hydroxide and Sodium Carbonate" },
          { slug: "fertilizers", name: "Fertilizers and Production of Urea" },
        ],
      },
    ],
  },
  biology: {
    name: "Biology",
    slug: "biology",
    description: "Cell biology, floriculture diversity, microbiology, ecology, evolution and zoology.",
    chapters: [
      {
        slug: "biomolecules-cell-biology",
        name: "Biomolecules and Cell Biology",
        description: "Biomolecules, cell structure, prokaryotic vs eukaryotic cells, cell division.",
        topics: [
          { slug: "biomolecules-intro", name: "Biomolecules: Carbohydrates, Proteins, Lipids, Nucleic Acids" },
          { slug: "cell-introduction", name: "Introduction to the Cell" },
          { slug: "prokaryotic-eukaryotic", name: "Prokaryotic vs. Eukaryotic Cells" },
          { slug: "eukaryotic-cell-structure", name: "Eukaryotic Cell Structure" },
          { slug: "cell-division-cycle", name: "Cell Cycle and Cell Division" },
          { slug: "mitosis-meiosis", name: "Mitosis and Meiosis" },
        ],
      },
      {
        slug: "floral-diversity",
        name: "Floral Diversity",
        description: "Three domains, five kingdoms, fungi, lichen, algae, bryophytes, pteridophytes, gymnosperms, angiosperms.",
        topics: [
          { slug: "domains-kingdoms", name: "Three Domains and Five-Kingdom Classification" },
          { slug: "fungi", name: "Fungi: Characteristics and Reproduction" },
          { slug: "lichen", name: "Lichen: Characteristics and Economic Importance" },
          { slug: "algae", name: "Algae: Green, Brown and Red Algae" },
          { slug: "bryophyta", name: "Bryophyta: Liverworts, Hornworts and Mosses" },
          { slug: "pteridophyta", name: "Pteridophyta" },
          { slug: "gymnosperm", name: "Gymnosperm" },
          { slug: "angiosperm-morphology", name: "Angiosperm: Morphology and Taxonomy" },
          { slug: "angiosperm-families", name: "Family Studies: Brassicaceae, Fabaceae, Solanaceae, Liliaceae" },
        ],
      },
      {
        slug: "introductory-microbiology",
        name: "Introductory Microbiology",
        description: "Monera (bacteria, cyanobacteria), viruses, bacteriophage, biotechnology.",
        topics: [
          { slug: "monera-bacteria", name: "Monera: Bacterial Cell Structure and Nutrition" },
          { slug: "virus", name: "Virus: Structure and Importance" },
          { slug: "biotechnology-microbiology", name: "Biotechnology and Its Impact on Microbiology" },
        ],
      },
      {
        slug: "ecology",
        name: "Ecology",
        description: "Ecosystem ecology, food chains, ecological pyramids, biogeochemical cycles, adaptation, imbalances.",
        topics: [
          { slug: "ecosystem-ecology", name: "Ecosystem Ecology: Biotic/Abiotic Factors" },
          { slug: "food-chain-web", name: "Food Chain, Food Web and Trophic Levels" },
          { slug: "ecological-cycles", name: "Carbon and Nitrogen Cycles" },
          { slug: "ecological-adaptation", name: "Ecological Adaptation: Hydrophytes and Xerophytes" },
          { slug: "ecological-imbalances", name: "Ecological Imbalances: Climate Change, Ozone Depletion, Acid Rain" },
        ],
      },
      {
        slug: "vegetation",
        name: "Vegetation",
        description: "Vegetation types in Nepal, in-situ and ex-situ conservation.",
        topics: [
          { slug: "vegetation-nepal", name: "Types of Vegetation in Nepal" },
          { slug: "in-situ-conservation", name: "In-situ Conservation: Protected Areas" },
          { slug: "ex-situ-conservation", name: "Ex-situ Conservation: Botanical Gardens and Seed Banks" },
        ],
      },
      {
        slug: "intro-biology",
        name: "Introduction to Biology",
        description: "Scope and fields of biology; relationship with other sciences.",
        topics: [
          { slug: "scope-fields-biology", name: "Scope and Fields of Biology" },
        ],
      },
      {
        slug: "evolutionary-biology",
        name: "Evolutionary Biology",
        description: "Origin of life, evidence of evolution, theories of evolution, human evolution.",
        topics: [
          { slug: "origin-life", name: "Origin of Life: Oparin-Haldane Theory and Miller-Urey Experiment" },
          { slug: "evidence-evolution", name: "Evidence of Evolution" },
          { slug: "theories-evolution", name: "Theories of Evolution: Lamarckism, Darwinism, Neo-Darwinism" },
          { slug: "human-evolution", name: "Human Evolution" },
        ],
      },
      {
        slug: "faunal-diversity",
        name: "Faunal Diversity",
        description: "Protista, Animalia classification, earthworm and frog morphology and physiology.",
        topics: [
          { slug: "protista", name: "Protista: Protozoa — Paramecium and Plasmodium" },
          { slug: "animalia-classification", name: "Animalia: Classification up to Phylum" },
          { slug: "earthworm", name: "Earthworm (Pheretima): Structure and Systems" },
          { slug: "frog", name: "Frog (Rana tigrina): Structure and Systems" },
        ],
      },
      {
        slug: "biota-environment",
        name: "Biota and Environment",
        description: "Animal adaptation, behavior, environmental pollution.",
        topics: [
          { slug: "animal-adaptation", name: "Animal Adaptation: Aquatic, Terrestrial, Volant" },
          { slug: "animal-behavior", name: "Animal Behavior" },
          { slug: "environmental-pollution", name: "Environmental Pollution: Air, Water and Soil" },
        ],
      },
      {
        slug: "conservation-biology",
        name: "Conservation Biology",
        description: "Biodiversity, protected areas in Nepal, IUCN categories, endangered species.",
        topics: [
          { slug: "biodiversity-concept", name: "Biodiversity Concept and Conservation" },
          { slug: "protected-areas-nepal", name: "Protected Areas and Wildlife Reserves in Nepal" },
          { slug: "iucn-categories", name: "IUCN Categories and Endangered Species in Nepal" },
        ],
      },
    ],
  },
  mathematics: {
    name: "Mathematics",
    slug: "mathematics",
    description: "Set theory, complex numbers, matrices, trigonometry, calculus and statistics. (Official NEB Class 11 syllabus)",
    chapters: [
      {
        slug: "set-theory",
        name: "Set Theory",
        description: "Sets, subsets, Venn diagrams, operations on sets, cardinality.",
        topics: [
          { slug: "sets-and-its-types", name: "Sets and Its Types" },
          { slug: "subset-power-set", name: "Subset and Power Set" },
          { slug: "union-intersection-difference", name: "Union, Intersection and Difference of Sets" },
          { slug: "complement-law", name: "Complement and Laws of Sets" },
          { slug: "venn-diagram", name: "Venn Diagram and Its Applications" },
          { slug: "cardinality", name: "Cardinality of Sets" },
        ],
      },
      {
        slug: "complex-number",
        name: "Complex Number",
        description: "Complex numbers, Argand plane, polar form, cube roots of unity.",
        topics: [
          { slug: "intro-complex-number", name: "Introduction to Complex Numbers" },
          { slug: "algebraic-operations", name: "Algebraic Operations on Complex Numbers" },
          { slug: "argand-plane", name: "Argand Plane and Polar Form" },
          { slug: "cube-root-unit", name: "Cube Root of Unity" },
          { slug: "modulus-amplitude", name: "Modulus and Amplitude" },
        ],
      },
      {
        slug: "matrices",
        name: "Matrices",
        description: "Matrix types, operations, transpose, symmetric/skew-symmetric, elementary transformations, inverse.",
        topics: [
          { slug: "matrix-basics", name: "Matrix: Types and Operations" },
          { slug: "transpose-symmetric", name: "Transpose, Symmetric and Skew-Symmetric Matrices" },
          { slug: "elementary-transformations", name: "Elementary Transformations of Matrices" },
          { slug: "inverse-matrix", name: "Inverse of a Matrix" },
          { slug: "systems-linear-equations", name: "Solution of Systems of Linear Equations" },
        ],
      },
      {
        slug: "determinants",
        name: "Determinants",
        description: "Determinant of 2x2 and 3x3 matrices, properties, area of triangle, adjoint and inverse.",
        topics: [
          { slug: "determinant-basics", name: "Determinant of a Matrix" },
          { slug: "properties-determinants", name: "Properties of Determinants" },
          { slug: "area-triangle", name: "Area of a Triangle using Determinants" },
          { slug: "adjoint-inverse", name: "Adjoint and Inverse of a Matrix" },
        ],
      },
      {
        slug: "binomial-theorem",
        name: "Binomial Theorem",
        description: "Binomial theorem for positive integer index, general term, middle term, rational index.",
        topics: [
          { slug: "binomial-theorem-positive-integer", name: "Binomial Theorem for Positive Integer Index" },
          { slug: "general-term", name: "General Term and Middle Term" },
          { slug: "independent-term", name: "Independent Term in Expansion" },
          { slug: "binomial-theorem-rational", name: "Binomial Theorem for Rational Index" },
        ],
      },
      {
        slug: "sequence-series",
        name: "Sequence and Series",
        description: "Arithmetic and geometric progressions, relation between AP and GP, infinite GP sum.",
        topics: [
          { slug: "sequence-basics", name: "Sequence: Arithmetic and Geometric" },
          { slug: "arithmetic-progression", name: "Arithmetic Progression" },
          { slug: "geometric-progression", name: "Geometric Progression" },
          { slug: "relation-ap-gp", name: "Relation between A.P. and G.P." },
          { slug: "sum-infinite-gp", name: "Sum of Infinite Geometric Series" },
        ],
      },
      {
        slug: "trigonometry",
        name: "Trigonometry",
        description: "Trigonometric functions, identities, inverse trigonometric functions, general solutions.",
        topics: [
          { slug: "trig-functions-angles", name: "Trigonometric Functions of Angles" },
          { slug: "trig-identities", name: "Trigonometric Identities" },
          { slug: "inverse-trigonometric-functions", name: "Inverse Trigonometric Functions" },
          { slug: "general-solution-trig", name: "General Solution of Trigonometric Equations" },
          { slug: "composition-inverse-trig", name: "Composition of Inverse Trigonometric Functions" },
        ],
      },
      {
        slug: "measurement-angles",
        name: "Measurement of Angles",
        description: "Degree, radian and grade systems; arc length and sector area.",
        topics: [
          { slug: "angle-measurement-systems", name: "Systems of Angle Measurement" },
          { slug: "arc-length-sector-area", name: "Arc Length and Sector Area" },
          { slug: "conversion-deg-rad", name: "Conversion between Degree and Radian" },
        ],
      },
      {
        slug: "solution-triangles",
        name: "Solution of Triangles",
        description: "Sine rule, cosine rule, projection formula, Napier's tan rule, area of triangle.",
        topics: [
          { slug: "sine-rule", name: "Sine Rule" },
          { slug: "cosine-rule", name: "Cosine Rule" },
          { slug: "projection-formula", name: "Projection Formula" },
          { slug: "tan-rule", name: "Napier's Tan Rule" },
          { slug: "half-angle-formulas", name: "Half Angle Formulas" },
          { slug: "area-triangle", name: "Area of a Triangle" },
        ],
      },
      {
        slug: "logarithm",
        name: "Logarithm",
        description: "Definition, laws of logarithms, change of base, solving exponential and logarithmic equations.",
        topics: [
          { slug: "logarithm-basics", name: "Logarithm: Definition and Laws" },
          { slug: "change-base", name: "Change of Base" },
          { slug: "graph-logarithm", name: "Graph of Logarithmic Functions" },
          { slug: "exponential-logarithmic-equations", name: "Solving Exponential and Logarithmic Equations" },
        ],
      },
      {
        slug: "straight-line",
        name: "Straight Line",
        description: "Slope, various forms of line equations, angle between lines, distance from a point.",
        topics: [
          { slug: "slope-line", name: "Slope of a Line" },
          { slug: "equations-line", name: "Various Forms of Equations of a Line" },
          { slug: "angle-between-lines", name: "Angle between Two Lines" },
          { slug: "parallel-perpendicular", name: "Parallel and Perpendicular Lines" },
          { slug: "point-line-distance", name: "Distance of a Point from a Line" },
          { slug: "concurrent-lines", name: "Concurrent Lines" },
        ],
      },
      {
        slug: "conic-section",
        name: "Conic Section",
        description: "Parabola, ellipse, hyperbola and circle: standard equations and properties.",
        topics: [
          { slug: "parabola", name: "Parabola" },
          { slug: "ellipse", name: "Ellipse" },
          { slug: "hyperbola", name: "Hyperbola" },
          { slug: "circle", name: "Circle" },
        ],
      },
      {
        slug: "limits",
        name: "Limits",
        description: "Introduction to limits, laws of limits, standard limits, limits of trigonometric functions.",
        topics: [
          { slug: "intro-limits", name: "Introduction to Limits" },
          { slug: "limit-laws", name: "Laws of Limits" },
          { slug: "standard-limits", name: "Standard Limits" },
          { slug: "limits-trigonometric", name: "Limits of Trigonometric Functions" },
        ],
      },
      {
        slug: "differentiation",
        name: "Differentiation",
        description: "Derivatives of polynomials, trigonometric, exponential and logarithmic functions; chain rule; implicit differentiation.",
        topics: [
          { slug: "intro-differentiation", name: "Introduction to Differentiation" },
          { slug: "derivatives-polynomial", name: "Derivatives of Polynomials" },
          { slug: "derivatives-trigonometric", name: "Derivatives of Trigonometric Functions" },
          { slug: "chain-rule", name: "Chain Rule" },
          { slug: "implicit-differentiation", name: "Implicit Differentiation" },
          { slug: "logarithmic-differentiation", name: "Logarithmic Differentiation" },
          { slug: "derivatives-parametric", name: "Derivatives of Parametric Functions" },
        ],
      },
      {
        slug: "statistics",
        name: "Statistics",
        description: "Data presentation, measures of central tendency, dispersion, introduction to probability.",
        topics: [
          { slug: "data-collection", name: "Data Collection and Presentation" },
          { slug: "measures-central-tendency", name: "Measures of Central Tendency" },
          { slug: "measures-dispersion", name: "Measures of Dispersion" },
          { slug: "probability-basics", name: "Introduction to Probability" },
        ],
      },
    ],
  },
};

const EXAM_GROUP_SLUG = "class-11";

// ── Helpers ────────────────────────────────────────────────────────────────

async function upsertExamGroup(slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("exam_groups")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("exam_groups")
    .insert({ id: crypto.randomUUID(), slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertSubject(examGroupId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("subjects")
    .select("id")
    .eq("exam_group_id", examGroupId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("subjects")
    .insert({ id: crypto.randomUUID(), exam_group_id: examGroupId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertChapter(subjectId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("chapters")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("chapters")
    .insert({ id: crypto.randomUUID(), subject_id: subjectId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertSubChapter(chapterId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("sub_chapters")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("sub_chapters")
    .insert({ id: crypto.randomUUID(), chapter_id: chapterId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertTopic(subChapterId, slug, name, description, sortOrder) {
  const { data: existing } = await supabase
    .from("topics")
    .select("id")
    .eq("sub_chapter_id", subChapterId)
    .eq("slug", slug)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("topics")
    .insert({ id: crypto.randomUUID(), sub_chapter_id: subChapterId, slug, name, description, sort_order: sortOrder })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function upsertContentItem(topicId, title, accessLevel, ownerContact, publicTeaser) {
  const { data: existing } = await supabase
    .from("content_items")
    .select("id")
    .eq("topic_id", topicId)
    .eq("title", title)
    .single();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("content_items")
    .insert({
      id: crypto.randomUUID(),
      topic_id: topicId,
      title,
      access_level: accessLevel,
      owner_contact: ownerContact,
      public_teaser: publicTeaser,
      locked_payload: "",
      variants: [],
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding NEB Grade 11 syllabus (full hierarchy)...\n");

  // 1. Ensure exam group exists
  const egId = await upsertExamGroup(
    EXAM_GROUP_SLUG,
    "Class 11",
    "NEB Class 11 science stream — Physics, Chemistry, Biology, Mathematics syllabus (2076)",
    1,
  );
  console.log(`Exam group "${EXAM_GROUP_SLUG}" ready (id: ${egId})\n`);

  // 2. Seed each subject with full chapter → sub-chapter → topic hierarchy
  const stats = { subjects: 0, chapters: 0, subChapters: 0, topics: 0, contentItems: 0 };

  for (const [key, subjectData] of Object.entries(SYLLABUS)) {
    console.log(`── ${subjectData.name} ──`);

    const subId = await upsertSubject(
      egId,
      subjectData.slug,
      subjectData.name,
      subjectData.description,
      Object.keys(SYLLABUS).indexOf(key) + 1,
    );
    stats.subjects++;
    console.log(`  Subject "${subjectData.name}" ready`);

    let chapterIdx = 0;
    for (const chapter of subjectData.chapters) {
      chapterIdx++;
      const chId = await upsertChapter(
        subId,
        chapter.slug,
        chapter.name,
        chapter.description,
        chapterIdx,
      );
      stats.chapters++;

      // Create one sub-chapter per chapter (the content area)
      const scId = await upsertSubChapter(
        chId,
        `${chapter.slug}-content`,
        chapter.name,
        chapter.description,
        1,
      );
      stats.subChapters++;

      // Create topics under the sub-chapter
      let topicIdx = 0;
      for (const topic of chapter.topics) {
        topicIdx++;
        const topId = await upsertTopic(
          scId,
          topic.slug,
          topic.name,
          topic.name,
          topicIdx,
        );
        stats.topics++;

        // Create a placeholder content item for each topic
        const teaser = `<p>${topic.name} — Part of ${chapter.name} in ${subjectData.name}. Notes under development.</p>`;
        await upsertContentItem(topId, `${topic.name} — Notes`, 4, OWNER_CONTACT, teaser);
        stats.contentItems++;
      }

      console.log(`  Chapter "${chapter.name}" → ${chapter.topics.length} topics`);
    }

    console.log(`  ${subjectData.chapters.length} chapters seeded\n`);
  }

  console.log("✅ Done.\n");
  console.log(`  Subjects:       ${stats.subjects}`);
  console.log(`  Chapters:       ${stats.chapters}`);
  console.log(`  Sub-chapters:   ${stats.subChapters}`);
  console.log(`  Topics:         ${stats.topics}`);
  console.log(`  Content items:  ${stats.contentItems}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
