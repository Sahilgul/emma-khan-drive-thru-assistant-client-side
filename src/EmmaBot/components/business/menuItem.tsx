import type { TypeOrNull } from '@emma/types';
import { Image } from '../common/image';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Paragraph } from '../ui/typography';

export const MenuItem: React.FC<{
  comboDetails?: TypeOrNull<{ title: string; price: string }>;
  imgUrl: string;
  title: string;
  price: string;
  description: string;
}> = ({ comboDetails, imgUrl, title, price, description }) => {
  return (
    <Card className="border-emma-primary border-2 rounded-md shadow-md gap-2 p-2 *:p-0 *:m-0">
      <CardHeader className="justify-items-center h-max">
        <CardTitle className="text-emma-primary font-bold whitespace-normal min-xl:text-sm">
          {comboDetails ? (
            <>
              {comboDetails.title} {comboDetails.price}
            </>
          ) : (
            'Combo Not Available'
          )}
        </CardTitle>
        <CardDescription>
          <Image
            src={imgUrl}
            alt={`${title} - menu item`}
            className="size-18 2xl:size-24 object-cover rounded"
            fallback="/images/delicious-burger.png"
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        <Paragraph
          title={title}
          className="basis-3/4 font-semibold leading-tight line-clamp-2 min-xl:text-sm"
        >
          {title}
        </Paragraph>
        <Badge className="font-semibold 2xl:text-sm rounded-full">
          {price}
        </Badge>
      </CardContent>
      <CardFooter className="">
        <Paragraph
          title={description}
          className="text-xs text-emma-muted-foreground line-clamp-2"
        >
          {description}
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
