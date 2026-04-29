"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useEditorStore } from "@/store/useEditorStore";
import Link from "next/link";
import { 
  ChevronLeft, 
  Layers, 
  Palette, 
  Image as ImageIcon, 
  Type, 
  ChevronUp, 
  ChevronDown, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Share2, 
  ExternalLink,
  Check,
  Save,
  Layout,
  GripVertical,
  Eye,
  EyeOff,
  Menu,
  X,
  RotateCcw
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FONT_PAIRINGS = [
  { heading: "Playfair Display", body: "Inter", label: "Elegan Modern" },
  { heading: "Cormorant Garamond", body: "Inter", label: "Klasik" },
  { heading: "DM Serif Display", body: "DM Sans", label: "Romantis" },
  { heading: "Fraunces", body: "Inter", label: "Mewah" },
  { heading: "Montserrat", body: "Merriweather", label: "Formal" },
  { heading: "Lora", body: "Inter", label: "Natural" },
];

const TEMPLATES = [
  { id: "garden", label: "Garden Romance", emoji: "🌸", bg: "#fdf4ff" },
  { id: "royal", label: "Royal Gold", emoji: "👑", bg: "#fffbeb" },
  { id: "modern", label: "Modern Minimal", emoji: "◻️", bg: "#f8fafc" },
  { id: "tropical", label: "Tropical Bloom", emoji: "🌺", bg: "#ecfdf5" },
];

type EditorTab = "susunan" | "desain" | "konten";
type DesainTab = "template" | "warna" | "typography";
type PreviewDevice = "desktop" | "tablet" | "mobile";

function SortableItem({ id, label, active, onToggle }: { id: string; label: string; active: boolean, onToggle: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 bg-white rounded-2xl border transition-all duration-200 ${
        isDragging 
          ? "shadow-2xl ring-2 ring-pink-500/20 border-pink-200 scale-[1.02] opacity-80" 
          : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <GripVertical size={18} />
        </div>
        <span className={`text-sm font-bold tracking-tight transition-colors ${active ? "text-gray-800" : "text-gray-400 line-through"}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggle}
          className={`p-2 rounded-lg transition-all ${active ? "text-pink-500 bg-pink-50" : "text-gray-300 bg-gray-50"}`}
        >
          {active ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function EditInvitationPage() {
  const params = useParams();
  const { appearance, content, setAppearance, setContent } = useEditorStore();
  const [activeMainTab, setActiveMainTab] = useState<EditorTab>("konten");
  const [activeDesainTab, setActiveDesainTab] = useState<DesainTab>("warna");
  const [openAccordion, setOpenAccordion] = useState<string | null>("cover");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("mobile");
  const [isLandscape, setIsLandscape] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadInvitation = useCallback(async () => {
    const res = await fetch(`/api/invitations/${params.id}`);
    const data = await res.json();
    if (data.invitation) {
      const inv = data.invitation;
      setSlug(inv.slug);
      if (inv.appearance && typeof inv.appearance === "object") {
        const loadedAppearance = { ...inv.appearance };
        if (!loadedAppearance.sections) {
          loadedAppearance.sections = [
            { id: "cover", label: "Cover", active: true },
            { id: "couple", label: "Mempelai", active: true },
            { id: "event", label: "Acara", active: true },
            { id: "story", label: "Cerita", active: true },
            { id: "gallery", label: "Galeri", active: true },
            { id: "rsvp", label: "RSVP", active: true },
          ];
        }
        setAppearance(loadedAppearance);
      }
      if (inv.status) useEditorStore.getState().setStatus(inv.status);
      if (inv.isMusicEnabled !== undefined) useEditorStore.getState().setIsMusicEnabled(inv.isMusicEnabled);
      setContent({
        ...inv.content,
        title: inv.title || "",
        groomName: inv.groomName || "",
        brideName: inv.brideName || "",
        date: inv.date ? new Date(inv.date).toISOString().split("T")[0] : "",
        location: inv.location || "",
        time: inv.time || "",
        story: inv.story || "",
      });
    }
    setLoading(false);
  }, [params.id, setAppearance, setContent]);

  useEffect(() => { loadInvitation(); }, [loadInvitation]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const { status, isMusicEnabled } = useEditorStore.getState();
      const res = await fetch(`/api/invitations/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...content, 
          appearance, 
          content,
          status,
          isMusicEnabled
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan undangan");
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Gagal menyimpan undangan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = appearance.sections.findIndex((s) => s.id === active.id);
      const newIndex = appearance.sections.findIndex((s) => s.id === over.id);

      setAppearance({
        sections: arrayMove(appearance.sections, oldIndex, newIndex),
      });
    }
  };

  const toggleSection = (id: string) => {
    setAppearance({
      sections: appearance.sections.map((s) => 
        s.id === id ? { ...s, active: !s.active } : s
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFCF6]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-pink-100 rounded-full" />
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <p className="text-gray-400 font-medium animate-pulse tracking-wide">Initializing Premium Editor...</p>
        </div>
      </div>
    );
  }



  const desainTabs: { id: DesainTab; label: string }[] = [
    { id: "template", label: "Template" },
    { id: "warna", label: "Warna" },
    { id: "typography", label: "Typography" },
  ];

  const ColorPicker = ({ label, color, colorKey }: { label: string, color: string, colorKey: "primaryColor" | "secondaryColor" | "accentColor" }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <input
            type="color"
            value={color}
            onChange={(e) => setAppearance({ [colorKey]: e.target.value })}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
          />
        </div>
        <Switch 
          checked={true} 
          className="scale-90"
        />
      </div>
    </div>
  );

  const getDeviceConfig = () => {
    let aspectRatio = isLandscape ? "19.5/9" : "9/19.5";
    let maxWidth = isLandscape ? "736px" : "340px";
    let outerRadius = "3.5rem";
    let innerRadius = "2.8rem";
    let showNotch = previewDevice === "mobile" && !isLandscape;

    if (previewDevice === "tablet") {
      aspectRatio = isLandscape ? "4/3" : "3/4";
      maxWidth = isLandscape ? "820px" : "620px";
      outerRadius = "2rem";
      innerRadius = "1.5rem";
      showNotch = false;
    } else if (previewDevice === "desktop") {
      aspectRatio = "16/9";
      maxWidth = "1024px";
      outerRadius = "1rem";
      innerRadius = "0.5rem";
      showNotch = false;
    }

    return { aspectRatio, maxWidth, outerRadius, innerRadius, showNotch };
  };

  const deviceConfig = getDeviceConfig();

  return (
    <div className="flex flex-1 bg-[#FDFCF6] font-sans selection:bg-pink-100 h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-4 left-4 z-[60] bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-600"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Control Panel - Inspector */}
      <div className={`fixed lg:relative inset-y-0 left-0 w-[340px] lg:w-[420px] bg-white border-r border-gray-100 flex flex-col shadow-2xl z-20 overflow-hidden transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 lg:px-8 pt-10 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard" className="rounded-full p-2 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h2 className="text-xl lg:text-2xl font-black text-gray-800 tracking-tight">Atur Tampilan</h2>
          </div>
          
          {/* Main Tabs */}
          <div className="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 border border-gray-100 mb-2">
            {(["susunan", "desain", "konten"] as EditorTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMainTab(tab)}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-500 ${
                  activeMainTab === tab
                    ? "bg-white text-gray-900 shadow-sm transform scale-[1.02]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>


        </div>

        {/* Panel Content Area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-2 custom-scrollbar space-y-10">
          {activeMainTab === "susunan" && (
            <div className="space-y-4 animate-in fade-in duration-700 slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Order Sections</span>
                <span className="text-[10px] text-gray-300 font-bold">DRAG TO REORDER</span>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={appearance.sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {appearance.sections.map((section) => (
                      <SortableItem 
                        key={section.id} 
                        id={section.id} 
                        label={section.label} 
                        active={section.active}
                        onToggle={() => toggleSection(section.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeMainTab === "desain" && (
            <div className="space-y-4 animate-in fade-in duration-700">
              
              {/* Tema Accordion */}
              <div className="border border-gray-100 rounded-[1.5rem] bg-white overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "tema" ? null : "tema")}
                  className="w-full flex items-center justify-between p-5 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-black text-gray-800">Tema Visual</span>
                  {openAccordion === "tema" ? <ChevronUp size={18} className="text-pink-500" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {openAccordion === "tema" && (
                  <div className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-300 border-t border-gray-100 bg-white">
                    <div className="grid grid-cols-1 gap-4">
                      {TEMPLATES.map((t) => (
                        <Card key={t.id} className="group relative overflow-hidden border-2 border-gray-50 hover:border-pink-200 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-pink-500/10 rounded-2xl p-4" style={{ backgroundColor: t.bg }}>
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="text-3xl transform group-hover:scale-110 transition-transform duration-700">{t.emoji}</div>
                            <div className="space-y-1">
                              <div className="text-sm font-black text-gray-800">{t.label}</div>
                              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Premium Selection</div>
                            </div>
                          </div>
                          {appearance.accentColor === t.bg && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg animate-in zoom-in">
                              <Check size={14} className="text-pink-500" />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Warna Accordion */}
              <div className="border border-gray-100 rounded-[1.5rem] bg-white overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "warna" ? null : "warna")}
                  className="w-full flex items-center justify-between p-5 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-black text-gray-800">Skema Warna</span>
                  {openAccordion === "warna" ? <ChevronUp size={18} className="text-pink-500" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {openAccordion === "warna" && (
                  <div className="p-5 space-y-6 animate-in slide-in-from-top-2 duration-300 border-t border-gray-100 bg-white">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 block px-1">Warna Utama</Label>
                      <div className="space-y-2">
                        <ColorPicker label="Primary" color={appearance.primaryColor} colorKey="primaryColor" />
                        <ColorPicker label="Secondary" color={appearance.secondaryColor} colorKey="secondaryColor" />
                        <ColorPicker label="Background" color={appearance.accentColor} colorKey="accentColor" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Typography Accordion */}
              <div className="border border-gray-100 rounded-[1.5rem] bg-white overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "typography" ? null : "typography")}
                  className="w-full flex items-center justify-between p-5 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-black text-gray-800">Tipografi</span>
                  {openAccordion === "typography" ? <ChevronUp size={18} className="text-pink-500" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {openAccordion === "typography" && (
                  <div className="p-5 space-y-4 animate-in slide-in-from-top-2 duration-300 border-t border-gray-100 bg-white">
                    {FONT_PAIRINGS.map((pair) => {
                      const selected = appearance.fontHeading === pair.heading && appearance.fontBody === pair.body;
                      return (
                        <button
                          key={pair.label}
                          onClick={() => setAppearance({ fontHeading: pair.heading, fontBody: pair.body })}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-500 group ${
                            selected 
                              ? "border-pink-500 bg-pink-50/20 shadow-xl ring-2 ring-pink-500/10" 
                              : "border-gray-50 hover:border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-xs font-black text-gray-800 mb-2">{pair.label}</div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tighter border border-gray-100">{pair.heading}</span>
                                <span className="text-gray-200 text-[10px] tracking-widest">///</span>
                                <span className="px-2 py-0.5 bg-white rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tighter border border-gray-100">{pair.body}</span>
                              </div>
                            </div>
                            {selected && <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeMainTab === "konten" && (
            <div className="space-y-4 animate-in fade-in duration-700">
              {[
                {
                  id: "cover",
                  title: "Cover & Utama",
                  fields: [
                    { label: "Wedding Title", value: content.title || "", key: "title" as const, placeholder: "The Wedding of..." },
                    { label: "Groom Name", value: content.groomName || "", key: "groomName" as const, placeholder: "Enter groom name" },
                    { label: "Bride Name", value: content.brideName || "", key: "brideName" as const, placeholder: "Enter bride name" },
                    { label: "Wedding Date", value: content.date || "", key: "date" as const, placeholder: "YYYY-MM-DD", type: "date" },
                  ]
                },
                {
                  id: "couple",
                  title: "Mempelai",
                  fields: [
                    { label: "Groom Full Name", value: content.groomFullName || "", key: "groomFullName" as const, placeholder: "Groom's full name" },
                    { label: "Groom Parents", value: content.groomParents || "", key: "groomParents" as const, placeholder: "Putra dari Bpk... & Ibu..." },
                    { label: "Bride Full Name", value: content.brideFullName || "", key: "brideFullName" as const, placeholder: "Bride's full name" },
                    { label: "Bride Parents", value: content.brideParents || "", key: "brideParents" as const, placeholder: "Putri dari Bpk... & Ibu..." },
                  ]
                },
                {
                  id: "event",
                  title: "Acara & Lokasi",
                  fields: [
                    { label: "Location Name", value: content.location || "", key: "location" as const, placeholder: "Gedung Pernikahan" },
                    { label: "Event Time", value: content.time || "", key: "time" as const, placeholder: "08:00 - Selesai" },
                    { label: "Full Address", value: content.eventAddress || "", key: "eventAddress" as const, placeholder: "Jl. Contoh No 123..." },
                    { label: "Google Maps URL", value: content.mapUrl || "", key: "mapUrl" as const, placeholder: "https://goo.gl/maps/..." },
                  ]
                },
                {
                  id: "story",
                  title: "Cerita & RSVP",
                  fields: [
                    { label: "Love Story", value: content.story || "", key: "story" as const, placeholder: "Bagaimana kalian bertemu?", type: "textarea" },
                    { label: "RSVP Deadline", value: content.rsvpDeadline || "", key: "rsvpDeadline" as const, placeholder: "YYYY-MM-DD", type: "date" },
                  ]
                }
              ].map((section) => (
                <div key={section.id} className="border border-gray-100 rounded-[1.5rem] bg-white overflow-hidden shadow-sm transition-all duration-300">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-5 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-black text-gray-800">{section.title}</span>
                    {openAccordion === section.id ? <ChevronUp size={18} className="text-pink-500" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </button>
                  
                  {openAccordion === section.id && (
                    <div className="p-5 space-y-5 animate-in slide-in-from-top-2 duration-300 border-t border-gray-100">
                      {section.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{field.label}</Label>
                          {field.type === "textarea" ? (
                            <textarea
                              value={field.value}
                              onChange={(e) => setContent({ [field.key]: e.target.value })}
                              className="w-full min-h-[100px] rounded-2xl border-transparent bg-gray-50/80 focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm font-medium placeholder:text-gray-300 p-4 shadow-none resize-y"
                              placeholder={field.placeholder}
                            />
                          ) : (
                            <Input
                              type={field.type || "text"}
                              value={field.value}
                              onChange={(e) => setContent({ [field.key]: e.target.value })}
                              className="h-12 rounded-xl border-transparent bg-gray-50/80 focus:bg-white focus:border-pink-200 transition-all text-sm font-medium placeholder:text-gray-300 px-4 shadow-none"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 lg:p-8 border-t border-gray-50 bg-white">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-16 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-pink-500/20 group relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #FF1C8D, #D41474)" }}
          >
            {saving ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing...</span>
              </div>
            ) : saved ? (
              <div className="flex items-center gap-3">
                <Check size={20} />
                <span>Saved Successfully!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Save size={20} />
                <span>Save Invitation</span>
              </div>
            )}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-30deg]" />
          </Button>
        </div>
      </div>

      {/* Right: Immersive Preview Area */}
      <div className="flex-1 flex flex-col bg-[#F9F9F4] relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E2E2D1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Floating Top Nav */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 lg:px-10 py-6 z-10 relative gap-4">
          <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] px-6 lg:px-8 py-3 shadow-2xl shadow-black/5 flex items-center gap-4 w-full md:max-w-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 hidden sm:inline">Public URL</span>
              <div className="w-[1px] h-4 bg-gray-100 hidden sm:inline" />
              <span className="text-xs text-gray-500 font-bold truncate">
                {slug ? `coopid.app/invitation/${slug}` : "coopid.app/..."}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3">
            <Button variant="outline" className="rounded-full bg-white/80 backdrop-blur-xl border-white shadow-xl hover:bg-white px-4 lg:px-6 font-bold text-xs gap-2">
              <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
            </Button>
            <Button className="rounded-full bg-gray-900 text-white shadow-xl px-4 lg:px-6 font-bold text-xs gap-2">
              <ExternalLink size={16} /> <span className="hidden sm:inline">Open</span>
            </Button>
          </div>
        </div>

        {/* Device Switcher Floating Center */}
        <div className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 scale-90 sm:scale-100">
          <div className="flex bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-1.5 shadow-2xl ring-1 ring-white/10 items-center gap-1">
            {[
              { id: "desktop" as PreviewDevice, icon: Monitor },
              { id: "tablet" as PreviewDevice, icon: Tablet },
              { id: "mobile" as PreviewDevice, icon: Smartphone },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setPreviewDevice(d.id)}
                className={`w-12 h-10 lg:w-14 lg:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  previewDevice === d.id
                    ? "bg-yellow-400 text-gray-900 shadow-xl scale-[1.05]"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <d.icon size={20} strokeWidth={2.5} />
              </button>
            ))}
            
            <div className="w-[1px] h-6 bg-white/20 mx-1" />
            
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className={`w-12 h-10 lg:w-14 lg:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 text-gray-500 hover:text-white ${isLandscape ? "bg-white/10 text-white" : ""}`}
              title="Rotate Landscape"
            >
              <RotateCcw size={18} strokeWidth={2.5} className={isLandscape ? "rotate-90 transition-transform duration-500" : "transition-transform duration-500"} />
            </button>
          </div>
        </div>

        {/* The Mockup */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
          <div
            className="relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] w-full max-h-full flex items-center justify-center"
            style={{ maxWidth: deviceConfig.maxWidth, aspectRatio: deviceConfig.aspectRatio }}
          >
            <div 
              className="relative bg-[#0F0F0F] p-3 lg:p-4 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ring-inset w-full h-full transition-all duration-1000"
              style={{ borderRadius: deviceConfig.outerRadius }}
            >
              {/* Screen */}
              <div 
                className="bg-white overflow-hidden relative shadow-inner w-full h-full border border-black/5 transition-all duration-1000"
                style={{ borderRadius: deviceConfig.innerRadius }}
              >
                {/* Dynamic Island Hardware (Only for mobile portrait) */}
                {deviceConfig.showNotch && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 lg:w-36 h-7 lg:h-9 bg-black rounded-b-[1.5rem] lg:rounded-b-[2rem] z-50 flex items-center justify-end px-4 lg:px-6 gap-3">
                     <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                     <div className="w-2 h-2 rounded-full bg-white/5" />
                  </div>
                )}

                {/* Content - Sorted by User */}
                <div className="h-full overflow-y-auto scrollbar-hide bg-white">
                  {appearance.sections
                    .filter(s => s.active)
                    .map((section, idx) => (
                      <div key={section.id} className="min-h-[400px] flex flex-col items-center justify-center p-8 lg:p-10 border-b border-gray-50 last:border-0 relative">
                        {section.id === "cover" && (
                          <div className="animate-in fade-in zoom-in duration-1000 space-y-10 w-full text-center">
                            <div className="text-[80px] lg:text-[120px] absolute top-10 left-1/2 -translate-x-1/2 opacity-10 grayscale select-none">🌸</div>
                            <div className="space-y-4 relative z-10">
                               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Official Invitation</div>
                               <div className="w-12 h-[3px] bg-pink-100 mx-auto rounded-full" />
                            </div>
                            <div className="relative z-10">
                              <h1 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>
                                {content.groomName || "Rea"}
                                <div className="text-2xl text-gray-200 italic my-4">&</div>
                                {content.brideName || "David"}
                              </h1>
                            </div>
                            <div className="bg-white/80 backdrop-blur shadow-2xl rounded-[2.5rem] p-6 lg:p-8 space-y-6 relative z-10 border border-white">
                               <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">Save the Date</div>
                               <div className="text-base lg:text-lg font-bold text-gray-800" style={{ color: appearance.primaryColor }}>
                                 {content.date ? new Date(content.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "October 24, 2026"}
                               </div>
                               <button className="w-full py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-pink-500/20" style={{ background: `linear-gradient(135deg, ${appearance.primaryColor}, ${appearance.secondaryColor})` }}>
                                 Open Invitation
                               </button>
                            </div>
                          </div>
                        )}
                        {section.id === "couple" && (
                          <div className="text-center space-y-8 animate-in fade-in duration-1000 w-full">
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>
                                {content.groomFullName || "Nama Lengkap Pria"}
                              </h3>
                              <p className="text-[11px] text-gray-500 font-medium">
                                {content.groomParents || "Putra dari Bpk. ... & Ibu ..."}
                              </p>
                            </div>
                            <div className="text-3xl text-pink-200">♥</div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>
                                {content.brideFullName || "Nama Lengkap Wanita"}
                              </h3>
                              <p className="text-[11px] text-gray-500 font-medium">
                                {content.brideParents || "Putri dari Bpk. ... & Ibu ..."}
                              </p>
                            </div>
                          </div>
                        )}
                        {section.id === "event" && (
                          <div className="text-center space-y-6 animate-in fade-in duration-1000 w-full">
                            <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-500 mb-2">📍</div>
                            <h3 className="text-xl font-bold" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>Resepsi Pernikahan</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="font-bold">{content.date ? new Date(content.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Sabtu, 24 Oktober 2026"}</p>
                              <p>{content.time || "08:00 - Selesai"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 space-y-2 border border-gray-100">
                              <p className="font-bold text-gray-700">{content.location || "Gedung Pernikahan"}</p>
                              <p>{content.eventAddress || "Jl. Contoh Alamat No. 123"}</p>
                            </div>
                            {content.mapUrl && (
                              <button className="w-full py-3 rounded-xl border border-pink-200 text-pink-600 text-xs font-bold transition-all hover:bg-pink-50">Buka di Google Maps</button>
                            )}
                          </div>
                        )}
                        {section.id === "story" && (
                          <div className="text-center space-y-6 animate-in fade-in duration-1000 w-full">
                            <h3 className="text-xl font-bold" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>Kisah Kami</h3>
                            <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-pink-200 pl-4 text-left">
                              "{content.story || "Tuliskan cerita cinta kalian di sini..."}"
                            </p>
                          </div>
                        )}
                        {section.id === "rsvp" && (
                          <div className="text-center space-y-6 animate-in fade-in duration-1000 w-full">
                            <h3 className="text-xl font-bold" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>Kehadiran</h3>
                            <p className="text-xs text-gray-500">
                              Mohon konfirmasi kehadiran Anda sebelum <br/><span className="font-bold text-pink-500">{content.rsvpDeadline || "tanggal yang ditentukan"}</span>.
                            </p>
                            <div className="space-y-3 mt-4">
                              <input placeholder="Nama Anda" className="w-full h-10 bg-gray-50 border-none rounded-lg px-3 text-xs" readOnly />
                              <button className="w-full h-10 bg-gray-900 text-white rounded-lg text-xs font-bold">Kirim RSVP</button>
                            </div>
                          </div>
                        )}
                        {section.id === "gallery" && (
                          <div className="text-center space-y-4 animate-in fade-in duration-1000 w-full">
                            <h3 className="text-xl font-bold" style={{ fontFamily: appearance.fontHeading, color: appearance.primaryColor }}>Galeri</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="aspect-square bg-gray-100 rounded-xl"></div>
                              <div className="aspect-square bg-gray-100 rounded-xl"></div>
                              <div className="aspect-square bg-gray-100 rounded-xl"></div>
                              <div className="aspect-square bg-gray-100 rounded-xl"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Hardware Shine & Buttons */}
            {deviceConfig.showNotch && (
              <>
                <div className="absolute -right-2 top-40 w-1.5 h-24 bg-gradient-to-b from-[#2A2A2A] to-[#0F0F0F] rounded-r-2xl border-y border-white/10" />
                <div className="absolute -left-2 top-32 w-1.5 h-16 bg-gradient-to-b from-[#2A2A2A] to-[#0F0F0F] rounded-l-2xl border-y border-white/10" />
                <div className="absolute -left-2 top-52 w-1.5 h-16 bg-gradient-to-b from-[#2A2A2A] to-[#0F0F0F] rounded-l-2xl border-y border-white/10" />
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F1F1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E5E7EB; }
      `}</style>
    </div>
  );
}
