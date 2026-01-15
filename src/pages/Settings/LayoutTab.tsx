import React, { useState, useEffect, useContext } from "react";
import { ImagePlusIcon, Save, Loader } from "lucide-react";
import "./Settings.css";
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
      <div className="tab-content layout loading">
        <Loader className="animate-spin" size={32} />
        <p>Loading layout settings...</p>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="tab-content layout loading">
        <p>Please log in to view layout settings.</p>
      </div>
    )
  }

  return (
    <div className="tab-content layout">
      {/* Screen Layout */}
      <div className="card">
        <h4>Screen Layout</h4>
        <p>Choose how content appears</p>
        <div className="layout-options">
          {["Left Align", "Middle Align", "Right Align"].map((opt) => (
            <label key={opt} className="layout-radio">
              <input
                type="radio"
                name="screenLayout"
                value={opt}
                checked={screenLayout === opt}
                onChange={(e) => setScreenLayout(e.target.value)}
              />
              <span className="radio-mark" />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Upload Boxes */}
      {[
        {
          title: "Background Media",
          state: bgMedia,
          setter: setBgMedia,
          fileSetter: setBgMediaFile
        },
        {
          title: "Left Screen",
          state: leftScreen,
          setter: setLeftScreen,
          fileSetter: setLeftScreenFile
        },
        {
          title: "Right Screen",
          state: rightScreen,
          setter: setRightScreen,
          fileSetter: setRightScreenFile
        },
      ].map(({ title, state, setter, fileSetter }) => (
        <div className="card" key={title}>
          <h4>{title}</h4>
          <p>Upload image or video</p>
          {!state ? (
            <div className="upload-box wide">
              <label htmlFor={`${title}-upload`} className="upload-area">
                <ImagePlusIcon size={40} className="upload-icon" />
                <p className="upload-text">Upload Media</p>
                <span className="upload-info">
                  Supports JPG, PNG, MP4 up to 10MB
                </span>
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
            <div className="preview-box">
              {state.endsWith(".mp4") ? (
                <video src={state} controls className="preview-media" />
              ) : (
                <img src={state} alt="Preview" className="preview-media" />
              )}
              <button
                className="remove-btn"
                onClick={() => removeFile(setter, fileSetter)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Save Button */}
      <div className="action-footer">
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader className="animate-spin" size={18} /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Layout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LayoutTab;
