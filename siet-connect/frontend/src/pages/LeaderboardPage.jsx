import { useState, useEffect } from "react";
import { Trophy, Star, Flame, Medal, Crown, TrendingUp } from "lucide-react";
import api from "../lib/axios.js";
import useAuthStore from "../store/authStore.js";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

const LeaderboardPage = () => {
  const { user } = useAuthStore();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lb, act] = await Promise.all([
          api.get("/leaderboard"),
          api.get("/leaderboard/activity"),
        ]);
        setLeaders(lb.data.data);
        setActivityData(act.data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown size={20} className="text-yellow-400" aria-label="1st place" />;
    if (index === 1) return <Medal size={20} className="text-gray-300" aria-label="2nd place" />;
    if (index === 2) return <Medal size={20} className="text-amber-600" aria-label="3rd place" />;
    return <span className="text-sm font-bold text-base-content/50 w-5 text-center">{index + 1}</span>;
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <Trophy size={24} className="text-yellow-400" aria-hidden="true" /> Leaderboard
      </h1>
      <p className="text-base-content/60 text-sm mb-6">🎯 Top students by XP — earn points by logging in, downloading PYQs, and upvoting</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          {leaders.length === 0 ? (
            <EmptyState title="No students yet" description="Be the first to earn XP!" icon={Trophy} />
          ) : (
            <div className="space-y-2">
              {leaders.map((l, i) => {
                const isMe = l._id === user?._id;
                return (
                  <div
                    key={l._id}
                    className={`card rounded-2xl shadow transition-all duration-200 ${
                      isMe ? "bg-accent/10 ring-2 ring-accent" : "bg-base-200"
                    } ${i < 3 ? "shadow-lg" : ""}`}
                  >
                    <div className="card-body p-3 flex-row items-center gap-4">
                      <div className="w-8 flex items-center justify-center">
                        {getRankIcon(i)}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold">
                        {l.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {l.name} {isMe && <span className="text-accent text-xs">(You)</span>}
                        </p>
                        <p className="text-xs text-base-content/50">{l.branch} · Sem {l.semester}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Flame size={14} className="text-orange-400 mx-auto" aria-hidden="true" />
                          <p className="text-xs font-bold">{l.streak}</p>
                        </div>
                        <div className="text-center min-w-[50px]">
                          <Star size={14} className="text-yellow-400 mx-auto" aria-hidden="true" />
                          <p className="text-sm font-extrabold text-accent">{l.xp} XP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Stats + Activity */}
        <div className="space-y-6">
          {/* My Stats */}
          <div className="card bg-base-200 rounded-2xl shadow-lg">
            <div className="card-body">
              <h2 className="font-semibold">📊 Your Stats</h2>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center bg-base-300/50 rounded-xl p-3">
                  <Star size={18} className="text-yellow-400 mx-auto" aria-hidden="true" />
                  <p className="text-xl font-extrabold mt-1">{activityData?.xp || 0}</p>
                  <p className="text-xs text-base-content/50">Total XP</p>
                </div>
                <div className="text-center bg-base-300/50 rounded-xl p-3">
                  <Flame size={18} className="text-orange-400 mx-auto" aria-hidden="true" />
                  <p className="text-xl font-extrabold mt-1">{activityData?.streak || 0}</p>
                  <p className="text-xs text-base-content/50">Day Streak</p>
                </div>
                <div className="text-center bg-base-300/50 rounded-xl p-3">
                  <TrendingUp size={18} className="text-accent mx-auto" aria-hidden="true" />
                  <p className="text-xl font-extrabold mt-1">
                    #{leaders.findIndex(l => l._id === user?._id) + 1 || "—"}
                  </p>
                  <p className="text-xs text-base-content/50">Rank</p>
                </div>
              </div>
            </div>
          </div>

          {/* XP Guide */}
          <div className="card bg-base-200 rounded-2xl shadow-lg">
            <div className="card-body">
              <h2 className="font-semibold">💡 How to Earn XP</h2>
              <div className="space-y-2 mt-2 text-sm">
                <div className="flex justify-between"><span>🔥 Daily login streak</span><span className="font-bold text-accent">+10 XP</span></div>
                <div className="flex justify-between"><span>📤 Upload a PYQ</span><span className="font-bold text-accent">+15 XP</span></div>
                <div className="flex justify-between"><span>👍 Upvote content</span><span className="font-bold text-accent">+2 XP</span></div>
                <div className="flex justify-between"><span>📥 Download PYQ</span><span className="font-bold text-accent">+1 XP</span></div>
              </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="card bg-base-200 rounded-2xl shadow-lg">
            <div className="card-body">
              <h2 className="font-semibold">📈 Activity (30 Days)</h2>
              <div className="flex gap-1 flex-wrap mt-3">
                {Array.from({ length: 30 }, (_, i) => {
                  const dateKey = new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0];
                  const count = activityData?.activityMap?.[dateKey] || 0;
                  const level = Math.min(count, 3);
                  const colors = ["bg-base-300", "bg-accent/25", "bg-accent/50", "bg-accent/80"];
                  return (
                    <div
                      key={i}
                      className={`heatmap-cell ${colors[level]}`}
                      title={`${dateKey}: ${count} actions`}
                      aria-label={`${dateKey}: ${count} actions`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-base-content/40 mt-2">Less ← → More</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
