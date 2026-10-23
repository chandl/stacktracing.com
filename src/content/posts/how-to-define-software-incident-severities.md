---
title: "How to Define Software Incident Severities"
date: 2026-05-08
description: "Incident severity levels give your team a shared way to answer 'how bad is it?'. In this post, you will learn how to define them and what to attach to each level."
image: "/images/how-to-define-software-incident-severities.jpg"
wpPath: "/how-to-define-software-incident-severities/"
---

When something breaks in production, the first question is always "how bad is it?" If every person on your team answers that differently, you end up with either panic over small problems or a shrug at big ones. Severity levels fix this by giving everyone the same scale. In this article, you will learn why severities matter, how to define them, and the mistakes to avoid.

# Why Do Severities Matter?

A severity level is a label that gets attached to an incident, and it decides how the team responds. It answers a few practical questions: who gets paged (and whether they get woken up at night), how quickly the work has to start, who needs to be told, and what process applies afterward, such as whether a postmortem is required. Without it, the priority tends to be set by whoever is the loudest in the chat channel.

# Base Severity on Impact

The most important rule is that severity measures the impact on your customers and your business, not how interesting or difficult the technical problem is. A subtle race condition that doesn't corrupt any data might be a low severity. A typo in a config file that takes down checkout is as high as it gets.

Some good questions to ask when you are judging impact:

- How many users are affected, and how important are they?
- Is the core function of the product unavailable, or is it only slower or degraded?
- Is any data being lost, corrupted, or exposed?
- Is there a security or legal impact?
- Is there a workaround?
- Is money being lost, or is a contractual commitment (an SLA) at risk?

# A Starting Set of Levels

Four levels are enough for most teams, and more than that usually just makes people forget which is which. Here is a set that you can adapt.

## SEV1: Critical

A major outage, or a data loss or security breach that affects most users. A core function is unavailable and there is no workaround. Examples are the whole site being down, payments failing for everyone, or customer data being exposed. A SEV1 pages somebody immediately, at any hour. It gets a dedicated incident commander, regular updates to leadership and on a public status page, and a postmortem afterward.

## SEV2: High

A significant degradation or the loss of an important feature for many users, or a total outage for a smaller group. Examples are search being broken, one region being unavailable, or latency being severely high. A SEV2 pages immediately during the day, and out of hours too if the impact is ongoing. It also gets an incident commander and a postmortem.

## SEV3: Medium

A partial or minor feature is impaired, a workaround exists, or only a handful of users are affected. An example is a report that fails to generate, or a non-critical integration that is running behind. These are handled during business hours and tracked in the ticket system. A postmortem is optional.

## SEV4: Low

Cosmetic issues or ones with minimal impact, such as a typo, a small UI glitch, or a broken internal tool. These go into the normal backlog and are prioritized like any other work.

# Make the Definitions Concrete

Vague words like "significant" and "major" invite a debate in the middle of an incident, which is the worst time to have one. Wherever you can, write the definitions as conditions that can be measured, and tie them to your monitoring. For example:

- The availability of the checkout API is below 99% over 5 minutes.
- p99 latency is above 5 seconds for 10 minutes.
- Any confirmed exposure of customer personal data (always SEV1).

When you do this, an alarm can suggest an initial severity, and the person responding only has to confirm it.

# Rules That Keep It Honest

There are a few habits that help the system keep working:

- **When in doubt, go higher.** It is a lot cheaper to downgrade an incident than it is to under-respond to a serious one.
- **Severity can change.** Reassess as you learn more. A SEV3 that turns out to hit every customer becomes a SEV1, and the changes should be recorded.
- **One person makes the call.** The incident commander or the on-call engineer sets and adjusts the severity, so it doesn't turn into a vote.
- **Severity isn't priority.** Severity describes the impact right now, while priority is how soon you will schedule the fix. A SEV2 that is mitigated with a rollback can have a low-priority follow-up for finding the root cause.

# Tie Each Level to Actions

A severity level is only useful if it triggers something. For each level, write down who is paged and how, how quickly they need to acknowledge and send a first update, which roles are needed (incident commander, communications lead, subject matter experts), how often updates go out (every 30 minutes for a SEV1, for example), and what the follow-up is.

# Common Mistakes

The most common mistake is declaring everything a SEV1. People burn out, and they begin to ignore pages. Another one is defining severity based on who owns the system. An internal service can still be a SEV1 if it blocks all customer traffic. Also, try not to argue over the level during the incident. Pick the best fit quickly and get back to fixing the problem. Finally, review your levels after an incident where the label felt wrong, since a policy that is written once and never revisited will drift away from how your team actually works.

# Conclusion

Define severity by impact, keep the scale small, write each level in terms that can be measured, and attach a clear response to each one. The levels above are a good place to start. Test it against a few of your past incidents to see if it would have given the right answer, and adjust from there.
