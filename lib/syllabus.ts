/**
 * NEB Class 11 & 12 Syllabus Structure
 *
 * This file defines the canonical syllabus hierarchy used throughout the app:
 *   exam_group → subject → chapter → topic → content_tabs
 *
 * Each chapter contains topics. Each topic has multiple content types
 * (Note, Numerical, Mindmap, Formula, Journal) that are rendered as tabs.
 *
 * To add real content, insert documents into the `topics` + `content_items`
 * tables via the admin ingest endpoint or SQL directly.
 */

export interface SyllabusChapter {
  slug: string;
  name: string;
  topics?: SyllabusTopic[];
}

export interface SyllabusTopic {
  slug: string;
  name: string;
  description?: string;
}

export interface SyllabusSubject {
  slug: string;
  name: string;
  chapters: SyllabusChapter[];
}

export interface SyllabusGroup {
  slug: string;
  name: string;
  subjects: SyllabusSubject[];
}

export const SYLLABUS: SyllabusGroup[] = [
  // ─── Class 11 ───────────────────────────────────────────────────────────
  {
    slug: "class-11",
    name: "Class 11",
    subjects: [
      {
        slug: "physics",
        name: "Physics",
        chapters: [
          // CONTENT AREA: MECHANICS
          {
            slug: "physical-quantities",
            name: "Physical Quantities",
            topics: [
              { slug: "precision-significant-figures", name: "Precision and Significant Figures" },
              { slug: "dimensional-analysis", name: "Dimensions and Dimensional Analysis" },
            ],
          },
          {
            slug: "vectors",
            name: "Vectors",
            topics: [
              { slug: "triangle-parallelogram-polygon-laws", name: "Triangle, Parallelogram and Polygon Laws of Vectors" },
              { slug: "resolution-of-vectors", name: "Resolution of Vectors and Unit Vectors" },
              { slug: "scalar-vector-product", name: "Scalar and Vector Products" },
            ],
          },
          {
            slug: "kinematics",
            name: "Kinematics",
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
            topics: [
              { slug: "thermal-energy-concept", name: "Molecular Concept of Thermal Energy" },
              { slug: "zeroth-law", name: "Zeroth Law of Thermodynamics" },
              { slug: "mercury-thermometer", name: "Thermal Equilibrium and Mercury Thermometer" },
            ],
          },
          {
            slug: "thermal-expansion",
            name: "Thermal Expansion",
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
            topics: [
              { slug: "real-virtual-images", name: "Real and Virtual Images" },
              { slug: "mirror-formula", name: "Mirror Formula" },
            ],
          },
          {
            slug: "refraction-plane-surfaces",
            name: "Refraction at Plane Surfaces",
            topics: [
              { slug: "laws-refraction", name: "Laws of Refraction and Refractive Index" },
              { slug: "lateral-shift", name: "Lateral Shift" },
              { slug: "total-internal-reflection", name: "Total Internal Reflection" },
            ],
          },
          {
            slug: "refraction-prisms",
            name: "Refraction through Prisms",
            topics: [
              { slug: "minimum-deviation", name: "Minimum Deviation Condition" },
              { slug: "prism-refractive-index", name: "Relation between Angle of Prism and Refractive Index" },
              { slug: "small-angle-prism", name: "Deviation in Small-Angle Prism" },
            ],
          },
          {
            slug: "lenses",
            name: "Lenses",
            topics: [
              { slug: "spherical-lenses", name: "Spherical Lenses and Angular Magnification" },
              { slug: "lens-makers-formula", name: "Lens Maker's Formula" },
              { slug: "power-of-lens", name: "Power of a Lens" },
            ],
          },
          {
            slug: "dispersion",
            name: "Dispersion",
            topics: [
              { slug: "pure-spectrum", name: "Pure Spectrum and Dispersive Power" },
              { slug: "chromatic-spherical-aberration", name: "Chromatic and Spherical Aberration" },
              { slug: "achromatism", name: "Achromatism and Its Applications" },
            ],
          },
          {
            slug: "electric-charges",
            name: "Electric Charges",
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
            topics: [
              { slug: "field-point-charges", name: "Electric Field due to Point Charges" },
              { slug: "gauss-law", name: "Gauss's Law and Electric Flux" },
              { slug: "gauss-law-applications", name: "Application of Gauss's Law" },
            ],
          },
          {
            slug: "electric-potential",
            name: "Potential, Potential Difference and Potential Energy",
            topics: [
              { slug: "potential-difference", name: "Potential Difference and Potential due to a Point Charge" },
              { slug: "equipotential-surfaces", name: "Equipotential Lines and Surfaces" },
              { slug: "potential-gradient", name: "Potential Gradient" },
            ],
          },
          {
            slug: "capacitor",
            name: "Capacitor",
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
            topics: [
              { slug: "energy-bands", name: "Energy Bands in Solids" },
              { slug: "conductors-insulators-semiconductors", name: "Metals, Insulators and Semiconductors" },
              { slug: "intrinsic-extrinsic-semiconductors", name: "Intrinsic and Extrinsic Semiconductors" },
            ],
          },
          {
            slug: "modern-physics-trends",
            name: "Recent Trends in Physics",
            topics: [
              { slug: "particle-physics", name: "Particle Physics: Particles and Antiparticles" },
              { slug: "quarks-leptons", name: "Quarks (Baryons and Mesons) and Leptons" },
              { slug: "big-bang-hubble", name: "Big Bang and Hubble's Law" },
              { slug: "dark-matter-black-holes", name: "Dark Matter, Black Holes and Gravitational Waves" },
            ],
          },
        ],
      },
      {
        slug: "chemistry",
        name: "Chemistry",
        chapters: [
          // CONTENT AREA: GENERAL AND PHYSICAL CHEMISTRY
          {
            slug: "foundation-fundamentals",
            name: "Foundation and Fundamentals",
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
            topics: [
              { slug: "equilibrium-concepts", name: "Physical and Chemical Equilibrium" },
              { slug: "law-of-mass-action", name: "Law of Mass Action" },
              { slug: "equilibrium-constant", name: "Equilibrium Constant and Its Importance" },
              { slug: "kp-kc-relation", name: "Relationship between Kp and Kc" },
              { slug: "le-chateliers-principle", name: "Le Chatelier's Principle" },
            ],
          },
          // CONTENT AREA: INORGANIC CHEMISTRY
          {
            slug: "chemistry-nonmetals",
            name: "Chemistry of Non-Metals",
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
            topics: [
              { slug: "metallurgical-principles", name: "Metallurgical Principles" },
              { slug: "alkali-metals", name: "Alkali Metals and Sodium Compounds" },
              { slug: "alkaline-earth-metals", name: "Alkaline Earth Metals" },
            ],
          },
          {
            slug: "bio-inorganic-chemistry",
            name: "Bio-Inorganic Chemistry",
            topics: [
              { slug: "bio-inorganic-intro", name: "Introduction to Bio-Inorganic Chemistry" },
              { slug: "nutrients-metals", name: "Micro and Macro Nutrients" },
              { slug: "metal-ions-biological", name: "Importance of Metal Ions in Biological Systems" },
              { slug: "ion-pumps", name: "Ion Pumps" },
              { slug: "metal-toxicity", name: "Metal Toxicity" },
            ],
          },
          // CONTENT AREA: ORGANIC CHEMISTRY
          {
            slug: "organic-basic-concepts",
            name: "Basic Concepts of Organic Chemistry",
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
            topics: [
              { slug: "aromatic-intro", name: "Introduction to Aromatic Compounds" },
              { slug: "huckel-rule", name: "Hückel's Rule of Aromaticity" },
              { slug: "benzene-structure", name: "Kekulé Structure of Benzene" },
              { slug: "benzene-preparation", name: "Preparation of Benzene" },
              { slug: "benzene-properties", name: "Electrophilic Substitution in Benzene" },
            ],
          },
          // CONTENT AREA: APPLIED CHEMISTRY
          {
            slug: "applied-chemistry-fundamentals",
            name: "Fundamentals of Applied Chemistry",
            topics: [
              { slug: "chemical-industry", name: "Chemical Industry and Its Importance" },
              { slug: "production-stages", name: "Stages in Producing a New Product" },
              { slug: "continuous-batch-processing", name: "Continuous vs. Batch Processing" },
            ],
          },
          {
            slug: "modern-chemical-manufactures",
            name: "Modern Chemical Manufactures",
            topics: [
              { slug: "ammonia-haber", name: "Ammonia by Haber's Process" },
              { slug: "nitric-acid-ostwald", name: "Nitric Acid by Ostwald's Process" },
              { slug: "sulphuric-acid-contact", name: "Sulphuric Acid by Contact Process" },
              { slug: "sodium-hydroxide-diaphragm", name: "Sodium Hydroxide by Diaphragm Cell" },
              { slug: "sodium-carbonate-solvay", name: "Sodium Carbonate by Solvay Process" },
              { slug: "fertilizers", name: "Fertilizers and Production of Urea" },
            ],
          },
        ],
      },
      {
        slug: "mathematics",
        name: "Mathematics",
        chapters: [
          // Official NEB Class 11 Mathematics Syllabus
          {
            slug: "set-theory",
            name: "Set Theory",
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
            topics: [
              { slug: "angle-measurement-systems", name: "Systems of Angle Measurement" },
              { slug: "arc-length-sector-area", name: "Arc Length and Sector Area" },
              { slug: "conversion-deg-rad", name: "Conversion between Degree and Radian" },
            ],
          },
          {
            slug: "solution-triangles",
            name: "Solution of Triangles",
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
            topics: [
              { slug: "data-collection", name: "Data Collection and Presentation" },
              { slug: "measures-central-tendency", name: "Measures of Central Tendency" },
              { slug: "measures-dispersion", name: "Measures of Dispersion" },
              { slug: "probability-basics", name: "Introduction to Probability" },
            ],
          },
        ],
      },
      {
        slug: "biology",
        name: "Biology",
        chapters: [
          // PART A: BOTANY
          {
            slug: "biomolecules-cell-biology",
            name: "Biomolecules and Cell Biology",
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
            topics: [
              { slug: "monera-bacteria", name: "Monera: Bacterial Cell Structure and Nutrition" },
              { slug: "virus", name: "Virus: Structure and Importance" },
              { slug: "biotechnology-microbiology", name: "Biotechnology and Its Impact on Microbiology" },
            ],
          },
          {
            slug: "ecology",
            name: "Ecology",
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
            topics: [
              { slug: "vegetation-nepal", name: "Types of Vegetation in Nepal" },
              { slug: "in-situ-conservation", name: "In-situ Conservation: Protected Areas" },
              { slug: "ex-situ-conservation", name: "Ex-situ Conservation: Botanical Gardens and Seed Banks" },
            ],
          },
          // PART B: ZOOLOGY
          {
            slug: "intro-biology",
            name: "Introduction to Biology",
            topics: [
              { slug: "scope-fields-biology", name: "Scope and Fields of Biology" },
            ],
          },
          {
            slug: "evolutionary-biology",
            name: "Evolutionary Biology",
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
            topics: [
              { slug: "animal-adaptation", name: "Animal Adaptation: Aquatic, Terrestrial, Volant" },
              { slug: "animal-behavior", name: "Animal Behavior" },
              { slug: "environmental-pollution", name: "Environmental Pollution: Air, Water and Soil" },
            ],
          },
          {
            slug: "conservation-biology",
            name: "Conservation Biology",
            topics: [
              { slug: "biodiversity-concept", name: "Biodiversity Concept and Conservation" },
              { slug: "protected-areas-nepal", name: "Protected Areas and Wildlife Reserves in Nepal" },
              { slug: "iucn-categories", name: "IUCN Categories and Endangered Species in Nepal" },
            ],
          },
        ],
      },
      {
        slug: "english",
        name: "English",
        chapters: [
          { slug: "reading-comprehension", name: "Reading Comprehension" },
          { slug: "writing-skills", name: "Writing Skills" },
          { slug: "grammar", name: "Grammar" },
          { slug: "literature", name: "Literature" },
        ],
      },
      {
        slug: "nepali",
        name: "Nepali",
        chapters: [
          { slug: "vyakaran", name: "व्यञ्गण (Grammar)" },
          { slug: "lekha-kala", name: "लेखा कला (Writing)" },
          { slug: "bhumi-ka", name: "भूमिका (Introduction)" },
          { slug: "kadya", name: "कडिय (Essay)" },
        ],
      },
    ],
  },

  // ─── Class 12 ───────────────────────────────────────────────────────────
  {
    slug: "class-12",
    name: "Class 12",
    subjects: [
      {
        slug: "physics",
        name: "Physics",
        chapters: [
          { slug: "electrostatics", name: "Electrostatics" },
          { slug: "current-electricity", name: "Current Electricity" },
          { slug: "magnetism", name: "Magnetism" },
          { slug: "electromagnetic-induction", name: "Electromagnetic Induction" },
          { slug: "alternating-current", name: "Alternating Current" },
          { slug: "electromagnetic-waves", name: "Electromagnetic Waves" },
          { slug: "light", name: "Light" },
          { slug: "dual-nature", name: "Dual Nature of Radiation" },
          { slug: "atoms-nuclei", name: "Atoms and Nuclei" },
          { slug: "semiconductor", name: "Semiconductor Electronics" },
          { slug: "communication-system", name: "Communication System" },
        ],
      },
      {
        slug: "chemistry",
        name: "Chemistry",
        chapters: [
          { slug: "solid-state", name: "Solid State" },
          { slug: "solutions", name: "Solutions" },
          { slug: "electrochemistry", name: "Electrochemistry" },
          { slug: "chemical-kinetics", name: "Chemical Kinetics" },
          { slug: "surface-chemistry", name: "Surface Chemistry" },
          { slug: "general-meetals", name: "General Principles of Metals" },
          { slug: "p-block", name: "p-Block Elements" },
          { slug: "d-and-f-block", name: "d-and f-Block Elements" },
          { slug: "coordination-compounds", name: "Coordination Compounds" },
          { slug: "halogen", name: "Haloalkanes and Haloarenes" },
          { slug: "alcohol-phenol", name: "Alcohol, Phenol and Ether" },
          { slug: "aldehyde-ketone", name: "Aldehyde, Ketone and Carboxylic Acid" },
          { slug: "organic-nitrogen", name: "Organic Compounds Containing Nitrogen" },
        ],
      },
      {
        slug: "mathematics",
        name: "Mathematics",
        chapters: [
          { slug: "relations-functions", name: "Relations and Functions" },
          { slug: "inverse-trigonometric", name: "Inverse Trigonometric Functions" },
          { slug: "matrices", name: "Matrices" },
          { slug: "determinants", name: "Determinants" },
          { slug: "continuity", name: "Continuity and Differentiability" },
          { slug: "applications-derivative", name: "Applications of Derivatives" },
          { slug: "integration", name: "Integral Calculus" },
          { slug: "differential-equation", name: "Differential Equations" },
          { slug: "vectors", name: "Vectors" },
          { slug: "three-dimension", name: "Three Dimensional Geometry" },
          { slug: "linear-programming", name: "Linear Programming" },
          { slug: "probability", name: "Probability" },
        ],
      },
      {
        slug: "biology",
        name: "Biology",
        chapters: [
          { slug: "human-physiology", name: "Human Physiology" },
          { slug: "reproduction", name: "Reproduction" },
          { slug: "genetics-evolution", name: "Genetics and Evolution" },
          { slug: "biology-human-welfare", name: "Biology and Human Welfare" },
          { slug: "biotechnology", name: "Biotechnology" },
          { slug: "ecology", name: "Ecology" },
          { slug: "molecular-basis", name: "Molecular Basis of Inheritance" },
          { slug: "organism-population", name: "Organism and Population" },
          { slug: "environment", name: "Environment" },
          { slug: "cell-biology", name: "Cell Biology" },
          { slug: "plant-physiology", name: "Plant Physiology" },
        ],
      },
      {
        slug: "english",
        name: "English",
        chapters: [
          { slug: "reading-comprehension", name: "Reading Comprehension" },
          { slug: "writing-skills", name: "Writing Skills" },
          { slug: "grammar", name: "Grammar" },
          { slug: "literature", name: "Literature" },
        ],
      },
      {
        slug: "nepali",
        name: "Nepali",
        chapters: [
          { slug: "vyakaran", name: "व्यञ्गण (Grammar)" },
          { slug: "lekha-kala", name: "लेखा कला (Writing)" },
          { slug: "bhumi-ka", name: "भूमिका (Introduction)" },
          { slug: "kadya", name: "कडिय (Essay)" },
        ],
      },
    ],
  },

  // ─── Class 11E (Engineering) ────────────────────────────────────────────
  {
    slug: "class-11e",
    name: "Class 11E (Engineering)",
    subjects: [
      {
        slug: "engineering-physics",
        name: "Engineering Physics",
        chapters: [
          { slug: "units-measurements", name: "Units and Measurements" },
          { slug: "vectors", name: "Vectors" },
          { slug: "laws-motion", name: "Laws of Motion" },
          { slug: "work-power-energy", name: "Work, Power and Energy" },
        ],
      },
      {
        slug: "engineering-chemistry",
        name: "Engineering Chemistry",
        chapters: [
          { slug: "solutions", name: "Solutions" },
          { slug: "electrochemistry", name: "Electrochemistry" },
          { slug: "corrosion", name: "Corrosion" },
        ],
      },
      {
        slug: "engineering-mathematics",
        name: "Engineering Mathematics",
        chapters: [
          { slug: "matrices", name: "Matrices" },
          { slug: "determinants", name: "Determinants" },
          { slug: "calculus", name: "Calculus" },
        ],
      },
      {
        slug: "engineering-mechanics",
        name: "Engineering Mechanics",
        chapters: [
          { slug: "forces", name: "Forces" },
          { slug: "equilibrium", name: "Equilibrium" },
          { slug: "friction", name: "Friction" },
          { slug: "center-gravity", name: "Center of Gravity" },
        ],
      },
    ],
  },

  // ─── Class 12E (Engineering) ────────────────────────────────────────────
  {
    slug: "class-12e",
    name: "Class 12E (Engineering)",
    subjects: [
      {
        slug: "engineering-physics",
        name: "Engineering Physics",
        chapters: [
          { slug: "optics", name: "Optics" },
          { slug: "electronics", name: "Electronics" },
          { slug: "modern-physics", name: "Modern Physics" },
        ],
      },
      {
        slug: "engineering-chemistry",
        name: "Engineering Chemistry",
        chapters: [
          { slug: "polymers", name: "Polymers" },
          { slug: "fuels", name: "Fuels" },
        ],
      },
    ],
  },

  // ─── Class 11 More ──────────────────────────────────────────────────────
  {
    slug: "class-11-more",
    name: "Class 11 More",
    subjects: [
      {
        slug: "health-education",
        name: "Health Education",
        chapters: [
          { slug: "human-reproductive-health", name: "Human Reproductive Health" },
          { slug: "population-education", name: "Population Education" },
          { slug: "environmental-health", name: "Environmental Health" },
        ],
      },
      {
        slug: "computer-science",
        name: "Computer Science",
        chapters: [
          { slug: "fundamentals-computer", name: "Fundamentals of Computer" },
          { slug: "number-system", name: "Number System" },
          { slug: "logic-gates", name: "Logic Gates" },
          { slug: "programming-c", name: "Programming in C" },
        ],
      },
    ],
  },

  // ─── Class 12 More ──────────────────────────────────────────────────────
  {
    slug: "class-12-more",
    name: "Class 12 More",
    subjects: [
      {
        slug: "health-education",
        name: "Health Education",
        chapters: [
          { slug: "adolescent-health", name: "Adolescent Health" },
          { slug: "drug-abuse", name: "Drug Abuse and Addiction" },
          { slug: "community-health", name: "Community Health" },
        ],
      },
      {
        slug: "computer-science",
        name: "Computer Science",
        chapters: [
          { slug: "data-structure", name: "Data Structure" },
          { slug: "database-management", name: "Database Management" },
          { slug: "networking", name: "Networking" },
        ],
      },
    ],
  },

  // ─── Loksewa ────────────────────────────────────────────────────────────
  {
    slug: "loksewa",
    name: "Loksewa",
    subjects: [
      {
        slug: "general-knowledge",
        name: "General Knowledge",
        chapters: [
          { slug: "nepal-history", name: "Nepal History" },
          { slug: "geography", name: "Geography" },
          { slug: "economy", name: "Economy" },
          { slug: "politics", name: "Politics" },
          { slug: "science-technology", name: "Science and Technology" },
        ],
      },
      {
        slug: "aptitude",
        name: "Aptitude",
        chapters: [
          { slug: "numerical-ability", name: "Numerical Ability" },
          { slug: "logical-reasoning", name: "Logical Reasoning" },
          { slug: "verbal-ability", name: "Verbal Ability" },
        ],
      },
    ],
  },

  // ─── General Knowledge ──────────────────────────────────────────────────
  {
    slug: "general-knowledge",
    name: "General Knowledge",
    subjects: [
      {
        slug: "world-knowledge",
        name: "World Knowledge",
        chapters: [
          { slug: "current-affairs", name: "Current Affairs" },
          { slug: "international-organizations", name: "International Organizations" },
          { slug: "geography-world", name: "World Geography" },
          { slug: "history-world", name: "World History" },
        ],
      },
    ],
  },
];

/** Content types available as tabs under each topic */
export const CONTENT_TABS = [
  { id: "note", label: "Note" },
  { id: "numerical", label: "Numerical" },
  { id: "mindmap", label: "Mindmap" },
  { id: "formula", label: "Formula" },
  { id: "journal", label: "Journal" },
] as const;

/** Helper: flatten syllabus into a path-based lookup */
export function getSyllabusPath(groupSlug: string, subjectSlug: string, chapterSlug: string) {
  const group = SYLLABUS.find((g) => g.slug === groupSlug);
  if (!group) return null;
  const subject = group.subjects.find((s) => s.slug === subjectSlug);
  if (!subject) return null;
  const chapter = subject.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return null;
  return { group, subject, chapter };
}
