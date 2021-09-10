// import logo from './logo.svg';
import './App.css';
import ExchangeTable from './ExchangeTable';
import ExchangeInput from './ExchangeInput';
import io from 'socket.io-client';
import { getData, storeData } from "../helpers/localStorage";
import { processMessage } from "../helpers/parseExchanges";
import React, { useEffect, useState, useCallback, useReducer } from 'react';

function App() {
  



  // Use hook for the socket and exchange pairs
  const [exchangePairs, dispatchexchangePairs] = useReducer(exchangePairsReducer, getData('exchangePairs', []));// useState(getData('exchangePairs', []));
  const [exchanges, setExchanges] = useState(getData('exchanges', []));
  const [exchangesInitMetadata, setExchangesInitMetadata] = useState({});
  // TODO Remove
  const totalExchanges = [{ 'firstCoin': 'USD', 'secondCoin': 'ILS', 'ask': 3.2 }, { 'firstCoin': 'USD', 'secondCoin': 'EUR', 'ask': 0.98 }];

  const addExchangePair = useCallback((firstCoin, secondCoin) => {
    const formattedPair = `${firstCoin}${secondCoin}`;
    dispatchexchangePairs({ type: 'ADD_EXCHANGE_PAIR', formattedPair });
    // setExchangePairs((currPairs) => {
    //   let newPairs = [];
    //   if (!!currPairs) {
    //     newPairs = [...currPairs];
    //   }
    //   const formattedPair = `${firstCoin}${secondCoin}`;
    //   if (!newPairs.includes(formattedPair)) {
    //     newPairs.push(formattedPair);
    //     storeData('exchangePairs', newPairs);
    //     return newPairs;
    //   }
    // });
  }, []);

  // TODO Remove
  // const addExchange = (firstCoin, secondCoin)  => {
  //   setExchanges(() => [{'firstCoin': firstCoin, 'secondCoin': secondCoin, 'ask': 3.2}]);
  // }

  const deletePair = useCallback((index) => {
    dispatchexchangePairs({ type: 'REMOVE_EXCHANGE_PAIR', index });
    // setExchangePairs((currPairs) => {
    //   let newPairs = [];
    //   if (currPairs && currPairs.length > 0) {
    //     newPairs = [...currPairs];
    //     newPairs.splice(index, 1);
    //   }
    //   if (!currPairs || currPairs.length !== newPairs.length) {
    //     storeData('exchangePairs', newPairs);
    //     return newPairs;
    //   }
    // });
  }, []);

  // TODO Uncomment
  // // When page is mounted (inserted into the DOM) or updated
  // useEffect(() => {

  //   const newSocket = io(`${process.env.EXCHANGE_WEBSOCKET_URL}?api-key=${process.env.EXCHANGE_API_KEY}`);
  //   const exchangeListener = (data) => {
  //     const parsedData = processMessage(data, exchangesInitMetadata);
  //     if (!!parsedData.initMetadata) {
  //       setExchangesInitMetadata(parsedData.initMetadata);
  //     }
  //     else if (!!parsedData.incomingData) {
  //       setExchanges(parsedData.incomingData);
  //       storeData('exchanges', parsedData.incomingData);
  //     }
  //     else {
  //       console.warn(parsedData.errResp);
  //     }

  //   };

  //   const connectionListener = function () {
  //     newSocket.send(JSON.stringify({ "pairs": exchangePairs }));
  //   }

  //   const onConnectionError = function (error) {
  //     console.log("Connection Error: " + error.toString());
  //   };

  //   newSocket.on('connect', connectionListener);
  //   newSocket.on('error', onConnectionError);
  //   newSocket.on('message', exchangeListener);
  //   newSocket.connect();

  //   // When page is about to be unmounted is destroyed
  //   return () => {
  //     newSocket.off('connect', connectionListener);
  //     newSocket.off('error', onConnectionError);
  //     newSocket.off('message', exchangeListener);
  //     newSocket.close();
  //   }
  // }, [exchangePairs, exchangesInitMetadata]);


  // TODO Remove addExchange
  return (
    <div className="App">
      <ExchangeTable deletePair={deletePair} data={exchanges} />
      <ExchangeInput addExchangePair={addExchangePair} />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
