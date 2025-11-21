import { CyberpunkCard } from "@/components/CyberpunkCard";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BookOpen, MessageSquare, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

export default function Buddies() {
  const potentialMatches = useQuery(api.buddies.getPotentialMatches);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">STUDY <span className="text-secondary">BUDDIES</span></h1>
            <p className="text-muted-foreground font-mono text-sm">Find your academic soulmate. Or just someone to suffer with.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potentialMatches?.map((user) => (
            <CyberpunkCard key={user._id} className="text-center">
              <div className="h-20 w-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-primary">{user.name?.[0] || "U"}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{user.name || "Anonymous Student"}</h3>
              <p className="text-sm text-muted-foreground mb-4">{user.major || "Undeclared Major"}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {user.interests?.map((interest, i) => (
                  <span key={i} className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded border border-secondary/20">
                    {interest}
                  </span>
                )) || <span className="text-xs text-muted-foreground italic">No interests listed</span>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full" onClick={() => toast.success("Request sent!")}>
                  <UserPlus className="mr-2 h-4 w-4" /> Connect
                </Button>
                <Button className="w-full" onClick={() => toast.success("Chat feature coming soon!")}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
              </div>
            </CyberpunkCard>
          ))}
          
          {potentialMatches?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No matches found. Looks like you're studying solo today.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
