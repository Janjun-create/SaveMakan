import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Leaf, RotateCcw, Trash2, ChevronRight } from "lucide-react";

const REASONS = ["Low demand", "Overproduction", "Event cancellation", "Late listing", "Other"];

export default function VendorUnsoldFood() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const vendorId = state.currentUser?.vendorId ?? "v1";
  const unsoldListings = state.listings.filter(l => l.vendorId === vendorId && l.status === "UNSOLD");
  const activeEndedListings = state.listings.filter(l => l.vendorId === vendorId && l.status === "ACTIVE" && l.available > 0);

  const [step, setStep] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<Record<string, string>>({});
  const [suitable, setSuitable] = useState<Record<string, boolean | null>>({});
  const [completed, setCompleted] = useState<Record<string, string>>({});

  const startFlow = (id: string) => {
    dispatch({ type: "RECORD_UNSOLD", listingId: id, reason: "" });
    setStep(s => ({ ...s, [id]: 1 }));
  };

  const handleSuitable = (id: string, val: boolean) => {
    setSuitable(s => ({ ...s, [id]: val }));
    setStep(s => ({ ...s, [id]: 3 }));
  };

  const finalize = (id: string, action: string) => {
    const listing = state.listings.find(l => l.id === id)!;
    if (action === "waste") {
      const wasteRecord = {
        id: `w-${Date.now()}`,
        vendorId,
        vendorName: listing.vendorName,
        listingId: id,
        foodName: listing.name,
        foodType: listing.category,
        weight: parseFloat((listing.available * 0.3).toFixed(1)),
        quantity: listing.available,
        reason: reason[id] ?? "Other",
        notes: "",
        date: new Date().toISOString().split("T")[0],
        status: "AWAITING_COLLECTION" as const,
      };
      dispatch({ type: "ADD_WASTE_RECORD", record: wasteRecord });
      dispatch({ type: "UPDATE_LISTING", listingId: id, updates: { status: "WASTE_RECORDED" }, changedBy: state.currentUser?.name ?? "Vendor" });
    } else if (action === "relist") {
      dispatch({ type: "UPDATE_LISTING", listingId: id, updates: { status: "ACTIVE" }, changedBy: state.currentUser?.name ?? "Vendor" });
    }
    setCompleted(c => ({ ...c, [id]: action }));
  };

  const allListing = [...unsoldListings, ...activeEndedListings];

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Unsold Food Management</h1>
      <p className="text-sm text-gray-500 mb-6">Record the outcome of unsold food to complete the sustainability tracking cycle.</p>

      {allListing.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No unsold food to record at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allListing.map(listing => {
            const s = step[listing.id] ?? 0;
            const done = completed[listing.id];

            if (done) {
              return (
                <div key={listing.id} className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-semibold text-green-700 text-sm">{listing.name}</div>
                    <div className="text-xs text-green-600">
                      {done === "waste" ? "Recorded as organic waste — collection request sent to compost partners." :
                       done === "relist" ? "Relisted for students to purchase." :
                       "Outcome recorded."}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Listing Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <img src={listing.image} alt={listing.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{listing.name}</div>
                    <div className="text-xs text-gray-500">{listing.available} portions remaining</div>
                    <div className="text-xs text-gray-400">Available until: {listing.availableUntil}</div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Step 0: Initiate */}
                  {s === 0 && (
                    <button onClick={() => startFlow(listing.id)}
                      className="w-full bg-orange-50 border border-orange-200 text-orange-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Start Unsold Food Recording
                    </button>
                  )}

                  {/* Step 1: Reason */}
                  {s === 1 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-3">What happened to the remaining food?</p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {REASONS.map(r => (
                          <button key={r} onClick={() => setReason(rs => ({ ...rs, [listing.id]: r }))}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                              reason[listing.id] === r ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"
                            }`}>
                            {r}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => reason[listing.id] && setStep(s => ({ ...s, [listing.id]: 2 }))}
                        disabled={!reason[listing.id]}
                        className="w-full bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Suitable? */}
                  {s === 2 && (
                    <div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                          <strong>Vendor responsibility:</strong> You are responsible for evaluating whether this food is still safe based on appropriate food safety practices. SaveMakan does not determine food safety.
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mb-3">Is the remaining food still suitable for consumption?</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleSuitable(listing.id, true)}
                          className="py-3 rounded-xl text-sm font-semibold bg-green-50 border border-green-300 text-green-700 hover:bg-green-100">
                          Yes, still suitable
                        </button>
                        <button onClick={() => handleSuitable(listing.id, false)}
                          className="py-3 rounded-xl text-sm font-semibold bg-red-50 border border-red-300 text-red-600 hover:bg-red-100">
                          No, not suitable
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Action */}
                  {s === 3 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        {suitable[listing.id] ? "What would you like to do with the food?" : "Record this food as organic waste for collection."}
                      </p>
                      {suitable[listing.id] ? (
                        <div className="space-y-2">
                          <button onClick={() => finalize(listing.id, "relist")}
                            className="w-full flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-green-100">
                            <RotateCcw className="w-4 h-4" />Relist for Students
                          </button>
                          <button onClick={() => finalize(listing.id, "donate")}
                            className="w-full flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-blue-100">
                            <Leaf className="w-4 h-4" />Donate to Campus Community
                          </button>
                          <button onClick={() => finalize(listing.id, "waste")}
                            className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 text-gray-600 py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-100">
                            <Trash2 className="w-4 h-4" />Record as Organic Waste
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => finalize(listing.id, "waste")}
                          className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-orange-700">
                          <Trash2 className="w-4 h-4" />
                          Record as Organic Waste & Request Collection
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
