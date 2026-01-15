import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlusIcon, SaveIcon, Trash, Loader } from "lucide-react";
import { uploadImage, createMenuItem } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";


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
    <div className="p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">New Item</h1>
          <p className="text-slate-500 mt-1">Add a new dish to your menu</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-sm font-semibold text-slate-400 ml-2">Category:</span>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl outline-none border-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8 overflow-hidden relative">
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Upload Section */}
            <div className="lg:col-span-5 xl:col-span-4">
              <label className="text-sm font-bold text-slate-500 mb-3 block ml-1">Menu Image</label>
              <div className="relative aspect-square">
                {formData.previewUrl ? (
                  <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-slate-100 group relative">
                    <img src={formData.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="image-upload" className="cursor-pointer bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
                        <ImagePlusIcon size={18} /> Change Image
                      </label>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader className="animate-spin text-teal-600" size={32} />
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      onClick={() => setFormData((prev) => ({ ...prev, image: null, previewUrl: "", imageUrl: "" }))}
                      disabled={isUploading}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="w-full h-full border-2 border-dashed border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group overflow-hidden relative">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors shadow-sm">
                      {isUploading ? <Loader className="animate-spin" size={32} /> : <ImagePlusIcon size={32} />}
                    </div>
                    <div className="text-center px-6">
                      <p className="font-bold text-slate-700">{isUploading ? "Uploading Item..." : "Drop or Choose Image"}</p>
                      <p className="text-sm text-slate-400 mt-1">Recommended size: 800x800 px. Max 5MB.</p>
                    </div>

                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      id="image-upload"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label htmlFor="name" className="text-sm font-bold text-slate-500 mb-2 block ml-1">Item Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`E.g. Classic ${formData.category}`}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="text-sm font-bold text-slate-500 mb-2 block ml-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full h-14 pl-10 pr-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label htmlFor="ingredients" className="text-sm font-bold text-slate-500 mb-2 block ml-1">
                  What’s Included?
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  rows={2}
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="E.g. Beef patty, lettuce, tomato, special sauce..."
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium resize-none min-h-[100px]"
                />
              </div>

              {/* Combo Section for Burgers */}
              {formData.category === "Burger" && (
                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800">Make it a Combo?</h3>
                      <p className="text-sm text-slate-500">Provide options for a complete meal</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, makeCombo: option }))}
                          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${formData.makeCombo === option
                            ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.makeCombo === "Yes" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="md:col-span-2 lg:col-span-1">
                        <label htmlFor="comboDetails" className="text-xs font-bold text-slate-400 mb-1.5 block ml-1 uppercase tracking-wider">Combo Includes</label>
                        <input
                          type="text"
                          id="comboDetails"
                          name="comboDetails"
                          value={formData.comboDetails}
                          onChange={handleInputChange}
                          placeholder="Fries + Soft Drink"
                          className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all text-slate-800 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label htmlFor="comboPrice" className="text-xs font-bold text-slate-400 mb-1.5 block ml-1 uppercase tracking-wider">Combo Price ($)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            id="comboPrice"
                            name="comboPrice"
                            value={formData.comboPrice}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="w-full h-12 pl-8 pr-4 bg-white border border-slate-200 rounded-xl focus:border-teal-500 outline-none transition-all text-slate-800 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Persistent Footer Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-8">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-colors disabled:opacity-50"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          <Trash size={20} /> Discard Item
        </button>

        <button
          type="submit"
          className="flex items-center gap-3 px-10 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            <>
              <SaveIcon size={20} /> Save Menu Item
            </>
          )}
        </button>
      </div>

      {/* Refined Delete Modal */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={cancelDelete} />
          <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Discard Changes?</h2>
            <p className="text-slate-500 mb-8 px-4">Are you sure you want to delete this unfinished menu item? This action cannot be undone.</p>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="w-full py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                onClick={cancelDelete}
              >
                No, Keep it
              </button>
              <button
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
                onClick={confirmDelete}
              >
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMenu;
