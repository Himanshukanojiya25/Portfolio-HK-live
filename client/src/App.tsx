import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";

// ✅ PUBLIC PAGES (NEW)
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import SkillsPage from "@/pages/SkillsPage";
import TestimonialsPage from "@/pages/TestimonialsPage";
import ContactPage from "@/pages/ContactPage";

// ✅ ADMIN IMPORTS
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageProjects from "@/pages/admin/ManageProjects";
import ManageSkills from "@/pages/admin/ManageSkills";
import ManageBlog from "@/pages/admin/ManageBlog";
import ManageTestimonials from "@/pages/admin/ManageTestimonials";
import Analytics from "@/pages/admin/Analytics";
import VisitorDetails from "@/pages/admin/VisitorDetails";

// ✅ ADMIN FORM PAGES
import CreateProject from "@/pages/admin/forms/CreateProject";
import EditProject from "@/pages/admin/forms/EditProject";
import CreateSkill from "@/pages/admin/forms/CreateSkill";
import EditSkill from "@/pages/admin/forms/EditSkill";
import CreateTestimonial from '@/pages/admin/forms/CreateTestimonial';
import EditTestimonial from '@/pages/admin/forms/EditTestimonial';

// ✅ ADMIN LAYOUT
import AdminLayout from "@/components/admin/AdminLayout";

// ✅ IMPORT PROTECTED ROUTE
import ProtectedRoute from "./components/common/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" component={Home} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:id">
        {(params: { id: string }) => <ProjectDetailsPage projectId={params.id} />}
      </Route>
      <Route path="/skills" component={SkillsPage} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* ========== ADMIN ROUTES ========== */}
      {/* ✅ PUBLIC ADMIN ROUTE */}
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* ✅ PROTECTED ADMIN ROUTES */}
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/projects">
        <ProtectedRoute>
          <AdminLayout>
            <ManageProjects />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/projects/new">
        <ProtectedRoute>
          <AdminLayout>
            <CreateProject />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/projects/edit/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <AdminLayout>
              <EditProject projectId={params.id} />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/skills">
        <ProtectedRoute>
          <AdminLayout>
            <ManageSkills />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/skills/new">
        <ProtectedRoute>
          <AdminLayout>
            <CreateSkill />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/skills/edit/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <AdminLayout>
              <EditSkill skillId={params.id} />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/blog">
        <ProtectedRoute>
          <AdminLayout>
            <ManageBlog />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      {/* ✅ TESTIMONIALS ROUTES */}
      <Route path="/admin/testimonials">
        <ProtectedRoute>
          <AdminLayout>
            <ManageTestimonials />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/testimonials/new">
        <ProtectedRoute>
          <AdminLayout>
            <CreateTestimonial />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/testimonials/edit/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <AdminLayout>
              <EditTestimonial />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* ✅ ANALYTICS ROUTES */}
      <Route path="/admin/analytics">
        <ProtectedRoute>
          <AdminLayout>
            <Analytics />
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/visitor/:visitorId">
        {(params: { visitorId: string }) => (
          <ProtectedRoute>
            <AdminLayout>
              <VisitorDetails />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.includes('/admin') && location !== '/admin/login';
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Router />
            </main>
            {!isAdminRoute && <Footer />}
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;