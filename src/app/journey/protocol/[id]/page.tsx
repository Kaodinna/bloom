'use client'
import { use } from 'react'
import BackHeader from '@/components/shared/BackHeader'
import BottomNav from '@/components/shared/BottomNav'

const moduleData: Record<string, {
  title: string
  progress: number
  summary: string
  science: string
  steps: { title: string; detail: string; status: 'done' | 'active' | 'upcoming' }[]
  duration: string
}> = {
  'fertility-nutrition': {
    title: 'Fertility Nutrition',
    progress: 85,
    summary: 'Anti-inflammatory diet and nutrient density are the most impactful fertility levers.',
    science: 'A 2018 Harvard study found women on a Mediterranean-style diet had 66% lower risk of ovulatory infertility. These nutrients directly influence egg quality — aim for dietary variety across all color families.',
    duration: '3–6 months pre-conception',
    steps: [
      { title: 'Mediterranean foundation', detail: 'Build meals around vegetables, legumes, olive oil, and whole grains. This pattern consistently improves both male and female fertility markers.', status: 'done' },
      { title: 'Fertility superfoods', detail: 'Prioritize eggs, leafy greens, walnuts, and berries daily. These contain choline, folate, and antioxidants that directly protect egg and sperm DNA.', status: 'done' },
      { title: 'Protein & blood sugar stability', detail: 'Aim for 80–100g protein daily from varied sources. Stable blood sugar improves hormonal signaling and reduces PCOS risk.', status: 'active' },
      { title: 'Eliminate fertility disruptors', detail: 'Remove trans fats, excess sugar, and ultra-processed foods. These elevate inflammation which can impair egg quality and implantation.', status: 'upcoming' },
    ],
  },
  'supplement-protocol': {
    title: 'Supplement Protocol',
    progress: 77,
    summary: 'Evidence-based pre-conception supplementation tailored to your biology.',
    science: 'Nutrient deficiencies are surprisingly common even in well-nourished individuals. Strategic supplementation bridges gaps that diet alone cannot always fill.',
    duration: '60-day supplement cycle',
    steps: [
      { title: 'Prenatal multivitamin', detail: 'Start 3 months before trying to conceive. Look for methylated folate (5-MTHF) rather than folic acid for better absorption.', status: 'done' },
      { title: 'Omega-3 (DHA/EPA)', detail: '1000mg daily of combined DHA+EPA. Critical for fetal brain development and reducing inflammation.', status: 'done' },
      { title: 'Vitamin D3 + K2', detail: 'Target serum levels of 40–60 ng/mL. Most people need 2000–4000 IU daily. K2 ensures proper calcium routing.', status: 'active' },
      { title: 'CoQ10 (Ubiquinol)', detail: '200–600mg daily. Improves egg mitochondrial function — especially important over age 30. Take with fatty meal.', status: 'active' },
      { title: 'Magnesium glycinate', detail: '300mg before bed. Reduces cortisol, improves sleep quality, and supports progesterone production.', status: 'upcoming' },
    ],
  },
  'partner-optimization': {
    title: 'Partner Optimization',
    progress: 60,
    summary: 'Male factor contributes to 40–50% of all fertility challenges. Sperm health is highly modifiable.',
    science: 'Sperm takes 74 days to mature. Changes made today show results in 3 months. Diet, heat exposure, and oxidative stress are the top modifiable factors.',
    duration: '90-day sperm optimization cycle',
    steps: [
      { title: 'Reduce heat exposure', detail: 'Avoid hot tubs, saunas, and tight underwear. Scrotal temperature above 35°C significantly reduces sperm motility and morphology.', status: 'active' },
      { title: 'Antioxidant protocol', detail: 'Add Vitamin C (1000mg), Vitamin E (400 IU), and Zinc (25mg) daily. These protect sperm DNA from oxidative damage.', status: 'active' },
      { title: 'Lifestyle adjustments', detail: 'Limit alcohol to under 5 drinks/week, eliminate smoking, and aim for 7–9 hours sleep. Each factor independently improves sperm parameters.', status: 'upcoming' },
    ],
  },
  'cycle-tracking': {
    title: 'Cycle Tracking',
    progress: 90,
    summary: 'Understanding your cycle gives you a 6-day fertile window each month.',
    science: 'Combining BBT charting with cervical mucus observation (Sympto-Thermal Method) has 99.6% accuracy when practiced correctly.',
    duration: 'Daily tracking',
    steps: [
      { title: 'Basal body temperature', detail: 'Take temperature at the same time every morning before getting up. A sustained rise of 0.2°C confirms ovulation has occurred.', status: 'done' },
      { title: 'Cervical mucus monitoring', detail: 'Observe changes throughout your cycle. Egg-white consistency indicates peak fertility — this is your highest conception probability window.', status: 'done' },
      { title: 'Cycle pattern analysis', detail: 'After 2–3 cycles of data, patterns emerge that allow prediction of your next fertile window with high accuracy.', status: 'active' },
    ],
  },
  'stress-sleep': {
    title: 'Stress & Sleep',
    progress: 55,
    summary: 'HPA axis dysregulation suppresses reproductive hormones. Sleep is your most powerful recovery tool.',
    science: 'Chronic cortisol elevation directly suppresses LH surges, delaying or blocking ovulation. Seven to nine hours of sleep restores the hormonal milieu needed for conception.',
    duration: 'Foundation of all other protocols',
    steps: [
      { title: 'Sleep architecture', detail: 'Target 7–9 hours with consistent bed and wake times. Darkness and cool temperature (18°C) optimize sleep depth and melatonin production.', status: 'active' },
      { title: 'Cortisol regulation', detail: 'Morning sunlight within 30 minutes of waking sets your cortisol rhythm for the day. Avoid screens 2 hours before bed to protect melatonin.', status: 'active' },
      { title: 'Active stress reduction', detail: 'Daily 10-minute mindfulness or breathwork practice reduces cortisol by up to 23% according to controlled trials.', status: 'upcoming' },
      { title: 'Nervous system support', detail: 'Magnesium, ashwagandha (KSM-66), and L-theanine are well-evidenced adaptogens for HPA regulation without sedation.', status: 'upcoming' },
    ],
  },
  'lifestyle': {
    title: 'Lifestyle Optimization',
    progress: 70,
    summary: 'Environmental and circadian factors have measurable impact on reproductive outcomes.',
    science: 'Endocrine disruptors (BPA, phthalates, parabens) mimic estrogen and disrupt hormonal signaling. Eliminating top sources reduces burden significantly.',
    duration: 'Ongoing · Review monthly',
    steps: [
      { title: 'Eliminate fertility disruptors', detail: 'Switch to glass or stainless water bottles, choose fragrance-free personal care products, and avoid plastic food containers especially when heating.', status: 'done' },
      { title: 'Circadian alignment', detail: 'Eat within a 10-hour window, exercise in the morning, and maintain consistent sleep timing. Circadian disruption is linked to reduced fertility in multiple studies.', status: 'active' },
      { title: 'Movement protocol', detail: 'Aim for 150 minutes moderate exercise weekly. Avoid extreme high-intensity exercise which can suppress ovulation in some women.', status: 'active' },
      { title: 'Environmental audit', detail: 'Review cleaning products, cookware (avoid non-stick), and air quality. HEPA air filtration reduces particulate load that can affect reproductive outcomes.', status: 'upcoming' },
    ],
  },
}

const statusColors = {
  done:     { dot: 'bg-gold',   text: 'text-gold',    label: 'Complete' },
  active:   { dot: 'bg-green-500', text: 'text-green-600', label: 'In progress' },
  upcoming: { dot: 'bg-border', text: 'text-muted',   label: 'Upcoming' },
}

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const mod = moduleData[id]

  if (!mod) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-muted text-sm">Module not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <BackHeader href="/journey/protocol" />

      {/* Header */}
      <div className="px-5 mb-4">
        <h1 className="font-serif text-2xl text-charcoal">{mod.title}</h1>
        <p className="text-sm text-muted mt-1 leading-relaxed">{mod.summary}</p>
      </div>

      {/* Progress */}
      <div className="px-5 mb-5">
        <div className="bg-white border border-border rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted uppercase tracking-wider">Progress</span>
            <span className="text-sm font-medium text-gold">{mod.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${mod.progress}%` }} />
          </div>
          <p className="text-xs text-muted mt-2">{mod.duration}</p>
        </div>
      </div>

      {/* Science card */}
      <div className="px-5 mb-5">
        <div className="bg-gold-light border border-gold/20 rounded-2xl px-4 py-4">
          <p className="text-xs text-gold uppercase tracking-wider font-medium mb-2">The Science</p>
          <p className="text-sm text-charcoal leading-relaxed">{mod.science}</p>
        </div>
      </div>

      {/* Protocol steps */}
      <div className="px-5">
        <h2 className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Protocol Steps</h2>
        <div className="flex flex-col gap-3">
          {mod.steps.map((step, i) => {
            const style = statusColors[step.status]
            return (
              <div key={i} className="bg-white border border-border rounded-2xl px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${style.dot} flex-shrink-0 mt-1.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-charcoal">{step.title}</p>
                      <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
