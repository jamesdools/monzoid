'use strict';

const $ = require('jquery');
const client = require('./src/js/monzo');
const render = require('./src/js/render');
const mapHandler = require('./src/js/map');

function addLogin() {
    const clientLoginButton = $('.client-login-button'); // TODO: get rid of jquery
    const tokenLoginButton = $('.token-login-button');

    tokenLoginButton.on("click", (event) => {
        event.preventDefault();

        const token = $('.input-access-token').val();
        $('.input-access-token').val('');
        render.startLoadAnimation();
        client.getAndDisplayBalance(token);
        client.getAndDisplayTransactions(token);
    });

    clientLoginButton.on("click", (event) => {
      event.preventDefault();
    });
}

function init() {
    addLogin();
    render.startLoadAnimation();
    mapHandler.initialiseMap();
}

init();