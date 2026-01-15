import { PUBLIC_ASSETS_ICONS, PUBLIC_ASSETS_IMAGES } from '@emma/assets';
import { AddOnItem } from '@emma/components/business/addOnItem';
import { MenuItemPriceOptions } from '@emma/components/business/menuItemPriceOptions';
import { Image, ImageWrapper } from '@emma/components/common/image';
import { H2, H4 } from '@emma/components/ui/typography';

const {
  CheeseIcon,
  BurgerIcon,
  FrenchFriesIcon,
  BaconIcon,
  FriedEggIcon,
  JalapenoIcon,
  MushroomIcon,
  PineappleIcon,
  OnionIcon,
  NuggetsIcon,
  MilkShakeIcon,
  OnionRingsIcon,
} = PUBLIC_ASSETS_ICONS;

export const AddOnAndExtras = () => {
  return (
    <div className="space-y-3 2xl:space-y-6">
      {/* add on's section */}
      <section className="flex gap-3 2xl:gap-5">
        <div className="basis-1/2 space-y-3">
          <H2 className="bg-emma-primary text-white 2xl:text-5xl font-bold text-center rounded py-2">
            Add On's
          </H2>
          <div>
            {addOnData.map(item => (
              <AddOnItem key={item.title} {...item} />
            ))}
          </div>
        </div>
        <div className="basis-1/2">
          <Image
            src={PUBLIC_ASSETS_IMAGES.AddOnImg}
            alt="add-on's-img"
            className="rounded"
          />
        </div>
      </section>
      {/*  */}
      {/* sides section */}
      <section className="space-y-2 2xl:space-y-4">
        <H2 className="bg-emma-primary text-white py-2 2xl:text-5xl text-center font-bold rounded">
          Sides
        </H2>
        <div className="flex gap-7 2xl:gap-14">
          {/*  */}
          <div className="basis-1/2">
            <MenuItemPriceOptions
              title="Chicken Nuggets"
              items={[
                { id: 'cn1', name: '6 pcs', price: '3.50' },
                { id: 'cn2', name: '10 pcs', price: '5.50' },
                { id: 'cn3', name: '20 pcs', price: '9.00' },
              ]}
              icon={NuggetsIcon}
            />
          </div>
          {/*  */}
          <div className="basis-1/2">
            <MenuItemPriceOptions
              title="Onion Rings with Dip"
              items={[
                { id: 'ord1', name: '6 pcs', price: '3.00' },
                { id: 'ord2', name: '10 pcs', price: '4.50' },
                { id: 'ord3', name: '15 pcs', price: '6.00' },
              ]}
              icon={OnionRingsIcon}
            />
          </div>
        </div>
      </section>
      {/*  */}
      {/* dessert section */}
      <section className="grid grid-cols-1 grid-rows-1">
        <Image
          src={PUBLIC_ASSETS_IMAGES.DessertsBg}
          alt="dessert-bg-img"
          className=" col-start-1 row-start-1 rounded"
        />
        <div className="col-start-1 row-start-1 text-white flex items-center justify-end px-4">
          <H4 className="2xl:text-2xl font-bold">
            Fresh Brownie with <br /> Coffee (Espresso /<br /> Cappuccino /
            <br />
            Latte) — $5.50
          </H4>
        </div>
      </section>
      {/*  */}
      {/* soft drinks section */}
      <section className="flex items-center gap-2 2xl:gap-4">
        <ImageWrapper className="w-18 2xl:w-24">
          <Image src={PUBLIC_ASSETS_ICONS.SoftDrinksIcon} alt="drinks-icon" />
        </ImageWrapper>
        <H2 className="text-emma-primary 2xl:text-5xl font-bold leading-none w-min">
          Drinks Menu
        </H2>
        <div className="flex gap-[inherit] basis-3/4">
          <div className="basis-1/2">
            <MenuItemPriceOptions
              title="Soft Drinks"
              items={[
                { id: 'sd1', name: 'Small', price: '1.50' },
                { id: 'sd2', name: 'Medium', price: '2.00' },
                { id: 'sd3', name: 'Large', price: '2.50' },
              ]}
            />
          </div>
          <div className="basis-1/2">
            <MenuItemPriceOptions
              title="Water Bottle"
              items={[
                { id: 'wb1', name: '500 ml', price: '1.00' },
                { id: 'wb2', name: '1 L', price: '1.50' },
              ]}
            />
          </div>
        </div>
      </section>
      <H2 className="bg-emma-primary text-white py-2 2xl:text-5xl text-center font-bold rounded">
        Coke, Pepsi, Sprite, Fanta, 7Up
      </H2>
    </div>
  );
};

const addOnData = [
  {
    title: 'Extra Cheese Slice',
    icon: CheeseIcon,
    price: '$1.00',
  },
  { title: 'Extra Patty', icon: BurgerIcon, price: '$2.50' },
  { title: 'Bacon Strips', icon: BaconIcon, price: '$2.00' },
  { title: 'Fried Egg', icon: FriedEggIcon, price: '$1.50' },
  { title: 'Jalapeños', icon: JalapenoIcon, price: '$1.00' },
  { title: 'Sautéed Mushrooms', icon: MushroomIcon, price: '$1.50' },
  { title: 'Grilled Pineapple', icon: PineappleIcon, price: '$1.50' },
  { title: 'Onion Rings', icon: OnionIcon, price: '$2.50' },
  { title: 'Chicken Nuggets', icon: NuggetsIcon, price: '$2.00' },
  { title: 'Large Fries', icon: FrenchFriesIcon, price: '$2.00' },
  { title: 'Milkshake Upgrade', icon: MilkShakeIcon, price: '$3.00' },
];
