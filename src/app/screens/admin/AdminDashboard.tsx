import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { Leaf, BarChart3, Users, ShoppingBag, Trash2, CheckCircle2, AlertCircle, LogOut, TrendingUp, FileText } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const mealData = [
  { month: "Aug", meals: 48, waste: 12 },
  { month: "Sep", meals: 72, waste: 9 },
  { month: "Oct", meals: 95, waste: 15 },
  { month: "Nov", meals: 130, waste: 8 },
  { month: "Dec", meals: 112, waste: 20 },
  { month: "Jan", meals: 158, waste: 11 },
];

const wasteReasons = [
  { name: "Low Demand", value: 38 },
  { name: "Overproduction", value: 28 },
  { name: "Event Cancel", value: 18 },
  { name: "Late Listing", value: 10 },
  { name: "Other", value: 6 },
];

const PIE_COLORS = ["#16a34a", "#ea580c", "#2563eb", "#d97706", "#6b7280"];

export default function AdminDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "vendors" | "logs" | "reports">("overview");

  const logout = () => { dispatch({ type: "LOGOUT" }); navigate("/"); };

  const totalMeals = state.vendors.reduce((s, v) => s + v.totalMealsRescued, 0);
  const totalWaste = state.wasteRecords.reduce((s, w) => s + w.weight, 0);
  const totalSavings = state.orders.filter(o => ["PAID","READY_FOR_PICKUP","PICKED_UP","COMPLETED"].includes(o.status))
    .reduce((s, o) => s + (o.quantity * (o.unitPrice * 0.6)), 0);
  const activeListings = state.listings.filter(l => l.status === "ACTIVE").length;
  const wasteCollected = state.wasteRecords.filter(w => ["COLLECTED","PROCESSED","RECYCLED"].includes(w.status)).reduce((s, w) => s + w.weight, 0);

  const stats = [
    { label: "Total Vendors", value: state.vendors.length, icon: Users, color: "text-blue-600 bg-blue-50", sub: `${state.vendors.filter(v => !v.verified).length} pending verification` },
    { label: "Active Listings", value: activeListings, icon: ShoppingBag, color: "text-green-600 bg-green-50", sub: `${state.listings.filter(l => l.status === "SOLD_OUT").length} sold out today` },
    { label: "Meals Rescued", value: totalMeals, icon: Leaf, color: "text-emerald-600 bg-emerald-50", sub: "Prototype simulation data" },
    { label: "Student Savings", value: `RM ${totalSavings.toFixed(0)}`, icon: TrendingUp, color: "text-amber-600 bg-amber-50", sub: "Total across all orders" },
    { label: "Waste Recorded", value: `${totalWaste.toFixed(1)} kg`, icon: Trash2, color: "text-orange-600 bg-orange-50", sub: `${wasteCollected.toFixed(1)} kg collected` },
    { label: "Total Transactions", value: state.orders.length, icon: BarChart3, color: "text-purple-600 bg-purple-50", sub: `${state.orders.filter(o => o.status === "PAID").length} active orders` },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9F8] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30 shadow-sm">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SaveMakan</span>
          </div>
          <div className="text-xs text-gray-400">Admin / University Portal</div>
          <div className="text-sm font-semibold text-gray-800 mt-0.5">{state.currentUser?.name}</div>
        </div>

        <nav className="flex-1 py-3 px-2">
          {[
            { key: "overview", label: "Overview", icon: BarChart3 },
            { key: "vendors", label: "Vendors", icon: Users },
            { key: "logs", label: "Audit Logs", icon: FileText },
            { key: "reports", label: "Impact Reports", icon: Leaf },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button key={item.key} onClick={() => setActiveTab(item.key as typeof activeTab)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                  active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-56 flex-1 p-6 max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">Prototype Simulation Data</span>
          </div>
          <p className="text-gray-500 text-sm">Campus food rescue ecosystem overview — Universiti Malaya</p>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs font-medium text-gray-700">{s.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Food Rescue Trend</h3>
                <p className="text-xs text-gray-400 mb-4">Meals rescued vs waste recorded per month</p>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={mealData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="meals" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} name="Meals Rescued" />
                    <Area type="monotone" dataKey="waste" stroke="#ea580c" fill="#fed7aa" strokeWidth={2} name="Waste (kg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Waste Reasons</h3>
                <p className="text-xs text-gray-400 mb-4">Most common reasons for unsold food</p>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart>
                      <Pie data={wasteReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>
                        {wasteReasons.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-1.5">
                    {wasteReasons.map((r, i) => (
                      <div key={r.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-gray-600 flex-1">{r.name}</span>
                        <span className="font-semibold text-gray-800">{r.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Collection Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Organic Waste Collection Status</h3>
              <div className="space-y-3">
                {state.wasteRecords.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{w.foodName}</div>
                      <div className="text-xs text-gray-500">{w.vendorName} · {w.weight} kg · {w.date}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      w.status === "RECYCLED" ? "bg-green-100 text-green-700" :
                      w.status === "COLLECTED" ? "bg-teal-100 text-teal-700" :
                      w.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
                      w.status === "COLLECTION_REQUESTED" ? "bg-amber-100 text-amber-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {w.status.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "vendors" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Vendor Management</h2>
              <p className="text-xs text-gray-400 mt-0.5">{state.vendors.length} registered vendors</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Vendor", "Location", "Rating", "Meals Rescued", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.vendors.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{v.name}</div>
                      <div className="text-xs text-gray-400">{v.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{v.location}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-500">★ {v.rating}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">{v.totalMealsRescued}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        v.suspended ? "bg-red-100 text-red-600" :
                        v.verified ? "bg-green-100 text-green-700" :
                        "bg-amber-100 text-amber-600"
                      }`}>
                        {v.suspended ? "Suspended" : v.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!v.verified && !v.suspended && (
                          <button onClick={() => dispatch({ type: "VERIFY_VENDOR", vendorId: v.id })}
                            className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg font-medium hover:bg-green-700">
                            Verify
                          </button>
                        )}
                        <button onClick={() => dispatch({ type: "SUSPEND_VENDOR", vendorId: v.id })}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium ${v.suspended ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}>
                          {v.suspended ? "Unsuspend" : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Audit Log</h2>
            {state.auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No audit logs yet. Edit a vendor listing to generate logs.</div>
            ) : (
              <div className="space-y-2">
                {[...state.auditLogs].reverse().map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">{log.changedBy}</span> changed <span className="font-semibold text-gray-700">{log.field}</span> on listing <span className="font-mono text-gray-600">{log.entityId}</span>
                      <div className="text-gray-500 mt-0.5">"{log.previousValue}" → "{log.newValue}" · {new Date(log.changedAt).toLocaleString("en-MY")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white">
              <div className="text-xs font-semibold opacity-70 mb-3 uppercase tracking-widest">Prototype Simulation Data</div>
              <h2 className="text-2xl font-bold mb-4">Campus Sustainability Impact Report</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { val: totalMeals, label: "Total Meals Rescued", unit: "meals" },
                  { val: `RM ${totalSavings.toFixed(0)}`, label: "Student Savings Generated" },
                  { val: `${totalWaste.toFixed(1)} kg`, label: "Food Waste Recorded" },
                  { val: `${wasteCollected.toFixed(1)} kg`, label: "Organic Waste Diverted" },
                ].map(m => (
                  <div key={m.label}>
                    <div className="text-3xl font-bold">{m.val}</div>
                    <div className="text-sm opacity-80">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-2">SDG Alignment</h3>
              <div className="space-y-3">
                {[
                  { sdg: "SDG 12", title: "Responsible Consumption & Production", desc: "Primary impact: reducing campus food waste through surplus food rescue", color: "bg-orange-500", primary: true },
                  { sdg: "SDG 2", title: "Zero Hunger", desc: "Providing affordable food access to students", color: "bg-yellow-500" },
                  { sdg: "SDG 13", title: "Climate Action", desc: "Reducing methane emissions from organic food waste in landfills", color: "bg-green-600" },
                ].map(s => (
                  <div key={s.sdg} className={`flex items-start gap-3 p-3 rounded-xl ${s.primary ? "bg-orange-50 border border-orange-100" : "bg-gray-50"}`}>
                    <div className={`${s.color} text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0`}>{s.sdg}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                      <div className="text-xs text-gray-500">{s.desc}</div>
                      {s.primary && <span className="text-xs text-orange-600 font-semibold">Primary SDG</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
