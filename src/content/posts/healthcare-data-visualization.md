---
title: "Project Showcase: Healthcare Data Visualization with Elasticsearch"
date: 2022-09-02
description: "A showcase for a project I lead at Shasta Networks to implement Healthcare Data Visualization using Elasticsearch."
image: "/wp-content/uploads/2022/09/Violet-and-White-Simple-Bold-Business-Promo-LinkedIn-Article-Cover-Image-3.jpg"
wpPath: "/healthcare-data-visualization/"
---

As a Software Engineer at Shasta Networks (a small Healthcare Data Integration Company based out of Ashland, OR), I was the technical lead on a project to create an inline healthcare data visualization and validation tool. I brought this project from ideation to production deployments + support afterward. It can currently be found on [Shasta Networks’ Website under the 'Summit' Platform](https://shastanetworks.com/ascent-platform/summit/).

# Healthcare Data Visualization Project Overview

![](/wp-content/uploads/2022/09/Conformance_Metrics_Dashboard-1024x562.png)

_A conformance validation dashboard, showing message types and associated errors._

The goal of this validation tool is to “Automate, increase accuracy, and reduce resource needs with testing processes as well as identify issues within internal workflows.” Here is the official description of the project:

> ConformanceValidator is an automated validation tool that increases speed and accuracy when validating HL7 data. Load HL7 conformance profiles to meet system requirements and receive immediate feedback upon submission. This product enables teams to self test through immediate feedback speeding up the validation process and reduces resource needs for all parties involved**.**
> 
> **Shasta Networks**

In short, this tool will be utilized when first integrating with a new partner in order to validate that the partner has their interfaces configured properly. This tool used [HL7 standard Conformance Profiles](https://caristix.com/blog/2010/09/what-is-an-hl7-conformance-profile/) to compare new systems' data with clearly defined requirements.

## My Role

I designed and implemented this project as a Java application that utilizes the Elasticsearch (ELK) stack to visualize compliance and conformance details about real-time healthcare data. The resulting project gives consumers endless customizability about reports, which data is seen, and how to handle and manage errors and warnings.

![](/wp-content/uploads/2022/09/Conformance_Detail_Dashboard-1024x488.png)

_The conformance detail dashboard_ _allows users to drill down into specific errors and warnings in order to fix them._

As seen on [shastanetworks.com](https://shastanetworks.com/ascent-platform/summit/), there are two example dashboards - one that shows an overview of messages with their errors and warnings, and one dashboard that helps analysts really drill down into the actual errors in order to fix them.

## What I Learned

This project was an amazing learning experience as it allowed me to take ownership of a project from start to finish. I took part in all aspects of the project, from planning to requirement gathering, managing team members, and delivering results. I learned so much about enterprise development, search systems, and healthcare informatics.

![](/wp-content/uploads/2022/09/BusinessInformer_Demographics-1024x528.png)

_A similar project called BusinessInformer, which I helped to develop during and after working on this conformance validation tool._

In fact, this system actually inspired a similar system at Shasta Networks, which is now sold under their top-tier integration service 'Summit'. This tool is designed to help healthcare executives make data-driven business decisions by providing searchable and easily digestible information about their healthcare data. While I wasn’t a lead on that project, I spent a lot of time on the design and implementation of it.

[](https://chandl.io/projects/2020/05/07/pathfinding-ai.html)
