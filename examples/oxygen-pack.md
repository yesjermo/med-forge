::: proof id="PRE-OXYHB-0001" domain="PREMED" title="Oxygen–haemoglobin dissociation and the Bohr effect"
Assumptions & Constraints:
- Haemoglobin binds oxygen cooperatively at four sites
- Hill model with a constant Hill coefficient

Steps:
1. Saturation follows the Hill equation with $n \approx 2.7$
2. At $P_{O_2} = P_{50}$ the saturation is $S = 0.5$
3. Raised $CO_2$, $H^+$, temperature or 2,3-BPG raise $P_{50}$, so the curve shifts right

Traps & Failure Modes:
- Reading a right shift as higher affinity (it is lower affinity)
- Treating the curve as linear: saturation changes little above about 60 mmHg
- Forgetting that fetal haemoglobin binds 2,3-BPG weakly, so its curve sits left

Conclusion:

$$ S = \frac{P_{O_2}^{\,n}}{P_{50}^{\,n} + P_{O_2}^{\,n}} $$

Sources:
- Input lecture notes
- Hall JE, Hall ME, Guyton and Hall Textbook of Medical Physiology, 2020
:::

::: idea id="PRE-OXYHB-0002" domain="PREMED" subfield="PHYSIOLOGY" title="Measure the Bohr shift in a teaching lab" ref="PRE-OXYHB-0001"
Problem / Gap:
Students memorise the right shift without ever seeing it.

Approach:
- Component or method: absorbance spectra of haemoglobin solutions at two pH values
- Interface / protocol / instrument: visible-range spectrophotometer

Trade-off:
- Gain: a measured curve instead of a memorised one
- Cost: needs controlled oxygen tension

Validation Plan:
- Compare fitted $P_{50}$ at pH 7.2 and 7.6 across lab groups

Sources:
- [UNVERIFIED — search: "oxygen dissociation curve undergraduate laboratory" on PubMed]
:::

::: exchange id="PRE-OXYHB-0003" ref="PRE-OXYHB-0001" topic="Does a right shift always help the tissues?"
Proposed Solution:
A right shift raises unloading in the tissues at the cost of slightly lower loading in the lungs.

Stress Tests:
- [ ] Repeat the argument at high altitude
- [ ] Explain carbon monoxide poisoning with the same curve
:::

Open Questions:
- What Hill coefficient does the lecture use?
