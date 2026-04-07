import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function MioProfilo() {
  const [nome, setNome] = useState(`${currentUser.nome} ${currentUser.cognome}`);
  const [bio, setBio] = useState(currentUser.bio);
  const [instagram, setInstagram] = useState(currentUser.instagram || "");
  const { toast } = useToast();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold">Il Mio Profilo</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-xl">{currentUser.nome[0]}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Cambia foto</Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bio <span className="text-muted-foreground text-xs">({bio.length}/200)</span></Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 200))} maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label>Corso di laurea</Label>
              <Input value={currentUser.corso} disabled />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@tuohandle" />
            </div>
            <div className="space-y-2">
              <Label>Interessi</Label>
              <div className="flex flex-wrap gap-2">
                {currentUser.interessi.map((i) => (
                  <Badge key={i} variant="outline">{i} ×</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostra il mio profilo in community</Label>
              <Switch defaultChecked />
            </div>
          </div>

          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => toast({ title: "Profilo aggiornato!" })}>
            Salva modifiche
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-heading font-semibold">Sicurezza</h2>
          <div className="space-y-2">
            <Label>Nuova password</Label>
            <Input type="password" placeholder="Min. 8 caratteri" />
          </div>
          <Button variant="outline" onClick={() => toast({ title: "Password aggiornata!" })}>Cambia password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
