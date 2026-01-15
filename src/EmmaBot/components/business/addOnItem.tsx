import React from 'react';
import { Image, ImageWrapper } from '../common/image';
import { Separator } from '../ui/separator';
import { Paragraph } from '../ui/typography';

export const AddOnItem: React.FC<{
  title: string;
  price: string;
  icon: string;
}> = ({ title, price, icon }) => {
  return (
    <div className="flex gap-2 items-center">
      <ImageWrapper>
        <Image
          src={icon}
          alt={`${title} add-on icon`}
          className="size-6 object-contain"
          loading="eager"
        />
      </ImageWrapper>
      <div className="flex items-center justify-between w-full font-semibold min-xl:text-xs">
        <Paragraph>{title}</Paragraph>
        <div className="flex items-center gap-2">
          <Separator className="!w-4 2xl:!w-6 border-1 border-gray-500 shrink" />
          <Paragraph>{price}</Paragraph>
        </div>
      </div>
    </div>
  );
};
