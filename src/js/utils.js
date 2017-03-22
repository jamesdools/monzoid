'use strict';

const moment = require('moment');
const currencySymbol = require('currency-symbol-map').getSymbolFromCurrency;

module.exports.getCategoryColour = (category) => {
    switch (category) {
        case 'eating_out': return '#E44D61';
        case 'entertainment': return '#E98251';
        case 'general': return '#CCCCCC';
        case 'groceries': return '#F4B851';
        case 'shopping': return '#EE9697';
        case 'transport': return '#24788B';
        default: return '#CCCCCC';
    }
}

module.exports.formatAmountToString = (transaction) => {
    let balanceString = currencySymbol(transaction.currency) || '£';
    let balanceNumber;

    if (transaction.amount) {
        balanceNumber = Math.abs(transaction.amount / 100).toFixed(2);
    }

    else if (transaction.balance) {
        balanceNumber = (transaction.balance / 100).toFixed(2);
    }

    else {
        balanceNumber = Math.abs(transaction / 100).toFixed(2); // for chart tooltip
    }

    return `${balanceString}${balanceNumber}`;
}

module.exports.formatTextString = (str) => {
    const stringWithSpaces = str.replace('_', ' ');
    return stringWithSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

module.exports.formatDateString = (isodate) => {
    return moment(isodate).format('MMMM Do YYYY, h:mm:ss a');
}
