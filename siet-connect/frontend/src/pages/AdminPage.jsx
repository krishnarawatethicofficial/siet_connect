import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart3, Users, Bell, FileText, Briefcase, BookOpen,
  Search, Shield, Plus, Send,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const tabs = ["Overview", "Notices", "Placements", "Documents", "Users", "PYQs"];
const tabSlugs = { "overview": "Overview", "notices": "Notices", "placements": "Placements", "documents": "Documents", "users": "Users", "pyqs": "PYQs" };
const toSlug = (t) => t.toLowerCase();

const AdminPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(() => {
    if (tab && tabSlugs[tab]) return tabSlugs[tab];
    return "Overview";
  });

  useEffect(() => {
    if (tab && tabSlugs[tab]) {
      setActiveTab(tabSlugs[tab]);
    } else if (tab) {
      navigate("/admin/overview", { replace: true });
    }
  }, [tab, navigate]);
  const switchTab = (t) => { setActiveTab(t); navigate(`/admin/${toSlug(t)}`, { replace: true }); };
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");

  // Notice form state
  const [noticeForm, setNoticeForm] = useState({
    title: "", content: "", category: "general", targetBranch: "all", isPinned: false,
  });

  // Placement form state
  const [placementForm, setPlacementForm] = useState({
    company: "", role: "", type: "internship", stipend: "", package: "",
    deadline: "", description: "", skills: "", eligibleBranches: "all", location: "",
  });

  // PYQ form state
  const [pyqForm, setPyqForm] = useState({
    subject: "", subjectCode: "", branch: "CSE-AIML", semester: 1,
    year: 2025, examType: "end-sem", fileUrl: "", fileSize: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: "", id: "" });

  // Fetch admin stats
  useEffect(() => {
    if (activeTab !== "Overview") return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchStats();
  }, [activeTab]);

  // Fetch users
  useEffect(() => {
    if (activeTab !== "Users") return;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = searchUsers ? `?search=${searchUsers}` : "";
        const { data } = await api.get(`/admin/users${params}`);
        setUsers(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchUsers();
  }, [activeTab, searchUsers]);

  // Fetch documents
  useEffect(() => {
    if (activeTab !== "Documents") return;
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/documents/all");
        setDocuments(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchDocs();
  }, [activeTab]);

  // Create notice
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) { toast.error("Title and content required"); return; }
    setSubmitting(true);
    try {
      await api.post("/notices", noticeForm);
      toast.success("Notice posted!");
      setNoticeForm({ title: "", content: "", category: "general", targetBranch: "all", isPinned: false });
    } catch {} finally { setSubmitting(false); }
  };

  // Create placement
  const handleCreatePlacement = async (e) => {
    e.preventDefault();
    if (!placementForm.company || !placementForm.role || !placementForm.deadline || !placementForm.description) {
      toast.error("Fill all required fields"); return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...placementForm,
        skills: placementForm.skills.split(",").map(s => s.trim()).filter(Boolean),
        eligibleBranches: [placementForm.eligibleBranches],
      };
      await api.post("/placements", payload);
      toast.success("Placement posted!");
      setPlacementForm({ company: "", role: "", type: "internship", stipend: "", package: "", deadline: "", description: "", skills: "", eligibleBranches: "all", location: "" });
    } catch {} finally { setSubmitting(false); }
  };

  // Create PYQ
  const handleCreatePYQ = async (e) => {
    e.preventDefault();
    if (!pyqForm.subject || !pyqForm.subjectCode || !pyqForm.fileUrl) {
      toast.error("Fill all required fields"); return;
    }
    setSubmitting(true);
    try {
      await api.post("/pyqs", pyqForm);
      toast.success("PYQ uploaded!");
      setPyqForm({ subject: "", subjectCode: "", branch: "CSE-AIML", semester: 1, year: 2025, examType: "end-sem", fileUrl: "", fileSize: "" });
    } catch {} finally { setSubmitting(false); }
  };

  // Update document status
  const handleUpdateDoc = async (docId, status) => {
    try {
      const { data } = await api.put(`/documents/${docId}/status`, { status, remarks: `Status updated to ${status}` });
      setDocuments(prev => prev.map(d => d._id === docId ? data.data : d));
      toast.success(`Document marked as ${status}`);
    } catch {}
  };

  // Update user role
  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
      toast.success("Role updated");
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
        <Shield size={22} className="text-accent" aria-hidden="true" /> Admin Panel
      </h1>
      <p className="text-base-content/60 text-xs sm:text-sm mb-4 sm:mb-6">Manage notices, placements, documents, users, and PYQs</p>

      <div className="tabs tabs-boxed bg-base-200 rounded-2xl p-1 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap" role="tablist">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => switchTab(tab)} className={`tab tab-sm sm:tab-md transition-all duration-200 ${activeTab === tab ? "tab-active !bg-accent !text-white rounded-xl" : ""}`} role="tab" aria-selected={activeTab === tab}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <section aria-label="Admin dashboard overview">
          {loading ? <Spinner /> : !stats ? <EmptyState /> : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Users", val: stats.totalUsers, icon: Users, color: "text-accent" },
                { label: "Notices", val: stats.totalNotices, icon: Bell, color: "text-success" },
                { label: "Placements", val: stats.totalPlacements, icon: Briefcase, color: "text-warning" },
                { label: "PYQs", val: stats.totalPYQs, icon: BookOpen, color: "text-info" },
                { label: "Doc Requests", val: stats.totalDocuments, icon: FileText, color: "text-accent" },
                { label: "Pending Docs", val: stats.pendingDocuments, icon: FileText, color: "text-error" },
                { label: "Open Placements", val: stats.openPlacements, icon: Briefcase, color: "text-success" },
                { label: "Stats", val: "Live", icon: BarChart3, color: "text-accent" },
              ].map((s, i) => (
                <div key={i} className="card bg-base-200 rounded-2xl shadow text-center">
                  <div className="card-body p-4">
                    <s.icon size={20} className={`${s.color} mx-auto`} aria-hidden="true" />
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
                    <p className="text-xs text-base-content/60">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Notices - Create */}
      {activeTab === "Notices" && (
        <section aria-label="Post new notice">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h2 className="font-semibold flex items-center gap-2"><Bell size={18} className="text-accent" /> Post Notice</h2>
              <form onSubmit={handleCreateNotice} className="mt-3 space-y-3">
                <input type="text" className="input input-bordered w-full rounded-xl" placeholder="Notice title" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
                <textarea className="textarea textarea-bordered w-full rounded-xl" rows="3" placeholder="Notice content" value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} required />
                <div className="flex flex-wrap gap-3">
                  <select className="select select-bordered select-sm rounded-xl" value={noticeForm.category} onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}>
                    {["general", "academic", "placement", "event", "exam", "urgent"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="select select-bordered select-sm rounded-xl" value={noticeForm.targetBranch} onChange={(e) => setNoticeForm({ ...noticeForm, targetBranch: e.target.value })}>
                    <option value="all">All Branches</option>
                    <option value="CSE-AIML">CSE-AIML</option>
                    <option value="CSE-CS">CSE-CS</option>
                    <option value="RAE">RAE</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="checkbox checkbox-accent checkbox-sm" checked={noticeForm.isPinned} onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })} />
                    <span className="text-sm">Pin to top</span>
                  </label>
                </div>
                <button type="submit" className="btn btn-accent rounded-xl gap-2" disabled={submitting}>
                  {submitting ? <span className="loading loading-spinner loading-sm" /> : <Send size={16} />} Post Notice
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Placements - Create */}
      {activeTab === "Placements" && (
        <section aria-label="Post new placement">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h2 className="font-semibold flex items-center gap-2"><Briefcase size={18} className="text-accent" /> Post Opportunity</h2>
              <form onSubmit={handleCreatePlacement} className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" className="input input-bordered rounded-xl" placeholder="Company name" value={placementForm.company} onChange={(e) => setPlacementForm({ ...placementForm, company: e.target.value })} required />
                  <input type="text" className="input input-bordered rounded-xl" placeholder="Role" value={placementForm.role} onChange={(e) => setPlacementForm({ ...placementForm, role: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select className="select select-bordered rounded-xl" value={placementForm.type} onChange={(e) => setPlacementForm({ ...placementForm, type: e.target.value })}>
                    <option value="internship">Internship</option>
                    <option value="fulltime">Full-Time</option>
                    <option value="offcampus">Off-Campus</option>
                  </select>
                  <input type="text" className="input input-bordered rounded-xl" placeholder="Stipend/Package" value={placementForm.stipend} onChange={(e) => setPlacementForm({ ...placementForm, stipend: e.target.value })} />
                  <input type="date" className="input input-bordered rounded-xl" value={placementForm.deadline} onChange={(e) => setPlacementForm({ ...placementForm, deadline: e.target.value })} required />
                </div>
                <textarea className="textarea textarea-bordered w-full rounded-xl" rows="2" placeholder="Description" value={placementForm.description} onChange={(e) => setPlacementForm({ ...placementForm, description: e.target.value })} required />
                <input type="text" className="input input-bordered w-full rounded-xl" placeholder="Skills (comma separated)" value={placementForm.skills} onChange={(e) => setPlacementForm({ ...placementForm, skills: e.target.value })} />
                <input type="text" className="input input-bordered w-full rounded-xl" placeholder="Location" value={placementForm.location} onChange={(e) => setPlacementForm({ ...placementForm, location: e.target.value })} />
                <button type="submit" className="btn btn-accent rounded-xl gap-2" disabled={submitting}>
                  {submitting ? <span className="loading loading-spinner loading-sm" /> : <Plus size={16} />} Post Opportunity
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Documents - Manage */}
      {activeTab === "Documents" && (
        <section aria-label="Manage document requests">
          {loading ? <Spinner /> : documents.length === 0 ? (
            <EmptyState title="No document requests" icon={FileText} />
          ) : (
            <div className="space-y-3">
              {documents.map((d) => (
                <div key={d._id} className="card bg-base-200 rounded-2xl shadow">
                  <div className="card-body p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{d.requestedBy?.name} ({d.requestedBy?.studentId})</p>
                        <p className="text-sm text-accent">{d.docType} · {d.priority}</p>
                        <p className="text-xs text-base-content/60">{d.reason}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`badge badge-sm ${d.status === "pending" ? "badge-warning" : d.status === "ready" ? "badge-success" : d.status === "rejected" ? "badge-error" : "badge-ghost"}`}>{d.status}</span>
                        {d.status === "pending" && (
                          <>
                            <button onClick={() => handleUpdateDoc(d._id, "processing")} className="btn btn-xs btn-warning rounded-lg">Process</button>
                            <button onClick={() => handleUpdateDoc(d._id, "ready")} className="btn btn-xs btn-success rounded-lg">Ready</button>
                            <button onClick={() => handleUpdateDoc(d._id, "rejected")} className="btn btn-xs btn-error rounded-lg">Reject</button>
                          </>
                        )}
                        {d.status === "processing" && (
                          <button onClick={() => handleUpdateDoc(d._id, "ready")} className="btn btn-xs btn-success rounded-lg">Mark Ready</button>
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

      {/* Users - Manage */}
      {activeTab === "Users" && (
        <section aria-label="Manage users">
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input type="search" className="input input-bordered w-full pl-10 rounded-xl" placeholder="Search users..." value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)} aria-label="Search users" />
            </div>
          </div>
          {loading ? <Spinner /> : users.length === 0 ? (
            <EmptyState title="No users found" icon={Users} />
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm bg-base-200 rounded-2xl" role="table">
                <thead><tr><th>Name</th><th>ID</th><th>Branch</th><th>Sem</th><th>Attendance</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="font-medium">{u.name}</td>
                      <td className="text-xs">{u.studentId}</td>
                      <td>{u.branch}</td>
                      <td>{u.semester}</td>
                      <td className={u.attendance < 75 ? "text-error font-bold" : "text-success"}>{u.attendance}%</td>
                      <td>
                        <select className="select select-bordered select-xs rounded-lg" value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} aria-label={`Role for ${u.name}`}>
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* PYQs - Upload */}
      {activeTab === "PYQs" && (
        <section aria-label="Upload PYQ">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h2 className="font-semibold flex items-center gap-2"><BookOpen size={18} className="text-accent" /> Upload PYQ</h2>
              <form onSubmit={handleCreatePYQ} className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" className="input input-bordered rounded-xl" placeholder="Subject name" value={pyqForm.subject} onChange={(e) => setPyqForm({ ...pyqForm, subject: e.target.value })} required />
                  <input type="text" className="input input-bordered rounded-xl" placeholder="Subject code (e.g. CS301)" value={pyqForm.subjectCode} onChange={(e) => setPyqForm({ ...pyqForm, subjectCode: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <select className="select select-bordered rounded-xl" value={pyqForm.branch} onChange={(e) => setPyqForm({ ...pyqForm, branch: e.target.value })}>
                    <option value="CSE-AIML">CSE-AIML</option>
                    <option value="CSE-CS">CSE-CS</option>
                    <option value="RAE">RAE</option>
                    <option value="common">Common</option>
                  </select>
                  <select className="select select-bordered rounded-xl" value={pyqForm.semester} onChange={(e) => setPyqForm({ ...pyqForm, semester: Number(e.target.value) })}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                  <input type="number" className="input input-bordered rounded-xl" placeholder="Year" value={pyqForm.year} onChange={(e) => setPyqForm({ ...pyqForm, year: Number(e.target.value) })} required />
                  <select className="select select-bordered rounded-xl" value={pyqForm.examType} onChange={(e) => setPyqForm({ ...pyqForm, examType: e.target.value })}>
                    <option value="mid-sem">Mid-Sem</option>
                    <option value="end-sem">End-Sem</option>
                    <option value="supplementary">Supplementary</option>
                  </select>
                </div>
                <input type="url" className="input input-bordered w-full rounded-xl" placeholder="File URL (Google Drive / server link)" value={pyqForm.fileUrl} onChange={(e) => setPyqForm({ ...pyqForm, fileUrl: e.target.value })} required />
                <input type="text" className="input input-bordered w-full rounded-xl" placeholder="File size (e.g. 245 KB)" value={pyqForm.fileSize} onChange={(e) => setPyqForm({ ...pyqForm, fileSize: e.target.value })} />
                <button type="submit" className="btn btn-accent rounded-xl gap-2" disabled={submitting}>
                  {submitting ? <span className="loading loading-spinner loading-sm" /> : <Plus size={16} />} Upload PYQ
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      <ConfirmModal
        isOpen={confirmDelete.open}
        title="Confirm Delete"
        message="Are you sure? This action cannot be undone."
        onConfirm={() => setConfirmDelete({ open: false, type: "", id: "" })}
        onCancel={() => setConfirmDelete({ open: false, type: "", id: "" })}
      />
    </div>
  );
};

export default AdminPage;
