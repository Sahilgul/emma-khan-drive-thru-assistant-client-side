// CategoryTab.tsx
import React, { useState } from "react";
import { Trash2, FileEditIcon, PlusCircle, AlertTriangle, ImagePlusIcon } from "lucide-react";
import "./Settings.css";

const CategoryTab = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Burger", icon: "🍔" },
    { id: 2, name: "Wraps", icon: "🌯" },
    { id: 3, name: "Fries", icon: "🍟" },
    { id: 4, name: "Coffee", icon: "☕" },
    { id: 5, name: "Dessert", icon: "🍫" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addCategory = () => {
    setShowModal(true);
    setNewCategory({ name: "", image: "" });
    setPreviewImage(null);
  };

  const saveCategory = () => {
    if (!newCategory.name) {
      alert("Please enter a category name.");
      return;
    }
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategory.name,
        icon: "🆕",
      },
    ]);
    setShowModal(false);
  };

  const editCategory = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setShowModal(true);
    setNewCategory({ name: cat.name, image: "" });
  };

  const handleDeleteConfirmed = () => {
    if (confirmDelete !== null) {
      setCategories(categories.filter((cat) => cat.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="tab-content category-tab">
      <div className="card">
        <div className="category-header">
          <div>
            <h4>Menu Categories</h4>
            <p>Organize your menu items into categories for better navigation</p>
          </div>
          <button className="add-btn" onClick={addCategory}>
            <PlusCircle size={16} /> Add New Category
          </button>
        </div>

        <div className="category-body">
          <h5>Category Management</h5>
          <p>Create and manage menu categories</p>

          <div className="category-table-wrapper">
            <table className="category-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span className="cat-icon">{cat.icon}</span> {cat.name}
                    </td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => editCategory(cat.id)}
                      >
                        <FileEditIcon size={20} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => setConfirmDelete(cat.id)} // just opens modal
                      >
                        <Trash2 size={20} />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="modal-overlay model-category">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Add New Category</h3>
            </div>
            <p>Upload image and set a name for your new category.</p>

            {/* Upload Section */}
            <div className="upload-box">
              {!previewImage ? (
                <label htmlFor="imageUpload" className="upload-label">
                  <div className="upload-content">
                    <ImagePlusIcon className="upload-img" size={64} />
                    <span className="upload-text">Upload image</span>
                    <span className="img-desc">
                      PNG, JPG up to 2MB. Recommended: 256x256px
                    </span>
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </label>
              ) : (
                <div className="image-preview">
                  <img src={previewImage} alt="Preview" />
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => setPreviewImage(null)}
                  >
                    Remove
                  </button>
                </div>

              )}
            </div>


            {/* Category Name */}
            <label className="form-label mt-3">Category Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="E.g, Burger, Pizza"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />

            {/* Modal Actions */}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={saveCategory}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
            <AlertTriangle className="text-red-500 mx-auto mb-3" size={36} />
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this category?
            </h3>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryTab;
