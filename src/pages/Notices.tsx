import { CyberpunkCard } from "@/components/CyberpunkCard";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, Bell, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Notices() {
  const notices = useQuery(api.notices.list);
  const createNotice = useMutation(api.notices.create);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createNotice({
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as string,
        deadline: Date.now() + 86400000 * 7, // Mock deadline 7 days from now
      });
      setIsDialogOpen(false);
      toast.success("Notice posted");
    } catch (error) {
      toast.error("Failed to post notice");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">OFFICIAL <span className="text-secondary">NOTICES</span></h1>
            <p className="text-muted-foreground font-mono text-sm">No BS. Just what you need to know.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Post Notice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post a Notice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input name="title" required placeholder="e.g. Exam Schedule Change" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input name="category" required placeholder="e.g. Academic, Admin, Sports" />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea name="content" required placeholder="Details..." />
                </div>
                <Button type="submit" className="w-full">Post Notice</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {notices?.map((notice) => (
            <CyberpunkCard key={notice._id} className="border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{notice.title}</h3>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notice.content}</p>
                  {notice.deadline && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      Deadline: {new Date(notice.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CyberpunkCard>
          ))}
          
          {notices?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border">
              <p>No notices. Enjoy the silence.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
