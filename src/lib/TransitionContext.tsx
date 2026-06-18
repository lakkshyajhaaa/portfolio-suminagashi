"use client";

import React, { createContext, useContext } from "react";
import { useMachine } from "@xstate/react";
import { transitionMachine, PageRoute } from "./machine";

type TransitionContextType = {
  state: any;
  send: any;
  navigate: (route: PageRoute) => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, send] = useMachine(transitionMachine);

  const navigate = (route: PageRoute) => {
    send({ type: "NAVIGATE", route });
  };

  return (
    <TransitionContext.Provider value={{ state, send, navigate }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionMachine() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionMachine must be used within a TransitionProvider");
  }
  return context;
}
