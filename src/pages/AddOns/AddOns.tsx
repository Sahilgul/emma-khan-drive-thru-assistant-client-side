import React, { useState } from "react";

import { Trash2, PlusCircle, Loader, SaveIcon } from "lucide-react";
import { createAddon } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";

interface AddOn {
  id: number;
  icon: string;
  name: string;
  price: string;
}

const AddOns: React.FC = () => {
  const { user } = useAuth();
  const [addons, setAddons] = useState<AddOn[]>([
    { id: 1, icon: "🧀", name: "", price: "" },
  ]);
  const [saving, setSaving] = useState<number | null>(null);

  const handleAddMore = () => {
    setAddons((prev) => [
      ...prev,
      { id: prev.length + 1, icon: "🧀", name: "", price: "" },
    ]);
  };

  const handleDelete = (id: number) => {
    setAddons((prev) => prev.filter((addon) => addon.id !== id));
  };

  const handleChange = (id: number, field: keyof AddOn, value: string) => {
    setAddons((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, [field]: value } : addon
      )
    );
  };

  const handleSave = async (addonId: number) => {
    const addon = addons.find((a) => a.id === addonId);
    if (!addon) return;

    // Validation
    if (!addon.name.trim()) {
      showError("Please enter an add-on name");
      return;
    }
    if (!addon.price || parseFloat(addon.price) <= 0) {
      showError("Please enter a valid price");
      return;
    }

    setSaving(addonId);
    try {
      const addonData = {
        name: addon.name,
        icon: addon.icon,
        price: parseFloat(addon.price),
        available: true,
      };

      if (!user?.userId) {
        showError("Please log in to create add-ons");
        return;
      }

      await createAddon(user.userId, addonData);
      showSuccess(`${addon.name} created successfully!`);

      // Remove the saved addon from the list
      setAddons((prev) => prev.filter((a) => a.id !== addonId));

      // If no addons left, add a new empty one
      if (addons.length === 1) {
        setAddons([{ id: Date.now(), icon: "🧀", name: "", price: "" }]);
      }
    } catch (error) {
      showError("Failed to create add-on. Please try again.");
      console.error("Create add-on error:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleEdit = () => {
    alert("Edit mode activated!");
  };

  return (
    <div className="p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Extra Add-ons</h1>
          <p className="text-slate-500 mt-1">Manage extra ingredients and toppings</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:text-teal-600 hover:border-teal-200 rounded-xl font-medium transition-colors shadow-sm"
          >
            Edit Mode
          </button>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="space-y-6">
        {addons.map((addon, index) => (
          <div key={addon.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-bold text-slate-700 mb-3 ml-1">Add On #{index + 1}</h2>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* Icon Selection */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-500 mb-2 block">Icon</label>
                  <div className="relative">
                    <select
                      value={addon.icon}
                      onChange={(e) => handleChange(addon.id, "icon", e.target.value)}
                      className="w-full h-14 text-2xl px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all appearance-none cursor-pointer text-center"
                    >
                      <option value="🧀">🧀</option>
                      <option value="🍟">🍟</option>
                      <option value="🥓">🥓</option>
                      <option value="🥤">🥤</option>
                      <option value="🍅">🍅</option>
                      <option value="🥬">🥬</option>
                      <option value="🧅">🧅</option>
                      <option value="🌶️">🌶️</option>
                    </select>
                  </div>
                </div>

                {/* Name Input */}
                <div className="md:col-span-6">
                  <label className="text-sm font-semibold text-slate-500 mb-2 block">Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Extra Cheese"
                    value={addon.name}
                    onChange={(e) => handleChange(addon.id, "name", e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Price Input */}
                <div className="md:col-span-4">
                  <label className="text-sm font-semibold text-slate-500 mb-2 block">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={addon.price}
                      onChange={(e) => handleChange(addon.id, "price", e.target.value)}
                      className="w-full h-14 pl-8 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-50">
                <button
                  onClick={handleAddMore}
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl font-medium transition-colors"
                >
                  <PlusCircle size={18} />
                  Add Another
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(addon.id)}
                    disabled={saving === addon.id}
                    className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>

                  <button
                    onClick={() => handleSave(addon.id)}
                    disabled={saving === addon.id}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {saving === addon.id ? (
                      <>
                        <Loader className="animate-spin" size={18} /> Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon size={18} /> Save Add-on
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOns;
