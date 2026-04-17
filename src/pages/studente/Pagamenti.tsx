import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPagamenti } from "@/data/mockData";
import { CreditCard, AlertTriangle, CheckCircle, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
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

type FilterTab = "tutti" | "da_pagare" | "pagati";

export default function Pagamenti() {
  const [filter, setFilter] = useState<FilterTab>("tutti");

  const totalePagato = mockPagamenti.filter((p) => p.stato === "pagato").reduce((sum, p) => sum + p.importo, 0);
  const prossimaScadenza = mockPagamenti.find((p) => p.stato === "in_scadenza" || p.stato === "scaduto");

  const filtered = mockPagamenti.filter((p) => {
    if (filter === "tutti") return true;
    if (filter === "da_pagare") return p.stato !== "pagato";
    return p.stato === "pagato";
  });

  const handlePay = (mese: string) => toast.success(`Pagamento avviato per ${mese}`);

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-xl md:text-2xl font-bold">Pagamenti</h1>
        <p className="text-sm text-muted-foreground">Storico e stato dei tuoi pagamenti</p>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <FadeIn delay={0.1}>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Totale pagato</p>
                <p className="text-lg md:text-xl font-bold">{totalePagato}€</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Prossima scadenza</p>
                <p className="text-sm font-semibold truncate">{prossimaScadenza ? prossimaScadenza.data_scadenza : "Nessuna"}</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.2} className="col-span-2 md:col-span-1">
          <Card>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Rate pagate</p>
                <p className="text-lg md:text-xl font-bold">{mockPagamenti.filter((p) => p.stato === "pagato").length}/{mockPagamenti.length}</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Metodo di pagamento */}
      <FadeIn delay={0.22}>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Metodo di pagamento</p>
              <p className="text-sm font-semibold">Bonifico SEPA · IT60 X054 ••• 0123</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Funzione in arrivo")}>Modifica</Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Filtri + lista */}
      <FadeIn delay={0.25}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base md:text-lg">Storico Pagamenti</CardTitle>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
                <TabsList className="h-8">
                  <TabsTrigger value="tutti" className="text-xs h-6">Tutti</TabsTrigger>
                  <TabsTrigger value="da_pagare" className="text-xs h-6">Da pagare</TabsTrigger>
                  <TabsTrigger value="pagati" className="text-xs h-6">Pagati</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <StaggerContainer className="divide-y">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Nessun pagamento in questa categoria</p>
            ) : filtered.map((p) => {
              const StatusIcon = statoIcon[p.stato];
              const badge = statoBadge[p.stato];
              const needsPay = p.stato === "in_scadenza" || p.stato === "scaduto";
              return (
                <StaggerItem key={p.id}>
                  <CardContent className="p-4">
                    {/* Mobile stack / desktop row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <StatusIcon className={`h-5 w-5 ${p.stato === "pagato" ? "text-green-600" : p.stato === "scaduto" ? "text-red-600" : "text-yellow-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{p.mese}</p>
                          <p className="text-xs text-muted-foreground">
                            Scadenza: {p.data_scadenza}
                            {p.data_pagamento && ` · Pagato il ${p.data_pagamento}`}
                          </p>
                          {p.metodo && <p className="text-xs text-muted-foreground">{p.metodo}</p>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-13 sm:pl-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{p.importo}€</p>
                          <Badge variant="outline" className={badge.class}>{badge.label}</Badge>
                        </div>
                        {needsPay && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shrink-0" onClick={() => handlePay(p.mese)}>
                            Paga ora
                          </Button>
                        )}
                      </div>
                    </div>
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
