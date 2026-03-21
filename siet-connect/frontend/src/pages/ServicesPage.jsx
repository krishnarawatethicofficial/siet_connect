import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText, Bus, Search as SearchIcon, IdCard,
  Utensils, Wifi, HelpCircle, AlertCircle, Clock, CheckCircle,
  XCircle, Send, MapPin, Phone, Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import Spinner from "../components/Spinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

const tabs = ["Documents", "Hostel & Mess", "Bus Routes", "Lost & Found", "Scholarships", "ID Card", "Freshman FAQ"];
const tabEmojis = { "Documents": "📄", "Hostel & Mess": "🏠", "Bus Routes": "🚌", "Lost & Found": "🔍", "Scholarships": "🎓", "ID Card": "🪪", "Freshman FAQ": "❓" };
const tabSlugs = { "documents": "Documents", "hostel-mess": "Hostel & Mess", "bus-routes": "Bus Routes", "lost-found": "Lost & Found", "scholarships": "Scholarships", "id-card": "ID Card", "freshman-faq": "Freshman FAQ" };
const toSlug = (t) => t.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

const docTypes = [
  { value: "bonafide", label: "Bonafide Certificate" },
  { value: "transcript", label: "Official Transcript" },
  { value: "fee-receipt", label: "Fee Receipt" },
  { value: "character-cert", label: "Character Certificate" },
  { value: "id-card", label: "ID Card Replacement" },
  { value: "migration", label: "Migration Certificate" },
  { value: "other", label: "Other" },
];

const messMenu = [
  { day: "Monday", breakfast: "🥣 Poha + Tea", lunch: "🍛 Dal, Rice, Roti, Sabzi", dinner: "🧀 Paneer, Roti, Rice, Dal" },
  { day: "Tuesday", breakfast: "🫓 Parantha + Curd", lunch: "🫘 Rajma, Rice, Roti, Salad", dinner: "🥘 Mix Veg, Roti, Rice, Dal" },
  { day: "Wednesday", breakfast: "🍘 Idli Sambhar", lunch: "🍛 Chole, Rice, Roti, Raita", dinner: "🍲 Dal Makhani, Roti, Rice" },
  { day: "Thursday", breakfast: "🍳 Bread Omelette / Poha", lunch: "🥘 Kadhi Pakora, Rice, Roti", dinner: "🥔 Aloo Gobi, Roti, Rice, Dal" },
  { day: "Friday", breakfast: "🫓 Aloo Parantha + Pickle", lunch: "🍛 Dal, Rice, Roti, Bhindi", dinner: "🧀 Shahi Paneer, Roti, Rice" },
  { day: "Saturday", breakfast: "🍛 Chole Bhature", lunch: "🍚 Biryani, Raita, Salad", dinner: "🍲 Dal, Roti, Rice, Sabzi" },
  { day: "Sunday", breakfast: "🥘 Puri Sabzi + Halwa", lunch: "🍽️ Special Thali", dinner: "🥣 Light — Khichdi + Papad" },
];

const busRoutes = [
  { route: "Route 1", from: "Sector 17, Chandigarh", via: "Sec 26, Sec 21", time: "8:00 AM / 4:30 PM", driver: "Ramesh — 98765XXXXX" },
  { route: "Route 2", from: "Pinjore", via: "Kalka, Panchkula", time: "7:45 AM / 4:30 PM", driver: "Suresh — 98765XXXXX" },
  { route: "Route 3", from: "Ambala", via: "Barwala, Raipur Rani", time: "7:30 AM / 4:30 PM", driver: "Mohan — 98765XXXXX" },
  { route: "Route 4", from: "Zirakpur", via: "Dhakoli, Sec 20 Panchkula", time: "8:15 AM / 4:30 PM", driver: "Vijay — 98765XXXXX" },
];

const scholarships = [
  { name: "🏛️ Post Matric Scholarship (SC/BC)", org: "Haryana Govt", amount: "Full tuition", deadline: "Oct 31, 2026" },
  { name: "🏅 Merit-cum-Means Scholarship", org: "AICTE", amount: "₹50,000/year", deadline: "Dec 15, 2026" },
  { name: "👩‍🎓 Pragati Scholarship (Girls)", org: "AICTE", amount: "₹50,000/year", deadline: "Nov 30, 2026" },
  { name: "🇮🇳 National Scholarship Portal (NSP)", org: "Central Govt", amount: "Varies", deadline: "Jan 31, 2027" },
  { name: "💡 Inspire Scholarship", org: "DST", amount: "₹80,000/year", deadline: "Sep 30, 2026" },
];

const faqs = [
  { q: "📑 What documents do I need for admission?", a: "10th & 12th marksheets, JEE scorecard, category certificate, Aadhaar, passport photos, and admission fee receipt." },
  { q: "📶 How do I get campus Wi-Fi?", a: "Visit the IT office (Room 110) with your student ID to register your device's MAC address." },
  { q: "🏠 Where is the hostel?", a: "Boys hostel is on the GPP campus (shared). Girls hostel is in Sector 26 nearby. Contact warden for allocation." },
  { q: "📊 What is the attendance policy?", a: "Minimum 75% attendance is mandatory. Below this, you may be detained from exams." },
  { q: "🤝 How do I join a club?", a: "Go to Campus Life > Clubs section and click 'Join Club' or visit the club coordinator during activity hours." },
  { q: "🅿️ Where can I park?", a: "Two-wheeler parking at Gate 1, four-wheeler at Gate 2. Display your parking sticker." },
];

const ServicesPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(() => {
    if (tab && tabSlugs[tab]) return tabSlugs[tab];
    return "Documents";
  });

  useEffect(() => {
    if (tab && tabSlugs[tab]) {
      setActiveTab(tabSlugs[tab]);
    } else if (!tab) {
      navigate(`/services/${toSlug("Documents")}`, { replace: true });
    }
  }, [tab, navigate]);
  const switchTab = (t) => { setActiveTab(t); navigate(`/services/${toSlug(t)}`, { replace: true }); };
  const [myDocs, setMyDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docForm, setDocForm] = useState({ docType: "bonafide", reason: "", priority: "normal" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch my document requests
  useEffect(() => {
    if (activeTab !== "Documents") return;
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/documents/mine");
        setMyDocs(data.data);
      } catch {} finally { setLoading(false); }
    };
    fetchDocs();
  }, [activeTab]);

  // Submit document request
  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docForm.reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/documents", docForm);
      setMyDocs((prev) => [data.data, ...prev]);
      setDocForm({ docType: "bonafide", reason: "", priority: "normal" });
      toast.success("Document request submitted!");
    } catch {} finally { setSubmitting(false); }
  };

  const statusIcon = (status) => {
    if (status === "ready" || status === "collected") return <CheckCircle size={16} className="text-success" />;
    if (status === "rejected") return <XCircle size={16} className="text-error" />;
    if (status === "processing") return <Clock size={16} className="text-warning" />;
    return <Clock size={16} className="text-base-content/50" />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">🛎️ Services & Admin</h1>
      <p className="text-base-content/60 text-sm mb-6">📋 Document requests, hostel, transport, scholarships, and more</p>

      <div className="tabs tabs-boxed bg-base-200 rounded-2xl p-1 mb-6 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => switchTab(tab)} className={`tab tab-sm sm:tab-md transition-all duration-200 ${activeTab === tab ? "tab-active !bg-accent !text-white rounded-xl" : ""}`} role="tab" aria-selected={activeTab === tab}>
            {tabEmojis[tab]} {tab}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === "Documents" && (
        <section aria-label="Document request portal">
          {/* Request Form */}
          <div className="card bg-base-200 rounded-2xl shadow mb-6">
            <div className="card-body">
              <h2 className="font-semibold flex items-center gap-2"><FileText size={18} className="text-accent" /> New Request</h2>
              <form onSubmit={handleDocSubmit} className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-control">
                    <label htmlFor="docType" className="label"><span className="label-text font-medium">Document Type</span></label>
                    <select id="docType" className="select select-bordered rounded-xl w-full" value={docForm.docType} onChange={(e) => setDocForm({ ...docForm, docType: e.target.value })}>
                      {docTypes.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div className="form-control">
                    <label htmlFor="priority" className="label"><span className="label-text font-medium">Priority</span></label>
                    <select id="priority" className="select select-bordered rounded-xl w-full" value={docForm.priority} onChange={(e) => setDocForm({ ...docForm, priority: e.target.value })}>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="form-control">
                  <label htmlFor="reason" className="label"><span className="label-text font-medium">Reason / Purpose</span></label>
                  <textarea id="reason" className="textarea textarea-bordered rounded-xl" rows="2" placeholder="Why do you need this document?" value={docForm.reason} onChange={(e) => setDocForm({ ...docForm, reason: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-accent rounded-xl gap-2" disabled={submitting}>
                  {submitting ? <span className="loading loading-spinner loading-sm" /> : <Send size={16} aria-hidden="true" />}
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* My Requests */}
          <h2 className="font-semibold mb-3">My Requests</h2>
          {loading ? <Spinner /> : myDocs.length === 0 ? (
            <EmptyState title="No requests yet" description="Submit a document request above" icon={FileText} />
          ) : (
            <div className="space-y-3">
              {myDocs.map((d) => (
                <div key={d._id} className="card bg-base-200 rounded-2xl shadow">
                  <div className="card-body p-4 flex-row items-center gap-4">
                    {statusIcon(d.status)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{docTypes.find(dt => dt.value === d.docType)?.label || d.docType}</p>
                      <p className="text-xs text-base-content/50">{d.reason}</p>
                      {d.remarks && <p className="text-xs text-warning mt-1">Admin: {d.remarks}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`badge badge-sm ${d.status === "ready" ? "badge-success" : d.status === "rejected" ? "badge-error" : d.status === "processing" ? "badge-warning" : "badge-ghost"}`}>{d.status}</span>
                      <p className="text-xs text-base-content/40 mt-1">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Hostel & Mess Tab */}
      {activeTab === "Hostel & Mess" && (
        <section aria-label="Weekly mess menu">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Utensils size={18} className="text-accent" /> Weekly Mess Menu</h3>
              <div className="overflow-x-auto">
                <table className="table table-sm" role="table">
                  <thead>
                    <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr>
                  </thead>
                  <tbody>
                    {messMenu.map((m, i) => (
                      <tr key={i}><td className="font-medium text-accent">{m.day}</td><td>{m.breakfast}</td><td>{m.lunch}</td><td>{m.dinner}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bus Routes Tab */}
      {activeTab === "Bus Routes" && (
        <section aria-label="Bus routes and timings">
          <div className="space-y-4">
            {busRoutes.map((b, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-accent">{b.route}</h3>
                    <span className="badge badge-ghost">{b.time}</span>
                  </div>
                  <div className="text-sm mt-2 space-y-1">
                    <p className="flex items-center gap-2"><MapPin size={12} /> From: {b.from}</p>
                    <p className="flex items-center gap-2"><Bus size={12} /> Via: {b.via}</p>
                    <p className="flex items-center gap-2"><Phone size={12} /> Driver: {b.driver}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lost & Found Tab */}
      {activeTab === "Lost & Found" && (
        <section aria-label="Lost and found board">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body text-center">
              <SearchIcon size={48} className="text-accent mx-auto mb-4 opacity-50" aria-hidden="true" />
              <h3 className="font-bold text-lg">Lost & Found Board</h3>
              <p className="text-sm text-base-content/60 mb-4">Report or search for lost items on campus</p>
              <div className="flex gap-3 justify-center">
                <button className="btn btn-accent rounded-xl">Report Lost Item</button>
                <button className="btn btn-outline rounded-xl">Report Found Item</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Scholarships Tab */}
      {activeTab === "Scholarships" && (
        <section aria-label="Scholarship hub">
          <div className="space-y-4">
            {scholarships.map((s, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4 flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-sm text-base-content/60">{s.org} · {s.amount}</p>
                    <p className="text-xs text-base-content/40 flex items-center gap-1 mt-1"><Calendar size={12} /> Deadline: {s.deadline}</p>
                  </div>
                  <button className="btn btn-accent btn-sm rounded-xl">Apply</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ID Card Tab */}
      {activeTab === "ID Card" && (
        <section aria-label="ID card services">
          <div className="card bg-base-200 rounded-2xl shadow max-w-lg">
            <div className="card-body">
              <h3 className="font-semibold flex items-center gap-2"><IdCard size={18} className="text-accent" /> ID Card Services</h3>
              <p className="text-sm text-base-content/60 mt-2">Lost your student ID? Request a replacement below. Submit the document request form with type "ID Card Replacement".</p>
              <button onClick={() => { switchTab("Documents"); setDocForm({ docType: "id-card", reason: "", priority: "normal" }); }} className="btn btn-accent rounded-xl mt-4 gap-2">
                <FileText size={16} aria-hidden="true" /> Request Replacement
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Freshman FAQ Tab */}
      {activeTab === "Freshman FAQ" && (
        <section aria-label="Frequently asked questions for freshmen">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="collapse collapse-arrow bg-base-200 rounded-2xl shadow">
                <input type="radio" name="faq-accordion" defaultChecked={i === 0} />
                <div className="collapse-title font-semibold flex items-center gap-2">
                  <HelpCircle size={16} className="text-accent" aria-hidden="true" />
                  {f.q}
                </div>
                <div className="collapse-content">
                  <p className="text-sm text-base-content/70">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ServicesPage;
