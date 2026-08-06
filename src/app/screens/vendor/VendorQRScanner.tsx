import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { QrCode, CheckCircle2, XCircle, AlertCircle, Camera, RefreshCw } from "lucide-react";

type ScanResult = "idle" | "valid" | "used" | "expired" | "invalid" | "scanning";

const DEMO_CODES: Record<string, string> = {
  "SM-O2-7F3A9B": "valid",
  "SM-O1-QR-DONE": "used",
  "SM-EXPIRED-TEST": "expired",
};

export default function VendorQRScanner() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScanResult>("idle");
  const [scannedOrder, setScannedOrder] = useState<typeof state.orders[0] | null>(null);
  const [scanning, setScanning] = useState(false);

  const processCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const order = state.orders.find(o => o.qrCode === trimmed);

    if (!order && DEMO_CODES[trimmed] === "expired") { setResult("expired"); return; }
    if (!order) { setResult("invalid"); return; }

    if (order.qrStatus === "USED") { setResult("used"); setScannedOrder(order); return; }
    if (order.qrStatus === "EXPIRED") { setResult("expired"); setScannedOrder(order); return; }
    if (order.qrStatus === "VALID") {
      dispatch({ type: "SCAN_QR", qrCode: trimmed });
      setScannedOrder(order);
      setResult("valid");
      return;
    }
    setResult("invalid");
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      // Auto-scan the first valid order for demo
      const validOrder = state.orders.find(o => o.qrStatus === "VALID" && o.vendorId === (state.currentUser?.vendorId ?? "v1"));
      if (validOrder) {
        setInput(validOrder.qrCode);
        processCode(validOrder.qrCode);
      } else {
        setResult("invalid");
      }
    }, 1500);
  };

  const reset = () => { setResult("idle"); setInput(""); setScannedOrder(null); };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
      <p className="text-sm text-gray-500 mb-6">Scan the student's QR code to confirm food pickup.</p>

      {result === "idle" || scanning ? (
        <div className="space-y-4">
          {/* Camera Viewfinder */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden relative">
            <div className="aspect-square flex flex-col items-center justify-center gap-4 p-8">
              {scanning ? (
                <>
                  <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-green-400 text-sm font-medium">Scanning...</p>
                </>
              ) : (
                <>
                  {/* Simulated viewfinder */}
                  <div className="relative w-48 h-48 border-2 border-white/20 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-white/30" />
                    </div>
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-400/60 animate-pulse" />
                  </div>
                  <p className="text-white/60 text-sm">Point camera at QR code</p>
                </>
              )}
            </div>
          </div>

          <button onClick={simulateScan} disabled={scanning}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
            <Camera className="w-5 h-5" />
            {scanning ? "Scanning..." : "Simulate Camera Scan (Demo)"}
          </button>

          <div className="text-center text-sm text-gray-400">— or enter code manually —</div>

          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
              placeholder="Enter QR code (e.g. SM-O2-7F3A9B)" onKeyDown={e => e.key === "Enter" && processCode(input)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-green-400 uppercase" />
            <button onClick={() => processCode(input)} className="bg-green-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-green-700">
              Scan
            </button>
          </div>

          {/* Demo codes */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-xs font-semibold text-slate-600 mb-2">Demo QR Codes:</div>
            <div className="space-y-1">
              {Object.entries(DEMO_CODES).map(([code, status]) => (
                <button key={code} onClick={() => { setInput(code); processCode(code); }}
                  className="w-full text-left text-xs font-mono text-slate-500 hover:text-green-600 py-0.5 transition-colors">
                  {code} → <span className={`font-semibold ${status === "valid" ? "text-green-600" : "text-red-500"}`}>{status}</span>
                </button>
              ))}
              {state.orders.filter(o => o.qrStatus === "VALID" && o.vendorId === (state.currentUser?.vendorId ?? "v1")).map(o => (
                <button key={o.qrCode} onClick={() => { setInput(o.qrCode); processCode(o.qrCode); }}
                  className="w-full text-left text-xs font-mono text-slate-500 hover:text-green-600 py-0.5 transition-colors">
                  {o.qrCode} → <span className="font-semibold text-green-600">valid (live)</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Result States */
        <div className="space-y-4">
          {result === "valid" && (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-xl font-bold text-green-700 mb-1">Pickup Confirmed!</h2>
              <p className="text-green-600 text-sm mb-4">QR code is valid. Order marked as picked up.</p>
              {scannedOrder && (
                <div className="bg-white rounded-xl p-4 text-left">
                  <div className="text-sm font-semibold text-gray-900">{scannedOrder.foodName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Student: {scannedOrder.studentName}</div>
                  <div className="text-xs text-gray-500">Qty: {scannedOrder.quantity} · RM {scannedOrder.totalPrice.toFixed(2)}</div>
                </div>
              )}
            </div>
          )}

          {result === "used" && (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-600 mb-1">Already Used</h2>
              <p className="text-gray-500 text-sm">This QR code has already been scanned. Each code can only be used once.</p>
            </div>
          )}

          {(result === "expired" || result === "invalid") && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-xl font-bold text-red-600 mb-1">{result === "expired" ? "QR Code Expired" : "Invalid QR Code"}</h2>
              <p className="text-red-500 text-sm">
                {result === "expired" ? "This QR code has expired. Please ask the student to contact support." : "This QR code is not valid. Please try again or check the code."}
              </p>
            </div>
          )}

          <button onClick={reset} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
}
