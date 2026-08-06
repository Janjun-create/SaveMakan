import { Link, useParams } from "react-router";
import { CheckCircle2, Leaf, Heart, TrendingDown, Sparkles } from "lucide-react";
import { foodItems } from "../data/mockData";

export default function PickupConfirmationScreen() {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50">
      {/* Success Animation Header */}
      <div className="px-6 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <h1 className="text-3xl text-gray-900 mb-3">
            Well Done!
          </h1>
          <p className="text-base text-gray-600 mb-2">
            You've successfully rescued food
          </p>
          <p className="text-sm text-green-600">
            Thank you for making a difference! 🌍
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <main className="max-w-md mx-auto px-6 pb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-6 h-6" />
            <h2 className="text-lg">Your Impact Today</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-1">1</div>
              <div className="text-sm text-green-50">Meal Saved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-1">0.5kg</div>
              <div className="text-sm text-green-50">Waste Reduced</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-50">CO₂ Emissions Saved</span>
              <span className="text-white">~1.2kg</span>
            </div>
          </div>
        </div>

        {/* Food Details */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-3">You Rescued</h3>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-base text-gray-900 mb-1">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.vendor}</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact Cards */}
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-900 mb-1">Food Waste Prevented</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  You prevented perfectly good food from ending up in landfills
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-900 mb-1">Carbon Footprint Reduced</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Less waste means lower greenhouse gas emissions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-violet-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-900 mb-1">Community Support</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  You supported local campus vendors and sustainability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-5 mb-6 border border-orange-100">
          <h3 className="text-sm text-gray-900 text-center mb-2">
            Share Your Impact
          </h3>
          <p className="text-xs text-gray-600 text-center mb-4">
            Inspire your friends to rescue food too!
          </p>
          <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm border border-gray-200 transition-colors">
            Share on Social Media
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl transition-colors shadow-lg"
          >
            Rescue More Food
          </Link>
          
          <Link
            to="/listing"
            className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center py-4 rounded-xl border border-gray-200 transition-colors"
          >
            Browse All Items
          </Link>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Together, we're building a sustainable campus
          </p>
          <div className="flex items-center justify-center gap-1 text-green-600">
            <Leaf className="w-4 h-4" />
            <span className="text-xs">Rescue Makan</span>
          </div>
        </div>
      </main>
    </div>
  );
}