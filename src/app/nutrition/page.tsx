"use client";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useProtocol } from "@/hooks/useProtocol";
import { useAppStore } from "@/store/app";
import { createMeal, getMeals } from "@/lib/data";
import { triggerGenerateNutrition } from "@/lib/workflows";
import { getUserId } from "@/lib/auth";
import BottomNav from "@/components/shared/BottomNav";
import LoadingScreen from "@/components/shared/LoadingScreen";
import {
  ChevronRight,
  Sun,
  Moon,
  Utensils,
  Leaf,
  Pill,
  Sparkles,
  Info,
} from "lucide-react";

const GOLD = "#D4B06A";
const SAGE = "#A8B9A5";
const SUCCESS = "#1F7A5A";
const LAVENDER = "#8B85C1";

interface Meal {
  _id?: string;
  meal_type: string;
  name: string;
  description: string;
  nutrients: string;
  calories?: number;
}

const fallbackMeals: Meal[] = [
  {
    _id: "f1",
    meal_type: "breakfast",
    name: "Avocado & Egg Toast",
    description: "Whole grain toast with smashed avocado and poached eggs.",
    nutrients: "Folate, Healthy Fats, Protein",
    calories: 380,
  },
  {
    _id: "f2",
    meal_type: "lunch",
    name: "Lentil & Spinach Soup",
    description: "Iron-rich lentil soup with wilted spinach and turmeric.",
    nutrients: "Iron, Vitamin C, Fiber",
    calories: 320,
  },
  {
    _id: "f3",
    meal_type: "dinner",
    name: "Salmon with Roasted Vegetables",
    description: "Omega-3 rich salmon fillet with seasonal roasted vegetables.",
    nutrients: "Omega-3, Vitamin D, Magnesium",
    calories: 520,
  },
  {
    _id: "f4",
    meal_type: "snacks",
    name: "Greek Yogurt with Berries",
    description: "Full-fat Greek yogurt with mixed berries and chia seeds.",
    nutrients: "Probiotics, Antioxidants, Calcium",
    calories: 180,
  },
];
const SECTIONS = [
  {
    id: "breakfast",
    label: "Breakfast",
    iconType: "sun",
    iconBg: "rgba(212,176,106,0.1)",
    iconColor: GOLD,
  },
  {
    id: "lunch",
    label: "Lunch",
    iconType: "utensils",
    iconBg: "rgba(168,185,165,0.15)",
    iconColor: SAGE,
  },
  {
    id: "dinner",
    label: "Dinner",
    iconType: "moon",
    iconBg: "rgba(139,133,193,0.1)",
    iconColor: LAVENDER,
  },
  {
    id: "snacks",
    label: "Snacks",
    iconType: "leaf",
    iconBg: "rgba(31,122,90,0.08)",
    iconColor: SUCCESS,
  },
];

function SectionIcon({ type, color }: { type: string; color: string }) {
  if (type === "sun") return <Sun size={18} color={color} />;
  if (type === "moon") return <Moon size={18} color={color} />;
  if (type === "leaf") return <Leaf size={18} color={color} />;
  return <Utensils size={18} color={color} />;
}

export default function NutritionPage() {
  useProfile();
  const { loading } = useProtocol();
  const { profile, protocol } = useAppStore();
  const [meals, setMeals] = useState<Record<string, Meal[]>>({});
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "breakfast",
  );
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [expandedSupp, setExpandedSupp] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!profile || loading || !protocol?._id) return;
  //   async function load() {
  //     try {
  //       const data: Meal[] = await getMeals(protocol!._id);
  //       if (data.length) {
  //         setMeals(groupMeals(data));
  //         setLoadingMeals(false);
  //       } else {
  //         setGenerating(true);
  //         await triggerGenerateNutrition(getUserId() ?? profile?._id);
  //         let attempts = 0;
  //         const iv = setInterval(async () => {
  //           attempts++;
  //           if (attempts > 8) {
  //             clearInterval(iv);
  //             setLoadingMeals(false);
  //             setGenerating(false);
  //             return;
  //           }
  //           const d: Meal[] = await getMeals(protocol!._id);
  //           if (d.length) {
  //             clearInterval(iv);
  //             setMeals(groupMeals(d));
  //             setLoadingMeals(false);
  //             setGenerating(false);
  //           }
  //         }, 3000);
  //       }
  //     } catch {
  //       setLoadingMeals(false);
  //     }
  //   }
  //   load();
  // }, [profile, protocol, loading]);

  const hasCreatedMeals = useRef(false);
  // useEffect(() => {
  //   if (!profile || !protocol?._id) return;

  //   // ⛔ Prevent duplicate execution
  //   if (hasCreatedMeals.current) return;

  //   let cancelled = false;

  //   async function load() {
  //     try {
  //       const existingMeals = await getMeals(protocol?._id ?? "");

  //       if (existingMeals.length > 0) {
  //         if (!cancelled) {
  //           setMeals(existingMeals);
  //           setLoading(false);
  //         }
  //         return;
  //       }

  //       // 🔒 LOCK before async starts
  //       hasCreatedMeals.current = true;

  //       const userId = getUserId() ?? profile?._id;
  //       const res = await triggerGenerateNutrition(userId ?? "");

  //       const parsed = JSON.parse(res.response.result);

  //       const meals = [
  //         { type: "breakfast", data: parsed.breakfast },
  //         { type: "lunch", data: parsed.lunch },
  //         { type: "dinner", data: parsed.dinner },
  //         { type: "snacks", data: parsed.snacks },
  //       ];

  //       await Promise.all(
  //         meals.map((meal) =>
  //           createMeal({
  //             protocol: protocol?._id ?? "",
  //             meal_type: meal.type,
  //             name: meal.data.name,
  //             description: meal.data.description,
  //             nutrients: meal.data.nutrients,
  //           }),
  //         ),
  //       );

  //       const createdMeals = await getMeals(protocol?._id ?? "");

  //       if (!cancelled) {
  //         setMeals(createdMeals);
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       if (!cancelled) {
  //         setMeals(fallbackMeals);
  //         setLoading(false);
  //       }
  //     }
  //   }

  //   load();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [profile, protocol?._id]);

  useEffect(() => {
    if (!profile || !protocol?._id) return;
    if (hasCreatedMeals.current) return;

    let cancelled = false;

    async function load() {
      try {
        const existingMeals = await getMeals(protocol?._id ?? "");

        if (existingMeals.length > 0) {
          if (!cancelled) {
            setMeals(groupMeals(existingMeals)); // ← was setMeals(existingMeals)
            setLoadingMeals(false); // ← was setLoading(false)
          }
          return;
        }

        hasCreatedMeals.current = true;

        const userId = getUserId() ?? profile?._id;
        const res = await triggerGenerateNutrition(userId ?? "");

        const parsed = JSON.parse(res.response.result);

        const mealList = [
          { type: "breakfast", data: parsed.breakfast },
          { type: "lunch", data: parsed.lunch },
          { type: "dinner", data: parsed.dinner },
          { type: "snacks", data: parsed.snacks },
        ];

        await Promise.all(
          mealList.map((meal) =>
            createMeal({
              protocol: protocol?._id ?? "",
              meal_type: meal.type,
              name: meal.data.name,
              description: meal.data.description,
              nutrients: meal.data.nutrients,
            }),
          ),
        );

        const createdMeals = await getMeals(protocol?._id ?? "");

        if (!cancelled) {
          setMeals(groupMeals(createdMeals)); // ← was setMeals(createdMeals)
          setLoadingMeals(false); // ← was setLoading(false)
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setMeals(groupMeals(fallbackMeals)); // ← was setMeals(fallbackMeals)
          setLoadingMeals(false); // ← was setLoading(false)
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profile, protocol?._id]);

  function groupMeals(data: Meal[]) {
    const g: Record<string, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
    data.forEach((m) => {
      const t = m.meal_type?.toLowerCase();
      if (g[t]) g[t].push(m);
    });
    return g;
  }

  if (!profile || loading)
    return <LoadingScreen message="Loading your nutrition plan..." />;

  const jt = profile.journey_type ?? "trying_to_conceive";
  const badge =
    jt === "currently_pregnant"
      ? "Trimester 2 Focus"
      : jt === "postpartum"
        ? "Recovery Focus"
        : "Fertility Focus";
  const headerSub =
    jt === "currently_pregnant"
      ? "Optimized for your pregnancy — Brain & Nervous System Support"
      : jt === "postpartum"
        ? "Optimized for Recovery — Restoration & Replenishment"
        : "Optimized for Fertility — Hormonal Balance & Egg Quality";
  const suppList = protocol?.supplements
    ? protocol.supplements
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-full bg-bg pb-24">
      {/* Header */}
      <div className="px-6 pt-5">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill mb-3.5"
          style={{ background: "rgba(212,176,106,0.1)" }}
        >
          <Sparkles size={11} color={GOLD} />
          <span className="text-2xs text-gold font-semibold tracking-wider">
            {badge}
          </span>
        </div>
        <h1 className="text-4xl font-medium text-primary tracking-tight leading-tight mb-2.5">
          Nutrition Plan
        </h1>
        <p className="font-serif italic text-md text-secondary leading-relaxed">
          {headerSub}
        </p>

        {protocol?.nutrition_plan && (
          <div
            className="mt-4 px-3.5 py-3 rounded-2xl"
            style={{
              background: "rgba(212,176,106,0.07)",
              borderLeft: "2px solid rgba(212,176,106,0.35)",
            }}
          >
            <p className="text-2xs text-gold uppercase tracking-widest font-semibold mb-1.5">
              Today's AI guidance
            </p>
            <p className="text-sm text-secondary leading-relaxed font-serif italic">
              {protocol.nutrition_plan}
            </p>
          </div>
        )}
        {protocol?.avoid_today && (
          <div
            className="mt-3 flex items-start gap-2 px-3.5 py-2.5 rounded-xl"
            style={{
              background: "rgba(194,107,46,0.07)",
              borderLeft: "2px solid rgba(194,107,46,0.3)",
            }}
          >
            <span className="text-warning text-xs">⚠</span>
            <div>
              <p className="text-2xs text-warning uppercase tracking-widest font-semibold mb-0.5">
                Avoid Today
              </p>
              <p className="text-sm text-warning leading-snug">
                {protocol.avoid_today}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 mt-6 flex flex-col gap-3">
        {/* Meal sections */}
        {loadingMeals ? (
          <div className="bg-card rounded-3xl p-6 border border-border text-center">
            <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent spin mx-auto mb-3" />
            <p className="text-base text-muted">
              {generating
                ? "Generating your personalized meal plan…"
                : "Loading meals…"}
            </p>
            <p className="text-2xs text-muted mt-1">
              This takes about 15–20 seconds
            </p>
          </div>
        ) : (
          SECTIONS.map((section) => {
            const sectionMeals = meals[section.id] || [];
            return (
              <div
                key={section.id}
                className="bg-card rounded-3xl overflow-hidden border border-border"
              >
                <button
                  onClick={() => {
                    setExpandedSection((s) =>
                      s === section.id ? null : section.id,
                    );
                    setExpandedMeal(null);
                  }}
                  className="w-full px-5 py-4.5 bg-transparent border-none cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: section.iconBg }}
                    >
                      <SectionIcon
                        type={section.iconType}
                        color={section.iconColor}
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="text-lg font-semibold text-primary">
                        {section.label}
                      </h3>
                      <p className="text-2xs text-muted mt-0.5">
                        {sectionMeals.length > 0
                          ? `${sectionMeals.length} meal idea${sectionMeals.length > 1 ? "s" : ""}`
                          : "Generating…"}
                      </p>
                    </div>
                    <ChevronRight
                      size={17}
                      className="text-muted shrink-0 transition-transform duration-300"
                      style={{
                        transform:
                          expandedSection === section.id
                            ? "rotate(90deg)"
                            : "none",
                      }}
                    />
                  </div>
                </button>

                {expandedSection === section.id && (
                  <div className="border-t border-border px-4 py-3 flex flex-col gap-2.5">
                    {sectionMeals.length === 0 ? (
                      <p className="text-sm text-muted text-center py-4">
                        No meals generated yet.
                      </p>
                    ) : (
                      sectionMeals.map((meal, mIdx) => {
                        const mKey = meal._id || `${section.id}-${mIdx}`;
                        return (
                          <div
                            key={mKey}
                            className="bg-elevated rounded-[18px] overflow-hidden border border-border"
                          >
                            <button
                              onClick={() =>
                                setExpandedMeal((m) =>
                                  m === mKey ? null : mKey,
                                )
                              }
                              className="w-full px-4.5 py-4 bg-transparent border-none cursor-pointer text-left"
                            >
                              <div className="flex items-start justify-between gap-2 p-3">
                                <div className="flex-1">
                                  <h4 className="text-md font-semibold text-primary leading-tight">
                                    {meal.name}
                                  </h4>
                                  <p className="text-2xs text-muted mt-1 font-serif italic leading-snug">
                                    {meal.description}
                                  </p>
                                </div>
                                <ChevronRight
                                  size={15}
                                  className="text-muted shrink-0 mt-1 transition-transform duration-200"
                                  style={{
                                    transform:
                                      expandedMeal === mKey
                                        ? "rotate(90deg)"
                                        : "none",
                                  }}
                                />
                              </div>
                            </button>
                            {expandedMeal === mKey && (
                              <div className="px-4.5 pb-4.5">
                                <div className="border-t border-border pt-3.5 mb-3.5 flex flex-col gap-2.5">
                                  {meal.nutrients && (
                                    <div className="flex items-baseline gap-2.5 pb-2.5 border-b border-border px-3">
                                      <span
                                        className="text-2xs text-muted font-semibold uppercase tracking-widest shrink-0"
                                        style={{ minWidth: 88 }}
                                      >
                                        Key Nutrients
                                      </span>
                                      <span className="text-sm text-primary font-medium leading-snug">
                                        {meal.nutrients}
                                      </span>
                                    </div>
                                  )}
                                  {meal.calories && (
                                    <div className="flex items-baseline gap-2.5">
                                      <span
                                        className="text-2xs text-muted font-semibold uppercase tracking-widest shrink-0"
                                        style={{ minWidth: 88 }}
                                      >
                                        Energy
                                      </span>
                                      <span className="text-sm text-gold font-semibold">
                                        ~{meal.calories} kcal
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="px-3.5 py-3 rounded-2xl mb-3.5 mx-3"
                                  style={{
                                    background: "rgba(212,176,106,0.07)",
                                    borderLeft:
                                      "2px solid rgba(212,176,106,0.35)",
                                  }}
                                >
                                  <p className="text-2xs text-gold uppercase tracking-widest font-semibold mb-1.5">
                                    Why this matters today
                                  </p>
                                  <p className="text-sm text-secondary leading-relaxed font-serif italic">
                                    {meal.description}
                                  </p>
                                </div>
                                <div className="flex items-start gap-2 px-3 py-2.5 bg-section rounded-xl mx-3 mb-2">
                                  <Info
                                    size={12}
                                    className="text-muted shrink-0 mt-0.5"
                                  />
                                  <p className="text-2xs text-muted leading-relaxed">
                                    Always confirm dietary changes with your
                                    healthcare provider.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Supplements from protocol */}
        {suppList.length > 0 && (
          <div className="bg-card rounded-3xl overflow-hidden border border-border">
            <button
              onClick={() =>
                setExpandedSection((s) =>
                  s === "supplements" ? null : "supplements",
                )
              }
              className="w-full px-5 py-4.5 bg-transparent border-none cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(212,176,106,0.1)" }}
                >
                  <Pill size={18} color={GOLD} />
                </div>
                <div className="flex-1 p-3">
                  <h3 className="text-lg font-semibold text-primary">
                    Vitamins & Supplements
                  </h3>
                  <p className="text-2xs text-muted mt-0.5">
                    {suppList.length} recommended today · AI personalized
                  </p>
                </div>
                <ChevronRight
                  size={17}
                  className="text-muted shrink-0 transition-transform duration-300"
                  style={{
                    transform:
                      expandedSection === "supplements"
                        ? "rotate(90deg)"
                        : "none",
                  }}
                />
              </div>
            </button>
            {expandedSection === "supplements" && (
              <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
                {suppList.map((supp, i) => (
                  <div
                    key={i}
                    className="bg-elevated rounded-2xl overflow-hidden border border-border"
                  >
                    <button
                      onClick={() =>
                        setExpandedSupp((s) =>
                          s === String(i) ? null : String(i),
                        )
                      }
                      className="w-full px-4 py-3.5 bg-transparent border-none cursor-pointer text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-gold shrink-0" />
                        <span className="text-base text-primary font-medium">
                          {supp}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-muted transition-transform duration-200"
                        style={{
                          transform:
                            expandedSupp === String(i)
                              ? "rotate(90deg)"
                              : "none",
                        }}
                      />
                    </button>
                    {expandedSupp === String(i) && (
                      <div className="px-4 pb-3.5">
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-section rounded-xl">
                          <Info
                            size={12}
                            className="text-muted shrink-0 mt-0.5"
                          />
                          <p className="text-2xs text-muted leading-relaxed">
                            Always confirm supplement changes with your
                            healthcare provider before adjusting your protocol.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
