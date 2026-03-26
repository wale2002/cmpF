// // // src/App.tsx
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import { TooltipProvider } from "./components/ui/tooltip";
// // import { Toaster } from "./components/ui/toaster";
// // import { Toaster as Sonner } from "./components/ui/sonner";
// // import { AuthProvider } from "./contexts/AuthContext";
// // import Index from "./pages/Index";
// // import Login from "./pages/Login";
// // import Dashboard from "./pages/Dashboard";
// // import NotFound from "./pages/NotFound";
// // import Documents from "./pages/Documents";
// // import Analytics from "./pages/Analytics";
// // import Organizations from "./pages/Organizations";
// // import Users from "./pages/Users";
// // import RolesPage from "./pages/RolesPage"; // NEW: Import the new Roles page
// // import OrganizationDocumentsPage from "./pages/OrganizationDocumentsPage";
// // import ErrorBoundary from "./components/ErrorBoundary";

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <AuthProvider>
// //       <TooltipProvider>
// //         <Toaster />
// //         <Sonner />
// //         <BrowserRouter>
// //           <ErrorBoundary>
// //             <Routes>
// //               <Route path="/" element={<Index />} />
// //               <Route path="/login" element={<Login />} />
// //               <Route path="/dashboard" element={<Dashboard />} />

// //               <Route path="/documents" element={<Documents />} />
// //               <Route path="/documents/:orgId" element={<OrganizationDocumentsPage />} />
// //               <Route path="/analytics" element={<Analytics />} />
// //               <Route path="/organizations" element={<Organizations />} />
// //               <Route path="/users" element={<Users />} />
// //               <Route path="/roles" element={<RolesPage />} /> {/* NEW: Dedicated route for Role Management */}
// //               <Route path="*" element={<NotFound />} />
// //             </Routes>
// //           </ErrorBoundary>
// //         </BrowserRouter>
// //       </TooltipProvider>
// //     </AuthProvider>
// //   </QueryClientProvider>
// // );

// // export default App;

// // src/App.tsx
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { TooltipProvider } from "./components/ui/tooltip";
// import { Toaster } from "./components/ui/toaster";
// import { Toaster as Sonner } from "./components/ui/sonner";
// import { AuthProvider } from "./contexts/AuthContext";
// import Index from "./pages/Index";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";
// import Documents from "./pages/Documents";
// import Analytics from "./pages/Analytics";
// import Organizations from "./pages/Organizations";
// import Users from "./pages/Users";
// import RolesPage from "./pages/RolesPage";
// import OrganizationDocumentsPage from "./pages/OrganizationDocumentsPage";
// import ErrorBoundary from "./components/ErrorBoundary";

// // NEW: Import the public form page
// import PublicEnumeratorForm from "./pages/PublicEnumeratorForm";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <ErrorBoundary>
//             <Routes>
//               <Route path="/" element={<Index />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/dashboard" element={<Dashboard />} />

//               <Route path="/documents" element={<Documents />} />
//               <Route
//                 path="/documents/:orgId"
//                 element={<OrganizationDocumentsPage />}
//               />
//               <Route path="/analytics" element={<Analytics />} />
//               <Route path="/organizations" element={<Organizations />} />
//               <Route path="/users" element={<Users />} />
//               <Route path="/roles" element={<RolesPage />} />

//               {/* ✅ NEW PUBLIC ROUTE - No authentication required */}
//               <Route
//                 path="/public/enumerator-form"
//                 element={<PublicEnumeratorForm />}
//               />

//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </ErrorBoundary>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;

// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import Organizations from "./pages/Organizations";
import Users from "./pages/Users";
import RolesPage from "./pages/RolesPage";
import OrganizationDocumentsPage from "./pages/OrganizationDocumentsPage";
import ErrorBoundary from "./components/ErrorBoundary";

// NEW: Public Enumerator Form (already added)
import PublicEnumeratorForm from "./pages/PublicEnumeratorForm";

// ✅ NEW: School Visit Reports Browser (Folder Explorer)
import SchoolVisitReportsBrowser from "./pages/SchoolVisitReportsBrowser";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/documents" element={<Documents />} />
              <Route
                path="/documents/:orgId"
                element={<OrganizationDocumentsPage />}
              />

              {/* ✅ NEW: Dedicated Field Reports Explorer */}
              <Route
                path="/school-visit-reports"
                element={<SchoolVisitReportsBrowser />}
              />

              <Route path="/analytics" element={<Analytics />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<RolesPage />} />

              {/* Public unauthenticated route */}
              <Route
                path="/public/enumerator-form"
                element={<PublicEnumeratorForm />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
