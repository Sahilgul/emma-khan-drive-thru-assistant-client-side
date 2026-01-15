import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlusIcon, SaveIcon, Trash, Loader, AlertCircle } from "lucide-react";
import { getMenuItems, updateMenuItem, deleteMenuItem, uploadImage } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";
import "./EditMenu.css";

const EditMenu: React.FC = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [formData, setFormData] = useState({
    category: "Burger",
    name: "",
    price: "",
    ingredients: "",
    makeCombo: "No",
    comboDetails: "",
    comboPrice: "",
    image: null as File | null,
    previewUrl: "",
  });

  // Fetch the menu item data on mount
  useEffect(() => {
    if (user?.userId && itemId) {
      fetchMenuItem();
    }
  }, [user?.userId, itemId]);

  const fetchMenuItem = async () => {
    if (!user?.userId || !itemId) {
      setError("Missing user or item information");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const items = await getMenuItems(user.userId);
      const item = items.find((i) => i.id === itemId);

      if (!item) {
        setError("Menu item not found");
        return;
      }

      console.log('📝 Loaded menu item for editing:', item);

      const isBurger = (item.category || "Burger") === "Burger";
      // Populate form with existing data
      setFormData({
        category: item.category || "Burger",
        name: item.name || "",
        price: item.price?.toString() || "",
        ingredients: item.ingredients || "",
        makeCombo: isBurger && item.makeCombo ? "Yes" : "No",
        comboDetails: isBurger ? (item.comboDetails || "") : "",
        comboPrice: isBurger ? (item.comboPrice?.toString() || "") : "",
        image: null,
        previewUrl: item.imageUrl || "",
      });
    } catch (err) {
      console.error("Error fetching menu item:", err);
      setError("Failed to load menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // If category changes and is not Burger, reset combo
      if (name === "category" && value !== "Burger") {
        newData.makeCombo = "No";
        newData.comboDetails = "";
        newData.comboPrice = "";
      }
      return newData;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, "menu");
      console.log('✅ Image uploaded:', imageUrl);
      setFormData((prev) => ({
        ...prev,
        previewUrl: imageUrl.url,
      }));
      showSuccess("Image uploaded successfully");
    } catch (err) {
      console.error("Error uploading image:", err);
      showError("Failed to upload image. Please try again.");
      // Revert preview on error
      setFormData((prev) => ({
        ...prev,
        image: null,
        previewUrl: prev.previewUrl,
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.userId || !itemId) {
      showError("Missing user or item information");
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      showError("Please enter a menu item name");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showError("Please enter a valid price");
      return;
    }
    if (!formData.previewUrl) {
      showError("Please upload an image");
      return;
    }

    setSaving(true);
    try {
      const isBurger = formData.category === "Burger";
      const updateData: any = {
        category: formData.category,
        name: formData.name,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients,
        imageUrl: formData.previewUrl,
        available: true,
      };

      if (isBurger) {
        updateData.makeCombo = formData.makeCombo === "Yes";
        updateData.comboDetails = formData.makeCombo === "Yes" ? formData.comboDetails : "";
        updateData.comboPrice = formData.makeCombo === "Yes" && formData.comboPrice
          ? parseFloat(formData.comboPrice)
          : undefined;
      }

      console.log('📤 Updating menu item:', updateData);
      await updateMenuItem(user.userId, itemId, updateData);

      showSuccess("Menu item updated successfully!");
      navigate("/menu/categories");
    } catch (err) {
      console.error("Error updating menu item:", err);
      showError("Failed to update menu item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => setShowDeletePopup(true);

  const confirmDelete = async () => {
    if (!user?.userId || !itemId) return;

    try {
      console.log('🗑️ Deleting menu item:', itemId);
      await deleteMenuItem(user.userId, itemId);
      showSuccess("Menu item deleted successfully!");
      setShowDeletePopup(false);
      navigate("/menu/categories");
    } catch (err) {
      console.error("Error deleting menu item:", err);
      showError("Failed to delete menu item. Please try again.");
    }
  };

  const cancelDelete = () => setShowDeletePopup(false);

  // Loading state
  if (loading) {
    return (
      <div className="editmenu-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader className="animate-spin" size={48} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="editmenu-container">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: '16px' }}>
          <AlertCircle size={48} color="#ff0000" />
          <p style={{ color: '#666', fontSize: '16px' }}>{error}</p>
          <button onClick={() => navigate("/menu/categories")} className="save-btn">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editmenu-container">
      {/* Header */}
      <div className="menu-header">
        <h1 className="menu-title">Edit Menu</h1>
      </div>

      {/* Main Card */}
      <div className="editmenu-card">
        <form onSubmit={handleSubmit}>
          <div className="grid">
            {/* Upload Box */}
            <div className="border-dashed upload-box">
              {formData.previewUrl ? (
                <div className="image-preview">
                  <img src={formData.previewUrl} alt="Preview" className="preview-img" />
                  {uploading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <Loader className="animate-spin" size={32} color="#fff" />
                    </div>
                  )}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: null, previewUrl: "" }))
                    }
                    disabled={uploading}
                  >
                    X
                  </button>
                </div>
              ) : (
                <>
                  <ImagePlusIcon size={40} className="upload-icon" />
                  <p className="upload-text">Upload Image</p>
                  <p className="image-desc">
                    Recommended size: 800x800 px. Supported formats: JPG, PNG. Max size: 5MB.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    id="image-upload"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="choose-file-btn">
                    {uploading ? "Uploading..." : "Choose File"}
                  </label>
                </>
              )}
            </div>

            {/* Form Inputs */}
            <div className="form-fields space-y-4">
              {/* Name + Price Row */}
              <div className="name-price-row">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`Add ${formData.category.toLowerCase()} name here...`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label>
                  <div className="price-input">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="$"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label htmlFor="ingredients">{`What's Included In ${formData.category}`}</label>
                <input
                  type="text"
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Add Ingredients here...."
                />
              </div>

              {/* Make Combo */}
              {formData.category === "Burger" && (
                <div className="combo-section">
                  <span>Make It Combo?</span>
                  <label className="combo-label">
                    <input
                      type="radio"
                      name="makeCombo"
                      value="Yes"
                      checked={formData.makeCombo === "Yes"}
                      onChange={handleInputChange}
                      className="custom-radio"
                    />
                    <span className={`radio-label ${formData.makeCombo === "Yes" ? "active" : ""}`}>
                      Yes
                    </span>
                  </label>
                  <label className="combo-label">
                    <input
                      type="radio"
                      name="makeCombo"
                      value="No"
                      checked={formData.makeCombo === "No"}
                      onChange={handleInputChange}
                      className="custom-radio"
                    />
                    <span className={`radio-label ${formData.makeCombo === "No" ? "active" : ""}`}>
                      No
                    </span>
                  </label>
                </div>
              )}

              {/* Combo Details */}
              {formData.category === "Burger" && formData.makeCombo === "Yes" && (
                <div className="combo-fields">
                  <div>
                    <label htmlFor="comboDetails">{`What's Included In ${formData.category} Combo?`}</label>
                    <input
                      type="text"
                      id="comboDetails"
                      name="comboDetails"
                      value={formData.comboDetails}
                      onChange={handleInputChange}
                      placeholder="Add Detail Here..."
                    />
                  </div>
                  <div>
                    <label htmlFor="comboPrice">Price</label>
                    <div className="price-input">
                      <input
                        type="number"
                        id="comboPrice"
                        name="comboPrice"
                        value={formData.comboPrice}
                        onChange={handleInputChange}
                        placeholder="$"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
              disabled={saving}
            >
              <Trash size={20} /> Delete
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <Loader className="animate-spin" size={20} /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon size={20} /> Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="popup-card">
            <h2>
              <span>⚠️</span> Are you sure you want to delete this Menu?
            </h2>
            <p className="delete-text">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-6">
              <button className="btnCancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                <Trash size={20} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMenu;