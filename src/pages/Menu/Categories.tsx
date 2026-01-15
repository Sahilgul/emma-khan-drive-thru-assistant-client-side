import { useState, useEffect } from "react";
import { Plus, Edit, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMenuItems, updateMenuItem } from "@emma/apis/menu";
import { showSuccess, showError } from "../../utils/alert";
import { useAuth } from "../../hooks/useAuth";


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

  return (
    <div className="p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Menu Overview</h1>
          <p className="text-slate-500 mt-1">Manage, edit, and update your menu items</p>
        </div>
        <button
          onClick={handleAddMenu}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Add Menu Item
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="inline-flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 min-w-full md:min-w-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                ${activeCategory === cat
                  ? "bg-teal-50 text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader className="animate-spin text-teal-600 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Loading menu items...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="p-4 bg-red-50 text-red-500 rounded-full">
            <AlertCircle size={48} />
          </div>
          <p className="text-slate-600 text-lg font-medium">{error}</p>
          <button
            onClick={fetchMenuItems}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Menu Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-16 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
              <p className="text-lg font-semibold mb-2">No items in {activeCategory}</p>
              <p className="text-sm">Add menu items to get started</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300
                  ${!item.available ? "opacity-75 grayscale-[0.5]" : ""}
                `}
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={() => handleEditMenu(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-teal-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit Item"
                  >
                    <Edit size={16} />
                  </button>
                  {item.combo && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/10 uppercase tracking-widest">
                      Combo
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{item.name}</h3>
                    <span className="text-lg font-bold text-teal-600">{item.price}</span>
                  </div>

                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">{item.description}</p>

                  {item.combo && (
                    <p className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md inline-block mb-4">
                      {item.combo}
                    </p>
                  )}

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${item.available ? "text-slate-400" : "text-red-400"}`}>
                      {item.available ? "In Stock" : "Unavailable"}
                    </span>

                    <div
                      className={`relative inline-flex items-center cursor-pointer transition-opacity ${updating === item.id ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={() => handleToggleAvailability(item.name)}
                    >
                      <div className={`w-11 h-6 rounded-full transition-colors ${item.available ? "bg-teal-500" : "bg-slate-200"}`}>
                        <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${item.available ? "translate-x-5" : "translate-x-0"}`}></div>
                      </div>
                    </div>
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