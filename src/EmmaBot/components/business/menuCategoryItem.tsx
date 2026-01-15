import React from 'react';
import { Image, ImageWrapper } from '../common/image';
import { H4 } from '../ui/typography';

export const MenuCategoryItem: React.FC<{
  imgUrl: string;
  title: string;
  isActive: boolean;
}> = ({ imgUrl, title, isActive }) => {
  return (
    <div className="flex flex-col items-center gap-2 2xl:gap-3">
      <ImageWrapper>
        <Image
          src={imgUrl}
          alt={`${title} category icon`}
          className="size-12 2xl:size-14 object-contain"
          loading="eager"
        />
      </ImageWrapper>
      <H4 className={isActive ? 'text-emma-primary' : 'font-normal'}>{title}</H4>
    </div>
  );
};
