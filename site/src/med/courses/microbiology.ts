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
  ],
};
