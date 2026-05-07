import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, FATTURE_KEY, mockFatture, type Fattura, type FatturaStato } from "@/data/mockData";
import { CreditCard, AlertTriangle, CheckCircle, Clock, Wallet, Download } from "lucide-react";
import { toast } from "sonner";
import { formatEUR } from "@/lib/csv";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const statoBadge: Record<FatturaStato, { class: string; label: string }> = {
  pagata:     { class: "bg-green-100 text-green-700 border-green-300",   label: "Pagata" },
  inviata:    { class: "bg-blue-100 text-blue-700 border-blue-300",      label: "Da pagare" },
  scaduta:    { class: "bg-red-100 text-red-700 border-red-300",         label: "Scaduta" },
  in_ritardo: { class: "bg-orange-100 text-orange-700 border-orange-300", label: "In ritardo" },
};

const statoIcon: Record<FatturaStato, typeof CheckCircle> = {
  pagata:     CheckCircle,
  inviata:    Clock,
  scaduta:    AlertTriangle,
  in_ritardo: AlertTriangle,
};

const statoIconColor: Record<FatturaStato, string> = {
  pagata:     "text-green-600",
  inviata:    "text-blue-600",
  scaduta:    "text-red-600",
  in_ritardo: "text-orange-600",
};

type FilterTab = "tutti" | "da_pagare" | "pagati";

function loadMyFatture(): Fattura[] {
  try {
    const saved = localStorage.getItem(FATTURE_KEY);
    if (saved) {
      const all: Fattura[] = JSON.parse(saved);
      return all.filter((f) => f.student_id === currentUser.id);
    }
  } catch {}
  return mockFatture.filter((f) => f.student_id === currentUser.id);
}

export default function Pagamenti() {
  const [filter, setFilter] = useState<FilterTab>("tutti");
  const fatture = useMemo(() => loadMyFatture(), []);

  const totalePagato = fatture
    .filter((f) => f.stato === "pagata")
    .reduce((sum, f) => sum + f.importo, 0);

  const prossimaScadenza = fatture.find(
    (f) => f.stato === "inviata" || f.stato === "in_ritardo" || f.stato === "scaduta",
  );

  const filtered = fatture.filter((f) => {
    if (filter === "tutti") return true;
    if (filter === "da_pagare") return f.stato !== "pagata";
    return f.stato === "pagata";
  });

  const handlePay = (mese: string) =>
    toast.success(`Pagamento avviato per ${mese}`);

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-xl md:text-2xl font-bold">Pagamenti</h1>
        <p className="text-sm text-muted-foreground">Storico e stato delle tue fatture</p>
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
                <p className="text-lg md:text-xl font-bold">{formatEUR(totalePagato)}</p>
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
                <p className="text-sm font-semibold truncate">
                  {prossimaScadenza ? prossimaScadenza.data_scadenza : "Nessuna"}
                </p>
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
                <p className="text-lg md:text-xl font-bold">
                  {fatture.filter((f) => f.stato === "pagata").length}/{fatture.length}
                </p>
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
            <Button variant="outline" size="sm" onClick={() => toast.info("Funzione in arrivo")}>
              Modifica
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Fatture */}
      <FadeIn delay={0.25}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base md:text-lg">Le mie fatture</CardTitle>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
                <TabsList className="h-8">
                  <TabsTrigger value="tutti" className="text-xs h-6">Tutte</TabsTrigger>
                  <TabsTrigger value="da_pagare" className="text-xs h-6">Da pagare</TabsTrigger>
                  <TabsTrigger value="pagati" className="text-xs h-6">Pagate</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <StaggerContainer className="divide-y">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Nessuna fattura in questa categoria
              </p>
            ) : (
              filtered.map((f) => {
                const StatusIcon = statoIcon[f.stato];
                const badge = statoBadge[f.stato];
                const needsPay = f.stato !== "pagata";
                return (
                  <StaggerItem key={f.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        {/* Left: icon + info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <StatusIcon className={`h-5 w-5 ${statoIconColor[f.stato]}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-sm">{f.mese}</p>
                              {f.pdf_data && f.pdf_nome ? (
                                <a
                                  href={f.pdf_data}
                                  download={f.pdf_nome}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] gap-1 py-0 cursor-pointer hover:bg-primary/10 transition-colors"
                                  >
                                    <Download className="h-2.5 w-2.5" /> PDF
                                  </Badge>
                                </a>
                              ) : f.pdf_nome ? (
                                <Badge variant="outline" className="text-[10px] gap-1 py-0 text-muted-foreground">
                                  PDF
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Scadenza: {f.data_scadenza}
                              {f.data_pagamento && ` · Pagata il ${f.data_pagamento}`}
                            </p>
                            {f.metodo_pagamento && (
                              <p className="text-xs text-muted-foreground">{f.metodo_pagamento}</p>
                            )}
                            {f.solleciti.length > 0 && (
                              <p className="text-xs text-orange-600 mt-0.5">
                                ⚠ {f.solleciti.length} sollecit{f.solleciti.length === 1 ? "o" : "i"} ricevut{f.solleciti.length === 1 ? "o" : "i"}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: amount + action */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-13 sm:pl-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">{formatEUR(f.importo)}</p>
                            <Badge variant="outline" className={badge.class}>
                              {badge.label}
                            </Badge>
                          </div>
                          {needsPay && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                              onClick={() => handlePay(f.mese)}
                            >
                              Paga ora
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </StaggerItem>
                );
              })
            )}
          </StaggerContainer>
        </Card>
      </FadeIn>
    </PageTransition>
  );
}
