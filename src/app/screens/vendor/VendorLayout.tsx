import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { useApp } from "../../context/AppContext";
import { LayoutDashboard, List, ClipboardList, QrCode, Leaf, LogOut, Trash2, BarChart3 } from "lucide-react";

const navItems = [
  { path: "/vendor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/vendor/listings", label: "Listings", icon: List },
  { path: "/vendor/orders", label: "Orders", icon: ClipboardList },
  { path: "/vendor/scanner", label: "Scan QR", icon: QrCode },
  { path: "/vendor/unsold", label: "Unsold", icon: Trash2 },
];

export default function VendorLayout() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => { dispatch({ type: "LOGOUT" }); navigate("/"); };
  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const vendorId = state.currentUser?.vendorId;
  const vendor = state.vendors.find(v => v.id === vendorId);

  return (
    <div className="min-h-screen bg-[#F8F9F8] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30 shadow-sm">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SaveMakan</span>
          </div>
          <div className="text-xs text-gray-400 leading-none mb-0.5">Vendor Portal</div>
          <div className="text-sm font-semibold text-gray-800 leading-tight">{vendor?.name ?? state.currentUser?.name}</div>
          {vendor?.verified && (
            <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Verified</span>
          )}
        </div>

        <nav className="flex-1 py-3 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                  active ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                }`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
