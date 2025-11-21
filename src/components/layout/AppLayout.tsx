import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { BookOpen, Calendar, Ghost, Home, ShoppingBag, Users, Zap } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Hub", path: "/" },
    { icon: Calendar, label: "Attend", path: "/attendance" },
    { icon: Ghost, label: "Confess", path: "/confessions" },
    { icon: Users, label: "Buddies", path: "/buddies" },
    { icon: Zap, label: "Events", path: "/events" },
    { icon: ShoppingBag, label: "Market", path: "/marketplace" },
    { icon: BookOpen, label: "Notices", path: "/notices" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-xl font-bold text-primary tracking-tighter">CAMPUS<span className="text-secondary">VERSE</span></div>
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
          <span className="text-xs font-bold">{user?.name?.[0] || "U"}</span>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border h-screen sticky top-0 p-4 bg-background/50 backdrop-blur-sm">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-primary tracking-tighter glitch-effect">
            CAMPUS<span className="text-secondary">VERSE</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">v2.0.77 [BETA]</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-none border-l-2 transition-all duration-200 group hover:bg-primary/5",
                  isActive 
                    ? "border-primary text-primary bg-primary/10" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/50"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                <span className="font-mono text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-none border border-primary bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">{user?.name?.[0] || "U"}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || "Guest User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "Sign in required"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="container mx-auto p-4 md:p-8 max-w-6xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border z-50 px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "animate-bounce")} />
                <span className="text-[10px] font-mono uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
