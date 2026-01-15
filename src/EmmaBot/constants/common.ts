import { PUBLIC_ASSETS_ICONS } from '@emma/assets';

export const MenuCategories = [
  { key: 'burgers', title: 'Burgers', icon: PUBLIC_ASSETS_ICONS.BurgerIcon },
  { key: 'wraps', title: 'Wraps', icon: PUBLIC_ASSETS_ICONS.WrapIcon },
  { key: 'fries', title: 'Fries', icon: PUBLIC_ASSETS_ICONS.FrenchFriesIcon },
  { key: 'coffee', title: 'Coffee', icon: PUBLIC_ASSETS_ICONS.CoffeeCupIcon },
  { key: 'drinks', title: 'Drinks', icon: PUBLIC_ASSETS_ICONS.SoftDrinksIcon },
  { key: 'desserts', title: 'Desserts', icon: PUBLIC_ASSETS_ICONS.DessertIcon },
];

export const AGENT_WELCOME_MESSAGE =
  'Hi, I am Emma, your virtual order assistant. What would you like to order today?';

// Default trigger phrases for starting an order
export const DEFAULT_TRIGGER_PHRASES = [
  'hello',
  'hey',
  'hi',
  'i want something',
  'i want to order',
  'can i order',
  'i would like to order',
  'start order',
  'begin order',
  'place order',
  'order food',
  'i want food',
  'hungry',
  'menu',
  'what do you have',
  'what can i get',
];
