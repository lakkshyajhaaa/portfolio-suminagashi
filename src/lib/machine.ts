import { setup, assign } from "xstate";

export type PageRoute = "home" | "work" | "about" | "contact";

export interface TransitionContext {
  targetRoute: PageRoute | null;
  progress: number; // 0 to 1 for visual timing
}

export const transitionMachine = setup({
  types: {
    context: {} as TransitionContext,
    events: {} as
      | { type: "NAVIGATE"; route: PageRoute }
      | { type: "ANIMATION_END" },
  },
  actions: {
    setTargetRoute: assign({
      targetRoute: ({ event }) =>
        event.type === "NAVIGATE" ? event.route : null,
    }),
    clearTargetRoute: assign({
      targetRoute: null,
    }),
  },
}).createMachine({
  id: "transition",
  initial: "idle",
  context: {
    targetRoute: null,
    progress: 0,
  },
  states: {
    idle: {
      on: {
        NAVIGATE: {
          target: "focus",
          actions: "setTargetRoute",
        },
      },
    },
    focus: {
      // The clicked element isolates
      on: {
        ANIMATION_END: "convergence",
      },
    },
    convergence: {
      // Camera starts moving; world begins responding; portal starts forming
      on: {
        ANIMATION_END: "absorption",
      },
    },
    absorption: {
      // Ink and light collapse inward toward the Ensō
      on: {
        ANIMATION_END: "void",
      },
    },
    void: {
      // Absolute silence, absolute darkness. Hides Next.js route changes
      on: {
        ANIMATION_END: "genesis",
      },
    },
    genesis: {
      // New world's physics initialize; colors and light sources begin emerging
      on: {
        ANIMATION_END: "reconstruction",
      },
    },
    reconstruction: {
      // New geometry forms; typography appears
      on: {
        ANIMATION_END: "settle",
      },
    },
    settle: {
      // Fluid slows; camera stabilizes; final page becomes interactive
      on: {
        ANIMATION_END: "idle",
      },
      exit: "clearTargetRoute",
    },
  },
});
