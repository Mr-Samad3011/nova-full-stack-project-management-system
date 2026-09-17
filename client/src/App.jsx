import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./component/public/pages/Home";

// =====================================================
// AUTH PAGES
// =====================================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// =====================================================
// PROTECTED PAGES
// =====================================================

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";

import Analytics from "./pages/Analytics";

import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";

import Team from "./pages/Team";

// =====================================================
// USER MANAGEMENT
// =====================================================

import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

// =====================================================
// LAYOUT COMPONENTS
// =====================================================

import PublicHeader from "./component/public/PublicHeader";
import PublicFooter from "./component/public/PublicFooter";
import AppHeader from "./layout/AppHeader";

// =====================================================
// ROUTE PROTECTION
// =====================================================

import ProtectedRoute from "./component/ProtectedRoute";
import AdminRoute from "./component/AdminRoute";


// =====================================================
// PUBLIC LAYOUT
// =====================================================

const PublicLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* PUBLIC HEADER */}
      <PublicHeader />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
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

      {/* LOGGED-IN HEADER */}
      <AppHeader />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
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

      {/* APPLICATION HEADER */}
      <AppHeader />

      {/* PAGE CONTENT */}
      <main className="min-h-[calc(100vh-4rem)] flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <PublicFooter />

    </div>
  );
};


// =====================================================
// APP
// =====================================================

function App() {

  // ===================================================
  // AUTH STATE
  // ===================================================

  const { user } = useAuth();


  // ===================================================
  // ROUTER
  // ===================================================

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC HOME

            LOGGED OUT:
            PublicHeader

            LOGGED IN:
            AppHeader
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

            LOGGED IN:
            Redirect to Home

            LOGGED OUT:
            Show Login Page
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

            LOGGED IN:
            Redirect to Home

            LOGGED OUT:
            Show Register Page
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
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            PROJECTS
        ================================================= */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Projects />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            CREATE PROJECT
        ================================================= */}

        <Route
          path="/projects/create"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <CreateProject />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            PROJECT DETAILS
        ================================================= */}

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ProjectDetails />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            TASKS
        ================================================= */}

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Tasks />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            CREATE TASK
        ================================================= */}

        <Route
          path="/tasks/create"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <CreateTask />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            TASK DETAILS
        ================================================= */}

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <TaskDetails />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ANALYTICS
        ================================================= */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Analytics />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            TEAM
        ================================================= */}

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Team />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            USERS — ADMIN ONLY
        ================================================= */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminRoute>
                  <Users />
                </AdminRoute>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            USER DETAILS — ADMIN ONLY
        ================================================= */}

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminRoute>
                  <UserDetails />
                </AdminRoute>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />


        {/* =================================================
            404 FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default App;
