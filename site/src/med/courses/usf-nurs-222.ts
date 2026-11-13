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
  ],
};
