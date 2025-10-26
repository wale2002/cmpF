// // import * as React from "react";

// // import { cn } from "../..utils/lib/utils";

// // export interface TextareaProps
// //   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// // const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
// //   ({ className, ...props }, ref) => {
// //     return (
// //       <textarea
// //         className={cn(
// //           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
// //           className
// //         )}
// //         ref={ref}
// //         {...props}
// //       />
// //     );
// //   }
// // );
// // Textarea.displayName = "Textarea";

// // export { Textarea };

// /* eslint-disable @typescript-eslint/no-empty-interface */
// import * as React from "react";
// import { cn } from "@/lib/utils"; // FIXED: Corrected import path (assuming shadcn/ui alias setup; adjust relative if no alias)

// export interface TextareaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         className={cn(
//           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Textarea.displayName = "Textarea";

// export { Textarea };

/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from "react";
import { cn } from "../../lib/utils"; // FIXED: Use relative path (../../lib/utils.ts) if no alias; adjust to "@/lib/utils" after alias setup

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
