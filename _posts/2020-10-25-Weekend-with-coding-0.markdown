---
layout: post
title: "Weekend with coding 0"
date: 2020-10-25 15:00:00 +0800
categories: study
tags: setup mac python julia go
---
Since I factory reset my MacBook air, I had to set up some stuff for studying.

I already installed the VS Code, and not going to install emacs right now. Sadly, I forgot most of the shortcuts for emacs.

I've been using C++ and C# after college till now to pay my bills. Earlier than I used to work in a startup company that used Ruby for back-end and Java for Android. But the problem is I forgot most of Ruby and Java. And I used Python from time to time for personal tools or some side projects while I'm working. But I used it as a tool on your hands. I wrote a code that doesn't have a structure to call. So it's time to clean up the messy habits away.

Every developer knows setting up the environment is one of the most annoying and painful things to do. I thought about writing a script for this. But I don't know when I'm going to use the script again. And setting up the environment is very annoying but still, I can enjoy the moment.

# Prerequisites
- Install homebrew
- Install VS Code

# Python
macOS has 2.7 (```python```, ```python2```) and 3.8 (```python3```) preinstalled. I installed 3.9 through homebrew. Then I wrote one more line to overwrite the alias ```python``` to ```python3``` in ```~/.zprofile```.

# Go
My next target is installing Go lang. I like the concept of the language and one of my friends recommended to learn it. I installed version 1.15.3 by using homebrew.

# Julia
This is another language that another friend recommended. The video from [Julia Academy](https://juliaacademy.com/) said "Looks like Python, feels like Lisp, and runs like C or Fortran." As like other stuff, installed this by using homebrew

# Docker
I used classic stuff for a long time. It's time to catch up on at least one trendy thing. I read about Docker a long time ago. As I understand, it's a VM but works like LEGO. For example, you want to virtualize something for your project. If you are using Virtual Box, you have a lot of things to do. You need to create an instance, an image, and then install whatever you need or want to run. With Docker, download the images you want to use then run them on one instance. If I misunderstood something, please let me know :) I just downloaded the dmg file from their website.
