/**
 * Medical word parts for terminology flashcards. Each example is a real term with its meaning.
 * Progress ids are "term-<id>" in the shared ProgressStore.
 */

export type TermKind = "prefix" | "root" | "suffix";

export interface Term {
  id: string;
  part: string;
  kind: TermKind;
  meaning: string;
  example: string;
}

type Row = [id: string, part: string, meaning: string, example: string];
const of = (kind: TermKind, rows: Row[]): Term[] => rows.map(([id, part, meaning, example]) => ({ id, part, kind, meaning, example }));

export const TERMS: Term[] = [
  // Prefixes
  ...of("prefix", [
    ["a-an", "a-, an-", "without, absence of", "anaemia: lack of red cells or haemoglobin"],
    ["ab", "ab-", "away from", "abduction: movement of a limb away from the midline"],
    ["ad", "ad-", "towards", "adduction: movement of a limb towards the midline"],
    ["anti", "anti-", "against", "antibiotic: drug that acts against bacteria"],
    ["brady", "brady-", "slow", "bradycardia: slow heart rate (under 60 beats per minute)"],
    ["tachy", "tachy-", "fast", "tachycardia: fast heart rate (over 100 beats per minute)"],
    ["hyper", "hyper-", "above normal, excessive", "hypertension: blood pressure above normal"],
    ["hypo", "hypo-", "below normal, under", "hypoglycaemia: blood glucose below normal"],
    ["dys", "dys-", "difficult, painful, abnormal", "dyspnoea: difficult or laboured breathing"],
    ["eu", "eu-", "good, normal", "euthyroid: normal thyroid function"],
    ["peri", "peri-", "around", "pericarditis: inflammation of the sac around the heart"],
    ["endo", "endo-", "within, inside", "endoscopy: looking inside the body with an instrument"],
    ["epi", "epi-", "upon, above", "epidermis: outer layer of skin, on top of the dermis"],
    ["sub", "sub-", "below, under", "subcutaneous: beneath the skin"],
    ["intra", "intra-", "within", "intravenous: within a vein"],
    ["inter", "inter-", "between", "intercostal: between the ribs"],
    ["poly", "poly-", "many, much", "polyuria: passing large volumes of urine"],
    ["oligo", "olig/o-", "few, scanty", "oliguria: passing very little urine"],
    ["hemi", "hemi-", "half", "hemiplegia: paralysis of one side of the body"],
    ["micro", "micro-", "small", "microcephaly: abnormally small head"],
    ["macro", "macro-", "large", "macrocytic: having abnormally large cells (e.g. red cells)"],
    ["neo", "neo-", "new", "neonate: newborn infant (first 28 days)"],
    ["pre", "pre-", "before", "prenatal: before birth"],
    ["post", "post-", "after", "postoperative: after surgery"],
    ["pan", "pan-", "all, entire", "pancytopenia: reduction of all blood cell types"],
    ["leuk", "leuk/o-", "white", "leukocyte: white blood cell"],
    ["erythr", "erythr/o-", "red", "erythrocyte: red blood cell"],
    ["cyan", "cyan/o-", "blue", "cyanosis: bluish skin from low blood oxygen"],
  ]),
  // Roots / combining forms
  ...of("root", [
    ["cardi", "cardi/o", "heart", "cardiomyopathy: disease of the heart muscle"],
    ["hepat", "hepat/o", "liver", "hepatomegaly: enlarged liver"],
    ["nephr", "nephr/o", "kidney", "nephrolithiasis: kidney stones"],
    ["ren", "ren/o", "kidney", "renal failure: loss of kidney function"],
    ["gastr", "gastr/o", "stomach", "gastritis: inflammation of the stomach lining"],
    ["enter", "enter/o", "small intestine", "enteritis: inflammation of the small intestine"],
    ["col", "col/o, colon/o", "colon, large intestine", "colonoscopy: examination of the colon with a scope"],
    ["pneum", "pneum/o, pneumon/o", "lung, air", "pneumothorax: air in the pleural space"],
    ["pulmon", "pulmon/o", "lung", "pulmonary embolism: clot blocking a lung artery"],
    ["hem", "hem/o, hemat/o (US)", "blood", "hematuria: blood in the urine"],
    ["haem", "haem/o, haemat/o (UK)", "blood", "haemoptysis: coughing up blood"],
    ["oste", "oste/o", "bone", "osteoporosis: porous, fragile bones"],
    ["arthr", "arthr/o", "joint", "arthritis: inflammation of a joint"],
    ["my", "my/o", "muscle", "myalgia: muscle pain"],
    ["neur", "neur/o", "nerve", "neuropathy: disease of the nerves"],
    ["encephal", "encephal/o", "brain", "encephalitis: inflammation of the brain"],
    ["cerebr", "cerebr/o", "cerebrum, brain", "cerebrovascular: relating to the blood vessels of the brain"],
    ["derm", "derm/o, dermat/o", "skin", "dermatitis: inflammation of the skin"],
    ["angi", "angi/o", "vessel", "angioplasty: surgical repair or widening of a vessel"],
    ["arteri", "arteri/o", "artery", "arteriosclerosis: hardening of the arteries"],
    ["phleb", "phleb/o, ven/o", "vein", "phlebitis: inflammation of a vein"],
    ["thromb", "thromb/o", "clot", "thrombosis: formation of a blood clot in a vessel"],
    ["cyst", "cyst/o", "bladder, sac", "cystitis: inflammation of the urinary bladder"],
    ["ur", "ur/o", "urine, urinary tract", "urology: study and treatment of the urinary tract"],
    ["hyster", "hyster/o", "uterus", "hysterectomy: surgical removal of the uterus"],
    ["mast", "mast/o, mamm/o", "breast", "mastectomy: surgical removal of a breast"],
    ["oophor", "oophor/o", "ovary", "oophorectomy: surgical removal of an ovary"],
    ["ophthalm", "ophthalm/o", "eye", "ophthalmoscope: instrument for examining the inside of the eye"],
    ["ot", "ot/o", "ear", "otitis media: inflammation of the middle ear"],
    ["rhin", "rhin/o", "nose", "rhinitis: inflammation of the nasal lining"],
    ["laryng", "laryng/o", "larynx (voice box)", "laryngitis: inflammation of the larynx"],
    ["trache", "trache/o", "trachea (windpipe)", "tracheostomy: surgical opening into the trachea"],
    ["bronch", "bronch/o", "bronchus, airway", "bronchitis: inflammation of the bronchi"],
    ["chole", "chol/e", "bile, gall", "cholecystectomy: surgical removal of the gallbladder"],
    ["pancreat", "pancreat/o", "pancreas", "pancreatitis: inflammation of the pancreas"],
    ["aden", "aden/o", "gland", "adenoma: benign tumour of glandular tissue"],
    ["thyr", "thyr/o, thyroid/o", "thyroid gland", "thyroidectomy: surgical removal of the thyroid"],
    ["onc", "onc/o", "tumour, mass", "oncology: study and treatment of cancer"],
    ["cyt", "cyt/o", "cell", "cytology: study of cells"],
    ["path", "path/o", "disease", "pathology: study of disease"],
    ["glyc", "glyc/o, gluc/o", "sugar, glucose", "glycosuria: glucose in the urine"],
    ["lip", "lip/o", "fat", "lipoma: benign tumour of fatty tissue"],
    ["carcin", "carcin/o", "cancer", "carcinoma: cancer arising from epithelial tissue"],
    ["spondyl", "spondyl/o, vertebr/o", "vertebra, spine", "spondylosis: degeneration of the spine"],
    ["stomat", "stomat/o", "mouth", "stomatitis: inflammation of the mouth"],
  ]),
  // Suffixes
  ...of("suffix", [
    ["itis", "-itis", "inflammation", "appendicitis: inflammation of the appendix"],
    ["ectomy", "-ectomy", "surgical removal, excision", "appendicectomy: surgical removal of the appendix"],
    ["otomy", "-otomy", "cutting into, incision", "laparotomy: incision into the abdomen"],
    ["ostomy", "-ostomy", "surgical creation of an opening", "colostomy: opening from the colon to the abdominal wall"],
    ["algia", "-algia", "pain", "neuralgia: pain along a nerve"],
    ["emia", "-emia (US), -aemia (UK)", "blood condition", "hyperkalaemia: high potassium in the blood"],
    ["pathy", "-pathy", "disease", "nephropathy: disease of the kidney"],
    ["plasty", "-plasty", "surgical repair or reshaping", "rhinoplasty: surgical reshaping of the nose"],
    ["scopy", "-scopy", "visual examination", "bronchoscopy: looking into the airways with a scope"],
    ["megaly", "-megaly", "enlargement", "splenomegaly: enlarged spleen"],
    ["penia", "-penia", "deficiency, too few", "thrombocytopenia: too few platelets"],
    ["rrhea", "-rrhea (US), -rrhoea (UK)", "flow, discharge", "diarrhoea: frequent loose or watery stools"],
    ["rrhage", "-rrhage", "bursting forth, excessive bleeding", "haemorrhage: heavy bleeding"],
    ["oma", "-oma", "tumour, swelling", "melanoma: tumour of pigment-producing cells"],
    ["osis", "-osis", "abnormal condition", "fibrosis: abnormal formation of fibrous tissue"],
    ["logy", "-logy", "study of", "cardiology: study of the heart"],
    ["gram", "-gram", "record, image", "electrocardiogram: record of the heart's electrical activity"],
    ["graphy", "-graphy", "process of recording or imaging", "mammography: X-ray imaging of the breast"],
    ["uria", "-uria", "urine condition", "proteinuria: protein in the urine"],
    ["pnea", "-pnea (US), -pnoea (UK)", "breathing", "apnoea: temporary absence of breathing"],
    ["plegia", "-plegia", "paralysis", "paraplegia: paralysis of the legs and lower body"],
    ["cyte", "-cyte", "cell", "lymphocyte: a type of white blood cell"],
    ["genic", "-genic", "producing, caused by", "iatrogenic: caused by medical treatment"],
    ["lysis", "-lysis", "breakdown, destruction", "haemolysis: breakdown of red blood cells"],
    ["stasis", "-stasis", "stopping, standing still", "haemostasis: stopping of bleeding"],
    ["ectasis", "-ectasis", "dilation, widening", "bronchiectasis: permanent widening of the bronchi"],
  ]),
];
