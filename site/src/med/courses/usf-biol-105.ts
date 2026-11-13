import type { Course } from "../types";

/**
 * Original study content aligned with the University of San Francisco's first-year biology course
 * BIOL 105 & 105L (Molecules of Life). Only the code and title come from USF; the topic list is the
 * standard one for such a course, not a copy of any syllabus.
 */
export const usfBiol105: Course = {
  id: "usf-biol-105",
  code: "BIOL 105",
  title: "Molecules of Life",
  description:
    "Study companion aligned with the University of San Francisco's BIOL 105 & 105L (Molecules of Life): water and pH, the four macromolecules, membranes and transport, cell structure, enzymes and ATP, respiration and photosynthesis, and the central dogma, with a pre-health pearl on every concept. Topics are typical for the course, so check your own syllabus. Not affiliated with or endorsed by USF.",
  topics: ["Chemistry of life", "Macromolecules", "Cells & membranes", "Energy & metabolism", "Central dogma"],

  concepts: [
    {
      slug: "b105-water-ph",
      model: "water",
      title: "Water, pH and buffers",
      topic: "Chemistry of life",
      summary:
        "Water is polar and hydrogen-bonds, which makes it a great solvent with a high heat capacity; pH is the negative log of [H⁺], and buffers such as bicarbonate hold blood pH near 7.4.",
      formulas: ["pH = -\\log_{10}[H^+]", "[H^+][OH^-] = 1.0 \\times 10^{-14} \\text{ at } 25\\,°C", "CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-"],
      body: `Oxygen is more electronegative than hydrogen, so the O–H bonds in water are **polar covalent**: oxygen carries a partial negative charge (δ⁻) and each hydrogen a partial positive charge (δ⁺). Because the molecule is bent (about 104.5°), the charges don't cancel and water is a polar molecule.

Neighbouring water molecules attract through **hydrogen bonds** (δ⁺ H of one to the δ⁻ O of another). Hydrogen bonds are much weaker than covalent bonds, but there are a lot of them, and they explain water's special properties:
- **Cohesion and surface tension**: water molecules cling together
- **High specific heat**: a lot of energy is needed to change water's temperature, so bodies and oceans resist temperature swings
- **High heat of vaporisation**: evaporating water carries a lot of heat away (sweating)
- **Ice floats**: hydrogen bonds lock ice into an open lattice that is less dense than liquid water
- **Solvent of life**: water surrounds ions and polar molecules (they are **hydrophilic**); nonpolar molecules are pushed together (the **hydrophobic effect**), which drives membrane and protein folding

**Acids, bases and pH**

Water ionises very slightly: $H_2O \\rightleftharpoons H^+ + OH^-$. In pure water at 25 °C, $[H^+] = [OH^-] = 1.0 \\times 10^{-7}$ M. We describe acidity with

$$ pH = -\\log_{10}[H^+] $$

- An **acid** donates H⁺ (raises [H⁺], lowers pH); a **base** accepts H⁺ or releases OH⁻ (raises pH)
- The scale is logarithmic: each pH unit is a **tenfold** change in [H⁺]
- pH 7 is neutral at 25 °C; below 7 is acidic, above 7 basic

**Buffers** are a weak acid plus its conjugate base. They soak up added H⁺ or OH⁻ and so resist pH change. The main buffer in blood is the carbonic acid–bicarbonate system:

$$ CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^- $$

The lungs control the CO₂ side and the kidneys the HCO₃⁻ side, which keeps arterial pH in the narrow range of about 7.35–7.45.`,
      pearls: [
        "Arterial blood pH below 7.35 is acidaemia and above 7.45 alkalaemia; a drop from 7.4 to 7.1 roughly doubles [H⁺], which can impair heart function.",
        "Breathing fast (as in a panic attack) blows off CO₂, pulls the bicarbonate equation to the left and raises blood pH: respiratory alkalosis, with tingling fingers and lips.",
        "Fever and heavy exercise are cooled mostly by sweat evaporation; in very humid heat sweat can't evaporate well, which raises the risk of heat illness.",
      ],
    },
    {
      slug: "b105-carbs-lipids",
      model: "glucose",
      title: "Carbohydrates and lipids",
      topic: "Macromolecules",
      summary:
        "Monosaccharides such as glucose link by glycosidic bonds into disaccharides and polysaccharides; lipids are hydrophobic molecules including triglycerides, phospholipids and steroids.",
      formulas: ["C_6H_{12}O_6", "\\text{monomer} + \\text{monomer} \\xrightarrow{\\text{dehydration}} \\text{dimer} + H_2O"],
      body: `Three of the four big classes of biological molecules are **polymers** built from monomers. Cells link monomers by **dehydration synthesis** (a water molecule is removed for every bond made) and break polymers apart by **hydrolysis** (water is added back). Digestion is hydrolysis.

**Carbohydrates** have the rough formula $(CH_2O)_n$.
- **Monosaccharides**: glucose, fructose and galactose all have the formula $C_6H_{12}O_6$ but differ in arrangement (they are isomers). In water, glucose is mostly a ring.
- **Disaccharides** form when two monosaccharides join by a **glycosidic bond**: sucrose = glucose + fructose, lactose = glucose + galactose, maltose = glucose + glucose
- **Starch** (plants) and **glycogen** (animals, in liver and muscle) store energy using α-glycosidic links; glycogen is the most branched (these are **polysaccharides**)
- **Cellulose** (plant cell walls) uses β-1,4 links, which human enzymes can't break; it passes through us as dietary fibre
- **Chitin** builds fungal cell walls and insect exoskeletons

**Lipids** are grouped by being hydrophobic, not by being polymers.
- **Triglycerides** (fats and oils): glycerol joined by ester bonds to three fatty acids. They store more than twice the energy per gram of carbohydrate.
- **Saturated** fatty acids have no C=C double bonds, pack tightly and are solid at room temperature (butter)
- **Unsaturated** fatty acids have one or more cis C=C double bonds that kink the chain, so they stay liquid (olive oil)
- **Trans fats**, mostly from industrial partial hydrogenation, have straight chains and are linked to heart disease
- **Phospholipids**: glycerol, two fatty acid tails and a phosphate-containing head. They are **amphipathic** (a hydrophilic head and hydrophobic tails), so in water they form bilayers.
- **Steroids**: four fused carbon rings. **Cholesterol** sits in animal membranes and is the starting material for steroid hormones (cortisol, oestrogen, testosterone) and vitamin D.`,
      pearls: [
        "In lactose intolerance, too little lactase reaches the small intestine, so undigested lactose is fermented by colonic bacteria, causing gas, bloating and diarrhoea.",
        "HbA1c measures glucose stuck non-enzymatically onto haemoglobin; because red cells live about 120 days, it reflects average blood glucose over the past 2–3 months.",
        "In familial hypercholesterolaemia, faulty LDL receptors leave LDL cholesterol high in the blood from birth, causing early heart attacks.",
        "In glycogen storage diseases, an enzyme that builds or breaks down glycogen is missing; some types cause fasting hypoglycaemia because the liver can't release glucose.",
      ],
    },
    {
      slug: "b105-proteins-nucleic-acids",
      model: "alpha-helix",
      title: "Proteins and nucleic acids",
      topic: "Macromolecules",
      summary:
        "Proteins are chains of 20 amino acids joined by peptide bonds and folded into four levels of structure; nucleic acids are chains of nucleotides joined by phosphodiester bonds.",
      body: `**Amino acids** share a central carbon bonded to an amino group, a carboxyl group, a hydrogen and a variable **R group** (side chain). The 20 standard R groups are nonpolar, polar, acidic (negatively charged) or basic (positively charged), and their chemistry decides how a protein folds.

A **peptide bond** joins the carboxyl group of one amino acid to the amino group of the next (dehydration synthesis). A chain has an **N-terminus** and a **C-terminus**.

**Four levels of protein structure**
1. **Primary**: the amino acid sequence, set by the gene
2. **Secondary**: α-helices and β-pleated sheets held by hydrogen bonds between backbone C=O and N–H groups
3. **Tertiary**: the full 3D shape of one chain, held by R-group interactions (hydrophobic packing, hydrogen and ionic bonds, and covalent disulphide bridges between cysteines)
4. **Quaternary**: two or more chains (subunits) working together, e.g. haemoglobin has four

**Chaperone** proteins help many proteins fold. **Denaturation** by heat, extreme pH or chemicals unfolds a protein and stops it working, but leaves the peptide bonds (primary structure) intact.

**Nucleic acids** store and express genetic information. Each **nucleotide** is a five-carbon sugar, a phosphate group and a nitrogenous base:
- **Purines** (two rings): adenine (A) and guanine (G)
- **Pyrimidines** (one ring): cytosine (C), thymine (T, DNA only) and uracil (U, RNA only)

Nucleotides link by **phosphodiester bonds** between the 3′ carbon of one sugar and the 5′ phosphate of the next, giving a sugar–phosphate backbone with a 5′ end and a 3′ end.

**DNA vs RNA**
- Sugar: deoxyribose in DNA, ribose in RNA
- Bases: A, T, G, C in DNA; A, U, G, C in RNA
- Strands: DNA is usually double-stranded, RNA usually single-stranded

ATP is itself a nucleotide (adenine + ribose + three phosphates), which links this topic to energy.`,
      pearls: [
        "A single amino acid change in β-globin (glutamate to valine) gives sickle cell disease: a small change in primary structure alters how the whole protein behaves.",
        "The commonest cystic fibrosis variant (F508del) removes one phenylalanine; the CFTR protein misfolds and is destroyed before reaching the cell membrane.",
        "Prion diseases such as Creutzfeldt–Jakob disease are caused by a misfolded protein that converts normal copies into the misfolded shape.",
        "Very high fevers are dangerous partly because many human proteins start to unfold above about 41–42 °C.",
      ],
    },
    {
      slug: "b105-cell-structure",
      model: "cell",
      title: "Cell structure: prokaryotes, eukaryotes and organelles",
      topic: "Cells & membranes",
      summary:
        "Prokaryotes lack a nucleus and membrane-bound organelles; eukaryotic cells divide work among the nucleus, endomembrane system, mitochondria, chloroplasts (plants) and cytoskeleton.",
      body: `Every cell has a plasma membrane, cytoplasm, DNA and ribosomes. Beyond that, cells come in two plans.

**Prokaryotes** (bacteria and archaea): no nucleus (DNA sits in a nucleoid region), no membrane-bound organelles, **70S ribosomes**, usually a cell wall, and typically 1–10 µm across.

**Eukaryotes** (animals, plants, fungi, protists): DNA in a nucleus, membrane-bound organelles, **80S ribosomes** in the cytoplasm, and typically 10–100 µm across.

**Organelles of a eukaryotic cell**
- **Nucleus**: holds the chromosomes, surrounded by a double-membrane nuclear envelope with pores; the **nucleolus** makes ribosomal subunits
- **Ribosomes**: make proteins; free ribosomes make cytosolic proteins, ER-bound ribosomes make proteins for membranes, lysosomes or secretion
- **Rough ER**: studded with ribosomes; folds and modifies new membrane and secreted proteins
- **Smooth ER**: makes lipids, detoxifies drugs (especially in liver) and stores Ca²⁺ (in muscle)
- **Golgi apparatus**: modifies, sorts and packages proteins into vesicles
- **Lysosomes**: acidic sacs of hydrolytic enzymes that digest worn-out parts and engulfed material
- **Mitochondria**: site of the citric acid cycle and oxidative phosphorylation; double membrane, own circular DNA and bacteria-like ribosomes
- **Chloroplasts** (plants and algae): site of photosynthesis; also have their own DNA
- **Cytoskeleton**: microfilaments (actin), intermediate filaments and microtubules (tubulin) give shape, move organelles and build cilia, flagella and the mitotic spindle
- Plants also have a cellulose **cell wall** and a large **central vacuole**

The **endomembrane pathway** for a secreted protein runs: rough ER → transport vesicle → Golgi → secretory vesicle → plasma membrane (exocytosis).

The **endosymbiotic theory** says mitochondria and chloroplasts descend from bacteria engulfed by an ancestral cell; their double membranes, circular DNA and bacteria-like ribosomes support this.

Cells stay small because volume grows faster than surface area: a small cell has a large surface-to-volume ratio for exchanging nutrients and waste.`,
      pearls: [
        "Many antibiotics (for example tetracyclines and macrolides) target the bacterial 70S ribosome, which is why they can stop bacteria while sparing our 80S ribosomes.",
        "In lysosomal storage diseases such as Tay–Sachs disease, one missing lysosomal enzyme lets its substrate build up inside cells, here in neurons.",
        "Mitochondria come almost entirely from the egg, so mitochondrial DNA diseases pass from a mother to all her children.",
        "Faulty dynein arms in cilia (primary ciliary dyskinesia) cause repeated chest and sinus infections and reduced fertility; about half of patients have their organs mirror-reversed.",
      ],
    },
    {
      slug: "b105-membrane-transport",
      model: "bilayer",
      title: "Membranes and transport",
      topic: "Cells & membranes",
      summary:
        "The fluid mosaic membrane lets small nonpolar molecules diffuse freely; ions and polar molecules need channels or carriers, and moving them uphill needs energy (active transport).",
      formulas: ["\\text{osmolarity} = \\text{molarity} \\times \\text{particles per formula unit}"],
      body: `The **fluid mosaic model**: a phospholipid bilayer with hydrophilic heads facing the water on each side and hydrophobic tails inside, studded with proteins that drift laterally. **Cholesterol** buffers fluidity (less fluid when warm, less rigid when cold). Glycoproteins and glycolipids on the outer surface act as identity tags (e.g. ABO blood groups).

The membrane is **selectively permeable**:
- Small nonpolar molecules (O₂, CO₂, steroid hormones) cross the bilayer directly
- Small polar molecules such as water cross slowly (faster through **aquaporins**)
- Ions and large polar molecules (glucose) need a transport protein

**Passive transport** (down a concentration gradient, no ATP)
- **Simple diffusion** through the bilayer
- **Facilitated diffusion** through **channels** (e.g. K⁺ channels) or **carriers** (e.g. GLUT glucose transporters)
- **Osmosis**: water moves toward the side with more dissolved particles (higher osmolarity)

**Tonicity** describes what a solution does to a cell placed in it:
- **Isotonic**: no net water movement (normal saline, 0.9% NaCl)
- **Hypotonic**: water enters; red cells swell and can burst (lyse)
- **Hypertonic**: water leaves; red cells shrink (crenate)

**Active transport** (against a gradient, needs energy)
- **Primary**: ATP powers the pump directly. The **Na⁺/K⁺-ATPase** moves 3 Na⁺ out and 2 K⁺ in per ATP, keeping Na⁺ high outside and K⁺ high inside.
- **Secondary**: a pump-made gradient powers another transporter. **SGLT1** in the gut uses Na⁺ rushing back in to pull glucose in with it (co-transport).

**Bulk transport** uses vesicles: **endocytosis** (phagocytosis, pinocytosis, receptor-mediated endocytosis, as for LDL) brings material in; **exocytosis** releases hormones and neurotransmitters.`,
      pearls: [
        "Oral rehydration solution works because SGLT1 still absorbs Na⁺ and glucose together during cholera-type diarrhoea, and water follows by osmosis.",
        "Digoxin inhibits the Na⁺/K⁺-ATPase in heart muscle; the rise in cell Na⁺ leads to more Ca²⁺ inside and a stronger contraction.",
        "Pure water must never be given into a vein: it is hypotonic and would make red cells swell and burst.",
        "In cystic fibrosis the CFTR chloride channel is faulty, so less Cl⁻ and water reach airway surfaces and mucus becomes thick and sticky.",
      ],
    },
    {
      slug: "b105-enzymes-atp",
      model: "enzyme",
      title: "Energy, ATP and enzymes",
      topic: "Energy & metabolism",
      summary:
        "Cells couple energy-releasing reactions to energy-requiring ones through ATP; enzymes speed reactions by lowering activation energy without changing ΔG.",
      formulas: ["\\Delta G = \\Delta H - T\\Delta S", "ATP + H_2O \\rightarrow ADP + P_i \\quad \\Delta G°' \\approx -30.5 \\text{ kJ/mol}"],
      body: `**Thermodynamics in one paragraph.** Energy can be changed from one form to another but not created or destroyed (first law), and every real energy transfer increases the entropy (disorder) of the universe (second law). Whether a reaction can happen on its own is given by the change in free energy:

$$ \\Delta G = \\Delta H - T\\Delta S $$

- $\\Delta G < 0$: **exergonic**, spontaneous (releases free energy), e.g. breaking down glucose
- $\\Delta G > 0$: **endergonic**, needs an energy input, e.g. building proteins
- "Spontaneous" says nothing about speed

**ATP** (adenosine triphosphate) is the cell's energy currency. Hydrolysing its last phosphate releases energy ($\\Delta G°' \\approx -30.5$ kJ/mol, and more under cell conditions). Cells **couple** this to endergonic work, usually by transferring the phosphate to another molecule (phosphorylation): pumping ions, contracting muscle, building polymers. ADP is turned back into ATP by respiration.

**Metabolism** is all of a cell's reactions: **catabolic** pathways break molecules down and release energy; **anabolic** pathways build molecules and use it.

**Enzymes** are biological catalysts, almost always proteins (some are RNA, called ribozymes).
- They lower the **activation energy** ($E_a$), so a reaction reaches equilibrium faster
- They don't change $\\Delta G$ or the position of equilibrium, and they are not used up
- The substrate binds the **active site**; binding slightly changes the enzyme's shape (**induced fit**)
- Many need **cofactors** (metal ions such as Zn²⁺, Mg²⁺) or **coenzymes** (organic, often made from vitamins: NAD⁺ from niacin, FAD from riboflavin)

**What affects activity**
- **Temperature**: rate rises with temperature up to an optimum (about 37 °C for most human enzymes), then falls steeply as the enzyme denatures
- **pH**: each enzyme has an optimum (pepsin in the stomach about pH 2, most cytosolic enzymes about 7)
- **Substrate concentration**: rate rises, then levels off when all active sites are busy (saturation)
- **Inhibitors**: a **competitive** inhibitor occupies the active site (can be outcompeted by more substrate); a **non-competitive** inhibitor binds elsewhere and changes the enzyme's shape; **irreversible** inhibitors bind covalently
- **Feedback inhibition**: the end product of a pathway inhibits an early enzyme, often at an **allosteric** site`,
      pearls: [
        "Aspirin irreversibly acetylates the cyclooxygenase enzyme in platelets; platelets have no nucleus to make new enzyme, so the effect lasts for the platelet's lifetime.",
        "Statins competitively inhibit HMG-CoA reductase, the rate-limiting enzyme of cholesterol synthesis.",
        "Blood levels of enzymes that leak from damaged cells are used as markers: troponin (a heart muscle protein, not an enzyme) has largely replaced creatine kinase for heart attacks, while ALT and AST point to liver injury.",
        "Niacin deficiency (pellagra) starves cells of NAD⁺, causing dermatitis, diarrhoea and dementia.",
      ],
    },
    {
      slug: "b105-respiration-photosynthesis",
      title: "Cellular respiration and photosynthesis: the big picture",
      topic: "Energy & metabolism",
      summary:
        "Respiration oxidises glucose to CO₂ in glycolysis, the citric acid cycle and the electron transport chain, making about 30–32 ATP; photosynthesis uses light to make glucose from CO₂ and water.",
      formulas: [
        "C_6H_{12}O_6 + 6\\,O_2 \\rightarrow 6\\,CO_2 + 6\\,H_2O \\quad \\Delta G°' \\approx -2870 \\text{ kJ/mol}",
        "6\\,CO_2 + 6\\,H_2O \\xrightarrow{\\text{light}} C_6H_{12}O_6 + 6\\,O_2",
      ],
      body: `**Cellular respiration** releases the energy in glucose a little at a time, storing it in ATP:

$$ C_6H_{12}O_6 + 6\\,O_2 \\rightarrow 6\\,CO_2 + 6\\,H_2O $$

Glucose is **oxidised** (loses electrons) and O₂ is **reduced** (gains them). The electrons travel on the carriers **NADH** and **FADH₂**.

The four stages, with products per glucose:
1. **Glycolysis** (cytosol): 2 pyruvate, net 2 ATP, 2 NADH
2. **Pyruvate oxidation** (mitochondrial matrix): 2 acetyl-CoA, 2 CO₂, 2 NADH
3. **Citric acid (Krebs) cycle** (mitochondrial matrix): 4 CO₂, 2 ATP (or GTP), 6 NADH, 2 FADH₂
4. **Oxidative phosphorylation** (inner mitochondrial membrane): about 26–28 ATP, plus water

**Oxidative phosphorylation**: NADH and FADH₂ hand electrons to the **electron transport chain**. As electrons pass along it, proteins pump H⁺ from the matrix into the intermembrane space. **O₂ is the final electron acceptor**, forming water. The H⁺ gradient flows back through **ATP synthase**, which makes ATP (**chemiosmosis**). Total yield is about **30–32 ATP per glucose**, most of it from this step.

**Without oxygen**, the chain stops, NADH piles up and NAD⁺ runs out. Cells regenerate NAD⁺ by **fermentation** so glycolysis can continue, for just 2 ATP per glucose:
- Human muscle and red cells: pyruvate → **lactate**
- Yeast: pyruvate → ethanol + CO₂

**Photosynthesis** in chloroplasts runs the carbon the other way:

$$ 6\\,CO_2 + 6\\,H_2O \\xrightarrow{\\text{light}} C_6H_{12}O_6 + 6\\,O_2 $$

1. **Light reactions** (thylakoid membranes): chlorophyll absorbs light, water is split (releasing the O₂ we breathe), and the energy makes **ATP and NADPH**. Chloroplasts use chemiosmosis too.
2. **Calvin cycle** (stroma): ATP and NADPH power the fixing of CO₂ into sugar; the enzyme **rubisco** does the first fixation step.

Plants do both: photosynthesis makes the sugar, and their mitochondria respire it.`,
      pearls: [
        "Cyanide blocks the last complex of the electron transport chain (cytochrome c oxidase), so cells can't use oxygen even though blood is full of it; lactate rises as cells fall back on fermentation.",
        "A high blood lactate in a very sick patient suggests tissues aren't getting enough oxygen (for example in shock).",
        "Brown fat has an uncoupling protein (thermogenin) that lets H⁺ leak back without making ATP, releasing the energy as heat to keep newborns warm.",
        "Red blood cells have no mitochondria and rely entirely on glycolysis, so they can't burn fat or ketones.",
      ],
    },
    {
      slug: "b105-central-dogma",
      model: "dna",
      title: "DNA replication, transcription and translation",
      topic: "Central dogma",
      summary:
        "DNA is copied semi-conservatively, transcribed into RNA, and mRNA codons are translated into protein; mutations in DNA change the protein through this chain.",
      body: `**The central dogma**: information flows DNA → RNA → protein. (Retroviruses such as HIV add a reverse step, RNA → DNA, using reverse transcriptase.)

**DNA structure**
- Two **antiparallel** strands (one runs 5′→3′, the other 3′→5′) twisted into a double helix
- Bases pair by hydrogen bonds: **A–T** (2 hydrogen bonds) and **G–C** (3)
- **Chargaff's rule** follows: in double-stranded DNA, %A = %T and %G = %C

**Replication** is **semi-conservative**: each new double helix keeps one old strand and one new strand (shown by Meselson and Stahl).
1. **Helicase** unwinds the helix at the replication fork; **topoisomerase** relieves the twisting ahead of it
2. **Primase** lays down a short RNA primer
3. **DNA polymerase** adds nucleotides only to a 3′ end, so new DNA grows **5′→3′**
4. The **leading strand** is made continuously; the **lagging strand** is made in short **Okazaki fragments**
5. Primers are replaced with DNA and **DNA ligase** seals the gaps
6. Polymerase **proofreads**, and repair enzymes fix many remaining errors

Linear chromosomes shorten a little with each round; **telomerase** extends the repetitive **telomeres** at their ends in stem cells, germ cells and most cancers.

**Transcription** (in the nucleus for eukaryotes)
- **RNA polymerase** binds a **promoter** (often with a TATA box), reads the **template strand** 3′→5′ and builds RNA 5′→3′
- The mRNA has the same sequence as the **coding strand**, with U in place of T
- Eukaryotic pre-mRNA is processed: a **5′ cap**, a **poly-A tail**, and **splicing** removes introns and joins exons (alternative splicing lets one gene make several proteins)

**Translation** (at ribosomes in the cytoplasm)
- mRNA is read in **codons** of three bases, 5′→3′
- Each **tRNA** carries one amino acid and has an **anticodon** that pairs with the codon
- **AUG** is the start codon (methionine); **UAA, UAG, UGA** are stop codons
- The code is **redundant** (64 codons, 61 for 20 amino acids) and almost universal
- Ribosome sites: **A** (aminoacyl tRNA arrives), **P** (holds the growing chain), **E** (empty tRNA exits)

**Mutations** (changes in DNA)
- **Silent**: new codon, same amino acid
- **Missense**: one amino acid changed (sickle cell)
- **Nonsense**: a codon becomes a stop codon, giving a short protein
- **Frameshift**: an insertion or deletion not a multiple of three shifts every codon after it (many Duchenne muscular dystrophy variants)`,
      pearls: [
        "Sickle cell disease: the β-globin codon GAG (glutamate) becomes GUG (valine), a single-base missense mutation.",
        "Many drugs target this pathway in microbes: rifampicin blocks bacterial RNA polymerase, fluoroquinolones block bacterial DNA gyrase (a topoisomerase), and nucleoside analogues such as zidovudine stop HIV reverse transcriptase.",
        "Some β-thalassaemia variants damage splice sites, so β-globin mRNA is spliced wrongly and little working haemoglobin is made.",
        "mRNA vaccines deliver an mRNA that the body's own ribosomes translate into a viral protein; the mRNA is broken down within days and never enters the nucleus.",
      ],
    },
  ],

  lectures: [
    {
      id: "b105-l1",
      week: 2,
      title: "The chemistry of life: water, pH and macromolecules",
      topic: "Chemistry of life",
      summary: "Why water's polarity matters, how the pH scale works, and how cells build carbohydrates, lipids, proteins and nucleic acids from monomers.",
      notes: `- Water is polar and hydrogen-bonds: cohesion, high specific heat, high heat of vaporisation, solvent for ions and polar molecules
- pH = −log[H⁺]; each pH unit is a tenfold change in [H⁺]; blood is kept at 7.35–7.45 by the bicarbonate buffer
- Polymers form by dehydration synthesis and break by hydrolysis
- Carbohydrates: glycosidic bonds; starch and glycogen store energy, cellulose is structural
- Lipids: triglycerides (energy), phospholipids (membranes, amphipathic), steroids (cholesterol, hormones)
- Proteins: peptide bonds, four levels of structure; nucleic acids: phosphodiester bonds, 5′ and 3′ ends`,
      insights: [
        { type: "exam_tip", text: "Because pH is a log scale, a 1-unit change is 10× in [H⁺] and a 0.3-unit change is about 2×. Many questions just test this.", conceptSlug: "b105-water-ph" },
        { type: "intuition", text: "Dehydration synthesis and hydrolysis are mirror images: build by taking water out, break by putting it back in.", conceptSlug: "b105-carbs-lipids" },
        { type: "clinical_link", text: "Sickle cell disease shows that changing one amino acid in the primary structure can change a protein's whole behaviour.", conceptSlug: "b105-proteins-nucleic-acids" },
        { type: "exam_tip", text: "Know the bond for each macromolecule: glycosidic (carbohydrates), ester (triglycerides), peptide (proteins), phosphodiester (nucleic acids).", conceptSlug: "b105-carbs-lipids" },
      ],
    },
    {
      id: "b105-l2",
      week: 6,
      title: "Cells, membranes and the energy of life",
      topic: "Cells & membranes",
      summary: "Organelles and the endomembrane system, how molecules cross membranes, and how ATP, enzymes and respiration keep cells running.",
      notes: `- Prokaryotes: no nucleus, 70S ribosomes; eukaryotes: nucleus, organelles, 80S ribosomes
- Secretory pathway: rough ER → Golgi → vesicle → plasma membrane
- Small nonpolar molecules diffuse through the bilayer; ions and glucose need channels or carriers
- Na⁺/K⁺-ATPase: 3 Na⁺ out, 2 K⁺ in per ATP (primary active); SGLT1: Na⁺–glucose co-transport (secondary active)
- Enzymes lower activation energy; they don't change ΔG or equilibrium
- Respiration: glycolysis (cytosol) → pyruvate oxidation and Krebs cycle (matrix) → ETC and ATP synthase (inner membrane); O₂ is the final electron acceptor`,
      insights: [
        { type: "clinical_link", text: "Oral rehydration solution contains both salt and glucose because SGLT1 absorbs them together and water follows.", conceptSlug: "b105-membrane-transport" },
        { type: "exam_tip", text: "If a question asks what an enzyme changes, the answer is the activation energy (and therefore the rate), never ΔG or the equilibrium constant.", conceptSlug: "b105-enzymes-atp" },
        { type: "intuition", text: "The electron transport chain is a dam: it pumps H⁺ uphill into the intermembrane space, and ATP synthase is the turbine the water runs back through.", conceptSlug: "b105-respiration-photosynthesis" },
        { type: "clinical_link", text: "Antibiotics such as tetracyclines exploit the difference between bacterial 70S and human 80S ribosomes.", conceptSlug: "b105-cell-structure" },
      ],
    },
    {
      id: "b105-l3",
      week: 11,
      title: "From DNA to protein",
      topic: "Central dogma",
      summary: "DNA structure and replication, transcription and RNA processing, translation and the genetic code, and how mutations change proteins.",
      notes: `- DNA: antiparallel strands, A–T (2 H-bonds), G–C (3 H-bonds); Chargaff: %A = %T, %G = %C
- Replication is semi-conservative; polymerase builds 5′→3′; leading strand continuous, lagging strand in Okazaki fragments
- Transcription: RNA polymerase reads the template strand; mRNA matches the coding strand with U for T
- Eukaryotic mRNA gets a 5′ cap, poly-A tail, and introns spliced out
- Translation: codons read 5′→3′; AUG start; UAA, UAG, UGA stop
- Mutations: silent, missense, nonsense, frameshift`,
      insights: [
        { type: "exam_tip", text: "To get mRNA from a template strand, write the complement and swap T for U; to get it from the coding strand, just swap T for U.", conceptSlug: "b105-central-dogma" },
        { type: "intuition", text: "A frameshift is like deleting one letter from THE CAT ATE THE RAT: every 'word' after the deletion becomes nonsense.", conceptSlug: "b105-central-dogma" },
        { type: "clinical_link", text: "Antivirals and antibiotics often work by blocking a copying enzyme the microbe needs but we don't, such as reverse transcriptase or bacterial RNA polymerase.", conceptSlug: "b105-central-dogma" },
      ],
    },
  ],

  questions: [
    {
      id: "b105-q1",
      type: "numeric",
      topic: "Chemistry of life",
      difficulty: 1,
      prompt: "Normal arterial blood has [H⁺] of about 4.0 × 10⁻⁸ M. What is its pH (to 2 decimal places)?",
      answer: 7.4,
      tolerance: 0.01,
      unit: "",
      hints: ["$pH = -\\log_{10}[H^+]$", "$-\\log(4.0 \\times 10^{-8}) = 8 - \\log 4.0$, and $\\log 4.0 \\approx 0.60$"],
      explanation: "$pH = -\\log_{10}(4.0 \\times 10^{-8}) = 8 - 0.60 = 7.40$, the middle of the normal range 7.35–7.45.",
      concepts: ["b105-water-ph"],
    },
    {
      id: "b105-q2",
      type: "numeric",
      topic: "Chemistry of life",
      difficulty: 2,
      prompt: "A patient's blood pH falls from 7.4 to 7.1. By what factor has [H⁺] increased (to 1 decimal place)?",
      answer: 2.0,
      tolerance: 0.05,
      unit: "×",
      hints: ["The pH changed by 0.3 units.", "The factor is $10^{\\Delta pH}$."],
      explanation: "$[H^+]$ rises by $10^{7.4 - 7.1} = 10^{0.3} \\approx 2.0$, so a fall of only 0.3 pH units doubles the hydrogen ion concentration.",
      concepts: ["b105-water-ph"],
    },
    {
      id: "b105-q3",
      type: "mcq",
      topic: "Macromolecules",
      difficulty: 1,
      prompt: "A student gets bloating and diarrhoea after drinking milk. Which reaction is their small intestine failing to carry out efficiently?",
      options: [
        "Hydrolysis of the glycosidic bond in lactose to give glucose and galactose",
        "Dehydration synthesis joining glucose and galactose into lactose",
        "Hydrolysis of the peptide bonds in milk protein",
        "Hydrolysis of the β-1,4 glycosidic bonds in cellulose",
      ],
      answer: 0,
      hints: ["Lactose is a disaccharide.", "Digestion breaks polymers by adding water."],
      explanation:
        "Lactase hydrolyses lactose into glucose and galactose, which can be absorbed. Without enough lactase, lactose reaches the colon and is fermented. Dehydration synthesis builds bonds rather than breaking them, and no human enzyme digests cellulose.",
      concepts: ["b105-carbs-lipids"],
    },
    {
      id: "b105-q4",
      type: "mcq",
      topic: "Macromolecules",
      difficulty: 2,
      prompt: "An enzyme is heated to 70 °C and loses its activity permanently. Which bonds are still intact?",
      options: [
        "Hydrogen bonds holding its α-helices",
        "Hydrophobic interactions in its core",
        "Peptide bonds between its amino acids",
        "Ionic bonds between its side chains",
      ],
      answer: 2,
      hints: ["Denaturation unfolds a protein.", "Which level of structure survives unfolding?"],
      explanation:
        "Denaturation disrupts the weak interactions of secondary, tertiary and quaternary structure, but the covalent peptide bonds of the primary structure stay intact. Breaking peptide bonds needs hydrolysis, usually by a protease.",
      concepts: ["b105-proteins-nucleic-acids"],
    },
    {
      id: "b105-q5",
      type: "mcq",
      topic: "Cells & membranes",
      difficulty: 2,
      prompt: "Which statement about the Na⁺/K⁺-ATPase is correct?",
      options: [
        "It moves 3 Na⁺ out of and 2 K⁺ into the cell per ATP hydrolysed, against their gradients",
        "It moves 2 Na⁺ out of and 3 K⁺ into the cell, by facilitated diffusion",
        "It moves Na⁺ and glucose into the cell together, using the Na⁺ gradient",
        "It is a channel that lets Na⁺ and K⁺ flow down their gradients",
      ],
      answer: 0,
      hints: ["The name includes 'ATPase'.", "Inside cells K⁺ is high and Na⁺ is low."],
      explanation:
        "The Na⁺/K⁺-ATPase is primary active transport: each ATP moves 3 Na⁺ out and 2 K⁺ in, both uphill, keeping the gradients that power nerve signals and secondary transport. Na⁺–glucose co-transport is SGLT1, a secondary active transporter.",
      concepts: ["b105-membrane-transport"],
    },
    {
      id: "b105-q6",
      type: "numeric",
      topic: "Cells & membranes",
      difficulty: 3,
      prompt: "Normal saline is 0.9% (w/v) NaCl, i.e. 0.9 g per 100 mL. Taking NaCl's molar mass as 58.44 g/mol and assuming it dissociates fully, what is its osmolarity in mOsm/L (to the nearest whole number)?",
      answer: 308,
      tolerance: 3,
      unit: "mOsm/L",
      hints: ["0.9 g per 100 mL is 9 g per litre.", "Each NaCl gives two particles: Na⁺ and Cl⁻."],
      explanation:
        "$9 \\text{ g/L} \\div 58.44 \\text{ g/mol} = 0.154$ M, and $0.154 \\times 2 = 0.308$ Osm/L $= 308$ mOsm/L. That is close to plasma (about 285–295 mOsm/kg), which is why normal saline is treated as roughly isotonic.",
      concepts: ["b105-membrane-transport"],
    },
    {
      id: "b105-q7",
      type: "mcq",
      topic: "Energy & metabolism",
      difficulty: 1,
      prompt: "How does an enzyme speed up a reaction?",
      options: [
        "It makes ΔG more negative",
        "It lowers the activation energy",
        "It shifts the equilibrium toward the products",
        "It supplies the energy the reaction needs from ATP",
      ],
      answer: 1,
      hints: ["Enzymes are catalysts.", "Catalysts affect the rate, not where the reaction ends up."],
      explanation:
        "Enzymes lower the activation energy, so more molecules can react per second. ΔG and the equilibrium position are set by the reactants and products and are unchanged; the enzyme just helps the reaction reach equilibrium faster.",
      concepts: ["b105-enzymes-atp"],
    },
    {
      id: "b105-q8",
      type: "mcq",
      topic: "Energy & metabolism",
      difficulty: 3,
      prompt: "A person is exposed to cyanide, which blocks cytochrome c oxidase (the last complex of the electron transport chain). What happens in their cells?",
      options: [
        "Glycolysis stops at PFK-1, so no pyruvate is made",
        "Haemoglobin can no longer carry oxygen, so blood oxygen falls",
        "Electrons can't pass to O₂, the H⁺ gradient collapses and ATP synthase output falls; cells turn to fermentation and lactate rises",
        "The inner membrane becomes leaky to H⁺, so energy is released as heat instead of ATP",
      ],
      answer: 2,
      hints: ["What is the final electron acceptor?", "If the chain stops, what happens to the H⁺ pumping?"],
      explanation:
        "With the last complex blocked, electrons can't reach O₂, so the chain stops pumping H⁺ and oxidative phosphorylation fails. NADH piles up, and cells make ATP by glycolysis only, regenerating NAD⁺ by making lactate. Blood oxygen stays high because tissues can't use it. A leaky membrane describes an uncoupler, and impaired oxygen carrying describes carbon monoxide.",
      concepts: ["b105-respiration-photosynthesis"],
    },
    {
      id: "b105-q9",
      type: "numeric",
      topic: "Central dogma",
      difficulty: 1,
      prompt: "A sample of double-stranded DNA is 20% adenine. What percentage of its bases are guanine?",
      answer: 30,
      tolerance: 0,
      unit: "%",
      hints: ["%A = %T in double-stranded DNA.", "A + T + G + C = 100%, and %G = %C."],
      explanation: "A = 20% so T = 20%, leaving 60% for G + C. Since G = C, guanine is 30%.",
      concepts: ["b105-central-dogma", "b105-proteins-nucleic-acids"],
    },
    {
      id: "b105-q10",
      type: "numeric",
      topic: "Central dogma",
      difficulty: 2,
      prompt: "The coding region of an mRNA, from the AUG start codon up to and including the stop codon, is 900 nucleotides long. How many amino acids are in the protein made from it (before any processing)?",
      answer: 299,
      tolerance: 0,
      unit: "amino acids",
      hints: ["Each codon is three nucleotides.", "The stop codon doesn't code for an amino acid."],
      explanation: "$900 / 3 = 300$ codons. The last is a stop codon with no amino acid, so the protein has 299 amino acids (starting with methionine).",
      concepts: ["b105-central-dogma"],
    },
    {
      id: "b105-q11",
      type: "mcq",
      topic: "Central dogma",
      difficulty: 2,
      prompt: "In sickle cell disease, one codon in the β-globin mRNA changes from GAG to GUG. What kind of mutation is this?",
      options: [
        "Silent: both codons code for glutamate",
        "Missense: glutamate is replaced by valine",
        "Nonsense: GUG is a stop codon",
        "Frameshift: the reading frame shifts after the change",
      ],
      answer: 1,
      hints: ["GAG codes for glutamate; GUG codes for valine.", "One base was substituted, none inserted or deleted."],
      explanation:
        "A single base substitution changes glutamate (GAG) to valine (GUG): a missense mutation. The hydrophobic valine makes deoxygenated haemoglobin stick together into fibres that deform red cells. No base is added or lost, so the frame doesn't shift, and GUG is not a stop codon.",
      concepts: ["b105-central-dogma", "b105-proteins-nucleic-acids"],
    },
    {
      id: "b105-q12",
      type: "mcq",
      topic: "Chemistry of life",
      difficulty: 1,
      prompt: "Why does sweating cool the body so well?",
      options: [
        "Water has a high heat of vaporisation, so each gram of sweat that evaporates carries a lot of heat away from the skin",
        "Water has a low specific heat, so sweat cools down quickly and chills the skin",
        "Sweat is slightly acidic and neutralises the heat made by metabolism",
        "Sweat reflects heat radiation away from the skin",
      ],
      answer: 0,
      hints: ["Think about what has to happen to hydrogen bonds for water to evaporate.", "The cooling comes from the change of state, not from the sweat itself being cold."],
      explanation:
        "To evaporate, water molecules must break free of their hydrogen bonds, which takes a lot of energy. That energy comes from the skin as heat, so evaporation cools the body. Water's specific heat is high, not low, and acidity has nothing to do with heat. In very humid air sweat evaporates poorly, which is why humid heat is more dangerous.",
      concepts: ["b105-water-ph"],
    },
    {
      id: "b105-q13",
      type: "mcq",
      topic: "Chemistry of life",
      difficulty: 3,
      prompt: "During a panic attack a student breathes very fast for several minutes and her fingers start to tingle. What is happening to her blood?",
      options: [
        "CO₂ falls, the bicarbonate equilibrium shifts to the left, [H⁺] falls and pH rises above 7.45",
        "CO₂ rises, the bicarbonate equilibrium shifts to the right, [H⁺] rises and pH falls below 7.35",
        "CO₂ falls, the bicarbonate equilibrium shifts to the right, [H⁺] rises and pH falls",
        "Nothing changes, because blood buffers completely prevent any change in pH",
      ],
      answer: 0,
      hints: ["$CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-$", "Breathing fast removes a reactant on the left. Which way does the equilibrium move to replace it?"],
      explanation:
        "Fast breathing blows off CO₂. To replace it, H⁺ and HCO₃⁻ combine to form carbonic acid, which breaks down to CO₂ and water, so the equilibrium shifts left and H⁺ is used up. Lower [H⁺] means a higher pH: respiratory alkalosis. Buffers reduce pH changes but cannot stop them entirely.",
      concepts: ["b105-water-ph"],
    },
    {
      id: "b105-q14",
      type: "numeric",
      topic: "Macromolecules",
      difficulty: 2,
      prompt: "A ribosome builds a single unbranched polypeptide of 150 amino acids. How many water molecules are released as the peptide bonds form?",
      answer: 149,
      tolerance: 0,
      unit: "molecules",
      hints: ["Each peptide bond is made by dehydration synthesis, releasing one water.", "A chain of n amino acids has n − 1 bonds between them."],
      explanation:
        "A linear chain of 150 amino acids has 149 peptide bonds, and each bond releases one water molecule, so 149 water molecules are released. Hydrolysing the chain completely would use 149 water molecules.",
      concepts: ["b105-proteins-nucleic-acids", "b105-carbs-lipids"],
    },
    {
      id: "b105-q15",
      type: "mcq",
      topic: "Macromolecules",
      difficulty: 3,
      prompt: "In haemoglobin S, a glutamate on the outer surface of β-globin is replaced by valine. Why does this single change make deoxygenated haemoglobin molecules stick together?",
      options: [
        "A charged, hydrophilic side chain is replaced by a nonpolar one, leaving a hydrophobic patch that binds to a hydrophobic pocket on neighbouring haemoglobin molecules",
        "Valine forms disulphide bridges with cysteines on neighbouring haemoglobin molecules",
        "The substitution breaks the peptide bonds of β-globin, so the chain falls apart and the fragments clump",
        "Valine is positively charged, so it binds negative charges on other haemoglobin molecules",
      ],
      answer: 0,
      hints: ["Glutamate is acidic (negatively charged); valine is nonpolar.", "Where do nonpolar side chains 'want' to be in water?"],
      explanation:
        "Glutamate's charged side chain is happy facing water. Valine's nonpolar side chain is not, and in the deoxygenated shape it fits a hydrophobic pocket on the next haemoglobin molecule, so the molecules line up into long fibres (the hydrophobic effect at work). Only cysteine forms disulphide bridges, valine carries no charge, and a substitution doesn't break peptide bonds.",
      concepts: ["b105-proteins-nucleic-acids"],
    },
    {
      id: "b105-q16",
      type: "mcq",
      topic: "Macromolecules",
      difficulty: 1,
      prompt: "Olive oil is liquid at room temperature, but butter is solid. What best explains the difference?",
      options: [
        "Olive oil's fatty acids are mostly unsaturated, with cis double bonds that kink the chains so they can't pack tightly",
        "Olive oil's fatty acids are mostly saturated, so their straight chains slide past each other",
        "Butter's fatty acids are joined to glycerol by peptide bonds instead of ester bonds",
        "Olive oil molecules contain a phosphate head that dissolves in water",
      ],
      answer: 0,
      hints: ["Saturated means no C=C double bonds.", "Straight chains pack closely; bent chains don't."],
      explanation:
        "Saturated fatty acids (common in butter) have straight chains that pack tightly, so the fat is solid. The cis double bonds of unsaturated fatty acids (common in olive oil) put kinks in the chains, so they pack loosely and stay liquid. Both are triglycerides with ester bonds; phosphate heads belong to phospholipids.",
      concepts: ["b105-carbs-lipids"],
    },
    {
      id: "b105-q17",
      type: "mcq",
      topic: "Cells & membranes",
      difficulty: 1,
      prompt: "A sample of red blood cells is placed in pure distilled water. What happens?",
      options: [
        "Water enters by osmosis, the cells swell and many burst (lyse)",
        "Water leaves by osmosis and the cells shrink (crenate)",
        "Nothing happens, because water is isotonic with cytoplasm",
        "The cells pump water out with the Na⁺/K⁺-ATPase and keep their shape",
      ],
      answer: 0,
      hints: ["Which side has more dissolved particles, the cytoplasm or pure water?", "Water moves toward the higher osmolarity."],
      explanation:
        "Pure water is hypotonic to the cells' cytoplasm, so water moves in by osmosis. Red cells have no cell wall, so they swell and burst. In a hypertonic solution they would shrink instead. This is why fluids given into a vein must be close to isotonic.",
      concepts: ["b105-membrane-transport"],
    },
    {
      id: "b105-q18",
      type: "numeric",
      topic: "Cells & membranes",
      difficulty: 2,
      prompt: "Model a cell as a cube 10 µm on each side. What is its surface-area-to-volume ratio, in µm⁻¹?",
      answer: 0.6,
      tolerance: 0.01,
      unit: "µm⁻¹",
      hints: ["A cube has 6 faces, each of area side².", "Volume is side³; divide surface area by volume."],
      explanation:
        "Surface area $= 6 \\times 10^2 = 600$ µm² and volume $= 10^3 = 1000$ µm³, so the ratio is $600 / 1000 = 0.6$ µm⁻¹. A 20 µm cube has a ratio of only 0.3 µm⁻¹: doubling the side halves the ratio, which is why cells stay small or fold their membranes.",
      concepts: ["b105-cell-structure"],
    },
    {
      id: "b105-q19",
      type: "mcq",
      topic: "Cells & membranes",
      difficulty: 2,
      prompt: "Insulin is a protein secreted by pancreatic β-cells. Which route does a newly made insulin molecule take to leave the cell?",
      options: [
        "Ribosome on the rough ER → ER lumen → transport vesicle → Golgi → secretory vesicle → exocytosis at the plasma membrane",
        "Free cytosolic ribosome → nucleus → nuclear pore → plasma membrane",
        "Smooth ER → lysosome → plasma membrane",
        "Golgi → rough ER → mitochondrion → plasma membrane",
      ],
      answer: 0,
      hints: ["Secreted proteins are made by ribosomes bound to an organelle.", "The Golgi sorts and packages proteins before they leave."],
      explanation:
        "Proteins for secretion are made by ribosomes on the rough ER and threaded into its lumen, where they fold. Vesicles carry them to the Golgi for modification and sorting, and secretory vesicles release them by exocytosis. Free ribosomes make proteins that stay in the cytosol, and lysosomes digest material rather than export it.",
      concepts: ["b105-cell-structure"],
    },
    {
      id: "b105-q20",
      type: "mcq",
      topic: "Energy & metabolism",
      difficulty: 2,
      prompt: "A drug slows an enzyme reaction. When the substrate concentration is raised a lot, the reaction rate returns to nearly its normal maximum. What kind of inhibitor is the drug most likely to be?",
      options: [
        "A competitive inhibitor that binds the active site",
        "A non-competitive inhibitor that binds an allosteric site and changes the enzyme's shape",
        "An irreversible inhibitor that binds the enzyme covalently",
        "A cofactor that the enzyme needs to work",
      ],
      answer: 0,
      hints: ["Which kind of inhibitor competes with the substrate for the same place?", "A cofactor helps an enzyme; it doesn't inhibit it."],
      explanation:
        "A competitive inhibitor and the substrate compete for the active site, so flooding the enzyme with substrate outcompetes the inhibitor and the maximum rate is restored. A non-competitive inhibitor changes the enzyme's shape wherever the substrate is, and an irreversible inhibitor takes enzyme out of action for good, so extra substrate can't rescue either. Statins are a clinical example of competitive inhibition.",
      concepts: ["b105-enzymes-atp"],
    },
    {
      id: "b105-q21",
      type: "numeric",
      topic: "Energy & metabolism",
      difficulty: 3,
      prompt: "Complete oxidation of glucose has ΔG°′ ≈ −2870 kJ/mol. If a cell makes 32 ATP per glucose and each ATP stores 30.5 kJ/mol, what percentage of the free energy is captured in ATP (to the nearest whole number)?",
      answer: 34,
      tolerance: 1,
      unit: "%",
      hints: ["Energy captured = number of ATP × energy per ATP.", "Divide by the 2870 kJ/mol released and multiply by 100."],
      explanation:
        "$32 \\times 30.5 = 976$ kJ/mol captured, and $976 / 2870 \\times 100 \\approx 34\\%$. The rest is released as heat, which helps keep us warm. Under real cell conditions ATP hydrolysis releases more than 30.5 kJ/mol, so the true efficiency is higher.",
      concepts: ["b105-respiration-photosynthesis", "b105-enzymes-atp"],
    },
    {
      id: "b105-q22",
      type: "mcq",
      topic: "Central dogma",
      difficulty: 2,
      prompt: "A stretch of the DNA template strand reads 3′-TACGGATTT-5′. What mRNA is transcribed from it?",
      options: ["5′-AUGCCUAAA-3′", "5′-ATGCCTAAA-3′", "5′-UACGGAUUU-3′", "5′-AAAUCCGUA-3′"],
      answer: 0,
      hints: ["The mRNA is complementary and antiparallel to the template strand.", "RNA uses U in place of T."],
      explanation:
        "Pairing each template base (T→A, A→U, C→G, G→C) and writing the new strand 5′→3′ gives 5′-AUGCCUAAA-3′, which starts with the AUG start codon and codes Met–Pro–Lys. 5′-ATGCCTAAA-3′ is the coding strand of DNA (it contains T), and 5′-AAAUCCGUA-3′ is the right bases in the wrong direction.",
      concepts: ["b105-central-dogma"],
    },
    {
      id: "b105-q23",
      type: "mcq",
      topic: "Central dogma",
      difficulty: 1,
      prompt: "Why is the lagging strand copied in short Okazaki fragments during DNA replication?",
      options: [
        "DNA polymerase can only add nucleotides to a 3′ end, and the two strands are antiparallel, so one new strand must be made in pieces away from the fork",
        "The lagging strand is made of RNA, which can only be made in short pieces",
        "Helicase cuts the lagging strand into short fragments to relieve twisting",
        "Okazaki fragments are made only when DNA polymerase makes a mistake and has to restart",
      ],
      answer: 0,
      hints: ["In which direction does DNA polymerase build new DNA?", "The template strands run in opposite directions."],
      explanation:
        "New DNA grows only 5′→3′. On one template that direction follows the replication fork (leading strand, continuous); on the other it points away from the fork, so polymerase makes short fragments, each started by a primer, which ligase later joins. Primers are RNA but the fragments are DNA, and topoisomerase, not helicase, relieves twisting.",
      concepts: ["b105-central-dogma"],
    },
  ],

  labs: [
    {
      id: "b105-lab-dilution",
      title: "Serial dilutions and spectrophotometry of a blue dye",
      topic: "Chemistry of life",
      objective:
        "Make a two-fold serial dilution of a blue dye stock with a micropipette, measure each dilution's absorbance, build a standard curve to test Beer's law, and use it to find the concentration of an unknown.",
      safety: [
        "Wear a lab coat, gloves and eye protection; food dyes stain skin and clothing.",
        "Never pipette by mouth; use a micropipette or pipette pump.",
        "Handle cuvettes by the frosted or ridged sides, and report broken glass rather than picking it up by hand.",
        "Keep liquids away from the spectrophotometer's electronics and wipe spills straight away.",
        "Dispose of dye solutions and tips as your instructor directs.",
      ],
      materials: [
        "Blue dye stock, 10 µM",
        "Distilled water",
        "Unknown dye solution",
        "P1000 and P200 micropipettes with tips",
        "Seven labelled test tubes or 1.5 mL tubes and a rack",
        "Plastic cuvettes (1 cm path length)",
        "Spectrophotometer set to 630 nm",
        "Graph paper or spreadsheet software",
      ],
      steps: [
        { text: "Switch on the spectrophotometer, let it warm up, and set the wavelength to 630 nm.", why: "The dye absorbs most strongly near 630 nm, so readings are most sensitive there; a warm lamp gives stable readings." },
        { text: "Label tubes 1–6 and a blank. Pipette 1000 µL of the 10 µM stock into tube 1, and 500 µL of distilled water into tubes 2–6.", why: "Pre-filling the diluent tubes keeps every step the same." },
        { text: "Transfer 500 µL from tube 1 into tube 2 and mix by pipetting up and down gently several times.", why: "Equal volumes of sample and water make a 1:2 (two-fold) dilution." },
        { text: "With a fresh tip each time, transfer 500 µL from tube 2 to tube 3, mix, and continue to tube 6.", why: "A fresh tip stops carry-over of the more concentrated solution, which would push every later tube too high." },
        { text: "Zero (blank) the spectrophotometer with a cuvette of distilled water.", why: "The blank removes absorbance from the cuvette and water, so readings reflect only the dye." },
        { text: "Starting with the most dilute tube, fill a cuvette about three-quarters full, wipe the clear faces, and record A₆₃₀ for each tube and for the unknown.", why: "Going from dilute to concentrated means any leftover drop in the cuvette has little effect." },
        { text: "Plot absorbance (y) against concentration (x). Fit a straight line through the points that fall on a line and note where the curve flattens.", why: "Beer's law holds only over a linear range; very high absorbances are unreliable because little light reaches the detector." },
        { text: "Use the line's equation to find the unknown's concentration. If it reads above your highest reliable standard, dilute it, re-measure and multiply by the dilution factor." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "Your 10 µM stock is diluted two-fold three times in a row (tube 1 → tube 4). What is the dye concentration in tube 4, in µM?",
          answer: 1.25,
          tolerance: 0.01,
          unit: "µM",
          working: "Each step halves the concentration: 10 → 5 → 2.5 → 1.25 µM. Overall dilution factor = 2³ = 8, and 10 / 8 = 1.25 µM.",
        },
        {
          id: "d2",
          prompt: "In another protocol, a sample goes through four serial 1:10 dilutions (100 µL into 900 µL each time). What is the total dilution factor?",
          answer: 10000,
          tolerance: 0,
          unit: "×",
          working: "Each step is 100 µL in a total of 1000 µL, a factor of 10. Four steps: 10 × 10 × 10 × 10 = 10⁴ = 10,000.",
        },
        {
          id: "d3",
          prompt: "How many µL of stock do you need to make 1.0 mL of a 1:5 dilution?",
          answer: 200,
          tolerance: 0,
          unit: "µL",
          working: "A 1:5 dilution is 1 part stock in 5 parts total: 1000 µL / 5 = 200 µL stock plus 800 µL water. (C₁V₁ = C₂V₂ gives the same answer.)",
        },
        {
          id: "d4",
          prompt: "Your lab manual gives the dye's molar absorption coefficient at 630 nm as 1.30 × 10⁵ M⁻¹ cm⁻¹. The unknown reads A₆₃₀ = 0.52 in a 1 cm cuvette. What is its concentration in µM?",
          answer: 4,
          tolerance: 0.05,
          unit: "µM",
          working: "c = A / (εl) = 0.52 / (1.30 × 10⁵ × 1) = 4.0 × 10⁻⁶ M = 4.0 µM.",
        },
        {
          id: "d5",
          prompt: "A tube reads A = 0.30. What percentage of the light is transmitted?",
          answer: 50.1,
          tolerance: 0.5,
          unit: "%",
          working: "A = −log₁₀ T, so T = 10⁻⁰·³⁰ = 0.501, i.e. about 50% transmittance.",
        },
      ],
      resultsGuide:
        "The tubes should get visibly paler with each step, and absorbance should roughly halve from one tube to the next. Points within the linear range should sit close to a straight line through (or near) the origin; a single point well off the line usually means a pipetting slip or a carried-over tip. The most concentrated tubes may bend below the line because so little light reaches the detector; leave them out of the fit. Report the unknown only if it falls within your reliable standards, and include any dilution factor.",
    },
    {
      id: "b105-lab-osmosis",
      title: "Osmosis in potato tissue: finding the isotonic sucrose concentration",
      topic: "Cells & membranes",
      objective:
        "Soak equal potato cores in a series of sucrose solutions, measure the percentage change in mass of each, and plot the results to estimate the sucrose concentration that is isotonic with the potato cells.",
      safety: [
        "Wear a lab coat and eye protection.",
        "Cut with the cork borer and scalpel onto a white tile, pushing away from your body and fingers; carry the scalpel point down and never leave it loose on the bench.",
        "Wipe up sucrose spills straight away; they make floors and benches sticky and slippery.",
        "Nothing used in the lab is eaten, including the potato.",
        "Keep the balance pan dry and clean, and report broken glass rather than picking it up by hand.",
      ],
      materials: [
        "1.0 M sucrose stock solution",
        "Distilled water",
        "Two large potatoes",
        "Cork borer (about 8 mm) and scalpel",
        "White tile and ruler",
        "Six labelled boiling tubes or small beakers with covers, and a rack",
        "10 mL and 25 mL measuring cylinders",
        "Balance reading to 0.01 g",
        "Paper towels, forceps and a timer",
      ],
      steps: [
        {
          text: "Make 20 mL each of 0, 0.2, 0.4, 0.6, 0.8 and 1.0 M sucrose by mixing the 1.0 M stock with distilled water, and label each tube.",
          why: "C₁V₁ = C₂V₂ gives the stock volume for each tube; a range on both sides of the expected isotonic point lets you find where the line crosses zero.",
        },
        {
          text: "Bore six cores from the same potato, trim off any skin, and cut them all to the same length (about 3 cm) on the tile.",
          why: "Skin is waterproof, and cores of the same size and source have the same surface area and starting water content, so the only thing that differs is the solution.",
        },
        {
          text: "Blot each core gently and identically on a paper towel, weigh it to 0.01 g, and record its starting mass against its tube label.",
          why: "Surface water adds mass that isn't inside the cells; blotting the same way each time keeps that error small and equal.",
        },
        {
          text: "Put one core in each tube, make sure it is fully covered, cover the tubes and leave them for the same time (at least 60 minutes, or overnight if your instructor prefers).",
          why: "Water needs time to move in or out until it approaches equilibrium; covering stops evaporation changing the concentrations.",
        },
        {
          text: "Remove each core with forceps, blot it exactly as before, and reweigh it. Also note whether it feels firm or floppy.",
          why: "Firm cores have gained water and are turgid; floppy cores have lost water.",
        },
        {
          text: "Calculate the percentage change in mass for each core: (final − initial) ÷ initial × 100.",
          why: "Percentage change corrects for small differences in starting mass between cores.",
        },
        {
          text: "Plot percentage change (y) against sucrose concentration (x), join or fit the points, and read off where the line crosses zero change.",
          why: "At zero change there is no net water movement, so that sucrose concentration is isotonic with the potato cells.",
        },
        { text: "Pool the class data if possible and compare your estimate with the class mean." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "How many mL of 1.0 M sucrose stock do you need to make 20 mL of 0.4 M sucrose?",
          answer: 8,
          tolerance: 0.05,
          unit: "mL",
          working: "C₁V₁ = C₂V₂: 1.0 M × V₁ = 0.4 M × 20 mL, so V₁ = 8.0 mL of stock made up to 20 mL with 12 mL of water.",
        },
        {
          id: "d2",
          prompt: "Sucrose (C₁₂H₂₂O₁₁) has a molar mass of 342.3 g/mol. What mass is needed to make 100 mL of the 1.0 M stock, in grams?",
          answer: 34.23,
          tolerance: 0.05,
          unit: "g",
          working: "Moles needed = 1.0 mol/L × 0.100 L = 0.100 mol. Mass = 0.100 mol × 342.3 g/mol = 34.23 g, dissolved and made up to 100 mL.",
        },
        {
          id: "d3",
          prompt: "A core weighs 2.50 g before and 2.80 g after soaking in distilled water. What is its percentage change in mass?",
          answer: 12,
          tolerance: 0.1,
          unit: "%",
          working: "(2.80 − 2.50) ÷ 2.50 × 100 = 0.30 ÷ 2.50 × 100 = +12%. Water entered because distilled water is hypotonic to the cells.",
        },
        {
          id: "d4",
          prompt: "A core weighs 2.40 g before and 2.13 g after soaking in 0.6 M sucrose. What is its percentage change in mass? (Give a negative number for a loss.)",
          answer: -11.25,
          tolerance: 0.1,
          unit: "%",
          working: "(2.13 − 2.40) ÷ 2.40 × 100 = −0.27 ÷ 2.40 × 100 = −11.25%. The solution is hypertonic, so water left the cells.",
        },
        {
          id: "d5",
          prompt: "The core in 0.2 M sucrose changed by +3.2% and the core in 0.4 M by −2.8%. Assuming a straight line between them, at what sucrose concentration is the change zero, in M?",
          answer: 0.307,
          tolerance: 0.005,
          unit: "M",
          working: "Across 0.2 M the change falls by 3.2 − (−2.8) = 6.0 percentage points. Zero is 3.2/6.0 of the way along: 0.2 + 0.2 × (3.2 ÷ 6.0) = 0.2 + 0.107 = 0.307 M.",
        },
      ],
      resultsGuide:
        "Cores in water and dilute sucrose should gain mass and feel firm; cores in strong sucrose should lose mass and feel floppy. The percentage change should fall steadily as concentration rises, crossing zero somewhere around 0.2–0.4 M for most potatoes (varieties and storage differ). A curve that flattens at high concentrations is normal, because cells can only lose so much water. A single point far off the trend usually means uneven blotting, a core of different size, or a mislabelled tube. Sucrose doesn't dissociate, so the isotonic sucrose molarity also estimates the cells' osmolarity.",
    },
    {
      id: "b105-lab-catalase",
      title: "Catalase activity and substrate concentration (floating disc assay)",
      topic: "Energy & metabolism",
      objective:
        "Measure how fast catalase from yeast breaks down hydrogen peroxide at several substrate concentrations, by timing how long enzyme-soaked paper discs take to float up on the oxygen they release, and relate the results to active-site saturation.",
      safety: [
        "Wear eye protection throughout: hydrogen peroxide, even at 3%, irritates eyes and skin. Rinse any splash with plenty of water and tell your instructor.",
        "Wear gloves and a lab coat; peroxide can bleach clothing.",
        "Never seal a container of hydrogen peroxide with enzyme in it, because the oxygen released builds up pressure.",
        "Wipe up spills with plenty of water, and dispose of solutions as your instructor directs.",
      ],
      materials: [
        "3% (w/v) hydrogen peroxide",
        "Distilled water",
        "Yeast suspension (the catalase source), freshly made and stirred",
        "Filter paper discs of equal size (from a hole punch)",
        "Forceps",
        "Six small clear cups or beakers, labelled",
        "10 mL and 25 mL measuring cylinders or graduated pipettes",
        "Ruler, timer and paper towels",
        "A boiled, cooled portion of the yeast suspension for the control",
      ],
      steps: [
        {
          text: "Dilute the 3% peroxide with distilled water to make 0.5%, 1.0%, 1.5%, 2.0% and 3.0% solutions, enough to fill each cup to the same depth (about 4 cm).",
          why: "Varying only the substrate concentration, with the same depth for the disc to rise through, makes the timings comparable.",
        },
        {
          text: "Stir the yeast suspension, then hold a disc with forceps in it for exactly 5 seconds and drain it on a paper towel for 5 seconds.",
          why: "Yeast settles quickly; stirring and timing the soak and drain give every disc about the same amount of enzyme.",
        },
        {
          text: "Drop the disc to the bottom of a cup and start the timer as it touches the bottom; stop it when the disc reaches the surface.",
          why: "Catalase on the disc makes O₂ bubbles that lift it, so a shorter time means a faster reaction.",
        },
        {
          text: "Do three discs for each concentration with fresh discs each time, and calculate the mean time.",
          why: "Repeats show how variable the method is and make the mean more reliable.",
        },
        {
          text: "Run two controls in 3.0% peroxide: a disc soaked in distilled water and a disc soaked in boiled yeast.",
          why: "If these don't rise, the floating is caused by active enzyme, not by the paper or by peroxide breaking down on its own; the boiled yeast shows that denatured catalase doesn't work.",
        },
        {
          text: "Calculate the rate for each concentration as 1 ÷ mean time (s⁻¹).",
          why: "Time is inversely related to rate, so 1/t gives a quantity that rises as the reaction speeds up.",
        },
        {
          text: "Plot rate (y) against peroxide concentration (x) and describe the shape of the graph.",
          why: "The shape shows whether the enzyme is approaching saturation, when nearly all active sites are busy.",
        },
      ],
      drills: [
        {
          id: "d1",
          prompt: "How many mL of 3.0% hydrogen peroxide do you need to make 20 mL of a 1.0% solution? (Give your answer to 2 decimal places.)",
          answer: 6.67,
          tolerance: 0.05,
          unit: "mL",
          working: "C₁V₁ = C₂V₂: 3.0% × V₁ = 1.0% × 20 mL, so V₁ = 20 ÷ 3 = 6.67 mL of peroxide made up to 20 mL with 13.33 mL of water.",
        },
        {
          id: "d2",
          prompt: "What is the molar concentration of 3.0% (w/v) hydrogen peroxide (H₂O₂, molar mass 34.01 g/mol), in mol/L?",
          answer: 0.882,
          tolerance: 0.005,
          unit: "M",
          working: "3.0% (w/v) is 3.0 g per 100 mL = 30 g/L. 30 g/L ÷ 34.01 g/mol = 0.882 mol/L.",
        },
        {
          id: "d3",
          prompt: "Catalase breaks down peroxide by 2 H₂O₂ → 2 H₂O + O₂. If 5.0 mL of 3.0% (w/v) peroxide is broken down completely, what volume of O₂ is released at room temperature, taking the molar volume of a gas as 24.0 L/mol? Answer in mL.",
          answer: 52.9,
          tolerance: 0.5,
          unit: "mL",
          working: "Mass of H₂O₂ = 3.0 g/100 mL × 5.0 mL = 0.15 g. Moles = 0.15 ÷ 34.01 = 4.41 × 10⁻³ mol. O₂ = half of that = 2.205 × 10⁻³ mol. Volume = 2.205 × 10⁻³ × 24.0 L = 0.0529 L ≈ 52.9 mL.",
        },
        {
          id: "d4",
          prompt: "Three discs in 1.0% peroxide take 12.4 s, 11.8 s and 12.6 s to rise. What is the rate (1 ÷ mean time), in s⁻¹ to 3 decimal places?",
          answer: 0.082,
          tolerance: 0.001,
          unit: "s⁻¹",
          working: "Mean = (12.4 + 11.8 + 12.6) ÷ 3 = 36.8 ÷ 3 = 12.27 s. Rate = 1 ÷ 12.27 = 0.0815 ≈ 0.082 s⁻¹.",
        },
        {
          id: "d5",
          prompt: "The rate at 3.0% peroxide is 0.200 s⁻¹ and at 0.5% it is 0.050 s⁻¹. What percentage of the 3.0% rate does the 0.5% solution reach?",
          answer: 25,
          tolerance: 0.5,
          unit: "%",
          working: "0.050 ÷ 0.200 × 100 = 25%. A sixfold rise in substrate gave only a fourfold rise in rate, a sign that active sites are starting to saturate.",
        },
      ],
      resultsGuide:
        "Discs should rise faster as peroxide concentration increases, so the rate climbs steeply at low concentrations and then levels off at the highest ones as the active sites become saturated. Discs soaked in water or boiled yeast should stay on the bottom or rise only very slowly; if they float quickly, the peroxide may be contaminated or the disc trapped an air bubble. Wide spread between repeats usually comes from yeast settling in the suspension or uneven soaking and draining. Keep the room temperature steady and note it, because temperature also changes the rate.",
    },
  ],

  cases: [
    {
      id: "b105-case-cf",
      title: "Salty skin and a cough that won't go away",
      topic: "Cells & membranes",
      setting: "Paediatric outpatient clinic. Educational simulation with a fictional patient.",
      presentation:
        "Leo, 4, is brought in by his father because of a wet cough that has come and gone for a year, with three chest infections treated by his family doctor. He eats well but is small for his age. The family moved from a country where newborns aren't screened for cystic fibrosis. His father mentions that Leo's skin tastes salty when he kisses him.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking Leo's father.",
          mode: "multi",
          options: [
            { text: "What are his stools like?", good: true, feedback: "\"Large, greasy and really smelly. They float and are hard to flush.\" This suggests fat isn't being absorbed (steatorrhoea)." },
            { text: "How has his growth and weight been over time?", good: true, feedback: "\"He's always been on the small side, even though he eats more than his sister.\"" },
            { text: "Did he have any bowel problems as a newborn?", good: true, feedback: "\"He was slow to pass his first stool and needed a few days in special care.\" Delayed meconium can be an early sign of CF." },
            { text: "Does anyone in the family have similar problems?", good: true, feedback: "\"A cousin on my side had 'lung problems' and died young. We never knew why.\"" },
            { text: "What is his favourite cartoon?", good: false, feedback: "Good for rapport, but doesn't help the diagnosis." },
            { text: "Has he ever broken a bone?", good: false, feedback: "\"No.\" Not relevant to this picture." },
          ],
          debrief:
            "Repeated chest infections, poor weight gain despite a good appetite, fatty stools, salty skin and a possible family history together point toward cystic fibrosis.",
        },
        {
          title: "Examination",
          prompt: "What do you look for?",
          mode: "multi",
          options: [
            { text: "Height and weight plotted on a growth chart", good: true, feedback: "Weight is below the 3rd centile and height around the 10th." },
            { text: "Listening to the chest", good: true, feedback: "Coarse crackles at both lung bases; wet cough during the exam." },
            { text: "Fingers for clubbing", good: true, feedback: "Mild clubbing of the fingertips, a sign of long-standing lung disease." },
            { text: "Nasal examination", good: true, feedback: "Small nasal polyps, which are unusual in young children and suggest CF." },
            { text: "Testing knee and ankle reflexes", good: false, feedback: "Normal, and not useful here." },
          ],
          debrief:
            "Poor growth, chest crackles, clubbing and nasal polyps in a young child are strong pointers to cystic fibrosis.",
        },
        {
          title: "Investigations",
          prompt: "Which tests best help confirm the diagnosis?",
          mode: "multi",
          options: [
            { text: "Sweat chloride test", good: true, feedback: "Sweat chloride is high on two occasions, well above the level consistent with cystic fibrosis." },
            { text: "CFTR genetic testing", good: true, feedback: "Two copies of the F508del variant: one inherited from each parent." },
            { text: "Stool elastase (a pancreatic enzyme)", good: true, feedback: "Very low, confirming the pancreas isn't releasing enough digestive enzymes." },
            { text: "Sputum or cough swab culture", good: true, feedback: "Grows Staphylococcus aureus; it helps guide treatment of the infection." },
            { text: "Blood type", good: false, feedback: "Doesn't help diagnose CF." },
            { text: "Skull X-ray", good: false, feedback: "Radiation without any diagnostic value here." },
          ],
          debrief:
            "A high sweat chloride is the classic diagnostic test, and finding two disease-causing CFTR variants confirms it. Stool elastase shows pancreatic insufficiency, and cultures guide infection treatment.",
        },
        {
          title: "Mechanism",
          prompt: "How does Leo's genotype lead to his symptoms?",
          mode: "single",
          options: [
            {
              text: "F508del deletes one phenylalanine, so CFTR misfolds in the ER and is destroyed; little chloride channel reaches the membrane, so less Cl⁻ and water reach airway and duct surfaces and mucus becomes thick",
              good: true,
              feedback: "Correct: a folding problem becomes a membrane transport problem, which becomes an organ problem.",
            },
            { text: "F508del is a nonsense mutation, so no CFTR mRNA is ever made", good: false, feedback: "F508del is an in-frame three-base deletion. The protein is made but misfolds." },
            { text: "CFTR is a sodium pump, and too much Na⁺ in the airways draws water in and floods the lungs", good: false, feedback: "CFTR is a chloride (and bicarbonate) channel, and the problem is too little surface fluid, not too much." },
            { text: "Bacteria in the lungs damage the CFTR gene", good: false, feedback: "CF is inherited; the infections are a result of the thick mucus, not the cause." },
          ],
          debrief:
            "In sweat ducts, faulty CFTR can't take chloride back out of the sweat, so sweat is salty. In airways and the pancreas, too little chloride and fluid secretion leaves mucus thick, which blocks pancreatic ducts and traps bacteria in the lungs.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the diagnosis?",
          mode: "single",
          options: [
            { text: "Cystic fibrosis (homozygous F508del) with pancreatic insufficiency", good: true, feedback: "Clinical picture, high sweat chloride and two CFTR variants." },
            { text: "Asthma", good: false, feedback: "Asthma doesn't cause fatty stools, salty sweat or a high sweat chloride." },
            { text: "Lactose intolerance", good: false, feedback: "That can cause loose stools but not chest infections, clubbing or poor growth on this scale." },
            { text: "Primary ciliary dyskinesia", good: false, feedback: "It causes chronic chest infections but not pancreatic insufficiency or a high sweat chloride." },
          ],
          debrief:
            "CF is autosomal recessive: both parents are carriers, and each of their children has a 1 in 4 chance of being affected. Genetic counselling is offered to the family.",
        },
        {
          title: "Management principles",
          prompt: "Which approach best describes ongoing care?",
          mode: "single",
          options: [
            {
              text: "Care from a specialist CF team: daily airway clearance physiotherapy, pancreatic enzyme capsules with meals, a high-calorie diet with fat-soluble vitamins, prompt treatment of chest infections, and assessment for CFTR modulator medicines that help the faulty protein fold and work",
              good: true,
              feedback: "Correct: treat the consequences (mucus, digestion, infection) and, where suitable, the faulty protein itself.",
            },
            { text: "A low-fat diet so fewer fatty stools are produced", good: false, feedback: "Children with CF need extra calories and fat, with enzymes to digest them." },
            { text: "No treatment until symptoms get worse", good: false, feedback: "Early, continuous care slows lung damage and improves growth." },
            { text: "Long-term cough suppressants to stop the cough", good: false, feedback: "Coughing helps clear mucus; the aim is to help clearance, not suppress it." },
          ],
          debrief:
            "CFTR modulators are a striking example of biology turning into treatment: small molecules that help F508del CFTR fold, reach the membrane and open. Life expectancy in CF has risen greatly with specialist care.",
        },
      ],
      teachingPoints: [
        "CFTR is a chloride channel; cystic fibrosis is a membrane transport disease rooted in protein folding.",
        "F508del is an in-frame deletion of one amino acid that makes CFTR misfold and be destroyed before reaching the membrane.",
        "Salty sweat, chronic chest infections, fatty stools and poor growth together suggest CF; the sweat chloride test and CFTR genetics confirm it.",
        "CF is autosomal recessive: two carrier parents have a 1 in 4 chance of an affected child with each pregnancy.",
      ],
    },
    {
      id: "b105-case-lactose",
      title: "Bloating after breakfast in the dining hall",
      topic: "Macromolecules",
      setting: "University student health centre. Educational simulation with a fictional patient.",
      presentation:
        "Mai, 19, a first-year student, comes in because of bloating, cramping and loose stools that have bothered her on most days since starting university two months ago. At home she rarely drank milk, but the dining hall breakfast she now eats every day includes a large milky latte and cereal with milk. She is otherwise well and worried she has 'something serious'.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking Mai.",
          mode: "multi",
          options: [
            { text: "How soon after eating do the symptoms start, and which foods seem to set them off?", good: true, feedback: "\"About half an hour to two hours after breakfast. Days I skip the latte and cereal are much better.\"" },
            { text: "Have you lost weight, seen blood in your stools, or been woken at night by diarrhoea?", good: true, feedback: "\"No to all of those.\" No red-flag features, which is reassuring." },
            { text: "Have you had a stomach bug recently?", good: true, feedback: "\"No.\" A recent gut infection can damage the intestinal lining and cause a temporary lactase shortage, so this is worth asking." },
            { text: "Does anyone in your family avoid milk?", good: true, feedback: "\"My mum and grandmother never drink it; they say it upsets their stomachs.\"" },
            { text: "Do you get itching, hives, lip swelling or wheeze after dairy?", good: true, feedback: "\"Never.\" No features of an allergic reaction to milk protein." },
            { text: "Which modules are you taking this term?", good: false, feedback: "Friendly conversation, but not helpful for the diagnosis." },
            { text: "Have you had your wisdom teeth out?", good: false, feedback: "\"No.\" Not relevant here." },
          ],
          debrief:
            "Symptoms that follow lactose-rich foods within a couple of hours, improve when they are avoided, run in the family and come with no red flags point strongly toward lactose intolerance.",
        },
        {
          title: "Examination",
          prompt: "What do you check?",
          mode: "multi",
          options: [
            { text: "Abdominal examination", good: true, feedback: "Soft and mildly distended, with active bowel sounds and no tenderness or masses." },
            { text: "Weight and BMI, compared with her last records", good: true, feedback: "Weight stable, BMI in the healthy range." },
            { text: "Signs of anaemia and mouth ulcers", good: true, feedback: "None. Their absence makes malabsorption from coeliac disease less likely, though it doesn't rule it out." },
            { text: "Visual acuity chart", good: false, feedback: "Normal, and not useful here." },
            { text: "Knee and ankle reflexes", good: false, feedback: "Normal, and not relevant to her symptoms." },
          ],
          debrief:
            "A normal examination with only mild distension, stable weight and no signs of malabsorption fits a problem with digesting one sugar rather than damage to the gut.",
        },
        {
          title: "Investigations",
          prompt: "Which tests are most useful?",
          mode: "multi",
          options: [
            { text: "Hydrogen breath test after a drink of lactose", good: true, feedback: "Breath hydrogen rises well above baseline within three hours, and her usual bloating and cramps come on during the test." },
            { text: "Coeliac blood test (tissue transglutaminase antibodies)", good: true, feedback: "Negative. Coeliac disease can cause similar symptoms and secondary lactase loss, so it is worth excluding." },
            { text: "Full blood count", good: true, feedback: "Normal, with no anaemia." },
            { text: "A two-week trial of a low-lactose diet", good: true, feedback: "Her symptoms almost disappear, and return when she has a milky latte again." },
            { text: "CT scan of the abdomen", good: false, feedback: "Radiation and cost without benefit when there are no red flags." },
            { text: "Sweat chloride test", good: false, feedback: "Used for cystic fibrosis; nothing here suggests it." },
          ],
          debrief:
            "A positive hydrogen breath test, symptoms that track lactose intake and a negative coeliac screen confirm lactose intolerance.",
        },
        {
          title: "Mechanism",
          prompt: "What explains Mai's symptoms and her breath test result?",
          mode: "single",
          options: [
            {
              text: "Lactase on the small intestine's lining falls after childhood, so lactose isn't hydrolysed into glucose and galactose; the unabsorbed sugar draws water into the gut by osmosis and colonic bacteria ferment it, releasing hydrogen and other gases",
              good: true,
              feedback: "Correct: one missing hydrolysis reaction explains the diarrhoea (osmosis), the gas and bloating (fermentation) and the breath test (hydrogen is absorbed and breathed out).",
            },
            { text: "Her immune system makes antibodies against milk proteins, which inflame the gut", good: false, feedback: "That describes cow's milk protein allergy, which usually causes hives, swelling or wheeze and involves protein, not sugar." },
            { text: "Her pancreas has stopped secreting lactase into the gut", good: false, feedback: "Lactase is a brush-border enzyme on the cells lining the small intestine, not a pancreatic enzyme." },
            { text: "She can't absorb glucose, so all dietary sugar reaches the colon", good: false, feedback: "Glucose absorption (by SGLT1 and GLUT transporters) is normal; only lactose fails to be broken down." },
          ],
          debrief:
            "Most of the world's adults make far less lactase after weaning (lactase non-persistence). Lactase persistence into adulthood is a genetic variant that became common in populations with a long history of dairy farming.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Primary lactose intolerance (adult lactase non-persistence)", good: true, feedback: "Symptoms linked to lactose, a positive breath test, a family history and negative tests for other causes." },
            { text: "Cow's milk protein allergy", good: false, feedback: "There are no allergic features, and the breath test detects sugar fermentation, not an immune reaction." },
            { text: "Coeliac disease", good: false, feedback: "Her coeliac blood test is negative and her symptoms track milk, not gluten." },
            { text: "Inflammatory bowel disease", good: false, feedback: "No weight loss, blood, night-time symptoms or anaemia, and she improves simply by cutting lactose." },
          ],
          debrief:
            "Primary lactose intolerance is very common and harmless, but it should be told apart from conditions that damage the gut lining, which cause secondary lactase deficiency.",
        },
        {
          title: "Management principles",
          prompt: "Which advice is most appropriate?",
          mode: "single",
          options: [
            {
              text: "Reduce lactose to the amount she tolerates, try lactose-free milk, hard cheeses and yoghurt (often well tolerated), consider lactase enzyme products taken with dairy, and keep up calcium and vitamin D with fortified foods",
              good: true,
              feedback: "Correct: most people tolerate some lactose, and the aim is comfort without losing calcium from the diet.",
            },
            { text: "Avoid every food containing any trace of dairy for life, with no need to think about calcium", good: false, feedback: "Unnecessarily strict, and cutting out dairy without replacing calcium and vitamin D risks poor bone health." },
            { text: "A course of antibiotics to clear the gut bacteria that make the gas", good: false, feedback: "Gut bacteria are normal; the problem is the missing enzyme, and antibiotics can cause harm." },
            { text: "A strict gluten-free diet", good: false, feedback: "Her coeliac test is negative, and gluten is not the trigger." },
          ],
          debrief:
            "Lactase supplements simply supply the enzyme that her intestine lacks, doing the hydrolysis step before the lactose reaches the colon.",
        },
      ],
      teachingPoints: [
        "Lactase hydrolyses the glycosidic bond in lactose to give glucose and galactose, which can then be absorbed.",
        "Undigested lactose causes diarrhoea by osmosis and gas by bacterial fermentation; the hydrogen breath test detects that fermentation.",
        "Lactase non-persistence is the normal adult state in most of the world; lactase persistence is the genetic variant.",
        "Management is to reduce lactose to the level tolerated while keeping calcium and vitamin D intake up; cow's milk allergy and coeliac disease are different conditions.",
      ],
    },
    {
      id: "b105-case-sickle",
      title: "Severe leg and back pain after a cold, tiring day",
      topic: "Central dogma",
      setting: "Hospital emergency department. Educational simulation with a fictional patient.",
      presentation:
        "Kofi, 17, arrives with severe pain in his lower back and both thighs that began six hours ago, after a long day outdoors in cold, wet weather with little to drink. He has had similar but milder episodes before, which were put down to 'growing pains'. He moved to the country two years ago and has never seen a specialist. He looks pale and is clearly in a lot of pain.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking Kofi.",
          mode: "multi",
          options: [
            { text: "Have you had chest pain, a cough or trouble breathing?", good: true, feedback: "\"No.\" Important to ask: chest symptoms could mean acute chest syndrome, a dangerous complication." },
            { text: "Did you ever have painful, swollen hands or feet as a small child?", good: true, feedback: "\"My mother says my hands swelled up badly when I was a baby.\" Hand-foot swelling (dactylitis) is often the first sign of sickle cell disease." },
            { text: "Has anyone in the family been told they have a blood condition?", good: true, feedback: "\"Both my parents were told they carry something in their blood. My older sister has the same kind of pain attacks.\"" },
            { text: "Have you had a fever or felt unwell before this started?", good: true, feedback: "\"A bit of a cold last week.\" Infection, cold and dehydration are common triggers of pain crises." },
            { text: "Have your eyes or skin ever looked yellow?", good: true, feedback: "\"Sometimes my eyes look yellow, especially when I'm ill.\" A sign of red cells breaking down (haemolysis)." },
            { text: "What football team do you support?", good: false, feedback: "Good for rapport, but not for the diagnosis." },
            { text: "Do you wear glasses?", good: false, feedback: "\"No.\" Not relevant here." },
          ],
          debrief:
            "Recurrent pain episodes triggered by cold, dehydration and infection, childhood hand-foot swelling, yellow eyes, carrier parents and an affected sister strongly suggest sickle cell disease.",
        },
        {
          title: "Examination",
          prompt: "What do you check?",
          mode: "multi",
          options: [
            { text: "Temperature, heart rate and oxygen saturation", good: true, feedback: "Temperature 37.6 °C, heart rate 108, oxygen saturation 97% on room air." },
            { text: "Conjunctivae and sclerae", good: true, feedback: "Pale conjunctivae and a yellow tinge to the sclerae: anaemia and jaundice." },
            { text: "Listening to the chest", good: true, feedback: "Clear on both sides, with no crackles. No sign of acute chest syndrome for now." },
            { text: "Feeling the abdomen, including for an enlarged spleen", good: true, feedback: "Soft, with no tenderness; spleen not felt. In adults with sickle cell disease the spleen is often small and scarred from repeated damage." },
            { text: "Romberg's balance test", good: false, feedback: "Normal, and not useful here." },
          ],
          debrief:
            "A fast heart rate, pallor and jaundice point to a haemolytic anaemia. Normal oxygen levels and a clear chest are reassuring, but they need rechecking, because acute chest syndrome can develop during a crisis.",
        },
        {
          title: "Investigations",
          prompt: "Which tests help most?",
          mode: "multi",
          options: [
            { text: "Full blood count with reticulocyte count", good: true, feedback: "Haemoglobin is low and reticulocytes are high: the marrow is working hard to replace red cells that are being destroyed early." },
            { text: "Blood film", good: true, feedback: "Many sickle-shaped red cells, as well as target cells." },
            { text: "Haemoglobin analysis (HPLC or electrophoresis)", good: true, feedback: "Mostly haemoglobin S, some fetal haemoglobin (HbF) and no normal adult haemoglobin A, consistent with HbSS." },
            { text: "Bilirubin and lactate dehydrogenase", good: true, feedback: "Both raised, mainly unconjugated bilirubin, from red cells breaking down." },
            { text: "Sweat chloride test", good: false, feedback: "Used for cystic fibrosis; it doesn't help here." },
            { text: "Lumbar puncture", good: false, feedback: "Invasive and not indicated: nothing suggests meningitis." },
          ],
          debrief:
            "Haemoglobin analysis showing HbS without HbA confirms sickle cell disease. The low haemoglobin, high reticulocytes and raised bilirubin show ongoing haemolysis.",
        },
        {
          title: "Mechanism",
          prompt: "How does Kofi's gene change lead to his pain and anaemia?",
          mode: "single",
          options: [
            {
              text: "A single base change in the β-globin gene turns the codon GAG into GUG, putting valine in place of glutamate; deoxygenated HbS polymerises into fibres, so red cells become stiff and sickled, block small vessels (pain) and are destroyed early (anaemia and jaundice)",
              good: true,
              feedback: "Correct: one missense mutation, through the central dogma, changes a protein's surface, then the cell's shape, then blood flow.",
            },
            { text: "A frameshift deletion means no β-globin is made at all", good: false, feedback: "That would be closer to a β-thalassaemia. In sickle cell disease β-globin is made, but with one amino acid changed." },
            { text: "HbS binds oxygen so tightly that tissues can't take any oxygen from it", good: false, feedback: "The problem is that deoxygenated HbS sticks together, not that oxygen can't be released." },
            { text: "His immune system makes antibodies that destroy his red cells", good: false, feedback: "That describes autoimmune haemolytic anaemia. Sickle cell disease is inherited, not autoimmune." },
          ],
          debrief:
            "Cold, dehydration, infection and low oxygen all encourage HbS to polymerise, which is why they trigger crises. Fetal haemoglobin doesn't join the fibres, which is why people with more HbF tend to have milder disease.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the diagnosis?",
          mode: "single",
          options: [
            { text: "Sickle cell disease (HbSS) with an acute painful (vaso-occlusive) crisis", good: true, feedback: "History, examination, haemolysis and HbS without HbA all fit." },
            { text: "Sickle cell trait", good: false, feedback: "Carriers (HbAS) have plenty of normal HbA and are usually symptom-free; Kofi has no HbA." },
            { text: "Iron deficiency anaemia", good: false, feedback: "That doesn't cause jaundice, sickled cells, raised reticulocytes or painful crises." },
            { text: "Growing pains", good: false, feedback: "Growing pains don't cause anaemia, jaundice or a fast heart rate, and this label delayed his diagnosis." },
          ],
          debrief:
            "Sickle cell disease is autosomal recessive: Kofi's parents are both carriers, so each of their children had a 1 in 4 chance of being affected. Carrying one HbS copy gives some protection against severe malaria, which is why the variant is common where malaria is or was widespread.",
        },
        {
          title: "Management principles",
          prompt: "Which approach best describes his care?",
          mode: "single",
          options: [
            {
              text: "Fast, effective pain relief with regular reassessment, fluids, keeping him warm, oxygen only if his saturation falls, looking for and treating infection, close watch for acute chest syndrome, then referral to a specialist haematology team for long-term care",
              good: true,
              feedback: "Correct: treat the pain promptly, remove the triggers of sickling, watch for complications and arrange long-term specialist care.",
            },
            { text: "Hold back pain relief until tests prove the pain is real", good: false, feedback: "Crisis pain is severe and genuine; delaying relief is harmful and a recognised cause of poor care." },
            { text: "Ice packs on the painful areas to reduce swelling", good: false, feedback: "Cold encourages sickling and vessel narrowing, so it can make a crisis worse." },
            { text: "Send him home with advice to rest, without follow-up", good: false, feedback: "He needs pain control and observation now, and a specialist team for prevention, vaccination and long-term treatment." },
          ],
          debrief:
            "Long-term care includes infection prevention and vaccination (because of the damaged spleen), hydroxyurea (hydroxycarbamide), which raises fetal haemoglobin, transfusion in some situations, and genetic counselling. Gene therapies that edit or add globin genes are a new application of the central dogma.",
        },
      ],
      teachingPoints: [
        "Sickle cell disease comes from a single-base missense mutation (GAG → GUG) that puts valine in place of glutamate in β-globin.",
        "Deoxygenated HbS polymerises; stiff, sickled cells block small vessels (pain crises) and are destroyed early (anaemia and jaundice).",
        "Cold, dehydration, infection and low oxygen trigger crises; acute chest syndrome is a dangerous complication to look for.",
        "It is autosomal recessive; carriers are usually well, and raising fetal haemoglobin is one way treatment works.",
      ],
    },
  ],

  skills: [
    {
      id: "b105-skill-microscope",
      title: "Using a compound light microscope",
      purpose: "Looking at cells is the first lab skill in biology, and careless focusing breaks slides and damages lenses.",
      items: [
        { text: "Carries the microscope upright with one hand on the arm and one under the base", critical: true },
        { text: "Cleans the eyepiece and objective lenses with lens paper only" },
        { text: "Starts with the lowest-power objective (usually 4×) clicked into place", critical: true },
        { text: "Places the slide on the stage, coverslip up, and secures it with the stage clips" },
        { text: "On low power, watches from the side while bringing the stage close to the objective, then focuses with the coarse knob by moving them apart while looking through the eyepiece", critical: true },
        { text: "Centres the specimen before switching to a higher objective" },
        { text: "Uses only the fine focus knob at 40× and higher", critical: true },
        { text: "Adjusts the light (iris diaphragm and brightness) for contrast rather than leaving it at maximum" },
        { text: "Calculates total magnification as eyepiece × objective (e.g. 10× × 40× = 400×)" },
        { text: "Returns to the lowest-power objective, removes the slide, and stores the microscope covered with the cord wrapped loosely", critical: true },
      ],
    },
    {
      id: "b105-skill-micropipette",
      title: "Using an adjustable micropipette",
      purpose: "Almost every molecular biology result depends on accurate small volumes, and a careless micropipette ruins dilutions and damages the pipette.",
      items: [
        { text: "Chooses the pipette whose range covers the volume (e.g. P20 for 2–20 µL, P200 for 20–200 µL, P1000 for 100–1000 µL)", critical: true },
        { text: "Sets the volume by turning the dial, never beyond the pipette's maximum or below its minimum", critical: true },
        { text: "Fits a fresh tip of the right size firmly, without touching the tip end with fingers" },
        { text: "Holds the pipette upright, presses the plunger to the first stop, and only then dips the tip just below the liquid surface", critical: true },
        { text: "Releases the plunger slowly and smoothly, waits a second, and withdraws the tip without touching the sides" },
        { text: "Checks the tip for air bubbles or liquid on the outside before dispensing" },
        { text: "Dispenses against the wall of the receiving tube, pressing to the first stop and then to the second stop to blow out the last drop", critical: true },
        { text: "Removes the tip from the tube before letting the plunger return, so liquid isn't drawn back up" },
        { text: "Ejects the tip into the correct waste and uses a new tip for every different solution", critical: true },
        { text: "Never lays the pipette down or turns it upside down with liquid in the tip, and stores it upright in its stand" },
      ],
    },
    {
      id: "b105-skill-hand-hygiene",
      title: "Hand hygiene with alcohol-based hand rub",
      purpose: "Hands carry most infections passed between patients, and a thorough hand rub at the right moments is the single most effective way to stop that spread.",
      items: [
        { text: "Is bare below the elbows: sleeves rolled up, no wrist watch, bracelets or rings other than a plain band, nails short and unvarnished", critical: true },
        { text: "Uses soap and water instead of hand rub when hands are visibly dirty, or after contact with diarrhoea or suspected C. difficile or norovirus (alcohol does not reliably kill them)", critical: true },
        { text: "Applies a palmful of rub, enough to cover every surface of both hands" },
        { text: "Rubs palm to palm, then the right palm over the back of the left hand with fingers interlaced, and the other way round" },
        { text: "Rubs palm to palm with fingers interlaced, then the backs of the fingers against the opposite palm with fingers interlocked" },
        { text: "Rubs each thumb in a rotating motion clasped in the opposite hand, then the fingertips of each hand in the opposite palm" },
        { text: "Keeps rubbing until the hands are completely dry (about 20–30 seconds) without wiping them on clothing or a towel", critical: true },
        { text: "Cleans hands at each of the five moments: before touching a patient, before a clean or aseptic procedure, after a risk of body fluid exposure, after touching a patient, and after touching a patient's surroundings", critical: true },
        { text: "Cleans hands before putting on and after taking off gloves, because gloves don't replace hand hygiene" },
      ],
    },
  ],
};
