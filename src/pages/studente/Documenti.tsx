import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, File, Receipt, Upload, CheckCircle2, AlertCircle, IdCard, FileCheck } from "lucide-react";
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

interface MyDoc {
  id: string;
  nome: string;
  icona: typeof IdCard;
  caricato: boolean;
  data?: string;
}

export default function Documenti() {
  const [myDocs, setMyDocs] = useState<MyDoc[]>([
    { id: "ci", nome: "Carta d'identità", icona: IdCard, caricato: true, data: "2025-08-15" },
    { id: "cf", nome: "Codice fiscale", icona: FileCheck, caricato: true, data: "2025-08-15" },
    { id: "iscrizione", nome: "Certificato iscrizione UniPD", icona: FileText, caricato: false },
    { id: "isee", nome: "ISEE 2025", icona: FileText, caricato: false },
  ]);
  const [uploadDoc, setUploadDoc] = useState<MyDoc | null>(null);

  const handleDownload = (nome: string) => toast.success(`Download avviato: ${nome}`);
  const handleUpload = () => {
    if (!uploadDoc) return;
    setMyDocs(myDocs.map((d) => d.id === uploadDoc.id ? { ...d, caricato: true, data: new Date().toISOString().slice(0, 10) } : d));
    toast.success(`${uploadDoc.nome} caricato con successo`);
    setUploadDoc(null);
  };

  const docsCaricati = myDocs.filter((d) => d.caricato).length;

  return (
    <PageTransition className="p-4 md:p-6 space-y-5 md:space-y-6">
      <FadeIn>
        <h1 className="font-heading text-xl md:text-2xl font-bold">Documenti</h1>
        <p className="text-sm text-muted-foreground">Gestisci i tuoi documenti personali e quelli dello studentato</p>
      </FadeIn>

      {/* I miei documenti */}
      <FadeIn delay={0.1}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base md:text-lg">I miei documenti</CardTitle>
              <Badge variant="outline" className="text-xs">{docsCaricati}/{myDocs.length} caricati</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {myDocs.map((d) => {
              const Icon = d.icona;
              return (
                <div key={d.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center shrink-0 border">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{d.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.caricato ? `Caricato il ${d.data}` : "Da caricare"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {d.caricato ? (
                      <>
                        <Badge className="bg-green-100 text-green-700 gap-1 border-green-300" variant="outline">
                          <CheckCircle2 className="h-3 w-3" /> Caricato
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(d.nome)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge className="bg-yellow-100 text-yellow-700 gap-1 border-yellow-300" variant="outline">
                          <AlertCircle className="h-3 w-3" /> Mancante
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => setUploadDoc(d)}>
                          <Upload className="h-3 w-3 mr-1" /> Carica
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Documenti dallo studentato */}
      <FadeIn delay={0.15}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Dallo studentato</CardTitle>
          </CardHeader>
          <StaggerContainer className="divide-y">
            {mockDocumenti.map((doc) => {
              const Icon = tipoIcon[doc.tipo] || File;
              return (
                <StaggerItem key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground">{doc.data} · {doc.dimensione}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <Badge variant="outline" className={tipoBadge[doc.tipo]}>{doc.tipo}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.nome)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Card>
      </FadeIn>

      {/* Upload dialog */}
      <Dialog open={!!uploadDoc} onOpenChange={(o) => !o && setUploadDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Carica {uploadDoc?.nome}</DialogTitle>
            <DialogDescription>Seleziona il file (PDF, JPG o PNG, max 10MB).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUploadDoc(null)}>Annulla</Button>
            <Button onClick={handleUpload}>Carica</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
