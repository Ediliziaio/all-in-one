import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { rooms, getRoomTypeLabel } from "@/data/rooms";
import { currentUser } from "@/data/mockData";
import { Check, ChevronRight, ChevronLeft, BedDouble, Calendar, User, ClipboardList, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

const steps = [
  { label: "Camera", icon: BedDouble },
  { label: "Date", icon: Calendar },
  { label: "Dati", icon: User },
  { label: "Riepilogo", icon: ClipboardList },
  { label: "Conferma", icon: PartyPopper },
];

export default function PrenotaCamera() {
  const [step, setStep] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [dataInizio, setDataInizio] = useState("2025-09-01");
  const [dataFine, setDataFine] = useState("2026-07-31");
  const [note, setNote] = useState("");

  const available = rooms.filter((r) => r.available);
  const room = rooms.find((r) => r.id === selectedRoom);

  const canNext = () => {
    if (step === 0) return !!selectedRoom;
    if (step === 1) return !!dataInizio && !!dataFine;
    return true;
  };

  const handleConfirm = () => {
    setStep(4);
    toast.success("Prenotazione inviata con successo!");
  };

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">Prenota una Camera</h1>
        <p className="text-sm text-muted-foreground">Segui i passaggi per richiedere una camera</p>
      </FadeIn>

      {/* Stepper */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        {/* Step 0: Scegli camera */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {available.map((r) => (
              <Card
                key={r.id}
                className={`cursor-pointer transition-all ${selectedRoom === r.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                onClick={() => setSelectedRoom(r.id)}
              >
                <img src={r.images[0]} alt={r.name} className="w-full h-36 object-cover rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{getRoomTypeLabel(r.type)} · {r.sqm}mq</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">{r.price}€/mese</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 1: Date */}
        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>Seleziona le date</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data inizio</Label>
                  <Input type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Data fine</Label>
                  <Input type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} />
                </div>
              </div>
              {room && (
                <p className="text-sm text-muted-foreground">
                  Camera disponibile dal <span className="font-medium text-foreground">{room.availableFrom}</span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Dati personali */}
        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>I tuoi dati</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input defaultValue={currentUser.nome} readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Cognome</Label>
                  <Input defaultValue={currentUser.cognome} readOnly className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={currentUser.email} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Corso di studi</Label>
                <Input defaultValue={currentUser.corso} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Note aggiuntive</Label>
                <Textarea placeholder="Preferenze, richieste speciali..." value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Riepilogo */}
        {step === 3 && room && (
          <Card>
            <CardHeader><CardTitle>Riepilogo prenotazione</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <img src={room.images[0]} alt={room.name} className="w-24 h-24 rounded-lg object-cover" />
                <div>
                  <p className="font-heading font-semibold">{room.name}</p>
                  <p className="text-sm text-muted-foreground">{getRoomTypeLabel(room.type)} · {room.sqm}mq · Piano {room.floor}</p>
                  <p className="font-bold text-primary mt-1">{room.price}€/mese</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Check-in:</span> <span className="font-medium">{dataInizio}</span></div>
                <div><span className="text-muted-foreground">Check-out:</span> <span className="font-medium">{dataFine}</span></div>
                <div><span className="text-muted-foreground">Studente:</span> <span className="font-medium">{currentUser.nome} {currentUser.cognome}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{currentUser.email}</span></div>
              </div>
              {note && (
                <>
                  <Separator />
                  <div className="text-sm"><span className="text-muted-foreground">Note:</span> {note}</div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Conferma */}
        {step === 4 && (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <PartyPopper className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold">Prenotazione inviata!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                La tua richiesta è stata inviata con successo. Riceverai una conferma via email entro 24 ore lavorative.
              </p>
            </CardContent>
          </Card>
        )}
      </FadeIn>

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Indietro
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Avanti <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleConfirm}>
              Conferma Prenotazione <Check className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </PageTransition>
  );
}
