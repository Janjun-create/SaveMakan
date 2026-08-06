import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { ArrowLeft, Clock, AlertCircle, MinusCircle, PlusCircle, ChevronRight } from "lucide-react";

export default function StudentCheckout() {
  const { id } = useParams<{ id: string }>();
  const { state, reserveFood } = useApp();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);

  const listing = state.listings.find(l => l.id === id);
  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-gray-400">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>Listing not found.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-green-600 text-sm">← Go back</button>
        </div>
      </div>
    );
  }

  const maxQty = Math.min(listing.available, 5);

  const handleReserve = useCallback(() => {
    setReserving(true);
    setError("");
    // Simulate concurrent access — add a brief artificial delay
    setTimeout(() => {
      const result = reserveFood(listing.id, qty);
      if (result.success && result.orderId) {
        navigate(`/student/payment/${result.orderId}`);
      } else {
        setError(result.message);
        setReserving(false);
      }
    }, 600);
  }, [listing.id, qty, reserveFood, navigate]);

  return (
    <div className="min-h-screen bg-[#F7F9F7] pb-32">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-900">Reserve Food</h2>
      </div>

      {/* Reservation Notice */}
      <div className="mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
        <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700">
          <span className="font-semibold">Reserved for you — complete payment within 5 minutes.</span> Your selected quantity will be held exclusively for you. If payment is not completed, the item becomes available to other students.
        </div>
      </div>

      {/* Food Summary */}
      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <img src={listing.image} alt={listing.name} className="w-full h-36 object-cover" />
        <div className="p-4">
          <h3 className="font-bold text-gray-900">{listing.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{listing.vendorName} · {listing.pickupLocation}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-green-600 font-bold text-lg">RM {listing.discountedPrice.toFixed(2)}</span>
              <span className="text-gray-400 text-xs line-through ml-1.5">RM {listing.originalPrice.toFixed(2)}</span>
            </div>
            <span className="text-xs text-gray-500">{listing.available} available</span>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">Quantity</div>
            <div className="text-xs text-gray-400 mt-0.5">Max {maxQty} per order</div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
              <MinusCircle className={`w-8 h-8 ${qty <= 1 ? "text-gray-200" : "text-green-500"}`} />
            </button>
            <span className="text-xl font-bold text-gray-900 w-6 text-center">{qty}</span>
            <button onClick={() => setQty(q => Math.min(maxQty, q + 1))} disabled={qty >= maxQty}>
              <PlusCircle className={`w-8 h-8 ${qty >= maxQty ? "text-gray-200" : "text-green-500"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Concurrent Reservation Demo */}
      <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="text-xs font-semibold text-amber-700 mb-1">Demo: Concurrent Reservation Logic</div>
        <div className="text-xs text-amber-600 leading-relaxed">
          If {listing.available} portion{listing.available > 1 ? "s are" : " is"} available and multiple students reserve simultaneously, only the first successful request claims the inventory. Others receive a real-time "already reserved" message. Payment timeout releases the hold automatically.
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 text-sm">Total ({qty} × RM {listing.discountedPrice.toFixed(2)})</span>
          <span className="text-green-700 font-bold text-lg">RM {(qty * listing.discountedPrice).toFixed(2)}</span>
        </div>
        <button
          onClick={handleReserve}
          disabled={reserving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {reserving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Securing your reservation...
            </>
          ) : (
            <>
              Proceed to Payment
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
