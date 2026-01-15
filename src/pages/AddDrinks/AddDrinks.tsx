import React, { useState } from "react";
import { FileEdit, ImagePlus, PlusCircle, Trash2, Loader, SaveIcon } from "lucide-react";
import { uploadImage, createDrink } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";
import "./AddDrinks.css";

interface Drink {
  id: number;
  name: string;
  icon: string | null;
  iconUrl: string; // Cloud storage URL
  options: { size: string; price: string }[];
}

const AddDrinks: React.FC = () => {
  const { user } = useAuth();
  const [drinks, setDrinks] = useState<Drink[]>([
    { id: Date.now(), name: "", icon: null, iconUrl: "", options: [{ size: "S", price: "" }] },
  ]);
  const [uploading, setUploading] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  const handleChange = (id: number, field: keyof Drink, value: any) => {
    setDrinks((prev) =>
      prev.map((drink) => (drink.id === id ? { ...drink, [field]: value } : drink))
    );
  };

  const handleOptionChange = (
    drinkId: number,
    index: number,
    field: "size" | "price",
    value: any
  ) => {
    setDrinks((prev) =>
      prev.map((drink) =>
        drink.id === drinkId
          ? {
            ...drink,
            options: drink.options.map((opt, i) =>
              i === index ? { ...opt, [field]: value } : opt
            ),
          }
          : drink
      )
    );
  };

  const handleAddOption = (id: number) => {
    setDrinks((prev) =>
      prev.map((drink) =>
        drink.id === id
          ? { ...drink, options: [...drink.options, { size: "S", price: "" }] }
          : drink
      )
    );
  };

  const handleRemoveOption = (drinkId: number, index: number) => {
    setDrinks((prev) =>
      prev.map((drink) =>
        drink.id === drinkId
          ? { ...drink, options: drink.options.filter((_, i) => i !== index) }
          : drink
      )
    );
  };

  const handleAddDrink = () => {
    setDrinks((prev) => [
      ...prev,
      { id: Date.now(), name: "", icon: null, iconUrl: "", options: [{ size: "S", price: "" }] },
    ]);
  };

  const handleDeleteDrink = (id: number) => {
    setDrinks((prev) => prev.filter((drink) => drink.id !== id));
  };

  const handleIconUpload = async (id: number, file: File | null) => {
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setDrinks((prev) =>
        prev.map((drink) =>
          drink.id === id ? { ...drink, icon: reader.result as string } : drink
        )
      );
    };
    reader.readAsDataURL(file);

    // Upload to cloud storage
    setUploading(id);
    try {
      const response = await uploadImage(file, "drinks");
      setDrinks((prev) =>
        prev.map((drink) =>
          drink.id === id ? { ...drink, iconUrl: response.url } : drink
        )
      );
      showSuccess("Icon uploaded successfully!");
    } catch (error) {
      showError("Failed to upload icon. Please try again.");
      console.error("Icon upload error:", error);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (drinkId: number) => {
    const drink = drinks.find((d) => d.id === drinkId);
    if (!drink) return;

    // Validation
    if (!drink.name.trim()) {
      showError("Please enter a drink name");
      return;
    }
    if (!drink.iconUrl) {
      showError("Please upload an icon");
      return;
    }
    if (drink.options.some((opt) => !opt.price || parseFloat(opt.price) <= 0)) {
      showError("Please enter valid prices for all options");
      return;
    }

    setSaving(drinkId);
    try {
      const drinkData = {
        name: drink.name,
        iconUrl: drink.iconUrl,
        options: drink.options.map((opt) => ({
          size: opt.size,
          price: parseFloat(opt.price),
        })),
        available: true,
      };

      if (!user?.userId) {
        showError("Please log in to create drinks");
        return;
      }

      await createDrink(user.userId, drinkData);
      showSuccess(`${drink.name} created successfully!`);

      // Remove the saved drink from the list
      setDrinks((prev) => prev.filter((d) => d.id !== drinkId));

      // If no drinks left, add a new empty one
      if (drinks.length === 1) {
        setDrinks([{ id: Date.now(), name: "", icon: null, iconUrl: "", options: [{ size: "S", price: "" }] }]);
      }
    } catch (error) {
      showError("Failed to create drink. Please try again.");
      console.error("Create drink error:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleEdit = () => alert("Edit mode activated!");

  return (
    <div className="adddrinks-container">
      <div className="adddrinks-header">
        <div className="header-left">
          <h1>Add Drinks</h1>
          <button className="edit-btn" onClick={handleEdit}>
            <FileEdit size={24} />
          </button>
        </div>
      </div>

      {drinks.map((drink, index) => (
        <div key={drink.id} className="drink-wrapper">
          <h2>Add Drink #{index + 1}</h2>
          <div className="drink-card">
            <div className="drink-row">
              {/* Upload Icon */}
              <label htmlFor={`upload-${drink.id}`} className="upload-icon">
                {drink.icon ? (
                  <>
                    <img src={drink.icon} alt="icon" />
                    {uploading === drink.id && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Loader className="animate-spin" size={24} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {uploading === drink.id ? (
                      <Loader className="animate-spin" size={36} />
                    ) : (
                      <ImagePlus size={36} className="upload-placeholder" />
                    )}
                    <span>{uploading === drink.id ? "Uploading..." : "Upload Icon"}</span>
                  </>
                )}
                <input
                  id={`upload-${drink.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleIconUpload(drink.id, e.target.files?.[0] || null)
                  }
                  disabled={uploading === drink.id}
                />
              </label>

              {/* Drink Details */}
              <div className="drink-fields">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Add drink name..."
                    value={drink.name}
                    onChange={(e) =>
                      handleChange(drink.id, "name", e.target.value)
                    }
                  />
                </div>

                {/* Options */}
                {drink.options.map((opt, i) => (
                  <div key={i} className="option-row">
                    <div className="select-group small">
                      <label>Size</label>
                      <select
                        className="select-size"
                        value={opt.size}
                        onChange={(e) =>
                          handleOptionChange(drink.id, i, "size", e.target.value)
                        }
                      >
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">Extra Large</option>
                      </select>
                    </div>

                    <div className="input-group small">
                      <label>Price</label>
                      <input
                        type="number"
                        placeholder="$"
                        value={opt.price}
                        onChange={(e) =>
                          handleOptionChange(drink.id, i, "price", e.target.value)
                        }
                      />
                    </div>

                    <div className="option-actions">
                      <button
                        className="addMore-btn"
                        onClick={() => handleAddOption(drink.id)}
                      >
                        <PlusCircle size={20} /> Add More
                      </button>
                      {drink.options.length > 1 && (
                        <button
                          type="button"
                          aria-label="Remove option"
                          className="removeRow-btn"
                          onClick={() => handleRemoveOption(drink.id, i)}
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="action-row">
            <button className="addMore-btn" onClick={handleAddDrink}>
              <PlusCircle size={16} /> Add More
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDeleteDrink(drink.id)}
              disabled={saving === drink.id}
            >
              <Trash2 size={16} /> Delete
            </button>
            <button
              className="save-btn"
              onClick={() => handleSave(drink.id)}
              disabled={saving === drink.id || uploading === drink.id}
            >
              {saving === drink.id ? (
                <>
                  <Loader className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon size={16} /> Save
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddDrinks;
