import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Briefcase, FileText, Calendar, Bell, Flame,
  TrendingUp, Users, ChevronRight, AlertTriangle, Star,
  Download, Clock, ArrowUpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore.js";
import useSocket from "../hooks/useSocket.js";
import api from "../lib/axios.js";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const socket = useSocket();
  const [notices, setNotices] = useState([]);
  const [presence, setPresence] = useState({ count: 0, users: [] });
  const [loading, setLoading] = useState(true);

  // Fetch recent notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get("/notices?sort=popular");
        setNotices(data.data.slice(0, 5));
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Listen for real-time events
  useEffect(() => {
    if (!socket) return;

    socket.on("presence:update", (data) => setPresence(data));
    socket.on("notice:new", (notice) => {
      toast("New notice: " + notice.title, { icon: "🔔" });
      setNotices((prev) => [notice, ...prev].slice(0, 5));
    });
    socket.on("attendance:alert", (data) => {
      if (data.userId === user?._id) {
        toast.error(`Attendance alert: ${data.message}`);
      }
    });

    return () => {
      socket.off("presence:update");
      socket.off("notice:new");
      socket.off("attendance:alert");
    };
  }, [socket, user]);

  // Upvote handler
  const handleUpvote = async (noticeId) => {
    try {
      const { data } = await api.put(`/notices/${noticeId}/upvote`);
      setNotices((prev) =>
        prev.map((n) =>
          n._id === noticeId ? { ...n, upvoteCount: data.data.upvoteCount } : n
        )
      );
    } catch {
      // handled
    }
  };

  // Schedule mock data
  const todaySchedule = [
    { time: "9:00 AM", subject: "🧪 Data Structures", room: "Lab 3", type: "Lab" },
    { time: "11:00 AM", subject: "💻 Operating Systems", room: "Room 201", type: "Lecture" },
    { time: "2:00 PM", subject: "🤖 Machine Learning", room: "Room 105", type: "Lecture" },
  ];

  const quickActions = [
    { label: "📝 PYQs", icon: Download, path: "/academics/pyqs", color: "bg-blue-500/20 text-blue-400" },
    { label: "📖 Syllabus", icon: BookOpen, path: "/academics/syllabus", color: "bg-green-500/20 text-green-400" },
    { label: "🎉 Events", icon: Calendar, path: "/campus/events", color: "bg-purple-500/20 text-purple-400" },
    { label: "💼 Internships", icon: Briefcase, path: "/placements/opportunities", color: "bg-amber-500/20 text-amber-400" },
    { label: "📄 Documents", icon: FileText, path: "/services/documents", color: "bg-rose-500/20 text-rose-400" },
    { label: "🔔 Notices", icon: Bell, path: "/dashboard", color: "bg-cyan-500/20 text-cyan-400" },
  ];

  const attendanceColor = user?.attendance >= 75 ? "text-success" : "text-error";
  const attendanceBg = user?.attendance >= 75 ? "bg-success/20" : "bg-error/20";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Greeting + Presence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Hello, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            {user?.branch} — Semester {user?.semester} | ID: {user?.studentId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live presence */}
          <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
            <Users size={14} aria-hidden="true" />
            <span>{presence.count} online</span>
          </div>
          {/* Streak */}
          <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2 text-sm">
            <Flame size={14} className="text-orange-400" aria-hidden="true" />
            <span>{user?.streak || 0} day streak</span>
          </div>
          {/* XP */}
          <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2 text-sm">
            <Star size={14} className="text-yellow-400" aria-hidden="true" />
            <span>{user?.xp || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Top row: Attendance + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Card */}
        <div className="card bg-base-200 rounded-2xl shadow-lg" role="region" aria-label="Attendance tracker">
          <div className="card-body">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp size={18} aria-hidden="true" /> 📊 Attendance
            </h2>
            <div className="flex items-center justify-center py-4">
              <div className={`radial-progress ${attendanceColor}`} style={{ "--value": user?.attendance || 0, "--size": "7rem", "--thickness": "8px" }} role="progressbar" aria-valuenow={user?.attendance} aria-valuemin="0" aria-valuemax="100" aria-label={`Attendance: ${user?.attendance}%`}>
                <span className="text-2xl font-bold">{user?.attendance || 0}%</span>
              </div>
            </div>
            {user?.attendance < 75 && (
              <div className={`flex items-center gap-2 ${attendanceBg} rounded-xl p-3 text-sm`}>
                <AlertTriangle size={16} className="text-error" aria-hidden="true" />
                <span className="text-error font-medium">⚠️ Below 75% — attendance shortage alert!</span>
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card bg-base-200 rounded-2xl shadow-lg lg:col-span-2" role="region" aria-label="Today's schedule">
          <div className="card-body">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock size={18} aria-hidden="true" /> 📅 Today's Schedule
            </h2>
            <div className="space-y-3 mt-2">
              {todaySchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-base-300/50 rounded-xl p-3">
                  <span className="text-sm font-mono text-accent min-w-[70px]">{item.time}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.subject}</p>
                    <p className="text-xs text-base-content/50">{item.room}</p>
                  </div>
                  <span className={`badge badge-sm ${item.type === "Lab" ? "badge-accent" : "badge-ghost"}`}>{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Director Principal Message */}
      <div className="card bg-base-200 rounded-2xl shadow-lg mb-6 overflow-hidden" role="region" aria-label="Director Principal's message">
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <img
              src="/images/anil-kumar-240x300.jpeg"
              alt="Director Principal of SIET Panchkula"
              className="w-20 h-24 rounded-xl object-cover shadow flex-shrink-0"
            />
            <div>
              <h2 className="font-semibold">🎓 Director Principal's Message</h2>
              <p className="text-sm text-base-content/60 mt-1 line-clamp-3">
                "At SIET, we nurture engineers for Industry 4.0. Make the most of every opportunity —
                connect, learn, and grow. This platform brings all of SIET together in one place."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mb-6" aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="font-semibold mb-3">⚡ Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((a, i) => (
            <Link key={i} to={a.path} className="flex flex-col items-center gap-2 bg-base-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center`}>
                <a.icon size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Notices */}
      <section aria-labelledby="notices-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="notices-heading" className="font-semibold flex items-center gap-2">
            <Bell size={18} aria-hidden="true" /> 📢 Latest Notices
          </h2>
          <Link to="/academics" className="text-accent text-sm flex items-center gap-1 hover:underline">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Spinner size="sm" />
        ) : notices.length === 0 ? (
          <EmptyState title="No notices yet" description="Notices from admin will appear here" />
        ) : (
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n._id} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {n.isPinned && <span className="badge badge-accent badge-xs">Pinned</span>}
                        <span className="badge badge-ghost badge-xs">{n.category}</span>
                        {n.tags?.map((t) => <span key={t} className="badge badge-outline badge-xs">{t}</span>)}
                      </div>
                      <h3 className="font-semibold">{n.title}</h3>
                      <p className="text-sm text-base-content/60 mt-1 line-clamp-2">{n.content}</p>
                      <p className="text-xs text-base-content/40 mt-2">
                        By {n.postedBy?.name} · {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpvote(n._id)}
                      className="flex flex-col items-center gap-1 min-w-[50px]"
                      aria-label={`Upvote notice, current count ${n.upvoteCount}`}
                    >
                      <ArrowUpCircle size={22} className="text-accent" />
                      <span className="text-xs font-bold">{n.upvoteCount || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity Heatmap placeholder */}
      <section className="mt-6" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp size={18} aria-hidden="true" /> 🔥 Activity Heatmap (30 Days)
        </h2>
        <div className="card bg-base-200 rounded-2xl shadow-lg">
          <div className="card-body">
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 30 }, (_, i) => {
                const level = Math.floor(Math.random() * 4);
                const colors = ["bg-base-300", "bg-accent/25", "bg-accent/50", "bg-accent/80"];
                return (
                  <div
                    key={i}
                    className={`heatmap-cell ${colors[level]}`}
                    title={`Day ${i + 1}: ${level} actions`}
                    aria-label={`Day ${i + 1}: ${level} actions`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-base-content/40 mt-2">Less ← → More activity</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
