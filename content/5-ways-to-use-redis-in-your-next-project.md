---
title: "5 Ways to Use Redis in Your Next Project"
date: 2020-11-17T10:43:15Z
tags: [redis, node, database]
draft: false
---

If the best code is no code at all, then the next best thing is code, that you can explain in one simple sentence. 

For example, like this:

>Redis holds a variety of structures in memory and lets you manage them through a text based command protocol.

Despite, or maybe, because of its simplicity, Redis has plenty of utility in modern web architecture.
<!--more-->

## 1. Key-Value storage: Caching & Temporary codes

Redis is as fast, as a data storage can possibly be, because all operations are performed entirely on in-memory data. As a bonus, you can specify time-to-live (TTL) for values.

`SET key value EX seconds` will store your *value* in *key* for *seconds*, which you can retrieve with `GET key`.

Redis also supports key eviction, which is described in detail [here](https://redis.io/topics/lru-cache)

## 2. PubSub: subscriptions to messages

PubSub can be used for a lot of things from chat implementation to data updates and naive event management.

`SUBSCRIBE channel` to start listening, `PUBLISH channel message` to post a message and `UNSUBSCRIBE channel` to stop. 

A more detailed explanation with examples can be found in official [docs](https://redis.io/topics/pubsub)

## 3. Streams: event streaming for micro-services

Redis streams are similar PubSub, but stream messages can be marked as received. This allows Redis to be used as a core for micro-services architecture, allowing them to communicate between themselves in a reliable and fast manner. Think of Redis here as barebones Apache Kafka. 

One service can `XADD stream * field1 value1 field2 value2` while the others are listening via `XREAD stream`. 

There's much more to it, and its best described in official ["Introduction to Redis streams"](https://redis.io/topics/streams-intro) 

## 4. Geolocation indexing

You can add items with `GEOADD key longitude1 latitude1 place1 longitude2 latitude2 place2` and then you can:

- Calculate distance between two places with `GEODIST key place1 place2`
- Find all items around a certain point with `GEORADIUS key longitude latitude radius unit`, where unit is m, km, ft or mi

As you already guessed, there's more to it in [official docs](https://redis.io/commands/geoadd)

## 5. Primary database

I love to think of Redis as a database framework. Using sets, lists and hashes you can create indexes, tailored for your data. You can check out some really nice examples on how to so it in ["Secondary indexing with Redis"](https://redis.io/topics/indexes).

But of course, having to build your own data structures will result in having to perform composite operations to read or manipulate data. Not to worry though, Redis has [built-in scripting support](https://redis.io/commands/eval).

For example, we could store items in hashes, their identifiers in a list and retrieve a subset of items with:
```lua
local ids = redis.call('lrange',KEYS[1],ARGV[1],ARGV[2])
local result = {}
for i,id in ipairs(ids)
do
   local key = KEYS[1] .. '::' .. id
   result[i] = redis.call('hgetall',key)
   table.insert(result[i],'id')
   table.insert(result[i], id)
end
return result
```

While this approach is more complicated in comparison to a "real" database, it does have several pros:

- Predictable speed. Using time complexity, provided in Redis docs in big O notation, you can calculate time complexity for your own scripts and complex commands. 
- Fast reads and writes. You won't need secondary indexes or caching with other tools - Redis is fast and furious. Do try it's [benchmarks](https://redis.io/topics/benchmarks) sometime!
- Easy mocking for unit testing with tools like [ioredis-mock](https://github.com/stipsan/ioredis-mock) or even your own implementation.
- Runs in small environments. Redis has incredibly small memory footprint: 3MB for an empty instance and about 85MB for 1 million small keys! It even runs on Raspberry Pi
- Easy backups. Just `save` your data to `/var/lib/redis/dump.rdb`

While the cons are:
- Complexity, because with great power comes great responsibility.
- Data size is limited to available memory.
- [Limited partitioning support](https://redis.io/topics/partitioning)
- Doesn't fit for storing BLOBs

All and all I encourage you to give Redis-as-a-database a try just to have ~~bragging rights~~ a better understanding on how data storages work.