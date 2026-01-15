import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// ---------- Public Pages ----------
import LandingPage from "../pages/Landing/LandingPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import RecoverPassword from "../pages/RecoverPassword/RecoverPassword";
import NotFound from "../pages/NotFound/NotFound";

// ---------- Protected Pages ----------
import Dashboard from "../pages/Dashboard/Dashboard";
import Categories from "../pages/Menu/Categories";
import AddMenu from "../pages/Menu/AddMenu";
import EditMenu from "../pages/Menu/EditMenu";
import AddOns from "../pages/AddOns/AddOns";
import AddSides from "../pages/AddSides/AddSides";
import AddDrinks from "../pages/AddDrinks/AddDrinks";
import Promotion from "../pages/Promotion/Promotion";
import Settings from "../pages/Settings/Settings";
import Notification from "../pages/Notification/Notification";

// ---------- Components ----------
import { ToastContainer } from "../components/ToastContainer";
import ProtectedRoute from "./ProtectedRoute";
import EmmaBotWrapper from "../EmmaBot/EmmaBotWrapper";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recover-password" element={<RecoverPassword />} />

        {/* ---------- Protected Routes ---------- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Outlet /> {/* 👈 Explicitly pass Outlet as children */}
              </MainLayout>
            </ProtectedRoute>
          }
        >

          <Route path="/signup" element={<SignUp />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu/categories" element={<Categories />} />
          <Route path="menu/add-menu" element={<AddMenu />} />
          {/* 🔥 FIXED: Added :itemId parameter for dynamic routing */}
          <Route path="menu/edit-menu/:itemId" element={<EditMenu />} />
          <Route path="menu/add-ons" element={<AddOns />} />
          <Route path="menu/add-sides" element={<AddSides />} />
          <Route path="menu/add-drinks" element={<AddDrinks />} />
          <Route path="promotions" element={<Promotion />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notification" element={<Notification />} />
        </Route>

        {/* ---------- Standalone Protected Routes ---------- */}
        <Route
          path="/drive-thru-assistant"
          element={
            <ProtectedRoute>
              <EmmaBotWrapper />
            </ProtectedRoute>
          }
        />

        {/* ---------- Catch-All 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ---------- Global Toasts ---------- */}
      <ToastContainer />
    </Router>
  );
};

export default AppRouter;