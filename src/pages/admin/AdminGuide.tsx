import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGuide } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

export default function AdminGuide() {
  const { toast } = useToast();

  return (
    <PageTransition className="p-6 space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Guide</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4 mr-2" />Nuova Guida</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nuova Guida</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-2"><Label>Titolo</Label><Input placeholder="Come fare..." /></div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Burocrazia">Burocrazia</SelectItem>
                      <SelectItem value="Università">Università</SelectItem>
                      <SelectItem value="Vita in Città">Vita in Città</SelectItem>
                      <SelectItem value="Risparmio">Risparmio</SelectItem>
                      <SelectItem value="Trasporti">Trasporti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Contenuto</Label><Textarea placeholder="Scrivi la guida..." rows={6} /></div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => toast({ title: "Guida creata!" })}>Pubblica</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      <StaggerContainer className="space-y-3">
        {mockGuide.map((g) => (
          <StaggerItem key={g.id}>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <p className="font-medium">{g.titolo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{g.contenuto}</p>
                  </div>
                  <Badge variant="outline">{g.categoria}</Badge>
                  <Switch defaultChecked={g.attiva} />
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
