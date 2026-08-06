import { useParams, useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle, MapPin } from "lucide-react";

function QRDisplay({ code, status }: { code: string; status: string }) {
  const cells = 11;
  const pattern = code.split("").map(c => c.charCodeAt(0));
  const grayscale = status !== "VALID";
  return (
    <div className={`inline-block p-4 rounded-2xl border-4 transition-all ${
      status === "VALID" ? "border-green-500 bg-white" :
      status === "USED" ? "border-gray-300 bg-gray-50" :
      status === "EXPIRED" ? "border-red-300 bg-red-50" :
      "border-red-300 bg-red-50"
    }`}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells}, 1fr)`, gap: 2, opacity: grayscale ? 0.3 : 1 }}>
        {Array.from({ length: cells * cells }).map((_, i) => {
          const row = Math.floor(i / cells);
          const col = i % cells;
          const isCorner = (row < 3 && col < 3) || (row < 3 && col >= cells - 3) || (row >= cells - 3 && col < 3);
          const isCornerInner = (row > 0 && row < 2 && col > 0 && col < 2) || (row > 0 && row < 2 && col > cells - 3 && col < cells - 1) || (row > cells - 3 && row < cells - 1 && col > 0 && col < 2);
          const seed = (pattern[i % pattern.length] + row * 7 + col * 13) % 3;
          const filled = isCorner ? !isCornerInner : seed === 0;
          return <div key={i} style={{ width: 8, height: 8, borderRadius: 1, background: filled ? "#111" : "transparent" }} />;
        })}
      </div>
    </div>
  );
}

export default function StudentQRPickup() {
  const { orderId } = useParams<{ orderId: string }>();
  const { state } = useApp();
  const navigate = useNavigate();

  const order = state.orders.find(o => o.id === orderId);
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Order not found</div>
  );

  const statusConfig = {
    VALID: { label: "Valid — Ready for Pickup", color: "bg-green-100 text-green-700", icon: CheckCircle2, iconColor: "text-green-500" },
    USED: { label: "Already Used", color: "bg-gray-100 text-gray-500", icon: CheckCircle2, iconColor: "text-gray-400" },
    EXPIRED: { label: "Expired", color: "bg-red-100 text-red-600", icon: Clock, iconColor: "text-red-400" },
    INVALID: { label: "Invalid QR", color: "bg-red-100 text-red-600", icon: XCircle, iconColor: "text-red-400" },
  };

  const cfg = statusConfig[order.qrStatus] ?? statusConfig.INVALID;
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        <h2 className="font-semibold text-gray-900">Pickup QR Code</h2>
      </div>

      <div className="px-4 pt-6 flex flex-col items-center">
        {/* Status badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-6 ${cfg.color}`}>
          <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
          {cfg.label}
        </div>

        {/* QR Code */}
        <QRDisplay code={order.qrCode} status={order.qrStatus} />

        <div className="text-xs text-gray-400 font-mono mt-3 mb-6">{order.qrCode}</div>

        {/* Order Info */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-3">
            <img src={order.foodImage} alt={order.foodName} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <div className="font-semibold text-gray-900 text-sm">{order.foodName}</div>
              <div className="text-xs text-gray-500">{order.vendorName}</div>
              <div className="text-xs text-green-600 font-medium">RM {order.totalPrice.toFixed(2)} · Qty {order.quantity}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div className="text-xs text-gray-600">{order.pickupLocation}</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="text-xs text-gray-600">
              Pickup by: {new Date(order.pickupDeadline).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {order.qrStatus === "VALID" && (
          <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">Show this QR code to the vendor when you arrive at the pickup point. The code can only be scanned once.</p>
          </div>
        )}

        {order.qrStatus === "USED" && (
          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="font-semibold text-gray-600">Pickup Completed</div>
            <div className="text-xs text-gray-400 mt-1">This order has been successfully picked up.</div>
          </div>
        )}
      </div>
    </div>
  );
}
