import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { Plus, ClipboardList, QrCode, Trash2, BarChart3, TrendingUp, ShoppingBag, Leaf, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function VendorDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();

  const vendorId = state.currentUser?.vendorId ?? "v1";
  const vendor = state.vendors.find(v => v.id === vendorId);
  const myListings = state.listings.filter(l => l.vendorId === vendorId);
  const myOrders = state.orders.filter(o => o.vendorId === vendorId);
  const activeListings = myListings.filter(l => l.status === "ACTIVE");
  const todayOrders = myOrders.filter(o => ["PAID", "READY_FOR_PICKUP"].includes(o.status));
  const todayRevenue = todayOrders.reduce((s, o) => s + o.totalPrice, 0);
  const unsoldListings = myListings.filter(l => l.status === "UNSOLD");
  const wasteRecords = state.wasteRecords.filter(w => w.vendorId === vendorId);
  const totalWaste = wasteRecords.reduce((s, w) => s + w.weight, 0);

  const stats = [
    { label: "Today's Revenue", value: `RM ${todayRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Active Listings", value: activeListings.length, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Meals Rescued", value: vendor?.totalMealsRescued ?? 0, icon: Leaf, color: "text-emerald-600 bg-emerald-50" },
    { label: "Waste Recorded", value: `${totalWaste.toFixed(1)} kg`, icon: Trash2, color: "text-orange-600 bg-orange-50" },
  ];

  const quickActions = [
    { label: "Add Surplus Food", icon: Plus, color: "bg-green-600 text-white", action: () => navigate("/vendor/add") },
    { label: "Manage Listings", icon: ClipboardList, color: "bg-white border border-gray-200 text-gray-700", action: () => navigate("/vendor/listings") },
    { label: "View Orders", icon: ShoppingBag, color: "bg-white border border-gray-200 text-gray-700", action: () => navigate("/vendor/orders") },
    { label: "Scan QR Code", icon: QrCode, color: "bg-white border border-gray-200 text-gray-700", action: () => navigate("/vendor/scanner") },
    { label: "Record Unsold", icon: Trash2, color: "bg-white border border-gray-200 text-gray-700", action: () => navigate("/vendor/unsold") },
    { label: "Analytics", icon: BarChart3, color: "bg-white border border-gray-200 text-gray-700", action: () => {} },
  ];

  const recentOrders = myOrders.slice(0, 5);

  const orderStatusColor: Record<string, string> = {
    PAID: "text-green-600 bg-green-50",
    READY_FOR_PICKUP: "text-blue-600 bg-blue-50",
    PICKED_UP: "text-teal-600 bg-teal-50",
    COMPLETED: "text-gray-500 bg-gray-100",
    CANCELLED: "text-red-500 bg-red-50",
    EXPIRED: "text-red-400 bg-red-50",
    HELD: "text-amber-600 bg-amber-50",
    PAYMENT_PENDING: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          {vendor?.verified && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">✓ Verified Vendor</span>
          )}
        </div>
        <p className="text-gray-500 text-sm">Welcome back, {vendor?.name ?? state.currentUser?.name}</p>
      </div>

      {/* Unsold Alert */}
      {unsoldListings.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-orange-800 text-sm">{unsoldListings.length} listing{unsoldListings.length > 1 ? "s have" : " has"} unsold food</div>
            <div className="text-xs text-orange-600 mt-0.5">Please record the outcome for unsold food to complete the waste tracking cycle.</div>
            <button onClick={() => navigate("/vendor/unsold")} className="mt-2 text-xs font-semibold text-orange-700 underline">Record now →</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-4 text-sm">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(a => {
            const Icon = a.icon;
            return (
              <button key={a.label} onClick={a.action}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl text-xs font-semibold transition-all hover:shadow-md ${a.color}`}>
                <Icon className="w-5 h-5" />
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-sm">Recent Orders</h2>
          <button onClick={() => navigate("/vendor/orders")} className="text-xs text-green-600 font-medium">View all →</button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img src={order.foodImage} alt={order.foodName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{order.foodName}</div>
                  <div className="text-xs text-gray-500">{order.studentName} · Qty {order.quantity}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">RM {order.totalPrice.toFixed(2)}</div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${orderStatusColor[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
