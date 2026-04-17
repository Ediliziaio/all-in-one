import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

export default function AdminImpostazioni() {
  const [settings, setSettings] = useState({
    nomeStruttura: "Studentato Napoleone Padova",
    email: "info@studentatopd.it",
    telefono: "+39 049 1234567",
    indirizzo: "Via Università 4, 35122 Padova PD",
    orarioApertura: "08:00",
    orarioChiusura: "22:00",
    notificheEmail: true,
    notificheSMS: false,
    manutenzioneAutomatica: true,
  });

  const handleSave = () => {
    toast.success("Impostazioni salvate con successo!");
  };

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">Impostazioni</h1>
        <p className="text-sm text-muted-foreground">Gestisci le impostazioni della struttura</p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader><CardTitle>Informazioni Struttura</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome struttura</Label>
                <Input value={settings.nomeStruttura} onChange={(e) => setSettings({ ...settings, nomeStruttura: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefono</Label>
                <Input value={settings.telefono} onChange={(e) => setSettings({ ...settings, telefono: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Indirizzo</Label>
                <Input value={settings.indirizzo} onChange={(e) => setSettings({ ...settings, indirizzo: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Apertura</Label>
                  <Input type="time" value={settings.orarioApertura} onChange={(e) => setSettings({ ...settings, orarioApertura: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Chiusura</Label>
                  <Input type="time" value={settings.orarioChiusura} onChange={(e) => setSettings({ ...settings, orarioChiusura: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader><CardTitle>Notifiche</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Notifiche Email</p>
                  <p className="text-xs text-muted-foreground">Ricevi avvisi via email per nuove prenotazioni e ticket</p>
                </div>
                <Switch checked={settings.notificheEmail} onCheckedChange={(v) => setSettings({ ...settings, notificheEmail: v })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Notifiche SMS</p>
                  <p className="text-xs text-muted-foreground">Ricevi SMS per comunicazioni urgenti</p>
                </div>
                <Switch checked={settings.notificheSMS} onCheckedChange={(v) => setSettings({ ...settings, notificheSMS: v })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Manutenzione automatica</p>
                  <p className="text-xs text-muted-foreground">Crea automaticamente ticket di manutenzione programmata</p>
                </div>
                <Switch checked={settings.manutenzioneAutomatica} onCheckedChange={(v) => setSettings({ ...settings, manutenzioneAutomatica: v })} />
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">Salva Impostazioni</Button>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
