import axios from "axios";
import { Currency, CurrencyRate } from "./currency.model";
import { ICurrencyConversion, ICurrency } from "@/types/currency.types";

export class CurrencyService {
  private static instance: CurrencyService;
  private refreshIntervalInHours = 24; // Update every 24 hours
  private retryDelayInMinutes = 30;
  private API_URL =
    process.env.EXCHANGE_RATE_API_URL ||
    "https://api.exchangerate-api.com/v4/latest/USD";
  private BASE_CURRENCY = process.env.EXCHANGE_BASE_CURRENCY || "USD";

  private constructor() {
    this.initialize();
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private async initialize(): Promise<void> {
    try {
      await this.ensureInitialCurrencies();
      await this.scheduleNextUpdate();
    } catch (error) {
      console.error("Failed to initialize CurrencyService:", error);
      setTimeout(() => this.initialize(), this.retryDelayInMinutes * 60 * 1000);
    }
  }

  private async ensureInitialCurrencies(): Promise<void> {
    const initialCurrencies = [
      {
        code: "INR",
        name: "Indian Rupee",
        symbol: "₹",
        flag: "/flags/in.svg",
      },
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        flag: "/flags/us.svg",
        isBase: true,
      },
      { code: "EUR", name: "Euro", symbol: "€", flag: "/flags/eu.svg" },
      {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        flag: "/flags/gb.svg",
        ifActive: false,
      },
      {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
        flag: "/flags/ca.svg",
      },
      {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        flag: "/flags/au.svg",
      },
      {
        code: "NZD",
        name: "New Zealand Dollar",
        symbol: "NZ$",
        flag: "/flags/nz.svg",
      },
      {
        code: "SGD",
        name: "Singapore Dollar",
        symbol: "S$",
        flag: "/flags/sg.svg",
      },
      {
        code: "HKD",
        name: "Hong Kong Dollar",
        symbol: "HK$",
        flag: "/flags/hk.svg",
      },
      { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "/flags/ae.svg" },
      { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "/flags/jp.svg" },
      { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "/flags/cn.svg" },
      {
        code: "KRW",
        name: "South Korean Won",
        symbol: "₩",
        flag: "/flags/kr.svg",
      },
      { code: "THB", name: "Thai Baht", symbol: "฿", flag: "/flags/th.svg" },
      {
        code: "MYR",
        name: "Malaysian Ringgit",
        symbol: "RM",
        flag: "/flags/my.svg",
      },
      {
        code: "PHP",
        name: "Philippine Peso",
        symbol: "₱",
        flag: "/flags/ph.svg",
      },
      {
        code: "IDR",
        name: "Indonesian Rupiah",
        symbol: "Rp",
        flag: "/flags/id.svg",
      },
      {
        code: "VND",
        name: "Vietnamese Dong",
        symbol: "₫",
        flag: "/flags/vn.svg",
      },
      {
        code: "BRL",
        name: "Brazilian Real",
        symbol: "R$",
        flag: "/flags/br.svg",
      },
      { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "/flags/mx.svg" },
      {
        code: "ZAR",
        name: "South African Rand",
        symbol: "R",
        flag: "/flags/za.svg",
      },
      {
        code: "CHF",
        name: "Swiss Franc",
        symbol: "CHF",
        flag: "/flags/ch.svg",
      },
      {
        code: "NOK",
        name: "Norwegian Krone",
        symbol: "kr",
        flag: "/flags/no.svg",
      },
      {
        code: "SEK",
        name: "Swedish Krona",
        symbol: "kr",
        flag: "/flags/se.svg",
      },
      {
        code: "DKK",
        name: "Danish Krone",
        symbol: "kr",
        flag: "/flags/dk.svg",
      },
      {
        code: "PLN",
        name: "Polish Zloty",
        symbol: "zł",
        flag: "/flags/pl.svg",
      },
      {
        code: "CZK",
        name: "Czech Koruna",
        symbol: "Kč",
        flag: "/flags/cz.svg",
      },
      {
        code: "HUF",
        name: "Hungarian Forint",
        symbol: "Ft",
        flag: "/flags/hu.svg",
      },
      {
        code: "RUB",
        name: "Russian Ruble",
        symbol: "₽",
        flag: "/flags/ru.svg",
      },
      { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "/flags/tr.svg" },
      {
        code: "ILS",
        name: "Israeli Shekel",
        symbol: "₪",
        flag: "/flags/il.svg",
      },
      { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "/flags/sa.svg" },
      { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "/flags/qa.svg" },
      {
        code: "KWD",
        name: "Kuwaiti Dinar",
        symbol: "د.ك",
        flag: "/flags/kw.svg",
      },
      {
        code: "BHD",
        name: "Bahraini Dinar",
        symbol: "د.ب",
        flag: "/flags/bh.svg",
      },
      { code: "OMR", name: "Omani Rial", symbol: "﷼", flag: "/flags/om.svg" },
      {
        code: "JOD",
        name: "Jordanian Dinar",
        symbol: "د.ا",
        flag: "/flags/jo.svg",
      },
      {
        code: "LBP",
        name: "Lebanese Pound",
        symbol: "ل.ل",
        flag: "/flags/lb.svg",
      },
      {
        code: "EGP",
        name: "Egyptian Pound",
        symbol: "£",
        flag: "/flags/eg.svg",
      },
      {
        code: "MAD",
        name: "Moroccan Dirham",
        symbol: "د.م.",
        flag: "/flags/ma.svg",
      },
      {
        code: "TND",
        name: "Tunisian Dinar",
        symbol: "د.ت",
        flag: "/flags/tn.svg",
      },
      {
        code: "DZD",
        name: "Algerian Dinar",
        symbol: "د.ج",
        flag: "/flags/dz.svg",
      },
      {
        code: "LYD",
        name: "Libyan Dinar",
        symbol: "ل.د",
        flag: "/flags/ly.svg",
      },
      {
        code: "SDG",
        name: "Sudanese Pound",
        symbol: "ج.س.",
        flag: "/flags/sd.svg",
      },
      {
        code: "ETB",
        name: "Ethiopian Birr",
        symbol: "Br",
        flag: "/flags/et.svg",
      },
      {
        code: "KES",
        name: "Kenyan Shilling",
        symbol: "KSh",
        flag: "/flags/ke.svg",
      },
      {
        code: "UGX",
        name: "Ugandan Shilling",
        symbol: "USh",
        flag: "/flags/ug.svg",
      },
      {
        code: "TZS",
        name: "Tanzanian Shilling",
        symbol: "TSh",
        flag: "/flags/tz.svg",
      },
      {
        code: "RWF",
        name: "Rwandan Franc",
        symbol: "RF",
        flag: "/flags/rw.svg",
      },
      {
        code: "BIF",
        name: "Burundian Franc",
        symbol: "FBu",
        flag: "/flags/bi.svg",
      },
      {
        code: "DJF",
        name: "Djiboutian Franc",
        symbol: "Fdj",
        flag: "/flags/dj.svg",
      },
      {
        code: "SOS",
        name: "Somali Shilling",
        symbol: "S",
        flag: "/flags/so.svg",
      },
      {
        code: "ERN",
        name: "Eritrean Nakfa",
        symbol: "Nfk",
        flag: "/flags/er.svg",
      },
      {
        code: "SSP",
        name: "South Sudanese Pound",
        symbol: "£",
        flag: "/flags/ss.svg",
      },
      {
        code: "CDF",
        name: "Congolese Franc",
        symbol: "FC",
        flag: "/flags/cd.svg",
      },
      {
        code: "AOA",
        name: "Angolan Kwanza",
        symbol: "Kz",
        flag: "/flags/ao.svg",
      },
      {
        code: "ZMW",
        name: "Zambian Kwacha",
        symbol: "ZK",
        flag: "/flags/zm.svg",
      },
      {
        code: "BWP",
        name: "Botswana Pula",
        symbol: "P",
        flag: "/flags/bw.svg",
      },
      {
        code: "SZL",
        name: "Swazi Lilangeni",
        symbol: "L",
        flag: "/flags/sz.svg",
      },
      { code: "LSL", name: "Lesotho Loti", symbol: "L", flag: "/flags/ls.svg" },
      {
        code: "NAD",
        name: "Namibian Dollar",
        symbol: "N$",
        flag: "/flags/na.svg",
      },
      {
        code: "MZN",
        name: "Mozambican Metical",
        symbol: "MT",
        flag: "/flags/mz.svg",
      },
      {
        code: "MWK",
        name: "Malawian Kwacha",
        symbol: "MK",
        flag: "/flags/mw.svg",
      },
      {
        code: "ZWL",
        name: "Zimbabwean Dollar",
        symbol: "Z$",
        flag: "/flags/zw.svg",
      },
      {
        code: "MGA",
        name: "Malagasy Ariary",
        symbol: "Ar",
        flag: "/flags/mg.svg",
      },
      {
        code: "MUR",
        name: "Mauritian Rupee",
        symbol: "₨",
        flag: "/flags/mu.svg",
      },
      {
        code: "SCR",
        name: "Seychellois Rupee",
        symbol: "₨",
        flag: "/flags/sc.svg",
      },
      {
        code: "KMF",
        name: "Comorian Franc",
        symbol: "CF",
        flag: "/flags/km.svg",
      },
      {
        code: "MVR",
        name: "Maldivian Rufiyaa",
        symbol: "Rf",
        flag: "/flags/mv.svg",
      },
      {
        code: "LKR",
        name: "Sri Lankan Rupee",
        symbol: "₨",
        flag: "/flags/lk.svg",
      },
      {
        code: "NPR",
        name: "Nepalese Rupee",
        symbol: "₨",
        flag: "/flags/np.svg",
      },
      {
        code: "BTN",
        name: "Bhutanese Ngultrum",
        symbol: "Nu.",
        flag: "/flags/bt.svg",
      },
      {
        code: "BDT",
        name: "Bangladeshi Taka",
        symbol: "৳",
        flag: "/flags/bd.svg",
      },
      {
        code: "PKR",
        name: "Pakistani Rupee",
        symbol: "₨",
        flag: "/flags/pk.svg",
      },
      {
        code: "AFN",
        name: "Afghan Afghani",
        symbol: "؋",
        flag: "/flags/af.svg",
      },
      {
        code: "TJS",
        name: "Tajikistani Somoni",
        symbol: "SM",
        flag: "/flags/tj.svg",
      },
      {
        code: "UZS",
        name: "Uzbekistani Som",
        symbol: "лв",
        flag: "/flags/uz.svg",
      },
      {
        code: "KGS",
        name: "Kyrgyzstani Som",
        symbol: "лв",
        flag: "/flags/kg.svg",
      },
      {
        code: "KZT",
        name: "Kazakhstani Tenge",
        symbol: "₸",
        flag: "/flags/kz.svg",
      },
      {
        code: "TMT",
        name: "Turkmenistani Manat",
        symbol: "T",
        flag: "/flags/tm.svg",
      },
      {
        code: "AZN",
        name: "Azerbaijani Manat",
        symbol: "₼",
        flag: "/flags/az.svg",
      },
      {
        code: "GEL",
        name: "Georgian Lari",
        symbol: "₾",
        flag: "/flags/ge.svg",
      },
      {
        code: "AMD",
        name: "Armenian Dram",
        symbol: "֏",
        flag: "/flags/am.svg",
      },
    ];

    // Set only the configured base currency as base
    for (const currency of initialCurrencies) {
      const isUsdOrInr =
        currency.code === "USD" ||
        currency.code === "INR" ||
        currency.code === "GBP" ||
        currency.code === "EUR";
      await Currency.findOneAndUpdate(
        { code: currency.code },
        {
          ...currency,
          isBase: currency.code === this.BASE_CURRENCY,
          isActive: isUsdOrInr,
        },
        { upsert: true }
      );
    }
  }

  private async scheduleNextUpdate(): Promise<void> {
    const lastRate = await CurrencyRate.findOne().sort({ exchangeDate: -1 });
    const now = new Date();

    if (
      !lastRate ||
      now.getTime() - lastRate.exchangeDate.getTime() >
        this.refreshIntervalInHours * 3600 * 1000
    ) {
      await this.fetchAndStoreRates();
    }

    // Schedule next update
    setTimeout(
      () => this.scheduleNextUpdate(),
      this.refreshIntervalInHours * 3600 * 1000
    );
  }

  private async fetchAndStoreRates(): Promise<void> {
    try {
      const response = await axios.get(this.API_URL);
      const rates = response.data.rates;
      const exchangeDate = new Date();

      // Get all active currencies
      const activeCurrencies = await Currency.find({ isActive: true });
      const currencyCodes = activeCurrencies.map((c) => c.code);

      // Purge non-base anchored pairs to keep only BASE -> target in storage
      await CurrencyRate.deleteMany({
        fromCurrency: { $ne: this.BASE_CURRENCY },
      });

      // Store only BASE -> target pairs
      for (const toCurrency of currencyCodes) {
        if (toCurrency === this.BASE_CURRENCY) continue;
        const baseToTarget = rates[toCurrency] || 1;
        await CurrencyRate.create({
          exchangeDate,
          fromCurrency: this.BASE_CURRENCY,
          toCurrency,
          exchangeRate: baseToTarget,
        });
      }

      // After successful insert, delete any older snapshots
      await CurrencyRate.deleteMany({ exchangeDate: { $lt: exchangeDate } });

      console.log(`Successfully updated currency rates at ${exchangeDate}`);
    } catch (error) {
      console.error("Failed to fetch currency rates:", error);
      throw error;
    }
  }

  public async convertCurrency(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    date?: Date
  ): Promise<ICurrencyConversion> {
    if (fromCurrency === toCurrency) {
      return {
        fromCurrency,
        toCurrency,
        originalAmount: amount,
        convertedAmount: amount,
        conversionDate: date || new Date(),
        rate: 1,
      };
    }

    const conversionDate = date || new Date();

    const FROM = fromCurrency.toUpperCase();
    const TO = toCurrency.toUpperCase();
    const BASE = this.BASE_CURRENCY.toUpperCase();

    // Helper to fetch BASE -> X
    const getBaseTo = async (code: string) => {
      const doc = await CurrencyRate.findOne({
        fromCurrency: BASE,
        toCurrency: code,
        exchangeDate: { $lte: conversionDate },
      }).sort({ exchangeDate: -1 });
      if (!doc) {
        throw new Error(`Base rate not found for ${BASE} to ${code}`);
      }
      return doc.exchangeRate;
    };

    let rate: number;
    if (FROM === BASE) {
      // BASE -> TO
      rate = await getBaseTo(TO);
    } else if (TO === BASE) {
      // FROM -> BASE (invert BASE -> FROM)
      const baseToFrom = await getBaseTo(FROM);
      rate = 1 / baseToFrom;
    } else {
      // Cross via BASE: FROM -> BASE -> TO = (BASE->TO) / (BASE->FROM)
      const [baseToTo, baseToFrom] = await Promise.all([
        getBaseTo(TO),
        getBaseTo(FROM),
      ]);
      rate = baseToTo / baseToFrom;
    }

    const convertedAmount = amount * rate;

    return {
      fromCurrency,
      toCurrency,
      originalAmount: amount,
      convertedAmount: Number(convertedAmount.toFixed(4)),
      conversionDate,
      rate,
    };
  }

  public async getAllCurrencies(): Promise<ICurrency[]> {
    return await Currency.find({ isActive: true }).sort({ code: 1 });
  }

  public async getCurrencyByCode(code: string): Promise<ICurrency | null> {
    return await Currency.findOne({ code: code.toUpperCase(), isActive: true });
  }

  public async getBaseCurrency(): Promise<ICurrency | null> {
    return await Currency.findOne({ isBase: true });
  }
}
