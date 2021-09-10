import { storeData } from "../helpers/localStorage";


const exchangePairsReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_EXCHANGE_PAIR':
        let newPairs = [];
        if (!!state) {
          newPairs = [...state];
        }
        if (!newPairs.includes(action.formattedPair)) {
          newPairs.push(action.formattedPair);

        }
        storeData('exchangePairs', newPairs);
        return newPairs;
      case 'REMOVE_EXCHANGE_PAIR':
        let updatedPairs = [];
        if (state && state.length > 0) {
          updatedPairs = [...state];
          updatedPairs.splice(action.index, 1);
        }
        storeData('exchangePairs', updatedPairs);
        return updatedPairs;
      default:
        throw new Error('Invalid Action Type')
    }
  }

export default {
    exchangePairsReducer,
    
};