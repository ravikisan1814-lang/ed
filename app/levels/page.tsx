"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import { BookOpen, GraduationCap, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const EDUCATION_LEVELS = [
  {
    slug: "neb-plus2",
    name: "NEB (+2)",
    description: "National Examination Board's +2 (Grade 11 & 12) curriculum. Follows the latest NEB syllabus with 6 core subjects and practical labs.",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
    year: "2024 (Current)",
    units: 182,
    tracks: 6,
  },
  {
    slug: "loksewa",
    name: "Loksewa Prep",
    description: "Public Service Commission (Loksewa) exam preparation. Covers general knowledge, aptitude, subject-specific papers, and current affairs.",
    icon: "📋",
    color: "from-amber-500 to-orange-500",
    year: "2024 (Current)",
    units: 45,
    tracks: 3,
  },
];

const SUBJECTS = [
  {
    emoji: "🧬",
    name: "Biology",
    slug: "biology",
    units: 36,
    tracks: 6,
    description: "Cell biology, genetics, ecology, human physiology, biotechnology, and evolution.",
    color: "from-green-400 to-emerald-600",
    topics: [
      "Cell Biology & Biomolecules",
      "Genetics & Evolution",
      "Human Physiology",
      "Ecology & Environment",
      "Biotechnology",
      "Plant & Animal Diversity",
    ],
  },
  {
    emoji: "⚗️",
    name: "Chemistry",
    slug: "chemistry",
    units: 44,
    tracks: 6,
    description: "Physical, organic, and inorganic chemistry with numerical problems and lab work.",
    color: "from-purple-400 to-violet-600",
    topics: [
      "Stoichiometry & Mole Concept",
      "Atomic Structure & Bonding",
      "Thermodynamics & Equilibrium",
      "Organic Chemistry",
      "Electrochemistry & Kinetics",
      "Periodic Table & Metallurgy",
    ],
  },
  {
    emoji: "📖",
    name: "English",
    slug: "english",
    units: 18,
    tracks: 6,
    description: "Reading comprehension, writing skills, grammar, and literature.",
    color: "from-red-400 to-rose-600",
    topics: [
      "Reading Comprehension",
      "Writing Skills",
      "Grammar & Usage",
      "Literature & Poetry",
      "Letter & Essay Writing",
      "Translation & Vocabulary",
    ],
  },
  {
    emoji: "🔢",
    name: "Mathematics",
    slug: "mathematics",
    units: 34,
    tracks: 6,
    description: "Algebra, trigonometry, calculus, statistics, and coordinate geometry.",
    color: "from-yellow-400 to-amber-600",
    topics: [
      "Set Theory & Logic",
      "Complex Numbers & Matrices",
      "Trigonometry & Analytic Geometry",
      "Limits & Differentiation",
      "Integration & Differential Equations",
      "Statistics & Probability",
    ],
  },
  {
    emoji: "🇳🇵",
    name: "Nepali",
    slug: "nepali",
    units: 16,
    tracks: 6,
    description: "Nepali grammar, composition, literature, and comprehension.",
    color: "from-red-500 to-pink-600",
    topics: [
      "व्याकरण (Grammar)",
      "लेखन कला (Writing)",
      "वाचन कला (Reading)",
      "साहित्य (Literature)",
      "अनुवाद (Translation)",
      "निबन्ध (Essay)",
    ],
  },
  {
    emoji: "⚛️",
    name: "Physics",
    slug: "physics",
    units: 54,
    tracks: 6,
    description: "Mechanics, thermodynamics, optics, electricity, magnetism, and modern physics.",
    color: "from-blue-400 to-indigo-600",
    topics: [
      "Mechanics & Vectors",
      "Thermodynamics & Heat",
      "Optics & Waves",
      "Electrostatics & Current",
      "Magnetism & EMI",
      "Modern Physics & Electronics",
    ],
  },
];

// Past 5 years syllabus changes
const PAST_SYLLABUS = [
  {
    year: "2023",
    label: "2023 BS",
    changes: [
      "Reduced Mathematics chapters from 15 to 12",
      "Removed 'Graphical Method of Integration' from Math",
      "Added 'Environmental Chemistry' as separate topic in Chemistry",
      "Reduced Physics 'Modern Physics' from 4 to 3 topics",
      "Added 'Digital Electronics' basics in Physics",
    ],
    status: "previous",
  },
  {
    year: "2022",
    label: "2022 BS",
    changes: [
      "Introduced 'Computational Physics' in Physics",
      "Added 'Nanotechnology' in Chemistry",
      "Removed 'Matrix Multiplication' from Mathematics",
      "Added 'Statistical Mechanics' basics in Physics",
      "Reduced Biology 'Ecology' chapter scope",
    ],
    status: "previous",
  },
  {
    year: "2021",
    label: "2021 BS",
    changes: [
      "Major restructuring of Mathematics syllabus",
      "Added 'Vector Calculus' in Physics",
      "Introduced 'Chemical Thermodynamics' as separate unit",
      "Reduced English literature from 10 to 6 poems",
      "Added 'Biotechnology' in Biology",
    ],
    status: "previous",
  },
  {
    year: "2020",
    label: "2020 BS",
    changes: [
      "First year of new NEB curriculum implementation",
      "Replaced 'Traditional Physics' with 'Modern Physics' focus",
      "Added 'Organic Chemistry' as major unit",
      "Introduced 'Statistics' in Mathematics",
      "Reduced total contact hours by 15%",
    ],
    status: "previous",
  },
  {
    year: "2019",
    label: "2019 BS",
    changes: [
      "Old curriculum - pre-NEB reform",
      "Physics: 18 chapters, no modern physics focus",
      "Chemistry: 15 chapters, less organic focus",
      "Mathematics: 20 chapters, pure math heavy",
      "Biology: 12 chapters, less biotechnology",
    ],
    status: "previous",
  },
];

const CURRENT_SYLLABUS = {
  year: "2024",
  label: "Current (2024 BS)",
  changes: [
    "Physics: 54 units across 6 tracks (Mechanics, Heat, Optics, Electricity, Magnetism, Modern Physics)",
    "Chemistry: 44 units across 6 tracks (Physical, Organic, Inorganic, Analytical, Biochemistry, Environmental)",
    "Mathematics: 34 units across 6 tracks (Algebra, Trigonometry, Calculus, Geometry, Statistics, Vectors)",
    "Biology: 36 units across 6 tracks (Cell Biology, Genetics, Physiology, Ecology, Biotechnology, Diversity)",
    "English: 18 units across 6 tracks (Reading, Writing, Grammar, Literature, Communication, Translation)",
    "Nepali: 16 units across 6 tracks (Grammar, Writing, Reading, Literature, Essay, Translation)",
  ],
  status: "current",
};

// ── Components ────────────────────────────────────────────────────────────────

function LevelCard({ level }: { level: typeof EDUCATION_LEVELS[0] }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{level.icon}</div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
            {level.year}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{level.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{level.description}</p>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-semibold text-foreground">{level.units}</span>
            <span className="text-muted-foreground ml-1"> units</span>
          </div>
          <div>
            <span className="font-semibold text-foreground">{level.tracks}</span>
            <span className="text-muted-foreground ml-1"> tracks</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubjectCard({ subject }: { subject: typeof SUBJECTS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md">
      <div className={`h-1 bg-gradient-to-r ${subject.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.emoji}</span>
            <div>
              <h4 className="font-bold text-lg">{subject.name}</h4>
              <p className="text-xs text-muted-foreground">{subject.units} units · {subject.tracks} tracks</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Topics Covered</p>
            <ul className="space-y-1.5">
              {subject.topics.map((topic, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${subject.color} flex-shrink-0`} />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function SyllabusTimeline() {
  const [activeYear, setActiveYear] = useState(CURRENT_SYLLABUS.year);
  const years = [CURRENT_SYLLABUS, ...PAST_SYLLABUS];

  return (
    <div className="space-y-6">
      {/* Year selector */}
      <div className="flex flex-wrap gap-2">
        {years.map((year) => (
          <button
            key={year.year}
            onClick={() => setActiveYear(year.year)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeYear === year.year
                ? year.status === "current"
                  ? "bg-accent text-accent-ink shadow-md"
                  : "bg-accent/20 text-accent border border-accent/30"
                : "bg-card border border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
            }`}
          >
            {year.label}
            {year.status === "current" && (
              <span className="ml-2 text-xs opacity-75">●</span>
            )}
          </button>
        ))}
      </div>

      {/* Active year content */}
      {years.map((year) =>
        year.year === activeYear ? (
          <div
            key={year.year}
            className={`rounded-xl border p-6 ${
              year.status === "current"
                ? "border-accent/30 bg-accent/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {year.status === "current" ? (
                <BookOpen className="w-5 h-5 text-accent" />
              ) : (
                <ClipboardList className="w-5 h-5 text-muted-foreground" />
              )}
              <h3 className="text-lg font-bold">
                {year.label} Syllabus
                {year.status === "current" && (
                  <span className="ml-3 text-xs font-normal text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </h3>
            </div>
            <ul className="space-y-2">
              {year.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    year.status === "current" ? "bg-accent" : "bg-muted-foreground"
                  }`} />
                  <span className={year.status === "current" ? "text-foreground" : "text-muted-foreground"}>
                    {change}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LevelsPage() {
  return (
    <>
      <BackButton href="/" />
      <section className="hero hero-premium">
        <span className="hero-badge">Curriculum</span>
        <h1 className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Syllabus & Curriculum
        </h1>
        <p className="max-w-2xl mx-auto">
          Explore the complete NEB (+2) and Loksewa preparation curriculum. Compare the current syllabus with past 5 years of changes.
        </p>
      </section>

      <section className="content-section">
        {/* Education Levels */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-accent" />
            Education Levels
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose your academic track and explore the curriculum structure.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {EDUCATION_LEVELS.map((level) => (
              <LevelCard key={level.slug} level={level} />
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent" />
            NEB (+2) Subjects
          </h2>
          <p className="text-muted-foreground mb-6">
            6 core subjects with detailed topic breakdowns. Click any subject to expand.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECTS.map((subject) => (
              <SubjectCard key={subject.slug} subject={subject} />
            ))}
          </div>
        </div>

        {/* Syllabus Comparison */}
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-accent" />
            Syllabus History
          </h2>
          <p className="text-muted-foreground mb-6">
            Track changes in the NEB syllabus over the past 5 years. Select a year to see what changed.
          </p>
          <SyllabusTimeline />
        </div>
      </section>
    </>
  );
}
