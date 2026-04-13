'use client'
import BackHeader from '@/components/shared/BackHeader'
import BottomNav from '@/components/shared/BottomNav'
import { useProfile } from '@/hooks/useProfile'

const trimesters = [
  {
    label: 'First Trimester',
    weeks: 'Weeks 1–13',
    status: 'complete',
    modules: ['Prenatal vitamins initiated', 'Morning sickness management', 'First prenatal appointment', 'Genetic screening options'],
  },
  {
    label: 'Second Trimester',
    weeks: 'Weeks 14–26',
    status: 'active',
    modules: ['Anatomy scan at 20 weeks', 'Glucose screening test', 'Prenatal movement (safe exercises)', 'Iron & calcium optimization', 'Birth plan outline'],
  },
  {
    label: 'Third Trimester',
    weeks: 'Weeks 27–40',
    status: 'upcoming',
    modules: ['Group B Strep test', 'Birth preparation classes', 'Hospital bag packing', 'Postpartum support plan', 'Breastfeeding preparation'],
  },
]

const todayModules = [
  { title: 'Trimester Guide', sub: 'Nutrition, movement, and sleep — updated weekly', progress: 64 },
  { title: 'Prenatal Supplements', sub: 'Optimized for current gestational week', progress: 88 },
  { title: 'Prenatal Movement', sub: 'Safe exercises adapted for your trimester', progress: 70 },
  { title: 'Pregnancy Nutrition', sub: 'Calorie and macro targets for fetal development', progress: 75 },
  { title: 'Prenatal Movement', sub: 'Bodyweight exercises adapted for pregnancy', progress: 60 },
  { title: 'Birth Preparation', sub: 'Mental and physical readiness for labor', progress: 30 },
]

export default function PregnancyProtocolPage() {
  useProfile()

  return (
    <div className="min-h-screen bg-cream pb-24">
      <BackHeader href="/journey" />

      <div className="px-5 mb-4">
        <span className="text-xs text-muted uppercase tracking-wider font-medium">Stage 2 · Ongoing</span>
        <h1 className="font-serif text-2xl text-charcoal mt-1">Pregnancy Protocol</h1>
        <p className="text-sm text-muted mt-1 leading-relaxed">
          Tailored nutrition, movement, and preparation — optimized for you and your baby.
        </p>
      </div>

      {/* Overall progress */}
      <div className="px-5 mb-5">
        <div className="bg-white border border-border rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Protocol Progress</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: '64%' }} />
              </div>
              <span className="text-sm font-medium text-gold">64%</span>
            </div>
            <p className="text-xs text-muted mt-1">5 modules · 3–4 weeks</p>
          </div>
        </div>
      </div>

      {/* Trimester roadmap */}
      <div className="px-5 mb-5">
        <h2 className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Trimester Roadmap</h2>
        <div className="flex flex-col gap-3">
          {trimesters.map((t) => (
            <div key={t.label} className={`rounded-2xl px-4 py-4 border ${
              t.status === 'active' ? 'bg-gold-light border-gold/30' :
              t.status === 'complete' ? 'bg-white border-border' :
              'bg-white border-border opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-charcoal">{t.label}</p>
                <span className="text-xs text-muted">{t.weeks}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {t.modules.map((m) => (
                  <div key={m} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      t.status === 'complete' ? 'bg-gold' :
                      t.status === 'active' ? 'bg-gold' : 'bg-border'
                    }`} />
                    <p className="text-xs text-muted">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's modules */}
      <div className="px-5">
        <h2 className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Protocol Modules</h2>
        <div className="flex flex-col gap-3">
          {todayModules.map((mod) => (
            <div key={mod.title} className="bg-white border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-charcoal">{mod.title}</p>
                <span className="text-xs text-gold font-medium">{mod.progress}%</span>
              </div>
              <p className="text-xs text-muted mb-2">{mod.sub}</p>
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${mod.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
