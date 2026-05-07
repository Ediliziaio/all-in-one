import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { mockPosts, mockProfiles, currentUser, type CommunityPost } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/MotionWrappers";

const tipoBadge: Record<string, string> = {
  post: "bg-blue-100 text-blue-700",
  evento: "bg-purple-100 text-purple-700",
  annuncio: "bg-accent/20 text-accent",
  cercasi: "bg-green-100 text-green-700",
};

const tipoOptions = [
  { value: "post", label: "Post" },
  { value: "evento", label: "Evento" },
  { value: "annuncio", label: "Annuncio" },
  { value: "cercasi", label: "Cercasi" },
];

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const [tipo, setTipo] = useState("post");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useLocalStorage<CommunityPost[]>("sn_posts_v1", mockPosts);
  const [likedIds, setLikedIds] = useLocalStorage<string[]>("sn_liked_posts_v1", []);
  const onlineStudents = mockProfiles.filter((p) => p.role === "student").slice(0, 3);
  const eventi = posts.filter((p) => p.data_evento);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handlePublish = () => {
    if (!newPost.trim()) {
      toast({ title: "Scrivi qualcosa prima di pubblicare", variant: "destructive" });
      return;
    }
    const entry: CommunityPost = {
      id: `post_${Date.now()}`,
      author: currentUser,
      tipo: tipo as CommunityPost["tipo"],
      contenuto: newPost.trim(),
      likes: 0,
      created_at: new Date().toISOString(),
    };
    setPosts((prev) => [entry, ...prev]);
    setNewPost("");
    toast({ title: "Post pubblicato!" });
  };

  const handleLike = (postId: string) => {
    const already = likedIds.includes(postId);
    setLikedIds((prev) => already ? prev.filter((id) => id !== postId) : [...prev, postId]);
    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, likes: p.likes + (already ? -1 : 1) } : p),
    );
  };

  return (
    <PageTransition className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FadeIn><h1 className="font-heading text-xl md:text-2xl font-bold">Community</h1></FadeIn>

          {/* Eventi su mobile (sopra ai post) */}
          {eventi.length > 0 && (
            <FadeIn delay={0.05} className="lg:hidden">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" /> Prossimi eventi
                  </h3>
                  <div className="flex gap-3 overflow-x-auto -mx-1 px-1">
                    {eventi.map((p) => (
                      <div key={p.id} className="shrink-0 w-48 p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium truncate">{p.titolo || "Evento"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.data_evento!).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Composer */}
          <FadeIn delay={0.1}>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.nome[0]}</AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder="Cosa vuoi condividere?"
                    className="min-h-[70px] flex-1"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <ToggleGroup
                    type="single"
                    value={tipo}
                    onValueChange={(v) => v && setTipo(v)}
                    className="flex-wrap justify-start"
                  >
                    {tipoOptions.map((t) => (
                      <ToggleGroupItem key={t.value} value={t.value} size="sm" className="text-xs h-8">
                        {t.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto" onClick={handlePublish}>
                    Pubblica
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Posts */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <StaggerContainer className="space-y-4">
              {posts.map((post) => {
                const liked = likedIds.includes(post.id);
                return (
                <StaggerItem key={post.id}>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.nome[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm truncate">{post.author.nome} {post.author.cognome}</span>
                              <Badge className={tipoBadge[post.tipo]} variant="outline">{post.tipo}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{post.author.corso} · {new Date(post.created_at).toLocaleDateString("it-IT")}</p>
                          </div>
                        </div>
                        {post.titolo && <p className="font-heading font-semibold">{post.titolo}</p>}
                        <p className="text-sm">{post.contenuto}</p>
                        {post.data_evento && (
                          <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-2">
                            <Calendar className="h-4 w-4 text-accent shrink-0" />
                            <span className="truncate">{new Date(post.data_evento).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-4 pt-2 border-t">
                          <motion.button
                            whileTap={{ scale: 1.3 }}
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1 text-sm transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                          >
                            <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} /> {post.likes}
                          </motion.button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <MessageCircle className="h-4 w-4" /> Commenta
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <Share2 className="h-4 w-4" /> Condividi
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>

        {/* Sidebar desktop */}
        <div className="space-y-4 hidden lg:block">
          <FadeIn direction="right">
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
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-heading font-semibold text-sm">Prossimi eventi</h3>
                {eventi.map((p) => (
                  <div key={p.id} className="text-sm">
                    <p className="font-medium">{p.titolo || "Evento"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.data_evento!).toLocaleDateString("it-IT")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
