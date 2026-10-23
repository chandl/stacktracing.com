---
title: "What are Consensus Algorithms?"
date: 2026-08-14
description: "Consensus algorithms like Paxos and Raft let a group of unreliable machines agree on a single value. In this post, you will learn the problem they solve and how they work."
image: "/images/what-are-consensus-algorithms.jpg"
wpPath: "/what-are-consensus-algorithms/"
---

How can a group of computers agree on a single answer when any of them can crash and the network between them can fail at any time? This is known as the consensus problem, and solving it is what allows databases to stay consistent, clusters to elect a leader, and tools like etcd and ZooKeeper to work reliably. In this article, you will learn what consensus is, why it is such a hard problem, and how the two best-known algorithms, Paxos and Raft, approach it.

# What is Consensus?

A consensus algorithm lets a group of nodes agree on a value, even if some of them fail along the way. For an algorithm to be correct, it has to guarantee three things:

- **Agreement:** No two nodes decide on different values.
- **Validity:** The value that is decided was actually proposed by one of the nodes. It can't be made up.
- **Termination:** Every node that is still working eventually decides on a value.

Once you have those guarantees, you can build very useful things on top of them, such as electing exactly one leader, deciding the order of transactions, or keeping multiple replicas of a database identical.

# Why is Consensus So Hard?

On a single machine, agreement is trivial. In a distributed system, a lot of things get in the way. Nodes can crash at any moment, including halfway through an operation. Messages can be delayed, lost, duplicated, or arrive out of order. There is also no shared clock, so you can't rely on timestamps to decide who went first.

Worst of all, a node can't tell the difference between another node that has died and one that is just slow. There is even a famous result, the FLP impossibility theorem, which proves that in a fully asynchronous system no algorithm can guarantee consensus if even a single node might crash. Real algorithms get around this by using timeouts, randomness, or some assumptions about timing. In practice, they always keep their **safety** (nodes never disagree), and they only give up **liveness** (making progress) when the network is behaving badly.

# Quorums

Almost all practical consensus algorithms are built on the idea of a quorum, where an operation is only committed once a majority of the nodes have accepted it. Any two majorities overlap in at least one node, so a later decision is guaranteed to run into evidence of an earlier one.

This is why clusters usually have an odd number of nodes. A cluster with `2f + 1` nodes can tolerate `f` failures, so 3 nodes tolerate 1 failure and 5 nodes tolerate 2. If a cluster loses its majority, it stops accepting writes instead of risking disagreement, which is the consistency-over-availability choice from the CAP theorem in action.

# Paxos

Paxos was introduced by Leslie Lamport, and it is the foundational consensus algorithm. In its basic form there are three roles, which a single node can play all at once: proposers suggest values, acceptors vote on those proposals, and learners find out what was decided.

The algorithm works in two phases. In the first phase (prepare and promise), a proposer picks a unique proposal number that keeps increasing, and asks a majority of acceptors to promise that they will not accept any lower-numbered proposal. The acceptors answer with any value that they have already accepted. In the second phase (accept), the proposer asks the acceptors to accept a value. If any acceptor reported a previously accepted value, the proposer has to use the one with the highest number, otherwise it can use its own. Once a majority of acceptors accept it, the value is chosen.

Paxos is correct and well proven, but it has a reputation for being hard to understand and even harder to implement. Real systems need Multi-Paxos to agree on a whole sequence of values, and a lot of the details are left up to the person implementing it.

# Raft

Raft was designed specifically to be easier to understand while giving the same guarantees. It breaks the problem into three parts.

## Leader Election

Every node is either a follower, a candidate, or a leader, and time is split into numbered terms. The leader sends out regular heartbeats. If a follower stops hearing them, it becomes a candidate, increases the term, and asks the other nodes for their votes. A candidate that gets votes from a majority becomes the new leader. Election timeouts are randomized, which makes split votes rare.

## Log Replication

All client requests go to the leader, which adds each one to its log and sends it to the followers. Once a majority has stored the entry, it is committed, and the leader applies it and replies to the client. The followers apply committed entries in the same order, so every node ends up in an identical state. A write looks roughly like this:

```text
client → leader: "set x = 5"
leader → followers: append entry (term 3, index 17)
followers → leader: ack
leader (majority acked): commit, apply, reply "ok"
leader → followers: "entry 17 committed"
```

## Safety

Raft guarantees that a node can only win an election if its log is at least as up to date as the logs of a majority of nodes. This means that a committed entry can never be lost by a new leader.

Raft is used by etcd, Consul, CockroachDB, and many other systems. If you want to learn more, the paper *In Search of an Understandable Consensus Algorithm* is a very readable place to start.

# Other Algorithms

Paxos and Raft aren't the only options. ZAB is the protocol behind ZooKeeper, and Viewstamped Replication is another close relative. There are also Byzantine fault tolerant algorithms such as PBFT, which can handle nodes that behave maliciously and not only ones that crash. They need more nodes (`3f + 1` to tolerate `f` bad ones) and are mostly used in blockchains and other places where you can't trust the participants.

# Where You Will See Consensus

You probably won't ever write a consensus algorithm yourself, but you rely on one whenever you use etcd (which stores the state of a Kubernetes cluster), ZooKeeper, or Consul for configuration and leader election. Distributed databases like CockroachDB, Spanner, and TiDB use it to replicate data, and Kafka uses it to manage its metadata. Knowing how it works helps you understand why your cluster should have an odd number of nodes, why losing a majority stops writes, and why a cluster that spans several regions pays a latency cost on every write.

# Conclusion

Consensus algorithms let unreliable machines agree on a value by requiring a majority to accept it. Paxos is the classic solution, and Raft is a clearer alternative that splits the problem into leader election, log replication, and safety. Both of them guarantee that nodes never disagree, even when the network and the nodes misbehave, and they do it by giving up availability when a majority can't be reached.
