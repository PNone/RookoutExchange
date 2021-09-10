import React, { useState } from 'react';
import { CURRENCIES } from "../helpers/parseExchanges";
function ExchangeInput({ addExchangePair }) {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('ILS');

    const onClickAddPair = () => {
        addExchangePair(fromCurrency, toCurrency);
    }

    return (
        <div className="Form">
            <select
                name="from"
                onChange={setFromCurrency}
                value={fromCurrency}
            >
                {Object.keys(CURRENCIES).map((cur, _) => (
                    <option key={cur}>{CURRENCIES[cur]}</option>
                ))}
            </select>
            <select
                name="to"
                onChange={setToCurrency}
                value={toCurrency}
            >
                {Object.keys(CURRENCIES).map((cur, _) => (
                    <option key={cur}>{CURRENCIES[cur]}</option>
                ))}
            </select>
            <button onClick={onClickAddPair}>Add To Table</button>
        </div>
    );

}

export default ExchangeInput;