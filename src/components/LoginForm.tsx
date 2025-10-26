

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
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { toast } from "sonner";
// import { useAuthContext } from "../contexts/AuthContext";
// import { handleApiError } from "../utils/error-handler";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(1, "Password is required"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export const LoginForm = () => {
//   const { login } = useAuthContext();
//   const form = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       await login(data.email, data.password);
//       toast.success("Logged in successfully");
//     } catch (error) {
//       handleApiError(error, "Login failed");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader>
//         <CardTitle>Login</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Enter your password"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };


// src/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { useAuthContext } from "../contexts/AuthContext";
import { handleApiError } from "../utils/error-handler";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login } = useAuthContext();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Logged in successfully");
    } catch (error) {
      handleApiError(error, "Login failed");
    }
  };

  return (
    <Card className="w-full shadow-soft border-0">
      <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-10 sm:h-12 text-sm sm:text-base">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};