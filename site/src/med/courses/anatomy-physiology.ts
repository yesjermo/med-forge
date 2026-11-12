import type { Course } from "../types";

/** Original sample content for a typical undergraduate Human Anatomy & Physiology course. */
export const anatomyPhysiology: Course = {
  id: "anatomy-physiology",
  code: "A&P",
  title: "Human Anatomy & Physiology",
  description:
    "Cardiovascular, respiratory and renal physiology for pre-med and biomedical science students: haemodynamics, gas exchange, kidney function and acid–base balance.",
  topics: ["Cardiovascular", "Respiratory", "Renal & acid–base"],

  concepts: [
    {
      slug: "cardiac-output",
      model: "sarcomere",
      title: "Cardiac output and blood pressure",
      topic: "Cardiovascular",
      summary: "Cardiac output is heart rate × stroke volume; mean arterial pressure is cardiac output × total peripheral resistance.",
      formulas: ["CO = HR \\times SV", "MAP \\approx DBP + \\tfrac{1}{3}(SBP - DBP)", "MAP = CO \\times TPR"],
      body: `Cardiac output (CO) is the volume of blood each ventricle pumps per minute:

$$ CO = HR \\times SV $$

A resting adult with HR 70 beats/min and SV 70 mL has CO ≈ 4.9 L/min.

Stroke volume depends on:
- **Preload**: ventricular stretch at the end of diastole (end-diastolic volume)
- **Contractility**: force of contraction at a given preload (raised by sympathetic stimulation)
- **Afterload**: the pressure the ventricle must overcome to eject blood

**Frank–Starling mechanism:** within limits, a more-stretched ventricle contracts more forcefully, so stroke volume rises with venous return.

Mean arterial pressure (MAP) drives organ perfusion. Because diastole lasts longer than systole at rest:

$$ MAP \\approx DBP + \\tfrac{1}{3}(SBP - DBP) $$

Pulse pressure is $SBP - DBP$.`,
      pearls: [
        "A MAP below about 65 mmHg is a common bedside threshold for inadequate organ perfusion.",
        "Haemorrhage lowers preload, so stroke volume falls and heart rate rises to defend cardiac output.",
        "Beta-blockers lower heart rate and contractility, which is why they reduce cardiac workload.",
      ],
    },
    {
      slug: "cardiac-cycle",
      title: "The cardiac cycle and heart sounds",
      topic: "Cardiovascular",
      summary: "Valves open and close on pressure differences; S1 is AV-valve closure, S2 is semilunar-valve closure.",
      body: `One cardiac cycle has four ventricular phases:
1. **Isovolumetric contraction**: AV valves close (S1) while the semilunar valves are still shut
2. **Ejection**: ventricular pressure exceeds aortic/pulmonary pressure and the semilunar valves open
3. **Isovolumetric relaxation**: semilunar valves close (S2) and both valve sets are shut
4. **Filling**: ventricular pressure drops below atrial pressure, the AV valves open, and the ventricles fill (atrial contraction adds the last ~20%)

Valves are passive: they move only because of pressure differences across them.

On an ECG, the QRS complex (ventricular depolarisation) comes just before ventricular contraction, and the T wave marks ventricular repolarisation.`,
      pearls: [
        "S1 is loudest at the apex (mitral area); S2 is loudest at the base (aortic and pulmonic areas).",
        "A murmur between S1 and S2 is systolic, e.g. aortic stenosis or mitral regurgitation.",
        "An S3 in an older adult can signal a volume-overloaded ventricle, as in heart failure.",
      ],
    },
    {
      slug: "oxygen-dissociation",
      model: "haemoglobin",
      title: "Oxygen–haemoglobin dissociation curve",
      topic: "Respiratory",
      summary: "The curve is sigmoid; a right shift (more CO₂, acid, heat, 2,3-BPG) unloads more oxygen to tissues.",
      body: `Each haemoglobin molecule carries up to four O₂ molecules. Binding is **cooperative**: once one O₂ binds, the next binds more easily, giving a sigmoid curve of saturation against $P_{O_2}$.

Key points on the curve:
- $P_{O_2}$ ≈ 100 mmHg (arterial) → saturation ≈ 97–98%
- $P_{O_2}$ ≈ 40 mmHg (mixed venous) → saturation ≈ 75%
- $P_{50}$ (half-saturated) ≈ 27 mmHg

**Right shift** (lower affinity, more unloading): ↑$P_{CO_2}$, ↑H⁺ (↓pH, the Bohr effect), ↑temperature, ↑2,3-BPG. This is what happens in exercising muscle.

**Left shift** (higher affinity): the opposite conditions, fetal haemoglobin, and carbon monoxide.`,
      pearls: [
        "Pulse oximetry can read near-normal in carbon monoxide poisoning, because it can't tell carboxyhaemoglobin from oxyhaemoglobin.",
        "On the flat top of the curve, a fall in arterial PO₂ from 100 to 80 mmHg barely changes saturation.",
      ],
    },
    {
      slug: "alveolar-ventilation",
      title: "Minute and alveolar ventilation",
      topic: "Respiratory",
      summary: "Only air that reaches the alveoli takes part in gas exchange; dead space doesn't.",
      formulas: ["\\dot V_E = V_T \\times RR", "\\dot V_A = (V_T - V_D) \\times RR"],
      body: `**Minute ventilation** is all the air moved per minute:

$$ \\dot V_E = V_T \\times RR $$

**Alveolar ventilation** excludes the anatomical dead space ($V_D$ ≈ 150 mL in an adult: airways that conduct air but don't exchange gas):

$$ \\dot V_A = (V_T - V_D) \\times RR $$

With $V_T$ = 500 mL, $V_D$ = 150 mL and RR = 12/min, $\\dot V_A$ = 4,200 mL/min.

Arterial $P_{CO_2}$ is inversely proportional to alveolar ventilation: double the alveolar ventilation and $P_{aCO_2}$ roughly halves.`,
      pearls: [
        "Rapid shallow breathing can move a lot of air yet ventilate the alveoli poorly, because each breath spends a larger share on dead space.",
        "Hypoventilation (e.g. opioid overdose) raises PaCO₂ and causes respiratory acidosis.",
      ],
    },
    {
      slug: "renal-clearance",
      title: "Renal clearance and GFR",
      topic: "Renal & acid–base",
      summary: "Clearance is the plasma volume cleared of a substance per minute; inulin clearance equals GFR.",
      formulas: ["C_x = \\dfrac{U_x \\times \\dot V}{P_x}"],
      body: `The **clearance** of a substance $x$ is the volume of plasma completely cleared of it per minute:

$$ C_x = \\frac{U_x \\times \\dot V}{P_x} $$

where $U_x$ is urine concentration, $\\dot V$ urine flow rate and $P_x$ plasma concentration.

**Glomerular filtration rate (GFR)** is about 125 mL/min (≈ 180 L/day) in a healthy young adult.

- **Inulin** is freely filtered and neither reabsorbed nor secreted, so its clearance equals GFR.
- **Creatinine** is produced steadily by muscle and is mostly filtered (slightly secreted), so it's the practical estimate of GFR.
- If $C_x$ < GFR the substance is net reabsorbed (e.g. glucose, normally ~0); if $C_x$ > GFR it's net secreted (e.g. para-aminohippurate, PAH).`,
      pearls: [
        "Serum creatinine roughly doubles when GFR halves, so a 'small' rise can mean a large loss of function.",
        "Glucose appears in urine once plasma glucose exceeds the transport maximum, which is why uncontrolled diabetes causes glycosuria and polyuria.",
      ],
    },
    {
      slug: "acid-base",
      model: "carbonic-acid",
      title: "Acid–base balance and blood gases",
      topic: "Renal & acid–base",
      summary: "pH depends on the bicarbonate/CO₂ ratio; lungs adjust CO₂ in minutes, kidneys adjust bicarbonate over days.",
      formulas: ["pH = 6.1 + \\log_{10}\\dfrac{[HCO_3^-]}{0.03 \\times P_{aCO_2}}"],
      body: `The bicarbonate buffer links pH, bicarbonate and $P_{aCO_2}$ (Henderson–Hasselbalch):

$$ pH = 6.1 + \\log_{10}\\frac{[HCO_3^-]}{0.03 \\times P_{aCO_2}} $$

Normal arterial values: pH 7.35–7.45, $P_{aCO_2}$ 35–45 mmHg, $HCO_3^-$ 22–26 mmol/L.

**Reading a blood gas**
1. Is the pH acidaemic (< 7.35) or alkalaemic (> 7.45)?
2. Which value explains it? A low $HCO_3^-$ with low pH → **metabolic acidosis**. A high $P_{aCO_2}$ with low pH → **respiratory acidosis**.
3. Is the other system compensating? In metabolic acidosis the lungs blow off CO₂ (low $P_{aCO_2}$).
4. In metabolic acidosis, calculate the **anion gap**: $Na^+ - (Cl^- + HCO_3^-)$, normally about 8–12 mmol/L.`,
      pearls: [
        "Deep, rapid 'Kussmaul' breathing is respiratory compensation for a severe metabolic acidosis such as diabetic ketoacidosis.",
        "Compensation brings pH towards normal but rarely all the way; a perfectly normal pH with abnormal CO₂ and bicarbonate suggests two disorders at once.",
        "High-anion-gap acidosis causes include ketoacidosis, lactic acidosis, kidney failure and some poisonings.",
      ],
    },
  ],

  lectures: [
    {
      id: "ap-l1",
      week: 2,
      title: "Cardiac output and the cardiac cycle",
      topic: "Cardiovascular",
      summary: "How the heart sets cardiac output, and how pressure changes drive valves and heart sounds.",
      notes: `- Cardiac output = heart rate × stroke volume; stroke volume is set by preload, contractility and afterload
- Frank–Starling: more filling → stronger contraction (within limits)
- Valves open and close on pressure differences; S1 = AV valves close, S2 = semilunar valves close
- MAP ≈ DBP + ⅓ pulse pressure; perfusion depends on MAP, not systolic pressure alone`,
      insights: [
        { type: "exam_tip", text: "Exams love asking which phase has all four valves closed: both isovolumetric phases.", conceptSlug: "cardiac-cycle" },
        { type: "clinical_link", text: "In septic shock, vasodilation drops TPR; MAP falls even if cardiac output rises.", conceptSlug: "cardiac-output" },
        { type: "intuition", text: "Think of Frank–Starling as a self-balancing pump: whatever comes back to the heart is pumped out.", conceptSlug: "cardiac-output" },
      ],
    },
    {
      id: "ap-l2",
      week: 5,
      title: "Ventilation and oxygen transport",
      topic: "Respiratory",
      summary: "Dead space, alveolar ventilation, and why the oxygen–haemoglobin curve is sigmoid.",
      notes: `- Alveolar ventilation = (tidal volume − dead space) × rate
- PaCO₂ tracks alveolar ventilation inversely
- Cooperative binding makes the O₂–Hb curve sigmoid; P50 ≈ 27 mmHg
- Right shift (CO₂, acid, heat, 2,3-BPG) unloads O₂ in active tissues`,
      insights: [
        { type: "exam_tip", text: "Remember the right-shift causes as 'CADET, face Right': CO₂, Acid, 2,3-DPG (BPG), Exercise, Temperature.", conceptSlug: "oxygen-dissociation" },
        { type: "clinical_link", text: "A patient breathing fast and shallow can still retain CO₂, because dead space takes a bigger share of each breath.", conceptSlug: "alveolar-ventilation" },
      ],
    },
    {
      id: "ap-l3",
      week: 8,
      title: "Kidney function and acid–base",
      topic: "Renal & acid–base",
      summary: "Clearance, GFR, and a step-by-step method for reading blood gases.",
      notes: `- Clearance C = (U × V) / P; inulin clearance = GFR ≈ 125 mL/min
- Creatinine is the everyday GFR marker
- Blood gas method: pH → primary cause → compensation → anion gap
- Lungs compensate in minutes; kidneys take days`,
      insights: [
        { type: "exam_tip", text: "Always state the primary disorder first, then the compensation; marks are often lost by naming only one.", conceptSlug: "acid-base" },
        { type: "clinical_link", text: "Diabetic ketoacidosis combines a high-anion-gap metabolic acidosis with Kussmaul breathing and dehydration.", conceptSlug: "acid-base" },
      ],
    },
  ],

  questions: [
    {
      id: "ap-q1",
      type: "numeric",
      topic: "Cardiovascular",
      difficulty: 1,
      prompt: "A resting adult has a heart rate of 70 beats/min and a stroke volume of 70 mL. What is the cardiac output in L/min?",
      answer: 4.9,
      tolerance: 0.05,
      unit: "L/min",
      hints: ["CO = HR × SV.", "Convert mL/min to L/min by dividing by 1,000."],
      explanation: "$CO = 70 \\times 70 = 4{,}900$ mL/min $= 4.9$ L/min.",
      concepts: ["cardiac-output"],
    },
    {
      id: "ap-q2",
      type: "numeric",
      topic: "Cardiovascular",
      difficulty: 1,
      prompt: "Blood pressure is 120/80 mmHg. Estimate the mean arterial pressure (mmHg).",
      answer: 93.3,
      tolerance: 0.5,
      unit: "mmHg",
      hints: ["MAP ≈ DBP + ⅓ (SBP − DBP).", "Pulse pressure here is 40 mmHg."],
      explanation: "$MAP \\approx 80 + \\tfrac{1}{3}(120 - 80) = 80 + 13.3 = 93.3$ mmHg.",
      concepts: ["cardiac-output"],
    },
    {
      id: "ap-q3",
      type: "mcq",
      topic: "Cardiovascular",
      difficulty: 1,
      prompt: "What causes the first heart sound (S1)?",
      options: [
        "Closure of the aortic and pulmonary valves",
        "Closure of the mitral and tricuspid valves",
        "Blood rushing into the ventricles in early diastole",
        "Atrial contraction against a stiff ventricle",
      ],
      answer: 1,
      hints: ["S1 marks the start of ventricular systole.", "Which valves must shut before the ventricle can build pressure?"],
      explanation:
        "S1 is closure of the atrioventricular (mitral and tricuspid) valves at the start of systole. Semilunar closure is S2; rapid filling can produce S3; atrial contraction against a stiff ventricle produces S4.",
      concepts: ["cardiac-cycle"],
    },
    {
      id: "ap-q4",
      type: "mcq",
      topic: "Respiratory",
      difficulty: 2,
      prompt: "Which change shifts the oxygen–haemoglobin dissociation curve to the right?",
      options: ["Lower PCO₂", "Higher blood pH", "Higher temperature", "Less 2,3-bisphosphoglycerate"],
      answer: 2,
      hints: ["A right shift helps active tissue take up oxygen.", "What does exercising muscle produce?"],
      explanation:
        "Heat lowers haemoglobin's affinity for O₂, shifting the curve right. The other three options all shift it left (higher affinity).",
      concepts: ["oxygen-dissociation"],
    },
    {
      id: "ap-q5",
      type: "numeric",
      topic: "Respiratory",
      difficulty: 2,
      prompt: "Tidal volume is 500 mL, anatomical dead space 150 mL and respiratory rate 12/min. What is alveolar ventilation (mL/min)?",
      answer: 4200,
      tolerance: 1,
      unit: "mL/min",
      hints: ["Subtract dead space from each breath first.", "$(V_T - V_D) \\times RR$"],
      explanation: "$(500 - 150) \\times 12 = 4{,}200$ mL/min. Minute ventilation would be 6,000 mL/min.",
      concepts: ["alveolar-ventilation"],
    },
    {
      id: "ap-q6",
      type: "numeric",
      topic: "Renal & acid–base",
      difficulty: 2,
      prompt:
        "Inulin is infused. Urine inulin is 30 mg/mL, urine flow 1 mL/min, and plasma inulin 0.25 mg/mL. What is the GFR (mL/min)?",
      answer: 120,
      tolerance: 0.5,
      unit: "mL/min",
      hints: ["Inulin clearance equals GFR.", "$C = U \\times V / P$"],
      explanation: "$C = (30 \\times 1) / 0.25 = 120$ mL/min, a normal GFR.",
      concepts: ["renal-clearance"],
    },
    {
      id: "ap-q7",
      type: "mcq",
      topic: "Renal & acid–base",
      difficulty: 3,
      prompt: "An arterial blood gas shows pH 7.30, PaCO₂ 30 mmHg, HCO₃⁻ 15 mmol/L. What is the best interpretation?",
      options: [
        "Respiratory acidosis with metabolic compensation",
        "Metabolic acidosis with respiratory compensation",
        "Metabolic alkalosis",
        "Mixed respiratory and metabolic alkalosis",
      ],
      answer: 1,
      hints: ["Is the pH low or high?", "Which value moved in the direction that explains the pH?"],
      explanation:
        "pH is low (acidaemia) and bicarbonate is low, so the primary problem is metabolic acidosis. PaCO₂ is low because the lungs are compensating by blowing off CO₂.",
      concepts: ["acid-base"],
    },
    {
      id: "ap-q8",
      type: "numeric",
      topic: "Renal & acid–base",
      difficulty: 3,
      prompt: "Using Henderson–Hasselbalch, find the pH when HCO₃⁻ is 24 mmol/L and PaCO₂ is 40 mmHg (to 2 decimal places).",
      answer: 7.4,
      tolerance: 0.02,
      unit: "",
      hints: ["Dissolved CO₂ = 0.03 × PaCO₂ = 1.2 mmol/L.", "$\\log_{10}(20) \\approx 1.30$"],
      explanation: "$pH = 6.1 + \\log_{10}(24 / 1.2) = 6.1 + \\log_{10} 20 = 6.1 + 1.30 = 7.40$.",
      concepts: ["acid-base"],
    },
  ],

  labs: [
    {
      id: "ap-lab-bp-exercise",
      title: "Blood pressure and heart rate response to exercise",
      topic: "Cardiovascular",
      objective:
        "Measure blood pressure by auscultation and heart rate at rest and after a 3-minute step test, then calculate pulse pressure and MAP.",
      safety: [
        "Participants confirm they have no known heart condition, asthma triggered by exercise, or recent injury. Anyone can stop at any time.",
        "Stop immediately if the participant reports chest pain, dizziness or severe breathlessness, and tell the instructor.",
        "Clean stethoscope earpieces and diaphragm with an alcohol wipe between users.",
        "Don't keep the cuff inflated for more than about a minute; release fully between readings.",
      ],
      materials: ["Aneroid sphygmomanometer with correctly sized cuff", "Stethoscope", "Step (about 30 cm) and a metronome", "Timer"],
      steps: [
        { text: "Seat the participant with back supported, feet flat and arm resting at heart level for 5 minutes.", why: "Posture and recent activity change readings." },
        { text: "Choose a cuff whose bladder covers about 80% of the upper-arm circumference and wrap it 2–3 cm above the elbow crease.", why: "A cuff that's too small over-reads blood pressure." },
        { text: "Palpate the radial pulse, inflate until it disappears, and note that pressure as the estimated systolic.", why: "Prevents missing an auscultatory gap." },
        { text: "Place the stethoscope over the brachial artery, inflate 20–30 mmHg above the estimate, then deflate at 2–3 mmHg per second." },
        { text: "Record systolic at the first clear tapping sound (Korotkoff phase I) and diastolic when sounds disappear (phase V)." },
        { text: "Count the radial pulse for 30 seconds and double it for resting heart rate." },
        { text: "Do the step test for 3 minutes at 24 steps/min, then immediately measure heart rate and blood pressure again." },
        { text: "Repeat measurements at 2 and 5 minutes of recovery." },
      ],
      drills: [
        { id: "d1", prompt: "Resting BP is 118/76 mmHg. What is the pulse pressure?", answer: 42, tolerance: 0.5, unit: "mmHg", working: "118 − 76 = 42 mmHg." },
        { id: "d2", prompt: "After exercise BP is 150/72 mmHg. Estimate MAP.", answer: 98, tolerance: 0.5, unit: "mmHg", working: "72 + ⅓(150 − 72) = 72 + 26 = 98 mmHg." },
        { id: "d3", prompt: "Heart rate rose from 72 to 126 beats/min. What is the percentage increase?", answer: 75, tolerance: 0.5, unit: "%", working: "(126 − 72) / 72 × 100 = 75%." },
      ],
      resultsGuide:
        "Expect systolic pressure and heart rate to rise with exercise while diastolic pressure stays similar or falls slightly (muscle vasodilation lowers peripheral resistance). Pulse pressure therefore widens. Values should return towards baseline within a few minutes.",
    },
  ],

  cases: [
    {
      id: "ap-case-dka",
      title: "A thirsty first-year who can't stop vomiting",
      topic: "Renal & acid–base",
      setting: "Campus health clinic. Educational simulation with a fictional patient.",
      presentation:
        "Jordan, 19, comes in with two days of nausea, vomiting and abdominal pain. They look unwell and are breathing deeply and quickly.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "Have you been unusually thirsty or urinating more than normal?", good: true, feedback: "\"Yes, for about two weeks. I'm up at night to pee and drinking litres of water.\"" },
            { text: "Have you lost weight recently?", good: true, feedback: "\"My jeans are loose. Maybe 4 kg in a month, without trying.\"" },
            { text: "Any family history of diabetes or autoimmune disease?", good: true, feedback: "\"My aunt has type 1 diabetes and my mum has a thyroid problem.\"" },
            { text: "Have you eaten anything unusual or travelled?", good: true, feedback: "\"No, just dining-hall food, and nobody else is sick.\" This makes food poisoning less likely." },
            { text: "What's your favourite subject?", good: false, feedback: "Friendly, but it won't help you narrow the diagnosis." },
            { text: "Do you play any musical instruments?", good: false, feedback: "Not relevant to this presentation." },
          ],
          debrief:
            "Polyuria, polydipsia and unintended weight loss are the classic triad of high blood glucose. Combined with vomiting and deep breathing, they point towards diabetic ketoacidosis rather than simple gastroenteritis.",
        },
        {
          title: "Examination",
          prompt: "What do you examine first?",
          mode: "multi",
          options: [
            { text: "Breathing pattern and breath odour", good: true, feedback: "Deep, rapid (Kussmaul) breathing; a fruity, acetone-like smell on the breath." },
            { text: "Hydration: mucous membranes, skin turgor, heart rate, blood pressure", good: true, feedback: "Dry mouth, reduced skin turgor, HR 118, BP 102/64." },
            { text: "Abdomen", good: true, feedback: "Diffusely tender without guarding or rebound; bowel sounds present." },
            { text: "Ear canals with an otoscope", good: false, feedback: "Normal, and not relevant to this presentation." },
            { text: "Knee reflexes", good: false, feedback: "Normal; doesn't change your next step." },
          ],
          debrief: "Kussmaul breathing and ketotic breath suggest metabolic acidosis from ketones. Tachycardia and dry membranes show significant dehydration.",
        },
        {
          title: "Investigations",
          prompt: "Which tests do you request now?",
          mode: "multi",
          options: [
            { text: "Fingerstick blood glucose", good: true, feedback: "412 mg/dL (22.9 mmol/L): markedly high." },
            { text: "Blood or urine ketones", good: true, feedback: "Blood β-hydroxybutyrate 5.2 mmol/L: high." },
            { text: "Venous blood gas", good: true, feedback: "pH 7.18, PCO₂ 22 mmHg, HCO₃⁻ 9 mmol/L." },
            { text: "Basic metabolic panel (electrolytes, creatinine)", good: true, feedback: "Na⁺ 131, K⁺ 5.6, Cl⁻ 98 mmol/L; creatinine mildly raised." },
            { text: "CT scan of the head", good: false, feedback: "Unnecessary radiation and delay; nothing suggests a neurological cause." },
            { text: "Throat swab", good: false, feedback: "There are no throat symptoms; this won't explain the picture." },
          ],
          debrief: "Anion gap = 131 − (98 + 9) = 24 mmol/L, which is high. High glucose, high ketones and a high-anion-gap acidosis together confirm the pattern.",
        },
        {
          title: "Interpret the blood gas",
          prompt: "pH 7.18, PCO₂ 22 mmHg, HCO₃⁻ 9 mmol/L. What is it?",
          mode: "single",
          options: [
            { text: "Metabolic acidosis with respiratory compensation", good: true, feedback: "Correct: low pH and low bicarbonate, with low PCO₂ from compensatory hyperventilation." },
            { text: "Respiratory acidosis", good: false, feedback: "PCO₂ is low, not high, so the lungs aren't causing the acidosis." },
            { text: "Metabolic alkalosis", good: false, feedback: "pH is below 7.35, so this is an acidaemia." },
            { text: "Normal blood gas", good: false, feedback: "pH 7.18 is severely low." },
          ],
          debrief: "The primary disorder is metabolic; deep breathing lowers PCO₂ to limit the fall in pH.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Diabetic ketoacidosis from new-onset type 1 diabetes", good: true, feedback: "Hyperglycaemia + ketosis + high-anion-gap metabolic acidosis in a young person with the classic triad." },
            { text: "Viral gastroenteritis", good: false, feedback: "It can cause vomiting, but not this glucose, ketone level or acidosis." },
            { text: "Panic attack with hyperventilation", good: false, feedback: "Hyperventilation alone causes respiratory alkalosis, not a metabolic acidosis." },
            { text: "Appendicitis", good: false, feedback: "Abdominal pain is common in DKA; the exam and labs explain it without appendicitis." },
          ],
          debrief: "DKA can be the first sign of type 1 diabetes. Insulin deficiency drives fat breakdown into ketone acids.",
        },
        {
          title: "First priority",
          prompt: "What comes first in management (in a supervised clinical setting)?",
          mode: "single",
          options: [
            { text: "Urgent transfer for IV fluid resuscitation, with close potassium monitoring before and during insulin", good: true, feedback: "Restoring circulating volume comes first; insulin follows, guided by potassium, because insulin drives K⁺ into cells." },
            { text: "Give a sugary drink", good: false, feedback: "Glucose is already very high; this would make it worse." },
            { text: "Send home with anti-nausea medicine", good: false, feedback: "DKA is a medical emergency and can be fatal without treatment." },
            { text: "Give sodium bicarbonate first", good: false, feedback: "Not routine first-line; acidosis usually resolves with fluids and insulin." },
          ],
          debrief: "Management follows local protocols: fluids, insulin, potassium replacement and monitoring, then finding the trigger. Specific doses are a clinician's decision.",
        },
      ],
      teachingPoints: [
        "Polyuria, polydipsia and weight loss in a young person: check glucose.",
        "Kussmaul breathing is the lungs compensating for metabolic acidosis.",
        "Calculate the anion gap in every metabolic acidosis.",
        "Potassium can read normal or high in DKA even though total-body potassium is low.",
      ],
    },
  ],

  skills: [
    {
      id: "ap-skill-bp",
      title: "Manual blood pressure measurement",
      purpose: "Accurate blood pressure underpins hypertension diagnosis and every set of vital signs.",
      items: [
        { text: "Performs hand hygiene and introduces self; confirms the patient's identity", critical: true },
        { text: "Explains the procedure and gains consent", critical: true },
        { text: "Seats the patient with back supported, legs uncrossed, after 5 minutes' rest" },
        { text: "Supports the bare arm at heart level" },
        { text: "Selects the correct cuff size (bladder ≈ 80% of arm circumference)", critical: true },
        { text: "Estimates systolic pressure by palpation first" },
        { text: "Inflates 20–30 mmHg above the estimate and deflates at 2–3 mmHg per second", critical: true },
        { text: "Records systolic (Korotkoff I) and diastolic (Korotkoff V) to the nearest 2 mmHg" },
        { text: "Explains the result to the patient in plain language" },
        { text: "Cleans equipment and performs hand hygiene" },
      ],
    },
  ],
};
