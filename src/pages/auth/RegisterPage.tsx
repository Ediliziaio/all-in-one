import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [corso, setCorso] = useState("");
  const [anno, setAnno] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Registrazione completata!", description: "Controlla la tua email per confermare l'account." });
      navigate("/login");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-lg">SP</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Registrati</h1>
          <p className="text-sm text-muted-foreground">Crea il tuo account StudentatoPD</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="nome" placeholder="Mario Rossi" className="pl-10" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email universitaria</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="reg-email" type="email" placeholder="nome@studenti.unipd.it" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="reg-password" type="password" placeholder="Min. 8 caratteri" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Corso di laurea</Label>
              <Select value={corso} onValueChange={setCorso}>
                <SelectTrigger>
                  <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Scegli..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingegneria">Ingegneria</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="giurisprudenza">Giurisprudenza</SelectItem>
                  <SelectItem value="economia">Economia</SelectItem>
                  <SelectItem value="lettere">Lettere</SelectItem>
                  <SelectItem value="scienze">Scienze</SelectItem>
                  <SelectItem value="psicologia">Psicologia</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Anno</Label>
              <Select value={anno} onValueChange={setAnno}>
                <SelectTrigger><SelectValue placeholder="Anno" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1° anno</SelectItem>
                  <SelectItem value="2">2° anno</SelectItem>
                  <SelectItem value="3">3° anno</SelectItem>
                  <SelectItem value="4">4° anno</SelectItem>
                  <SelectItem value="5">5° anno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
            {loading ? "Registrazione..." : "Crea account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Hai già un account?{" "}
          <Link to="/login" className="text-accent hover:underline font-medium">Accedi</Link>
        </p>
      </motion.div>
    </div>
  );
}
