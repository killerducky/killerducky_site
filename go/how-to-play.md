---
layout: default
title: How to play Go
---

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

## How to play Go

- [How to play Go](#how-to-play-go)
- [Under construction](#under-construction)
- [Game objective](#game-objective)
- [Example Counting the score](#example-counting-the-score)
- [Liberties](#liberties)
- [Capturing](#capturing)
- [Groups](#groups)
- [Suicide?](#suicide)
- [Ko](#ko)

## Under construction

Yet another introduction to Go, under construction. Relevant [xkcd](https://xkcd.com/927/)

## Game objective

- The goal is to control more area than your opponent
- Control comes from:
    - **Territory** &mdash; Empty intersections sealed off by your stones. (Picture a flood fill: if the color can only reach your stones, the area is yours.)
    - **Live stones** &mdash; all the intersections your stones already occupy.

## Example Counting the score

Here's an example of a finished 9x9 game.

{% capture diagram_text %}

Out of the 81 intersections:

- Black controls:
    - 30 empty intersections (shown with △)
    - 14 stones
    - 44 points total
- White controls:
    - 24 empty intersections (shown with ○)
    - 13 stones
    - 37 points total

{% endcapture %}

{% include go_diagram.html
   sgf="/go/lesson_0/first_9x9_game.sgf"
   content=diagram_text
%}

So Black seems ahead by 7 points.

But there's another rule: to balance the game, White is given a bonus called **komi**. In this example, komi is 7.5 points.

With komi added:

- White's score becomes 44.5.
- Black stays at 44.

White wins by 0.5 points!

## Liberties

That example was a very peaceful game: the players simply divided the board and counted the score. Most games, however, are far from peaceful &mdash; Go is war! Your opponent will try not only to invade your territory but also to capture your stones. To understand how stones are captured, we first need to learn about Liberties.

A **Liberty** is an empty intersection directly adjacent to a stone, either horizontally or vertically.

{% include go_diagram.html
   sgf="/go/lesson_0/4_liberties.sgf"
   content="The White stone has 4 liberties, marked with ◻︎"
%}

## Capturing

If all the liberties of a stone are occupied by the opponent's stones, that stone is **captured** and removed from the board.

{% include go_tsumego.html
sgf="/go/lesson_0/capture_1.sgf"
content="Capture White's stone"
%}

## Groups

**Groups** are stones of the same color that are placed **horizontally or vertically** adjacent to each other. Stones in a group **share liberties**.

{% include go_diagram.html
sgf="/go/lesson_0/group_8_liberties.sgf"
content="White's group has 8 liberties"
%}

If a group loses all of its liberties, **the entire group** is captured.

{% include go_tsumego.html
sgf="/go/lesson_0/group_8_liberties_capture.sgf"
content="Capture White's group"
%}

You can **escape** capture by extending the group and gaining additional liberties.

{% include go_tsumego.html
sgf="/go/lesson_0/save_1.sgf"
content="Save White's stone"
%}

## Suicide?

It's illegal to place a stone where it would have no liberties &mdash; **unless** that move captures some opponent stones.

{% capture diagram_text %}

Capture White's group

Playing A immediately is illegal. First you must **reduce** white's liberties by playing B.

{% endcapture %}

{% include go_tsumego.html sgf="/go/lesson_0/capture_one_eye_1.sgf" content=diagram_text %}

## Ko

**Ko** is a Japanese word meaning "eternity". Repeating the board position by capturing a single stone is **illegal**.

{% capture diagram_text %}

After Black plays A to reduce White's territory, White captures at B.

It would then be illegal for Black to recapture immediately. Black must play a different move &mdash; such as reducing White's territory. This is called a **ko threat**

White faces a dilemma: If White connects the ko, Black can follow up their **ko threat** and reduce White's territory. So White decides to answer the ko threat.

Once the board has changed, Black can **recapture the ko**.

Next, White cannot immediately recapture the ko, and with no useful moves left, White passes.

Finally, Black resolves the ko fight by connecting.

{% endcapture %}

{% include go_tsumego.html sgf="/go/lesson_0/ko_1.sgf" content=diagram_text %}
