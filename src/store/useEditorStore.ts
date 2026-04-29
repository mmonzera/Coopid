import { create } from "zustand";

interface Appearance {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  sections: { id: string; label: string; active: boolean }[];
}

interface InvitationContent {
  title?: string;
  groomName?: string;
  brideName?: string;
  date?: string;
  location?: string;
  time?: string;
  story?: string;
  // Extended fields for the new UI
  groomFullName?: string;
  groomParents?: string;
  brideFullName?: string;
  brideParents?: string;
  eventAddress?: string;
  mapUrl?: string;
  rsvpDeadline?: string;
  rsvpMessage?: string;
}

interface EditorStore {
  appearance: Appearance;
  content: InvitationContent;
  status: string;
  isMusicEnabled: boolean;
  setAppearance: (appearance: Partial<Appearance>) => void;
  setContent: (content: Partial<InvitationContent>) => void;
  setStatus: (status: string) => void;
  setIsMusicEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const defaultAppearance: Appearance = {
  primaryColor: "#d946ef",
  secondaryColor: "#c026d3",
  accentColor: "#fdf4ff",
  fontHeading: "Playfair Display",
  fontBody: "Inter",
  sections: [
    { id: "cover", label: "Cover", active: true },
    { id: "couple", label: "Mempelai", active: true },
    { id: "event", label: "Acara", active: true },
    { id: "story", label: "Cerita", active: true },
    { id: "gallery", label: "Galeri", active: true },
    { id: "rsvp", label: "RSVP", active: true },
  ],
};

const defaultContent: InvitationContent = {
  title: "Undangan Pernikahan",
  groomName: "",
  brideName: "",
  date: "",
  location: "",
  time: "",
  story: "",
  groomFullName: "",
  groomParents: "",
  brideFullName: "",
  brideParents: "",
  eventAddress: "",
  mapUrl: "",
  rsvpDeadline: "",
  rsvpMessage: "",
};

export const useEditorStore = create<EditorStore>((set) => ({
  appearance: defaultAppearance,
  content: defaultContent,
  status: "DRAFT",
  isMusicEnabled: true,
  setAppearance: (partial) =>
    set((state) => ({
      appearance: { ...state.appearance, ...partial },
    })),
  setContent: (partial) =>
    set((state) => ({
      content: { ...state.content, ...partial },
    })),
  setStatus: (status) => set({ status }),
  setIsMusicEnabled: (isMusicEnabled) => set({ isMusicEnabled }),
  reset: () =>
    set({ appearance: defaultAppearance, content: defaultContent, status: "DRAFT", isMusicEnabled: true }),
}));
