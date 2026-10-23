---
title: "How does CI/CD work?"
date: 2026-01-30
description: "CI/CD automatically builds, tests, and releases your software every time the code changes. In this post, you will learn what a pipeline looks like and what makes a good one."
image: "/images/how-does-ci-cd-work.jpg"
wpPath: "/how-does-ci-cd-work/"
---

Have you ever heard a team talk about "shipping ten times a day" and wondered how anyone does that without everything catching fire? The answer is almost always CI/CD. In this article, you will learn what continuous integration and continuous delivery actually mean, what the steps in a pipeline look like, and what separates a good pipeline from one that everybody ignores.

# The Problem CI/CD Solves

Picture how a release used to work. Developers each spend a few weeks on their own branch, and then all of those branches are merged together right before the release. Almost always, the pieces don't fit together on the first try, so there is a scramble to fix the conflicts and the bugs. Once it finally works, somebody follows a checklist to build the application and copy it to a server by hand, and every step in that checklist is a chance for a mistake.

The longer the time between writing code and running it in production, the harder it is to figure out what broke. CI/CD fixes this by making integration and releases small, frequent, and automatic.

# Continuous Integration (CI)

Continuous integration means that developers merge their changes into a shared branch often, usually at least once a day, and that every merge triggers an automated build and test run. The goal is fast feedback. If a change breaks something, you find out a few minutes later while the code is still fresh in your head, and not three weeks later in the middle of a big merge.

A CI run typically does the following:

1. Checks out the code for the commit being tested.
2. Installs the dependencies, ideally from a cache.
3. Builds the project.
4. Runs the automated tests, starting with the fast unit tests and moving on to the slower integration tests.
5. Runs checks like linting, type checking, and security scans.
6. Reports the result back on the pull request.

# Continuous Delivery vs. Continuous Deployment

The "CD" in CI/CD can mean two different things, and people mix them up all the time.

**Continuous delivery** means that every change that passes the pipeline is ready to be released to production, but a person still decides when to do it, usually by pressing a button. **Continuous deployment** goes one step further: every change that passes the pipeline goes to production automatically, with nobody in the loop.

Continuous deployment requires a lot of trust in your automated tests and your monitoring, since no human is reviewing the release before customers see it. Many teams start with continuous delivery and move to continuous deployment as their confidence grows.

# What a Pipeline Looks Like

A pipeline is a series of stages, where each stage has to succeed before the next one starts. A simple one looks like this:

```text
commit → build → test → package → deploy to staging → verify → deploy to production
```

The build stage compiles the code and creates an **artifact**, such as a container image, a JAR file, or a bundle of static files. The test stage runs the automated tests against that build. In the package stage, the artifact gets published to a registry and tagged with the commit hash, so you always know exactly what is running. After that, the same artifact is deployed to a staging environment that looks like production, and a few smoke tests or end-to-end tests are run against it. If those pass, the artifact is released to production.

One thing to note is that you should never rebuild between environments. The artifact that you tested is the artifact that you ship, and only the configuration changes.

# Deployment Strategies

How the new version replaces the old one matters just as much as the pipeline itself. There are a few common strategies:

- **Rolling:** Instances are replaced a few at a time, so there is no downtime.
- **Blue/green:** The new version runs next to the old one, and traffic is switched over all at once. Rolling back is as simple as switching back.
- **Canary:** A small percentage of traffic is sent to the new version first, and you watch your metrics before sending the rest.
- **Feature flags:** The new code is deployed but switched off, and then turned on for users separately. This splits *deploying* from *releasing*.

# What Makes a Good Pipeline

A pipeline only helps if people actually trust it, and there are a few things that go a long way here. First, it has to be fast. If CI takes an hour, developers stop waiting for it and start working around it, so cache your dependencies, run tests in parallel, and put the quickest checks first. Second, it has to be reliable. Flaky tests that fail at random teach everybody to ignore a red build, so fix them or delete them.

It also helps to define the pipeline as code, stored in the same repository as the application. That way it is versioned and reviewed like everything else. Finally, make sure that you can roll back quickly. If undoing a release is difficult, people will be afraid to ship, and the whole point of CI/CD is the opposite.

# Common Tools

You don't need to build any of this yourself. GitHub Actions, GitLab CI/CD, Jenkins, CircleCI, and Buildkite can all run your pipelines, and tools like Argo CD and Flux handle deployments to Kubernetes. They all follow the same idea: a file in your repository describes the stages, and a runner executes them on every change.

# Conclusion

CI/CD is about shortening the distance between writing code and running it in production, and making each step on that path automatic. Merge small changes often, let a pipeline build and test every one of them, and release the same tested artifact to production. The result is faster delivery and, surprisingly, fewer incidents, because every release is small enough to understand.
