import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/GlitchText";
import { motion } from "framer-motion";
import { ArrowRight, Ghost, Zap, BookOpen, Users } from "lucide-react";
import { Link } from "react-router";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="container mx-auto p-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary/20 border border-primary flex items-center justify-center">
            <span className="font-bold text-primary">C</span>
          </div>
          <span className="font-bold tracking-tighter text-xl">CAMPUS<span className="text-secondary">VERSE</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/auth">
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10 hover:text-primary">
              Login
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Join the Verse
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="inline-block mb-4 px-4 py-1.5 border border-secondary/50 rounded-full bg-secondary/10 text-secondary text-sm font-mono uppercase tracking-wider">
            v2.0.77 [BETA] // SYSTEM ONLINE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            THE <GlitchText text="SMART" className="text-primary" /> CAMPUS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
              SUPER-APP
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage attendance, find study buddies, drop anonymous confessions, and track campus hype. 
            All in one cyberpunk-styled interface.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 group">
                Enter CampusVerse
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/5">
                Explore Features
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 w-full max-w-6xl pb-20">
          {[
            { icon: BookOpen, title: "Attendance AI", desc: "Predicts risks. Roasts you if you skip.", color: "text-primary" },
            { icon: Ghost, title: "Confessions", desc: "Anonymous. Encrypted. Spicy.", color: "text-secondary" },
            { icon: Users, title: "Study Buddies", desc: "Match by major & study style.", color: "text-accent" },
            { icon: Zap, title: "Hype Meter", desc: "Track the hottest campus events.", color: "text-yellow-400" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group"
            >
              <feature.icon className={`h-10 w-10 mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-bold mb-2 font-mono uppercase">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}