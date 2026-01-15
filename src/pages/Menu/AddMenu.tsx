import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlusIcon, SaveIcon, Trash, Loader } from "lucide-react";
import { uploadImage, createMenuItem } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";
import "./AddMenu.css";

const AddMenu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    imageUrl: "", // Cloud storage URL
  });

  const categories = ["Burger", "Wraps", "Fries", "Coffee", "Dessert"];

  // Reset combo details when category is not Burger
  useEffect(() => {
    if (formData.category !== "Burger") {
      setFormData((prev) => ({
        ...prev,
        makeCombo: "No",
        comboDetails: "",
        comboPrice: "",
      }));
    }
  }, [formData.category]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({
          ...prev,
          image: file,
          previewUrl: reader.result as string,
        }));
      reader.readAsDataURL(file);

      // Upload to cloud storage
      setIsUploading(true);
      try {
        const response = await uploadImage(file, "menu");
        setFormData((prev) => ({ ...prev, imageUrl: response.url }));
        showSuccess("Image uploaded successfully!");
      } catch (error) {
        showError("Failed to upload image. Please try again.");
        console.error("Image upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showError("Please enter a menu item name");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showError("Please enter a valid price");
      return;
    }
    if (!formData.imageUrl) {
      showError("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const isBurger = formData.category === "Burger";
      const menuItemData: any = {
        category: formData.category,
        name: formData.name,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients,
        imageUrl: formData.imageUrl,
        available: true,
      };

      if (isBurger) {
        menuItemData.makeCombo = formData.makeCombo === "Yes";
        menuItemData.comboDetails = formData.makeCombo === "Yes" ? formData.comboDetails : "";
        menuItemData.comboPrice = formData.makeCombo === "Yes" && formData.comboPrice
          ? parseFloat(formData.comboPrice)
          : undefined;
      }

      if (!user?.userId) {
        showError("Please log in to create menu items");
        return;
      }

      await createMenuItem(user.userId, menuItemData);
      showSuccess("Menu item created successfully!");
      navigate("/menu/categories");
    } catch (error) {
      showError("Failed to create menu item. Please try again.");
      console.error("Create menu item error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => setShowDeletePopup(true);
  const confirmDelete = () => {
    console.log("Deleted successfully");
    setShowDeletePopup(false);
    navigate("/menu/categories");
  };
  const cancelDelete = () => setShowDeletePopup(false);

  return (
    <div className="addmenu-container">
      {/* Header */}
      <div className="menu-header">
        <h1 className="menu-title">Add Menu</h1>
      </div>

      {/* Category */}
      <div className="category-wrapper">
        <label htmlFor="category">Select Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Main Card */}
      <div className="addmenu-card">
        <form onSubmit={handleSubmit}>
          <div className="grid">
            {/* Upload Box */}
            <div className="border-dashed upload-box">
              {formData.previewUrl ? (
                <div className="image-preview">
                  <img src={formData.previewUrl} alt="Preview" className="preview-img" />
                  {isUploading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <Loader className="animate-spin" size={32} />
                    </div>
                  )}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => setFormData((prev) => ({ ...prev, image: null, previewUrl: "", imageUrl: "" }))}
                    disabled={isUploading}
                  >
                    X
                  </button>
                </div>
              ) : (
                <>
                  <ImagePlusIcon size={40} className="upload-icon" />
                  <p className="upload-text">{isUploading ? "Uploading..." : "Upload Image"}</p>
                  <p className="image-desc">
                    Recommended size: 800x800 px. Supported formats: JPG, PNG. Max size: 5MB.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    id="image-upload"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label htmlFor="image-upload" className="choose-file-btn">
                    {isUploading ? <Loader className="animate-spin" size={16} /> : "Choose File"}
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
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label htmlFor="ingredients">
                  {`What’s Included In ${formData.category}`}
                </label>

                <input
                  type="text"
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Add Ingredients here...."
                />
              </div>
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
                    <span className={`radio-label ${formData.makeCombo === "Yes" ? "active" : ""}`}>Yes</span>
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
                    <span className={`radio-label ${formData.makeCombo === "No" ? "active" : ""}`}>No</span>
                  </label>
                </div>
              )}

              {/* Combo Section (only for Burger and if Make Combo is Yes) */}
              {formData.category === "Burger" && formData.makeCombo === "Yes" && (
                <div className="combo-fields">
                  <div>
                    <label htmlFor="comboDetails">{`What’s Included In ${formData.category} Combo?`}</label>
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
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </form>
      </div>
      {/* Buttons */}
      <div className="flex justify-end">
        <button type="button" className="delete-btn" onClick={handleDelete} disabled={isSubmitting}>
          <Trash size={20} /> Delete
        </button>
        <button
          type="submit"
          className="save-btn"
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
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

export default AddMenu;
