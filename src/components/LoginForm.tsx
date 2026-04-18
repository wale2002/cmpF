// // // // src/components/LoginForm.tsx
// // // import { useForm } from "react-hook-form";
// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import * as z from "zod";
// // // import { Button } from "./ui/button";
// // // import { Input } from "./ui/input";
// // // import {
// // //   Form,
// // //   FormControl,
// // //   FormField,
// // //   FormItem,
// // //   FormLabel,
// // //   FormMessage,
// // // } from "./ui/form";
// // // import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// // // import { toast } from "sonner";
// // // import { useAuthContext } from "../contexts/AuthContext";
// // // import { handleApiError } from "../utils/error-handler";

// // // const loginSchema = z.object({
// // //   email: z.string().email("Invalid email format"),
// // //   password: z.string().min(1, "Password is required"),
// // // });

// // // type LoginFormData = z.infer<typeof loginSchema>;

// // // export const LoginForm = () => {
// // //   const { login } = useAuthContext();
// // //   const form = useForm<LoginFormData>({
// // //     resolver: zodResolver(loginSchema),
// // //     defaultValues: {
// // //       email: "",
// // //       password: "",
// // //     },
// // //   });

// // //   const onSubmit = async (data: LoginFormData) => {
// // //     try {
// // //       await login(data.email, data.password);
// // //       toast.success("Logged in successfully");
// // //     } catch (error) {
// // //       handleApiError(error, "Login failed");
// // //     }
// // //   };

// // //   return (
// // //     <Card className="w-full max-w-md">
// // //       <CardHeader>
// // //         <CardTitle>Login</CardTitle>
// // //       </CardHeader>
// // //       <CardContent>
// // //         <Form {...form}>
// // //           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
// // //             <FormField
// // //               control={form.control}
// // //               name="email"
// // //               render={({ field }) => (
// // //                 <FormItem>
// // //                   <FormLabel>Email</FormLabel>
// // //                   <FormControl>
// // //                     <Input
// // //                       type="email"
// // //                       placeholder="Enter your email"
// // //                       {...field}
// // //                     />
// // //                   </FormControl>
// // //                   <FormMessage />
// // //                 </FormItem>
// // //               )}
// // //             />
// // //             <FormField
// // //               control={form.control}
// // //               name="password"
// // //               render={({ field }) => (
// // //                 <FormItem>
// // //                   <FormLabel>Password</FormLabel>
// // //                   <FormControl>
// // //                     <Input
// // //                       type="password"
// // //                       placeholder="Enter your password"
// // //                       {...field}
// // //                     />
// // //                   </FormControl>
// // //                   <FormMessage />
// // //                 </FormItem>
// // //               )}
// // //             />
// // //             <Button type="submit" className="w-full">
// // //               Login
// // //             </Button>
// // //           </form>
// // //         </Form>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // src/components/LoginForm.tsx
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import * as z from "zod";
// // import { Button } from "./ui/button";
// // import { Input } from "./ui/input";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "./ui/form";
// // import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// // import { toast } from "sonner";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import { handleApiError } from "../utils/error-handler";

// // const loginSchema = z.object({
// //   email: z.string().email("Invalid email format"),
// //   password: z.string().min(1, "Password is required"),
// // });

// // type LoginFormData = z.infer<typeof loginSchema>;

// // export const LoginForm = () => {
// //   const { login } = useAuthContext();
// //   const form = useForm<LoginFormData>({
// //     resolver: zodResolver(loginSchema),
// //     defaultValues: {
// //       email: "",
// //       password: "",
// //     },
// //   });

// //   const onSubmit = async (data: LoginFormData) => {
// //     try {
// //       await login(data.email, data.password);
// //       toast.success("Logged in successfully");
// //     } catch (error) {
// //       handleApiError(error, "Login failed");
// //     }
// //   };

// //   return (
// //     <Card className="w-full shadow-soft border-0">
// //       <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
// //         <CardTitle className="text-xl sm:text-2xl text-center">Login</CardTitle>
// //       </CardHeader>
// //       <CardContent className="px-4 sm:px-6 pt-0">
// //         <Form {...form}>
// //           <form
// //             onSubmit={form.handleSubmit(onSubmit)}
// //             className="space-y-4 sm:space-y-6"
// //           >
// //             <FormField
// //               control={form.control}
// //               name="email"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel className="text-sm sm:text-base"></FormLabel>
// //                   <FormControl>
// //                     <Input
// //                       type="email"
// //                       placeholder="Enter your email"
// //                       className="h-10 sm:h-12 text-sm sm:text-base"
// //                       {...field}
// //                     />
// //                   </FormControl>
// //                   <FormMessage className="text-xs" />
// //                 </FormItem>
// //               )}
// //             />
// //             <FormField
// //               control={form.control}
// //               name="password"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel className="text-sm sm:text-base"></FormLabel>
// //                   <FormControl>
// //                     <Input
// //                       type="password"
// //                       placeholder="Enter your password"
// //                       className="h-10 sm:h-12 text-sm sm:text-base"
// //                       {...field}
// //                     />
// //                   </FormControl>
// //                   <FormMessage className="text-xs" />
// //                 </FormItem>
// //               )}
// //             />
// //             <Button
// //               type="submit"
// //               className="w-full h-10 sm:h-12 text-sm sm:text-base"
// //             >
// //               Login
// //             </Button>
// //           </form>
// //         </Form>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // src/components/LoginForm.tsx
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   // FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Loader2 } from "lucide-react"; // <-- Add this import
// import { toast } from "sonner";
// import { useAuthContext } from "../contexts/AuthContext";
// import { handleApiError } from "../utils/error-handler";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(1, "Password is required"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// // Accept optional isLoading from parent (for full control)
// // But also manage internal loading state for standalone use
// interface LoginFormProps {
//   isLoading?: boolean;
//   onLoginStart?: () => void;
//   onLoginEnd?: () => void;
// }

// export const LoginForm = ({
//   isLoading: externalLoading = false,
//   onLoginStart,
//   onLoginEnd,
// }: LoginFormProps = {}) => {
//   const { login } = useAuthContext();

//   const form = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const isSubmitting = form.formState.isSubmitting || externalLoading;

//   const onSubmit = async (data: LoginFormData) => {
//     onLoginStart?.();

//     try {
//       await login(data.email, data.password);
//       toast.success("Logged in successfully");
//       // No need to reset form — user will be redirected
//     } catch (error) {
//       handleApiError(error, "Login failed");
//       form.setFocus("email"); // Optional: refocus email on error
//     } finally {
//       onLoginEnd?.();
//     }
//   };

//   return (
//     <Card className="w-full shadow-soft border-0">
//       <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
//         <CardTitle className="text-xl sm:text-2xl text-center">Login</CardTitle>
//       </CardHeader>
//       <CardContent className="px-4 sm:px-6 pt-0">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-4 sm:space-y-6"
//           >
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   {/* <FormLabel className="text-sm sm:text-base">Email</FormLabel> */}
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       className="h-10 sm:h-12 text-sm sm:text-base"
//                       disabled={isSubmitting}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   {/* <FormLabel className="text-sm sm:text-base">
//                     Password
//                   </FormLabel> */}
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Enter your password"
//                       className="h-10 sm:h-12 text-sm sm:text-base"
//                       disabled={isSubmitting}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full h-10 sm:h-12 text-sm sm:text-base"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../contexts/AuthContext";
import { handleApiError } from "../utils/error-handler";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid business email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  isLoading?: boolean;
  onLoginStart?: () => void;
  onLoginEnd?: () => void;
}

export const LoginForm = ({
  isLoading: externalLoading = false,
  onLoginStart,
  onLoginEnd,
}: LoginFormProps = {}) => {
  const { login } = useAuthContext();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting || externalLoading;

  const onSubmit = async (data: LoginFormData) => {
    onLoginStart?.();
    try {
      await login(data.email, data.password);
      toast.success("Welcome back to ContractHub");
    } catch (error) {
      handleApiError(error, "Authentication failed");
      form.setFocus("email");
    } finally {
      onLoginEnd?.();
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Business Email"
                      className="h-14 pl-12 bg-white/5 border-white/5 focus:border-white/20 focus:bg-white/10 rounded-2xl text-white placeholder:text-zinc-600 transition-all duration-300"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-[10px] uppercase tracking-widest font-mono text-rose-500 pl-4" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors duration-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="h-14 pl-12 bg-white/5 border-white/5 focus:border-white/20 focus:bg-white/10 rounded-2xl text-white placeholder:text-zinc-600 transition-all duration-300"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-[10px] uppercase tracking-widest font-mono text-rose-500 pl-4" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end px-2">
            <button
              type="button"
              className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 group relative overflow-hidden"
              disabled={isSubmitting}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Sign In{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};
