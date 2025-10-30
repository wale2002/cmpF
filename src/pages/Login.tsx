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
