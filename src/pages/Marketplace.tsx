import { CyberpunkCard } from "@/components/CyberpunkCard";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { DollarSign, Plus, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Marketplace() {
  const items = useQuery(api.marketplace.list);
  const createItem = useMutation(api.marketplace.create);
  const buyItem = useMutation(api.marketplace.buy);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createItem({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
      });
      setIsDialogOpen(false);
      toast.success("Item listed for sale");
    } catch (error) {
      toast.error("Failed to list item");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">CAMPUS <span className="text-secondary">MARKET</span></h1>
            <p className="text-muted-foreground font-mono text-sm">Buy. Sell. Barter. No scams.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" /> Sell Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List an Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input name="title" required placeholder="e.g. Graphing Calculator" />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input name="price" type="number" min="0" step="0.01" required placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input name="category" required placeholder="e.g. Electronics, Books" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" required placeholder="Condition, details, etc." />
                </div>
                <Button type="submit" className="w-full">List Item</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items?.map((item) => (
            <CyberpunkCard key={item._id} className="border-accent/30 hover:border-accent/60">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg truncate pr-2">{item.title}</h3>
                <span className="font-mono text-accent font-bold">${item.price}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
              
              <Button 
                className="w-full bg-accent/10 text-accent hover:bg-accent/20 border border-accent/50"
                onClick={() => {
                  buyItem({ itemId: item._id });
                  toast.success("Item marked as sold!");
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </CyberpunkCard>
          ))}
          
          {items?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border">
              <p>Marketplace is empty. Be the first to sell your junk.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
