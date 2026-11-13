import type { Course } from "../types";

/** Original study content aligned with the topics of USF School of Nursing & Health Professions NURS 220. */
export const usfNurs220: Course = {
  id: "usf-nurs-220",
  code: "NURS 220",
  title: "Applied Pathophysiology & Pharmacology I",
  description:
    "Study companion aligned with the University of San Francisco's NURS 220 (first BSN nursing semester): cellular injury and adaptation, inflammation and healing, fluid, electrolyte and acid–base imbalances, pharmacokinetics, pharmacodynamics and medication safety, taught as principles with NCLEX-style practice. The topics are those typical of an introductory applied patho/pharm course, so check them against your own syllabus. Not affiliated with or endorsed by USF. For education only: it teaches mechanisms and drug classes, never doses, and in practice you follow your program's and clinical agency's policies.",
  topics: [
    "Cellular injury & adaptation",
    "Inflammation & healing",
    "Fluids & electrolytes",
    "Acid–base balance",
    "Pharmacokinetics",
    "Pharmacodynamics",
    "Medication safety",
  ],

  concepts: [
    {
      slug: "n220-cell-injury-adaptation",
      model: "cell",
      title: "Cellular adaptation, injury and cell death",
      topic: "Cellular injury & adaptation",
      summary:
        "Stressed cells first adapt (atrophy, hypertrophy, hyperplasia, metaplasia). If the stress is too great they are injured, reversibly at first, and then die by necrosis (with inflammation) or apoptosis (without).",
      body: `**Adaptations** are reversible changes in cell size, number or type in response to stress:
- **Atrophy**: smaller cells from reduced use, blood supply, nutrition or hormonal stimulation (e.g. leg muscles in a cast)
- **Hypertrophy**: bigger cells from increased workload (e.g. left ventricular hypertrophy in long-standing hypertension)
- **Hyperplasia**: more cells, only in tissues that can divide (e.g. endometrium in the menstrual cycle, benign prostatic hyperplasia)
- **Metaplasia**: one mature cell type replaced by another that copes better (e.g. ciliated columnar cells of a smoker's bronchi replaced by squamous cells; squamous oesophageal lining replaced by columnar cells in Barrett's oesophagus)
- **Dysplasia**: disordered growth with abnormal size, shape and organisation. Not a true adaptation; it can progress to cancer.

**Causes of injury**: hypoxia (the commonest), free radicals (including reperfusion injury), chemicals and drugs, infection, physical trauma, immune reactions, nutritional imbalance.

**Reversible injury**: hypoxia → less ATP → the Na⁺/K⁺-ATPase pump fails → sodium and water enter → **cellular swelling**. Cells also switch to anaerobic glycolysis, making lactic acid. Fatty change can occur in the liver.

**Irreversible injury** follows severe membrane damage, mitochondrial failure and calcium influx that activates destructive enzymes.
- **Necrosis**: cells swell and burst, spill contents and trigger inflammation. Types: coagulative (myocardial infarct), liquefactive (brain, abscess), caseous (tuberculosis), fat (pancreatitis), and gangrene (ischaemic limb).
- **Apoptosis**: programmed, energy-dependent cell death; the cell shrinks and is tidily phagocytosed with no inflammation.`,
      pearls: [
        "Troponin rises after a myocardial infarction because necrotic heart cells leak their contents into the blood.",
        "Hypoxic injury caught early is reversible, which is why restoring oxygen and perfusion quickly matters.",
        "Removing the stimulus (stopping smoking, controlling reflux) can let metaplasia regress before dysplasia develops.",
      ],
    },
    {
      slug: "n220-inflammation-healing",
      title: "Acute inflammation and wound healing",
      topic: "Inflammation & healing",
      summary:
        "Inflammation has a vascular phase (vasodilation, leaky capillaries) and a cellular phase (neutrophils, then macrophages). Healing runs through haemostasis, inflammation, proliferation and remodelling, and many patient factors slow it.",
      body: `**Vascular phase**: mediators such as histamine, bradykinin and prostaglandins cause **vasodilation** (redness, heat) and **increased capillary permeability**, so protein-rich fluid leaks into tissue (swelling). Swelling and mediators stimulate nerve endings (pain), and together these impair function.

The five cardinal signs: **rubor** (redness), **calor** (heat), **tumor** (swelling), **dolor** (pain), **functio laesa** (loss of function).

**Cellular phase**
1. **Margination** and **adhesion**: white cells line up along the vessel wall
2. **Diapedesis**: they squeeze out between endothelial cells
3. **Chemotaxis**: they follow chemical signals to the injury
4. **Phagocytosis**: neutrophils arrive first; macrophages follow and clean up

**Systemic signs**: fever (IL-1, IL-6 and TNF-α raise the hypothalamic set point through prostaglandin E₂), leukocytosis with a **left shift** (more immature band neutrophils), raised C-reactive protein and ESR, malaise.

**Drug classes that act here (mechanisms only)**
- **NSAIDs** inhibit cyclo-oxygenase (COX), cutting prostaglandin production: less pain, fever and swelling. Aspirin inhibits COX irreversibly.
- **Acetaminophen (paracetamol)** reduces pain and fever but has little anti-inflammatory effect.
- **Corticosteroids** suppress many steps of inflammation and immunity (including the phospholipase A₂ pathway that feeds both prostaglandins and leukotrienes), but they also delay healing and raise blood glucose.

**Wound healing phases**: haemostasis → inflammation → **proliferation** (granulation tissue, new capillaries, fibroblasts laying down collagen, epithelial cells covering the wound, contraction) → **maturation/remodelling** (collagen reorganised for a year or more; a scar regains only about 80% of the original tensile strength).

**Healing by intention**: primary (edges brought together, e.g. a sutured incision), secondary (left open to fill with granulation tissue, e.g. a pressure injury), tertiary/delayed primary (left open, then closed once infection is controlled).

**What slows healing**: poor perfusion or oxygenation, diabetes, malnutrition (protein, vitamin C, zinc), infection, smoking, older age, obesity, corticosteroids and other immunosuppressants.`,
      pearls: [
        "Older adults and people on corticosteroids may have a serious infection with little fever or redness, so look for subtle signs such as new confusion.",
        "A left shift on the white cell differential suggests acute bacterial infection: the marrow is releasing young neutrophils early.",
        "Purulent drainage, spreading redness, increasing pain and fever after a few days are signs of wound infection to report.",
      ],
    },
    {
      slug: "n220-fluids-electrolytes",
      model: "water",
      title: "Fluid volume and electrolyte imbalances",
      topic: "Fluids & electrolytes",
      summary:
        "Water moves between compartments by osmosis and Starling forces. Volume deficit and excess, and abnormal sodium, potassium, calcium and magnesium, each have causes, signs and nursing cues you need to recognise.",
      formulas: [
        "\\text{fluid balance} = \\text{total intake} - \\text{total output}",
        "1\\ \\text{kg body weight change} \\approx 1\\ \\text{L fluid}",
        "\\text{minimum urine output} \\approx 0.5\\ \\text{mL/kg/h} \\ (\\text{about } 30\\ \\text{mL/h in adults})",
      ],
      body: `**Compartments**: total body water is about 60% of an adult's body weight (less in older adults, more in infants). About two-thirds is **intracellular** and one-third **extracellular** (interstitial fluid plus plasma).

**Starling forces**: capillary hydrostatic pressure pushes fluid out; plasma oncotic pressure (mostly albumin) pulls it back in. **Oedema** results from raised hydrostatic pressure (heart failure), low albumin (liver disease, nephrotic syndrome, malnutrition), leaky capillaries (inflammation, burns) or blocked lymphatics.

**IV solution tonicity** (relative to plasma)
- **Isotonic** (0.9% sodium chloride, lactated Ringer's): stays in the extracellular space; used to expand volume
- **Hypotonic** (0.45% sodium chloride): water shifts into cells; avoid where cell swelling is dangerous, e.g. raised intracranial pressure
- **Hypertonic** (e.g. 3% sodium chloride): pulls water out of cells; given only under close monitoring
- Dextrose 5% in water is isotonic in the bag but acts as free water once the glucose is used.

**Fluid volume deficit (hypovolaemia)**: tachycardia, weak thready pulse, orthostatic hypotension, dry mucous membranes, poor skin turgor, low concentrated urine output, raised urine specific gravity (above about 1.030), weight loss, haemoconcentration, BUN rising out of proportion to creatinine.

**Fluid volume excess**: bounding pulse, hypertension, distended neck veins, crackles, dyspnoea, oedema, weight gain, dilute blood (low haematocrit).

**Key electrolytes** (typical adult ranges; your lab's may differ)
- **Sodium** 135–145 mEq/L. Abnormalities mainly show as **neurological** change: confusion, headache, seizures. Chronic abnormalities are corrected slowly because rapid change in plasma sodium can damage the brain.
- **Potassium** 3.5–5.0 mEq/L. Abnormalities show in **muscles and the heart**. Low: weakness, cramps, constipation, flat T waves, U waves, arrhythmias; causes include vomiting, diarrhoea, NG suction and loop or thiazide diuretics. High: muscle weakness, peaked T waves, wide QRS, cardiac arrest risk; causes include kidney injury, potassium-sparing diuretics, ACE inhibitors and cell breakdown.
- **Calcium** (total) about 9.0–10.5 mg/dL. Low: tingling, muscle cramps, tetany, positive Chvostek and Trousseau signs, prolonged QT. High: weakness, constipation, kidney stones, confusion, shortened QT.
- **Magnesium** about 1.3–2.1 mEq/L. Low magnesium often travels with low potassium and makes it hard to correct.`,
      pearls: [
        "Daily weight is the best bedside measure of fluid change: same time, same scale, same clothing, ideally before breakfast after voiding.",
        "Older adults have a blunted thirst response and less body water, so they become dehydrated quickly with vomiting or diarrhoea.",
        "Potassium problems kill through the heart: put the patient on a cardiac monitor and look at the rhythm, not just the number.",
      ],
    },
    {
      slug: "n220-acid-base",
      model: "carbonic-acid",
      title: "Acid–base balance and ABG interpretation",
      topic: "Acid–base balance",
      summary:
        "Blood pH stays at 7.35–7.45 through buffers, the lungs (CO₂, fast) and the kidneys (HCO₃⁻, slow). Read an ABG in order: pH, PaCO₂, HCO₃⁻, then compensation.",
      formulas: [
        "CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-",
        "pH = 6.1 + \\log_{10}\\dfrac{[HCO_3^-]}{0.03 \\times P_aCO_2}",
      ],
      body: `**Normal arterial values**: pH 7.35–7.45, PaCO₂ 35–45 mmHg (the respiratory, acid component), HCO₃⁻ 22–26 mEq/L (the metabolic, base component).

The **carbonic acid–bicarbonate buffer** links them; carbonic anhydrase speeds the reaction:

$$ CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^- $$

Check with normal values: $24 / (0.03 \\times 40) = 20$, $\\log_{10} 20 \\approx 1.3$, so pH ≈ 6.1 + 1.3 = 7.4.

**Three lines of defence**: chemical buffers (seconds: bicarbonate, phosphate, proteins including haemoglobin), lungs (minutes to hours: change the rate and depth of breathing to blow off or keep CO₂), kidneys (hours to days: excrete H⁺, reabsorb or make HCO₃⁻).

**Step-by-step ABG reading**
1. pH: below 7.35 acidosis, above 7.45 alkalosis
2. PaCO₂: does it explain the pH? High CO₂ = respiratory acidosis; low = respiratory alkalosis
3. HCO₃⁻: does it explain the pH? Low = metabolic acidosis; high = metabolic alkalosis
4. Compensation: if the other value has moved in the opposite-acting direction, compensation is under way. pH still abnormal = partly compensated; pH back in range = fully compensated.

**ROME**: **R**espiratory **O**pposite (pH and PaCO₂ move in opposite directions), **M**etabolic **E**qual (pH and HCO₃⁻ move the same way).

**Common causes**
- Respiratory acidosis: hypoventilation (COPD exacerbation, opioid or sedative overdose, neuromuscular weakness)
- Respiratory alkalosis: hyperventilation (anxiety, pain, early sepsis, pulmonary embolism, high altitude)
- Metabolic acidosis: diabetic ketoacidosis, lactic acidosis, kidney failure, severe diarrhoea (bicarbonate loss); deep rapid Kussmaul breathing is respiratory compensation
- Metabolic alkalosis: vomiting or NG suction (acid loss), diuretics, excess antacid or bicarbonate intake`,
      pearls: [
        "Acidosis tends to shift potassium out of cells (risk of hyperkalaemia); alkalosis shifts it into cells (risk of hypokalaemia).",
        "A patient with slow shallow breathing after opioids is retaining CO₂; respiratory acidosis is a breathing problem first.",
        "Prolonged vomiting causes metabolic alkalosis and hypokalaemia together, so expect both.",
      ],
    },
    {
      slug: "n220-pharmacokinetics",
      model: "bilayer",
      title: "Pharmacokinetics: ADME, half-life and steady state",
      topic: "Pharmacokinetics",
      summary:
        "Pharmacokinetics is what the body does to the drug: absorption, distribution, metabolism and excretion. Half-life sets how fast levels fall and how long a regular regimen takes to reach steady state (about 4–5 half-lives).",
      formulas: [
        "\\text{fraction remaining} = \\left(\\tfrac{1}{2}\\right)^{n}, \\quad n = \\dfrac{t}{t_{1/2}}",
        "t_{1/2} = \\dfrac{0.693 \\times V_d}{CL}",
      ],
      body: `**Absorption**: movement from the site of administration into the blood. Most drugs cross membranes by passive diffusion through the lipid bilayer, so small, lipid-soluble, non-ionised molecules cross best.
- **Bioavailability** is the fraction reaching the systemic circulation: 100% by the IV route, often less orally.
- **First-pass effect**: oral drugs travel from the gut through the portal vein to the liver, which may metabolise much of the drug before it reaches the body. Sublingual, buccal, transdermal, rectal (partly) and IV routes avoid or reduce it; this is why sublingual nitroglycerin works fast.

**Distribution**: depends on blood flow, protein binding and barriers.
- Only **free (unbound)** drug is active. Highly albumin-bound drugs (e.g. warfarin) have more free drug when albumin is low or when another bound drug displaces them.
- The blood–brain barrier and the placenta limit or allow passage depending on lipid solubility.

**Metabolism** (biotransformation), mainly in the liver by cytochrome P450 enzymes, usually makes drugs more water-soluble for excretion. Some drugs are **prodrugs** activated by metabolism.
- **Inducers** (e.g. rifampin, carbamazepine, St John's wort) speed metabolism → lower levels of other drugs
- **Inhibitors** (e.g. grapefruit juice, clarithromycin, azole antifungals) slow it → higher levels and toxicity risk

**Excretion**: mostly renal. Reduced kidney function (older adults, kidney disease, dehydration) lets renally cleared drugs accumulate.

**Half-life** ($t_{1/2}$): time for the plasma concentration to fall by half. With first-order elimination, after $n$ half-lives the fraction left is $(1/2)^n$: 50%, 25%, 12.5%, 6.25%, 3.125%. After about 4–5 half-lives a drug is considered essentially eliminated.

**Steady state**: with repeated, regular dosing, intake and elimination balance after about **4–5 half-lives** (about 94% and 97% of the plateau). A **loading dose** can reach target levels sooner for drugs with long half-lives; the prescriber decides this.

**Therapeutic drug monitoring**: for some drugs, levels are drawn at set times. A **trough** is drawn just before the next scheduled administration; a **peak** at a set time after it.`,
      pearls: [
        "Changing from IV to oral is not a straight swap: first-pass metabolism and bioavailability differ, which is why prescriptions for the two routes can differ.",
        "Older adults often have lower albumin, slower liver metabolism and reduced kidney function, so drugs last longer and accumulate: start-low thinking applies.",
        "Ask about herbal products and grapefruit juice: they cause real enzyme interactions.",
      ],
    },
    {
      slug: "n220-pharmacodynamics",
      model: "enzyme",
      title: "Pharmacodynamics: receptors, agonists, antagonists and therapeutic index",
      topic: "Pharmacodynamics",
      summary:
        "Pharmacodynamics is what the drug does to the body: it binds a target (receptor, enzyme, ion channel or transporter) and either activates or blocks it. The therapeutic index compares the toxic and effective doses; narrow-index drugs need close monitoring.",
      formulas: ["TI = \\dfrac{TD_{50}}{ED_{50}}"],
      body: `**Drug targets**: receptors (e.g. β-adrenergic, opioid), enzymes (e.g. COX, ACE), ion channels and transporters.

**How drugs act at a target**
- **Agonist**: binds and activates (e.g. morphine at μ-opioid receptors; albuterol/salbutamol at β₂ receptors in the airways)
- **Partial agonist**: binds and activates only partly, and can blunt a full agonist (e.g. buprenorphine at μ-opioid receptors)
- **Competitive antagonist**: binds the same site without activating it and can be overcome by more agonist (e.g. naloxone at opioid receptors; β-blockers such as metoprolol at β₁ receptors; atropine at muscarinic receptors)
- **Non-competitive or irreversible inhibition**: the effect cannot be overcome by more agonist and lasts until new target is made (e.g. aspirin's irreversible inhibition of the COX enzyme in platelets)

**Potency vs efficacy**: potency is how much drug is needed for an effect; efficacy is the maximum effect possible. A more potent drug is not necessarily more effective.

**Therapeutic index (TI)** = $TD_{50} / ED_{50}$, the ratio of the dose toxic in 50% of a population to the dose effective in 50%.
- **Wide TI**: big safety margin
- **Narrow TI**: small gap between helpful and harmful levels, e.g. digoxin, lithium, phenytoin, warfarin, aminoglycosides, insulin. These need levels or lab markers (drug levels, INR, glucose) and careful assessment.

**Receptor regulation**: long-term agonist exposure can **down-regulate** receptors (tolerance); long-term antagonist exposure can **up-regulate** them, so stopping suddenly causes rebound. For example, abruptly stopping a β-blocker can cause rebound tachycardia, hypertension and angina.`,
      pearls: [
        "Naloxone usually wears off sooner than many opioids, so a patient who wakes up can become sedated again: keep monitoring breathing and sedation.",
        "Before giving a narrow-TI drug, check the latest relevant level or lab value and the assessment the agency requires (for example apical pulse for digoxin).",
        "Teach patients not to stop β-blockers, anticonvulsants or corticosteroids suddenly without talking to their prescriber.",
      ],
    },
    {
      slug: "n220-medication-safety",
      title: "Adverse effects, rights of medication administration and high-alert medications",
      topic: "Medication safety",
      summary:
        "Safe administration means checking the rights every time, identifying the patient with two identifiers, knowing which drugs are high-alert, recognising adverse reactions and reporting errors in a just culture.",
      body: `**Types of unwanted drug effects**
- **Side effect**: predictable, usually mild, secondary effect (e.g. drowsiness with first-generation antihistamines)
- **Adverse drug reaction**: harmful, unintended response at normal use
- **Allergic reaction**: immune-mediated; ranges from rash to **anaphylaxis** (airway swelling, wheeze, hypotension), a life-threatening emergency
- **Idiosyncratic reaction**: unexpected, often genetically determined
- **Toxic effect**: from excess drug or accumulation, e.g. when the kidneys fail
- **Boxed (black box) warning**: the US FDA's strongest label warning about serious risk

**Rights of medication administration**: right **patient**, right **drug**, right **dose**, right **route**, right **time**, plus right **documentation**, right **reason/indication**, right **response** (evaluation) and the patient's right to **refuse** and to **education**.

**Core safety practices**
- Identify the patient with **two identifiers** (e.g. name and date of birth), never the room or bed number
- Check allergies before every administration
- Perform the **three checks**: when retrieving, when preparing and at the bedside before giving
- Use barcode scanning as designed, and never work around it
- Do not give a drug you did not prepare yourself or cannot identify
- Question any order that is unclear, unusual or doesn't fit the patient, and clarify with the prescriber before acting
- Avoid abbreviations on The Joint Commission's "do not use" list (e.g. U for unit, QD, QOD, MS); never use a trailing zero after a whole number, and always use a leading zero before a decimal point

**High-alert medications** (ISMP) cause significant harm when used in error: insulin, opioids, anticoagulants (heparin, warfarin and others), concentrated electrolytes (e.g. concentrated potassium chloride for injection), chemotherapy, neuromuscular blocking agents, and IV moderate-sedation drugs. Many agencies require an **independent double-check** for some of these.

**When an error happens**: assess the patient first, notify the prescriber and charge nurse, follow orders to monitor or treat, and complete an incident (safety event) report. Report near misses too. A just culture focuses on fixing systems while still expecting individual accountability.`,
      pearls: [
        "Concentrated IV potassium is never given by IV push: it must be diluted and given by infusion pump at a rate set by policy, because a bolus can stop the heart.",
        "Insulin and heparin errors often come from misread abbreviations and decimal points, which is why 'U' is banned and leading zeros are required.",
        "The patient is the last safety check: if they say 'that pill looks different', stop and verify.",
      ],
    },
  ],

  lectures: [
    {
      id: "n220-l1",
      week: 2,
      title: "Cellular injury, inflammation and healing",
      topic: "Cellular injury & adaptation",
      summary: "How cells adapt to stress, how they are injured and die, how acute inflammation unfolds, and what helps or hinders wound healing.",
      notes: `- Adaptations: atrophy, hypertrophy, hyperplasia, metaplasia (dysplasia is not a true adaptation)
- Hypoxia → less ATP → Na⁺/K⁺ pump fails → cell swelling (reversible)
- Necrosis = inflammation and leaked contents; apoptosis = tidy, no inflammation
- Inflammation: vascular phase (vasodilation, permeability) then cellular phase (neutrophils → macrophages)
- NSAIDs block COX; corticosteroids suppress broadly but delay healing and raise glucose
- Healing: haemostasis → inflammation → proliferation → remodelling; scar ≈ 80% strength`,
      insights: [
        { type: "exam_tip", text: "NCLEX loves the cause–adaptation match: smoker's bronchi = metaplasia; hypertensive heart = hypertrophy; immobilised limb = atrophy.", conceptSlug: "n220-cell-injury-adaptation" },
        { type: "exam_tip", text: "If a question asks which patient is at greatest risk of poor healing, look for diabetes, corticosteroid use, malnutrition or smoking.", conceptSlug: "n220-inflammation-healing" },
        { type: "clinical_link", text: "A raised troponin is necrosis you can measure: heart cells have died and leaked their contents.", conceptSlug: "n220-cell-injury-adaptation" },
        { type: "intuition", text: "Inflammation is the body opening the roads (vasodilation) and the gates (permeability) so the repair crews (white cells) can get in.", conceptSlug: "n220-inflammation-healing" },
      ],
    },
    {
      id: "n220-l2",
      week: 5,
      title: "Fluids, electrolytes and acid–base",
      topic: "Fluids & electrolytes",
      summary: "Body fluid compartments, volume deficit and excess, the major electrolyte imbalances, and a step-by-step method for reading arterial blood gases.",
      notes: `- Total body water ≈ 60% of adult weight; two-thirds intracellular
- Deficit: tachycardia, orthostatic hypotension, low concentrated urine, weight loss
- Excess: bounding pulse, crackles, JVD, oedema, weight gain
- 1 kg weight change ≈ 1 L fluid; minimum urine output ≈ 30 mL/h (0.5 mL/kg/h)
- Sodium → brain; potassium → heart and muscle; calcium → nerves, muscle, QT
- ABG: pH → PaCO₂ → HCO₃⁻ → compensation; ROME`,
      insights: [
        { type: "exam_tip", text: "For any potassium abnormality, the priority answer is usually cardiac monitoring: the arrhythmia is what kills.", conceptSlug: "n220-fluids-electrolytes" },
        { type: "exam_tip", text: "Daily weight beats I&O for tracking fluid status in exam questions; a gain of 1 kg overnight is roughly 1 L retained.", conceptSlug: "n220-fluids-electrolytes" },
        { type: "exam_tip", text: "Match the story to the gas: vomiting → metabolic alkalosis; diarrhoea or DKA → metabolic acidosis; opioid overdose → respiratory acidosis; panic attack → respiratory alkalosis.", conceptSlug: "n220-acid-base" },
        { type: "intuition", text: "CO₂ is an acid you can breathe out; bicarbonate is a base the kidneys keep or let go. Lungs act fast, kidneys act slowly.", conceptSlug: "n220-acid-base" },
      ],
    },
    {
      id: "n220-l3",
      week: 8,
      title: "How drugs move and act, and how to give them safely",
      topic: "Pharmacokinetics",
      summary: "ADME, half-life and steady state; agonists, antagonists and the therapeutic index; and the safety practices that prevent medication errors.",
      notes: `- ADME: absorption, distribution, metabolism, excretion
- First-pass effect reduces oral bioavailability; IV = 100%
- Only free drug is active; low albumin raises the free fraction
- After n half-lives, $(1/2)^n$ remains; steady state in about 4–5 half-lives
- Agonist activates; antagonist blocks; partial agonist does some of both
- Narrow TI: digoxin, lithium, phenytoin, warfarin, aminoglycosides, insulin
- Rights of administration, two identifiers, three checks, high-alert drugs`,
      insights: [
        { type: "exam_tip", text: "Steady state depends on half-life, not on how big each dose is: about 4–5 half-lives whatever the regimen.", conceptSlug: "n220-pharmacokinetics" },
        { type: "exam_tip", text: "When naloxone reverses opioid sedation, the next best action is to keep monitoring respirations: re-sedation is a classic test answer.", conceptSlug: "n220-pharmacodynamics" },
        { type: "exam_tip", text: "In error questions, 'assess the patient' comes before 'notify the prescriber' and 'complete an incident report'; the report is not mentioned in the patient's chart.", conceptSlug: "n220-medication-safety" },
        { type: "clinical_link", text: "A patient with kidney injury may develop toxicity from a renally cleared drug at a regimen that was safe last week.", conceptSlug: "n220-pharmacokinetics" },
      ],
    },
  ],

  questions: [
    {
      id: "n220-q1",
      type: "mcq",
      topic: "Cellular injury & adaptation",
      difficulty: 1,
      prompt: "A biopsy from a long-term smoker shows the normal ciliated columnar lining of the bronchi replaced by stratified squamous cells. Which adaptation is this?",
      options: ["Atrophy", "Hypertrophy", "Hyperplasia", "Metaplasia"],
      answer: 3,
      hints: ["The number and size of cells aren't the point here.", "One mature cell type has been swapped for another."],
      explanation:
        "Metaplasia is the replacement of one mature cell type by another that tolerates the stress better. Squamous cells resist smoke but lose the cilia that clear mucus, which is one reason smokers cough and get chest infections.",
      concepts: ["n220-cell-injury-adaptation"],
    },
    {
      id: "n220-q2",
      type: "mcq",
      topic: "Inflammation & healing",
      difficulty: 2,
      prompt: "How do NSAIDs reduce the redness, swelling and pain of acute inflammation?",
      options: [
        "They inhibit cyclo-oxygenase, reducing prostaglandin synthesis",
        "They block histamine H₁ receptors on blood vessels",
        "They kill the bacteria that started the inflammation",
        "They stimulate neutrophils to leave the tissue",
      ],
      answer: 0,
      hints: ["Which mediators cause vasodilation, pain sensitisation and fever?", "COX enzymes make them."],
      explanation:
        "NSAIDs inhibit COX, so less prostaglandin is made: less vasodilation, less pain sensitisation and less fever. Antihistamines block H₁ receptors; NSAIDs have no antibacterial action.",
      concepts: ["n220-inflammation-healing", "n220-pharmacodynamics"],
    },
    {
      id: "n220-q3",
      type: "numeric",
      topic: "Fluids & electrolytes",
      difficulty: 2,
      prompt:
        "Over an 8-hour shift a patient drinks 240 mL of juice and 360 mL of water, and receives IV fluid at 100 mL/h for the whole shift. Output is 650 mL of urine and 150 mL of emesis. What is the fluid balance for the shift? (Use a negative number for a deficit.)",
      answer: 600,
      tolerance: 0,
      unit: "mL",
      hints: ["IV intake = rate × hours.", "Balance = total intake − total output."],
      explanation:
        "Intake: 240 + 360 + (100 × 8 = 800) = 1,400 mL. Output: 650 + 150 = 800 mL. Balance = 1,400 − 800 = +600 mL (positive balance).",
      concepts: ["n220-fluids-electrolytes"],
    },
    {
      id: "n220-q4",
      type: "numeric",
      topic: "Fluids & electrolytes",
      difficulty: 1,
      prompt: "Using a minimum urine output of 0.5 mL/kg/h, what is the lowest acceptable hourly urine output for an adult who weighs 80 kg?",
      answer: 40,
      tolerance: 0,
      unit: "mL/h",
      hints: ["Multiply the weight by the per-kilogram rate."],
      explanation: "80 kg × 0.5 mL/kg/h = 40 mL/h. Less than this for two or more hours in a row should be reported.",
      concepts: ["n220-fluids-electrolytes"],
    },
    {
      id: "n220-q5",
      type: "mcq",
      topic: "Acid–base balance",
      difficulty: 2,
      prompt:
        "A patient who has been vomiting for two days has an ABG of pH 7.50, PaCO₂ 47 mmHg, HCO₃⁻ 34 mEq/L. How do you interpret it?",
      options: [
        "Respiratory alkalosis, uncompensated",
        "Metabolic alkalosis, partly compensated",
        "Metabolic acidosis, fully compensated",
        "Respiratory acidosis, partly compensated",
      ],
      answer: 1,
      hints: ["pH above 7.45 is alkalosis. Which value explains it?", "PaCO₂ is slightly high: is that cause or compensation?"],
      explanation:
        "pH 7.50 = alkalosis. HCO₃⁻ 34 is high, which explains an alkalosis (metabolic). PaCO₂ 47 is high, which would cause acidosis, so it is the lungs compensating by retaining CO₂. pH is still abnormal, so partly compensated. Losing gastric acid by vomiting causes metabolic alkalosis.",
      concepts: ["n220-acid-base"],
    },
    {
      id: "n220-q6",
      type: "numeric",
      topic: "Pharmacokinetics",
      difficulty: 1,
      prompt: "A drug follows first-order elimination. What percentage of the plasma concentration remains after 5 half-lives, assuming no more drug is given?",
      answer: 3.125,
      tolerance: 0.05,
      unit: "%",
      hints: ["Each half-life halves what is left.", "Fraction remaining = $(1/2)^n$."],
      explanation: "100 → 50 → 25 → 12.5 → 6.25 → 3.125%. $(1/2)^5 = 1/32 \\approx 3.1\\%$, which is why a drug is considered essentially gone after about 5 half-lives.",
      concepts: ["n220-pharmacokinetics"],
    },
    {
      id: "n220-q7",
      type: "numeric",
      topic: "Pharmacokinetics",
      difficulty: 2,
      prompt:
        "A drug with a half-life of 6 hours is started on a regular schedule. Using the rule of 5 half-lives, about how many hours will it take to reach steady state?",
      answer: 30,
      tolerance: 0,
      unit: "h",
      hints: ["Steady state takes about 4–5 half-lives, whatever the size of each dose."],
      explanation: "5 × 6 h = 30 hours (about 97% of steady state). By 4 half-lives (24 h) it is about 94% of the way there.",
      concepts: ["n220-pharmacokinetics"],
    },
    {
      id: "n220-q8",
      type: "mcq",
      topic: "Pharmacodynamics",
      difficulty: 2,
      prompt:
        "A postoperative patient on IV opioid analgesia is difficult to rouse with slow, shallow respirations. Naloxone is given per protocol and the patient wakes. Which statement about naloxone guides the nurse's next actions?",
      options: [
        "It is an opioid agonist that adds to the analgesia",
        "It is a competitive opioid antagonist that may wear off before the opioid does, so sedation can return",
        "It irreversibly destroys opioid receptors, so no further opioid will work",
        "It speeds liver metabolism of the opioid, so monitoring can stop",
      ],
      answer: 1,
      hints: ["Does naloxone activate or block the receptor?", "Compare how long naloxone lasts with how long many opioids last."],
      explanation:
        "Naloxone competes with opioids at the receptor without activating it. Its effect is often shorter than the opioid's, so respiratory depression can recur: keep monitoring respiratory rate, sedation and oxygen saturation. Reversal also brings back pain, which needs reassessment.",
      concepts: ["n220-pharmacodynamics"],
    },
    {
      id: "n220-q9",
      type: "mcq",
      topic: "Pharmacodynamics",
      difficulty: 2,
      prompt: "Why do drugs such as digoxin, lithium and warfarin need closer monitoring than most drugs?",
      options: [
        "They have a narrow therapeutic index: toxic levels are close to effective levels",
        "They have a wide therapeutic index, so large amounts are needed",
        "They are always given intravenously",
        "They are full agonists at every receptor type",
      ],
      answer: 0,
      hints: ["Think about TD₅₀ / ED₅₀ for these drugs."],
      explanation:
        "A narrow therapeutic index means a small change in level (from an interaction, dehydration or kidney decline) can move the patient from effective to toxic. That is why levels or lab markers (drug levels, INR) and careful assessments are used.",
      concepts: ["n220-pharmacodynamics"],
    },
    {
      id: "n220-q10",
      type: "mcq",
      topic: "Medication safety",
      difficulty: 2,
      prompt:
        "A patient with hypokalaemia has a prescription for IV potassium chloride. Which nursing action is correct?",
      options: [
        "Give it by IV push so the level corrects quickly",
        "Give it diluted by infusion pump per policy, after confirming adequate urine output, with the IV site and cardiac rhythm monitored",
        "Add it to the IV bag that is already running without mixing",
        "Skip the patient identification check because the patient is well known to the unit",
      ],
      answer: 1,
      hints: ["Concentrated potassium is a high-alert medication.", "What happens to the heart if potassium arrives as a bolus?"],
      explanation:
        "IV potassium is never pushed: a bolus can cause fatal arrhythmias or cardiac arrest. It is diluted and given by pump at the rate policy allows, only when the kidneys can excrete potassium (adequate urine output), with cardiac monitoring and checks of the IV site because it irritates veins. Adding it to a running bag without mixing can deliver a concentrated layer. Two identifiers are needed every time.",
      concepts: ["n220-medication-safety", "n220-fluids-electrolytes"],
    },
  ],

  labs: [
    {
      id: "n220-lab-io",
      title: "Simulation lab: intake and output charting",
      topic: "Fluids & electrolytes",
      objective:
        "Measure and record intake and output for a simulated patient over an 8-hour shift, calculate the fluid balance, average hourly urine output and fluid change from daily weights, and decide what needs reporting.",
      safety: [
        "Treat simulated body fluids as real: perform hand hygiene and wear gloves (and eye protection if splashing is possible) when emptying drainage bags, urinals or hats.",
        "Use the graduated measuring container at eye level on a flat surface; never estimate from the side of a drainage bag or bedpan when you can measure.",
        "Close drainage bag outlets and wipe spills immediately; wet floors are a fall risk in the sim lab as on the ward.",
        "Practise reporting: tell the instructor (in the role of the RN or provider) about urine output below the minimum or a large imbalance as you would in clinical practice.",
      ],
      materials: [
        "Manikin with an IV line on an infusion pump and an indwelling urinary catheter with drainage bag",
        "Graduated measuring containers and a specimen collection hat for the toilet",
        "Cups and containers of known volume, ice chips, coloured water as simulated fluids",
        "Intake and output flowsheet (paper or simulated electronic record)",
        "Bed or standing scale",
        "Gloves, hand rub, absorbent pads",
      ],
      steps: [
        { text: "Explain to the patient (and family) why I&O is being measured and ask them to save urine and tell you what they drink.", why: "Patients and families are the commonest source of unrecorded intake and discarded output." },
        { text: "Record all oral fluids, including anything liquid at room temperature (soup, gelatin, ice cream) and ice chips at half their volume.", why: "Ice melts to about half its volume as water." },
        { text: "Record IV intake from the pump's volume-infused reading, including IV fluids, flushes and IV medication volumes as your agency requires, and any tube feeds or irrigations that are not withdrawn." },
        { text: "Empty and measure the catheter bag at the end of the shift (or hourly if ordered) in a graduated container, and record the colour and clarity.", why: "Dark, concentrated urine and falling volumes are early signs of volume deficit." },
        { text: "Measure every other output: emesis, liquid stool, wound and drain output, NG aspirate. Estimate only what cannot be measured (e.g. heavy sweating) and say it is an estimate." },
        { text: "Total intake and output, calculate the balance and the average hourly urine output, and compare with the minimum expected for the patient's weight." },
        { text: "Weigh the patient on the same scale at the same time, in similar clothing, and compare with the previous day.", why: "A 1 kg change is about 1 L of fluid, and weight catches losses that I&O misses." },
        { text: "Document totals on the flowsheet and report urine output below the minimum, a large positive or negative balance, or a sudden weight change." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "The patient finishes a 300 mL cup of ice chips. How many mL do you record as intake?",
          answer: 150,
          tolerance: 0,
          unit: "mL",
          working: "Ice chips are recorded at half their volume: 300 ÷ 2 = 150 mL.",
        },
        {
          id: "d2",
          prompt:
            "8-hour intake: coffee 180 mL, juice 120 mL, water 300 mL, the 300 mL cup of ice chips, IV fluid at 75 mL/h for 8 hours and a 50 mL IV piggyback. What is the total intake?",
          answer: 1350,
          tolerance: 0,
          unit: "mL",
          working: "Oral 180 + 120 + 300 + 150 (ice) = 750 mL. IV 75 × 8 = 600 mL, plus 50 mL piggyback = 650 mL. Total = 750 + 650 = 1,350 mL.",
        },
        {
          id: "d3",
          prompt: "Output over the same shift: urine 250, 200 and 150 mL, emesis 120 mL and liquid stool 180 mL. What is the fluid balance (intake − output)?",
          answer: 450,
          tolerance: 0,
          unit: "mL",
          working: "Output = 250 + 200 + 150 + 120 + 180 = 900 mL. Balance = 1,350 − 900 = +450 mL.",
        },
        {
          id: "d4",
          prompt: "What was the average hourly urine output over the 8-hour shift?",
          answer: 75,
          tolerance: 0,
          unit: "mL/h",
          working: "Urine only: 250 + 200 + 150 = 600 mL ÷ 8 h = 75 mL/h, above the adult minimum of about 30 mL/h.",
        },
        {
          id: "d5",
          prompt: "A different patient weighs 68.0 kg yesterday and 66.5 kg today on the same scale. About how much fluid have they lost?",
          answer: 1500,
          tolerance: 0,
          unit: "mL",
          working: "68.0 − 66.5 = 1.5 kg. 1 kg ≈ 1 L, so about 1.5 L = 1,500 mL.",
        },
      ],
      resultsGuide:
        "A positive balance means more in than out; it is expected during IV rehydration but, with weight gain, crackles or oedema, it suggests overload. A negative balance with falling weight, dark urine and tachycardia suggests volume deficit. Average urine output below about 0.5 mL/kg/h (around 30 mL/h for most adults) for two hours or more should be reported. If your totals don't match a classmate's, check the usual errors: ice chips counted at full volume, IV volume taken from the prescribed rate instead of the pump's volume-infused reading, IV piggybacks or flushes left out, and liquid stool or emesis forgotten. Daily weight and I&O should tell the same story; if they don't, recheck both.",
    },
  ],

  cases: [
    {
      id: "n220-case-dehydration",
      title: "Weak and dizzy after three days of gastroenteritis",
      topic: "Fluids & electrolytes",
      setting: "Medical-surgical unit, admitted from the emergency department. Educational simulation with a fictional patient.",
      presentation:
        "Ruth Alvarez, a 74-year-old woman, has had three days of vomiting and watery diarrhoea and has barely eaten or drunk. She takes a thiazide diuretic for hypertension. Her daughter found her weak and dizzy, and she nearly fell getting out of bed this morning. Vital signs lying: HR 112, BP 98/60, RR 20, T 37.6 °C, SpO₂ 97% on room air. She has an IV line in place and is on a cardiac monitor.",
      stages: [
        {
          title: "Focused assessment",
          prompt: "Which assessments and data do you collect first?",
          mode: "multi",
          options: [
            { text: "Orthostatic vital signs, done safely with assistance", good: true, feedback: "Standing (with two staff and a gait belt): HR 128, BP 82/50, and she feels faint, so you sit her back down. A large orthostatic drop fits volume deficit." },
            { text: "Mucous membranes, skin turgor and capillary refill", good: true, feedback: "Dry, sticky oral mucosa; capillary refill 3 seconds. Skin turgor is less reliable in older adults, so put more weight on the other findings." },
            { text: "Urine output, colour and specific gravity", good: true, feedback: "She voided about 100 mL of dark amber urine in the last 6 hours. Specific gravity 1.034." },
            { text: "Muscle strength and the cardiac rhythm on the monitor", good: true, feedback: "Generalised weakness and leg cramps. The monitor shows sinus tachycardia with flattened T waves, prominent U waves and occasional premature ventricular contractions." },
            { text: "Review the latest laboratory results", good: true, feedback: "Potassium 2.9 mEq/L (low), sodium 137 mEq/L, BUN 38 mg/dL and creatinine 1.3 mg/dL (ratio about 29:1, suggesting reduced kidney perfusion), haematocrit raised." },
            { text: "Ask her to walk to the bathroom alone so you can watch her gait", good: false, feedback: "Unsafe: with orthostatic hypotension and weakness she is at high risk of falling. Assess mobility only with assistance." },
            { text: "Visual acuity with a Snellen chart", good: false, feedback: "Not relevant to her presentation right now." },
          ],
          debrief:
            "Tachycardia, a large orthostatic drop, dry mucosa, scant concentrated urine and a raised BUN:creatinine ratio all point to fluid volume deficit. Weakness, cramps, U waves and PVCs with a potassium of 2.9 confirm significant hypokalaemia.",
        },
        {
          title: "Interpret the data",
          prompt: "Which statement best explains her findings?",
          mode: "single",
          options: [
            { text: "Fluid volume deficit with hypokalaemia from vomiting, diarrhoea and her thiazide diuretic", good: true, feedback: "Correct: GI losses and poor intake reduce volume; GI losses and the thiazide both drive potassium out of the body." },
            { text: "Fluid volume excess with dilutional hypokalaemia", good: false, feedback: "Overload would show bounding pulses, crackles, oedema and weight gain, not tachycardia, orthostatic hypotension and dry mucosa." },
            { text: "Hyperkalaemia caused by acute kidney injury", good: false, feedback: "Her potassium is low, and the ECG shows U waves and flat T waves, not peaked T waves." },
            { text: "Hypernatraemia from too much free water", good: false, feedback: "Her sodium is normal, and free water excess would lower sodium, not raise it." },
          ],
          debrief:
            "Clustering cues is the core of clinical judgement. Thiazide and loop diuretics, vomiting and diarrhoea are classic causes of potassium loss, and older adults lose volume quickly because they have less body water and a weaker thirst response.",
        },
        {
          title: "Set the priority",
          prompt: "Which problem needs your attention first?",
          mode: "single",
          options: [
            { text: "Risk of a dangerous arrhythmia: low potassium with U waves and PVCs on the monitor", good: true, feedback: "Correct: this is a circulation threat that can become life-threatening within minutes. Report it promptly and keep her on continuous monitoring." },
            { text: "Her dry, cracked lips", good: false, feedback: "Real and worth treating with mouth care, but not the most dangerous problem." },
            { text: "Her low-grade temperature of 37.6 °C", good: false, feedback: "Mild and expected with gastroenteritis and dehydration; monitor it." },
            { text: "Her worry about missing her grandson's school concert", good: false, feedback: "Psychosocial needs matter, but physiological threats to circulation come first." },
          ],
          debrief:
            "Use ABCs and Maslow: an unstable cardiac rhythm is a circulation problem that outranks comfort, mild fever and psychosocial concerns. Her fall risk from orthostatic hypotension is the next safety priority.",
        },
        {
          title: "Interventions (as principles)",
          prompt: "Which nursing actions are appropriate? Medications and fluids are given only as prescribed and per agency policy.",
          mode: "multi",
          options: [
            { text: "Notify the provider of the potassium result, ECG changes and orthostatic vital signs using SBAR", good: true, feedback: "The provider prescribes fluid and potassium replacement. A clear SBAR report speeds treatment." },
            { text: "Give the prescribed isotonic IV fluid by pump and watch for overload (crackles, dyspnoea, distended neck veins) because of her age", good: true, feedback: "Isotonic fluid restores extracellular volume. Older adults can tip into overload, so reassess the lungs and breathing regularly." },
            { text: "Before potassium replacement, confirm she is passing urine and check kidney function", good: true, feedback: "Potassium is excreted by the kidneys; giving it when urine output is very low risks hyperkalaemia." },
            { text: "Give prescribed IV potassium only diluted, by infusion pump at the rate policy allows, never as a push, checking the IV site often", good: true, feedback: "IV potassium is high-alert. It irritates veins, and a bolus can cause cardiac arrest." },
            { text: "Ask the provider whether to hold her thiazide diuretic, rather than giving it automatically", good: true, feedback: "The thiazide is worsening both problems. Questioning a prescription that no longer fits the patient is part of the right reason and right response." },
            { text: "Fall precautions: bed low, call bell in reach, assist her to rise slowly and dangle before standing", good: true, feedback: "Orthostatic hypotension plus muscle weakness makes falls likely." },
            { text: "Strict I&O, daily weight and repeat electrolytes as prescribed", good: true, feedback: "These show whether the deficit is correcting." },
            { text: "Push IV potassium chloride to correct the level quickly", good: false, feedback: "Never. IV potassium given as a push can cause fatal arrhythmia or cardiac arrest." },
            { text: "Restrict oral fluids so she doesn't vomit again", good: false, feedback: "She is volume depleted; small frequent sips as tolerated (with antiemetics if prescribed) are more appropriate unless she is NPO." },
          ],
          debrief:
            "Nursing care here is safe administration of what the provider prescribes, close monitoring for both under- and over-correction, and protecting the patient from harm (falls, IV potassium errors). Specific fluids, rates and replacement amounts are prescriber decisions made per protocol.",
        },
        {
          title: "Evaluate",
          prompt: "Next morning, which findings show your plan is working?",
          mode: "multi",
          options: [
            { text: "Urine output at least 30 mL/h and lighter yellow urine", good: true, feedback: "Her kidneys are being perfused again." },
            { text: "HR and BP near her baseline with no significant orthostatic drop", good: true, feedback: "Circulating volume is restored." },
            { text: "Repeat potassium within the normal range and no U waves or PVCs on the monitor", good: true, feedback: "The hypokalaemia and its ECG effects have resolved." },
            { text: "Moist mucous membranes, stronger grip and fewer cramps", good: true, feedback: "Hydration and muscle function are improving." },
            { text: "Weight down a further 1 kg since yesterday", good: false, feedback: "Further weight loss means continued fluid loss, not recovery." },
            { text: "New crackles at both lung bases", good: false, feedback: "A sign of fluid overload: slow down and report it, don't count it as success." },
            { text: "She is sleepier and harder to rouse", good: false, feedback: "A decline in consciousness needs urgent assessment (e.g. electrolytes, glucose, neurological status)." },
          ],
          debrief:
            "Evaluation compares the outcomes you set against real data: perfusion, urine output, electrolytes, rhythm and symptoms. Watch for both failure to improve and over-correction. Before discharge, teach her to recognise dehydration early, to drink fluids when unwell, and to ask her prescriber about her diuretic on sick days.",
        },
      ],
      teachingPoints: [
        "Volume deficit cluster: tachycardia, orthostatic hypotension, dry mucosa, scant concentrated urine, raised BUN:creatinine ratio.",
        "Hypokalaemia shows in muscles and the heart: weakness, cramps, flat T waves, U waves, arrhythmias. Monitor the rhythm.",
        "IV potassium is never given as a push; it is diluted, pump-controlled, and given only when urine output is adequate.",
        "Older adults on diuretics become dehydrated and hypokalaemic quickly with vomiting or diarrhoea, and can be overloaded quickly by IV fluids.",
      ],
    },
  ],

  skills: [
    {
      id: "n220-skill-med-rights",
      title: "Medication administration safety checks",
      purpose: "Checking the rights at every step stops most medication errors before they reach the patient.",
      items: [
        { text: "Reviews the medication administration record against the prescription; clarifies anything unclear, incomplete or unsuitable with the prescriber before going further", critical: true },
        { text: "Knows the drug's class, purpose, expected effect, common adverse effects and nursing considerations, and checks relevant assessments or lab values first (e.g. apical pulse, blood pressure, potassium, glucose)", critical: true },
        { text: "Checks the patient's allergies and the reason for the medication" },
        { text: "First check: compares the label with the record when retrieving the medication (right drug, dose, route, time)", critical: true },
        { text: "Second check: compares again while preparing; checks expiry date and appearance" },
        { text: "Follows agency policy for high-alert medications, including an independent double-check where required", critical: true },
        { text: "Performs hand hygiene and introduces self; identifies the patient with two identifiers against the wristband and record, never the room number", critical: true },
        { text: "Third check at the bedside: scans the wristband and medication barcodes and resolves any alert before giving" },
        { text: "Explains each medication to the patient and stops to recheck if the patient questions it or says it looks different" },
        { text: "Respects a patient's refusal, explores the reason, and reports and documents it" },
        { text: "Stays with the patient until oral medications are swallowed; never leaves medications at the bedside unless policy allows", critical: true },
        { text: "Documents administration immediately after giving it, never before" },
        { text: "Evaluates the response at the expected time (e.g. pain score after analgesia) and reports adverse effects", critical: true },
      ],
    },
  ],
};
