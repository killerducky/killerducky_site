---
layout: default
title: Life and Death
previous: go/net-and-ladder
next: go/intro
---

<script type="text/javascript" src="/assets/wgo.js/wgo.min.js"></script>
<script type="text/javascript" src="/assets/wgo.js/wgo.player.min.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/wgo.player.css" />
<script type="text/javascript" src="/assets/wgo.js/tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="/assets/wgo.js/tsumego.css">
<link rel="stylesheet" type="text/css" href="/assets/css/wgo-custom.css" />

## Life and Death

The Go board is a battlefield. Opponents will try to surround and capture your stones — and you'll try to do the same to theirs. Let's learn how to make groups **alive** and how to kill enemy groups.

- [Life and Death](#life-and-death)
- [Suicide?](#suicide)
- [Pointless sacrifice?](#pointless-sacrifice)
- [Continuous sacrifices](#continuous-sacrifices)
- [Life](#life)
- [Life without two eyes?](#life-without-two-eyes)
- [False eyes](#false-eyes)

## Suicide?

Let's revisit the suicide rule. It's illegal to place a stone where it would have no liberties &mdash; **unless** that move captures some opponent stones.

{% capture diagram_text %}

Capture White's group

Playing A immediately is illegal. First you must **reduce** white's liberties by playing B.

{% endcapture %}

{% include go_tsumego.html sgf="/go/lesson_0/capture_one_eye_1.sgf" content=diagram_text %}

## Pointless sacrifice?

{% capture diagram_text %}

This time White has two liberties on the inside. It's still possible to capture this group by making what looks like a pointless sacrifice. The idea is to force White to answer, reducing their own liberties.

{% endcapture %}

{% include go_sgf.html sgf="/go/lesson_1/capture_one_eye_2.sgf" content=diagram_text %}

## Continuous sacrifices

{% capture diagram_text %}

This time White has three liberties on the inside.

It's still possible to capture this group by repeating the same process. Each time White is forced to capture Black's sacrificed stones, White's internal space gets smaller.

{% endcapture %}

{% include go_sgf.html sgf="/go/lesson_1/capture_one_eye_3.sgf" content=diagram_text %}

## Life

It's time to finally reveal Go's magic defense mechanism:

Making **Two Eyes**.

In the last example, did you notice that Black's first move was _inside_ the group, instead of starting from the outside like before? Let's see what happens if Black doesn't do this.

{% capture diagram_text %}

White again has three liberties inside, but this time Black starts attacking from the outside.

Now White can divide those internal liberties into two separate areas &mdash; **two eyes**.

{% endcapture %}

{% include go_sgf.html sgf="/go/lesson_1/capture_one_eye_3_fail.sgf" content=diagram_text %}

{% capture diagram_text %}

A group with two eyes is **alive**. No matter how Black plays, they can't fill both eyes, so the group can never be captured.

{% endcapture %}

{% include go_diagram.html
sgf="/go/lesson_1/capture_one_eye_3_fail.sgf"
content=diagram_text %}

## Life without two eyes?

Below, Black has four internal liberties in a straight line. As your **eye space** grows, it becomes easier to split it into **two eyes**. In this position, we don't even need to move yet:

- If White plays A, we respond at B
- If White plays B, we respond at A.
- This situation is called **miai** &mdash; there are two **vital points** and White cannot play both.

{% capture diagram_text %}

Since we have **miai** to live, we can **tenuki** and play the more useful move at T.

If White tries to kill, respond at the other **vital point**.

{% endcapture %}

{% include go_tsumego.html sgf="/go/lesson_1/straight_4_alive.sgf" content=diagram_text %}

**Key Point**: You don't have to actually form two eyes to be alive, _as long as_ you have multiple options to do so when the opponent attacks.

## False eyes

In the examples so far, the stones were all solidly connected. But when there are cutting points, the situation can change.

{% capture diagram_text %}

White's eye at B isn't solid. Black can play A to turn B into a **false eye**. Next Black can capture some of the stones forming the eye.

{% endcapture %}

{% include go_tsumego.html sgf="/go/lesson_1/false_eye.sgf" content=diagram_text %}
