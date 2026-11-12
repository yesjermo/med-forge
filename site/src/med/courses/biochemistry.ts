import type { Course } from "../types";

/** Original sample content for a typical undergraduate Biochemistry course. */
export const biochemistry: Course = {
  id: "biochemistry",
  code: "BIOCHEM",
  title: "Biochemistry",
  description:
    "Proteins, enzymes, buffers and energy metabolism for pre-med and biomedical science students: enzyme kinetics, Henderson–Hasselbalch, spectrophotometric assays, glycolysis and blood glucose control.",
  topics: ["Proteins & enzymes", "Buffers & pH", "Metabolism & assays"],

  concepts: [
    {
      slug: "protein-structure",
      model: "alpha-helix",
      title: "Protein structure and denaturation",
      topic: "Proteins & enzymes",
      summary: "A protein's amino acid sequence folds into secondary, tertiary and quaternary structure; denaturation unfolds it without breaking peptide bonds.",
      body: `Proteins have four levels of structure:
- **Primary**: the amino acid sequence, joined by covalent peptide bonds
- **Secondary**: local folds such as the α-helix and β-pleated sheet, held by hydrogen bonds between backbone C=O and N–H groups
- **Tertiary**: the overall 3D shape of one chain, held by side-chain interactions (hydrophobic packing, ionic bonds, hydrogen bonds, and covalent disulphide bridges between cysteines)
- **Quaternary**: several chains (subunits) working together, e.g. haemoglobin is two α and two β subunits

The sequence contains the information for the fold: hydrophobic side chains tend to bury themselves in the core, polar ones face the water.

**Denaturation** is loss of the native 3D shape, and with it loss of function. Causes include heat, extremes of pH, urea, detergents, organic solvents and heavy metals. It disrupts the non-covalent interactions (and sometimes disulphides) but leaves the primary sequence intact. Some small proteins refold on their own when the denaturing agent is removed, which shows that sequence determines structure.`,
      pearls: [
        "Sickle cell disease comes from a single amino acid change in β-globin (glutamate to valine); the new hydrophobic patch makes deoxygenated haemoglobin polymerise.",
        "Misfolded proteins that aggregate into amyloid underlie conditions such as Alzheimer's disease and prion diseases.",
        "Cooking an egg white is irreversible denaturation: the unfolded proteins tangle and aggregate.",
      ],
    },
    {
      slug: "enzyme-kinetics",
      model: "enzyme",
      title: "Enzyme kinetics and inhibition",
      topic: "Proteins & enzymes",
      summary: "Michaelis–Menten kinetics link reaction velocity to substrate concentration; competitive inhibitors raise apparent Km, non-competitive inhibitors lower Vmax.",
      formulas: [
        "v = \\dfrac{V_{max}[S]}{K_m + [S]}",
        "\\dfrac{1}{v} = \\dfrac{K_m}{V_{max}} \\cdot \\dfrac{1}{[S]} + \\dfrac{1}{V_{max}}",
      ],
      body: `Enzymes speed reactions by lowering the activation energy; they don't change the equilibrium. For many enzymes, initial velocity $v$ follows the **Michaelis–Menten equation**:

$$ v = \\frac{V_{max}[S]}{K_m + [S]} $$

- $V_{max}$ is the maximum rate when every enzyme molecule is saturated with substrate.
- $K_m$ is the substrate concentration that gives half of $V_{max}$. A low $K_m$ usually means high apparent affinity.
- When $[S] \\ll K_m$, rate rises almost linearly with $[S]$; when $[S] \\gg K_m$, rate levels off near $V_{max}$.

The **Lineweaver–Burk** (double-reciprocal) plot turns the hyperbola into a straight line:

$$ \\frac{1}{v} = \\frac{K_m}{V_{max}} \\cdot \\frac{1}{[S]} + \\frac{1}{V_{max}} $$

The y-intercept is $1/V_{max}$, the x-intercept is $-1/K_m$ and the slope is $K_m/V_{max}$.

**Reversible inhibition**
- **Competitive**: the inhibitor resembles the substrate and binds the active site. Apparent $K_m$ rises; $V_{max}$ is unchanged because enough substrate outcompetes it. Lines cross on the y-axis.
- **Non-competitive** (pure): the inhibitor binds elsewhere and lowers the amount of working enzyme. $V_{max}$ falls; $K_m$ is unchanged. Lines cross on the x-axis.`,
      pearls: [
        "Methanol and ethylene glycol are harmful mainly through their toxic metabolites made by alcohol dehydrogenase; fomepizole is a competitive inhibitor of that enzyme, which is why it is used as an antidote.",
        "In phenylketonuria (PKU), deficient phenylalanine hydroxylase lets phenylalanine build up; newborn screening and a low-phenylalanine diet prevent brain damage.",
        "Statins competitively inhibit HMG-CoA reductase, the rate-limiting enzyme of cholesterol synthesis.",
      ],
    },
    {
      slug: "buffers-ph",
      model: "carbonic-acid",
      title: "Buffers and the Henderson–Hasselbalch equation",
      topic: "Buffers & pH",
      summary: "A buffer is a weak acid with its conjugate base; it resists pH change best when pH is within about one unit of its pKa.",
      formulas: ["pH = pK_a + \\log_{10}\\dfrac{[A^-]}{[HA]}"],
      body: `A weak acid HA dissociates only partly: $HA \\rightleftharpoons H^+ + A^-$. Its strength is described by $pK_a$: the lower the $pK_a$, the stronger the acid.

The **Henderson–Hasselbalch equation** relates pH to the ratio of conjugate base to acid:

$$ pH = pK_a + \\log_{10}\\frac{[A^-]}{[HA]} $$

Useful consequences:
- When $[A^-] = [HA]$, $\\log 1 = 0$ so $pH = pK_a$. This is where buffering is strongest.
- Every tenfold change in the ratio shifts pH by 1 unit (ratio 10:1 → $pK_a + 1$; ratio 1:10 → $pK_a - 1$).
- The useful buffering range is roughly $pK_a \\pm 1$.
- Buffer **capacity** also depends on total concentration: a more concentrated buffer absorbs more added acid or base.

**Making a buffer in the lab:** choose an acid whose $pK_a$ is close to the target pH, then set the base-to-acid ratio with the equation. Acetic acid ($pK_a$ 4.76) suits pH 4–5.5; phosphate ($pK_a$ 7.2 for $H_2PO_4^-$) suits near-neutral pH.`,
      pearls: [
        "Bicarbonate/CO₂ is the main extracellular buffer; haemoglobin and phosphate buffer inside cells.",
        "Histidine side chains have a pKa near physiological pH, which is why histidine-rich proteins such as haemoglobin buffer well.",
        "Weak-acid drugs such as aspirin are less ionised in acidic stomach contents, which affects how they cross membranes.",
      ],
    },
    {
      slug: "beer-lambert",
      title: "Spectrophotometry, Beer–Lambert and the Bradford assay",
      topic: "Metabolism & assays",
      summary: "Absorbance is proportional to concentration (A = εlc); a standard curve of known concentrations lets you read unknowns, as in the Bradford protein assay.",
      formulas: ["A = \\varepsilon l c", "A = \\log_{10}\\dfrac{I_0}{I}", "c = \\dfrac{A - b}{m}"],
      body: `A spectrophotometer shines light of one wavelength through a sample and measures how much passes through. **Absorbance** is

$$ A = \\log_{10}\\frac{I_0}{I} $$

where $I_0$ is incident and $I$ transmitted light. A has no units.

The **Beer–Lambert law** says absorbance is proportional to concentration:

$$ A = \\varepsilon l c $$

with $\\varepsilon$ the molar absorption coefficient (M⁻¹ cm⁻¹), $l$ the path length (usually 1 cm) and $c$ the molar concentration. For example, NADH absorbs at 340 nm with $\\varepsilon$ ≈ 6,220 M⁻¹ cm⁻¹, which is how many enzyme assays follow NADH being made or used.

**Standard curves:** when $\\varepsilon$ isn't known (as with a dye–protein complex), measure standards of known concentration, plot A against concentration, and fit a line $y = mx + b$. Read an unknown as $c = (A - b)/m$.

**Bradford assay:** Coomassie Brilliant Blue G-250 in acid binds proteins (mainly arginine, lysine and aromatic residues) and its absorbance maximum shifts from about 465 nm to 595 nm. Absorbance at 595 nm rises with protein content.

Good practice:
- Zero the instrument with a **blank** (reagent plus buffer, no protein)
- Keep readings within the **linear range** of the standards; dilute samples that read too high, then multiply by the dilution factor
- Run standards and samples in duplicate or triplicate`,
      pearls: [
        "Pulse oximeters apply the same absorbance principle, comparing red and infrared light absorbed by oxy- and deoxyhaemoglobin.",
        "Haemolysed, lipaemic or very jaundiced blood samples can interfere with spectrophotometric lab tests, so labs flag them.",
      ],
    },
    {
      slug: "glycolysis",
      model: "glucose",
      title: "Glycolysis and its regulation",
      topic: "Metabolism & assays",
      summary: "Glycolysis splits one glucose into two pyruvate in the cytosol, netting 2 ATP and 2 NADH; hexokinase, PFK-1 and pyruvate kinase are the control points.",
      formulas: ["Glucose + 2\\,NAD^+ + 2\\,ADP + 2\\,P_i \\rightarrow 2\\,Pyruvate + 2\\,NADH + 2\\,ATP"],
      body: `Glycolysis happens in the cytosol of every cell and needs no oxygen.

$$ Glucose + 2\\,NAD^+ + 2\\,ADP + 2\\,P_i \\rightarrow 2\\,Pyruvate + 2\\,NADH + 2\\,ATP $$

1. **Investment phase**: 2 ATP are used (by hexokinase and PFK-1) to phosphorylate glucose, which is then split into two three-carbon sugars
2. **Payoff phase**: each three-carbon unit yields 2 ATP (substrate-level phosphorylation) and 1 NADH, so 4 ATP and 2 NADH per glucose
3. **Net**: 4 − 2 = **2 ATP**, plus **2 NADH** and 2 pyruvate

**Three irreversible, regulated steps**
- **Hexokinase**: glucose → glucose-6-phosphate; inhibited by its product. The liver and pancreatic β-cells use glucokinase, which has a much higher $K_m$ and so works in proportion to blood glucose.
- **PFK-1** (phosphofructokinase-1): the main rate-limiting step. Activated by AMP and fructose-2,6-bisphosphate; inhibited by ATP and citrate (signs of plenty of energy).
- **Pyruvate kinase**: makes ATP and pyruvate; activated by fructose-1,6-bisphosphate (feed-forward), inhibited by ATP.

**Fate of pyruvate:** with oxygen it enters mitochondria for the citric acid cycle and oxidative phosphorylation. Without enough oxygen (or in red cells, which lack mitochondria), lactate dehydrogenase reduces pyruvate to **lactate** to regenerate NAD⁺, so glycolysis can keep going.`,
      pearls: [
        "In shock or severe hypoxia, tissues shift to anaerobic glycolysis and blood lactate rises, which is why lactate is used as a marker of poor perfusion.",
        "Pyruvate kinase deficiency starves red cells of ATP and causes haemolytic anaemia, because red cells depend entirely on glycolysis.",
        "Intense sprinting can produce more lactate than muscle can clear, contributing to fatigue.",
      ],
    },
    {
      slug: "glucose-regulation",
      title: "Blood glucose regulation: insulin and glucagon",
      topic: "Metabolism & assays",
      summary: "Insulin lowers blood glucose after meals by promoting uptake and storage; glucagon and other counter-regulatory hormones raise it during fasting.",
      body: `Blood glucose is held in a narrow range because the brain relies on a steady glucose supply.

**Insulin** (from pancreatic β-cells), released when glucose rises after a meal:
- Moves GLUT4 transporters to the membrane of muscle and fat cells, increasing glucose uptake
- Stimulates glycogen synthesis in liver and muscle, and fat synthesis
- Suppresses glycogen breakdown, gluconeogenesis, lipolysis and ketone production

**Glucagon** (from pancreatic α-cells), released when glucose falls:
- Acts mainly on the liver via cAMP
- Stimulates glycogenolysis and gluconeogenesis, releasing glucose into the blood
- Promotes fatty acid oxidation and ketogenesis during prolonged fasting

Other **counter-regulatory hormones** that raise glucose: adrenaline (fast), cortisol and growth hormone (slower).

In the liver, insulin raises and glucagon lowers fructose-2,6-bisphosphate, so the same hormones switch PFK-1 and glycolysis on or off.

**Diabetes mellitus**
- **Type 1**: autoimmune destruction of β-cells, so little or no insulin; treated with insulin
- **Type 2**: insulin resistance with relative insulin deficiency`,
      pearls: [
        "Injected insulin can't be switched off; exercise also raises muscle glucose uptake independently of insulin, so exercise plus a missed meal is a classic cause of hypoglycaemia in type 1 diabetes.",
        "Hypoglycaemia gives autonomic symptoms (shaking, sweating, palpitations, hunger) and neuroglycopenic symptoms (confusion, odd behaviour, seizures, reduced consciousness).",
        "Alcohol suppresses hepatic gluconeogenesis, so drinking without eating raises hypoglycaemia risk.",
      ],
    },
  ],

  lectures: [
    {
      id: "bio-l1",
      week: 2,
      title: "Protein structure and enzyme kinetics",
      topic: "Proteins & enzymes",
      summary: "How sequence becomes shape, why shape matters for function, and how to read Michaelis–Menten and Lineweaver–Burk plots.",
      notes: `- Four levels of structure: primary (peptide bonds), secondary (backbone H-bonds), tertiary (side chains, disulphides), quaternary (subunits)
- Denaturation destroys shape and function but not the sequence
- Michaelis–Menten: v = Vmax[S] / (Km + [S]); at [S] = Km, v = Vmax/2
- Lineweaver–Burk: y-intercept 1/Vmax, x-intercept −1/Km
- Competitive inhibition: Km up, Vmax same; non-competitive: Vmax down, Km same`,
      insights: [
        { type: "exam_tip", text: "Where the Lineweaver–Burk lines cross tells you the inhibitor type: on the y-axis means competitive, on the x-axis means non-competitive.", conceptSlug: "enzyme-kinetics" },
        { type: "clinical_link", text: "Fomepizole works in methanol or ethylene glycol poisoning by competing for alcohol dehydrogenase, so less toxic metabolite is made.", conceptSlug: "enzyme-kinetics" },
        { type: "intuition", text: "A competitive inhibitor is a decoy at the door: flood the room with real substrate and the decoys rarely get in.", conceptSlug: "enzyme-kinetics" },
      ],
    },
    {
      id: "bio-l2",
      week: 5,
      title: "Buffers, pH and spectrophotometry",
      topic: "Buffers & pH",
      summary: "Designing buffers with Henderson–Hasselbalch, and measuring concentrations with Beer–Lambert and standard curves.",
      notes: `- pH = pKa + log([A⁻]/[HA]); at equal concentrations pH = pKa
- Buffers work best within about ±1 pH unit of the pKa
- A = εlc; absorbance has no units
- Unknowns are read from a standard curve: c = (A − b)/m
- Bradford assay: Coomassie dye binds protein, read at 595 nm, against a BSA standard curve`,
      insights: [
        { type: "exam_tip", text: "If the base-to-acid ratio is 10, pH is pKa + 1; if it's 0.1, pH is pKa − 1. Many exam questions reduce to this.", conceptSlug: "buffers-ph" },
        { type: "intuition", text: "Absorbance is logarithmic: A = 1 means only 10% of the light gets through, A = 2 only 1%.", conceptSlug: "beer-lambert" },
        { type: "clinical_link", text: "A blood gas is a Henderson–Hasselbalch calculation for the bicarbonate buffer.", conceptSlug: "buffers-ph" },
      ],
    },
    {
      id: "bio-l3",
      week: 9,
      title: "Glycolysis and glucose homeostasis",
      topic: "Metabolism & assays",
      summary: "The energy accounts of glycolysis, its control points, and how insulin and glucagon keep blood glucose steady.",
      notes: `- Glycolysis: glucose → 2 pyruvate; 2 ATP invested, 4 made, net 2 ATP and 2 NADH
- Control points: hexokinase/glucokinase, PFK-1 (rate-limiting), pyruvate kinase
- Without oxygen, pyruvate → lactate to regenerate NAD⁺
- Insulin: uptake and storage; glucagon: liver glucose output
- Counter-regulation: glucagon, adrenaline, cortisol, growth hormone`,
      insights: [
        { type: "exam_tip", text: "PFK-1 is the usual answer for 'committed' or 'rate-limiting step of glycolysis'; know its activators (AMP, fructose-2,6-bisphosphate) and inhibitors (ATP, citrate).", conceptSlug: "glycolysis" },
        { type: "clinical_link", text: "A raised lactate in a sick patient suggests tissues aren't getting enough oxygen and have switched to anaerobic glycolysis.", conceptSlug: "glycolysis" },
        { type: "intuition", text: "Insulin is the 'fed' signal (store it), glucagon the 'fasting' signal (release it).", conceptSlug: "glucose-regulation" },
      ],
    },
  ],

  questions: [
    {
      id: "bio-q1",
      type: "mcq",
      topic: "Proteins & enzymes",
      difficulty: 1,
      prompt: "Which interaction mainly stabilises an α-helix?",
      options: [
        "Peptide bonds between adjacent amino acids",
        "Hydrogen bonds between backbone C=O and N–H groups",
        "Disulphide bridges between cysteine side chains",
        "Ionic bonds between subunits",
      ],
      answer: 1,
      hints: ["The α-helix is secondary structure.", "Secondary structure depends on the backbone, not the side chains."],
      explanation:
        "α-helices and β-sheets are held by hydrogen bonds between backbone carbonyl and amide groups. Peptide bonds define primary structure; disulphides help tertiary structure; bonds between subunits are quaternary.",
      concepts: ["protein-structure"],
    },
    {
      id: "bio-q2",
      type: "numeric",
      topic: "Proteins & enzymes",
      difficulty: 1,
      prompt: "An enzyme has Vmax = 80 µmol/min and Km = 2 mM. What is the initial velocity (µmol/min) when [S] = 2 mM?",
      answer: 40,
      tolerance: 0.5,
      unit: "µmol/min",
      hints: ["Compare [S] with Km.", "By definition, Km is the [S] that gives half of Vmax."],
      explanation: "$v = \\frac{80 \\times 2}{2 + 2} = 40$ µmol/min. When $[S] = K_m$, $v = V_{max}/2$.",
      concepts: ["enzyme-kinetics"],
    },
    {
      id: "bio-q3",
      type: "numeric",
      topic: "Proteins & enzymes",
      difficulty: 2,
      prompt: "An enzyme has Vmax = 120 µmol/min and Km = 2 mM. What is the initial velocity (µmol/min) at [S] = 6 mM?",
      answer: 90,
      tolerance: 0.5,
      unit: "µmol/min",
      hints: ["Use $v = V_{max}[S]/(K_m + [S])$.", "The denominator is 2 + 6 = 8 mM."],
      explanation: "$v = \\frac{120 \\times 6}{2 + 6} = \\frac{720}{8} = 90$ µmol/min, i.e. 75% of $V_{max}$.",
      concepts: ["enzyme-kinetics"],
    },
    {
      id: "bio-q4",
      type: "mcq",
      topic: "Proteins & enzymes",
      difficulty: 2,
      prompt: "A drug binds the active site of an enzyme and competes with the substrate. How does it change the kinetic constants?",
      options: [
        "Apparent Km increases; Vmax is unchanged",
        "Km is unchanged; Vmax decreases",
        "Both apparent Km and Vmax decrease",
        "Apparent Km decreases; Vmax increases",
      ],
      answer: 0,
      hints: ["Can a very high substrate concentration overcome the drug?", "If it can, the maximum rate is still reachable."],
      explanation:
        "A competitive inhibitor means more substrate is needed to reach half-maximal rate (apparent Km rises), but at saturating substrate the inhibitor is outcompeted, so Vmax is unchanged. Unchanged Km with lower Vmax is pure non-competitive inhibition.",
      concepts: ["enzyme-kinetics"],
    },
    {
      id: "bio-q5",
      type: "numeric",
      topic: "Buffers & pH",
      difficulty: 2,
      prompt: "An acetate buffer contains 0.10 M sodium acetate and 0.050 M acetic acid (pKa 4.76). What is its pH (to 2 decimal places)?",
      answer: 5.06,
      tolerance: 0.02,
      unit: "",
      hints: ["The base-to-acid ratio is 0.10 / 0.050 = 2.", "$\\log_{10} 2 \\approx 0.30$"],
      explanation: "$pH = 4.76 + \\log_{10}(0.10 / 0.050) = 4.76 + 0.30 = 5.06$. More base than acid, so pH is above the pKa.",
      concepts: ["buffers-ph"],
    },
    {
      id: "bio-q6",
      type: "numeric",
      topic: "Metabolism & assays",
      difficulty: 2,
      prompt: "An NADH solution reads A₃₄₀ = 0.311 in a 1 cm cuvette. With ε = 6,220 M⁻¹ cm⁻¹, what is the NADH concentration in µM?",
      answer: 50,
      tolerance: 0.5,
      unit: "µM",
      hints: ["Rearrange A = εlc to c = A / (εl).", "Convert mol/L to µmol/L by multiplying by 10⁶."],
      explanation: "$c = \\frac{0.311}{6220 \\times 1} = 5.0 \\times 10^{-5}$ M $= 50$ µM.",
      concepts: ["beer-lambert"],
    },
    {
      id: "bio-q7",
      type: "numeric",
      topic: "Metabolism & assays",
      difficulty: 1,
      prompt: "Red blood cells have no mitochondria. How many glucose molecules must they break down by glycolysis to make a net 10 ATP?",
      answer: 5,
      tolerance: 0,
      unit: "glucose",
      hints: ["Glycolysis uses 2 ATP and makes 4 per glucose.", "Net yield is 2 ATP per glucose."],
      explanation: "Net yield is $4 - 2 = 2$ ATP per glucose, so $10 / 2 = 5$ glucose molecules. Red cells turn the pyruvate into lactate to regenerate NAD⁺.",
      concepts: ["glycolysis"],
    },
    {
      id: "bio-q8",
      type: "mcq",
      topic: "Metabolism & assays",
      difficulty: 3,
      prompt: "After an overnight fast, which change best explains how blood glucose is maintained?",
      options: [
        "Insulin rises and moves GLUT4 into liver cell membranes",
        "Glucagon acts on the liver to stimulate glycogenolysis and gluconeogenesis, and lowers fructose-2,6-bisphosphate",
        "Glucagon stimulates muscle glycogen breakdown, releasing free glucose into the blood",
        "PFK-1 activity rises in the liver to speed glucose release",
      ],
      answer: 1,
      hints: ["Which hormone dominates in the fasting state?", "Which organ can release free glucose into the blood?"],
      explanation:
        "In fasting, glucagon rises and acts on the liver: it stimulates glycogenolysis and gluconeogenesis and lowers fructose-2,6-bisphosphate, slowing glycolysis so glucose is exported. Insulin falls in fasting; GLUT4 is in muscle and fat. Muscle lacks glucose-6-phosphatase and doesn't respond to glucagon, so its glycogen fuels the muscle itself.",
      concepts: ["glucose-regulation", "glycolysis"],
    },
  ],

  labs: [
    {
      id: "bio-lab-bradford",
      title: "Bradford protein assay with a BSA standard curve",
      topic: "Metabolism & assays",
      objective:
        "Prepare bovine serum albumin (BSA) standards, build a standard curve of absorbance at 595 nm, and use it to find the protein concentration of an unknown sample.",
      safety: [
        "Wear a lab coat, gloves and eye protection throughout.",
        "Bradford reagent contains phosphoric acid and methanol: avoid skin and eye contact, work in a well-ventilated area, and rinse any splash with plenty of water and tell the instructor.",
        "Handle cuvettes by the frosted or ridged sides; report and clean up broken glass with a brush and pan, never bare hands.",
        "Dispose of used reagent, cuvettes and tips as directed by your instructor; don't pour reagent down the sink unless told it's allowed.",
        "Wipe up spills promptly and keep the spectrophotometer's sample compartment dry.",
      ],
      materials: [
        "BSA stock solution (2.0 mg/mL)",
        "Bradford (Coomassie) reagent",
        "Buffer or water used to dissolve the samples",
        "Unknown protein sample",
        "Micropipettes and tips",
        "Microcentrifuge tubes or test tubes and a rack",
        "Plastic cuvettes (1 cm path length)",
        "Spectrophotometer set to 595 nm",
        "Vortex mixer and timer",
      ],
      steps: [
        { text: "Switch on the spectrophotometer, let the lamp warm up, and set the wavelength to 595 nm.", why: "The Coomassie–protein complex absorbs most strongly near 595 nm; a warmed-up lamp gives stable readings." },
        { text: "Use C1V1 = C2V2 to dilute the BSA stock into standards across the assay range (e.g. 0, 0.125, 0.25, 0.5, 0.75 and 1.0 mg/mL) in the same buffer as the unknown." },
        { text: "Prepare the unknown undiluted and at a 1 in 10 dilution.", why: "If the undiluted sample reads above the top standard, the diluted one should fall inside the linear range." },
        { text: "Pipette the same small volume of each standard and unknown into labelled tubes, in duplicate.", why: "Duplicates show pipetting errors and let you average out random variation." },
        { text: "Add the same volume of Bradford reagent to every tube and mix gently by vortexing or inversion.", why: "Equal reagent volumes keep the dye-to-sample ratio constant across tubes." },
        { text: "Incubate at room temperature for about 5 minutes, and read all tubes within the time window your protocol gives.", why: "Colour develops quickly but drifts over time, so reading at a similar time keeps tubes comparable." },
        { text: "Zero the spectrophotometer with the blank (0 mg/mL standard: buffer plus reagent).", why: "The blank removes absorbance from the reagent itself, so readings reflect protein only." },
        { text: "Transfer each sample to a clean cuvette, wipe the clear faces, and record A₅₉₅." },
        { text: "Plot mean absorbance against BSA concentration and fit a straight line through the linear part of the curve.", why: "The Bradford response flattens at high protein; only the linear range gives reliable readings." },
        { text: "Use the line's equation to calculate the unknown's concentration, then multiply by any dilution factor." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "How many µL of 2.0 mg/mL BSA stock do you need to make 500 µL of a 0.25 mg/mL standard?",
          answer: 62.5,
          tolerance: 0.5,
          unit: "µL",
          working: "C1V1 = C2V2 → V1 = (0.25 × 500) / 2.0 = 62.5 µL of stock, made up to 500 µL with 437.5 µL buffer.",
        },
        {
          id: "d2",
          prompt: "Your standard curve is A₅₉₅ = 0.80x + 0.02, with x in mg/mL. A diluted unknown reads A₅₉₅ = 0.50. What is its protein concentration in mg/mL?",
          answer: 0.6,
          tolerance: 0.01,
          unit: "mg/mL",
          working: "x = (A − b) / m = (0.50 − 0.02) / 0.80 = 0.48 / 0.80 = 0.60 mg/mL.",
        },
        {
          id: "d3",
          prompt: "That unknown had been diluted 1 in 10 before the assay. What is the protein concentration of the original sample in mg/mL?",
          answer: 6,
          tolerance: 0.05,
          unit: "mg/mL",
          working: "Multiply by the dilution factor: 0.60 × 10 = 6.0 mg/mL.",
        },
      ],
      resultsGuide:
        "Standards should turn from brown-red to increasingly blue as protein rises, and absorbance should climb steadily, flattening at the highest concentrations. Duplicates should agree closely; a large gap points to a pipetting error. Report the unknown only if its absorbance falls within the standards: if it reads above the top standard, use the diluted sample and apply the dilution factor. Remember that the Bradford response varies between proteins, so the result is 'protein concentration relative to BSA'.",
    },
  ],

  cases: [
    {
      id: "bio-case-hypoglycaemia",
      title: "Shaky and confused after a run",
      topic: "Metabolism & assays",
      setting: "Residence hall, then campus clinic. Educational simulation with a fictional patient.",
      presentation:
        "Sam, 20, has had type 1 diabetes since childhood. After a long afternoon run they skipped dinner to study. A flatmate brings them to the clinic because they are shaky, sweaty and muddled, struggling to answer simple questions.",
      stages: [
        {
          title: "History",
          prompt: "Sam can answer some questions; their flatmate helps. Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "When did you last eat, and what did you have?", good: true, feedback: "\"Lunch, around noon. I meant to eat after my run but got caught up studying.\"" },
            { text: "Have you taken your insulin today as usual?", good: true, feedback: "\"Yes, my usual insulin with lunch, and my long-acting one this morning.\"" },
            { text: "How much exercise did you do today, and was it more than usual?", good: true, feedback: "\"About an hour and a half of running, longer than normal. I'm training for a race.\"" },
            { text: "Have you had any alcohol today?", good: true, feedback: "\"No, nothing.\" Worth asking, because alcohol suppresses liver glucose production." },
            { text: "What did you get in your last exam?", good: false, feedback: "Not relevant, and it wastes time in a patient who may be getting worse." },
            { text: "Do you have any pets at home?", good: false, feedback: "Doesn't help explain an acute change in behaviour." },
          ],
          debrief:
            "Insulin taken as usual, a long run, and a missed meal are a classic recipe for hypoglycaemia in type 1 diabetes. Ask about alcohol too, since it blocks gluconeogenesis.",
        },
        {
          title: "Examination",
          prompt: "What do you look for?",
          mode: "multi",
          options: [
            { text: "Level of consciousness and whether they can swallow safely", good: true, feedback: "Drowsy but responds to voice, follows simple commands, and can sip water without coughing." },
            { text: "Skin and autonomic signs: sweating, pallor, tremor", good: true, feedback: "Pale, clammy and sweating, with a fine tremor of the hands." },
            { text: "Heart rate and blood pressure", good: true, feedback: "HR 112 beats/min, BP 128/76 mmHg: tachycardic, consistent with adrenaline release." },
            { text: "A full joint examination of both knees", good: false, feedback: "Normal, and not urgent here." },
            { text: "Visual acuity chart", good: false, feedback: "Not useful in a confused patient and delays the key test." },
          ],
          debrief:
            "Sweating, tremor and a fast heart rate are adrenaline-driven warning signs; confusion shows the brain is short of glucose. Being able to swallow safely decides how glucose can be given.",
        },
        {
          title: "Investigations",
          prompt: "Which tests do you do now?",
          mode: "multi",
          options: [
            { text: "Fingerstick capillary blood glucose", good: true, feedback: "2.6 mmol/L (47 mg/dL): low." },
            { text: "CT scan of the head", good: false, feedback: "Unnecessary radiation and delay; a low glucose explains the confusion and can be corrected in minutes." },
            { text: "HbA1c", good: false, feedback: "Reflects average glucose over about three months; it doesn't help with an emergency happening now." },
            { text: "Wait for a laboratory venous glucose before doing anything", good: false, feedback: "Treatment shouldn't be delayed when a fingerstick reading is low and the patient has symptoms." },
          ],
          debrief:
            "In anyone with diabetes who is confused, check a fingerstick glucose straight away. It is fast, cheap and changes management at once.",
        },
        {
          title: "Mechanism",
          prompt: "Why did Sam's glucose fall so low?",
          mode: "single",
          options: [
            {
              text: "Injected insulin kept acting, exercising muscle took up extra glucose, and no meal replaced it, while the glucagon response in long-standing type 1 diabetes is often blunted",
              good: true,
              feedback: "Correct: supply fell, uptake rose, and the body couldn't switch the insulin off or fully counter-regulate.",
            },
            { text: "Exercise switches off glycolysis in muscle, so glucose builds up in the blood", good: false, feedback: "Exercise does the opposite: muscle uses more glucose, not less." },
            { text: "Glucagon lowers blood glucose after exercise", good: false, feedback: "Glucagon raises blood glucose by stimulating liver glycogenolysis and gluconeogenesis." },
            { text: "Too little insulin made the cells unable to use glucose", good: false, feedback: "Insulin deficiency causes high glucose, not low, as in diabetic ketoacidosis." },
          ],
          debrief:
            "Normally falling glucose lowers insulin and raises glucagon and adrenaline. With injected insulin, the first defence (reducing insulin) is lost, and exercise raises muscle glucose uptake independently of insulin.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Hypoglycaemia related to insulin treatment, exercise and a missed meal", good: true, feedback: "Symptoms plus a low glucose reading with a clear cause." },
            { text: "Diabetic ketoacidosis", good: false, feedback: "DKA comes with high glucose, ketones and deep breathing, not low glucose." },
            { text: "Heat exhaustion from running", good: false, feedback: "It can cause sweating and fatigue, but doesn't explain the low glucose." },
            { text: "Anxiety attack", good: false, feedback: "Anxiety can mimic the autonomic symptoms, but the glucose reading shows the real cause." },
          ],
          debrief:
            "Hypoglycaemia is confirmed by symptoms, a low glucose and improvement when glucose is restored. Always look for the cause so it can be prevented.",
        },
        {
          title: "Management principles",
          prompt: "Sam is conscious and can swallow safely. What is the right approach (in a supervised setting, following local protocol)?",
          mode: "single",
          options: [
            {
              text: "Give fast-acting carbohydrate such as juice or glucose tablets, recheck glucose after about 15 minutes, then give longer-acting carbohydrate such as a sandwich or meal once it has recovered",
              good: true,
              feedback: "Correct: fast sugar first, confirm the response, then a slower carbohydrate to stop it dropping again.",
            },
            { text: "Give a dose of insulin to help the cells use glucose", good: false, feedback: "Insulin would lower glucose further and could be dangerous." },
            { text: "Let Sam sleep it off and check in the morning", good: false, feedback: "Untreated hypoglycaemia can progress to seizures and loss of consciousness." },
            { text: "Give a high-fat, high-protein snack only", good: false, feedback: "Fat and protein raise glucose slowly; fast-acting carbohydrate is needed first." },
          ],
          debrief:
            "If someone is unable to swallow safely or is unconscious, nothing goes by mouth: call for emergency help, and trained people can give glucagon or intravenous glucose. Afterwards, review insulin and food planning around exercise with the diabetes team.",
        },
      ],
      teachingPoints: [
        "Check a fingerstick glucose in anyone with diabetes who is confused or behaving oddly.",
        "Exercise, missed meals, alcohol and too much insulin are the common causes of hypoglycaemia in type 1 diabetes.",
        "Conscious and able to swallow: fast-acting carbohydrate, recheck, then longer-acting carbohydrate.",
        "Unable to swallow: nothing by mouth, call for help; glucagon or IV glucose by trained people.",
      ],
    },
  ],

  skills: [
    {
      id: "bio-skill-pipette",
      title: "Using an adjustable micropipette",
      purpose: "Accurate pipetting underpins every standard curve, dilution and assay result in the lab.",
      items: [
        { text: "Chooses a pipette whose range includes the target volume (ideally near the top of its range)", critical: true },
        { text: "Sets the volume by turning the dial within the pipette's limits, never beyond them", critical: true },
        { text: "Attaches a fresh tip of the right size firmly, without touching it by hand" },
        { text: "Pre-wets the tip by aspirating and dispensing the liquid once or twice" },
        { text: "Presses the plunger to the first stop before entering the liquid", critical: true },
        { text: "Holds the pipette vertically and immerses the tip just below the surface, then releases the plunger slowly", critical: true },
        { text: "Withdraws the tip smoothly and checks for air bubbles or droplets on the outside" },
        { text: "Dispenses against the inner wall of the receiving vessel, pressing to the first stop then the second stop to blow out", critical: true },
        { text: "Removes the pipette with the plunger still pressed, then lets it return slowly" },
        { text: "Ejects the tip into the correct waste container and stores the pipette upright" },
      ],
    },
  ],
};
