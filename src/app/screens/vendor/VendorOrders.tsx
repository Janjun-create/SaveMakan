import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, Order, OrderStatus } from "../../context/AppContext";
import { QrCode, CheckCircle2, Clock, XCircle, User } from "lucide-react";

const TABS: { key: string; label: string; statuses: OrderStatus[] }[] = [
  { key: "active", label: "Active", statuses: ["HELD", "PAYMENT_PENDING", "PAID", "READY_FOR_PICKUP"] },
  { key: "done", label: "Completed", statuses: ["PICKED_UP", "COMPLETED"] },
  { key: "other", label: "Other", statuses: ["CANCELLED", "EXPIRED"] },
];

const STATUS_COLOR: Record<string, string> = {
  HELD: "text-blue-500 bg-blue-50",
  PAYMENT_PENDING: "text-amber-500 bg-amber-50",
  PAID: "text-green-600 bg-green-50",
  READY_FOR_PICKUP: "text-green-600 bg-green-50",
  PICKED_UP: "text-teal-600 bg-teal-50",
  COMPLETED: "text-gray-500 bg-gray-100",
  CANCELLED: "text-red-500 bg-red-50",
  EXPIRED: "text-red-400 bg-red-50",
};

export default function VendorOrders() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");

  const vendorId = state.currentUser?.vendorId ?? "v1";
  const myOrders = state.orders.filter(o => o.vendorId === vendorId);
  const currentTab = TABS.find(t => t.key === tab)!;
  const filtered = myOrders.filter(o => currentTab.statuses.includes(o.status));

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
        <button onClick={() => navigate("/vendor/scanner")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
          <QrCode className="w-4 h-4" />
          Scan QR
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}>
            {t.label} ({myOrders.filter(o => t.statuses.includes(o.status)).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">No orders in this category.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <img src={order.foodImage} alt={order.foodName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{order.foodName}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <User className="w-3 h-3" />
                    {order.studentName}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Qty: {order.quantity} · RM {order.totalPrice.toFixed(2)}</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">QR: {order.qrCode}</div>
                </div>
              </div>

              {(order.status === "PAID" || order.status === "READY_FOR_PICKUP") && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button onClick={() => navigate("/vendor/scanner")} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5" />
                    Scan to Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
