-- =====================================================================
-- 0015_populate_syllabus.sql
-- Inserts NEB syllabus structure for Class 11 and 12 Physics.
-- Idempotent: uses ON CONFLICT DO NOTHING on exam_groups.
-- =====================================================================

-- Clear existing hierarchy data (keep categories)
DELETE FROM public.content_items;
DELETE FROM public.topics;
DELETE FROM public.sub_chapters;
DELETE FROM public.chapters;
DELETE FROM public.subjects;
DELETE FROM public.exam_groups;

-- Seed exam groups
INSERT INTO public.exam_groups (slug, name, description, sort_order) VALUES
  ('class-11', 'Class 11', 'NEB Class 11 general stream', 1),
  ('class-12', 'Class 12', 'NEB Class 12 general stream', 2),
  ('class-11e', 'Class 11E (Engineering)', 'NEB Class 11 engineering stream', 3),
  ('class-12e', 'Class 12E (Engineering)', 'NEB Class 12 engineering stream', 4),
  ('class-11-more', 'Class 11 More', 'Class 11 supplementary subjects', 5),
  ('class-12-more', 'Class 12 More', 'Class 12 supplementary subjects', 6),
  ('loksewa', 'Loksewa', 'Lok Sewa Aayog exam preparation', 7),
  ('general-knowledge', 'General Knowledge', 'World and Nepal general knowledge', 8)
ON CONFLICT (slug) DO NOTHING;

-- Class 11 Physics
DO $$
DECLARE
  v_eg uuid; v_sub uuid; v_ch uuid; v_sc uuid; v_top uuid;
BEGIN
  SELECT id INTO v_eg FROM public.exam_groups WHERE slug = 'class-11';
  INSERT INTO public.subjects (id, exam_group_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_eg, 'physics', 'Physics', 1) RETURNING id INTO v_sub;

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'physical-quantity', 'Physical Quantity', 1) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'units-units', 'Units and Measurements', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'physical-quantities', 'Physical Quantities and Units', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Physical Quantities and Units', 4,
      '<p>Base quantities, derived quantities, SI units and dimensional analysis.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'kinematics', 'Kinematics', 2) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'motion-straight-line', 'Motion in a Straight Line', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'kinematics-basics', 'Kinematics Basics', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Kinematics Basics', 4,
      '<p>Distance, displacement, speed, velocity and acceleration.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'laws-of-motion', 'Laws of Motion', 3) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'newton-laws', 'Newton''s Laws of Motion', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'newton-laws-topic', 'Newton''s Laws of Motion', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Newton''s Laws of Motion', 4,
      '<p>First, second and third laws of motion with examples.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'work-energy-power', 'Work, Energy and Power', 4) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'work-power-topic', 'Work and Power', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'work-energy-topic', 'Work, Energy and Power', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Work, Energy and Power', 4,
      '<p>Definition of work, power, kinetic and potential energy.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'gravity', 'Gravity', 5) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'universal-gravitation-topic', 'Universal Gravitation', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'gravity-topic', 'Universal Law of Gravitation', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Universal Law of Gravitation', 4,
      '<p>Newton''s universal law of gravitation and its applications.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'circular-motion', 'Circular Motion', 6) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'circular-motion-topic', 'Circular Motion', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'circular-motion-topic2', 'Circular Motion Dynamics', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Circular Motion Dynamics', 4,
      '<p>Centripetal force, centripetal acceleration and practical examples.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'properties-of-matter', 'Properties of Matter', 7) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'elasticity-topic', 'Elasticity', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'elasticity-topic2', 'Elasticity and Hooke''s Law', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Elasticity and Hooke''s Law', 4,
      '<p>Hooke''s law, stress-strain curve and elastic constants.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'thermodynamics', 'Thermodynamics', 8) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'thermo-topic', 'Laws of Thermodynamics', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'thermo-topic2', 'Thermodynamics', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Thermodynamics', 4,
      '<p>First and second laws of thermodynamics with applications.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'oscillation', 'Oscillation', 9) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'shm-topic', 'Simple Harmonic Motion', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'shm-topic2', 'Simple Harmonic Motion', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Simple Harmonic Motion', 4,
      '<p>Displacement, velocity, acceleration in SHM and spring-mass system.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'waves', 'Waves', 10) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'waves-topic', 'Wave Motion', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'waves-topic2', 'Wave Motion and Sound', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Wave Motion and Sound', 4,
      '<p>Transverse and longitudinal waves, wavelength, frequency and amplitude.</p>', 'ravikisan1814@gmail.com');
END $$;

-- Class 12 Physics
DO $$
DECLARE
  v_eg uuid; v_sub uuid; v_ch uuid; v_sc uuid; v_top uuid;
BEGIN
  SELECT id INTO v_eg FROM public.exam_groups WHERE slug = 'class-12';
  INSERT INTO public.subjects (id, exam_group_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_eg, 'physics', 'Physics', 1) RETURNING id INTO v_sub;

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'electrostatics', 'Electrostatics', 1) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'coulombs-law-topic', 'Coulomb''s Law', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'coulombs-law-topic2', 'Coulomb''s Law of Electrostatics', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Coulomb''s Law of Electrostatics', 4,
      '<p>Electric charge properties and Coulomb''s law.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'current-electricity', 'Current Electricity', 2) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'ohms-law-topic', 'Ohm''s Law', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'ohms-law-topic2', 'Ohm''s Law and Resistance', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Ohm''s Law and Resistance', 4,
      '<p>Electric current, voltage, resistance and Ohm''s law applications.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'magnetism', 'Magnetism', 3) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'magnetic-effect-topic', 'Magnetic Effect of Current', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'magnetism-topic', 'Magnetism and Magnetic Fields', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Magnetism and Magnetic Fields', 4,
      '<p>Biot-Savart law, Ampere''s circuital law and their applications.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'electromagnetic-induction', 'Electromagnetic Induction', 4) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'faradays-law-topic', 'Faraday''s Law', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'emi-topic', 'Faraday''s Law of Induction', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Faraday''s Law of Induction', 4,
      '<p>Electromagnetic induction, Lenz''s law and self-inductance.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'alternating-current', 'Alternating Current', 5) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'ac-topic', 'AC Basics', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'ac-topic2', 'Alternating Current and Circuits', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Alternating Current and Circuits', 4,
      '<p>AC generator, peak and RMS values, phase relationships.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'light', 'Light', 6) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'ray-optics-topic', 'Ray Optics', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'light-topic', 'Reflection and Refraction', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Reflection and Refraction', 4,
      '<p>Mirrors, lenses, total internal reflection and optical instruments.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'modern-physics', 'Modern Physics', 7) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'dual-nature-topic', 'Dual Nature of Radiation', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'modern-physics-topic', 'Dual Nature of Radiation and Matter', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Dual Nature of Radiation and Matter', 4,
      '<p>Photoelectric effect, de Broglie wavelength and wave-particle duality.</p>', 'ravikisan1814@gmail.com');

  INSERT INTO public.chapters (id, subject_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sub, 'semiconductor', 'Semiconductor Electronics', 8) RETURNING id INTO v_ch;
  INSERT INTO public.sub_chapters (id, chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_ch, 'semiconductor-topic', 'Semiconductor Diode', 1) RETURNING id INTO v_sc;
  INSERT INTO public.topics (id, sub_chapter_id, slug, name, sort_order)
    VALUES (gen_random_uuid(), v_sc, 'semiconductor-topic2', 'Semiconductor Electronics', 1) RETURNING id INTO v_top;
  INSERT INTO public.content_items (id, topic_id, title, access_level, public_teaser, owner_contact)
    VALUES (gen_random_uuid(), v_top, 'Semiconductor Electronics', 4,
      '<p>P-N junction, forward and reverse bias, rectifiers and LEDs.</p>', 'ravikisan1814@gmail.com');
END $$;

-- Verify
SELECT 'Exam groups: ' || count(*) FROM public.exam_groups
UNION ALL SELECT 'Subjects: ' || count(*) FROM public.subjects
UNION ALL SELECT 'Chapters: ' || count(*) FROM public.chapters
UNION ALL SELECT 'Sub-chapters: ' || count(*) FROM public.sub_chapters
UNION ALL SELECT 'Topics: ' || count(*) FROM public.topics
UNION ALL SELECT 'Content items: ' || count(*) FROM public.content_items;
