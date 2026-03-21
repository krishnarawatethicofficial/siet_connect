import { Link } from "react-router-dom";
import {
  BookOpen, Briefcase, FileText, Users, Shield, Zap,
  ArrowRight, GraduationCap, Globe, Accessibility, ChevronRight,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "PYQ Repository", desc: "Searchable previous year papers with branch & semester filters" },
  { icon: Briefcase, title: "Placement Board", desc: "Live internship & job listings with upvote-ranked opportunities" },
  { icon: FileText, title: "Document Portal", desc: "Request bonafide, transcripts, and ID cards — track status live" },
  { icon: Users, title: "Real-Time Campus", desc: "See who's online, get instant notice alerts" },
  { icon: Shield, title: "Admin Dashboard", desc: "Faculty & admin tools for notices, attendance, and user management" },
  { icon: Zap, title: "XP & Streaks", desc: "Gamified engagement — earn XP, maintain streaks, climb the leaderboard" },
];

const courses = [
  { name: "CSE (AI & ML)", intake: 60, img: "/images/AI-ML-300x200.jpg.jpeg", desc: "Artificial Intelligence & Machine Learning" },
  { name: "CSE (Cyber Security)", intake: 60, img: "/images/Cyber-Security-300x200.jpg.jpeg", desc: "Cyber Security & Ethical Hacking" },
  { name: "Robotics & Automation", intake: 60, img: "/images/Robotics-Automation-300x200.jpg.jpeg", desc: "Robotics & Automation Engineering" },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Skip link */}
      <a href="#landing-main" className="skip-link">Skip to Main Content</a>

      {/* Top bar with logos */}
      <div className="bg-base-200 border-b border-base-300 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/siet.webp" alt="SIET Panchkula Logo" className="w-12 h-12 object-contain" />
            <div>
              <p className="font-bold text-sm sm:text-base leading-tight">SIET Connect</p>
              <p className="text-xs text-base-content/50">State Institute of Engineering & Technology</p>
            </div>
          </div>
          <img src="/images/haryana-sarkar.png" alt="Government of Haryana Seal" className="w-12 h-12 object-contain" />
        </div>
      </div>

      {/* Hero with campus image */}
      <header className="relative overflow-hidden" role="banner">
        {/* Campus background image */}
        <div className="absolute inset-0">
          <img
            src="/images/siet-panchkula-building.jpg.jpeg"
            alt="SIET Panchkula Campus aerial view showing the main building and courtyard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-base-100/90 via-base-100/80 to-base-100/95" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 py-20 sm:py-28">
          <img src="/images/siet.webp" alt="SIET Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-6 drop-shadow-lg" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            SIET <span className="text-accent">Connect</span>
          </h1>

          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto mb-1">
            राज्य अभियांत्रिकी एवं प्रौद्योगिकी संस्थान, पंचकुला
          </p>
          <p className="text-base text-base-content/50 mb-2">
            State Institute of Engineering & Technology, Panchkula
          </p>
          <p className="text-sm text-base-content/40 mb-8">
            Approved by AICTE, New Delhi | Affiliated to Kurukshetra University, Kurukshetra
          </p>

          <p className="text-lg text-base-content/70 max-w-xl mx-auto mb-8">
            One platform for academics, placements, and campus services.
            Built for <strong>every</strong> student — including those with accessibility needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="btn btn-accent btn-lg gap-2 rounded-2xl shadow-lg transition-all duration-200">
              <GraduationCap size={20} aria-hidden="true" />
              Get Started
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg rounded-2xl transition-all duration-200">
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-base-content/40">
            <span className="flex items-center gap-1"><Globe size={14} /> WCAG 2.0 AA</span>
            <span className="flex items-center gap-1"><Accessibility size={14} /> Accessible</span>
            <span className="flex items-center gap-1"><Shield size={14} /> GoI Guidelines</span>
          </div>
        </div>
      </header>

      {/* Campus Gallery Strip */}
      <section className="py-4 bg-base-300/50 overflow-hidden">
        <div className="flex gap-4 px-4 max-w-5xl mx-auto">
          <img src="/images/siet1.jpg.jpeg" alt="SIET Panchkula campus front view" className="h-32 sm:h-40 rounded-2xl object-cover flex-1" />
          <img src="/images/siet-panchkula-building.jpg.jpeg" alt="SIET campus courtyard and buildings" className="h-32 sm:h-40 rounded-2xl object-cover flex-1 hidden sm:block" />
          <img src="/images/siet2.webp" alt="SIET campus building exterior" className="h-32 sm:h-40 rounded-2xl object-cover flex-1 hidden md:block" />
        </div>
      </section>

      {/* Courses Offered */}
      <section className="py-16 px-4 bg-base-200" aria-labelledby="courses-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="courses-heading" className="text-3xl font-bold text-center mb-3">
            Courses <span className="text-accent">Offered</span>
          </h2>
          <p className="text-center text-base-content/60 mb-10">B.Tech programs with intake of 60 students each</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <div key={i} className="card bg-base-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200">
                <figure>
                  <img src={c.img} alt={c.desc} className="w-full h-40 object-cover" />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-base">{c.name}</h3>
                  <p className="text-sm text-base-content/60">{c.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="badge badge-accent badge-sm">Intake: {c.intake}</span>
                    <span className="badge badge-ghost badge-sm">4 Years</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Director Principal Message */}
      <section className="py-16 px-4" aria-labelledby="director-heading">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-base-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="card-body p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img
                  src="/images/anil-kumar-240x300.jpeg"
                  alt="Director Principal of SIET Panchkula"
                  className="w-32 h-40 rounded-2xl object-cover shadow-md flex-shrink-0"
                />
                <div>
                  <h2 id="director-heading" className="text-xl font-bold mb-1">Director Principal's Message</h2>
                  <p className="text-sm text-accent font-medium mb-3">SIET Panchkula</p>
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    "At SIET Panchkula, we are committed to nurturing the next generation of engineers and technologists.
                    Our institution blends academic rigor with practical exposure, preparing students for the challenges
                    of Industry 4.0. With state-of-the-art labs, experienced faculty, and a vibrant campus life,
                    SIET is where innovation meets tradition. I encourage every student to make the most of
                    the opportunities this platform provides — connect, learn, and grow together."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="landing-main" className="py-16 px-4 bg-base-200" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="features-heading" className="text-3xl font-bold text-center mb-12">
            Everything SIET Needs, <span className="text-accent">One App</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="card-body">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
                    <f.icon className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="card-title text-lg">{f.title}</h3>
                  <p className="text-base-content/60 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Pathways */}
      <section className="py-16 px-4" aria-labelledby="pathways-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="pathways-heading" className="text-2xl font-bold text-center mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Students", desc: "PYQs, attendance, notices, placements", icon: GraduationCap, color: "text-accent" },
              { title: "Faculty", desc: "Post notices, manage attendance, upload PYQs", icon: BookOpen, color: "text-success" },
              { title: "Visitors", desc: "Courses offered, contact, campus info", icon: Globe, color: "text-warning" },
            ].map((p, i) => (
              <Link
                key={i}
                to="/signup"
                className="card bg-base-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <div className="card-body items-center text-center">
                  <p.icon className={p.color} size={36} aria-hidden="true" />
                  <h3 className="font-bold text-lg mt-2">{p.title}</h3>
                  <p className="text-sm text-base-content/60">{p.desc}</p>
                  <ChevronRight className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity" size={20} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 border-t border-base-300 py-8 px-4" role="contentinfo">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <img src="/images/siet.webp" alt="SIET Logo" className="w-10 h-10 object-contain" />
              <div>
                <p className="font-bold text-sm">SIET Connect</p>
                <p className="text-xs text-base-content/50">राज्य अभियांत्रिकी एवं प्रौद्योगिकी संस्थान</p>
              </div>
            </div>
            <img src="/images/haryana-sarkar.png" alt="Haryana Government Seal" className="w-10 h-10 object-contain" />
          </div>
          <div className="text-center text-sm text-base-content/50">
            <p className="font-semibold mb-1">State Institute of Engineering & Technology, Panchkula</p>
            <p>Sector 26, Panchkula — 134116 (Haryana) | 0172-2929871 | sietpkl@gmail.com</p>
            <p className="mt-2">Approved by AICTE, New Delhi | Affiliated to Kurukshetra University, Kurukshetra</p>
            <p className="mt-3">&copy; {new Date().getFullYear()} SIET Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
