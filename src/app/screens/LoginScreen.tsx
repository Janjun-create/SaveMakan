import { useNavigate } from "react-router";
import { useApp, DEMO_USERS, UserRole } from "../context/AppContext";
import { Leaf, ShoppingBag, BarChart3, Recycle, ArrowRight, Star } from "lucide-react";

const roles = [
  {
    key: "student" as UserRole,
    label: "Student",
    icon: ShoppingBag,
    desc: "Discover discounted surplus food near campus",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50 border-emerald-200",
    accent: "text-emerald-600",
    route: "/student",
  },
  {
    key: "vendor" as UserRole,
    label: "Food Vendor",
    icon: Star,
    desc: "Manage your surplus food listings and track orders",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-50 border-orange-200",
    accent: "text-orange-600",
    route: "/vendor",
  },
  {
    key: "admin" as UserRole,
    label: "Admin / University",
    icon: BarChart3,
    desc: "Monitor the campus food rescue ecosystem",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
    route: "/admin",
  },
  {
    key: "compost" as UserRole,
    label: "Compost Partner",
    icon: Recycle,
    desc: "Manage organic waste collection and processing",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50 border-teal-200",
    accent: "text-teal-600",
    route: "/compost",
  },
];

export default function LoginScreen() {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, route: string) => {
    dispatch({ type: "LOGIN", user: DEMO_USERS[role] });
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/40">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white tracking-tight">SaveMakan</h1>
              <p className="text-green-400 text-sm font-medium">Campus Food Rescue Platform</p>
            </div>
          </div>
          <p className="text-slate-300 text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Rescue Food. Save Money. Build a Sustainable Campus.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 text-green-300 text-sm px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Prototype Demo — Select your role to continue
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => handleLogin(r.key, r.route)}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-semibold text-lg">{r.label}</h3>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
                    <div className="mt-3 text-xs text-slate-500 font-mono">
                      Demo: {DEMO_USERS[r.key].name}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Impact Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-center mb-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Prototype Simulation Data</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { val: "814", unit: "Meals Rescued", color: "text-green-400" },
              { val: "RM2,640", unit: "Student Savings", color: "text-amber-400" },
              { val: "58 kg", unit: "Waste Recorded", color: "text-orange-400" },
              { val: "32 kg", unit: "Waste Diverted", color: "text-teal-400" },
            ].map(s => (
              <div key={s.unit}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-slate-500 mt-1">{s.unit}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          SDG 12 — Responsible Consumption and Production · Universiti Malaya Campus
        </p>
      </div>
    </div>
  );
}
