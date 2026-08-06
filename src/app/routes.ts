import { createBrowserRouter } from "react-router";

import LoginScreen from "./screens/LoginScreen";
import StudentLayout from "./screens/student/StudentLayout";
import StudentHome from "./screens/student/StudentHome";
import StudentListings from "./screens/student/StudentListings";
import StudentFoodDetails from "./screens/student/StudentFoodDetails";
import StudentCheckout from "./screens/student/StudentCheckout";
import StudentPayment from "./screens/student/StudentPayment";
import StudentOrderConfirmation from "./screens/student/StudentOrderConfirmation";
import StudentQRPickup from "./screens/student/StudentQRPickup";
import StudentOrderHistory from "./screens/student/StudentOrderHistory";
import StudentProfile from "./screens/student/StudentProfile";

import VendorLayout from "./screens/vendor/VendorLayout";
import VendorDashboard from "./screens/vendor/VendorDashboard";
import VendorAddFood from "./screens/vendor/VendorAddFood";
import VendorListings from "./screens/vendor/VendorListings";
import VendorOrders from "./screens/vendor/VendorOrders";
import VendorQRScanner from "./screens/vendor/VendorQRScanner";
import VendorUnsoldFood from "./screens/vendor/VendorUnsoldFood";

import AdminDashboard from "./screens/admin/AdminDashboard";
import CompostDashboard from "./screens/compost/CompostDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: LoginScreen },

  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentHome },
      { path: "listings", Component: StudentListings },
      { path: "food/:id", Component: StudentFoodDetails },
      { path: "checkout/:id", Component: StudentCheckout },
      { path: "payment/:orderId", Component: StudentPayment },
      { path: "confirmation/:orderId", Component: StudentOrderConfirmation },
      { path: "qr/:orderId", Component: StudentQRPickup },
      { path: "orders", Component: StudentOrderHistory },
      { path: "profile", Component: StudentProfile },
    ],
  },

  {
    path: "/vendor",
    Component: VendorLayout,
    children: [
      { index: true, Component: VendorDashboard },
      { path: "add", Component: VendorAddFood },
      { path: "listings", Component: VendorListings },
      { path: "orders", Component: VendorOrders },
      { path: "scanner", Component: VendorQRScanner },
      { path: "unsold", Component: VendorUnsoldFood },
    ],
  },

  { path: "/admin", Component: AdminDashboard },
  { path: "/compost", Component: CompostDashboard },
]);
