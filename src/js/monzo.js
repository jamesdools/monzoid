'use strict';

const _ = require('lodash');
const async = require('async');
const monzo = require('mondo-bank');
const render = require('./render');
const mapHandler = require('./map');

module.exports.getAccountId = (token, cb) => {
    monzo.accounts(token, (err, accountInfo) => {
        if (err) return cb(err);

        const accountId = _.get(accountInfo, 'accounts[0].id');

        cb(null, accountId);
    });
}

module.exports.getBalance = (accountId, accessToken, cb) => {
    monzo.balance(accountId, accessToken, (err, balance) => {
        if (err) return cb(err);

        cb(null, balance);
    });
}

module.exports.getTransactions = (accountId, accessToken, cb) => {
    monzo.transactions(accountId, accessToken, (err, transactions) => {
        if (err) return cb(err);

        cb(null, transactions);
    });
}

module.exports.getTransactionInfo = (transactionId, accessToken, cb) => {
    monzo.transaction({
        transaction_id: transactionId,
        expand: 'merchant'
    }, accessToken, (err, transactionInfo) => {
        if (err) return cb(err);

        cb(null, transactionInfo.transaction);
    });
}

module.exports.getAndDisplayBalance = (accessToken) => {
    async.waterfall([
        function (done) {
            module.exports.getAccountId(accessToken, done);
        },
        function (accountId, done) {
            monzo.balance(accountId, accessToken, done);
        }
    ], (err, res) => {
        if (err) return new Error(err);

        render.updateBalance(res);
    });
}

module.exports.getAndDisplayTransactions = (accessToken) => {
    async.waterfall([
        function (done) {
            module.exports.getAccountId(accessToken, done);
        },
        function (accountId, done) {
            monzo.transactions(accountId, accessToken, done);
        }
    ], (err, res) => {
            if (err) return new Error(err);

            const transactions = res.transactions;
            mapHandler.generateMarkers(accessToken, transactions);
    });
}
