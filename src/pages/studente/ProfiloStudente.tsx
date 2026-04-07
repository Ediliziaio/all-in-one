import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Instagram, MessageCircle, ArrowLeft } from "lucide-react";
import { mockProfiles } from "@/data/mockData";

export default function ProfiloStudente() {
  const { id } = useParams();
  const profile = mockProfiles.find((p) => p.id === id);

  if (!profile) return <div className="p-6 text-center text-muted-foreground">Profilo non trovato</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Link to="/studente/community/profili" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Torna ai profili
      </Link>

      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <Avatar className="h-28 w-28 mx-auto">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-3xl">{profile.nome[0]}{profile.cognome[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-heading text-2xl font-bold">{profile.nome} {profile.cognome}</h1>
            <p className="text-muted-foreground">{profile.corso} · {profile.anno}° anno</p>
          </div>
          <p className="text-sm max-w-md mx-auto">{profile.bio}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {profile.interessi.map((i) => (
              <Badge key={i} variant="outline">{i}</Badge>
            ))}
          </div>
          <div className="flex justify-center gap-3 pt-2">
            {profile.instagram && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4 mr-1" /> {profile.instagram}
                </a>
              </Button>
            )}
            <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" asChild>
              <a href="https://api.whatsapp.com" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
