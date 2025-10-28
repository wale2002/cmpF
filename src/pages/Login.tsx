// // // import { useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { useAuthContext } from "../contexts/AuthContext";
// // // import { LoginForm } from "../components/LoginForm";
// // // // Fixed: Removed unused Card import

// // // const Login = () => {
// // //   const { isAuthenticated, isLoading } = useAuthContext();
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     if (isAuthenticated && !isLoading) {
// // //       navigate("/dashboard", { replace: true });
// // //     }
// // //   }, [isAuthenticated, isLoading, navigate]);

// // //   if (isLoading) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
// // //         <div className="text-center py-12 px-4">
// // //           <div className="text-lg sm:text-xl text-muted-foreground">
// // //             Loading...
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// // //       <div className="w-full max-w-md">
// // //         <LoginForm />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;

// // import { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Fade } from "react-reveal";
// // import emoji from "react-easy-emoji";
// // import { LoginForm } from "../components/LoginForm";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import { useQueryClient } from "@tanstack/react-query";
// // import { userService, organizationService, documentService } from "../lib/api";
// // import StyleContext from "../contexts/StyleContext"; // Assuming similar context for theme
// // import { Button } from "../components/ui/button"; // Reuse existing Button if possible, or adapt

// // // Mock or hardcoded greeting config for CMP
// // const greeting = {
// //   displayGreeting: true,
// //   title: "Welcome to CMP",
// //   subTitle: "Your Contract Management Platform",
// //   // No resume for login, but can add demo or contact
// // };

// // const Login = () => {
// //   const { isAuthenticated, isLoading } = useAuthContext();
// //   const navigate = useNavigate();
// //   const queryClient = useQueryClient();
// //   const { isDark } = useContext(StyleContext); // Assuming StyleContext exists or adapt

// //   useEffect(() => {
// //     if (isAuthenticated && !isLoading) {
// //       // Pre-fetch dashboard data to ensure smooth transition
// //       const prefetchDashboardData = async () => {
// //         try {
// //           // Pre-fetch metrics and other key data
// //           if (isAuthenticated) {
// //             await Promise.allSettled([
// //               queryClient.prefetchQuery({
// //                 queryKey: ["userMetrics"],
// //                 queryFn: () => userService.getUserMetrics(),
// //               }),
// //               queryClient.prefetchQuery({
// //                 queryKey: ["organizationMetrics"],
// //                 queryFn: () => organizationService.getOrganizationMetrics(),
// //               }),
// //               // Add more pre-fetches as needed, e.g., notifications, documents if applicable
// //             ]);
// //           }
// //         } catch (error) {
// //           console.error("Pre-fetch error:", error);
// //         }
// //       };
// //       prefetchDashboardData();
// //       navigate("/dashboard", { replace: true });
// //     }
// //   }, [isAuthenticated, isLoading, navigate, queryClient]);

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
// //         <div className="text-center py-12 px-4">
// //           <div className="text-lg sm:text-xl text-muted-foreground">
// //             Loading...
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!greeting.displayGreeting) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// //         <div className="w-full max-w-md">
// //           <LoginForm />
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
// //       <Fade bottom duration={1000} distance="40px">
// //         <div className="greet-main" id="greeting">
// //           <div className="greeting-main w-full max-w-4xl mx-auto">
// //             <div className="greeting-text-div flex-1">
// //               <div>
// //                 <h1
// //                   className={isDark ? "dark-mode greeting-text" : "greeting-text"}
// //                 >
// //                   {greeting.title}{" "}
// //                   <span className="wave-emoji">{emoji("👋")}</span>
// //                 </h1>
// //                 <p
// //                   className={
// //                     isDark
// //                       ? "dark-mode greeting-text-p"
// //                       : "greeting-text-p subTitle"
// //                   }
// //                 >
// //                   {greeting.subTitle}
// //                 </p>
// //                 <div id="login-form" className="mt-8">
// //                   <LoginForm />
// //                 </div>
// //                 <div className="button-greeting-div mt-6">
// //                   {/* Optional buttons, e.g., demo or learn more */}
// //                   <Button
// //                     text="Learn More"
// //                     onClick={() => window.open("https://cmp-docs.example.com", "_blank")}
// //                     variant="outline"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="greeting-image-div flex-shrink-0 hidden md:block">
// //               {/* Adapt illustration for CMP, e.g., use a logo or relevant image */}
// //               <img
// //                 alt="CMP illustration"
// //                 src={require("../../assets/images/cmp-landing.svg")} // Assume asset exists
// //                 className="w-64 h-64 object-contain"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </Fade>
// //     </div>
// //   );
// // };

// // export default Login;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LoginForm } from "../components/LoginForm";
// import { useAuthContext } from "../contexts/AuthContext";
// import { useQueryClient } from "@tanstack/react-query";
// import { userService, organizationService } from "../lib/api";
// import { Button } from "../components/ui/button";

// const greeting = {
//   title: "Welcome to CMP",
//   subTitle: "Your Contract Management Platform",
// };

// const Login = () => {
//   const { isAuthenticated, isLoading, isLoggingIn } = useAuthContext();
//   const [showGreeting, setShowGreeting] = useState(true);
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       // Pre-fetch dashboard data to ensure smooth transition
//       const prefetchDashboardData = async () => {
//         try {
//           // Pre-fetch metrics and other key data
//           if (isAuthenticated) {
//             await Promise.allSettled([
//               queryClient.prefetchQuery({
//                 queryKey: ["userMetrics"],
//                 queryFn: () => userService.getUserMetrics(),
//               }),
//               queryClient.prefetchQuery({
//                 queryKey: ["organizationMetrics"],
//                 queryFn: () => organizationService.getOrganizationMetrics(),
//               }),
//               // Add more pre-fetches as needed, e.g., notifications, documents if applicable
//             ]);
//           }
//         } catch (error) {
//           console.error("Pre-fetch error:", error);
//         }
//       };
//       prefetchDashboardData();
//       navigate("/dashboard", { replace: true });
//     }
//   }, [isAuthenticated, isLoading, navigate, queryClient]);

//   if (isLoading || isLoggingIn) {
//     const message = isLoggingIn ? "Signing you in..." : "Initializing CMP...";
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
//         <div className="text-center py-12 px-4">
//           <div
//             className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-middle"
//             role="status"
//             aria-label="Loading..."
//           ></div>
//           <div className="mt-4 text-lg sm:text-xl text-muted-foreground">
//             {message}
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
//           <div id="login-form" className="w-full max-w-md mx-auto">
//             <LoginForm />
//           </div>
//           <div className="button-greeting-div mt-6 flex justify-center gap-4">
//             <Button variant="outline" onClick={() => setShowGreeting(false)}>
//               Direct Login
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() =>
//                 window.open("https://cmp-docs.example.com", "_blank")
//               }
//             >
//               Learn More
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton"; // Import Skeleton for loading placeholders
import { LoginForm } from "../components/LoginForm";
import { useAuthContext } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { userService, organizationService } from "../lib/api";
import { Button } from "../components/ui/button";

const greeting = {
  title: "Welcome to CMP",
  subTitle: "Your Contract Management Platform",
};

const Login = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [showGreeting, setShowGreeting] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Show welcome animation briefly before navigating
      setShowWelcome(true);
      // Pre-fetch dashboard data to ensure smooth transition
      const prefetchDashboardData = async () => {
        try {
          // Pre-fetch metrics and other key data
          if (isAuthenticated) {
            await Promise.allSettled([
              queryClient.prefetchQuery({
                queryKey: ["userMetrics"],
                queryFn: () => userService.getUserMetrics(),
              }),
              queryClient.prefetchQuery({
                queryKey: ["organizationMetrics"],
                queryFn: () => organizationService.getOrganizationMetrics(),
              }),
              // Add more pre-fetches as needed, e.g., notifications, documents if applicable
            ]);
          }
        } catch (error) {
          console.error("Pre-fetch error:", error);
        }
      };
      prefetchDashboardData();
      // Delay navigation to allow slow motion animation (3 seconds)
      setTimeout(() => {
        // Directly navigate without resetting showWelcome to avoid flash
        navigate("/dashboard", { replace: true });
      }, 3000);
    }
  }, [isAuthenticated, isLoading, navigate, queryClient]);

  // Show welcome animation after successful login, before dashboard redirect
  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
        <div className="text-center animate-fade-in-slow">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-primary">
            Welcome to CMP! 🎉
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    // Use Skeleton to mimic the greeting layout during loading for a more polished UX
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />{" "}
            {/* Skeleton for title */}
            <Skeleton className="h-6 w-64 mx-auto mb-8" />{" "}
            {/* Skeleton for subtitle */}
            <div id="login-form" className="w-full max-w-md mx-auto space-y-4">
              {/* Skeleton for form fields and button */}
              <Skeleton className="h-10 w-full" /> {/* Email input */}
              <Skeleton className="h-10 w-full" /> {/* Password input */}
              <Skeleton className="h-10 w-full" /> {/* Login button */}
            </div>
            {/* Skeleton for action buttons if greeting is shown */}
            <div className="button-greeting-div mt-6 flex justify-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showGreeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="greeting-text text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {greeting.title} 👋
          </h1>
          <p className="greeting-text-p subTitle text-lg sm:text-xl text-muted-foreground mb-8">
            {greeting.subTitle}
          </p>
          <div id="login-form" className="w-full max-w-md mx-auto">
            <LoginForm />
          </div>
          <div className="button-greeting-div mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={() => setShowGreeting(false)}>
              Direct Login
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
