export const CURRENCIES = {
    'AUD': 'Austalian Dollar',
    'BGN': 'Bulgarian Lev',
    'BRL': 'Brazilian Real',
    'BTC': 'Bitcoin',
    'CAD': 'Canadian Dollar',
    'CHF': 'Swiss Franc',
    'CNH': 'Chinese Yuan',
    'CNY': 'Chinese Yuan',
    'CZK': 'Czech Koruna',
    'DKK': 'Danish Krone',
    'ETH': 'Ethereum',
    'EUR': 'Euro',
    'GBP': 'Pound Sterling',
    'HKD': 'Hong Kong Dollar',
    'HUF': 'Hungarian Forint',
    'ILS': 'Israeli New Shekel',
    'INR': 'Indian Rupee',
    'JPY': 'Japanese Yen',
    'LTC': 'Litecoin',
    'MXN': 'Mexican Peso',
    'NOK': 'Norwegian Krone',
    'NZD': 'New Zealand Dollar',
    'PLN': 'Polish Zloty',
    'RON': 'Romanian Leu',
    'RUB': 'Russian Ruble',
    'SEK': 'Swedish Krona',
    'SGD': 'Singapore Dollar',
    'TRY': 'Turkish Lira',
    'UAH': 'Ukrainian Hryvnia',
    'USD': 'United States Dollar',
    'XAG': 'Silver (troy ounce)',
    'XAU': 'Gold (troy ounce)',
    'XPD': 'Palladium',
    'ZAR': 'South African Rand',

}

export const AVAILABLE_PAIRS = {
    'USDJPY': 'US Dollar	Japanese Yen',
    'EURUSD': 'Euro	US Dollar',
    'USDMXN': 'US Dollar	Mexican Peso',
    'GBPUSD': 'British Pound Sterling	US Dollar',
    'EURMXN': 'Euro	Mexican Peso',
    'USDCHF': 'US Dollar	Swiss Franc',
    'USDPLN': 'US Dollar	Polish Zloty',
    'USDCAD': 'US Dollar	Canadian Dollar',
    'EURPLN': 'Euro	Polish Zloty',
    'AUDUSD': 'Australian Dollar	US Dollar',
    'USDTRY': 'US Dollar	Turkish Lira',
    'NZDUSD': 'New Zealand Dollar	US Dollar',
    'EURTRY': 'Euro	Turkish Lira',
    'EURGBP': 'Euro	British Pound Sterling',
    'EURJPY': 'Euro	Japanese Yen',
    'USDCNH': 'US Dollar	Chinese Yuan',
    'EURCHF': 'Euro	Swiss Franc',
    'USDHKD': 'US Dollar	Hong Kong Dollar',
    'EURAUD': 'Euro	Australian Dollar',
    'USDSGD': 'US Dollar	Singapore Dollar',
    'EURCAD': 'Euro	Canadian Dollar',
    'SGDJPY': 'Singapore Dollar	Japanese Yen',
    'EURNZD': 'Euro	New Zealand Dollar',
    'USDHUF': 'US Dollar	Hungarian Forint',
    'GBPJPY': 'British Pound Sterling	Japanese Yen',
    'EURHUF': 'Euro	Hungarian Forint',
    'GBPCHF': 'British Pound Sterling	Swiss Franc',
    'USDZAR': 'US Dollar	South African Rand',
    'BTCJPY': 'Bitcoin	Japanese Yen',
    'BTCUSD': 'Bitcoin	US Dollar',
    'GBPCAD': 'British Pound Sterling	Canadian Dollar',
    'EURZAR': 'Euro	South African Rand',
    'BTCEUR': 'Bitcoin	Euro',
    'GBPAUD': 'British Pound Sterling	Australian Dollar',
    'ETHUSD': 'Ethereum	US Dollar',
    'GBPNZD': 'British Pound Sterling	New Zealand Dollar',
    'ZARJPY': 'South African Rand	Japanese Yen',
    'LTCUSD': 'Litecoin	US Dollar',
    'NZDJPY': 'New Zealand Dollar	Japanese Yen',
    'USDSEK': 'US Dollar	Swedish Krona',
    'XAUUSD': 'Gold (troy ounce)	US Dollar',
    'XRPUSD': '	US Dollar',
    'NZDCAD': 'New Zealand Dollar	Canadian Dollar',
    'EURSEK': 'Euro	Swedish Krona',
    'XAGUSD': 'Silver (troy ounce)	US Dollar',
    'NZDCHF': 'New Zealand Dollar	Swiss Franc',
    'USDNOK': 'US Dollar	Norwegian Krone',
    'XAUEUR': 'Gold (troy ounce)	Euro',
    'AUDJPY': 'Australian Dollar	Japanese Yen',
    'EURNOK': 'Euro	Norwegian Krone',
    'XAGEUR': 'Silver (troy ounce)	Euro',
    'AUDCAD': 'Australian Dollar	Canadian Dollar',
    'XPTUSD': 'Platinum	US Dollar',
    'AUDCHF': 'Australian Dollar	Swiss Franc',
    'EURDKK': 'Euro	Danish Krone',
    'XPDUSD': 'Palladium	US Dollar',
    'AUDNZD': 'Australian Dollar	New Zealand Dollar',
    'NOKSEK': 'Norwegian Krone	Swedish Krona',
    'CADJPY': 'Canadian Dollar	Japanese Yen',
    'NOKJPY': 'Norwegian Krone	Japanese Yen',
    'CADCHF': 'Canadian Dollar	Swiss Franc',
    'USDRUB': 'US Dollar	Russian Ruble'
}

function unpackInit(data) {
    return JSON.parse(data);
};

function unpackErrPair(data) {
    return JSON.parse(data);
};

function unpackData(data, initMetadata) {
    const inc = data.split('|');
    const out = {};
    for (let i in initMetadata.order) {
        out[initMetadata.order[i]] = inc[i];
    };
    out['firstCoin'] = CURRENCIES[initMetadata.mapping[out['name']].substring(0, 3)];
    out['secondCoin'] = CURRENCIES[initMetadata.mapping[out['name']].substring(3)];
    out['ask'] = initMetadata.mapping[out['ask']];
    // out["name"] = initMetadata.mapping[out['name']];
    // out["time"] = parseFloat(out["time"]) / initMetadata.time_mult;
    // out["time"] += initMetadata.start_time;
    return out;
};

export function processMessage(data, initMetadata = {}) {
    const messageType = data.substring(0, 1);
    const msg = data.substring(1);
    const response = { 'initMetadata': null, 'incomingData': null, 'errResp': null };
    switch (messageType) {
        // Initial message
        case '0':
            response.initMetadata = unpackInit(msg);
            break;
        // Errors
        case '7':
        case '8':
        case '9':
            response.errResp = unpackErrPair(msg);
            break;
        // Currency rate update
        case '1':
            response.incomingData = unpackData(msg, initMetadata);
            break;
        // Ping
        case '2':
            break;
        default:
            break;
    }
    return response;
}