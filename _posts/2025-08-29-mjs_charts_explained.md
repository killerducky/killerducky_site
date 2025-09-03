---
layout: default
title: "Mahjong Soul Charts Explained"
date: 2025-08-29 22:10:38 -0500
categories: blog
---

# Charts!

Sometimes I think half the reason I play Mahjong is to generate statitics that I can analyze and chart! Now you too can enjoy watching lines go up and to the right (I hope your lines go up?). Below I will explain in more detail what the charts are showing. You can see your own graphs here:

[MJS Charts](/mahjong/mjs_stats.html)

## Example

Let's look at an example of my own early Mahjong Soul games:

![Image](/assets/images/kd_exp_rank_pts.png)

The first chart shows expected rank points gained/lost per match played. Since Gold and Jade rooms have very different player pools, those results are tracked separately. The blue/orange lines are Gold room results, and the red/green lines are for Jade room. My early Gold room results were incredibly lucky, so the chart is saying that if I continued playing in Gold room as a Master 1, I would expect to average about +8 points per game, and would eventually be a breakeven Master 3.

When I promoted to Master 1 I started playing all my games in Jade room. So the blue/orange Gold room trend lines disappear and the red/green Jade room trend lines start (The lines are separated by which room you play, so if a Master plays games in the Gold room, the trend line for Gold room would be updated).

For most of my early Jade room games my expected points per game fluctuated around -4. The faster responding green line falls to -20 on a bad streak, followed by rising to +8 on a hot run, and so on. The slower responding lines are better for long term projections. The result of a single mahjong game is primarily luck, and it takes a surprisingly large number of games for to show any real changes in your skill level. This is really the main reason I made these charts -- to get an idea what my long term results might be.

The horizontal blue lines show breakeven points for various ranks. If your trendline reaches e.g. M2, then you would be breakeven as an M2 player. You can change which line is used as the y-axis 0 point by changing Norm Rank. It defaults to auto which will use your most recent rank (M1 if you are an Expert due to how the logic works, sorry Expert players!)

![Image](/assets/images/kd_rank_trend.png)

The second chart is simpler. Above you can see my early quick rise through Expert 1, E2, E3 and into Master 1. After hanging in there for awhile I had a reality check, plumetting from the midpoint in M1 with almost straight 4ths back to Expert 3.

## Interactive!

Zoom out by double clicking. Zoom in with click+drag. Change the last N games to change the zoom to the end. Turn trend lines on/off by clicking in the legend.

## Credits

Rank chart based on [Original collab script](https://colab.research.google.com/drive/1puwnp-_k3aHV8trHYInX9HGsBgnJ-hYY#scrollTo=Uoyjy8mCJ21c) (In Japanese)

All data from [amae-koromo](https://amae-koromo.sapk.ch) -- check it out for more stats!
