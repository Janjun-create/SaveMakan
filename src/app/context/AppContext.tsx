import { createContext, useContext, useReducer, ReactNode } from "react";

export type UserRole = "student" | "vendor" | "admin" | "compost";
export type ListingStatus = "DRAFT" | "ACTIVE" | "SOLD_OUT" | "UNSOLD" | "WASTE_RECORDED" | "RECYCLED";
export type OrderStatus = "HELD" | "PAYMENT_PENDING" | "PAID" | "READY_FOR_PICKUP" | "PICKED_UP" | "COMPLETED" | "CANCELLED" | "EXPIRED";
export type QRStatus = "VALID" | "USED" | "EXPIRED" | "INVALID";
export type WasteStatus = "AWAITING_COLLECTION" | "COLLECTION_REQUESTED" | "ACCEPTED" | "COLLECTED" | "PROCESSED" | "RECYCLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vendorId?: string;
}

export interface FoodListing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorVerified: boolean;
  name: string;
  image: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  available: number;
  held: number;
  category: string;
  preparedAt: string;
  consumeBy: string;
  availableFrom: string;
  availableUntil: string;
  pickupLocation: string;
  distance: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  listingId: string;
  foodName: string;
  foodImage: string;
  vendorId: string;
  vendorName: string;
  pickupLocation: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  qrCode: string;
  qrStatus: QRStatus;
  createdAt: string;
  paymentExpiresAt: string;
  pickupDeadline: string;
}

export interface WasteRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  listingId: string;
  foodName: string;
  foodType: string;
  weight: number;
  quantity: number;
  reason: string;
  notes: string;
  date: string;
  status: WasteStatus;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  location: string;
  rating: number;
  verified: boolean;
  suspended: boolean;
  totalMealsRescued: number;
  totalWasteRecorded: number;
  joinedAt: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  field: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

interface AppState {
  currentUser: User | null;
  listings: FoodListing[];
  orders: Order[];
  wasteRecords: WasteRecord[];
  vendors: Vendor[];
  auditLogs: AuditLog[];
}

type Action =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "RESERVE_FOOD"; listingId: string; orderId: string; quantity: number }
  | { type: "COMPLETE_PAYMENT"; orderId: string }
  | { type: "CANCEL_ORDER"; orderId: string }
  | { type: "EXPIRE_PAYMENT"; orderId: string }
  | { type: "SCAN_QR"; qrCode: string }
  | { type: "ADD_LISTING"; listing: FoodListing }
  | { type: "UPDATE_LISTING"; listingId: string; updates: Partial<FoodListing>; changedBy: string }
  | { type: "RECORD_UNSOLD"; listingId: string; reason: string }
  | { type: "ADD_WASTE_RECORD"; record: WasteRecord }
  | { type: "UPDATE_WASTE_STATUS"; wasteId: string; status: WasteStatus }
  | { type: "VERIFY_VENDOR"; vendorId: string }
  | { type: "SUSPEND_VENDOR"; vendorId: string }
  | { type: "ADD_ORDER"; order: Order };

const now = new Date();
const fmt = (d: Date) => d.toISOString();
const addMin = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

const MOCK_VENDORS: Vendor[] = [
  { id: "v1", name: "Mak Cik Rohani's Kitchen", email: "rohani@um.edu.my", location: "Block A Canteen", rating: 4.8, verified: true, suspended: false, totalMealsRescued: 342, totalWasteRecorded: 18, joinedAt: "2024-01-15" },
  { id: "v2", name: "Uncle Lee Cafe", email: "lee@um.edu.my", location: "Block B Cafeteria", rating: 4.6, verified: true, suspended: false, totalMealsRescued: 218, totalWasteRecorded: 12, joinedAt: "2024-02-10" },
  { id: "v3", name: "Campus Corner Bistro", email: "corner@um.edu.my", location: "Student Hub Level 2", rating: 4.5, verified: true, suspended: false, totalMealsRescued: 156, totalWasteRecorded: 9, joinedAt: "2024-03-05" },
  { id: "v4", name: "Kedai Pak Hamid", email: "hamid@um.edu.my", location: "Engineering Faculty", rating: 4.7, verified: false, suspended: false, totalMealsRescued: 98, totalWasteRecorded: 6, joinedAt: "2024-04-01" },
];

const MOCK_LISTINGS: FoodListing[] = [
  {
    id: "l1", vendorId: "v1", vendorName: "Mak Cik Rohani's Kitchen", vendorRating: 4.8, vendorVerified: true,
    name: "Nasi Lemak Special Set", image: "https://picsum.photos/seed/nasilemak/600/400",
    description: "Fragrant coconut rice served with sambal, fried anchovies, roasted peanuts, cucumber slices and half a hard-boiled egg. Comes with your choice of rendang or ayam goreng.",
    originalPrice: 8.50, discountedPrice: 4.00, quantity: 8, available: 8, held: 0,
    category: "Rice", preparedAt: "11:30 AM", consumeBy: "3:00 PM", availableFrom: "12:00 PM", availableUntil: "2:30 PM",
    pickupLocation: "Block A Canteen, Counter 3", distance: "0.2 km", status: "ACTIVE", createdAt: fmt(now),
  },
  {
    id: "l2", vendorId: "v2", vendorName: "Uncle Lee Cafe", vendorRating: 4.6, vendorVerified: true,
    name: "Mee Goreng Mamak", image: "https://picsum.photos/seed/meegoreng/600/400",
    description: "Wok-fried yellow noodles with egg, tofu, potato, bean sprouts, and tomato in a spicy-sweet sauce. A Malaysian favourite.",
    originalPrice: 7.00, discountedPrice: 3.50, quantity: 5, available: 3, held: 0,
    category: "Noodles", preparedAt: "1:00 PM", consumeBy: "4:00 PM", availableFrom: "1:30 PM", availableUntil: "3:30 PM",
    pickupLocation: "Block B Cafeteria, Main Counter", distance: "0.4 km", status: "ACTIVE", createdAt: fmt(now),
  },
  {
    id: "l3", vendorId: "v4", vendorName: "Kedai Pak Hamid", vendorRating: 4.7, vendorVerified: false,
    name: "Roti Canai + Teh Tarik Set", image: "https://picsum.photos/seed/roticanai/600/400",
    description: "Crispy flaky flatbread served with dhal curry and fish curry. Comes with a classic Malaysian pulled tea (teh tarik).",
    originalPrice: 5.50, discountedPrice: 2.50, quantity: 15, available: 12, held: 0,
    category: "Bread", preparedAt: "9:00 AM", consumeBy: "12:00 PM", availableFrom: "9:30 AM", availableUntil: "11:30 AM",
    pickupLocation: "Engineering Faculty, Lobby Cafe", distance: "0.7 km", status: "ACTIVE", createdAt: fmt(now),
  },
  {
    id: "l4", vendorId: "v3", vendorName: "Campus Corner Bistro", vendorRating: 4.5, vendorVerified: true,
    name: "Nasi Campur (Mixed Rice)", image: "https://picsum.photos/seed/nasicampur/600/400",
    description: "Rice with your choice of 3 side dishes from our selection including ayam masak merah, sayur lodeh, sambal ikan bilis, and more.",
    originalPrice: 12.00, discountedPrice: 6.00, quantity: 6, available: 5, held: 0,
    category: "Rice", preparedAt: "11:00 AM", consumeBy: "2:00 PM", availableFrom: "11:30 AM", availableUntil: "1:30 PM",
    pickupLocation: "Student Hub Level 2, Campus Corner", distance: "0.3 km", status: "ACTIVE", createdAt: fmt(now),
  },
  {
    id: "l5", vendorId: "v1", vendorName: "Mak Cik Rohani's Kitchen", vendorRating: 4.8, vendorVerified: true,
    name: "Kuih Assorted (6 pcs)", image: "https://picsum.photos/seed/kuih/600/400",
    description: "Assorted traditional Malaysian kuih including onde-onde, kuih lapis, seri muka, and kuih talam. Made fresh this morning.",
    originalPrice: 6.00, discountedPrice: 2.50, quantity: 20, available: 20, held: 0,
    category: "Snacks", preparedAt: "8:00 AM", consumeBy: "1:00 PM", availableFrom: "10:00 AM", availableUntil: "12:30 PM",
    pickupLocation: "Block A Canteen, Counter 1", distance: "0.2 km", status: "ACTIVE", createdAt: fmt(now),
  },
  {
    id: "l6", vendorId: "v2", vendorName: "Uncle Lee Cafe", vendorRating: 4.6, vendorVerified: true,
    name: "Hainanese Chicken Rice", image: "https://picsum.photos/seed/chickenrice/600/400",
    description: "Poached chicken with fragrant rice cooked in chicken broth, served with ginger-chilli sauce, dark soy sauce, and clear soup.",
    originalPrice: 10.00, discountedPrice: 5.00, quantity: 4, available: 2, held: 0,
    category: "Rice", preparedAt: "10:30 AM", consumeBy: "1:30 PM", availableFrom: "11:00 AM", availableUntil: "1:00 PM",
    pickupLocation: "Block B Cafeteria, Main Counter", distance: "0.4 km", status: "ACTIVE", createdAt: fmt(now),
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "o1", studentId: "s1", studentName: "Amirah Binti Zulkifli", listingId: "l1", foodName: "Nasi Lemak Special Set",
    foodImage: "https://picsum.photos/seed/nasilemak/600/400", vendorId: "v1", vendorName: "Mak Cik Rohani's Kitchen",
    pickupLocation: "Block A Canteen, Counter 3", quantity: 1, unitPrice: 4.00, totalPrice: 4.00,
    status: "COMPLETED", qrCode: "SM-O1-QR-DONE", qrStatus: "USED",
    createdAt: fmt(addMin(now, -120)), paymentExpiresAt: fmt(addMin(now, -115)), pickupDeadline: fmt(addMin(now, -60)),
  },
  {
    id: "o2", studentId: "s1", studentName: "Amirah Binti Zulkifli", listingId: "l3", foodName: "Roti Canai + Teh Tarik Set",
    foodImage: "https://picsum.photos/seed/roticanai/600/400", vendorId: "v4", vendorName: "Kedai Pak Hamid",
    pickupLocation: "Engineering Faculty, Lobby Cafe", quantity: 2, unitPrice: 2.50, totalPrice: 5.00,
    status: "PAID", qrCode: "SM-O2-7F3A9B", qrStatus: "VALID",
    createdAt: fmt(addMin(now, -30)), paymentExpiresAt: fmt(addMin(now, 5)), pickupDeadline: fmt(addMin(now, 90)),
  },
];

const MOCK_WASTE: WasteRecord[] = [
  {
    id: "w1", vendorId: "v1", vendorName: "Mak Cik Rohani's Kitchen", listingId: "l0", foodName: "Char Kway Teow",
    foodType: "Cooked Noodles", weight: 2.5, quantity: 8, reason: "Low demand", notes: "Fewer students than expected on public holiday",
    date: "2025-01-10", status: "COLLECTED",
  },
  {
    id: "w2", vendorId: "v2", vendorName: "Uncle Lee Cafe", listingId: "l0", foodName: "Curry Laksa",
    foodType: "Cooked Soup", weight: 3.8, quantity: 12, reason: "Overproduction", notes: "",
    date: "2025-01-12", status: "AWAITING_COLLECTION",
  },
  {
    id: "w3", vendorId: "v3", vendorName: "Campus Corner Bistro", listingId: "l0", foodName: "Mixed Rice (remaining)",
    foodType: "Cooked Rice", weight: 5.2, quantity: 15, reason: "Event cancellation", notes: "Faculty event was cancelled last minute",
    date: "2025-01-14", status: "COLLECTION_REQUESTED",
  },
];

const initialState: AppState = {
  currentUser: null,
  listings: MOCK_LISTINGS,
  orders: MOCK_ORDERS,
  wasteRecords: MOCK_WASTE,
  vendors: MOCK_VENDORS,
  auditLogs: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.user };
    case "LOGOUT":
      return { ...state, currentUser: null };

    case "ADD_ORDER":
      return { ...state, orders: [action.order, ...state.orders] };

    case "RESERVE_FOOD": {
      const listing = state.listings.find(l => l.id === action.listingId);
      if (!listing || listing.available < action.quantity) return state;
      return {
        ...state,
        listings: state.listings.map(l =>
          l.id === action.listingId
            ? { ...l, available: l.available - action.quantity, held: l.held + action.quantity }
            : l
        ),
      };
    }

    case "COMPLETE_PAYMENT": {
      const order = state.orders.find(o => o.id === action.orderId);
      if (!order) return state;
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.orderId ? { ...o, status: "PAID", qrStatus: "VALID" } : o
        ),
        listings: state.listings.map(l =>
          l.id === order.listingId
            ? { ...l, held: Math.max(0, l.held - order.quantity) }
            : l
        ),
      };
    }

    case "CANCEL_ORDER":
    case "EXPIRE_PAYMENT": {
      const order = state.orders.find(o => o.id === action.orderId);
      if (!order) return state;
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.orderId
            ? { ...o, status: action.type === "CANCEL_ORDER" ? "CANCELLED" : "EXPIRED" }
            : o
        ),
        listings: state.listings.map(l =>
          l.id === order.listingId
            ? { ...l, available: l.available + order.quantity, held: Math.max(0, l.held - order.quantity) }
            : l
        ),
      };
    }

    case "SCAN_QR": {
      const order = state.orders.find(o => o.qrCode === action.qrCode);
      if (!order) return state;
      if (order.qrStatus !== "VALID") return state;
      return {
        ...state,
        orders: state.orders.map(o =>
          o.qrCode === action.qrCode
            ? { ...o, status: "PICKED_UP", qrStatus: "USED" }
            : o
        ),
        listings: state.listings.map(l =>
          l.id === order.listingId
            ? { ...l, quantity: l.quantity, available: l.available }
            : l
        ),
        vendors: state.vendors.map(v =>
          v.id === order.vendorId
            ? { ...v, totalMealsRescued: v.totalMealsRescued + order.quantity }
            : v
        ),
      };
    }

    case "ADD_LISTING":
      return { ...state, listings: [action.listing, ...state.listings] };

    case "UPDATE_LISTING": {
      const listing = state.listings.find(l => l.id === action.listingId);
      if (!listing) return state;
      const logs: AuditLog[] = Object.entries(action.updates).map(([field, newVal]) => ({
        id: `al-${Date.now()}-${field}`,
        entityType: "listing",
        entityId: action.listingId,
        field,
        previousValue: String((listing as Record<string, unknown>)[field] ?? ""),
        newValue: String(newVal),
        changedBy: action.changedBy,
        changedAt: fmt(new Date()),
      }));
      return {
        ...state,
        listings: state.listings.map(l =>
          l.id === action.listingId ? { ...l, ...action.updates } : l
        ),
        auditLogs: [...state.auditLogs, ...logs],
      };
    }

    case "RECORD_UNSOLD":
      return {
        ...state,
        listings: state.listings.map(l =>
          l.id === action.listingId ? { ...l, status: "UNSOLD" } : l
        ),
      };

    case "ADD_WASTE_RECORD":
      return { ...state, wasteRecords: [action.record, ...state.wasteRecords] };

    case "UPDATE_WASTE_STATUS":
      return {
        ...state,
        wasteRecords: state.wasteRecords.map(w =>
          w.id === action.wasteId ? { ...w, status: action.status } : w
        ),
      };

    case "VERIFY_VENDOR":
      return {
        ...state,
        vendors: state.vendors.map(v =>
          v.id === action.vendorId ? { ...v, verified: true } : v
        ),
        listings: state.listings.map(l =>
          l.vendorId === action.vendorId ? { ...l, vendorVerified: true } : l
        ),
      };

    case "SUSPEND_VENDOR":
      return {
        ...state,
        vendors: state.vendors.map(v =>
          v.id === action.vendorId ? { ...v, suspended: !v.suspended } : v
        ),
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: (action: Action) => void;
  reserveFood: (listingId: string, qty: number) => { success: boolean; orderId?: string; message: string };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reserveFood = (listingId: string, qty: number) => {
    const listing = state.listings.find(l => l.id === listingId);
    if (!listing || listing.available < qty) {
      return { success: false, message: "This item has just been reserved by another student. Please try again." };
    }
    if (!state.currentUser) return { success: false, message: "Please log in." };

    const orderId = `o-${Date.now()}`;
    const qrCode = `SM-${orderId.slice(-6).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const now = new Date();
    const order: Order = {
      id: orderId,
      studentId: state.currentUser.id,
      studentName: state.currentUser.name,
      listingId,
      foodName: listing.name,
      foodImage: listing.image,
      vendorId: listing.vendorId,
      vendorName: listing.vendorName,
      pickupLocation: listing.pickupLocation,
      quantity: qty,
      unitPrice: listing.discountedPrice,
      totalPrice: listing.discountedPrice * qty,
      status: "HELD",
      qrCode,
      qrStatus: "VALID",
      createdAt: fmt(now),
      paymentExpiresAt: fmt(addMin(now, 5)),
      pickupDeadline: fmt(addMin(now, 120)),
    };

    dispatch({ type: "ADD_ORDER", order });
    dispatch({ type: "RESERVE_FOOD", listingId, orderId, quantity: qty });
    return { success: true, orderId, message: "Reserved successfully!" };
  };

  return (
    <AppContext.Provider value={{ state, dispatch, reserveFood }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const DEMO_USERS: Record<UserRole, User> = {
  student: { id: "s1", name: "Amirah Binti Zulkifli", email: "amirah@um.edu.my", role: "student" },
  vendor: { id: "u-v1", name: "Rohani Ibrahim", email: "rohani@um.edu.my", role: "vendor", vendorId: "v1" },
  admin: { id: "a1", name: "Prof. Dr. Azman Hashim", email: "admin@um.edu.my", role: "admin" },
  compost: { id: "c1", name: "GreenCycle Sdn Bhd", email: "collection@greencycle.my", role: "compost" },
};
