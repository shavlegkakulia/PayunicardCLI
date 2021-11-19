import currencies, { GEL, RUB, RUR, USD, EUR, GBP, TRY } from "../constants/currencies";

export const CurrencyConverter = (value: string | number = "0") => {
    return parseFloat(value?.toString()).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const CurrencySimbolConverter = (currency?: string) => {
    switch (currency) {
        case GEL:
            return currencies.GEL;
        case USD:
            return currencies.USD;
        case RUB:
            return currencies.RUB;
        case RUR:
            return currencies.RUR;
        case EUR:
            return currencies.EUR;
        case GBP:
            return currencies.GBP;
        case TRY:
            return currencies.TRY;
        default: return currency;
    }
}

export const getNumber = (value: string | number | undefined) => {
    let number = 0;
    if (value === undefined) {
        number = 0;
    }

    if (typeof value === "string") {
        try {
            number = parseInt(value);
        } catch (_) {
            number = 0;
        }
    } else if (typeof value === "number") {
        number = value;
    }

    return number;
}

export const getString = (value: string | undefined) => {
    let string = '';
    if (value === undefined) {
        string = '';
    }

    if (typeof value === "string") {
        try {
            string = value;
        } catch (_) {
            string = '';
        }
    }

    return string;
}

export const getArray = (value: Array<any> | undefined) => {
    let array: any = value;
    if (value === undefined) {
        array = [];
    }

    return array;
}