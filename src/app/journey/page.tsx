'use client'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useProfile'
import { useProtocol } from '@/hooks/useProtocol'
import { useAppStore } from '@/store/app'
import BottomNav from '@/components/shared/BottomNav'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { ChevronRight, ArrowRight } from 'lucide-react'

const GOLD = '#D4B06A'; const SUCCESS = '#1F7A5A'

function RoadmapIcon({ color, size=28 }: { color:string; size?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="22" r="2.2" /><circle cx="14" cy="13" r="2.2" /><circle cx="23" cy="5" r="2.2" />
      <path d="M6.5 20.5 C9 17 11.5 15 11.8 14.5" /><path d="M16.2 11.5 C18.5 9 21 6.5 21.2 6.8" />
    </svg>
  )
}
function GrowthIcon({ color, size=28 }: { color:string; size?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22 C7 18 10 16 13 17 C16 18 19 13 24 7" />
      <circle cx="9" cy="19" r="1.6" /><circle cx="14" cy="17" r="1.6" /><circle cx="19" cy="13" r="1.6" />
    </svg>
  )
}
function AfterBirthIcon({ color, size=28 }: { color:string; size?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19 Q14 8 24 19" /><line x1="4" y1="22" x2="24" y2="22" />
      <line x1="9" y1="19" x2="9" y2="22" /><line x1="19" y1="19" x2="19" y2="22" />
      <circle cx="14" cy="5" r="2.2" /><line x1="14" y1="7.4" x2="14" y2="10" />
    </svg>
  )
}

export default function JourneyPage() {
  useProfile()
  const { loading } = useProtocol()
  const { profile, protocol } = useAppStore()
  const router = useRouter()

  if (!profile || loading) return <LoadingScreen message="Loading your journey..." />

  const jt = profile.journey_type ?? 'trying_to_conceive'
  const isTrying   = jt === 'trying_to_conceive'
  const isPregnant = jt === 'currently_pregnant'
  const isPostpartum = jt === 'postpartum'

  const WEEK = 15; const TOTAL = 40
  const weekInfo = isPregnant ? `Week ${WEEK} of ${TOTAL}` : isPostpartum ? 'Postpartum · Week 8' : 'Your journey starts here'
  const babyPreview = isPregnant ? 'About the size of a pear this week' : isPostpartum ? `Your baby · 2 weeks old` : 'Development tracking begins at conception'
  const progress = isPregnant ? WEEK / TOTAL : isPostpartum ? 1 : 0.08

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 16px' }}>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em',
          textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>Journey</p>
        <h1 style={{ fontSize: 26, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Your Motherhood<br />Roadmap
        </h1>
        {protocol?.fertility_tip && (
          <p style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 14,
            color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 10 }}>
            {protocol.fertility_tip}
          </p>
        )}
      </div>

      {/* Baby / week strip */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ background: 'var(--card)', borderRadius: 18, padding: '16px 18px',
          border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em',
              textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
              {isPregnant ? 'Pregnancy Progress' : isPostpartum ? 'Postpartum Recovery' : 'Fertility Journey'}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{weekInfo}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{babyPreview}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ width: 48, height: 48, position: 'relative' }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke={GOLD} strokeWidth="4"
                  strokeDasharray={`${progress * 125.6} 125.6`} strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: GOLD }}>{Math.round(progress * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Way to Baby / Main journey card */}
        <div style={{ background: 'var(--card)', borderRadius: 22, overflow: 'hidden',
          border: `1px solid rgba(201,162,77,0.3)`,
          boxShadow: '0 4px 28px rgba(201,162,77,0.10)' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16,
                background: 'rgba(212,176,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RoadmapIcon color={GOLD} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: GOLD,
                background: 'rgba(212,176,106,0.12)', padding: '4px 10px', borderRadius: 20,
                letterSpacing: '0.04em' }}>
                {isTrying ? 'Active' : isPregnant ? `Week ${WEEK}` : 'Recovery'}
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 6 }}>
              {isTrying ? 'Way to Baby' : isPregnant ? 'Pregnancy Journey' : 'Recovery Journey'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              {isTrying ? 'Step-by-step fertility roadmap with milestones, cycle tracking, and weekly goals.'
               : isPregnant ? 'Week-by-week pregnancy guide with milestones, protocols, and development tracking.'
               : 'Evidence-based postpartum recovery with phase-by-phase guidance and restoration protocols.'}
            </p>
            {/* Progress bar */}
            <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: 20 }}>
              <div style={{ height: '100%', width: `${progress * 100}%`, background: `linear-gradient(to right,${SUCCESS},${GOLD})`, borderRadius: 2 }} />
            </div>
          </div>
          <button onClick={() => router.push('/journey/protocol')}
            style={{ width: '100%', padding: '14px 20px', background: GOLD, border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
              {isTrying ? 'View Roadmap' : isPregnant ? 'View Protocol' : 'View Recovery Plan'}
            </span>
            <ArrowRight size={16} color="#fff" />
          </button>
        </div>

        {/* Baby development card */}
        <div style={{ background: 'var(--card)', borderRadius: 22, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16,
                background: 'rgba(168,185,165,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GrowthIcon color={SUCCESS} />
              </div>
              {(isPostpartum || isTrying) && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)',
                  background: 'var(--section-bg)', padding: '4px 10px', borderRadius: 20 }}>
                  {isPostpartum ? 'Active' : 'Coming soon'}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              {isPostpartum ? 'Baby Development' : isPregnant ? 'Baby This Week' : 'Baby Development'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              {protocol?.baby_focus || babyPreview}
            </p>
            <button onClick={() => router.push(isPregnant ? '/journey/pregnancy' : '/journey/protocol')}
              style={{ display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>
                {isPostpartum ? 'Track milestones' : isPregnant ? 'View this week' : 'Learn more'}
              </span>
              <ArrowRight size={14} color={GOLD} />
            </button>
          </div>
        </div>

        {/* After birth card */}
        <div style={{ background: 'var(--card)', borderRadius: 22, overflow: 'hidden',
          border: isPostpartum ? '1px solid rgba(201,162,77,0.3)' : '1px solid var(--border)',
          opacity: !isPostpartum ? 0.7 : 1 }}>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16,
                background: 'rgba(212,176,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AfterBirthIcon color={isPostpartum ? GOLD : 'var(--text-muted)'} />
              </div>
              {!isPostpartum && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)',
                  background: 'var(--section-bg)', padding: '4px 10px', borderRadius: 20 }}>After birth</span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: isPostpartum ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 6 }}>
              After Birth
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: isPostpartum ? 16 : 0 }}>
              Postpartum recovery, newborn care, breastfeeding guidance and hormonal restoration.
            </p>
            {isPostpartum && (
              <button onClick={() => router.push('/journey/recovery')}
                style={{ display: 'flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 14 }}>
                <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>Explore Postpartum</span>
                <ArrowRight size={14} color={GOLD} />
              </button>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
