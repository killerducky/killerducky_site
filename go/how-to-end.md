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

## How to **stop** playing Go!

- [How to **stop** playing Go!](#how-to-stop-playing-go)
- [How do we know when it's over?](#how-do-we-know-when-its-over)
- [A desperate invasion](#a-desperate-invasion)
- [A tragic mistake](#a-tragic-mistake)
- [Bad faith opponent](#bad-faith-opponent)
- [A practical note](#a-practical-note)

## How do we know when it's over?

A major dilemma for new Go players is figuring out when the game is over. Unlike chess with a clear end condition, capture the King, Go ends when... well whenever the players agree to end.

And how do you agree to end? By passing. If **both** players pass back to back, then you can end the game and count the score.

Between two experience players this isn't a problem, they will easily see when there isn't anything useful left to do. But for newer players it can be a real challenge. Let's revisit the first diagram from the [how-to-play](how-to-play#example-counting-the-score) page.

{% capture diagram_text %}

Out of the 81 intersections:

- Black controls:
    - 30 empty intersections (shown with △)
    - 14 stones
    - 44 points total
- White controls:
    - 24 empty intersections (shown with ○)
    - 13 stones
    - 7.5 point for komi
    - 44.5 points total

{% endcapture %}

{% include go_diagram.html
   sgf="/go/lesson_0/first_9x9_game.sgf"
   content=diagram_text
%}

## A desperate invasion

The last two moves of this game both players passed. But suppose Black counts and realizes they are going to lose (maybe they suddenly remembered that pesky komi rule?). There isn't anything stopping them from trying to invade White's area. In fact there is one small weakness in White's wall... Go is war! The only territory is territory that you can defend against any and all invasions.

{% capture diagram_text %}

Black tries to attack the weakness in White's wall by cutting it. But White is able to capture this invasion and defend their territory. At the end of the variation:

- Black controls:
    - 30 empty intersections (shown with △)
    - 14 stones
    - 44 points total
- White controls:
    - 19 empty intersections (shown with ○)
    - 18 stones
    - 7.5 point for komi
    - 44.5 points total

In the end, nothing changed, so Black may as well have accepted his defeat instead of trying this invasion.

{% endcapture %}

{% include go_sgf.html
   sgf="/go/lesson_0/post_pass_invasion_ok.sgf"
   content=diagram_text
%}

## A tragic mistake

{% capture diagram_text %}

What if Black tried the same attack, but White got a little careless? After White's disaster the score is now:

- Black controls:
    - 37 empty intersections (shown with △)
    - 22 stones
    - 59 points total
- White controls:
    - 12 empty intersections (shown with ○)
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

What if White defends correctly, but Black gets stubborn? If the game ends by agreement, but one side **never agrees**, how does the game end?

Eventually there is a forced way to end the shenanigans &mdash; you simply wait for the opponent to have no legal moves left. If you're patient enough to make it to the end you will see the final result is:

- Black controls:
    - 1 empty intersection
    - 44 stones
    - 45 points total
- White controls:
    - 8 empty intersections
    - 29 stones
    - 7.5 point for komi
    - 44.5 points total

And after all, nothing changed. White still wins by 0.5 points.

{% endcapture %}

{% include go_sgf.html
   sgf="/go/lesson_0/post_pass_invasion_ok_stubborn.sgf"
   content=diagram_text
%}

## A practical note

The previous example is extreme, but for beginners it's not easy to know what is a reasonable attempt and what is a waste of time. If you are playing in good faith, there's nothing wrong with playing out situations that you're not sure about. But especially if you're playing online against an unknown opponent, you might run into:

- Beginners that legitimately don't know how to end the game
- Opponents that are not playing in good faith &mdash; they might be trying to test your patience or even get you to resign.

If you are playing on [OGS](https://online-go.com), you should use the [Call moderator](https://forums.online-go.com/t/reporting-a-guide-to-making-good-use-of-the-call-moderator-and-report-functions/36381) button ([wiki link](https://github.com/online-go/online-go.com/wiki/Chatting-&-Getting-Involved-in-the-Community#contacting-a-moderator) for the same) if the situation truly gets out of hand.
