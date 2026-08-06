import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, MapPin, Clock, SlidersHorizontal, Users } from "lucide-react";
import { foodItems } from "../data/mockData";

type FilterType = "all" | "free" | "near" | "closing";

export default function FoodListingScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const getFilteredItems = () => {
    return foodItems.filter((item) => {
      // Filter out items with no quantity
      if (item.quantity === 0) return false;
      
      if (activeFilter === "all") return true;
      if (activeFilter === "free") return item.price === 0;
      if (activeFilter === "near") return item.distance <= 1;
      if (activeFilter === "closing") {
        const hour = parseInt(item.expiryTime.split(":")[0]);
        return hour <= 18;
      }
      return true;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg text-gray-900">Available Food</h1>
              <p className="text-xs text-gray-500">{filteredItems.length} items nearby</p>
            </div>
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                activeFilter === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveFilter("free")}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                activeFilter === "free"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Free Only
            </button>
            <button
              onClick={() => setActiveFilter("near")}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                activeFilter === "near"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nearest
            </button>
            <button
              onClick={() => setActiveFilter("closing")}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                activeFilter === "closing"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Closing Soon
            </button>
          </div>
        </div>
      </div>

      {/* Food List */}
      <main className="max-w-md mx-auto px-6 py-4">
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/food/${item.id}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex gap-4 p-4">
                {/* Image */}
                <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-base text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{item.vendor}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      <div className="flex items-center gap-1 text-green-600">
                        <MapPin className="w-3 h-3" />
                        <span>{item.distance}km away</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="w-3 h-3" />
                        <span>Until {item.expiryTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{item.quantity} left</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    {item.price === 0 ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        FREE
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-base text-gray-900">RM {item.price.toFixed(2)}</span>
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">No food items found</p>
            <p className="text-xs text-gray-400 mt-1">Try changing your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}