import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { useApp } from "../../context/AppContext";
import { Home, List, ClipboardList, User, Leaf, LogOut } from "lucide-react";

const navItems = [
  { path: "/student", label: "Home", icon: Home, exact: true },
  { path: "/student/listings", label: "Browse", icon: List },
  { path: "/student/orders", label: "My Orders", icon: ClipboardList },
  { path: "/student/profile", label: "Profile", icon: User },
];

export default function StudentLayout() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col max-w-md mx-auto relative">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">SaveMakan</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500 leading-none">Signed in as</div>
            <div className="text-xs font-semibold text-gray-900 leading-none mt-0.5">{state.currentUser?.name.split(" ")[0]}</div>
          </div>
          <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          return (
            <Link key={item.path} to={item.path} className="flex-1 flex flex-col items-center py-2 gap-0.5">
              <Icon className={`w-5 h-5 transition-colors ${active ? "text-green-600" : "text-gray-400"}`} />
              <span className={`text-[10px] font-medium transition-colors ${active ? "text-green-600" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
