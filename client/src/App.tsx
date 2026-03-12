import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import NotFound from "@/pages/not-found";

import { Box } from "@/pages/Box";
import ECSTTPage from "@/pages/ECSTTPage";
import RegisterPage from "@/pages/RegisterPage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import WorkLibraryPage from "@/pages/WorkLibraryPage";
import WorkItemDetailPage from "@/pages/WorkItemDetailPage";
import SolutionsPage from "@/pages/SolutionsPage";
import SolutionDetailPage from "@/pages/SolutionDetailPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Box} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/ecstt" component={ECSTTPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/work-library" component={WorkLibraryPage} />
      <Route path="/work-library/:slug" component={WorkItemDetailPage} />
      <Route path="/solutions" component={SolutionsPage} />
      <Route path="/solutions/:slug" component={SolutionDetailPage} />
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
        <FloatingWhatsApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
