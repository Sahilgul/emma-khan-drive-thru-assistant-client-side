import React, { useState } from "react";
import { ImagePlusIcon, X, Bot, Languages, MessageSquare, Sparkles } from "lucide-react";

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
    <div className="space-y-6">
      {/* Virtual Assistant Configuration */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
            <Bot size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Virtual Assistant Configuration</h4>
            <p className="text-sm text-slate-500">Customize your AI ordering assistant’s appearance and personality</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Assistant Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Assistant Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-slate-50/50 hover:bg-white"
              placeholder="Emma"
              defaultValue="Emma"
            />
          </div>

          {/* Upload Avatar */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Upload Avatar</label>
            {!avatar ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                <label htmlFor="avatarUpload" className="cursor-pointer block">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ImagePlusIcon size={28} />
                  </div>
                  <p className="text-slate-700 font-semibold mb-1">Upload Avatar Image</p>
                  <span className="text-slate-400 text-xs">PNG, JPG up to 2MB. Recommended: 256x256px</span>
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
              <div className="relative inline-block border border-slate-100 rounded-2xl p-2 bg-slate-50">
                <img src={avatar} alt="Avatar" className="w-32 h-32 object-cover rounded-xl" />
                <button
                  className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                  onClick={() => setAvatar(null)}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Custom Greeting Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Custom Greeting Message</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-slate-50/50 hover:bg-white min-h-[100px]"
              placeholder="I'm Emma, your virtual ordering assistant. What delicious meal can I help you with today?"
              defaultValue="I'm Emma, your virtual ordering assistant. What delicious meal can I help you with today?"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assistant Personality */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">Assistant Personality</h4>
              <p className="text-sm text-slate-500">Configure how your assistant interacts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Response Style</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-white shadow-sm appearance-none cursor-pointer">
                <option>Friendly</option>
                <option selected>Professional</option>
                <option>Humorous</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <Languages size={14} /> Primary Language
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-white shadow-sm appearance-none cursor-pointer">
                <option selected>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Phrases */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">Custom Phrases</h4>
              <p className="text-sm text-slate-500">Personalize your assistant’s responses</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Order Complete Message</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-slate-50/50 hover:bg-white text-sm min-h-[80px]"
                placeholder="Perfect! Your order is confirmed and will be ready shortly."
                defaultValue="Perfect! Your order is confirmed and will be ready shortly. Can I get your name please?"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Upsell Suggestion</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-slate-50/50 hover:bg-white text-sm min-h-[80px]"
                placeholder="Would you like to make it a combo meal?"
                defaultValue="Would you like to make it a combo meal?"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantTab;
