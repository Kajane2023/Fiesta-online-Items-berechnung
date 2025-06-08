
import React from 'react';
import { Currency } from '@/types/fiesta';

interface CurrencyDisplayProps {
  currency: Currency;
  className?: string;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ currency, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {currency.gems > 0 && (
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border border-purple-300"></div>
          <span className="text-purple-300 font-semibold">{currency.gems.toLocaleString()}</span>
        </div>
      )}
      {currency.gold > 0 && (
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-yellow-300"></div>
          <span className="text-yellow-300 font-semibold">{currency.gold.toLocaleString()}</span>
        </div>
      )}
      {currency.silver > 0 && (
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full border border-gray-200"></div>
          <span className="text-gray-300 font-semibold">{currency.silver}</span>
        </div>
      )}
      {currency.copper > 0 && (
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border border-orange-300"></div>
          <span className="text-orange-300 font-semibold">{currency.copper}</span>
        </div>
      )}
    </div>
  );
};

export default CurrencyDisplay;
