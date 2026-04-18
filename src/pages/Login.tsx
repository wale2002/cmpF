// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Skeleton } from "../components/ui/skeleton";
// // import { LoginForm } from "../components/LoginForm";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import { useQueryClient } from "@tanstack/react-query";
// // import { userService, organizationService } from "../lib/api";
// // import { Button } from "../components/ui/button";
// // import { GoogleLoginButton } from "../components/GoogleLoginButton";

// // const greeting = {
// //   title: "Welcome to CMP",
// //   subTitle: "Your Contract Management Platform",
// // };

// // const Login = () => {
// //   const { isAuthenticated, isLoading, googleLogin } = useAuthContext();
// //   const [showGreeting, setShowGreeting] = useState(true);
// //   const [showWelcome, setShowWelcome] = useState(false);
// //   const navigate = useNavigate();
// //   const queryClient = useQueryClient();

// //   const handleGoogleSuccess = async (credential: string) => {
// //     try {
// //       await googleLogin(credential);
// //     } catch (err: any) {
// //       console.error(err);
// //       alert(err.message || "Google login failed");
// //     }
// //   };

// //   useEffect(() => {
// //     if (isAuthenticated && !isLoading) {
// //       setShowWelcome(true);

// //       const prefetchDashboardData = async () => {
// //         try {
// //           await Promise.allSettled([
// //             queryClient.prefetchQuery({
// //               queryKey: ["userMetrics"],
// //               queryFn: userService.getUserMetrics,
// //             }),
// //             queryClient.prefetchQuery({
// //               queryKey: ["organizationMetrics"],
// //               queryFn: organizationService.getOrganizationMetrics,
// //             }),
// //           ]);
// //         } catch (error) {
// //           console.error("Pre-fetch error:", error);
// //         }
// //       };

// //       prefetchDashboardData();

// //       setTimeout(() => {
// //         navigate("/dashboard", { replace: true });
// //       }, 3000);
// //     }
// //   }, [isAuthenticated, isLoading, navigate, queryClient]);

// //   // Welcome animation after login
// //   if (showWelcome) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// //         <div className="text-center animate-fade-in-slow">
// //           <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-primary">
// //             Welcome to CMP! 🎉
// //           </h1>
// //           <p className="text-lg sm:text-xl text-muted-foreground">
// //             Preparing your dashboard...
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Loading skeleton
// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// //         <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
// //           <div className="text-center">
// //             <Skeleton className="h-12 w-80 mx-auto mb-4" />
// //             <Skeleton className="h-6 w-64 mx-auto mb-8" />
// //             <div id="login-form" className="w-full max-w-md mx-auto space-y-4">
// //               <Skeleton className="h-10 w-full" />
// //               <Skeleton className="h-10 w-full" />
// //               <Skeleton className="h-10 w-full" />
// //             </div>
// //             <div className="button-greeting-div mt-6 flex justify-center gap-4">
// //               <Skeleton className="h-10 w-32" />
// //               <Skeleton className="h-10 w-32" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Direct login screen (no greeting)
// //   if (!showGreeting) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// //         <div className="w-full max-w-md">
// //           <LoginForm />
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Main greeting screen with Google button
// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// //       <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
// //         <div className="text-center">
// //           <h1 className="greeting-text text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
// //             {greeting.title} 👋
// //           </h1>
// //           <p className="greeting-text-p subTitle text-lg sm:text-xl text-muted-foreground mb-8">
// //             {greeting.subTitle}
// //           </p>

// //           <div id="login-form" className="w-full max-w-md mx-auto">
// //             <LoginForm />
// //           </div>

// //           {/* Google Sign-In Button */}
// //           <div className="mt-6 w-full max-w-md mx-auto">
// //             <GoogleLoginButton onSuccess={handleGoogleSuccess} />
// //           </div>

// //           <div className="button-greeting-div mt-6 flex justify-center gap-4">
// //             <Button variant="outline" onClick={() => setShowGreeting(false)}>
// //               Direct Login
// //             </Button>
// //             <Button variant="outline" onClick={() => navigate("/")}>
// //               Learn More
// //             </Button>
// //           </div>

// //           <p className="text-xs text-muted-foreground mt-8">
// //             Any company can create an account instantly with Google
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Skeleton } from "../components/ui/skeleton";
// import { LoginForm } from "../components/LoginForm";
// import { useAuthContext } from "../contexts/AuthContext";
// import { useQueryClient } from "@tanstack/react-query";
// import { userService, organizationService } from "../lib/api";
// import { Button } from "../components/ui/button";
// import { GoogleLoginButton } from "../components/GoogleLoginButton"; // ← Fixed import path

// const greeting = {
//   title: "Welcome to CMP",
//   subTitle: "Your Contract Management Platform",
// };

// const Login = () => {
//   const { isAuthenticated, isLoading, googleLogin } = useAuthContext();
//   const [showGreeting, setShowGreeting] = useState(true);
//   const [showWelcome, setShowWelcome] = useState(false);
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const handleGoogleSuccess = async (credential: string) => {
//     console.log("Google credential received, length:", credential.length);
//     try {
//       await googleLogin(credential);
//       console.log("✅ googleLogin succeeded from frontend");
//     } catch (err: any) {
//       console.error("❌ Google login FAILED:", err.message || err);
//       alert("Google login failed: " + (err.message || "Unknown error"));
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       setShowWelcome(true);

//       const prefetchDashboardData = async () => {
//         try {
//           await Promise.allSettled([
//             queryClient.prefetchQuery({
//               queryKey: ["userMetrics"],
//               queryFn: userService.getUserMetrics,
//             }),
//             queryClient.prefetchQuery({
//               queryKey: ["organizationMetrics"],
//               queryFn: organizationService.getOrganizationMetrics,
//             }),
//           ]);
//         } catch (error) {
//           console.error("Pre-fetch error:", error);
//         }
//       };

//       prefetchDashboardData();

//       setTimeout(() => {
//         navigate("/dashboard", { replace: true });
//       }, 2500); // Slightly shorter delay
//     }
//   }, [isAuthenticated, isLoading, navigate, queryClient]);

//   if (showWelcome) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
//         <div className="text-center animate-fade-in-slow">
//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-primary">
//             Welcome to CMP! 🎉
//           </h1>
//           <p className="text-lg sm:text-xl text-muted-foreground">
//             Preparing your dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
//         <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
//           <div className="text-center">
//             <Skeleton className="h-12 w-80 mx-auto mb-4" />
//             <Skeleton className="h-6 w-64 mx-auto mb-8" />
//             <div className="w-full max-w-md mx-auto space-y-4">
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-10 w-full" />
//             </div>
//             <div className="mt-6 flex justify-center gap-4">
//               <Skeleton className="h-10 w-32" />
//               <Skeleton className="h-10 w-32" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!showGreeting) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
//         <div className="w-full max-w-md">
//           <LoginForm />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
//       <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
//         <div className="text-center">
//           <h1 className="greeting-text text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
//             {greeting.title} 👋
//           </h1>
//           <p className="greeting-text-p subTitle text-lg sm:text-xl text-muted-foreground mb-8">
//             {greeting.subTitle}
//           </p>

//           <div className="w-full max-w-md mx-auto">
//             <LoginForm />
//           </div>

//           {/* Google Sign-In Button */}
//           <div className="mt-6 w-full max-w-md mx-auto">
//             <GoogleLoginButton onSuccess={handleGoogleSuccess} />
//           </div>

//           <div className="mt-6 flex justify-center gap-4">
//             <Button variant="outline" onClick={() => setShowGreeting(false)}>
//               Direct Login
//             </Button>
//             <Button variant="outline" onClick={() => navigate("/")}>
//               Learn More
//             </Button>
//           </div>

//           <p className="text-xs text-muted-foreground mt-8">
//             Any company can create an account instantly with Google
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../components/ui/skeleton";
import { LoginForm } from "../components/LoginForm";
import { useAuthContext } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { userService, organizationService } from "../lib/api";
import { Button } from "../components/ui/button";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import { Shield, ArrowLeft, Loader2, Sparkles } from "lucide-react";

const Login = () => {
  const { isAuthenticated, isLoading, googleLogin } = useAuthContext();
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleGoogleSuccess = async (credential: string) => {
    try {
      await googleLogin(credential);
    } catch (err: any) {
      console.error("❌ Google login FAILED:", err.message || err);
      alert("Google login failed: " + (err.message || "Unknown error"));
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setShowWelcome(true);

      const prefetchDashboardData = async () => {
        try {
          await Promise.allSettled([
            queryClient.prefetchQuery({
              queryKey: ["userMetrics"],
              queryFn: userService.getUserMetrics,
            }),
            queryClient.prefetchQuery({
              queryKey: ["organizationMetrics"],
              queryFn: organizationService.getOrganizationMetrics,
            }),
          ]);
        } catch (error) {
          console.error("Pre-fetch error:", error);
        }
      };

      prefetchDashboardData();

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2500);
    }
  }, [isAuthenticated, isLoading, navigate, queryClient]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="w-12 h-12 rounded-xl bg-white/5" />
            <Skeleton className="h-8 w-48 bg-white/5" />
            <Skeleton className="h-4 w-64 bg-white/5" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 bg-white/5" />
              <Skeleton className="h-4 w-24 bg-white/5" />
            </div>
            <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Success Redirect State
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter">
            Welcome back.
          </h1>
          <div className="flex items-center justify-center gap-3 text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Initializing Workspace
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-white/20">
      {/* Left Side: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between border-r border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] aspect-square rounded-full bg-blue-600/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-purple-600/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <span className="font-bold tracking-[0.2em] uppercase text-sm">
            ContractHub
          </span>
        </motion.div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-6xl font-bold tracking-tighter leading-none mb-6">
              The standard for <br />
              <span className="text-zinc-500">modern legal teams.</span>
            </h2>
            <p className="text-zinc-500 text-lg font-light max-w-md leading-relaxed">
              Experience a workspace designed for precision, security, and
              seamless collaboration.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5">
            <div>
              <p className="text-2xl font-bold tracking-tighter mb-1">99.9%</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                Uptime SLA
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tighter mb-1">
                AES-256
              </p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                Encryption
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[10px] uppercase tracking-widest text-zinc-600">
          © 2026 CMP. Crafted for Excellence.
        </p>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col p-6 lg:p-16 justify-center items-center relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
            <span className="text-black font-bold text-xs">C</span>
          </div>
          <span className="font-bold tracking-[0.2em] uppercase text-[10px]">
            ContractHub
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-tight">Sign in</h3>
            <p className="text-zinc-500 text-sm font-light">
              Welcome back. Enter your credentials to access your workspace.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
              <LoginForm />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-[#050505] px-4 text-zinc-600 font-mono">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="group">
              <GoogleLoginButton onSuccess={handleGoogleSuccess} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Home
            </button>
            <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
              Need an account?{" "}
              <span className="text-white cursor-pointer hover:underline">
                Contact Sales
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
