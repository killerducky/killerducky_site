---
layout: default
title: MJS Charts
---

<style>
    /* * {
        outline: solid 1px red;
    } */
    .chart-container {
        margin-bottom: 4rem;
    }
    .ESChart,
    .RankPointChart {
        padding: 10px;
    }
    .custom-tooltip {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.8em;
        white-space: nowrap;
        pointer-events: none;
    }
</style>

# Mahjong Soul Charts

**Usage**: Input username (adjust idx if needed) and click **Generate Graph**

-   First chart shows your expected rank point change per match.

    -   Example: If you average 25% for 1/2/3/4 placements and your current rank is Master 1, your expected rank point change will be 0.
    -   The blue lines show breakeven points for different ranks.
        -   Example: If your rank trend is on the M2 blue line, you would breakeven at M2.
    -   **Norm Rank** tells the chart which rank to assume.
        -   `auto` uses your current rank.
    -   **Last N Games** sets the initial zoom.
    -   Charts are interactive:
        -   Double click to zoom out
        -   Click and drag to zoom in
        -   Click in the legend to toggle lines
    -   Several averages are shown, each responding more or less quickly to recent results.
    -   Averages are tracked separately for Gold room and Jade room (different player pools).
    -   Only 4 player is supported.

-   Second chart shows your rank and rank points history.

See [Mahjong Soul Charts Explained](/blog/2025/08/30/mjs_charts_explained) for more details.

See [Tenhou stats](tenhou_stats) for the Tenhou version.

<div class="chart-container">
    <div class="controls">
        <label class="small">Name:</label>
        <input class="pname" type="text" value="" style="width: 80px; height: 20px" />
        <label class="small">idx:</label>
        <input class="pidx" type="number" value="0" min="0" style="width: 25px; height: 20px" />
        <label class="small">Norm Rank:</label>
        <select class="norm-rank" value="auto" style="width: 50px; height: 20px">
            <option value="auto">auto</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
            <option value="M3">M3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
        </select>
        <label class="small">Last N Games</label>
        <input class="xmin" type="number" value="500" step="100" min="0" style="width: 60px; height: 20px" />
        <button class="generate btn">Generate graph</button>
    </div>
    <div class="ESChart" style="width: 1000px; height: 420px"></div>
    <div class="RankPointChart" style="width: 1000px; height: 420px"></div>
</div>

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js" charset="utf-8"></script>
<script type="module" src="./amae_code.js"></script>
