'use strict';

const _ = require('lodash');
const async = require('async');
const GoogleMapsLoader = require('google-maps');
const config = require('../../config');
const client = require('./monzo');
const utils = require('./utils');
const render = require('./render');

const markers = []; // TODO: avoid global variables!
let google = {};
let monzoMap = {};
let infoWindow = {};

function updateMarkerText(transaction) {
    console.log(transaction);
    let infoText = `<strong>${transaction.merchant.name}</strong><br />`;
    infoText += `${utils.formatAmountToString(transaction)}`;
    infoText += ` ${transaction.merchant.emoji} `;

    const transactionMarker = _.find(markers, { title: transaction.id });
    const map = transactionMarker.getMap();

    infoWindow.setContent(infoText);
    infoWindow.open(map, transactionMarker);
    render.updateTransactionInfo(transaction);
}

function generateMarker(transaction) {
    if (transaction.merchant) {
        const position = {
            lat: transaction.merchant.address.latitude,
            lng: transaction.merchant.address.longitude
        }

        const icon = {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            scale: 0.5,
            strokeWeight: 0.5,
            strokeOpacity: 1,
            strokeColor: '#fff',
            fillColor: utils.getCategoryColour(transaction.category),
            fillOpacity: 1,
        }

        const marker = new google.maps.Marker({
            map: monzoMap,
            title: transaction.id,
            position: position,
            icon: icon
        });

        marker.addListener('click', () => {
            updateMarkerText(transaction);
        });

        markers.push(marker);
        render.updateCountryCounter(transaction.merchant.address.country);
    }
}

module.exports.generateMarkers = (accessToken, transactions) => {
    const categoryData = [];
    let count = 0;

    async.eachSeries(transactions, (t, cb) => {
        client.getTransactionInfo(t.id, accessToken, (err, transaction) => {
            if (err) return cb(err);

            generateMarker(transaction);

            if (!categoryData[transaction.category]) categoryData[transaction.category] = [transaction.amount];
            else categoryData[transaction.category].push(transaction.amount);

            count++;
            render.updateTransactionCounter(count);
            if (count === transactions.length) render.showChartView(categoryData);
        });

        cb();
    });
    render.stopLoadAnimation();
}

function generateMap() {
    const mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(51.51550, -0.134175),
        scaleControl: true,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        draggable: true,
        zoomControl: true,
        scrollwheel: false,
        disableDoubleClickZoom: false,
        streetViewControl: false,
    };

    monzoMap = new google.maps.Map(document.getElementById('map'), mapOptions);
    infoWindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });

    render.stopLoadAnimation();
}

module.exports.initialiseMap = () => {
    GoogleMapsLoader.KEY = config.mapsApiKey;
    GoogleMapsLoader.load((loadedGoogleMaps) => {
        if (loadedGoogleMaps) {
            google = loadedGoogleMaps;
            generateMap();
        }
    });
}
