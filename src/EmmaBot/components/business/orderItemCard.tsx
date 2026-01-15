import { Image, ImageWrapper } from '@emma/components/common/image';
import type { OrderItem } from '@emma/types';
import { Badge } from '../ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Paragraph } from '../ui/typography';

interface OrderItemCardProps {
  item: OrderItem;
  showQuantity?: boolean;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  showQuantity = true,
}) => {
  const {
    title,
    offerCategory,
    image,
    description,
    without,
    with: withItems,
    size,
    comment,
    quantity,
  } = item;

  return (
    <Card
      className={
        'border-emma-primary border-2 rounded-xl shadow-md gap-4 px-2 py-2 *:p-0 *:m-0 flex-row'
      }
    >
      {/* Item Image */}
      <ImageWrapper className="size-14 sm:size-16 lg:size-20 shrink-0">
        <Image src={image} alt={title} />
      </ImageWrapper>

      <div className="flex-1 *:p-0">
        <CardHeader className="">
          <CardTitle className="text-emma-primary text-sm sm:text-base lg:text-2xl leading-none">
            {offerCategory}
          </CardTitle>
          <CardTitle className="text-base sm:text-lg lg:text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs lg:text-sm max-w-[35ch] leading-tight">
            {description}
          </CardDescription>
          <CardAction className="flex items-center gap-2 mt-1 sm:mt-2">
            {showQuantity && quantity && quantity > 1 && (
              <Badge variant="outline" className="rounded-full text-[10px] sm:text-xs lg:text-base font-semibold px-2 py-0">
                x{quantity}
              </Badge>
            )}
            <Badge className="rounded-full text-[10px] sm:text-xs lg:text-base font-semibold px-2 py-0">
              ${item.price.toFixed(2)}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="mt-3 space-y-1 text-xs 2xl:text-sm text-emma-muted-foreground [&_p]:leading-none">
          {/* without items */}
          {without.length > 0 && (
            <div>
              {without.map(item => (
                <Paragraph key={item}>No {item}</Paragraph>
              ))}
            </div>
          )}
          {/*  */}
          {/* with items */}
          {withItems.length > 0 && (
            <div>
              {withItems.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <Paragraph>Add {item.title}</Paragraph>
                  {item.price > 0 && (
                    <Badge className="rounded-full text-sm">
                      ${item.price.toFixed(2)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
          {/*  */}
          {/* size */}
          {size && (
            <Paragraph>
              Size: {size}
            </Paragraph>
          )}
          {/*  */}
          {comment && (
            <>
              <Paragraph>Note: {comment}</Paragraph>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
