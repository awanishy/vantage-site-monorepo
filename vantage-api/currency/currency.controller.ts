import { Request, Response } from 'express';
import { CurrencyService } from './currency.service';
import { ICurrencyResponse } from '@/types/currency.types';

export class CurrencyController {
  // Get all currencies
  static async getAllCurrencies(req: Request, res: Response): Promise<void> {
    try {
      const currencies = await CurrencyService.getInstance().getAllCurrencies();
      
      res.status(200).json({
        success: true,
        data: currencies
      } as ICurrencyResponse);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch currencies'
      } as ICurrencyResponse);
    }
  }

  // Get single currency by code
  static async getCurrencyByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const currency = await CurrencyService.getInstance().getCurrencyByCode(code);

      if (!currency) {
        res.status(404).json({
          success: false,
          error: 'Currency not found'
        } as ICurrencyResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: currency
      } as ICurrencyResponse);
    } catch (error) {
      console.error('Error fetching currency:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch currency'
      } as ICurrencyResponse);
    }
  }

  // Get base currency
  static async getBaseCurrency(req: Request, res: Response): Promise<void> {
    try {
      const baseCurrency = await CurrencyService.getInstance().getBaseCurrency();
      
      if (!baseCurrency) {
        res.status(404).json({
          success: false,
          error: 'Base currency not found'
        } as ICurrencyResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: baseCurrency
      } as ICurrencyResponse);
    } catch (error) {
      console.error('Error fetching base currency:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch base currency'
      } as ICurrencyResponse);
    }
  }

  // Convert currency
  static async convertCurrency(req: Request, res: Response): Promise<void> {
    try {
      const { fromCurrency, toCurrency, amount, date } = req.body;

      // Input validation
      if (!fromCurrency || !toCurrency || !amount) {
        res.status(400).json({
          success: false,
          error: 'fromCurrency, toCurrency, and amount are required'
        } as ICurrencyResponse);
        return;
      }

      // Validate amount is numeric and positive
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        res.status(400).json({
          success: false,
          error: 'Amount must be a positive number'
        } as ICurrencyResponse);
        return;
      }

      // Parse date or use current date
      const conversionDate = date ? new Date(date) : new Date();
      if (date && isNaN(conversionDate.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid date format'
        } as ICurrencyResponse);
        return;
      }

      // Perform conversion
      const result = await CurrencyService.getInstance().convertCurrency(
        fromCurrency,
        toCurrency,
        numericAmount,
        conversionDate
      );

      res.status(200).json({
        success: true,
        data: result
      } as ICurrencyResponse);
    } catch (error) {
      console.error('Currency conversion error:', error);
      
      // Handle specific known errors
      if (error instanceof Error && error.message.includes('Exchange rate not found')) {
        res.status(404).json({
          success: false,
          error: error.message
        } as ICurrencyResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to convert currency'
      } as ICurrencyResponse);
    }
  }

  // Get conversion rate history
  static async getConversionRateHistory(req: Request, res: Response): Promise<void> {
    try {
      const { fromCurrency, toCurrency, startDate, endDate } = req.query;

      // Input validation
      if (!fromCurrency || !toCurrency) {
        res.status(400).json({
          success: false,
          error: 'Both fromCurrency and toCurrency are required'
        } as ICurrencyResponse);
        return;
      }

      // Parse dates
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
      const end = endDate ? new Date(endDate as string) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid date format'
        } as ICurrencyResponse);
        return;
      }

      // This would require implementing a history method in the service
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        data: [],
        message: 'History feature coming soon'
      } as ICurrencyResponse);
    } catch (error) {
      console.error('Error fetching conversion history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversion history'
      } as ICurrencyResponse);
    }
  }
}
