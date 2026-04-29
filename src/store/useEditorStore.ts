import { create } from "zustand";

interface Appearance {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
}

interface InvitationContent {
  title?: string;
  groomName?: string;
  brideName?: string;
  date?: string;
  location?: string;
  time?: string;
  story?: string;
}

interface EditorStore {
  appearance: Appearance;
  content: InvitationContent;
  setAppearance: (appearance: Partial<Appearance>) => void;
  setContent: (content: Partial<InvitationContent>) => void;
  reset: () => void;
}

const defaultAppearance: Appearance = {
  primaryColor: "#d946ef",
  secondaryColor: "#c026d3",
  accentColor: "#fdf4ff",
  fontHeading: "Playfair Display",
  fontBody: "Inter",
};

const defaultContent: InvitationContent = {
  title: "Undangan Pernikahan",
  groomName: "",
  brideName: "",
  date: "",
  location: "",
  time: "",
  story: "",
};

export const useEditorStore = create<EditorStore>((set) => ({
  appearance: defaultAppearance,
  content: defaultContent,
  setAppearance: (partial) =>
    set((state) => ({
      appearance: { ...state.appearance, ...partial },
    })),
  setContent: (partial) =>
    set((state) => ({
      content: { ...state.content, ...partial },
    })),
  reset: () =>
    set({ appearance: defaultAppearance, content: defaultContent }),
}));
