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
    {
      id: "n220-q11",
      type: "mcq",
      topic: "Cellular injury & adaptation",
      difficulty: 2,
      prompt: "In the first minutes of hypoxia, cells swell. Which sequence explains the swelling?",
      options: [
        "Less ATP → the Na⁺/K⁺-ATPase pump fails → sodium and water enter the cell",
        "More ATP → the cell divides faster → the tissue enlarges",
        "Calcium leaves the cell → enzymes are switched off → the membrane thickens",
        "Lactic acid is excreted → the cell becomes alkaline → water is drawn in by the higher pH",
      ],
      answer: 0,
      hints: ["What does a cell need oxygen to make?", "Which membrane pump keeps sodium out, and what does it run on?"],
      explanation:
        "Without oxygen, mitochondria make little ATP. The Na⁺/K⁺-ATPase pump stops, sodium accumulates inside the cell and water follows by osmosis: cellular swelling, the first sign of reversible injury. Anaerobic glycolysis also produces lactic acid, so the cell becomes more acidic, not alkaline. Restoring oxygen at this stage lets the cell recover.",
      concepts: ["n220-cell-injury-adaptation"],
    },
    {
      id: "n220-q12",
      type: "mcq",
      topic: "Cellular injury & adaptation",
      difficulty: 1,
      prompt: "Why does the blood troponin level rise after a myocardial infarction?",
      options: [
        "Heart muscle cells undergo apoptosis and keep their contents inside",
        "Necrotic heart muscle cells lose membrane integrity and leak their contents into the blood",
        "The heart muscle undergoes hypertrophy and makes extra troponin",
        "The liver makes troponin in response to chest pain",
      ],
      answer: 1,
      hints: ["Which type of cell death spills cell contents?", "Apoptotic cells are tidily packaged and eaten."],
      explanation:
        "Ischaemia in an infarct causes coagulative necrosis: cells swell and their membranes rupture, releasing intracellular proteins such as troponin into the circulation, and the necrosis triggers inflammation. Apoptosis is orderly cell death without leakage or inflammation.",
      concepts: ["n220-cell-injury-adaptation"],
    },
    {
      id: "n220-q13",
      type: "mcq",
      topic: "Cellular injury & adaptation",
      difficulty: 3,
      prompt:
        "A patient's cervical screening report shows dysplasia. The patient says, \"That's just my cells adapting, like getting a callus, so I don't need to come back.\" What is the nurse's best response?",
      options: [
        "\"You're right: dysplasia is a normal adaptation that always goes away.\"",
        "\"Dysplasia is disordered cell growth rather than a true adaptation, and it can progress to cancer, so the follow-up appointment is important.\"",
        "\"Dysplasia means the cells have already become cancer, so you will need surgery.\"",
        "\"Dysplasia is the same as atrophy, so it only needs treatment if you have pain.\"",
      ],
      answer: 1,
      hints: ["Is dysplasia one of the four reversible adaptations?", "What can dysplasia lead to if it is not monitored?"],
      explanation:
        "Dysplasia is abnormal variation in cell size, shape and organisation. It is not a true adaptation, it can progress to cancer, and it can also regress if found and managed early. It is not yet cancer, so the nurse corrects the misunderstanding without causing alarm and reinforces follow-up.",
      concepts: ["n220-cell-injury-adaptation"],
    },
    {
      id: "n220-q14",
      type: "mcq",
      topic: "Inflammation & healing",
      difficulty: 1,
      prompt: "A sprained ankle becomes swollen within an hour. Which mechanism mainly causes the swelling?",
      options: [
        "Increased capillary permeability lets protein-rich fluid leak into the tissue",
        "Vasoconstriction traps blood in the veins",
        "Neutrophils divide inside the joint",
        "Low plasma albumin from the liver",
      ],
      answer: 0,
      hints: ["This is the vascular phase of acute inflammation.", "Histamine and bradykinin act on the capillary wall."],
      explanation:
        "Mediators such as histamine, bradykinin and prostaglandins dilate arterioles (redness, heat) and make capillaries leaky, so protein-rich exudate moves into the interstitial space (tumor, swelling). Low albumin causes oedema in liver disease or malnutrition, not acute local swelling after injury.",
      concepts: ["n220-inflammation-healing"],
    },
    {
      id: "n220-q15",
      type: "mcq",
      topic: "Inflammation & healing",
      difficulty: 2,
      prompt: "On the fourth day after abdominal surgery, which incision finding should the nurse report to the provider?",
      options: [
        "Edges well approximated with a thin pink line along the incision",
        "Mild tenderness around the incision when the patient coughs",
        "Thick yellow drainage, redness spreading beyond the incision and a temperature of 38.6 °C",
        "A firm ridge forming under the incision line",
      ],
      answer: 2,
      hints: ["Which option has the signs of infection rather than normal healing?", "Purulent drainage plus spreading redness plus fever is a cluster."],
      explanation:
        "Purulent drainage, spreading erythema and fever a few days after surgery point to surgical site infection and need reporting. A pink, approximated line and mild tenderness are expected. A firm healing ridge under the incision is a normal sign of collagen being laid down in the proliferative phase.",
      concepts: ["n220-inflammation-healing"],
    },
    {
      id: "n220-q16",
      type: "numeric",
      topic: "Inflammation & healing",
      difficulty: 2,
      prompt:
        "A pressure injury measures 4.0 cm long by 3.0 cm wide. Two weeks later it measures 3.0 cm by 2.0 cm. By what percentage has its surface area (length × width) decreased?",
      answer: 50,
      tolerance: 0.5,
      unit: "%",
      hints: ["Work out the area at each measurement.", "Percentage decrease = (old − new) ÷ old × 100."],
      explanation:
        "First area: 4.0 × 3.0 = 12 cm². Second area: 3.0 × 2.0 = 6 cm². Decrease = (12 − 6) ÷ 12 × 100 = 50%. Steady reduction in area over two to four weeks is a good sign that healing by secondary intention is progressing; a wound that is not shrinking needs its plan reviewed.",
      concepts: ["n220-inflammation-healing"],
    },
    {
      id: "n220-q17",
      type: "mcq",
      topic: "Inflammation & healing",
      difficulty: 3,
      prompt:
        "A 79-year-old who takes a long-term corticosteroid for rheumatoid arthritis is two days after hip surgery. Temperature is 37.4 °C, the wound looks only slightly pink, and the patient is newly confused and drowsy. What is the best interpretation?",
      options: [
        "No infection is likely because there is no fever and little redness",
        "The confusion is expected after surgery in older adults and needs no action",
        "A serious infection may be present with blunted inflammatory signs, so the nurse assesses further and reports the change",
        "The corticosteroid should be stopped at once by the nurse to improve immunity",
      ],
      answer: 2,
      hints: ["What do corticosteroids do to the inflammatory response?", "How do older adults often present when they have an infection?"],
      explanation:
        "Corticosteroids suppress inflammation and older adults often mount a weaker fever, so redness and fever can be minimal even with serious infection. New confusion is a common early sign. The nurse completes a full set of vital signs, checks the wound, oxygen saturation and glucose, and reports promptly. Long-term corticosteroids must never be stopped suddenly (adrenal suppression), and changing them is a prescriber decision.",
      concepts: ["n220-inflammation-healing", "n220-pharmacodynamics"],
    },
    {
      id: "n220-q18",
      type: "mcq",
      topic: "Fluids & electrolytes",
      difficulty: 2,
      prompt: "A patient with a head injury and raised intracranial pressure has a new IV prescription. Which solution should the nurse question?",
      options: ["0.9% sodium chloride", "0.45% sodium chloride", "Lactated Ringer's", "3% sodium chloride under close monitoring"],
      answer: 1,
      hints: ["Which solution is hypotonic?", "Where does water go when the plasma becomes more dilute than the cells?"],
      explanation:
        "0.45% sodium chloride is hypotonic: water moves into cells, including brain cells, which can worsen cerebral oedema and raise intracranial pressure further. Isotonic solutions stay extracellular, and hypertonic saline is sometimes used deliberately to draw water out of brain tissue under close monitoring.",
      concepts: ["n220-fluids-electrolytes"],
    },
    {
      id: "n220-q19",
      type: "numeric",
      topic: "Fluids & electrolytes",
      difficulty: 1,
      prompt: "A 1,000 mL bag of isotonic IV fluid is prescribed to run over 8 hours by infusion pump. At what rate do you set the pump?",
      answer: 125,
      tolerance: 0,
      unit: "mL/h",
      hints: ["Rate = volume ÷ time.", "Keep the answer in mL per hour."],
      explanation: "1,000 mL ÷ 8 h = 125 mL/h. Always check the rate and the volume to be infused against the prescription before starting the pump.",
      concepts: ["n220-fluids-electrolytes"],
    },
    {
      id: "n220-q20",
      type: "mcq",
      topic: "Fluids & electrolytes",
      difficulty: 3,
      prompt:
        "The day after a thyroidectomy, a patient reports tingling around the mouth, and the hand goes into spasm when a blood pressure cuff is inflated. Which additional finding needs the most urgent action?",
      options: [
        "Muscle cramps in the calves",
        "A new high-pitched noise on breathing in (stridor)",
        "A positive Chvostek sign",
        "Anxiety about the scar",
      ],
      answer: 1,
      hints: ["The findings point to hypocalcaemia: which glands can be injured in thyroid surgery?", "Which of the options threatens the airway?"],
      explanation:
        "Perioral tingling and Trousseau sign suggest hypocalcaemia from injury to the parathyroid glands. Low calcium increases neuromuscular excitability; laryngospasm is its most dangerous form, and stridor means the airway is narrowing. Call for help immediately (rapid response per policy). Cramps and Chvostek sign fit the same problem but do not threaten the airway.",
      concepts: ["n220-fluids-electrolytes"],
    },
    {
      id: "n220-q21",
      type: "mcq",
      topic: "Acid–base balance",
      difficulty: 1,
      prompt:
        "A patient found unresponsive after taking too much of an opioid has a respiratory rate of 8/min. ABG: pH 7.26, PaCO₂ 58 mmHg, HCO₃⁻ 25 mEq/L. How do you interpret it?",
      options: [
        "Respiratory acidosis, uncompensated",
        "Metabolic acidosis, partly compensated",
        "Respiratory alkalosis, uncompensated",
        "Metabolic alkalosis, fully compensated",
      ],
      answer: 0,
      hints: ["pH below 7.35 is acidosis. Which value explains it?", "Is HCO₃⁻ outside its normal range yet?"],
      explanation:
        "pH 7.26 = acidosis. PaCO₂ 58 is high and explains it: respiratory acidosis from hypoventilation. HCO₃⁻ 25 is normal, so the kidneys have not compensated yet (they take hours to days): uncompensated. The priority is ventilation: airway, breathing support and reversal as prescribed.",
      concepts: ["n220-acid-base", "n220-pharmacodynamics"],
    },
    {
      id: "n220-q22",
      type: "mcq",
      topic: "Acid–base balance",
      difficulty: 3,
      prompt:
        "A patient with a week of severe diarrhoea has an ABG of pH 7.35, PaCO₂ 28 mmHg, HCO₃⁻ 15 mEq/L. How do you interpret it?",
      options: [
        "Normal ABG",
        "Respiratory alkalosis, partly compensated",
        "Metabolic acidosis, fully compensated",
        "Respiratory acidosis, fully compensated",
      ],
      answer: 2,
      hints: ["pH is in range, but which side of 7.40 is it on?", "Which abnormal value matches an acid-side pH?"],
      explanation:
        "pH 7.35 is within range but on the acid side of 7.40. HCO₃⁻ 15 is low, which explains acidosis (metabolic: diarrhoea loses bicarbonate). PaCO₂ 28 is low, which on its own would cause alkalosis, so it is the lungs compensating by blowing off CO₂. With pH back in range, it is fully compensated. Two abnormal values mean it is not a normal ABG.",
      concepts: ["n220-acid-base"],
    },
    {
      id: "n220-q23",
      type: "numeric",
      topic: "Acid–base balance",
      difficulty: 3,
      prompt:
        "Use the Henderson–Hasselbalch equation, $pH = 6.1 + \\log_{10}\\dfrac{[HCO_3^-]}{0.03 \\times P_aCO_2}$, to calculate the pH for HCO₃⁻ 24 mEq/L and PaCO₂ 60 mmHg. Give two decimal places.",
      answer: 7.22,
      tolerance: 0.02,
      unit: "",
      hints: ["First work out 0.03 × 60.", "24 ÷ 1.8 ≈ 13.3; then take the log."],
      explanation:
        "0.03 × 60 = 1.8. 24 ÷ 1.8 = 13.33. $\\log_{10} 13.33 \\approx 1.125$. pH = 6.1 + 1.125 ≈ 7.22: an acute respiratory acidosis with no metabolic compensation yet.",
      concepts: ["n220-acid-base"],
    },
    {
      id: "n220-q24",
      type: "mcq",
      topic: "Acid–base balance",
      difficulty: 2,
      prompt:
        "A very anxious patient is breathing fast and reports tingling fingers and light-headedness. SpO₂ is 99%. ABG: pH 7.49, PaCO₂ 30 mmHg, HCO₃⁻ 24 mEq/L. Which nursing action is most appropriate?",
      options: [
        "Encourage the patient to take fast, deep breaths to relieve the tingling",
        "Stay with the patient, coach slow breathing and assess for other causes such as pain, hypoxia or pulmonary embolism",
        "Leave the patient alone in a quiet room to rest",
        "Have the patient rebreathe into a paper bag unsupervised",
      ],
      answer: 1,
      hints: ["High pH with low PaCO₂: what is the patient blowing off?", "Anxiety is a diagnosis you reach only after excluding physical causes."],
      explanation:
        "This is uncompensated respiratory alkalosis from hyperventilation. Low CO₂ lowers ionised calcium, causing tingling. The nurse stays, reassures and coaches slow breathing, and considers physical causes of hyperventilation (pain, hypoxia, sepsis, pulmonary embolism) before attributing it to anxiety. Unsupervised paper-bag rebreathing can cause hypoxia and is not recommended.",
      concepts: ["n220-acid-base"],
    },
    {
      id: "n220-q25",
      type: "numeric",
      topic: "Pharmacokinetics",
      difficulty: 1,
      prompt: "A drug has a half-life of 8 hours. If no more is given, what percentage of the plasma concentration remains after 24 hours?",
      answer: 12.5,
      tolerance: 0.1,
      unit: "%",
      hints: ["How many half-lives fit into 24 hours?", "Halve 100% that many times."],
      explanation: "24 ÷ 8 = 3 half-lives. 100 → 50 → 25 → 12.5%, or $(1/2)^3 = 1/8 = 12.5\\%$.",
      concepts: ["n220-pharmacokinetics"],
    },
    {
      id: "n220-q26",
      type: "mcq",
      topic: "Pharmacokinetics",
      difficulty: 3,
      prompt:
        "A patient whose INR has been stable on warfarin is started on rifampin, a cytochrome P450 inducer, for tuberculosis. What should the nurse anticipate?",
      options: [
        "Higher warfarin levels and a rising INR, with bleeding risk",
        "Faster warfarin metabolism, a falling INR and a risk of clotting, so INR is monitored closely and the prescriber may adjust the regimen",
        "No change, because rifampin is excreted by the kidneys",
        "Warfarin will stop working permanently, even after rifampin is stopped",
      ],
      answer: 1,
      hints: ["Inducers speed up or slow down metabolism?", "What happens to the effect of a drug that is cleared faster?"],
      explanation:
        "Enzyme inducers increase cytochrome P450 activity, so warfarin is metabolised faster, its level falls and the INR drops: a risk of clots. The INR is monitored closely, and when the inducer is later stopped the effect reverses and the INR can rise, so monitoring continues then too. Adjusting warfarin is the prescriber's decision.",
      concepts: ["n220-pharmacokinetics"],
    },
    {
      id: "n220-q27",
      type: "numeric",
      topic: "Pharmacokinetics",
      difficulty: 3,
      prompt:
        "A drug has a volume of distribution of 42 L and a clearance of 7 L/h. Using $t_{1/2} = 0.693 \\times V_d / CL$, what is its half-life to one decimal place?",
      answer: 4.2,
      tolerance: 0.1,
      unit: "h",
      hints: ["First divide Vd by CL.", "Then multiply by 0.693."],
      explanation:
        "42 ÷ 7 = 6 h. 0.693 × 6 = 4.158 ≈ 4.2 h. A larger volume of distribution or a lower clearance (for example from kidney decline) lengthens the half-life.",
      concepts: ["n220-pharmacokinetics"],
    },
    {
      id: "n220-q28",
      type: "mcq",
      topic: "Pharmacodynamics",
      difficulty: 1,
      prompt: "Albuterol (salbutamol) relieves an asthma attack. How does it act?",
      options: [
        "It is a β₂-adrenergic agonist that relaxes bronchial smooth muscle",
        "It is a β₂-adrenergic antagonist that blocks bronchospasm",
        "It inhibits cyclo-oxygenase in the airway",
        "It is a muscarinic agonist that dilates the airways",
      ],
      answer: 0,
      hints: ["Does it activate or block its receptor?", "Which β receptor subtype is found on airway smooth muscle?"],
      explanation:
        "Albuterol activates β₂ receptors on bronchial smooth muscle, causing relaxation and bronchodilation. Some stimulation of cardiac receptors explains common effects such as tachycardia and tremor. Muscarinic antagonists, not agonists, dilate the airways.",
      concepts: ["n220-pharmacodynamics"],
    },
    {
      id: "n220-q29",
      type: "numeric",
      topic: "Pharmacodynamics",
      difficulty: 1,
      prompt:
        "In a population study, a drug's TD₅₀ is 1,500 and its ED₅₀ is 50, both in the same units. What is its therapeutic index?",
      answer: 30,
      tolerance: 0,
      unit: "",
      hints: ["TI = TD₅₀ ÷ ED₅₀."],
      explanation: "TI = 1,500 ÷ 50 = 30: a reasonably wide margin. Drugs such as digoxin and lithium have a TI close to 2–3, which is why they need levels and close monitoring.",
      concepts: ["n220-pharmacodynamics"],
    },
    {
      id: "n220-q30",
      type: "mcq",
      topic: "Pharmacodynamics",
      difficulty: 3,
      prompt:
        "A patient who has taken a β-blocker for years stopped it suddenly three days ago. HR is 118, BP is higher than usual and the patient has chest pain. Which mechanism best explains this?",
      options: [
        "Receptor down-regulation causing tolerance",
        "Up-regulated β receptors now exposed to normal adrenaline and noradrenaline levels, causing rebound",
        "An allergic reaction to the β-blocker",
        "Accumulation of the β-blocker because of kidney failure",
      ],
      answer: 1,
      hints: ["Long-term blockade changes the number of receptors.", "What happens when the blocker is suddenly removed?"],
      explanation:
        "Long-term antagonist exposure up-regulates receptors. When the β-blocker stops suddenly, the extra receptors respond to normal catecholamines, causing rebound tachycardia, hypertension and angina. This is reported promptly, and patients are taught not to stop β-blockers without their prescriber.",
      concepts: ["n220-pharmacodynamics"],
    },
    {
      id: "n220-q31",
      type: "mcq",
      topic: "Medication safety",
      difficulty: 1,
      prompt: "Which is the correct way to identify a patient before giving a medication?",
      options: [
        "Check the room and bed number on the assignment sheet",
        "Ask \"Are you Mr Lee?\" and wait for a yes",
        "Ask the patient to state their full name and date of birth, and compare both with the wristband and the medication record",
        "Recognise the patient because you cared for them yesterday",
      ],
      answer: 2,
      hints: ["How many identifiers are needed?", "A leading question can get a yes from a confused or hard-of-hearing patient."],
      explanation:
        "Two identifiers (such as name and date of birth), stated by the patient where possible and matched to the wristband and record, are required every time. Room numbers change, familiarity is not verification, and patients may answer yes to any name.",
      concepts: ["n220-medication-safety"],
    },
    {
      id: "n220-q32",
      type: "mcq",
      topic: "Medication safety",
      difficulty: 3,
      prompt:
        "Ten minutes into a first infusion of an IV antibiotic, a patient develops hives, says their throat feels tight, and is wheezing. BP has fallen from 128/76 to 88/50. What is the nurse's first action?",
      options: [
        "Slow the infusion and recheck the BP in 15 minutes",
        "Stop the infusion, keep the IV access, and call for emergency help per the anaphylaxis protocol",
        "Give an oral antihistamine and continue the infusion",
        "Complete an incident report before doing anything else",
      ],
      answer: 1,
      hints: ["Airway swelling plus hypotension after a new drug is which emergency?", "Remove the cause first, then get help."],
      explanation:
        "This is anaphylaxis. Stop the drug immediately, keep the IV line for emergency treatment (but don't flush the drug left in the tubing into the patient), stay with the patient and call for help (rapid response). Intramuscular epinephrine per the protocol is the first-line treatment. Slowing the infusion still delivers the allergen; antihistamines alone do not treat airway swelling or shock; documentation and reporting come after the patient is safe.",
      concepts: ["n220-medication-safety", "n220-pharmacodynamics"],
    },
    {
      id: "n220-q33",
      type: "mcq",
      topic: "Medication safety",
      difficulty: 2,
      prompt: "A nurse realises a scheduled medication was given to the wrong patient. What is the first action?",
      options: [
        "Assess the patient who received the medication",
        "Complete an incident report",
        "Tell the charge nurse at the end of the shift",
        "Document it in the patient's record as a refusal",
      ],
      answer: 0,
      hints: ["Who could be harmed right now?", "Patient safety comes before paperwork."],
      explanation:
        "Assess the patient first (vital signs, level of consciousness, expected effects of the drug), then notify the prescriber and charge nurse, follow orders to monitor or treat, document the facts and complete a safety event report. The intended patient also needs their medication reviewed. Never falsify the record.",
      concepts: ["n220-medication-safety"],
    },
    {
      id: "n220-q34",
      type: "mcq",
      topic: "Medication safety",
      difficulty: 1,
      prompt: "Which documentation practice follows The Joint Commission's \"do not use\" guidance?",
      options: [
        "Always putting a leading zero before a decimal point",
        "Abbreviating units as \"U\" to save space",
        "Adding a trailing zero after a whole number for clarity",
        "Writing \"QD\" for medications given once a day",
      ],
      answer: 0,
      hints: ["Which practice prevents a decimal point being missed?", "Three of the options are on the do-not-use list."],
      explanation:
        "A leading zero (0.5 rather than .5) stops a missed decimal point causing a tenfold error. \"U\" can be misread as 0 or 4, a trailing zero (1.0) can be misread as 10, and QD is confused with QID. Write \"unit\" and \"daily\" in full.",
      concepts: ["n220-medication-safety"],
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
    {
      id: "n220-lab-abg",
      title: "Simulation lab: arterial blood gas interpretation",
      topic: "Acid–base balance",
      objective:
        "Interpret a set of simulated arterial blood gases step by step (pH, PaCO₂, HCO₃⁻, compensation), check them with the Henderson–Hasselbalch equation and Winter's formula, link each result to the patient's history and assessment, and decide what to report.",
      safety: [
        "Arterial puncture is performed only by staff trained and permitted by agency policy; in this lab you handle a simulated specimen and a task trainer only.",
        "Before a radial sample, the circulation to the hand is checked (a modified Allen test per policy) because the ulnar artery must be able to supply the hand if the radial artery is damaged.",
        "After an arterial puncture, firm pressure is held for at least 5 minutes (longer if the patient takes an anticoagulant) and the site is checked for bleeding and haematoma.",
        "Dispose of needles in a sharps container at once without recapping, and treat all blood as potentially infectious.",
        "Always interpret a gas alongside the patient: a worsening patient is escalated immediately, without waiting for the number.",
      ],
      materials: [
        "ABG case cards: history, vital signs, oxygen delivery and the gas result for six simulated patients",
        "Simulated arterial blood gas syringe with a cap, specimen label and biohazard bag (task trainer arm optional)",
        "Normal-values card: pH 7.35–7.45, PaCO₂ 35–45 mmHg, HCO₃⁻ 22–26 mEq/L",
        "Calculator with a log function",
        "Worksheet with the step-by-step ABG grid",
      ],
      steps: [
        { text: "Read the case card first: diagnosis, breathing pattern, oxygen therapy and the time the gas was taken.", why: "The same gas means different things in different patients, and oxygen delivery must be recorded with the result." },
        { text: "Label the simulated specimen at the bedside with two identifiers, the time and the oxygen delivery, remove air bubbles, cap it and send it on ice or as policy directs.", why: "Air bubbles and delayed analysis change PaCO₂ and PaO₂ and give a misleading result." },
        { text: "Step 1: read the pH and decide acidosis (below 7.35), alkalosis (above 7.45) or within range, and if within range, which side of 7.40." },
        { text: "Step 2 and 3: look at PaCO₂ and HCO₃⁻. Decide which one explains the pH (ROME: respiratory opposite, metabolic equal).", why: "The value that moves in the direction that would cause the pH change is the primary problem." },
        { text: "Step 4: decide compensation. If the other value has moved the opposite-acting way, compensation is under way; pH still abnormal = partly compensated, pH in range = fully compensated." },
        { text: "Check your interpretation with the Henderson–Hasselbalch equation, $pH = 6.1 + \\log_{10}\\dfrac{[HCO_3^-]}{0.03 \\times P_aCO_2}$.", why: "If the calculated pH is far from the reported pH, recheck the transcription or the sample." },
        { text: "For a metabolic acidosis, estimate the expected PaCO₂ with Winter's formula, $1.5 \\times HCO_3^- + 8 \\pm 2$.", why: "A PaCO₂ higher than expected means the lungs are not compensating enough, for example from fatigue or sedation: a warning sign." },
        { text: "Match the gas to the cause on the case card (hypoventilation, hyperventilation, ketoacidosis, diarrhoea, vomiting) and list the assessments you would repeat." },
        { text: "Give an SBAR report to the instructor (as the provider) for each abnormal gas, leading with the patient's condition and the interpretation." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "Calculate the pH for HCO₃⁻ 24 mEq/L and PaCO₂ 40 mmHg. Give two decimal places.",
          answer: 7.4,
          tolerance: 0.01,
          unit: "",
          working: "0.03 × 40 = 1.2. 24 ÷ 1.2 = 20. log₁₀ 20 = 1.301. pH = 6.1 + 1.301 = 7.40: the normal ratio of bicarbonate to dissolved CO₂ is 20:1.",
        },
        {
          id: "d2",
          prompt: "A patient with diabetic ketoacidosis has HCO₃⁻ 14 mEq/L and PaCO₂ 30 mmHg. Calculate the pH to two decimal places.",
          answer: 7.29,
          tolerance: 0.02,
          unit: "",
          working: "0.03 × 30 = 0.9. 14 ÷ 0.9 = 15.56. log₁₀ 15.56 = 1.192. pH = 6.1 + 1.192 ≈ 7.29: metabolic acidosis, partly compensated.",
        },
        {
          id: "d3",
          prompt: "For the same patient (HCO₃⁻ 14 mEq/L), what PaCO₂ does Winter's formula predict for full respiratory compensation? Give the central value.",
          answer: 29,
          tolerance: 2,
          unit: "mmHg",
          working: "1.5 × 14 + 8 = 21 + 8 = 29 mmHg (range 27–31). The measured PaCO₂ of 30 is within range, so the lungs are compensating as expected through Kussmaul breathing.",
        },
        {
          id: "d4",
          prompt: "A patient with long-standing COPD has HCO₃⁻ 30 mEq/L and PaCO₂ 60 mmHg. Calculate the pH to two decimal places.",
          answer: 7.32,
          tolerance: 0.02,
          unit: "",
          working: "0.03 × 60 = 1.8. 30 ÷ 1.8 = 16.67. log₁₀ 16.67 = 1.222. pH = 6.1 + 1.222 ≈ 7.32: respiratory acidosis, partly compensated by the kidneys retaining bicarbonate.",
        },
        {
          id: "d5",
          prompt:
            "Rule of thumb: in acute respiratory acidosis the pH falls by about 0.08 for every 10 mmHg rise in PaCO₂ above 40. Starting from pH 7.40, estimate the pH when PaCO₂ rises suddenly to 60 mmHg.",
          answer: 7.24,
          tolerance: 0.02,
          unit: "",
          working: "Rise = 60 − 40 = 20 mmHg = 2 × 10 mmHg. Fall = 2 × 0.08 = 0.16. pH ≈ 7.40 − 0.16 = 7.24. Compare drill 4: the same PaCO₂ with kidney compensation gives a much less acidic pH.",
        },
      ],
      resultsGuide:
        "Work every gas in the same order and you will rarely misread one. A pH within range with two abnormal values is a fully compensated disorder, not a normal gas; the side of 7.40 the pH sits on usually tells you the primary problem. Respiratory disorders change quickly and are compensated slowly by the kidneys over days, so an acute respiratory acidosis has a near-normal HCO₃⁻ and a markedly abnormal pH, while a chronic one (as in COPD) has a raised HCO₃⁻ and a pH close to normal. In metabolic acidosis, a PaCO₂ above the Winter's range means the patient is tiring or sedated and may need ventilatory support: report it. If your calculated pH differs from the reported pH by more than a few hundredths, check that you used 0.03 × PaCO₂ and a base-10 log. Always report the patient's condition together with the gas.",
    },
    {
      id: "n220-lab-halflife",
      title: "Simulation lab: plotting a drug's elimination half-life",
      topic: "Pharmacokinetics",
      objective:
        "Plot simulated plasma concentration data for a drug after a single IV administration, read the half-life from the graph, calculate the elimination rate constant and time to fall to a target level, and predict how kidney decline changes time to steady state.",
      safety: [
        "All data are simulated and expressed as a percentage of the starting concentration; this lab teaches pharmacokinetic principles, not dosing, which is always the prescriber's decision.",
        "In clinical practice, drug levels are drawn at the exact time the protocol states (peak or trough) and the time of the last administration is recorded, or the result cannot be interpreted.",
        "Blood for drug levels is never drawn from the arm or line through which the drug is infusing, because the sample would be contaminated and falsely high.",
        "Report a level outside the target range to the prescriber before the next scheduled administration rather than giving it and reporting afterwards.",
      ],
      materials: [
        "Simulated data sheet: plasma concentration (% of the starting value) at 0, 2, 4, 8 and 12 hours",
        "Linear graph paper and semi-logarithmic graph paper (or a spreadsheet)",
        "Calculator with a log function",
        "Worksheet with the half-life and steady-state formulas",
      ],
      steps: [
        { text: "Record the data: 0 h 100%, 2 h 71%, 4 h 50%, 8 h 25%, 12 h 12.5%." },
        { text: "Plot concentration against time on linear graph paper and describe the shape.", why: "First-order elimination gives a curve that falls steeply at first and then flattens, because a constant fraction (not a constant amount) is removed per hour." },
        { text: "Plot the same data on semi-logarithmic paper and draw the line of best fit.", why: "On a log scale, first-order elimination becomes a straight line, which makes the half-life easy to read." },
        { text: "Read the half-life: the time for the concentration to fall from any value to half of it (e.g. 100% to 50%, then 50% to 25%).", why: "If it is the same from every starting point, elimination is first-order." },
        { text: "Calculate the elimination rate constant, $k = 0.693 / t_{1/2}$, and use it to find the time to reach a target concentration with $t = \\dfrac{\\ln(C_0/C)}{k}$." },
        { text: "Use the 4–5 half-life rule to predict when a regular regimen of the same drug would reach steady state, and when the drug would be essentially eliminated after the last administration." },
        { text: "Repeat the steady-state prediction for a patient whose kidney function has fallen and whose half-life has doubled, and list the nursing assessments that would change.", why: "Accumulation in kidney decline is a common cause of toxicity, especially with narrow therapeutic index drugs." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "From the data, what is the half-life of the drug?",
          answer: 4,
          tolerance: 0,
          unit: "h",
          working: "The concentration falls from 100% to 50% in 4 h, and from 50% to 25% between 4 and 8 h: a constant half-life of 4 hours.",
        },
        {
          id: "d2",
          prompt: "If sampling continued, what percentage of the starting concentration would remain at 16 hours?",
          answer: 6.25,
          tolerance: 0.05,
          unit: "%",
          working: "16 ÷ 4 = 4 half-lives. $(1/2)^4 = 1/16 = 6.25\\%$ (12.5% at 12 h halved once more).",
        },
        {
          id: "d3",
          prompt: "Calculate the elimination rate constant, k, to three decimal places.",
          answer: 0.173,
          tolerance: 0.002,
          unit: "/h",
          working: "k = 0.693 ÷ 4 = 0.173 per hour: about 16% of the drug present is removed each hour (1 − e^(−0.173) ≈ 0.16).",
        },
        {
          id: "d4",
          prompt: "How long after administration does the concentration fall to 10% of the starting value? Give one decimal place.",
          answer: 13.3,
          tolerance: 0.1,
          unit: "h",
          working: "t = ln(100 ÷ 10) ÷ k = 2.303 ÷ 0.173 ≈ 13.3 h. Check: 12 h gives 12.5% and 16 h gives 6.25%, so 10% falls between them, a little after 12 h.",
        },
        {
          id: "d5",
          prompt:
            "In a patient whose kidney function has declined, the half-life doubles. Using 5 half-lives, how many hours would a regular regimen take to reach steady state?",
          answer: 40,
          tolerance: 0,
          unit: "h",
          working: "New half-life = 2 × 4 = 8 h. Steady state ≈ 5 × 8 = 40 h, twice as long as the 20 h with normal kidney function, and the plateau level would also be higher if nothing else changed.",
        },
      ],
      resultsGuide:
        "Your linear plot should be a smooth curve that halves every 4 hours, and your semi-log plot a straight line; points that fall off the line usually mean a plotting error or a sample drawn at the wrong time. The half-life is a property of the drug in that patient, not of the amount given, so time to steady state (about 4–5 half-lives) and time to near-elimination (about 5 half-lives, roughly 3% left) depend only on the half-life. When clearance falls, as in kidney decline, dehydration or old age, the half-life lengthens, levels climb higher and take longer to plateau, and effects last longer after stopping. This is why nurses check kidney function, watch for signs of toxicity and time drug levels exactly. If your k or time-to-target answers are off, check you used the natural log (ln) with k, or the base-10 log with the conversion 2.303.",
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
    {
      id: "n220-case-wound",
      title: "A red, draining incision four days after surgery",
      topic: "Inflammation & healing",
      setting: "Surgical unit, postoperative day 4. Educational simulation with a fictional patient.",
      presentation:
        "Daniel Okafor, a 61-year-old man, had an open bowel resection four days ago. He has type 2 diabetes and smokes a pack of cigarettes a day. Since yesterday his incision has become more painful, and this morning there is drainage on the dressing. Vital signs: T 38.5 °C, HR 106, BP 118/72, RR 22, SpO₂ 95% on room air. He has eaten little since surgery.",
      stages: [
        {
          title: "Focused assessment",
          prompt: "Which assessments and data do you collect?",
          mode: "multi",
          options: [
            { text: "Inspect the incision: edges, colour, extent of redness, swelling, warmth and drainage (amount, colour, odour)", good: true, feedback: "The lower third of the incision has separated by about 2 cm, with thick yellow-green, foul-smelling drainage. Redness extends 3 cm beyond the wound edges and the skin is warm and firm." },
            { text: "Pain score and the character of the pain", good: true, feedback: "Pain 7/10 at the incision, worse than yesterday and throbbing. Increasing pain after the first few days is a red flag for infection." },
            { text: "Capillary blood glucose and the recent glucose trend", good: true, feedback: "Glucose 268 mg/dL, and readings have been above 220 mg/dL for two days. Hyperglycaemia impairs neutrophil function and slows healing." },
            { text: "Review the latest laboratory results", good: true, feedback: "WBC 16.8 × 10⁹/L with a left shift (raised band neutrophils), C-reactive protein raised, albumin low at 2.8 g/dL. Lactate pending." },
            { text: "Mental status, urine output and skin perfusion as a sepsis screen", good: true, feedback: "He is alert and oriented. Urine output about 45 mL/h. Skin warm. Fever, tachycardia, tachypnoea and a raised WBC meet screening criteria, so you use your agency's sepsis screening tool." },
            { text: "Remove the remaining sutures to let the wound drain fully", good: false, feedback: "Opening a wound is a provider decision. Assess, protect the wound and report." },
            { text: "Test his hearing with a whispered-voice test", good: false, feedback: "Not relevant to his presentation right now." },
          ],
          debrief:
            "Purulent, malodorous drainage, spreading erythema, partial separation of the incision and increasing pain are local signs of surgical site infection. Fever, tachycardia, tachypnoea and leukocytosis with a left shift are systemic signs. Diabetes with poor glucose control, smoking and poor nutrition all slow healing and raise infection risk.",
        },
        {
          title: "Interpret the data",
          prompt: "Which statement best explains his findings?",
          mode: "single",
          options: [
            { text: "Surgical site infection with partial wound dehiscence and a systemic inflammatory response, at risk of sepsis", good: true, feedback: "Correct: local infection with systemic signs. His risk factors explain why healing stalled." },
            { text: "Normal inflammatory phase of healing", good: false, feedback: "The inflammatory phase gives mild redness and swelling in the first few days, not pus, spreading redness, wound separation and fever on day 4." },
            { text: "Evisceration needing no further assessment", good: false, feedback: "Evisceration is protrusion of organs through the wound, which is not present. Partial separation of the edges is dehiscence." },
            { text: "An allergic reaction to the dressing", good: false, feedback: "Contact reactions cause itching and redness under the dressing, not purulent drainage, wound separation and fever." },
          ],
          debrief:
            "Distinguish expected inflammation (first two to three days, mild, improving) from infection (worsening after the first few days, pus, spreading redness, systemic signs). Systemic signs move the problem from a wound concern to a possible sepsis concern.",
        },
        {
          title: "Set the priority",
          prompt: "Which action comes first?",
          mode: "single",
          options: [
            { text: "Report the findings promptly to the provider with SBAR, including the positive sepsis screen", good: true, feedback: "Correct: early recognition and treatment of possible sepsis saves lives. The provider can then prescribe cultures, labs and antimicrobials." },
            { text: "Teach him about smoking cessation", good: false, feedback: "Important for healing, but not before a possible sepsis is escalated." },
            { text: "Document the wound appearance and recheck it at the end of the shift", good: false, feedback: "Delaying report of a deteriorating patient is unsafe." },
            { text: "Arrange a dietitian referral", good: false, feedback: "Nutrition matters for healing, but it is not the first action." },
          ],
          debrief:
            "When local infection comes with systemic signs, escalation is the priority. Follow your agency's sepsis pathway: rapid report, cultures and lactate as prescribed, and timely antimicrobials.",
        },
        {
          title: "Interventions (as principles)",
          prompt: "Which nursing actions are appropriate? Treatments are given only as prescribed and per agency policy.",
          mode: "multi",
          options: [
            { text: "Obtain a wound culture as prescribed, using the agency's technique, before the first antimicrobial if this does not delay treatment", good: true, feedback: "Cultures taken first identify the organism; treatment of suspected sepsis should not be delayed waiting for them." },
            { text: "Obtain prescribed blood cultures and lactate and give the prescribed antimicrobial on time", good: true, feedback: "Timely antimicrobials are central to sepsis care. Check allergies first." },
            { text: "Cover the wound with a sterile moist dressing per the provider's prescription and position him to reduce tension on the incision", good: true, feedback: "Protects a partly separated wound. Teach him to splint the incision with a pillow when coughing." },
            { text: "Monitor glucose and report persistent hyperglycaemia so glucose management can be adjusted by the prescriber", good: true, feedback: "Better glucose control improves white cell function and healing." },
            { text: "Encourage protein-rich food and fluids and request a dietitian review", good: true, feedback: "Protein, vitamin C and zinc support collagen formation; his low albumin suggests poor nutritional status." },
            { text: "Offer smoking-cessation support, including nicotine replacement if prescribed", good: true, feedback: "Smoking causes vasoconstriction and reduces oxygen delivery to the wound." },
            { text: "Hand hygiene and aseptic technique for every dressing change, and contact precautions if the agency's policy requires them", good: true, feedback: "Prevents spread to other patients and further contamination." },
            { text: "Pack the wound tightly with dry gauze to stop the drainage", good: false, feedback: "Tight packing damages tissue and impairs blood flow; drainage needs managing, not blocking. Dressing choice is per the prescription or wound care nurse." },
            { text: "Apply a heating pad to the incision for comfort", good: false, feedback: "Not without a prescription, and heat over an infected wound on a patient who may have reduced sensation risks burns." },
          ],
          debrief:
            "Nursing care is escalation, accurate collection of specimens, timely administration of prescribed treatment, wound protection and correcting the factors that slow healing (glucose, nutrition, oxygenation, smoking). Antimicrobial choice and wound management plans are prescriber or specialist decisions.",
        },
        {
          title: "Evaluate",
          prompt: "Three days later, which findings show his plan is working?",
          mode: "multi",
          options: [
            { text: "Temperature and heart rate back to normal", good: true, feedback: "The systemic response is resolving." },
            { text: "Redness receding toward the wound edges, with less drainage that is now serous", good: true, feedback: "Local infection is being controlled." },
            { text: "Healthy red, moist granulation tissue in the separated area", good: true, feedback: "The proliferative phase is under way; this part will heal by secondary intention." },
            { text: "WBC falling toward normal and glucose readings mostly within target", good: true, feedback: "Laboratory evidence of improvement, and better conditions for healing." },
            { text: "The wound base has turned pale and dry", good: false, feedback: "Pale, dry tissue suggests poor blood supply or desiccation, not healthy healing. Report it." },
            { text: "New confusion and a falling blood pressure", good: false, feedback: "Signs of worsening sepsis: escalate urgently." },
          ],
          debrief:
            "Evaluate both the systemic picture (vital signs, WBC, mental status) and the wound itself (size, tissue type, drainage, surrounding skin). Measure and document the wound consistently so trends are visible, and teach him the signs of infection to report after discharge.",
        },
      ],
      teachingPoints: [
        "Expected inflammation is mild and settles within a few days; increasing pain, pus, spreading redness and fever after that suggest infection.",
        "Local infection plus fever, tachycardia, tachypnoea or a raised WBC is a sepsis screen, not just a wound problem: escalate.",
        "Diabetes with hyperglycaemia, smoking, poor nutrition and corticosteroids all slow healing and raise infection risk.",
        "Healthy granulation tissue is red, moist and bumpy; pale, dry or black tissue needs reporting.",
      ],
    },
    {
      id: "n220-case-anaphylaxis",
      title: "Itching and wheeze during a first IV antibiotic",
      topic: "Medication safety",
      setting: "Medical unit, day of admission. Educational simulation with a fictional patient.",
      presentation:
        "Priya Raman, a 45-year-old woman, was admitted with cellulitis of the lower leg. Her allergy record lists \"none known\". Ten minutes after you start her first prescribed IV antibiotic infusion she presses the call bell: she feels itchy and flushed, her lips feel swollen and she says her throat is tight. You hear a wheeze. Vital signs: HR 124, BP 86/50 (128/76 an hour ago), RR 28, SpO₂ 91% on room air.",
      stages: [
        {
          title: "Recognise the problem",
          prompt: "Which findings do you look for quickly at the bedside?",
          mode: "multi",
          options: [
            { text: "Airway: voice change, swelling of the lips or tongue, stridor", good: true, feedback: "Her voice is hoarse and her lips and tongue are visibly swollen. No stridor yet." },
            { text: "Breathing: work of breathing, wheeze, oxygen saturation", good: true, feedback: "Using accessory muscles, widespread wheeze, SpO₂ falling to 90%." },
            { text: "Circulation: pulse, blood pressure, skin colour and temperature, level of consciousness", good: true, feedback: "Rapid weak pulse, BP 84/48, she feels faint, and is anxious but oriented." },
            { text: "Skin: hives, flushing, itching", good: true, feedback: "Raised hives across her chest, arms and face." },
            { text: "Ask about the timing of symptoms in relation to the infusion", good: true, feedback: "They started a few minutes after the infusion began. A rapid onset after a new drug is typical of anaphylaxis." },
            { text: "Send her for a chest X-ray before doing anything else", good: false, feedback: "Unsafe delay. Anaphylaxis is a bedside diagnosis and treatment starts at once." },
            { text: "Ask her to walk to the bathroom to see if the dizziness passes", good: false, feedback: "With hypotension she may collapse; she should stay lying down or sitting, depending on her breathing." },
          ],
          debrief:
            "Skin signs with airway swelling, wheeze and hypotension minutes after a new drug add up to anaphylaxis: an immune-mediated, life-threatening reaction. Assess with ABCs, and do not wait for every sign to be present before acting.",
        },
        {
          title: "Interpret the data",
          prompt: "Which statement best describes what is happening?",
          mode: "single",
          options: [
            { text: "Anaphylaxis to the IV antibiotic, with airway, breathing and circulation involvement", good: true, feedback: "Correct: this is a medical emergency." },
            { text: "An expected side effect of the antibiotic that will settle on its own", good: false, feedback: "Side effects are predictable and usually mild. Airway swelling and shock are neither." },
            { text: "An anxiety attack about being in hospital", good: false, feedback: "Anxiety does not cause hives, lip swelling, wheeze and hypotension." },
            { text: "Worsening of her cellulitis", good: false, feedback: "Cellulitis does not suddenly cause airway swelling minutes after an infusion starts." },
          ],
          debrief:
            "Distinguishing a side effect, an adverse reaction, an allergic reaction and anaphylaxis matters because the urgency and the actions differ. Anaphylaxis involves more than one body system and threatens the airway or circulation.",
        },
        {
          title: "First action",
          prompt: "What do you do first?",
          mode: "single",
          options: [
            { text: "Stop the infusion, keep the IV access, stay with her and call for emergency help (rapid response) per the anaphylaxis protocol", good: true, feedback: "Correct: remove the trigger, get help, and keep the line for emergency treatment. Disconnect the tubing containing the drug rather than flushing it into her." },
            { text: "Slow the infusion and call the provider for advice", good: false, feedback: "Slowing it still gives her the allergen. Stop it." },
            { text: "Remove the IV cannula so no more drug can enter", good: false, feedback: "She needs IV access for fluids and emergency treatment. Stop the drug but keep the access." },
            { text: "Leave her to fetch the emergency cart yourself", good: false, feedback: "Do not leave a deteriorating patient. Call for help and have others bring the equipment." },
          ],
          debrief:
            "In anaphylaxis, the first nursing steps are to stop the suspected drug and summon help without leaving the patient. Every unit should know where its anaphylaxis protocol and emergency equipment are kept.",
        },
        {
          title: "Interventions (as principles)",
          prompt: "Which actions are appropriate while the team arrives and treats her? Drugs are given only per the protocol or prescription.",
          mode: "multi",
          options: [
            { text: "Prepare and give intramuscular epinephrine as directed by the anaphylaxis protocol or the responding provider", good: true, feedback: "Epinephrine is the first-line treatment: α effects raise blood pressure and reduce swelling, β₂ effects open the airways. Delay is associated with worse outcomes." },
            { text: "Position her lying flat with legs raised, or sitting up if breathing is very difficult, and do not let her stand or walk", good: true, feedback: "Standing a hypotensive patient in anaphylaxis can lead to cardiac arrest." },
            { text: "Give high-flow oxygen and monitor SpO₂, ECG and blood pressure continuously", good: true, feedback: "She is hypoxic and in shock; continuous monitoring shows whether treatment is working." },
            { text: "Prepare a prescribed isotonic IV fluid bolus", good: true, feedback: "Anaphylaxis causes widespread vasodilation and capillary leak, so the circulating volume falls." },
            { text: "Have airway equipment ready and watch for stridor or worsening voice change", good: true, feedback: "Airway swelling can progress quickly." },
            { text: "Give an oral antihistamine as the only treatment", good: false, feedback: "Antihistamines help skin symptoms but do not treat airway swelling or shock, and swallowing may be unsafe." },
            { text: "Restart the antibiotic at a slower rate once she looks better", good: false, feedback: "Never re-expose a patient to the suspected drug. Ask the prescriber for an alternative from a different class." },
          ],
          debrief:
            "The responding team leads treatment; the nurse's role is to have the protocol, equipment and epinephrine ready, position the patient safely, support oxygenation and circulation, and keep monitoring and recording times and responses. Specific drugs, routes and amounts follow the agency's protocol and the prescriber.",
        },
        {
          title: "After the emergency",
          prompt: "She stabilises. Which follow-up actions are appropriate?",
          mode: "multi",
          options: [
            { text: "Update her allergy record and wristband with the drug and the type of reaction", good: true, feedback: "Prevents re-exposure in this and future admissions." },
            { text: "Keep monitoring for several hours as prescribed, because symptoms can return (a biphasic reaction)", good: true, feedback: "A second phase can occur hours later without re-exposure." },
            { text: "Report the reaction through the agency's adverse drug reaction or safety event system (and pharmacovigilance reporting such as FDA MedWatch per policy)", good: true, feedback: "Reporting adverse reactions improves drug safety data and system learning." },
            { text: "Document the timeline: drug, start time, symptoms, actions, treatments given and her responses", good: true, feedback: "An accurate, timed record supports her ongoing care and the safety review." },
            { text: "Teach her the name of the drug, that she must tell every future provider, and about medical alert identification", good: true, feedback: "She is now the most important safety check for future care." },
            { text: "Record it only as \"intolerance\" so she can still receive the drug in future", good: false, feedback: "Misclassifying anaphylaxis risks a fatal re-exposure." },
            { text: "Hang the rest of the antibiotic bag later at a slower rate", good: false, feedback: "Never. The suspected drug is stopped permanently unless an allergy specialist advises otherwise." },
          ],
          debrief:
            "Recognising and escalating an adverse drug reaction is only half the job; documenting it accurately, updating the allergy record, reporting it and teaching the patient prevent it happening again. A first exposure can cause anaphylaxis even when the allergy record says \"none known\", so stay with or check on patients early in any first infusion.",
        },
      ],
      teachingPoints: [
        "Anaphylaxis: skin signs plus airway, breathing or circulation involvement, usually within minutes of exposure.",
        "First steps: stop the drug, keep IV access, call for help, stay with the patient. Epinephrine is first-line, given per protocol.",
        "Lie the patient flat (or sitting if breathing is difficult); never let a hypotensive patient in anaphylaxis stand up.",
        "Afterwards: watch for a biphasic reaction, update the allergy record, report the reaction and teach the patient.",
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
    {
      id: "n220-skill-adr",
      title: "Recognising, escalating and reporting an adverse drug reaction",
      purpose: "Spotting a reaction early, stopping the cause and getting help fast prevents harm, and reporting it prevents the next one.",
      items: [
        { text: "Knows the expected effects and the serious adverse effects of each drug given, and checks on the patient early during any first administration or infusion" },
        { text: "Recognises warning signs: new rash or hives, itching, swelling of the lips, tongue or face, wheeze, stridor, hypotension, tachycardia, new confusion or a sudden change in condition", critical: true },
        { text: "Stops the suspected drug or infusion immediately while keeping IV access in place, without flushing the drug in the tubing into the patient", critical: true },
        { text: "Stays with the patient and calls for help (rapid response or emergency team) when the airway, breathing or circulation is affected", critical: true },
        { text: "Assesses ABCs and vital signs, positions the patient safely and starts monitoring per the emergency protocol" },
        { text: "Follows the agency's anaphylaxis or reaction protocol and gives treatment only as the protocol or prescriber directs", critical: true },
        { text: "Reports to the prescriber using SBAR: the drug, the time it started, the findings, the actions taken and the current vital signs" },
        { text: "Updates the allergy record and wristband with the drug and the type of reaction", critical: true },
        { text: "Documents a timed account of the reaction, the treatments and the patient's responses" },
        { text: "Completes an adverse drug reaction or safety event report per policy" },
        { text: "Keeps monitoring for recurrence or delayed reactions for as long as prescribed" },
        { text: "Teaches the patient the name of the drug and the reaction, and to tell every future provider and pharmacist" },
      ],
    },
    {
      id: "n220-skill-wound",
      title: "Wound assessment and documentation",
      purpose: "Consistent, measured wound assessment shows whether healing is progressing and catches infection early.",
      items: [
        { text: "Performs hand hygiene, explains the procedure, provides privacy and offers analgesia beforehand if needed and prescribed" },
        { text: "Removes the old dressing with clean gloves, notes the drainage on it, then changes gloves and uses aseptic or clean technique per policy", critical: true },
        { text: "Describes the wound location and type (surgical incision, pressure injury, other) and whether it is healing by primary or secondary intention" },
        { text: "Measures length (head to toe), width (side to side) and depth with a disposable measuring guide and sterile applicator, using the same method each time" },
        { text: "Describes the wound bed: granulation (red, moist), slough (yellow) or eschar (black), as an estimated percentage of each" },
        { text: "Notes drainage amount, colour, consistency and odour (serous, serosanguineous, sanguineous, purulent)" },
        { text: "Assesses the edges and surrounding skin: approximation, separation, redness and how far it extends, warmth, swelling, induration, maceration" },
        { text: "Assesses pain at the wound and before and after the dressing change" },
        { text: "Recognises and promptly reports signs of infection (purulent or foul drainage, spreading redness, increasing pain, fever) or dehiscence", critical: true },
        { text: "Calls for help immediately and covers exposed organs with a sterile saline-moistened dressing if evisceration occurs", critical: true },
        { text: "Identifies factors that slow healing (glucose, nutrition, perfusion, smoking, corticosteroids) and includes them in the plan" },
        { text: "Applies the prescribed dressing, dates it, disposes of waste safely and performs hand hygiene" },
        { text: "Documents findings the same way every time so the trend can be compared, and reports a wound that is not improving", critical: true },
      ],
    },
  ],
};
