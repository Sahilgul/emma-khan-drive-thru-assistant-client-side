import React, { useState } from "react";
import { Trash2, FileEditIcon, PlusCircle, AlertTriangle, ImagePlusIcon, X, Tags } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Tags size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">Menu Categories</h4>
              <p className="text-sm text-slate-500">Organize your menu items into categories</p>
            </div>
          </div>
          <button
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95 text-sm"
            onClick={addCategory}
          >
            <PlusCircle size={18} /> Add New Category
          </button>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-2xl">
          <table className="w-full text-left bg-white">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Category Name</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg text-xl">{cat.icon}</span>
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        onClick={() => editCategory(cat.id)}
                        title="Edit category"
                      >
                        <FileEditIcon size={18} />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => setConfirmDelete(cat.id)}
                        title="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">
              No categories found. Click "Add New Category" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Add New Category</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-500 mb-8">Upload image and set a name for your new category.</p>

            {/* Upload Section */}
            <div className="mb-8">
              {!previewImage ? (
                <label htmlFor="imageUpload" className="block border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ImagePlusIcon size={32} />
                  </div>
                  <span className="block text-lg font-bold text-slate-700 mb-1">Upload image</span>
                  <span className="text-sm text-slate-400">PNG, JPG up to 2MB. Recommended: 256x256px</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </label>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 group">
                  <img src={previewImage} alt="Preview" className="w-full h-48 object-contain" />
                  <button
                    type="button"
                    className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => setPreviewImage(null)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Category Name */}
            <div className="space-y-2 mb-8">
              <label className="text-sm font-semibold text-slate-700 ml-1">Category Name</label>
              <input
                type="text"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-slate-50/50 hover:bg-white"
                placeholder="E.g, Burger, Pizza"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4">
              <button
                className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-95"
                onClick={saveCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Category?</h3>
            <p className="text-slate-500 mb-8">This action cannot be undone. Are you sure you want to delete this category?</p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
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
