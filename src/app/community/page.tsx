"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useAppStore } from "@/store/app";
import BottomNav from "@/components/shared/BottomNav";
import LoadingScreen from "@/components/shared/LoadingScreen";
import {
  getPosts,
  createPost,
  likePost,
  getMyGroups,
  getAllGroups,
  getGroupPosts,
  createGroupPost,
} from "@/lib/data";
import { triggerJoinGroup, triggerLeaveGroup } from "@/lib/workflows";
import {
  Heart,
  Bookmark,
  Send,
  Feather,
  Search,
  MessageCircle,
  ChevronRight,
  Users,
  Plus,
  Check,
} from "lucide-react";

type Tab = "feed" | "groups" | "chat";

interface BPost {
  _id: string;
  content: string;
  likes?: number;
  author?: string;
  author_name?: string;
  group?: string;
  "Created Date"?: number;
}
interface BGroup {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  member_count?: number;
  members?: string[];
}

const GOLD = "#D4B06A";
const GRAD = [
  "linear-gradient(135deg,#E8D4A0,#C9A24D)",
  "linear-gradient(135deg,#C0D4BE,#7A9A78)",
  "linear-gradient(135deg,#D8C8E0,#9878B0)",
  "linear-gradient(135deg,#D4B8C0,#A87888)",
  "linear-gradient(135deg,#B8D0C8,#688C84)",
];

function timeAgo(ts?: number) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function groupInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function CommunityPage() {
  useProfile();
  const { profile } = useAppStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("feed");
  const [posts, setPosts] = useState<BPost[]>([]);
  const [myGroups, setMyGroups] = useState<BGroup[]>([]);
  const [allGroups, setAllGroups] = useState<BGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<BGroup | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [posting, setPosting] = useState(false);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  useEffect(() => {
    if (!profile) return;
    loadGroups();
  }, [profile]);

  // Load feed whenever selected group changes
  useEffect(() => {
    if (!profile) return;
    loadFeed();
  }, [profile, selectedGroup]);

  async function loadGroups() {
    try {
      const [mine, all] = await Promise.all([getMyGroups(), getAllGroups()]);
      setMyGroups(mine);
      setAllGroups(all);
      // Default selected group to first joined group
      if (mine.length > 0 && !selectedGroup) setSelectedGroup(mine[0]);
    } catch {
    } finally {
      setLoadingGroups(false);
    }
  }

  async function loadFeed() {
    setLoadingPosts(true);
    try {
      let data: BPost[];
      if (selectedGroup) {
        data = await getGroupPosts(selectedGroup._id);
      } else {
        // No groups joined yet — show global feed
        data = await getPosts();
      }
      setPosts(data);
    } catch {
    } finally {
      setLoadingPosts(false);
    }
  }

  async function handlePost() {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      if (selectedGroup) {
        await createGroupPost(
          selectedGroup._id,
          newPost,
          profile?.first_name || "Member",
        );
      } else {
        await createPost(newPost);
      }
      setNewPost("");
      await loadFeed();
    } catch {
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(id: string) {
    setLikedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    try {
      await likePost(id);
    } catch {}
  }

  async function handleJoin(group: BGroup) {
    setJoiningId(group._id);
    try {
      await triggerJoinGroup(group._id);
      await loadGroups();
    } catch {
    } finally {
      setJoiningId(null);
    }
  }

  async function handleLeave(group: BGroup) {
    setJoiningId(group._id);
    try {
      await triggerLeaveGroup(group._id);
      await loadGroups();
      if (selectedGroup?._id === group._id) setSelectedGroup(null);
    } catch {
    } finally {
      setJoiningId(null);
    }
  }

  function isMember(group: BGroup) {
    return myGroups.some((g) => g._id === group._id);
  }

  if (!profile) return <LoadingScreen message="Loading community…" />;

  const filtered = search
    ? posts.filter((p) =>
        p.content?.toLowerCase().includes(search.toLowerCase()),
      )
    : posts;

  const discoverGroups =
    groupFilter === "all"
      ? allGroups
      : allGroups.filter((g) => g.category === groupFilter);

  return (
    <div className="min-h-full bg-bg flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-medium text-primary tracking-tight">
            Community
          </h1>
          <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center cursor-pointer">
            <Feather size={16} className="text-muted" />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex bg-card rounded-2xl border border-border p-1 mb-4">
          {(["feed", "groups", "chat"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl border-0 cursor-pointer text-sm font-medium
                          transition-all font-sans
                          ${tab === t ? "text-white" : "bg-transparent text-muted hover:text-primary"}`}
              style={{ background: tab === t ? GOLD : "transparent" }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── FEED ── */}
      {tab === "feed" && (
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {/* Group selector — horizontal scroll */}
          {myGroups.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => setSelectedGroup(null)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-pill text-xs font-semibold
                            border transition-all font-sans
                            ${
                              !selectedGroup
                                ? "text-white border-transparent"
                                : "bg-transparent text-muted border-border"
                            }`}
                style={{ background: !selectedGroup ? GOLD : "transparent" }}
              >
                All
              </button>
              {myGroups.map((g) => (
                <button
                  key={g._id}
                  onClick={() => setSelectedGroup(g)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-pill text-xs font-semibold
                              border transition-all font-sans
                              ${
                                selectedGroup?._id === g._id
                                  ? "text-white border-transparent"
                                  : "bg-transparent text-muted border-border"
                              }`}
                  style={{
                    background:
                      selectedGroup?._id === g._id ? GOLD : "transparent",
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-3.5">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-3.5
                         text-sm text-primary outline-none font-sans placeholder:text-muted"
            />
          </div>

          {/* Composer */}
          <div className="bg-card rounded-[18px] border border-border p-3.5 mb-4">
            {selectedGroup && (
              <p className="text-2xs text-muted mb-2">
                Posting to{" "}
                <span className="text-gold font-semibold">
                  {selectedGroup.name}
                </span>
              </p>
            )}
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={2}
              placeholder={
                selectedGroup
                  ? `Share with ${selectedGroup.name}…`
                  : "Share with the community…"
              }
              className="w-full bg-transparent border-0 outline-none text-sm text-primary
                         resize-none font-sans leading-relaxed placeholder:text-muted"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || posting}
                className={`px-4 py-1.5 rounded-pill text-xs font-semibold transition-colors font-sans
                  ${newPost.trim() ? "text-white cursor-pointer" : "bg-section text-muted cursor-not-allowed"}`}
                style={{ background: newPost.trim() ? GOLD : undefined }}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>

          {/* Posts */}
          {loadingPosts ? (
            <div className="text-center py-10">
              <div className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent spin mx-auto mb-2" />
              <p className="text-sm text-muted">Loading posts…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted mb-2">
                {search ? "No posts match your search." : "No posts yet."}
              </p>
              {!search && myGroups.length === 0 && (
                <button
                  onClick={() => setTab("groups")}
                  className="text-xs text-gold font-semibold bg-transparent border-0 cursor-pointer"
                >
                  Join a group to see posts →
                </button>
              )}
            </div>
          ) : (
            filtered.map((post, i) => (
              <div
                key={post._id}
                className="bg-card rounded-[20px] border border-border mb-3"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: GRAD[i % GRAD.length] }}
                    >
                      <span className="text-xs font-bold text-white">
                        {(post.author_name || "U").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-primary">
                        {post.author_name || "Community Member"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <p className="text-2xs text-muted">
                          {timeAgo(post["Created Date"])}
                        </p>
                        {post.group && (
                          <>
                            <span className="text-2xs text-muted">·</span>
                            <span className="text-2xs text-gold font-medium">
                              {myGroups.find((g) => g._id === post.group)
                                ?.name || "Group"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <p
                    className="text-sm text-primary leading-relaxed mb-3 cursor-pointer"
                    onClick={() => router.push(`/community/${post._id}`)}
                  >
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 pt-2.5 border-t border-border">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
                    >
                      <Heart
                        size={16}
                        color={likedIds.has(post._id) ? "#E57373" : "#9A9094"}
                        fill={likedIds.has(post._id) ? "#E57373" : "none"}
                      />
                      <span className="text-xs text-muted">
                        {(post.likes || 0) + (likedIds.has(post._id) ? 1 : 0)}
                      </span>
                    </button>
                    <button
                      onClick={() => router.push(`/community/${post._id}`)}
                      className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
                    >
                      <MessageCircle size={16} color="#9A9094" />
                    </button>
                    <div className="ml-auto flex items-center gap-3">
                      <button
                        onClick={() =>
                          setSavedIds((s) => {
                            const n = new Set(s);
                            n.has(post._id)
                              ? n.delete(post._id)
                              : n.add(post._id);
                            return n;
                          })
                        }
                        className="bg-transparent border-0 cursor-pointer p-0"
                      >
                        <Bookmark
                          size={16}
                          color={savedIds.has(post._id) ? GOLD : "#9A9094"}
                          fill={savedIds.has(post._id) ? GOLD : "none"}
                          stroke={savedIds.has(post._id) ? GOLD : "#9A9094"}
                        />
                      </button>
                      <button
                        onClick={() => router.push(`/community/${post._id}`)}
                        className="bg-transparent border-0 cursor-pointer p-0"
                      >
                        <ChevronRight size={15} color="#9A9094" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── GROUPS ── */}
      {tab === "groups" && (
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {/* My Groups */}
          {myGroups.length > 0 && (
            <>
              <p className="text-2xs text-muted uppercase tracking-widest font-semibold mb-3">
                Your Groups
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {myGroups.map((g, i) => (
                  <div
                    key={g._id}
                    className="bg-card rounded-[18px] border border-border p-4
                                               flex items-center gap-3"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: GRAD[i % GRAD.length] }}
                    >
                      <span className="text-xs font-bold text-white">
                        {groupInitials(g.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary">
                        {g.name}
                      </p>
                      <p className="text-2xs text-muted">
                        {g.member_count ?? 0} member
                        {g.member_count !== 1 ? "s" : ""}
                        {g.category ? ` · ${g.category}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Open group chat */}
                      <button
                        onClick={() => router.push(`/community/chat/${g._id}`)}
                        className="w-8 h-8 rounded-xl bg-section flex items-center justify-center
                                   border-0 cursor-pointer"
                      >
                        <MessageCircle size={14} className="text-muted" />
                      </button>
                      {/* Leave */}
                      <button
                        onClick={() => handleLeave(g)}
                        disabled={joiningId === g._id}
                        className="px-3 py-1.5 rounded-pill text-2xs font-semibold border
                                   border-border text-muted bg-transparent cursor-pointer font-sans"
                      >
                        {joiningId === g._id ? "…" : "Leave"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Discover */}
          <p className="text-2xs text-muted uppercase tracking-widest font-semibold mb-3">
            Discover Groups
          </p>

          {/* Category filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {["all", "wellness", "city", "month"].map((cat) => (
              <button
                key={cat}
                onClick={() => setGroupFilter(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-pill text-xs font-semibold
                            border transition-all font-sans capitalize
                            ${
                              groupFilter === cat
                                ? "text-white border-transparent"
                                : "bg-transparent text-muted border-border"
                            }`}
                style={{
                  background: groupFilter === cat ? GOLD : "transparent",
                }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {loadingGroups ? (
            <div className="text-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent spin mx-auto mb-2" />
              <p className="text-sm text-muted">Loading groups…</p>
            </div>
          ) : discoverGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted">No groups found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {discoverGroups.map((g, i) => {
                const joined = isMember(g);
                return (
                  <div
                    key={g._id}
                    className="bg-card rounded-[18px] border border-border p-4
                                               flex items-center gap-3"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: GRAD[i % GRAD.length] }}
                    >
                      <span className="text-xs font-bold text-white">
                        {groupInitials(g.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {g.name}
                      </p>
                      <p className="text-2xs text-muted">
                        {g.member_count ?? 0} member
                        {g.member_count !== 1 ? "s" : ""}
                        {g.category ? ` · ${g.category}` : ""}
                      </p>
                      {g.description && (
                        <p className="text-2xs text-muted mt-0.5 truncate">
                          {g.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => (joined ? handleLeave(g) : handleJoin(g))}
                      disabled={joiningId === g._id}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-pill text-xs
                                 font-semibold border-0 cursor-pointer flex-shrink-0 font-sans
                                 transition-all"
                      style={{
                        background: joined ? "rgba(31,122,90,0.1)" : GOLD,
                        color: joined ? "#1F7A5A" : "#fff",
                      }}
                    >
                      {joiningId === g._id ? (
                        "…"
                      ) : joined ? (
                        <>
                          <Check size={11} />
                          <span>Joined</span>
                        </>
                      ) : (
                        <>
                          <Plus size={11} />
                          <span>Join</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CHAT ── */}
      {tab === "chat" && (
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <p className="text-2xs text-muted uppercase tracking-widest font-semibold mb-3">
            Your Chats
          </p>

          {loadingGroups ? (
            <div className="text-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent spin mx-auto" />
            </div>
          ) : myGroups.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted mb-2">No chats yet.</p>
              <button
                onClick={() => setTab("groups")}
                className="text-xs text-gold font-semibold bg-transparent border-0 cursor-pointer"
              >
                Join a group to start chatting →
              </button>
            </div>
          ) : (
            myGroups.map((g, i) => (
              <button
                key={g._id}
                onClick={() => router.push(`/community/chat/${g._id}`)}
                className="w-full bg-card rounded-[18px] border border-border p-4 mb-2.5
                         flex items-center gap-3 cursor-pointer text-left"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: GRAD[i % GRAD.length] }}
                >
                  <span className="text-xs font-bold text-white">
                    {groupInitials(g.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{g.name}</p>
                  <p className="text-2xs text-muted">
                    {g.member_count ?? 0} member
                    {g.member_count !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted flex-shrink-0" />
              </button>
            ))
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
