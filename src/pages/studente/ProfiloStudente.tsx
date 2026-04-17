import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Instagram, MessageCircle, ArrowLeft, Mail, BedDouble, EyeOff } from "lucide-react";
import { mockProfiles, currentUser } from "@/data/mockData";
import { getRoomById } from "@/data/rooms";
import { usePrivacySettings, DEFAULT_PRIVACY, type PrivacySettings } from "@/hooks/usePrivacySettings";
import { PageTransition, FadeIn } from "@/components/motion/MotionWrappers";

export default function ProfiloStudente() {
  const { id } = useParams();
  const profile = mockProfiles.find((p) => p.id === id);
  const { settings: mySettings } = usePrivacySettings();

  if (!profile) return <div className="p-6 text-center text-muted-foreground">Profilo non trovato</div>;

  // Privacy: il profilo corrente usa le impostazioni vere; gli altri usano i default (mock)
  const isMe = profile.id === currentUser.id;
  const privacy: PrivacySettings = isMe ? mySettings : DEFAULT_PRIVACY;
  const room = profile.camera_id ? getRoomById(profile.camera_id) : null;

  // Profilo nascosto
  if (!privacy.visibleInCommunity && !isMe) {
    return (
      <PageTransition className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <Link to="/studente/community/profili" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Torna ai profili
        </Link>
        <Card>
          <CardContent className="p-10 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto">
              <EyeOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-lg font-semibold">Profilo privato</h1>
            <p className="text-sm text-muted-foreground">Questo studente ha scelto di non mostrare il proprio profilo.</p>
          </CardContent>
        </Card>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <Link to="/studente/community/profili" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Torna ai profili
      </Link>

      <FadeIn>
        <Card>
          <CardContent className="p-5 md:p-6 text-center space-y-4">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 mx-auto">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-2xl md:text-3xl">{profile.nome[0]}{profile.cognome[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold">{profile.nome} {profile.cognome}</h1>
              {(privacy.showCorso || privacy.showAnno) && (
                <p className="text-sm text-muted-foreground">
                  {privacy.showCorso && profile.corso}
                  {privacy.showCorso && privacy.showAnno && " · "}
                  {privacy.showAnno && `${profile.anno}° anno`}
                </p>
              )}
            </div>

            {privacy.showBio && profile.bio && (
              <p className="text-sm max-w-md mx-auto">{profile.bio}</p>
            )}

            {privacy.showInteressi && profile.interessi.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {profile.interessi.map((i) => (
                  <Badge key={i} variant="outline">{i}</Badge>
                ))}
              </div>
            )}

            {/* Info camera/piano */}
            {(privacy.showPiano || (privacy.showCamera && room)) && (
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                {privacy.showPiano && profile.piano && (
                  <Badge variant="secondary" className="gap-1"><BedDouble className="h-3 w-3" /> Piano {profile.piano}</Badge>
                )}
                {privacy.showCamera && room && (
                  <Badge variant="secondary">{room.name}</Badge>
                )}
              </div>
            )}

            {/* Email */}
            {privacy.showEmail && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${profile.email}`} className="hover:text-foreground hover:underline truncate">{profile.email}</a>
              </div>
            )}

            {/* Contatti */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {privacy.showInstagram && profile.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 mr-1" /> {profile.instagram}
                  </a>
                </Button>
              )}
              {privacy.allowWhatsApp && (
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" asChild>
                  <a href="https://api.whatsapp.com" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </PageTransition>
  );
}
