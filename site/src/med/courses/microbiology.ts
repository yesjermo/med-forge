import type { Course } from "../types";

/** Original sample content for a typical undergraduate Microbiology course. */
export const microbiology: Course = {
  id: "microbiology",
  code: "MICRO",
  title: "Microbiology",
  description:
    "Bacterial structure, staining, growth and culture, antibiotics and resistance, and how viruses are built and replicate, for pre-med and biomedical science students, with urinary tract infection as a worked example.",
  topics: ["Bacterial structure & staining", "Growth & culture", "Antimicrobials & infection", "Viruses"],

  concepts: [
    {
      slug: "gram-stain",
      model: "bacterium",
      title: "Gram-positive vs Gram-negative cell walls and the Gram stain",
      topic: "Bacterial structure & staining",
      summary:
        "Gram-positive bacteria have a thick peptidoglycan wall that traps crystal violet and stain purple; Gram-negative bacteria have a thin wall plus an outer membrane and stain pink.",
      body: `Most bacteria have a peptidoglycan cell wall outside the cytoplasmic membrane, but it is built in two main ways:
- **Gram-positive**: a thick, many-layered peptidoglycan wall threaded with teichoic and lipoteichoic acids; no outer membrane
- **Gram-negative**: a thin peptidoglycan layer in the periplasmic space, surrounded by an **outer membrane** whose outer leaflet is lipopolysaccharide (LPS). The lipid A part of LPS is **endotoxin**.

**The Gram stain, step by step**
1. **Crystal violet** (primary stain) colours every cell purple.
2. **Gram's iodine** (mordant) forms a large crystal violet–iodine complex inside the cell.
3. **Alcohol or acetone** (decolouriser) dehydrates and tightens the thick Gram-positive wall, trapping the complex. In Gram-negative cells it disrupts the outer membrane and the thin wall can't hold the complex, so it washes out.
4. **Safranin** (counterstain) colours the now-colourless Gram-negative cells pink.

Decolourising is the critical step: too long and Gram-positive cells look pink; too short and Gram-negative cells stay purple.

Some bacteria don't Gram stain usefully. Mycobacteria have waxy mycolic acids and need an acid-fast stain; *Mycoplasma* has no cell wall at all.`,
      pearls: [
        "LPS in the Gram-negative outer membrane can trigger fever, hypotension and septic shock when it enters the bloodstream.",
        "The outer membrane keeps large drugs such as vancomycin out, which is why vancomycin is used only for Gram-positive infections.",
        "A Gram stain of a clinical sample can guide early treatment hours before a culture result is ready.",
      ],
    },
    {
      slug: "aseptic-sterilisation",
      title: "Aseptic technique, sterilisation and disinfection",
      topic: "Growth & culture",
      summary:
        "Sterilisation kills all microbes including spores; disinfection reduces them on surfaces; aseptic technique stops contamination of you, your culture and the room.",
      body: `Three terms that are often mixed up:
- **Sterilisation** destroys all microbial life, including bacterial endospores. Example: autoclaving with pressurised steam, typically 121 °C for at least 15 minutes.
- **Disinfection** reduces microbes on non-living surfaces to a safe level, but may not kill spores. Example: wiping a bench with an approved disinfectant and leaving it for its contact time.
- **Antisepsis** reduces microbes on living tissue such as skin. Example: alcohol hand rub or chlorhexidine.

**Endospores** (made by *Bacillus* and *Clostridium*-type bacteria) resist heat, drying and many chemicals. Autoclave runs are checked with biological indicators containing heat-resistant spores.

**Aseptic technique** in the teaching lab means:
- Disinfect the bench before and after work
- Sterilise loops by flaming to red-hot (or use sterile disposable loops) and let them cool before touching a culture
- Open tubes and plates for as short a time as possible and never leave lids face-up on the bench
- Keep the work close to the flame's updraught or inside a biosafety cabinet
- Discard all cultures and contaminated items into biohazard waste for autoclaving`,
      pearls: [
        "Alcohol hand rub doesn't reliably kill Clostridioides difficile spores, so soap-and-water hand washing is used on wards with C. difficile diarrhoea.",
        "Surgical instruments are sterilised; the patient's skin can only be made antiseptic, never sterile.",
        "Most hospital-acquired infections spread on hands, so hand hygiene is the single most important control measure.",
      ],
    },
    {
      slug: "growth-curve",
      title: "Bacterial growth curve and generation time",
      topic: "Growth & culture",
      summary:
        "Bacteria divide by binary fission, so in exponential (log) phase the population doubles every generation time.",
      formulas: ["N = N_0 \\times 2^{n}", "n = \\dfrac{t}{g}", "n = \\dfrac{\\log_{10} N - \\log_{10} N_0}{\\log_{10} 2} \\approx 3.3\\,(\\log_{10} N - \\log_{10} N_0)"],
      body: `In a closed batch culture, bacteria pass through four phases:
1. **Lag phase**: cells adapt to the new medium and make enzymes; little division
2. **Log (exponential) phase**: steady binary fission; cells are most uniform and most sensitive to antibiotics that act on growing cells
3. **Stationary phase**: nutrients run out and waste builds up; new cells balance dying cells
4. **Death (decline) phase**: viable numbers fall

In log phase every cell divides once per **generation time** $g$, so after $n$ generations:

$$ N = N_0 \\times 2^{n} \\qquad n = \\frac{t}{g} $$

Example: 100 cells with $g$ = 20 min grow for 2 hours. That is $n = 120 / 20 = 6$ generations, so $N = 100 \\times 2^6 = 6{,}400$ cells.

To find $n$ from two counts, take logs:

$$ n = \\frac{\\log_{10} N - \\log_{10} N_0}{\\log_{10} 2} $$

Generation times vary widely: *E. coli* in rich broth at 37 °C can double in about 20 minutes, while *Mycobacterium tuberculosis* takes many hours.`,
      pearls: [
        "Slow-growing organisms such as M. tuberculosis need weeks to culture, which is one reason TB diagnosis and treatment take so long.",
        "Exponential growth is why a small inoculum of a fast-growing pathogen can cause symptoms within hours, as in some foodborne illness.",
      ],
    },
    {
      slug: "viable-counts",
      title: "Serial dilution and viable plate counts",
      topic: "Growth & culture",
      summary:
        "Dilute a culture in known steps, spread a known volume, count colonies, and work back: CFU/mL = colonies ÷ (volume plated × dilution).",
      formulas: [
        "DF = \\dfrac{V_{sample} + V_{diluent}}{V_{sample}}",
        "DF_{total} = DF_1 \\times DF_2 \\times \\cdots",
        "\\text{CFU/mL} = \\dfrac{\\text{colonies}}{V_{plated} \\times \\text{dilution}}",
      ],
      body: `A dense culture holds far too many cells to count directly on a plate, so you dilute it in steps.

**Dilution factor** of one step:

$$ DF = \\frac{V_{sample} + V_{diluent}}{V_{sample}} $$

So 1 mL into 9 mL is a 1:10 dilution (DF 10, dilution $10^{-1}$). Serial steps **multiply**: three 1:10 steps give DF 1,000 (dilution $10^{-3}$).

**Viable count**: spread a known volume of a dilution on agar, incubate, and count colonies. Each colony is assumed to come from one viable cell or clump, so the result is in **colony-forming units (CFU)**:

$$ \\text{CFU/mL} = \\frac{\\text{colonies}}{V_{plated} \\times \\text{dilution}} $$

Example: 150 colonies from 0.1 mL of the $10^{-6}$ dilution gives $150 / (0.1 \\times 10^{-6}) = 1.5 \\times 10^{9}$ CFU/mL.

Only count plates with roughly 30–300 colonies: fewer gives large sampling error, more and colonies merge.`,
      pearls: [
        "Urine culture reports are given as CFU/mL, so the same arithmetic tells you whether growth in a urine sample is significant.",
        "A viable count only measures cells that can grow on that medium; dead or non-culturable cells are missed.",
      ],
    },
    {
      slug: "antibiotic-mechanisms",
      model: "dna",
      title: "Antibiotic mechanisms of action and resistance",
      topic: "Antimicrobials & infection",
      summary:
        "Antibiotics hit targets bacteria have and human cells lack or make differently: the cell wall, the 70S ribosome, DNA gyrase and folate synthesis. Bacteria resist by destroying the drug, changing the target, keeping it out or pumping it out.",
      body: `**Main targets**
- **Cell wall synthesis**: β-lactams (penicillins, cephalosporins, carbapenems) bind penicillin-binding proteins (PBPs) and block peptidoglycan cross-linking. Vancomycin binds the D-Ala-D-Ala end of wall precursors.
- **Protein synthesis, 30S subunit**: aminoglycosides (e.g. gentamicin) and tetracyclines
- **Protein synthesis, 50S subunit**: macrolides (e.g. erythromycin), clindamycin, chloramphenicol, linezolid
- **DNA replication**: fluoroquinolones (e.g. ciprofloxacin) inhibit DNA gyrase and topoisomerase IV
- **Folate synthesis**: sulfonamides block dihydropteroate synthase; trimethoprim blocks dihydrofolate reductase. Humans take in folate from food, so they lack the first target.

Drugs that kill bacteria are **bactericidal** (e.g. β-lactams); drugs that stop growth are **bacteriostatic** (e.g. tetracyclines).

**Resistance mechanisms**
1. **Enzymatic inactivation**: β-lactamases, including extended-spectrum β-lactamases (ESBLs), break the β-lactam ring
2. **Target modification**: MRSA carries *mecA*, which makes PBP2a with low affinity for β-lactams; vancomycin-resistant enterococci build D-Ala-D-Lac precursors
3. **Reduced permeability**: loss of outer-membrane porins in Gram-negative bacteria
4. **Efflux pumps** that push the drug back out

Resistance genes spread between bacteria by **horizontal gene transfer**: conjugation (plasmids), transformation (free DNA) and transduction (bacteriophages).`,
      pearls: [
        "Clavulanic acid is a β-lactamase inhibitor; pairing it with amoxicillin protects the amoxicillin from many β-lactamases.",
        "Unnecessary antibiotic use selects for resistant bacteria in the patient's own gut flora, not just in the target infection.",
        "Aminoglycosides can damage the kidney and inner ear, which is why their blood levels are monitored.",
      ],
    },
    {
      slug: "uti-pathogenesis",
      model: "bacterium",
      title: "Host–pathogen basics and urinary tract infection",
      topic: "Antimicrobials & infection",
      summary:
        "Most UTIs are ascending infections by gut bacteria, usually uropathogenic E. coli, that attach to the bladder lining with fimbriae.",
      body: `**Koch's postulates** set out the classic proof that a microbe causes a disease:
1. The microbe is found in every case of the disease
2. It can be isolated and grown in pure culture
3. The pure culture causes the disease when introduced into a healthy susceptible host
4. The same microbe is re-isolated from that host

They have limits: some pathogens can't be cultured, and healthy carriers exist. Molecular methods now fill these gaps.

**Urinary tract infection (UTI)** is a good example of host–pathogen interaction:
- **Route**: most infections ascend from the perineum through the urethra to the bladder. The shorter female urethra is why UTIs are much more common in women.
- **Organisms**: uropathogenic *E. coli* causes most uncomplicated UTIs. Others include *Staphylococcus saprophyticus* (young women), *Klebsiella*, *Proteus* and *Enterococcus*.
- **Virulence factors**: type 1 and P fimbriae let *E. coli* stick to the urothelium and resist being flushed out; *Proteus* makes urease, which alkalinises urine and favours struvite stones.
- **Host defences**: regular urine flow and complete bladder emptying, the urothelial lining, and antibacterial proteins in urine

**Cystitis** (bladder) causes dysuria, frequency, urgency and suprapubic pain. **Pyelonephritis** (kidney) adds fever, rigors, flank or loin pain and often nausea and vomiting.

**Urine dipstick**: leukocyte esterase indicates white cells (pyuria); nitrite indicates bacteria that reduce dietary nitrate to nitrite, mainly Gram-negative Enterobacterales such as *E. coli*.`,
      pearls: [
        "A negative nitrite doesn't rule out UTI: Enterococcus and S. saprophyticus don't usually make nitrite, and urine needs time in the bladder for the conversion.",
        "Fever, flank pain or vomiting in a patient with urinary symptoms suggests pyelonephritis, which needs prompt clinical review.",
        "Proteus infection with very alkaline urine should make you think of struvite (staghorn) stones.",
      ],
    },
    {
      slug: "virus-structure-replication",
      model: "virus",
      title: "Virus structure and the replication cycle",
      topic: "Viruses",
      summary:
        "A virus is nucleic acid in a protein capsid, sometimes wrapped in a host-derived envelope; it has no metabolism of its own and replicates only inside a host cell, so antibiotics don't work and antivirals target virus-specific steps.",
      body: `A virus particle (**virion**) has:
- a genome of **either DNA or RNA**, single- or double-stranded, never both
- a protein shell, the **capsid**, built from many copies of a few proteins. Many capsids are **icosahedral** (20 triangular faces); others are helical
- in **enveloped** viruses, a lipid **envelope** taken from the host cell's membrane as the virus buds out, studded with viral glycoproteins (spikes) that bind host receptors

Viruses have no ribosomes and make no ATP, so they are not cells and can only replicate inside one.

**The replication cycle**
1. **Attachment**: viral surface proteins bind specific host receptors. This sets **tropism**, e.g. HIV gp120 binds CD4 on helper T cells.
2. **Entry**: by fusion of the envelope with the host membrane, or by endocytosis.
3. **Uncoating**: the capsid opens and releases the genome.
4. **Synthesis**: the virus uses host ribosomes to make its proteins and copies its genome. RNA viruses bring or encode an RNA-dependent RNA polymerase; retroviruses such as HIV use **reverse transcriptase** to make DNA that integrates into the host genome.
5. **Assembly** of new capsids around new genomes.
6. **Release**: by **lysis** of the cell (typical of non-enveloped viruses) or by **budding** through the membrane (enveloped viruses), which gives them their envelope.

**Why this matters for treatment**
- Antibiotics target bacterial structures (cell wall, 70S ribosome) that viruses don't have, so they don't treat viral infections.
- Antivirals block virus-specific steps: neuraminidase inhibitors stop influenza being released, nucleoside analogues stop viral polymerases copying the genome, and protease inhibitors stop HIV proteins maturing.
- Vaccines often target the attachment proteins, so antibodies block step 1.`,
      pearls: [
        "Enveloped viruses are fragile outside the body: alcohol and detergents disrupt the envelope. Non-enveloped viruses such as norovirus survive on surfaces and resist alcohol hand rub, so soap and water is used in outbreaks.",
        "Prescribing antibiotics for a viral cold doesn't help the patient and drives antibiotic resistance.",
        "Retroviruses integrate into host DNA, which is why HIV infection is lifelong and treatment suppresses rather than cures it.",
      ],
    },
  ],

  lectures: [
    {
      id: "mic-l1",
      week: 2,
      title: "Bacterial cell structure and the Gram stain",
      topic: "Bacterial structure & staining",
      summary: "How the two main types of bacterial cell wall differ, and how the four-step Gram stain exploits that difference.",
      notes: `- Gram-positive: thick peptidoglycan, teichoic acids, no outer membrane → purple
- Gram-negative: thin peptidoglycan, outer membrane with LPS (endotoxin) → pink
- Gram stain order: crystal violet → iodine → decolouriser → safranin
- Decolourising is the step that separates the two groups
- Acid-fast stain for mycobacteria; Mycoplasma has no wall`,
      insights: [
        { type: "exam_tip", text: "If asked which step makes the difference, answer the decolouriser, not the primary stain.", conceptSlug: "gram-stain" },
        { type: "clinical_link", text: "Gram-negative sepsis is driven largely by lipid A of LPS activating the innate immune system.", conceptSlug: "gram-stain" },
        { type: "intuition", text: "Picture a thick sponge and a thin net: dehydrate the sponge and the dye is trapped; the net lets it wash straight through.", conceptSlug: "gram-stain" },
      ],
    },
    {
      id: "mic-l2",
      week: 4,
      title: "Growing and counting bacteria",
      topic: "Growth & culture",
      summary: "Sterilisation and aseptic technique, the bacterial growth curve, and how serial dilution turns colonies into CFU/mL.",
      notes: `- Sterilisation kills spores; disinfection and antisepsis may not
- Growth curve: lag → log → stationary → death
- $N = N_0 \\times 2^n$ with $n = t / g$
- Serial dilution factors multiply
- CFU/mL = colonies ÷ (volume plated × dilution); count plates with 30–300 colonies`,
      insights: [
        { type: "exam_tip", text: "Convert time to the same units as generation time before dividing; mixing hours and minutes is the commonest slip.", conceptSlug: "growth-curve" },
        { type: "exam_tip", text: "Check your CFU answer is bigger than the colony count: dividing by a tiny dilution should give a large number.", conceptSlug: "viable-counts" },
        { type: "clinical_link", text: "Spore-forming C. difficile survives alcohol gel, so ward hand hygiene switches to soap and water.", conceptSlug: "aseptic-sterilisation" },
      ],
    },
    {
      id: "mic-l3",
      week: 7,
      title: "Antibiotics, resistance and urinary tract infection",
      topic: "Antimicrobials & infection",
      summary: "Where the main antibiotic classes act, how bacteria resist them, and how UTI develops and is recognised.",
      notes: `- Cell wall: β-lactams (PBPs), vancomycin (D-Ala-D-Ala)
- 30S: aminoglycosides, tetracyclines; 50S: macrolides, clindamycin, chloramphenicol, linezolid
- DNA gyrase: fluoroquinolones; folate: sulfonamides, trimethoprim
- Resistance: inactivating enzymes, altered target, reduced entry, efflux
- UTI: ascending E. coli; nitrite and leukocyte esterase on dipstick; fever and flank pain suggest pyelonephritis`,
      insights: [
        { type: "exam_tip", text: "A common mnemonic for 30S drugs: 'buy AT 30' (Aminoglycosides, Tetracyclines). Most other ribosomal drugs act on 50S.", conceptSlug: "antibiotic-mechanisms" },
        { type: "clinical_link", text: "Urine culture with sensitivities lets the clinician switch to a narrower antibiotic once the organism is known.", conceptSlug: "uti-pathogenesis" },
        { type: "intuition", text: "Resistance mechanisms are the four ways to beat a key: break it, change the lock, block the door, or throw it back out.", conceptSlug: "antibiotic-mechanisms" },
      ],
    },
  ],

  questions: [
    {
      id: "mic-q1",
      type: "mcq",
      topic: "Bacterial structure & staining",
      difficulty: 1,
      prompt: "Why do Gram-positive bacteria stay purple after the decolourising step of a Gram stain?",
      options: [
        "Their outer membrane binds safranin",
        "Their thick peptidoglycan wall traps the crystal violet–iodine complex",
        "They lack a cell wall, so dye enters the cytoplasm directly",
        "Their lipopolysaccharide repels alcohol",
      ],
      answer: 1,
      hints: ["Which group has the thicker wall?", "Alcohol dehydrates peptidoglycan and shrinks its pores."],
      explanation:
        "Gram-positive bacteria have a thick peptidoglycan wall. The decolouriser dehydrates it, trapping the large crystal violet–iodine complex. Gram-negative bacteria have the outer membrane and LPS, and lose the complex.",
      concepts: ["gram-stain"],
    },
    {
      id: "mic-q2",
      type: "numeric",
      topic: "Growth & culture",
      difficulty: 1,
      prompt: "You inoculate broth with 100 bacteria that have a generation time of 20 minutes. Assuming constant exponential growth, how many cells are there after 2 hours?",
      answer: 6400,
      tolerance: 1,
      unit: "cells",
      hints: ["First find the number of generations: $n = t / g$.", "Then use $N = N_0 \\times 2^n$."],
      explanation: "$n = 120 / 20 = 6$ generations. $N = 100 \\times 2^6 = 100 \\times 64 = 6{,}400$ cells.",
      concepts: ["growth-curve"],
    },
    {
      id: "mic-q3",
      type: "numeric",
      topic: "Growth & culture",
      difficulty: 2,
      prompt: "You spread 0.1 mL of the $10^{-6}$ dilution of a culture and count 150 colonies. What is the viable count of the original culture in CFU/mL?",
      answer: 1.5e9,
      tolerance: 1e7,
      unit: "CFU/mL",
      hints: ["CFU/mL = colonies ÷ (volume plated × dilution).", "The denominator is $0.1 \\times 10^{-6} = 10^{-7}$ mL."],
      explanation: "$150 / (0.1 \\times 10^{-6}) = 150 / 10^{-7} = 1.5 \\times 10^{9}$ CFU/mL.",
      concepts: ["viable-counts"],
    },
    {
      id: "mic-q4",
      type: "numeric",
      topic: "Growth & culture",
      difficulty: 1,
      prompt: "You make three serial dilutions, each by transferring 1 mL into 9 mL of sterile saline. What is the total dilution factor of the last tube?",
      answer: 1000,
      tolerance: 0.5,
      unit: "",
      hints: ["Each step has DF = (1 + 9) / 1.", "Serial dilution factors multiply."],
      explanation: "Each step is 1:10. Total DF $= 10 \\times 10 \\times 10 = 1{,}000$, so the last tube is a $10^{-3}$ dilution.",
      concepts: ["viable-counts"],
    },
    {
      id: "mic-q5",
      type: "mcq",
      topic: "Antimicrobials & infection",
      difficulty: 2,
      prompt: "Which antibiotic class acts by binding the 30S ribosomal subunit?",
      options: ["Macrolides", "Fluoroquinolones", "Aminoglycosides", "Cephalosporins"],
      answer: 2,
      hints: ["The 30S group is small: two main classes.", "Macrolides act on the larger subunit."],
      explanation:
        "Aminoglycosides (and tetracyclines) bind the 30S subunit. Macrolides bind 50S, fluoroquinolones inhibit DNA gyrase and topoisomerase IV, and cephalosporins are β-lactams that block cell wall cross-linking.",
      concepts: ["antibiotic-mechanisms"],
    },
    {
      id: "mic-q6",
      type: "mcq",
      topic: "Antimicrobials & infection",
      difficulty: 2,
      prompt: "How is methicillin-resistant Staphylococcus aureus (MRSA) resistant to β-lactam antibiotics?",
      options: [
        "It pumps β-lactams out with an efflux pump",
        "It has an outer membrane that blocks β-lactam entry",
        "It makes an altered penicillin-binding protein (PBP2a) with low affinity for β-lactams",
        "It changes its ribosome so the drug can't bind",
      ],
      answer: 2,
      hints: ["S. aureus is Gram-positive, so it has no outer membrane.", "Think target modification, encoded by mecA."],
      explanation:
        "MRSA carries the mecA gene, which encodes PBP2a. β-lactams bind PBP2a poorly, so cell wall cross-linking continues. This is target modification, not enzymatic breakdown or efflux.",
      concepts: ["antibiotic-mechanisms"],
    },
    {
      id: "mic-q7",
      type: "numeric",
      topic: "Growth & culture",
      difficulty: 3,
      prompt: "A culture in log phase grows from $1.0 \\times 10^{3}$ to $6.4 \\times 10^{4}$ cells/mL in 3 hours. What is the generation time in minutes?",
      answer: 30,
      tolerance: 0.5,
      unit: "min",
      hints: ["Find how many-fold the population increased, then how many doublings that is.", "$64 = 2^6$, and 3 hours = 180 minutes."],
      explanation: "$N / N_0 = 6.4 \\times 10^4 / 10^3 = 64 = 2^6$, so $n = 6$. $g = t / n = 180 / 6 = 30$ minutes.",
      concepts: ["growth-curve"],
    },
    {
      id: "mic-q8",
      type: "mcq",
      topic: "Antimicrobials & infection",
      difficulty: 3,
      prompt: "A urine dipstick is positive for nitrite. What does this most directly suggest?",
      options: [
        "White blood cells are present in the urine",
        "Bacteria that reduce nitrate to nitrite, typically Gram-negative Enterobacterales such as E. coli, are present",
        "The infection is caused by Enterococcus",
        "The infection has spread to the kidney",
      ],
      answer: 1,
      hints: ["Leukocyte esterase, not nitrite, detects white cells.", "Which organisms have nitrate reductase?"],
      explanation:
        "Nitrite forms when bacteria such as E. coli reduce dietary nitrate in the urine. Leukocyte esterase detects white cells. Enterococcus usually doesn't produce nitrite, and a dipstick can't tell bladder from kidney infection; that needs clinical features such as fever and flank pain.",
      concepts: ["uti-pathogenesis"],
    },
    {
      id: "mic-q9",
      type: "mcq",
      topic: "Viruses",
      difficulty: 1,
      prompt: "Why don't antibiotics such as amoxicillin treat a viral infection?",
      options: [
        "Viruses are too small for the drug to reach",
        "Viruses lack the bacterial targets these drugs act on, such as the cell wall and 70S ribosome",
        "Viruses break antibiotics down with β-lactamase",
        "Antibiotics can't cross the viral envelope",
      ],
      answer: 1,
      hints: ["What does amoxicillin act on in bacteria?", "Does a virus have a peptidoglycan wall?"],
      explanation:
        "Antibiotics act on bacterial structures: amoxicillin blocks peptidoglycan cross-linking. Viruses have no cell wall and no ribosomes of their own; they replicate with the host cell's machinery, so there is nothing for the drug to act on.",
      concepts: ["virus-structure-replication"],
    },
    {
      id: "mic-q10",
      type: "mcq",
      topic: "Viruses",
      difficulty: 2,
      prompt: "During a norovirus outbreak on a ward, why is hand washing with soap and water preferred to alcohol hand rub?",
      options: [
        "Norovirus is non-enveloped, so alcohol doesn't reliably inactivate it",
        "Norovirus forms spores",
        "Alcohol makes norovirus replicate faster",
        "Norovirus is a bacterium with an outer membrane",
      ],
      answer: 0,
      hints: ["What does alcohol damage in a virus?", "Does norovirus have a lipid envelope?"],
      explanation:
        "Alcohol works by disrupting lipid envelopes. Norovirus has only a protein capsid, so it survives alcohol rub; soap, water and friction remove it physically. Spores are a bacterial feature, not a viral one.",
      concepts: ["virus-structure-replication"],
    },
    {
      id: "mic-q11",
      type: "mcq",
      topic: "Bacterial structure & staining",
      difficulty: 1,
      prompt: "Which reagent acts as the mordant in the Gram stain?",
      options: ["Crystal violet", "Gram's iodine", "Alcohol or acetone", "Safranin"],
      answer: 1,
      hints: ["A mordant fixes a dye in place rather than colouring the cell itself.", "It is the second reagent, and it forms a large complex with the first."],
      explanation:
        "Gram's iodine is the mordant: it combines with crystal violet to form a large crystal violet–iodine complex inside the cell. Crystal violet is the primary stain, alcohol or acetone is the decolouriser, and safranin is the counterstain.",
      concepts: ["gram-stain"],
    },
    {
      id: "mic-q12",
      type: "mcq",
      topic: "Bacterial structure & staining",
      difficulty: 2,
      prompt: "Which component of the Gram-negative cell envelope is responsible for endotoxin activity?",
      options: ["Teichoic acid", "Lipid A of lipopolysaccharide", "Peptidoglycan", "Outer-membrane porins"],
      answer: 1,
      hints: ["Endotoxin is part of the outer membrane, which only Gram-negative bacteria have.", "LPS has three parts: lipid A, a core oligosaccharide and the O antigen."],
      explanation:
        "Lipid A, the membrane-anchored part of lipopolysaccharide (LPS) in the outer leaflet of the outer membrane, is endotoxin. It strongly activates innate immunity and can cause fever and septic shock. Teichoic acids are found in Gram-positive walls, and porins are channels for small molecules.",
      concepts: ["gram-stain"],
    },
    {
      id: "mic-q13",
      type: "mcq",
      topic: "Bacterial structure & staining",
      difficulty: 3,
      prompt: "A student Gram stains a known Staphylococcus aureus culture but leaves the alcohol decolouriser on for a full minute. How will the cocci most likely look?",
      options: [
        "Purple, because Gram-positive cells always keep the dye",
        "Pink, because over-decolourising washes the crystal violet–iodine complex out even from a thick wall",
        "Colourless, because safranin can't stain Gram-positive cells",
        "Green, because the dyes mix",
      ],
      answer: 1,
      hints: ["Decolourising is the critical, time-sensitive step.", "Once the purple complex is gone, what colour does the counterstain give?"],
      explanation:
        "Decolourising for too long removes the crystal violet–iodine complex even from Gram-positive cells, which then take up safranin and look pink: a false Gram-negative result. Running known Gram-positive and Gram-negative controls on the same slide catches this error.",
      concepts: ["gram-stain"],
    },
    {
      id: "mic-q14",
      type: "mcq",
      topic: "Bacterial structure & staining",
      difficulty: 2,
      prompt: "Why is Mycobacterium tuberculosis identified with an acid-fast stain (such as Ziehl–Neelsen) rather than the Gram stain?",
      options: [
        "It has no cell wall at all",
        "Its cell wall is rich in waxy mycolic acids that resist ordinary aqueous stains",
        "It is too large to see with a light microscope",
        "It is a virus and doesn't take up any stain",
      ],
      answer: 1,
      hints: ["Think about what makes the mycobacterial wall unusual.", "The bacterium lacking a wall altogether is Mycoplasma."],
      explanation:
        "Mycobacteria have a waxy, lipid-rich wall full of mycolic acids, so they stain poorly with the Gram stain. In the acid-fast stain, heated carbol fuchsin penetrates the wall and is then held even against acid-alcohol, so the bacilli look red on a blue background. Mycoplasma is the organism with no wall.",
      concepts: ["gram-stain"],
    },
    {
      id: "mic-q15",
      type: "numeric",
      topic: "Bacterial structure & staining",
      difficulty: 1,
      prompt: "You examine a Gram-stained smear with a 100× oil-immersion objective and a 10× eyepiece. What is the total magnification?",
      answer: 1000,
      tolerance: 0.5,
      unit: "×",
      hints: ["Total magnification is objective × eyepiece.", "The oil improves resolution but doesn't change magnification."],
      explanation:
        "Total magnification $= 100 \\times 10 = 1{,}000\\times$. Immersion oil has a refractive index close to glass, so less light is bent away from the lens and fine detail such as cell shape can be resolved.",
      concepts: ["gram-stain"],
    },
    {
      id: "mic-q16",
      type: "numeric",
      topic: "Antimicrobials & infection",
      difficulty: 2,
      prompt: "A broth dilution test uses an antibiotic at 0.25, 0.5, 1, 2, 4, 8 and 16 µg/mL. After overnight incubation the tubes at 0.25, 0.5, 1 and 2 µg/mL are cloudy; those at 4, 8 and 16 µg/mL are clear. What is the minimum inhibitory concentration (MIC)?",
      answer: 4,
      tolerance: 0.01,
      unit: "µg/mL",
      hints: ["The MIC is the lowest concentration that prevents visible growth.", "Find the first clear tube as the concentration rises."],
      explanation:
        "Cloudiness means growth. The lowest concentration with no visible growth is 4 µg/mL, so the MIC is 4 µg/mL. Whether that counts as susceptible depends on the published breakpoint for that drug and organism.",
      concepts: ["antibiotic-mechanisms"],
    },
    {
      id: "mic-q17",
      type: "mcq",
      topic: "Antimicrobials & infection",
      difficulty: 1,
      prompt: "Trimethoprim inhibits which bacterial enzyme?",
      options: ["DNA gyrase", "Dihydrofolate reductase", "Dihydropteroate synthase", "β-lactamase"],
      answer: 1,
      hints: ["Trimethoprim acts on folate metabolism.", "Sulfonamides block the earlier enzyme; trimethoprim blocks the later one."],
      explanation:
        "Trimethoprim blocks bacterial dihydrofolate reductase. Sulfonamides block dihydropteroate synthase earlier in the same pathway, which is why the two are sometimes combined. Fluoroquinolones inhibit DNA gyrase.",
      concepts: ["antibiotic-mechanisms"],
    },
    {
      id: "mic-q18",
      type: "numeric",
      topic: "Antimicrobials & infection",
      difficulty: 2,
      prompt: "A urine sample is plated with a calibrated 1 µL loop and grows 120 colonies of a single organism. What is the count in the urine in CFU/mL?",
      answer: 1.2e5,
      tolerance: 1e3,
      unit: "CFU/mL",
      hints: ["1 µL is 0.001 mL.", "CFU/mL = colonies ÷ volume plated (the urine is undiluted)."],
      explanation:
        "$120 / 0.001 = 1.2 \\times 10^{5}$ CFU/mL. This is above the classic $10^{5}$ CFU/mL threshold for significant bacteriuria, although lower counts can be significant in a symptomatic patient.",
      concepts: ["viable-counts", "uti-pathogenesis"],
    },
    {
      id: "mic-q19",
      type: "mcq",
      topic: "Viruses",
      difficulty: 1,
      prompt: "HIV's gp120 attaches to which host receptor, determining that it infects helper T cells?",
      options: ["CD8", "CD4", "The ACE2 receptor", "Sialic acid"],
      answer: 1,
      hints: ["Helper T cells are named after this surface marker.", "Attachment to a specific receptor sets a virus's tropism."],
      explanation:
        "HIV gp120 binds CD4 (with a co-receptor such as CCR5 or CXCR4), so it infects CD4+ helper T cells and some macrophages. CD8 marks cytotoxic T cells, ACE2 is the receptor for SARS-CoV-2, and sialic acid is bound by influenza haemagglutinin.",
      concepts: ["virus-structure-replication"],
    },
    {
      id: "mic-q20",
      type: "mcq",
      topic: "Viruses",
      difficulty: 2,
      prompt: "Which enzyme lets a retrovirus such as HIV make a DNA copy of its RNA genome?",
      options: ["RNA-dependent RNA polymerase", "Reverse transcriptase", "DNA gyrase", "Neuraminidase"],
      answer: 1,
      hints: ["The flow of information runs 'backwards', from RNA to DNA.", "DNA gyrase is a bacterial enzyme."],
      explanation:
        "Reverse transcriptase is an RNA-dependent DNA polymerase. The DNA it makes is integrated into the host genome by integrase. RNA-dependent RNA polymerases copy RNA into RNA in other RNA viruses, DNA gyrase is the fluoroquinolone target in bacteria, and neuraminidase is an influenza release enzyme.",
      concepts: ["virus-structure-replication"],
    },
    {
      id: "mic-q21",
      type: "mcq",
      topic: "Viruses",
      difficulty: 3,
      prompt: "Neuraminidase inhibitors used against influenza block which step of the viral replication cycle?",
      options: ["Attachment to host receptors", "Uncoating of the genome", "Copying of the viral genome", "Release of new virions from the infected cell"],
      answer: 3,
      hints: ["Neuraminidase cuts sialic acid, the same sugar the virus binds to.", "Without it, new virions stay stuck to the cell they budded from."],
      explanation:
        "Influenza haemagglutinin binds sialic acid on host cells. Neuraminidase cleaves sialic acid so new virions can leave the cell surface. Blocking it leaves new virions clumped on the infected cell, so release and spread are reduced.",
      concepts: ["virus-structure-replication"],
    },
    {
      id: "mic-q22",
      type: "numeric",
      topic: "Viruses",
      difficulty: 2,
      prompt: "In a bacteriophage plaque assay, 0.1 mL of the $10^{-6}$ dilution of a phage stock gives 45 plaques on a lawn of host bacteria. What is the titre of the stock in PFU/mL?",
      answer: 4.5e8,
      tolerance: 1e6,
      unit: "PFU/mL",
      hints: ["Each plaque comes from one infectious phage particle (a plaque-forming unit).", "Use the same arithmetic as a viable count: plaques ÷ (volume plated × dilution)."],
      explanation:
        "$45 / (0.1 \\times 10^{-6}) = 45 / 10^{-7} = 4.5 \\times 10^{8}$ PFU/mL. A plaque is a clear zone where one phage infected a cell and its progeny lysed the neighbouring cells; viruses can only be counted this way because they need living host cells.",
      concepts: ["virus-structure-replication", "viable-counts"],
    },
    {
      id: "mic-q23",
      type: "mcq",
      topic: "Growth & culture",
      difficulty: 1,
      prompt: "Which method reliably destroys bacterial endospores on laboratory glassware and media?",
      options: ["Wiping with 70% ethanol", "Autoclaving with pressurised steam at 121 °C for at least 15 minutes", "Alcohol hand rub", "Leaving it under the bench light overnight"],
      answer: 1,
      hints: ["Only sterilisation kills spores; disinfection and antisepsis may not.", "Which option uses moist heat under pressure?"],
      explanation:
        "Autoclaving is sterilisation: pressurised steam at 121 °C for at least 15 minutes kills all microbes, including endospores. Alcohol is a disinfectant or antiseptic and does not reliably kill spores. Autoclave runs are checked with spore-based biological indicators.",
      concepts: ["aseptic-sterilisation"],
    },
  ],

  labs: [
    {
      id: "mic-lab-gram-plate",
      title: "Gram stain and viable plate count",
      topic: "Growth & culture",
      objective:
        "Gram stain a mixed smear to tell Gram-positive from Gram-negative bacteria, then make a serial dilution of a broth culture, spread-plate it, and calculate the viable count in CFU/mL.",
      safety: [
        "Work at BSL-2 practice: wear a fastened lab coat, gloves and eye protection; tie back long hair.",
        "Disinfect the bench with the approved disinfectant before and after work, and wipe up any spill immediately and tell the instructor.",
        "Keep ethanol beakers away from the Bunsen flame; if ethanol on a spreader catches fire, let it burn off or cover the beaker, never wave it.",
        "No eating, drinking, applying cosmetics or touching your face in the lab; never mouth-pipette.",
        "Discard plates, tips and swabs in biohazard bags or containers for autoclaving, and sharps and broken glass in the sharps bin.",
        "Remove gloves and wash your hands with soap and water before leaving the lab.",
      ],
      materials: [
        "Broth culture of a non-pathogenic teaching strain (e.g. E. coli K-12) and a Gram-positive teaching strain",
        "Glass slides, inoculating loop, Bunsen burner or micro-incinerator",
        "Crystal violet, Gram's iodine, decolouriser (alcohol or acetone–alcohol), safranin",
        "Light microscope with oil-immersion objective",
        "Sterile saline tubes (9.9 mL and 9 mL), sterile pipettes and tips",
        "Nutrient agar plates, glass or disposable spreader, ethanol for flaming",
        "Incubator at 37 °C",
      ],
      steps: [
        { text: "Disinfect the bench, label plates on the base with name, date and dilution, and arrange your equipment.", why: "Labelling the base means labels stay with the agar if lids are swapped." },
        { text: "Place a small drop of water on a slide, mix in a loopful of culture, spread it thin, air-dry, then heat-fix by passing it quickly through the flame.", why: "Heat-fixing kills and sticks the cells to the slide so they don't wash off." },
        { text: "Flood with crystal violet for about 1 minute, rinse; flood with Gram's iodine for about 1 minute, rinse.", why: "Iodine forms the large crystal violet–iodine complex." },
        { text: "Decolourise by dripping alcohol over the tilted slide until the run-off is nearly clear (a few seconds), then rinse at once.", why: "This is the step that separates the two groups; over-decolourising makes Gram-positive cells look pink." },
        { text: "Counterstain with safranin for about 1 minute, rinse, blot dry and examine under oil immersion. Record colour and shape (cocci or rods)." },
        { text: "Make a 1:100 dilution by transferring 0.1 mL of broth into 9.9 mL saline; mix well." },
        { text: "Make further 1:10 dilutions (1 mL into 9 mL) with a fresh sterile tip each time, mixing between steps.", why: "A used tip carries over cells and makes later dilutions too concentrated." },
        { text: "Pipette 0.1 mL of each of the last two or three dilutions onto the centre of a labelled agar plate." },
        { text: "Dip the spreader in ethanol, pass it through the flame to burn off the ethanol, let it cool, and spread the liquid evenly over the agar.", why: "A hot spreader kills the bacteria you are trying to count." },
        { text: "Incubate the plates inverted at 37 °C overnight, then count plates with 30–300 colonies.", why: "Inverting stops condensation dripping onto the agar and merging colonies." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "You transfer 0.1 mL of broth into 9.9 mL of saline. What is the dilution factor of this step?",
          answer: 100,
          tolerance: 0.5,
          unit: "",
          working: "DF = (0.1 + 9.9) / 0.1 = 10 / 0.1 = 100, a $10^{-2}$ dilution.",
        },
        {
          id: "d2",
          prompt: "After the 1:100 step you make three more 1:10 dilutions. What is the total dilution factor of the last tube?",
          answer: 100000,
          tolerance: 0.5,
          unit: "",
          working: "100 × 10 × 10 × 10 = 100,000, a $10^{-5}$ dilution.",
        },
        {
          id: "d3",
          prompt: "You spread 0.1 mL from the $10^{-5}$ tube and count 87 colonies. What is the viable count of the original broth in CFU/mL?",
          answer: 8.7e7,
          tolerance: 1e5,
          unit: "CFU/mL",
          working: "87 / (0.1 × $10^{-5}$) = 87 / $10^{-6}$ = $8.7 \\times 10^{7}$ CFU/mL. 87 colonies is within the 30–300 countable range.",
        },
      ],
      resultsGuide:
        "On the Gram stain, the Gram-positive strain should appear as purple cells (for example cocci in clusters) and E. coli as pink rods. Pink Gram-positive cells usually mean over-decolourising or an old culture; purple Gram-negative cells usually mean the smear was too thick or under-decolourised. On the plates, colony numbers should fall about tenfold with each dilution. Use only plates in the 30–300 range; if two plates qualify, their calculated counts should agree to within roughly a factor of two. Spreading colonies or growth across the whole plate suggests a wet plate or contamination.",
    },
    {
      id: "mic-lab-ast",
      title: "Antibiotic susceptibility: disc diffusion and broth microdilution MIC",
      topic: "Antimicrobials & infection",
      objective:
        "Standardise a bacterial inoculum, test it against antibiotic discs on Mueller–Hinton agar, and set up a two-fold broth microdilution series to read a minimum inhibitory concentration (MIC).",
      safety: [
        "Work at BSL-2 practice with a non-pathogenic teaching strain: fastened lab coat, gloves and eye protection; tie back long hair.",
        "Disinfect the bench before and after work; report spills at once and cover them with disinfectant for its contact time.",
        "Handle antibiotic discs and stock solutions with forceps and gloves; tell the instructor beforehand if you have an antibiotic allergy.",
        "Never mouth-pipette; use a pipette filler or micropipette, and keep the lid on the microtitre plate except while adding liquid.",
        "Discard plates, swabs, tips and microtitre plates into biohazard waste for autoclaving, and wash your hands with soap and water before leaving.",
      ],
      materials: [
        "Overnight agar culture of a teaching strain (e.g. E. coli K-12)",
        "Sterile saline, 0.5 McFarland turbidity standard (or a densitometer)",
        "Mueller–Hinton agar plates and Mueller–Hinton broth",
        "Sterile cotton swabs, antibiotic discs, sterile forceps or a disc dispenser",
        "Antibiotic stock solution, 96-well microtitre plate, multichannel or single micropipette and sterile tips",
        "Ruler or callipers, incubator at 35–37 °C",
      ],
      steps: [
        { text: "Pick 3–5 similar colonies and suspend them in sterile saline until the turbidity matches the 0.5 McFarland standard.", why: "A 0.5 McFarland suspension holds roughly $1.5 \\times 10^{8}$ CFU/mL; too heavy an inoculum makes zones smaller and MICs higher." },
        { text: "Within 15 minutes, dip a swab in the suspension, press off the excess on the tube wall, and swab the whole Mueller–Hinton plate three times, turning it about 60° each time.", why: "An even, confluent lawn is needed for zone edges to be sharp and comparable." },
        { text: "Place the antibiotic discs firmly on the agar with sterile forceps, well spaced and away from the edge, and do not move them once placed.", why: "The drug starts diffusing as soon as the disc touches the agar, so moving a disc smears the gradient." },
        { text: "In the microtitre plate, make a two-fold dilution series of the antibiotic in broth across a row, leaving one well with broth and bacteria only (growth control) and one with broth only (sterility control).", why: "Each well holds half the concentration of the one before; the controls prove the organism can grow and the broth is sterile." },
        { text: "Dilute the 0.5 McFarland suspension 1:150 in broth and add an equal volume to each test well and the growth control.", why: "This gives the standard final inoculum of about $5 \\times 10^{5}$ CFU/mL in each well." },
        { text: "Plate 10 µL of a 1:100 dilution of the well inoculum onto agar as a colony-count and purity check.", why: "It confirms the inoculum was the right size and that only one organism is present." },
        { text: "Incubate the agar plates inverted and the microtitre plate covered at 35–37 °C for 16–20 hours." },
        { text: "Measure each zone of inhibition diameter in millimetres across the back of the plate, including the disc, and read the MIC as the lowest concentration with no visible growth.", why: "Zone diameters and MICs are compared with published breakpoint tables (EUCAST or CLSI) to report susceptible, intermediate or resistant." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "Well 1 of a two-fold dilution series holds 64 µg/mL of antibiotic. What concentration is in well 8?",
          answer: 0.5,
          tolerance: 0.001,
          unit: "µg/mL",
          working: "Well 8 is seven halvings after well 1: $64 / 2^{7} = 64 / 128 = 0.5$ µg/mL.",
        },
        {
          id: "d2",
          prompt: "A 0.5 McFarland suspension contains about $1.5 \\times 10^{8}$ CFU/mL. You dilute it 1:150. What is the new concentration?",
          answer: 1e6,
          tolerance: 1e4,
          unit: "CFU/mL",
          working: "$1.5 \\times 10^{8} / 150 = 1.0 \\times 10^{6}$ CFU/mL.",
        },
        {
          id: "d3",
          prompt: "You add 50 µL of the $1.0 \\times 10^{6}$ CFU/mL suspension to 50 µL of antibiotic in broth. What is the final bacterial concentration in the well?",
          answer: 5e5,
          tolerance: 1e4,
          unit: "CFU/mL",
          working: "Mixing equal volumes is a 1:2 dilution: $1.0 \\times 10^{6} / 2 = 5 \\times 10^{5}$ CFU/mL. The antibiotic is halved too, which is why the drug is made up at twice the final concentration.",
        },
        {
          id: "d4",
          prompt: "The final well concentrations are 16, 8, 4, 2, 1, 0.5 and 0.25 µg/mL. Wells at 0.25, 0.5 and 1 µg/mL are turbid; wells at 2 µg/mL and above are clear. The growth control is turbid. What is the MIC?",
          answer: 2,
          tolerance: 0.001,
          unit: "µg/mL",
          working: "The MIC is the lowest concentration with no visible growth: 2 µg/mL. The turbid growth control shows the organism was viable, so the clear wells are real inhibition.",
        },
        {
          id: "d5",
          prompt: "For the colony-count check you dilute the $5 \\times 10^{5}$ CFU/mL well inoculum 1:100 and spread 10 µL. About how many colonies do you expect?",
          answer: 50,
          tolerance: 0.5,
          unit: "colonies",
          working: "After 1:100 the suspension holds $5 \\times 10^{3}$ CFU/mL. 10 µL is 0.01 mL, so $5 \\times 10^{3} \\times 0.01 = 50$ colonies.",
        },
      ],
      resultsGuide:
        "Zones should be round with sharp edges in an even, confluent lawn. Very large zones with a patchy lawn suggest too light an inoculum; tiny zones everywhere suggest too heavy an inoculum or plates left too long before the discs went on. Colonies growing inside a zone may be resistant mutants or a mixed culture, so check purity. In the microdilution row the sterility control must be clear and the growth control turbid, otherwise the plate can't be read. A single skipped well (growth above a clear well) usually means a pipetting error; repeat the test. The colony-count check should give roughly 20–80 colonies. Interpret zones and MICs only against the current breakpoint tables for that organism and drug.",
    },
    {
      id: "mic-lab-plaque",
      title: "Bacteriophage plaque assay",
      topic: "Viruses",
      objective:
        "Titrate a bacteriophage stock by serial dilution and the double-layer (soft agar overlay) method, count plaques, calculate the titre in PFU/mL and use it to plan an infection at a chosen multiplicity of infection (MOI).",
      safety: [
        "Phages used in teaching (e.g. T4) don't infect human cells, but the host bacteria do need standard practice: fastened lab coat, gloves and eye protection.",
        "Molten agar kept at 45–50 °C can still scald; handle tubes from the water bath with care and never pipette agar by mouth.",
        "Phages spread easily on aerosols and hands and can wipe out other groups' E. coli cultures: keep lids on, disinfect the bench after work and change gloves before handling other cultures.",
        "Discard all plates, tubes and tips in biohazard waste for autoclaving, and wash your hands with soap and water before leaving.",
      ],
      materials: [
        "Log-phase broth culture of the host strain (e.g. E. coli B for phage T4)",
        "Phage stock (lysate) of unknown titre",
        "Sterile broth or phage buffer in 9.9 mL and 9 mL volumes, sterile pipettes and tips",
        "Nutrient agar base plates and tubes of molten soft (top) agar held in a 45–50 °C water bath",
        "Vortex mixer, incubator at 37 °C",
      ],
      steps: [
        { text: "Label base plates on the base with name, date and dilution, and warm them to room temperature or 37 °C.", why: "Cold plates make the top agar set before it spreads evenly." },
        { text: "Make a 1:100 dilution of the phage stock (0.1 mL into 9.9 mL), then five 1:10 dilutions (1 mL into 9 mL), using a fresh tip and mixing at every step.", why: "Phage stocks often hold $10^{9}$–$10^{11}$ PFU/mL, so large dilutions are needed to reach a countable plate." },
        { text: "Add 0.1 mL of each of the last three dilutions to separate tubes of molten top agar, then add a few drops (about 0.2 mL) of log-phase host culture to each.", why: "Log-phase cells support efficient phage replication and grow into an even lawn." },
        { text: "Mix gently by rolling the tube, pour straight onto a base plate and tilt to cover the surface, then leave it flat until set.", why: "Working quickly stops the soft agar setting in the tube; rolling rather than shaking avoids bubbles that look like plaques." },
        { text: "Include a control plate of host bacteria with no phage.", why: "It shows the lawn grows evenly and that clear areas on the test plates are really caused by phage." },
        { text: "Incubate inverted at 37 °C overnight, then count plaques on plates with 30–300 plaques.", why: "Each plaque arises from one infectious particle, so counts in the countable range give a reliable titre in plaque-forming units (PFU)." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "After the 1:100 step you make five 1:10 dilutions. What is the dilution of the last tube, written as a dilution factor?",
          answer: 1e7,
          tolerance: 0.5,
          unit: "",
          working: "$100 \\times 10^{5} = 10^{7}$, so the last tube is a $10^{-7}$ dilution.",
        },
        {
          id: "d2",
          prompt: "0.1 mL of the $10^{-7}$ dilution gives 62 plaques. What is the titre of the stock in PFU/mL?",
          answer: 6.2e9,
          tolerance: 1e7,
          unit: "PFU/mL",
          working: "$62 / (0.1 \\times 10^{-7}) = 62 / 10^{-8} = 6.2 \\times 10^{9}$ PFU/mL. 62 plaques is within the 30–300 range.",
        },
        {
          id: "d3",
          prompt: "You want to add $2 \\times 10^{8}$ PFU to a culture. What volume of the $6.2 \\times 10^{9}$ PFU/mL stock do you need, in µL?",
          answer: 32.3,
          tolerance: 0.5,
          unit: "µL",
          working: "Volume $= 2 \\times 10^{8} / 6.2 \\times 10^{9} = 0.0323$ mL $= 32.3$ µL.",
        },
        {
          id: "d4",
          prompt: "Those $2 \\times 10^{8}$ PFU are added to $1 \\times 10^{8}$ bacteria. What is the multiplicity of infection (MOI)?",
          answer: 2,
          tolerance: 0.01,
          unit: "",
          working: "MOI = infectious particles ÷ host cells $= 2 \\times 10^{8} / 1 \\times 10^{8} = 2$.",
        },
        {
          id: "d5",
          prompt: "Phage infection follows a Poisson distribution, so the fraction of cells receiving no phage is $e^{-\\text{MOI}}$. At an MOI of 2, what percentage of cells stay uninfected?",
          answer: 13.5,
          tolerance: 0.3,
          unit: "%",
          working: "$e^{-2} = 0.135$, so about 13.5% of cells receive no phage, even though there are twice as many phages as cells.",
        },
      ],
      resultsGuide:
        "The no-phage control should show an even, slightly cloudy lawn with no clear areas. On test plates, plaques appear as round clear holes in the lawn and their number should fall about tenfold with each dilution. Plates with confluent lysis (no lawn left) are too concentrated; plates with fewer than 30 plaques have large sampling error. Bubbles, scratches or lumps of unmixed agar can mimic plaques, so look for a sharp edge and lawn around each one. If no lawn grew at all, the host culture was probably not viable or the top agar was too hot when the bacteria were added.",
    },
  ],

  cases: [
    {
      id: "mic-case-uti",
      title: "A student who can't stop running to the toilet",
      topic: "Antimicrobials & infection",
      setting: "Student health centre. Educational simulation with a fictional patient.",
      presentation:
        "Sam, a 20-year-old female college student, comes in with two days of burning when passing urine, needing to go very often, and sudden urges that are hard to hold. She looks well.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "Have you had a fever, shivers, or pain in your back or side?", good: true, feedback: "\"No fever, and my back's fine. It's just low down in my tummy.\" No features of pyelonephritis so far." },
            { text: "Any blood in your urine or change in its smell?", good: true, feedback: "\"It smells stronger than usual and looks a bit cloudy. I haven't seen blood.\"" },
            { text: "Any unusual vaginal discharge or itching?", good: true, feedback: "\"No.\" This makes vaginal infection or some sexually transmitted infections less likely as the cause of dysuria." },
            { text: "When was your last period, and could you be pregnant?", good: true, feedback: "\"Two weeks ago, and I don't think so.\" Pregnancy changes both risk and antibiotic choice, so it's important to know." },
            { text: "Have you had anything like this before?", good: true, feedback: "\"Once, about a year ago. It cleared with antibiotics.\"" },
            { text: "Which halls of residence do you live in?", good: false, feedback: "Friendly conversation, but it won't help you with the diagnosis." },
            { text: "Do you wear glasses?", good: false, feedback: "Not relevant to this presentation." },
          ],
          debrief:
            "Dysuria, frequency and urgency without vaginal symptoms point strongly to cystitis. Asking about fever, rigors and flank pain screens for pyelonephritis, and asking about pregnancy matters because it changes management.",
        },
        {
          title: "Examination",
          prompt: "What do you examine?",
          mode: "multi",
          options: [
            { text: "Temperature, heart rate and blood pressure", good: true, feedback: "Temperature 37.0 °C, HR 78, BP 116/72: normal." },
            { text: "Renal angle (costovertebral) tenderness", good: true, feedback: "No tenderness on either side." },
            { text: "Abdomen, including the suprapubic area", good: true, feedback: "Mild suprapubic tenderness; otherwise soft and non-tender." },
            { text: "Fundoscopy", good: false, feedback: "Normal, and not relevant to this presentation." },
            { text: "Neck lymph nodes", good: false, feedback: "No lymphadenopathy; it doesn't change your next step." },
          ],
          debrief:
            "Normal observations and no renal angle tenderness argue against pyelonephritis. Suprapubic tenderness fits bladder inflammation.",
        },
        {
          title: "Investigations",
          prompt: "Which tests do you request now?",
          mode: "multi",
          options: [
            { text: "Urine dipstick on a midstream sample", good: true, feedback: "Leukocyte esterase positive, nitrite positive, trace blood." },
            { text: "Midstream urine for microscopy, Gram stain and culture with sensitivities", good: true, feedback: "Gram stain shows Gram-negative rods. Culture later grows a significant count of E. coli; sensitivities follow." },
            { text: "Urine pregnancy test", good: true, feedback: "Negative." },
            { text: "CT scan of the abdomen and pelvis", good: false, feedback: "Unnecessary radiation and cost; nothing suggests a complicated or structural problem." },
            { text: "Blood cultures", good: false, feedback: "Not needed in a well, afebrile patient with a lower urinary tract infection." },
            { text: "Chest X-ray", good: false, feedback: "There are no chest symptoms; this won't explain the picture." },
          ],
          debrief:
            "A positive leukocyte esterase and nitrite with typical symptoms strongly suggests UTI. Culture confirms the organism and its antibiotic sensitivities, which matters for recurrent infections and treatment failure.",
        },
        {
          title: "Interpret the dipstick",
          prompt: "The dipstick is nitrite positive. What does that tell you?",
          mode: "single",
          options: [
            { text: "Bacteria that reduce nitrate to nitrite are present, typically Gram-negative rods such as E. coli", good: true, feedback: "Correct: Enterobacterales convert dietary nitrate in urine to nitrite." },
            { text: "White blood cells are present", good: false, feedback: "That is what leukocyte esterase detects." },
            { text: "The infection is in the kidney", good: false, feedback: "A dipstick can't locate the infection; fever and flank pain suggest kidney involvement." },
            { text: "Enterococcus is the likely cause", good: false, feedback: "Enterococcus usually doesn't produce nitrite." },
          ],
          debrief:
            "Nitrite is quite specific for bacteriuria with nitrate-reducing organisms, but a negative result doesn't exclude UTI. The Gram-negative rods on microscopy fit E. coli.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Acute uncomplicated cystitis (lower UTI) caused by E. coli", good: true, feedback: "Typical symptoms, a well afebrile young woman, nitrite and leukocyte esterase positive, and E. coli on culture." },
            { text: "Acute pyelonephritis", good: false, feedback: "There is no fever, rigors, flank pain or renal angle tenderness." },
            { text: "Vaginal thrush", good: false, feedback: "She has no discharge or itching, and the urine findings point to bacterial infection." },
            { text: "Kidney stone", good: false, feedback: "Stones cause severe colicky flank pain; that isn't the story here." },
          ],
          debrief:
            "Uropathogenic E. coli ascends from the perineum and attaches to the bladder lining with fimbriae. A short urethra makes this common in young women.",
        },
        {
          title: "Management principles",
          prompt: "What is the best overall approach (in a supervised clinical setting)?",
          mode: "single",
          options: [
            {
              text: "A clinician prescribes an antibiotic chosen from local guidelines and reviewed against culture sensitivities; encourage fluids; give safety-net advice to return urgently with fever, flank pain, vomiting or no improvement",
              good: true,
              feedback: "This treats the infection, uses local resistance data and culture results, and makes sure she knows the red flags for pyelonephritis.",
            },
            { text: "Take leftover antibiotics from a friend", good: false, feedback: "The drug may be wrong for the organism or for her, and incomplete courses encourage resistance." },
            { text: "Admit to hospital for intravenous broad-spectrum antibiotics", good: false, feedback: "Not needed for a well patient with cystitis, and unnecessary broad-spectrum use drives resistance." },
            { text: "Reassure and send home with no advice or follow-up", good: false, feedback: "She has a bacterial infection and needs treatment and clear advice on when to come back." },
          ],
          debrief:
            "Treatment choice and course length follow local guidelines, which reflect local resistance patterns. Specific drugs and doses are a clinician's decision. Red flags (fever, rigors, flank pain, vomiting) mean possible pyelonephritis and need prompt review.",
        },
      ],
      teachingPoints: [
        "Dysuria, frequency and urgency without vaginal symptoms in a young woman: think cystitis.",
        "Leukocyte esterase detects white cells; nitrite detects nitrate-reducing bacteria such as E. coli.",
        "Always screen for pyelonephritis: fever, rigors, flank pain, renal angle tenderness, vomiting.",
        "Culture and sensitivities guide treatment and support antibiotic stewardship.",
      ],
    },
    {
      id: "mic-case-pneumonia",
      title: "A cough with rusty sputum",
      topic: "Bacterial structure & staining",
      setting: "Emergency department. Educational simulation with a fictional patient.",
      presentation:
        "Graham, a 67-year-old retired teacher, has had three days of cough, fever and shivers. Today he is bringing up rust-coloured sputum and has a sharp pain on the right side of his chest when he breathes in.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "How did it start, and what does the sputum look like?", good: true, feedback: "\"It came on quite suddenly with shivers. The phlegm is thick and a rusty brown colour.\" A sudden onset with rusty sputum is classic for pneumococcal pneumonia." },
            { text: "Is the chest pain worse when you breathe in or cough?", good: true, feedback: "\"Yes, it catches me every time I take a deep breath.\" Pleuritic pain suggests inflammation reaching the pleura." },
            { text: "Do you smoke, or have any lung or heart conditions?", good: true, feedback: "\"I gave up smoking ten years ago. No lung problems that I know of.\"" },
            { text: "Have you travelled or stayed in a hotel recently?", good: true, feedback: "\"No, I've been at home.\" Recent travel and hotel stays raise the possibility of Legionella." },
            { text: "Are you allergic to any antibiotics?", good: true, feedback: "\"Not that I know of.\" Allergy history matters before any antibiotic is chosen." },
            { text: "Which football team do you support?", good: false, feedback: "Friendly, but it won't help the diagnosis." },
            { text: "What is your shoe size?", good: false, feedback: "Not relevant to this presentation." },
          ],
          debrief:
            "Fever, rigors, productive cough with rusty sputum and pleuritic pain point to lobar pneumonia. Travel, smoking and allergy history shape the list of likely organisms and the treatment.",
        },
        {
          title: "Examination",
          prompt: "What do you examine?",
          mode: "multi",
          options: [
            { text: "Temperature, heart rate, respiratory rate, blood pressure and oxygen saturation", good: true, feedback: "Temperature 38.7 °C, HR 104, RR 24, BP 128/76, SpO2 93% on air." },
            { text: "Mental state: is he confused?", good: true, feedback: "Alert and fully oriented in time, place and person." },
            { text: "Chest: percussion and auscultation", good: true, feedback: "Dull to percussion with bronchial breathing and coarse crackles at the right base." },
            { text: "Fundoscopy", good: false, feedback: "Normal, and not relevant here." },
            { text: "Knee and ankle reflexes", good: false, feedback: "Normal; they don't help with a chest infection." },
          ],
          debrief:
            "Dullness, bronchial breathing and crackles over one area are signs of consolidation. Confusion, respiratory rate and blood pressure feed into severity scores such as CURB-65.",
        },
        {
          title: "Investigations",
          prompt: "Which tests do you request now?",
          mode: "multi",
          options: [
            { text: "Chest X-ray", good: true, feedback: "Dense consolidation in the right lower lobe with an air bronchogram." },
            { text: "Sputum for Gram stain and culture, sent before antibiotics are started", good: true, feedback: "Purulent sample sent to the lab; the Gram stain result comes back within the hour." },
            { text: "Blood cultures", good: true, feedback: "Two sets taken. One later grows the same organism as the sputum." },
            { text: "Full blood count, urea and electrolytes, and CRP", good: true, feedback: "White cell count raised with a neutrophilia, urea 6.1 mmol/L, CRP markedly raised." },
            { text: "Lumbar puncture", good: false, feedback: "There are no features of meningitis; an LP has risks and won't help here." },
            { text: "Stool culture", good: false, feedback: "He has no bowel symptoms." },
          ],
          debrief:
            "The chest X-ray confirms consolidation. Sputum and blood cultures are best taken before antibiotics, but must never delay treatment in a sick patient. The urea is needed for the severity score.",
        },
        {
          title: "Interpret the Gram stain",
          prompt: "The sputum Gram stain shows many neutrophils and lancet-shaped Gram-positive diplococci. Which organism does this most suggest?",
          mode: "single",
          options: [
            { text: "Streptococcus pneumoniae", good: true, feedback: "Correct: pneumococci are Gram-positive, lancet-shaped cocci in pairs, often with a visible capsule." },
            { text: "Staphylococcus aureus", good: false, feedback: "Staphylococci are Gram-positive cocci in grape-like clusters, not pairs." },
            { text: "Haemophilus influenzae", good: false, feedback: "H. influenzae is a small Gram-negative coccobacillus, so it would stain pink." },
            { text: "Moraxella catarrhalis", good: false, feedback: "Moraxella is a Gram-negative diplococcus: right arrangement, wrong colour." },
          ],
          debrief:
            "Colour (purple or pink), shape (cocci or rods) and arrangement (pairs, chains or clusters) together narrow the list fast. The thick Gram-positive wall holds crystal violet; the polysaccharide capsule is pneumococcus's main virulence factor and the target of pneumococcal vaccines.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Community-acquired pneumonia caused by Streptococcus pneumoniae", good: true, feedback: "Typical history, focal consolidation on examination and X-ray, and Gram-positive diplococci in sputum and blood." },
            { text: "Pulmonary embolism", good: false, feedback: "PE can cause pleuritic pain, but not fever with purulent rusty sputum and lobar consolidation." },
            { text: "Acute viral bronchitis", good: false, feedback: "Bronchitis doesn't cause consolidation, and the Gram stain shows bacteria." },
            { text: "Heart failure", good: false, feedback: "There is no history of heart disease, and the X-ray shows lobar consolidation rather than pulmonary oedema." },
          ],
          debrief:
            "S. pneumoniae is the commonest bacterial cause of community-acquired pneumonia. Bacteraemia, as here, is common in pneumococcal pneumonia.",
        },
        {
          title: "Management principles",
          prompt: "What is the best overall approach (in a supervised clinical setting)?",
          mode: "single",
          options: [
            {
              text: "Assess severity with a validated score such as CURB-65 plus clinical judgement; a clinician starts antibiotics promptly following local guidelines; give oxygen to target saturations; review when cultures and sensitivities return",
              good: true,
              feedback: "This treats a serious infection quickly, uses local resistance data, and allows a switch to a narrower antibiotic once sensitivities are known.",
            },
            { text: "Hold all antibiotics until the culture result is back in two days", good: false, feedback: "Delaying treatment in pneumonia worsens outcomes; cultures are taken first but don't hold up treatment." },
            { text: "Start an antiviral because most chest infections are viral", good: false, feedback: "The Gram stain and blood culture show a bacterial cause, which antivirals don't treat." },
            { text: "Send him home with advice to rest and no follow-up", good: false, feedback: "He has fever, tachycardia, low oxygen saturation and bacteraemia; he needs treatment and monitoring." },
          ],
          debrief:
            "Graham's CURB-65 score is 1 (age only), but his low oxygen saturation and bacteraemia still need clinical review. Drug choice and route follow local guidelines and are a clinician's decision. After recovery, pneumococcal vaccination is offered to people at higher risk, including older adults.",
        },
      ],
      teachingPoints: [
        "Sudden fever, rigors, rusty sputum and pleuritic pain: think pneumococcal lobar pneumonia.",
        "Read a Gram stain by colour, shape and arrangement: Gram-positive diplococci in sputum suggest S. pneumoniae.",
        "Take sputum and blood cultures before antibiotics when you can, but never delay treatment for them.",
        "Severity scores such as CURB-65 support, but don't replace, clinical judgement.",
      ],
    },
    {
      id: "mic-case-norovirus",
      title: "Vomiting spreads through a hospital bay",
      topic: "Viruses",
      setting: "Elderly care ward. Educational simulation with fictional patients.",
      presentation:
        "Margaret, an 81-year-old woman recovering on the ward after a hip operation, started vomiting suddenly overnight and has since had several episodes of watery diarrhoea. Two other patients in her six-bed bay developed similar symptoms this morning.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking (from Margaret and her notes).",
          mode: "multi",
          options: [
            { text: "How did it start, and is there any blood in the diarrhoea?", good: true, feedback: "\"It came on all of a sudden; I was sick across the floor. The diarrhoea is watery, no blood.\" Abrupt vomiting with non-bloody diarrhoea fits viral gastroenteritis." },
            { text: "Has she had antibiotics during this admission?", good: true, feedback: "The notes show a short course of antibiotics around the time of surgery. Recent antibiotics raise the possibility of Clostridioides difficile, so it must be tested for." },
            { text: "How much is she drinking, and how much urine is she passing?", good: true, feedback: "\"I can't keep anything down.\" The fluid chart shows very little urine overnight. Older adults dehydrate quickly." },
            { text: "Have any staff or visitors been unwell?", good: true, feedback: "Her daughter, who visited two days ago, mentioned her grandson had a 'tummy bug'. A healthcare assistant on the bay has also phoned in sick." },
            { text: "What were her hobbies before retirement?", good: false, feedback: "Good for rapport, but it won't help manage this outbreak." },
            { text: "What colour are her eyes?", good: false, feedback: "Not relevant to this presentation." },
          ],
          debrief:
            "Sudden vomiting and watery diarrhoea spreading quickly between patients and staff is the classic pattern of a norovirus outbreak. Recent antibiotics mean C. difficile must also be considered, and poor intake means dehydration is the main risk to Margaret.",
        },
        {
          title: "Examination",
          prompt: "What do you examine?",
          mode: "multi",
          options: [
            { text: "Temperature, heart rate and blood pressure", good: true, feedback: "Temperature 37.6 °C, HR 98, BP 112/68, lower than her usual readings on the chart." },
            { text: "Hydration: mucous membranes, capillary refill and fluid balance", good: true, feedback: "Dry mouth, capillary refill 3 seconds and a negative fluid balance over 12 hours: mild to moderate dehydration." },
            { text: "Abdomen", good: true, feedback: "Soft, mildly and diffusely tender, with active bowel sounds and no guarding." },
            { text: "Fundoscopy", good: false, feedback: "Not relevant to this presentation." },
            { text: "Thyroid examination", good: false, feedback: "No thyroid symptoms; it doesn't change your next step." },
          ],
          debrief:
            "A soft abdomen without guarding is reassuring. The key findings are signs of dehydration, which need correcting.",
        },
        {
          title: "Investigations",
          prompt: "Which tests do you request now?",
          mode: "multi",
          options: [
            { text: "Stool sample for norovirus PCR", good: true, feedback: "Norovirus RNA detected by RT-PCR. The other two patients' samples are also positive." },
            { text: "Stool sample for C. difficile testing", good: true, feedback: "Negative." },
            { text: "Urea, creatinine and electrolytes", good: true, feedback: "Creatinine above her baseline and potassium slightly low, in keeping with dehydration from vomiting and diarrhoea." },
            { text: "CT scan of the abdomen", good: false, feedback: "Unnecessary: the abdomen is soft and the picture fits an infective cause." },
            { text: "Sputum culture", good: false, feedback: "She has no chest symptoms." },
          ],
          debrief:
            "PCR is the standard test for norovirus, which can't be grown in routine culture. Testing for C. difficile in parallel matters because it is treated, and controlled, differently.",
        },
        {
          title: "Infection control",
          prompt: "Which infection prevention and control actions are appropriate now?",
          mode: "multi",
          options: [
            { text: "Inform the infection prevention and control team and close the bay to new admissions", good: true, feedback: "Early notification and closing the bay limit spread to other patients." },
            { text: "Isolate or cohort the affected patients, with gloves and aprons for contact", good: true, feedback: "Contact precautions reduce transfer on hands and clothing." },
            { text: "Use soap and water for hand hygiene rather than alcohol rub alone", good: true, feedback: "Norovirus is non-enveloped and resists alcohol; washing removes it physically." },
            { text: "Clean the environment with a chlorine-based (hypochlorite) disinfectant", good: true, feedback: "Norovirus survives on surfaces for days; chlorine-based agents inactivate it." },
            { text: "Ask unwell staff to stay off work until they have been symptom-free for 48 hours", good: true, feedback: "People shed virus for a time after symptoms settle, so returning too early spreads the outbreak." },
            { text: "Move Margaret to a different ward where there are free beds", good: false, feedback: "Moving infected patients carries the outbreak to a new ward." },
            { text: "Start antibiotics for everyone in the bay", good: false, feedback: "Norovirus is a virus; antibiotics won't help and add the risk of C. difficile." },
          ],
          debrief:
            "Norovirus has a very low infectious dose, spreads by the faecal–oral route, vomit aerosols and contaminated surfaces, and survives alcohol. Control rests on early recognition, isolation or cohorting, soap-and-water hand hygiene, chlorine-based cleaning and keeping unwell staff away.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Norovirus gastroenteritis as part of a ward outbreak", good: true, feedback: "Abrupt vomiting and diarrhoea, rapid spread between patients and staff, and a positive norovirus PCR." },
            { text: "Clostridioides difficile infection", good: false, feedback: "Recent antibiotics were a reasonable concern, but the C. difficile test is negative and the prominent vomiting fits norovirus." },
            { text: "Staphylococcus aureus food poisoning", good: false, feedback: "Toxin-mediated food poisoning comes from a shared food source and doesn't keep spreading from person to person." },
            { text: "Bowel obstruction after surgery", good: false, feedback: "She has watery diarrhoea, active bowel sounds and a soft abdomen, which argue against obstruction." },
          ],
          debrief:
            "Norovirus is the commonest cause of gastroenteritis outbreaks in hospitals and care homes. Illness usually lasts one to three days but can be serious in frail older people because of dehydration.",
        },
        {
          title: "Management principles",
          prompt: "What is the best overall approach for Margaret (in a supervised clinical setting)?",
          mode: "single",
          options: [
            {
              text: "Rehydrate, by mouth if tolerated or intravenously as decided by a clinician; monitor fluid balance and kidney function; ask a clinician to review medicines that could worsen dehydration or kidney injury; keep infection control measures in place",
              good: true,
              feedback: "Supportive care is the treatment: the illness is self-limiting, but dehydration and acute kidney injury are the dangers in older patients.",
            },
            { text: "Start an antibiotic to shorten the illness", good: false, feedback: "Antibiotics have no effect on a virus and raise the risk of C. difficile and resistance." },
            { text: "Start a specific antiviral for norovirus", good: false, feedback: "There is no licensed specific antiviral for norovirus; care is supportive." },
            { text: "Discharge her to her care home today to free up the bed", good: false, feedback: "She is dehydrated and still infectious; discharging her risks her health and seeds an outbreak in the care home." },
          ],
          debrief:
            "Management of norovirus is supportive. Specific fluids and any changes to medicines are a clinician's decision. Infection control continues until the bay has been clear of new cases for the period set by the infection prevention and control team, followed by a terminal clean.",
        },
      ],
      teachingPoints: [
        "Sudden vomiting and diarrhoea spreading through a ward: think norovirus and act on infection control straight away.",
        "Norovirus is non-enveloped, so alcohol rub is not enough; use soap and water and chlorine-based cleaning.",
        "Diagnose by stool PCR, and test for C. difficile in parallel when antibiotics have been given recently.",
        "Treatment is supportive: watch for dehydration and acute kidney injury in frail patients.",
      ],
    },
  ],

  skills: [
    {
      id: "mic-skill-aseptic",
      title: "Aseptic technique: streaking a culture plate",
      purpose: "Aseptic technique keeps you, your culture and the lab free of contamination and underpins every microbiology result.",
      items: [
        { text: "Wears a fastened lab coat, gloves and eye protection; ties back hair and performs hand hygiene", critical: true },
        { text: "Disinfects the bench with the approved disinfectant and leaves it for its contact time", critical: true },
        { text: "Labels the base of the plate with name, date, organism and medium" },
        { text: "Sets up close to the Bunsen updraught (or in a biosafety cabinet) with ethanol well away from the flame" },
        { text: "Flames the loop to red-hot along its whole length and lets it cool before touching the culture", critical: true },
        { text: "Removes the tube cap with the little finger, keeps it in hand, and flames the tube neck before and after sampling" },
        { text: "Lifts the plate lid only partly and keeps it over the agar while streaking" },
        { text: "Streaks in a quadrant pattern, flaming and cooling the loop between quadrants" },
        { text: "Re-flames the loop after use and incubates the plate inverted", critical: true },
        { text: "Discards waste in biohazard containers, disinfects the bench and performs hand hygiene", critical: true },
      ],
    },
    {
      id: "mic-skill-gram",
      title: "Performing and reading a Gram stain",
      purpose: "A correctly stained and read Gram film is often the first result that guides treatment of a serious infection.",
      items: [
        { text: "Wears a lab coat, gloves and eye protection and works on a disinfected bench", critical: true },
        { text: "Labels the slide and makes a thin, even smear with known Gram-positive and Gram-negative controls", critical: true },
        { text: "Air-dries the smear fully before heat-fixing it with brief passes through the flame" },
        { text: "Applies crystal violet for about 1 minute, then rinses gently with water" },
        { text: "Applies Gram's iodine for about 1 minute, then rinses" },
        { text: "Decolourises for only a few seconds until the run-off is nearly clear, then rinses at once", critical: true },
        { text: "Counterstains with safranin for about 1 minute, rinses and blots dry without rubbing" },
        { text: "Examines under the oil-immersion objective, starting at low power to find a good area" },
        { text: "Checks the controls stained correctly before reading the test smear", critical: true },
        { text: "Reports colour, shape and arrangement (e.g. Gram-positive cocci in clusters) and the presence of white cells" },
        { text: "Cleans oil from the objective, discards slides in the sharps or glass bin and performs hand hygiene" },
      ],
    },
    {
      id: "mic-skill-blood-culture",
      title: "Taking blood cultures",
      purpose: "Correctly taken blood cultures identify the organism causing sepsis; poor technique gives contaminated, misleading results.",
      items: [
        { text: "Introduces self, confirms patient identity (name and date of birth against the wristband) and gains consent", critical: true },
        { text: "Checks the request and whether antibiotics have been given, aiming to take cultures before the first dose without delaying treatment" },
        { text: "Performs hand hygiene and puts on an apron and gloves", critical: true },
        { text: "Uses a fresh venepuncture site rather than an existing cannula, unless the line is being inserted at that moment or line infection is suspected" },
        { text: "Removes the bottle caps and cleans each bottle top with an alcohol swab, letting it dry" },
        { text: "Cleans the skin with chlorhexidine in alcohol for about 30 seconds and lets it dry completely", critical: true },
        { text: "Does not touch the cleaned site again (aseptic non-touch technique)", critical: true },
        { text: "With a winged collection set, fills the aerobic bottle first, then the anaerobic bottle, so air in the tubing goes into the aerobic bottle" },
        { text: "Fills each bottle to the recommended volume marked on it, without overfilling" },
        { text: "Disposes of the needle immediately into a sharps bin", critical: true },
        { text: "Labels the bottles at the bedside, does not cover the barcodes, and sends them promptly to the lab without refrigerating" },
        { text: "Documents date, time, site and reason, performs hand hygiene and thanks the patient" },
      ],
    },
    {
      id: "mic-skill-hand-hygiene",
      title: "Hand hygiene: hand washing with soap and water",
      purpose: "Hands are the main route of spread for hospital-acquired infection, and soap and water is essential against spores and non-enveloped viruses.",
      items: [
        { text: "Is bare below the elbows, with rings (other than a plain band), watches and bracelets removed and nails short", critical: true },
        { text: "Chooses soap and water when hands are visibly soiled or after caring for patients with C. difficile or norovirus, and alcohol rub otherwise", critical: true },
        { text: "Wets hands with water and applies enough soap to cover all surfaces" },
        { text: "Rubs palm to palm, then right palm over the back of the left hand with fingers interlaced, and vice versa" },
        { text: "Rubs palm to palm with fingers interlaced, then backs of fingers against the opposite palm with fingers interlocked" },
        { text: "Rubs each thumb rotationally, clasped in the opposite palm" },
        { text: "Rubs the fingertips of each hand rotationally in the opposite palm" },
        { text: "Washes for about 40–60 seconds in total, covering all surfaces", critical: true },
        { text: "Rinses thoroughly and dries hands completely with a single-use towel" },
        { text: "Turns off the tap with the towel (or elbow) and discards the towel without touching the bin lid" },
      ],
    },
  ],
};
