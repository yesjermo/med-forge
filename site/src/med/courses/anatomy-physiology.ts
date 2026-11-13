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
    {
      id: "ap-q9",
      type: "numeric",
      topic: "Cardiovascular",
      difficulty: 2,
      prompt:
        "The left ventricle has an end-diastolic volume of 120 mL and an end-systolic volume of 50 mL. What is the ejection fraction (%), to 1 decimal place?",
      answer: 58.3,
      tolerance: 0.5,
      unit: "%",
      hints: ["Stroke volume = EDV − ESV.", "Ejection fraction = SV / EDV × 100."],
      explanation:
        "$SV = 120 - 50 = 70$ mL, so $EF = 70 / 120 \\times 100 = 58.3\\%$. A resting ejection fraction of roughly 55–70% is normal; a low value suggests reduced contractility.",
      concepts: ["cardiac-output"],
    },
    {
      id: "ap-q10",
      type: "mcq",
      topic: "Cardiovascular",
      difficulty: 2,
      prompt:
        "Just after the second heart sound, left ventricular pressure is falling quickly but ventricular volume is not changing. Which phase of the cardiac cycle is this?",
      options: ["Isovolumetric contraction", "Rapid ejection", "Isovolumetric relaxation", "Rapid ventricular filling"],
      answer: 2,
      hints: ["S2 is closure of the semilunar valves.", "If volume is constant, every valve must be shut."],
      explanation:
        "After S2 the aortic valve has closed and the mitral valve hasn't yet opened, so the ventricle relaxes with all valves shut: isovolumetric relaxation. Filling starts once ventricular pressure drops below atrial pressure and the mitral valve opens.",
      concepts: ["cardiac-cycle"],
    },
    {
      id: "ap-q11",
      type: "numeric",
      topic: "Cardiovascular",
      difficulty: 3,
      prompt:
        "A patient's mean arterial pressure is 90 mmHg and cardiac output is 5 L/min. Ignoring right atrial pressure, what is the total peripheral resistance in mmHg·min/L?",
      answer: 18,
      tolerance: 0.1,
      unit: "mmHg·min/L",
      hints: ["$MAP = CO \\times TPR$", "Rearrange to $TPR = MAP / CO$."],
      explanation:
        "$TPR = 90 / 5 = 18$ mmHg·min/L. If vasodilation (as in sepsis) halved TPR with no change in cardiac output, MAP would halve too.",
      concepts: ["cardiac-output"],
    },
    {
      id: "ap-q12",
      type: "mcq",
      topic: "Cardiovascular",
      difficulty: 3,
      prompt: "A patient loses about a litre of blood. Which response best explains the tachycardia that follows?",
      options: [
        "Increased baroreceptor firing raises parasympathetic (vagal) tone to the heart",
        "Reduced baroreceptor firing increases sympathetic outflow and withdraws vagal tone",
        "A rise in preload stretches the ventricle and speeds the sinoatrial node",
        "Low blood oxygen content directly stimulates the sinoatrial node",
      ],
      answer: 1,
      hints: ["Baroreceptors in the carotid sinus and aortic arch sense stretch.", "What happens to arterial stretch when stroke volume and MAP fall?"],
      explanation:
        "Haemorrhage lowers venous return, preload and stroke volume, so MAP falls. The carotid and aortic baroreceptors fire less, the brainstem increases sympathetic drive and withdraws vagal tone, and heart rate and vasoconstriction rise to defend MAP. Preload falls, not rises.",
      concepts: ["cardiac-output"],
    },
    {
      id: "ap-q13",
      type: "numeric",
      topic: "Respiratory",
      difficulty: 1,
      prompt: "Tidal volume is 450 mL and respiratory rate is 16/min. What is the minute ventilation in L/min?",
      answer: 7.2,
      tolerance: 0.05,
      unit: "L/min",
      hints: ["$\\dot V_E = V_T \\times RR$", "Divide mL/min by 1,000 for L/min."],
      explanation: "$450 \\times 16 = 7{,}200$ mL/min $= 7.2$ L/min. Dead space is not subtracted for minute ventilation.",
      concepts: ["alveolar-ventilation"],
    },
    {
      id: "ap-q14",
      type: "mcq",
      topic: "Respiratory",
      difficulty: 1,
      prompt: "In a healthy person at rest, roughly what is the haemoglobin saturation of mixed venous blood (PO₂ about 40 mmHg)?",
      options: ["About 25%", "About 50%", "About 75%", "About 98%"],
      answer: 2,
      hints: ["The P50 (50% saturation) is about 27 mmHg.", "At rest, tissues extract only about a quarter of the oxygen delivered."],
      explanation:
        "At a PO₂ of about 40 mmHg haemoglobin is still about 75% saturated, so resting tissues take up only about a quarter of the oxygen delivered. That reserve is what exercising muscle draws on. 50% is the P50 point (about 27 mmHg) and 98% is arterial blood.",
      concepts: ["oxygen-dissociation"],
    },
    {
      id: "ap-q15",
      type: "numeric",
      topic: "Respiratory",
      difficulty: 3,
      prompt:
        "A patient has a PaCO₂ of 40 mmHg with an alveolar ventilation of 4.2 L/min. Sedation lowers alveolar ventilation to 2.8 L/min with unchanged CO₂ production. What is the new PaCO₂ (mmHg)?",
      answer: 60,
      tolerance: 0.5,
      unit: "mmHg",
      hints: ["PaCO₂ is inversely proportional to alveolar ventilation.", "New PaCO₂ = old PaCO₂ × (old ventilation / new ventilation)."],
      explanation:
        "$P_{aCO_2} = 40 \\times 4.2 / 2.8 = 40 \\times 1.5 = 60$ mmHg. A one-third fall in alveolar ventilation raises PaCO₂ by half, causing a respiratory acidosis.",
      concepts: ["alveolar-ventilation"],
    },
    {
      id: "ap-q16",
      type: "mcq",
      topic: "Respiratory",
      difficulty: 2,
      prompt:
        "Patient A breathes 500 mL × 12/min; patient B breathes 250 mL × 24/min. Both have an anatomical dead space of 150 mL. Which statement is correct?",
      options: [
        "A and B have the same minute and alveolar ventilation",
        "B has the same minute ventilation as A but much lower alveolar ventilation",
        "B has higher alveolar ventilation because it breathes faster",
        "A has the larger dead space because each breath is bigger",
      ],
      answer: 1,
      hints: ["Work out $V_T \\times RR$ for each first.", "Then subtract 150 mL from each breath before multiplying."],
      explanation:
        "Both move 6,000 mL/min. Alveolar ventilation is $(500 - 150) \\times 12 = 4{,}200$ mL/min for A but $(250 - 150) \\times 24 = 2{,}400$ mL/min for B, because dead space takes 60% of each of B's breaths. Anatomical dead space is fixed by the airways, not the breath size.",
      concepts: ["alveolar-ventilation"],
    },
    {
      id: "ap-q17",
      type: "numeric",
      topic: "Renal & acid–base",
      difficulty: 2,
      prompt: "A patient with metabolic acidosis has Na⁺ 138, Cl⁻ 100 and HCO₃⁻ 12 mmol/L. What is the anion gap (mmol/L)?",
      answer: 26,
      tolerance: 0.5,
      unit: "mmol/L",
      hints: ["Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻).", "Normal is about 8–12 mmol/L."],
      explanation:
        "$138 - (100 + 12) = 26$ mmol/L, a high anion gap. Unmeasured acid anions (for example ketones or lactate) have replaced bicarbonate.",
      concepts: ["acid-base"],
    },
    {
      id: "ap-q18",
      type: "mcq",
      topic: "Renal & acid–base",
      difficulty: 2,
      prompt: "GFR is 125 mL/min. A freely filtered substance has a renal clearance of 600 mL/min. What is the best conclusion?",
      options: [
        "It is net reabsorbed by the tubules",
        "It is neither reabsorbed nor secreted",
        "It is net secreted by the tubules",
        "It is not filtered at the glomerulus",
      ],
      answer: 2,
      hints: ["Compare the clearance with GFR.", "Filtration alone can only clear GFR's worth of plasma each minute."],
      explanation:
        "Filtration alone would clear 125 mL/min. Clearing 600 mL/min means the tubules must add more of it to the urine by secretion, as happens with para-aminohippurate (PAH). Clearance below GFR would mean net reabsorption; equal to GFR, as with inulin, would mean neither.",
      concepts: ["renal-clearance"],
    },
    {
      id: "ap-q19",
      type: "numeric",
      topic: "Renal & acid–base",
      difficulty: 3,
      prompt:
        "A 24-hour urine collection is 1,440 mL with a creatinine of 100 mg/dL. Plasma creatinine is 1.0 mg/dL. What is the creatinine clearance (mL/min)?",
      answer: 100,
      tolerance: 0.5,
      unit: "mL/min",
      hints: ["Convert the urine volume to a flow rate: there are 1,440 minutes in 24 hours.", "$C = U \\times \\dot V / P$; the mg/dL units cancel."],
      explanation:
        "$\\dot V = 1{,}440 / 1{,}440 = 1.0$ mL/min, so $C = (100 \\times 1.0) / 1.0 = 100$ mL/min. Because creatinine is slightly secreted, this slightly overestimates the true GFR.",
      concepts: ["renal-clearance"],
    },
    {
      id: "ap-q20",
      type: "mcq",
      topic: "Renal & acid–base",
      difficulty: 3,
      prompt:
        "A drowsy patient after an opioid overdose has pH 7.26, PaCO₂ 60 mmHg and HCO₃⁻ 26 mmol/L. What is the best interpretation?",
      options: [
        "Acute respiratory acidosis",
        "Chronic respiratory acidosis with full renal compensation",
        "Metabolic acidosis with respiratory compensation",
        "Respiratory alkalosis",
      ],
      answer: 0,
      hints: ["Which value explains the low pH?", "Kidneys take days to raise bicarbonate; how much has it changed here?"],
      explanation:
        "pH is low and PaCO₂ is high, so the primary disorder is respiratory acidosis from hypoventilation. Bicarbonate has barely risen (only buffering, no renal compensation yet), so it is acute. Check: $6.1 + \\log_{10}(26 / 1.8) \\approx 6.1 + 1.16 = 7.26$.",
      concepts: ["acid-base", "alveolar-ventilation"],
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
    {
      id: "ap-lab-spirometry",
      title: "Lung volumes, forced expiration and breathing pattern",
      topic: "Respiratory",
      objective:
        "Use a spirometer to measure tidal volume, vital capacity, FEV₁ and FVC, then compare minute and alveolar ventilation during normal and rapid shallow breathing.",
      safety: [
        "Don't take part if you have had recent chest, abdominal or eye surgery, a recent pneumothorax, a current chest infection, or uncontrolled asthma. Anyone can stop at any time.",
        "Use a new single-use mouthpiece with a bacterial–viral filter for every participant; never share mouthpieces.",
        "Stay seated for forced manoeuvres and paced breathing. Stop and breathe normally if you feel light-headed, tingly or dizzy, and tell the instructor.",
        "Clean the spirometer handset and nose clips with the approved disinfectant wipes between participants.",
      ],
      materials: [
        "Spirometer (electronic or bell) with single-use filtered mouthpieces",
        "Nose clip",
        "Metronome",
        "Timer",
        "Height measure for predicted values",
      ],
      steps: [
        { text: "Record the participant's age, sex and height, and enter them into the spirometer software or prediction table.", why: "Normal lung volumes depend on height, age and sex, so results are judged against predicted values." },
        { text: "Seat the participant upright with feet flat, fit the nose clip and seal the lips firmly around the mouthpiece.", why: "A leak at the nose or lips makes every volume under-read." },
        { text: "Breathe quietly for 1 minute. Record the average tidal volume and count the respiratory rate.", why: "Resting values are the baseline for the ventilation calculations, before any effortful breathing alters them." },
        { text: "From quiet breathing, breathe in as fully as possible, then breathe out slowly and completely to record the slow vital capacity.", why: "A slow manoeuvre measures vital capacity without the airway narrowing a forced blow can cause." },
        { text: "For the forced manoeuvre, breathe in fully, then blow out as hard and fast as possible and keep going for at least 6 seconds. Record FEV₁ and FVC.", why: "FEV₁ depends on a maximal start; continuing for 6 seconds lets the FVC reach its true end." },
        { text: "Repeat the forced manoeuvre until there are three acceptable blows, resting between them. The two best FEV₁ and FVC values should be within 150 mL.", why: "Repeatability shows the result reflects the lungs, not variable effort." },
        { text: "Breathe shallowly at 24 breaths/min with the metronome for 1 minute and record the average tidal volume, then return to normal breathing.", why: "Shows how dead space takes a bigger share of small breaths." },
      ],
      drills: [
        { id: "d1", prompt: "FEV₁ is 3.6 L and FVC is 4.5 L. What is the FEV₁/FVC ratio as a percentage?", answer: 80, tolerance: 0.5, unit: "%", working: "3.6 / 4.5 × 100 = 80%." },
        { id: "d2", prompt: "Inspiratory reserve volume is 3.0 L, tidal volume 0.5 L and expiratory reserve volume 1.2 L. What is the vital capacity?", answer: 4.7, tolerance: 0.05, unit: "L", working: "VC = IRV + VT + ERV = 3.0 + 0.5 + 1.2 = 4.7 L." },
        { id: "d3", prompt: "At rest, tidal volume is 500 mL and respiratory rate is 14/min. What is the minute ventilation?", answer: 7, tolerance: 0.05, unit: "L/min", working: "500 × 14 = 7,000 mL/min = 7.0 L/min." },
        { id: "d4", prompt: "During shallow breathing, tidal volume is 300 mL at 24/min with a dead space of 150 mL. What is the alveolar ventilation?", answer: 3600, tolerance: 1, unit: "mL/min", working: "(300 − 150) × 24 = 150 × 24 = 3,600 mL/min." },
        { id: "d5", prompt: "In the same shallow breaths, what percentage of each breath is dead space?", answer: 50, tolerance: 0.5, unit: "%", working: "150 / 300 × 100 = 50%. At a 500 mL breath it would be 30%." },
      ],
      resultsGuide:
        "In healthy adults FEV₁/FVC is usually above 70% (it falls slowly with age). A low ratio suggests airflow obstruction, as in asthma or COPD; a low FVC with a normal or high ratio suggests a restrictive pattern. During rapid shallow breathing, minute ventilation may stay similar or rise, but alveolar ventilation falls because a larger fraction of each breath stays in the dead space.",
    },
    {
      id: "ap-lab-water-load",
      title: "Urine flow and concentration after a water load",
      topic: "Renal & acid–base",
      objective:
        "Measure urine flow rate and specific gravity before and after drinking a water load, and use the results to explore clearance and how the kidney excretes excess water.",
      safety: [
        "Don't take part if you have a kidney or heart condition, are pregnant, or have been told to restrict fluids. Drink only the volume set by the instructor (no more than 1 litre over 15 minutes).",
        "Handle only your own urine sample. Wear gloves, keep containers capped, and dispose of urine in the designated toilet or sluice.",
        "Clean spills immediately with the approved disinfectant and wash hands after every collection.",
        "Stop and tell the instructor if you develop headache, nausea or confusion during the session.",
      ],
      materials: [
        "Lidded urine collection containers and a measuring cylinder",
        "Urinometer or refractometer for specific gravity",
        "Reagent strips for urinalysis",
        "Drinking water and a measuring jug",
        "Timer and gloves",
      ],
      steps: [
        { text: "Empty the bladder completely at time zero and discard this urine. Note the exact time.", why: "Each later sample then contains only urine made during a known interval." },
        { text: "Drink the water load over 15 minutes, then stay seated and avoid other drinks or caffeine.", why: "Posture, caffeine and extra fluid all change urine output and would confound the result." },
        { text: "Empty the bladder fully every 30 minutes for 2 hours. Measure each volume with the measuring cylinder.", why: "Volume divided by the collection time gives the urine flow rate." },
        { text: "Measure the specific gravity of each sample.", why: "Specific gravity tracks urine concentration: it falls as the kidney excretes free water." },
        { text: "Test each sample with a reagent strip and record any abnormal pads.", why: "Unexpected glucose, protein or blood is a finding to report, not part of the experiment." },
        { text: "Plot urine flow rate and specific gravity against time.", why: "The plot shows the delay before diuresis and its peak as ADH secretion is suppressed." },
      ],
      drills: [
        { id: "d1", prompt: "A participant passes 180 mL of urine in a 30-minute collection. What is the urine flow rate?", answer: 6, tolerance: 0.05, unit: "mL/min", working: "180 / 30 = 6.0 mL/min." },
        { id: "d2", prompt: "The four 30-minute collections are 150, 240, 210 and 120 mL after a 1,000 mL water load. What percentage of the load was excreted in 2 hours?", answer: 72, tolerance: 0.5, unit: "%", working: "150 + 240 + 210 + 120 = 720 mL; 720 / 1,000 × 100 = 72%." },
        { id: "d3", prompt: "During peak diuresis, urine creatinine is 0.2 mg/mL at a flow of 6 mL/min. Assume plasma creatinine is 0.01 mg/mL. What is the creatinine clearance?", answer: 120, tolerance: 0.5, unit: "mL/min", working: "C = (0.2 × 6) / 0.01 = 1.2 / 0.01 = 120 mL/min." },
        { id: "d4", prompt: "If GFR is 120 mL/min and urine flow is 6 mL/min, what percentage of the filtered fluid is excreted?", answer: 5, tolerance: 0.1, unit: "%", working: "6 / 120 × 100 = 5%; the tubules still reabsorb 95% of the filtrate even in a water diuresis." },
      ],
      resultsGuide:
        "Urine flow should start rising about 30 minutes after drinking, peak at around 60–90 minutes and then fall, while specific gravity falls from about 1.020 towards 1.005 or below. The water load dilutes plasma slightly, osmoreceptors cut ADH release, and the collecting ducts become less permeable to water. Creatinine clearance (an estimate of GFR) stays roughly constant: urine creatinine falls as flow rises, so U × V barely changes.",
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
    {
      id: "ap-case-opioid-hypoventilation",
      title: "Too sleepy after a hip replacement",
      topic: "Respiratory",
      setting: "Orthopaedic ward, early morning. Educational simulation with a fictional patient.",
      presentation:
        "Robin, 71, is on day 1 after a hip replacement and has opioid pain relief through a patient-controlled analgesia (PCA) pump. On the 6 a.m. observations Robin is very hard to wake and breathing slowly.",
      stages: [
        {
          title: "Initial assessment",
          prompt: "What do you check first?",
          mode: "multi",
          options: [
            { text: "Airway and breathing: respiratory rate, depth and pattern over a full minute", good: true, feedback: "Airway patent with soft snoring. Respiratory rate 7/min, shallow and regular." },
            { text: "Oxygen saturation", good: true, feedback: "SpO₂ 89% on room air." },
            { text: "Conscious level and pupils", good: true, feedback: "Opens eyes briefly to voice then drifts off. Pupils small (pinpoint) and equal." },
            { text: "Heart rate, blood pressure and capillary refill", good: true, feedback: "HR 64, BP 118/70, capillary refill 2 seconds." },
            { text: "Check the hip dressing for oozing before anything else", good: false, feedback: "Worth doing later, but airway and breathing come first; the dressing is dry." },
            { text: "Ask what Robin would like for breakfast", good: false, feedback: "Robin can't stay awake to answer, and it doesn't help the assessment." },
          ],
          debrief:
            "Slow, shallow breathing, low saturation, pinpoint pupils and reduced consciousness in a patient using opioids is the classic picture of opioid toxicity. An ABCDE approach keeps the priorities in order.",
        },
        {
          title: "Immediate actions",
          prompt: "Which actions do you take now?",
          mode: "multi",
          options: [
            { text: "Call for urgent help and escalate according to the early warning score", good: true, feedback: "The score is high; the outreach team and doctor are on their way." },
            { text: "Open the airway and give oxygen, with saturations monitored", good: true, feedback: "A head-tilt chin-lift stops the snoring and saturations rise slowly." },
            { text: "Stop the PCA pump and keep the button out of reach, as the local protocol directs", good: true, feedback: "No further opioid is delivered while Robin is assessed." },
            { text: "Prepare the opioid antagonist prescribed for this situation, following the local protocol", good: true, feedback: "The team gives it in small titrated amounts; Robin becomes rousable and breathing improves." },
            { text: "Let Robin sleep; the surgery was tiring", good: false, feedback: "A respiratory rate of 7 with low saturations is a medical emergency, not normal sleep." },
            { text: "Give a sedative so Robin rests comfortably", good: false, feedback: "Another sedative would deepen the respiratory depression further." },
          ],
          debrief:
            "Treat the airway and breathing, stop the cause and get help early. Reversal agents are titrated so that breathing recovers without abruptly removing all pain relief.",
        },
        {
          title: "Investigations",
          prompt: "Which tests are most useful now?",
          mode: "multi",
          options: [
            { text: "Arterial blood gas", good: true, feedback: "On room air before oxygen: pH 7.25, PaCO₂ 62 mmHg, HCO₃⁻ 26 mmol/L, PaO₂ 58 mmHg." },
            { text: "Capillary blood glucose", good: true, feedback: "6.1 mmol/L: normal, so hypoglycaemia isn't causing the drowsiness." },
            { text: "Review the PCA history and the drug chart", good: true, feedback: "Many more PCA doses were delivered overnight than on the previous evening, and a sedating antihistamine was also given." },
            { text: "Lipid profile", good: false, feedback: "Doesn't explain acute drowsiness or change management." },
            { text: "Bone density scan", good: false, feedback: "Irrelevant to the emergency." },
          ],
          debrief:
            "The blood gas confirms what the bedside suggests. A glucose check is quick and rules out a treatable mimic, and the drug chart shows why toxicity has developed.",
        },
        {
          title: "Interpret the blood gas",
          prompt: "pH 7.25, PaCO₂ 62 mmHg, HCO₃⁻ 26 mmol/L. What is it?",
          mode: "single",
          options: [
            { text: "Acute respiratory acidosis", good: true, feedback: "Correct: low pH from a high PaCO₂, with bicarbonate barely raised because the kidneys haven't had time to compensate." },
            { text: "Metabolic acidosis with respiratory compensation", good: false, feedback: "Bicarbonate is normal and PaCO₂ is high, so the problem is respiratory." },
            { text: "Chronic respiratory acidosis with full compensation", good: false, feedback: "Full renal compensation would take days and would bring bicarbonate well above 30 mmol/L." },
            { text: "Respiratory alkalosis", good: false, feedback: "pH is below 7.35, so this is an acidaemia." },
          ],
          debrief:
            "Check with Henderson–Hasselbalch: 6.1 + log₁₀(26 / 1.86) ≈ 7.25. Hypoventilation causes both the raised PaCO₂ and the hypoxaemia.",
        },
        {
          title: "Mechanism",
          prompt: "Robin's tidal volume is about 250 mL at 7 breaths/min. Why has PaCO₂ risen so much?",
          mode: "single",
          options: [
            { text: "Opioids depress the brainstem respiratory centre, and alveolar ventilation falls to about 700 mL/min", good: true, feedback: "(250 − 150) × 7 = 700 mL/min, about a sixth of normal, so CO₂ accumulates." },
            { text: "Pneumonia has created a shunt in the lungs", good: false, feedback: "A shunt mainly lowers PaO₂; PaCO₂ is usually normal or low because breathing increases." },
            { text: "The kidneys are retaining acid", good: false, feedback: "Bicarbonate is normal; the kidneys aren't the cause." },
            { text: "Haemoglobin is binding too much CO₂", good: false, feedback: "Haemoglobin carriage doesn't raise PaCO₂; reduced alveolar ventilation does." },
          ],
          debrief:
            "PaCO₂ is inversely proportional to alveolar ventilation. Small breaths at a slow rate ventilate the alveoli very poorly, because dead space takes most of each breath.",
        },
        {
          title: "Ongoing care",
          prompt: "Robin is now awake with a respiratory rate of 14. What is the most important next step?",
          mode: "single",
          options: [
            { text: "Keep monitoring closely, because the antagonist may wear off before the opioid and sedation can return", good: true, feedback: "Correct: the reversal agent's effect is often shorter than the opioid's, so frequent observations continue." },
            { text: "Restart the PCA at the previous settings straight away", good: false, feedback: "The prescription needs a medical review first; restarting unchanged risks a repeat." },
            { text: "Return to four-hourly observations now Robin is awake", good: false, feedback: "Too soon: re-sedation can happen within the hour." },
          ],
          debrief:
            "Re-sedation is a known risk. The team reviews analgesia (including non-opioid options), stops other sedating drugs and documents the event.",
        },
      ],
      teachingPoints: [
        "Count respiratory rate over a full minute; a falling rate is an early warning of opioid toxicity.",
        "Opioid toxicity: reduced consciousness, slow shallow breathing, pinpoint pupils.",
        "Hypoventilation raises PaCO₂ and causes an acute respiratory acidosis with a near-normal bicarbonate.",
        "After reversal, keep watching: the antagonist can wear off before the opioid.",
      ],
    },
    {
      id: "ap-case-gi-bleed",
      title: "Black stools and a racing pulse",
      topic: "Cardiovascular",
      setting: "Emergency department. Educational simulation with a fictional patient.",
      presentation:
        "Sam, 58, arrives after fainting at home. They have passed black, tarry stools since yesterday and vomited once with dark material like coffee grounds. They look pale and sweaty.",
      stages: [
        {
          title: "Primary assessment",
          prompt: "What do you assess or ask first?",
          mode: "multi",
          options: [
            { text: "Heart rate, blood pressure and capillary refill", good: true, feedback: "HR 124, BP 92/60 mmHg, capillary refill 4 seconds, cool hands." },
            { text: "Respiratory rate, SpO₂ and conscious level", good: true, feedback: "RR 24/min, SpO₂ 97% on air, alert but anxious." },
            { text: "Medicines, especially anti-inflammatory painkillers and anticoagulants", good: true, feedback: "\"I've been taking ibuprofen most days for my back for a month.\"" },
            { text: "Alcohol intake and any known liver disease", good: true, feedback: "\"A couple of pints at the weekend. No liver problems that I know of.\"" },
            { text: "Ask about holiday plans", good: false, feedback: "Not relevant to a patient who may be bleeding." },
            { text: "Test visual acuity", good: false, feedback: "Doesn't help with the immediate problem." },
          ],
          debrief:
            "Melaena (black, tarry stool) and coffee-ground vomiting point to upper gastrointestinal bleeding. Regular NSAID use is a common cause of peptic ulcer bleeding.",
        },
        {
          title: "Interpret the vital signs",
          prompt: "BP 92/60 gives a MAP of about 71 mmHg. Which mechanism best explains the heart rate of 124 and the cool peripheries?",
          mode: "single",
          options: [
            { text: "Reduced baroreceptor firing increases sympathetic drive, raising heart rate and constricting skin vessels", good: true, feedback: "Correct: the reflex defends MAP by raising cardiac output and peripheral resistance." },
            { text: "Increased vagal tone from the vomiting", good: false, feedback: "Vagal activation slows the heart; it wouldn't cause a tachycardia." },
            { text: "Fever from infection", good: false, feedback: "There is no fever, and cool peripheries argue against early sepsis." },
            { text: "Anxiety alone", good: false, feedback: "Anxiety can raise heart rate but doesn't explain low blood pressure, a slow capillary refill and fainting." },
          ],
          debrief:
            "Blood loss lowers venous return, preload and stroke volume. The baroreflex keeps MAP near a perfusing level by raising heart rate and TPR. A shock index (HR / SBP) of 124 / 92 ≈ 1.3 is well above the normal value of under about 0.7, suggesting substantial loss.",
        },
        {
          title: "Immediate management",
          prompt: "Which actions do you take now (in a supervised clinical setting)?",
          mode: "multi",
          options: [
            { text: "Call senior help and follow the local major haemorrhage or GI bleed pathway", good: true, feedback: "The team is alerted and the endoscopy service is contacted." },
            { text: "Insert two wide-bore cannulae and send bloods, including group and crossmatch", good: true, feedback: "Access secured; samples sent." },
            { text: "Start fluid and blood product resuscitation as the team directs", good: true, feedback: "Resuscitation starts with close monitoring of the response." },
            { text: "Keep the patient nil by mouth and monitor urine output", good: true, feedback: "Ready for endoscopy; a fall in urine output is an early sign of poor renal perfusion." },
            { text: "Walk the patient to the toilet to collect a stool sample", good: false, feedback: "Sam has already fainted; standing could cause another collapse." },
            { text: "Give medicine to lower the blood pressure", good: false, feedback: "Blood pressure is already low; lowering it further would worsen perfusion." },
          ],
          debrief:
            "Restore circulating volume while arranging the definitive treatment, usually endoscopy to find and stop the bleeding. Specific products and volumes follow local protocols and senior decisions.",
        },
        {
          title: "Investigations",
          prompt: "Which results matter most at this stage?",
          mode: "multi",
          options: [
            { text: "Full blood count", good: true, feedback: "Haemoglobin 118 g/L: only slightly low." },
            { text: "Urea and electrolytes", good: true, feedback: "Urea raised out of proportion to creatinine." },
            { text: "Venous lactate", good: true, feedback: "4.1 mmol/L: raised, showing tissues are underperfused." },
            { text: "Clotting screen", good: true, feedback: "Normal; Sam isn't on an anticoagulant." },
            { text: "Thyroid function tests", good: false, feedback: "Won't change emergency management." },
          ],
          debrief:
            "Haemoglobin can look near normal early in an acute bleed because red cells and plasma are lost together; it falls as fluid moves into the circulation. Digested blood is absorbed as protein, which raises urea. A raised lactate reflects anaerobic metabolism in poorly perfused tissue.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Hypovolaemic shock from an upper GI bleed, probably a peptic ulcer", good: true, feedback: "Melaena, coffee-ground vomit, NSAID use, tachycardia, hypotension and a raised lactate fit together." },
            { text: "Cardiogenic shock", good: false, feedback: "There are no cardiac symptoms and the history points to blood loss; cardiogenic shock would usually show signs of fluid overload." },
            { text: "Septic shock", good: false, feedback: "There is no fever or infective source, and the peripheries are cool rather than warm." },
            { text: "Simple vasovagal faint", good: false, feedback: "A faint is followed by a slow pulse and quick recovery, not persistent tachycardia and hypotension." },
          ],
          debrief:
            "Shock means inadequate tissue perfusion. Here the cause is reduced circulating volume, so preload, stroke volume and cardiac output all fall.",
        },
        {
          title: "Is resuscitation working?",
          prompt: "Which findings would show Sam is responding?",
          mode: "multi",
          options: [
            { text: "Heart rate falling towards normal", good: true, feedback: "As preload returns, the baroreflex no longer needs to drive the heart so hard." },
            { text: "MAP staying above about 65 mmHg", good: true, feedback: "Organ perfusion pressure is being maintained." },
            { text: "Urine output recovering", good: true, feedback: "The kidneys are being perfused again." },
            { text: "Lactate falling on repeat testing", good: true, feedback: "Tissue perfusion is improving." },
            { text: "Haemoglobin rising straight after salt-water fluids", good: false, feedback: "Crystalloid dilutes the blood, so haemoglobin usually falls, not rises." },
            { text: "Pulse pressure narrowing further", good: false, feedback: "A narrowing pulse pressure suggests falling stroke volume, a sign of worsening shock." },
          ],
          debrief:
            "Judge the response by the trend in heart rate, MAP, capillary refill, urine output, lactate and conscious level, not by one value.",
        },
      ],
      teachingPoints: [
        "Melaena and coffee-ground vomiting suggest upper GI bleeding; ask about NSAIDs and anticoagulants.",
        "Tachycardia and cool peripheries are the baroreflex defending MAP; hypotension is a late sign.",
        "Early haemoglobin can be falsely reassuring in acute haemorrhage.",
        "Track the response to resuscitation with heart rate, MAP, urine output and lactate.",
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
    {
      id: "ap-skill-resp-obs",
      title: "Respiratory rate and pulse oximetry",
      purpose: "A rising or falling respiratory rate is often the earliest sign of deterioration, and SpO₂ needs reading in context.",
      items: [
        { text: "Performs hand hygiene and introduces self; confirms the patient's identity", critical: true },
        { text: "Explains that you'll check oxygen levels and gains consent" },
        { text: "Counts the respiratory rate for a full 60 seconds without telling the patient they're being watched", critical: true },
        { text: "Notes depth, pattern and regularity of breathing, and any use of accessory muscles" },
        { text: "Chooses a warm, well-perfused finger, removing nail varnish or false nails if needed" },
        { text: "Waits for a steady reading and a good waveform before recording SpO₂", critical: true },
        { text: "Records SpO₂ together with the inspired oxygen (room air or the device and flow rate)", critical: true },
        { text: "Recognises limits: poor perfusion, movement, and carbon monoxide poisoning can give misleading readings" },
        { text: "Calculates the early warning score and escalates abnormal values according to local policy", critical: true },
        { text: "Cleans the probe and performs hand hygiene" },
      ],
    },
    {
      id: "ap-skill-urinalysis",
      title: "Urinalysis with a reagent strip",
      purpose: "A dipstick is a quick bedside screen for glucose, ketones, blood, protein and signs of infection.",
      items: [
        { text: "Performs hand hygiene and puts on gloves; confirms the patient's identity", critical: true },
        { text: "Explains the test and how to collect a midstream sample in a clean container" },
        { text: "Checks the strips are in date and the container has been kept closed", critical: true },
        { text: "Notes the urine's colour, clarity and odour" },
        { text: "Dips the strip briefly so all pads are wet, then removes excess along the container edge" },
        { text: "Holds the strip horizontal so reagents don't run between pads" },
        { text: "Reads each pad against the colour chart at the time stated by the manufacturer", critical: true },
        { text: "Records results accurately with date and time, and labels any sample sent to the laboratory" },
        { text: "Reports abnormal results (for example glucose with ketones, blood or protein) to the responsible clinician", critical: true },
        { text: "Disposes of urine, strip and gloves safely, and performs hand hygiene" },
      ],
    },
  ],
};
