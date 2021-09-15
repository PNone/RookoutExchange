import { storeData } from './helpers/localStorage';
import { CURRENCIES } from './helpers/parseExchanges';


export const exchangePairsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EXCHANGE_PAIR':
      let newPairs = [];
      if (!!state) {
        newPairs = [...state];
      }
      if (!newPairs.includes(action.pair)) {
        newPairs.push(action.pair);

      }
      storeData('exchangePairs', newPairs);
      return newPairs;
    case 'REMOVE_EXCHANGE_PAIR':
      let updatedPairs = [];
      if (state && state.length > 0) {
        updatedPairs = [...state];
        const index = updatedPairs.findIndex(p => p === action.pair)
        updatedPairs.splice(index, 1);
      }
      storeData('exchangePairs', updatedPairs);
      return updatedPairs;
    default:
      throw new Error('Invalid Action Type')
  }
};

export const exchangesReducer = (state, action) => {
  const exchanges = [...state];
  const firstCoin = CURRENCIES[action.pair.substring(0, 3)];
  const secondCoin = CURRENCIES[action.pair.substring(3)];
  const index = exchanges.findIndex(exchange => exchange.pair === action.pair);
  
  switch (action.type) {
    case 'ADD_OR_UPDATE_EXCHANGE':
      const exchangeData = {
        firstCoin,
        secondCoin,
        pair: action.pair,
        mid: action.mid
      };
      
      // If pair is in exchanges array, update the exchange
      if (index !== -1) {
        exchanges[index] = exchangeData;
      }
      // If the exchange is not in the array, add it
      else {
        exchanges.push(exchangeData);
      }
      storeData('exchanges', exchanges);
      return exchanges;
    case 'REMOVE_EXCHANGE':
      // If pair is in exchanges array, remove it from the array
      if (index !== -1) {
        exchanges.splice(index, 1);
      } 
      storeData('exchanges', exchanges);
      return exchanges;
    default:
      throw new Error('Invalid Action Type')
  }
};
// export const exchangesReducer = (state, action) => {
//   switch (action.type) {
//     case 'UPDATE_EXCHANGES':
//       const exchangesInitMetadata = state.exchangesInitMetadata;
//       const exchanges = action.exchanges;
//       const updatedExchanges = { exchangesInitMetadata, exchanges };
//       storeData('exchanges', exchanges);
//       return updatedExchanges;
//     case 'SET_INIT_METADATA':
//       const initMetadata = action.exchangesInitMetadata;
//       const exchangesForInit = state.exchanges;
//       const currExchanges = { exchangesInitMetadata: initMetadata, exchanges: exchangesForInit };
//       storeData('exchanges', exchangesForInit);
//       return currExchanges;
//     default:
//       throw new Error('Invalid Action Type')
//   }
// };
