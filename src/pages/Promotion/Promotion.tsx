import React, { useState } from "react";
import {
  Trash2,
  PlusCircle,
  FileEditIcon,
  AlertTriangle,
  ImagePlusIcon,
  Tag
} from "lucide-react";

interface Promotion {
  title: string;
  description: string;
  image: string;
  active: boolean;
  cardType: "header" | "middle" | "footer";
  screen: number;
}

const PromotionCard: React.FC<{
  promo: Promotion;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
}> = ({ promo, onDelete, onEdit, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-40 w-full overflow-hidden relative bg-slate-100">
        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg border border-white/10 uppercase tracking-widest">
          {promo.cardType}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{promo.title}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-1">{promo.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          {/* Toggle Active */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={promo.active}
                onChange={onToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
            <span className={`text-xs font-semibold uppercase tracking-wider ${promo.active ? "text-teal-600" : "text-slate-400"}`}>
              {promo.active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Edit / Delete */}
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
              <FileEditIcon size={18} />
            </button>
            <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Promotion: React.FC = () => {
  const [screen, setScreen] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      title: "Midnight Burger",
      description: "Beef Burger Combo $12",
      image: "/images/midnight-burger.png",
      active: true,
      cardType: "header",
      screen: 1,
    },
    {
      title: "Mexican Wrap",
      description: "Combo $10",
      image: "/images/mexican-wrap.png",
      active: true,
      cardType: "footer",
      screen: 1,
    },
    {
      title: "Super Burgers",
      description: "Delicious $14",
      image: "/images/burgers.jpg",
      active: true,
      cardType: "header",
      screen: 2,
    },
    {
      title: "Chocolate Brownie",
      description: "Sweet Treat $6",
      image: "/images/brownie.png",
      active: true,
      cardType: "middle",
      screen: 2,
    },
  ]);

  // 🔄 Toggle Active
  const toggleActive = (index: number) => {
    setPromotions((prev) =>
      prev.map((promo, i) =>
        i === index ? { ...promo, active: !promo.active } : promo
      )
    );
  };

  // 🗑 Delete Confirmation
  const handleDeleteConfirm = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setPromotions((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setShowDeleteConfirm(false);
    }
  };

  // 🆕 Add Promotion
  const addPromotion = (newPromo: Promotion) => {
    setPromotions((prev) => [...prev, newPromo]);
  };

  // 🖼 Upload Image Preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // ✅ Reset file input so same file can be uploaded again later
    e.target.value = "";
  };

  // 🧠 Filter Promotions by Selected Screen
  const filteredPromotions = promotions.filter((p) => p.screen === screen);

  return (
    <div className="p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Promotion Management</h1>
          <p className="text-slate-500 mt-1">
            Create and manage deals, discounts, and special offers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          <PlusCircle size={18} /> Add New Promotion
        </button>
      </div>

      {/* Screen Selector */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">Choose Screen</label>
        <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[1, 2].map(num => (
            <button
              key={num}
              onClick={() => setScreen(num)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${screen === num
                  ? "bg-teal-50 text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              Screen {num}
            </button>
          ))}
        </div>
      </div>

      {/* Promotion Grids */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header Cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-teal-600" />
            <h2 className="text-lg font-bold text-slate-800">Header Promotions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPromotions
              .filter((p) => p.cardType === "header")
              .map((promo, index) => (
                <PromotionCard
                  key={index}
                  promo={promo}
                  onToggle={() => toggleActive(promotions.indexOf(promo))}
                  onEdit={() => console.log("Edit", promo.title)}
                  onDelete={() => handleDeleteConfirm(promotions.indexOf(promo))}
                />
              ))}
            {filteredPromotions.filter(p => p.cardType === "header").length === 0 && (
              <div className="col-span-full py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <p>No header promotions for Screen {screen}</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Cards */}
        {screen === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-purple-600" />
              <h2 className="text-lg font-bold text-slate-800">Middle Promotions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPromotions
                .filter((p) => p.cardType === "middle")
                .map((promo, index) => (
                  <PromotionCard
                    key={index}
                    promo={promo}
                    onToggle={() => toggleActive(promotions.indexOf(promo))}
                    onEdit={() => console.log("Edit", promo.title)}
                    onDelete={() =>
                      handleDeleteConfirm(promotions.indexOf(promo))
                    }
                  />
                ))}
              {filteredPromotions.filter(p => p.cardType === "middle").length === 0 && (
                <div className="col-span-full py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <p>No middle promotions for Screen {screen}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Cards */}
        {screen === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-amber-600" />
              <h2 className="text-lg font-bold text-slate-800">Footer Promotions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPromotions
                .filter((p) => p.cardType === "footer")
                .map((promo, index) => (
                  <PromotionCard
                    key={index}
                    promo={promo}
                    onToggle={() => toggleActive(promotions.indexOf(promo))}
                    onEdit={() => console.log("Edit", promo.title)}
                    onDelete={() =>
                      handleDeleteConfirm(promotions.indexOf(promo))
                    }
                  />
                ))}
              {filteredPromotions.filter(p => p.cardType === "footer").length === 0 && (
                <div className="col-span-full py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <p>No footer promotions for Screen {screen}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Create New Promotion</h3>
              <p className="text-slate-500 text-sm">Add a new deal for Screen {screen}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newPromo: Promotion = {
                  cardType: (
                    form.elements.namedItem("cardType") as HTMLSelectElement
                  ).value as Promotion["cardType"],
                  title: (form.elements.namedItem("title") as HTMLInputElement)
                    .value,
                  description: (
                    form.elements.namedItem("description") as HTMLInputElement
                  ).value,
                  image: previewImage || "/images/placeholder.png",
                  active: true,
                  screen: screen, // 👈 attaches to the selected screen
                };
                addPromotion(newPromo);
                setShowModal(false);
                setPreviewImage(null);
                form.reset();
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Card Position</label>
                <select name="cardType" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 bg-white">
                  <option value="header">Header</option>
                  <option value="middle">Middle</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Promotion Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                  {!previewImage ? (
                    <label htmlFor="imageUpload" className="cursor-pointer block py-4">
                      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <ImagePlusIcon size={24} />
                      </div>
                      <p className="text-slate-700 font-semibold mb-1">Click to Upload</p>
                      <span className="text-slate-400 text-xs block max-w-xs mx-auto">
                        Recommended: 1040 × 320 px. Max 5MB.
                      </span>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img src={previewImage} alt="Preview" className="h-32 w-full object-cover rounded-xl" />
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                        onClick={() => setPreviewImage(null)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
                  <input name="title" placeholder="e.g. Summer Deal" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 placeholder-slate-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                  <input name="description" placeholder="e.g. 50% Off Burgers" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-slate-700 placeholder-slate-400" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all">
                  Create Promotion
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Delete this promotion?
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              This action cannot be undone. Are you sure you want to continue?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotion;
