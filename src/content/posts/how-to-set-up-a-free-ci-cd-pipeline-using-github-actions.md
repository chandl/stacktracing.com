---
title: "How to Set up a Free CI/CD Pipeline using GitHub Actions"
date: 2026-02-20
description: "GitHub Actions lets you build, test, and deploy straight from your repository for free. In this post, you will learn how to set up a pipeline in a few easy steps."
image: "/images/how-to-set-up-a-free-ci-cd-pipeline-using-github-actions.jpg"
wpPath: "/how-to-set-up-a-free-ci-cd-pipeline-using-github-actions/"
---

Do you still run your tests by hand and copy your code to a server when you want to release? There is a much better way, and it doesn't cost anything. GitHub Actions lets you build, test, and deploy your code straight from your GitHub repository, and it is free for public repositories and comes with a monthly allowance of free minutes for private ones. In this article, you will learn how to set up a pipeline that tests every change and deploys it automatically. It is a straightforward process, so you should be up and running within minutes!

# What You Need

All you need is a GitHub repository with some code and tests. This guide uses a Node.js project as the example, but the structure is the same for any language.

# How GitHub Actions Works

Before we start, there are a few terms to know:

- **Workflow:** An automated process that is defined in a YAML file under `.github/workflows/`.
- **Event:** What triggers a workflow, such as a `push`, a `pull_request`, or a schedule.
- **Job:** A set of steps that run on the same machine. Jobs run in parallel unless you make them depend on each other.
- **Step:** A single shell command or a reusable **action**.
- **Runner:** The virtual machine that runs a job. GitHub provides Linux, Windows, and macOS runners.

# Create a Workflow File

To get started, create a file called `.github/workflows/ci.yml` in your repository:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

This workflow runs on every push to `main` and on every pull request. It checks out your code, installs Node, and caches your npm dependencies with the `cache: npm` option. After that, it installs exactly what is in your lock file with `npm ci`, and then lints, tests, and builds the project.

Commit and push the file, and then open the **Actions** tab in your repository. You should see the workflow running.

# Make the Checks Required

A pipeline only protects you if people can't merge when it fails. In your repository, go to **Settings**, then **Branches**, and add a branch protection rule for `main`. Turn on **Require status checks to pass before merging** and select the `test` job. From now on, a pull request can only be merged when CI is green.

# Test Across Multiple Versions

If you want to test against more than one version of a language, you can use a **matrix**. It runs the same job once for each value that you give it:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22, 24]
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm test
```

Both versions run in parallel, so you get more coverage without waiting any longer.

# Add Continuous Deployment

Once the tests pass on `main`, you can have the code deployed automatically. To do this, add a second job that waits for the first one. This example deploys a static site to GitHub Pages:

```yaml
name: CI/CD

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

There are a few things to note here. The line `needs: test` means that the deploy job only runs if the tests passed. The build output is created once in the test job and deployed as it is, so what you tested is what you ship. For this to work, you also need to set **Settings**, **Pages**, **Source** to **GitHub Actions** in your repository.

If you want to deploy somewhere else, like a server over SSH, a cloud provider, or a container registry, look for an official action from that provider and add it as a deploy step.

# Use Secrets for Credentials

Never put API keys or passwords in your workflow file. Store them under **Settings**, **Secrets and variables**, **Actions**, and reference them like this:

```yaml
- run: ./deploy.sh
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

Secrets are masked in the logs. Whenever you can, use short-lived credentials through OpenID Connect (OIDC), which most cloud providers support, instead of long-lived keys.

# Tips for a Healthy Pipeline

A few small habits go a long way. Keep the pipeline fast by caching dependencies and running the quickest checks first, since fast feedback is the whole point of CI. Pin your actions to a version like `@v7`, or to a full commit SHA if you want to be stricter, so that a change upstream can't break your build or compromise it. Declare `permissions:` explicitly and only grant what each workflow needs.

You can also save some time by canceling older runs when a new commit arrives, using `concurrency`:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

Finally, keep an eye on your minutes. Public repositories run for free on standard runners, but private repositories get a monthly quota, and macOS and Windows runners use it up faster than Linux ones do.

# Conclusion

With a single YAML file, you get a pipeline that lints, tests, and builds every change, blocks bad merges, and deploys good ones, all for free on GitHub. Start with the simple CI job, make it a required check, and add deployment once you trust your tests.
