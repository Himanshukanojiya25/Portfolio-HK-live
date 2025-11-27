import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";

// ✅ ADMIN IMPORTS
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageProjects from "@/pages/admin/ManageProjects";
import ManageSkills from "@/pages/admin/ManageSkills";
import ManageBlog from "@/pages/admin/ManageBlog";
import ManageTestimonials from "@/pages/admin/ManageTestimonials";
import ContactMessages from "@/pages/admin/ContactMessages"; // ✅ NEW
import Analytics from "@/pages/admin/Analytics"; // ✅ NEW

// ✅ ADMIN FORM PAGES
import CreateProject from "@/pages/admin/forms/CreateProject"; // ✅ NEW
import EditProject from "@/pages/admin/forms/EditProject"; // ✅ NEW
import CreateSkill from "@/pages/admin/forms/CreateSkill"; // ✅ NEW
import EditSkill from "@/pages/admin/forms/EditSkill"; // ✅ NEW

// ✅ ADMIN LAYOUT
import AdminLayout from "@/components/admin/AdminLayout"; // ✅ NEW

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* ✅ PUBLIC ADMIN ROUTE */}
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* ✅ PROTECTED ADMIN ROUTES WITH LAYOUT */}
      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/projects">
        <AdminLayout>
          <ManageProjects />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/projects/new">
        <AdminLayout>
          <CreateProject />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/projects/edit/:id">
        {(params) => (
          <AdminLayout>
            <EditProject projectId={params.id} />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/skills">
        <AdminLayout>
          <ManageSkills />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/skills/new">
        <AdminLayout>
          <CreateSkill />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/skills/edit/:id">
        {(params) => (
          <AdminLayout>
            <EditSkill skillId={params.id} />
          </AdminLayout>
        )}
      </Route>
      
      <Route path="/admin/blog">
        <AdminLayout>
          <ManageBlog />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/testimonials">
        <AdminLayout>
          <ManageTestimonials />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/messages">
        <AdminLayout>
          <ContactMessages />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/analytics">
        <AdminLayout>
          <Analytics />
        </AdminLayout>
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