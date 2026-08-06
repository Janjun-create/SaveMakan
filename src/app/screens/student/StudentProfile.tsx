import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { User, Mail, Building2, Leaf, Star, ShoppingBag, LogOut, ChevronRight, Flag } from "lucide-react";

export default function StudentProfile() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const user = state.currentUser;

  const myOrders = state.orders.filter(o => o.studentId === user?.id);
  const completed = myOrders.filter(o => o.status === "COMPLETED" || o.status === "PICKED_UP").length;
  const totalSaved = myOrders.filter(o => ["PAID","READY_FOR_PICKUP","PICKED_UP","COMPLETED"].includes(o.status))
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const logout = () => { dispatch({ type: "LOGOUT" }); navigate("/"); };

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-5 text-white mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {user?.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">{user?.name}</div>
            <div className="text-green-100 text-sm mt-0.5">{user?.email}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Building2 className="w-3.5 h-3.5 text-green-200" />
              <span className="text-green-100 text-xs">Universiti Malaya</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-xl font-bold">{completed}</div>
            <div className="text-xs text-green-100">Meals Rescued</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">RM {totalSaved.toFixed(0)}</div>
            <div className="text-xs text-green-100">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{(completed * 0.3).toFixed(1)}kg</div>
            <div className="text-xs text-green-100">Waste Prevented</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 mb-4">
        {[
          { icon: ShoppingBag, label: "My Orders", action: () => navigate("/student/orders") },
          { icon: Star, label: "My Reviews", action: () => {} },
          { icon: Flag, label: "Report an Issue", action: () => {} },
          { icon: Leaf, label: "My Impact Report", action: () => {} },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
              <Icon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 flex-1">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          );
        })}
      </div>

      {/* SDG Badge */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold text-green-800">Supporting SDG 12</div>
          <div className="text-xs text-green-600">Responsible Consumption & Production</div>
        </div>
      </div>

      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
