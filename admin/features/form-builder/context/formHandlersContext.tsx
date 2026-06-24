import { createContext, useContext } from "react";
import { FieldHandlers } from "../types";

const FieldHandlersContext = createContext<Record<string, FieldHandlers>>({});

export function FieldHandlersProvider({
  children,
  handlers = {},
}: {
  children: React.ReactNode;
  handlers?: Record<string, FieldHandlers>;
}) {
  return (
    <FieldHandlersContext.Provider value={handlers}>
      {children}
    </FieldHandlersContext.Provider>
  );
}

export function useFieldHandlers(fieldName: string) {
  const handlers = useContext(FieldHandlersContext);
  return handlers[fieldName] ?? {};
}
