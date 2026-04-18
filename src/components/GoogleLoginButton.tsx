// // src/components/ui/GoogleLoginButton.tsx
// import { useEffect } from "react";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// interface GoogleLoginButtonProps {
//   onSuccess: (credential: string) => void;
//   onError?: () => void;
// }

// export const GoogleLoginButton = ({
//   onSuccess,
//   onError,
// }: GoogleLoginButtonProps) => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       window.google.accounts.id.initialize({
//         client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
//         callback: (response: any) => {
//           if (response.credential) {
//             onSuccess(response.credential);
//           }
//         },
//       });

//       window.google.accounts.id.renderButton(
//         document.getElementById("google-btn-container")!,
//         {
//           theme: "outline",
//           size: "large",
//           width: "100%",
//           text: "continue_with",
//           shape: "pill",
//         },
//       );
//     };

//     return () => {
//       if (document.body.contains(script)) document.body.removeChild(script);
//     };
//   }, [onSuccess]);

//   return <div id="google-btn-container" className="w-full mt-2" />;
// };

// src/components/ui/GoogleLoginButton.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

export const GoogleLoginButton = ({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              onSuccess(response.credential);
            } else if (onError) onError();
          },
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            width: 320, // Fixed pixel width (Google prefers this)
            text: "continue_with",
            shape: "rectangular",
          });
        }
      } catch (err) {
        console.error("Google button render error:", err);
      }
    };

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [onSuccess, onError]);

  return (
    <div ref={buttonRef} className="mx-auto" style={{ maxWidth: "320px" }} />
  );
};
