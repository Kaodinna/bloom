'use client'
import { useState, useEffect, useRef } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAppStore } from '@/store/app'
import BottomNav from '@/components/shared/BottomNav'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { getPosts, createPost, likePost, getMessages, sendMessage } from '@/lib/data'
import { Heart, MessageCircle, Bookmark, Send, Users, Feather, Search } from 'lucide-react'

type Tab = 'feed' | 'groups' | 'chat'
interface BPost { _id:string; content:string; likes?:number; author?:string; 'Created Date'?:number }
interface BMsg  { _id:string; content:string; sender?:string; 'Created Date'?:number }

const GRAD = ['linear-gradient(135deg,#E8D4A0,#C9A24D)','linear-gradient(135deg,#C0D4BE,#7A9A78)',
  'linear-gradient(135deg,#D8C8E0,#9878B0)','linear-gradient(135deg,#D4B8C0,#A87888)','linear-gradient(135deg,#B8D0C8,#688C84)']

function timeAgo(ts?: number) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.floor(m/60)}h ago`
  return new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric' })
}

export default function CommunityPage() {
  useProfile()
  const { profile } = useAppStore()
  const [tab, setTab] = useState<Tab>('feed')
  const [posts, setPosts] = useState<BPost[]>([])
  const [messages, setMessages] = useState<BMsg[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [newMsg, setNewMsg] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [posting, setPosting] = useState(false)
  const [search, setSearch] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (profile) loadPosts() }, [profile])
  useEffect(() => { if (tab === 'chat') loadMsgs() }, [tab])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function loadPosts() {
    try { setPosts(await getPosts(30)) }
    catch {} finally { setLoadingPosts(false) }
  }
  async function loadMsgs() {
    try { setMessages(await getMessages('community')) } catch {}
  }
  async function handlePost() {
    if (!newPost.trim() || posting) return
    setPosting(true)
    try { await createPost(newPost); setNewPost(''); await loadPosts() }
    catch {} finally { setPosting(false) }
  }
  async function handleLike(id: string) {
    setLikedIds(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n })
    try { await likePost(id) } catch {}
  }
  async function handleSend() {
    if (!newMsg.trim()) return
    try { await sendMessage('community', newMsg); setNewMsg(''); await loadMsgs() } catch {}
  }

  if (!profile) return <LoadingScreen message="Loading community…"/>

  const filtered = search ? posts.filter(p => p.content?.toLowerCase().includes(search.toLowerCase())) : posts

  return (
    <div className="min-h-full bg-cream flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-medium text-primary tracking-tight">Community</h1>
          <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center cursor-pointer">
            <Feather size={16} className="text-muted"/>
          </button>
        </div>
        {/* Tabs */}
        <div className="flex bg-card rounded-2xl border border-border p-1 mb-4">
          {(['feed','groups','chat'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl border-0 cursor-pointer text-sm font-medium
                          transition-all font-sans
                          ${tab===t ? 'bg-gold text-white' : 'bg-transparent text-muted hover:text-primary'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* FEED */}
      {tab==='feed' && (
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {/* Search */}
          <div className="relative mb-3.5">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
              className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-3.5 text-sm
                         text-primary outline-none font-sans placeholder:text-muted"/>
          </div>
          {/* Composer */}
          <div className="bg-card rounded-[18px] border border-border p-3.5 mb-4">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)} rows={2}
              placeholder="Share something with your community…"
              className="w-full bg-transparent border-0 outline-none text-sm text-primary resize-none
                         font-sans leading-relaxed placeholder:text-muted"/>
            <div className="flex justify-end mt-2">
              <button onClick={handlePost} disabled={!newPost.trim() || posting}
                className={`px-4 py-1.5 rounded-pill text-xs font-semibold transition-colors font-sans
                  ${newPost.trim() ? 'bg-gold text-white cursor-pointer' : 'bg-section text-muted cursor-not-allowed'}`}>
                {posting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
          {/* Posts */}
          {loadingPosts ? (
            <div className="text-center py-10"><p className="text-sm text-muted">Loading posts…</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted">{search ? 'No posts match your search.' : 'No posts yet. Be the first to share!'}</p>
            </div>
          ) : filtered.map((post, i) => (
            <div key={post._id} className="bg-card rounded-[20px] border border-border mb-3 overflow-hidden">
              <div className="p-4.5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: GRAD[i % GRAD.length] }}>
                    <span className="text-xs font-bold text-white">
                      {post.author?.slice(0,2).toUpperCase() ?? 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-primary">Community Member</span>
                    <p className="text-2xs text-muted">{timeAgo(post['Created Date'])}</p>
                  </div>
                </div>
                <p className="text-sm text-primary leading-relaxed mb-3">{post.content}</p>
                <div className="flex items-center gap-4 pt-2.5 border-t border-border">
                  <button onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0">
                    <Heart size={16}
                      color={likedIds.has(post._id) ? '#E57373' : '#9A9094'}
                      fill={likedIds.has(post._id) ? '#E57373' : 'none'}/>
                    <span className="text-xs text-muted">{(post.likes || 0) + (likedIds.has(post._id) ? 1 : 0)}</span>
                  </button>
                  <div className="ml-auto">
                    <button onClick={() => setSavedIds(s => { const n=new Set(s); n.has(post._id)?n.delete(post._id):n.add(post._id); return n })}
                      className="bg-transparent border-0 cursor-pointer p-0">
                      <Bookmark size={16}
                        color={savedIds.has(post._id) ? '#D4B06A' : '#9A9094'}
                        fill={savedIds.has(post._id) ? '#D4B06A' : 'none'}
                        stroke={savedIds.has(post._id) ? '#D4B06A' : '#9A9094'}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GROUPS */}
      {tab==='groups' && (
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <p className="text-2xs text-muted uppercase tracking-widest font-semibold mb-3">Your Groups</p>
          <div className="bg-card rounded-[18px] border border-border p-4 flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: GRAD[0] }}>
              <span className="text-xs font-bold text-white">JG</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">Your Journey Group</p>
              <p className="text-xs text-muted">Members on your journey type</p>
            </div>
            <Users size={16} className="text-muted"/>
          </div>
          <div className="mt-5 p-5 bg-card rounded-[18px] border border-border text-center">
            <p className="text-sm font-medium text-primary mb-1.5">Community Groups</p>
            <p className="text-xs text-muted leading-relaxed">
              More groups are coming soon. Share freely in the community feed in the meantime.
            </p>
          </div>
        </div>
      )}

      {/* CHAT */}
      {tab==='chat' && (
        <div className="flex-1 flex flex-col min-h-0 pb-20">
          <div className="px-6 py-3 border-b border-border flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: GRAD[0] }}>
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Community Chat</p>
              <p className="text-2xs text-muted">General community thread</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-10"><p className="text-sm text-muted">No messages yet. Start the conversation!</p></div>
            ) : messages.map((msg, i) => {
              const isMe = msg.sender === profile._id
              return (
                <div key={msg._id} className={`flex gap-2 mb-3.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 self-end"
                      style={{ background: GRAD[i % GRAD.length] }}>
                      <span className="text-2xs font-bold text-white">{msg.sender?.slice(0,2).toUpperCase() ?? 'U'}</span>
                    </div>
                  )}
                  <div className="max-w-[75%]">
                    <div className={`px-3.5 py-2.5 ${isMe ? 'bg-gold rounded-[18px_18px_4px_18px]' : 'bg-card border border-border rounded-[18px_18px_18px_4px]'}`}>
                      <p className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-primary'}`}>{msg.content}</p>
                    </div>
                    <p className={`text-2xs text-muted mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      {timeAgo(msg['Created Date'])}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={endRef}/>
          </div>
          <div className="px-6 py-3 border-t border-border bg-card flex-shrink-0">
            <div className="flex gap-2.5 items-center">
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Message community…"
                className="flex-1 bg-section border border-border rounded-pill px-4 py-2.5 text-sm
                           text-primary outline-none font-sans placeholder:text-muted"/>
              <button onClick={handleSend}
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-0
                  ${newMsg.trim() ? 'bg-gold cursor-pointer' : 'bg-section cursor-not-allowed'}`}>
                <Send size={16} color={newMsg.trim() ? '#fff' : '#9A9094'}/>
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav/>
    </div>
  )
}
