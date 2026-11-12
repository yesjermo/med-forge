/**
 * Adult normal values for learning. Standard, widely taught textbook ranges only.
 * Reference ranges vary between laboratories: the local lab's range always wins.
 */

export interface NormalItem {
  name: string;
  range: string;
  unit: string;
  /** The same range in SI / alternative units, when commonly quoted. */
  si?: string;
  note?: string;
}

export interface NormalGroup {
  group: string;
  items: NormalItem[];
}

export const NORMALS: NormalGroup[] = [
  {
    group: "Adult vital signs",
    items: [
      { name: "Heart rate", range: "60–100", unit: "beats/min", note: "Resting adult." },
      { name: "Respiratory rate", range: "12–20", unit: "breaths/min", note: "Resting adult." },
      {
        name: "Blood pressure",
        range: "<120 / <80",
        unit: "mmHg",
        note: "“Normal” per AHA categories. Elevated: 120–129 / <80; stage 1 hypertension: 130–139 or 80–89.",
      },
      { name: "Temperature", range: "about 36.5–37.5", unit: "°C", note: "Varies with measurement site and time of day." },
      {
        name: "Oxygen saturation (SpO₂)",
        range: "95–100",
        unit: "%",
        note: "On room air. Some patients (e.g. with chronic hypercapnic lung disease) have a lower prescribed target range.",
      },
    ],
  },
  {
    group: "Electrolytes & renal",
    items: [
      { name: "Sodium (Na⁺)", range: "135–145", unit: "mmol/L" },
      { name: "Potassium (K⁺)", range: "3.5–5.0", unit: "mmol/L" },
      { name: "Chloride (Cl⁻)", range: "98–106", unit: "mmol/L" },
      { name: "Bicarbonate (HCO₃⁻)", range: "22–26", unit: "mmol/L", note: "Some labs quote 22–29 mmol/L for serum total CO₂." },
      { name: "Calcium (total)", range: "8.5–10.5", unit: "mg/dL", si: "about 2.1–2.6 mmol/L", note: "Interpret with albumin; ranges vary between labs." },
      { name: "Blood urea nitrogen (BUN)", range: "7–20", unit: "mg/dL", si: "urea about 2.5–7.1 mmol/L", note: "Ranges vary between labs." },
      { name: "Creatinine", range: "roughly 0.6–1.2", unit: "mg/dL", si: "roughly 53–106 µmol/L", note: "Depends on muscle mass and sex; ranges vary between labs." },
      { name: "Fasting glucose", range: "70–99", unit: "mg/dL", si: "3.9–5.5 mmol/L" },
    ],
  },
  {
    group: "Haematology",
    items: [
      { name: "Haemoglobin (adult male)", range: "roughly 13.5–17.5", unit: "g/dL", si: "roughly 135–175 g/L", note: "Ranges vary between labs." },
      { name: "Haemoglobin (adult female)", range: "roughly 12.0–15.5", unit: "g/dL", si: "roughly 120–155 g/L", note: "Ranges vary between labs; lower in pregnancy." },
      { name: "Haematocrit (adult male)", range: "roughly 40–50", unit: "%", note: "Approximate; ranges vary between labs." },
      { name: "Haematocrit (adult female)", range: "roughly 36–45", unit: "%", note: "Approximate; ranges vary between labs." },
      { name: "White cell count (WBC)", range: "4.5–11.0", unit: "×10⁹/L" },
      { name: "Platelets", range: "150–400", unit: "×10⁹/L" },
      { name: "INR", range: "roughly 0.8–1.2", unit: "", note: "Not on anticoagulants. Therapeutic targets on warfarin are higher and set by the prescriber." },
    ],
  },
  {
    group: "Arterial blood gas",
    items: [
      { name: "pH", range: "7.35–7.45", unit: "" },
      { name: "PaCO₂", range: "35–45", unit: "mmHg", si: "4.7–6.0 kPa" },
      { name: "PaO₂", range: "80–100", unit: "mmHg", si: "about 10.7–13.3 kPa", note: "On room air; falls with age." },
      { name: "HCO₃⁻", range: "22–26", unit: "mmol/L" },
      { name: "Base excess", range: "−2 to +2", unit: "mmol/L" },
      { name: "SaO₂", range: "95–100", unit: "%" },
    ],
  },
  {
    group: "Diabetes & lipids",
    items: [
      { name: "HbA1c", range: "<5.7", unit: "%", si: "<39 mmol/mol", note: "5.7–6.4% suggests prediabetes; ≥6.5% is a diagnostic threshold for diabetes (ADA)." },
      { name: "Total cholesterol", range: "<200 (desirable)", unit: "mg/dL", si: "about <5.2 mmol/L" },
      { name: "LDL cholesterol", range: "<100 (optimal)", unit: "mg/dL", note: "Individual targets depend on cardiovascular risk." },
      { name: "HDL cholesterol", range: ">40 (men), >50 (women)", unit: "mg/dL", note: "Higher is generally better." },
      { name: "Triglycerides (fasting)", range: "<150", unit: "mg/dL", si: "about <1.7 mmol/L" },
    ],
  },
  {
    group: "Fluid balance",
    items: [{ name: "Urine output (adult)", range: "≥0.5", unit: "mL/kg/h", note: "A commonly taught minimum; report sustained lower output." }],
  },
];
