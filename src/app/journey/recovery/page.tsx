'use client'
import BackHeader from '@/components/shared/BackHeader'
import BottomNav from '@/components/shared/BottomNav'
import { useProfile } from '@/hooks/useProfile'

const recoveryModules = [
  { title: 'Hormone Recovery', progress: 30, sub: 'Estrogen and progesterone rebalancing post-birth', detail: 'Ongoing · 6–12 weeks', icon: '⚗️' },
  { title: 'Nutritional Rebuild', progress: 45, sub: 'Replenish iron, zinc, and collagen stores', detail: 'Daily · 12 weeks protocol', icon: '🥗' },
  { title: 'Pelvic Floor Rehab', progress: 20, sub: 'Progressive pelvic floor restoration', detail: 'Daily · 6 weeks minimum', icon: '💪' },
  { title: 'Sleep Optimization', progress: 50, sub: 'Maximise rest quality in fragmented sleep cycles', detail: 'Ongoing', icon: '😴' },
  { title: 'Daily Exercise', progress: 35, sub: 'Gentle movement progressing to full activity', detail: '12-week return-to-exercise plan', icon: '🚶' },
  { title: 'Stabilize Hormones', progress: 40, sub: 'Support mood and energy through hormonal shift', detail: 'Supplement stack + lifestyle', icon: '🌿' },
  { title: 'Lab Monitoring Schedule', progress: 25, sub: 'Postpartum bloodwork and checkups', detail: '6 weeks · 3 months · 6 months', icon: '🔬' },
]

const practices = [
  { title: 'Hormone Recovery', steps: ['Progesterone cream (if prescribed)', 'Reduce alcohol entirely', 'Adaptogen protocol: ashwagandha + maca'], icon: '⚗️', color: 'bg-gold-light border-gold/20' },
  { title: 'Nutritional Rebuild', steps: ['Iron-rich foods at every meal', 'Bone broth daily (collagen + minerals)', 'Vitamin C with iron sources for absorption'], icon: '🥗', color: 'bg-white border-border' },
  { title: 'Pelvic Floor Rehab', steps: ['Kegel exercises: 3 sets of 10 daily', 'Diaphragmatic breathing', 'Avoid heavy lifting until cleared by physio'], icon: '💪', color: 'bg-white border-border' },
]

export default function RecoveryPage() {
  useProfile()

  const overallProgress = Math.round(
    recoveryModules.reduce((s, m) => s + m.progress, 0) / recoveryModules.length
  )

  return (
    <div className="min-h-screen bg-cream pb-24">
      <BackHeader href="/journey" />

      <div className="px-5 mb-4">
        <span className="text-xs text-muted uppercase tracking-wider font-medium">After Birth · Ongoing</span>
        <h1 className="font-serif text-2xl text-charcoal mt-1">Recovery Protocol</h1>
        <p className="text-sm text-muted mt-1 leading-relaxed">
          Your post-birth recovery plan — evidence-based and adapted to your timeline.
        </p>
      </div>

      {/* Overall progress */}
      <div className="px-5 mb-5">
        <div className="bg-white border border-border rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Overall Recovery</p>
            <span className="text-sm font-medium text-gold">{overallProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Today's priorities */}
      <div className="px-5 mb-5">
        <h2 className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Today's Priorities</h2>
        <div className="flex flex-col gap-3">
          {practices.map((p) => (
            <div key={p.title} className={`border rounded-2xl px-4 py-4 ${p.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{p.icon}</span>
                <p className="text-sm font-medium text-charcoal">{p.title}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                {p.steps.map((s) => (
                  <div key={s} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                    <p className="text-xs text-charcoal/80 leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery modules */}
      <div className="px-5">
        <h2 className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Recovery Modules</h2>
        <div className="flex flex-col gap-3">
          {recoveryModules.map((mod) => (
            <div key={mod.title} className="bg-white border border-border rounded-2xl px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">{mod.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-charcoal">{mod.title}</p>
                    <span className="text-xs text-gold font-medium">{mod.progress}%</span>
                  </div>
                  <p className="text-xs text-muted mb-2">{mod.sub}</p>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${mod.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted mt-1">{mod.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
