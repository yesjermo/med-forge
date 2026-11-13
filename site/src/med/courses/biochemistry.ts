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
    {
      id: "bio-q9",
      type: "mcq",
      topic: "Buffers & pH",
      difficulty: 1,
      prompt: "A weak acid buffer contains equal concentrations of the acid (HA) and its conjugate base (A⁻). What is the pH?",
      options: ["Equal to the pKa", "One unit above the pKa", "One unit below the pKa", "Exactly 7.0"],
      answer: 0,
      hints: ["Put a ratio of 1 into the Henderson–Hasselbalch equation.", "What is $\\log_{10} 1$?"],
      explanation:
        "$pH = pK_a + \\log_{10}(1) = pK_a + 0 = pK_a$. This is also the point of greatest buffering, because added acid or base changes the ratio least. pH 7.0 is only the answer if the pKa happens to be 7.0.",
      concepts: ["buffers-ph"],
    },
    {
      id: "bio-q10",
      type: "numeric",
      topic: "Buffers & pH",
      difficulty: 2,
      prompt: "You need a phosphate buffer at pH 7.4 using the H₂PO₄⁻/HPO₄²⁻ pair (pKa 7.2). What ratio of [HPO₄²⁻] to [H₂PO₄⁻] do you need (to 2 decimal places)?",
      answer: 1.58,
      tolerance: 0.03,
      unit: "",
      hints: ["Rearrange: $\\log_{10}([A^-]/[HA]) = pH - pK_a$.", "The ratio is $10^{0.2}$."],
      explanation:
        "$\\log_{10}([A^-]/[HA]) = 7.4 - 7.2 = 0.2$, so the ratio is $10^{0.2} \\approx 1.58$. HPO₄²⁻ is the conjugate base, so there is a little more of it than of H₂PO₄⁻, as expected for a pH just above the pKa.",
      concepts: ["buffers-ph"],
    },
    {
      id: "bio-q11",
      type: "numeric",
      topic: "Buffers & pH",
      difficulty: 3,
      prompt:
        "For the bicarbonate buffer, $pH = 6.1 + \\log_{10}\\dfrac{[HCO_3^-]}{0.03 \\times pCO_2}$, with bicarbonate in mmol/L and pCO₂ in mmHg (0.03 converts pCO₂ to dissolved CO₂ in mmol/L). A patient whose breathing is suppressed has [HCO₃⁻] = 24 mmol/L and pCO₂ = 60 mmHg. What is the arterial pH (to 2 decimal places)?",
      answer: 7.22,
      tolerance: 0.02,
      unit: "",
      hints: ["Dissolved CO₂ is 0.03 × 60 = 1.8 mmol/L.", "The ratio is 24 / 1.8 ≈ 13.3; take its log."],
      explanation:
        "$pH = 6.1 + \\log_{10}(24 / 1.8) = 6.1 + \\log_{10}(13.3) = 6.1 + 1.12 = 7.22$. With a normal pCO₂ of 40 mmHg the ratio would be 20 and the pH 7.40; retaining CO₂ lowers the ratio and causes respiratory acidosis.",
      concepts: ["buffers-ph"],
    },
    {
      id: "bio-q12",
      type: "mcq",
      topic: "Buffers & pH",
      difficulty: 2,
      prompt: "You are setting up an enzyme assay that must run at pH 7.4. Which weak acid is the best choice for the buffer?",
      options: [
        "Citric acid (first pKa 3.1)",
        "Acetic acid (pKa 4.76)",
        "Dihydrogen phosphate, H₂PO₄⁻ (pKa 7.2)",
        "Ammonium ion, NH₄⁺ (pKa 9.25)",
      ],
      answer: 2,
      hints: ["A buffer works best within about one pH unit of its pKa.", "Which pKa is closest to 7.4?"],
      explanation:
        "Phosphate (pKa 7.2) is within 0.2 units of the target, so it has good capacity at pH 7.4. Citrate and acetate would be almost entirely in the base form and ammonium almost entirely in the acid form, so they would barely resist a pH change.",
      concepts: ["buffers-ph"],
    },
    {
      id: "bio-q13",
      type: "mcq",
      topic: "Metabolism & assays",
      difficulty: 1,
      prompt: "Which molecule activates phosphofructokinase-1 (PFK-1), the main rate-limiting enzyme of glycolysis?",
      options: ["ATP", "Citrate", "Fructose-2,6-bisphosphate", "Glucose-6-phosphate"],
      answer: 2,
      hints: ["PFK-1 is switched on by signals that the cell needs energy or that the liver is in the fed state.", "ATP and citrate are signs of plenty of energy."],
      explanation:
        "Fructose-2,6-bisphosphate (and AMP) activate PFK-1. ATP and citrate inhibit it. Glucose-6-phosphate inhibits hexokinase, not PFK-1. In the liver, insulin raises fructose-2,6-bisphosphate and glucagon lowers it.",
      concepts: ["glycolysis", "glucose-regulation"],
    },
    {
      id: "bio-q14",
      type: "numeric",
      topic: "Metabolism & assays",
      difficulty: 2,
      prompt:
        "In a lactate dehydrogenase assay, NADH is used up as pyruvate is reduced. A₃₄₀ in a 1 cm cuvette falls from 0.900 to 0.589 over 5.0 minutes. With ε(NADH) = 6,220 M⁻¹ cm⁻¹, what is the rate of NADH consumption in µM per minute?",
      answer: 10,
      tolerance: 0.2,
      unit: "µM/min",
      hints: ["The change in absorbance is 0.900 − 0.589 = 0.311.", "Convert ΔA to a concentration change with c = A / (εl), then divide by the time."],
      explanation:
        "$\\Delta c = \\frac{0.311}{6220 \\times 1} = 5.0 \\times 10^{-5}$ M $= 50$ µM. Over 5.0 minutes that is $50 / 5.0 = 10$ µM/min.",
      concepts: ["beer-lambert", "enzyme-kinetics"],
    },
    {
      id: "bio-q15",
      type: "numeric",
      topic: "Proteins & enzymes",
      difficulty: 3,
      prompt:
        "A Lineweaver–Burk plot gives a straight line with y-intercept 0.025 min/µmol and slope 0.05 min·mM/µmol. What is Km in mM?",
      answer: 2,
      tolerance: 0.05,
      unit: "mM",
      hints: ["The y-intercept is $1/V_{max}$, so $V_{max}$ = 40 µmol/min.", "The slope is $K_m/V_{max}$, so $K_m$ = slope × $V_{max}$."],
      explanation:
        "$V_{max} = 1/0.025 = 40$ µmol/min, and $K_m = 0.05 \\times 40 = 2$ mM. Check: the x-intercept is $-1/K_m = -0.5$ mM⁻¹, which is also $-$(y-intercept ÷ slope) $= -0.025/0.05$.",
      concepts: ["enzyme-kinetics"],
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
    {
      id: "bio-lab-buffer",
      title: "Preparing an acetate buffer and testing its capacity",
      topic: "Buffers & pH",
      objective:
        "Use the Henderson–Hasselbalch equation to design 100 mL of 0.10 M acetate buffer at pH 5.00, make it from stock solutions, check it with a calibrated pH meter, and compare how the buffer and plain water respond to added strong acid.",
      safety: [
        "Wear a lab coat, gloves and eye protection throughout.",
        "1.0 M hydrochloric acid and 1.0 M acetic acid are corrosive and irritant: handle them over the bench, rinse any skin or eye splash with plenty of water and tell the instructor.",
        "The pH electrode has a thin glass bulb: never use it to stir, and don't let a magnetic stirrer bar hit it.",
        "Use a pipette filler for all acid solutions; never pipette by mouth.",
        "Dispose of solutions as directed by your instructor and wipe up spills promptly.",
      ],
      materials: [
        "1.0 M acetic acid stock",
        "1.0 M sodium acetate stock",
        "1.0 M hydrochloric acid",
        "Deionised water",
        "pH meter with electrode, and pH 4.00 and 7.00 calibration buffers",
        "100 mL volumetric flask",
        "10 mL graduated pipettes or a burette, with pipette filler",
        "Two 100 mL beakers, magnetic stirrer and stirrer bar",
        "Wash bottle and lint-free tissue",
      ],
      steps: [
        { text: "Calibrate the pH meter with the pH 7.00 buffer first, then the pH 4.00 buffer, rinsing and blotting the electrode between them.", why: "Two calibration points that bracket the target pH let the meter set both its offset and its slope." },
        { text: "Calculate the base-to-acid ratio for pH 5.00 and the volume of each 1.0 M stock needed for 100 mL of 0.10 M total acetate (drills 1 to 3).", why: "Doing the calculation first means the buffer should be close to pH 5.00 before any adjustment." },
        { text: "Measure the acetic acid and sodium acetate stocks into the volumetric flask, make up to the mark with deionised water, stopper and invert to mix.", why: "A volumetric flask gives an accurate final volume, so the total concentration is right." },
        { text: "Pour some buffer into a beaker, stir gently and record the pH once the reading is stable." },
        { text: "If the pH is more than about 0.05 away from 5.00, adjust drop by drop with acetic acid or sodium acetate stock and record what you added.", why: "Real pH differs slightly from the simple calculation because Henderson–Hasselbalch ignores ionic strength (activity) effects." },
        { text: "Put 50.0 mL of the buffer in one beaker and 50.0 mL of deionised water in another." },
        { text: "Add 1.0 M HCl to each beaker in 0.50 mL portions, stirring and recording the pH after each addition, up to 3.0 mL in total.", why: "Comparing the two curves shows buffering directly: the buffer's pH should change far less than the water's." },
        { text: "Plot pH against volume of HCl added for both beakers on the same axes." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "Acetic acid has pKa 4.76. What ratio of [acetate] to [acetic acid] gives pH 5.00 (to 2 decimal places)?",
          answer: 1.74,
          tolerance: 0.02,
          unit: "",
          working: "log([A⁻]/[HA]) = 5.00 − 4.76 = 0.24, so [A⁻]/[HA] = 10^0.24 ≈ 1.74.",
        },
        {
          id: "d2",
          prompt: "The total acetate concentration is 0.10 M (100 mM). Using that ratio, what is the concentration of acetic acid in mM?",
          answer: 36.5,
          tolerance: 0.5,
          unit: "mM",
          working: "[HA] = total / (1 + ratio) = 100 / (1 + 1.738) = 100 / 2.738 ≈ 36.5 mM; acetate is 100 − 36.5 = 63.5 mM.",
        },
        {
          id: "d3",
          prompt: "How many mL of 1.0 M sodium acetate stock do you need for 100 mL of the buffer?",
          answer: 6.35,
          tolerance: 0.05,
          unit: "mL",
          working: "C1V1 = C2V2 → V1 = (0.0635 M × 100 mL) / 1.0 M = 6.35 mL of sodium acetate (and 3.65 mL of 1.0 M acetic acid), made up to 100 mL.",
        },
        {
          id: "d4",
          prompt: "You add 0.50 mL of 1.0 M HCl to 50.0 mL of the buffer. What is the new pH according to Henderson–Hasselbalch (to 2 decimal places)?",
          answer: 4.82,
          tolerance: 0.02,
          unit: "",
          working: "50.0 mL holds 3.17 mmol acetate and 1.83 mmol acetic acid. 0.50 mmol H⁺ turns 0.50 mmol acetate into acetic acid: 2.67 mmol acetate, 2.33 mmol acid. pH = 4.76 + log(2.67 / 2.33) = 4.76 + 0.06 = 4.82.",
        },
        {
          id: "d5",
          prompt: "You add the same 0.50 mL of 1.0 M HCl to 50.0 mL of deionised water. What is the pH (to 2 decimal places)?",
          answer: 2,
          tolerance: 0.02,
          unit: "",
          working: "0.50 mmol H⁺ in 50.5 mL gives [H⁺] = 0.50 / 50.5 ≈ 0.0099 M, so pH = −log(0.0099) ≈ 2.00. The water's pH fell by about 5 units; the buffer's by under 0.2.",
        },
      ],
      resultsGuide:
        "The freshly made buffer should read close to pH 5.00; a measured value a little below the calculated one is normal, because the simple equation ignores ionic strength. On the graph, the water's pH should plunge with the first portion of HCl, while the buffer's falls slowly and steadily. The buffer's capacity is set by its acetate: 50 mL holds about 3.2 mmol, so towards 3.0 mL of HCl the acetate is nearly used up and the buffer's pH starts to fall faster (to roughly 3.3 by calculation). If the buffer's pH drops sharply early on, check the stock volumes and that you used sodium acetate rather than water for the base.",
    },
    {
      id: "bio-lab-phosphatase",
      title: "Enzyme kinetics of alkaline phosphatase",
      topic: "Proteins & enzymes",
      objective:
        "Measure initial rates of alkaline phosphatase at a series of p-nitrophenyl phosphate (pNPP) concentrations by following yellow p-nitrophenolate at 405 nm, then find Km and Vmax from a Lineweaver–Burk plot and see the effect of a competitive inhibitor (inorganic phosphate).",
      safety: [
        "Wear a lab coat, gloves and eye protection throughout.",
        "pNPP and its product p-nitrophenol are harmful if swallowed and irritate skin and eyes: avoid contact and wash hands after the practical.",
        "The alkaline assay buffer (around pH 10) is irritant: rinse any splash with plenty of water and tell the instructor.",
        "Enzyme preparations can cause sensitisation: avoid making aerosols and clean up spills promptly.",
        "Dispose of solutions and cuvettes as directed by your instructor.",
      ],
      materials: [
        "Alkaline assay buffer (e.g. glycine–NaOH, about pH 10, with magnesium chloride)",
        "pNPP stock solution (20 mM) in assay buffer",
        "Alkaline phosphatase solution, kept on ice",
        "Sodium phosphate solution for the inhibitor runs",
        "Micropipettes and tips",
        "Plastic cuvettes (1 cm path length)",
        "Spectrophotometer set to 405 nm, with a timer or kinetics mode",
        "Water bath or heating block at the assay temperature",
      ],
      steps: [
        { text: "Set the spectrophotometer to 405 nm and let the lamp warm up.", why: "p-Nitrophenolate absorbs strongly near 405 nm, while pNPP itself barely does, so A₄₀₅ follows product only." },
        { text: "Dilute the 20 mM pNPP stock in assay buffer to give final cuvette concentrations from about 0.1 to 5 mM (drill 2).", why: "Spanning concentrations well below and above Km gives points on both parts of the curve." },
        { text: "Warm the substrate solutions and the buffer to the assay temperature.", why: "Rate depends on temperature, so every cuvette must start at the same temperature." },
        { text: "Zero the instrument with buffer and substrate but no enzyme.", why: "This removes any absorbance from the reagents and any slow non-enzymatic breakdown of pNPP." },
        { text: "Start each reaction by adding the same small volume of enzyme, mix by gentle inversion and start timing at once.", why: "Adding enzyme last means the reaction starts at a known time in every cuvette." },
        { text: "Record A₄₀₅ every 30 seconds for 3 minutes, and use only the straight early part to find ΔA per minute.", why: "Michaelis–Menten kinetics describe the initial rate, before substrate is used up or product builds up." },
        { text: "Repeat the series with sodium phosphate added at a fixed concentration.", why: "Phosphate, a product of the reaction, competes with pNPP for the active site." },
        { text: "Convert each ΔA/min to a rate with A = εlc (ε ≈ 18,000 M⁻¹ cm⁻¹), then plot 1/v against 1/[S] for both series." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "One cuvette gives ΔA₄₀₅ = 0.090 per minute in a 1 cm cuvette. With ε = 18,000 M⁻¹ cm⁻¹, what is the rate in µM per minute?",
          answer: 5,
          tolerance: 0.1,
          unit: "µM/min",
          working: "Δc per minute = 0.090 / (18,000 × 1) = 5.0 × 10⁻⁶ M = 5.0 µM/min.",
        },
        {
          id: "d2",
          prompt: "How many µL of 20 mM pNPP stock do you need for a 1.0 mL reaction with a final pNPP concentration of 0.50 mM?",
          answer: 25,
          tolerance: 0.5,
          unit: "µL",
          working: "C1V1 = C2V2 → V1 = (0.50 mM × 1000 µL) / 20 mM = 25 µL of stock in a 1.0 mL reaction.",
        },
        {
          id: "d3",
          prompt: "Without inhibitor, your Lineweaver–Burk line is 1/v = 0.10 (1/[S]) + 0.125, with v in µM/min and [S] in mM. What is Vmax in µM/min?",
          answer: 8,
          tolerance: 0.1,
          unit: "µM/min",
          working: "The y-intercept is 1/Vmax = 0.125, so Vmax = 1 / 0.125 = 8.0 µM/min.",
        },
        {
          id: "d4",
          prompt: "From the same line, what is Km in mM?",
          answer: 0.8,
          tolerance: 0.02,
          unit: "mM",
          working: "The slope is Km/Vmax = 0.10, so Km = 0.10 × 8.0 = 0.80 mM. Check: x-intercept = −1/Km = −0.125/0.10 = −1.25 mM⁻¹.",
        },
        {
          id: "d5",
          prompt: "With 2.0 mM phosphate, Vmax is unchanged but the apparent Km is 2.4 mM. For competitive inhibition, apparent Km = Km(1 + [I]/Ki). What is Ki in mM?",
          answer: 1,
          tolerance: 0.02,
          unit: "mM",
          working: "2.4 / 0.80 = 3 = 1 + 2.0/Ki, so 2.0/Ki = 2 and Ki = 1.0 mM.",
        },
      ],
      resultsGuide:
        "Cuvettes should turn steadily yellow, faster at higher pNPP, and the rates should level off towards Vmax at the highest concentrations. The Lineweaver–Burk plot should be close to a straight line; the points at the lowest [S] carry the most error, so don't let one of them drag the fit. With phosphate, the line should be steeper but meet the uninhibited line on the y-axis (same Vmax, higher apparent Km), the signature of competitive inhibition. If rates fall off within the first minute, the enzyme is too concentrated: dilute it and repeat.",
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
    {
      id: "bio-case-dka",
      title: "Vomiting, abdominal pain and deep breathing",
      topic: "Buffers & pH",
      setting: "Emergency department. Educational simulation with a fictional patient.",
      presentation:
        "Jordan, 19, has type 1 diabetes. For two days they have had a stomach bug with vomiting, and stopped taking insulin because they 'weren't eating anything'. Today they have abdominal pain, are very thirsty, and their partner noticed they are breathing deeply and fast.",
      stages: [
        {
          title: "History",
          prompt: "Jordan is tired but answers questions. Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "When did you last take your insulin, and how much have you been taking during this illness?", good: true, feedback: "\"I haven't had any since yesterday morning. I thought I didn't need it if I wasn't eating.\"" },
            { text: "Have you been passing a lot of urine and feeling very thirsty?", good: true, feedback: "\"Yes, I've been up to the toilet all night and I can't drink enough.\"" },
            { text: "Have you checked your blood glucose or ketones at home?", good: true, feedback: "\"My meter just said 'HI' last night. I don't have ketone strips.\"" },
            { text: "Any fever, cough, burning when passing urine, or other sign of infection?", good: true, feedback: "\"I felt hot two days ago, and my housemate had the same stomach bug.\" Infection is a common trigger." },
            { text: "Which secondary school did you go to?", good: false, feedback: "Not relevant to an acutely unwell patient." },
            { text: "Do you prefer tea or coffee?", good: false, feedback: "Doesn't help explain the illness." },
          ],
          debrief:
            "Stopping insulin during illness is a classic trigger. Illness raises counter-regulatory hormones (cortisol, adrenaline, glucagon), so insulin is still needed even without food: this is why people with type 1 diabetes are taught 'sick day rules'.",
        },
        {
          title: "Examination",
          prompt: "What do you look for?",
          mode: "multi",
          options: [
            { text: "Breathing pattern and respiratory rate", good: true, feedback: "Deep, sighing breaths at 28/min (Kussmaul breathing), with a fruity, pear-drop smell on the breath." },
            { text: "Signs of dehydration: mucous membranes, skin turgor, capillary refill", good: true, feedback: "Dry mouth, reduced skin turgor, capillary refill 3 seconds." },
            { text: "Heart rate, blood pressure and conscious level", good: true, feedback: "HR 118 beats/min, BP 98/60 mmHg, alert but drowsy." },
            { text: "Abdominal examination", good: true, feedback: "Diffusely tender without guarding. Abdominal pain is common in DKA, but persistent focal signs need surgical review." },
            { text: "Detailed examination of the feet for sensation", good: false, feedback: "Important at annual diabetes reviews, not in this emergency." },
          ],
          debrief:
            "Kussmaul breathing is respiratory compensation: breathing off CO₂ raises the bicarbonate-to-CO₂ ratio and limits the fall in pH. The fruity smell is acetone, a ketone body. Fast heart rate and low blood pressure reflect fluid lost through osmotic diuresis and vomiting.",
        },
        {
          title: "Investigations",
          prompt: "Which tests do you do now?",
          mode: "multi",
          options: [
            { text: "Capillary blood glucose", good: true, feedback: "28 mmol/L (about 500 mg/dL): high." },
            { text: "Blood ketones (β-hydroxybutyrate)", good: true, feedback: "5.2 mmol/L: markedly raised (normal below 0.6)." },
            { text: "Venous blood gas", good: true, feedback: "pH 7.17, bicarbonate 7 mmol/L, pCO₂ 20 mmHg (2.7 kPa)." },
            { text: "Urea and electrolytes", good: true, feedback: "Na⁺ 134, Cl⁻ 98, K⁺ 5.6 mmol/L; urea and creatinine mildly raised." },
            { text: "HbA1c only, and wait for the result before treating", good: false, feedback: "HbA1c reflects the last three months and does not guide emergency treatment." },
          ],
          debrief:
            "DKA is diagnosed by the triad of raised glucose (or known diabetes), raised ketones and acidosis (low pH or low bicarbonate). Potassium can be normal or high at first even though total body potassium is low, because acidosis and lack of insulin shift potassium out of cells.",
        },
        {
          title: "Interpreting the gas",
          prompt: "What best describes the acid–base picture?",
          mode: "single",
          options: [
            {
              text: "Raised anion gap metabolic acidosis with respiratory compensation",
              good: true,
              feedback: "Correct: low pH and low bicarbonate (metabolic acidosis), low pCO₂ (compensation), and an anion gap of 134 − (98 + 7) = 29 mmol/L from unmeasured ketoacid anions.",
            },
            { text: "Respiratory acidosis", good: false, feedback: "Respiratory acidosis needs a high pCO₂; here pCO₂ is low." },
            { text: "Metabolic alkalosis from vomiting", good: false, feedback: "Vomiting can cause alkalosis, but pH and bicarbonate are both low here." },
            { text: "Normal anion gap acidosis from diarrhoea", good: false, feedback: "The anion gap is clearly raised, pointing to added acid (ketoacids), not lost bicarbonate." },
          ],
          debrief:
            "Check the numbers with the bicarbonate buffer equation: $pH = 6.1 + \\log_{10}(7 / (0.03 \\times 20)) = 6.1 + \\log_{10}(11.7) \\approx 7.17$. Without the fast breathing, pCO₂ would be near 40 mmHg and the pH would be much lower.",
        },
        {
          title: "Mechanism",
          prompt: "Why did Jordan become acidotic?",
          mode: "single",
          options: [
            {
              text: "Without insulin, lipolysis releases fatty acids that the liver turns into ketoacids; the extra H⁺ uses up bicarbonate",
              good: true,
              feedback: "Correct: insulin normally suppresses lipolysis and ketogenesis, and glucagon (now unopposed) promotes them.",
            },
            { text: "Too much insulin drove glucose into cells and made lactic acid", good: false, feedback: "There was no insulin; that is the problem." },
            { text: "Breathing fast caused the acidosis", good: false, feedback: "Fast breathing is the compensation, not the cause; it lowers CO₂ and raises pH." },
            { text: "High glucose is itself an acid", good: false, feedback: "Glucose isn't acidic; the acid comes from the ketone bodies acetoacetate and β-hydroxybutyrate." },
          ],
          debrief:
            "Acetoacetic and β-hydroxybutyric acids have pKa values around 3.6–4.7, so at blood pH they are almost fully dissociated and release H⁺, which is buffered by bicarbonate. As bicarbonate is consumed, the anion gap widens.",
        },
        {
          title: "Management principles",
          prompt: "What is the right overall approach (in hospital, under senior supervision and following the local DKA protocol)?",
          mode: "single",
          options: [
            {
              text: "Intravenous fluids, a fixed-rate intravenous insulin infusion per protocol, close monitoring and replacement of potassium, and regular checks of glucose, ketones and the blood gas",
              good: true,
              feedback: "Correct: fluids restore circulation, insulin switches off ketogenesis, and potassium is watched because insulin drives it back into cells.",
            },
            { text: "Give insulin only, and avoid fluids because the patient is already drinking a lot", good: false, feedback: "Patients in DKA are severely dehydrated; fluids are a cornerstone of treatment." },
            { text: "Give intravenous bicarbonate routinely to correct the pH", good: false, feedback: "Bicarbonate is not routine in DKA; treating the cause with fluids and insulin corrects the acidosis." },
            { text: "Stop all insulin until the patient is eating again", good: false, feedback: "Stopping insulin is what caused this; insulin is needed to switch off ketone production." },
          ],
          debrief:
            "Look for and treat the trigger (here a likely infection), involve the diabetes team, and before discharge go over sick day rules: never stop basal insulin, check glucose and ketones more often, and seek help early if ketones rise or vomiting continues.",
        },
      ],
      teachingPoints: [
        "DKA: high glucose (or known diabetes), raised ketones, and metabolic acidosis.",
        "Kussmaul breathing is respiratory compensation for the acidosis, explained by the bicarbonate buffer equation.",
        "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻); ketoacid anions raise it.",
        "Potassium can look normal at first despite total-body depletion; insulin treatment lowers it, so monitor closely.",
        "Never stop basal insulin during illness: teach sick day rules.",
      ],
    },
    {
      id: "bio-case-methanol",
      title: "Blurred vision after a party",
      topic: "Proteins & enzymes",
      setting: "Emergency department. Educational simulation with a fictional patient.",
      presentation:
        "Alex, 34, comes in the evening with headache, nausea, abdominal pain and blurred vision that started this afternoon. Last night they drank cheap, unlabelled spirits bought from a street seller at a party. A friend who drank the same bottle is also feeling unwell.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "What exactly did you drink, how much, and when?", good: true, feedback: "\"Clear spirit from a plastic bottle with no label, maybe four or five shots, until about midnight.\"" },
            { text: "Describe the change in your vision.", good: true, feedback: "\"Everything looks blurred and foggy, like looking through a snowstorm, and bright light hurts.\"" },
            { text: "Is anyone else who drank it unwell?", good: true, feedback: "\"My friend has a bad headache and keeps vomiting.\" Several people ill after the same drink suggests a contaminated batch." },
            { text: "Do you have any medical conditions or take any regular medicines?", good: true, feedback: "\"No, I'm usually well and take nothing regularly.\"" },
            { text: "What is your favourite type of music?", good: false, feedback: "Not relevant." },
          ],
          debrief:
            "Visual symptoms and a delay of 12 to 24 hours after drinking illicit spirits point strongly to methanol poisoning. The delay happens because methanol itself is not very toxic; harm comes as it is slowly metabolised.",
        },
        {
          title: "Examination",
          prompt: "What do you look for?",
          mode: "multi",
          options: [
            { text: "Visual acuity and pupil responses", good: true, feedback: "Acuity reduced in both eyes; pupils sluggish to light." },
            { text: "Fundoscopy", good: true, feedback: "The optic discs look swollen and hyperaemic." },
            { text: "Respiratory rate and breathing pattern", good: true, feedback: "Rate 26/min with deep breaths, suggesting compensation for a metabolic acidosis." },
            { text: "Conscious level and heart rate", good: true, feedback: "Alert but anxious; HR 104 beats/min." },
            { text: "Hearing test with a tuning fork", good: false, feedback: "Not helpful here and delays urgent tests." },
          ],
          debrief:
            "The optic nerve and retina are particularly vulnerable to formate, the toxic end product of methanol. Deep, fast breathing hints at a metabolic acidosis before any blood result is back.",
        },
        {
          title: "Investigations",
          prompt: "Which tests help most?",
          mode: "multi",
          options: [
            { text: "Venous blood gas with lactate", good: true, feedback: "pH 7.24, bicarbonate 10 mmol/L, pCO₂ 24 mmHg; lactate only mildly raised." },
            { text: "Urea, electrolytes and glucose, to calculate the anion gap", good: true, feedback: "Na⁺ 138, Cl⁻ 100, glucose 6, urea 5 mmol/L. Anion gap 138 − (100 + 10) = 28 mmol/L: raised." },
            { text: "Measured serum osmolality, to calculate the osmolar gap", good: true, feedback: "Measured 330 mOsm/kg; calculated 2 × 138 + 6 + 5 = 287; osmolar gap 43: raised, suggesting an unmeasured small molecule such as a toxic alcohol." },
            { text: "Serum methanol level (via a reference laboratory)", good: true, feedback: "Sent; it will take time, so treatment shouldn't wait for it." },
            { text: "Blood ketones", good: true, feedback: "Only slightly raised, so ketoacidosis doesn't explain this acidosis." },
            { text: "Throat swab", good: false, feedback: "Does not help with a suspected poisoning." },
          ],
          debrief:
            "A raised anion gap acidosis with a raised osmolar gap, not explained by lactate or ketones, is the pattern of toxic alcohol poisoning. Early on the osmolar gap is high from methanol itself; as it is metabolised to formic acid, the osmolar gap falls and the anion gap rises.",
        },
        {
          title: "Mechanism",
          prompt: "Why does methanol cause acidosis and blindness?",
          mode: "single",
          options: [
            {
              text: "Alcohol dehydrogenase oxidises methanol to formaldehyde, then aldehyde dehydrogenase makes formic acid; formate inhibits cytochrome c oxidase in mitochondria",
              good: true,
              feedback: "Correct: formic acid causes the acidosis, and formate blocks oxidative phosphorylation, damaging the optic nerve.",
            },
            { text: "Methanol denatures haemoglobin so that red cells can't carry oxygen", good: false, feedback: "That isn't the mechanism; the damage comes from methanol's metabolites." },
            { text: "Methanol is converted to lactate by lactate dehydrogenase", good: false, feedback: "Lactate is only mildly raised; formate is the main acid." },
            { text: "Methanol is harmless; the symptoms are a hangover", good: false, feedback: "A hangover doesn't cause visual loss, a raised osmolar gap or a severe acidosis." },
          ],
          debrief:
            "The parent alcohol is relatively harmless, so the poisoning can be stopped if its first metabolic step is blocked. Ethylene glycol (antifreeze) works the same way, but its metabolites (glycolate and oxalate) damage the kidneys.",
        },
        {
          title: "Treatment principle",
          prompt: "Which enzyme principle underlies the specific antidote?",
          mode: "single",
          options: [
            {
              text: "Fomepizole (or ethanol if it isn't available) is a competitive inhibitor of alcohol dehydrogenase, so methanol is metabolised much more slowly and can be removed unchanged",
              good: true,
              feedback: "Correct: competitive inhibition raises the apparent Km, so at the same methanol concentration far less formic acid is made.",
            },
            { text: "The antidote irreversibly destroys methanol in the blood", good: false, feedback: "No antidote destroys methanol; blocking its metabolism buys time for removal." },
            { text: "The antidote speeds up alcohol dehydrogenase so methanol is cleared faster", good: false, feedback: "Faster metabolism would make more formic acid and worsen the poisoning." },
            { text: "The antidote is a non-competitive inhibitor of aldehyde dehydrogenase", good: false, feedback: "The target is alcohol dehydrogenase, the first step, and the inhibition is competitive." },
          ],
          debrief:
            "Ethanol works because it is a preferred substrate for alcohol dehydrogenase (a much lower Km than methanol), so it competes for the active site. Fomepizole is easier to use because it doesn't cause intoxication.",
        },
        {
          title: "Management principles",
          prompt: "What is the right overall approach (under senior supervision, with advice from the poisons service and following local protocol)?",
          mode: "single",
          options: [
            {
              text: "Block alcohol dehydrogenase, correct the acidosis, arrange haemodialysis to remove methanol and formate, give folate-based therapy to help clear formate, and alert public health about the other drinkers",
              good: true,
              feedback: "Correct: stop toxin being made, remove what is there, support the patient, and protect others who drank the same batch.",
            },
            { text: "Give fluids and send Alex home once they feel better", good: false, feedback: "Visual loss and acidosis can become permanent or fatal; specific treatment is needed." },
            { text: "Wait for the serum methanol level before starting any treatment", good: false, feedback: "The level takes hours to come back; treatment starts on clinical suspicion and the gaps." },
            { text: "Induce vomiting", good: false, feedback: "Methanol is absorbed quickly, and the drink was taken many hours ago; vomiting doesn't help and adds risk." },
          ],
          debrief:
            "Early treatment can preserve sight. The friend also needs urgent assessment, and the source should be reported so other people can be warned.",
        },
      ],
      teachingPoints: [
        "Methanol and ethylene glycol are harmful through the metabolites that alcohol dehydrogenase starts to make.",
        "Raised osmolar gap plus raised anion gap metabolic acidosis suggests a toxic alcohol.",
        "Fomepizole and ethanol are competitive inhibitors of alcohol dehydrogenase: they raise its apparent Km for methanol.",
        "Haemodialysis removes both methanol and formate; treatment shouldn't wait for a methanol level.",
        "Several people ill after the same drink means a contaminated batch: alert public health.",
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
    {
      id: "bio-skill-ph-meter",
      title: "Calibrating and using a pH meter",
      purpose: "Every buffer you make is only as good as the pH meter that checks it.",
      items: [
        { text: "Checks the electrode for damage and that it has been kept wet in storage solution" },
        { text: "Rinses the electrode with deionised water and blots it dry with lint-free tissue, without rubbing the bulb", critical: true },
        { text: "Calibrates with at least two fresh standard buffers that bracket the expected pH, starting with pH 7.00", critical: true },
        { text: "Checks the calibration slope is within the range the manufacturer accepts, and recalibrates or reports the electrode if not", critical: true },
        { text: "Uses temperature compensation or calibrates at the same temperature as the samples" },
        { text: "Immerses the bulb and junction fully in the sample, clear of the stirrer bar", critical: true },
        { text: "Stirs gently and waits for a stable reading before recording it" },
        { text: "Rinses and blots the electrode between every sample", critical: true },
        { text: "Records pH, temperature and sample identity" },
        { text: "Returns the electrode to storage solution, not deionised water, at the end" },
      ],
    },
    {
      id: "bio-skill-capillary-glucose",
      title: "Capillary blood glucose measurement (OSCE station)",
      purpose: "A fingerstick glucose is the first test in any confused or unwell person with diabetes, and must be accurate and safe.",
      items: [
        { text: "Performs hand hygiene, introduces self, confirms the patient's identity and gains consent", critical: true },
        { text: "Checks the meter has passed its quality control and the test strips are in date and stored correctly", critical: true },
        { text: "Asks the patient to wash and dry their hands, since sugar or a wet alcohol wipe on the skin can give a false reading", critical: true },
        { text: "Puts on gloves and chooses the side of a fingertip, avoiding the pad and sites that are sore or bruised" },
        { text: "Uses a single-use safety lancet and puts it straight into a sharps bin", critical: true },
        { text: "Lets a drop form without squeezing hard, then applies it to the strip as the manufacturer instructs" },
        { text: "Applies pressure with gauze until bleeding stops" },
        { text: "Reads the result, tells the patient, and records value, time and units in the notes" },
        { text: "Acts on an abnormal result according to local protocol and escalates it promptly", critical: true },
        { text: "Disposes of waste correctly, removes gloves and performs hand hygiene" },
      ],
    },
  ],
};
