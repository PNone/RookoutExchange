// import logo from './logo.svg';
import './App.css';
import ExchangeTable from './ExchangeTable';
import ExchangeInput from './ExchangeInput';
import io from 'socket.io-client';
import { getData, storeData } from "../helpers/localStorage";
import { processMessage } from "../helpers/parseExchanges";
import { exchangePairsReducer } from "../reducers";
import React, { useEffect, useState, useCallback, useReducer } from 'react';

function App() {
  
  // Use hook for the socket and exchange pairs
  const [exchangePairs, dispatchExchangePairs] = useReducer(exchangePairsReducer, getData('exchangePairs', []));
  const [exchanges, setExchanges] = useState(getData('exchanges', []));
  const [exchangesInitMetadata, setExchangesInitMetadata] = useState({});

  const addExchangePair = useCallback((firstCoin, secondCoin) => {
    const formattedPair = `${firstCoin}${secondCoin}`;
    dispatchExchangePairs({ type: 'ADD_EXCHANGE_PAIR', formattedPair });
  }, []);

  const deletePair = useCallback((index) => {
    dispatchExchangePairs({ type: 'REMOVE_EXCHANGE_PAIR', index });
  }, []);

  // When page is mounted (inserted into the DOM) or updated
  useEffect(() => {

    const newSocket = io(`${process.env.EXCHANGE_WEBSOCKET_URL}?api-key=${process.env.EXCHANGE_API_KEY}`);
    const exchangeListener = (data) => {
      const parsedData = processMessage(data, exchangesInitMetadata);
      if (!!parsedData.initMetadata) {
        setExchangesInitMetadata(parsedData.initMetadata);
      }
      else if (!!parsedData.incomingData) {
        setExchanges(parsedData.incomingData);
        storeData('exchanges', parsedData.incomingData);
      }
      else {
        console.warn(parsedData.errResp);
      }

    };

    const connectionListener = function () {
      newSocket.send(JSON.stringify({ "pairs": exchangePairs }));
    }

    const onConnectionError = function (error) {
      console.log("Connection Error: " + error.toString());
    };

    newSocket.on('connect', connectionListener);
    newSocket.on('error', onConnectionError);
    newSocket.on('message', exchangeListener);
    newSocket.connect();

    // When page is about to be unmounted is destroyed
    return () => {
      newSocket.off('connect', connectionListener);
      newSocket.off('error', onConnectionError);
      newSocket.off('message', exchangeListener);
      newSocket.close();
    }
  }, [exchangePairs, exchangesInitMetadata]);

  return (
    <div className="App">
      <ExchangeTable deletePair={deletePair} data={exchanges} />
      <ExchangeInput addExchangePair={addExchangePair} />
    </div>
  );
}

export default App;
