---
layout: default
title: Mahjong reference stats
---

<style>
    /* * {
        outline: red solid 1px;
    } */
    .container {
        flex-direction: column;
    }
    .nav {
        flex-direction: row;
    }
    table {
        width: auto;
        border-collapse: collapse;
    }
    table,
    th,
    td {
        border: 1px solid black;
    }
    th,
    td {
        padding: 4px;
        text-align: center;
    }
    body {
        margin-bottom: 200px;
    }
</style>

# Mahjong stats

A collection of reference charts and tables for Mahjong.

# Table of Contents

-   [Mahjong stats](#mahjong-stats)
-   [Table of Contents](#table-of-contents)
    -   [Dealin Rates](#dealin-rates)
        -   [Early/Late turn only](#earlylate-turn-only)
        -   [Full chart](#full-chart)
    -   [Riichi vs Dama Round balance](#riichi-vs-dama-round-balance)
        -   [Head start ryanmen](#head-start-ryanmen)
        -   [Head start bad shape](#head-start-bad-shape)
        -   [Head start honor wait](#head-start-honor-wait)

## Dealin Rates

Data from Statistical Mahjong Strategy

Half suji A refers to 46 that is half suji by 19. Half suji B refers to 46 that is half suji by 37.

### Early/Late turn only

<form id="plotForm">
    <label for="earlyTurn">Early Turn:</label>
    <input type="number" id="earlyTurn" name="earlyTurn" value="9" min="1" max="19" />
    <label for="lateTurn">Late Turn:</label>
    <input type="number" id="lateTurn" name="lateTurn" value="15" min="1" max="19" />
    <label for="simple">Simple</label>
    <input type="checkbox" id="simple" name="simple" checked />
</form>

<div style="display: flex; justify-content: flex-start">
    <table id="short-table-1" style="margin: 10px">
        <thead>
            <tr>
                <th>Type \ Turn</th>
                <th>9</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    <table id="short-table-2" style="margin: 10px">
        <thead>
            <tr>
                <th>Type \ Turn</th>
                <th>15</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
### Full chart
<div style="display: flex; justify-content: flex-start">
    <table id="full-dealin-table" style="margin: 10px">
        <thead>
            <tr>
                <th>Type \ Turn</th>
                {% for i in (1..19) %}
                <th>{{ i }}</th>
                {% endfor %}
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
## Riichi vs Dama Round balance
<ul>
    <li>These charts show average score difference between Riichi and Dama (positive means Riichi scores more).</li>
    <li>Trend lines for deciding on Turns 5, 8, and 12.</li>
    <li>Another trend line for the difference assuming the hand actually wins.</li>
    <li>Data from Statistical Mahjong Strategy, error around 400 points.</li>
</ul>
### Head start ryanmen
<div id="chart-riichi-dama-head-start-ryanmen"></div>
### Head start bad shape
<div id="chart-riichi-dama-head-start-bad-shape"></div>
### Head start honor wait
<div id="chart-riichi-dama-head-start-honor-wait"></div>

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>
<script src="stats.js"></script>
