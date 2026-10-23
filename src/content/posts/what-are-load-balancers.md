---
title: "The DevOps Guide to Load Balancers"
date: 2026-03-13
description: "A load balancer spreads requests across a group of servers. In this post, you will learn how they work, which metrics to alarm on, and how to troubleshoot the problems you are most likely to run into."
image: "/images/what-are-load-balancers.jpg"
wpPath: "/what-are-load-balancers/"
---

A load balancer sits in front of a group of servers and spreads incoming requests across them. It is one of the most common pieces of infrastructure out there, and also one of the most common places for a confusing outage to hide. In this article, you will learn what load balancers do, how they choose where to send a request, which metrics and alarms you should set up, and how to troubleshoot the problems that you are most likely to see.

# What Does a Load Balancer Do?

Basically, a load balancer gives your clients a single address, and then forwards each request to one of several healthy backends. This gives you a few things for free. You can scale by adding more backends, you stay available when one of them dies, and you can deploy without downtime by taking a backend out of rotation, updating it, and putting it back. It is also a convenient place to terminate TLS, apply rate limits, or route requests based on the hostname or path.

## Layer 4 vs. Layer 7

Load balancers generally work at one of two layers of the network stack. A **layer 4** load balancer balances TCP or UDP connections without looking inside them, which makes it very fast and able to handle any protocol. The AWS Network Load Balancer is an example of this. A **layer 7** load balancer understands HTTP, so it can route based on the hostname, path, or headers, and it can rewrite requests along the way. The AWS Application Load Balancer, NGINX, HAProxy, and Envoy all work at this level.

If you need content-based routing, use layer 7. If you need raw throughput or are balancing something that isn't HTTP, layer 4 is the way to go.

## How a Backend Gets Chosen

The balancing algorithm decides which backend gets each request. The most common ones are:

- **Round robin:** Requests go to each backend in turn. It is simple and works fine when all requests cost about the same.
- **Weighted round robin:** The same idea, but bigger servers get a larger share.
- **Least connections:** The request goes to the backend with the fewest active connections, which works better when requests vary a lot in how long they take.
- **IP hash:** The same client always lands on the same backend. This is helpful for caches and sticky sessions.

# Health Checks

A load balancer is only useful if it stops sending traffic to broken backends. It does this with health checks, which probe each backend on an interval and mark it as unhealthy after a number of failures in a row. Here is what that looks like in NGINX:

```nginx
upstream app {
    server 10.0.0.11:8080 max_fails=3 fail_timeout=10s;
    server 10.0.0.12:8080 max_fails=3 fail_timeout=10s;
}
```

There are a couple of things to watch out for with health checks. The check should hit a dedicated endpoint like `/healthz`, and it should verify what the instance needs in order to serve traffic. It should not check every downstream dependency, though. If your database has a hiccup and every backend fails its health check at the same moment, the load balancer has nothing left to send traffic to, and a small problem becomes a full outage. You will also want to tune the thresholds. If they are too sensitive, instances flap in and out of rotation, and if they are too slow, users keep hitting a dead server.

# Metrics and Alarms to Set Up

Most load balancers publish metrics for free, and these are the ones that I would make sure to have alarms on:

- **Request count:** This is your traffic baseline. Alarm if it drops sharply, which usually means something upstream is broken, or if it spikes, which could be an attack or a retry storm.
- **Backend 5xx errors:** These mean your application is failing. Alarm when the rate stays above your normal baseline for a few minutes.
- **Load balancer 5xx errors (502, 503, 504):** These mean there are no healthy backends, or the balancer is overloaded. Alarm on any sustained occurrence.
- **Target response time:** Look at p50, p95, and p99 instead of the average. Alarm when p99 passes your latency objective.
- **Healthy host count:** This tells you how much capacity you have left. Alarm if it falls below the number of hosts needed to serve peak load.
- **Rejected or queued connections:** Anything above zero means the balancer is dropping traffic.

Where you can, alarm on ratios and percentiles instead of raw counts, and alarm on what the user sees (errors and latency) before you alarm on a cause.

# Troubleshooting Common Problems

Most load balancer problems show up as a status code, and each code points to a different part of the request path.

**502 Bad Gateway.** The load balancer got an invalid response from a backend, or the backend closed the connection unexpectedly. Check that the backend is listening on the port you expect and that it didn't crash. A very common cause of intermittent 502s is a backend whose keep-alive timeout is *shorter* than the load balancer's idle timeout, so the backend closes connections that the balancer still thinks are open.

**503 Service Unavailable.** Usually this means no healthy backends are registered. Look at the health check configuration, and make sure that security groups and firewalls allow the balancer to reach the health check path.

**504 Gateway Timeout.** The backend took longer to respond than the load balancer is willing to wait. Find the slow request, which is often a slow database query or a slow downstream service. Raising the timeout will hide the problem instead of fixing it.

**Uneven load across backends.** Look for sticky sessions that pin your heaviest users to one host, long-lived connections like WebSockets that stay on the backend where they started, or an algorithm that doesn't suit your traffic. Switching to least connections often helps.

**The wrong client IP in your logs.** Your backends see the address of the load balancer. To get the real client address, read the `X-Forwarded-For` header, and only trust it when it comes from your own load balancer.

**Failures right after a deploy.** Make sure new instances only receive traffic once they are ready, and that old ones are drained before they are removed. Connection draining (sometimes called deregistration delay) lets in-flight requests finish.

# The Load Balancer is a Single Point of Failure Too

One last thing to keep in mind is that a single load balancer instance is a risk of its own. Managed cloud load balancers are spread across availability zones for you. If you run your own with NGINX or HAProxy, run at least two of them and put something like a floating IP or DNS in front, so that one failure doesn't take everything down.

# Conclusion

A load balancer spreads traffic, removes failed backends using health checks, and gives you a safe way to deploy and scale. Pick layer 4 or layer 7 based on what you need, keep your health checks meaningful but shallow, and alarm on errors, latency, and healthy host count. When something does go wrong, start with the status code, since 502, 503, and 504 each tell you where to look first.
