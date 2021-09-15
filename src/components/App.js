// import logo from './logo.svg';
import './App.css';
// import ExchangeTable from './ExchangeTable';
// import ExchangeInput from './ExchangeInput';
import MaterialTable from 'material-table';
import { io } from 'socket.io-client';
import { getData, storeData } from "../helpers/localStorage";
import { processMessage, AVAILABLE_PAIRS } from "../helpers/parseExchanges";
import { exchangePairsReducer, exchangesReducer } from "../reducers";
import React, { useEffect, useState, useCallback, useReducer, forwardRef } from 'react';
import { alpha } from '@material-ui/core/styles'

import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn } from '@material-ui/icons';

function App() {

  // Use hook for the socket and exchange pairs
  const [exchangePairs, dispatchExchangePairs] = useReducer(exchangePairsReducer, getData('exchangePairs', []));
  // const [exchanges, dispatchExchanges] = useReducer(exchangesReducer, { exchanges: getData('exchanges', []), exchangesInitMetadata: {} });
  const [socket, setSocket] = useState(
    null
  );
  const [exchanges, dispatchExchanges] = useReducer(exchangesReducer, getData('exchanges', []));
  // const [exchanges, setExchanges] = useState(getData('exchanges', []));
  // const [exchangesInitMetadata, setExchangesInitMetadata] = useState({});
  const [columns] = useState([
    {
      title: 'Currency Pair',
      field: 'pair',
      lookup: AVAILABLE_PAIRS,
      editable: 'onAdd'
    },
    {
      title: 'First Coin',
      field: 'firstCoin',
      // lookup: CURRENCIES,
      editable: 'never'
    },
    {
      title: 'Second Coin',
      field: 'secondCoin',
      // lookup: CURRENCIES,
      editable: 'never'
    },
    {
      title: 'Rate',
      field: 'mid',
      type: 'numeric',
      editable: 'never'
    }
  ]);
  const [tableIcons] = useState({
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  });

  const addExchangePair = (pair) => {
    dispatchExchangePairs({ type: 'ADD_EXCHANGE_PAIR', pair });
    socket.emit("symbolSub", { symbol: pair });
  };

  const deletePair = useCallback((pair) => {
    dispatchExchangePairs({ type: 'REMOVE_EXCHANGE_PAIR', pair });
    dispatchExchanges({ type: 'REMOVE_EXCHANGE', pair });
  }, []);

  // When page is mounted (inserted into the DOM)
  useEffect(() => {
    // const newSocket = io(process.env.REACT_APP_EXCHANGE_WEBSOCKET_URL, {
    //   path: process.env.REACT_APP_EXCHANGE_WEBSOCKET_PATH,
    //   query: {
    //     'api-key': process.env.REACT_APP_EXCHANGE_API_KEY
    //   },
    //   reconnectionAttempts: 5,
    //   reconnectionDelay: 1 * 60 * 1000 // 1 Minute (1000 milliseconds in a second, 60 seconds in a minute)
    // });
    
    // const newSocket = new WebSocket(`${process.env.REACT_APP_EXCHANGE_WEBSOCKET_URL}?api-key=${process.env.REACT_APP_EXCHANGE_API_KEY}`);

    // const exchangeListener = (data) => {
    //   const parsedData = processMessage(data, exchanges.exchangesInitMetadata);
    //   if (!!parsedData.initMetadata) {
    //     dispatchExchanges({ type: 'SET_INIT_METADATA', exchangesInitMetadata: parsedData.initMetadata });
    //   }
    //   else if (!!parsedData.incomingData) {
    //     dispatchExchanges({ type: 'UPDATE_EXCHANGES', exchanges: parsedData.incomingData });
    //   }
    //   else {
    //     console.warn(parsedData.errResp);
    //   }
    // };
    const newSocket = io(process.env.REACT_APP_EXCHANGE_WEBSOCKET_URL, {
      // forceNew: true,
      // reconnection: true,
      transports: ['websocket']
    });
    
    const connectionListener = function () {
      newSocket.emit('login', { userKey: process.env.REACT_APP_EXCHANGE_API_KEY });
    };

    const disconnectListener = function (msg) {
      console.log(msg);
    };

    // const onConnectionError = function (error) {
    //   console.log("Connection Error: " + error.toString());
    // };
    // const connectionListener = function () {
    //   newSocket.send(JSON.stringify({ "pairs": exchangePairs }));
    // }

    const onConnectionError = function (error) {
      console.log("Connection Error: " + error.toString());
    };

    // newSocket.on('connect', connectionListener);
    // newSocket.on('error', onConnectionError);
    // // newSocket.on('message', exchangeListener);
    // newSocket.connect();
    // newSocket.onopen = connectionListener;
    // newSocket.onerror = onConnectionError;
    newSocket.on('connect', connectionListener);
    newSocket.on('disconnect', disconnectListener);
    newSocket.on('error', onConnectionError);
    // newSocket.on('message', exchangeListener);
    newSocket.send('connect')
    newSocket.open();
    setSocket(newSocket);
    // When page is about to be unmounted and destroyed
    return () => {
      newSocket.off('connect', connectionListener);
      newSocket.off('disconnect', disconnectListener);
      newSocket.off('error', onConnectionError);
      // newSocket.off('connect', connectionListener);
      // newSocket.off('error', onConnectionError);
      // newSocket.off('message', exchangeListener);
      newSocket.close();
    }
  }, []);

  useEffect(() => {
    const priceListener = function (message) {
      const data = message.split(' ');
      // If the user is currently subsribed to this exchange (in exchange pairs), update it (or add it)
      if (exchangePairs && exchangePairs.includes(data[0])) {
        dispatchExchanges({ type: 'ADD_OR_UPDATE_EXCHANGE', pair: data[0], mid: data[3] });
      }
    };
    if (socket) {
      socket.on('price', priceListener);
    }

    return () => {
      if (socket) {
        socket.off('price', priceListener);
      }
    }
  }, [socket, exchangePairs]);

  // // When page is mounted (inserted into the DOM) or when either the page or socket/exchangesInitMetadata are updated
  // useEffect(() => {
  //   const exchangeListener = (event) => {
  //     const data = event.data;
  //     const parsedData = processMessage(data, exchangesInitMetadata);
  //     if (!!parsedData.initMetadata) {
  //       setExchangesInitMetadata(parsedData.initMetadata);
  //       // dispatchExchanges({ type: 'SET_INIT_METADATA', exchangesInitMetadata: parsedData.initMetadata });
  //     }
  //     else if (!!parsedData.incomingData) {
  //       setExchanges(parsedData.incomingData);
  //       storeData('exchanges', parsedData.incomingData);
  //       // dispatchExchanges({ type: 'UPDATE_EXCHANGES', exchanges: parsedData.incomingData });
  //     }
  //     else {
  //       console.warn(parsedData.errResp);
  //     }
  //   };

  //   // const connectionListener = function () {
  //   //   socket.send(JSON.stringify({ "pairs": exchangePairs }));
  //   // }

  //   // const onConnectionError = function (error) {
  //   //   console.log("Connection Error: " + error.toString());
  //   // };

  //   // socket.on('connect', connectionListener);
  //   // socket.on('error', onConnectionError);
  //   if (socket) {
  //     // socket.on('message', exchangeListener);
  //     socket.onmessage = exchangeListener;
  //   }

  //   // When page is about to be unmounted is destroyed
  //   return () => {
  //     // socket.off('connect', connectionListener);
  //     // socket.off('error', onConnectionError);
  //     // if (socket) {
  //     //   socket.off('message', exchangeListener);
  //     // }
  //   }
  // }, [socket, exchangesInitMetadata]);

  return (
    <div className="App">
      <MaterialTable
        title="Exchanges"
        columns={columns}
        data={exchanges}
        icons={tableIcons}
        actions={[
          {
            icon: 'delete',
            tooltip: 'Delete Exchange',
            onClick: (event, rowData) => {
              const pair = rowData.pair;
              deletePair(pair);
            }
          }
        ]}
        editable={{
          onRowAdd: (newPair) =>
            new Promise(resolve => {
              setTimeout(() => {
                addExchangePair(newPair.pair);
                resolve();
              }, 1000)
            }),
          // onRowDelete: (pairToRemove) =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       const index = pairToRemove.tableData.id;
          //       const pair = pairToRemove.pair;
          //       deletePair(index, pair);
          //       resolve();
          //     }, 1000)
          //   }),
        }}
      />
      {/* <ExchangeTable deletePair={deletePair} data={exchanges} />
      <ExchangeInput addExchangePair={addExchangePair} /> */}
    </div>
  );
}

export default App;
