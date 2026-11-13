import type { Course } from "../types";

/** Original content aligned with the University of San Francisco's CHEM 111 (General Chemistry I). */
export const usfChem111: Course = {
  id: "usf-chem-111",
  code: "CHEM 111",
  title: "General Chemistry I",
  description:
    "Aligned with the University of San Francisco's CHEM 111, General Chemistry I (taken with the CHEM 112 lab and CHEM 186, Quantitative Approaches to General Chemistry I). Covers measurement and dimensional analysis, moles and stoichiometry, solutions, gases, thermochemistry, atomic structure and bonding, with every idea tied to medicine: lab-value unit conversions, IV fluid osmolarity, oxygen at altitude and body heat. The topics are those typical for the course; check your own syllabus. MedForge is not affiliated with or endorsed by USF.",
  topics: [
    "Measurement & units",
    "Moles & stoichiometry",
    "Solutions",
    "Gases",
    "Thermochemistry",
    "Atoms & periodic trends",
    "Bonding & molecular shape",
  ],

  concepts: [
    {
      slug: "c111-measurement",
      title: "Measurement, significant figures and dimensional analysis",
      topic: "Measurement & units",
      summary:
        "Every measured number carries a unit and an uncertainty. Significant figures report that uncertainty honestly, and dimensional analysis converts units by multiplying by conversion factors that equal one.",
      formulas: [
        "\\text{answer} = \\text{given} \\times \\dfrac{\\text{wanted unit}}{\\text{given unit}} \\times \\cdots",
        "1\\ \\text{g} = 10^{3}\\ \\text{mg} = 10^{6}\\ \\mu\\text{g}",
        "1\\ \\text{L} = 10\\ \\text{dL} = 10^{3}\\ \\text{mL}",
        "1\\ \\text{kg} = 2.205\\ \\text{lb}",
      ],
      body: `**SI units and prefixes**
Chemistry uses SI base units (kilogram, metre, second, mole, kelvin) with prefixes that are powers of ten:
- kilo (k) $10^{3}$, deci (d) $10^{-1}$, centi (c) $10^{-2}$, milli (m) $10^{-3}$, micro (µ) $10^{-6}$, nano (n) $10^{-9}$
- Clinical labs lean heavily on the **decilitre** (dL, 100 mL), which is why so many US results are "per dL".

**Significant figures**
The digits you report are the ones you actually know, plus one estimated digit.
- Non-zero digits always count: 2.47 has 3
- Zeros **between** non-zeros count: 1.005 has 4
- **Leading** zeros never count; they only place the decimal: 0.0042 has 2
- **Trailing** zeros count only if there is a decimal point: 25.0 has 3; 2500 is ambiguous, so write $2.5 \\times 10^{3}$ or $2.50 \\times 10^{3}$
- Exact numbers (counted items, defined conversions such as 1 L = 1000 mL) have unlimited significant figures

Rules for calculating:
1. **Multiply or divide**: the answer has as many significant figures as the input with the fewest.
2. **Add or subtract**: the answer has as many decimal places as the input with the fewest.
3. Round only at the end of a multi-step calculation.

**Accuracy and precision**
Accuracy is closeness to the true value; precision is how closely repeated measurements agree. A glucose meter that reads 5 mg/dL high every time is precise but not accurate.

**Dimensional analysis**
Write each conversion as a fraction equal to one and arrange it so unwanted units cancel:

$$ 154\\ \\text{lb} \\times \\frac{1\\ \\text{kg}}{2.205\\ \\text{lb}} = 69.8\\ \\text{kg} $$

If the units on your answer are not the ones you wanted, the set-up is wrong, whatever the arithmetic says.`,
      pearls: [
        "A unit slip between mg and µg is a thousand-fold error. Medication-safety rules ban trailing zeros (write 5 mg, never 5.0 mg, which can be misread as 50) and require a leading zero (0.5 mg, never .5 mg).",
        "Weight-based calculations need kilograms. Mixing up pounds and kilograms changes the result by a factor of about 2.2, which is why many hospitals record weight only in kg.",
        "Dosage calculations in nursing and pharmacy are dimensional analysis: write the order, the weight and the concentration as fractions and let the units cancel.",
      ],
    },
    {
      slug: "c111-mole-molar-mass",
      model: "glucose",
      title: "Atoms, the mole and molar mass",
      topic: "Moles & stoichiometry",
      summary:
        "A mole is $6.022 \\times 10^{23}$ particles. Molar mass (g/mol) links grams to moles, which is how lab results convert between mg/dL and mmol/L.",
      formulas: [
        "N_A = 6.022 \\times 10^{23}\\ \\text{mol}^{-1}",
        "n = \\dfrac{m}{M}",
        "\\text{mmol/L} = \\dfrac{\\text{mg/dL} \\times 10}{M\\ (\\text{g/mol})}",
      ],
      body: `**Atoms, isotopes and atomic mass**
An atom has a nucleus of protons and neutrons with electrons around it. The **atomic number** $Z$ (protons) defines the element; the **mass number** $A$ = protons + neutrons. Isotopes have the same $Z$ but different $A$. The atomic mass on the periodic table is the abundance-weighted average of the isotopes, in atomic mass units (u).

**The mole**
One mole is $N_A = 6.022 \\times 10^{23}$ particles. The mole is defined so that the mass of one mole of a substance in grams equals its formula mass in u.

**Molar mass** $M$ is the sum of the atomic masses in the formula. For glucose, $\\text{C}_6\\text{H}_{12}\\text{O}_6$:

$$ M = 6(12.011) + 12(1.008) + 6(15.999) = 180.16\\ \\text{g/mol} $$

Moles from mass:

$$ n = \\frac{m}{M} $$

**Lab units: mg/dL and mmol/L**
US labs often report glucose, cholesterol, calcium and creatinine as mass per decilitre; most other countries use SI units (mmol/L or µmol/L). To convert:
1. mg/dL × 10 = mg/L (there are 10 dL in a litre)
2. mg/L ÷ $M$ (g/mol) = mmol/L (because mg/mg-per-mmol = mmol)

$$ \\text{mmol/L} = \\frac{\\text{mg/dL} \\times 10}{M} $$

For glucose, $10 / 180.16 = 0.0555$, so **divide mg/dL by about 18** to get mmol/L. A fasting glucose of 90 mg/dL is $90 / 18.0 = 5.0$ mmol/L.

Other common factors:
- Cholesterol ($M$ 386.7): divide mg/dL by about 38.7
- Calcium ($M$ 40.08): divide mg/dL by about 4.0, so 10.0 mg/dL ≈ 2.50 mmol/L
- Creatinine ($M$ 113.1): multiply mg/dL by 88.4 to get µmol/L`,
      pearls: [
        "Glucose meters and lab reports come in mg/dL (USA) or mmol/L (UK, Canada, Australia, much of Europe). A reading of 7 looks normal-ish in mmol/L but would be dangerously low in mg/dL, so always check the unit.",
        "Fasting glucose of 126 mg/dL (7.0 mmol/L) or higher on repeat testing meets a common diagnostic threshold for diabetes.",
        "Radioactive isotopes are used in medicine because they behave chemically like the stable element: iodine-131 concentrates in the thyroid, and fluorine-18 labelled glucose (FDG) lights up tissue that takes up a lot of glucose in PET scans.",
      ],
    },
    {
      slug: "c111-stoichiometry",
      title: "Balanced equations, stoichiometry and limiting reagent",
      topic: "Moles & stoichiometry",
      summary:
        "A balanced equation gives the mole ratio between reactants and products. Convert grams to moles, use the ratio, and convert back; the reactant that runs out first, the limiting reagent, sets the yield.",
      formulas: [
        "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\,\\text{O}_2 \\rightarrow 6\\,\\text{CO}_2 + 6\\,\\text{H}_2\\text{O}",
        "\\text{g A} \\xrightarrow{\\div M_A} \\text{mol A} \\xrightarrow{\\times\\,\\text{ratio}} \\text{mol B} \\xrightarrow{\\times M_B} \\text{g B}",
        "\\%\\ \\text{yield} = \\dfrac{\\text{actual}}{\\text{theoretical}} \\times 100",
      ],
      body: `**Balancing**
Atoms are neither created nor destroyed, so each element must appear in equal numbers on both sides. Change **coefficients**, never subscripts (changing a subscript makes a different substance). The overall equation for aerobic respiration (and for burning glucose) is:

$$ \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\,\\text{O}_2 \\rightarrow 6\\,\\text{CO}_2 + 6\\,\\text{H}_2\\text{O} $$

Check: 6 C, 12 H and 18 O on each side.

**The stoichiometry road map**
1. Grams of the known substance ÷ its molar mass = moles
2. Moles × the mole ratio from the equation = moles of the wanted substance
3. Moles × the wanted substance's molar mass = grams

Example: how much CO₂ comes from 45.0 g of glucose?
- $45.0 / 180.16 = 0.2498$ mol glucose
- $0.2498 \\times 6 = 1.499$ mol CO₂
- $1.499 \\times 44.01 = 66.0$ g CO₂

**Limiting reagent**
When amounts of two reactants are given, find how much of one is needed to use up the other. Whichever runs out first is **limiting**; the other is **in excess**. A reliable method: divide the moles of each reactant by its coefficient. The smallest result identifies the limiting reagent.

**Percent yield**
The theoretical yield comes from the limiting reagent. Real reactions give less (side reactions, losses in transfer), so percent yield = actual ÷ theoretical × 100.`,
      pearls: [
        "Every mole of glucose oxidised makes six moles of CO₂ that the blood must carry to the lungs; this is why CO₂ production, and breathing, rise with metabolic rate in fever and exercise.",
        "In respiratory physiology the ratio of CO₂ produced to O₂ consumed is the respiratory quotient. For pure glucose it is 6/6 = 1.0; fat oxidation gives about 0.7.",
        "Limiting-reagent thinking appears in physiology: the slowest-supplied substrate (often oxygen in a poorly perfused tissue) limits how much ATP aerobic metabolism can make.",
      ],
    },
    {
      slug: "c111-solutions",
      title: "Solutions, molarity, dilution and osmolarity",
      topic: "Solutions",
      summary:
        "Molarity is moles of solute per litre of solution. Dilution keeps moles constant, so $C_1V_1 = C_2V_2$. Osmolarity counts every dissolved particle and decides whether an IV fluid is isotonic.",
      formulas: [
        "M = \\dfrac{n_{solute}}{V_{solution}\\ (\\text{L})}",
        "C_1 V_1 = C_2 V_2",
        "\\text{osmolarity} = i \\times M",
        "\\%\\ \\text{w/v} = \\dfrac{\\text{g solute}}{100\\ \\text{mL solution}} \\times 100",
      ],
      body: `**Ways to express concentration**
- **Molarity** (M, mol/L): moles of solute per litre of **solution** (not per litre of solvent)
- **Percent weight/volume** (% w/v): grams of solute per 100 mL of solution. 0.9% NaCl is 0.9 g per 100 mL = 9.0 g/L. D5W is 5 g of dextrose (glucose) per 100 mL.
- **Milliequivalents** (mEq/L): mmol/L × the ion's charge. Ca²⁺ at 2.5 mmol/L is 5.0 mEq/L.

**Preparing a solution**
Weigh the solute, dissolve it in less than the final volume, transfer to a volumetric flask, and make up to the mark.

**Dilution**
Adding solvent changes volume but not the moles of solute:

$$ C_1 V_1 = C_2 V_2 $$

Any units work as long as they match on both sides (M, %, mg/mL). Serial dilutions multiply: a 1:5 step followed by a 1:10 step is a 1:50 dilution overall.

**Osmolarity and tonicity**
Water moves across membranes toward the side with more dissolved particles. Osmolarity counts **particles**, so multiply molarity by $i$, the number of particles each formula unit gives:
- glucose $i = 1$; NaCl $i = 2$ (Na⁺ + Cl⁻); CaCl₂ $i = 3$

Plasma is about 285–295 mOsm/kg. Worked IV fluid examples:
- **0.9% NaCl ("normal saline")**: $9.0 / 58.44 = 0.154$ M; $\\times 2 = 308$ mOsm/L, roughly isotonic
- **D5W**: $50 / 180.16 = 0.278$ M; $\\times 1 = 278$ mOsm/L in the bag, but the glucose is metabolised, leaving free water, so it acts hypotonic in the body
- **3% NaCl**: $30 / 58.44 = 0.513$ M; $\\times 2 \\approx 1{,}030$ mOsm/L, strongly hypertonic

Cells in a hypotonic solution swell (red cells can burst, haemolysis); in a hypertonic solution they shrink (crenation).`,
      pearls: [
        "Giving plain water intravenously would haemolyse red cells; IV fluids are made close to isotonic, or deliberately hypertonic for specific uses under close monitoring.",
        "Serum osmolality can be estimated as 2[Na⁺] + glucose/18 + BUN/2.8 (mmol/L for sodium, mg/dL for the others); the /18 is the glucose molar-mass conversion again.",
        "Correcting severe hyponatraemia too fast can cause osmotic demyelination, so concentrated saline is used only with frequent sodium checks.",
      ],
    },
    {
      slug: "c111-gases",
      model: "carbonic-acid",
      title: "Gas laws, partial pressure and breathing at altitude",
      topic: "Gases",
      summary:
        "Ideal gases obey $PV = nRT$. In a mixture each gas contributes its own partial pressure (Dalton's law), which is what drives O₂ into and CO₂ out of the blood, and why oxygen is scarcer at altitude.",
      formulas: [
        "PV = nRT",
        "R = 0.08206\\ \\text{L·atm·mol}^{-1}\\text{K}^{-1} = 8.314\\ \\text{J·mol}^{-1}\\text{K}^{-1}",
        "P_{total} = P_1 + P_2 + \\cdots \\qquad P_i = x_i\\,P_{total}",
        "P_{I}\\text{O}_2 = F_{I}\\text{O}_2\\,(P_{atm} - 47\\ \\text{mmHg})",
        "\\text{CO}_2 + \\text{H}_2\\text{O} \\rightleftharpoons \\text{H}_2\\text{CO}_3 \\rightleftharpoons \\text{H}^+ + \\text{HCO}_3^-",
      ],
      body: `**Pressure units**
1 atm = 760 mmHg = 760 torr = 101.325 kPa. Medicine mostly uses mmHg (blood gases, blood pressure).

**The gas laws**
- Boyle: $P_1V_1 = P_2V_2$ at constant $T$, $n$. Breathing in works this way: the diaphragm enlarges the chest, lung pressure falls below atmospheric, and air flows in.
- Charles: $V_1/T_1 = V_2/T_2$ at constant $P$, $n$ (temperatures in **kelvin**: K = °C + 273.15)
- Combined into the **ideal gas law**:

$$ PV = nRT $$

Example: one mole of gas at body temperature (37 °C = 310.15 K) and 1.00 atm occupies $V = (1.00)(0.08206)(310.15)/1.00 = 25.5$ L.

**Dalton's law of partial pressures**
In a mixture each gas exerts the pressure it would have alone. Its partial pressure is its mole fraction times the total: $P_i = x_i P_{total}$. Dry air is 20.9% O₂ (often rounded to 0.21).

Inspired air is warmed and saturated with water vapour in the airways. At 37 °C water vapour exerts 47 mmHg, which takes up part of the total pressure:

$$ P_I\\text{O}_2 = 0.21 \\times (760 - 47) \\approx 150\\ \\text{mmHg at sea level} $$

**Altitude**
The fraction of O₂ stays 21% at any altitude, but total pressure falls, so the partial pressure falls. At about 380 mmHg (roughly 5,500 m), $P_I\\text{O}_2 = 0.21 \\times (380 - 47) \\approx 70$ mmHg, less than half of sea level. Less O₂ diffuses into the blood, the body responds by breathing faster (hyperventilating), and this blows off CO₂.

**CO₂ and the carbonic acid equilibrium**
Dissolved CO₂ reacts with water to form carbonic acid, which ionises:

$$ \\text{CO}_2 + \\text{H}_2\\text{O} \\rightleftharpoons \\text{H}_2\\text{CO}_3 \\rightleftharpoons \\text{H}^+ + \\text{HCO}_3^- $$

Hyperventilation lowers arterial $P\\text{CO}_2$, shifts this equilibrium left, lowers $[\\text{H}^+]$ and raises blood pH (respiratory alkalosis). Hypoventilation does the opposite (respiratory acidosis).

**Henry's law** (dissolved gas ∝ partial pressure) explains why only a small amount of O₂ travels dissolved in plasma, and why gas bubbles form in tissues when divers ascend too quickly (decompression sickness).`,
      pearls: [
        "Normal arterial values are roughly PaO₂ 80–100 mmHg and PaCO₂ 35–45 mmHg; both are partial pressures, read straight off Dalton's law.",
        "Anxiety-driven hyperventilation lowers PaCO₂ and can cause tingling around the mouth and in the fingers, partly because alkalosis lowers ionised calcium.",
        "Supplemental oxygen raises the inspired O₂ fraction, which raises PIO₂ even when total pressure is low, as at altitude or in an aircraft cabin.",
      ],
    },
    {
      slug: "c111-thermochemistry",
      title: "Thermochemistry: heat, enthalpy and calorimetry",
      topic: "Thermochemistry",
      summary:
        "Heat flow is measured with $q = mc\\Delta T$. Exothermic reactions release heat ($\\Delta H < 0$), endothermic ones absorb it ($\\Delta H > 0$), and Hess's law lets you add reaction enthalpies like equations.",
      formulas: [
        "q = m\\,c\\,\\Delta T",
        "c_{water} = 4.184\\ \\text{J·g}^{-1}\\text{°C}^{-1}",
        "q_{rxn} = -q_{calorimeter}",
        "\\Delta H_{rxn} = \\sum n\\,\\Delta H_f^\\circ(\\text{products}) - \\sum n\\,\\Delta H_f^\\circ(\\text{reactants})",
        "1\\ \\text{kcal (food Calorie)} = 4.184\\ \\text{kJ}",
      ],
      body: `**System and surroundings**
The **system** is what you study (the reaction); everything else is the **surroundings**. Energy lost by one is gained by the other (first law of thermodynamics).

**Heat and temperature**
Heat $q$ is energy transferred because of a temperature difference:

$$ q = m\\,c\\,\\Delta T $$

where $c$ is the **specific heat**. Water's is unusually high, 4.184 J/(g·°C), so it takes a lot of energy to change its temperature. Example: warming 1.00 L (1000 g) of fluid from 20.0 °C to 37.0 °C takes $1000 \\times 4.18 \\times 17.0 = 71{,}100$ J = 71.1 kJ.

**Enthalpy**
At constant pressure the heat of a reaction is its enthalpy change $\\Delta H$:
- **Exothermic**, $\\Delta H < 0$: heat flows out, surroundings warm. Oxidising glucose: $\\Delta H \\approx -2{,}800$ kJ/mol.
- **Endothermic**, $\\Delta H > 0$: heat flows in, surroundings cool. Dissolving ammonium nitrate in water.

$\\Delta H$ scales with amount (double the moles, double the heat) and reverses sign when the reaction is reversed.

**Calorimetry**
In a coffee-cup calorimeter the reaction's heat is absorbed by the water: $q_{rxn} = -q_{water}$. Divide by moles reacted to get $\\Delta H$ per mole.

**Hess's law and enthalpies of formation**
Because enthalpy is a state function, you can add equations and their $\\Delta H$ values to reach a target reaction, or use standard enthalpies of formation $\\Delta H_f^\\circ$ (zero for elements in their standard state).

**Food energy**
Food Calories are kilocalories. Glucose releases about $2{,}800 / 180.16 \\approx 15.6$ kJ/g, or about 3.7 kcal/g, close to the rounded 4 kcal/g used on nutrition labels for carbohydrates.`,
      pearls: [
        "Instant cold packs contain a salt such as ammonium nitrate that dissolves endothermically; instant hot packs use exothermic processes such as dissolving calcium chloride or oxidising iron powder.",
        "Water's high specific heat lets the body's large water content buffer temperature swings; evaporating sweat removes roughly 2.4 kJ per gram, the main way we lose heat in hot conditions.",
        "Large volumes of cold IV fluid or blood can lower a patient's core temperature, which is why fluid warmers are used in trauma and surgery.",
      ],
    },
    {
      slug: "c111-atomic-structure",
      title: "Electron configuration and periodic trends",
      topic: "Atoms & periodic trends",
      summary:
        "Electrons fill orbitals in order of energy. Valence electrons and effective nuclear charge explain trends in atomic and ionic radius, ionisation energy and electronegativity, and why Na⁺, K⁺, Ca²⁺ and Cl⁻ are the ions the body uses.",
      formulas: [
        "E = h\\nu = \\dfrac{hc}{\\lambda}",
        "Z_{eff} \\approx Z - S",
        "1s\\ 2s\\ 2p\\ 3s\\ 3p\\ 4s\\ 3d\\ 4p \\ldots",
      ],
      body: `**Light and electrons**
Atoms absorb and emit light of specific energies, $E = h\\nu = hc/\\lambda$, because electrons occupy quantised energy levels. Each electron is described by quantum numbers $n$, $\\ell$, $m_\\ell$ and $m_s$.

**Electron configuration**
- Fill orbitals from lowest energy (aufbau): 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p…
- Each orbital holds two electrons of opposite spin (Pauli)
- Spread electrons across equal-energy orbitals before pairing (Hund)

Examples: Na is $1s^2 2s^2 2p^6 3s^1$, or [Ne] $3s^1$. Cl is [Ne] $3s^2 3p^5$. K is [Ar] $4s^1$.

**Valence electrons and ions**
Main-group atoms tend to gain or lose electrons to reach a noble-gas configuration: Na → Na⁺ ([Ne]), Ca → Ca²⁺ ([Ar]), Cl → Cl⁻ ([Ar]).

**Effective nuclear charge** $Z_{eff}$ is the nuclear charge an outer electron feels after shielding by inner electrons. It rises across a period and stays roughly constant down a group.

**Periodic trends**
- **Atomic radius**: decreases across a period (higher $Z_{eff}$ pulls electrons in), increases down a group (new shells)
- **Ionisation energy**: increases across a period, decreases down a group
- **Electronegativity**: increases toward the top right (F is highest; O and N are next)
- **Ionic radius**: cations are smaller than their atoms, anions larger. For **isoelectronic** ions (same electron count), more protons means smaller: Cl⁻ > K⁺ > Ca²⁺
- Down group 1, ions get bigger: Li⁺ < Na⁺ < K⁺`,
      pearls: [
        "Ion channels tell Na⁺ from K⁺ partly by size and how tightly each ion holds its shell of water molecules; the selectivity filter of a K⁺ channel lets K⁺ through but not the smaller Na⁺.",
        "Lithium sits above sodium in group 1, which helps explain why lithium therapy interacts with sodium balance and needs blood-level monitoring.",
        "Mg²⁺ and Ca²⁺ carry two charges, so concentrations are sometimes reported in mEq/L: 1 mmol/L of a 2+ ion is 2 mEq/L.",
      ],
    },
    {
      slug: "c111-bonding-vsepr",
      model: "water",
      title: "Chemical bonding, Lewis structures and VSEPR shape",
      topic: "Bonding & molecular shape",
      summary:
        "Atoms bond by transferring (ionic) or sharing (covalent) electrons. Lewis structures show bonding and lone pairs; VSEPR predicts shape from electron groups, and shape plus bond polarity decides whether a molecule is polar.",
      formulas: [
        "\\text{FC} = V - N_{lone} - \\tfrac{1}{2}B",
        "\\Delta\\chi > 1.7\\ \\text{(mostly ionic)}, \\quad 0.4\\text{–}1.7\\ \\text{(polar covalent)}",
        "\\text{electron groups: } 2 \\to 180^\\circ,\\ 3 \\to 120^\\circ,\\ 4 \\to 109.5^\\circ",
      ],
      body: `**Types of bond**
- **Ionic**: electron transfer between atoms with a large electronegativity difference, e.g. Na⁺Cl⁻. Ionic compounds dissolve into separate ions, which is why NaCl counts twice in osmolarity.
- **Covalent**: shared electron pairs. Unequal sharing gives a **polar** bond with partial charges δ+ and δ−.

**Drawing Lewis structures**
1. Count valence electrons (add one per negative charge, subtract one per positive charge)
2. Place the least electronegative atom in the centre (H is never central)
3. Connect atoms with single bonds, then complete octets on outer atoms
4. Put leftover electrons on the central atom; form double or triple bonds if it lacks an octet
5. Check **formal charges**, $\\text{FC} = V - N_{lone} - \\tfrac{1}{2}B$; the best structure keeps them near zero

Some ions need **resonance**: bicarbonate (HCO₃⁻) has its negative charge spread over two oxygens.

**VSEPR**
Electron groups (bonds or lone pairs) around a central atom spread out as far as possible. Lone pairs push harder than bonding pairs and squeeze bond angles.

- **CO₂**: 2 electron groups, 0 lone pairs on C → linear, 180°
- **CH₄**: 4 groups, 0 lone pairs → tetrahedral, 109.5°
- **NH₃**: 4 groups, 1 lone pair → trigonal pyramidal, about 107°
- **H₂O**: 4 groups, 2 lone pairs → bent, about 104.5°

**Polarity**
A molecule is polar if its bond dipoles do not cancel. CO₂ has polar C=O bonds but is linear, so they cancel: nonpolar. Water is bent, so its O–H dipoles add: strongly polar, and able to hydrogen bond.

**Intermolecular forces**
Hydrogen bonds (H on N, O or F to a lone pair on N, O or F) explain water's high boiling point and specific heat, and they hold DNA base pairs and protein structure together.`,
      pearls: [
        "Water's bent, polar shape makes it an excellent solvent for ions and polar molecules, which is why blood plasma can carry glucose, salts and amino acids.",
        "Nonpolar molecules such as O₂, CO₂ and many anaesthetic gases cross lipid membranes easily; charged ions need channels or transporters.",
        "Drug–receptor binding often depends on shape and hydrogen bonding, so mirror-image or slightly reshaped molecules can have very different effects.",
      ],
    },
  ],

  lectures: [
    {
      id: "c111-l1",
      week: 1,
      title: "Measurement and the unit-conversion habit",
      topic: "Measurement & units",
      summary: "SI units and prefixes, significant figures, and dimensional analysis as one method for every conversion, from pounds to kilograms to mg/dL.",
      notes: `- Prefixes: k $10^3$, d $10^{-1}$, c $10^{-2}$, m $10^{-3}$, µ $10^{-6}$, n $10^{-9}$
- Sig figs: leading zeros never count; trailing zeros count only with a decimal point
- × and ÷: fewest sig figs; + and −: fewest decimal places; round at the end
- Dimensional analysis: multiply by fractions equal to one until only the wanted unit is left
- Exact numbers (counts, defined conversions) don't limit sig figs`,
      insights: [
        { type: "exam_tip", text: "Write units on every number in every line. If the units don't cancel to what the question asks for, stop and fix the set-up before doing any arithmetic.", conceptSlug: "c111-measurement" },
        { type: "clinical_link", text: "The 'Do Not Use' abbreviations in hospitals (no trailing zeros, always a leading zero, write out 'units') exist because significant-figure and decimal-point slips have caused real tenfold medication errors.", conceptSlug: "c111-measurement" },
        { type: "intuition", text: "A conversion factor is just the number one in disguise: 1 kg / 2.205 lb is one, so multiplying by it changes the units without changing the amount.", conceptSlug: "c111-measurement" },
      ],
    },
    {
      id: "c111-l2",
      week: 3,
      title: "Moles, stoichiometry and lab-value units",
      topic: "Moles & stoichiometry",
      summary: "Counting atoms by weighing them, molar mass, the grams–moles–grams road map, limiting reagent, and converting clinical results between mg/dL and mmol/L.",
      notes: `- $n = m / M$; glucose $M$ = 180.16 g/mol
- mg/dL × 10 ÷ $M$ = mmol/L; for glucose, divide by about 18
- Balance with coefficients, never subscripts
- g A → mol A → (mole ratio) → mol B → g B
- Limiting reagent: moles ÷ coefficient, smallest wins
- Respiration: $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\,\\text{O}_2 \\rightarrow 6\\,\\text{CO}_2 + 6\\,\\text{H}_2\\text{O}$`,
      insights: [
        { type: "exam_tip", text: "Never compare grams to decide the limiting reagent. Convert to moles and divide by the coefficients first.", conceptSlug: "c111-stoichiometry" },
        { type: "clinical_link", text: "The factor of 18 between glucose units is just the molar mass (180) divided by the 10 dL in a litre. You can rebuild any lab conversion from the molar mass.", conceptSlug: "c111-mole-molar-mass" },
        { type: "intuition", text: "Moles are a chemist's dozen: you can't count molecules one by one, so you weigh them in batches of $6.022 \\times 10^{23}$.", conceptSlug: "c111-mole-molar-mass" },
      ],
    },
    {
      id: "c111-l3",
      week: 5,
      title: "Solutions, IV fluids, gases and heat",
      topic: "Solutions",
      summary: "Molarity, dilution and osmolarity applied to IV fluids; the ideal gas law and partial pressures applied to breathing and altitude; heat flow and enthalpy applied to the body.",
      notes: `- $M = n / V$ (litres of solution); $C_1V_1 = C_2V_2$
- Osmolarity = $i \\times M$; 0.9% NaCl ≈ 308 mOsm/L; plasma ≈ 285–295
- $PV = nRT$ with $T$ in kelvin
- Dalton: $P_i = x_i P_{total}$; $P_I\\text{O}_2 = 0.21 (P_{atm} - 47)$
- Hyperventilation lowers $P\\text{CO}_2$ and raises pH
- $q = mc\\Delta T$; exothermic $\\Delta H < 0$, endothermic $\\Delta H > 0$`,
      insights: [
        { type: "exam_tip", text: "For osmolarity, ask how many particles one formula unit gives in water. Forgetting the factor of 2 for NaCl is the classic error.", conceptSlug: "c111-solutions" },
        { type: "clinical_link", text: "At altitude the air is still 21% oxygen; it's the lower total pressure that lowers the oxygen partial pressure and makes climbers breathless.", conceptSlug: "c111-gases" },
        { type: "intuition", text: "Water vapour in the lungs is a passenger that always takes 47 mmHg of the seats, leaving less room for oxygen, and it matters more when total pressure is low.", conceptSlug: "c111-gases" },
        { type: "clinical_link", text: "Warming a litre of cold fluid to body temperature takes about 70 kJ; give several litres cold and that heat comes out of the patient.", conceptSlug: "c111-thermochemistry" },
      ],
    },
    {
      id: "c111-l4",
      week: 8,
      title: "Atoms, periodic trends and molecular shape",
      topic: "Bonding & molecular shape",
      summary: "Electron configurations, effective nuclear charge and periodic trends, then Lewis structures, VSEPR and polarity, linked to ions, membranes and water.",
      notes: `- Aufbau, Pauli, Hund; Na = [Ne] $3s^1$
- $Z_{eff}$ rises across a period: smaller radius, higher ionisation energy and electronegativity
- Isoelectronic ions: more protons, smaller ion (Cl⁻ > K⁺ > Ca²⁺)
- Lewis: count valence electrons, octets, formal charge, resonance
- VSEPR: 2 groups linear, 3 trigonal planar, 4 tetrahedral; lone pairs shrink angles
- Polar molecule = polar bonds that don't cancel by shape`,
      insights: [
        { type: "exam_tip", text: "Shape names describe atoms only. Water has four electron groups (tetrahedral electron geometry) but its molecular shape is bent.", conceptSlug: "c111-bonding-vsepr" },
        { type: "clinical_link", text: "Na⁺ and K⁺ differ only by one electron shell, yet the body keeps them on opposite sides of every cell membrane; channel selectivity is periodic trends in action.", conceptSlug: "c111-atomic-structure" },
        { type: "intuition", text: "Electron groups behave like balloons tied at one point: they push apart as far as they can, and lone-pair balloons are fatter.", conceptSlug: "c111-bonding-vsepr" },
      ],
    },
  ],

  questions: [
    {
      id: "c111-q1",
      type: "mcq",
      topic: "Measurement & units",
      difficulty: 1,
      prompt: "A balance reads 0.004060 g. How many significant figures does this measurement have?",
      options: ["2", "3", "4", "7"],
      answer: 2,
      hints: ["Leading zeros only locate the decimal point.", "A trailing zero after a decimal point is significant."],
      explanation:
        "The leading zeros (0.00) don't count. The digits 4, 0 (between non-zeros), 6 and the trailing 0 (after the decimal point) all count, giving 4 significant figures.",
      concepts: ["c111-measurement"],
    },
    {
      id: "c111-q2",
      type: "numeric",
      topic: "Measurement & units",
      difficulty: 1,
      prompt: "A patient's weight is recorded as 154 lb. What is the weight in kilograms? Use 1 kg = 2.205 lb.",
      answer: 69.8,
      tolerance: 0.2,
      unit: "kg",
      hints: ["Set up the factor so lb cancels: 1 kg / 2.205 lb.", "Divide, don't multiply."],
      explanation: "$154\\ \\text{lb} \\times \\dfrac{1\\ \\text{kg}}{2.205\\ \\text{lb}} = 69.8$ kg (3 significant figures, set by 154).",
      concepts: ["c111-measurement"],
    },
    {
      id: "c111-q3",
      type: "numeric",
      topic: "Moles & stoichiometry",
      difficulty: 2,
      prompt: "A fasting plasma glucose is 126 mg/dL. Express it in mmol/L. Glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$) has a molar mass of 180.16 g/mol.",
      answer: 6.99,
      tolerance: 0.05,
      unit: "mmol/L",
      hints: ["First convert per decilitre to per litre: there are 10 dL in 1 L.", "mg ÷ (g/mol) gives mmol."],
      explanation:
        "126 mg/dL × 10 dL/L = 1,260 mg/L. Then 1,260 mg/L ÷ 180.16 mg/mmol = 6.99 mmol/L (about 7.0, a common diabetes threshold). Shortcut: 126 ÷ 18.0 = 7.0.",
      concepts: ["c111-mole-molar-mass", "c111-measurement"],
    },
    {
      id: "c111-q4",
      type: "numeric",
      topic: "Moles & stoichiometry",
      difficulty: 3,
      prompt:
        "In a calorimeter, 10.0 g of glucose ($M$ = 180.16 g/mol) is burned with 10.0 g of O₂ ($M$ = 32.00 g/mol): $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\,\\text{O}_2 \\rightarrow 6\\,\\text{CO}_2 + 6\\,\\text{H}_2\\text{O}$. What is the maximum mass of CO₂ ($M$ = 44.01 g/mol) that can form?",
      answer: 13.8,
      tolerance: 0.1,
      unit: "g",
      hints: ["Convert both reactants to moles, then divide each by its coefficient.", "O₂ and CO₂ are in a 6:6 (1:1) ratio."],
      explanation:
        "Glucose: 10.0 / 180.16 = 0.0555 mol, which would need 6 × 0.0555 = 0.333 mol O₂. Only 10.0 / 32.00 = 0.3125 mol O₂ is present, so O₂ is limiting. CO₂ formed = 0.3125 mol × 44.01 g/mol = 13.8 g.",
      concepts: ["c111-stoichiometry"],
    },
    {
      id: "c111-q5",
      type: "numeric",
      topic: "Solutions",
      difficulty: 2,
      prompt: "\"Normal saline\" is 0.9% (w/v) NaCl. Calculate its osmolarity in mOsm/L, assuming NaCl dissociates completely. NaCl has a molar mass of 58.44 g/mol.",
      answer: 308,
      tolerance: 2,
      unit: "mOsm/L",
      hints: ["0.9% w/v means 0.9 g per 100 mL, i.e. 9.0 g per litre.", "Each NaCl gives two particles: Na⁺ and Cl⁻."],
      explanation: "9.0 g/L ÷ 58.44 g/mol = 0.154 mol/L. × 2 particles = 0.308 Osm/L = 308 mOsm/L, close to plasma (about 285–295), so it is roughly isotonic.",
      concepts: ["c111-solutions"],
    },
    {
      id: "c111-q6",
      type: "numeric",
      topic: "Solutions",
      difficulty: 1,
      prompt: "You need 100.0 mL of 10% (w/v) dextrose solution and have a 50% (w/v) stock. What volume of stock is needed (the rest is made up with diluent)?",
      answer: 20.0,
      tolerance: 0.1,
      unit: "mL",
      hints: ["The amount of dextrose stays the same on dilution: $C_1V_1 = C_2V_2$.", "Percent units are fine as long as both sides match."],
      explanation: "$V_1 = C_2V_2 / C_1 = (10\\% \\times 100.0\\ \\text{mL}) / 50\\% = 20.0$ mL of stock, made up to 100.0 mL with 80.0 mL of diluent.",
      concepts: ["c111-solutions"],
    },
    {
      id: "c111-q7",
      type: "numeric",
      topic: "Gases",
      difficulty: 2,
      prompt:
        "On a high mountain the barometric pressure is 380 mmHg. Using an O₂ fraction of 0.21 and water vapour pressure of 47 mmHg at body temperature, what is the partial pressure of O₂ in the humidified inspired air?",
      answer: 69.9,
      tolerance: 0.5,
      unit: "mmHg",
      hints: ["Subtract water vapour pressure from the total first.", "Then use Dalton's law: $P_i = x_i P_{total}$."],
      explanation: "$P_I\\text{O}_2 = 0.21 \\times (380 - 47) = 0.21 \\times 333 = 69.9$ mmHg, less than half the sea-level value of about 150 mmHg.",
      concepts: ["c111-gases"],
    },
    {
      id: "c111-q8",
      type: "numeric",
      topic: "Thermochemistry",
      difficulty: 2,
      prompt:
        "How much heat, in kJ, is needed to warm 1.00 L of IV fluid from 20.0 °C to body temperature, 37.0 °C? Treat the fluid as water: density 1.00 g/mL, specific heat 4.18 J/(g·°C).",
      answer: 71.1,
      tolerance: 0.3,
      unit: "kJ",
      hints: ["1.00 L of water has a mass of 1,000 g.", "$q = mc\\Delta T$, then divide J by 1,000 for kJ."],
      explanation: "$q = 1000\\ \\text{g} \\times 4.18\\ \\text{J/(g·°C)} \\times 17.0\\ \\text{°C} = 71{,}060$ J ≈ 71.1 kJ.",
      concepts: ["c111-thermochemistry"],
    },
    {
      id: "c111-q9",
      type: "mcq",
      topic: "Atoms & periodic trends",
      difficulty: 2,
      prompt: "Cl⁻, K⁺ and Ca²⁺ all have the same electron configuration as argon. Which lists them from largest to smallest?",
      options: ["Ca²⁺ > K⁺ > Cl⁻", "Cl⁻ > K⁺ > Ca²⁺", "K⁺ > Cl⁻ > Ca²⁺", "They are all the same size"],
      answer: 1,
      hints: ["They are isoelectronic: 18 electrons each.", "Count protons: Cl 17, K 19, Ca 20. More protons pull the same electrons in tighter."],
      explanation:
        "With the same 18 electrons, the ion with the most protons has the highest effective nuclear charge and is smallest. Ca²⁺ (20 protons) is smallest, Cl⁻ (17 protons) is largest: Cl⁻ > K⁺ > Ca²⁺.",
      concepts: ["c111-atomic-structure"],
    },
    {
      id: "c111-q10",
      type: "mcq",
      topic: "Bonding & molecular shape",
      difficulty: 2,
      prompt: "Both water and carbon dioxide contain polar bonds. Why is water a polar molecule while CO₂ is nonpolar?",
      options: [
        "Water is bent (two lone pairs on O), so its bond dipoles add; CO₂ is linear, so its bond dipoles cancel",
        "Water has ionic bonds and CO₂ has covalent bonds",
        "Oxygen is more electronegative in water than in CO₂",
        "CO₂ has no lone pairs anywhere in its Lewis structure",
      ],
      answer: 0,
      hints: ["Count electron groups on the central atom in each molecule.", "Polarity depends on shape as well as on bond polarity."],
      explanation:
        "Water's O has four electron groups (two bonds, two lone pairs), giving a bent shape; the O–H dipoles point partly the same way and add. CO₂'s C has two electron groups and is linear, so the two C=O dipoles point in opposite directions and cancel. Both are covalent, and CO₂'s oxygens do carry lone pairs.",
      concepts: ["c111-bonding-vsepr"],
    },
  ],

  labs: [
    {
      id: "c111-lab-glucose-standards",
      title: "Preparing a glucose standard and a serial dilution",
      topic: "Solutions",
      objective:
        "Prepare 100.0 mL of a 0.500 M glucose stock solution in a volumetric flask, calculate its true concentration from the mass actually weighed, then make a two-step serial dilution to a working standard in the range of blood glucose, expressed in both mmol/L and mg/dL.",
      safety: [
        "Wear safety glasses or goggles and a fastened lab coat; closed-toe shoes and long hair tied back.",
        "Glucose is low hazard, but treat all lab chemicals as non-consumable: never taste or eat anything in the lab and never mouth-pipette; use a pipette bulb or pump.",
        "Handle volumetric glassware carefully; report chipped or broken glass and put it in the broken-glass box, not the regular bin.",
        "Wipe up spills on and around the analytical balance at once; sugar residue attracts contamination and affects later weighings.",
        "Dispose of solutions as directed by your instructor and wash your hands before leaving the lab.",
      ],
      materials: [
        "D-glucose (anhydrous), $M$ = 180.16 g/mol",
        "Analytical balance (±0.001 g or better), weighing boat, spatula",
        "100.00 mL and two 50.00 mL volumetric flasks with stoppers",
        "10.00 mL and 5.00 mL volumetric (transfer) pipettes with a pipette bulb",
        "Deionised water in a wash bottle",
        "Small funnel, beaker, labels and marker",
      ],
      steps: [
        { text: "Calculate the mass of glucose needed for 100.0 mL of 0.500 M solution and record it before you weigh.", why: "Planning the target mass lets you check you are in the right range as you weigh." },
        { text: "Tare a clean weighing boat on the analytical balance, add glucose close to the target, close the draft doors, and record the stable mass to the balance's last digit.", why: "You don't need to hit the target exactly; you need to know exactly what you weighed." },
        { text: "Transfer the glucose through a funnel into the 100 mL volumetric flask, rinsing the boat and funnel into the flask with deionised water.", why: "Any solid left behind makes the solution weaker than your calculation says." },
        { text: "Fill the flask about two-thirds full, swirl until all solid dissolves, then add water until the bottom of the meniscus sits on the mark at eye level. Stopper and invert at least 10 times.", why: "Dissolving before making up to volume and mixing thoroughly give a uniform, correct concentration." },
        { text: "Rinse the 10.00 mL pipette with a little stock, then transfer 10.00 mL of stock into a 50.00 mL volumetric flask, make up to the mark and mix. Label it 'dilution A'.", why: "Rinsing with the solution itself avoids diluting it with leftover water." },
        { text: "With the 5.00 mL pipette, transfer 5.00 mL of dilution A into the second 50.00 mL flask, make up to the mark and mix. Label it 'working standard'.", why: "Two moderate steps are more accurate than one very large dilution with tiny volumes." },
        { text: "Calculate the true stock molarity from your recorded mass, then the concentration of each dilution, and convert the working standard to mg/dL." },
      ],
      drills: [
        {
          id: "c111-d1",
          prompt: "What mass of glucose is needed to make 100.0 mL of 0.500 M solution?",
          answer: 9.01,
          tolerance: 0.01,
          unit: "g",
          working: "n = 0.500 mol/L × 0.1000 L = 0.0500 mol. Mass = 0.0500 mol × 180.16 g/mol = 9.008 g ≈ 9.01 g.",
        },
        {
          id: "c111-d2",
          prompt: "You actually weighed 9.035 g of glucose into the 100.00 mL flask. What is the true molarity of the stock?",
          answer: 0.5015,
          tolerance: 0.0005,
          unit: "M",
          working: "n = 9.035 g ÷ 180.16 g/mol = 0.05015 mol. M = 0.05015 mol ÷ 0.10000 L = 0.5015 M.",
        },
        {
          id: "c111-d3",
          prompt: "What is the total dilution factor from the stock to the working standard (10.00 mL to 50.00 mL, then 5.00 mL to 50.00 mL)?",
          answer: 50,
          tolerance: 0.1,
          unit: "",
          working: "Step 1: 50.00 / 10.00 = 5. Step 2: 50.00 / 5.00 = 10. Serial factors multiply: 5 × 10 = 50.",
        },
        {
          id: "c111-d4",
          prompt: "What is the working standard's concentration in mmol/L?",
          answer: 10.03,
          tolerance: 0.02,
          unit: "mmol/L",
          working: "0.5015 M ÷ 50 = 0.01003 M = 10.03 mmol/L. (Dilution A is 0.5015 / 5 = 0.1003 M.)",
        },
        {
          id: "c111-d5",
          prompt: "Express the working standard in mg/dL, the unit a US clinical lab would report.",
          answer: 180.7,
          tolerance: 0.3,
          unit: "mg/dL",
          working:
            "0.01003 mol/L × 180.16 g/mol = 1.807 g/L = 1,807 mg/L. Divide by 10 dL/L: 180.7 mg/dL. Check: the stock is 9,035 mg per dL, and 9,035 ÷ 50 = 180.7 mg/dL.",
        },
      ],
      resultsGuide:
        "Your stock should be close to 0.500 M; reporting it to four significant figures (e.g. 0.5015 M) is justified by the analytical balance and Class A flask. The working standard should be around 10 mmol/L, or about 180 mg/dL, which is in the range of a raised blood glucose and the kind of standard used to calibrate a glucose assay. Common sources of error: solid left on the weighing boat or funnel (concentration too low), overshooting the mark (too low), reading the meniscus from above or below (parallax), and not mixing after making up to volume (non-uniform solution). If a classmate's value differs by more than about 1%, compare recorded masses first, then technique.",
    },
  ],

  cases: [
    {
      id: "c111-case-glucose-units",
      title: "Two glucose readings that don't seem to agree",
      topic: "Moles & stoichiometry",
      setting: "University student health clinic. Educational simulation with a fictional patient.",
      presentation:
        "Maya, a 19-year-old exchange student from the UK with type 1 diabetes, comes to the clinic because she has felt thirsty and been passing a lot of urine for a day. The clinic's fingerstick glucose reads 252 mg/dL. She is alarmed: 'At home my meter never shows numbers in the hundreds.' Her own meter, bought in the UK, reports in mmol/L.",
      stages: [
        {
          title: "History",
          prompt: "Choose the questions most worth asking.",
          mode: "multi",
          options: [
            { text: "Any nausea, vomiting, abdominal pain or unusual drowsiness?", good: true, feedback: "\"A bit queasy this morning, but no vomiting and no tummy pain.\" These screen for diabetic ketoacidosis." },
            { text: "Have you been unwell, missed any insulin, or changed your routine recently?", good: true, feedback: "\"I've had a cold for two days and I've been eating at odd times with the time difference.\" Illness and disrupted routine commonly raise glucose." },
            { text: "What does your own meter read, and what units does it show?", good: true, feedback: "\"It said 14.1 just before I came in. It shows mmol/L.\"" },
            { text: "Do you have a plan from your diabetes team for sick days?", good: true, feedback: "\"Yes, I have a printed one, but it's all in mmol/L.\"" },
            { text: "Which courses are you taking this semester?", good: false, feedback: "Friendly, but it doesn't help assess her glucose." },
            { text: "Have you ever broken a bone?", good: false, feedback: "Not relevant to this presentation." },
          ],
          debrief:
            "In someone with type 1 diabetes and high glucose, the key safety question is whether ketones are building up (nausea, vomiting, abdominal pain, drowsiness, fast breathing). Intercurrent illness is a common trigger. Her meter reports in a different unit, which needs sorting out before any number can be compared.",
        },
        {
          title: "Convert the clinic result",
          prompt: "The clinic reading is 252 mg/dL. Glucose has a molar mass of 180.16 g/mol. What is this in mmol/L?",
          mode: "single",
          options: [
            { text: "About 14.0 mmol/L", good: true, feedback: "Correct: 252 mg/dL × 10 = 2,520 mg/L; 2,520 ÷ 180.16 = 14.0 mmol/L. Her own meter's 14.1 agrees." },
            { text: "About 25.2 mmol/L", good: false, feedback: "This divides by 10 only. You also need to divide by the molar mass (in mg/mmol) and multiply by 10 dL/L, which overall is dividing by about 18." },
            { text: "About 4,536 mmol/L", good: false, feedback: "This multiplies by 18 instead of dividing; the answer is impossibly large. Check the units cancel." },
            { text: "About 1.4 mmol/L", good: false, feedback: "This forgets the dL-to-L step (a factor of 10) and would be a dangerously low value." },
          ],
          debrief:
            "mmol/L = (mg/dL × 10) ÷ molar mass. For glucose that is mg/dL ÷ 18.0. Once converted, the clinic and home readings agree to within normal meter variation: there is no discrepancy, just two unit systems.",
        },
        {
          title: "Examination and tests",
          prompt: "What do you check now?",
          mode: "multi",
          options: [
            { text: "Temperature, heart rate, blood pressure and breathing rate", good: true, feedback: "Temperature 37.6 °C, HR 92, BP 118/74, RR 16 and unlaboured. No deep, sighing breathing." },
            { text: "Blood or urine ketone test", good: true, feedback: "Blood ketones 0.4 mmol/L, which is within the range usually treated as normal." },
            { text: "Signs of dehydration: mucous membranes, skin turgor, capillary refill", good: true, feedback: "Slightly dry mouth; capillary refill under 2 seconds." },
            { text: "A lab blood chemistry panel including electrolytes", good: true, feedback: "Sodium, potassium and bicarbonate are within normal ranges; no acidosis." },
            { text: "CT scan of the head", good: false, feedback: "Nothing suggests a neurological problem; this adds radiation and cost without changing management." },
            { text: "Chest X-ray", good: false, feedback: "She has mild cold symptoms with normal breathing; it won't change the assessment of her glucose." },
          ],
          debrief:
            "Ketones and bicarbonate distinguish simple hyperglycaemia from ketoacidosis. Deep, rapid (Kussmaul) breathing would be a sign of metabolic acidosis: the body blowing off CO₂ to shift the carbonic acid equilibrium and raise pH.",
        },
        {
          title: "Interpretation",
          prompt: "What best describes her situation?",
          mode: "single",
          options: [
            { text: "Hyperglycaemia (about 14 mmol/L) during a minor illness, without ketoacidosis; the two readings agree once units are converted", good: true, feedback: "Correct: raised glucose, normal ketones and bicarbonate, and no unit discrepancy." },
            { text: "Diabetic ketoacidosis", good: false, feedback: "Ketones are not raised, bicarbonate is normal and she has no acidotic breathing." },
            { text: "A faulty home meter that reads ten times too low", good: false, feedback: "The meters agree; one simply reports mmol/L and the other mg/dL." },
            { text: "Hypoglycaemia", good: false, feedback: "Both readings are high. Misreading 14 mmol/L as 14 mg/dL would lead to exactly this dangerous mistake." },
          ],
          debrief:
            "Unit confusion, not a meter fault, explains her alarm. Reading a number without its unit can turn a high result into an apparently low one or the reverse, so every result should be read with its unit.",
        },
        {
          title: "Management principles",
          prompt: "What is the best overall approach (in a supervised clinical setting)?",
          mode: "single",
          options: [
            {
              text: "A clinician reviews her own sick-day plan with her, keeping everything in the unit her plan and meter use; encourage fluids and regular glucose and ketone checks; give clear advice to seek urgent care with vomiting, abdominal pain, rising ketones or drowsiness",
              good: true,
              feedback: "This keeps one consistent unit system, follows her diabetes team's plan, and makes sure she knows the warning signs of ketoacidosis.",
            },
            { text: "Have her switch her meter to mg/dL tonight and adjust her insulin from the new numbers on her own", good: false, feedback: "Switching units mid-illness, with a plan written in mmol/L, invites exactly the conversion error you just avoided." },
            { text: "Tell her to stop insulin until the glucose comes down", good: false, feedback: "People with type 1 diabetes need insulin even when unwell; stopping it can precipitate ketoacidosis." },
            { text: "Reassure her the reading is a meter error and send her home without advice", good: false, feedback: "The glucose really is high, and she needs monitoring and safety-net advice." },
          ],
          debrief:
            "Insulin adjustments are decisions for the patient's clinicians and diabetes plan; this case stays at the level of principles. The chemistry lesson is that a result is only meaningful with its unit, and that converting with the molar mass resolves apparent disagreements.",
        },
      ],
      teachingPoints: [
        "Glucose: mmol/L = mg/dL ÷ 18.0, because the molar mass is 180 g/mol and there are 10 dL in a litre.",
        "Always read a lab value with its unit; the same number means very different things in mg/dL and mmol/L.",
        "In type 1 diabetes with high glucose, check for ketones: ketoacidosis is the dangerous complication.",
        "Kussmaul breathing in acidosis is the carbonic acid equilibrium at work: breathing off CO₂ to raise pH.",
      ],
    },
  ],

  skills: [
    {
      id: "c111-skill-balance-flask",
      title: "Using an analytical balance and a volumetric flask",
      purpose: "Accurate weighing and making up to volume underpin every standard solution, from teaching labs to clinical reagents and compounded medicines.",
      items: [
        { text: "Checks the balance is level (bubble centred) and clean, and closes the draft-shield doors before taring", critical: true },
        { text: "Uses a clean, dry weighing boat or paper and never places chemicals directly on the pan", critical: true },
        { text: "Tares with the empty container on the pan and adds solid away from the pan, not over it" },
        { text: "Lets objects reach room temperature before weighing, and handles containers with tongs or a tissue to avoid fingerprint mass" },
        { text: "Waits for a stable reading and records the mass to the balance's last digit, with units, directly in the notebook", critical: true },
        { text: "Transfers the solid quantitatively, rinsing the boat and funnel into the flask" },
        { text: "Dissolves the solute in partial volume before filling to the mark" },
        { text: "Fills to the calibration mark with the bottom of the meniscus at eye level, using a dropper for the last drops", critical: true },
        { text: "Stoppers and inverts the flask at least 10 times to mix", critical: true },
        { text: "Labels the flask with contents, concentration, date and initials, and cleans the balance area afterwards" },
      ],
    },
  ],
};
