/* eslint-disable @typescript-eslint/no-explicit-any */
// // // // import * as React from "react";
// // // // import { ChevronLeft, ChevronRight } from "lucide-react";
// // // // import { DayPicker } from "react-day-picker";

// // // // import { cn } from "../../lib/utils";
// // // // import { buttonVariants } from "../../components/ui/button";

// // // // export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// // // // function Calendar({
// // // //   className,
// // // //   classNames,
// // // //   showOutsideDays = true,
// // // //   ...props
// // // // }: CalendarProps) {
// // // //   return (
// // // //     <DayPicker
// // // //       showOutsideDays={showOutsideDays}
// // // //       className={cn("p-3", className)}
// // // //       classNames={{
// // // //         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
// // // //         month: "space-y-4",
// // // //         caption: "flex justify-center pt-1 relative items-center",
// // // //         caption_label: "text-sm font-medium",
// // // //         nav: "space-x-1 flex items-center",
// // // //         nav_button: cn(
// // // //           buttonVariants({ variant: "outline" }),
// // // //           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
// // // //         ),
// // // //         nav_button_previous: "absolute left-1",
// // // //         nav_button_next: "absolute right-1",
// // // //         table: "w-full border-collapse space-y-1",
// // // //         head_row: "flex",
// // // //         head_cell:
// // // //           "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
// // // //         row: "flex w-full mt-2",
// // // //         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
// // // //         day: cn(
// // // //           buttonVariants({ variant: "ghost" }),
// // // //           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
// // // //         ),
// // // //         day_range_end: "day-range-end",
// // // //         day_selected:
// // // //           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
// // // //         day_today: "bg-accent text-accent-foreground",
// // // //         day_outside:
// // // //           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
// // // //         day_disabled: "text-muted-foreground opacity-50",
// // // //         day_range_middle:
// // // //           "aria-selected:bg-accent aria-selected:text-accent-foreground",
// // // //         day_hidden: "invisible",
// // // //         ...classNames,
// // // //       }}
// // // //       components={{
// // // //         IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
// // // //       }}
// // // //       {...props}
// // // //     />
// // // //   );
// // // // }
// // // // Calendar.displayName = "Calendar";

// // // // export { Calendar };

// // // import * as React from "react";
// // // import { DayPicker } from "react-day-picker";
// // // // FIXED: Remove unused ChevronLeft; import only if used
// // // // import { ChevronLeft, ChevronRight } from "lucide-react";

// // // import { cn } from "@/lib/utils";
// // // import { buttonVariants } from "@/components/ui/button";

// // // export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// // // function Calendar({
// // //   className,
// // //   classNames,
// // //   showOutsideDays = true,
// // //   ...props
// // // }: CalendarProps) {
// // //   return (
// // //     <DayPicker
// // //       showOutsideDays={showOutsideDays}
// // //       className={cn("p-3", className)}
// // //       classNames={{
// // //         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
// // //         month: "space-y-4",
// // //         caption: "flex justify-center pt-1 relative items-center",
// // //         caption_label: "text-sm font-medium",
// // //         nav: "space-x-1 flex items-center",
// // //         nav_button: cn(
// // //           buttonVariants({ variant: "outline" }),
// // //           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
// // //         ),
// // //         nav_button_previous: "absolute left-1",
// // //         nav_button_next: "absolute right-1",
// // //         table: "w-full border-collapse space-y-1",
// // //         head_row: "flex",
// // //         head_cell:
// // //           "text-muted-foreground rounded-md w-9 font-normal text-[0.8em]",
// // //         row: "flex w-full mt-2",
// // //         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
// // //         day: cn(
// // //           buttonVariants({ variant: "ghost" }),
// // //           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
// // //         ),
// // //         day_range_end: "day-range-end",
// // //         day_selected:
// // //           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
// // //         day_today: "bg-accent text-accent-foreground",
// // //         day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
// // //         day_disabled: "text-muted-foreground opacity-50",
// // //         day_range_middle:
// // //           "aria-selected:bg-accent aria-selected:text-accent-foreground",
// // //         day_hidden: "invisible",
// // //         ...classNames,
// // //       }}
// // //       components={{
// // //         // FIXED: Correct structure for custom icons; use IconLeft/IconRight under Month or Caption
// // //         IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />, // Assume imported now
// // //         IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />, // FIXED: Valid under components
// // //         // FIXED: Remove unused _props
// // //       }}
// // //       {...props}
// // //     />
// // //   );
// // // }
// // // Calendar.displayName = "Calendar";

// // import * as React from "react";
// // import { ChevronRight } from "lucide-react"; // FIXED: Only import used icons; add ChevronLeft if needed for IconLeft
// // import { DayPicker } from "react-day-picker";

// // import { cn } from "../../lib/utils";
// // import { buttonVariants } from "../../components/ui/button";

// // export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// // function Calendar({
// //   className,
// //   classNames,
// //   showOutsideDays = true,
// //   ...props
// // }: CalendarProps) {
// //   return (
// //     <DayPicker
// //       showOutsideDays={showOutsideDays}
// //       className={cn("p-3", className)}
// //       classNames={{
// //         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
// //         month: "space-y-4",
// //         caption: "flex justify-center pt-1 relative items-center",
// //         caption_label: "text-sm font-medium",
// //         nav: "space-x-1 flex items-center",
// //         nav_button: cn(
// //           buttonVariants({ variant: "outline" }),
// //           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
// //         ),
// //         nav_button_previous: "absolute left-1",
// //         nav_button_next: "absolute right-1",
// //         table: "w-full border-collapse space-y-1",
// //         head_row: "flex",
// //         head_cell:
// //           "text-muted-foreground rounded-md w-9 font-normal text-[0.8em]",
// //         row: "flex w-full mt-2",
// //         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
// //         day: cn(
// //           buttonVariants({ variant: "ghost" }),
// //           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
// //         ),
// //         day_range_end: "day-range-end",
// //         day_selected:
// //           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
// //         day_today: "bg-accent text-accent-foreground",
// //         day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
// //         day_disabled: "text-muted-foreground opacity-50",
// //         day_range_middle:
// //           "aria-selected:bg-accent aria-selected:text-accent-foreground",
// //         day_hidden: "invisible",
// //         ...classNames,
// //       }}
// //       components={{
// //         // FIXED: Valid structure; IconRight is supported; add IconLeft if needed
// //         IconRight: (props) => <ChevronRight className="h-4 w-4" {...props} />, // FIXED: Remove unused _props
// //         // IconLeft: (props) => <ChevronLeft className="h-4 w-4" {...props} />, // Uncomment if needed
// //       }}
// //       {...props}
// //     />
// //   );
// // }
// // Calendar.displayName = "Calendar";

// // export { Calendar };

// import { DayPicker } from "react-day-picker";
// import { ChevronRight } from "lucide-react";
// import { cn } from "../../lib/utils";
// import { buttonVariants } from "../../components/ui/button";

// // Extend DayPicker types if needed
// declare module "react-day-picker" {
//   interface DayPickerProps {
//     components?: {
//       IconLeft?: React.ComponentType<any>;
//       IconRight?: React.ComponentType<any>;
//     } & DayPickerProps["components"];
//   }
// }

// export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//         month: "space-y-4",
//         caption: "flex justify-center pt-1 relative items-center",
//         caption_label: "text-sm font-medium",
//         nav: "space-x-1 flex items-center",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-y-1",
//         head_row: "flex",
//         head_cell:
//           "text-muted-foreground rounded-md w-9 font-normal text-[0.8em]",
//         row: "flex w-full mt-2",
//         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
//         ),
//         day_range_end: "day-range-end",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside:
//           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
//         day_disabled: "text-muted-foreground opacity-50",
//         day_range_middle:
//           "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconRight: (props) => <ChevronRight className="h-4 w-4" {...props} />,
//         // Uncomment if IconLeft is needed
//         // IconLeft: (props) => <ChevronLeft className="h-4 w-4" {...props} />,
//       }}
//       {...props}
//     />
//   );
// }
// Calendar.displayName = "Calendar";

// export { Calendar };

// src/components/ui/calendar.tsx
import { DayPicker } from "react-day-picker";
import { ChevronRight } from "lucide-react";

// Use intersection for props
type CalendarProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "className" | "classNames"
> & {
  className?: string;
  classNames?: Partial<Record<string, string>>;
};

function Calendar({
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // ... rest unchanged
  return (
    <DayPicker
      // ... props
      components={{
        IconRight: ({ className }: { className?: string }) =>
          (
            // Your component
            <ChevronRight className={className} />
          ) as any, // Type assertion for TS
      }}
    />
  );
}
