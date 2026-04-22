// ─────────────────────────────────────────────────────────────
// Week Context — generated directly from pregnancy_foods.json
// Each week range uses only foods whose 'stage' field includes
// that week. No hardcoded or invented food data.
// ─────────────────────────────────────────────────────────────

export interface WeekContext {
  week_context: string; // biological development happening right now
  food_matches: string; // food names + nutrients from dataset
  food_detail: string; // per-food: name (nutrient: baby_effect; mother_effect)
}

const WEEK_DATA: Array<{
  start: number;
  end: number;
  context: string;
  foods: string;
  detail: string;
}> = [
  // Weeks 1–4 — 8 foods from dataset
  {
    start: 1,
    end: 4,
    context:
      "The neural tube is closing to form the brain and spinal cord. The heart is beginning to beat. This is the most critical folate window — deficiency here causes neural tube defects.",
    foods:
      "Priority nutrients: choline, folate, iron, gingerol, menthol, antioxidants. Foods from dataset: Eggs, Spinach, Ginger, Peppermint, Blueberries, Bananas, Garlic, Quinoa.",
    detail:
      "Eggs (choline: boosts brain cell formation; for mother: supports hormone balance). Spinach (folate, iron: supports DNA formation; for mother: prevents anemia). Ginger (gingerol: indirect protection; for mother: reduces nausea). Peppermint (menthol: indirect; for mother: reduces nausea). Blueberries (antioxidants: protects brain cells; for mother: reduces oxidative stress). Bananas (potassium: supports muscle function; for mother: reduces nausea).",
  },
  // Weeks 5–8 — 8 foods from dataset
  {
    start: 5,
    end: 8,
    context:
      "The brain is dividing into its two hemispheres. All major organs are beginning to form. Choline drives neural tube closure and early brain cell multiplication.",
    foods:
      "Priority nutrients: choline, folate, iron, gingerol, sulforaphane, vitamin K. Foods from dataset: Eggs, Avocado, Spinach, Lentils, Ginger, Broccoli, Asparagus, Kale.",
    detail:
      "Eggs (choline: boosts brain cell formation; for mother: supports hormone balance). Avocado (folate: supports brain and spine; for mother: stabilizes blood sugar). Spinach (folate, iron: supports DNA formation; for mother: prevents anemia). Lentils (iron: supports tissue growth; for mother: prevents fatigue). Ginger (gingerol: indirect protection; for mother: reduces nausea). Broccoli (sulforaphane: supports organ formation; for mother: detox support).",
  },
  // Weeks 9–12 — 8 foods from dataset
  {
    start: 9,
    end: 12,
    context:
      "All major organs are now present. DNA is replicating at its highest rate. The immune system begins forming. Antioxidants protect rapidly dividing cells from oxidative damage.",
    foods:
      "Priority nutrients: omega-3, folate, iron, beta-carotene, gingerol, vitamin E. Foods from dataset: Walnuts, Avocado, Spinach, Sweet potatoes, Lentils, Ginger, Almonds, Broccoli.",
    detail:
      "Walnuts (omega-3: enhances brain connectivity; for mother: reduces inflammation). Avocado (folate: supports brain and spine; for mother: stabilizes blood sugar). Spinach (folate, iron: supports DNA formation; for mother: prevents anemia). Sweet potatoes (beta-carotene: supports eye development; for mother: boosts immunity). Lentils (iron: supports tissue growth; for mother: prevents fatigue). Ginger (gingerol: indirect protection; for mother: reduces nausea).",
  },
  // Weeks 13–16 — 8 foods from dataset
  {
    start: 13,
    end: 16,
    context:
      "The skeleton is hardening from cartilage to bone. Fingerprints are forming. Hearing begins to develop. Calcium and magnesium are essential for skeletal mineralisation.",
    foods:
      "Priority nutrients: omega-3, folate, DHA, beta-carotene, iron, fiber. Foods from dataset: Walnuts, Avocado, Salmon, Sweet potatoes, Lentils, Chia seeds, Almonds, Broccoli.",
    detail:
      "Walnuts (omega-3: enhances brain connectivity; for mother: reduces inflammation). Avocado (folate: supports brain and spine; for mother: stabilizes blood sugar). Salmon (DHA: enhances brain growth; for mother: supports mood stability). Sweet potatoes (beta-carotene: supports eye development; for mother: boosts immunity). Lentils (iron: supports tissue growth; for mother: prevents fatigue). Chia seeds (omega-3, fiber: supports brain + spine; for mother: improves digestion).",
  },
  // Weeks 17–20 — 8 foods from dataset
  {
    start: 17,
    end: 20,
    context:
      "The brain is growing at an extraordinary rate — synaptic connections are forming rapidly. Hearing is fully active. Fat tissue begins depositing. DHA directly fuels brain wiring.",
    foods:
      "Priority nutrients: omega-3, magnesium, folate, DHA, beta-carotene, iron. Foods from dataset: Walnuts, Pumpkin seeds, Avocado, Salmon, Sweet potatoes, Lentils, Chia seeds, Almonds.",
    detail:
      "Walnuts (omega-3: enhances brain connectivity; for mother: reduces inflammation). Pumpkin seeds (magnesium: supports nervous system; for mother: reduces cramps). Avocado (folate: supports brain and spine; for mother: stabilizes blood sugar). Salmon (DHA: enhances brain growth; for mother: supports mood stability). Sweet potatoes (beta-carotene: supports eye development; for mother: boosts immunity). Lentils (iron: supports tissue growth; for mother: prevents fatigue).",
  },
  // Weeks 21–24 — 8 foods from dataset
  {
    start: 21,
    end: 24,
    context:
      "Viability milestone. The lungs are developing air sacs (alveoli). Brain synapse formation is at peak speed. This is the most critical window for brain architecture.",
    foods:
      "Priority nutrients: omega-3, nitrates, iron, magnesium, calcium, probiotics. Foods from dataset: Walnuts, Beetroot, Pumpkin seeds, Greek yogurt, Dark chocolate (85%), Salmon, Sweet potatoes, Chia seeds.",
    detail:
      "Walnuts (omega-3: enhances brain connectivity; for mother: reduces inflammation). Beetroot (nitrates, iron: improves oxygen delivery; for mother: boosts blood flow). Pumpkin seeds (magnesium: supports nervous system; for mother: reduces cramps). Greek yogurt (calcium, probiotics: builds strong bones; for mother: supports gut health). Dark chocolate (85%) (flavonoids: supports placenta function; for mother: reduces stress). Salmon (DHA: enhances brain growth; for mother: supports mood stability).",
  },
  // Weeks 25–28 — 8 foods from dataset
  {
    start: 25,
    end: 28,
    context:
      "The baby's eyes are opening for the first time. The brain is folding into its final structure. Fat stores are building to regulate body temperature after birth.",
    foods:
      "Priority nutrients: nitrates, iron, magnesium, calcium, probiotics, flavonoids. Foods from dataset: Beetroot, Pumpkin seeds, Greek yogurt, Dark chocolate (85%), Salmon, Sweet potatoes, Chia seeds, Oats.",
    detail:
      "Beetroot (nitrates, iron: improves oxygen delivery; for mother: boosts blood flow). Pumpkin seeds (magnesium: supports nervous system; for mother: reduces cramps). Greek yogurt (calcium, probiotics: builds strong bones; for mother: supports gut health). Dark chocolate (85%) (flavonoids: supports placenta function; for mother: reduces stress). Salmon (DHA: enhances brain growth; for mother: supports mood stability). Sweet potatoes (beta-carotene: supports eye development; for mother: boosts immunity).",
  },
  // Weeks 29–32 — 8 foods from dataset
  {
    start: 29,
    end: 32,
    context:
      "The brain is completing its folded architecture. The immune system is developing rapidly. Bones are hardening. The baby is gaining approximately 200g per week.",
    foods:
      "Priority nutrients: nitrates, iron, magnesium, calcium, probiotics, flavonoids. Foods from dataset: Beetroot, Pumpkin seeds, Greek yogurt, Dark chocolate (85%), Salmon, Sweet potatoes, Chia seeds, Oats.",
    detail:
      "Beetroot (nitrates, iron: improves oxygen delivery; for mother: boosts blood flow). Pumpkin seeds (magnesium: supports nervous system; for mother: reduces cramps). Greek yogurt (calcium, probiotics: builds strong bones; for mother: supports gut health). Dark chocolate (85%) (flavonoids: supports placenta function; for mother: reduces stress). Salmon (DHA: enhances brain growth; for mother: supports mood stability). Sweet potatoes (beta-carotene: supports eye development; for mother: boosts immunity).",
  },
  // Weeks 33–36 — 8 foods from dataset
  {
    start: 33,
    end: 36,
    context:
      "The lungs are maturing and producing surfactant. Fat stores are completing. The baby is moving into head-down position for birth.",
    foods:
      "Priority nutrients: nitrates, iron, magnesium, calcium, probiotics, flavonoids. Foods from dataset: Beetroot, Pumpkin seeds, Greek yogurt, Dark chocolate (85%), Salmon, Sweet potatoes, Chia seeds, Oats.",
    detail:
      "Beetroot (nitrates, iron: improves oxygen delivery; for mother: boosts blood flow). Pumpkin seeds (magnesium: supports nervous system; for mother: reduces cramps). Greek yogurt (calcium, probiotics: builds strong bones; for mother: supports gut health). Dark chocolate (85%) (flavonoids: supports placenta function; for mother: reduces stress). Salmon (DHA: enhances brain growth; for mother: supports mood stability). Sweet potatoes (beta-carotene: supports eye development; for mother: boosts immunity).",
  },
  // Weeks 37–42 — 8 foods from dataset
  {
    start: 37,
    end: 42,
    context:
      "The baby is fully developed. The cervix is preparing for birth. Dates consumed from week 36 are clinically associated with shorter labour duration and cervical ripening.",
    foods:
      "Priority nutrients: magnesium, natural sugars, nitrates, iron, calcium, probiotics. Foods from dataset: Dates, Beetroot, Pumpkin seeds, Greek yogurt, Dark chocolate (85%), Salmon, Sweet potatoes, Chia seeds.",
    detail:
      "Dates (magnesium, natural sugars: supports smoother labor transition; for mother: helps cervical ripening). Beetroot (nitrates, iron: improves oxygen delivery; for mother: boosts blood flow). Pumpkin seeds (magnesium: supports nervous system; for mother: reduces cramps). Greek yogurt (calcium, probiotics: builds strong bones; for mother: supports gut health). Dark chocolate (85%) (flavonoids: supports placenta function; for mother: reduces stress). Salmon (DHA: enhances brain growth; for mother: supports mood stability).",
  },
];

const FALLBACK: WeekContext = {
  week_context:
    "Focus on nutrient density for fertility and early pregnancy. Folate, DHA, iron, and antioxidants are foundational.",
  food_matches:
    "Priority nutrients: antioxidants, potassium, allicin, protein, magnesium, electrolytes. Foods: Blueberries, Bananas, Garlic, Quinoa, Coconut water, Apples, Raspberries, Cranberries.",
  food_detail:
    "Blueberries (antioxidants: protects brain cells; for mother: reduces oxidative stress). Bananas (potassium: supports muscle function; for mother: reduces nausea). Garlic (allicin: supports immune system; for mother: improves circulation). Quinoa (protein, magnesium: supports cell growth; for mother: provides complete protein). Coconut water (electrolytes: supports fluid balance; for mother: prevents dehydration).",
};

// export function getWeekContext(
//   journeyType: string,
//   currentWeek: number,
// ): WeekContext {
//   if (
//     journeyType !== "currently_pregnant" ||
//     !currentWeek ||
//     currentWeek <= 0
//   ) {
//     return FALLBACK;
//   }
//   const match = WEEK_DATA.find(
//     (r) => currentWeek >= r.start && currentWeek <= r.end,
//   );
//   if (!match) return FALLBACK;
//   return {
//     week_context: match.context,
//     food_matches: match.foods,
//     food_detail: match.detail,
//   };
// }

export function getWeekContext(
  journeyType: string,
  currentWeek: number,
): WeekContext {
  if (journeyType === "currently_pregnant" && currentWeek > 0) {
    const match = WEEK_DATA.find(
      (r) => currentWeek >= r.start && currentWeek <= r.end,
    );
    if (match)
      return {
        week_context: match.context,
        food_matches: match.foods,
        food_detail: match.detail,
      };
  }

  if (journeyType === "postpartum") {
    return {
      week_context: `Week ${currentWeek} postpartum. Blood volume is recovering after birth. Nutrient demands are high — iron, DHA, choline, and protein are being actively depleted by milk production. Every food choice directly affects milk quality and therefore what the baby receives.`,
      food_matches:
        "Priority nutrients: iron, DHA, choline, calcium, protein, iodine, zinc. Key foods: Salmon, Eggs, Oats, Lentils, Greek yogurt, Spinach, Dates, Bone broth.",
      food_detail:
        "Salmon (DHA: enhances brain growth; for mother: supports mood stability). Eggs (choline: boosts brain cell formation; for mother: supports hormone balance). Oats (complex carbs: steady growth; for mother: stabilizes energy + stimulates prolactin). Lentils (iron: supports tissue growth; for mother: prevents fatigue). Greek yogurt (calcium, probiotics: builds strong bones; for mother: supports gut health). Spinach (folate, iron: supports DNA formation; for mother: prevents anemia). Dates (magnesium: supports smoother development; for mother: restores blood energy). Bone broth (collagen: joint development; for mother: collagen support).",
    };
  }

  // TTC fallback
  return FALLBACK;
}
export interface MilkContext {
  milk_logic: string; // core blood→milk logic
  key_nutrients: string; // what each nutrient does for blood, milk, baby
  blood_support: string; // how to improve blood quality
  milk_boosters: string; // foods that directly boost milk production/quality
  evening_feeding: string; // night feeding timing and benefits
  oral_health: string; // mother oral flora → baby health link
  environment: string; // birth environment and general wellness factors
  electrical: string; // device/radiation awareness
}
export function getMilkContext(): MilkContext {
  return {
    milk_logic:
      "Breast milk is produced from the mother's blood. Blood quality directly determines milk quality and therefore baby development. Every food recommendation should explain: (1) how it improves the mother's blood, (2) how that improves the milk, (3) what the baby receives through the milk.",

    key_nutrients: [
      "Iron: rebuilds blood after birth → improves oxygen transport in milk → supports baby brain and growth",
      "Omega-3 DHA: improves blood fat quality → enriches milk fats → baby brain and eye development",
      "Choline: supports brain and blood function → increases cognitive nutrients in milk → baby nervous system",
      "Vitamin B complex: improves blood metabolism → supports milk nutrient profile → baby nervous system",
      "Vitamin A: supports immune system → enriches milk quality → baby immune and vision development",
      "Protein: repairs tissue and blood → improves milk structure → baby growth and muscle development",
      "Iodine: supports thyroid → regulates hormones in milk → baby brain development",
      "Zinc: supports healing → improves immune factors in milk → baby immune system",
    ].join(". "),

    blood_support:
      "Blood became thicker during pregnancy — postpartum priority is normalising blood flow. Actions: increase iron intake, ensure 2.5–3L hydration daily, consume omega-3 fats, avoid inflammatory foods. Blood-thinning foods that improve circulation and therefore nutrient transport to milk: garlic, ginger, turmeric, fish, walnuts.",

    milk_boosters:
      "Foods that directly stimulate or enrich milk: Oats (stimulates prolactin for milk production), Fennel (supports milk flow), Dates (restores blood + increases energy in milk), Eggs (increases choline for baby brain via milk), Salmon (increases DHA in milk for brain and eye development).",

    evening_feeding:
      "Evening and night breastfeeding sessions are the most hormonally productive. Prolactin — the hormone that drives milk production — peaks between 2AM and 6AM. Night feeding directly stimulates the next day's milk supply. Dinner and evening snack recommendations should include tryptophan-rich foods (turkey, oats, bananas) which support both maternal sleep quality and calm baby behaviour during night feeds. Magnesium in the evening meal supports relaxation and deeper sleep between feeds.",

    oral_health:
      "The mother's oral microbiome is directly transferred to the baby during feeding, kissing, and shared environments. Harmful oral bacteria (Streptococcus mutans) can colonise the baby's developing gut and oral cavity. Recommendations: include probiotic-rich foods (yogurt, kefir, sauerkraut) which improve oral and gut flora. Vitamin C supports gum health. Calcium and phosphorus protect tooth enamel. A healthy maternal oral environment reduces baby's risk of early caries and supports a healthy gut microbiome from birth.",

    environment:
      "Birth environment influences postpartum hormonal recovery. Skin-to-skin contact in calm environments elevates oxytocin which directly boosts milk letdown. Stress hormones (cortisol, adrenaline) suppress prolactin and reduce milk supply. Nutritional support for stress regulation includes magnesium, ashwagandha (where appropriate postpartum), and B vitamins. Dim lighting in the evening supports melatonin production which improves sleep quality between feeds. Recommend foods that support the parasympathetic nervous system: oats, dark leafy greens, chamomile tea, walnuts.",

    electrical:
      "Prolonged proximity to wireless devices and screens increases cortisol and disrupts melatonin production — both of which negatively affect milk supply and sleep quality. Recommendations should note: keeping devices out of the bedroom supports deeper sleep between feeds; blue light exposure after 8PM suppresses the melatonin that governs both maternal sleep architecture and, through milk, the baby's circadian rhythm development. Foods that support melatonin: cherries, walnuts, oats, bananas. Antioxidant-rich foods (blueberries, pomegranate, dark chocolate) support cellular resilience.",
  };
}
