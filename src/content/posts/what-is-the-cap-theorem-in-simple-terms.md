---
title: "What is the CAP Theorem in Simple Terms?"
date: 2026-01-09
description: "The CAP theorem says a distributed data store can only guarantee two of three things: consistency, availability, and partition tolerance. In this post, you will learn what that really means."
image: "/images/what-is-the-cap-theorem-in-simple-terms.jpg"
wpPath: "/what-is-the-cap-theorem-in-simple-terms/"
---

If you have ever read about distributed databases, you have probably run into the CAP theorem. It gets thrown around a lot in system design interviews and database comparisons, but it is rarely explained in a way that sticks. In this article, you will learn what the three letters stand for, why a system can't have all of them at once, and how to use the theorem when you are choosing a database.

# What is the CAP Theorem?

The CAP theorem was first presented by Eric Brewer in 2000 and later proven by Seth Gilbert and Nancy Lynch. It applies to any distributed data store, which is just a system that keeps copies of its data on more than one machine. The theorem states that when a network failure splits that system into groups of nodes that can't talk to each other, the system has to pick between being consistent and being available.

Before we get to why that is true, we need to understand what each property actually means, because the words are a little different from how we use them day to day.

## The Three Properties

- **Consistency (C):** Every read returns the most recent write, or an error. Basically, all clients see the same data at the same time, as if there was only a single copy. Note that this is not the same "consistency" as the C in ACID. It is much closer to what is called linearizability.
- **Availability (A):** Every request sent to a node that is working gets a real response, not an error. The response doesn't have to contain the latest data, but it does have to come back.
- **Partition Tolerance (P):** The system keeps working even if the network drops or delays messages between nodes.

## Why You Can't Have All Three

Imagine a database with two nodes, A and B, that copy every write to each other. Suddenly the network link between them breaks, which is called a **partition**. Both nodes are still running, and clients can still reach both of them.

Now a client writes `balance = 50` to node A, and right after that another client reads the balance from node B. Node B never heard about the write, so it has two choices:

1. Return the old value. B stays *available*, but it gave you stale data, so the system is no longer *consistent*.
2. Return an error (or wait) until the link comes back and it can sync with A. The system stays *consistent*, but B is no longer *available*.

There isn't a third option. B can't know about a write that it never received. That is the entire theorem: during a partition, you have to give up either consistency or availability.

# Partitions Are Not Optional

CAP is usually drawn as a triangle where you "pick any two", and that is where most of the confusion comes from. In a real system you don't get to pick partition tolerance. Networks fail, switches reboot, and cloud availability zones lose connectivity. As soon as your data lives on more than one machine, you will have partitions, so P is a given.

The real question is what your system should do while the partition is happening. This is how that splits the databases that you have likely heard of:

- **CP systems** refuse some requests in order to keep the data correct. Examples are ZooKeeper, etcd, and HBase, as well as most relational databases that use synchronous replication.
- **AP systems** keep answering requests and accept that some of the data may be stale for a while. They reconcile the differences once the network is healed. Examples are Cassandra, DynamoDB (with eventually consistent reads), Riak, and CouchDB.

It is worth noting that when there is no partition, a well-built system can give you both consistency and availability. CAP only forces the trade-off when something is broken.

# Which One Should You Choose?

The easiest way to decide is to ask yourself what would be worse for your users: a wrong answer or no answer.

If you are building something that deals with money, like a bank balance or an inventory count, a wrong answer can cost real dollars through double-spending or overselling. In that case an error message is better than a bad number, so you want a CP system. If you are building a social feed, a product catalog, or a "like" counter, a value that is a few seconds old is harmless, but being down is not. Those workloads are a good fit for an AP system.

A shopping cart is the classic AP example. It is better to let someone add an item to their cart and merge any conflicts later than it is to block them from buying something.

Keep in mind that many databases let you tune this on a per-query basis. Cassandra and DynamoDB, for example, let you ask for stronger consistency on a single read, at the cost of higher latency and lower availability for that request.

# What CAP Doesn't Tell You

There are a few things that CAP is often blamed for that it doesn't actually say:

- It doesn't talk about normal latency. Even without a partition, stronger consistency usually means more round trips between nodes. The PACELC theorem extends CAP to cover this: if there is a **P**artition, choose **A** or **C**; **E**lse, choose **L**atency or **C**onsistency.
- It doesn't permanently label a database as "CP" or "AP". The replication settings and the query you run change where a system lands.
- It doesn't say that eventual consistency is broken. Eventually consistent systems converge on the same value once the partition heals, and for many applications that is exactly what you need.

# Conclusion

A distributed system will eventually have a network partition, so partition tolerance isn't really optional. What the CAP theorem tells you is that while a partition is happening, you can either answer every request with possibly stale data (AP) or stay correct and sometimes return errors (CP). When you are picking a database, decide which of those two failures your users can live with, and choose accordingly.
