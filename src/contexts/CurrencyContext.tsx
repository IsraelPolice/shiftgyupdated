import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'ILS';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatCurrency: (amount: number) => string;
  convertCurrency: (amount: number, fromCurrency?: CurrencyType, toCurrency?: CurrencyType) => number;
  getCurrencySymbol: (currencyCode?: CurrencyType) => string;
  getExchangeRate: (fromCurrency: CurrencyType, toCurrency: CurrencyType) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyType>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyType, number>>({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    ILS: 3.8 // Default fallback rate: 1 USD = 3.8 ILS
  });
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  useEffect(() => {
    // Initialize currency from localStorage
    const savedCurrency = localStorage.getItem('shiftgy_currency') as CurrencyType;
    if (savedCurrency && Object.keys(exchangeRates).includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
    
    // Fetch exchange rates
    fetchExchangeRates();
  }, []);

  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {
    // Check if we need to fetch (first time or cache expired)
    const now = Date.now();
    const cacheExpiration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    
    if (lastFetchTime && now - lastFetchTime < cacheExpiration) {
      return; // Use cached rates
    }
    
    try {
      const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,CAD,ILS');
      const data = await response.json();
      
      if (data.success !== false && data.rates) {
        setExchangeRates(prev => ({
          ...prev,
          EUR: data.rates.EUR || prev.EUR,
          GBP: data.rates.GBP || prev.GBP,
          CAD: data.rates.CAD || prev.CAD,
          ILS: data.rates.ILS || prev.ILS
        }));
        setLastFetchTime(now);
        console.log('Exchange rates updated:', data.rates);
      }
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using fallback values:', error);
    }
  };

  const setCurrency = (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('shiftgy_currency', newCurrency);
    
    // Refresh exchange rates when currency changes
    fetchExchangeRates();
  };

  const getCurrencySymbol = (currencyCode: CurrencyType = currency): string => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'CAD': return 'C$';
      case 'ILS': return '₪';
      default: return '$';
    }
  };
  
  const getExchangeRate = (fromCurrency: CurrencyType, toCurrency: CurrencyType): number => {
    // Convert from fromCurrency to USD, then from USD to toCurrency
    return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  };

  const convertCurrency = (
    amount: number, 
    fromCurrency: CurrencyType = 'USD', 
    toCurrency: CurrencyType = currency
  ): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const rate = getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  };

  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat(currency === 'ILS' ? 'he-IL' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatCurrency,
      convertCurrency,
      getCurrencySymbol,
      getExchangeRate
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}