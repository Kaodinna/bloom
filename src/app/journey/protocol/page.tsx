'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useProfile'
import { useProtocol } from '@/hooks/useProtocol'
import { useAppStore } from '@/store/app'
import BottomNav from '@/components/shared/BottomNav'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check, Sparkles, ArrowRight, Leaf } from 'lucide-react'

const GOLD='#D4B06A'; const SUCCESS='#1F7A5A'

interface MilestoneDetail { whatHappening:string; focusGoals:string[]; actions:string[] }
interface Milestone {
  id:string; weekLabel:string; title:string; summary:string; bullets:string[]
  status:'completed'|'current'|'upcoming'; details:MilestoneDetail
}
interface Phase {
  id:string; number:number; title:string; weekRange:string
  status:'completed'|'current'|'upcoming'; milestones:Milestone[]
}

function getPhases(jt: string): Phase[] {
  if (jt === 'trying_to_conceive') return [
    { id:'body-prep', number:1, title:'Body Preparation', weekRange:'Month 1–2', status:'current',
      milestones:[
        { id:'bp1', weekLabel:'Foundations', title:'Supplements & Nutrition', summary:'Begin prenatal protocol and dietary optimisation',
          bullets:['Start prenatal vitamins + CoQ10','Reduce alcohol, caffeine, ultra-processed foods','Begin folate-rich diet'], status:'current',
          details:{ whatHappening:'The 90 days before conception are the most impactful window for egg quality. CoQ10, folate, and micronutrient density directly influence embryo health.', focusGoals:['400mcg folic acid daily','CoQ10 600mg with food','Iron-rich meals 3x/week','Hydration 2–2.5L daily'], actions:['Book fertility baseline bloods','Confirm supplement protocol with GP','Remove toxins from household products'] } },
        { id:'bp2', weekLabel:'Assessment', title:'Cycle Tracking', summary:'Understand your baseline cycle and fertile window',
          bullets:['Begin basal body temperature tracking','Map luteal phase length','Identify ovulation signs'], status:'upcoming',
          details:{ whatHappening:'Knowing your cycle is the single most powerful fertility tool. BBT tracking + cervical mucus observation gives a 5-day fertile window each cycle.', focusGoals:['Temperature at same time daily','Note cervical mucus changes','Identify LH surge pattern'], actions:['Set daily BBT reminder','Purchase LH test strips','Log first full cycle data'] } },
        { id:'bp3', weekLabel:'Lifestyle', title:'Stress & Sleep Optimisation', summary:'HPA axis regulation for hormonal balance',
          bullets:['8-hour sleep target','Morning cortisol management','Reduce high-intensity training'], status:'upcoming',
          details:{ whatHappening:'Chronic cortisol disrupts the HPG axis, suppressing LH and oestrogen. Sleep and stress management can restore cycle regularity within 2–3 cycles.', focusGoals:['Consistent sleep-wake time','Magnesium glycinate 200mg nightly','Morning sunlight exposure'], actions:['Set sleep schedule','Add adaptogen support (ashwagandha)'] } },
      ] },
    { id:'cycle-opt', number:2, title:'Cycle Optimisation', weekRange:'Month 2–3', status:'upcoming',
      milestones:[
        { id:'co1', weekLabel:'Timing', title:'Fertile Window Identification', summary:'Pinpoint the 5-day optimal conception window',
          bullets:['LH surge confirmed','Peak day identified','Timed intercourse strategy'], status:'upcoming',
          details:{ whatHappening:'The fertile window spans 5 days ending on ovulation day. Sperm survive 3–5 days; the egg lives 12–24 hours.', focusGoals:['LH strip testing from Day 10','Confirm ovulation with BBT rise','Intercourse every 2 days in window'], actions:['Use fertile window predictor','Optimise male partner nutrition'] } },
        { id:'co2', weekLabel:'Implantation', title:'Luteal Phase Support', summary:'Progesterone optimisation for implantation success',
          bullets:['Progesterone-supportive nutrition','Reduce exercise intensity','Stress reduction priority'], status:'upcoming',
          details:{ whatHappening:'The luteal phase (Days 15–28) is when implantation occurs. Low progesterone is the leading cause of early pregnancy loss.', focusGoals:['Vitamin C 500mg daily','Vitamin B6 50mg daily','Gentle movement only'], actions:['Consider progesterone testing at Day 21','Begin two-week-wait journaling'] } },
      ] },
    { id:'conception', number:3, title:'Conception', weekRange:'When ready', status:'upcoming',
      milestones:[
        { id:'c1', weekLabel:'Confirmation', title:'Positive Test', summary:'hCG detected — pregnancy confirmed',
          bullets:['Take test 14 days post-ovulation','Book early scan (6–8 weeks)','Begin pregnancy protocol'], status:'upcoming',
          details:{ whatHappening:'A positive test means hCG is detectable. Levels double every 48 hours in early pregnancy.', focusGoals:['Switch to pregnancy-specific supplements','Book viability scan','Notify GP or midwife'], actions:['Register with midwife service','Book early pregnancy scan'] } },
      ] },
  ]

  if (jt === 'postpartum') return [
    { id:'fourth-trim', number:1, title:'Fourth Trimester', weekRange:'Weeks 1–12', status:'current',
      milestones:[
        { id:'ft1', weekLabel:'Weeks 1–2', title:'Rest & Repair', summary:'Hormones drop, healing begins — rest is non-negotiable',
          bullets:['Sleep in every possible window','Accept all help offered','Iron-rich foods priority'], status:'current',
          details:{ whatHappening:'Oestrogen and progesterone drop precipitously after birth. The uterus is contracting back. Blood loss increases iron demand.', focusGoals:['Iron-rich foods at every meal','Accept help without guilt','Limit visitors in first week'], actions:['Begin iron supplementation','Arrange first postnatal check'] } },
        { id:'ft2', weekLabel:'Weeks 3–6', title:'Hormone Stabilisation', summary:'Milk establishes, cortisol normalises',
          bullets:['Milk supply regulation','Pelvic floor breathing begins','Mood monitoring'], status:'upcoming',
          details:{ whatHappening:'Cortisol starts to normalize. This is the window where pelvic floor recovery begins safely.', focusGoals:['Daily diaphragmatic breathing','Track mood patterns','Introduce gentle walking'], actions:['Book postnatal physio assessment','Begin pelvic floor breathing protocol'] } },
      ] },
    { id:'rebuilding', number:2, title:'Rebuilding', weekRange:'Weeks 12–26', status:'upcoming',
      milestones:[
        { id:'rb1', weekLabel:'Weeks 12–16', title:'Core Reconnection', summary:'Diastasis assessment and deep core reactivation',
          bullets:['Return-to-movement assessment','Core reconnection protocol','Sleep consolidation'], status:'upcoming',
          details:{ whatHappening:'By week 12, most women are cleared for progressive movement. The deep core reconnection phase begins.', focusGoals:['Diastasis assessment','Heel slides and dead bugs','Progressive load increase'], actions:['Book clearance check with GP','Start abdominal reconnection protocol'] } },
      ] },
  ]

  // currently_pregnant
  return [
    { id:'first-trim', number:1, title:'First Trimester', weekRange:'Weeks 1–12', status:'completed',
      milestones:[
        { id:'ft1', weekLabel:'Weeks 1–8', title:'Early Development', summary:'Organ formation and neural tube closure',
          bullets:['Begin prenatal supplements','Manage nausea with nutrition','Avoid harmful substances'], status:'completed',
          details:{ whatHappening:'The neural tube closes in week 4. Folate is critical during this window.', focusGoals:['400mcg folate daily','Avoid alcohol and smoking','Ginger for nausea'], actions:['Book first prenatal appointment','Start prenatal vitamin protocol'] } },
        { id:'ft2', weekLabel:'Weeks 9–12', title:'First Trimester Scan', summary:'Nuchal translucency screening at 12 weeks',
          bullets:['12-week scan appointment','Begin second trimester planning','Announce when ready'], status:'completed',
          details:{ whatHappening:'The first trimester scan checks for chromosomal markers and confirms healthy development.', focusGoals:['Schedule NT scan','Discuss screening options with midwife'], actions:['Book 12-week scan','Review pregnancy nutrition guidelines'] } },
      ] },
    { id:'second-trim', number:2, title:'Second Trimester', weekRange:'Weeks 13–26', status:'current',
      milestones:[
        { id:'st1', weekLabel:'Week 15', title:'Brain & Neural Development', summary:'Synaptic connections forming rapidly — DHA critical',
          bullets:['Optimise DHA intake','Choline-rich nutrition','Gentle exercise 30 min daily'], status:'current',
          details:{ whatHappening:'Week 15: the brain is growing rapidly. Synaptic connections are forming at an extraordinary rate. Your DHA intake directly fuels this development.', focusGoals:['DHA 300mg daily','Eggs and salmon at every opportunity','30 min prenatal yoga or walking'], actions:['Check DHA supplement dose','Book anatomy scan (20 weeks)'] } },
        { id:'st2', weekLabel:'Weeks 20–24', title:'Anatomy Scan & Growth', summary:'Mid-pregnancy structural review',
          bullets:['20-week anatomy scan','Monitor growth parameters','Iron levels check'], status:'upcoming',
          details:{ whatHappening:'The anatomy scan checks all major structures. Iron levels typically need monitoring from week 20 onwards.', focusGoals:['Book anatomy scan','Iron supplementation review','Monitor for gestational diabetes symptoms'], actions:['Schedule anatomy scan appointment','Glucose tolerance test at week 24–28'] } },
      ] },
    { id:'third-trim', number:3, title:'Third Trimester', weekRange:'Weeks 27–40', status:'upcoming',
      milestones:[
        { id:'tt1', weekLabel:'Weeks 27–32', title:'Rapid Growth Phase', summary:'Baby doubles in size — caloric needs increase',
          bullets:['Increase protein intake','Monitor blood pressure','Begin birth preparation'], status:'upcoming',
          details:{ whatHappening:'Baby grows rapidly in the third trimester — gaining approximately 500g per week from week 32.', focusGoals:['Increase caloric intake by 300kcal','Protein at every meal','Pelvic floor preparation'], actions:['Book birth plan appointment','Attend birth preparation classes'] } },
      ] },
  ]
}

export default function JourneyProtocolPage() {
  useProfile()
  const { loading } = useProtocol()
  const { profile, protocol } = useAppStore()
  const router = useRouter()
  const [expandedPhase, setExpandedPhase] = useState<string|null>(null)
  const [expandedMilestone, setExpandedMilestone] = useState<string|null>(null)

  if (!profile || loading) return <LoadingScreen message="Loading your roadmap..." />

  const jt     = profile.journey_type ?? 'trying_to_conceive'
  const phases = getPhases(jt)
  const currentPhase = phases.find(p => p.status === 'current') || phases[0]

  return (
    <div className="min-h-full bg-bg pb-24">
      {/* Header */}
      <div style={{ padding:'20px 24px 0' }}>
        <button onClick={() => router.push('/journey')}
          style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none',
            cursor:'pointer', marginBottom:16, padding:0, color:'var(--text-muted)', fontFamily:'inherit' }}>
          <ChevronLeft size={18} /> Back
        </button>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.1em',
          textTransform:'uppercase' as const, fontWeight:600 }}>
          {jt === 'trying_to_conceive' ? 'Way to Baby' : jt === 'postpartum' ? 'Recovery Journey' : 'Pregnancy Journey'}
        </span>
        <h1 style={{ fontSize:26, fontWeight:500, color:'var(--text-primary)',
          letterSpacing:'-0.02em', lineHeight:1.2, marginTop:6, marginBottom:6 }}>
          {jt === 'trying_to_conceive' ? 'Preparation Protocol' : jt === 'postpartum' ? 'Recovery Protocol' : 'Pregnancy Roadmap'}
        </h1>
        <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>
          {jt === 'trying_to_conceive' ? 'Lifestyle optimization and biological readiness — the foundation everything is built on.'
           : jt === 'postpartum' ? 'Phase-by-phase restoration and recovery.'
           : 'Week-by-week pregnancy guide with milestones and protocols.'}
        </p>
      </div>

      {/* AI insight strip */}
      {protocol?.fertility_tip && (
        <div style={{ padding:'16px 24px 0' }}>
          <div style={{ padding:'14px 16px', background:'rgba(212,176,106,0.08)',
            borderRadius:16, borderLeft:'2px solid rgba(212,176,106,0.4)',
            display:'flex', alignItems:'flex-start', gap:10 }}>
            <Sparkles size={14} color={GOLD} style={{ flexShrink:0, marginTop:2 }} />
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65,
              fontFamily:'Georgia,serif', fontStyle:'italic' }}>{protocol.fertility_tip}</p>
          </div>
        </div>
      )}

      {/* Phase list */}
      <div style={{ padding:'20px 24px 0', display:'flex', flexDirection:'column', gap:12 }}>
        {phases.map(phase => {
          const isExpanded = expandedPhase === phase.id
          const phaseColor = phase.status==='completed' ? SUCCESS : phase.status==='current' ? GOLD : 'var(--text-muted)'
          return (
            <div key={phase.id} style={{ background:'var(--card)', borderRadius:22, overflow:'hidden',
              border: phase.status==='current' ? '1px solid rgba(212,176,106,0.4)' : '1px solid var(--border)' }}>
              {/* Phase header */}
              <button onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                style={{ width:'100%', padding:'20px', background:'none', border:'none', cursor:'pointer', textAlign:'left' as const }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0,
                    background: phase.status==='completed' ? `${SUCCESS}15` : phase.status==='current' ? 'rgba(212,176,106,0.15)' : 'var(--section-bg)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border:`2px solid ${phase.status==='completed' ? SUCCESS : phase.status==='current' ? GOLD : 'var(--border)'}` }}>
                    {phase.status==='completed'
                      ? <Check size={16} color={SUCCESS} />
                      : <span style={{ fontSize:13, fontWeight:700, color:phaseColor }}>{phase.number}</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                      <span style={{ fontSize:16, fontWeight:600, color:'var(--text-primary)' }}>{phase.title}</span>
                      {phase.status==='current' && (
                        <span style={{ fontSize:10, background:'rgba(212,176,106,0.15)', color:GOLD,
                          padding:'2px 8px', borderRadius:20, fontWeight:600 }}>Active</span>
                      )}
                    </div>
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>{phase.weekRange} · {phase.milestones.length} milestones</span>
                  </div>
                  {isExpanded ? <ChevronDown size={17} color="var(--text-muted)" /> : <ChevronRight size={17} color="var(--text-muted)" />}
                </div>
              </button>

              {/* Milestones */}
              {isExpanded && (
                <div style={{ borderTop:'1px solid var(--border)', padding:'12px 16px 16px' }}>
                  {phase.milestones.map((ms, i) => {
                    const msExpanded = expandedMilestone === ms.id
                    return (
                      <div key={ms.id} style={{ marginBottom: i < phase.milestones.length-1 ? 10 : 0,
                        background:'var(--elevated)', borderRadius:18, overflow:'hidden',
                        border: ms.status==='current' ? '1px solid rgba(212,176,106,0.3)' : '1px solid var(--border)' }}>
                        <button onClick={() => setExpandedMilestone(msExpanded ? null : ms.id)}
                          style={{ width:'100%', padding:'16px 18px', background:'none', border:'none',
                            cursor:'pointer', textAlign:'left' as const }}>
                          <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                            <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0, marginTop:2,
                              background: ms.status==='completed' ? SUCCESS : ms.status==='current' ? GOLD : 'var(--section-bg)',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              border:`1.5px solid ${ms.status==='completed' ? SUCCESS : ms.status==='current' ? GOLD : 'var(--border)'}` }}>
                              {ms.status==='completed' ? <Check size={11} color="#fff" strokeWidth={2.5} />
                                : <div style={{ width:6, height:6, borderRadius:'50%',
                                    background: ms.status==='current' ? '#fff' : 'var(--text-muted)' }} />}
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                                <span style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{ms.title}</span>
                                <span style={{ fontSize:10, color:'var(--text-muted)',
                                  background:'var(--section-bg)', padding:'1px 7px', borderRadius:20 }}>{ms.weekLabel}</span>
                              </div>
                              <p style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>{ms.summary}</p>
                            </div>
                            <ChevronRight size={14} color="var(--text-muted)"
                              style={{ transition:'transform 0.2s', transform: msExpanded ? 'rotate(90deg)' : 'none', flexShrink:0, marginTop:4 }} />
                          </div>
                        </button>
                        {msExpanded && (
                          <div style={{ padding:'0 18px 18px' }}>
                            <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, marginBottom:14 }}>
                              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7,
                                fontFamily:'Georgia,serif', fontStyle:'italic', marginBottom:14 }}>
                                {ms.details.whatHappening}
                              </p>
                              <p style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em',
                                textTransform:'uppercase' as const, fontWeight:600, marginBottom:8 }}>Focus Goals</p>
                              {ms.details.focusGoals.map((g,j) => (
                                <div key={j} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                                  <Leaf size={11} color={GOLD} style={{ flexShrink:0 }} />
                                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{g}</span>
                                </div>
                              ))}
                            </div>
                            <p style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em',
                              textTransform:'uppercase' as const, fontWeight:600, marginBottom:8 }}>Actions</p>
                            {ms.details.actions.map((a,j) => (
                              <div key={j} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
                                background:'var(--section-bg)', borderRadius:10, marginBottom:6 }}>
                                <ArrowRight size={11} color={SUCCESS} style={{ flexShrink:0 }} />
                                <span style={{ fontSize:13, color:'var(--text-primary)' }}>{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}
