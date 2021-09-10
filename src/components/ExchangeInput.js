import React, { useState } from 'react';
import { CURRENCIES } from "../helpers/parseExchanges";
// TODO Remove addExchange
function ExchangeInput({ addExchangePair }) {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('ILS');

    const onClickAddPair = () => {
        addExchangePair(fromCurrency, toCurrency);
        // // TODO Remove addExchange
        // addExchange(fromCurrency, toCurrency);
    }

    const onFromurrencyChange = (fromCurr) => {
        setFromCurrency(fromCurr.target.value);
    }

    const onToCurrencyChange = (toCurr) => {
        setToCurrency(toCurr.target.value);
    }

    return (
        <div className="Form">
            <select
                name="from"
                onChange={onFromurrencyChange}
                value={fromCurrency}
            >
                {Object.keys(CURRENCIES).map((cur, _) => (
                    <option key={cur}>{cur}</option>
                ))}
            </select>
            <select
                name="to"
                onChange={onToCurrencyChange}
                value={toCurrency}
            >
                {Object.keys(CURRENCIES).map((cur, _) => (
                    <option key={cur}>{cur}</option>
                ))}
            </select>
            <button onClick={onClickAddPair}>Add To Table</button>
        </div>
    );

}

export default ExchangeInput;