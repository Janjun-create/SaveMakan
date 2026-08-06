import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, Order, OrderStatus } from "../../context/AppContext";
import { ClipboardList, ChevronRight, CheckCircle2, Clock, XCircle, QrCode } from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  HELD: { label: "Held", color: "text-blue-600 bg-blue-50", dot: "bg-blue-400" },
  PAYMENT_PENDING: { label: "Payment Pending", color: "text-amber-600 bg-amber-50", dot: "bg-amber-400" },
  PAID: { label: "Paid — Ready for Pickup", color: "text-green-600 bg-green-50", dot: "bg-green-500" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "text-green-600 bg-green-50", dot: "bg-green-500" },
  PICKED_UP: { label: "Picked Up", color: "text-teal-600 bg-teal-50", dot: "bg-teal-500" },
  COMPLETED: { label: "Completed", color: "text-gray-500 bg-gray-100", dot: "bg-gray-400" },
  CANCELLED: { label: "Cancelled", color: "text-red-500 bg-red-50", dot: "bg-red-400" },
  EXPIRED: { label: "Expired", color: "text-red-400 bg-red-50", dot: "bg-red-300" },
};

const TABS = [
  { key: "active", label: "Active", statuses: ["HELD", "PAYMENT_PENDING", "PAID", "READY_FOR_PICKUP"] as OrderStatus[] },
  { key: "done", label: "Completed", statuses: ["PICKED_UP", "COMPLETED"] as OrderStatus[] },
  { key: "other", label: "Cancelled", statuses: ["CANCELLED", "EXPIRED"] as OrderStatus[] },
];

function OrderCard({ order, onView }: { order: Order; onView: () => void }) {
  const cfg = STATUS_CONFIG[order.status];
  return (
    <button onClick={onView} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left flex items-center gap-3 transition-all active:scale-[0.98] hover:shadow-md">
      <img src={order.foodImage} alt={order.foodName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm truncate">{order.foodName}</div>
        <div className="text-xs text-gray-500 truncate">{order.vendorName}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}</span>
          <span className="text-sm font-bold text-green-600">RM {order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </button>
  );
}

export default function StudentOrderHistory() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");

  const userId = state.currentUser?.id;
  const userOrders = state.orders.filter(o => o.studentId === userId);

  const currentTab = TABS.find(t => t.key === tab)!;
  const filtered = userOrders.filter(o => currentTab.statuses.includes(o.status));

  return (
    <div className="px-4 pt-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
            }`}
          >
            {t.label}
            <span className="ml-1 text-gray-400">({userOrders.filter(o => t.statuses.includes(o.status)).length})</span>
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders here yet.</p>
          </div>
        ) : (
          filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onView={() => {
                if (order.status === "PAID" || order.status === "READY_FOR_PICKUP") {
                  navigate(`/student/qr/${order.id}`);
                } else if (order.status === "HELD" || order.status === "PAYMENT_PENDING") {
                  navigate(`/student/payment/${order.id}`);
                } else {
                  navigate(`/student/confirmation/${order.id}`);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
