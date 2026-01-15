import { useState, useEffect } from "react";
import { Plus, Edit, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMenuItems, updateMenuItem } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";
import "./Categories.css";

const Categories = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Burgers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [menuItems, setMenuItems] = useState<any[]>([]);

  const categories = ["Burgers", "Wraps", "Fries", "Coffee", "Dessert"];
  const navigate = useNavigate();

  // Fetch menu items on component mount and when user changes
  useEffect(() => {
    if (user?.userId) {
      fetchMenuItems();
    }
  }, [user?.userId]);

  const fetchMenuItems = async () => {
    if (!user?.userId) {
      setError("Please log in to view menu items");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const items = await getMenuItems(user.userId);
      console.log('📦 Raw API Response:', items);

      // Transform API data to match component structure
      const transformedItems = items.map((item) => {
        const transformed = {
          name: item.name,
          combo: item.makeCombo && item.comboPrice ? `Combo Price $${item.comboPrice}` : "",
          description: item.ingredients,
          price: `$${item.price}`,
          available: item.available,
          category: item.category,
          image: item.imageUrl,
          id: item.id,
        };
        console.log('🔄 Transformed item:', transformed);
        return transformed;
      });

      console.log('✅ All transformed items:', transformedItems);
      setMenuItems(transformedItems);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = () => {
    navigate("/menu/add-menu");
  };

  const handleEditMenu = (itemId: string) => {
    navigate(`/menu/edit-menu/${itemId}`);
  };

  // Toggle availability with API call
  const handleToggleAvailability = async (itemName: string) => {
    const item = menuItems.find((i) => i.name === itemName);
    if (!item || !item.id) return;

    // Optimistic update
    const updatedItems = menuItems.map((i) =>
      i.name === itemName ? { ...i, available: !i.available } : i
    );
    setMenuItems(updatedItems);
    setUpdating(item.id);

    try {
      if (!user?.userId) return;
      await updateMenuItem(user.userId, item.id, { available: !item.available });
      showSuccess(`${item.name} availability updated`);
    } catch (err) {
      console.error("Error updating availability:", err);
      // Revert on error
      setMenuItems(menuItems);
      showError("Failed to update availability. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Case-insensitive category filtering
  const filteredItems = menuItems.filter((item) => {
    const itemCategory = item.category?.toLowerCase() || '';
    const activeTab = activeCategory.toLowerCase();

    // Remove trailing 's' for comparison (Burgers -> Burger)
    const normalizedTab = activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab;
    const normalizedItem = itemCategory.endsWith('s') ? itemCategory.slice(0, -1) : itemCategory;

    return normalizedItem === normalizedTab;
  });

  console.log('🔍 Active Category:', activeCategory);
  console.log('📋 All Menu Items:', menuItems);
  console.log('🎯 Filtered Items:', filteredItems);

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="menu-header">
        <h1 className="menu-title">Menu</h1>
        <button onClick={handleAddMenu} className="add-menu-btn">
          Add Menu <Plus size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-tab ${activeCategory === cat ? "active" : ""
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader className="animate-spin" size={48} />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: '16px' }}>
          <AlertCircle size={48} color="#ff0000" />
          <p style={{ color: '#666', fontSize: '16px' }}>{error}</p>
          <button onClick={fetchMenuItems} className="add-menu-btn">
            Retry
          </button>
        </div>
      )}

      {/* Menu Cards */}
      {!loading && !error && (
        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>No items in {activeCategory}</p>
              <p style={{ fontSize: '14px' }}>Add menu items to get started</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`menu-card ${!item.available ? "not-available" : ""}`}
              >
                <button
                  onClick={() => handleEditMenu(item.id)}
                  className="edit-icon"
                >
                  <Edit size={18} />
                </button>

                <div className="menu-img">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="menu-info">
                  <h3 className="menu-name">{item.name}</h3>
                  <p className="menu-combo">{item.combo}</p>
                  <p className="menu-desc">{item.description}</p>
                </div>

                <div className="menu-footer">
                  <div className="menu-price">{item.price}</div>

                  <div
                    className="menu-status"
                    onClick={() => handleToggleAvailability(item.name)}
                    style={{ opacity: updating === item.id ? 0.5 : 1, pointerEvents: updating === item.id ? 'none' : 'auto' }}
                  >
                    <div className={`toggle ${item.available ? "on" : "off"}`}>
                      <div className="toggle-circle"></div>
                    </div>
                    <span
                      className={`status-text ${item.available ? "available" : "not"
                        }`}
                    >
                      {item.available ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;