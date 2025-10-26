// import { useNavigate } from "react-router-dom";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   Shield,
//   FileText,
//   Users,
//   BarChart3,
//   ArrowRight,
//   Lock,
//   Cloud,
// } from "lucide-react";

// const Index = () => {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: FileText,
//       title: "Document Management",
//       description:
//         "Securely store and organize all your contracts, NDAs, SLAs and legal documents",
//     },
//     {
//       icon: Users,
//       title: "Team Collaboration",
//       description:
//         "Share documents with team members and manage access permissions",
//     },
//     {
//       icon: BarChart3,
//       title: "Analytics & Insights",
//       description:
//         "Track document usage, access patterns and get valuable insights",
//     },
//     {
//       icon: Lock,
//       title: "Enterprise Security",
//       description:
//         "Bank-level encryption and security features to protect sensitive data",
//     },
//     {
//       icon: Cloud,
//       title: "Cloud Storage",
//       description:
//         "Reliable cloud storage with automatic backups and version control",
//     },
//     {
//       icon: Shield,
//       title: "Compliance Ready",
//       description:
//         "Built-in compliance features for legal and regulatory requirements",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background">
//       {/* Hero Section */}
//       <div className="container mx-auto px-6 py-16">
//         <div className="text-center space-y-8 max-w-4xl mx-auto">
//           <div className="flex justify-center mb-8">
//             <div className="p-4 bg-primary rounded-full shadow-strong">
//               <Shield className="h-12 w-12 text-primary-foreground" />
//             </div>
//           </div>

//           <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
//             ContractHub
//           </h1>

//           <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Professional contract management system for modern businesses.
//             Secure, efficient, and compliant document management.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
//             <Button
//               size="lg"
//               variant="professional"
//               onClick={() => navigate("/login")}
//               className="w-full sm:w-auto"
//             >
//               Access Dashboard
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>

//             <Button
//               size="lg"
//               variant="outline"
//               onClick={() => navigate("/login")}
//               className="w-full sm:w-auto"
//             >
//               Learn More
//             </Button>
//           </div>

         
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="container mx-auto px-6 py-16">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//             Powerful Features for Contract Management
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Everything you need to manage contracts and legal documents
//             efficiently and securely.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <Card
//               key={index}
//               className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
//             >
//               <CardHeader className="text-center">
//                 <div className="mx-auto mb-4 p-3 bg-primary-light rounded-full w-fit">
//                   <feature.icon className="h-6 w-6 text-primary" />
//                 </div>
//                 <CardTitle className="text-xl">{feature.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-center text-base leading-relaxed">
//                   {feature.description}
//                 </CardDescription>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="container mx-auto px-6 py-16">
//         <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-strong">
//           <CardContent className="text-center py-16">
//             <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
//             <p className="text-lg mb-8 opacity-90">
//               Join hundreds of companies already using ContractHub for their
//               document management needs.
//             </p>
//             <Button
//               size="lg"
//               variant="secondary"
//               onClick={() => navigate("/login")}
//             >
//               Start Managing Contracts
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Index;


import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Shield,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
  Lock,
  Cloud,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Document Management",
      description:
        "Securely store and organize all your contracts, NDAs, SLAs and legal documents",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share documents with team members and manage access permissions",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track document usage, access patterns and get valuable insights",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security features to protect sensitive data",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description:
        "Reliable cloud storage with automatic backups and version control",
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description:
        "Built-in compliance features for legal and regulatory requirements",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-4 sm:mb-8">
            <div className="p-3 sm:p-4 bg-primary rounded-full shadow-strong">
              <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent leading-tight">
            ContractHub
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Professional contract management system for modern businesses.
            Secure, efficient, and compliant document management.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8">
            <Button
              size="lg"
              variant="professional"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-6 sm:px-8"
            >
              Access Dashboard
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-6 sm:px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Powerful Features for Contract Management
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Everything you need to manage contracts and legal documents
            efficiently and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-primary-light rounded-full w-fit">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-strong">
          <CardContent className="text-center py-12 sm:py-16">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h3>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 px-4 sm:px-0">
              Join hundreds of companies already using ContractHub for their
              document management needs.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
              className="px-8"
            >
              Start Managing Contracts
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;