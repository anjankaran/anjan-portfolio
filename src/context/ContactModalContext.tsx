import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ContactModalContextValue = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }),
    [open],
  );

  return <ContactModalContext.Provider value={value}>{children}</ContactModalContext.Provider>;
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}
