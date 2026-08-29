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
          { slug: "physical-quantity", name: "Physical Quantity" },
          { slug: "kinematics", name: "Kinematics" },
          { slug: "laws-of-motion", name: "Laws of Motion" },
          { slug: "gravity", name: "Gravity" },
          { slug: "circular-motion", name: "Circular Motion" },
          { slug: "work-energy", name: "Work, Energy and Power" },
          { slug: "properties-of-matter", name: "Properties of Matter" },
          { slug: "thermodynamics", name: "Thermodynamics" },
          { slug: "thermometry", name: "Thermometry and Kinetic Theory" },
          { slug: "oscillation", name: "Oscillation" },
          { slug: "wave", name: "Wave" },
        ],
      },
      {
        slug: "chemistry",
        name: "Chemistry",
        chapters: [
          { slug: "basic-concepts", name: "Basic Concepts in Chemistry" },
          { slug: "atomic-structure", name: "Atomic Structure" },
          { slug: "chemical-bonding", name: "Chemical Bonding" },
          { slug: "gas-laws", name: "Gas Laws" },
          { slug: "solution", name: "Solution" },
          { slug: "thermochemistry", name: "Thermochemistry" },
          { slug: "chemical-equilibrium", name: "Chemical Equilibrium" },
          { slug: "acid-base", name: "Acid, Base and Salt" },
          { slug: "electrochemistry", name: "Electrochemistry" },
          { slug: "hydrogen", name: "Hydrogen" },
          { slug: "s-block", name: "s-Block Elements" },
          { slug: "organic-chemistry", name: "Organic Chemistry" },
          { slug: "environmental-chemistry", name: "Environmental Chemistry" },
        ],
      },
      {
        slug: "mathematics",
        name: "Mathematics",
        chapters: [
          { slug: "set-theory", name: "Set Theory" },
          { slug: "complex-number", name: "Complex Number" },
          { slug: "matrices", name: "Matrices" },
          { slug: "binomial-theorem", name: "Binomial Theorem" },
          { slug: "sequence-series", name: "Sequence and Series" },
          { slug: "trigonometry", name: "Trigonometry" },
          { slug: "measurement-of-angles", name: "Measurement of Angles" },
          { slug: "solution-of-triangles", name: "Solution of Triangles" },
          { slug: "logarithm", name: "Logarithm" },
          { slug: "straight-line", name: "Straight Line" },
          { slug: "conic-section", name: "Conic Section" },
          { slug: "limits", name: "Limits" },
          { slug: "differentiation", name: "Differentiation" },
          { slug: "geometry", name: "Geometry" },
          { slug: "statistics", name: "Statistics" },
        ],
      },
      {
        slug: "biology",
        name: "Biology",
        chapters: [
          { slug: "cell-division", name: "Cell Division" },
          { slug: "biomolecule", name: "Biomolecule" },
          { slug: "plant-physiology", name: "Plant Physiology" },
          { slug: "human-physiology", name: "Human Physiology" },
          { slug: "genetics", name: "Genetics" },
          { slug: "evolution", name: "Evolution" },
          { slug: "ecology", name: "Ecology" },
          { slug: "plant-anatomy", name: "Plant Anatomy" },
          { slug: "animal-tissue", name: "Animal Tissue" },
          { slug: "microbiology", name: "Microbiology" },
          { slug: "reproduction", name: "Reproduction" },
          { slug: "biotechnology", name: "Biotechnology" },
          { slug: "immunology", name: "Immunology" },
          { slug: "molecular-biology", name: "Molecular Biology" },
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
          { slug: "vyakaran", name: "व्याकरण (Grammar)" },
          { slug: "lekha-kala", name: "लेखा कला (Writing)" },
          { slug: "bhumi-ka", name: "भूमिका (Introduction)" },
          { slug: "kadya", name: "कड़या (Essay)" },
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
          { slug: "vyakaran", name: "व्याकरण (Grammar)" },
          { slug: "lekha-kala", name: "लेखा कला (Writing)" },
          { slug: "bhumi-ka", name: "भूमिका (Introduction)" },
          { slug: "kadya", name: "कड़या (Essay)" },
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
