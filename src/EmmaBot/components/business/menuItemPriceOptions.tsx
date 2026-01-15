import type { ArrayGeneric, ItemSize } from '@emma/types';
import { Image, ImageWrapper } from '../common/image';
import { Paragraph } from '../ui/typography';

type MenuItemPriceOptionProps = {
  title: string;
  items: ArrayGeneric<ItemSize>;
  icon?: string;
};

export const MenuItemPriceOptions: React.FC<MenuItemPriceOptionProps> = ({
  title,
  items,
  icon,
}) => {
  return (
    <div className="space-y-1">
      <Paragraph className="2xl:text-xl font-semibold">{title}</Paragraph>
      <div className="flex items-center justify-between gap-2 2xl:gap-4">
        {/* https://ui.shadcn.com/docs/components/typography#list */}
        <ul className="ml-6 list-disc font-semibold min-xl:text-sm min-xl:[&_p]:leading-5">
          {items.map(item => (
            <li key={item.id}>
              <Paragraph>
                {item.name} — ${Number(item.price).toFixed(2)}
              </Paragraph>
            </li>
          ))}
        </ul>
        {icon && (
          <ImageWrapper className="w-18 2xl:w-24">
            <Image src={icon} alt="sides items icon" loading="eager" />
          </ImageWrapper>
        )}
      </div>
    </div>
  );
};
