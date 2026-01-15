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
      <ImageWrapper className="size-14 2xl:size-20">
        <Image src={image} alt={title} />
      </ImageWrapper>

      <div className="flex-1 *:p-0">
        <CardHeader className="">
          <CardTitle className="text-emma-primary 2xl:text-2xl">
            {offerCategory}
          </CardTitle>
          <CardTitle className="2xl:text-xl">{title}</CardTitle>
          <CardDescription className="max-w-[35ch]">
            {description}
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            {showQuantity && quantity && quantity > 1 && (
              <Badge variant="outline" className="rounded-full text-base font-semibold">
                x{quantity}
              </Badge>
            )}
            <Badge className="rounded-full text-base font-semibold">
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
