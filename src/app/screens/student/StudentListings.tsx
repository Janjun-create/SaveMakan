import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useApp, FoodListing } from "../../context/AppContext";
import { Search, SlidersHorizontal, MapPin, Clock, Star, BadgeCheck, Flame } from "lucide-react";

const CATEGORIES = ["All", "Rice", "Noodles", "Bread", "Snacks", "Drinks"];

function ListItem({ listing, onPress }: { listing: FoodListing; onPress: () => void }) {
  const discount = Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100);
  const almostOut = listing.available <= 3;
  return (
    <button onClick={onPress} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 p-3 text-left transition-all active:scale-[0.99] hover:shadow-md">
      <div className="relative flex-shrink-0">
        <img src={listing.image} alt={listing.name} className="w-20 h-20 rounded-xl object-cover" />
        <div className="absolute -top-1 -left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {discount}%
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1 mb-0.5">
          <span className="font-semibold text-gray-900 text-sm leading-tight flex-1 truncate">{listing.name}</span>
          {listing.vendorVerified && <BadgeCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />}
        </div>
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-500">{listing.vendorRating} · {listing.vendorName}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-600 font-bold text-sm">RM {listing.discountedPrice.toFixed(2)}</span>
            <span className="text-gray-400 text-xs line-through ml-1">RM {listing.originalPrice.toFixed(2)}</span>
          </div>
          <div className={`flex items-center gap-0.5 text-xs font-medium ${almostOut ? "text-red-500" : "text-gray-400"}`}>
            {almostOut && <Flame className="w-3 h-3" />}
            {listing.available} left
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{listing.distance}</span>
          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />Until {listing.availableUntil}</span>
        </div>
      </div>
    </button>
  );
}

export default function StudentListings() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(20);

  const activeListings = useMemo(() =>
    state.listings.filter(l => l.status === "ACTIVE" && l.available > 0),
    [state.listings]
  );

  const filtered = useMemo(() =>
    activeListings.filter(l => {
      const ms = l.name.toLowerCase().includes(search.toLowerCase()) || l.vendorName.toLowerCase().includes(search.toLowerCase());
      const mc = category === "All" || l.category === category;
      const mp = l.discountedPrice <= maxPrice;
      return ms && mc && mp;
    }),
    [activeListings, search, category, maxPrice]
  );

  return (
    <div className="px-4 pt-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Browse Food</h1>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food, vendor..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-green-400" />
      </div>

      {/* Price filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 flex items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Max Price</span><span className="text-green-600 font-semibold">RM {maxPrice}</span>
          </div>
          <input type="range" min={1} max={20} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full accent-green-600" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`text-xs px-4 py-1.5 rounded-full flex-shrink-0 font-medium transition-all ${
              category === c ? "bg-green-100 text-green-700 border border-green-300" : "bg-white text-gray-500 border border-gray-200"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-400 mb-3">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>

      <div className="space-y-3">
        {filtered.map(l => (
          <ListItem key={l.id} listing={l} onPress={() => navigate(`/student/food/${l.id}`)} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No food found matching your filters.</div>
        )}
      </div>
    </div>
  );
}
