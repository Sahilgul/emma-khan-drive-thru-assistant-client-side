import { PUBLIC_ASSETS_ICONS, PUBLIC_ASSETS_IMAGES } from '@emma/assets';
import { MenuCategoryItem } from '@emma/components/business/menuCategoryItem';
import { MenuItem } from '@emma/components/business/menuItem';
import { Image } from '@emma/components/common/image';
import { ScrollArea, ScrollBar } from '@emma/components/ui/scroll-area';
import { H2, H3, Paragraph } from '@emma/components/ui/typography';
import { MenuCategories } from '@emma/constants/common';

export const MenuAndDeals = () => {
  return (
    // <ScrollArea className="h-svh">
    <div className="space-y-3 2xl:space-y-6">
      {/* midnight deal offer */}
      <section className="grid grid-cols-1 grid-rows-1">
        <div className="col-start-1 row-start-1">
          <Image
            src={PUBLIC_ASSETS_IMAGES.MidNightDealImg}
            alt="midnight-deal-bg"
            loading="lazy"
            className="rounded"
          />
        </div>
        <div className="col-start-1 row-start-1 p-3 2xl:p-5 space-y-1">
          <H2 className="text-emma-primary font-bold 2xl:text-5xl">Midnight Deal</H2>

          <H3 className="font-bold 2xl:text-3xl text-white">
            Beef Burger With <br /> Combo for $12
            <span className="inline-block pl-4 font-normal text-base 2xl:text-xl">
              (* Start After 11 PM)
            </span>
          </H3>
        </div>
      </section>
      {/*  */}
      {/* menu categories */}
      <ScrollArea className="h-max pb-2">
        <div className="flex gap-6 2xl:gap-8 w-max">
          {MenuCategories.map(item => (
            <MenuCategoryItem
              key={item.key}
              isActive={item.key === 'burgers'}
              title={item.title}
              imgUrl={item.icon}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/*  */}
      {/* menu grid */}
      <ScrollArea className="h-[50svh]">
        <div className="grid grid-cols-3 gap-2">
          {dummyMenuItems.map(item => (
            <MenuItem
              key={item.title}
              title={item.title}
              description={item.description}
              imgUrl={PUBLIC_ASSETS_IMAGES.BurgerImg}
              price={item.price}
              comboDetails={item?.comboDetails}
            />
          ))}
        </div>
      </ScrollArea>
      {/*  */}
      {/* combo details section */}
      <section className="bg-emma-primary rounded py-2 px-2 2xl:px-4 flex items-center gap-3 text-white">
        <H3 className="text-nowrap font-bold min-xl:text-xl">Combo Includes</H3>

        <Image
          src={PUBLIC_ASSETS_ICONS.ComboDealIcon}
          alt="combo-img"
          width={50}
          height={50}
        />

        <Paragraph className="text-xs">
          Combo includes Fries + Drink (Fries can be replaced with Onion
          Rings/Nuggets, Drink with Milkshake/Iced Coffee - Charges Included).
        </Paragraph>
      </section>
      {/*  */}
      {/* wrap section */}
      <section className="grid grid-cols-1 grid-rows-1">
        <div className="col-start-1 row-start-1">
          <img
            src={PUBLIC_ASSETS_IMAGES.WrapImg}
            alt="chicken-wrap-bg"
            loading="lazy"
            className="rounded"
          />
        </div>
        <div className="col-start-1 row-start-1 justify-self-end p-8">
          <H3 className="text-white 2xl:text-3xl leading-none">
            Flaming Hot <br /> Mexican Chicken <br /> Wrap in $12
          </H3>
        </div>
      </section>
    </div>
    // </ScrollArea>
  );
};

const dummyMenuItems = [
  {
    title: 'Classic Cheeseburger',
    price: '$8.99',
    description:
      'Juicy beef patty with cheddar cheese, lettuce, tomato, onion, and house sauce.',
    imgUrl: 'https://picsum.photos/seed/burger1/400/300',
    comboDetails: { title: 'Combo Price', price: '$12.99' },
  },
  {
    title: 'Smoky BBQ Burger',
    price: '$10.49',
    description:
      'Grilled beef patty topped with smoky BBQ sauce, crispy onions, and bacon.',
    imgUrl: 'https://picsum.photos/seed/burger2/400/300',
    comboDetails: { title: 'Combo Price', price: '$14.49' },
  },
  {
    title: 'Mushroom Swiss Burger',
    price: '$9.99',
    description:
      'Tender beef patty with sautéed mushrooms, Swiss cheese, and garlic aioli.',
    imgUrl: 'https://picsum.photos/seed/burger3/400/300',
  },
  {
    title: 'Double Decker Burger',
    price: '$12.99',
    description:
      'Two stacked beef patties with melted cheese, lettuce, tomato, and pickles.',
    imgUrl: 'https://picsum.photos/seed/burger4/400/300',
    comboDetails: { title: 'Combo Price', price: '$16.99' },
  },
  {
    title: 'Spicy Jalapeño Burger',
    price: '$9.49',
    description:
      'Beef patty topped with jalapeños, pepper jack cheese, and chipotle mayo.',
    imgUrl: 'https://picsum.photos/seed/burger5/400/300',
  },
  {
    title: 'Bacon Lover’s Burger',
    price: '$11.49',
    description:
      'Beef patty piled with crispy bacon, cheddar cheese, and smoky mayo.',
    imgUrl: 'https://picsum.photos/seed/burger6/400/300',
    comboDetails: { title: 'Combo Price', price: '$15.49' },
  },
  {
    title: 'Crispy Chicken Burger',
    price: '$8.79',
    description: 'Golden fried chicken breast with lettuce, tomato, and mayo.',
    imgUrl: 'https://picsum.photos/seed/burger7/400/300',
  },
  {
    title: 'Buffalo Chicken Burger',
    price: '$9.29',
    description:
      'Crispy chicken tossed in buffalo sauce with ranch and lettuce.',
    imgUrl: 'https://picsum.photos/seed/burger8/400/300',
    comboDetails: { title: 'Combo Price', price: '$13.29' },
  },
  {
    title: 'Veggie Delight Burger',
    price: '$8.49',
    description:
      'Grilled veggie patty with avocado, lettuce, tomato, and pesto mayo.',
    imgUrl: 'https://picsum.photos/seed/burger9/400/300',
  },
  {
    title: 'Avocado Ranch Burger',
    price: '$9.79',
    description:
      'Beef patty with creamy ranch, avocado slices, and cheddar cheese.',
    imgUrl: 'https://picsum.photos/seed/burger10/400/300',
    comboDetails: { title: 'Combo Price', price: '$13.79' },
  },
  {
    title: 'Tex-Mex Burger',
    price: '$10.99',
    description:
      'Beef patty with guacamole, salsa, jalapeños, and pepper jack cheese.',
    imgUrl: 'https://picsum.photos/seed/burger11/400/300',
  },
  {
    title: 'Breakfast Burger',
    price: '$11.29',
    description:
      'Beef patty with fried egg, bacon, cheddar cheese, and hash browns.',
    imgUrl: 'https://picsum.photos/seed/burger12/400/300',
    comboDetails: { title: 'Combo Price', price: '$15.29' },
  },
];
