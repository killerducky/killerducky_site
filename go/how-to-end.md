---
layout: default
title: How to play Go
previous: go/how-to-play
next: go/basic-techniques
---

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

## How to **stop** playing Go

- [How to **stop** playing Go](#how-to-stop-playing-go)
- [How do we know when it's over?](#how-do-we-know-when-its-over)
- [A desperate invasion](#a-desperate-invasion)
- [A tragic mistake](#a-tragic-mistake)
- [Bad faith opponent](#bad-faith-opponent)
- [A practical note](#a-practical-note)
- [Shortcuts!](#shortcuts)

## How do we know when it's over?

A common dilemma for new Go players is figuring out when the game ends. Unlike chess, which ends when the King is captured, Go ends when the players **agree** it's over.

And how do you agree to end? By passing. If **both** players pass in succession, the game ends and the score is counted.

For experienced players this is usually obvious &mdash; they can quickly tell when no meaningful moves remain. But for beginners, it's often much harder. Let's revisit the first diagram from the [how-to-play](how-to-play#example-counting-the-score) page.

{% capture diagram_text %}

Out of the 81 intersections:

- Black
    - 30 points of territory (shown with △)
    - 14 stones
    - 44 points total
- White
    - 24 points of territory (shown with ○)
    - 13 stones
    - 7.5 point for komi
    - 44.5 points total

{% endcapture %}

{% include go_diagram.html
   sgf="/go/lesson_0/first_9x9_game.sgf"
   content=diagram_text
%}

## A desperate invasion

In our example game, both players passed on the final two moves. But imagine Black suddenly realizes they're losing (maybe they just remembered that pesky komi rule). Instead of accepting defeat, Black decides to invade White's territory.

There's no rule stopping such a move. In fact, White's wall has a small weakness. Go is war! Territory isn't yours unless you can defend it against any invasion.

{% capture diagram_text %}

Black cuts, attacking the weakness in White's wall. But White captures the invasion and defends their territory. Afterwards:

- Black:
    - 30 points of territory (shown with △)
    - 14 stones
    - 44 points total
- White:
    - 19 points of territory (shown with ○)
    - 18 stones
    - 7.5 point for komi
    - 44.5 points total

In the end, nothing changed, so Black could have simply accepted defeat instead of trying this invasion.

{% endcapture %}

{% include go_sgf.html
   sgf="/go/lesson_0/post_pass_invasion_ok.sgf"
   content=diagram_text
%}

## A tragic mistake

{% capture diagram_text %}

But what if White misplays the defense? In this case, the invasion succeeds spectacularly and now:

- Black:
    - 37 points of territory (shown with △)
    - 22 stones
    - 59 points total
- White:
    - 12 points of territory (shown with ○)
    - 12 stones
    - 7.5 point for komi
    - 21.5 points total

Black wins by a landslide &mdash; 37.5 points.

{% endcapture %}

{% include go_sgf.html
   sgf="/go/lesson_0/post_pass_invasion_fail.sgf"
   content=diagram_text
%}

## Bad faith opponent

{% capture diagram_text %}

What if White defends correctly and Black refuses to give up, dragging the game on with pointless moves? If one player never agrees the game is over, what happens then?

Eventually, the stubborn player runs out of legal moves. If you're patient enough to make it to the end you will see the final score is:

- Black:
    - 1 point of territory
    - 44 stones
    - 45 points total
- White:
    - 8 points of territory
    - 29 stones
    - 7.5 point for komi
    - 44.5 points total

And still nothing changed. White still wins by 0.5 points.

{% endcapture %}

{% include go_sgf.html
   sgf="/go/lesson_0/post_pass_invasion_ok_stubborn.sgf"
   content=diagram_text
%}

## A practical note

The previous example is extreme, but for beginners it can genuinely be hard to tell the difference between a real invasion attempt and a pointless one. If you are playing in good faith, there's nothing wrong with "playing it out" to learn.

But especially online against an unknown opponent, you might run into:

- Beginners who simply don't know they are supposed to pass.
- Opponents not acting in good faith &mdash; stalling in hopes you'll give up.

If you are playing on [OGS](https://online-go.com), use the [Call moderator](https://forums.online-go.com/t/reporting-a-guide-to-making-good-use-of-the-call-moderator-and-report-functions/36381) button ([wiki link](https://github.com/online-go/online-go.com/wiki/Chatting-&-Getting-Involved-in-the-Community#contacting-a-moderator) for the same) if things get out of hand.

## Shortcuts!

Or: How to stop playing Go even faster.

Let's shift focus from prolonging the game to ending it quickly, so you can get to the next round!

Recall the definition of **Territory** — Empty intersections sealed off by your stones. (Picture a flood fill: if the color can only reach your stones, the area is yours.) Even if an area seems clearly under your control, just one opponent stone in there means it's not yet your territory.

Instead of playing out the capturing moves, the players may both pass and agree that certain stones are dead. If they agree, those stones are removed and the score is counted.

{% capture diagram_text %}

Here both Black and White need to play one more move to confirm their territories. On a 9x9 board it's just a couple moves saved, but on larger boards it could save quite a few moves.

After agreeing the score is:

- Black:
    - 25 points of territory
    - 21 stones
    - 46 points total
- White:
    - 17 points of territory
    - 20 stones
    - 7.5 point for komi
    - 44.5 points total

{% endcapture %}

{% include go_diagram.html
   sgf="/go/lesson_0/agree-dead.sgf"
   content=diagram_text
%}

Under the AGA rules, if the players can't agree on whether certain groups are alive or dead, play continues, with the opponent of the last player to pass moving next. If they never agree and both pass twice in a row, then every stone left on the board is treated as alive.

On [OGS](https://online-go.com), this agreement phase is mostly automated. After both players pass, the server marks groups it thinks are dead. Players review the marked stones and adjust them if needed. Once everything looks correct, click the "Accept removed stones" to finish the game, or Cancel to keep playing if something's wrong.

In an online setting, the agreement phase is another spot where you might run into players not acting in good faith. If your OGS opponent is abusing the agreement phase, for example marking clearly alive stones as dead, use the [Call moderator](https://forums.online-go.com/t/reporting-a-guide-to-making-good-use-of-the-call-moderator-and-report-functions/36381) button ([wiki link](https://github.com/online-go/online-go.com/wiki/Chatting-&-Getting-Involved-in-the-Community#contacting-a-moderator) for the same).
