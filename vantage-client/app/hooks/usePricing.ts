// ============================================================================
// USE PRICING HOOK - Real-time pricing operations with debouncing
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { usePayment } from "@/providers/PaymentProvider";
import { PricingState, CurrencyOption } from "@/types";

// ============================================================================
// PRICING HOOK INTERFACE
// ============================================================================

interface UsePricingOptions {
  programId: string;
  initialCurrency?: string;
  debounceDelay?: number; // 500ms as per your spec
  autoUpdate?: boolean;
}

interface UsePricingReturn {
  // State
  pricing: PricingState | null;
  selectedCurrency: string;
  isLoading: boolean;
  error: string | null;
  availableCurrencies: CurrencyOption[];
  isLoadingCurrencies: boolean;

  // Actions
  setSelectedCurrency: (currency: string) => void;
  updatePricing: (programId: string, currency: string) => Promise<void>;
  refreshPricing: () => Promise<void>;
  loadCurrencies: () => Promise<void>;

  // Computed values
  formattedAmount: string;
  currencySymbol: string;
  hasPricing: boolean;
  isStale: boolean;
}

// ============================================================================
// NO FALLBACK CURRENCIES - Pure backend integration
// ============================================================================

// ============================================================================
// CURRENCY API FUNCTIONS
// ============================================================================

const fetchCurrencies = async (): Promise<CurrencyOption[]> => {
  try {
    const response = await fetch("/api/currency");
    const data = await response.json();

    if (data.success && data.data) {
      return data.data.map(
        (currency: {
          code: string;
          name: string;
          symbol: string;
          flag?: string;
        }) => ({
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          flag: currency.flag || "🌍",
          isPopular: currency.code === "INR" || currency.code === "USD",
        })
      );
    }

    // No fallback - return empty array if backend fails
    return [];
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    return [];
  }
};

// Note: convertCurrency function is available but not used in this hook
// as currency conversion is handled by the backend pricing service

// ============================================================================
// USE PRICING HOOK
// ============================================================================

export function usePricing({
  programId,
  initialCurrency = "INR",
  debounceDelay = 500, // 500ms as per your spec
  autoUpdate = true,
}: UsePricingOptions): UsePricingReturn {
  const { pricing, isPricingLoading, pricingError, updatePricing } =
    usePayment();

  const [localCurrency, setLocalCurrency] = useState(initialCurrency);
  const [availableCurrencies, setAvailableCurrencies] = useState<
    CurrencyOption[]
  >([]);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // ============================================================================
  // CURRENCY LOADING
  // ============================================================================

  const loadCurrencies = useCallback(async () => {
    setIsLoadingCurrencies(true);
    try {
      const currencies = await fetchCurrencies();
      setAvailableCurrencies(currencies);
    } catch (error) {
      console.error("Failed to load currencies:", error);
      // Keep the fallback currencies
    } finally {
      setIsLoadingCurrencies(false);
    }
  }, []);

  // ============================================================================
  // DEBOUNCED PRICING UPDATE
  // ============================================================================

  const debouncedUpdatePricing = useCallback(
    (currency: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          await updatePricing(programId, currency);
          lastUpdateRef.current = Date.now();
        } catch (error) {
          console.error("Failed to update pricing:", error);
        }
      }, debounceDelay);
    },
    [programId, updatePricing, debounceDelay]
  );

  // ============================================================================
  // CURRENCY UPDATE HANDLER
  // ============================================================================

  const updateCurrency = useCallback(
    (currency: string) => {
      setLocalCurrency(currency);

      if (autoUpdate) {
        debouncedUpdatePricing(currency);
      }
    },
    [debouncedUpdatePricing, autoUpdate]
  );

  // ============================================================================
  // REFRESH PRICING
  // ============================================================================

  const refreshPricing = useCallback(async () => {
    try {
      await updatePricing(programId, localCurrency);
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error("Failed to refresh pricing:", error);
    }
  }, [programId, localCurrency, updatePricing]);

  // ============================================================================
  // INITIAL LOADING
  // ============================================================================

  useEffect(() => {
    // Load currencies on mount
    loadCurrencies();
  }, [loadCurrencies]);

  useEffect(() => {
    if (autoUpdate && programId) {
      refreshPricing();
    }
  }, [programId, autoUpdate, refreshPricing]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const currentPricing = pricing || null;
  const hasPricing = currentPricing !== null;
  const isStale = hasPricing && Date.now() - lastUpdateRef.current > 300000; // 5 minutes

  const formattedAmount = currentPricing
    ? formatCurrency(currentPricing.pricing.totalAmount, localCurrency)
    : "0";

  const currencySymbol = getCurrencySymbol(localCurrency, availableCurrencies);

  // ============================================================================
  // RETURN HOOK INTERFACE
  // ============================================================================

  return {
    // State
    pricing: currentPricing,
    selectedCurrency: localCurrency,
    isLoading: isPricingLoading,
    error: pricingError,
    availableCurrencies,
    isLoadingCurrencies,

    // Actions
    setSelectedCurrency: updateCurrency,
    updatePricing,
    refreshPricing,
    loadCurrencies,

    // Computed values
    formattedAmount,
    currencySymbol,
    hasPricing,
    isStale,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}

function getCurrencySymbol(
  currency: string,
  availableCurrencies: CurrencyOption[] = []
): string {
  const option = availableCurrencies.find((opt) => opt.code === currency);
  return option?.symbol || currency;
}

// ============================================================================
// NO EXPORTS - Pure backend integration
// ============================================================================
