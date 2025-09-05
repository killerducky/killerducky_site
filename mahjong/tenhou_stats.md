---
layout: default
title: Tenhou Rank Charts
---

# Tenhou Rank Charts

<div class="chart-container">
    <div class="controls">
        <label class="small">Name:</label>
        <input class="pname" type="text" value="" style="width: 80px; height: 20px" />
        <label class="small">Last N Games</label>
        <input class="xmin" type="number" value="500" step="100" min="0" style="width: 60px; height: 20px" />
        <button class="generate btn">Generate graph</button>
    </div>
    <div class="chart-tenhou-rank"></div>
</div>

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>
<script type="module" src="tenhou_stats.js"></script>
