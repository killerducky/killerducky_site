---
layout: default
title: Go Beginner Intro
---

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

## How to play Go/Baduk/Weiqi

-   [How to play Go/Baduk/Weiqi](#how-to-play-gobadukweiqi)
-   [Under construction](#under-construction)
-   [Game objective](#game-objective)
-   [Example Counting the score](#example-counting-the-score)
-   [Liberties](#liberties)
-   [Capturing](#capturing)
-   [Groups](#groups)

## Under construction

Yet another introduction to Go, under construction. Relevant [xkcd](https://xkcd.com/927/)

## Game objective

-   The goal is to control more area than your opponent
-   Control includes:
    -   Empty intersections that only reach your stones (like a paint-fill)
    -   The intersections where your stones are placed

## Example Counting the score

Here's an example of a finished 9x9 game.

{% capture diagram_text %}

Out of the 81 intersections:

-   Black controls:
    -   30 empty intersections (shown with △)
    -   14 stones
    -   44 points total
-   White controls:
    -   24 empty intersections (shown with ○)
    -   13 stones
    -   37 points total

{% endcapture %}

{% include go_diagram.html
   sgf="/go/lesson_0/first_9x9_game.sgf"
   content=diagram_text
%}

So Black seems ahead by 7 points.

But there's one more rule: to make up for moving second, White is given a bonus called **komi**. In this example, komi is 7.5 points.

With komi added:

-   White's score becomes 44.5.
-   Black stays at 44.

That means White wins by 0.5 points!

## Liberties

That example was a very peaceful game. The players just divided the board in half and counted the score. But most games will not be so peaceful, Go is war! Your opponents will do their best to destroy not only your territory, but also to capture your stones. To see how stones are captured we need to learn about Liberties.

A **Liberty** is an unoccupied intersection horizontally or vertically adjacent to a stone.

{% include go_diagram.html
   sgf="/go/lesson_0/4_liberties.sgf"
   content="The White stone has 4 liberties, marked with ◻︎"
%}

## Capturing

If all the liberties are taken by the stones of opposing color, that stone is **captured** and is removed from the board.

{% include go_tsumego.html
id="capture_1"
sgf="/go/lesson_0/capture_1.sgf"
content="Capture White's stone"
%}

## Groups

**Groups** of stones of the same color placed **horizontally or vertically** adjacent to each other **share liberties**.

{% include go_diagram.html
id="group_8_liberties"
sgf="/go/lesson_0/group_8_liberties.sgf"
content="White's group has 8 liberties"
%}

If a group of stones loses all of its liberties, **the entire group** is captured.

{% include go_tsumego.html
id="group_8_liberties_capture"
sgf="/go/lesson_0/group_8_liberties_capture.sgf"
content="Capture White's group"
%}

You can **escape** from being captured by extending a group to gain more liberties.

{% include go_tsumego.html
id="save_1"
sgf="/go/lesson_0/save_1.sgf"
content="Save White's stone"
%}
