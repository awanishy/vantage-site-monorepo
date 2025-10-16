import { Router } from 'express';
import { CurrencyController } from './currency.controller';

const router = Router();

// Public routes
router.get('/', CurrencyController.getAllCurrencies);
router.get('/base', CurrencyController.getBaseCurrency);
router.get('/:code', CurrencyController.getCurrencyByCode);
router.post('/convert', CurrencyController.convertCurrency);
router.get('/history/rates', CurrencyController.getConversionRateHistory);

export default router;
