import { CyberpunkCard } from "@/components/CyberpunkCard";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Flame, Ghost, Laugh, Skull, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Confessions() {
  const confessions = useQuery(api.confessions.list);
  const postConfession = useMutation(api.confessions.post);
  const react = useMutation(api.confessions.react);
  
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await postConfession({ content, isAnonymous });
      setContent("");
      toast.success("Confession posted into the void.");
    } catch (error) {
      toast.error("Failed to post confession.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-primary">CAMPUS <span className="text-secondary">CONFESSIONS</span></h1>
          <p className="text-muted-foreground">Speak your truth. Stay anonymous. Or don't.</p>
        </div>

        {/* Post Box */}
        <CyberpunkCard className="border-secondary/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea 
              placeholder="What's on your mind? (e.g. 'The coffee at the library tastes like battery acid')"
              className="bg-background/50 min-h-[100px] resize-none border-secondary/20 focus:border-secondary"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label htmlFor="anonymous" className="text-xs font-mono">
                  {isAnonymous ? "🕵️ MODE: ANONYMOUS" : "👤 MODE: PUBLIC"}
                </Label>
              </div>
              <Button type="submit" disabled={isSubmitting || !content.trim()} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Send className="mr-2 h-4 w-4" />
                Drop It
              </Button>
            </div>
          </form>
        </CyberpunkCard>

        {/* Feed */}
        <div className="space-y-4">
          {confessions?.map((confession) => (
            <CyberpunkCard key={confession._id} className="hover:border-primary/40 transition-colors">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${confession.isAnonymous ? "bg-muted" : "bg-primary/20 border border-primary"}`}>
                    {confession.isAnonymous ? <Ghost className="h-5 w-5 text-muted-foreground" /> : <span className="font-bold text-primary">U</span>}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-muted-foreground">
                      {confession.isAnonymous ? "Anonymous User" : "Verified Student"} • {new Date(confession._creationTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{confession.content}</p>
                  
                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => react({ confessionId: confession._id, type: "fire" })}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-500 transition-colors"
                    >
                      <Flame className="h-4 w-4" /> {confession.reactions.fire}
                    </button>
                    <button 
                      onClick={() => react({ confessionId: confession._id, type: "laugh" })}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      <Laugh className="h-4 w-4" /> {confession.reactions.laugh}
                    </button>
                    <button 
                      onClick={() => react({ confessionId: confession._id, type: "skull" })}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gray-400 transition-colors"
                    >
                      <Skull className="h-4 w-4" /> {confession.reactions.skull}
                    </button>
                  </div>
                </div>
              </div>
            </CyberpunkCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
