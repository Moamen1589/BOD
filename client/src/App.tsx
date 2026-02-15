import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Box } from "@/pages/Box";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import WorkLibraryPage from "@/pages/WorkLibraryPage";
import WorkItemDetailPage from "@/pages/WorkItemDetailPage";
import SolutionsPage from "@/pages/SolutionsPage";
import SolutionDetailPage from "@/pages/SolutionDetailPage";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminMessages from "@/pages/admin/Messages";
import AdminSettings from "@/pages/admin/Settings";
import AdminServices from "@/pages/admin/Services";
import AdminBlog from "@/pages/admin/Blog";
import AdminWorkLibrary from "@/pages/admin/WorkLibrary";
import AdminSolutions from "@/pages/admin/Solutions";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Box} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/work-library" component={WorkLibraryPage} />
      <Route path="/work-library/:slug" component={WorkItemDetailPage} />
      <Route path="/solutions" component={SolutionsPage} />
      <Route path="/solutions/:slug" component={SolutionDetailPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/messages">
        <AdminLayout>
          <AdminMessages />
        </AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout>
          <AdminSettings />
        </AdminLayout>
      </Route>
      <Route path="/admin/services">
        <AdminLayout>
          <AdminServices />
        </AdminLayout>
      </Route>
      <Route path="/admin/blog">
        <AdminLayout>
          <AdminBlog />
        </AdminLayout>
      </Route>
      <Route path="/admin/work-library">
        <AdminLayout>
          <AdminWorkLibrary />
        </AdminLayout>
      </Route>
      <Route path="/admin/solutions">
        <AdminLayout>
          <AdminSolutions />
        </AdminLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
