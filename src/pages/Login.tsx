
// // src/pages/Login.tsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../contexts/AuthContext";
// import { LoginForm } from "../components/LoginForm";
// import { Card } from "../components/ui/card";

// const Login = () => {
//   const { isAuthenticated, isLoading } = useAuthContext();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       navigate("/dashboard", { replace: true });
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   if (isLoading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
//       <Card className="w-full max-w-md">
//         <LoginForm />
//       </Card>
//     </div>
//   );
// };

// export default Login;


// src/pages/Login.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { LoginForm } from "../components/LoginForm";
import { Card } from "../components/ui/card";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center py-12 px-4">
          <div className="text-lg sm:text-xl text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4 sm:px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;