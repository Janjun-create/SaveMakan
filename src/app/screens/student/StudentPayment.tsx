import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { ArrowLeft, Clock, CreditCard, Smartphone, Building2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type PaymentState = "pending" | "processing" | "success" | "failed";
const PAYMENT_TIMER_SECONDS = 300; // 5 minutes

export default function StudentPayment() {
  const { orderId } = useParams<{ orderId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const order = state.orders.find(o => o.id === orderId);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payState, setPayState] = useState<PaymentState>("pending");
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMER_SECONDS);
  const [simulateFail, setSimulateFail] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      dispatch({ type: "EXPIRE_PAYMENT", orderId: orderId! });
      navigate("/student/orders");
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <p>Order not found.</p>
    </div>
  );

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const timerUrgent = timeLeft < 60;

  const handlePay = () => {
    setPayState("processing");
    setTimeout(() => {
      if (simulateFail) {
        setPayState("failed");
      } else {
        dispatch({ type: "COMPLETE_PAYMENT", orderId: order.id });
        setPayState("success");
        setTimeout(() => navigate(`/student/confirmation/${order.id}`), 1500);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setSimulateFail(false);
    setPayState("pending");
  };

  if (payState === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 text-sm">Generating your QR code...</p>
      </div>
    );
  }

  if (payState === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-8">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
        <p className="text-gray-500 text-sm mb-6">Your payment could not be processed. Please try again.</p>
        <button onClick={handleRetry} className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold">
          Try Again
        </button>
        <button onClick={() => { dispatch({ type: "CANCEL_ORDER", orderId: order.id }); navigate("/student"); }} className="mt-3 text-gray-400 text-sm">
          Cancel Order
        </button>
      </div>
    );
  }

  if (payState === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-400 text-sm">Please wait, do not close this page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F7] pb-32">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-900 flex-1">Complete Payment</h2>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${timerUrgent ? "bg-red-100 text-red-600 animate-pulse" : "bg-amber-100 text-amber-600"}`}>
          <Clock className="w-3.5 h-3.5" />
          {mins}:{secs}
        </div>
      </div>

      {timerUrgent && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl p-2.5 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600">Less than 1 minute left! Complete payment now or your reservation will be released.</p>
        </div>
      )}

      {/* Order Summary */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Summary</h3>
        <div className="flex items-center gap-3 mb-3">
          <img src={order.foodImage} alt={order.foodName} className="w-14 h-14 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm">{order.foodName}</div>
            <div className="text-xs text-gray-500">{order.vendorName}</div>
            <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
          </div>
          <div className="font-bold text-green-600">RM {order.totalPrice.toFixed(2)}</div>
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span><span>RM {order.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Platform Fee</span><span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
            <span>Total</span><span className="text-green-600">RM {order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Payment Method</h3>
        {[
          { key: "card", label: "Credit / Debit Card", icon: CreditCard },
          { key: "ewallet", label: "Touch n' Go / GrabPay", icon: Smartphone },
          { key: "fpx", label: "Online Banking (FPX)", icon: Building2 },
        ].map(m => {
          const Icon = m.icon;
          return (
            <button key={m.key} onClick={() => setPaymentMethod(m.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 text-left transition-all ${paymentMethod === m.key ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"}`}
            >
              <Icon className={`w-5 h-5 ${paymentMethod === m.key ? "text-green-600" : "text-gray-400"}`} />
              <span className={`text-sm font-medium ${paymentMethod === m.key ? "text-green-700" : "text-gray-600"}`}>{m.label}</span>
              {paymentMethod === m.key && <div className="ml-auto w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-500" /></div>}
            </button>
          );
        })}
      </div>

      {/* Demo: Simulate Failure */}
      <div className="mx-4 mt-3 flex items-center gap-2 bg-slate-100 rounded-xl p-3">
        <input type="checkbox" id="fail" checked={simulateFail} onChange={e => setSimulateFail(e.target.checked)} className="accent-red-500" />
        <label htmlFor="fail" className="text-xs text-slate-600">Demo: Simulate payment failure to test error state</label>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-30">
        <p className="text-xs text-gray-400 text-center mb-3">Payment is simulated for demo purposes. No real card data is stored.</p>
        <button onClick={handlePay} className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold transition-colors">
          Pay RM {order.totalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
