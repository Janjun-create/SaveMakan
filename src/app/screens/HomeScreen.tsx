import { Link } from "react-router";
import { MapPin, Clock, Leaf, List } from "lucide-react";
import { foodItems } from "../data/mockData";
import { Users } from "lucide-react";

export default function HomeScreen() {
  const nearbyFood = foodItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8 pb-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-8 h-8" />
            <h1 className="text-[28px]">Rescue Makan</h1>
          </div>
          <p className="text-green-50 text-sm">Rescue Food, Reduce Waste</p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-xs text-green-50 mb-1">Your Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Universiti Malaya, KL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 -mt-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">Nearby Rescued Food</h2>
            <Link 
              to="/listing"
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            >
              <List className="w-4 h-4" />
              <span>View All</span>
            </Link>
          </div>

          {/* Food Cards */}
          <div className="space-y-3 mb-6">
            {foodItems.filter(item => item.quantity > 0).slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/food/${item.id}`}
                className="block"
              >
                <div className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base text-gray-900 mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">{item.vendor}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <MapPin className="w-3 h-3" />
                        <span>{item.distance}km</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="w-3 h-3" />
                        <span>{item.pickupTime.split(' - ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{item.quantity} left</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      {item.price === 0 ? (
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                          FREE
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">RM {item.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-400 line-through">
                            RM {item.originalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-5 mb-6 border border-green-100">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-green-600" />
            <h3 className="text-sm text-gray-900">Community Impact</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl text-green-700 mb-1">1,234</div>
              <div className="text-xs text-gray-600">Meals Rescued</div>
            </div>
            <div>
              <div className="text-2xl text-orange-700 mb-1">568kg</div>
              <div className="text-xs text-gray-600">Waste Prevented</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 border border-gray-100">
          <h3 className="text-sm text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0">
                1
              </div>
              <p className="text-xs text-gray-600 pt-0.5">Browse nearby rescued food from campus vendors</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0">
                2
              </div>
              <p className="text-xs text-gray-600 pt-0.5">Claim your food item before it expires</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0">
                3
              </div>
              <p className="text-xs text-gray-600 pt-0.5">Pick up at the vendor and help reduce waste!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}