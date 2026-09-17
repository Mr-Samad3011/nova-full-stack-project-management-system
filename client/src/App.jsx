import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// PUBLIC
import Home from "./component/public/pages/Home";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";

// PROTECTED
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import Analytics from "./pages/Analytics";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";
import Team from "./pages/Team";

import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

// LAYOUTS
import PublicHeader from "./component/public/PublicHeader";
import PublicFooter from "./component/public/PublicFooter";
import AppHeader from "./layout/AppHeader";

// PROTECTION
import ProtectedRoute from "./component/ProtectedRoute";
import AdminRoute from "./component/AdminRoute";


// =====================================================
// PUBLIC LAYOUT
// =====================================================

const PublicLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      <PublicHeader />

      <main className="flex-1">
        {children}
      </main>

      <PublicFooter />

    </div>
  );
};


// =====================================================
// AUTHENTICATED HOME LAYOUT
// =====================================================

const AuthenticatedHomeLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      <AppHeader />

      <main className="flex-1">
        {children}
      </main>

      <PublicFooter />

    </div>
  );
};


// =====================================================
// PROTECTED LAYOUT
// =====================================================

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      <AppHeader />

      <main className="min-h-[calc(100vh-4rem)] flex-1">
        {children}
      </main>

      <PublicFooter />

    </div>
  );
};


// =====================================================
// APP
// =====================================================

function App() {

  const { user } = useAuth();

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            user ? (
              <AuthenticatedHomeLayout>
                <Home />
              </AuthenticatedHomeLayout>
            ) : (
              <PublicLayout>
                <Home />
              </PublicLayout>
            )
          }
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <PublicLayout>
                <Login />
              </PublicLayout>
            )
          }
        />


        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <PublicLayout>
                <Register />
              </PublicLayout>
            )
          }
        />


        {/* =================================================
            PROTECTED ROUTES
        ================================================= */}

        {/* AAPKE EXISTING PROTECTED ROUTES YAHAN SAME RAHENGE */}

      </Routes>

    </BrowserRouter>
  );
}

export default App;
