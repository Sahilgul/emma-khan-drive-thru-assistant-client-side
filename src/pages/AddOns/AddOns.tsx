import React, { useState } from "react";
import "./AddOns.css";
import { Trash2, PlusCircle, FileEdit, Loader, SaveIcon } from "lucide-react";
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
    <div className="addaddons-container">
      {/* Header Section */}
      <div className="addaddons-header">
        <div className="header-left">
          <h1>Add Add On's</h1>
          <button className="edit-btn" onClick={handleEdit}>
            <FileEdit size={24} />
          </button>
        </div>
        <button className="apply-btn">Apply Changes</button>
      </div>

      {/* Add-ons Section */}
      {addons.map((addon, index) => (
        <div key={addon.id} className="addon-wrapper">
          <h2>Add On #{index + 1}</h2>

          <div className="addon-card">
            <div className="addon-row">
              <div className="addon-field">
                <label>Icon</label>
                <select
                  value={addon.icon}
                  className="selectIcon"
                  onChange={(e) =>
                    handleChange(addon.id, "icon", e.target.value)
                  }
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

              <div className="addon-field">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Add Add On's here..."
                  value={addon.name}
                  onChange={(e) =>
                    handleChange(addon.id, "name", e.target.value)
                  }
                />
              </div>

              <div className="addon-field">
                <label>Price</label>
                <input
                  type="number"
                  placeholder="$"
                  value={addon.price}
                  onChange={(e) =>
                    handleChange(addon.id, "price", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-row">
            <button className="addmore-btn" onClick={handleAddMore}>
              <PlusCircle size={18} />
              Add More
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(addon.id)}
              disabled={saving === addon.id}
            >
              <Trash2 size={18} />
              Delete
            </button>
            <button
              className="save-btn"
              onClick={() => handleSave(addon.id)}
              disabled={saving === addon.id}
            >
              {saving === addon.id ? (
                <>
                  <Loader className="animate-spin" size={18} /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon size={18} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddOns;
