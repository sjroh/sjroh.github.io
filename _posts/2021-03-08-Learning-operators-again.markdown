---
layout: post
title: "Learning operators again"
date: 2021-03-08 20:12:00 +0800
categories: study
tags: python
---
Python does have operators which don't exist in C# or operators I haven't seen regularly while working with C#. So I did a quick search to make sure I can remember them.

| Operator | Example | Memo |
|:---------|:--------|:-----|
| //       | x // y  | 3 // 2 will be 1 instead of 1.5 which is equal to math.floor() |
| **       | x ** y  | 3 ** 2 will be 9 |
| //=      | x //= 3 | x = x // 3 |
| **=      | x **= 3 | x = x ** 3 |

// operator return math.floor(). However, it's possible to use as math.ceil() by using as below.
```
math.floor(1.5) is 3 // 2
math.ceil(1.5) is -(-3 // 2)
```


And recalling bitwise operators for both of C# and Python.

| Operator | Memo |
|:---------|:-----|
| ~        | Bitwise NOT; ~0 is -1 |
| &        | Bitwise AND; 1 & 2 is 0 |
| \|        | Bitwise OR; 1 & 2 is 3 |
| ^        | Bitwise XOR; 5 ^ 3 is 6 |
| <<       | Bitwise Left Shift; 1 << 1 is 2 |
| >>       | Bitwise Right Shift; 1 >> 1 is 0 |
