import { Link, useParams } from "react-router";
import { MapPin, Clock, CheckCircle2, QrCode } from "lucide-react";
import { foodItems } from "../data/mockData";

export default function ClaimScreen() {
  const { id } = useParams();
  const item = foodItems.find(food => food.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Food item not found</p>
          <Link to="/" className="text-green-600 text-sm mt-2 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Success Header */}
      <div className="bg-green-600 px-6 py-8 text-white">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl mb-2">Claimed Successfully!</h1>
          <p className="text-green-50 text-sm">Your food is ready for pickup</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6">
        {/* Food Item Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-base text-gray-900 mb-1">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.vendor}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Pickup Time</p>
                  <p className="text-sm text-gray-900">{item.pickupTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Location</p>
                  <p className="text-sm text-gray-900">{item.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-sm text-gray-900 text-center mb-4">
            Show this QR code to the vendor
          </h3>
          
          {/* QR Code Placeholder */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-4">
            <div className="aspect-square bg-white rounded-lg shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-3" />
                <p className="text-xs text-gray-500">QR Code</p>
                <p className="text-[10px] text-gray-400 mt-1">Claim ID: RM-{id}-2024</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="text-xs text-green-800 text-center">
              This QR code is valid until pickup time ends
            </p>
          </div>
        </div>

        {/* Pickup Instructions */}
        <div className="bg-orange-50 rounded-2xl p-5 mb-6 border border-orange-100">
          <h3 className="text-sm text-gray-900 mb-3">Pickup Instructions</h3>
          <ol className="space-y-2 text-xs text-gray-700">
            <li className="flex gap-2">
              <span className="text-orange-600 flex-shrink-0">1.</span>
              <span>Arrive at the pickup location during the specified time</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-600 flex-shrink-0">2.</span>
              <span>Show this QR code to the vendor</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-600 flex-shrink-0">3.</span>
              <span>Collect your food and enjoy!</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-600 flex-shrink-0">4.</span>
              <span>Remember to bring your own container if possible</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to={`/confirmation/${item.id}`}
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl transition-colors"
          >
            Mark as Picked Up
          </Link>
          
          <Link
            to="/"
            className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center py-4 rounded-xl border border-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact the vendor directly
          </p>
        </div>
      </main>
    </div>
  );
}