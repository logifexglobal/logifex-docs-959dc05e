import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CoreDocs from "./pages/CoreDocs";
import AdaptersDocs from "./pages/AdaptersDocs";
import PluginsDocs from "./pages/PluginsDocs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/core" element={<CoreDocs />} />
          <Route path="/core/:termId" element={<CoreDocs />} />
          <Route path="/adapters" element={<AdaptersDocs />} />
          <Route path="/adapters/:termId" element={<AdaptersDocs />} />
          <Route path="/plugins" element={<PluginsDocs />} />
          <Route path="/plugins/:termId" element={<PluginsDocs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
