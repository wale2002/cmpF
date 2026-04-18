import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
  Lock,
  Cloud,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Document Management",
    description:
      "Securely store and organize all your contracts, NDAs, SLAs and legal documents with intelligent tagging.",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share documents with team members and manage granular access permissions with real-time editing.",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Track document usage, access patterns and get valuable insights with AI-driven reporting.",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Bank-level AES-256 encryption and multi-factor authentication to protect your most sensitive data.",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description:
      "Reliable global cloud infrastructure with automatic multi-region backups and version control.",
    color: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Shield,
    title: "Compliance Ready",
    description:
      "Built-in compliance features for GDPR, HIPAA, and SOC2 legal and regulatory requirements.",
    color: "from-rose-500/20 to-red-500/20",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-white/20">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-purple-600/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center space-y-10 lg:space-y-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-mono">
                Version 2.0 Now Live
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9] max-w-5xl"
            >
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                Agreements.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-zinc-400 text-lg lg:text-xl max-w-2xl font-light leading-relaxed"
            >
              The ultimate platform for seamless contract lifecycle management.
              Empower your business with AI-driven insights and ironclad
              security.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-4 w-full sm:w-auto"
            >
              <button
                onClick={() => navigate("/login")}
                className="group relative px-10 py-5 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Access Dashboard{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="group px-10 py-5 border border-white/10 hover:border-white/40 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-500 w-full sm:w-auto"
              >
                Explore Features
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 lg:py-40 px-6 bg-zinc-950/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative bg-[#0a0a0a] p-10 lg:p-16 hover:bg-zinc-900/50 transition-colors duration-500"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
                />

                <div className="mb-8 relative">
                  <div
                    className={`absolute inset-0 blur-2xl opacity-20 bg-gradient-to-br ${feature.color}`}
                  />
                  <feature.icon className="w-10 h-10 text-white relative z-10 stroke-[1.5]" />
                </div>

                <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-500">
                  {feature.title}
                </h3>

                <p className="text-zinc-500 leading-relaxed font-light mb-8 group-hover:text-zinc-400 transition-colors duration-500">
                  {feature.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors duration-500">
                  Learn More <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 lg:py-40 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[4rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-12 lg:p-32 text-center">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl lg:text-7xl font-bold tracking-tighter leading-none">
                Elevate Your <br />
                <span className="text-zinc-500">Contract Game.</span>
              </h2>

              <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                Join forward-thinking teams transforming how they handle
                agreements. Experience the future of compliance today.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="group relative px-12 py-6 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase overflow-hidden transition-all duration-500"
              >
                <span className="relative z-10">Launch ContractHub</span>
                <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="font-bold tracking-[0.2em] uppercase text-xs">
              ContractHub
            </span>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-zinc-600">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
            © 2026 ContractHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
