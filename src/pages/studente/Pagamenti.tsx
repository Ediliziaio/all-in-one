import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPagamenti } from "@/data/mockData";
import { CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const statoBadge: Record<string, { class: string; label: string }> = {
  pagato: { class: "bg-green-100 text-green-700 border-green-300", label: "Pagato" },
  in_scadenza: { class: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "In scadenza" },
  scaduto: { class: "bg-red-100 text-red-700 border-red-300", label: "Scaduto" },
};

const statoIcon: Record<string, typeof CheckCircle> = {
  pagato: CheckCircle,
  in_scadenza: Clock,
  scaduto: AlertTriangle,
};

export default function Pagamenti() {
  const totalePagato = mockPagamenti.filter((p) => p.stato === "pagato").reduce((sum, p) => sum + p.importo, 0);
  const prossimaScadenza = mockPagamenti.find((p) => p.stato === "in_scadenza");

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">Pagamenti</h1>
        <p className="text-sm text-muted-foreground">Storico e stato dei tuoi pagamenti</p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FadeIn delay={0.1}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Totale pagato</p>
                <p className="text-xl font-bold">{totalePagato}€</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prossima scadenza</p>
                <p className="text-sm font-semibold">{prossimaScadenza ? prossimaScadenza.data_scadenza : "Nessuna"}</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rate pagate</p>
                <p className="text-xl font-bold">{mockPagamenti.filter((p) => p.stato === "pagato").length}/{mockPagamenti.length}</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <Card>
          <CardHeader><CardTitle>Storico Pagamenti</CardTitle></CardHeader>
          <StaggerContainer className="divide-y">
            {mockPagamenti.map((p) => {
              const StatusIcon = statoIcon[p.stato];
              const badge = statoBadge[p.stato];
              return (
                <StaggerItem key={p.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <StatusIcon className={`h-5 w-5 ${p.stato === "pagato" ? "text-green-600" : p.stato === "scaduto" ? "text-red-600" : "text-yellow-600"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.mese}</p>
                      <p className="text-xs text-muted-foreground">
                        Scadenza: {p.data_scadenza}
                        {p.data_pagamento && ` · Pagato il ${p.data_pagamento}`}
                        {p.metodo && ` · ${p.metodo}`}
                      </p>
                    </div>
                    <p className="font-bold text-sm">{p.importo}€</p>
                    <Badge variant="outline" className={badge.class}>{badge.label}</Badge>
                  </CardContent>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Card>
      </FadeIn>
    </PageTransition>
  );
}
