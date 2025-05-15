import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppAdminLayout from "./layout/AppAdminLayout";
import AppPublicLayout from "./layout/AppPublicLayout";
import RequireRole from "./components/auth/RequireRole";
import { Role } from "./types/roles";

// Pages publiques
import Home from "./pages/public/Home";
import About from "./pages/public/About";

// Auth
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Pages privées
import Dashboard from "./pages/private/Dashboard/Home";
import BasicTables from "./pages/private/Tables/BasicTables";
import FormElements from "./pages/private/Forms/FormElements";
import Calendar from "./pages/private/Calendar";
import Blank from "./pages/private/Blank";
import NotFound from "./pages/private/OtherPage/NotFound";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public layout */}
        <Route element={<AppPublicLayout />}>
          <Route index path="/public" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Admin layout - require authenticated roles */}
        <Route
          element={
            <RequireRole
              allowedRoles={[Role.ADMIN, Role.ORGANISATEUR, Role.CONFERENCIER]}
            >
              <AppAdminLayout />
            </RequireRole>
          }
        >
          {/* Dashboard - Admin uniquement */}
          <Route
            index
            path="/"
            element={
              <RequireRole allowedRoles={[Role.ADMIN]}>
                <Dashboard />
              </RequireRole>
            }
          />

          {/* Basic Tables - Admin et Organisateur */}
          <Route
            path="/basic-tables"
            element={
              <RequireRole allowedRoles={[Role.ADMIN, Role.ORGANISATEUR, Role.CONFERENCIER]}>
                <BasicTables />
              </RequireRole>
            }
          />

          {/* Form Elements - Admin et Conferencier */}
          <Route path="/form-elements" element={<FormElements/>}/>

          {/* Calendar - accessible aux 3 rôles */}
          <Route path="/calendar" element={<Calendar />} />

          {/* Blank page - Admin uniquement */}
          <Route
            path="/blank"
            element={
              <RequireRole allowedRoles={[Role.ADMIN]}>
                <Blank />
              </RequireRole>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
