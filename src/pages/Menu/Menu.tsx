import React from 'react';
import { Coffee, Utensils, Beef, Salad, IceCream } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  comboPrice?: number;
  description: string;
  available: boolean;
  category: string;
}

const MenuPage: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Classic Burger",
      price: 5,
      comboPrice: 8,
      description: "Bun, lettuce, tomato, onion, cheese, patty, pickles, sauces",
      available: true,
      category: "Burgers"
    },
    {
      id: 2,
      name: "Cheese Burger",
      price: 8,
      comboPrice: 15,
      description: "Bun, double cheese, beef patty, caramelized onion, mayo, ketchup",
      available: true,
      category: "Burgers"
    },
    {
      id: 3,
      name: "BBQ Chicken Burger",
      price: 6,
      comboPrice: 13,
      description: "Bun, grilled chicken patty, BBQ sauce, lettuce, onion, cheese",
      available: true,
      category: "Burgers"
    },
    {
      id: 4,
      name: "Jalapeño Burger",
      price: 10,
      comboPrice: 12,
      description: "Bun, beef patty, jalapeños, cheese, spicy mayo, lettuce",
      available: true,
      category: "Burgers"
    },
    {
      id: 5,
      name: "Hawaiian Burger",
      price: 6,
      comboPrice: 8,
      description: "Bun, chicken patty, grilled pineapple, cheese, BBQ sauce",
      available: true,
      category: "Burgers"
    },
    {
      id: 6,
      name: "Fish Fillet Burger",
      price: 8.5,
      comboPrice: 12,
      description: "Bun, lettuce, tomato, onion, cheese, patty, pickles, sauces",
      available: true,
      category: "Burgers"
    },
    {
      id: 7,
      name: "Breakfast Burger",
      price: 8.5,
      description: "Beef patty, fried egg, cheese, crispy bacon, hamburger bun, ketchup",
      available: false,
      category: "Burgers"
    }
  ];

  const categories = [
    { name: "Burgers", icon: Beef },
    { name: "Wraps", icon: Salad },
    { name: "Fries", icon: Utensils },
    { name: "Coffee", icon: Coffee },
    { name: "Dessert", icon: IceCream }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Menu</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-orange-50 border border-orange-200"
                >
                  <Icon size={20} className="text-orange-500" />
                  <span className="font-semibold text-gray-700">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                item.available ? 'border-orange-200 hover:border-orange-300' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Item Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">${item.price}</div>
                    {item.comboPrice && (
                      <div className="text-sm text-gray-500 line-through">Combo ${item.comboPrice}</div>
                    )}
                  </div>
                </div>
                
                {/* Availability Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  item.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Available' : 'Not Available'}
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                
                {/* Action Button */}
                <button
                  disabled={!item.available}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    item.available
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.available ? 'Add to Order' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            All burgers served with your choice of side. Combo includes fries and drink.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;