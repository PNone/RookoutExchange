import './App.css';
import MaterialTable from 'material-table';
import { getData } from "../helpers/localStorage";
import { ICONS } from "../helpers/icons";
import { COLUMNS } from '../helpers/constants';
import { exchangePairsReducer, exchangesReducer } from "../reducers";
import React, { useEffect, useState, useCallback, useReducer } from 'react';



function App() {

  // Use hook for the socket and exchange pairs
  const [exchangePairs, dispatchExchangePairs] = useReducer(exchangePairsReducer, getData('exchangePairs', []));
  const [exchanges, dispatchExchanges] = useReducer(exchangesReducer, getData('exchanges', []));
  const [columns] = useState(COLUMNS);
  const [tableIcons] = useState(ICONS);

  const addExchangePair = (pair) => {
    dispatchExchangePairs({ type: 'ADD_EXCHANGE_PAIR', pair });
    dispatchExchanges({ type: 'ADD_OR_UPDATE_EXCHANGE', pair, mid: null });
  };

  const deletePair = useCallback((pair) => {
    dispatchExchangePairs({ type: 'REMOVE_EXCHANGE_PAIR', pair });
    dispatchExchanges({ type: 'REMOVE_EXCHANGE', pair });
  }, []);

  useEffect(() => {
    const newSocket = new WebSocket(process.env.REACT_APP_EXCHANGE_WEBSOCKET_URL);
    // After a connection is established, send the api key and the symbols for which we want data (We will reconnect in order to request new symols, as this is the way their socket is built)
    const connectionListener = function () {
      newSocket.send(`{"userKey":"${process.env.REACT_APP_EXCHANGE_API_KEY}", "symbol":"${exchangePairs.join(',')}"}`);
    };

    // This mechanic prevents the browser from crashing due to too many message events
    const currencyData = [];
    const flush = () => {
      for (const value of currencyData) {
        // Message structure is as such that if it begins with a '{' character it is a JSON, otherwise, it is data related to a differnt event
        const data = value && value[0] === '{' ? JSON.parse(value) : null;
        if (data && exchangePairs.includes(data.symbol)) {
          dispatchExchanges({ type: 'ADD_OR_UPDATE_EXCHANGE', pair: data.symbol, mid: data.mid });
        }
      }
      // Clean the data in the temporary data array
      currencyData.splice(0);
    };
    // Every 15 seconds, process the data of the messages recieved during the last REACT_APP_MESSAGE_INTERVAL milliseconds
    const timer = setInterval(flush, process.env.REACT_APP_MESSAGE_INTERVAL);

    // When a message is recieved push it to the currencyData array, which will be processed by the flush function which will be called using the timer.
    const onMessage = function (message) {
      currencyData.push(message.data);
    };

    const onConnectionError = function (error) {
      console.warn("Connection Error: " + error.toString());
    };

    newSocket.onopen = connectionListener;
    newSocket.onerror = onConnectionError;
    newSocket.onmessage = onMessage;
    return () => {
      clearInterval(timer);
      newSocket.close();
      flush();
    };
  }, [exchangePairs]);

  return (
    <div className="App">
      <MaterialTable
        title="Exchanges"
        columns={columns}
        data={exchanges}
        icons={tableIcons}
        editable={{
          onRowAdd: (newPair) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if (exchangePairs.includes(newPair.pair)) {
                  reject('Pair is already in subscriptions.');
                }
                else if (exchangePairs.length >= 10){
                  reject('Server supports up to 10 pairs.');
                }
                else {
                  addExchangePair(newPair.pair);
                  resolve();
                }
              }, 1000)
            }),
          onRowDelete: (pairToRemove) =>
            new Promise(resolve => {
              setTimeout(() => {
                const pair = pairToRemove.pair;
                deletePair(pair);
                resolve();
              }, 1000)
            })
        }}
      />
    </div>
  );
}

export default App;
