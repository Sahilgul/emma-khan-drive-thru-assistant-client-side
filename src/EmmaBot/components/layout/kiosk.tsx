import type { ReactNode } from '@emma/types';
import React from 'react';

export const KioskLayout: React.FC<{
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}> = ({ leftPanel, centerPanel, rightPanel }) => {
  return (
    <div className="min-h-svh max-h-svh max-w-[2560px] w-svw bg-emma-background grid grid-cols-3 overflow-hidden">
      <section className="overflow-hidden h-svh relative">{leftPanel}</section>
      <section className="overflow-hidden h-svh relative">{centerPanel}</section>
      <section className="overflow-hidden h-svh relative">{rightPanel}</section>
    </div>
  );
};
