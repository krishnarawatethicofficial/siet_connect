import { useState } from "react";
import {
  User, Mail, CreditCard, BookOpen, Hash, Phone, Save,
  Flame, Star, TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";
import useAuthStore from "../store/authStore.js";

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    branch: user?.branch || "general",
    semester: user?.semester || 1,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data.data);
      toast.success("Profile updated!");
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="card bg-base-200 rounded-2xl shadow-lg">
          <div className="card-body items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-extrabold text-3xl">
              {user?.name?.charAt(0) || "S"}
            </div>
            <h2 className="text-lg font-bold mt-3">{user?.name}</h2>
            <p className="text-sm text-base-content/60">{user?.email}</p>
            <span className="badge badge-accent mt-1">{user?.role}</span>
            <div className="divider" />
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-base-content/60">Student ID:</span><span className="font-medium">{user?.studentId}</span></div>
              <div className="flex justify-between"><span className="text-base-content/60">Branch:</span><span className="font-medium">{user?.branch}</span></div>
              <div className="flex justify-between"><span className="text-base-content/60">Semester:</span><span className="font-medium">{user?.semester}</span></div>
              <div className="flex justify-between"><span className="text-base-content/60">Attendance:</span><span className={`font-bold ${user?.attendance >= 75 ? "text-success" : "text-error"}`}>{user?.attendance}%</span></div>
            </div>
            <div className="divider" />
            <div className="flex gap-4 w-full justify-center">
              <div className="text-center">
                <Star size={16} className="text-yellow-400 mx-auto" aria-hidden="true" />
                <p className="text-lg font-bold">{user?.xp || 0}</p>
                <p className="text-xs text-base-content/50">XP</p>
              </div>
              <div className="text-center">
                <Flame size={16} className="text-orange-400 mx-auto" aria-hidden="true" />
                <p className="text-lg font-bold">{user?.streak || 0}</p>
                <p className="text-xs text-base-content/50">Streak</p>
              </div>
              <div className="text-center">
                <TrendingUp size={16} className="text-accent mx-auto" aria-hidden="true" />
                <p className="text-lg font-bold">{user?.attendance || 0}%</p>
                <p className="text-xs text-base-content/50">Attendance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card bg-base-200 rounded-2xl shadow-lg lg:col-span-2">
          <div className="card-body">
            <h2 className="font-semibold text-lg mb-4">Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="form-control">
                <label htmlFor="prof-name" className="label"><span className="label-text font-medium flex items-center gap-1.5"><User size={14} /> Full Name</span></label>
                <input id="prof-name" type="text" className="input input-bordered rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium flex items-center gap-1.5"><Mail size={14} /> Email</span></label>
                <input type="email" className="input input-bordered rounded-xl" value={user?.email} disabled aria-label="Email (cannot be changed)" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium flex items-center gap-1.5"><CreditCard size={14} /> Student ID</span></label>
                <input type="text" className="input input-bordered rounded-xl" value={user?.studentId} disabled aria-label="Student ID (cannot be changed)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="prof-branch" className="label"><span className="label-text font-medium flex items-center gap-1.5"><BookOpen size={14} /> Branch</span></label>
                  <select id="prof-branch" className="select select-bordered rounded-xl" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                    <option value="CSE-AIML">CSE (AI & ML)</option>
                    <option value="CSE-CS">CSE (Cyber Sec)</option>
                    <option value="RAE">Robotics & Auto</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="form-control">
                  <label htmlFor="prof-sem" className="label"><span className="label-text font-medium flex items-center gap-1.5"><Hash size={14} /> Semester</span></label>
                  <select id="prof-sem" className="select select-bordered rounded-xl" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="prof-phone" className="label"><span className="label-text font-medium flex items-center gap-1.5"><Phone size={14} /> Phone</span></label>
                <input id="prof-phone" type="tel" className="input input-bordered rounded-xl" placeholder="Optional" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-accent rounded-xl gap-2" disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm" /> : <Save size={16} aria-hidden="true" />}
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
