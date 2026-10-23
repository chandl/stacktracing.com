---
title: "Follow These 12 Guidelines to Build Good Software"
date: 2026-07-10
description: "The Twelve-Factor App is a set of 12 guidelines for building software that is easy to deploy, scale, and maintain. In this post, you will learn what each one means."
image: "/images/follow-these-12-guidelines-to-build-good-software.jpg"
wpPath: "/follow-these-12-guidelines-to-build-good-software/"
---

Is there a simple checklist for building software that is easy to run in the cloud? As it turns out, there is. The [Twelve-Factor App](https://12factor.net) is a methodology that was written by developers at Heroku for building software-as-a-service applications that are easy to deploy, scale, and maintain. It was published in 2011, and its advice has held up well, especially for containers and cloud platforms. In this article, you will learn what each of the 12 factors says and why it matters.

# 1. Codebase

**One codebase tracked in version control, many deploys.**

An application has exactly one codebase, which means one repository, and that same code is deployed to staging, production, and every developer's machine. If two applications need to share code, pull it out into a library. If you have many repositories for what is really a single application, then what you have is a distributed system, not an app.

# 2. Dependencies

**Explicitly declare and isolate dependencies.**

Never rely on a package that "happens to be installed" on the host. Declare every dependency in a manifest like `package.json`, `requirements.txt`, or `pom.xml`, and use lock files and isolation (virtual environments or containers) so that your builds can be reproduced on any machine.

# 3. Config

**Store config in the environment.**

Anything that changes between deploys, like database URLs, API keys, and feature toggles, should be kept out of the code. The simplest and most portable place to keep it is in environment variables.

```bash
DATABASE_URL=postgres://user:pass@db.internal:5432/app
LOG_LEVEL=info
```

A good test is to ask whether you could open source the codebase right now without leaking any credentials.

# 4. Backing Services

**Treat backing services as attached resources.**

Databases, caches, queues, and email providers should all be reached through a URL or a set of credentials that comes from config. Switching from a local PostgreSQL to a managed one should only need a config change, not a code change.

# 5. Build, Release, Run

**Strictly separate the build and run stages.**

The build stage converts your code into an executable bundle, the release stage combines that build with a specific config, and the run stage executes the release. Releases should be immutable and have a version or ID, which makes rolling back as simple as running the previous release. Never edit code on a running server.

# 6. Processes

**Execute the app as one or more stateless processes.**

Processes share nothing, and they don't keep important state in memory or on the local disk between requests. Anything that needs to persist belongs in a database or another backing service. It is best to avoid sticky sessions that tie a user to one process too. Stateless processes can be started, stopped, and replicated freely.

# 7. Port Binding

**Export services via port binding.**

The app should be self-contained and make itself available by listening on a port, instead of depending on a web server that is injected into it at runtime. That way, one app can become the backing service of another app simply by being reachable at a URL.

# 8. Concurrency

**Scale out via the process model.**

To handle more load, run more processes, and use different process types for different workloads: web processes for requests, and worker processes for background jobs. This kind of horizontal scaling is simple, and it works well with container orchestrators.

# 9. Disposability

**Maximize robustness with fast startup and graceful shutdown.**

Processes should start in a few seconds, and they should shut down cleanly when they receive a termination signal by finishing the current request, releasing their resources, and returning any jobs to the queue. When processes are disposable, deploys, autoscaling, and crash recovery all become painless.

# 10. Dev/Prod Parity

**Keep development, staging, and production as similar as possible.**

The idea here is to narrow three gaps. The time gap, by deploying often instead of every few months. The people gap, by having the developers who write the code be involved in deploying it. And the tools gap, by using the same kinds of databases and services in development as in production (for example PostgreSQL in both, and not SQLite on your laptop). Containers make this a lot easier to do.

# 11. Logs

**Treat logs as event streams.**

The application shouldn't manage log files. It writes its events straight to standard output, and the environment captures them and routes them to a log aggregator where they can be searched and analyzed. Structured logs, such as JSON, are far more useful here than free-form text.

# 12. Admin Processes

**Run admin and management tasks as one-off processes.**

Database migrations, console sessions, and one-time scripts should run in the same environment as the regular app, from the same codebase and config, as short-lived processes. They shouldn't be run from a server that someone edited by hand.

# Putting It to Use

You don't need to follow the twelve factors perfectly, and not every one of them will apply to every project. A quick way to use them is to ask yourself a question for each one. Can a fresh machine build this with a single command? Are all of the secrets outside of the code? Can I roll back to the previous release instantly? Can I kill any instance at any time without losing data? Do my logs go to standard output? Wherever the answer is "no", you have found something worth fixing.

# Conclusion

Together, the twelve factors describe applications that are portable, easy to scale, and easy to operate. If you are starting a new service, treat them as a checklist. If you are maintaining an older one, pick the factor that your system violates most painfully and start there.
