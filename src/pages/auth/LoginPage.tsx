import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRound,
  ShieldCheck,
  Home,
  Users,
  Headphones,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import logoNapoleone from "@/assets/logo-napoleone.png";
import brandImage from "@/assets/studentato-corridoio.jpg";

const DEMO_ACCOUNTS = [
  {
    label: "Studente",
    email: "studente@studentatonapoleone.com",
    password: "Demo1234!",
    icon: UserRound,
  },
  {
    label: "Admin",
    email: "admin@studentatonapoleone.com",
    password: "Demo1234!",
    icon: ShieldCheck,
  },
];

const BRAND_BENEFITS = [
  { icon: Home, text: "Camere curate e arredate" },
  { icon: Users, text: "Community attiva di studenti" },
  { icon: Headphones, text: "Supporto rapido 24/7" },
];

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { session, profile } = useAuth();

  // Se già loggato, redirect in base al ruolo
  useEffect(() => {
    if (session && profile) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from ?? (profile.role === "admin" ? "/admin" : "/studente"), { replace: true });
    }
  }, [session, profile, navigate, location]);

  const emailValid = email.length > 0 && isValidEmail(email);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      toast({
        title: "Accesso non riuscito",
        description: error.message === "Invalid login credentials"
          ? "Email o password errati."
          : error.message,
        variant: "destructive",
      });
    }
    // Il redirect avviene automaticamente via useEffect quando session cambia
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const oneClickDemo = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    performLogin(account.email, account.password);
  };

  const handleForgotPassword = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Inserisci la tua email", description: "Digita prima l'email nel campo sopra." });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email inviata!", description: "Controlla la tua casella di posta per il link di reset." });
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handlePwKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState && e.getModifierState("CapsLock"));
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* BRAND PANEL */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
      >
        <img
          src={brandImage}
          alt="Studentato Napoleone — corridoio con porte colorate"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/60" />

        {/* Top: logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-background/95 p-1.5 shadow-lg flex items-center justify-center">
            <img src={logoNapoleone} alt="Studentato Napoleone" className="h-full w-full object-contain" />
          </div>
          <div className="text-primary-foreground">
            <p className="font-heading font-bold leading-tight">Studentato</p>
            <p className="font-heading font-bold leading-tight">Napoleone</p>
          </div>
        </div>

        {/* Middle: claim + benefits */}
        <div className="relative z-10 space-y-8 max-w-md">
          <div className="space-y-3">
            <h2 className="font-heading text-5xl font-bold text-primary-foreground leading-tight">
              Bentornato<br />a casa.
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Studentato Napoleone · Padova
            </p>
          </div>
          <ul className="space-y-4">
            {BRAND_BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3 text-primary-foreground">
                <div className="h-9 w-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center backdrop-blur-sm">
                  <b.icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: stats */}
        <div className="relative z-10 flex items-center gap-6 text-primary-foreground/70 text-xs">
          <span>500+ studenti ospitati</span>
          <span className="h-1 w-1 rounded-full bg-primary-foreground/40" />
          <span>4.9★ su Google</span>
        </div>
      </motion.aside>

      {/* LOGIN PANEL */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16"
      >
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary p-1.5 flex items-center justify-center">
              <img src={logoNapoleone} alt="Studentato Napoleone" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground leading-tight">Studentato Napoleone</p>
              <p className="text-xs text-muted-foreground">La tua casa a Padova</p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Accedi al tuo account
            </h1>
            <p className="text-sm text-muted-foreground">
              Inserisci le tue credenziali per continuare
            </p>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@studenti.unipd.it"
                  className={cn(
                    "pl-10 pr-10 transition-colors",
                    emailValid && "border-success focus-visible:ring-success/30",
                  )}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                {emailValid && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {capsLock && (
                  <span
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-1 text-xs font-medium text-destructive"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Caps Lock attivo
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handlePwKey}
                  onKeyDown={handlePwKey}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Nascondi password" : "Mostra password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  id="remember"
                />
                Ricordami
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-accent hover:underline"
              >
                Password dimenticata?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                "Accedi"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">oppure continua con</span>
            </div>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entra con Google
          </Button>

          {/* Demo chips */}
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <span className="font-medium">Demo:</span>
              {DEMO_ACCOUNTS.map((acc) => (
                <Tooltip key={acc.email}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => oneClickDemo(acc)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-foreground hover:bg-muted hover:border-accent/50 transition-colors disabled:opacity-50"
                    >
                      <acc.icon className="h-3 w-3" />
                      {acc.label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div className="font-mono">{acc.email}</div>
                    <div className="text-muted-foreground">Click per accedere automaticamente</div>
                  </TooltipContent>
                </Tooltip>
              ))}
              <span className="ml-1 text-[11px]">click per accesso rapido</span>
            </div>
          </TooltipProvider>

          {/* Register */}
          <p className="text-center text-sm text-muted-foreground">
            Non hai un account?{" "}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Registrati
            </Link>
          </p>
        </div>
      </motion.main>
    </div>
  );
}
