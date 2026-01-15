import React, { useState } from "react";
import { PlusCircle, Trash2, ImagePlus, FileEdit, Loader, SaveIcon } from "lucide-react";
import { uploadImage, createSide } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";
import "./AddSides.css";

interface Option {
  pcs: number;
  price: string;
}

interface Side {
  id: number;
  name: string;
  icon: string | null;
  iconUrl: string; // Cloud storage URL
  options: Option[];
}

const AddSides: React.FC = () => {
  const { user } = useAuth();
  const [sides, setSides] = useState<Side[]>([
    { id: Date.now(), name: "", icon: null, iconUrl: "", options: [{ pcs: 6, price: "" }] },
  ]);
  const [uploading, setUploading] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  const handleChange = (id: number, field: keyof Side, value: any) => {
    setSides((prev) =>
      prev.map((side) => (side.id === id ? { ...side, [field]: value } : side))
    );
  };

  const handleOptionChange = (
    sideId: number,
    index: number,
    field: keyof Option,
    value: any
  ) => {
    setSides((prev) =>
      prev.map((side) =>
        side.id === sideId
          ? {
            ...side,
            options: side.options.map((opt, i) =>
              i === index ? { ...opt, [field]: value } : opt
            ),
          }
          : side
      )
    );
  };

  const handleAddOption = (id: number) => {
    setSides((prev) =>
      prev.map((side) =>
        side.id === id
          ? { ...side, options: [...side.options, { pcs: 6, price: "" }] }
          : side
      )
    );
  };

  const handleRemoveOption = (sideId: number, index: number) => {
    setSides((prev) =>
      prev.map((side) =>
        side.id === sideId
          ? { ...side, options: side.options.filter((_, i) => i !== index) }
          : side
      )
    );
  };

  const handleAddSide = () => {
    setSides((prev) => [
      ...prev,
      { id: Date.now(), name: "", icon: null, iconUrl: "", options: [{ pcs: 6, price: "" }] },
    ]);
  };

  const handleDeleteSide = (id: number) => {
    setSides((prev) => prev.filter((side) => side.id !== id));
  };

  const handleIconUpload = async (id: number, file: File | null) => {
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setSides((prev) =>
        prev.map((side) =>
          side.id === id ? { ...side, icon: reader.result as string } : side
        )
      );
    };
    reader.readAsDataURL(file);

    // Upload to cloud storage
    setUploading(id);
    try {
      const response = await uploadImage(file, "sides");
      setSides((prev) =>
        prev.map((side) =>
          side.id === id ? { ...side, iconUrl: response.url } : side
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

  const handleSave = async (sideId: number) => {
    const side = sides.find((s) => s.id === sideId);
    if (!side) return;

    // Validation
    if (!side.name.trim()) {
      showError("Please enter a side name");
      return;
    }
    if (!side.iconUrl) {
      showError("Please upload an icon");
      return;
    }
    if (side.options.some((opt) => !opt.price || parseFloat(opt.price) <= 0)) {
      showError("Please enter valid prices for all options");
      return;
    }

    setSaving(sideId);
    try {
      const sideData = {
        name: side.name,
        iconUrl: side.iconUrl,
        options: side.options.map((opt) => ({
          pcs: opt.pcs,
          price: parseFloat(opt.price),
        })),
        available: true,
      };

      if (!user?.userId) {
        showError("Please log in to create sides");
        return;
      }

      await createSide(user.userId, sideData);
      showSuccess(`${side.name} created successfully!`);

      // Remove the saved side from the list
      setSides((prev) => prev.filter((s) => s.id !== sideId));

      // If no sides left, add a new empty one
      if (sides.length === 1) {
        setSides([{ id: Date.now(), name: "", icon: null, iconUrl: "", options: [{ pcs: 6, price: "" }] }]);
      }
    } catch (error) {
      showError("Failed to create side. Please try again.");
      console.error("Create side error:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleEdit = () => alert("Edit mode activated!");

  return (
    <div className="addSides-container">
      <div className="addSides-header">
        <div className="header-left">
          <h1>Add Sides</h1>
          <button className="edit-btn" onClick={handleEdit}>
            <FileEdit size={24} />
          </button>
        </div>
      </div>

      {sides.map((side, index) => (
        <div key={side.id} className="side-wrapper">
          <h2>Add Side #{index + 1}</h2>

          <div className="side-card">
            <div className="side-row">
              {/* Upload Icon */}
              <label htmlFor={`upload-${side.id}`} className="upload-icon">
                {side.icon ? (
                  <>
                    <img src={side.icon} alt="icon" />
                    {uploading === side.id && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Loader className="animate-spin" size={24} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {uploading === side.id ? (
                      <Loader className="animate-spin" size={36} />
                    ) : (
                      <ImagePlus size={36} className="upload-placeholder" />
                    )}
                    <span>{uploading === side.id ? "Uploading..." : "Upload Icon"}</span>
                  </>
                )}
                <input
                  id={`upload-${side.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleIconUpload(side.id, e.target.files?.[0] || null)
                  }
                  disabled={uploading === side.id}
                />
              </label>

              {/* Name + Options */}
              <div className="side-fields">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Add Sides name here..."
                    value={side.name}
                    onChange={(e) =>
                      handleChange(side.id, "name", e.target.value)
                    }
                  />
                </div>

                {side.options.map((opt, i) => (
                  <div key={i} className="option-row">
                    <div className="input-group small">
                      <label>PCS</label>
                      <input
                        type="number"
                        min="1"
                        value={opt.pcs}
                        onChange={(e) =>
                          handleOptionChange(
                            side.id,
                            i,
                            "pcs",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="input-group small">
                      <label>Price</label>
                      <input
                        type="number"
                        placeholder="$"
                        value={opt.price}
                        onChange={(e) =>
                          handleOptionChange(side.id, i, "price", e.target.value)
                        }
                      />
                    </div>

                    <div className="option-actions">
                      <button
                        className="addMore-btn"
                        onClick={() => handleAddOption(side.id)}
                      >
                        <PlusCircle size={18} /> Add
                      </button>
                      {side.options.length > 1 && (
                        <button
                          type="button"
                          aria-label="Remove option"
                          className="removeRow-btn"
                          onClick={() => handleRemoveOption(side.id, i)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-row">
            <button className="addMore-btn" onClick={handleAddSide}>
              <PlusCircle size={18} /> Add More
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDeleteSide(side.id)}
              disabled={saving === side.id}
            >
              <Trash2 size={18} /> Delete
            </button>
            <button
              className="save-btn"
              onClick={() => handleSave(side.id)}
              disabled={saving === side.id || uploading === side.id}
            >
              {saving === side.id ? (
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

export default AddSides;
