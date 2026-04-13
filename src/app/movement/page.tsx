'use client'
import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useProtocol } from '@/hooks/useProtocol'
import { useAppStore } from '@/store/app'
import BottomNav from '@/components/shared/BottomNav'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { Sparkles, Activity, Wind, Heart, Leaf, Clock, ChevronRight } from 'lucide-react'

const GOLD='#D4B06A'; const SUCCESS='#1F7A5A'; const LAVENDER='#8B85C1'

interface Exercise { name:string; sets?:string; duration?:string }
interface Practice {
  id:string; title:string; subtitle:string; duration:string
  category:string; categoryColor:string; iconBg:string; iconColor:string; iconType:string
  exercises:Exercise[]; whyItMatters:string; guidance?:string; keywords:string[]
}

const LIBRARY: Record<string, Practice[]> = {
  currently_pregnant: [
    { id:'yoga', title:'Prenatal Yoga', subtitle:'Breath, flexibility & pelvic preparation', duration:'~30 min', category:'Gentle', categoryColor:SUCCESS, iconBg:'rgba(31,122,90,0.1)', iconColor:SUCCESS, iconType:'activity', keywords:['yoga','stretch','breathe','gentle','pelvic','hip'],
      exercises:[{name:'Cat-Cow breath',duration:'3 min'},{name:'Warrior I (modified)',duration:'5 min'},{name:'Side-lying hip stretch',duration:'4 min each side'},{name:'Seated pelvic floor engagement',duration:'5 min'},{name:'Supported Savasana',duration:'8 min'}],
      whyItMatters:'Reduces lower back pain and improves circulation — preparing your pelvic floor gently for birth while regulating cortisol for both you and your baby.' },
    { id:'strength', title:'Functional Strength', subtitle:'Stability without compression', duration:'~25 min', category:'Moderate', categoryColor:GOLD, iconBg:'rgba(212,176,106,0.1)', iconColor:GOLD, iconType:'leaf', keywords:['strength','resistance','bridge','squat'],
      exercises:[{name:'Glute bridge',sets:'3 × 12'},{name:'Standing calf raises',sets:'3 × 15'},{name:'Resistance band rows',sets:'3 × 10'},{name:'Side-lying clams',sets:'3 × 12 each side'}],
      whyItMatters:'Maintaining muscle strength supports posture, reduces gestational discomfort, and creates a healthier environment for your baby.',
      guidance:'Avoid lying flat on your back for extended periods. Move at your own pace.' },
    { id:'breathwork', title:'Breathwork & Nervous System', subtitle:'Vagal activation and deep rest', duration:'~15 min', category:'Restorative', categoryColor:LAVENDER, iconBg:'rgba(139,133,193,0.1)', iconColor:LAVENDER, iconType:'wind', keywords:['breath','relax','calm','rest','meditat'],
      exercises:[{name:'4-7-8 breathing',duration:'5 min'},{name:'Box breathing (4×4)',duration:'5 min'},{name:'Humming breath',duration:'3 min'},{name:'Progressive muscle relaxation',duration:'5 min'}],
      whyItMatters:'Every slow exhale activates your parasympathetic system — lowering cortisol and improving placental blood flow.' },
    { id:'mobility', title:'Mobility & Flow', subtitle:'Joint health and postural ease', duration:'~20 min', category:'Gentle', categoryColor:SUCCESS, iconBg:'rgba(31,122,90,0.08)', iconColor:SUCCESS, iconType:'heart', keywords:['walk','mobil','flow','cardio'],
      exercises:[{name:'Thoracic spine rotation',duration:'3 min each side'},{name:'Hip circles (standing)',duration:'3 min'},{name:'Shoulder rolls & chest opener',duration:'4 min'},{name:'Ankle circles & calf stretch',duration:'4 min'}],
      whyItMatters:'Gentle mobility work relieves joint tension and supports posture during pregnancy.' },
  ],
  postpartum: [
    { id:'pelvic', title:'Pelvic Floor Restoration', subtitle:'Core healing from the inside out', duration:'~15 min', category:'Restorative', categoryColor:SUCCESS, iconBg:'rgba(31,122,90,0.08)', iconColor:SUCCESS, iconType:'heart', keywords:['pelvic','kegel','core','breathe','floor'],
      exercises:[{name:'Diaphragmatic breathing',duration:'5 min'},{name:'Kegel holds (3s hold, 3s release)',sets:'3 × 10'},{name:'Reverse kegels',sets:'2 × 8'},{name:'360° core breathing',duration:'5 min'}],
      whyItMatters:'Your pelvic floor held your baby for months. This gentle work restores its integrity and supports organ position.',
      guidance:'Begin at 2 weeks postpartum. Rest if you feel pain or heaviness.' },
    { id:'walk', title:'Postnatal Walk', subtitle:'Gentle return to movement', duration:'15–20 min', category:'Low', categoryColor:SUCCESS, iconBg:'rgba(31,122,90,0.1)', iconColor:SUCCESS, iconType:'activity', keywords:['walk','gentle','light','outdoor'],
      exercises:[{name:'Flat surface walk',duration:'15–20 min'},{name:'Shoulders back, core softly engaged',duration:'Throughout'}],
      whyItMatters:'Walking improves circulation, reduces blood clot risk, and supports mood stability.',
      guidance:'Choose flat ground for the first 6 weeks.' },
    { id:'abdominal', title:'Abdominal Reconnection', subtitle:'Diastasis recti healing', duration:'~20 min', category:'Gentle', categoryColor:GOLD, iconBg:'rgba(212,176,106,0.1)', iconColor:GOLD, iconType:'leaf', keywords:['abdomin','core','heal','reconnect','strengthen'],
      exercises:[{name:'Heel slides',sets:'3 × 8 each leg'},{name:'Dead bug (breathing variation)',sets:'2 × 6'},{name:'Bird dog (slow, controlled)',sets:'2 × 6 each side'}],
      whyItMatters:'This protocol reconnects the deep abdominal muscles and addresses diastasis recti.',
      guidance:'If you had a C-section, consult a pelvic floor physiotherapist first.' },
    { id:'breathwork-pp', title:'Breathwork & Recovery', subtitle:'Cortisol regulation and deep rest', duration:'~10 min', category:'Restorative', categoryColor:LAVENDER, iconBg:'rgba(139,133,193,0.1)', iconColor:LAVENDER, iconType:'wind', keywords:['breath','rest','calm','sleep','relax'],
      exercises:[{name:'4-7-8 breath for sleep',duration:'3 min'},{name:'Box breathing',duration:'4 min'},{name:'Humming exhale',duration:'3 min'}],
      whyItMatters:'10 minutes of breathwork lowers postpartum anxiety and activates vagal tone.' },
  ],
  trying_to_conceive: [
    { id:'fertility-yoga', title:'Fertility Yoga', subtitle:'Pelvic circulation and inner calm', duration:'~30 min', category:'Gentle', categoryColor:SUCCESS, iconBg:'rgba(31,122,90,0.1)', iconColor:SUCCESS, iconType:'activity', keywords:['yoga','pelvic','gentle','stretch','hip','fertil'],
      exercises:[{name:'Butterfly pose',duration:'5 min'},{name:'Supported legs up the wall',duration:'8 min'},{name:'Reclined twist',duration:'4 min each side'},{name:"Child's pose",duration:'5 min'}],
      whyItMatters:'These poses increase blood flow to the pelvis, reduce cortisol, and support the uterine environment.' },
    { id:'strength-ttc', title:'Gentle Strength', subtitle:'Hormonal support through movement', duration:'~25 min', category:'Moderate', categoryColor:GOLD, iconBg:'rgba(212,176,106,0.1)', iconColor:GOLD, iconType:'leaf', keywords:['strength','squat','bridge','moderate','resistance'],
      exercises:[{name:'Bodyweight squats',sets:'3 × 15'},{name:'Hip bridges',sets:'3 × 12'},{name:'Dumbbell rows',sets:'3 × 10 each'},{name:'Plank hold',duration:'30s × 3'}],
      whyItMatters:'Moderate strength training optimises insulin sensitivity and testosterone balance.' },
    { id:'breathwork-ttc', title:'Breathwork & Cycle Support', subtitle:'Stress regulation for hormonal balance', duration:'~15 min', category:'Restorative', categoryColor:LAVENDER, iconBg:'rgba(139,133,193,0.1)', iconColor:LAVENDER, iconType:'wind', keywords:['breath','meditat','relax','calm','stress'],
      exercises:[{name:'4-7-8 breath pattern',duration:'5 min'},{name:'Coherent breathing (5-5)',duration:'5 min'},{name:'Body scan meditation',duration:'5 min'}],
      whyItMatters:'15 minutes of breathwork measurably reduces cortisol and supports cycle regularity.' },
    { id:'walk-ttc', title:'Daily Walk', subtitle:'Circulation and lymph support', duration:'30 min', category:'Low', categoryColor:SUCCESS, iconBg:'rgba(31,122,90,0.08)', iconColor:SUCCESS, iconType:'heart', keywords:['walk','outdoor','cardio','light','daily'],
      exercises:[{name:'Brisk outdoor walk',duration:'30 min'},{name:'Mindful breathing throughout',duration:'Continuous'}],
      whyItMatters:'Daily walking improves insulin sensitivity and supports lymphatic drainage.' },
  ],
}

function PracticeIcon({ type, color }: { type:string; color:string }) {
  if (type==='wind')  return <Wind size={20} color={color} />
  if (type==='leaf')  return <Leaf size={20} color={color} />
  if (type==='heart') return <Heart size={20} color={color} />
  return <Activity size={20} color={color} />
}

function matchPractice(movementText: string, library: Practice[]) {
  if (!movementText) return null
  const lower = movementText.toLowerCase()
  return library.find(p => p.keywords.some(kw => lower.includes(kw))) ?? null
}

export default function MovementPage() {
  useProfile()
  const { loading } = useProtocol()
  const { profile, protocol } = useAppStore()
  const [expanded, setExpanded] = useState<string|null>(null)

  if (!profile || loading) return <LoadingScreen message="Loading movement plan..." />

  const jt       = profile.journey_type ?? 'trying_to_conceive'
  const library  = LIBRARY[jt] ?? LIBRARY.trying_to_conceive
  const aiMove   = protocol?.movement ?? ''
  const matched  = matchPractice(aiMove, library)
  const sorted   = matched ? [matched, ...library.filter(p => p.id !== matched.id)] : library

  return (
    <div className="min-h-full bg-bg pb-24">
      <div className="px-6 pt-6">
        <h1 className="text-4xl font-medium text-primary tracking-tight mb-2">Movement</h1>
        <p className="font-serif italic text-md text-secondary leading-relaxed">
          {jt==='currently_pregnant' ? 'Movement that supports you and your baby'
           : jt==='postpartum' ? 'Gentle restoration and healing movement'
           : 'Movement that supports fertility and hormonal balance'}
        </p>
      </div>

      {/* AI movement — always primary */}
      {aiMove && (
        <div className="px-6 mt-5">
          <div className="rounded-3xl p-4.5 flex items-start gap-3.5"
            style={{ background:'linear-gradient(135deg,rgba(212,176,106,0.12),rgba(180,155,120,0.06))', border:'1px solid rgba(212,176,106,0.28)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background:'rgba(212,176,106,0.18)' }}>
              <Sparkles size={17} color={GOLD} />
            </div>
            <div className="flex-1">
              <p className="text-2xs text-gold uppercase tracking-widest font-semibold mb-1">Today's AI recommendation</p>
              <p className="text-md font-medium text-primary font-serif italic leading-snug">{aiMove}</p>
            </div>
          </div>
        </div>
      )}

      {/* Avoid today */}
      {protocol?.avoid_today && (
        <div className="px-6 mt-3">
          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl"
            style={{ background:'rgba(194,107,46,0.07)', borderLeft:'2px solid rgba(194,107,46,0.3)' }}>
            <span className="text-warning text-xs">⚠</span>
            <p className="text-sm leading-snug" style={{ color:'#C26B2E' }}>
              <strong>Avoid today: </strong>{protocol.avoid_today}
            </p>
          </div>
        </div>
      )}

      {/* Practice library */}
      <div className="px-6 mt-5">
        <p className="text-2xs text-muted uppercase tracking-widest font-semibold mb-3">Practice Library</p>
        <div className="flex flex-col gap-3">
          {sorted.map(p => {
            const isRec = matched?.id === p.id
            return (
              <div key={p.id} className="bg-card rounded-3xl overflow-hidden"
                style={{ border: isRec ? '1px solid rgba(212,176,106,0.45)' : '1px solid rgba(180,155,120,0.18)' }}>
                <button onClick={() => setExpanded(e => e===p.id ? null : p.id)}
                  className="w-full px-5 py-4.5 bg-transparent border-none cursor-pointer text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background:p.iconBg }}>
                      <PracticeIcon type={p.iconType} color={p.iconColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-semibold text-primary">{p.title}</h3>
                        {isRec && (
                          <span className="text-2xs font-semibold text-gold px-2 py-0.5 rounded-pill"
                            style={{ background:'rgba(212,176,106,0.15)' }}>Today</span>
                        )}
                      </div>
                      <p className="text-2xs text-muted mb-1.5">{p.subtitle}</p>
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-muted" />
                        <span className="text-2xs text-muted">{p.duration}</span>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-pill"
                          style={{ color:p.categoryColor, background:p.iconBg }}>{p.category}</span>
                      </div>
                    </div>
                    <ChevronRight size={17} className="text-muted shrink-0 transition-transform duration-300"
                      style={{ transform: expanded===p.id ? 'rotate(90deg)' : 'none' }} />
                  </div>
                </button>

                {expanded===p.id && (
                  <div className="border-t border-border p-5">
                    <div className="px-3.5 py-3 rounded-2xl mb-4.5"
                      style={{ background:'rgba(212,176,106,0.07)', borderLeft:'2px solid rgba(212,176,106,0.35)' }}>
                      <p className="text-2xs text-gold uppercase tracking-widest font-semibold mb-1.5">Why this matters</p>
                      <p className="text-sm text-secondary leading-relaxed font-serif italic">{p.whyItMatters}</p>
                    </div>
                    <p className="text-2xs text-muted uppercase tracking-widest font-semibold mb-3">Sequence</p>
                    <div className="flex flex-col gap-2.5">
                      {p.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center justify-between px-3.5 py-3 bg-section rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{ background:'rgba(212,176,106,0.15)' }}>
                              <span className="text-2xs text-gold font-bold">{i+1}</span>
                            </div>
                            <span className="text-base text-primary font-medium">{ex.name}</span>
                          </div>
                          <span className="text-2xs text-muted font-medium">{ex.sets || ex.duration}</span>
                        </div>
                      ))}
                    </div>
                    {p.guidance && (
                      <div className="mt-3.5 flex items-start gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background:'rgba(194,107,46,0.07)', border:'1px solid rgba(194,107,46,0.15)' }}>
                        <span className="text-xs" style={{ color:'#C26B2E' }}>⚠</span>
                        <p className="text-sm leading-relaxed" style={{ color:'#C26B2E' }}>{p.guidance}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
