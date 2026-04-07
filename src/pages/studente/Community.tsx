import { useState } from "react";
import { Heart, MessageCircle, Share2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockPosts, mockProfiles, currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const tipoBadge: Record<string, string> = {
  post: "bg-blue-100 text-blue-700",
  evento: "bg-purple-100 text-purple-700",
  annuncio: "bg-accent/20 text-accent",
  cercasi: "bg-green-100 text-green-700",
};

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  const onlineStudents = mockProfiles.filter((p) => p.role === "student").slice(0, 3);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="font-heading text-2xl font-bold">Community</h1>

          {/* Composer */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.nome[0]}</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="Cosa vuoi condividere?"
                  className="min-h-[60px]"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["Post", "Evento", "Annuncio", "Cercasi"].map((t) => (
                    <Badge key={t} variant="outline" className="cursor-pointer hover:bg-muted">{t}</Badge>
                  ))}
                </div>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setNewPost(""); toast({ title: "Post pubblicato!" }); }}>
                  Pubblica
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {mockPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.author.nome} {post.author.cognome}</span>
                      <Badge className={tipoBadge[post.tipo]} variant="outline">{post.tipo}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{post.author.corso} · {new Date(post.created_at).toLocaleDateString("it-IT")}</p>
                  </div>
                </div>
                {post.titolo && <p className="font-heading font-semibold">{post.titolo}</p>}
                <p className="text-sm">{post.contenuto}</p>
                {post.data_evento && (
                  <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{new Date(post.data_evento).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="h-4 w-4" /> Commenta
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="h-4 w-4" /> Condividi
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 hidden lg:block">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-heading font-semibold text-sm">Chi c'è online</h3>
              {onlineStudents.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={s.avatar} />
                      <AvatarFallback>{s.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                  </div>
                  <span className="text-sm">{s.nome} {s.cognome}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-heading font-semibold text-sm">Prossimi eventi</h3>
              {mockPosts.filter((p) => p.data_evento).map((p) => (
                <div key={p.id} className="text-sm">
                  <p className="font-medium">{p.titolo || "Evento"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.data_evento!).toLocaleDateString("it-IT")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
