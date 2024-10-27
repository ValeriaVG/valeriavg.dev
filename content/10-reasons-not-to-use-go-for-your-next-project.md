---
title: "10 Reasons NOT to Use Go for Your Next Project"
date: 2021-12-06T15:58:52Z
tags: [webdev, go, node, irony]
draft: false
dev_to: "https://dev.to/valeriavg/10-reasons-not-to-use-go-for-your-next-project-313i"
summary: |
  They say Go is the language of the web. Of course, with Google backing it up it sounds very objective! But is it as good as they say? I can  think of cases where it wouldn't be a good fit
id: "1eac5fa0-9437-11ef-af43-558f8bb50797"
---

They say Go is the language of the web. Of course, with Google backing it up it sounds very objective! But is it as good as they say? I can think of cases where it wouldn't be a good fit

## 1. You need your app to compile for at least an hour so you can get a break

Totally relatable. With Go compile speed you won't be able to even stand up from your chair, let alone grab a coffee! No, really, do they even compile it all?! I had TypeScript taking longer to check a small project than `go run`!

## 2. You love code puzzles

With Go, it's really hard to write frustrating code. No classes, no multiple inheritances, no overriding. Heck, there is only one way to do loops! It's almost impossible to create a great puzzling labyrinth of dependencies so that your team could enjoy a nice challenge every once in a while. Who would settle for a tool like that?!

## 3. You hate default values

In Go, every variable always has a value. An integer would be created with a `0`, a string would be an empty string and so on. Why would you leave JavaScript with its variety of `null`, `undefined` and empty values for such a limited language?!

## 4. You don't like to handle errors

While Go programs can panic, the Go way of handling errors is to return them as a last return value and handle them explicitly or explicitly ignore them. Every! Time! Ugh! Where's the fun in it? So much boilerplate and so little debugging! Don't you feel the joy every time an exception is thrown somewhere inside of a dozen `try{}catch{}` wrappers?

## 5. You are a true patriot of your favourite language

Those devs these days have no loyalty, am I right? They hop from one mainstream train to another! I think they are just lazy! Back in the day, we were writing code in Notepad without any checks and we've done just fine. Nowadays some program does half of the programmer's job, no one even needs to remember the proper syntax or care about formatting. And Go is the worst: it won't even compile with an unused variable!

## 6. You like to watch spinners

Go is fast and so are the requests to API, written in Go. So fast that you'll barely see a spinner in the client application! Are we supposed to set a timeout now or what? How would the users enjoy our unique spinner designs if they can't see them?!

## 7. Your server is running on Windows'98

I don't know how you guys put up with it. Go won't even launch on my dedicated Windows'98 server! It was with me my whole career and now I'm supposed to abandon it?! For what? Your cloud servers have no personality! You won't even notice if it'd be replaced by another machine. And Go is all about the cloud!

## 8. Your hosting provider only supports PHP & MySQL

Who do you call a dinosaur?! This technology has withstood the test of time and no new fancy tech can say that. Go was released just the other day, in 2009, while PHP dates back to 1995!

## 9. Your application requires full control over memory

Jokes aside, everything comes at a price and Go is great for a lot of things, but Go was intentionally created "less memory safe". And as long as you run your application in a dedicated cloud container it will not become an issue, but if you're dealing with strict security requirements for a consumer application, you are probably better off with Rust or another system language.

## 10. You are writing embedded software or an OS

Go will only compile to a supported platform. You can't write a custom operational system in Go or run it on bare metal. Once again, Rust could back you up here since Go is simply not made for it.

I've run out of reasons not to write in Go. I love Rust, but Go is almost as fast yet much, much simpler to learn and write in. I love Node.js + TypeScript, but I love performance and runtime type-checks more.

For the next CLI or API, I'm going with Go. What about you?
