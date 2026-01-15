import React, { useState } from "react";
import { ImagePlusIcon } from "lucide-react";
import "./Settings.css";

const AssistantTab = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setAvatar(previewURL);
    }
  };

  return (
    <div className="tab-content assistant">
      {/* Virtual Assistant Configuration */}
      <div className="card">
        <h4>Virtual Assistant Configuration</h4>
        <p>Customize your AI ordering assistant’s appearance and personality</p>

        {/* Assistant Name */}
        <label className="form-label">Assistant Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Emma"
          defaultValue="Emma"
        />

        {/* Upload Avatar */}
        <div className="upload-section">
          <label className="form-label mt-3">Upload Avatar</label>
          {!avatar ? (
            <div className="upload-box small">
              <label htmlFor="avatarUpload" className="upload-area">
                <ImagePlusIcon size={40} className="upload-icon" />
                <p className="upload-text">Upload Avatar</p>
                <span className="upload-info">
                  PNG, JPG up to 2MB. Recommended: 256x256px
                </span>
              </label>
              <input
                id="avatarUpload"
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
          ) : (
            <div className="avatar-preview">
              <img src={avatar} alt="Avatar" />
              <button className="remove-btn" onClick={() => setAvatar(null)}>
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Custom Greeting Message */}
        <label className="form-label mt-3">Custom Greeting Message</label>
        <textarea
          className="form-input"
          placeholder="I'm Emma, your virtual ordering assistant. What delicious meal can I help you with today?"
          defaultValue="I'm Emma, your virtual ordering assistant. What delicious meal can I help you with today?"
        ></textarea>
      </div>

      {/* Assistant Personality */}
      <div className="card">
        <h4>Assistant Personality</h4>
        <p>Configure how your assistant interacts with customers</p>

        <label className="form-label">Response Style</label>
        <select className="form-input">
          <option>Friendly</option>
          <option selected>Professional</option>
          <option>Humorous</option>
        </select>

        <label className="form-label mt-3">Primary Language</label>
        <select className="form-input">
          <option selected>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      {/* Custom Phrases */}
      <div className="card">
        <h4>Custom Phrases</h4>
        <p>Personalize your assistant’s responses</p>

        <label className="form-label">Order Complete Message</label>
        <textarea
          className="form-input"
          placeholder="Perfect! Your order is confirmed and will be ready shortly. Can I get your name please?"
          defaultValue="Perfect! Your order is confirmed and will be ready shortly. Can I get your name please?"
        ></textarea>

        <label className="form-label mt-3">Upsell Suggestion</label>
        <textarea
          className="form-input"
          placeholder="Would you like to make it a combo meal?"
          defaultValue="Would you like to make it a combo meal?"
        ></textarea>
      </div>
    </div>
  );
};

export default AssistantTab;
