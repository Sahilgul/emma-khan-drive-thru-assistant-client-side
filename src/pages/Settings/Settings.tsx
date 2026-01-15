import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { showSuccess } from "../../utils/alert";
import LayoutTab from "./LayoutTab";
import AssistantTab from "./AssistantTab";
import CategoryTab from "./CategoryTab";
import {
  LayoutGrid,
  Bot,
  Tags,
  SettingsIcon,
  ImagePlusIcon,
} from "lucide-react";


const Setting: React.FC = () => {
  const { setPrimaryColor, setSecondaryColor } = useContext(ThemeContext);

  // Tabs
  const [activeTab, setActiveTab] = useState("general");

  // Branding
  const [logoPreview, setLogoPreview] = useState<string | null>(
    localStorage.getItem("appLogo") || null
  );
  const [tagline, setTagline] = useState(
    localStorage.getItem("appTagline") ||
    "Hi, I am Emma, your virtual order assistant"
  );

  // Theme
  const [primaryColor, setPrimaryColorState] = useState(
    localStorage.getItem("primaryColor") || "#181818"
  );
  const [secondaryColor, setSecondaryColorState] = useState(
    localStorage.getItem("secondaryColor") || "#76B900"
  );
  const [font, setFont] = useState(
    localStorage.getItem("fontStyle") || "Poppins - 16px"
  );

  // Sync colors on mount
  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--secondary-color",
      secondaryColor
    );
    document.body.style.fontFamily = font.split(" - ")[0];
  }, [primaryColor, secondaryColor, font]);

  // ✅ Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Apply and Save Theme
  const handleApplyChanges = () => {
    localStorage.setItem("appLogo", logoPreview || "");
    localStorage.setItem("appTagline", tagline);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    localStorage.setItem("fontStyle", font);

    setPrimaryColor(primaryColor);
    setSecondaryColor(secondaryColor);

    document.body.style.fontFamily = font.split(" - ")[0];
    showSuccess("Theme updated successfully!");
  };

  return (
    <div className="p-8 pb-24 bg-slate-50 min-h-screen transition-all duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Configuration</h1>
          <p className="text-slate-500 mt-1">Manage your digital ordering system settings</p>
        </div>
        <button
          onClick={handleApplyChanges}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          Apply Changes
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
        {[
          { id: "general", label: "General", icon: SettingsIcon },
          { id: "layout", label: "Layout", icon: LayoutGrid },
          { id: "assistant", label: "Assistant", icon: Bot },
          { id: "category", label: "Category", icon: Tags },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${activeTab === id
                ? "bg-teal-50 text-teal-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* ----------------- GENERAL TAB ----------------- */}
      {activeTab === "general" && (
        <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* BRANDING */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <ImagePlusIcon size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Restaurant Branding</h4>
                <p className="text-sm text-slate-500">Configure your restaurant’s logo and tagline</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                {!logoPreview ? (
                  <>
                    <label htmlFor="logoUpload" className="cursor-pointer block">
                      <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <ImagePlusIcon size={28} />
                      </div>
                      <p className="text-slate-700 font-semibold mb-1">Upload Brand Logo</p>
                      <span className="text-slate-400 text-xs">PNG, JPG up to 2MB</span>
                    </label>
                    <input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </>
                ) : (
                  <div className="relative inline-block">
                    <img src={logoPreview} alt="Logo Preview" className="h-32 object-contain rounded-lg" />
                    <button
                      className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                      onClick={() => setLogoPreview(null)}
                    >
                      <Tags size={14} className="rotate-45" /> {/* Using Tags as placeholder for X if X not imported, or just import X */}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Tagline</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 placeholder-slate-400"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Enter a catchy tagline..."
              />
            </div>
          </div>

          {/* VISUAL STYLING */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                <SettingsIcon size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Visual Styling</h4>
                <p className="text-sm text-slate-500">Customize appearance and typography</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Primary Color</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColorState(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-sm font-mono text-slate-600 uppercase">{primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Secondary Color</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColorState(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-sm font-mono text-slate-600 uppercase">{secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 ml-1">Font Style & Size</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-white"
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                  >
                    <option>Poppins - 16px</option>
                    <option>Inter - 16px</option>
                    <option>Roboto - 15px</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <LayoutGrid size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- LAYOUT TAB ----------------- */}
      {activeTab === "layout" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><LayoutTab /></div>}

      {/* ----------------- OTHER TABS ----------------- */}
      {activeTab === "assistant" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><AssistantTab /></div>}
      {activeTab === "category" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><CategoryTab /></div>}
    </div>
  );
};

export default Setting;
