import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Shield } from "lucide-react";
import { currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { usePrivacySettings, type PrivacySettings } from "@/hooks/usePrivacySettings";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

export default function MioProfilo() {
  const [nome, setNome] = useState(`${currentUser.nome} ${currentUser.cognome}`);
  const [bio, setBio] = useState(currentUser.bio);
  const [instagram, setInstagram] = useState(currentUser.instagram || "");
  const { toast } = useToast();
  const { settings, update, reset } = usePrivacySettings();

  const privacyFields: { key: keyof PrivacySettings; label: string; description: string }[] = [
    { key: "showBio", label: "Bio", description: "La tua descrizione personale" },
    { key: "showCorso", label: "Corso di laurea", description: "Es: Ingegneria Informatica" },
    { key: "showAnno", label: "Anno di corso", description: "Es: 2° anno" },
    { key: "showInteressi", label: "Interessi", description: "I tuoi hobby e passioni" },
    { key: "showInstagram", label: "Instagram", description: "Il tuo handle Instagram" },
    { key: "showEmail", label: "Email", description: "La tua email universitaria" },
    { key: "showPiano", label: "Piano", description: "A che piano abiti" },
    { key: "showCamera", label: "Camera", description: "Numero/nome della tua camera" },
    { key: "allowWhatsApp", label: "Contatto WhatsApp", description: "Permetti ad altri di contattarti via WhatsApp" },
  ];

  return (
    <PageTransition className="p-4 md:p-6 max-w-2xl mx-auto space-y-5 md:space-y-6">
      <FadeIn><h1 className="font-heading text-xl md:text-2xl font-bold">Il Mio Profilo</h1></FadeIn>

      {/* Profilo */}
      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-4 md:p-6 space-y-5 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-xl">{currentUser.nome[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="self-start sm:self-auto">Cambia foto</Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome completo</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Bio <span className="text-muted-foreground text-xs">({bio.length}/200)</span></Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 200))} maxLength={200} />
              </div>
              <div className="space-y-2"><Label>Corso di laurea</Label><Input value={currentUser.corso} disabled /></div>
              <div className="space-y-2"><Label>Instagram</Label><Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@tuohandle" /></div>
              <div className="space-y-2">
                <Label>Interessi</Label>
                <div className="flex flex-wrap gap-2">{currentUser.interessi.map((i) => (<Badge key={i} variant="outline">{i} ×</Badge>))}</div>
              </div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => toast({ title: "Profilo aggiornato!" })}>Salva modifiche</Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Privacy community */}
      <FadeIn delay={0.15}>
        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-semibold">Privacy in community</h2>
                <p className="text-xs text-muted-foreground">Decidi cosa gli altri studenti possono vedere del tuo profilo.</p>
              </div>
            </div>

            {/* Master switch */}
            <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${settings.visibleInCommunity ? "bg-primary/5 border-primary/30" : "bg-muted/40"}`}>
              <div className="flex items-center gap-3 min-w-0">
                {settings.visibleInCommunity ? <Eye className="h-4 w-4 text-primary shrink-0" /> : <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />}
                <div className="min-w-0">
                  <Label className="cursor-pointer">Profilo visibile nella community</Label>
                  <p className="text-xs text-muted-foreground">{settings.visibleInCommunity ? "Sei visibile nella lista profili" : "Sei nascosto agli altri studenti"}</p>
                </div>
              </div>
              <Switch checked={settings.visibleInCommunity} onCheckedChange={(v) => update("visibleInCommunity", v)} />
            </div>

            {settings.visibleInCommunity && (
              <>
                <Separator />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cosa mostrare</p>
                <div className="space-y-3">
                  {privacyFields.map((f) => (
                    <div key={f.key} className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={f.key} className="cursor-pointer">{f.label}</Label>
                        <p className="text-xs text-muted-foreground">{f.description}</p>
                      </div>
                      <Switch
                        id={f.key}
                        checked={settings[f.key] as boolean}
                        onCheckedChange={(v) => update(f.key, v)}
                      />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={reset} className="w-full sm:w-auto">
                  Ripristina impostazioni predefinite
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Notifiche */}
      <FadeIn delay={0.2}>
        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <h2 className="font-heading font-semibold">Notifiche</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1"><Label>Email</Label><p className="text-xs text-muted-foreground">Ricevi notifiche via email</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1"><Label>Push</Label><p className="text-xs text-muted-foreground">Notifiche push sul browser</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1"><Label>Eventi community</Label><p className="text-xs text-muted-foreground">Avvisi su nuovi eventi e post</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1"><Label>Scadenze pagamenti</Label><p className="text-xs text-muted-foreground">Reminder prima della scadenza</p></div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Sicurezza */}
      <FadeIn delay={0.3}>
        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <h2 className="font-heading font-semibold">Sicurezza</h2>
            <div className="space-y-2"><Label>Nuova password</Label><Input type="password" placeholder="Min. 8 caratteri" /></div>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({ title: "Password aggiornata!" })}>Cambia password</Button>
          </CardContent>
        </Card>
      </FadeIn>
    </PageTransition>
  );
}
