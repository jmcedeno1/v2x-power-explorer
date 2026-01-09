import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EngineeringPage from "./pages/EngineeringPage";
import PatentsPage from "./pages/PatentsPage";
import MarketsPage from "./pages/MarketsPage";
import StandardsPage from "./pages/StandardsPage";
import ArchitecturesPage from "./pages/ArchitecturesPage";
import PilotsPage from "./pages/PilotsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import DataSourcesPage from "./pages/DataSourcesPage";
import NotesPage from "./pages/NotesPage";
import RecommendationsPage from "./pages/RecommendationsPage";
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
          <Route path="/engineering" element={<EngineeringPage />} />
          <Route path="/patents" element={<PatentsPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/standards" element={<StandardsPage />} />
          <Route path="/architectures" element={<ArchitecturesPage />} />
          <Route path="/pilots" element={<PilotsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/datasources" element={<DataSourcesPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
