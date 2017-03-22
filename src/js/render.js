'use strict';

const utils = require('./utils');
const charts = require('./charts');
const isoConverter = require("i18n-iso-countries");
const emojiFlags = require('emoji-flags');

let countryList = [];

module.exports.startLoadAnimation = () => {
    document.querySelector('.map__loader').style.display = 'block';
}

module.exports.stopLoadAnimation = () => {
    document.querySelector('.map__loader').style.display = 'none';
}

module.exports.updateTransactionInfo = (transaction) => {
    document.querySelector('.transaction-info__merchant').innerHTML = `${transaction.merchant.name}`;
    document.querySelector('.transaction-info__logo').innerHTML = `<img src="${transaction.merchant.logo}">`;
    document.querySelector('.transaction-info__amount').innerHTML = `${utils.formatAmountToString(transaction)} ${transaction.merchant.emoji}`;
    document.querySelector('.transaction-info__date').innerHTML = `${utils.formatDateString(transaction.created)}`;
    document.querySelector('.stats-container').style.backgroundColor = utils.getCategoryColour(transaction.category);
}

module.exports.updateCountryCounter = (country) => {
    if (country && !countryList.includes(country)) {
        countryList.push(country);
        document.querySelector('.country-counter').innerHTML = `${countryList.length}`;

        let emojiString = '';
        countryList.forEach((country) => {
            const iso2code = isoConverter.alpha3ToAlpha2(country);
            const countryData = emojiFlags.countryCode(iso2code);
            emojiString += countryData.emoji;
        });

        document.querySelector('.country-flags').innerHTML = emojiString;
    }
}

module.exports.updateTransactionCounter = (count) => {
    document.querySelector('.total-transactions').innerHTML = count;
}

module.exports.showChartView = (categories) => {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.chart-container').style.display = 'block';
    charts.renderChart(categories);
}

module.exports.updateBalance = (balance) => {
    document.querySelector('.panel-balance').innerHTML = utils.formatAmountToString(balance);
}
