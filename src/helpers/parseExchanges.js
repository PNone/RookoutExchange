export const CURRENCIES = {
    'AUD': 'Austalian Dollar',
    'BGN': 'Bulgarian Lev',
    'BRL': 'Brazilian Real',
    'CAD': 'Canadian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'CZK': 'Czech Koruna',
    'DKK': 'Danish Krone',
    'EUR': 'Euro',
    'GBP': 'Pound Sterling',
    'HKD': 'Hong Kong Dollar',
    'HUF': 'Hungarian Forint',
    'ILS': 'Israeli New Shekel',
    'INR': 'Indian Rupee',
    'JPY': 'Japanese Yen',
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
    'ZAR': 'South African Rand'
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