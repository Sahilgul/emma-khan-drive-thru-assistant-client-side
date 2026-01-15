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
import "./Settings.css";

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
    // Save to localStorage (temporary)
    localStorage.setItem("appLogo", logoPreview || "");
    localStorage.setItem("appTagline", tagline);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    localStorage.setItem("fontStyle", font);

    // Apply globally through ThemeContext
    setPrimaryColor(primaryColor);
    setSecondaryColor(secondaryColor);

    // Apply font
    document.body.style.fontFamily = font.split(" - ")[0];

    // ✅ Later you can replace this with API call to save in DB
    showSuccess("Theme updated successfully!");
  };


  return (
    <div className="settings-container">
      {/* HEADER */}
      <div className="settings-header">
        <h2>System Configuration</h2>
        <p>Manage your digital ordering system settings</p>
        <button className="btn-apply" onClick={handleApplyChanges}>
          Apply Changes
        </button>
      </div>

      {/* TABS */}
      <div className="tabs">
        {[
          { id: "general", label: "General", icon: SettingsIcon },
          { id: "layout", label: "Layout", icon: LayoutGrid },
          { id: "assistant", label: "Assistant", icon: Bot },
          { id: "category", label: "Category", icon: Tags },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* ----------------- GENERAL TAB ----------------- */}
      {activeTab === "general" && (
        <div className="tab-content general">
          {/* BRANDING */}
          <div className="card">
            <h4>Restaurant Branding</h4>
            <p>Configure your restaurant’s logo and tagline</p>

            <div className="upload-section">
              <div className="upload-box">
                {!logoPreview ? (
                  <>
                    <label htmlFor="logoUpload" className="upload-area">
                      <ImagePlusIcon className="upload-icon" size={20} />
                      <p className="upload-text">Upload Logo</p>
                      <span className="upload-info">PNG, JPG up to 2MB</span>
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
                  <div className="logo-preview">
                    <img src={logoPreview} alt="Logo Preview" />
                    <button
                      className="btn-remove-logo"
                      onClick={() => setLogoPreview(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <label className="form-label">Tagline</label>
            <input
              className="form-input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          {/* VISUAL STYLING */}
          <div className="card">
            <h4>Visual Styling</h4>
            <p>Customize colors and fonts</p>

            <div className="color-row">
              <div className="color-box">
                <label>Primary Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColorState(e.target.value)}
                  />
                  <input type="text" value={primaryColor} readOnly />
                </div>
              </div>

              <div className="color-box">
                <label>Secondary Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColorState(e.target.value)}
                  />
                  <input type="text" value={secondaryColor} readOnly />
                </div>
              </div>
            </div>

            <div className="font-style">
              <label>Font Style & Size</label>
              <select
                className="font-select"
                value={font}
                onChange={(e) => setFont(e.target.value)}
              >
                <option>Poppins - 16px</option>
                <option>Inter - 16px</option>
                <option>Roboto - 15px</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- LAYOUT TAB ----------------- */}
      {activeTab === "layout" && <LayoutTab />}

      {/* ----------------- OTHER TABS ----------------- */}
      {activeTab === "assistant" && <AssistantTab />}
      {activeTab === "category" && <CategoryTab />}
    </div>
  );
};

export default Setting;
