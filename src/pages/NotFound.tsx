import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Seo title="Pagina non trovata" description="La pagina che cerchi non esiste." noindex />
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-heading font-bold mb-2">Pagina non trovata — Studentato Napoleone Padova</h1>
        <p className="text-muted-foreground mb-8">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Torna alla home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
