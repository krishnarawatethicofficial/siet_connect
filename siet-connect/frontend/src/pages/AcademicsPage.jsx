import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search, BookOpen, FileDown, Calendar,
  Download, FileText, ExternalLink,
} from "lucide-react";
import api from "../lib/axios.js";
import useAuthStore from "../store/authStore.js";
import useDebounce from "../hooks/useDebounce.js";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

const tabs = ["PYQs", "Syllabus", "Faculty", "Lab Manuals", "Calendar"];
const tabSlugs = { "pyqs": "PYQs", "syllabus": "Syllabus", "faculty": "Faculty", "lab-manuals": "Lab Manuals", "calendar": "Calendar" };
const toSlug = (t) => t.toLowerCase().replace(/ /g, "-");

// Branch images for headers
const branchImages = {
  "CSE-AIML": "/images/AI-ML-300x200.jpg.jpeg",
  "CSE-CS": "/images/Cyber-Security-300x200.jpg.jpeg",
  "RAE": "/images/Robotics-Automation-300x200.jpg.jpeg",
};

// Syllabus data
const syllabusData = [
  { branch: "CSE-AIML", semester: 3, subjects: ["Data Structures", "DBMS", "Discrete Math", "OOP with Java", "Digital Electronics"] },
  { branch: "CSE-AIML", semester: 4, subjects: ["Algorithm Design", "Machine Learning Basics", "Computer Networks", "OS", "Probability & Stats"] },
  { branch: "CSE-CS", semester: 3, subjects: ["Data Structures", "DBMS", "Discrete Math", "Network Security Intro", "Digital Electronics"] },
  { branch: "CSE-CS", semester: 4, subjects: ["Cryptography", "Ethical Hacking", "Computer Networks", "OS", "Cyber Forensics Intro"] },
  { branch: "RAE", semester: 3, subjects: ["Mechanics of Materials", "Circuit Theory", "Control Systems", "C Programming", "Workshop Tech"] },
  { branch: "RAE", semester: 4, subjects: ["Robotics Fundamentals", "Microcontrollers", "Sensors & Actuators", "Industrial Automation", "CAD/CAM"] },
];

// Faculty mock
const facultyData = [
  { name: "Dr. Rajesh Kumar", dept: "CSE-AIML", subjects: ["Machine Learning", "AI"], office: "Room 301, Mon-Fri 2-4 PM", research: "Deep Learning, NLP" },
  { name: "Prof. Sunita Sharma", dept: "CSE-CS", subjects: ["Cryptography", "Network Security"], office: "Room 205, Tue-Thu 3-5 PM", research: "Blockchain Security" },
  { name: "Dr. Amit Singh", dept: "RAE", subjects: ["Robotics", "Control Systems"], office: "Lab 2, Wed-Fri 1-3 PM", research: "Autonomous Navigation" },
  { name: "Prof. Neha Gupta", dept: "CSE-AIML", subjects: ["Data Structures", "DBMS"], office: "Room 102, Mon-Wed 10-12 AM", research: "Graph Databases" },
  { name: "Dr. Vikram Patel", dept: "CSE-CS", subjects: ["Ethical Hacking", "Cyber Forensics"], office: "Room 308, Mon-Fri 11-1 PM", research: "Malware Analysis" },
  { name: "Prof. Meena Devi", dept: "RAE", subjects: ["Sensors", "Microcontrollers"], office: "Lab 5, Tue-Thu 2-4 PM", research: "IoT Systems" },
];

const AcademicsPage = () => {
  const { user } = useAuthStore();
  const { tab } = useParams();
  const navigate = useNavigate();
  
  // Initialize activeTab from URL param or default to first tab
  const [activeTab, setActiveTab] = useState(() => {
    if (tab && tabSlugs[tab]) return tabSlugs[tab];
    return "PYQs";
  });

  useEffect(() => {
    if (tab && tabSlugs[tab]) {
      setActiveTab(tabSlugs[tab]);
    } else if (tab) {
      navigate("/academics/pyqs", { replace: true });
    }
  }, [tab, navigate]);

  const switchTab = (t) => {
    setActiveTab(t);
    navigate(`/academics/${toSlug(t)}`, { replace: true });
  };
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState(user?.branch || "all");
  const [filterSemester, setFilterSemester] = useState("");
  const debouncedSearch = useDebounce(search);

  // Fetch PYQs
  useEffect(() => {
    if (activeTab !== "PYQs") return;
    const fetchPYQs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterBranch !== "all") params.set("branch", filterBranch);
        if (filterSemester) params.set("semester", filterSemester);
        if (debouncedSearch) params.set("search", debouncedSearch);
        const { data } = await api.get(`/pyqs?${params}`);
        setPyqs(data.data);
      } catch {
        // handled
      } finally {
        setLoading(false);
      }
    };
    fetchPYQs();
  }, [activeTab, filterBranch, filterSemester, debouncedSearch]);

  // Track PYQ download
  const handleDownload = async (pyq) => {
    try {
      await api.put(`/pyqs/${pyq._id}/download`);
      window.open(pyq.fileUrl, "_blank");
    } catch {
      // handled
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Academics</h1>
      <p className="text-base-content/60 text-xs sm:text-sm mb-4 sm:mb-6">Syllabus, PYQs, faculty profiles, and resources</p>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 rounded-2xl p-1 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`tab tab-sm sm:tab-md transition-all duration-200 ${activeTab === tab ? "tab-active !bg-accent !text-white rounded-xl" : ""}`}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PYQs Tab */}
      {activeTab === "PYQs" && (
        <section aria-label="Previous Year Questions">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" aria-hidden="true" />
              <input
                type="search"
                className="input input-bordered w-full pl-10 rounded-xl"
                placeholder="Search subject or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search PYQs"
              />
            </div>
            <select className="select select-bordered rounded-xl" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} aria-label="Filter by branch">
              <option value="all">All Branches</option>
              <option value="CSE-AIML">CSE (AI & ML)</option>
              <option value="CSE-CS">CSE (Cyber Sec)</option>
              <option value="RAE">Robotics & Auto</option>
              <option value="common">Common</option>
            </select>
            <select className="select select-bordered rounded-xl" value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} aria-label="Filter by semester">
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>

          {loading ? <Spinner /> : pyqs.length === 0 ? (
            <EmptyState title="No PYQs found" description="Try adjusting your filters or check back later" icon={FileDown} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pyqs.map((pyq) => (
                <div key={pyq._id} className="card bg-base-200 rounded-2xl shadow">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pyq.subject}</h3>
                        <p className="text-xs text-base-content/50">{pyq.subjectCode} · {pyq.branch} · Sem {pyq.semester}</p>
                      </div>
                      <span className="badge badge-accent badge-sm">{pyq.year}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <span className="badge badge-ghost badge-xs">{pyq.examType}</span>
                        <span>{pyq.fileType} {pyq.fileSize && `· ${pyq.fileSize}`}</span>
                        <span>{pyq.downloads || 0} downloads</span>
                      </div>
                      <button onClick={() => handleDownload(pyq)} className="btn btn-accent btn-sm rounded-xl gap-1" aria-label={`Download ${pyq.subject} ${pyq.year} ${pyq.examType} (${pyq.fileType}${pyq.fileSize ? `, ${pyq.fileSize}` : ""})`}>
                        <Download size={14} aria-hidden="true" /> Get
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Syllabus Tab */}
      {activeTab === "Syllabus" && (
        <section aria-label="Syllabus">
          <div className="space-y-4">
            {syllabusData
              .filter((s) => filterBranch === "all" || s.branch === filterBranch)
              .map((s, i) => (
                <div key={i} className="card bg-base-200 rounded-2xl shadow overflow-hidden">
                  {branchImages[s.branch] && (
                    <figure className="h-28">
                      <img src={branchImages[s.branch]} alt={`${s.branch} department`} className="w-full h-full object-cover" />
                    </figure>
                  )}
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{s.branch} — Semester {s.semester}</h3>
                      <span className="badge badge-ghost">{s.subjects.length} subjects</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {s.subjects.map((sub, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <BookOpen size={12} className="text-accent" aria-hidden="true" /> {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Faculty Tab */}
      {activeTab === "Faculty" && (
        <section aria-label="Faculty profiles">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facultyData.map((f, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{f.name}</h3>
                      <p className="text-xs text-base-content/50">{f.dept}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><strong>Subjects:</strong> {f.subjects.join(", ")}</p>
                    <p><strong>Office Hours:</strong> {f.office}</p>
                    <p><strong>Research:</strong> {f.research}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lab Manuals Tab */}
      {activeTab === "Lab Manuals" && (
        <section aria-label="Lab manuals">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Data Structures Lab", branch: "CSE-AIML", sem: 3, size: "2.4 MB" },
              { name: "DBMS Lab", branch: "CSE-AIML", sem: 3, size: "1.8 MB" },
              { name: "Network Security Lab", branch: "CSE-CS", sem: 4, size: "3.1 MB" },
              { name: "Robotics Lab", branch: "RAE", sem: 4, size: "4.2 MB" },
              { name: "Machine Learning Lab", branch: "CSE-AIML", sem: 4, size: "2.9 MB" },
              { name: "Microcontrollers Lab", branch: "RAE", sem: 4, size: "1.6 MB" },
            ].map((m, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4 flex-row items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{m.name}</h3>
                    <p className="text-xs text-base-content/50">{m.branch} · Sem {m.sem} · PDF · {m.size}</p>
                  </div>
                  <button className="btn btn-accent btn-sm rounded-xl gap-1" aria-label={`Download ${m.name} (PDF, ${m.size})`}>
                    <Download size={14} aria-hidden="true" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Calendar Tab */}
      {activeTab === "Calendar" && (
        <section aria-label="Academic calendar">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Calendar size={18} aria-hidden="true" /> Academic Calendar 2025–26
              </h3>
              <div className="space-y-3">
                {[
                  { date: "Jul 15, 2025", event: "Odd Semester Begins", type: "academic" },
                  { date: "Aug 15, 2025", event: "Independence Day — Holiday", type: "holiday" },
                  { date: "Sep 20, 2025", event: "Mid-Semester Exams", type: "exam" },
                  { date: "Oct 12, 2025", event: "Dussehra Break", type: "holiday" },
                  { date: "Nov 1, 2025", event: "Tech Fest — SIET Innovate", type: "event" },
                  { date: "Dec 1, 2025", event: "End-Semester Exams Begin", type: "exam" },
                  { date: "Jan 5, 2026", event: "Even Semester Begins", type: "academic" },
                  { date: "Mar 20, 2026", event: "Holi Break", type: "holiday" },
                  { date: "Apr 15, 2026", event: "Mid-Semester Exams", type: "exam" },
                  { date: "Jun 1, 2026", event: "End-Semester Exams Begin", type: "exam" },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-4 bg-base-300/50 rounded-xl p-3">
                    <span className="text-sm font-mono text-accent min-w-[100px]">{e.date}</span>
                    <span className="flex-1 text-sm font-medium">{e.event}</span>
                    <span className={`badge badge-sm ${
                      e.type === "exam" ? "badge-error" :
                      e.type === "holiday" ? "badge-warning" :
                      e.type === "event" ? "badge-accent" : "badge-ghost"
                    }`}>{e.type}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-accent btn-sm rounded-xl mt-4 gap-1" aria-label="Add academic calendar to Google Calendar">
                <ExternalLink size={14} aria-hidden="true" /> Add to Google Calendar
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AcademicsPage;
