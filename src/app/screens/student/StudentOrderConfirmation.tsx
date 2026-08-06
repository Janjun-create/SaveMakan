import { useParams, useNavigate, Link } from "react-router";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, MapPin, Clock, QrCode, ChevronRight, Home } from "lucide-react";

function QRPlaceholder({ code }: { code: string }) {
  const cells = 11;
  const pattern = code.split("").map(c => c.charCodeAt(0));
  return (
    <div className="inline-block p-3 bg-white border-2 border-gray-900 rounded-xl">
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells}, 1fr)`, gap: 2 }}>
        {Array.from({ length: cells * cells }).map((_, i) => {
          const row = Math.floor(i / cells);
          const col = i % cells;
          const isCorner = (row < 3 && col < 3) || (row < 3 && col >= cells - 3) || (row >= cells - 3 && col < 3);
          const isCornerInner = (row > 0 && row < 2 && col > 0 && col < 2) || (row > 0 && row < 2 && col > cells - 3 && col < cells - 1) || (row > cells - 3 && row < cells - 1 && col > 0 && col < 2);
          const seed = (pattern[i % pattern.length] + row * 7 + col * 13) % 3;
          const filled = isCorner ? !isCornerInner : seed === 0;
          return <div key={i} style={{ width: 7, height: 7, borderRadius: 1, background: filled ? "#111" : "transparent" }} />;
        })}
      </div>
    </div>
  );
}

export default function StudentOrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { state } = useApp();
  const navigate = useNavigate();

  const order = state.orders.find(o => o.id === orderId);
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <p>Order not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-green-600 to-green-500 pt-12 pb-8 px-4 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Order Confirmed!</h1>
        <p className="text-green-100 text-sm">Payment successful · Your food is reserved</p>
        <div className="mt-3 text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
          Order #{order.id.toUpperCase()}
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Order Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <img src={order.foodImage} alt={order.foodName} className="w-full h-32 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-gray-900">{order.foodName}</h3>
            <p className="text-sm text-gray-500">{order.vendorName}</p>
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Pickup</div>
                  <div className="text-xs font-medium text-gray-700">{order.pickupLocation}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Deadline</div>
                  <div className="text-xs font-medium text-gray-700">
                    {new Date(order.pickupDeadline).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <QrCode className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Your Pickup QR Code</span>
          </div>
          <div className="flex justify-center mb-3">
            <QRPlaceholder code={order.qrCode} />
          </div>
          <div className="text-xs text-gray-400 font-mono mb-1">{order.qrCode}</div>
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            VALID — Show to vendor at pickup
          </div>
          <p className="text-xs text-gray-400 mt-3">This QR code is unique and can only be scanned once.</p>
        </div>

        {/* Actions */}
        <button onClick={() => navigate(`/student/qr/${order.id}`)} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 mb-3">
          Show QR Code for Pickup
          <ChevronRight className="w-4 h-4" />
        </button>
        <Link to="/student" className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Impact Card */}
        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-6">
          <div className="text-xs font-semibold text-green-700 mb-2">Your Impact Today</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><div className="text-lg font-bold text-green-600">{order.quantity}</div><div className="text-xs text-gray-500">Meal{order.quantity > 1 ? "s" : ""} Rescued</div></div>
            <div><div className="text-lg font-bold text-green-600">RM {(order.quantity * (order.unitPrice)).toFixed(0)}</div><div className="text-xs text-gray-500">Saved</div></div>
            <div><div className="text-lg font-bold text-green-600">~{(order.quantity * 0.3).toFixed(1)}kg</div><div className="text-xs text-gray-500">Waste Prevented</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
