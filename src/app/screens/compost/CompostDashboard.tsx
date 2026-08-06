import { useNavigate } from "react-router";
import { useApp, WasteStatus } from "../../context/AppContext";
import { Leaf, MapPin, Weight, Calendar, CheckCircle2, Clock, Recycle, LogOut, Truck } from "lucide-react";

const STATUS_FLOW: WasteStatus[] = ["AWAITING_COLLECTION", "COLLECTION_REQUESTED", "ACCEPTED", "COLLECTED", "PROCESSED", "RECYCLED"];

const STATUS_CONFIG: Record<WasteStatus, { label: string; color: string; next?: WasteStatus; action?: string }> = {
  AWAITING_COLLECTION: { label: "Awaiting Collection", color: "text-orange-600 bg-orange-100", next: "COLLECTION_REQUESTED", action: "Send Collection Request" },
  COLLECTION_REQUESTED: { label: "Collection Requested", color: "text-amber-600 bg-amber-100", next: "ACCEPTED", action: "Accept Request" },
  ACCEPTED: { label: "Accepted", color: "text-blue-600 bg-blue-100", next: "COLLECTED", action: "Mark as Collected" },
  COLLECTED: { label: "Collected", color: "text-teal-600 bg-teal-100", next: "PROCESSED", action: "Mark as Processed" },
  PROCESSED: { label: "Processed", color: "text-green-600 bg-green-100", next: "RECYCLED", action: "Mark as Recycled" },
  RECYCLED: { label: "Recycled ✓", color: "text-green-700 bg-green-100" },
};

function StatusPipeline({ current }: { current: WasteStatus }) {
  const idx = STATUS_FLOW.indexOf(current);
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUS_FLOW.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${i <= idx ? "bg-green-500" : "bg-gray-200"}`} />
          {i < STATUS_FLOW.length - 1 && <div className={`w-4 h-0.5 ${i < idx ? "bg-green-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function CompostDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const logout = () => { dispatch({ type: "LOGOUT" }); navigate("/"); };

  const records = state.wasteRecords;
  const pending = records.filter(w => w.status !== "RECYCLED").length;
  const totalKg = records.reduce((s, w) => s + w.weight, 0);
  const recycled = records.filter(w => w.status === "RECYCLED").reduce((s, w) => s + w.weight, 0);

  const advance = (wasteId: string, next: WasteStatus) => {
    dispatch({ type: "UPDATE_WASTE_STATUS", wasteId, status: next });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30 shadow-sm">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Recycle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SaveMakan</span>
          </div>
          <div className="text-xs text-gray-400">Compost Partner Portal</div>
          <div className="text-sm font-semibold text-gray-800 mt-0.5">{state.currentUser?.name}</div>
        </div>

        <div className="flex-1 p-4 space-y-4">
          <div className="bg-teal-50 rounded-xl p-3">
            <div className="text-xs text-teal-600 font-semibold mb-1">Total Assigned</div>
            <div className="text-xl font-bold text-teal-700">{totalKg.toFixed(1)} kg</div>
            <div className="text-xs text-teal-500">organic waste</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-xs text-green-600 font-semibold mb-1">Recycled</div>
            <div className="text-xl font-bold text-green-700">{recycled.toFixed(1)} kg</div>
            <div className="text-xs text-green-500">successfully processed</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <div className="text-xs text-orange-600 font-semibold mb-1">Pending</div>
            <div className="text-xl font-bold text-orange-700">{pending}</div>
            <div className="text-xs text-orange-500">collection requests</div>
          </div>
        </div>

        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-56 flex-1 p-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Collection Dashboard</h1>
          <p className="text-sm text-gray-500">Manage organic waste collection requests from campus vendors</p>
        </div>

        {/* Collection Flow Guide */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="text-xs font-semibold text-gray-500 mb-3">Collection Process Flow</div>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                  {STATUS_CONFIG[s].label}
                </span>
                {i < STATUS_FLOW.length - 1 && <span className="text-gray-300 text-sm">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Records */}
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
              No collection requests yet.
            </div>
          ) : (
            records.map(w => {
              const cfg = STATUS_CONFIG[w.status];
              return (
                <div key={w.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{w.foodName}</h3>
                        <div className="text-xs text-gray-500 mt-0.5">{w.vendorName}</div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <StatusPipeline current={w.status} />

                    <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Weight className="w-3.5 h-3.5 text-gray-400" />
                        <span><span className="font-semibold text-gray-700">{w.weight} kg</span> · {w.quantity} pcs</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Leaf className="w-3.5 h-3.5 text-gray-400" />
                        <span>{w.foodType}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{w.date}</span>
                      </div>
                    </div>

                    {w.reason && (
                      <div className="mt-2 text-xs text-gray-400">Reason: {w.reason}{w.notes && ` — ${w.notes}`}</div>
                    )}
                  </div>

                  {cfg.next && cfg.action && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <button onClick={() => advance(w.id, cfg.next!)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        <Truck className="w-4 h-4" />
                        {cfg.action}
                      </button>
                    </div>
                  )}

                  {w.status === "RECYCLED" && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-green-50 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-700 font-medium">Fully recycled — sustainability cycle complete!</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Future AI Section */}
        <div className="mt-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5 text-white">
          <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Future Development</div>
          <h3 className="font-bold mb-3">AI-Powered Waste Prediction</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Predict expected surplus food based on historical demand patterns</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Suggest optimal collection schedules to reduce logistics costs</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />
              <span>Identify high-waste patterns by vendor, day, and food type</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 italic">
            Note: AI provides insights and recommendations only. Vendors remain responsible for all food safety decisions.
          </div>
        </div>
      </main>
    </div>
  );
}
