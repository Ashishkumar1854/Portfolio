import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import ProtectedRoute from './protector/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Journey from './pages/Journey';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import HireMe from './pages/HireMe';
import NotFound from './pages/NotFound';

// Lazy load Admin Pages
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ManageProjects = lazy(() => import('./admin/pages/ManageProjects'));
const ManageSkills = lazy(() => import('./admin/pages/ManageSkills'));
const ManageBlogs = lazy(() => import('./admin/pages/ManageBlogs'));
const ManageJourneys = lazy(() => import('./admin/pages/ManageJourneys'));
const ManageAchievements = lazy(() => import('./admin/pages/ManageAchievements'));
const ManageTestimonials = lazy(() => import('./admin/pages/ManageTestimonials'));
const ManageHireRequests = lazy(() => import('./admin/pages/ManageHireRequests'));
const ManageCaseStudies = lazy(() => import('./admin/pages/ManageCaseStudies'));
const ManageServices = lazy(() => import('./admin/pages/ManageServices'));
const ManageAbout = lazy(() => import('./admin/pages/ManageAbout'));
const ManageFAQs = lazy(() => import('./admin/pages/ManageFAQs'));
const ManageHomeContent = lazy(() => import('./admin/pages/ManageHomeContent'));
const ManageResources = lazy(() => import('./admin/pages/ManageResources'));
const ManageUsers = lazy(() => import('./admin/pages/ManageUsers'));
const ManageNotifications = lazy(() => import('./admin/pages/ManageNotifications'));
const ManageBroadcasts = lazy(() => import('./admin/pages/ManageBroadcasts'));
const ManageBenefits = lazy(() => import('./admin/pages/ManageBenefits'));

// Lazy load User pages
const UserDashboard = lazy(() => import('./pages/Dashboard'));
const Search = lazy(() => import('./pages/Search'));

const AdminLoading = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:slug" element={<ResourceDetail />} />
        <Route path="/search" element={<Suspense fallback={<AdminLoading />}><Search /></Suspense>} />
        <Route path="/hire" element={<HireMe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private User Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AdminLoading />}>
                <UserDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Lazy Loaded + Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Suspense fallback={<AdminLoading />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Suspense fallback={<AdminLoading />}><Dashboard /></Suspense>} />
          <Route path="projects" element={<Suspense fallback={<AdminLoading />}><ManageProjects /></Suspense>} />
          <Route path="skills" element={<Suspense fallback={<AdminLoading />}><ManageSkills /></Suspense>} />
          <Route path="blogs" element={<Suspense fallback={<AdminLoading />}><ManageBlogs /></Suspense>} />
          <Route path="journeys" element={<Suspense fallback={<AdminLoading />}><ManageJourneys /></Suspense>} />
          <Route path="achievements" element={<Suspense fallback={<AdminLoading />}><ManageAchievements /></Suspense>} />
          <Route path="testimonials" element={<Suspense fallback={<AdminLoading />}><ManageTestimonials /></Suspense>} />
          <Route path="hire-requests" element={<Suspense fallback={<AdminLoading />}><ManageHireRequests /></Suspense>} />
          <Route path="case-studies" element={<Suspense fallback={<AdminLoading />}><ManageCaseStudies /></Suspense>} />
          <Route path="services" element={<Suspense fallback={<AdminLoading />}><ManageServices /></Suspense>} />
          <Route path="about" element={<Suspense fallback={<AdminLoading />}><ManageAbout /></Suspense>} />
          <Route path="faqs" element={<Suspense fallback={<AdminLoading />}><ManageFAQs /></Suspense>} />
          <Route path="home-content" element={<Suspense fallback={<AdminLoading />}><ManageHomeContent /></Suspense>} />
          <Route path="resources" element={<Suspense fallback={<AdminLoading />}><ManageResources /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<AdminLoading />}><ManageUsers /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<AdminLoading />}><ManageNotifications /></Suspense>} />
          <Route path="broadcasts" element={<Suspense fallback={<AdminLoading />}><ManageBroadcasts /></Suspense>} />
          <Route path="benefits" element={<Suspense fallback={<AdminLoading />}><ManageBenefits /></Suspense>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-body">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e1e2a',
                color: '#f0f0fa',
                border: '1px solid rgba(255,255,255,0.07)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
