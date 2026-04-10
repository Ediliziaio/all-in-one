import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, File, Receipt } from "lucide-react";
import { mockDocumenti } from "@/data/mockData";
import { toast } from "sonner";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const tipoIcon: Record<string, typeof FileText> = {
  contratto: FileText,
  ricevuta: Receipt,
  documento: File,
};

const tipoBadge: Record<string, string> = {
  contratto: "bg-primary/10 text-primary border-primary/30",
  ricevuta: "bg-green-100 text-green-700 border-green-300",
  documento: "bg-muted text-muted-foreground",
};

export default function Documenti() {
  const handleDownload = (nome: string) => {
    toast.success(`Download avviato: ${nome}`);
  };

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <h1 className="font-heading text-2xl font-bold">Documenti</h1>
        <p className="text-sm text-muted-foreground">{mockDocumenti.length} documenti disponibili</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <StaggerContainer className="divide-y">
            {mockDocumenti.map((doc) => {
              const Icon = tipoIcon[doc.tipo] || File;
              return (
                <StaggerItem key={doc.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.nome}</p>
                      <p className="text-xs text-muted-foreground">{doc.data} · {doc.dimensione}</p>
                    </div>
                    <Badge variant="outline" className={tipoBadge[doc.tipo]}>{doc.tipo}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.nome)}>
                      <Download className="h-4 w-4" />
                    </Button>
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
