-- =====================================================================
-- 0017_populate_class11_full_syllabus.sql
-- Inserts the complete NEB Class 11 syllabus hierarchy for Physics,
-- Chemistry, Biology, and Mathematics into the database.
--
-- Structure: exam_groups → subjects → chapters → sub_chapters → topics
--            → content_items
--
-- Idempotent: uses ON CONFLICT DO NOTHING on all inserts.
-- =====================================================================

-- Clear existing hierarchy data for class-11 group only
DELETE FROM public.content_items
WHERE topic_id IN (
  SELECT t.id FROM public.topics t
  JOIN public.sub_chapters sc ON t.sub_chapter_id = sc.id
  JOIN public.chapters c ON sc.chapter_id = c.id
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id
  WHERE eg.slug = 'class-11'
);

DELETE FROM public.topics
WHERE sub_chapter_id IN (
  SELECT sc.id FROM public.sub_chapters sc
  JOIN public.chapters c ON sc.chapter_id = c.id
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id
  WHERE eg.slug = 'class-11'
);

DELETE FROM public.sub_chapters
WHERE chapter_id IN (
  SELECT c.id FROM public.chapters c
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id
  WHERE eg.slug = 'class-11'
);

DELETE FROM public.chapters
WHERE subject_id IN (
  SELECT s.id FROM public.subjects s
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id
  WHERE eg.slug = 'class-11'
);

DELETE FROM public.subjects
WHERE exam_group_id IN (
  SELECT id FROM public.exam_groups WHERE slug = 'class-11'
);

-- Ensure class-11 exam group exists
INSERT INTO public.exam_groups (slug, name, description, sort_order)
  VALUES ('class-11', 'Class 11', 'NEB Class 11 secondary education curriculum (2076)', 1)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- PHYSICS — Class 11
-- =====================================================================
DO $$
DECLARE
  v_eg uuid; v_sub uuid; v_ch uuid; v_sc uuid; v_top uuid;
BEGIN
  SELECT id INTO v_eg FROM public.exam_groups WHERE slug = 'class-11';
  INSERT INTO public.subjects (id, exam_group_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_eg, 'physics', 'Physics',
      'Mechanics, heat, waves, optics, electricity, magnetism and modern physics.', 1)
    RETURNING id INTO v_sub;

  -- UNIT 1: Physical Quantities
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'physical-quantities', 'Physical Quantities',
      'Precision, significant figures, dimensions and dimensional analysis.', 1) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'units-measurements', 'Units and Measurements',
      'SI units, derived units and dimensional analysis.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'physical-quantities-topic', 'Physical Quantities and Units',
      'Base quantities, derived quantities, SI units and dimensional analysis.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Physical Quantities and Units', 4,
      '<p>Base quantities, derived quantities, SI units and dimensional analysis.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 2: Vectors
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'vectors', 'Vectors',
      'Triangle, parallelogram and polygon laws of vectors; resolution; scalar and vector products.', 2) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'vector-laws-resolution', 'Vector Laws and Resolution',
      'Triangle, parallelogram, polygon laws and resolution of vectors.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'vector-addition', 'Vector Addition',
      'Adding vectors graphically and by components.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Vector Addition — Full Notes', 2,
      '<p>Vectors are quantities that have both <strong>magnitude</strong> and <strong>direction</strong>.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'scalar-vector-product', 'Scalar and Vector Products',
      'Dot product and cross product of vectors.', 2) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Scalar and Vector Products', 4,
      '<p>The dot product gives a scalar; the cross product gives a vector perpendicular to both input vectors.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 3: Kinematics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'kinematics', 'Kinematics',
      'Instantaneous velocity/acceleration, relative velocity, equations of motion, projectile motion.', 3) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'motion-straight-line', 'Motion in a Straight Line',
      'Velocity, acceleration and equations of motion.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'kinematics-basics', 'Kinematics Basics',
      'Distance, displacement, speed, velocity and acceleration.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Kinematics Basics', 4,
      '<p>Distance, displacement, speed, velocity and acceleration in one dimension.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'projectile-motion', 'Projectile Motion',
      'Trajectory, range, maximum height of a projectile.', 2) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'projectile-motion-topic', 'Projectile Motion',
      'Analysis of projectile trajectory, range and maximum height.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Projectile Motion', 4,
      '<p>A projectile follows a parabolic path under the influence of gravity alone.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 4: Dynamics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'dynamics', 'Dynamics',
      'Momentum, impulse, Newton''s laws, torque, equilibrium, friction.', 4) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'newton-laws', "Newton's Laws of Motion",
      'First, second and third laws with applications.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'newtons-laws-topic', "Newton's Laws of Motion",
      'First, second and third laws of motion with examples.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, "Newton's Laws of Motion", 4,
      '<p>First, second and third laws of motion with examples.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 5: Work, Energy and Power
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'work-energy-power', 'Work, Energy and Power',
      'Work, power, kinetic/potential energy, conservation of energy, collisions.', 5) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'work-energy-topic', 'Work, Energy and Power',
      'Work-energy theorem and conservation of energy.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'work-energy-topic2', 'Work, Energy and Power',
      'Definition of work, power, kinetic and potential energy.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Work, Energy and Power', 4,
      '<p>Definition of work, power, kinetic and potential energy.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 6: Circular Motion
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'circular-motion', 'Circular Motion',
      'Angular quantities, centripetal acceleration/force, conical pendulum, banking.', 6) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'circular-motion-topic', 'Circular Motion',
      'Angular displacement, velocity, acceleration and centripetal force.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'circular-motion-topic2', 'Circular Motion Dynamics',
      'Centripetal force, centripetal acceleration and practical examples.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Circular Motion Dynamics', 4,
      '<p>Centripetal force, centripetal acceleration and practical examples.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 7: Gravitation
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'gravitation', 'Gravitation',
      'Newton''s law, gravitational field/potential, satellite motion, GPS.', 7) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'universal-gravitation-topic', 'Universal Gravitation',
      'Newton''s law of gravitation and its applications.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'gravity-topic', 'Universal Law of Gravitation',
      'Newton''s universal law of gravitation and its applications.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Universal Law of Gravitation', 4,
      '<p>Newton''s universal law of gravitation and its applications.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 8: Elasticity
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'elasticity', 'Elasticity',
      'Hooke''s law, stress-strain, elastic moduli, Poisson''s ratio.', 8) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'elasticity-topic', 'Elasticity',
      'Hooke''s law, stress, strain and elastic constants.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'elasticity-topic2', 'Elasticity and Hooke''s Law',
      'Hooke''s law, stress-strain curve and elastic constants.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Elasticity and Hooke''s Law', 4,
      '<p>Hooke''s law, stress-strain curve and elastic constants.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 9-13: Heat and Thermodynamics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'heat-thermodynamics', 'Heat and Thermodynamics',
      'Temperature, thermal expansion, heat transfer, ideal gas and kinetic theory.', 9) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'thermodynamics-topic', 'Laws of Thermodynamics',
      'First and second laws of thermodynamics.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'thermo-topic2', 'Thermodynamics',
      'First and second laws of thermodynamics with applications.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Thermodynamics', 4,
      '<p>First and second laws of thermodynamics with applications.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'ideal-gas-topic', 'Ideal Gas and Kinetic Theory',
      'Ideal gas equation and kinetic-molecular model.', 2) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'ideal-gas-topic2', 'Ideal Gas Law',
      'Ideal gas equation, rms speed and Boltzmann constant.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Ideal Gas Law', 4,
      '<p>PV = nRT, kinetic theory derivation of pressure, RMS speed of gas molecules.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 14-18: Waves and Optics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'waves-optics', 'Waves and Optics',
      'Reflection, refraction, lenses, dispersion and optical instruments.', 10) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'reflection-curved-mirrors', 'Reflection at Curved Mirrors',
      'Mirror formula and image formation.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'mirror-formula', 'Mirror Formula',
      '1/f = 1/v + 1/u and sign conventions.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Mirror Formula — Full Notes', 4,
      '<p>The mirror formula relates object distance (u), image distance (v) and focal length (f) for spherical mirrors.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'refraction-lenses', 'Refraction through Lenses and Prisms',
      'Lens maker''s formula, prism deviation and dispersion.', 2) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'lens-formula', 'Lens Formula and Power',
      'Thin lens formula, power of a lens and combination of lenses.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Lens Formula and Power', 4,
      '<p>Thin lens formula 1/f = 1/v - 1/u, lens power in diopters, and combined lens systems.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 19-23: Electricity and Magnetism
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'electricity-magnetism', 'Electricity and Magnetism',
      'Electric charges, fields, potential, capacitors and DC circuits.', 11) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'electric-charges-field', 'Electric Charges and Fields',
      'Coulomb''s law, electric field and Gauss''s law.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'coulombs-law-topic', "Coulomb's Law",
      "Electric charge properties and Coulomb's law.", 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, "Coulomb's Law of Electrostatics", 4,
      '<p>Electric charge properties and Coulomb''s law.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'dc-circuits-topic', 'DC Circuits',
      'Ohm''s law, resistance, power and circuits.', 2) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'ohms-law-topic2', "Ohm's Law and Resistance",
      'Electric current, voltage, resistance and Ohm''s law applications.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, "Ohm's Law and Resistance", 4,
      '<p>Electric current, voltage, resistance and Ohm''s law applications.</p>', 'ravikisan1814@gmail.com');

  -- UNIT 24-26: Modern Physics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'modern-physics', 'Modern Physics',
      'Nuclear physics, solids and recent trends in physics.', 12) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'nuclear-physics-topic', 'Nuclear Physics',
      'Nuclear structure, mass defect, binding energy, fission and fusion.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'nuclear-physics-topic2', 'Nuclear Physics',
      'Nuclear density, mass defect, binding energy per nucleon, fission and fusion.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Nuclear Physics', 4,
      '<p>Einstein''s mass-energy relation, mass defect, binding energy, nuclear fission and fusion.</p>', 'ravikisan1814@gmail.com');
END $$;

-- =====================================================================
-- CHEMISTRY — Class 11
-- =====================================================================
DO $$
DECLARE
  v_eg uuid; v_sub uuid; v_ch uuid; v_sc uuid; v_top uuid;
BEGIN
  SELECT id INTO v_eg FROM public.exam_groups WHERE slug = 'class-11';
  INSERT INTO public.subjects (id, exam_group_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_eg, 'chemistry', 'Chemistry',
      'General, inorganic, organic and applied chemistry.', 2)
    RETURNING id INTO v_sub;

  -- Unit 1: Foundation
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'foundation-fundamentals', 'Foundation and Fundamentals',
      'Introduction to chemistry, atoms, molecules, amu, radicals, empirical and molecular formulas.', 1) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'basic-concepts', 'Basic Concepts in Chemistry',
      'Atoms, molecules, amu, radicals, percentage composition.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'intro-chemistry', 'Introduction to Chemistry',
      'Scope, importance and basic concepts of chemistry.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Introduction to Chemistry', 4,
      '<p>Chemistry is the science of matter and its transformations. It explores the composition, structure and properties of substances.</p>', 'ravikisan1814@gmail.com');

  -- Unit 2: Stoichiometry
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'stoichiometry', 'Stoichiometry',
      'Dalton''s atomic theory, laws of stoichiometry, mole concept, limiting reactant, percent yield.', 2) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'mole-concept', 'Mole Concept and Calculations',
      'Avogadro''s law, mole, limiting reactant and yield calculations.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'mole-topic', 'Mole Concept',
      'The mole as a counting unit; relations between mass, volume and number of particles.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Mole Concept', 4,
      '<p>One mole contains Avogadro''s number (6.022 × 10²³) of particles. It connects the macroscopic and microscopic worlds.</p>', 'ravikisan1814@gmail.com');

  -- Unit 3: Atomic Structure
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'atomic-structure', 'Atomic Structure',
      'Rutherford and Bohr models, quantum numbers, orbitals, electronic configurations.', 3) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'quantum-model', 'Quantum Mechanical Model',
      'de Broglie, Heisenberg, quantum numbers and orbitals.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'quantum-topics', 'Quantum Numbers and Orbitals',
      'Four quantum numbers, shape of s and p orbitals, Aufbau principle.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Quantum Numbers and Orbitals', 4,
      '<p>Quantum numbers (n, l, m, s) describe the energy, shape, orientation and spin of electrons in atoms.</p>', 'ravikisan1814@gmail.com');

  -- Unit 4: Periodic Table
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'periodic-table', 'Classification of Elements and Periodic Table',
      'Modern periodic law, periodic trends in atomic radii, IE, EA, electronegativity.', 4) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'periodic-trends', 'Periodic Trends',
      'Atomic radii, ionization energy, electron affinity, electronegativity.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'periodic-trend-topics', 'Periodic Trends in Properties',
      'Periodic variation of atomic and ionic radii, ionization energy, electronegativity.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Periodic Trends in Properties', 4,
      '<p>Properties repeat periodically with increasing atomic number. Trends across periods and down groups are predictable.</p>', 'ravikisan1814@gmail.com');

  -- Unit 5: Chemical Bonding
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'chemical-bonding', 'Chemical Bonding and Shapes of Molecules',
      'Ionic, covalent, coordinate bonds; VSEPR theory; hybridization; hydrogen bonding.', 5) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'bonding-theories', 'Bonding Theories',
      'Ionic and covalent bonds, VSEPR theory, hybridization.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'vsepr-shapes', 'VSEPR Theory and Molecular Shapes',
      'Predicting molecular geometry using VSEPR theory.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'VSEPR Theory and Molecular Shapes', 4,
      '<p>VSEPR theory predicts molecular geometry based on electron pair repulsion around a central atom.</p>', 'ravikisan1814@gmail.com');

  -- Unit 6: Oxidation-Reduction
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'oxidation-reduction', 'Oxidation and Reduction',
      'Redox concepts, oxidation number, balancing redox reactions, electrolysis.', 6) RETURNING id INTO v_ch;

  -- Unit 7: States of Matter
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'states-of-matter', 'States of Matter',
      'Gas laws, kinetic theory, liquid and solid states.', 7) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'gas-laws', 'Gas Laws and Kinetic Theory',
      'Boyle''s, Charles', 'Avogadro''s, combined gas equation, ideal gas equation.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'gas-laws-topic', 'Gas Laws',
      'Boyle''s, Charles'', Avogadro''s and ideal gas equation with numerical problems.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Gas Laws', 4,
      '<p>Boyle''s law (P ∝ 1/V), Charles''s law (V ∝ T), Avogadro''s law (V ∝ n) combine into PV = nRT.</p>', 'ravikisan1814@gmail.com');

  -- Unit 8: Chemical Equilibrium
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'chemical-equilibrium', 'Chemical Equilibrium',
      'Dynamic equilibrium, law of mass action, Kp and Kc, Le Chatelier''s principle.', 8) RETURNING id INTO v_ch;

  -- Unit 9: Chemistry of Non-Metals
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'chemistry-nonmetals', 'Chemistry of Non-Metals',
      'Hydrogen, oxygen, ozone, nitrogen, halogens, carbon, phosphorus, sulphur.', 9) RETURNING id INTO v_ch;

  -- Unit 10: Chemistry of Metals
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'chemistry-metals', 'Chemistry of Metals',
      'Metallurgical principles, alkali metals, alkaline earth metals.', 10) RETURNING id INTO v_ch;

  -- Unit 11: Bio-Inorganic Chemistry
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'bio-inorganic-chemistry', 'Bio-Inorganic Chemistry',
      'Metal ions in biological systems, ion pumps, metal toxicity.', 11) RETURNING id INTO v_ch;

  -- Unit 12: Organic Chemistry Basics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'organic-basic-concepts', 'Basic Concepts of Organic Chemistry',
      'Tetra-covalency, catenation, classification, IUPAC nomenclature, cracking.', 12) RETURNING id INTO v_ch;

  -- Unit 13: Fundamental Principles of Organic Chemistry
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'organic-fundamental-principles', 'Fundamental Principles of Organic Chemistry',
      'Isomerism, reaction mechanisms, inductive and resonance effects.', 13) RETURNING id INTO v_ch;

  -- Unit 14: Hydrocarbons
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'hydrocarbons', 'Hydrocarbons',
      'Alkanes, alkenes, alkynes: preparation, properties and tests for unsaturation.', 14) RETURNING id INTO v_ch;

  -- Unit 15: Aromatic Hydrocarbons
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'aromatic-hydrocarbons', 'Aromatic Hydrocarbons',
      'Benzene: Huckel''s rule, Kekulé structure, electrophilic substitution reactions.', 15) RETURNING id INTO v_ch;

  -- Unit 16-17: Applied Chemistry
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'applied-chemistry', 'Applied Chemistry',
      'Chemical industry, manufacturing processes (Haber, Ostwald, Contact, Solvay), fertilizers.', 16) RETURNING id INTO v_ch;
END $$;

-- =====================================================================
-- BIOLOGY — Class 11
-- =====================================================================
DO $$
DECLARE
  v_eg uuid; v_sub uuid; v_ch uuid; v_sc uuid; v_top uuid;
BEGIN
  SELECT id INTO v_eg FROM public.exam_groups WHERE slug = 'class-11';
  INSERT INTO public.subjects (id, exam_group_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_eg, 'biology', 'Biology',
      'Cell biology, floriculture diversity, microbiology, ecology, evolution and zoology.', 3)
    RETURNING id INTO v_sub;

  -- Part A: Botany
  -- Unit 1: Biomolecules and Cell Biology
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'biomolecules-cell-biology', 'Biomolecules and Cell Biology',
      'Biomolecules, cell structure, prokaryotic vs eukaryotic cells, cell division.', 1) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'cell-structure', 'Cell Structure and Division',
      'Eukaryotic cell organelles, cell cycle, mitosis and meiosis.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'cell-division-topic', 'Cell Division: Mitosis and Meiosis',
      'Cell cycle, amitosis, mitosis and meiosis with their significance.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Cell Division: Mitosis and Meiosis', 4,
      '<p>Mitosis produces two genetically identical daughter cells; meiosis produces four haploid cells with genetic variation.</p>', 'ravikisan1814@gmail.com');

  -- Unit 2: Floral Diversity
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'floral-diversity', 'Floral Diversity',
      'Three domains, five kingdoms, fungi, lichen, algae, bryophytes, pteridophytes, gymnosperms, angiosperms.', 2) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'plant-kingdom', 'Plant Kingdom Classification',
      'Bryophyta, Pteridophyta, Gymnospermae and Angiospermae.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'plant-diversity-topic', 'Plant Diversity',
      'Characteristics and economic importance of bryophytes, pteridophytes, gymnosperms and angiosperms.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Plant Diversity', 4,
      '<p>Plants are classified into bryophytes (mosses), pteridophytes (ferns), gymnosperms (conifers) and angiosperms (flowering plants).</p>', 'ravikisan1814@gmail.com');

  -- Unit 3: Introductory Microbiology
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'introductory-microbiology', 'Introductory Microbiology',
      'Monera (bacteria, cyanobacteria), viruses, bacteriophage, biotechnology.', 3) RETURNING id INTO v_ch;

  -- Unit 4: Ecology
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'ecology', 'Ecology',
      'Ecosystem ecology, food chains, ecological pyramids, biogeochemical cycles, adaptation, imbalances.', 4) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'ecosystem-dynamics', 'Ecosystem and Biogeochemical Cycles',
      'Food chains, trophic levels, ecological pyramids, carbon and nitrogen cycles.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'ecosystem-topic', 'Ecosystem Ecology',
      'Biotic and abiotic factors, food chain, food web, trophic levels and ecological pyramids.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Ecosystem Ecology', 4,
      '<p>An ecosystem comprises biotic and abiotic components interacting as a functional unit. Energy flows through trophic levels.</p>', 'ravikisan1814@gmail.com');

  -- Unit 5: Vegetation
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'vegetation', 'Vegetation',
      'Vegetation types in Nepal, in-situ and ex-situ conservation.', 5) RETURNING id INTO v_ch;

  -- Part B: Zoology
  -- Unit 6: Introduction to Biology
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'intro-biology', 'Introduction to Biology',
      'Scope and fields of biology; relationship with other sciences.', 6) RETURNING id INTO v_ch;

  -- Unit 7: Evolutionary Biology
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'evolutionary-biology', 'Evolutionary Biology',
      'Origin of life, evidence of evolution, theories of evolution, human evolution.', 7) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'origin-evolution', 'Origin of Life and Evidence of Evolution',
      'Oparin-Haldane theory, Miller-Urey experiment, morphological and biochemical evidence.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'evolution-topic', 'Theory of Evolution',
      'Lamarckism, Darwinism and Neo-Darwinism; evidence from morphology, anatomy, paleontology and biochemistry.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Theory of Evolution', 4,
      '<p>Darwin''s theory of natural selection explains how species adapt and evolve over generations through differential survival and reproduction.</p>', 'ravikisan1814@gmail.com');

  -- Unit 8: Faunal Diversity
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'faunal-diversity', 'Faunal Diversity',
      'Protista, Animalia classification, earthworm and frog morphology and physiology.', 8) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'animal-diversity', 'Animal Kingdom Classification',
      'Levels of organization, body plans, symmetry, and classification of major phyla.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'animal-diversity-topic', 'Animal Diversity',
      'Classification of Porifera through Chordata with focus on earthworm and frog morphology.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Animal Diversity', 4,
      '<p>The animal kingdom spans from simple unicellular protozoans to complex chordates, organized into phyla based on body plan.</p>', 'ravikisan1814@gmail.com');

  -- Unit 9: Biota and Environment
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'biota-environment', 'Biota and Environment',
      'Animal adaptation, behavior, environmental pollution.', 9) RETURNING id INTO v_ch;

  -- Unit 10: Conservation Biology
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'conservation-biology', 'Conservation Biology',
      'Biodiversity, protected areas in Nepal, IUCN categories, endangered species.', 10) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'conservation-nepal', 'Conservation in Nepal',
      'National parks, wildlife reserves, IUCN categories and endangered species of Nepal.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'conservation-topic', 'Biodiversity and Conservation',
      'Biodiversity hotspots, Ramsar sites, IUCN categories (extinct, endangered, vulnerable, threatened).', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Biodiversity and Conservation', 4,
      '<p>Nepal is one of the 17 mega-diverse countries. Conservation strategies include in-situ (national parks) and ex-situ (breeding centers) approaches.</p>', 'ravikisan1814@gmail.com');
END $$;

-- =====================================================================
-- MATHEMATICS — Class 11 (Official NEB Syllabus)
-- =====================================================================
DO $$
DECLARE
  v_eg uuid; v_sub uuid; v_ch uuid; v_sc uuid; v_top uuid;
BEGIN
  SELECT id INTO v_eg FROM public.exam_groups WHERE slug = 'class-11';
  INSERT INTO public.subjects (id, exam_group_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_eg, 'mathematics', 'Mathematics',
      'Set theory, complex numbers, matrices, trigonometry, calculus and statistics.', 4)
    RETURNING id INTO v_sub;

  -- Unit 1: Set Theory
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'set-theory', 'Set Theory',
      'Sets, subsets, Venn diagrams, operations on sets, cardinality.', 1) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'sets-operations', 'Sets and Operations',
      'Types of sets, union, intersection, difference, complement.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'set-theory-topic', 'Sets and Venn Diagrams',
      'Definition of sets, subsets, power sets, Venn diagram representations and operations.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Sets and Venn Diagrams', 4,
      '<p>A set is a well-defined collection of distinct objects. Operations include union (∪), intersection (∩), difference (−) and complement (′).</p>', 'ravikisan1814@gmail.com');

  -- Unit 2: Complex Number
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'complex-number', 'Complex Number',
      'Complex numbers, Argand plane, polar form, cube roots of unity.', 2) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'complex-basics', 'Complex Numbers and Operations',
      'Algebraic operations, modulus, amplitude, Argand plane.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'complex-topic', 'Complex Numbers',
      'Representation of complex numbers, modulus-argument form, cube roots of unity.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Complex Numbers', 4,
      '<p>A complex number z = a + bi has real part a and imaginary part b. The modulus is |z| = √(a² + b²).</p>', 'ravikisan1814@gmail.com');

  -- Unit 3: Matrices
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'matrices', 'Matrices',
      'Matrix types, operations, transpose, symmetric/skew-symmetric, elementary transformations, inverse.', 3) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'matrix-operations', 'Matrix Operations and Inverse',
      'Addition, multiplication, transpose, inverse using elementary transformations.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'matrices-topic', 'Matrices and Determinants',
      'Matrix types, row/column operations, finding inverse of a square matrix.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Matrices', 4,
      '<p>A matrix is a rectangular array of numbers. Elementary row operations help find the inverse and solve systems of linear equations.</p>', 'ravikisan1814@gmail.com');

  -- Unit 4: Determinants
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'determinants', 'Determinants',
      'Determinant of 2×2 and 3×3 matrices, properties, area of triangle, adjoint and inverse.', 4) RETURNING id INTO v_ch;

  -- Unit 5: Binomial Theorem
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'binomial-theorem', 'Binomial Theorem',
      'Binomial theorem for positive integer index, general term, middle term, rational index.', 5) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'binomial-expansion', 'Binomial Expansion',
      'General term, middle term and independent term in binomial expansion.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'binomial-topic', 'Binomial Theorem',
      'Theorem for positive integer index; finding general term, middle term and specific coefficients.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Binomial Theorem', 4,
      '<p>(a + b)ⁿ = Σ C(n,r) · aⁿ⁻ʳ · bʳ. The general term Tᵣ₊₁ = C(n,r) · aⁿ⁻ʳ · bʳ.</p>', 'ravikisan1814@gmail.com');

  -- Unit 6: Sequence and Series
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'sequence-series', 'Sequence and Series',
      'Arithmetic and geometric progressions, relation between A.P. and G.P., infinite GP sum.', 6) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'ap-gp', 'Arithmetic and Geometric Progressions',
      'nth term and sum of AP and GP; relation between A.P. and G.P.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'sequence-topic', 'Sequence and Series',
      'Arithmetic progression: aₙ = a + (n-1)d. Geometric progression: aₙ = a·rⁿ⁻¹. Sum of infinite GP: S = a/(1-r).', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Sequence and Series', 4,
      '<p>An arithmetic progression has a constant difference; a geometric progression has a constant ratio between consecutive terms.</p>', 'ravikisan1814@gmail.com');

  -- Unit 7: Trigonometry
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'trigonometry', 'Trigonometry',
      'Trigonometric functions, identities, inverse trigonometric functions, general solutions.', 7) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'trig-identities', 'Trigonometric Identities',
      'Standard identities, compound angles, multiple angles, transformation formulae.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'trigonometry-topic', 'Trigonometry',
      'Trigonometric ratios, identities, inverse trigonometric functions and general solutions of trigonometric equations.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Trigonometry', 4,
      '<p>Trigonometry studies relationships between angles and sides of triangles. Key identities include sin²θ + cos²θ = 1.</p>', 'ravikisan1814@gmail.com');

  -- Unit 8: Measurement of Angles
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'measurement-angles', 'Measurement of Angles',
      'Degree, radian and grade systems; arc length and sector area.', 8) RETURNING id INTO v_ch;

  -- Unit 9: Solution of Triangles
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'solution-triangles', 'Solution of Triangles',
      'Sine rule, cosine rule, projection formula, Napier''s tan rule, area of triangle.', 9) RETURNING id INTO v_ch;

  -- Unit 10: Logarithm
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'logarithm', 'Logarithm',
      'Definition, laws of logarithms, change of base, solving exponential and logarithmic equations.', 10) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'log-basics', 'Logarithms and Their Laws',
      'Definition of logarithm, laws of logs, change of base formula.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'logarithm-topic', 'Logarithm',
      'If aˣ = M then x = logₐM. Laws: log(ab) = log a + log b, log(a/b) = log a - log b, log aⁿ = n log a.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Logarithm', 4,
      '<p>A logarithm is the exponent to which a base must be raised to produce a given number. Common log base is 10; natural log base is e.</p>', 'ravikisan1814@gmail.com');

  -- Unit 11: Straight Line
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'straight-line', 'Straight Line',
      'Slope, various forms of line equations, angle between lines, distance from a point.', 11) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'line-equations', 'Equations of a Straight Line',
      'Slope-intercept, point-slope, two-point, intercept and general forms.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'straight-line-topic', 'Straight Line',
      'Slope, equations in various forms, angle between two lines, condition for parallelism and perpendicularity.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Straight Line', 4,
      '<p>The equation of a straight line can be written as y = mx + c (slope-intercept form) or ax + by + c = 0 (general form).</p>', 'ravikisan1814@gmail.com');

  -- Unit 12: Conic Section
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'conic-section', 'Conic Section',
      'Parabola, ellipse, hyperbola and circle: standard equations and properties.', 12) RETURNING id INTO v_ch;

  -- Unit 13: Limits
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'limits', 'Limits',
      'Introduction to limits, laws of limits, standard limits, limits of trigonometric functions.', 13) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'limits-basics', 'Introduction to Limits',
      'Concept of limit, left-hand and right-hand limits, standard limits.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'limits-topic', 'Limits',
      'lim(x→0) sin x/x = 1, lim(x→0) (eˣ-1)/x = 1, and other standard limits used in differentiation.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Limits', 4,
      '<p>A limit describes the value that a function approaches as the input approaches some value. lim(x→0) sin x/x = 1 is fundamental.</p>', 'ravikisan1814@gmail.com');

  -- Unit 14: Differentiation
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'differentiation', 'Differentiation',
      'Derivatives of polynomials, trigonometric, exponential and logarithmic functions; chain rule; implicit differentiation.', 14) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'derivatives-basics', 'Rules of Differentiation',
      'Power rule, product rule, quotient rule, chain rule.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'differentiation-topic', 'Differentiation',
      'First principle of differentiation, derivatives of standard functions, chain rule and implicit differentiation.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Differentiation', 4,
      '<p>The derivative dy/dx represents the rate of change of y with respect to x. For y = xⁿ, dy/dx = nxⁿ⁻¹.</p>', 'ravikisan1814@gmail.com');

  -- Unit 15: Statistics
  INSERT INTO public.chapters (id, subject_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'statistics', 'Statistics',
      'Data presentation, measures of central tendency (mean, median, mode), dispersion (range, SD, variance), introduction to probability.', 15) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'central-tendency', 'Measures of Central Tendency',
      'Mean, median and mode for grouped and ungrouped data.', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, description, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'statistics-topic', 'Statistics',
      'Mean, median, mode, range, standard deviation and variance; introduction to probability.', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Statistics', 4,
      '<p>Statistics involves collecting, organizing, analyzing and interpreting data. Measures of central tendency include mean, median and mode.</p>', 'ravikisan1814@gmail.com');
END $$;

-- =====================================================================
-- Verify
-- =====================================================================
SELECT 'Exam groups: ' || count(*) FROM public.exam_groups
UNION ALL SELECT 'Subjects (class-11): ' || count(*) FROM public.subjects s
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id WHERE eg.slug = 'class-11'
UNION ALL SELECT 'Chapters: ' || count(*) FROM public.chapters c
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id WHERE eg.slug = 'class-11'
UNION ALL SELECT 'Sub-chapters: ' || count(*) FROM public.sub_chapters sc
  JOIN public.chapters c ON sc.chapter_id = c.id
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id WHERE eg.slug = 'class-11'
UNION ALL SELECT 'Topics: ' || count(*) FROM public.topics t
  JOIN public.sub_chapters sc ON t.sub_chapter_id = sc.id
  JOIN public.chapters c ON sc.chapter_id = c.id
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id WHERE eg.slug = 'class-11'
UNION ALL SELECT 'Content items: ' || count(*) FROM public.content_items ci
  JOIN public.topics t ON ci.topic_id = t.id
  JOIN public.sub_chapters sc ON t.sub_chapter_id = sc.id
  JOIN public.chapters c ON sc.chapter_id = c.id
  JOIN public.subjects s ON c.subject_id = s.id
  JOIN public.exam_groups eg ON s.exam_group_id = eg.id WHERE eg.slug = 'class-11';
