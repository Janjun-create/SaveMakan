import { Link, useParams } from "react-router";
import { ArrowLeft, MapPin, Clock, Star, Users } from "lucide-react";
import { foodItems } from "../data/mockData";

export default function FoodDetailsScreen() {
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
    <div className="min-h-screen bg-white">
      {/* Header with Image */}
      <div className="relative">
        <div className="h-64 bg-gray-100">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <Link 
          to="/listing"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>

        {item.price === 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-600 text-white rounded-full text-xs">
            FREE
          </div>
        )}
      </div>

      {/* Content */}
      <main className="max-w-md mx-auto px-6 py-6">
        {/* Title and Price */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">{item.name}</h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{item.vendor}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < item.hygieneRating
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {item.price > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-2xl text-gray-900">RM {item.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">
                RM {item.originalPrice.toFixed(2)}
              </span>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs ml-auto">
                {Math.round((1 - item.price / item.originalPrice) * 100)}% off
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Pickup Time</span>
            </div>
            <p className="text-sm text-gray-900">{item.pickupTime}</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Best Before</span>
            </div>
            <p className="text-sm text-gray-900">{item.expiryTime}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">Available</span>
            </div>
            <p className="text-sm text-gray-900">{item.quantity} portions</p>
          </div>

          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
            <div className="flex items-center gap-2 text-violet-600 mb-1">
              <Star className="w-4 h-4" />
              <span className="text-xs">Hygiene</span>
            </div>
            <p className="text-sm text-gray-900">{item.hygieneRating}/5 Stars</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-900 mb-1">Pickup Location</h3>
              <p className="text-sm text-gray-600">{item.location}</p>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                <MapPin className="w-3 h-3" />
                <span>{item.distance}km away from you</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tag */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {item.category}
          </span>
        </div>

        {/* Claim Button */}
        <Link
          to={`/claim/${item.id}`}
          className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl transition-colors shadow-lg"
        >
          Claim This Food
        </Link>

        <p className="text-xs text-gray-500 text-center mt-3">
          By claiming, you commit to picking up the food during the specified time
        </p>
      </main>
    </div>
  );
}