import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Users, Trophy, MapPin, Utensils,
  Clock, ArrowRight, Star, Dumbbell,
} from "lucide-react";

const tabs = ["Events", "Clubs", "Hackathons", "Gallery", "Sports", "Campus Map", "Canteen"];
const tabEmojis = { "Events": "🎉", "Clubs": "🤝", "Hackathons": "🏆", "Gallery": "📸", "Sports": "🏏", "Campus Map": "🗺️", "Canteen": "🍽️" };
const tabSlugs = { "events": "Events", "clubs": "Clubs", "hackathons": "Hackathons", "gallery": "Gallery", "sports": "Sports", "campus-map": "Campus Map", "canteen": "Canteen" };
const toSlug = (t) => t.toLowerCase().replace(/ /g, "-");

const eventsData = [
  { title: "🚀 SIET Innovate 2026 — Tech Fest", date: "Apr 5–6, 2026", type: "fest", desc: "Annual tech fest with coding contests, robotics challenge, and hackathon", rsvp: true },
  { title: "🤖 AI Workshop — Intro to LLMs", date: "Mar 25, 2026", type: "workshop", desc: "Hands-on workshop on building with large language models", rsvp: true },
  { title: "🔒 Cyber Security Seminar", date: "Mar 28, 2026", type: "seminar", desc: "Guest lecture by CERT-In expert on incident response", rsvp: true },
  { title: "🎭 Cultural Night", date: "Apr 12, 2026", type: "cultural", desc: "Annual cultural evening with music, dance, and drama performances", rsvp: false },
];

const clubsData = [
  { name: "💻 CodeCraft — Coding Club", members: 45, desc: "Weekly contests, DSA workshops, CP mentoring", category: "technical" },
  { name: "🛡️ CyberShield — Security Club", members: 30, desc: "CTFs, ethical hacking sessions, security awareness", category: "technical" },
  { name: "🤖 RoboSIET — Robotics Club", members: 25, desc: "Bot building, line follower, drone projects", category: "technical" },
  { name: "📖 Literary Society", members: 35, desc: "Debates, quizzes, creative writing, poetry slams", category: "cultural" },
  { name: "📷 Photography Club", members: 20, desc: "Campus photography, events coverage, exhibitions", category: "cultural" },
  { name: "⚽ Sports Committee", members: 40, desc: "Inter-college tournaments, fitness drives, sports day", category: "sports" },
];

const sportsSchedule = [
  { day: "Monday", activity: "🏏 Cricket Practice", time: "4:00 – 6:00 PM", venue: "Ground" },
  { day: "Tuesday", activity: "🏸 Badminton (Open)", time: "5:00 – 7:00 PM", venue: "Indoor Hall" },
  { day: "Wednesday", activity: "⚽ Football Practice", time: "4:00 – 6:00 PM", venue: "Ground" },
  { day: "Thursday", activity: "🏓 Table Tennis", time: "3:00 – 5:00 PM", venue: "Common Room" },
  { day: "Friday", activity: "🏀 Basketball (Open)", time: "4:30 – 6:30 PM", venue: "Court" },
  { day: "Saturday", activity: "🏃 Athletics Training", time: "6:00 – 8:00 AM", venue: "Track" },
];

const canteenMenu = [
  { item: "🍛 Chole Bhature", price: "₹50", category: "Main" },
  { item: "🍚 Rajma Chawal", price: "₹45", category: "Main" },
  { item: "🌯 Paneer Roll", price: "₹35", category: "Snack" },
  { item: "🔺 Samosa (2 pcs)", price: "₹20", category: "Snack" },
  { item: "☕ Masala Chai", price: "₹10", category: "Beverage" },
  { item: "🧊 Cold Coffee", price: "₹30", category: "Beverage" },
  { item: "🍜 Maggi", price: "₹30", category: "Snack" },
  { item: "🥘 Bread Pakora", price: "₹20", category: "Snack" },
];

const CampusPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(() => {
    if (tab && tabSlugs[tab]) return tabSlugs[tab];
    return "Events";
  });

  useEffect(() => {
    if (tab && tabSlugs[tab]) {
      setActiveTab(tabSlugs[tab]);
    } else if (!tab) {
      navigate(`/campus/${toSlug("Events")}`, { replace: true });
    }
  }, [tab, navigate]);
  const switchTab = (t) => { setActiveTab(t); navigate(`/campus/${toSlug(t)}`, { replace: true }); };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">🏫 Campus Life</h1>
      <p className="text-base-content/60 text-sm mb-6">🎉 Events, clubs, sports, and campus facilities</p>

      <div className="tabs tabs-boxed bg-base-200 rounded-2xl p-1 mb-6 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => switchTab(tab)} className={`tab tab-sm sm:tab-md transition-all duration-200 ${activeTab === tab ? "tab-active !bg-accent !text-white rounded-xl" : ""}`} role="tab" aria-selected={activeTab === tab}>
            {tabEmojis[tab]} {tab}
          </button>
        ))}
      </div>

      {/* Events */}
      {activeTab === "Events" && (
        <section aria-label="Events">
          <div className="space-y-4">
            {eventsData.map((e, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`badge badge-sm mb-1 ${e.type === "fest" ? "badge-accent" : e.type === "workshop" ? "badge-success" : e.type === "seminar" ? "badge-info" : "badge-warning"}`}>{e.type}</span>
                      <h3 className="font-bold">{e.title}</h3>
                      <p className="text-sm text-base-content/60 mt-1">{e.desc}</p>
                      <p className="text-xs text-base-content/50 mt-2 flex items-center gap-1"><Calendar size={12} /> {e.date}</p>
                    </div>
                    {e.rsvp && (
                      <button className="btn btn-accent btn-sm rounded-xl gap-1">
                        <ArrowRight size={14} aria-hidden="true" /> RSVP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clubs */}
      {activeTab === "Clubs" && (
        <section aria-label="Clubs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubsData.map((c, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <span className={`badge badge-sm ${c.category === "technical" ? "badge-accent" : c.category === "cultural" ? "badge-warning" : "badge-success"}`}>{c.category}</span>
                    <span className="text-xs text-base-content/50 flex items-center gap-1"><Users size={12} /> {c.members} members</span>
                  </div>
                  <h3 className="font-bold mt-1">{c.name}</h3>
                  <p className="text-sm text-base-content/60">{c.desc}</p>
                  <button className="btn btn-accent btn-sm rounded-xl mt-2 w-full">Join Club</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hackathons */}
      {activeTab === "Hackathons" && (
        <section aria-label="Hackathons">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={24} className="text-accent" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-lg">SIET Hack 2026</h3>
                  <p className="text-sm text-base-content/60">24-hour hackathon · Apr 5-6, 2026</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Theme:</strong> Smart Campus Solutions</p>
                <p><strong>Team Size:</strong> 2–4 members</p>
                <p><strong>Prize Pool:</strong> ₹50,000</p>
                <p><strong>Eligibility:</strong> All SIET students (all branches)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <button className="btn btn-accent rounded-xl gap-1"><Users size={16} /> Register Team</button>
                <button className="btn btn-outline rounded-xl gap-1"><Calendar size={16} /> View Rulebook</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {activeTab === "Gallery" && (
        <section aria-label="Media gallery">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { title: "Campus Building", img: "/images/siet-panchkula-building.jpg.jpeg" },
              { title: "SIET Campus", img: "/images/siet1.jpg.jpeg" },
              { title: "Campus Exterior", img: "/images/siet2.webp" },
              { title: "AI & ML Department", img: "/images/AI-ML.jpg.jpeg" },
              { title: "Cyber Security Lab", img: "/images/Cyber-Security.jpg.jpeg" },
              { title: "Robotics Workshop", img: "/images/Robotics-Automation.jpg.jpeg" },
            ].map((item, i) => (
              <div key={i} className="card bg-base-200 rounded-2xl shadow overflow-hidden group">
                <figure className="aspect-square">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </figure>
                <div className="p-2 text-center">
                  <p className="text-xs font-medium text-base-content/60">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sports */}
      {activeTab === "Sports" && (
        <section aria-label="Sports schedule">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Dumbbell size={18} className="text-accent" /> Weekly Sports Schedule</h3>
              <div className="space-y-3">
                {sportsSchedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-base-300/50 rounded-xl p-3">
                    <span className="text-sm font-bold text-accent min-w-[80px]">{s.day}</span>
                    <span className="flex-1 text-sm font-medium">{s.activity}</span>
                    <span className="text-xs text-base-content/50 flex items-center gap-1"><Clock size={12} /> {s.time}</span>
                    <span className="badge badge-ghost badge-xs">{s.venue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Campus Map */}
      {activeTab === "Campus Map" && (
        <section aria-label="Campus map">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><MapPin size={18} className="text-accent" /> Campus Map — SIET Panchkula</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Admin Block", loc: "Main Entrance" },
                  { name: "CSE Block", loc: "Building A, Floor 2-3" },
                  { name: "RAE Lab", loc: "Building B, Ground Floor" },
                  { name: "Library", loc: "Building A, Floor 1" },
                  { name: "Canteen", loc: "Near Parking" },
                  { name: "Sports Ground", loc: "Behind Main Building" },
                  { name: "Seminar Hall", loc: "Building A, Ground Floor" },
                  { name: "Computer Lab 1-4", loc: "Building A, Floor 2" },
                  { name: "Parking", loc: "Gate 1 & Gate 2" },
                ].map((p, i) => (
                  <div key={i} className="bg-base-300/50 rounded-xl p-3 text-center">
                    <MapPin size={16} className="text-accent mx-auto mb-1" aria-hidden="true" />
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-base-content/50">{p.loc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Canteen */}
      {activeTab === "Canteen" && (
        <section aria-label="Canteen menu">
          <div className="card bg-base-200 rounded-2xl shadow">
            <div className="card-body">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Utensils size={18} className="text-accent" /> Canteen Menu</h3>
              <div className="space-y-2">
                {canteenMenu.map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-base-300/50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className={`badge badge-sm ${m.category === "Main" ? "badge-accent" : m.category === "Beverage" ? "badge-info" : "badge-warning"}`}>{m.category}</span>
                      <span className="text-sm font-medium">{m.item}</span>
                    </div>
                    <span className="font-bold text-accent">{m.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CampusPage;
