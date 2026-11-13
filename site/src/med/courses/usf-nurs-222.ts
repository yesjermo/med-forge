import type { Course } from "../types";

/**
 * Original study content aligned with USF School of Nursing & Health Professions NURS 222
 * (Applied Assessment & Nursing Fundamentals). Only the code and title are taken from the
 * curriculum; topics are typical of a first-semester BSN assessment and fundamentals course.
 */
export const usfNurs222: Course = {
  id: "usf-nurs-222",
  code: "NURS 222",
  title: "Applied Assessment & Nursing Fundamentals",
  description:
    "Study pack aligned with USF's NURS 222 (Applied Assessment & Nursing Fundamentals) in the first BSN semester: the nursing process and clinical judgment, vital signs, health history and head-to-toe assessment, heart and lung sounds, pain assessment, infection prevention, safety and pressure-injury risk, and SBAR handoff. Topics are typical for this kind of course, so check your own syllabus. Not affiliated with or endorsed by the University of San Francisco. Always follow your program's and clinical agency's policies; reference ranges vary by agency.",
  topics: [
    "Nursing process & clinical judgment",
    "Vital signs",
    "Health history & physical assessment",
    "Cardiovascular & respiratory assessment",
    "Pain assessment",
    "Infection prevention",
    "Safety, falls & pressure injury",
    "Documentation & handoff",
  ],

  concepts: [
    {
      slug: "n222-nursing-process",
      title: "The nursing process (ADPIE), clinical judgment and prioritisation",
      topic: "Nursing process & clinical judgment",
      summary:
        "ADPIE (assess, diagnose, plan, implement, evaluate) is the cycle nurses use to turn data into care; clinical judgment adds recognising cues, forming hypotheses and acting first on threats to airway, breathing and circulation.",
      body: `The **nursing process** is a cycle, not a checklist. Each pass through it ends with evaluation, which feeds the next assessment.
1. **Assess**: collect subjective data (what the patient tells you) and objective data (what you observe, measure or read in the chart).
2. **Diagnose**: cluster the data and name the patient's response to a health problem, e.g. *Impaired gas exchange* or *Risk for falls*. A nursing diagnosis describes a response nurses can treat, not a medical disease.
3. **Plan**: set patient-centred goals that are specific, measurable and time-bound ("Patient will walk 20 m in the hallway with a walker by day 2"), then choose interventions.
4. **Implement**: carry out independent (nurse-initiated), dependent (provider-ordered) and collaborative interventions.
5. **Evaluate**: compare the patient's response with the goal: met, partly met or not met. Then revise the plan.

**Clinical judgment** is the thinking inside that loop. The NCSBN Clinical Judgment Measurement Model, used for the Next Generation NCLEX, breaks it into six steps: recognise cues, analyse cues, prioritise hypotheses, generate solutions, take action, evaluate outcomes.

**Prioritisation frameworks** you will use constantly:
- **ABCs**: airway, then breathing, then circulation
- **Maslow**: physiological needs and safety come before love/belonging and esteem
- **Acute over chronic**, **unstable over stable**, **actual over potential** problems
- **Unexpected over expected** findings: a new finding that doesn't fit the patient's condition matters more than one that does

> When in doubt in an NCLEX-style question, look for the option that **assesses** first, unless the patient is in obvious danger and needs immediate action.

**Delegation** to unlicensed assistive personnel (UAP): an RN can delegate routine, stable tasks such as vital signs on a stable patient, hygiene and ambulation, but keeps **assessment, teaching, evaluation and nursing judgment**. The five rights of delegation are right task, circumstance, person, directions/communication and supervision/evaluation.`,
      pearls: [
        "A goal like 'patient will understand diabetes' can't be evaluated; 'patient will demonstrate insulin pen technique correctly before discharge' can.",
        "A UAP can measure a stable patient's vital signs, but interpreting an abnormal value and deciding what to do is the nurse's job.",
        "A change from the patient's own baseline is often more important than whether a value sits inside the textbook range.",
      ],
    },
    {
      slug: "n222-vital-signs",
      model: "haemoglobin",
      title: "Vital signs: technique, normal adult ranges and what changes them",
      topic: "Vital signs",
      summary:
        "Temperature, pulse, respirations, blood pressure, oxygen saturation and pain are measured with a consistent technique and read against the patient's baseline and typical adult ranges.",
      formulas: [
        "\\text{MAP} \\approx \\dfrac{\\text{SBP} + 2 \\times \\text{DBP}}{3}",
        "\\text{Pulse pressure} = \\text{SBP} - \\text{DBP}",
        "\\text{Pulse deficit} = \\text{apical rate} - \\text{radial rate}",
      ],
      body: `**Typical resting adult ranges** (agencies and textbooks differ slightly; use your agency's values):
- **Temperature**: about 36.1–37.2 °C (97–99 °F) oral; fever is commonly defined as 38.0 °C (100.4 °F) or higher
- **Pulse**: 60–100 beats/min, regular, 2+ (normal) strength
- **Respirations**: 12–20 breaths/min, even and unlaboured
- **Blood pressure**: normal is below 120/80 mmHg (ACC/AHA 2017: elevated 120–129 systolic with diastolic below 80; stage 1 hypertension 130–139 or 80–89; stage 2 140/90 or higher)
- **SpO₂**: 95–100% on room air for most healthy adults; some patients with chronic lung disease have a prescribed lower target such as 88–92%

**Technique points**
- **Temperature route matters**: rectal and core readings run about 0.5 °C higher than oral; axillary runs about 0.5 °C lower. Wait about 15–30 minutes after the patient eats, drinks or smokes before an oral reading.
- **Pulse**: count a regular radial pulse for 30 s and double it; count for a **full 60 s** if it is irregular, if the patient is new to you, or when taking an apical pulse. An apical rate higher than the radial rate is a **pulse deficit**: some beats are too weak to reach the wrist.
- **Respirations**: count straight after the pulse while your fingers stay on the wrist, so the patient doesn't change their breathing because they know they're being watched. Note depth, rhythm and effort (accessory muscles, nasal flaring, tripod position).
- **Blood pressure**: the right cuff size and position matter more than the device (see the skill checklist). **MAP** of about 65 mmHg or more is usually needed to perfuse the kidneys, brain and heart.
- **SpO₂**: a pulse oximeter compares the red and infrared light absorbed by oxygenated and deoxygenated **haemoglobin**. Cold fingers, poor perfusion, movement, dark nail polish and carbon monoxide can all give misleading readings; check that the waveform or pulse rate on the device matches the patient's pulse.

**Factors that change vital signs**: age, exercise, pain, anxiety, fever, dehydration and blood loss (raise HR), medications (beta blockers lower HR; opioids lower RR), circadian rhythm (temperature lowest in the early morning), smoking and caffeine (raise BP and HR).

**Orthostatic (postural) hypotension**: a fall of **20 mmHg or more systolic** or **10 mmHg or more diastolic** within 3 minutes of standing, often with dizziness. It is a common cause of falls.`,
      pearls: [
        "Rising respiratory rate is often the earliest and most-missed sign of deterioration; count it for real rather than estimating.",
        "A falling blood pressure is a late sign of shock in adults: the heart rate usually rises first to compensate.",
        "Pulse oximetry can read falsely high in carbon monoxide poisoning because carboxyhaemoglobin absorbs light like oxyhaemoglobin.",
        "Always compare with the patient's baseline: 110/70 may be normal for one person and a serious drop for someone who usually runs 160/90.",
      ],
    },
    {
      slug: "n222-health-history-head-to-toe",
      title: "Health history and the head-to-toe assessment",
      topic: "Health history & physical assessment",
      summary:
        "A focused, respectful history (including OLDCARTS for symptoms) guides a systematic head-to-toe examination using inspection, palpation, percussion and auscultation.",
      formulas: ["\\text{BMI} = \\dfrac{\\text{mass (kg)}}{\\text{height (m)}^2}"],
      body: `**Health history components**
- Biographical data and **chief complaint** in the patient's own words
- **History of present illness**, often with **OLDCARTS**: Onset, Location, Duration, Characteristics, Aggravating/Alleviating factors, Radiation, Timing, Severity
- Past medical and surgical history, **medications** (including over-the-counter drugs and supplements) and **allergies with the reaction**
- Family history, social history (living situation, substance use, occupation, support), and a review of systems

**Four techniques**, usually in this order: **inspection, palpation, percussion, auscultation**. The exception is the **abdomen**: inspect, **auscultate**, percuss, then palpate, because touching the abdomen first can change bowel sounds.

**A head-to-toe sweep** (adapt to your program's form):
- **General survey**: level of consciousness, appearance, distress, hygiene, mood; orientation to person, place, time and situation
- **Head and neck**: pupils equal, round and reactive to light and accommodation (PERRLA); oral mucosa moist and pink; trachea midline
- **Skin**: colour, temperature, moisture, turgor, lesions and pressure points; capillary refill under about 2–3 seconds
- **Chest**: heart and lung sounds (next concept)
- **Abdomen**: shape, bowel sounds in all four quadrants, tenderness, last bowel movement
- **Genitourinary**: voiding pattern, urine colour, catheter if present
- **Extremities**: peripheral pulses (0 absent, 1+ weak, 2+ normal, 3+ increased, 4+ bounding), oedema, strength, sensation, range of motion
- **Lines, drains, wounds**: site, dressing, drainage colour and amount

**BMI** screens weight status: below 18.5 underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30 and above obesity. It doesn't separate muscle from fat.`,
      pearls: [
        "Always record the reaction, not just the allergen: 'penicillin – hives' is far more useful than 'penicillin'.",
        "Compare left with right on every bilateral finding; asymmetry is often the clue.",
        "New confusion in an older adult is a change in condition to report, not something to put down to age.",
      ],
    },
    {
      slug: "n222-cardio-resp-assessment",
      title: "Cardiovascular and respiratory assessment: heart and lung sounds",
      topic: "Cardiovascular & respiratory assessment",
      summary:
        "Listen to the heart at five landmarks (S1 is AV valve closure, S2 is semilunar closure) and to the lungs side to side, distinguishing normal breath sounds from crackles, wheezes, rhonchi, stridor and friction rubs.",
      body: `**Cardiac landmarks** ("APE To Man"):
- **Aortic**: 2nd intercostal space (ICS), right sternal border
- **Pulmonic**: 2nd ICS, left sternal border
- **Erb's point**: 3rd ICS, left sternal border
- **Tricuspid**: 4th ICS, left lower sternal border
- **Mitral (apex)**: 5th ICS, left midclavicular line, which is usually the point of maximal impulse (PMI)

**Heart sounds**
- **S1 ("lub")**: closure of the mitral and tricuspid valves at the start of systole; loudest at the apex; it happens at about the same time as the carotid pulse
- **S2 ("dub")**: closure of the aortic and pulmonic valves at the end of systole; loudest at the base
- **S3**: early diastole, just after S2; can be normal in children, young adults and pregnancy, but in older adults suggests a volume-overloaded ventricle such as heart failure
- **S4**: late diastole, just before S1; suggests a stiff ventricle, for example from long-standing hypertension
- **Murmurs**: a whooshing sound from turbulent flow, graded I to VI by loudness

**Normal breath sounds**
- **Vesicular**: soft and low-pitched over most of the lung fields; inspiration longer than expiration
- **Bronchovesicular**: medium pitch near the main bronchi; inspiration and expiration about equal
- **Bronchial**: loud and high-pitched over the trachea; expiration longer. Heard over the peripheral lung, it suggests consolidation.

**Adventitious sounds**
- **Crackles (rales)**: brief, discontinuous popping, often at the bases on inspiration; fluid or collapsed airways reopening (pneumonia, heart failure, atelectasis)
- **Wheezes**: continuous, musical, high-pitched, usually on expiration; narrowed airways (asthma, COPD)
- **Rhonchi**: low-pitched, snoring sounds from secretions in larger airways; may clear with coughing
- **Stridor**: loud, high-pitched, mostly inspiratory sound over the upper airway; **partial airway obstruction and an emergency**
- **Pleural friction rub**: grating sound that doesn't clear with coughing, from inflamed pleura

Listen with the diaphragm on bare skin, comparing side to side from apices to bases, front, sides and back, for at least one full breath at each spot.`,
      pearls: [
        "A silent chest in a patient having an asthma attack is ominous: too little air is moving to make a wheeze.",
        "New bibasilar crackles with rising weight and oedema point to fluid overload; report them along with intake and output.",
        "Listening through a gown adds noise that can mimic crackles; always auscultate on skin.",
      ],
    },
    {
      slug: "n222-pain-assessment",
      title: "Pain assessment and reassessment",
      topic: "Pain assessment",
      summary:
        "Pain is what the patient says it is. Use a validated scale suited to the patient (numeric, FACES, FLACC, PAINAD), describe it fully, and reassess after every intervention.",
      body: `Pain is subjective, so the **patient's self-report is the most reliable indicator**. Vital signs can rise with acute pain but often return to normal even while pain continues, so normal vital signs never rule pain out.

**Choose a scale that fits the patient**
- **Numeric rating scale (NRS)**: 0 (no pain) to 10 (worst imaginable) for adults who can self-report
- **Wong-Baker FACES**: faces from smiling to crying; useful for children about 3 and older and for language barriers
- **FLACC**: Face, Legs, Activity, Cry, Consolability, each scored 0–2 for a total of 0–10; for young children and others who can't self-report
- **PAINAD**: breathing, negative vocalisation, facial expression, body language and consolability, each 0–2; for adults with advanced dementia

**Describe the pain** with OLDCARTS or PQRST (Provoking/palliating, Quality, Region/radiation, Severity, Timing). Ask about the **patient's acceptable level** or comfort-function goal and how pain affects sleep, movement and mood.

**Types of pain**: acute versus chronic; nociceptive (somatic: sharp, localised; visceral: cramping, poorly localised, may be referred) versus neuropathic (burning, shooting, tingling).

**Non-pharmacological measures** include repositioning, splinting an incision with a pillow when coughing, heat or cold where ordered, distraction, relaxation breathing and a calm environment.

**Reassess** after every pain intervention at the time your agency's policy sets for that route (commonly 15–30 minutes after IV and 30–60 minutes after oral medication), and document both the score and the response. When reassessing after opioids, check **sedation level and respiratory rate** as well as the pain score.`,
      pearls: [
        "Increasing sedation comes before respiratory depression with opioids, so a sedation scale is checked along with the pain score.",
        "A patient laughing with visitors can still have severe pain; believe the report and assess function.",
        "Sudden severe pain that doesn't match the expected course (e.g. a calf after surgery or a tight cast) is a new problem to assess and report.",
      ],
    },
    {
      slug: "n222-infection-prevention",
      model: "bacterium",
      title: "Infection prevention: hand hygiene, PPE and precautions",
      topic: "Infection prevention",
      summary:
        "Hand hygiene at the right moments plus standard precautions for every patient, with contact, droplet or airborne precautions added for specific organisms, breaks the chain of infection.",
      body: `**Chain of infection**: infectious agent → reservoir → portal of exit → mode of transmission → portal of entry → susceptible host. Every precaution breaks at least one link; hand hygiene breaks the mode of transmission.

**Hand hygiene** (WHO's five moments): before touching a patient, before a clean/aseptic procedure, after body-fluid exposure risk, after touching a patient, after touching patient surroundings.
- **Alcohol-based hand rub** for most situations: cover all surfaces and rub until dry (about 20–30 s)
- **Soap and water** (at least 20 s of lathering) when hands are visibly soiled and after caring for patients with *Clostridioides difficile* or norovirus, because alcohol does not reliably kill spores or non-enveloped viruses

**Standard precautions** apply to **every patient**: hand hygiene, PPE chosen for the expected exposure, respiratory hygiene and cough etiquette, safe injection practice and sharps handling, cleaning of equipment and environment.

**Transmission-based precautions** (add to standard precautions):
- **Contact**: gown and gloves on room entry; dedicated equipment. E.g. MRSA, VRE, *C. difficile*, scabies.
- **Droplet**: surgical mask on room entry; private room or cohorting. E.g. influenza, pertussis, *Neisseria meningitidis* (until treated for long enough per policy).
- **Airborne**: fit-tested **N95 respirator** (or higher) and an **airborne infection isolation room** with negative pressure, door closed. E.g. tuberculosis, measles, varicella (varicella also needs contact precautions).

**PPE order (CDC)**
- **Donning**: gown → mask or respirator → goggles or face shield → gloves (over the gown cuffs)
- **Doffing**: gloves → goggles or face shield → gown → mask or respirator, with hand hygiene immediately after removing all PPE (and whenever hands become contaminated). Remove the respirator **after leaving the room** and closing the door. Some agencies remove gown and gloves together; follow local policy.

> The most contaminated items (gloves, front of gown, front of goggles) come off first; the mask comes off last, touched only by its ties or ear loops.`,
      pearls: [
        "Gloves are not a substitute for hand hygiene; perform hand hygiene before putting gloves on and after taking them off.",
        "A patient in airborne precautions who must leave the room for a test wears a surgical mask, not an N95.",
        "Clean shared equipment such as stethoscopes and BP cuffs between patients; they carry organisms room to room.",
      ],
    },
    {
      slug: "n222-safety-falls-pressure",
      title: "Patient safety: fall risk and pressure-injury risk (Braden scale)",
      topic: "Safety, falls & pressure injury",
      summary:
        "Screen every patient for fall and pressure-injury risk on admission and regularly after. On the Braden scale, a lower score means higher risk.",
      body: `**Fall risk**
- Common risk factors: previous falls, age, unsteady gait, mobility aids, urgency or frequent toileting, confusion, orthostatic hypotension, sedating medications, IV lines and tubing
- Screening tools such as the **Morse Fall Scale** or Hendrich II give a score; the cut-off for "high risk" depends on the tool and the agency
- **Universal fall precautions** for everyone: bed in the low, locked position; call light and personal items within reach; non-slip footwear; adequate lighting; clutter-free path; frequent rounding
- High-risk extras per policy: bed or chair alarm, scheduled toileting, gait belt for transfers, room near the nurses' station
- **Restraints are a last resort**, need a provider order and frequent monitoring, and do not reliably prevent falls

**Pressure injury** forms where sustained pressure (often with shear) over a bony prominence cuts off blood flow: sacrum, coccyx, heels, hips, elbows, back of the head, and under devices such as oxygen tubing.

**Braden scale**: six subscales scored and added together.
- Sensory perception (1–4), moisture (1–4), activity (1–4), mobility (1–4), nutrition (1–4), friction and shear (1–3)
- Total ranges from **6 to 23**; a **lower total means higher risk**
- Commonly used bands: 15–18 mild risk, 13–14 moderate risk, 10–12 high risk, 9 or below very high risk (19–23 usually not at risk). Agencies set their own action thresholds.

**Prevention**: reposition at least every 2 hours in bed per policy (more often for high risk); float heels; keep the head of the bed at 30° or lower when possible to reduce shear; use pressure-redistributing surfaces; manage moisture; optimise nutrition and hydration; inspect skin under devices.

**NPIAP stages** in brief: Stage 1 intact skin with non-blanchable redness; Stage 2 partial-thickness loss with exposed dermis; Stage 3 full-thickness skin loss, fat may be visible; Stage 4 full-thickness loss with exposed fascia, muscle, tendon, ligament, cartilage or bone; **unstageable** when slough or eschar hides the base; **deep tissue pressure injury** when there is persistent deep red, maroon or purple discolouration.`,
      pearls: [
        "Never massage reddened skin over a bony prominence; it can damage fragile tissue further.",
        "Most inpatient falls happen when patients get up alone to use the toilet, so scheduled toileting is a key prevention measure.",
        "The Braden score is a starting point for prevention, not a diagnosis; your skin inspection is what finds the injury.",
      ],
    },
    {
      slug: "n222-documentation-sbar",
      title: "Documentation and SBAR handoff",
      topic: "Documentation & handoff",
      summary:
        "Document objectively, promptly and accurately; communicate concerns and handoffs with a structured tool such as SBAR so the most important information is heard and acted on.",
      body: `**Principles of documentation**
- **Objective, factual and specific**: "Ate 25% of breakfast, states 'I'm not hungry'" rather than "poor appetite". Quote the patient when it helps.
- **Timely**: chart as soon as practical after care; never chart care before you give it
- **Accurate and complete**: include assessments, interventions, the patient's response and who was notified
- **Legal record**: if it wasn't documented, it is treated as not done. Correct errors by your agency's late-entry or amendment process; never delete or alter another person's entry.
- Use only approved abbreviations; protect privacy (HIPAA) and never share log-ins.

**SBAR** structures urgent communication with providers and handoffs between nurses:
- **S – Situation**: who you are, who the patient is, and what is happening now ("I'm calling about Mr. Reyes in 412; his blood pressure has dropped to 88/54 and he is newly confused.")
- **B – Background**: relevant history, diagnosis, surgery, recent changes, allergies, code status
- **A – Assessment**: your findings, trends and what you think is going on ("I'm concerned he may be developing sepsis or bleeding.")
- **R – Recommendation/Request**: what you need and by when ("I'd like you to come and assess him now. Is there anything you want me to do before you arrive?")

Many agencies use **I-SBAR** (adding **Identify** yourself and the patient) or **SBAR-R** (adding **Read-back** of orders). Read back any verbal or telephone order to confirm it, and document the call: time, who was notified, what was reported and what was ordered.

**Chain of command**: if you remain concerned after reporting, or the provider doesn't respond in time, escalate (charge nurse, rapid response team, next provider) according to agency policy. Most agencies let any staff member, and often family, call a rapid response.`,
      pearls: [
        "Have the chart, recent vital-sign trend, medication record and allergies in front of you before you call a provider.",
        "The Recommendation is the part students most often leave out; say clearly what you need.",
        "Bedside handoff lets the incoming nurse see the patient, check lines and pumps and involve the patient in the plan.",
      ],
    },
  ],

  lectures: [
    {
      id: "n222-l1",
      week: 1,
      title: "Thinking like a nurse: ADPIE, clinical judgment and SBAR",
      topic: "Nursing process & clinical judgment",
      summary:
        "How the nursing process and the clinical judgment model fit together, how to prioritise patients, and how to communicate a concern with SBAR.",
      notes: `- ADPIE: assess, diagnose, plan, implement, evaluate; evaluation restarts the cycle
- Clinical judgment model: recognise cues → analyse cues → prioritise hypotheses → generate solutions → take action → evaluate outcomes
- Priorities: ABCs, Maslow, acute over chronic, unstable over stable, unexpected over expected
- Goals must be measurable and time-bound so they can be evaluated
- RN keeps assessment, teaching, evaluation and judgment; delegate stable, routine tasks
- Document objectively and promptly; SBAR (Situation, Background, Assessment, Recommendation) for urgent calls and handoff`,
      insights: [
        { type: "exam_tip", text: "In 'who do you see first' questions, pick the patient with an airway, breathing or circulation problem that is new or unexpected; a stable chronic finding can wait.", conceptSlug: "n222-nursing-process" },
        { type: "exam_tip", text: "If an option assesses and another acts, assess first unless the stem already gives you enough data or the patient is in immediate danger.", conceptSlug: "n222-nursing-process" },
        { type: "exam_tip", text: "Delegation questions: anything that needs assessment, teaching or evaluation (including a first ambulation after surgery, or a patient who is unstable) stays with the RN.", conceptSlug: "n222-nursing-process" },
        { type: "clinical_link", text: "Before you call a provider, gather the trend, not just the latest number: three readings over four hours tell a story one reading can't.", conceptSlug: "n222-documentation-sbar" },
      ],
    },
    {
      id: "n222-l2",
      week: 3,
      title: "Vital signs and the head-to-toe assessment",
      topic: "Vital signs",
      summary:
        "Measuring vital signs accurately, normal adult ranges, the health history, and a systematic head-to-toe examination including heart and lung sounds.",
      notes: `- Adult ranges (vary by agency): HR 60–100, RR 12–20, BP below 120/80, SpO₂ 95–100%, fever 38.0 °C or higher
- Count irregular or apical pulses for a full minute; pulse deficit = apical − radial
- Count respirations without the patient noticing
- MAP ≈ (SBP + 2 × DBP) / 3; aim for 65 mmHg or more
- Orthostatic hypotension: systolic drop of 20 or more, or diastolic drop of 10 or more, within 3 minutes of standing
- Inspection, palpation, percussion, auscultation; abdomen: inspect, auscultate, percuss, palpate
- Heart: APE To Man landmarks; S1 at the apex, S2 at the base
- Lungs: crackles (fluid), wheezes (narrow airways), rhonchi (secretions), stridor (upper airway emergency)`,
      insights: [
        { type: "exam_tip", text: "Stridor is always the priority finding among breath sounds: it signals upper-airway obstruction.", conceptSlug: "n222-cardio-resp-assessment" },
        { type: "exam_tip", text: "A cuff that is too small or an arm below heart level gives a falsely high reading; a cuff that is too large gives a falsely low one.", conceptSlug: "n222-vital-signs" },
        { type: "clinical_link", text: "Tachycardia with a normal blood pressure after surgery can be early compensation for bleeding or infection; don't wait for the blood pressure to fall.", conceptSlug: "n222-vital-signs" },
        { type: "intuition", text: "MAP weights diastole twice because the heart spends about two-thirds of each beat in diastole at a resting rate.", conceptSlug: "n222-vital-signs" },
      ],
    },
    {
      id: "n222-l3",
      week: 6,
      title: "Keeping patients safe: pain, infection prevention, falls and skin",
      topic: "Infection prevention",
      summary:
        "Pain scales and reassessment, the chain of infection, hand hygiene and PPE, transmission-based precautions, fall prevention and the Braden scale.",
      notes: `- Pain: self-report is the gold standard; NRS, FACES, FLACC, PAINAD; reassess after every intervention per agency policy
- Hand hygiene: five moments; soap and water for C. difficile and norovirus
- Standard precautions for everyone; contact (gown, gloves), droplet (surgical mask), airborne (N95, negative-pressure room)
- Don: gown, mask, goggles, gloves. Doff: gloves, goggles, gown, mask; hand hygiene after
- Universal fall precautions: low locked bed, call light in reach, non-slip footwear, rounding
- Braden: six subscales, total 6–23, lower = higher risk`,
      insights: [
        { type: "exam_tip", text: "Memory aid for airborne diseases: 'My Chicken has TB' (Measles, Chickenpox/varicella, TB). These need an N95 and a negative-pressure room.", conceptSlug: "n222-infection-prevention" },
        { type: "exam_tip", text: "After giving an opioid, the priority reassessment is sedation and respiratory rate, then the pain score.", conceptSlug: "n222-pain-assessment" },
        { type: "exam_tip", text: "Braden runs backwards from most scores: a low number is a high risk. Moisture, nutrition and friction/shear are the subscales nurses can change most directly.", conceptSlug: "n222-safety-falls-pressure" },
        { type: "clinical_link", text: "Many falls happen while a patient is trying to reach the bathroom alone; hourly rounding that asks about pain, position and toileting cuts that risk.", conceptSlug: "n222-safety-falls-pressure" },
      ],
    },
  ],

  questions: [
    {
      id: "n222-q1",
      type: "mcq",
      topic: "Nursing process & clinical judgment",
      difficulty: 2,
      prompt: "You receive report on four adult patients. Which patient should you see first?",
      options: [
        "A patient 1 day after knee replacement rating pain 6/10, due for scheduled pain medication in 30 minutes",
        "A patient with COPD whose SpO₂ is 90% on 2 L/min oxygen, matching their documented baseline",
        "A patient 2 hours after thyroid surgery who has new noisy, high-pitched breathing on inspiration",
        "A patient with type 2 diabetes asking for help understanding their discharge instructions",
      ],
      answer: 2,
      hints: ["Apply the ABCs.", "Which finding is new, unexpected and involves the airway?"],
      explanation:
        "New inspiratory stridor after neck surgery suggests upper-airway obstruction (for example from swelling or a haematoma) and is an airway emergency. The COPD patient is at their baseline, the pain is expected and can be managed shortly, and teaching can wait.",
      concepts: ["n222-nursing-process", "n222-cardio-resp-assessment"],
    },
    {
      id: "n222-q2",
      type: "numeric",
      topic: "Vital signs",
      difficulty: 1,
      prompt: "A patient's blood pressure is 118/76 mmHg. Estimate the mean arterial pressure (MAP).",
      answer: 90,
      tolerance: 1,
      unit: "mmHg",
      hints: ["MAP ≈ (SBP + 2 × DBP) / 3."],
      explanation: "MAP ≈ (118 + 2 × 76) / 3 = (118 + 152) / 3 = 270 / 3 = 90 mmHg, comfortably above the usual target of 65 mmHg.",
      concepts: ["n222-vital-signs"],
    },
    {
      id: "n222-q3",
      type: "numeric",
      topic: "Health history & physical assessment",
      difficulty: 1,
      prompt: "An adult weighs 82 kg and is 175 cm tall. Calculate their body mass index (BMI) to one decimal place.",
      answer: 26.8,
      tolerance: 0.1,
      unit: "kg/m²",
      hints: ["Convert height to metres: 1.75 m.", "BMI = kg ÷ m²; 1.75² = 3.0625."],
      explanation: "BMI = 82 / 1.75² = 82 / 3.0625 ≈ 26.8 kg/m², which falls in the overweight band (25–29.9).",
      concepts: ["n222-health-history-head-to-toe"],
    },
    {
      id: "n222-q4",
      type: "mcq",
      topic: "Vital signs",
      difficulty: 2,
      prompt:
        "A student measures a blood pressure of 152/94 mmHg on a patient with a large upper arm, using a standard adult cuff that only just closes. The patient's previous readings were around 128/80. What is the best action?",
      options: [
        "Report stage 2 hypertension to the provider immediately",
        "Remeasure with a cuff whose bladder fits the arm (length about 80% and width about 40% of arm circumference)",
        "Remeasure on the same arm with the patient's arm hanging at their side",
        "Record the reading, since automatic machines are more accurate than manual cuffs",
      ],
      answer: 1,
      hints: ["What happens to a reading when the cuff bladder is too small?", "Rule out technique error before reporting."],
      explanation:
        "A cuff that is too small needs more pressure to compress the artery and gives a falsely high reading. Remeasure with the correct size before acting on the number. An arm hanging below heart level also gives a falsely high reading.",
      concepts: ["n222-vital-signs"],
    },
    {
      id: "n222-q5",
      type: "mcq",
      topic: "Cardiovascular & respiratory assessment",
      difficulty: 1,
      prompt:
        "On auscultation you hear continuous, high-pitched, musical sounds mainly on expiration in a patient with asthma. How should you document them?",
      options: ["Fine crackles", "Wheezes", "Pleural friction rub", "Bronchial breath sounds heard over the trachea"],
      answer: 1,
      hints: ["Is the sound continuous or discontinuous?", "Which sound comes from air moving through narrowed airways?"],
      explanation:
        "Wheezes are continuous, musical sounds from narrowed airways and are typical of asthma. Crackles are brief and discontinuous; a friction rub is a grating sound from inflamed pleura; bronchial sounds over the trachea are normal.",
      concepts: ["n222-cardio-resp-assessment"],
    },
    {
      id: "n222-q6",
      type: "numeric",
      topic: "Health history & physical assessment",
      difficulty: 2,
      prompt:
        "Over an 8-hour shift a patient drinks two 240 mL cups of water and 120 mL of broth, and receives IV fluid at 75 mL/h for the whole shift. Output is 650 mL of urine and 150 mL of emesis. What is the net fluid balance for the shift? (Use a positive number for a positive balance.)",
      answer: 400,
      tolerance: 0,
      unit: "mL",
      hints: ["Intake = oral + IV; IV = 75 × 8.", "Net balance = total intake − total output."],
      explanation:
        "Oral intake = 240 + 240 + 120 = 600 mL. IV = 75 × 8 = 600 mL. Total intake = 1,200 mL. Output = 650 + 150 = 800 mL. Net balance = 1,200 − 800 = +400 mL.",
      concepts: ["n222-health-history-head-to-toe"],
    },
    {
      id: "n222-q7",
      type: "numeric",
      topic: "Safety, falls & pressure injury",
      difficulty: 2,
      prompt:
        "You score a patient on the Braden scale: sensory perception 3, moisture 2, activity 2, mobility 2, nutrition 3, friction and shear 2. What is the total Braden score?",
      answer: 14,
      tolerance: 0,
      unit: "points",
      hints: ["Add the six subscale scores.", "Then remember: lower total = higher risk."],
      explanation:
        "3 + 2 + 2 + 2 + 3 + 2 = 14. On commonly used bands that is moderate risk (13–14), so the patient needs a documented pressure-injury prevention plan. Moisture, mobility and friction/shear are the lowest subscales and the best targets.",
      concepts: ["n222-safety-falls-pressure"],
    },
    {
      id: "n222-q8",
      type: "mcq",
      topic: "Infection prevention",
      difficulty: 1,
      prompt: "A patient is admitted with suspected pulmonary tuberculosis. Which precautions should the nurse put in place?",
      options: [
        "Contact precautions: gown and gloves, door may stay open",
        "Droplet precautions: surgical mask within the room",
        "Airborne precautions: fit-tested N95 respirator and a negative-pressure airborne infection isolation room with the door closed",
        "Standard precautions only, because TB is not spread by touch",
      ],
      answer: 2,
      hints: ["TB is spread by tiny droplet nuclei that stay suspended in the air."],
      explanation:
        "TB spreads by airborne droplet nuclei, so the patient needs an airborne infection isolation room (negative pressure, door closed) and staff wear fit-tested N95 respirators, on top of standard precautions.",
      concepts: ["n222-infection-prevention"],
    },
    {
      id: "n222-q9",
      type: "mcq",
      topic: "Documentation & handoff",
      difficulty: 2,
      prompt: "In an SBAR call about a deteriorating patient, which statement belongs in the R (Recommendation) section?",
      options: [
        "\"He had a bowel resection yesterday and has no known allergies.\"",
        "\"His heart rate has risen from 88 to 118 and he's newly confused.\"",
        "\"I'm calling about Mr. Reyes in room 412.\"",
        "\"I'd like you to come and assess him in the next 15 minutes, and I'd like to know whether you want blood cultures and a lactate drawn.\"",
      ],
      answer: 3,
      hints: ["Situation = what's happening; Background = history; Assessment = findings and your concern.", "Which option asks for something?"],
      explanation:
        "The Recommendation states clearly what the nurse needs from the provider and by when. The surgery and allergies are Background, the vital-sign trend is Assessment, and identifying the patient is part of the Situation.",
      concepts: ["n222-documentation-sbar"],
    },
    {
      id: "n222-q10",
      type: "numeric",
      topic: "Pain assessment",
      difficulty: 2,
      prompt:
        "A 2-year-old after surgery is grimacing often with a quivering chin (face 2), has restless, tense legs (legs 1), is squirming and shifting (activity 1), is crying steadily (cry 2), and is hard to console (consolability 2). What is the FLACC score?",
      answer: 8,
      tolerance: 0,
      unit: "/10",
      hints: ["Each of the five categories scores 0–2.", "Add them: F + L + A + C + C."],
      explanation:
        "2 + 1 + 1 + 2 + 2 = 8 out of 10, which indicates severe pain. Report it, treat per orders and agency protocol, and reassess with the same tool.",
      concepts: ["n222-pain-assessment"],
    },
    {
      id: "n222-q11",
      type: "mcq",
      topic: "Nursing process & clinical judgment",
      difficulty: 1,
      prompt: "Which patient goal is written so that it can be evaluated?",
      options: [
        "The patient will understand how to use the incentive spirometer.",
        "The patient will use the incentive spirometer 10 times an hour while awake and reach 1,500 mL by post-operative day 2.",
        "The nurse will teach the patient how to use the incentive spirometer.",
        "The patient will have better lung function after surgery.",
      ],
      answer: 1,
      hints: ["Look for something you could observe or measure.", "A goal is about the patient, not the nurse, and needs a time frame."],
      explanation:
        "A goal must be patient-centred, specific, measurable and time-bound. 'Understand' and 'better lung function' can't be observed directly, and 'the nurse will teach' is an intervention, not a patient goal.",
      concepts: ["n222-nursing-process"],
    },
    {
      id: "n222-q12",
      type: "mcq",
      topic: "Nursing process & clinical judgment",
      difficulty: 2,
      prompt: "Which task can the RN delegate to an unlicensed assistive person (UAP)?",
      options: [
        "Measuring and recording vital signs on a stable patient 2 days after hip surgery",
        "Teaching a newly diagnosed patient how to check their blood glucose",
        "Assessing a patient who reports new chest pain",
        "Walking a patient for the first time after abdominal surgery",
      ],
      answer: 0,
      hints: ["The RN keeps assessment, teaching and evaluation.", "Is the patient stable and the task routine?"],
      explanation:
        "Vital signs on a stable patient are routine and predictable, so they can be delegated; the RN still interprets the results. Teaching, assessing new chest pain and a first post-operative ambulation all need nursing assessment and judgment.",
      concepts: ["n222-nursing-process"],
    },
    {
      id: "n222-q13",
      type: "mcq",
      topic: "Nursing process & clinical judgment",
      difficulty: 3,
      prompt:
        "A patient's goal reads: 'Patient will rate pain 3/10 or lower within 1 hour of repositioning and the prescribed analgesic.' Before the interventions the pain was 8/10. One hour after both, the patient rates the pain 6/10 and is guarding the incision. What is the nurse's best next step?",
      options: [
        "Document that the goal was met because the pain has fallen from 8/10",
        "Record the goal as not met, reassess the pain fully (OLDCARTS, the incision, vital signs) and revise the plan with the team",
        "Wait another hour, since analgesics can take time to work",
        "Tell the patient that some pain is expected after surgery",
      ],
      answer: 1,
      hints: ["Compare the result with the exact goal.", "Evaluation leads straight back into assessment."],
      explanation:
        "The goal was 3/10 or lower, so 6/10 means it was not met (some agencies would say partly met). Evaluation restarts the cycle: reassess for a cause such as a wound problem, then revise the plan with the provider. Waiting or dismissing the pain skips the nursing process.",
      concepts: ["n222-nursing-process", "n222-pain-assessment"],
    },
    {
      id: "n222-q14",
      type: "numeric",
      topic: "Vital signs",
      difficulty: 1,
      prompt: "A patient's oral temperature is 101.3 °F. Convert it to degrees Celsius (one decimal place).",
      answer: 38.5,
      tolerance: 0.1,
      unit: "°C",
      hints: ["°C = (°F − 32) × 5/9.", "Then compare with the common fever threshold of 38.0 °C."],
      explanation: "(101.3 − 32) × 5/9 = 69.3 × 5/9 = 38.5 °C, which is a fever on the common definition of 38.0 °C or higher.",
      concepts: ["n222-vital-signs"],
    },
    {
      id: "n222-q15",
      type: "numeric",
      topic: "Vital signs",
      difficulty: 2,
      prompt: "A patient's blood pressure is 96/58 mmHg. Estimate the MAP to the nearest whole number.",
      answer: 71,
      tolerance: 1,
      unit: "mmHg",
      hints: ["MAP ≈ (SBP + 2 × DBP) / 3.", "2 × 58 = 116."],
      explanation:
        "MAP ≈ (96 + 116) / 3 = 212 / 3 ≈ 70.7, so about 71 mmHg. That is above the usual target of 65 mmHg, but compare it with the patient's baseline and the rest of the picture (heart rate, mental status, urine output).",
      concepts: ["n222-vital-signs"],
    },
    {
      id: "n222-q16",
      type: "mcq",
      topic: "Vital signs",
      difficulty: 3,
      prompt:
        "A patient admitted with cellulitis has a pulse oximeter alarm at 84%. She is talking in full sentences, her lips are pink, RR is 16 and her fingers are cold. The waveform is erratic, and the oximeter shows a rate of 132 while her radial pulse is 78. What should the nurse do first?",
      options: [
        "Start supplemental oxygen and call the provider",
        "Call the rapid response team for hypoxaemia",
        "Warm the hand or move the probe to another site, then recheck once the waveform is steady and the displayed rate matches her pulse",
        "Document SpO₂ 84% and recheck at the next scheduled vital-signs round",
      ],
      answer: 2,
      hints: ["Does the number match the patient in front of you?", "What makes an oximeter reading unreliable?"],
      explanation:
        "The patient shows no signs of hypoxaemia and the device's rate doesn't match her pulse, so the reading is probably artefact from cold fingers or poor signal. Fix the probe and recheck before acting on it. If the patient looked distressed, you would treat the patient, not the monitor. Documenting an unverified 84% without acting is never right.",
      concepts: ["n222-vital-signs"],
    },
    {
      id: "n222-q17",
      type: "mcq",
      topic: "Health history & physical assessment",
      difficulty: 1,
      prompt: "In what order should the nurse examine the abdomen?",
      options: [
        "Inspect, palpate, percuss, auscultate",
        "Inspect, auscultate, percuss, palpate",
        "Auscultate, inspect, palpate, percuss",
        "Palpate, percuss, inspect, auscultate",
      ],
      answer: 1,
      hints: ["The abdomen is the exception to the usual order.", "Touching the abdomen can change what you hear."],
      explanation:
        "Everywhere else the order is inspection, palpation, percussion, auscultation. In the abdomen you listen before you touch, because percussion and palpation can stimulate or change bowel sounds.",
      concepts: ["n222-health-history-head-to-toe"],
    },
    {
      id: "n222-q18",
      type: "numeric",
      topic: "Health history & physical assessment",
      difficulty: 2,
      prompt: "An adult weighs 160 lb and is 5 ft 4 in tall. Calculate their BMI to one decimal place.",
      answer: 27.5,
      tolerance: 0.1,
      unit: "kg/m²",
      hints: ["5 ft 4 in = 64 in.", "BMI = 703 × lb ÷ in², or convert to kg and metres first."],
      explanation:
        "BMI = 703 × 160 / 64² = 112,480 / 4,096 ≈ 27.5 kg/m². In metric: 160 lb ≈ 72.6 kg and 64 in ≈ 1.626 m, so 72.6 / 2.643 ≈ 27.5. That falls in the overweight band (25–29.9).",
      concepts: ["n222-health-history-head-to-toe"],
    },
    {
      id: "n222-q19",
      type: "mcq",
      topic: "Health history & physical assessment",
      difficulty: 1,
      prompt: "You can just feel a patient's left dorsalis pedis pulse, and it disappears with light pressure. How should you grade it?",
      options: ["0 (absent)", "1+ (weak, diminished)", "2+ (normal)", "3+ (increased)", "4+ (bounding)"],
      answer: 1,
      hints: ["The scale runs from 0 to 4+, with 2+ normal.", "A pulse that is easily obliterated is weaker than normal."],
      explanation:
        "A faint pulse that is easily obliterated is 1+. Compare it with the right foot, check colour, temperature and capillary refill, and report a new or one-sided change. Use a Doppler if you can't find the pulse at all.",
      concepts: ["n222-health-history-head-to-toe"],
    },
    {
      id: "n222-q20",
      type: "numeric",
      topic: "Health history & physical assessment",
      difficulty: 2,
      prompt:
        "During the general survey a patient opens their eyes when you speak to them, is confused but answers in sentences, and obeys commands. Using the Glasgow Coma Scale (eyes 1–4, verbal 1–5, motor 1–6), what is the total?",
      answer: 13,
      tolerance: 0,
      unit: "points",
      hints: ["Eyes to voice = 3; confused conversation = 4; obeys commands = 6.", "Add the three components."],
      explanation:
        "E3 + V4 + M6 = 13 out of 15. Record the components as well as the total, compare with the previous score, and report a drop (a fall of 2 or more is commonly treated as significant; follow agency policy).",
      concepts: ["n222-health-history-head-to-toe"],
    },
    {
      id: "n222-q21",
      type: "mcq",
      topic: "Cardiovascular & respiratory assessment",
      difficulty: 1,
      prompt: "Where should you place the stethoscope to listen over the mitral area (the apex)?",
      options: [
        "2nd intercostal space, right sternal border",
        "2nd intercostal space, left sternal border",
        "4th intercostal space, left lower sternal border",
        "5th intercostal space, left midclavicular line",
      ],
      answer: 3,
      hints: ["Use 'APE To Man': aortic, pulmonic, Erb's, tricuspid, mitral.", "The mitral area is usually the point of maximal impulse."],
      explanation:
        "The mitral area is at the 5th ICS in the left midclavicular line, usually the PMI, where S1 is loudest. The other options are the aortic, pulmonic and tricuspid areas.",
      concepts: ["n222-cardio-resp-assessment"],
    },
    {
      id: "n222-q22",
      type: "numeric",
      topic: "Cardiovascular & respiratory assessment",
      difficulty: 2,
      prompt:
        "A patient has an irregular pulse. Two nurses count at the same time for a full minute: the apical rate is 104 and the radial rate is 86. What is the pulse deficit?",
      answer: 18,
      tolerance: 0,
      unit: "beats/min",
      hints: ["Pulse deficit = apical − radial.", "Both counts must be taken at the same time, for 60 seconds."],
      explanation:
        "104 − 86 = 18 beats/min. Some contractions are too weak to reach the wrist, as happens in atrial fibrillation. Report the deficit; the apical rate is the true heart rate.",
      concepts: ["n222-cardio-resp-assessment", "n222-vital-signs"],
    },
    {
      id: "n222-q23",
      type: "mcq",
      topic: "Cardiovascular & respiratory assessment",
      difficulty: 2,
      prompt:
        "A 74-year-old with heart failure has a low-pitched extra sound at the apex just after S2. Their ankles are newly swollen and their weight is up 2 kg in 2 days. What is the best interpretation?",
      options: [
        "A normal S3 that needs no follow-up at any age",
        "An S3 that, with the oedema and weight gain, suggests fluid overload; assess lung sounds and report the findings",
        "An S4 caused by a stiff ventricle",
        "A split S2, which is always a normal finding",
      ],
      answer: 1,
      hints: ["Is the sound in early or late diastole?", "What does the weight change suggest?"],
      explanation:
        "A sound just after S2 is an S3 (early diastole). It can be normal in children and young adults, but in an older adult with heart failure, rising weight and oedema it suggests volume overload. An S4 comes just before S1.",
      concepts: ["n222-cardio-resp-assessment"],
    },
    {
      id: "n222-q24",
      type: "mcq",
      topic: "Cardiovascular & respiratory assessment",
      difficulty: 3,
      prompt: "You have four patients on a respiratory unit. Which should you see first?",
      options: [
        "A patient with COPD who has scattered rhonchi that clear after coughing",
        "A patient with pneumonia who has crackles in the right lower lobe, unchanged since admission",
        "A patient having an asthma attack whose loud wheezes have become quiet, who is using accessory muscles and can say only one or two words at a time",
        "A patient with a pleural friction rub who has sharp pain on deep inspiration, rated 4/10",
      ],
      answer: 2,
      hints: ["Quieter is not always better.", "Which patient's breathing is getting worse?"],
      explanation:
        "Wheezes that fade while work of breathing rises mean too little air is moving to make a sound: a 'silent chest' and an impending respiratory arrest. The other findings are expected for those conditions or stable.",
      concepts: ["n222-cardio-resp-assessment", "n222-nursing-process"],
    },
    {
      id: "n222-q25",
      type: "mcq",
      topic: "Pain assessment",
      difficulty: 1,
      prompt: "In an adult who can communicate, what is the most reliable indicator of pain?",
      options: [
        "Heart rate and blood pressure",
        "The patient's self-report",
        "The nurse's observation of facial expression",
        "How much analgesic the patient has needed",
      ],
      answer: 1,
      hints: ["Pain is subjective.", "Vital signs can return to normal while pain continues."],
      explanation:
        "Pain is what the patient says it is. Vital signs, facial expression and analgesic use can support an assessment, but none of them outweighs the patient's own report.",
      concepts: ["n222-pain-assessment"],
    },
    {
      id: "n222-q26",
      type: "numeric",
      topic: "Pain assessment",
      difficulty: 2,
      prompt:
        "You assess an adult with advanced dementia using PAINAD (each item 0–2): occasional laboured breathing (1), occasional moaning (1), facial grimacing (2), tense and fidgeting (1), and reassured by your voice and touch (1). What is the total?",
      answer: 6,
      tolerance: 0,
      unit: "/10",
      hints: ["PAINAD has five items, each 0–2.", "Breathing + vocalisation + face + body language + consolability."],
      explanation:
        "1 + 1 + 2 + 1 + 1 = 6 out of 10, which suggests moderate to severe pain. Look for a cause, treat per orders, and reassess with the same tool.",
      concepts: ["n222-pain-assessment"],
    },
    {
      id: "n222-q27",
      type: "mcq",
      topic: "Pain assessment",
      difficulty: 3,
      prompt:
        "Thirty minutes after an IV opioid, a post-operative patient rates pain 3/10 (down from 8/10). They fall asleep mid-sentence and are hard to keep awake; RR is 9 and shallow and SpO₂ is 91%. What is the nurse's priority?",
      options: [
        "Document that the pain goal was met",
        "Let the patient sleep, since rest helps recovery",
        "Stay with the patient, try to rouse them, support airway and breathing, and follow the agency's opioid respiratory-depression protocol while calling for help",
        "Give the next scheduled analgesic early so the pain doesn't come back",
      ],
      answer: 2,
      hints: ["What do you check after an opioid besides the pain score?", "Airway and breathing come first."],
      explanation:
        "Increasing sedation with a slow, shallow respiratory rate is opioid-induced respiratory depression. The pain score has improved, but the airway and breathing are now the priority: stay, stimulate, support breathing, call for help and follow protocol.",
      concepts: ["n222-pain-assessment", "n222-nursing-process"],
    },
    {
      id: "n222-q28",
      type: "mcq",
      topic: "Infection prevention",
      difficulty: 1,
      prompt: "After caring for a patient with Clostridioides difficile diarrhoea, how should the nurse clean their hands?",
      options: [
        "Alcohol-based hand rub for 20–30 seconds",
        "Soap and water, lathering for at least 20 seconds",
        "Remove gloves; hand hygiene isn't needed because gloves were worn",
        "Antiseptic wipe on the palms only",
      ],
      answer: 1,
      hints: ["C. difficile forms spores.", "Alcohol doesn't reliably kill spores."],
      explanation:
        "Soap and water physically remove spores, which alcohol does not reliably kill. Gloves never replace hand hygiene, and every surface of the hands needs cleaning.",
      concepts: ["n222-infection-prevention"],
    },
    {
      id: "n222-q29",
      type: "mcq",
      topic: "Infection prevention",
      difficulty: 2,
      prompt: "You are leaving the room of a patient on contact and droplet precautions, wearing a gown, surgical mask, goggles and gloves. Which item do you remove first?",
      options: ["Gloves", "Goggles", "Gown", "Mask"],
      answer: 0,
      hints: ["Remove the most contaminated item first.", "The mask comes off last."],
      explanation:
        "The CDC sequence is gloves, goggles or face shield, gown, then mask, followed by hand hygiene. Some agencies remove gown and gloves together; follow local policy.",
      concepts: ["n222-infection-prevention"],
    },
    {
      id: "n222-q30",
      type: "mcq",
      topic: "Infection prevention",
      difficulty: 2,
      prompt: "A patient is admitted with confirmed influenza. Which precautions should be added to standard precautions?",
      options: [
        "Contact precautions: gown and gloves only",
        "Droplet precautions: a surgical mask on entering the room, and a private room or cohorting",
        "Airborne precautions: an N95 respirator and a negative-pressure room",
        "No extra precautions once the patient has started antiviral treatment",
      ],
      answer: 1,
      hints: ["Influenza spreads mainly by large respiratory droplets.", "Which diseases need airborne precautions? 'My Chicken has TB'."],
      explanation:
        "Influenza is spread mainly by droplets, so droplet precautions apply (agencies may add other measures, such as eye protection, for aerosol-generating procedures). Airborne precautions are for measles, varicella and TB.",
      concepts: ["n222-infection-prevention"],
    },
    {
      id: "n222-q31",
      type: "mcq",
      topic: "Infection prevention",
      difficulty: 3,
      prompt: "The unit has one airborne infection isolation (negative-pressure) room free, and four patients need a bed. Who should be placed in it?",
      options: [
        "A patient with MRSA in a leg wound",
        "A patient with suspected measles who has a fever and a spreading rash",
        "A patient with confirmed influenza",
        "A patient with C. difficile diarrhoea",
      ],
      answer: 1,
      hints: ["Only one of these diseases is airborne.", "Isolate on suspicion, not confirmation."],
      explanation:
        "Measles is airborne and highly contagious, so the suspected case needs the negative-pressure room now. MRSA and C. difficile need contact precautions and influenza needs droplet precautions, which a standard private room can provide.",
      concepts: ["n222-infection-prevention", "n222-nursing-process"],
    },
    {
      id: "n222-q32",
      type: "numeric",
      topic: "Safety, falls & pressure injury",
      difficulty: 2,
      prompt:
        "A bedbound patient scores on the Braden scale: sensory perception 2, moisture 1, activity 1, mobility 2, nutrition 2, friction and shear 1. What is the total Braden score?",
      answer: 9,
      tolerance: 0,
      unit: "points",
      hints: ["Add all six subscales.", "Lower totals mean higher risk."],
      explanation:
        "2 + 1 + 1 + 2 + 2 + 1 = 9, which is very high risk on the commonly used bands (9 or below). The patient needs a pressure-redistributing surface, frequent repositioning, moisture management, a nutrition review and skin checks every shift, per agency protocol.",
      concepts: ["n222-safety-falls-pressure"],
    },
    {
      id: "n222-q33",
      type: "mcq",
      topic: "Safety, falls & pressure injury",
      difficulty: 1,
      prompt: "Which measure is a universal fall precaution for every inpatient?",
      options: [
        "Keep the bed in the low position with the wheels locked and the call light within reach",
        "Raise all four side rails for every patient",
        "Apply a vest restraint at night for all patients over 65",
        "Keep the room completely dark at night so the patient sleeps",
      ],
      answer: 0,
      hints: ["Universal precautions apply to everyone, whatever their score.", "Which options are restraints?"],
      explanation:
        "A low, locked bed with the call light and belongings in reach is a universal precaution. Four raised side rails count as a restraint in most agencies and patients may climb over them; restraints need an order and don't reliably prevent falls; a night light is safer than darkness.",
      concepts: ["n222-safety-falls-pressure"],
    },
    {
      id: "n222-q34",
      type: "mcq",
      topic: "Safety, falls & pressure injury",
      difficulty: 2,
      prompt:
        "Over a patient's sacrum you find intact skin with a pink-red area about 3 cm across that does not blanch when pressed. How should this be staged?",
      options: ["Stage 1 pressure injury", "Stage 2 pressure injury", "Deep tissue pressure injury", "Unstageable pressure injury"],
      answer: 0,
      hints: ["Is the skin intact?", "Deep tissue injury is deep red, maroon or purple."],
      explanation:
        "Intact skin with non-blanchable redness is Stage 1. Stage 2 has partial-thickness loss with exposed dermis; deep tissue injury shows persistent deep red, maroon or purple discolouration; unstageable means slough or eschar hides the base. Relieve pressure and do not massage the area.",
      concepts: ["n222-safety-falls-pressure"],
    },
    {
      id: "n222-q35",
      type: "mcq",
      topic: "Safety, falls & pressure injury",
      difficulty: 3,
      prompt: "At 0200 an 84-year-old with new confusion keeps trying to climb out of bed, setting off the bed alarm. What should the nurse do first?",
      options: [
        "Ask the provider for a wrist-restraint order",
        "Find out why the patient is getting up: offer toileting, check for pain, and look for causes of the confusion such as low oxygen or infection",
        "Raise all four side rails",
        "Close the door so the alarm doesn't wake other patients",
      ],
      answer: 1,
      hints: ["Assess before you act.", "Restraints are a last resort."],
      explanation:
        "Getting up is often driven by a need (toilet, pain, thirst) or by a cause of delirium such as hypoxia or infection. Assessing and meeting the need is the first step; raised rails and restraints increase injury risk and are a last resort under agency policy.",
      concepts: ["n222-safety-falls-pressure", "n222-nursing-process"],
    },
    {
      id: "n222-q36",
      type: "mcq",
      topic: "Documentation & handoff",
      difficulty: 1,
      prompt: "Which nursing note is written correctly?",
      options: [
        "Patient seems anxious and uncooperative.",
        "Patient ate well at lunch.",
        "Ate 50% of lunch; states 'my stomach feels full'; abdomen soft and non-tender.",
        "Patient had a good day.",
      ],
      answer: 2,
      hints: ["Could another nurse picture exactly what you saw?", "Prefer measurements and the patient's own words."],
      explanation:
        "Good documentation is objective and specific: an amount, the patient's quoted words and an assessment finding. 'Seems anxious', 'ate well' and 'a good day' are opinions that another reader can't verify.",
      concepts: ["n222-documentation-sbar"],
    },
    {
      id: "n222-q37",
      type: "mcq",
      topic: "Documentation & handoff",
      difficulty: 1,
      prompt: "A provider gives you a telephone order. What should you do?",
      options: [
        "Write it down, read the whole order back and get the provider's confirmation, then document it per agency policy",
        "Remember it and enter it in the chart after the call",
        "Repeat only the medication name to confirm it",
        "Ask the provider to text it to your personal phone",
      ],
      answer: 0,
      hints: ["What does the extra R in SBAR-R stand for?", "Think of privacy rules too."],
      explanation:
        "Read-back of the complete order catches errors in drug, dose, route and timing. Memory alone is unreliable, a partial read-back misses errors, and personal devices breach privacy policy.",
      concepts: ["n222-documentation-sbar"],
    },
    {
      id: "n222-q38",
      type: "mcq",
      topic: "Documentation & handoff",
      difficulty: 3,
      prompt:
        "You report that a patient has RR 28, SpO₂ 89% on 4 L/min oxygen and new confusion. The provider says, \"Keep an eye on him; I'll see him in the morning.\" The patient meets your agency's rapid response criteria. What is your best action?",
      options: [
        "Follow the provider's instruction and recheck in 4 hours",
        "Call the rapid response team per agency criteria, tell the charge nurse, and document the conversation factually",
        "Call the patient's family to come in",
        "Document that the provider refused to come",
      ],
      answer: 1,
      hints: ["The patient is deteriorating now.", "What is the chain of command for?"],
      explanation:
        "When a response doesn't match the patient's condition, the nurse escalates: rapid response team and charge nurse, following agency policy. Document times, who was told what, and the response, factually and without blame.",
      concepts: ["n222-documentation-sbar", "n222-nursing-process"],
    },
    {
      id: "n222-q39",
      type: "numeric",
      topic: "Documentation & handoff",
      difficulty: 2,
      prompt:
        "Before calling the provider you check the hourly urine output from a catheter: 45 mL at 1100, 30 mL at 1200, 25 mL at 1300 and 20 mL at 1400. What average hourly output will you report for these 4 hours?",
      answer: 30,
      tolerance: 0,
      unit: "mL/h",
      hints: ["Add the four hourly volumes.", "Divide by the number of hours."],
      explanation:
        "45 + 30 + 25 + 20 = 120 mL over 4 hours = 30 mL/h. The average sits at the commonly used minimum, but the falling trend (45 down to 20) is the important part of the Assessment, so report both.",
      concepts: ["n222-documentation-sbar", "n222-vital-signs"],
    },
  ],

  labs: [
    {
      id: "n222-lab-vitals",
      title: "Vital signs practice lab",
      topic: "Vital signs",
      objective:
        "Measure a full set of adult vital signs on a lab partner (temperature, radial and apical pulse, respirations, manual blood pressure, SpO₂ and pain), check for orthostatic changes, and calculate MAP, pulse deficit and urine output from practice data.",
      safety: [
        "Practise only on a willing lab partner or manikin; stop if your partner feels faint, dizzy or unwell, and tell the instructor.",
        "For orthostatic checks, stand close and guard your partner when they stand up; have them sit back down at once if they feel dizzy.",
        "Perform hand hygiene before and after contact, and clean stethoscope earpieces, diaphragm, cuffs and probes between partners.",
        "Use probe covers for electronic thermometers and never share oral thermometer probes without a new cover.",
        "Don't inflate a BP cuff repeatedly on the same arm without letting it rest; deflate fully between attempts.",
      ],
      materials: [
        "Electronic thermometer with probe covers (oral or temporal)",
        "Watch with a second hand or digital seconds",
        "Stethoscope and alcohol wipes",
        "Aneroid sphygmomanometer with small, standard and large adult cuffs; tape measure for arm circumference",
        "Pulse oximeter",
        "Numeric pain scale card",
        "Practice vital-signs flow sheet",
      ],
      steps: [
        { text: "Perform hand hygiene, introduce yourself, confirm your partner's identity and explain each step.", why: "Explaining reduces anxiety, which can raise heart rate and blood pressure." },
        { text: "Have your partner sit quietly, back supported, feet flat and legs uncrossed, for 5 minutes.", why: "Resting before measurement gives true resting values for HR and BP." },
        { text: "Take an oral or temporal temperature with a fresh probe cover and record the route.", why: "Values differ by route, so the route must be documented with the number." },
        { text: "Count the radial pulse for 30 s and double it (60 s if irregular); note rhythm and strength. Without moving your fingers, count respirations for 30 s and double, noting depth and effort.", why: "Keeping your hand on the wrist stops your partner noticing that you're counting breaths." },
        { text: "Measure arm circumference and choose a cuff whose bladder covers about 80% of it. Estimate systolic pressure by palpation, then auscultate the blood pressure, deflating at 2–3 mmHg per second.", why: "The palpated estimate stops you missing an auscultatory gap and under-reading the systolic pressure." },
        { text: "With a partner, take simultaneous apical (5th ICS, left midclavicular line) and radial pulses for a full 60 seconds.", why: "Counting at the same time is the only way to detect a pulse deficit." },
        { text: "Place the pulse oximeter on a warm finger without nail polish; read SpO₂ once the waveform is steady and the displayed rate matches the palpated pulse." },
        { text: "Ask your partner to rate any pain from 0 to 10." },
        { text: "Orthostatic check: after your partner has lain flat for 5 minutes, measure BP and HR; have them stand and repeat at 1 and 3 minutes, asking about dizziness.", why: "A systolic drop of 20 mmHg or more, or a diastolic drop of 10 mmHg or more, within 3 minutes of standing is orthostatic hypotension." },
        { text: "Record all values with time, route, position and arm used; calculate MAP; flag anything outside the agency's reference range and say who you would report it to." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "You count 36 regular radial beats in 30 seconds. What is the pulse rate?",
          answer: 72,
          tolerance: 0,
          unit: "beats/min",
          working: "36 × 2 = 72 beats/min, within the usual adult range of 60–100.",
        },
        {
          id: "d2",
          prompt: "Your partner's blood pressure is 132/84 mmHg. Estimate the MAP.",
          answer: 100,
          tolerance: 1,
          unit: "mmHg",
          working: "MAP ≈ (132 + 2 × 84) / 3 = (132 + 168) / 3 = 300 / 3 = 100 mmHg.",
        },
        {
          id: "d3",
          prompt: "Counting together for a full minute, the apical rate is 92 and the radial rate is 80. What is the pulse deficit?",
          answer: 12,
          tolerance: 0,
          unit: "beats/min",
          working: "Pulse deficit = 92 − 80 = 12 beats/min. Any deficit means some beats aren't reaching the periphery (e.g. in atrial fibrillation) and should be reported.",
        },
        {
          id: "d4",
          prompt: "Lying BP is 124/78 mmHg; after 3 minutes standing it is 100/72 mmHg. By how much did the systolic pressure fall?",
          answer: 24,
          tolerance: 0,
          unit: "mmHg",
          working: "124 − 100 = 24 mmHg. A systolic fall of 20 mmHg or more within 3 minutes of standing meets the definition of orthostatic hypotension.",
        },
        {
          id: "d5",
          prompt: "A 70 kg adult with a urinary catheter has drained 100 mL in the last 4 hours. What is the urine output in mL/kg/h (two decimal places)?",
          answer: 0.36,
          tolerance: 0.01,
          unit: "mL/kg/h",
          working: "100 mL / 4 h = 25 mL/h. 25 / 70 ≈ 0.36 mL/kg/h. That is below the commonly used adult minimum of about 0.5 mL/kg/h (roughly 30 mL/h), so report it.",
        },
      ],
      resultsGuide:
        "Healthy young adult partners usually have HR 60–100, RR 12–20, BP below 120/80 and SpO₂ 95–100%, but values vary and some fit people have resting heart rates in the 50s. Repeat any surprising reading before believing it: check cuff size, arm position, whether your partner was talking or had just walked in, and whether the oximeter waveform was steady. Your apical and radial rates should match in a healthy partner; if they don't, recount together for a full minute. Orthostatic changes are uncommon in well-hydrated students; a mild rise in HR on standing is normal. Document what you measured, where and how, and compare against your agency's reference ranges, which may differ slightly from these.",
    },
    {
      id: "n222-lab-resp",
      title: "Respiratory and heart sounds practice lab",
      topic: "Cardiovascular & respiratory assessment",
      objective:
        "Inspect, palpate and auscultate the chest of a lab partner or manikin, locate the cardiac landmarks, listen to normal breath sounds in a side-to-side pattern, practise recognising adventitious sounds on a simulation manikin or sound library, and calculate respiratory rate, pulse deficit and smoking pack-years from practice data.",
      safety: [
        "Practise only on a willing lab partner or manikin; keep your partner covered except for the area you are listening to, and let them decline any part.",
        "Deep breathing through the mouth for several minutes can make people light-headed; let your partner breathe normally between sites and stop if they feel dizzy.",
        "Perform hand hygiene before and after contact, and clean the stethoscope earpieces, diaphragm and bell between partners.",
        "Warm the diaphragm in your hand before placing it on skin, and never use the stethoscope on broken skin.",
        "Follow the lab's rules for manikins: no ink, lotion or tape on the skin, and report any damaged equipment.",
      ],
      materials: [
        "Stethoscope with diaphragm and bell, and alcohol wipes",
        "Watch with a second hand or digital seconds",
        "Pulse oximeter",
        "Gown or drape for privacy",
        "Simulation manikin or a recorded heart and lung sound library",
        "Practice respiratory and cardiac assessment form",
      ],
      steps: [
        {
          text: "Perform hand hygiene, introduce yourself, explain each step and provide privacy. Have your partner sit upright with the gown open at the back.",
          why: "Sitting upright lets the lungs expand fully, and listening on bare skin avoids the rustling noise a gown adds.",
        },
        {
          text: "Inspect: colour of lips and nail beds, work of breathing, use of accessory muscles, position (e.g. tripod), chest shape and symmetry of chest movement.",
          why: "Inspection often shows distress before you hear anything; a barrel chest (front-to-back diameter close to the side-to-side diameter) suggests chronic air trapping.",
        },
        {
          text: "Count respirations for 30 s and double (60 s if irregular) while your fingers stay on the radial pulse; note rate, depth and rhythm. Read the SpO₂ once the waveform is steady.",
          why: "People change their breathing when they know it is being counted.",
        },
        {
          text: "Palpate chest expansion: place your hands on the lower posterior chest with your thumbs close to the spine, ask for a deep breath and watch your thumbs move apart.",
          why: "Unequal movement points to a problem on the side that moves less, such as collapse or pain from a rib injury.",
        },
        {
          text: "Auscultate the posterior chest with the diaphragm on bare skin, from the apices to the bases, comparing left with right at each level, for one full breath per site. Ask your partner to breathe slowly through an open mouth. Repeat on the sides and front.",
          why: "Comparing side to side at the same level is how you spot a sound that is diminished, absent or added on one side.",
        },
        {
          text: "Identify where you hear vesicular, bronchovesicular and bronchial sounds, and check that each is in its expected place.",
          why: "A normal sound in the wrong place is abnormal: bronchial breath sounds over the peripheral lung suggest consolidation.",
        },
        {
          text: "Locate the five cardiac areas (APE To Man). Listen with the diaphragm at each, then with the bell at the apex. Palpate the carotid pulse while listening to identify S1.",
          why: "S1 happens at about the same time as the carotid pulse, which helps you tell S1 from S2 when the rate is fast.",
        },
        {
          text: "With a partner, count the apical and radial pulses at the same time for a full 60 seconds.",
          why: "Only simultaneous counts reveal a pulse deficit.",
        },
        {
          text: "On the manikin or sound library, identify crackles, wheezes, rhonchi, stridor and a pleural friction rub. For rhonchi, have the 'patient' cough and listen again.",
          why: "Rhonchi from secretions often clear with a cough; a friction rub does not.",
        },
        {
          text: "Document findings by location and phase, e.g. 'Fine crackles right lower lobe posteriorly on inspiration, not clearing with cough; RR 22, SpO₂ 94% on room air'. Flag anything new or abnormal and say who you would report it to.",
        },
      ],
      drills: [
        {
          id: "d1",
          prompt: "You count 11 regular breaths in 30 seconds. What is the respiratory rate?",
          answer: 22,
          tolerance: 0,
          unit: "breaths/min",
          working: "11 × 2 = 22 breaths/min, above the usual adult range of 12–20. Recount for a full minute and assess work of breathing and SpO₂.",
        },
        {
          id: "d2",
          prompt: "Counting together for a full minute, the apical rate is 112 and the radial rate is 96. What is the pulse deficit?",
          answer: 16,
          tolerance: 0,
          unit: "beats/min",
          working: "112 − 96 = 16 beats/min. Record the apical rate as the heart rate and report the deficit.",
        },
        {
          id: "d3",
          prompt: "A patient has smoked 1.5 packs of cigarettes a day for 20 years. How many pack-years is that?",
          answer: 30,
          tolerance: 0,
          unit: "pack-years",
          working: "Pack-years = packs per day × years smoked = 1.5 × 20 = 30 pack-years.",
        },
        {
          id: "d4",
          prompt: "Another patient smoked 10 cigarettes a day for 30 years (a pack holds 20). How many pack-years is that?",
          answer: 15,
          tolerance: 0,
          unit: "pack-years",
          working: "10 cigarettes = 0.5 pack per day. 0.5 × 30 = 15 pack-years.",
        },
      ],
      resultsGuide:
        "In a healthy partner you should hear vesicular sounds over most of the lung fields, bronchovesicular sounds near the sternum and between the scapulae, bronchial sounds over the trachea, and no adventitious sounds; chest expansion should be symmetrical and RR 12–20. S1 is loudest at the apex and S2 at the base; a soft S3 can be normal in young adults. Common sources of false findings are listening through clothing (rustling that mimics crackles), chest hair under the diaphragm, tubing rubbing against something, and a noisy room. On the manikin, describe each sound by type, location and phase of breathing rather than guessing a diagnosis. Reference ranges and documentation terms vary between agencies; use your agency's.",
    },
    {
      id: "n222-lab-head-to-toe",
      title: "Head-to-toe assessment and documentation drill",
      topic: "Health history & physical assessment",
      objective:
        "Complete a systematic head-to-toe assessment on a lab partner or manikin in a consistent order, document the findings objectively on a practice flow sheet and in a short narrative note, and calculate BMI, fluid balance, Glasgow Coma Scale and daily weight change from practice data.",
      safety: [
        "Ask your partner's permission before each body area, keep them draped, and let them decline any part; genitourinary assessment on partners is by history only.",
        "Perform hand hygiene before and after contact and clean the stethoscope, penlight and other shared equipment between partners.",
        "Use only gentle, light palpation of the abdomen on partners and stop if anything is tender.",
        "Shine the penlight briefly, from the side, to check pupils; don't hold it in the eye.",
        "Use fictional data only on practice forms; never record real patients' details in lab work.",
      ],
      materials: [
        "Stethoscope, penlight and alcohol wipes",
        "Thermometer, sphygmomanometer and pulse oximeter",
        "Scale and height measure",
        "Clean gloves",
        "Numeric pain scale card",
        "Practice flow sheet and narrative note template",
        "Simulation manikin with a wound dressing and IV line (if available)",
      ],
      steps: [
        {
          text: "Perform hand hygiene, introduce yourself, identify your partner with two identifiers, explain the assessment and provide privacy.",
          why: "Two identifiers are a core safety habit, and explaining what you're doing builds trust and cooperation.",
        },
        {
          text: "General survey and neurological: level of consciousness, orientation to person, place, time and situation, speech, mood and GCS; check pupils with the penlight (PERRLA).",
          why: "A change in mental status is often the first sign of a problem anywhere in the body.",
        },
        {
          text: "Measure vital signs and pain, height and weight.",
          why: "These give the baseline you'll compare every later set with, and the numbers for BMI.",
        },
        {
          text: "Head, neck and skin: oral mucosa, trachea position, skin colour, temperature, moisture and turgor, pressure points and capillary refill.",
        },
        {
          text: "Chest: heart sounds at the five areas and lung sounds side to side, front and back.",
        },
        {
          text: "Abdomen: inspect, auscultate all four quadrants, percuss, then palpate lightly; ask about the last bowel movement, appetite and nausea.",
          why: "Listening before you touch avoids changing the bowel sounds.",
        },
        {
          text: "Genitourinary by history: voiding pattern, urine colour, any catheter, and the intake and output record.",
        },
        {
          text: "Extremities: radial, dorsalis pedis and posterior tibial pulses on both sides, oedema, strength, sensation and range of motion.",
          why: "Comparing left with right picks up one-sided changes such as an arterial occlusion or a stroke.",
        },
        {
          text: "Lines, drains and wounds (on the manikin): IV site and date, dressing condition, drainage colour and amount.",
        },
        {
          text: "Document in the same order you assessed, using objective terms and only what you actually assessed. Write a short narrative note for anything abnormal and time-stamp your entries.",
          why: "Undocumented care is treated as not done, and charting in a fixed order makes missing items obvious.",
        },
      ],
      drills: [
        {
          id: "d1",
          prompt: "Your partner weighs 68 kg and is 160 cm tall. What is the BMI (one decimal place)?",
          answer: 26.6,
          tolerance: 0.1,
          unit: "kg/m²",
          working: "1.60² = 2.56. 68 / 2.56 ≈ 26.6 kg/m², in the overweight band (25–29.9).",
        },
        {
          id: "d2",
          prompt:
            "Over 12 hours a patient drinks three 200 mL cups of tea, receives IV fluid at 50 mL/h throughout and two 50 mL IV antibiotic infusions. Output is 900 mL of urine and 75 mL of wound drainage. What is the net fluid balance?",
          answer: 325,
          tolerance: 0,
          unit: "mL",
          working: "Intake = 600 (oral) + 600 (50 × 12 IV) + 100 (2 × 50 antibiotic) = 1,300 mL. Output = 900 + 75 = 975 mL. Net = 1,300 − 975 = +325 mL.",
        },
        {
          id: "d3",
          prompt: "A patient opens their eyes spontaneously, is confused in conversation and obeys commands. What is the GCS total?",
          answer: 14,
          tolerance: 0,
          unit: "points",
          working: "Eyes spontaneous = 4, confused = 4, obeys commands = 6. 4 + 4 + 6 = 14 out of 15.",
        },
        {
          id: "d4",
          prompt: "A patient weighed 79.9 kg yesterday and 81.4 kg today on the same scale at the same time. How much weight have they gained?",
          answer: 1.5,
          tolerance: 0,
          unit: "kg",
          working: "81.4 − 79.9 = 1.5 kg. 1 kg is roughly 1 L of retained fluid, so a gain this quick is reported, especially with oedema or crackles.",
        },
      ],
      resultsGuide:
        "A typical healthy partner's note reads something like: alert and oriented ×4, GCS 15, PERRLA; mucosa moist and pink, trachea midline; skin warm, dry, intact, capillary refill under 3 seconds; S1 and S2 heard, regular; lungs clear bilaterally; abdomen soft, non-tender, bowel sounds in all four quadrants; pulses 2+ and equal, no oedema, strength equal. Check your note for opinions ('looks fine', 'normal') where a specific finding belongs, for findings you charted but didn't assess, and for missing times. Your programme sets how long a full assessment should take and which flow-sheet terms to use; agencies differ in their charting-by-exception rules.",
    },
  ],

  cases: [
    {
      id: "n222-case-postop",
      title: "The post-op patient who 'just seems off'",
      topic: "Documentation & handoff",
      setting: "Medical-surgical unit, afternoon shift. Educational simulation with a fictional patient.",
      presentation:
        "Daniel Reyes, 68, is on post-operative day 1 after an open bowel resection. He has an abdominal incision with a dressing, a urinary catheter, IV fluids and a patient-controlled analgesia pump. At 0800 his vital signs were T 37.2 °C, HR 88, RR 16, BP 132/78, SpO₂ 97% on room air. At 1400 the nursing assistant reports: T 38.4 °C, HR 118, RR 26, BP 88/54, SpO₂ 92% on room air. His daughter says, \"He's not making sense. He thinks it's Sunday.\"",
      stages: [
        {
          title: "Recognise cues",
          prompt: "Which findings are concerning and need action? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Heart rate up from 88 to 118", good: true, feedback: "Tachycardia is often the first compensation for infection, bleeding or low fluid volume." },
            { text: "Respiratory rate of 26", good: true, feedback: "A respiratory rate of 22 or more is a red flag and often the earliest sign of deterioration." },
            { text: "Blood pressure down to 88/54 (MAP about 65)", good: true, feedback: "Systolic pressure has fallen by more than 40 mmHg, and the MAP is now at the lower limit for organ perfusion." },
            { text: "New confusion reported by his daughter", good: true, feedback: "An acute change in mental status is a sign of poor brain perfusion or sepsis, not 'just age'." },
            { text: "Temperature of 38.4 °C", good: true, feedback: "Fever on day 1 can have several causes, but together with the other changes it raises concern for infection." },
            { text: "Having an abdominal incision on post-op day 1", good: false, feedback: "Expected after this surgery; it is not a new cue on its own, although you will inspect the wound." },
          ],
          debrief:
            "Each value alone might be explained away, but together they show a clear trend: rising HR and RR, falling BP, fever and new confusion. With RR 22 or more, systolic BP 100 or less and altered mentation he meets all three qSOFA criteria. Possible causes include sepsis (e.g. an anastomotic leak) and bleeding. A nurse doesn't need to know the cause to recognise that the patient is deteriorating.",
        },
        {
          title: "Take immediate action",
          prompt: "What do you do right now? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Go to the bedside and recheck the vital signs yourself, including a manual BP", good: true, feedback: "Recheck confirms the trend: HR 120, RR 26, BP 86/52 manually, SpO₂ 92%. Your own assessment is the basis of your report." },
            { text: "Assess airway, breathing and circulation, skin colour and temperature, and capillary refill", good: true, feedback: "Airway clear; breathing fast and shallow; skin warm and flushed; capillary refill 3 seconds." },
            { text: "Check the incision, dressing and any drain output, and the urine output since morning", good: true, feedback: "Dressing dry; abdomen more distended and tender than this morning; only 60 mL of urine in the last 4 hours." },
            { text: "Stay with the patient and ask a colleague to bring the vital-signs monitor", good: true, feedback: "An unstable patient should not be left alone; continuous monitoring lets you see the trend." },
            { text: "Ask the nursing assistant to recheck the vital signs in an hour", good: false, feedback: "Waiting an hour risks further deterioration. The RN has to assess now, and assessment can't be delegated." },
            { text: "Finish your medication pass and then chart the 1400 vital signs", good: false, feedback: "Documentation matters, but acting on an unstable patient comes first." },
          ],
          debrief:
            "Confirm the findings yourself, assess ABCs, look for a source (wound, abdomen, drains) and check perfusion signs such as urine output and capillary refill. Follow agency protocols, such as raising oxygen per a standing order if SpO₂ stays below the target, and stay with the patient.",
        },
        {
          title: "Communicate with SBAR",
          prompt: "You call the surgical provider. Which message is the best SBAR?",
          mode: "single",
          options: [
            {
              text: "\"This is the RN on 4 West calling about Daniel Reyes in 412. He's newly confused, his BP is 86/52 and his heart rate is 120. He's day 1 after an open bowel resection, with no known allergies. Since 0800 his HR has gone from 88 to 120, RR is 26, temperature 38.4 °C, SpO₂ 92% on room air, his abdomen is more distended and tender, and urine output is 60 mL in 4 hours. I'm worried he may be septic or bleeding. I need you to see him now. What would you like me to do before you arrive?\"",
              good: true,
              feedback: "Clear, structured and complete, with the trend, a stated concern and a specific request with a time frame.",
            },
            {
              text: "\"Hi, it's the nurse for Mr. Reyes. He seems a bit off and his daughter is worried. Can you take a look when you get a chance?\"",
              good: false,
              feedback: "Vague. There are no data, no trend and no urgency; 'when you get a chance' invites delay.",
            },
            {
              text: "\"Mr. Reyes in 412 has a fever. Could you order something for it?\"",
              good: false,
              feedback: "This misses the most dangerous findings (hypotension, tachycardia, tachypnoea, confusion) and asks only for symptom relief.",
            },
            {
              text: "\"I think Mr. Reyes has an anastomotic leak and needs to go back to theatre.\"",
              good: false,
              feedback: "It's fine to state your concern, but this gives no data to support it and asks for a decision outside nursing scope instead of an urgent assessment.",
            },
          ],
          debrief:
            "A good SBAR gives the provider what they need to judge urgency in under a minute: who, what's happening, the relevant background, your findings with trends, your concern, and exactly what you need. Read back any verbal orders and document the call.",
        },
        {
          title: "Escalate",
          prompt: "Ten minutes later the provider hasn't arrived or called back. Mr. Reyes is now harder to rouse and his BP is 80/48. What do you do?",
          mode: "single",
          options: [
            {
              text: "Call the rapid response team per agency criteria, tell the charge nurse, and stay with the patient",
              good: true,
              feedback: "Worsening hypotension and falling consciousness meet rapid response criteria in most agencies. The team can be at the bedside within minutes.",
            },
            { text: "Page the same provider again and wait another 15 minutes", good: false, feedback: "Repeating a failed step while the patient worsens delays care. Use the chain of command." },
            { text: "Ask the daughter to keep an eye on him while you look for the provider", good: false, feedback: "Never leave a deteriorating patient in the care of a visitor." },
            { text: "Document that the provider was unavailable and continue routine care", good: false, feedback: "Documenting is necessary, but not instead of escalating; the patient is getting worse." },
          ],
          debrief:
            "When a patient deteriorates and the response is too slow, escalate through the chain of command: rapid response team, charge nurse, then the next provider. Rapid response teams exist so that any nurse can bring critical-care help to the bedside early.",
        },
        {
          title: "Evaluate and document",
          prompt: "The rapid response team takes over management. Which of the following should you do and document? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Give the team a concise SBAR handoff at the bedside", good: true, feedback: "The team gets the history and trend straight away and doesn't have to start from zero." },
            { text: "Document assessments, times, each person notified, what was reported, orders received and the patient's response", good: true, feedback: "A timed, factual record shows when deterioration was recognised and what was done." },
            { text: "Keep the daughter informed and supported, within your role", good: true, feedback: "Family members are often the first to notice a change; keeping them informed builds trust." },
            { text: "Keep reassessing vital signs and mental status at the interval the team sets", good: true, feedback: "Evaluation closes the nursing process loop and shows whether the interventions are working." },
            { text: "Write in the chart that the provider was negligent for not calling back", good: false, feedback: "Charts record facts, not blame. Record the times you called and who responded; raise concerns through an incident report or your manager." },
          ],
          debrief:
            "After escalation, the nurse's job continues: hand off clearly, keep assessing and document objectively. Afterwards, reflect on the cues: the respiratory rate and heart rate were rising before the blood pressure fell.",
        },
      ],
      teachingPoints: [
        "Trends matter more than single values: compare every set of vital signs with the patient's baseline.",
        "Rising RR and HR usually come before a falling BP; new confusion is a vital sign too.",
        "Confirm abnormal findings yourself, assess ABCs and stay with an unstable patient.",
        "Use SBAR with a specific Recommendation and time frame, read back orders, and document the call.",
        "If the response is too slow, escalate through the chain of command and call the rapid response team.",
      ],
    },
    {
      id: "n222-case-falls",
      title: "An admission with a fall waiting to happen",
      topic: "Safety, falls & pressure injury",
      setting: "Medical unit, evening admission. Educational simulation with a fictional patient.",
      presentation:
        "Evelyn Marsh, 81, is admitted from the emergency department at 1900 with a urinary tract infection and new confusion. Her son says she fell at home two days ago and \"gets up three or four times a night to use the bathroom\". She walks with a walker, wears glasses, takes a blood-pressure tablet and a sleeping tablet at home, and has an IV in her left forearm. She is oriented to person only and keeps saying she needs to go home to feed her cat. Lying in bed: T 37.9 °C, HR 84, RR 18, BP 136/78, SpO₂ 96% on room air.",
      stages: [
        {
          title: "Recognise risk factors",
          prompt: "Which findings increase Mrs Marsh's risk of falling? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "A fall at home two days ago", good: true, feedback: "A previous fall is one of the strongest predictors of another." },
            { text: "New confusion; oriented to person only", good: true, feedback: "She may not remember to call for help or recognise her limits." },
            { text: "Getting up several times a night to use the bathroom", good: true, feedback: "Urgency and nocturia drive unassisted night-time trips, when most inpatient falls happen." },
            { text: "Walks with a walker", good: true, feedback: "Needing a mobility aid signals impaired gait or balance." },
            { text: "IV line in her forearm", good: true, feedback: "Tubing and an IV pole are trip hazards and limit how she moves." },
            { text: "A sleeping tablet and a blood-pressure tablet at home", good: true, feedback: "Sedatives impair balance and alertness; antihypertensives can cause orthostatic hypotension." },
            { text: "SpO₂ of 96% on room air", good: false, feedback: "A normal saturation; it doesn't add to her fall risk." },
          ],
          debrief:
            "Mrs Marsh has many risk factors at once, and she would score as high risk on any common screening tool such as the Morse Fall Scale. Screen every patient on admission with your agency's tool, and screen her pressure-injury risk (Braden) at the same time. Her infection and fever may also be causing delirium, which should improve with treatment.",
        },
        {
          title: "Check for orthostatic changes",
          prompt:
            "Before she first gets up, you check orthostatic vital signs with a colleague guarding her and a gait belt on. Lying: BP 136/78, HR 84. After 3 minutes standing: BP 110/70, HR 102, and she says the room is spinning. How do you interpret this?",
          mode: "single",
          options: [
            { text: "Orthostatic hypotension: the systolic fell by 26 mmHg with dizziness. Sit her down, report it and plan transfers accordingly", good: true, feedback: "Correct. A systolic fall of 20 mmHg or more within 3 minutes of standing meets the definition, and she has symptoms." },
            { text: "Normal: a small drop on standing is expected", good: false, feedback: "A fall of 26 mmHg with dizziness is not a small drop." },
            { text: "Not interpretable because she is confused", good: false, feedback: "Blood pressure and heart rate are objective; confusion doesn't invalidate them." },
            { text: "Only significant if the diastolic falls by 20 mmHg or more", good: false, feedback: "The diastolic criterion is a fall of 10 mmHg or more; the systolic criterion alone is met here." },
          ],
          debrief:
            "Fever, poor intake and her antihypertensive could all contribute. Report the findings, encourage fluids if ordered, and teach her (and remind her often) to sit on the edge of the bed for a moment before standing. Always have help when she first stands.",
        },
        {
          title: "Plan prevention",
          prompt: "Which interventions belong in her fall-prevention plan? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Bed low and locked, with the call light, glasses, walker and belongings within reach", good: true, feedback: "Universal precautions are the foundation for every patient." },
            { text: "Scheduled toileting, including before sleep, and a bedside commode per policy", good: true, feedback: "Meeting the toileting need before she tries to go alone prevents the most common type of fall." },
            { text: "A bed alarm and a room near the nurses' station, per the high-risk protocol", good: true, feedback: "These alert staff when she gets up, so someone can reach her quickly." },
            { text: "Non-slip socks, a night light and a clear path to the bathroom", good: true, feedback: "Environmental fixes cost little and lower the risk." },
            { text: "Ask the provider to review her home sleeping tablet and blood-pressure medication", good: true, feedback: "A collaborative intervention: reviewing sedating and blood-pressure drugs is part of fall prevention." },
            { text: "Apply wrist restraints overnight so she can't get up alone", good: false, feedback: "Restraints are a last resort, need an order, can worsen delirium and don't reliably prevent falls." },
            { text: "Raise all four side rails", good: false, feedback: "Four raised rails count as a restraint in most agencies, and a confused patient may climb over them and fall further." },
          ],
          debrief:
            "A good plan combines universal precautions, measures matched to her specific risks (toileting, orthostatic hypotension, medications, confusion) and teaching for her and her family. Hourly rounding that checks pain, position, possessions and toileting ties it together.",
        },
        {
          title: "0300: the bed alarm",
          prompt: "At 0300 the bed alarm sounds. You find Mrs Marsh sitting on the edge of the bed trying to stand without her walker, saying she needs the toilet. What do you do first?",
          mode: "single",
          options: [
            { text: "Stay with her and help her to the commode or bathroom with her walker and a gait belt, then reassess", good: true, feedback: "You meet the need that got her up and keep her safe while doing it." },
            { text: "Tell her firmly to lie back down and wait until morning", good: false, feedback: "Her need is real; denying it makes her more likely to try again alone." },
            { text: "Silence the alarm and come back after you finish charting", good: false, feedback: "The alarm exists to bring someone to her now." },
            { text: "Call the provider for a restraint order", good: false, feedback: "Restraint is a last resort and doesn't address why she's getting up." },
          ],
          debrief:
            "Respond to every alarm straight away. Afterwards, look at the pattern: if she wakes to void at about the same time each night, schedule toileting before then. Check her orientation and vital signs, since worsening confusion could mean her infection is progressing.",
        },
        {
          title: "Hand off and document",
          prompt: "Which actions should you take before the end of your shift? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Document the fall-risk score, the orthostatic findings, the interventions in place and her response", good: true, feedback: "The record shows that the risk was identified and acted on." },
            { text: "Include her fall risk and toileting pattern in the bedside SBAR handoff", good: true, feedback: "The next nurse needs to know what got her up and what worked." },
            { text: "Teach her son the precautions and ask him to tell staff about her usual routine", good: true, feedback: "Family can share her habits and help reorient her." },
            { text: "Reassess fall risk when her condition, medications or mobility change, and at the interval policy sets", good: true, feedback: "Risk changes as she gets better or worse; the score isn't a one-off." },
            { text: "Leave fall risk out of handoff because the bed alarm is on", good: false, feedback: "Equipment doesn't replace communication; alarms are missed or switched off." },
          ],
          debrief:
            "Fall prevention depends on everyone knowing the plan. Document it, hand it off, involve the family and reassess as the patient changes.",
        },
      ],
      teachingPoints: [
        "Screen every patient for fall risk on admission and whenever their condition changes, using your agency's tool.",
        "Previous falls, confusion, toileting needs, mobility aids, IV lines and sedating or blood-pressure drugs all add up.",
        "Check orthostatic vital signs with help present before a high-risk patient first stands.",
        "Meet the toileting need before the patient tries to meet it alone; respond to bed alarms at once.",
        "Restraints and four raised side rails are a last resort and can increase injury.",
      ],
    },
    {
      id: "n222-case-tb",
      title: "Cough, fever and an open waiting room",
      topic: "Infection prevention",
      setting: "Emergency department, then a medical unit. Educational simulation with a fictional patient.",
      presentation:
        "Tomás Rivera, 42, comes to the emergency department with a cough he has had for 6 weeks, sometimes streaked with blood, along with fevers, drenching night sweats and about 6 kg of unintended weight loss. He has spent the last few months living in a crowded shelter. He is sitting in the open waiting area, coughing without covering his mouth. T 38.1 °C, HR 98, RR 20, BP 124/76, SpO₂ 95% on room air.",
      stages: [
        {
          title: "Recognise cues",
          prompt: "Which findings make you suspect an airborne infection such as pulmonary tuberculosis? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Cough for more than 3 weeks", good: true, feedback: "A prolonged cough is a classic screening trigger for TB." },
            { text: "Blood-streaked sputum", good: true, feedback: "Haemoptysis is a red flag that needs prompt evaluation." },
            { text: "Fevers, night sweats and weight loss", good: true, feedback: "These systemic symptoms fit active TB." },
            { text: "Living in a crowded shelter", good: true, feedback: "Congregate settings are a recognised risk factor for TB exposure." },
            { text: "Blood pressure of 124/76", good: false, feedback: "A normal blood pressure doesn't point towards or away from TB." },
          ],
          debrief:
            "Together these cues make pulmonary TB likely enough to act on. Precautions start on suspicion, not when the diagnosis is confirmed; waiting for test results would expose everyone in the waiting room.",
        },
        {
          title: "Act now",
          prompt: "What should happen first?",
          mode: "single",
          options: [
            { text: "Give him a surgical mask to wear, teach cough etiquette, and move him out of the waiting area to an airborne infection isolation room as soon as possible", good: true, feedback: "A mask on the patient is source control, and the negative-pressure room protects everyone else." },
            { text: "Leave him in the waiting room until a chest X-ray confirms TB", good: false, feedback: "Every minute in an open waiting room exposes other people." },
            { text: "Put him in an ordinary private room with the door open and droplet precautions", good: false, feedback: "TB is airborne; it needs negative pressure with the door closed." },
            { text: "Give him an N95 respirator to wear in the waiting room", good: false, feedback: "Patients wear a surgical mask for source control; the fit-tested N95 is for staff." },
          ],
          debrief:
            "Respiratory hygiene for the patient and rapid placement in an airborne infection isolation room come first. Tell the triage team and the infection prevention team, following agency policy.",
        },
        {
          title: "Set up precautions",
          prompt: "He is admitted to the medical unit. Which measures apply? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "An airborne infection isolation room with negative pressure and the door kept closed", good: true, feedback: "Negative pressure keeps droplet nuclei from drifting into the corridor." },
            { text: "Staff wear a fit-tested N95 respirator (or higher) before entering, and do a seal check each time", good: true, feedback: "Only a fitted respirator filters the tiny particles that carry TB." },
            { text: "Standard precautions continue, including gloves for contact with body fluids", good: true, feedback: "Transmission-based precautions add to standard precautions; they don't replace them." },
            { text: "Limit trips out of the room to essential tests, with him wearing a surgical mask", good: true, feedback: "Source control during transport protects people along the way." },
            { text: "A surgical mask is enough for staff because the door is closed", good: false, feedback: "A surgical mask doesn't filter airborne droplet nuclei; staff need a respirator." },
            { text: "Staff with a negative TB skin test don't need a respirator", good: false, feedback: "A negative test shows no past infection; it gives no protection against a new one." },
          ],
          debrief:
            "Airborne precautions mean the right room, the right respirator for every person entering, and as little movement out of the room as possible. Check that the room's pressure monitor shows negative pressure, per agency policy.",
        },
        {
          title: "Take off PPE",
          prompt: "After helping him wash, you are wearing gloves, a gown, goggles and an N95 respirator. Which sequence is correct?",
          mode: "single",
          options: [
            { text: "Gloves, then goggles, then gown before leaving the room; leave, close the door, remove the N95 by its straps without touching the front, then perform hand hygiene", good: true, feedback: "This follows the CDC sequence and keeps the respirator on until you are out of the contaminated air." },
            { text: "Remove the N95 first inside the room so you can breathe more easily, then the gown, gloves and goggles", good: false, feedback: "Removing the respirator inside the room exposes you to the air you were protecting yourself from." },
            { text: "Remove the gown and gloves in the corridor, then the N95, then the goggles", good: false, feedback: "Contaminated gown and gloves should come off before you leave the room." },
            { text: "Keep everything on until you reach the nurses' station", good: false, feedback: "This carries contamination through the unit." },
          ],
          debrief:
            "The most contaminated items come off first, the respirator comes off last and only outside the room, and hand hygiene follows (and is repeated whenever your hands become contaminated). Some agencies remove gown and gloves together; follow local policy.",
        },
        {
          title: "Communicate and teach",
          prompt: "His sister visits, and Tomás asks why everyone wears 'special masks'. Which responses are appropriate? Choose all that apply.",
          mode: "multi",
          options: [
            { text: "Explain in plain language that the precautions protect other people until tests show he isn't infectious, and that they are not a judgement of him", good: true, feedback: "Isolation can feel stigmatising and lonely; a clear explanation helps him cooperate." },
            { text: "Teach him to cough into a tissue, put it straight in the bin and clean his hands", good: true, feedback: "Respiratory hygiene is part of standard precautions and something he can do himself." },
            { text: "Follow agency policy on visitors, which may limit visits or require a respirator, and explain it to his sister", good: true, feedback: "Visitors need protection too, and the rules are easier to follow when they are explained." },
            { text: "Tell his sister he probably has TB before he has agreed to share that", good: false, feedback: "His diagnosis is his private health information; let him decide what to share." },
            { text: "Tell him the precautions can stop as soon as he feels better", good: false, feedback: "Precautions end only when criteria set by the provider and infection prevention team are met." },
          ],
          debrief:
            "Infection prevention includes the person inside the room: explain, teach respiratory hygiene, protect his privacy and keep visitors safe. TB is a reportable disease, and the infection prevention team and public health handle contact tracing.",
        },
      ],
      teachingPoints: [
        "A cough lasting weeks with fever, night sweats, weight loss or haemoptysis should trigger airborne precautions on suspicion.",
        "The patient wears a surgical mask for source control; staff wear a fit-tested N95 respirator.",
        "Airborne precautions need a negative-pressure room with the door closed, on top of standard precautions.",
        "Doff the respirator last, outside the room, and perform hand hygiene afterwards.",
        "Explain isolation, protect privacy and let infection prevention decide when precautions end.",
      ],
    },
  ],

  skills: [
    {
      id: "n222-skill-manual-bp",
      title: "Manual blood pressure measurement",
      purpose: "Accurate blood pressure guides decisions on medications, fluids and escalation; poor technique gives readings that mislead the whole team.",
      items: [
        { text: "Performs hand hygiene, identifies the patient with two identifiers, explains the procedure and obtains consent", critical: true },
        { text: "Checks that the patient has rested at least 5 minutes and has avoided caffeine, exercise and smoking for 30 minutes where possible" },
        { text: "Positions the patient seated with back supported, feet flat, legs uncrossed and the bare arm supported at heart level", critical: true },
        { text: "Checks for reasons not to use an arm (e.g. IV infusion, dialysis access, lymphoedema or mastectomy on that side)", critical: true },
        { text: "Chooses a cuff whose bladder length covers about 80% and width about 40% of the arm circumference", critical: true },
        { text: "Places the cuff snugly about 2–3 cm above the antecubital fossa with the bladder centred over the brachial artery" },
        { text: "Palpates the radial or brachial pulse, inflates until it disappears, notes that pressure, adds about 30 mmHg as the target and deflates fully", critical: true },
        { text: "Waits 1–2 minutes, places the stethoscope diaphragm over the brachial artery and inflates to the target pressure" },
        { text: "Deflates at 2–3 mmHg per second, recording the first clear tapping sound (systolic) and the point where sounds disappear (diastolic)", critical: true },
        { text: "Avoids talking with the patient during the measurement (talking raises readings), then deflates the cuff completely and removes it" },
        { text: "Records the reading with arm, position and cuff size; compares with baseline and reports abnormal values per agency policy", critical: true },
        { text: "Cleans the stethoscope and cuff and performs hand hygiene", critical: true },
      ],
    },
    {
      id: "n222-skill-hand-hygiene",
      title: "Hand hygiene: alcohol-based rub and soap and water",
      purpose: "Clean hands are the single most effective way to stop organisms travelling between patients, staff and surfaces.",
      items: [
        { text: "Keeps nails short with no artificial nails, and removes or limits jewellery per agency policy" },
        { text: "Performs hand hygiene at each of the five moments: before patient contact, before an aseptic task, after body-fluid exposure risk, after patient contact and after touching the surroundings", critical: true },
        { text: "Chooses alcohol-based rub unless hands are visibly soiled or after caring for a patient with C. difficile or norovirus, when soap and water are used", critical: true },
        { text: "Rub: applies enough product to cover every surface of both hands", critical: true },
        { text: "Rub: covers palms, backs of hands, between the fingers, backs of the fingers, thumbs and fingertips, and keeps rubbing until dry (about 20–30 seconds)", critical: true },
        { text: "Soap and water: wets hands, applies soap and lathers every surface for at least 20 seconds", critical: true },
        { text: "Rinses under running water, dries thoroughly with a single-use towel and turns off the tap with the towel" },
        { text: "Performs hand hygiene before putting on gloves and immediately after taking them off", critical: true },
        { text: "Uses agency-approved hand lotion to protect skin and reports dermatitis to occupational health" },
      ],
    },
    {
      id: "n222-skill-ppe",
      title: "Donning and doffing PPE",
      purpose: "PPE only protects staff and patients when it is chosen, put on and taken off in the right order without contaminating the wearer.",
      items: [
        { text: "Reads the precautions sign and gathers the right PPE, in the right size, before entering the room", critical: true },
        { text: "Performs hand hygiene before donning", critical: true },
        { text: "Gown: covers the body from neck to knees and arms to wrists, tied at the neck and waist" },
        { text: "Mask or respirator: secures ties or loops, moulds the nose piece and covers nose, mouth and chin; for an N95, uses the fit-tested model and performs a seal check", critical: true },
        { text: "Goggles or face shield: fits snugly over the eyes" },
        { text: "Gloves: pulls them on last, over the gown cuffs", critical: true },
        { text: "While in the room, keeps hands away from the face and doesn't adjust PPE; changes gloves if torn or heavily soiled" },
        { text: "Doffs gloves first using a glove-in-glove technique without touching the outside with bare skin", critical: true },
        { text: "Removes goggles or face shield by the headband or ear pieces, then unties the gown and peels it away, rolling it inside out", critical: true },
        { text: "Removes the mask or respirator last by its ties or straps without touching the front, removing a respirator only after leaving the room and closing the door", critical: true },
        { text: "Performs hand hygiene immediately after removing all PPE, and whenever hands become contaminated during removal", critical: true },
        { text: "Follows any local variation (e.g. removing gown and gloves together) as agency policy sets" },
      ],
    },
    {
      id: "n222-skill-rr-spo2",
      title: "Measuring respiratory rate and SpO₂",
      purpose: "A rising respiratory rate is often the earliest sign of deterioration, and a reliable SpO₂ reading guides oxygen therapy and escalation.",
      items: [
        { text: "Performs hand hygiene and identifies the patient with two identifiers", critical: true },
        { text: "Has the patient at rest, sitting upright or in a comfortable position, with the chest visible or easy to feel" },
        { text: "Counts respirations without telling the patient, straight after the pulse with fingers still on the wrist", critical: true },
        { text: "Counts for 30 seconds and doubles if regular, or for a full 60 seconds if irregular, abnormal or the patient is unwell", critical: true },
        { text: "Notes depth, rhythm and effort: accessory muscles, nasal flaring, tripod position and whether the patient can speak in full sentences" },
        { text: "Chooses a warm, well-perfused finger without nail polish or artificial nails, or another probe site per policy" },
        { text: "Waits for a steady waveform and checks that the displayed pulse rate matches the palpated pulse before reading the SpO₂", critical: true },
        { text: "Records the SpO₂ with the oxygen delivery (room air, or device and flow rate)", critical: true },
        { text: "Compares results with the patient's baseline and prescribed SpO₂ target; if a reading doesn't fit the patient, assesses the patient first", critical: true },
        { text: "Reports values outside agency parameters promptly, and moves the probe site at the interval policy sets for continuous monitoring", critical: true },
        { text: "Cleans the probe and performs hand hygiene" },
      ],
    },
  ],
};
