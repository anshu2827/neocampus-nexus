import { CyberpunkCard } from "@/components/CyberpunkCard";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Attendance() {
  const attendance = useQuery(api.attendance.getMyAttendance);
  const updateSubject = useMutation(api.attendance.updateSubject);
  const deleteSubject = useMutation(api.attendance.deleteSubject);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get("subject") as string;
    
    try {
      await updateSubject({
        subject,
        totalClasses: 0,
        attendedClasses: 0,
      });
      setIsDialogOpen(false);
      toast.success("Subject added successfully");
    } catch (error) {
      toast.error("Failed to add subject");
    }
  };

  const handleUpdate = async (id: Id<"attendance">, current: any, change: number, type: "attended" | "total") => {
    try {
      const newAttended = type === "attended" ? current.attendedClasses + change : current.attendedClasses;
      const newTotal = type === "total" ? current.totalClasses + change : current.totalClasses;
      
      // Auto increment total if attended is incremented
      const finalTotal = type === "attended" && change > 0 ? current.totalClasses + 1 : newTotal;

      if (newAttended < 0 || finalTotal < 0 || newAttended > finalTotal) return;

      await updateSubject({
        id,
        subject: current.subject,
        totalClasses: finalTotal,
        attendedClasses: newAttended,
      });
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">ATTENDANCE <span className="text-secondary">PREDICTOR</span></h1>
            <p className="text-muted-foreground font-mono text-sm">Don't get detained. Calculate your fate.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Subject</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Name</Label>
                  <Input name="subject" required placeholder="e.g. Advanced Algorithms" />
                </div>
                <Button type="submit" className="w-full">Add to Tracker</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendance?.map((subject) => {
            const percentage = subject.totalClasses > 0 
              ? Math.round((subject.attendedClasses / subject.totalClasses) * 100) 
              : 100;
            
            const isLow = percentage < 75;

            return (
              <CyberpunkCard key={subject._id} title={subject.subject} className={isLow ? "border-destructive/50" : ""}>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-4xl font-bold">
                      {percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subject.attendedClasses} / {subject.totalClasses} Classes
                    </div>
                  </div>
                  
                  <Progress value={percentage} className={`h-3 ${isLow ? "bg-destructive/20" : ""}`} />
                  
                  <div className="flex justify-between gap-2 pt-2">
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[10px] uppercase text-muted-foreground text-center">Attended</span>
                      <div className="flex items-center justify-center gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdate(subject._id, subject, -1, "attended")}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdate(subject._id, subject, 1, "attended")}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[10px] uppercase text-muted-foreground text-center">Missed</span>
                      <div className="flex items-center justify-center gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleUpdate(subject._id, subject, 1, "total")}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <p className="text-xs text-muted-foreground italic">
                      {isLow ? "💀 Bro, you're cooked." : "✨ Academic weapon."}
                    </p>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => deleteSubject({ id: subject._id })}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CyberpunkCard>
            );
          })}
          
          {attendance?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border">
              <p>No subjects tracked yet. Add one to start calculating your doom.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
