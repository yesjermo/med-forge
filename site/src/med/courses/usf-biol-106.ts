import type { Course } from "../types";

/** Original study content aligned with the University of San Francisco's BIOL 106 (Diversity of Life). */
export const usfBiol106: Course = {
  id: "usf-biol-106",
  code: "BIOL 106",
  title: "Diversity of Life",
  description:
    "Aligned with the University of San Francisco's BIOL 106 & 106L (Diversity of Life): evolution and natural selection, Hardy–Weinberg, phylogeny and the three domains, prokaryotes and viruses, protists, fungi and plants, animal body plans and basic ecology, with pearls for pre-med and pre-vet students on resistance, zoonoses, parasites, vectors and comparative anatomy. Topics are typical for the course; check your own syllabus. Not affiliated with or endorsed by USF.",
  topics: [
    "Evolution & natural selection",
    "Population genetics",
    "Phylogeny & classification",
    "Prokaryotes & viruses",
    "Protists, fungi & plants",
    "Animal diversity",
    "Ecology",
  ],

  concepts: [
    {
      slug: "b106-natural-selection",
      model: "dna",
      title: "Natural selection and the mechanisms of evolution",
      topic: "Evolution & natural selection",
      summary:
        "Evolution is a change in allele frequencies in a population over generations. Natural selection acts on heritable variation that already exists; mutation, genetic drift and gene flow also change allele frequencies.",
      body: `**Evolution** is a change in the allele frequencies of a **population** across generations. Individuals don't evolve; populations do.

**Natural selection** follows from four observations:
1. Individuals in a population **vary** in their traits.
2. Some of that variation is **heritable** (it has a genetic basis).
3. More offspring are produced than the environment can support, so there is **competition** for resources.
4. Individuals with traits that suit the environment **survive and reproduce more**, so their alleles become more common.

Selection doesn't create new variation; it sorts variation that **mutation** and **recombination** already produced. Mutations arise at random with respect to need: a drug doesn't cause the mutation that resists it, it only reveals and favours it.

**Other mechanisms that change allele frequencies**
- **Mutation**: the ultimate source of new alleles
- **Genetic drift**: random change, strongest in small populations. **Bottlenecks** (a population crash) and the **founder effect** (a few individuals start a new population) are special cases.
- **Gene flow**: movement of alleles between populations by migration
- **Non-random mating**, including sexual selection

**Modes of selection**
- **Directional**: one extreme is favoured (e.g. bacteria with higher antibiotic tolerance)
- **Stabilising**: intermediate values are favoured (e.g. human birth weight)
- **Disruptive**: both extremes are favoured over the middle

**Evidence for evolution** includes the fossil record, **homologous structures** (same origin, possibly different function, such as the forelimb bones of humans, bats, whales and horses), **vestigial structures**, comparative embryology, biogeography and, most powerfully, DNA and protein sequence comparisons. **Analogous structures** (insect and bird wings) look alike because of **convergent evolution**, not shared ancestry.

**Fitness** means relative reproductive success: the number of offspring an individual contributes to the next generation compared with others.`,
      pearls: [
        "Antibiotic resistance is natural selection you can watch: the drug kills susceptible bacteria and leaves the rare resistant ones to multiply, so unnecessary or incomplete courses speed resistance up.",
        "HIV is treated with combinations of drugs because a mutant resistant to one drug is common in a large viral population, but a single virus resistant to three at once is very rare.",
        "Founder effects explain why some recessive diseases are more common in particular communities, such as Tay–Sachs disease in Ashkenazi Jewish populations.",
        "Livestock dewormers and flea treatments select for resistant parasites in exactly the same way, which is why vets now test and treat selectively rather than deworming whole herds on a schedule.",
      ],
    },
    {
      slug: "b106-hardy-weinberg",
      title: "Hardy–Weinberg equilibrium",
      topic: "Population genetics",
      summary:
        "In a large, randomly mating population with no mutation, migration or selection, allele frequencies p and q stay constant and genotype frequencies are p², 2pq and q².",
      formulas: ["p + q = 1", "p^2 + 2pq + q^2 = 1", "p = \\dfrac{2N_{AA} + N_{Aa}}{2N}"],
      body: `For a gene with two alleles, let $p$ be the frequency of the dominant allele $A$ and $q$ the frequency of the recessive allele $a$:

$$ p + q = 1 $$

If mating is random, gametes combine like random draws, so the genotype frequencies in the next generation are:

$$ p^2 \\;(AA) \\; + \\; 2pq \\;(Aa) \\; + \\; q^2 \\;(aa) = 1 $$

**The five conditions for equilibrium**
1. No mutation
2. Random mating
3. No natural selection
4. A very large population (no genetic drift)
5. No gene flow (no migration in or out)

When a real population departs from these genotype frequencies, at least one condition is being broken, which tells you evolution is happening at that gene.

**Finding allele frequencies from genotype counts**: count alleles, not people. Each individual carries two copies:

$$ p = \\frac{2N_{AA} + N_{Aa}}{2N} $$

Example: 1,000 people with 490 AA, 420 Aa and 90 aa. Allele $a$ count $= 2 \\times 90 + 420 = 600$ of $2{,}000$, so $q = 0.3$ and $p = 0.7$.

**Working from a recessive phenotype**: only $aa$ individuals show a recessive trait, so their frequency is $q^2$. Take the square root to get $q$, then $p = 1 - q$, then carriers $= 2pq$.

Example: a recessive disease affects 1 in 2,500 births. $q^2 = 0.0004$, $q = 0.02$, $p = 0.98$, and carriers $= 2 \\times 0.98 \\times 0.02 \\approx 0.039$, about 1 person in 25.

Notice how much more common carriers are than affected people: most copies of a rare recessive allele are hidden in heterozygotes, where selection can't see them.`,
      pearls: [
        "Genetic counsellors use 2pq to estimate the chance that a partner with no family history carries a recessive allele, for example for cystic fibrosis.",
        "The sickle-cell allele stays common where malaria is endemic because heterozygotes are partly protected from severe malaria: heterozygote advantage is a kind of selection that breaks Hardy–Weinberg.",
        "Purebred dog and cat breeds come from small founder populations with a lot of inbreeding, so recessive diseases are far more common in some breeds than in mixed-breed animals; breed DNA tests use the same carrier logic.",
      ],
    },
    {
      slug: "b106-tree-of-life",
      model: "cell",
      title: "Phylogeny, classification and the three domains",
      topic: "Phylogeny & classification",
      summary:
        "Phylogenetic trees show hypothesised common ancestry. Life is grouped into three domains: Bacteria, Archaea and Eukarya. Mitochondria and chloroplasts descend from bacteria taken up by an ancestral eukaryotic cell.",
      body: `**Classification**: the Linnaean ranks run domain, kingdom, phylum, class, order, family, genus, species. A scientific name is the **binomial** genus + species, written in italics with a capital genus: *Escherichia coli*, *Homo sapiens*, *Felis catus*.

**Reading a phylogenetic tree**
- Tips are living groups; each **node** (branch point) is a common ancestor
- Relatedness is read from the **most recent common ancestor**, not from how close two tips sit on the page; branches can rotate around a node without changing the tree
- A **clade** (monophyletic group) is an ancestor and *all* its descendants. "Reptiles" without birds is **paraphyletic**, because birds descend from the same ancestor as crocodiles.
- Trees are built from **shared derived characters** (synapomorphies), today mostly DNA sequences such as small-subunit ribosomal RNA

**The three domains** (from Carl Woese's rRNA comparisons)
- **Bacteria**: prokaryotes with peptidoglycan cell walls and ester-linked membrane lipids
- **Archaea**: prokaryotes without peptidoglycan, with ether-linked lipids; many live in extreme heat, salt or acid, but many also live in soil, oceans and animal guts. Their transcription and translation machinery resembles that of eukaryotes.
- **Eukarya**: cells with a nucleus and membrane-bound organelles: protists, fungi, plants and animals

On the rRNA tree, Archaea and Eukarya share a more recent common ancestor with each other than either does with Bacteria.

**Endosymbiosis**: **mitochondria** descend from an engulfed alphaproteobacterium and **chloroplasts** from a cyanobacterium. Evidence: both have their own circular DNA, divide by a fission-like process, have double membranes and carry bacterial-type 70S ribosomes.

**Viruses** are not placed in any domain: they are not cells and can only replicate inside a host cell.`,
      pearls: [
        "Because mitochondria have bacteria-like ribosomes, some antibiotics that target bacterial ribosomes can also affect mitochondria, one explanation for side effects such as aminoglycoside hearing loss in people with certain mitochondrial rRNA variants.",
        "No archaeon is an established cause of human disease, although methane-producing archaea are normal members of the human and ruminant gut.",
        "Sequencing the 16S rRNA gene lets clinical labs identify bacteria that are hard to culture, using the same molecule Woese used to discover Archaea.",
      ],
    },
    {
      slug: "b106-prokaryotes",
      model: "bacterium",
      title: "Prokaryote diversity and horizontal gene transfer",
      topic: "Prokaryotes & viruses",
      summary:
        "Prokaryotes reproduce by binary fission, come in a few basic shapes, and share genes sideways by transformation, transduction and conjugation, which is how resistance spreads between species.",
      body: `Prokaryotes are small (typically 1–5 µm), lack a nucleus and membrane-bound organelles, and usually carry one circular chromosome plus optional **plasmids**.

**Basic shapes**: **cocci** (spheres), **bacilli** (rods) and **spiral** forms, including the corkscrew **spirochetes** such as *Borrelia* (Lyme disease) and *Treponema* (syphilis).

**Structures worth knowing**
- **Cell wall** of peptidoglycan (Bacteria only); Gram-positive thick, Gram-negative thin with an outer membrane
- **Capsule**: slippery layer that resists phagocytosis
- **Fimbriae/pili** for attachment; a **sex pilus** for conjugation
- **Flagella** for movement
- **Endospores** (e.g. *Bacillus*, *Clostridium*): dormant, highly resistant forms

**Metabolic diversity** is huge: photoautotrophs (cyanobacteria), chemoautotrophs (nitrifying bacteria) and chemoheterotrophs (most pathogens). Prokaryotes drive the nitrogen cycle: nitrogen-fixing bacteria in legume root nodules turn N₂ into ammonia that plants can use.

**Reproduction and genetic variation**: binary fission is asexual, so variation comes from mutation plus **horizontal gene transfer**:
- **Transformation**: taking up naked DNA from the environment
- **Transduction**: a bacteriophage carries DNA from one bacterium to another
- **Conjugation**: direct transfer, usually of a plasmid, through a sex pilus

Because a single plasmid can carry several resistance genes, one conjugation event can make a bacterium resistant to several antibiotic classes at once, even across species.`,
      pearls: [
        "Resistance genes on plasmids (for example genes for extended-spectrum β-lactamases or carbapenemases) can jump between E. coli, Klebsiella and other gut bacteria, which is why hospitals track resistant organisms and not just individual infections.",
        "Antibiotics used in food animals select for resistant bacteria and resistance genes that can reach people through food, the environment or direct contact; this shared problem is a core One Health issue.",
        "Most bacteria are harmless or helpful: the gut microbiota of humans, and the rumen microbes that let cattle digest cellulose, are prokaryote communities.",
      ],
    },
    {
      slug: "b106-viruses-zoonoses",
      model: "virus",
      title: "Viruses, host range and zoonoses",
      topic: "Prokaryotes & viruses",
      summary:
        "Viruses are acellular genetic parasites: a DNA or RNA genome in a protein capsid, sometimes inside an envelope. Host range depends on matching host receptors, and many human infections are zoonoses that cross from animals.",
      body: `A **virus** is a genome (DNA or RNA, single- or double-stranded) inside a protein **capsid**, sometimes wrapped in a lipid **envelope** taken from the host cell. Viruses have no ribosomes and no metabolism of their own, so they can only replicate inside a living host cell.

**Host range** is set mainly by whether a virus's attachment proteins fit receptors on the host cell. Some viruses infect one species; others, such as rabies virus, can infect essentially any mammal.

**Bacteriophages** infect bacteria. In the **lytic cycle** they replicate and burst the cell; in the **lysogenic cycle** their genome integrates and is copied along with the host's until it is triggered to go lytic.

**RNA viruses mutate fast** because their polymerases lack proofreading, so they evolve quickly. Influenza shows two kinds of change:
- **Antigenic drift**: gradual point mutations in surface proteins, which is why the vaccine is updated each year
- **Antigenic shift**: reassortment of genome segments when two strains infect the same cell, for example in a pig or bird; this can create a new subtype that few people are immune to

**Zoonoses** are infections that pass naturally between vertebrate animals and humans. Roughly 60% of known human infectious diseases are zoonotic, and about three-quarters of newly emerging ones are. Examples:
- **Rabies**: transmitted mainly by bites; bats are an important reservoir in the United States, dogs worldwide
- **Influenza A**: wild waterbirds are the natural reservoir
- **HIV**: crossed into humans from simian immunodeficiency viruses of chimpanzees and other primates
- **West Nile virus**: birds are the reservoir and mosquitoes the vector; humans and horses are dead-end hosts

**Prions** are infectious misfolded proteins with no nucleic acid, the cause of bovine spongiform encephalopathy ("mad cow disease") and its human variant.`,
      pearls: [
        "Rabies is almost always fatal once symptoms start, but prompt wound care and post-exposure prophylaxis after a bite or bat exposure prevent it, so the exposure history is what matters.",
        "Vaccinating dogs, cats and ferrets against rabies protects people too: veterinary vaccination is public health.",
        "Horses get West Nile virus but, like people, rarely pass it on; a sick horse is a sentinel that the virus is circulating locally.",
        "Antibiotics don't work on viruses because viruses lack the bacterial cell wall and 70S ribosomes those drugs target.",
      ],
    },
    {
      slug: "b106-protists-fungi-plants",
      title: "Protists, fungi and plants",
      topic: "Protists, fungi & plants",
      summary:
        "Protists are a diverse, non-monophyletic collection of mostly single-celled eukaryotes, including major parasites. Fungi are heterotrophs with chitin walls and ergosterol membranes, more closely related to animals than to plants. Plants evolved from green algae and conquered land in stages.",
      body: `**Protists** are all eukaryotes that aren't plants, fungi or animals, so they don't form a single clade. Medically important groups include:
- **Apicomplexans** (parasites with an apical complex for invading cells): *Plasmodium* (malaria, carried by *Anopheles* mosquitoes) and *Toxoplasma gondii* (cats are the definitive host)
- **Kinetoplastids**: *Trypanosoma brucei* (African sleeping sickness, tsetse fly), *Trypanosoma cruzi* (Chagas disease, triatomine "kissing" bugs) and *Leishmania* (sand flies)
- **Diplomonads**: *Giardia*, a flagellated gut parasite spread in contaminated water
- **Amoebae**: *Entamoeba histolytica* causes amoebic dysentery
Photosynthetic protists such as diatoms and dinoflagellates produce a large share of Earth's oxygen; some dinoflagellates cause toxic "red tides".

**Fungi** are heterotrophs that absorb food after digesting it externally. Key features:
- Cell walls of **chitin**; membranes contain **ergosterol** instead of cholesterol
- Bodies made of **hyphae** forming a **mycelium**, or single-celled **yeasts**
- Ecological roles as decomposers and as **mycorrhizal** partners of most plant roots
Fungi and animals are **opisthokonts**: they share a more recent common ancestor with each other than with plants.

**Plants** evolved from charophyte green algae. Major steps onto land:
1. **Bryophytes** (mosses, liverworts): no vascular tissue, need water for sperm to swim; the haploid gametophyte is the dominant stage
2. **Seedless vascular plants** (ferns): xylem and phloem; the diploid sporophyte dominates
3. **Gymnosperms** (conifers): seeds and pollen, no flowers ("naked seeds")
4. **Angiosperms**: flowers and fruit; the largest plant group

All plants show **alternation of generations** between a multicellular haploid gametophyte and a multicellular diploid sporophyte.`,
      pearls: [
        "Pregnant people are advised to let someone else clean the cat's litter box, because Toxoplasma oocysts shed in cat faeces can infect the fetus.",
        "Antifungal drugs exploit ergosterol (azoles block its synthesis; amphotericin B binds it), but because fungi are close relatives of animals there are few truly fungus-specific targets, so antifungals tend to have more side effects than antibacterials.",
        "Many drugs come from plants: aspirin's ancestor salicin from willow bark, digoxin from foxglove, paclitaxel from the Pacific yew, quinine from cinchona bark and artemisinin from sweet wormwood.",
        "Lilies (Lilium and Hemerocallis species) can cause acute kidney injury in cats from tiny exposures, even pollen groomed off the fur; plant toxicology differs sharply between species.",
      ],
    },
    {
      slug: "b106-animal-body-plans",
      title: "Animal body plans and comparative anatomy",
      topic: "Animal diversity",
      summary:
        "Animal phyla are sorted by tissues, symmetry, germ layers, body cavity and embryonic development. Comparing body plans explains parasite biology and why anatomy, physiology and drug handling differ between species.",
      body: `Animals are multicellular heterotrophs whose cells lack walls; almost all develop from a blastula.

**Key branch points**
- **True tissues**: sponges (Porifera) lack them; all other animals have them
- **Symmetry**: **radial** in cnidarians (jellyfish, corals; two germ layers, *diploblastic*) vs **bilateral** in bilaterians, which have three germ layers (*triploblastic*: ectoderm, mesoderm, endoderm)
- **Body cavity**:
  - **Acoelomate**: no cavity, e.g. flatworms (Platyhelminthes: tapeworms, flukes)
  - **Pseudocoelomate**: cavity not fully lined by mesoderm, e.g. roundworms (Nematoda)
  - **Coelomate**: true coelom lined by mesoderm, e.g. annelids, molluscs, arthropods, echinoderms, chordates
- **Development**: in **protostomes** the first opening (blastopore) becomes the mouth; in **deuterostomes** (echinoderms and chordates) it becomes the anus

Protostomes split into **Lophotrochozoa** (flatworms, annelids, molluscs) and **Ecdysozoa**, which moult (nematodes, arthropods).

**Chordates** have, at some stage, a notochord, a dorsal hollow nerve cord, pharyngeal slits or pouches and a post-anal tail. Vertebrates add a backbone; tetrapods add four limbs; amniotes (reptiles, birds, mammals) add the amniotic egg.

**Parasites and vectors across the tree**
- **Flatworms**: tapeworms (*Taenia*, *Echinococcus*) and flukes (*Schistosoma*)
- **Nematodes**: *Ascaris*, hookworms, pinworms, heartworm (*Dirofilaria immitis*) in dogs and cats
- **Arthropods**: insects and ticks are the major **vectors**; mosquitoes carry malaria and West Nile virus, ticks carry *Borrelia*

**Comparative anatomy that matters in clinic**
- **Ruminants** (cattle, sheep, goats) have a four-compartment stomach (rumen, reticulum, omasum and the true stomach, the abomasum) where microbes ferment cellulose
- **Horses** are hindgut fermenters with a large caecum and very rarely vomit, so gas or obstruction shows up as colic
- **Birds** breathe through rigid lungs ventilated by air sacs, giving one-way airflow
- **Cats** are obligate carnivores, need dietary taurine and have limited glucuronidation in the liver, so some drugs that are safe in people (such as paracetamol/acetaminophen) are toxic to them`,
      pearls: [
        "Heartworm is a nematode spread by mosquitoes; dogs in areas where it occurs are kept on preventives, and cats can be infected too.",
        "Echinococcus tapeworms cycle between dogs and livestock, and humans who swallow the eggs from dog faeces can develop hydatid cysts in the liver or lung.",
        "Ecdysozoans moult a cuticle, which is why some antiparasitic drugs act on nerve and muscle channels found in nematodes and arthropods but not in mammals.",
        "Drug metabolism differs between species, so a medicine safe for a person, dog or horse is not automatically safe for a cat; never extrapolate across species without checking.",
      ],
    },
    {
      slug: "b106-ecology",
      title: "Ecology basics and One Health",
      topic: "Ecology",
      summary:
        "Populations grow exponentially until resources limit them (logistic growth toward carrying capacity K). Energy passes up food chains with roughly 10% transfer per level, and species interactions shape how pathogens move between wildlife, domestic animals and people.",
      formulas: ["\\dfrac{dN}{dt} = rN", "\\dfrac{dN}{dt} = rN\\left(1 - \\dfrac{N}{K}\\right)", "E_{n+1} \\approx 0.1\\,E_n"],
      body: `**Levels of organisation**: individual, population (one species in one area), community (all species interacting), ecosystem (community plus physical environment), biosphere.

**Population growth**
- **Exponential**: with unlimited resources, growth rate is proportional to size:
$$ \\frac{dN}{dt} = rN $$
- **Logistic**: growth slows as the population nears the **carrying capacity** $K$:
$$ \\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right) $$
Growth is fastest at $N = K/2$.

**Energy flow**: producers (photosynthesisers) → primary consumers (herbivores) → secondary consumers → tertiary consumers. Only about **10%** of the energy at one trophic level is stored in the next; the rest is lost mainly as heat from respiration. So food chains are short, and top predators are few.

**Biomagnification**: persistent fat-soluble toxins such as methylmercury become more concentrated at each trophic level, so large predatory fish carry the most.

**Species interactions**
- **Mutualism** (+/+): mycorrhizae; rumen microbes and cattle
- **Commensalism** (+/0)
- **Parasitism** (+/−): the parasite lives on or in a host
- **Predation** (+/−) and **competition** (−/−)

**Transmission ecology**
- A **reservoir** maintains a pathogen in nature, often without disease
- A **vector** is a living carrier, usually an arthropod, that transmits it between hosts
- A **definitive host** hosts the parasite's sexual stage; an **intermediate host** the larval or asexual stage
- A **dead-end host** can be infected but doesn't pass the pathogen on

**One Health** is the idea that human, animal and environmental health are linked and should be managed together: land use, climate, wildlife and livestock all shape where zoonoses and vectors appear.`,
      pearls: [
        "Lyme disease risk depends on ecology: Ixodes ticks pick up Borrelia from small mammal reservoirs such as white-footed mice, and adult ticks feed and mate on deer.",
        "Pregnant people are advised to limit high-mercury predatory fish such as shark and swordfish because of biomagnification.",
        "Vector control (removing standing water for mosquitoes, tick checks after outdoor work) often prevents more disease than treating cases once they happen.",
      ],
    },
  ],

  lectures: [
    {
      id: "b106-l1",
      week: 2,
      title: "Natural selection and population genetics",
      topic: "Evolution & natural selection",
      summary: "How natural selection, drift, mutation and gene flow change allele frequencies, and how Hardy–Weinberg gives the baseline to detect that change.",
      notes: `- Evolution = change in allele frequencies in a population over generations
- Selection needs heritable variation, overproduction and differential reproduction
- Mutation is random with respect to need; selection sorts variation that already exists
- Drift is strongest in small populations (bottleneck, founder effect)
- Hardy–Weinberg: $p + q = 1$ and $p^2 + 2pq + q^2 = 1$
- Five conditions: no mutation, random mating, no selection, large population, no gene flow
- Count alleles (two per person) when finding $p$ and $q$ from genotype counts`,
      insights: [
        { type: "exam_tip", text: "If a question gives the frequency of a recessive phenotype, that number is q², not q. Take the square root first.", conceptSlug: "b106-hardy-weinberg" },
        { type: "clinical_link", text: "An antibiotic doesn't cause resistance mutations; it selects for resistant cells that were already there. That's why finishing an appropriate course and avoiding unneeded antibiotics both matter.", conceptSlug: "b106-natural-selection" },
        { type: "intuition", text: "Hardy–Weinberg is the 'nothing is happening' null model: like a fair coin, it tells you what to expect so you can spot when something (selection, drift, migration) is pushing the numbers.", conceptSlug: "b106-hardy-weinberg" },
      ],
    },
    {
      id: "b106-l2",
      week: 5,
      title: "The tree of life: domains, microbes, protists and fungi",
      topic: "Phylogeny & classification",
      summary: "Reading phylogenetic trees, the three domains, endosymbiosis, prokaryote diversity and gene transfer, viruses, and the major protist and fungal groups that matter in medicine.",
      notes: `- Relatedness = most recent common ancestor; branches can rotate around nodes
- Clade = ancestor + all descendants (monophyletic)
- Bacteria, Archaea, Eukarya; Archaea and Eukarya are sister groups on the rRNA tree
- Mitochondria from alphaproteobacteria, chloroplasts from cyanobacteria
- Horizontal gene transfer: transformation, transduction, conjugation
- Viruses: not cells, not in a domain; host range set by receptors
- Protists: Plasmodium, Toxoplasma, trypanosomes, Giardia
- Fungi: chitin walls, ergosterol membranes, opisthokonts with animals`,
      insights: [
        { type: "exam_tip", text: "On a tree, don't judge relatedness by which tips are next to each other; trace back to the shared node.", conceptSlug: "b106-tree-of-life" },
        { type: "clinical_link", text: "Fungi are our evolutionary cousins, so drugs that kill them are harder to make selective than antibacterials.", conceptSlug: "b106-protists-fungi-plants" },
        { type: "clinical_link", text: "Conjugative plasmids can move multidrug resistance between different bacterial species in a single step.", conceptSlug: "b106-prokaryotes" },
        { type: "intuition", text: "Your mitochondria are domesticated bacteria; that one idea explains their own DNA, double membrane and 70S ribosomes.", conceptSlug: "b106-tree-of-life" },
      ],
    },
    {
      id: "b106-l3",
      week: 9,
      title: "Animal diversity, ecology and One Health",
      topic: "Animal diversity",
      summary: "Animal body plans from sponges to chordates, parasites and vectors across the tree, comparative anatomy for clinicians, and the ecology of disease transmission.",
      notes: `- Branch points: tissues, symmetry, germ layers, body cavity, protostome vs deuterostome
- Acoelomate flatworms, pseudocoelomate nematodes, coelomate annelids → chordates
- Chordate features: notochord, dorsal hollow nerve cord, pharyngeal slits, post-anal tail
- Vectors are mostly arthropods; reservoirs maintain pathogens in nature
- Logistic growth toward carrying capacity K; ~10% energy transfer per trophic level
- One Health: human, animal and environmental health are linked`,
      insights: [
        { type: "exam_tip", text: "Deuterostome = 'second mouth': the blastopore becomes the anus. Echinoderms and chordates are deuterostomes.", conceptSlug: "b106-animal-body-plans" },
        { type: "clinical_link", text: "Species differences in anatomy and liver enzymes mean doses and even drug choices can't simply be copied between humans, dogs, cats and horses.", conceptSlug: "b106-animal-body-plans" },
        { type: "clinical_link", text: "Asking where someone lives, works and travels, and what animals they're around, is how clinicians spot zoonoses and vector-borne infections.", conceptSlug: "b106-ecology" },
        { type: "intuition", text: "The 10% rule is why a field of grain feeds many more people than the cattle fed on that grain.", conceptSlug: "b106-ecology" },
      ],
    },
  ],

  questions: [
    {
      id: "b106-q1",
      type: "mcq",
      topic: "Evolution & natural selection",
      difficulty: 1,
      prompt: "A patient's Staphylococcus aureus infection becomes resistant during repeated antibiotic courses. Which statement best describes what happened?",
      options: [
        "The antibiotic caused the bacteria to mutate in a useful direction",
        "Individual bacteria learned to tolerate the drug and passed that on",
        "Resistant variants already present, or arising by random mutation or gene transfer, survived the drug and multiplied",
        "The patient's immune system became resistant to the antibiotic",
      ],
      answer: 2,
      hints: ["Does the environment direct which mutations happen?", "Selection acts on variation that already exists."],
      explanation:
        "Mutations arise at random with respect to need, and resistance genes can also arrive by horizontal gene transfer. The antibiotic kills susceptible cells, so the resistant ones leave more descendants: directional natural selection. Acquired 'learning' isn't inherited, and it's the bacteria, not the patient, that become resistant.",
      concepts: ["b106-natural-selection"],
    },
    {
      id: "b106-q2",
      type: "numeric",
      topic: "Population genetics",
      difficulty: 2,
      prompt: "In a population in Hardy–Weinberg equilibrium, an autosomal recessive disease affects 1 in 2,500 newborns. What percentage of the population are heterozygous carriers?",
      answer: 3.92,
      tolerance: 0.05,
      unit: "%",
      hints: ["Affected people are aa, so 1/2,500 = q².", "q = √0.0004 = 0.02; carriers = 2pq."],
      explanation:
        "$q^2 = 1/2{,}500 = 0.0004$, so $q = 0.02$ and $p = 0.98$. Carriers $= 2pq = 2 \\times 0.98 \\times 0.02 = 0.0392$, or 3.92% (about 1 in 25).",
      concepts: ["b106-hardy-weinberg"],
    },
    {
      id: "b106-q3",
      type: "numeric",
      topic: "Population genetics",
      difficulty: 1,
      prompt: "A sample of 1,000 people contains 490 AA, 420 Aa and 90 aa individuals. What is the frequency of allele a?",
      answer: 0.3,
      tolerance: 0.005,
      unit: "",
      hints: ["Count alleles, not people: there are 2,000 alleles in total.", "Each aa person has two a alleles; each Aa person has one."],
      explanation:
        "a alleles $= 2 \\times 90 + 420 = 600$. $q = 600 / 2{,}000 = 0.3$ (and $p = 0.7$). These counts match $p^2 = 0.49$, $2pq = 0.42$, $q^2 = 0.09$, so the sample fits Hardy–Weinberg.",
      concepts: ["b106-hardy-weinberg"],
    },
    {
      id: "b106-q4",
      type: "numeric",
      topic: "Population genetics",
      difficulty: 2,
      prompt: "In a herd of 500 cattle in Hardy–Weinberg equilibrium, 16% show a recessive coat trait. How many cattle would you expect to be heterozygous?",
      answer: 240,
      tolerance: 0.5,
      unit: "animals",
      hints: ["The recessive phenotype frequency is q² = 0.16.", "q = 0.4, p = 0.6; heterozygotes = 2pq × 500."],
      explanation:
        "$q = \\sqrt{0.16} = 0.4$, $p = 0.6$. $2pq = 2 \\times 0.6 \\times 0.4 = 0.48$. Expected heterozygotes $= 0.48 \\times 500 = 240$ animals.",
      concepts: ["b106-hardy-weinberg"],
    },
    {
      id: "b106-q5",
      type: "mcq",
      topic: "Population genetics",
      difficulty: 1,
      prompt: "Which of these is NOT one of the conditions for Hardy–Weinberg equilibrium?",
      options: [
        "No net mutation",
        "Random mating",
        "A very large population",
        "Heterozygotes have higher fitness than homozygotes",
        "No migration into or out of the population",
      ],
      answer: 3,
      hints: ["Equilibrium needs every genotype to have equal fitness.", "Which option describes a kind of natural selection?"],
      explanation:
        "Hardy–Weinberg requires no selection at all. Heterozygote advantage (as with the sickle-cell allele where malaria is common) is a form of natural selection, so it breaks equilibrium. The other four are the standard conditions, along with no selection.",
      concepts: ["b106-hardy-weinberg"],
    },
    {
      id: "b106-q6",
      type: "mcq",
      topic: "Phylogeny & classification",
      difficulty: 2,
      prompt: "Based on ribosomal RNA and other molecular evidence, which statement about the three domains is correct?",
      options: [
        "Archaea are a subgroup of Bacteria because both are prokaryotes",
        "Archaea share a more recent common ancestor with Eukarya than with Bacteria",
        "Eukarya evolved first, and both prokaryote domains descend from them",
        "Viruses form a fourth domain alongside the other three",
      ],
      answer: 1,
      hints: ["Lacking a nucleus is a shared ancestral trait, not evidence of close relationship.", "Think about whose transcription and translation machinery archaea resemble."],
      explanation:
        "On the rRNA tree, Archaea and Eukarya are sister groups; archaeal RNA polymerases and translation factors resemble eukaryotic ones. Being prokaryotic is an ancestral condition shared by Bacteria and Archaea, so it doesn't group them. Viruses aren't cells and aren't placed in a domain.",
      concepts: ["b106-tree-of-life"],
    },
    {
      id: "b106-q7",
      type: "mcq",
      topic: "Phylogeny & classification",
      difficulty: 2,
      prompt: "Some antibiotics that inhibit bacterial ribosomes can also affect human cells. Which feature of evolutionary history best explains this?",
      options: [
        "Human nuclear ribosomes are identical to bacterial ribosomes",
        "Mitochondria descend from bacteria and still have bacteria-like ribosomes",
        "Humans acquired bacterial genes from their gut microbiota",
        "Chloroplasts in human cells are derived from cyanobacteria",
      ],
      answer: 1,
      hints: ["Which organelle came from an engulfed alphaproteobacterium?", "Human cells don't have chloroplasts."],
      explanation:
        "Endosymbiotic theory: mitochondria descend from an alphaproteobacterium and keep their own DNA and 70S-type ribosomes. Drugs aimed at bacterial ribosomes can sometimes inhibit mitochondrial protein synthesis. Human cytoplasmic ribosomes are 80S and differ from bacterial ones, which is why these drugs are mostly selective.",
      concepts: ["b106-tree-of-life"],
    },
    {
      id: "b106-q8",
      type: "mcq",
      topic: "Protists, fungi & plants",
      difficulty: 2,
      prompt: "Why are there far fewer selectively toxic antifungal drugs than antibacterial drugs?",
      options: [
        "Fungi have no cell wall to target",
        "Fungi are prokaryotes and lack a nucleus",
        "Fungi are eukaryotes closely related to animals, so their cells share most of our machinery",
        "Fungi only cause infections of the skin",
      ],
      answer: 2,
      hints: ["Where do fungi sit on the tree relative to animals?", "Antifungals target ergosterol because it is one of the few clear differences."],
      explanation:
        "Fungi and animals are both opisthokonts, so fungal cells have 80S ribosomes, a nucleus and much of the same metabolism as ours. Drugs exploit the few differences: ergosterol (azoles, amphotericin B) and the chitin and glucan wall (echinocandins). Fungi do have cell walls and can cause deep infections.",
      concepts: ["b106-protists-fungi-plants"],
    },
    {
      id: "b106-q9",
      type: "mcq",
      topic: "Animal diversity",
      difficulty: 2,
      prompt: "Canine heartworm (Dirofilaria immitis) is an unsegmented worm with a pseudocoelom that moults as it develops. To which phylum does it belong?",
      options: ["Platyhelminthes", "Annelida", "Nematoda", "Cnidaria"],
      answer: 2,
      hints: ["Flatworms are acoelomate; annelids are segmented with a true coelom.", "Moulting places it in Ecdysozoa with the arthropods."],
      explanation:
        "Nematodes (roundworms) are unsegmented, pseudocoelomate ecdysozoans that moult a cuticle; heartworm, Ascaris and hookworms are all nematodes. Platyhelminthes are acoelomate flatworms such as tapeworms, Annelida are segmented coelomate worms, and Cnidaria are radially symmetric with two germ layers.",
      concepts: ["b106-animal-body-plans"],
    },
    {
      id: "b106-q10",
      type: "numeric",
      topic: "Ecology",
      difficulty: 1,
      prompt: "The producers in a food chain store 10,000 kcal of energy. Using the 10% rule, how much energy is stored at the level of the tertiary consumers?",
      answer: 10,
      tolerance: 0.5,
      unit: "kcal",
      hints: ["Producers → primary → secondary → tertiary consumers is three transfers.", "Multiply by 0.1 at each step."],
      explanation:
        "$10{,}000 \\times 0.1 = 1{,}000$ kcal (primary consumers), $\\times 0.1 = 100$ kcal (secondary), $\\times 0.1 = 10$ kcal (tertiary consumers).",
      concepts: ["b106-ecology"],
    },
  ],

  labs: [
    {
      id: "b106-lab-hw-sim",
      title: "Hardy–Weinberg bead simulation with selection",
      topic: "Population genetics",
      objective:
        "Model a gene pool with coloured beads, form genotypes by random sampling, compare observed genotype counts with Hardy–Weinberg expectations using a chi-square test, then apply selection against the recessive homozygote and calculate the new allele frequency.",
      safety: [
        "Beads are a choking hazard: keep them away from mouths and pick up dropped beads at once so no one slips on them.",
        "Wash your hands before and after the activity if it is held in a shared biology lab, and don't eat or drink at the bench.",
        "Keep walkways clear of bags and stools while groups move between benches.",
      ],
      materials: [
        "Opaque bag or beaker labelled 'gene pool'",
        "60 red beads (allele A) and 40 white beads (allele a), identical in size and texture",
        "Tally sheet or spreadsheet for 50 genotype draws",
        "Calculator; chi-square critical value table",
      ],
      steps: [
        { text: "Place 60 red (A) and 40 white (a) beads in the bag and mix thoroughly. Record the starting allele frequencies.", why: "The bag is the population's gene pool; each bead is one allele copy." },
        { text: "Without looking, draw two beads to form one individual and record its genotype (AA, Aa or aa). Return both beads and mix again.", why: "Replacing the beads keeps p and q constant during sampling, modelling a large population with random mating." },
        { text: "Repeat until you have recorded 50 individuals, then total the AA, Aa and aa counts." },
        { text: "Calculate the observed allele frequencies from your 100 sampled alleles and the expected genotype counts p² × 50, 2pq × 50 and q² × 50." },
        { text: "Run a chi-square test: χ² = Σ (observed − expected)² / expected, with 1 degree of freedom (3 genotype classes − 1 − 1 estimated allele frequency). Compare with the critical value 3.84 at p = 0.05.", why: "One degree of freedom is lost for the total and one for estimating p from the data." },
        { text: "Model selection: assume every aa individual dies before reproducing. Remove them and count the A and a alleles in the survivors.", why: "Only survivors pass alleles to the next generation." },
        { text: "Make a new gene pool with the survivors' allele frequencies and repeat the draws for at least two more generations, plotting q each time.", why: "q falls more slowly each generation as the a allele hides in heterozygotes." },
        { text: "Pool data from the whole class and compare the spread of results between small and large samples.", why: "Small samples vary more: this is genetic drift." },
      ],
      drills: [
        {
          id: "d1",
          prompt: "The bag holds 60 red (A) and 40 white (a) beads. What is p, the frequency of A?",
          answer: 0.6,
          tolerance: 0.005,
          unit: "",
          working: "p = 60 / 100 = 0.6, so q = 1 − 0.6 = 0.4.",
        },
        {
          id: "d2",
          prompt: "With p = 0.6 and q = 0.4, how many of your 50 individuals do you expect to be heterozygous (Aa)?",
          answer: 24,
          tolerance: 0.5,
          unit: "individuals",
          working: "2pq = 2 × 0.6 × 0.4 = 0.48; 0.48 × 50 = 24. Expected AA = 0.36 × 50 = 18 and aa = 0.16 × 50 = 8.",
        },
        {
          id: "d3",
          prompt: "A group observes 21 AA, 18 Aa and 11 aa (expected 18, 24 and 8). Calculate χ².",
          answer: 3.125,
          tolerance: 0.01,
          unit: "",
          working: "Observed p = (2 × 21 + 18) / 100 = 0.6, so the expected counts 18, 24, 8 apply. χ² = (21 − 18)²/18 + (18 − 24)²/24 + (11 − 8)²/8 = 0.5 + 1.5 + 1.125 = 3.125. This is below 3.84, so the deviation is not significant at p = 0.05 with 1 degree of freedom.",
        },
        {
          id: "d4",
          prompt: "A generation has exactly the expected 18 AA, 24 Aa and 8 aa. All aa individuals are removed by selection. What is q among the survivors? Give 3 decimal places.",
          answer: 0.286,
          tolerance: 0.002,
          unit: "",
          working: "Survivors: 18 AA + 24 Aa = 42 individuals = 84 alleles. a alleles = 24 (one per heterozygote). q = 24 / 84 = 0.2857 ≈ 0.286. Check: q′ = q / (1 + q) = 0.4 / 1.4 = 0.286.",
        },
      ],
      resultsGuide:
        "With 50 draws from a 60:40 pool, expect roughly 18 AA, 24 Aa and 8 aa, but individual groups will scatter around these numbers; most should give χ² below 3.84, and about 1 group in 20 will exceed it by chance alone. Pooled class data should sit closer to expectation than any single group, which illustrates that drift is weaker in larger populations. Under complete selection against aa, q should fall from 0.4 to about 0.29, then about 0.22, then about 0.18: each drop is smaller than the last, because once a is rare almost all copies are carried by heterozygotes that selection can't detect. If your q rose, check that you removed aa individuals rather than returning them to the pool.",
    },
  ],

  cases: [
    {
      id: "b106-case-lyme",
      title: "A field-course student with a spreading rash",
      topic: "Ecology",
      setting: "Campus student health clinic in the northeastern United States, early July. Educational simulation with a fictional patient.",
      presentation:
        "Jordan, a 20-year-old pre-vet student, has just returned from a two-week field ecology course trapping small mammals in deciduous woodland. Jordan noticed a red patch on the back of the knee five days ago that has been slowly getting bigger, and has felt tired and achy with a mild headache.",
      stages: [
        {
          title: "History",
          prompt: "Which questions are most useful?",
          mode: "multi",
          options: [
            { text: "Did you find any ticks on you, and do you remember a bite?", good: true, feedback: "\"I pulled a tiny black dot off the back of my knee about ten days ago. I thought it was a speck of dirt until it had legs.\" Nymphal Ixodes ticks are about the size of a poppy seed and easily missed." },
            { text: "What did the field work involve, and where?", good: true, feedback: "\"Live-trapping white-footed mice in oak woodland, wading through leaf litter and long grass every day.\" Leaf litter is prime tick habitat and white-footed mice are a key Borrelia reservoir." },
            { text: "Any fever, joint pain, facial weakness or palpitations?", good: true, feedback: "\"A bit feverish some evenings and achy all over, but no joint swelling, my face is fine and my heart feels normal.\" No features of disseminated disease so far." },
            { text: "Have you had any animal bites or scratches?", good: true, feedback: "\"A mouse nipped my glove once, but it didn't break the skin.\" Worth asking in anyone handling wildlife, because it raises other zoonoses such as rabies (bats) or bacterial bite infections." },
            { text: "What's your favourite module so far?", good: false, feedback: "Friendly, but it doesn't help you with the diagnosis." },
            { text: "Do you play any musical instruments?", good: false, feedback: "Not relevant to this presentation." },
          ],
          debrief:
            "A good exposure history (where, what activity, which animals, any tick or bite) is the key to recognising vector-borne and zoonotic infections. Systemic symptoms and specific organ symptoms help judge whether infection has spread beyond the skin.",
        },
        {
          title: "Examination",
          prompt: "What do you examine?",
          mode: "multi",
          options: [
            { text: "Temperature, heart rate and blood pressure", good: true, feedback: "Temperature 37.8 °C, HR 82 and regular, BP 118/74." },
            { text: "The rash: measure it and look at its pattern", good: true, feedback: "An oval, flat red patch about 9 cm across on the back of the right knee, with partial central clearing. Not itchy, not raised, not hot." },
            { text: "Check the rest of the skin for other rashes or attached ticks", good: true, feedback: "No other lesions and no ticks attached." },
            { text: "Look for facial weakness and examine the joints", good: true, feedback: "Facial movements symmetrical; no joint swelling or tenderness." },
            { text: "Visual acuity chart", good: false, feedback: "Normal, but it doesn't help in this presentation." },
          ],
          debrief:
            "An expanding red patch larger than 5 cm, appearing days to weeks after a tick bite in an area where Lyme disease is common, is the classic picture of erythema migrans. Only some have the 'bull's-eye' central clearing. Checking for facial palsy, joint swelling and an irregular pulse screens for early disseminated disease.",
        },
        {
          title: "Investigations",
          prompt: "What is the most appropriate approach to testing now?",
          mode: "single",
          options: [
            { text: "No blood test is needed; erythema migrans with a typical exposure is a clinical diagnosis", good: true, feedback: "Correct. Antibodies often haven't developed yet in the first weeks, so serology at this stage is frequently negative and shouldn't delay treatment." },
            { text: "Wait for a positive Lyme antibody test before doing anything", good: false, feedback: "Early serology is often negative; waiting risks the infection spreading." },
            { text: "Gram stain a swab of the rash", good: false, feedback: "Borrelia stains poorly with the Gram stain and isn't found by swabbing intact skin." },
            { text: "MRI of the knee", good: false, feedback: "There's no joint problem; imaging won't help." },
          ],
          debrief:
            "Testing is most useful later in the illness, for example with arthritis or neurological features, when antibodies have had time to form. In early localised disease with a typical rash, the history and examination are enough.",
        },
        {
          title: "Know the organism",
          prompt: "Which description of the cause is correct?",
          mode: "single",
          options: [
            { text: "Borrelia burgdorferi, a spirochete bacterium, transmitted by Ixodes (black-legged) ticks that acquire it from small mammal reservoirs", good: true, feedback: "Correct. Nymphs that fed on infected mice as larvae transmit the bacteria during a long blood meal; deer feed adult ticks but are not a significant Borrelia reservoir." },
            { text: "A virus transmitted by mosquitoes, with birds as the reservoir", good: false, feedback: "That describes West Nile virus." },
            { text: "A protist parasite spread by sand flies", good: false, feedback: "That describes Leishmania." },
            { text: "A fungus inhaled from soil", good: false, feedback: "That fits fungi such as Coccidioides, not a tick-associated rash." },
          ],
          debrief:
            "Placing the pathogen on the tree of life (a bacterium, specifically a spirochete) tells you it can be treated with antibacterials. Knowing the vector and reservoir explains who gets it, where and when: late spring and summer, when nymphs are active, in woodland with many mice.",
        },
        {
          title: "Diagnosis",
          prompt: "What is the most likely diagnosis?",
          mode: "single",
          options: [
            { text: "Early localised Lyme disease (erythema migrans)", good: true, feedback: "Tick exposure in an endemic area, an expanding rash over 5 cm after several days, and mild flu-like symptoms fit." },
            { text: "Local allergic reaction to a tick bite", good: false, feedback: "Bite reactions appear within a day or two, are usually under 5 cm, are often itchy and fade rather than expand." },
            { text: "Bacterial cellulitis", good: false, feedback: "Cellulitis is usually hot, tender and swollen; this patch is flat, painless and slowly expanding." },
            { text: "Ringworm (dermatophyte infection)", good: false, feedback: "Ringworm is usually scaly and itchy with a raised edge; this lesion is smooth." },
          ],
          debrief:
            "Lyme disease is the most common vector-borne disease in the United States. Untreated, Borrelia can spread to the joints, nerves (facial palsy) and heart (heart block).",
        },
        {
          title: "Management principles and prevention",
          prompt: "What is the best overall approach (in a supervised clinical setting)?",
          mode: "single",
          options: [
            {
              text: "A clinician prescribes an oral antibiotic from current Lyme guidelines; give safety-net advice to return with facial weakness, joint swelling, palpitations or fainting; and teach tick prevention for future field work",
              good: true,
              feedback: "This treats the bacterial infection early, makes sure Jordan recognises signs of spread, and reduces the risk of another bite.",
            },
            { text: "No treatment, as the rash will fade on its own", good: false, feedback: "The rash may fade, but the infection can still disseminate to joints, nerves and heart." },
            { text: "An antiviral, because the symptoms are flu-like", good: false, feedback: "Borrelia is a bacterium; antivirals have no effect on it." },
            { text: "An antifungal cream on the rash", good: false, feedback: "This is a systemic bacterial infection, not a fungal skin infection." },
          ],
          debrief:
            "The drug, route and course length are a clinician's decision based on current guidelines. Prevention is ecology in action: permethrin-treated clothing, repellent on skin, trousers tucked into socks, daily full-body tick checks, and removing attached ticks promptly with fine-tipped tweezers, since transmission usually needs the tick to stay attached for 36 hours or more. Dogs working in the same habitat can also get Lyme disease and benefit from tick preventives and, where recommended, vaccination.",
        },
      ],
      teachingPoints: [
        "An exposure history (place, activity, animals, ticks or bites) is how zoonoses and vector-borne diseases are recognised.",
        "Erythema migrans is an expanding red rash over 5 cm appearing days to weeks after a tick bite; it is a clinical diagnosis, and early serology is often negative.",
        "Borrelia burgdorferi is a spirochete bacterium; Ixodes ticks are the vector and small mammals such as white-footed mice are key reservoirs.",
        "Prompt tick removal, repellents and tick checks prevent infection because transmission usually takes a day or more of attachment.",
        "Lyme disease is a One Health problem: the same ticks and habitat put people, dogs and horses at risk.",
      ],
    },
  ],

  skills: [
    {
      id: "b106-skill-microscope",
      title: "Using a compound light microscope",
      purpose: "Nearly every organism in a diversity course is first met under the microscope, and the same skills carry over to blood films, parasitology and pathology.",
      items: [
        { text: "Carries the microscope with one hand on the arm and one under the base, and sets it on a stable bench away from the edge", critical: true },
        { text: "Cleans the lenses only with lens paper and lens cleaner, never with tissues or clothing" },
        { text: "Starts with the stage lowered and the lowest-power (scanning, 4×) objective clicked into place", critical: true },
        { text: "Secures the slide with the stage clips or mechanical stage, coverslip up, specimen over the light" },
        { text: "Focuses first with the coarse focus at low power while watching from the side, then looking through the eyepieces", critical: true },
        { text: "Adjusts the interpupillary distance and eyepiece diopter, and sets light with the condenser and iris diaphragm for good contrast" },
        { text: "Centres the area of interest before moving to a higher-power objective, then uses only the fine focus at 40× and 100×", critical: true },
        { text: "Uses immersion oil only with the 100× oil objective, and never swings the 40× objective through oil" },
        { text: "Estimates specimen size from the field of view (field diameter falls as magnification rises) and records total magnification as eyepiece × objective" },
        { text: "Draws or photographs what is seen, labelled with specimen, stain and total magnification" },
        { text: "Afterwards wipes oil off the 100× lens, returns to the lowest-power objective, lowers the stage, turns off the light and covers the microscope", critical: true },
        { text: "Disposes of slides from live or stained biological samples in the designated container and broken glass in the sharps or glass bin", critical: true },
      ],
    },
  ],
};
