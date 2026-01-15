import React, { useState, useEffect, useContext } from "react";
import { ImagePlusIcon, Save, Loader, X, Monitor } from "lucide-react";
import { fetchLayoutSettings, saveLayoutSettings } from "../../services/layoutService";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import { AuthContext } from "../../contexts/AuthContext";

const LayoutTab = () => {
  const { user } = useContext(AuthContext) || {};
  const restaurantId = user?.userId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Layout State
  const [screenLayout, setScreenLayout] = useState("Middle Align");

  // Media State (Preview URL & File Object)
  const [bgMedia, setBgMedia] = useState<string | null>(null);
  const [bgMediaFile, setBgMediaFile] = useState<File | null>(null);

  const [leftScreen, setLeftScreen] = useState<string | null>(null);
  const [leftScreenFile, setLeftScreenFile] = useState<File | null>(null);

  const [rightScreen, setRightScreen] = useState<string | null>(null);
  const [rightScreenFile, setRightScreenFile] = useState<File | null>(null);

  // Fetch Settings on Mount
  useEffect(() => {
    if (restaurantId) {
      loadSettings();
    }
  }, [restaurantId]);

  const loadSettings = async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const data = await fetchLayoutSettings(restaurantId);
      if (data) {
        if (data.screenLayout) setScreenLayout(data.screenLayout);
        if (data.backgroundMedia) setBgMedia(data.backgroundMedia);
        if (data.leftScreen) setLeftScreen(data.leftScreen);
        if (data.rightScreen) setRightScreen(data.rightScreen);
      }
    } catch (error) {
      console.error("Failed to load layout settings", error);
      showError("Failed to load layout settings");
    } finally {
      setLoading(false);
    }
  };

  // File Handlers
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      setFile(file);
    }
  };

  const removeFile = (
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setPreview(null);
    setFile(null);
  };

  // Save Handler
  const handleSave = async () => {
    if (!restaurantId) {
      showError("User not authenticated");
      return;
    }

    try {
      setSaving(true);
      showLoading("Saving layout settings...");

      await saveLayoutSettings(restaurantId, {
        screenLayout,
        backgroundMedia: bgMediaFile,
        leftScreen: leftScreenFile,
        rightScreen: rightScreenFile,
      });

      showSuccess("Layout settings saved successfully!");

      // Clear file objects after successful save as they are now uploaded
      setBgMediaFile(null);
      setLeftScreenFile(null);
      setRightScreenFile(null);

      // Reload to get fresh URLs (optional, but good practice)
      await loadSettings();

    } catch (error) {
      console.error("Failed to save layout settings", error);
      showError("Failed to save layout settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading && restaurantId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Loader className="animate-spin text-teal-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading layout settings...</p>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
        <p className="text-slate-500">Please log in to view layout settings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Screen Layout Selection */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
            <Monitor size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Screen Layout</h4>
            <p className="text-sm text-slate-500">Choose how your content is aligned on the display</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Left Align", "Middle Align", "Right Align"].map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer
                ${screenLayout === opt
                  ? "border-teal-500 bg-teal-50/50 text-teal-700"
                  : "border-slate-100 hover:border-slate-200 text-slate-600"}`}
            >
              <input
                type="radio"
                name="screenLayout"
                value={opt}
                checked={screenLayout === opt}
                onChange={(e) => setScreenLayout(e.target.value)}
                className="w-5 h-5 accent-teal-600"
              />
              <span className="font-semibold">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Media Configuration - Portrait Displays */}
      <div>
        <div className="mb-6">
          <h4 className="text-xl font-bold text-slate-800">Display Content</h4>
          <p className="text-slate-500">Configure portrait media for each screen display</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Screen */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <h5 className="font-bold text-slate-700">Left Display</h5>
              <p className="text-xs text-slate-500">Secondary content area</p>
            </div>
            <MediaUploadBox
              title="Left Screen"
              state={leftScreen}
              setter={setLeftScreen}
              fileSetter={setLeftScreenFile}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
            />
          </div>


          {/* Background Media */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <h5 className="font-bold text-slate-700">Background Display</h5>
              <p className="text-xs text-slate-500">Primary system backdrop</p>
            </div>
            <MediaUploadBox
              title="Background"
              state={bgMedia}
              setter={setBgMedia}
              fileSetter={setBgMediaFile}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
            />
          </div>


          {/* Right Screen */}
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <h5 className="font-bold text-slate-700">Right Display</h5>
              <p className="text-xs text-slate-500">Tertiary content area</p>
            </div>
            <MediaUploadBox
              title="Right Screen"
              state={rightScreen}
              setter={setRightScreen}
              fileSetter={setRightScreenFile}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader className="animate-spin" size={20} /> Saving Changes...
            </>
          ) : (
            <>
              <Save size={20} /> Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface MediaUploadBoxProps {
  title: string;
  state: string | null;
  setter: any;
  fileSetter: any;
  handleFileChange: any;
  removeFile: any;
}

const MediaUploadBox = ({ title, state, setter, fileSetter, handleFileChange, removeFile }: MediaUploadBoxProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
      {!state ? (
        <div className="aspect-[9/16] w-full border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
          <label htmlFor={`${title}-upload`} className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImagePlusIcon size={28} />
            </div>
            <p className="text-slate-700 font-bold mb-1">Upload</p>
            <p className="text-slate-700 text-xs font-medium mb-2">{title}</p>
            <span className="text-slate-400 text-[10px] leading-tight">JPG, PNG, MP4<br />up to 10MB</span>
          </label>
          <input
            id={`${title}-upload`}
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={(e) => handleFileChange(e, setter, fileSetter)}
          />
        </div>
      ) : (
        <div className="relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
          {state.toLowerCase().endsWith(".mp4") || state.startsWith("data:video") ? (
            <video src={state} controls className="w-full h-full object-cover" />
          ) : (
            <img src={state} alt="Preview" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm">Preview</span>
          </div>
          <button
            className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm pointer-events-auto"
            onClick={() => removeFile(setter, fileSetter)}
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LayoutTab;
