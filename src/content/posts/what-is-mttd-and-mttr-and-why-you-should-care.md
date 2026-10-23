---
title: "This is why You Should Care about MTTD and MTTR"
date: 2026-04-10
description: "MTTD and MTTR measure how quickly you notice and fix problems. In this post, you will learn what they mean, how to calculate them, and how to improve both."
image: "/images/what-is-mttd-and-mttr-and-why-you-should-care.jpg"
wpPath: "/what-is-mttd-and-mttr-and-why-you-should-care/"
---

Every system fails eventually, no matter how well it is built. What separates the teams that stay calm during an outage from the ones that don't is how quickly they notice a problem and how quickly they can fix it. Those two things have names: MTTD and MTTR. In this article, you will learn what they mean, how to measure them, and what you can do to improve them.

# What are MTTD and MTTR?

**MTTD**, or mean time to detect, is the average amount of time between a problem starting and your team finding out about it. **MTTR** is the average amount of time it takes to fix the problem after it has been detected.

The "R" in MTTR is a little ambiguous, since it can stand for repair, recovery, respond, or resolve. Repair is the time spent fixing the problem, recovery is the time until the service is healthy again (which is what your customers care about), respond is the time until someone starts working on it, and resolve is the time until the incident is completely closed, including follow-up work. It doesn't matter much which one you pick, but you should pick one, write it down, and use it everywhere. Otherwise the numbers can't be compared between teams or over time.

## The Timeline of an Incident

It helps to picture a single incident as a line:

```text
failure starts → detected → responded to → mitigated → fully resolved
        |<---- MTTD ---->|<-------------- MTTR -------------->|
```

Your users feel the whole length of that line, so cutting down detection time and cutting down repair time are equally valuable. They are improved in very different ways though, which we will get to shortly.

# How to Calculate Them

For a group of incidents over a period of time, the math is straightforward:

```text
MTTD = sum of (detected_at − started_at) ÷ number of incidents
MTTR = sum of (resolved_at − detected_at) ÷ number of incidents
```

For example, if three incidents took 4, 10, and 1 minutes to detect, then your MTTD is (4 + 10 + 1) ÷ 3 = 5 minutes.

There are two things to be careful about. First, the start time of an incident is a judgment call. The true start is usually when the bad deploy landed or when a dependency began failing, and you generally have to work it out afterward by looking at your metrics. Use the same rule every time. Second, averages hide outliers. A single eight-hour incident can dominate a month of ten-minute ones, so look at the median and the 90th percentile as well.

# Why You Should Care

These numbers map directly to customer impact, since downtime costs money and trust in proportion to how long it lasts. They are also much better goals than "no incidents". You can't promise that nothing will ever break, but you can commit to finding and fixing problems quickly. Finally, they tell you where to invest. A long MTTD tells you to improve your monitoring, and a long MTTR tells you to improve your runbooks, tooling, and deployment safety.

# Reducing MTTD

You can't fix something that you haven't noticed, and the worst way to learn about an outage is from your customers. A few things that help:

- **Alarm on symptoms that users can see,** like error rate, latency, and failed logins, instead of only CPU and memory. Symptoms catch the problems that you didn't predict.
- **Add synthetic checks (canaries)** that exercise your key user journeys every minute from outside of your network, so you find out about failures even when there is no real traffic.
- **Make your alarms trustworthy.** If alarms are noisy, people ignore them or mute them. Every alarm should be actionable.
- **Alarm on missing data.** Silence isn't the same as health, so if a metric stops reporting, that should page someone.
- **Roll out changes gradually,** with something like a canary deployment, so that a bad change is caught on 1% of traffic instead of 100%.

# Reducing MTTR

Once you know about a problem, the goal is to stop the pain as fast as you can.

The quickest fix for a bad deploy is almost always to roll it back, so make rollbacks automatic and practice them. More generally, mitigate first and diagnose later. Roll back, fail over, or turn off a feature flag to get your customers working again, and then dig into the root cause when the pressure is off.

Runbooks are also a big help. Link them directly from the alarm, so the person who gets paged at 3am doesn't have to remember anything. Good observability matters just as much: structured logs, metrics, and traces tied together by a request ID can turn a search that takes hours into one that takes minutes. Lastly, make it clear who is on call and when to escalate, and run practice drills now and then so you find the gaps in your tools and communication when it is safe to do so.

After every incident, hold a blameless postmortem and write down concrete follow-up actions. That is how your MTTR keeps going down over time.

# Pitfalls to Avoid

It is easy to misuse these metrics. If people are judged on their MTTR, they might close incidents early or avoid declaring them at all, so treat the numbers as a way to understand your system and not as a performance score for individuals. Also, a low MTTR doesn't mean much if things break every day, so track how often incidents happen too. Finally, don't average a five-minute blip together with a five-hour data loss event. Break the numbers down by severity.

# Conclusion

MTTD tells you how fast you notice problems, and MTTR tells you how fast you fix them. Define both of them precisely, measure them from real incident timelines, and then work on them separately: better alarms and canaries to find problems sooner, and fast rollbacks, runbooks, and observability to fix them sooner.
