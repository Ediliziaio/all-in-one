import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public
import Index from "./pages/Index";
import Camere from "./pages/Camere";
import CameraDettaglio from "./pages/CameraDettaglio";
import Servizi from "./pages/Servizi";
import Vantaggi from "./pages/Vantaggi";
import NotFound from "./pages/NotFound";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCamere from "./pages/admin/AdminCamere";
import AdminPrenotazioni from "./pages/admin/AdminPrenotazioni";
import AdminStudenti from "./pages/admin/AdminStudenti";
import AdminSupporto from "./pages/admin/AdminSupporto";
import AdminBuoni from "./pages/admin/AdminBuoni";
import AdminGuide from "./pages/admin/AdminGuide";

// Studente
import StudenteLayout from "./layouts/StudenteLayout";
import StudenteHome from "./pages/studente/StudenteHome";
import MiaCamera from "./pages/studente/MiaCamera";
import Community from "./pages/studente/Community";
import Profili from "./pages/studente/Profili";
import ProfiloStudente from "./pages/studente/ProfiloStudente";
import MioProfilo from "./pages/studente/MioProfilo";
import Guide from "./pages/studente/Guide";
import Buoni from "./pages/studente/Buoni";
import Supporto from "./pages/studente/Supporto";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/camere" element={<Camere />} />
          <Route path="/camere/:id" element={<CameraDettaglio />} />
          <Route path="/servizi" element={<Servizi />} />
          <Route path="/vantaggi" element={<Vantaggi />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="camere" element={<AdminCamere />} />
            <Route path="prenotazioni" element={<AdminPrenotazioni />} />
            <Route path="studenti" element={<AdminStudenti />} />
            <Route path="supporto" element={<AdminSupporto />} />
            <Route path="buoni" element={<AdminBuoni />} />
            <Route path="guide" element={<AdminGuide />} />
          </Route>

          {/* Studente */}
          <Route path="/studente" element={<StudenteLayout />}>
            <Route index element={<StudenteHome />} />
            <Route path="camera" element={<MiaCamera />} />
            <Route path="community" element={<Community />} />
            <Route path="community/profili" element={<Profili />} />
            <Route path="community/profilo/:id" element={<ProfiloStudente />} />
            <Route path="profilo" element={<MioProfilo />} />
            <Route path="guide" element={<Guide />} />
            <Route path="buoni" element={<Buoni />} />
            <Route path="supporto" element={<Supporto />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
