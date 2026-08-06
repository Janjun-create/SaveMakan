import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, FoodListing } from "../../context/AppContext";
import { ArrowLeft, CheckCircle2, AlertCircle, ImagePlus } from "lucide-react";

const CATEGORIES = ["Rice", "Noodles", "Bread", "Snacks", "Drinks", "Others"];

export default function VendorAddFood() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", description: "", originalPrice: "", discountedPrice: "",
    quantity: "", category: "Rice", preparedAt: "", consumeBy: "",
    availableFrom: "", availableUntil: "", pickupLocation: "", image: "",
  });
  const [checks, setChecks] = useState({ today: false, accurate: false, packaging: false, safety: false });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const allChecked = Object.values(checks).every(Boolean);
  const canSubmit = form.name && form.originalPrice && form.discountedPrice && form.quantity && allChecked;

  const vendorId = state.currentUser?.vendorId ?? "v1";
  const vendor = state.vendors.find(v => v.id === vendorId);

  const handleSubmit = () => {
    const listing: FoodListing = {
      id: `l-${Date.now()}`,
      vendorId,
      vendorName: vendor?.name ?? state.currentUser?.name ?? "",
      vendorRating: vendor?.rating ?? 4.5,
      vendorVerified: vendor?.verified ?? false,
      name: form.name,
      image: form.image || `https://picsum.photos/seed/${form.name.slice(0, 8)}/600/400`,
      description: form.description,
      originalPrice: parseFloat(form.originalPrice) || 0,
      discountedPrice: parseFloat(form.discountedPrice) || 0,
      quantity: parseInt(form.quantity) || 0,
      available: parseInt(form.quantity) || 0,
      held: 0,
      category: form.category,
      preparedAt: form.preparedAt || "Now",
      consumeBy: form.consumeBy || "2:00 PM",
      availableFrom: form.availableFrom || "Now",
      availableUntil: form.availableUntil || "3:00 PM",
      pickupLocation: form.pickupLocation || vendor?.location || "Main Canteen",
      distance: "0.3 km",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_LISTING", listing });
    setSubmitted(true);
    setTimeout(() => navigate("/vendor/listings"), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Listing Published!</h2>
        <p className="text-gray-500 text-sm">Students can now discover and reserve your food.</p>
      </div>
    );
  }

  const discount = form.originalPrice && form.discountedPrice
    ? Math.round(((parseFloat(form.originalPrice) - parseFloat(form.discountedPrice)) / parseFloat(form.originalPrice)) * 100)
    : 0;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Add Surplus Food</h1>
      </div>

      <div className="space-y-5">
        {/* Food Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">Food Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Food Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Nasi Lemak Special"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Describe your food..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none h-20" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 bg-white">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Image URL (optional)</label>
              <input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">Pricing & Quantity</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Original Price (RM) *</label>
              <input type="number" min="0" step="0.50" value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)}
                placeholder="8.00" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Discounted Price (RM) *</label>
              <input type="number" min="0" step="0.50" value={form.discountedPrice} onChange={e => set("discountedPrice", e.target.value)}
                placeholder="4.00" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Quantity *</label>
              <input type="number" min="1" value={form.quantity} onChange={e => set("quantity", e.target.value)}
                placeholder="10" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
          {discount > 0 && (
            <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-xs text-orange-700">
              Students save <strong>{discount}% · RM {(parseFloat(form.originalPrice) - parseFloat(form.discountedPrice)).toFixed(2)}</strong> per portion
            </div>
          )}
        </div>

        {/* Timing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">Timing & Location</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "preparedAt", label: "Prepared At", ph: "11:30 AM" },
              { key: "consumeBy", label: "Consume By", ph: "3:00 PM" },
              { key: "availableFrom", label: "Available From", ph: "12:00 PM" },
              { key: "availableUntil", label: "Available Until", ph: "2:30 PM" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
                <input value={(form as Record<string, string>)[f.key]} onChange={e => set(f.key, e.target.value)}
                  placeholder={f.ph} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Pickup Location</label>
            <input value={form.pickupLocation} onChange={e => set("pickupLocation", e.target.value)}
              placeholder="e.g. Block A Canteen, Counter 3"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
          </div>
        </div>

        {/* Vendor Responsibility */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1 text-sm">Vendor Confirmation</h2>
          <p className="text-xs text-gray-400 mb-4">Please confirm all items before publishing.</p>
          <div className="space-y-3">
            {[
              { key: "today", text: "This food was prepared today and is fresh." },
              { key: "accurate", text: "All information provided is accurate and up-to-date." },
              { key: "packaging", text: "Packaging information is accurate and food is properly packaged." },
              { key: "safety", text: "I understand that I, as the vendor, am fully responsible for food handling and food safety decisions." },
            ].map(item => (
              <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={(checks as Record<string, boolean>)[item.key]}
                  onChange={e => setChecks(c => ({ ...c, [item.key]: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-relaxed">{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        {!allChecked && form.name && (
          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Please confirm all vendor responsibility checkboxes before publishing.</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={!canSubmit}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-xl font-semibold transition-colors">
          Publish Listing
        </button>
      </div>
    </div>
  );
}
