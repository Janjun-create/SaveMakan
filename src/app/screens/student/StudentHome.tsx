import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useApp, FoodListing } from "../../context/AppContext";
import { Search, Filter, Clock, MapPin, Star, BadgeCheck, Flame, Zap } from "lucide-react";

const CATEGORIES = ["All", "Rice", "Noodles", "Bread", "Snacks", "Drinks"];
const SORT_OPTIONS = [
  { value: "discount", label: "Highest Discount" },
  { value: "price", label: "Lowest Price" },
  { value: "distance", label: "Nearest" },
  { value: "ending", label: "Ending Soon" },
];

function FoodCard({ listing, onPress }: { listing: FoodListing; onPress: () => void }) {
  const discount = Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100);
  const isAlmostOut = listing.available <= 3 && listing.available > 0;

  return (
    <button onClick={onPress} className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-left transition-all active:scale-[0.98] hover:shadow-md">
      <div className="relative">
        <img src={listing.image} alt={listing.name} className="w-full h-44 object-cover" />
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          {discount}% OFF
        </div>
        {isAlmostOut && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <Flame className="w-3 h-3" /> {listing.available} left
          </div>
        )}
        {!isAlmostOut && listing.available > 0 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
            {listing.available} left
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">{listing.name}</h3>
          {listing.vendorVerified && <BadgeCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />}
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-500">{listing.vendorRating}</span>
          <span className="text-gray-300 mx-1">·</span>
          <span className="text-xs text-gray-500">{listing.vendorName}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-600 font-bold text-base">RM {listing.discountedPrice.toFixed(2)}</span>
            <span className="text-gray-400 text-xs line-through ml-1.5">RM {listing.originalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.distance}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{listing.availableUntil}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function StudentHome() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("discount");

  const activeListings = useMemo(() =>
    state.listings.filter(l => l.status === "ACTIVE" && l.available > 0),
    [state.listings]
  );

  const filtered = useMemo(() => {
    let list = activeListings.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.vendorName.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || l.category === category;
      return matchSearch && matchCat;
    });
    if (sort === "discount") list = [...list].sort((a, b) => (b.originalPrice - b.discountedPrice) / b.originalPrice - (a.originalPrice - a.discountedPrice) / a.originalPrice);
    if (sort === "price") list = [...list].sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sort === "distance") list = [...list].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    if (sort === "ending") list = [...list].sort((a, b) => a.availableUntil.localeCompare(b.availableUntil));
    return list;
  }, [activeListings, search, category, sort]);

  const endingSoon = useMemo(() =>
    activeListings.filter(l => l.available <= 3 || l.availableUntil <= "2:00 PM").slice(0, 3),
    [activeListings]
  );

  const popular = useMemo(() =>
    [...activeListings].sort((a, b) => b.vendorRating - a.vendorRating).slice(0, 3),
    [activeListings]
  );

  const savings = activeListings.reduce((sum, l) => sum + (l.originalPrice - l.discountedPrice), 0);

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-4 mb-4 text-white">
        <div className="text-sm opacity-80 mb-0.5">Good afternoon,</div>
        <div className="font-bold text-lg">{state.currentUser?.name.split(" ")[0]} 👋</div>
        <div className="mt-2 text-sm opacity-90">
          <span className="font-semibold">{activeListings.length} deals</span> available · Save up to{" "}
          <span className="font-semibold">RM {savings.toFixed(0)}</span> today
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search food or vendor..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-green-400"
        />
      </div>

      {/* Sort */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        {SORT_OPTIONS.map(o => (
          <button
            key={o.value}
            onClick={() => setSort(o.value)}
            className={`text-xs px-3 py-1.5 rounded-full flex-shrink-0 font-medium transition-all ${
              sort === o.value ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs px-4 py-1.5 rounded-full flex-shrink-0 font-medium transition-all ${
              category === c ? "bg-green-100 text-green-700 border border-green-300" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Ending Soon */}
      {!search && category === "All" && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-red-500" />
            <h2 className="font-bold text-gray-900 text-sm">Ending Soon</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 mb-5">
            {endingSoon.map(l => (
              <FoodCard key={l.id} listing={l} onPress={() => navigate(`/student/food/${l.id}`)} />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-gray-900 text-sm">Popular Deals</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 mb-5">
            {popular.map(l => (
              <FoodCard key={l.id} listing={l} onPress={() => navigate(`/student/food/${l.id}`)} />
            ))}
          </div>
        </>
      )}

      {/* All listings */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900 text-sm">
          {search || category !== "All" ? `Results (${filtered.length})` : "All Available"}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No food found matching your search.</p>
          </div>
        ) : (
          filtered.map(l => (
            <FoodCard key={l.id} listing={l} onPress={() => navigate(`/student/food/${l.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
