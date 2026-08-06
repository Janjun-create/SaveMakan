import { useParams, useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { ArrowLeft, MapPin, Clock, Star, BadgeCheck, AlertCircle, ChevronRight, Flame } from "lucide-react";

export default function StudentFoodDetails() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();

  const listing = state.listings.find(l => l.id === id);
  if (!listing) return (
    <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
      <div className="text-center">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p>Listing not found or no longer available.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-green-600 text-sm font-medium">← Go back</button>
      </div>
    </div>
  );

  const discount = Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100);
  const soldOut = listing.available === 0;
  const almostOut = listing.available <= 3 && listing.available > 0;

  return (
    <div className="bg-white min-h-screen pb-28">
      {/* Image */}
      <div className="relative">
        <img src={listing.image} alt={listing.name} className="w-full h-64 object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <div className="absolute top-4 right-4 bg-orange-500 text-white font-bold text-sm px-3 py-1 rounded-xl">
          {discount}% OFF
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Title & Vendor */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{listing.name}</h1>
          {listing.vendorVerified && <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />}
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-700">{listing.vendorRating}</span>
          <span className="text-gray-300 mx-1">·</span>
          <span className="text-sm text-gray-500">{listing.vendorName}</span>
          {listing.vendorVerified && (
            <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
          )}
        </div>

        {/* Price */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-700">RM {listing.discountedPrice.toFixed(2)}</div>
            <div className="text-sm text-gray-400 line-through">RM {listing.originalPrice.toFixed(2)}</div>
            <div className="text-xs text-green-600 font-medium mt-0.5">
              You save RM {(listing.originalPrice - listing.discountedPrice).toFixed(2)}
            </div>
          </div>
          <div className={`text-right ${soldOut ? "text-red-500" : almostOut ? "text-orange-500" : "text-gray-600"}`}>
            <div className="flex items-center gap-1 justify-end">
              {almostOut && <Flame className="w-4 h-4" />}
              <span className="text-lg font-bold">{listing.available}</span>
            </div>
            <div className="text-xs">portions left</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Pickup Location</div>
              <div className="text-sm font-medium text-gray-800">{listing.pickupLocation}</div>
              <div className="text-xs text-gray-400 mt-0.5">{listing.distance} from you</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" />Pickup Window</div>
              <div className="text-sm font-medium text-gray-800">{listing.availableFrom}</div>
              <div className="text-xs text-gray-500">to {listing.availableUntil}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Consume By</div>
              <div className="text-sm font-medium text-gray-800">{listing.consumeBy}</div>
              <div className="text-xs text-gray-500">as recommended</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">About This Food</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
        </div>

        {/* Food Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Food Information Disclaimer:</span> All food details including preparation time, ingredients, and recommended consumption time are provided by the vendor. The vendor remains fully responsible for food handling, food safety decisions, and information accuracy. SaveMakan facilitates the connection and does not guarantee food safety.
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 z-30">
        {soldOut ? (
          <div className="w-full bg-gray-100 text-gray-400 text-center py-3 rounded-xl font-medium text-sm">
            Sold Out
          </div>
        ) : (
          <button
            onClick={() => navigate(`/student/checkout/${listing.id}`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors"
          >
            Reserve Now — RM {listing.discountedPrice.toFixed(2)}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
