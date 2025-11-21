import { CyberpunkCard } from "@/components/CyberpunkCard";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Calendar, MapPin, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Events() {
  const events = useQuery(api.events.list);
  const createEvent = useMutation(api.events.create);
  const hypeEvent = useMutation(api.events.hype);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createEvent({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        category: formData.get("category") as string,
        date: Date.now(), // Simplified for demo
      });
      setIsDialogOpen(false);
      toast.success("Event created successfully");
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">CAMPUS <span className="text-secondary">EVENTS</span></h1>
            <p className="text-muted-foreground font-mono text-sm">Don't miss out. The FOMO is real.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Host an Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input name="title" required placeholder="e.g. Hackathon 2077" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input name="category" required placeholder="e.g. Tech, Party, Workshop" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input name="location" required placeholder="e.g. Main Auditorium" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" required placeholder="What's happening?" />
                </div>
                <Button type="submit" className="w-full">Launch Event</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events?.map((event) => (
            <CyberpunkCard key={event._id} className="hover:border-primary/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">{event.title}</h3>
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
                    {event.category}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{event.hypeScore}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">Hype</div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-secondary/50 text-secondary hover:bg-secondary/10"
                onClick={() => hypeEvent({ eventId: event._id })}
              >
                <Zap className="mr-2 h-4 w-4" /> Boost Hype
              </Button>
            </CyberpunkCard>
          ))}
          
          {events?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border">
              <p>No active events. Campus is dead right now.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
