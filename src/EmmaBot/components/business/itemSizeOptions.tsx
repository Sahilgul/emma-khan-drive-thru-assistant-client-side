import type { ItemOption } from '@emma/types/order';
import { Image, ImageWrapper } from '../common/image';
import { H3 } from '../ui/typography';
import { MenuItemPriceOptions } from './menuItemPriceOptions';

interface ItemSizeOptionsProps {
  itemOptions: ItemOption;
  title: string;
  icon: string;
}

export const ItemSizeOptions: React.FC<ItemSizeOptionsProps> = ({
  itemOptions,
  title,
  icon,
}) => {
  return (
    <div className="flex items-center gap-2">
      <ImageWrapper className="size-18 2xl:size-24">
        <Image src={icon} alt={title} />
      </ImageWrapper>
      <H3 className="2xl:text-3xl font-bold text-emma-primary w-[7ch]">{title}</H3>
      <MenuItemPriceOptions
        title={itemOptions.name}
        items={itemOptions.options}
      />
    </div>
  );
};
