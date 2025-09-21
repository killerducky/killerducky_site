---
layout: default
title: Basic Techniques
previous: go/how-to-end
next: go/life-and-death
---

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

## Basic Techniques

Let's learn some basic Go techniques!

- [Basic Techniques](#basic-techniques)
- [Net](#net)
- [Ladder](#ladder)

## Net

A **net** encloses one more more stones. Although the net has holes, each time the opponent tries to escape, the attacker can block.

{% capture diagram_text %}

Play A to form the net, and then block the opponent's attempts to escape.

{% endcapture %}

{% include go_tsumego.html
   sgf="/go/lesson_1/net.sgf"
   content=diagram_text
%}

## Ladder

A **ladder** puts the opponent in atari every move, usually in a pattern resembling a ladder or staircase.

{% capture diagram_text %}

Atari the white stone to start the ladder. Be careful at each step to atari the correct direction! If you make a mistake halfway in, try Undo and atari the other direction.

{% endcapture %}

{% include go_tsumego.html
   sgf="/go/lesson_1/ladder.sgf"
   content=diagram_text
%}
