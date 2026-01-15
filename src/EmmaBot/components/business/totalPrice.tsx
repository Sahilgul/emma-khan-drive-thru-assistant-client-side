import { cn } from '@emma/lib/utils';
import { H2 } from '../ui/typography';

interface TotalPriceProps {
  subtotal: number;
  tax?: number;
  total: number;
  className?: string;
  showBreakdown?: boolean;
}

export const TotalPrice: React.FC<TotalPriceProps> = ({
  subtotal,
  tax = 0,
  total,
  className,
  showBreakdown = false,
}) => {
  return (
    <div className={cn('bg-emma-primary text-white p-2 rounded h-[50px] 2xl:h-[70px] flex items-center justify-center shrink-0 overflow-hidden', className)}>
      {/* Main Total */}
      <div className="text-center">
        <H2 className="2xl:text-5xl font-bold">
          Your Total Price Is: ${total.toFixed(2)}
        </H2>
      </div>

      {/* Price Breakdown */}
      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-green-400">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-100">Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-100">Sales Tax (7%):</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-lg font-bold border-t border-green-400 pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
