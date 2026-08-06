import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, FoodListing, ListingStatus } from "../../context/AppContext";
import { Plus, Edit3, Pause, Trash2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "text-gray-500 bg-gray-100" },
  ACTIVE: { label: "Active", color: "text-green-600 bg-green-100" },
  SOLD_OUT: { label: "Sold Out", color: "text-orange-600 bg-orange-100" },
  UNSOLD: { label: "Unsold", color: "text-red-600 bg-red-100" },
  WASTE_RECORDED: { label: "Waste Recorded", color: "text-gray-500 bg-gray-100" },
  RECYCLED: { label: "Recycled", color: "text-teal-600 bg-teal-100" },
};

function EditModal({ listing, onClose }: { listing: FoodListing; onClose: () => void }) {
  const { dispatch, state } = useApp();
  const [qty, setQty] = useState(String(listing.available));
  const [price, setPrice] = useState(String(listing.discountedPrice));
  const [until, setUntil] = useState(listing.availableUntil);

  const save = () => {
    const updates: Partial<FoodListing> = {};
    if (qty !== String(listing.available)) { updates.available = parseInt(qty); updates.quantity = parseInt(qty); }
    if (price !== String(listing.discountedPrice)) updates.discountedPrice = parseFloat(price);
    if (until !== listing.availableUntil) updates.availableUntil = until;
    if (Object.keys(updates).length > 0) {
      dispatch({ type: "UPDATE_LISTING", listingId: listing.id, updates, changedBy: state.currentUser?.name ?? "Vendor" });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 className="font-bold text-gray-900 mb-1">Edit Listing</h3>
        <p className="text-xs text-gray-500 mb-4">Changes are logged in the audit history.</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Available Quantity</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="0"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Discounted Price (RM)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} step="0.50" min="0"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Available Until</label>
            <input value={until} onChange={e => setUntil(e.target.value)} placeholder="3:00 PM"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={save} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function VendorListings() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<FoodListing | null>(null);
  const [tab, setTab] = useState<"active" | "all">("active");

  const vendorId = state.currentUser?.vendorId ?? "v1";
  const allListings = state.listings.filter(l => l.vendorId === vendorId);
  const displayed = tab === "active" ? allListings.filter(l => l.status === "ACTIVE") : allListings;

  const markSoldOut = (id: string) => {
    dispatch({ type: "UPDATE_LISTING", listingId: id, updates: { status: "SOLD_OUT", available: 0 }, changedBy: state.currentUser?.name ?? "Vendor" });
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
        <button onClick={() => navigate("/vendor/add")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Food
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {[{ k: "active", l: "Active" }, { k: "all", l: "All Listings" }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k as "active" | "all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.k ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}>
            {t.l} ({t.k === "active" ? allListings.filter(l => l.status === "ACTIVE").length : allListings.length})
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-gray-400 text-sm mb-3">No listings found</div>
          <button onClick={() => navigate("/vendor/add")} className="text-green-600 text-sm font-medium">+ Add your first listing</button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(l => {
            const cfg = STATUS_CONFIG[l.status];
            const discount = Math.round(((l.originalPrice - l.discountedPrice) / l.originalPrice) * 100);
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex">
                  <img src={l.image} alt={l.name} className="w-24 h-24 object-cover flex-shrink-0" />
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{l.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="text-green-600 font-semibold">RM {l.discountedPrice.toFixed(2)}</span>
                      <span className="line-through text-gray-400">RM {l.originalPrice.toFixed(2)}</span>
                      <span className="text-orange-500 font-medium">{discount}% off</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{l.available} available</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Until {l.availableUntil}</span>
                    </div>
                  </div>
                </div>
                {l.status === "ACTIVE" && (
                  <div className="flex border-t border-gray-100">
                    <button onClick={() => setEditing(l)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100">
                      <Edit3 className="w-3.5 h-3.5" />Edit
                    </button>
                    <button onClick={() => markSoldOut(l.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs text-orange-500 hover:bg-orange-50 transition-colors">
                      <Pause className="w-3.5 h-3.5" />Mark Sold Out
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && <EditModal listing={editing} onClose={() => setEditing(null)} />}

      {/* Audit Log */}
      {state.auditLogs.filter(l => state.listings.find(li => li.id === l.entityId && li.vendorId === vendorId)).length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">Recent Changes (Audit Log)</h2>
          <div className="space-y-2">
            {state.auditLogs.slice(-5).reverse().map(log => (
              <div key={log.id} className="text-xs text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span><span className="font-medium text-gray-700">{log.changedBy}</span> changed <span className="font-medium text-gray-700">{log.field}</span> from "{log.previousValue}" → "{log.newValue}"</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
