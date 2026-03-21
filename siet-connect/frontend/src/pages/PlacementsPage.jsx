import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search, Briefcase, TrendingUp, Users, Calendar, MapPin,
  ExternalLink, ArrowUpCircle, BarChart3, BookOpen, Phone,
} from "lucide-react";
import api from "../lib/axios.js";
import useDebounce from "../hooks/useDebounce.js";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

const tabs = ["Opportunities", "Stats", "Alumni", "Interview Prep", "TPO"];
const tabSlugs = { "opportunities": "Opportunities", "stats": "Stats", "alumni": "Alumni", "interview-prep": "Interview Prep", "tpo": "TPO" };
const toSlug = (t) => t.toLowerCase().replace(/ /g, "-");

const PlacementsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(() => {
    if (tab && tabSlugs[tab]) return tabSlugs[tab];
    return "Opportunities";
  });

  useEffect(() => {
    if (tab && tabSlugs[tab]) {
      setActiveTab(tabSlugs[tab]);
    } else if (tab) {
      navigate("/placements/opportunities", { replace: true });
    }
  }, [tab, navigate]);
  const switchTab = (t) => { setActiveTab(t); navigate(`/placements/${toSlug(t)}`, { replace: true }); };
  const [placements, setPlacements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const debouncedSearch = useDebounce(search);

  // Fetch placements
  useEffect(() => {
    if (activeTab !== "Opportunities") return;
    const fetchPlacements = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterType !== "all") params.set("type", filterType);
        if (debouncedSearch) params.set("search", debouncedSearch);
        const { data } = await api.get(`/placements?${params}`);
        setPlacements(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchPlacements();
  }, [activeTab, filterType, debouncedSearch]);

  // Fetch stats
  useEffect(() => {
    if (activeTab !== "Stats") return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/placements/stats");
        setStats(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchStats();
  }, [activeTab]);

  // Upvote
  const handleUpvote = async (id) => {
    try {
      const { data } = await api.put(`/placements/${id}/upvote`);
      setPlacements((prev) => prev.map((p) => p._id === id ? { ...p, upvoteCount: data.data.upvoteCount } : p));
    } catch {}
  };

  // Alumni mock
  const alumniData = [
    { name: "Priya Verma", batch: "2023", company: "Google", role: "SDE-1", branch: "CSE-AIML" },
    { name: "Rahul Mehta", batch: "2023", company: "Microsoft", role: "SDE", branch: "CSE-CS" },
    { name: "Anjali Rao", batch: "2022", company: "Amazon", role: "SDE-2", branch: "CSE-AIML" },
    { name: "Vikrant Singh", batch: "2022", company: "Infosys", role: "Systems Engineer", branch: "RAE" },
    { name: "Sneha Kapoor", batch: "2024", company: "TCS", role: "Developer", branch: "CSE-CS" },
    { name: "Karan Joshi", batch: "2024", company: "Wipro", role: "Project Engineer", branch: "RAE" },
  ];

  // Interview prep resources
  const prepResources = [
    { title: "DSA Sheet — 300 Problems", desc: "Curated by SIET seniors, topic-wise", type: "Sheet", link: "#" },
    { title: "Aptitude Practice Tests", desc: "Mock tests for TCS, Infosys, Wipro patterns", type: "Mock Test", link: "#" },
    { title: "System Design Basics", desc: "HLD & LLD for final year students", type: "Guide", link: "#" },
    { title: "HR Interview Questions", desc: "50 most-asked HR questions with sample answers", type: "Guide", link: "#" },
    { title: "Coding Round Strategies", desc: "Time management + approach for online tests", type: "Guide", link: "#" },
    { title: "Resume Template", desc: "ATS-friendly resume template for freshers", type: "Template", link: "#" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Placements & Career</h1>
      <p className="text-base-content/60 text-xs sm:text-sm mb-4 sm:mb-6">Opportunities, stats, alumni network, and interview prep</p>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 rounded-2xl p-1 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap" role="tablist">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => switchTab(tab)} className={`tab tab-sm sm:tab-md transition-all duration-200 ${activeTab === tab ? "tab-active !bg-accent !text-white rounded-xl" : ""}`} role="tab" aria-selected={activeTab === tab}>
            {tab}
          </button>
        ))}
      </div>

      {/* Opportunities Tab */}
      {activeTab === "Opportunities" && (
        <section aria-label="Placement opportunities">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" aria-hidden="true" />
              <input type="search" className="input input-bordered w-full pl-10 rounded-xl" placeholder="Search company or role..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search placements" />
            </div>
            <select className="select select-bordered rounded-xl" value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label="Filter by type">
              <option value="all">All Types</option>
              <option value="internship">Internships</option>
              <option value="fulltime">Full-Time</option>
              <option value="offcampus">Off-Campus</option>
            </select>
          </div>

          {loading ? <Spinner /> : placements.length === 0 ? (
            <EmptyState title="No opportunities yet" description="New openings will appear here" icon={Briefcase} />
          ) : (
            <div className="space-y-4">
              {placements.map((p) => (
                <div key={p._id} className="card bg-base-200 rounded-2xl shadow">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`badge badge-sm ${p.type === "internship" ? "badge-accent" : p.type === "fulltime" ? "badge-success" : "badge-warning"}`}>{p.type}</span>
                          <span className={`badge badge-sm ${p.status === "open" ? "badge-success" : "badge-error"}`}>{p.status}</span>
                          {p.tags?.map((t) => <span key={t} className="badge badge-outline badge-xs">{t}</span>)}
                        </div>
                        <h3 className="font-bold text-lg">{p.company}</h3>
                        <p className="text-sm text-accent font-medium">{p.role}</p>
                        <p className="text-sm text-base-content/60 mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-base-content/50">
                          {p.stipend && <span className="flex items-center gap-1"><TrendingUp size={12} /> {p.type === "internship" ? p.stipend : p.package}</span>}
                          <span className="flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                        </div>
                        {p.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.skills.map((s) => <span key={s} className="badge badge-ghost badge-xs">{s}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <button onClick={() => handleUpvote(p._id)} className="flex flex-col items-center" aria-label={`Upvote, count ${p.upvoteCount}`}>
                          <ArrowUpCircle size={22} className="text-accent" />
                          <span className="text-xs font-bold">{p.upvoteCount || 0}</span>
                        </button>
                        {p.applyLink && (
                          <a href={p.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm rounded-xl gap-1" aria-label={`Apply to ${p.company}`}>
                            Apply <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Stats Tab */}
      {activeTab === "Stats" && (
        <section aria-label="Placement statistics">
          {loading ? <Spinner /> : !stats ? <EmptyState title="Stats loading..." /> : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Drives", val: stats.total, color: "text-accent" },
                  { label: "Open Now", val: stats.open, color: "text-success" },
                  { label: "Internships", val: stats.internships, color: "text-warning" },
                  { label: "Full-Time", val: stats.fulltime, color: "text-info" },
                ].map((s, i) => (
                  <div key={i} className="card bg-base-200 rounded-2xl shadow text-center">
                    <div className="card-body p-4">
                      <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
                      <p className="text-xs text-base-content/60">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card bg-base-200 rounded-2xl shadow">
                  <div className="card-body p-4">
                    <h3 className="font-semibold flex items-center gap-2"><BarChart3 size={18} className="text-accent" /> Key Metrics</h3>
                    <div className="space-y-2 mt-2">
                      <p className="text-sm">Average Package: <strong className="text-accent">{stats.avgPackage}</strong></p>
                      <p className="text-sm">Placement Rate: <strong className="text-success">{stats.placementRate}</strong></p>
                    </div>
                  </div>
                </div>
                <div className="card bg-base-200 rounded-2xl shadow">
                  <div className="card-body p-4">
                    <h3 className="font-semibold flex items-center gap-2"><Briefcase size={18} className="text-accent" /> Top Recruiters</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stats.topRecruiters?.map((r) => <span key={r} className="badge badge-accent badge-outline">{r}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Alumni Tab */}
      {activeTab === "Alumni" && (
        <section aria-label="Alumni network">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alumniData.map((a, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4 flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{a.name}</h3>
                    <p className="text-sm text-accent">{a.role} @ {a.company}</p>
                    <p className="text-xs text-base-content/50">Batch {a.batch} · {a.branch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interview Prep Tab */}
      {activeTab === "Interview Prep" && (
        <section aria-label="Interview preparation resources">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prepResources.map((r, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge badge-ghost badge-xs mb-1">{r.type}</span>
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-base-content/60">{r.desc}</p>
                    </div>
                    <a href={r.link} className="btn btn-accent btn-sm rounded-xl gap-1" aria-label={`Open ${r.title}`}>
                      <ExternalLink size={14} /> Open
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TPO Tab */}
      {activeTab === "TPO" && (
        <section aria-label="Training and Placement Officer">
          <div className="card bg-base-200 rounded-2xl shadow max-w-lg">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
                  T
                </div>
                <div>
                  <h3 className="font-bold text-lg">Training & Placement Office</h3>
                  <p className="text-sm text-base-content/60">SIET Panchkula</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Phone size={14} className="text-accent" /> 0172-2929871</p>
                <p className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> Room 108, Admin Block</p>
                <p className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> Mon–Fri, 10:00 AM – 4:00 PM</p>
              </div>
              <button className="btn btn-accent rounded-xl mt-4 gap-2 w-full">
                <Calendar size={16} aria-hidden="true" /> Book Meeting with TPO
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PlacementsPage;
