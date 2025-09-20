---
layout: default
title: Go Beginner Intro
---

## The Rules of Go/Baduk/Weiqi

-   [The Rules of Go/Baduk/Weiqi](#the-rules-of-gobadukweiqi)
-   [Game objective](#game-objective)
-   [Example Counting the score](#example-counting-the-score)
-   [Capturing](#capturing)
    -   [Liberties](#liberties)

## Game objective

-   The goal is to control more area than your opponent
-   Control includes:
    -   Empty intersections that only reach your stones (like a paint-fill)
    -   The intersections where your stones are placed

## Example Counting the score

Here's an example of a finished 9x9 game.

<div class="two-col-container">

<div data-wgo="/go/lesson_0/first_9x9_game.sgf" data-wgo-layout="" class="wgo-large" data-wgo-move="999" data-wgo-enablewheel="false" >
Your browser doesn't support WGo Player. Use some modern browser.
</div>

<div markdown="1">
Out of the 81 intersections on the board:

-   Black controls:
    -   30 empty intersections (shown with △)
    -   14 stones
-   White controls:
    -   24 empty intersections (shown with ○)
    -   13 stones

So the raw totals are:

-   Black: 44 points
-   White: 37 points

So Black seems ahead by 7 points.

But there's one more rule: to make up for moving second, White is given a bonus called komi. In this example, komi is 7.5 points.

With komi added:

-   White's score becomes 44.5.
-   Black stays at 44.

That means White wins by 0.5 points!

</div>
</div>

<!-- Diagram + explaination text -->

<!--

<div class="two-col-container">
<div data-wgo="/go/lesson_0/first_9x9_game.sgf" data-wgo-layout="" class="wgo-large" style="min-width: 300px; margin: 0" data-wgo-move="999" data-wgo-enablewheel="false" >
Your browser doesn't support WGo Player. Use some modern browser.
</div>
<div markdown="1">
</div>
</div>

-->

## Capturing

That example was a very peaceful game. The players just divided the board in half and counted the score. But most games will not be so peaceful, Go is war! Your opponents will do their best to destroy not only your territory, but also to capture your stones. To see how stones are captured we need to learn about Liberties.

### Liberties

-   A **Liberty** is an unoccupied intersection horizontally or vertically adjacent to a stone.

<div class="two-col-container">
<div data-wgo="/go/lesson_0/4_liberties.sgf" data-wgo-layout="" class="wgo-large" data-wgo-move="999" data-wgo-enablewheel="false" >
Your browser doesn't support WGo Player. Use some modern browser.
</div>
<div markdown="1">
4 liberties are marked with ◻︎
</div>
</div>

-   If all the liberties are taken by the stones of opposing color, that stone is **captured** and is removed from the board.
<div class="two-col-container">
<div data-wgo="/go/lesson_0/capture_1.sgf" data-wgo-layout="" class="wgo-large" data-wgo-move="999" data-wgo-enablewheel="false" >
Your browser doesn't support WGo Player. Use some modern browser.
</div>
<div markdown="1">
Capture White's stone
</div>
</div>

-   **Groups** of stones of the same color placed **horizontally or vertically** adjacent to each other **share liberties**.

-   If a group of stones loses all of its liberties, **the entire group** is captured.

-   You can **escape** from being captured by connecting to a group and extend it's liberties.

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

<!--
<div style="width: 20%; margin: 0; background-color: #f9f9f9; padding: 10px; border-radius: 10px" id="tsumego_wrapper">
Your browser doesn't support WGo Player. Use some modern browser.
</div> -->

<!--
<script>
var tsumego = new WGo.Tsumego(document.getElementById("tsumego_wrapper"), {
	sgf: "(;FF[4]GM[1]VW[aa:jg]SZ[19]ST[2]EV[N° 1 .|. Level #2]AB[bb][cb][db][fb]AW[ea][eb][bc][cc][dc]C[Black to play]FG[1](;B[ec];W[fc];B[ed];W[gb](;B[fd];W[gc](;B[ab];W[ba](;B[bd];W[cd];B[ce];W[be](;B[dd];W[ad];B[ac]C[Correct!]TE[1])(;B[ac];W[ad];B[dd]C[Correct!]TE[1]))(;B[ce];W[ac]C[Fail!]))(;B[da];W[fa];B[ab];W[ba]C[Fail!]))(;B[ab];W[ba];B[fd];W[gc](;B[bd];W[cd];B[ce];W[be](;B[dd];W[ad];B[ac]C[Correct!]TE[1])(;B[ac];W[ad];B[dd]C[Correct!]TE[1]))(;B[ce];W[ac]C[Fail!]))(;B[da];W[fa];B[ab];W[ba]C[Fail!]))(;B[da];W[fc];B[ab];W[ba]C[Fail!]))",
	debug: true, /* remove this line hide solution */
});
tsumego.setCoordinates(true);
</script> -->
