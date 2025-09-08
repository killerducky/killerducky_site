---
layout: default
title: Tenhou Rank Charts
---

<style>
    .chart-tenhou-es,
    .chart-tenhou-rank {
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

# Tenhou Rank Charts

Usage: Input username and click Generate Graph

-   First chart shows your expected rank point change per match.
    -   Example: If you average 25% for 1/2/3/4 placements in Tokujou and your current rank is 5d, your expected rank point change will be 0.
    -   The blue lines show breakeven points for different ranks.
        -   Example: If your rank trend is on the 6d blue line, you would breakeven at 6d.
    -   Last N Games sets the initial zoom
    -   Charts are interactive:
        -   Double click to zoom out
        -   Click and drag to zoom in
        -   Click in the legend toggle lines
    -   Several averages are shown, each responding more or less quickly to recent results.
    -   Averages are tracket separately for each room (different player pools).
    -   Only 4 player South is shown (toggle for East pending).
-   Second chart shows your rank and rank points history

See [Mahjong Soul Charts Explained]("/blog/2025/08/30/mjs_charts_explained") for more details (Tenhou charts work mostly the same)

See [MJS stats](mjs_stats) for the Mahjong Soul version.

<div class="chart-container">
    <div class="controls">
        <label class="small">Name:</label>
        <input class="pname" type="text" value="" style="width: 80px; height: 20px" />
        <label class="small">Last N Games</label>
        <input class="lastN" type="number" value="500" step="100" min="0" style="width: 60px; height: 20px" />
        <button class="generate btn">Generate graph</button>
    </div>
    <br>
    <div class="chart-tenhou-es"></div>
    <div class="chart-tenhou-rank"></div>
</div>

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>
<script type="module" src="tenhou_stats.js"></script>
