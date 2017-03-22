'use strict';

const _ = require('lodash');
const utils = require('./utils');
const d3 = require('d3');

module.exports.renderChart = (categoryData) => {
    delete categoryData['mondo']; // remove top-ups

    // const data = Object.keys(categoryData).map((category) => { //TODO: how to preserve colour order?
    //     return {
    //         name: category,
    //         transactions: categoryData[category].length,
    //         amount: Math.abs(_.sum(categoryData[category]))
    //     };
    // });

    const data = [
        {
            name: 'Eating Out',
            transactions: categoryData['eating_out'].length,
            amount: Math.abs(_.sum(categoryData['eating_out']))
        },
        {
            name: 'Entertainment',
            transactions: categoryData['entertainment'].length,
            amount: Math.abs(_.sum(categoryData['entertainment']))
        },
        {
            name: 'General',
            transactions: categoryData['general'].length,
            amount: Math.abs(_.sum(categoryData['general']))
        },
        {
            name: 'Groceries',
            transactions: categoryData['groceries'].length,
            amount: Math.abs(_.sum(categoryData['groceries']))
        },
        {
            name: 'Shopping',
            transactions: categoryData['shopping'].length,
            amount: Math.abs(_.sum(categoryData['shopping']))
        },
        {
            name: 'Transport',
            transactions: categoryData['transport'].length,
            amount: Math.abs(_.sum(categoryData['transport']))
        }
    ];

    const divContainer = d3.select('.category-chart').node();
    const containerWidth = divContainer.getBoundingClientRect().width;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = containerWidth - margin.left - margin.right;
    const height = width - margin.top - margin.bottom;

    const chart = d3.select('.category-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + ((width/2)+margin.left) + ',' + ((height/2)+margin.top) + ')');

    const radius = Math.min(width, height) / 2;
    const arc = d3.arc().outerRadius(radius).innerRadius(radius - 20);
    const pie = d3.pie()
        .sort(null)
        .startAngle(1.1*Math.PI)
        .endAngle(3.1*Math.PI)
        .value((d) => {
            return d.amount;
        });

    const color = d3
        .scaleOrdinal()
        .range(['#E44D61', '#E98251', '#CCCCCC', '#F4B851', '#EE9697', '#24788B']);

    const g = chart.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');

    g.append('path')
        .style('fill', (d) => {
            return color(d.data.name);
        })
        .transition()
        .delay((d, i) => {
            return i * 500;
        })
        .duration(500)
        .attrTween('d', (d) => {
            const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });

    const tooltip = d3.select('.category-chart').append('div').attr('class', 'tooltip');
    d3.select('.category-chart').attr('align', 'center');

    tooltip.append('div').attr('class', 'tooltipLabel');
    tooltip.append('div').attr('class', 'tooltipCount');
    tooltip.append('div').attr('class', 'tooltipAmount');

    g.on('mouseover', (d) => {
        tooltip.style('display', 'block');
        tooltip.select('.tooltipLabel').html(utils.formatTextString(d.data.name));
        tooltip.select('.tooltipCount').html(`${d.data.transactions} transactions`);
        tooltip.select('.tooltipAmount').html(utils.formatAmountToString(d.data.amount));
    });

    g.on('mouseout', function() {
        tooltip.style('display', 'none');
    });
}
