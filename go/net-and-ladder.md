---
layout: default
title: Nets and Ladders
previous: go/how-to-end
next: go/life-and-death
---

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

## Nets and Ladders

Nets and ladders are two of the most basic ways to capture stones.

- [Nets and Ladders](#nets-and-ladders)
- [Net](#net)
- [Ladder](#ladder)
- [Snapback](#snapback)
- [Crane's nest](#cranes-nest)

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

## Snapback

A **snapback** is a capture technique that works by making a small sacrifice.

{% capture diagram_text %}

The **Throw-in** at A captures the White stones.

Even if White captures, the White stones still have only 1 liberty.

Black can play again and capture the entire White group.

{% endcapture %}

{% include go_tsumego.html
   sgf="/go/lesson_1/snapback.sgf"
   content=diagram_text
%}

The snapback may feel similar to a **ko** &mdash; Black plays a single stone, White captures it, and Black captures back by playing on the same spot again.

The difference is: in a snapback, the position doesn't repeat, so it is not a **ko**.

## Crane's nest

The crane's nest is a classic **tesuji** for capturing fleeing stones.

{% capture diagram_text %}

White is tries to run away by jumping to A.

But Black can sacrifice at B.

Even though White captures the stone, Black squeezes and the White stones quickly run out of liberties.

{% endcapture %}

{% include go_tsumego.html
   sgf="/go/lesson_1/cranes-nest.sgf"
   content=diagram_text
%}
