'use client'
import { use, useEffect, useState } from 'react'
import { getPost, getComments, createComment } from '@/lib/data'
import BackHeader from '@/components/shared/BackHeader'
import BottomNav from '@/components/shared/BottomNav'

interface Comment {
  _id: string
  content: string
  Created_Date: string
  author_name?: string
}

function timeAgo(d: string) {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getPost(id).then(setPost).catch(() => {})
    getComments(id).then(setComments).catch(() => {})
  }, [id])

  async function handleReply() {
    if (!reply.trim()) return
    setSending(true)
    try {
      await createComment(id, reply)
      const updated = await getComments(id)
      setComments(updated)
      setReply('')
    } catch {
      setComments((c) => [...c, {
        _id: Date.now().toString(),
        content: reply,
        Created_Date: new Date().toISOString(),
        author_name: 'You',
      }])
      setReply('')
    } finally { setSending(false) }
  }

  return (
    <div className="min-h-screen bg-cream pb-32">
      <BackHeader href="/community" />

      {post && (
        <div className="px-5 mb-5">
          <div className="bg-white border border-border rounded-2xl px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold-light flex items-center justify-center">
                <span className="text-sm text-gold font-medium">
                  {(post.author_name || 'A')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">{post.author_name || 'Anonymous'}</p>
                <p className="text-xs text-muted">{timeAgo(post.Created_Date)}</p>
              </div>
            </div>
            <p className="text-sm text-charcoal leading-relaxed">{post.content}</p>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="px-5">
        <p className="text-xs text-muted uppercase tracking-wider font-medium mb-3">
          {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
        </p>
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c._id} className="bg-white border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gold-light flex items-center justify-center">
                  <span className="text-xs text-gold">{(c.author_name || 'A')[0].toUpperCase()}</span>
                </div>
                <p className="text-xs font-medium text-charcoal">{c.author_name || 'Anonymous'}</p>
                <p className="text-xs text-muted ml-auto">{timeAgo(c.Created_Date)}</p>
              </div>
              <p className="text-sm text-charcoal leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reply box — fixed to bottom */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-border px-4 py-3">
        <div className="flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 text-sm bg-cream rounded-pill px-4 py-2 outline-none placeholder-muted"
            onKeyDown={(e) => e.key === 'Enter' && handleReply()}
          />
          <button
            onClick={handleReply}
            disabled={!reply.trim() || sending}
            className="w-9 h-9 bg-gold rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
