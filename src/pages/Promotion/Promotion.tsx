import React, { useState } from "react";
import {
  Trash2,
  PlusCircle,
  FileEditIcon,
  AlertTriangle,
  ImagePlusIcon,
} from "lucide-react";
import "./Promotion.css";

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
    <div className="promotion-card">
      <div className="promotion-image">
        <img src={promo.image} alt={promo.title} />
      </div>

      <div className="promotion-footer">
        <h3 className="promotion-title">{promo.title}</h3>

        <div className="promotion-right">
          {/* Toggle Active */}
          <div className="toggle-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={promo.active}
                onChange={onToggle}
              />
              <span className="slider round"></span>
            </label>
            <span className={`status ${promo.active ? "active" : "inactive"}`}>
              {promo.active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Edit / Delete */}
          <div className="action-buttons">
            <button onClick={onEdit} className="btn-edit">
              <FileEditIcon size={16} />
            </button>
            <button onClick={onDelete} className="btn-delete">
              <Trash2 size={16} />
              Delete
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
      title: "Promo 1",
      description: "Beef Burger Combo $12",
      image: "/images/midnight-burger.png",
      active: true,
      cardType: "header",
      screen: 1,
    },
    {
      title: "Promo 1",
      description: "Combo $10",
      image: "/images/mexican-wrap.png",
      active: true,
      cardType: "footer",
      screen: 1,
    },
    {
      title: "Promo 1",
      description: "Delicious $14",
      image: "/images/burgers.jpg",
      active: true,
      cardType: "header",
      screen: 2,
    },
    {
      title: "Promo 1",
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
    <div className="promotion-container">
      {/* Header Section */}
      <div className="promotion-header">
        <div>
          <h1 className="promotion-title-main">Promotion Management</h1>
          <p className="promotion-subtitle">
            Create and manage deals, discounts, and special offers
          </p>
        </div>

        <button className="btn-add" onClick={() => setShowModal(true)}>
          <PlusCircle className="w-4 h-4" /> Add New Promotion
        </button>
      </div>

      {/* Screen Selector */}
      <div className="promotion-dropdown">
        <label>Choose Screen:</label>
        <select
          value={screen}
          onChange={(e) => setScreen(Number(e.target.value))}
          className="screen-select"
        >
          <option value={1}>Screen 1</option>
          <option value={2}>Screen 2</option>
        </select>
      </div>

      {/* Header Cards */}
      <h2 className="section-heading">Header Card</h2>
      <div className="promotion-grid">
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
      </div>

      {/* Middle Cards */}
      {screen === 2 && (
        <>
          <h2 className="section-heading">Middle Card</h2>
          <div className="promotion-grid">
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
          </div>
        </>
      )}

      {/* Footer Cards */}
      {screen === 1 && (
        <>
          <h2 className="section-heading">Footer Card</h2>
          <div className="promotion-grid">
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
          </div>
        </>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay model-promotion">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Create New Promotion</h3>
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
              className="modal-form"
            >
              <label>Choose Card</label>
              <select name="cardType" required>
                <option value="header">Header</option>
                <option value="middle">Middle</option>
                <option value="footer">Footer</option>
              </select>

              <label>Upload Image</label>
              <div className="upload-box">
                {!previewImage ? (
                <label htmlFor="imageUpload" className="upload-label">
                    <div className="upload-content">
                    <ImagePlusIcon className="upload-img" size={64} />
                    <span className="upload-text">Upload image</span>
                    <span className="img-desc">
                        Upload a promotional image to showcase special offers, discounts, or new menu items.
                        <br />
                        For best results, use the recommended size: 1040 × 320 px.
                        <br />
                        Supported formats: JPG, PNG. Max size: 5 MB.
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

              <label>Category Name</label>
              <input name="title" placeholder="E.g, Burger, Pizza" required />

              <div className="modal-actions">
                <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>
                <button type="submit" className="btn-save">
                    Add
                </button>
                </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
            <AlertTriangle className="text-red-500 mx-auto mb-3" size={36} />
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this promotion?
            </h3>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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

export default Promotion;
