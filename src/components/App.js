// import logo from './logo.svg';
import './App.css';
import ExchangeTable from './ExchangeTable';
import ExchangeInput from './ExchangeInput';
import io from 'socket.io-client';
import { getData, storeData } from "../helpers/localStorage";
import { processMessage } from "../helpers/parseExchanges";
import React, { useEffect, useState } from 'react';

function App() {
  // Use hook for the socket and exchange pairs
  const [exchangePairs, setExchangePairs] = useState(getData('exchangePairs', []));
  const [exchanges, setExchanges] = useState(getData('exchanges', []));
  const [exchangesInitMetadata, setExchangesInitMetadata] = useState({});

  const addExchangePair = (firstCoin, secondCoin) => {
    setExchangePairs((currPairs) => {
      const newPairs = [ ...currPairs ];
      newPairs.push(`${firstCoin}${secondCoin}`);
      storeData('exchangePairs', newPairs);
      return newPairs;
    });
  }

  const deletePair = (index) => {
    setExchangePairs((currPairs) => {
      const newPairs = [ ...currPairs ];
      newPairs.splice(index, 1);
      storeData('exchangePairs', newPairs);
      return newPairs;
    });
  }

  // When page is mounted (inserted into the DOM) or updated
  useEffect(() => {
    setExchanges([{'firstCoin': 'USD', 'secondCoin': 'ILS', 'ask': 3.2}, {'firstCoin': 'USD', 'secondCoin': 'EUR', 'ask': 0.98}])

    // const newSocket = io(`${process.env.EXCHANGE_WEBSOCKET_URL}?api-key=${process.env.EXCHANGE_API_KEY}`);
    // const exchangeListener = (data) => {
    //   const parsedData = processMessage(data, exchangesInitMetadata);
    //   if (!!parsedData.initMetadata) {
    //     setExchangesInitMetadata(parsedData.initMetadata);
    //   }
    //   else if (!!parsedData.incomingData) {
    //     setExchanges(parsedData.incomingData);
    //     storeData('exchanges', parsedData.incomingData);
    //   }
    //   else {
    //     console.warn(parsedData.errResp);
    //   }
      
    // };

    // const connectionListener = function () {
    //   newSocket.send(JSON.stringify({ "pairs": exchangePairs }));
    // }

    // const onConnectionError = function (error) {
    //   console.log("Connection Error: " + error.toString());
    // };

    // newSocket.on('connect', connectionListener);
    // newSocket.on('error', onConnectionError);
    // newSocket.on('message', exchangeListener);
    // newSocket.connect();

    // // When page is about to be unmounted is destroyed
    // return () => {
    //   newSocket.off('connect', connectionListener);
    //   newSocket.off('error', onConnectionError);
    //   newSocket.off('message', exchangeListener);
    //   newSocket.close();
    // }
  }, [exchangePairs, exchangesInitMetadata]);


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
