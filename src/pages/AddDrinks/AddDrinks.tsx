import React, { useState } from "react";
import { FileEdit, ImagePlus, PlusCircle, Trash2, Loader, SaveIcon } from "lucide-react";
import { uploadImage, createDrink } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";


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
    <div className="p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Drinks Menu</h1>
          <p className="text-slate-500 mt-1">Manage beverages, sizes, and pricing</p>
        </div>
        <button
          className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:text-teal-600 hover:border-teal-200 rounded-xl font-medium transition-colors shadow-sm"
          onClick={handleEdit}
        >
          Edit Mode
        </button>
      </div>

      <div className="space-y-6">
        {drinks.map((drink, index) => (
          <div key={drink.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-bold text-slate-700 mb-3 ml-1">Add Drink #{index + 1}</h2>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                {/* Upload Icon */}
                <div className="md:col-span-3 lg:col-span-2">
                  <label className="text-sm font-semibold text-slate-500 mb-2 block">Icon</label>
                  <label htmlFor={`upload-${drink.id}`} className="flex flex-col items-center justify-center aspect-square bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer transition-all overflow-hidden relative group/upload">
                    {drink.icon ? (
                      <>
                        <img src={drink.icon} alt="icon" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                          <FileEdit className="text-white" size={24} />
                        </div>
                        {uploading === drink.id && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <Loader className="animate-spin text-teal-600" size={24} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 text-center">
                        {uploading === drink.id ? (
                          <Loader className="animate-spin text-teal-600" size={32} />
                        ) : (
                          <ImagePlus className="text-slate-400 group-hover/upload:text-teal-600 transition-colors" size={32} />
                        )}
                        <span className="text-xs font-semibold text-slate-400 group-hover/upload:text-teal-600 transition-colors">
                          {uploading === drink.id ? "Uploading..." : "Upload Icon"}
                        </span>
                      </div>
                    )}
                    <input
                      id={`upload-${drink.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleIconUpload(drink.id, e.target.files?.[0] || null)}
                      disabled={uploading === drink.id}
                    />
                  </label>
                </div>

                {/* Details */}
                <div className="md:col-span-9 lg:col-span-10 space-y-6">

                  {/* Name Input */}
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-2 block">Name</label>
                    <input
                      type="text"
                      placeholder="Enter drink name..."
                      value={drink.name}
                      onChange={(e) => handleChange(drink.id, "name", e.target.value)}
                      className="w-full max-w-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
                    />
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                    <label className="text-sm font-semibold text-slate-500 mb-3 block">Sizes & Prices</label>
                    <div className="space-y-3">
                      {drink.options.map((opt, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative group/row">
                          <div className="flex-[2] min-w-[150px]">
                            <label className="text-xs font-semibold text-slate-400 mb-1 block">Size</label>
                            <div className="relative">
                              <select
                                value={opt.size}
                                onChange={(e) => handleOptionChange(drink.id, i, "size", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 outline-none transition-all text-sm font-medium appearance-none"
                              >
                                <option value="S">Small</option>
                                <option value="M">Medium</option>
                                <option value="L">Large</option>
                                <option value="XL">Extra Large</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex-[3] min-w-[150px]">
                            <label className="text-xs font-semibold text-slate-400 mb-1 block">Price ($)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                              <input
                                type="number"
                                placeholder="0.00"
                                value={opt.price}
                                onChange={(e) => handleOptionChange(drink.id, i, "price", e.target.value)}
                                className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 outline-none transition-all text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div className="flex items-end gap-2 pt-5">
                            <button
                              className="p-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                              onClick={() => handleAddOption(drink.id)}
                              title="Add another size"
                            >
                              <PlusCircle size={18} />
                            </button>
                            {drink.options.length > 1 && (
                              <button
                                type="button"
                                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={() => handleRemoveOption(drink.id, i)}
                                title="Remove option"
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
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-50">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl font-medium transition-colors"
                  onClick={handleAddDrink}
                >
                  <PlusCircle size={18} /> Add Another Drink
                </button>

                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors disabled:opacity-50"
                    onClick={() => handleDeleteDrink(drink.id)}
                    disabled={saving === drink.id}
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                  <button
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                    onClick={() => handleSave(drink.id)}
                    disabled={saving === drink.id || uploading === drink.id}
                  >
                    {saving === drink.id ? (
                      <>
                        <Loader className="animate-spin" size={18} /> Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon size={18} /> Save Drink
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

export default AddDrinks;
