import { CyberpunkCard } from "@/components/CyberpunkCard";
import { GlitchText } from "@/components/GlitchText";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Calendar, Ghost, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const { user } = useAuth();
  const attendance = useQuery(api.attendance.getMyAttendance);
  const events = useQuery(api.events.list);
  
  // Calculate overall attendance
  const totalClasses = attendance?.reduce((acc, curr) => acc + curr.totalClasses, 0) || 0;
  const attendedClasses = attendance?.reduce((acc, curr) => acc + curr.attendedClasses, 0) || 0;
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              WELCOME BACK, <GlitchText text={user?.name?.split(" ")[0] || "STUDENT"} className="text-primary" />
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              &gt; SYSTEM STATUS: ONLINE
              <br />
              &gt; SEMESTER PROGRESS: 64%
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <Calendar className="mr-2 h-4 w-4" />
              Sync Calendar
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CyberpunkCard title="Attendance Risk" className="border-destructive/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall</span>
                <span className={attendancePercentage < 75 ? "text-destructive" : "text-accent"}>
                  {attendancePercentage}%
                </span>
              </div>
              <Progress value={attendancePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {attendancePercentage < 75 
                  ? "⚠️ DANGER ZONE. 75% is calling." 
                  : "You're safe... for now."}
              </p>
            </div>
          </CyberpunkCard>

          <CyberpunkCard title="Campus Hype" className="border-secondary/50">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-secondary">
                {events?.length || 0}
              </div>
              <TrendingUp className="h-8 w-8 text-secondary animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active events near you</p>
          </CyberpunkCard>

          <CyberpunkCard title="Study Buddies" className="border-accent/50">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-accent">12</div>
              <Users className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Matches found this week</p>
          </CyberpunkCard>

          <CyberpunkCard title="Confessions" className="border-primary/50">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-primary">99+</div>
              <Ghost className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">New secrets dropped</p>
          </CyberpunkCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/attendance" className="group">
            <CyberpunkCard className="h-full hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 border border-primary flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Update Attendance</h3>
                  <p className="text-sm text-muted-foreground">Log today's classes before you forget.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </CyberpunkCard>
          </Link>

          <Link to="/confessions" className="group">
            <CyberpunkCard className="h-full hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-secondary/10 border border-secondary flex items-center justify-center">
                  <Ghost className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">Read Confessions</h3>
                  <p className="text-sm text-muted-foreground">See what's buzzing on campus.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-transform" />
              </div>
            </CyberpunkCard>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
