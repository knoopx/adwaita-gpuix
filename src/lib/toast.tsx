import { createContext, useContext, type ReactNode } from "react";
import { Toaster, useToasts, type ToastOptions } from "../components/chrome/Toaster";

export type ToastFn = (message: string, opts?: ToastOptions) => string;

const ToastContext = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, toast, dismiss } = useToasts();
  return (
    <ToastContext.Provider value={toast}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexBasis: 0,
          minHeight: 0,
        }}
      >
        {children}
        <Toaster toasts={toasts} onDismiss={dismiss} position="bottom-center" />
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const fn = useContext(ToastContext);
  if (!fn) throw new Error("useToast must be used within a ToastProvider");
  return fn;
}
