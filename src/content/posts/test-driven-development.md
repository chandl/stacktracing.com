---
title: "Test Driven Development: The 5 Step Process to Better Software"
date: 2022-09-02
description: "Test Driven Development (TDD) is a process for building software that improves quality. In this post, you will learn the background of TDD and how to apply it."
image: "/wp-content/uploads/2022/09/Violet-and-White-Simple-Bold-Business-Promo-LinkedIn-Article-Cover-Image-2.jpg"
wpPath: "/test-driven-development/"
---

# Why Test Software?

Wouldn’t it be nice to live in a world where the software you write never has bugs and never breaks? It would be a dream for many. Unfortunately, with the influence of human error, this is an impossible objective to realize. This is a real problem for people and companies who sell software, as even the smallest bug can cause losses of profit, loss of clients, and possibly even worse. A developer can, however, significantly cut down on the number of bugs in their code while increasing its stability. Testing and Test Driven Development are the conduit for software engineers to do just that.

According to Fred Brooks’ “The Mythical Man-Month”, nearly 50% of all time and money in the software development process is spent on testing. While this metric may have been created a while ago, it still shows that testing consumes a great amount of time in the development process. While time-consuming, testing is an invaluable part of any development project.

Software testing mainly helps to detect defects and errors in the code, helping to ensure the quality of the product. In addition, testing helps to ensure other quality factors of the software are good (e.g. performance and speed). These high-quality products are delivered to the consumers, and in turn, gain consumer confidence and satisfaction (Dustin & Gauf, 2009). Having satisfied customers leads to more money in the bank, which is really what anyone who is building software for others wants.

In all, the utility of software testing boils down to writing better quality software and staying in business for longer. With testing in place, there will be fewer costly errors in production, precious time in development will be saved, and the end product will be of higher quality and will be loved by customers for its reliability.

## History of Test Driven Development

Developers have recognized the utility of testing software since the very early days of computing, however, the implementation of testing was a slow, tedious process that consumed tons of resources and was highly inefficient. Back in the 1960s during the mainframe era, programmers had limited time with the punch-card machines, so they needed a way to maximize the time they had with them.

![A used punch card that defines a program.](/wp-content/uploads/2022/09/punch-card-1024x448.jpg)

A punch card that was used for programming in the 1960s.

A documented practice from back then was to write down the expected output of a program before running it and comparing it to the output from the program. This is when software testing, and more specifically Test Driven Development (TDD), was born (Barber, n.d.).

Since the 60s, a lot has happened in the field of computing, and with that came the rediscovery of test driven development. This rediscovery was in 2003 by a man named Kent Beck, the creator of Extreme programming. The rediscovery was mainly facilitated because of new processes that automated testing.

Today, test driven development refers only to automated TDD. Since its “rediscovery”, test driven development has become very popular within the software development community. This popularity can be attributed mainly to the increase in popularity of the Extreme programming and Agile software development movements.

# What is Test Driven Development?

To understand the test-driven development process, let’s look at the main principle behind it: Specification over Validation. Specification over validation is the idea that developers should think through the requirements or design of a system before actually implementing functional code (Introduction, n.d.). This is a huge part of agile requirements and the agile design technique. Valuing specification over validation ensures that code will be clean and that it will work properly.

While based on that idea, it is important to note that test driven development is not solely a testing technique, but rather part of a holistic design, development, and testing process (Barber, n.d.). The basic idea of TDD is that instead of writing code first and then tests afterward, tests are written first, and then code to make those tests pass is implemented. Test driven development is primarily a specification language that will help to ensure that source code is thoroughly tested (Introduction, n.d.).

In test driven development, the processes of coding, testing, and design are all tightly interwoven. With test-driven development, writing tests become an integral part of the development process and the results of tests will become more useful to the developer. Test driven development brings a feeling of progress when a test fails, as the developer now can formulate a clear plan of action to get the test to a passing state. Also, and more importantly, it brings a clear metric of success for developers when tests pass.

## The **Test First Development** Process

The main building block of the test driven development process is called Test First Development (TFD). Figure 1 shows the steps in the TFD process. This process begins with the developer creating a small Unit Test - a small test that tests a small bit of corresponding functional code. This test should be simple enough that it contains just enough code to fail.

Next, the developer will make sure that the test fails. This is desired because the functional code that the test is testing has not been implemented yet. The developer will run the test, ideally along with all of the other tests that they have made previously, to make sure that this new test fails. If it does not fail, that means the test is broken and needs to be reworked before continuing.

After the new test successfully fails, the developer needs to actually implement the required functionality. During this step of the process, the developer will implement the functional code with the goal of getting the newly-made test to pass in all cases.

After the developer has created the functional code, the final step of the process is to run the new test again to make sure the new functional code is working as intended. If the tests fail in this stage, the developer will need to rework the functional code to make it pass. Once the tests pass, the next step is to iteratively start over on the next requirement.

![The Test First Development (TFD) Process](/wp-content/uploads/2022/09/fig1.jpg)

The Test First Development (TFD) Process

## The **Test Driven Development** Process

With the addition of code refactoring, test-first development bridges into test driven development. The addition of refactoring is what makes test-driven development really shine. Refactoring directly improves the quality of code and makes it easier and more maintainable to work with, in the long run. The refactoring stage of test driven development turns traditional development completely around. That is, before creating any new tests or functionality, a developer must ask themselves, “Is this existing design the best possible design for this new functionality?” (Introduction, n.d.).

If the developer thinks that the current design suits the new feature, they will go ahead and proceed with development following the test first development methodology. On the other hand, if they find the current design to be cumbersome or ill-suited for this new feature, they will locally refactor the code to make the new feature easier to implement (Test Driven, n.d.).

The great thing about doing this is that the quality of the code base will always be improving, developers won’t have to worry about breaking things when refactoring since there should already be a comprehensive test suite for the existing functionality, and the new feature that was going to be added will be implemented quickly and more easily.

### Types of Test Driven Development

There are two main types of test driven development that are often put into place. These are Acceptance and Developer Test Driven Development. Acceptance test-driven development, or ATDD, refers to writing acceptance tests and then just enough functionality to fulfill that test. Acceptance tests describe black-box requirements that a system must conform to (Ambler, n.d.). These are usually defined by the project’s stakeholders and are commonly user stories or use cases.

The main goal of ATDD is to specify and test that a system’s functionality meets the exact requirements set by stakeholders. Developer Test Driven Development, or just TDD, refers to writing unit tests and then just enough functionality to fulfill that test. These unit tests are just for small portions of the code. The main goal of developer TDD is to specify a detailed, executable design for a software solution to a problem (Introduction, n.d.).

See Figure 2 for a UML diagram showing how the Developer and Acceptance TDD processes work together. In an ideal situation, a developer will write a single acceptance test to describe a user story/use case, and then they will take a developer TDD approach to implement the functionality needed to satisfy the acceptance test. Developing this way will often require multiple iterations of the developer TDD process to get an acceptance test to pass. That means many unit tests are needed for one acceptance test.

![Acceptance Test Driven Development and Developer Test Driven Development Interaction](/wp-content/uploads/2022/09/fig2.jpg)

 Acceptance Test Driven Development and Developer Test Driven Development Interaction

### Test Driven Development Benefits and Pitfalls

All said and done, test driven development can bring many benefits to the development process, but can cause new followers to run into a few common pitfalls. Many teams who use the TDD process report a significant increase in code defect rates, but a moderate increase in the initial development effort. Those same teams, however, tend to report that this increase in effort is offset by a decrease in effort in a project’s final phases (TDD, n.d.). In addition, many TDD experts say that it leads to improved design properties of code, stating in general that “it promotes a higher degree of ‘internal’ or technical quality” (TDD, n.d.)

While test-driven development is an effective way to decrease bugs in software while increasing the quality, there are a few common pitfalls that beginners and teams must look out for. Individual developers can run into the issues of forgetting to run tests frequently or they may write too many tests at once. In addition, they may write tests that are too large, or on the other hand, overly trivial.

Teams using the TDD process can run into similar issues such as partial adoption and poor maintenance of the test suite. Partial adoption refers to when only a few members of the team use the TDD methodology and poor maintenance refers to letting the test suite grow to an unwieldy size, taking a prohibitively long time to run. Unfortunately, many teams that do not maintain their test suite sufficiently will run into the issue of abandonment, where the team may never use the tests again (TDD, n.d.).

# Conclusion

The utility of software testing is realized by higher quality software and staying in business for longer. With testing in place, fewer costly errors in production occur, precious time in development is saved, and the end product is of higher quality and loved by customers for reliability. Test Driven development is an evolutionary approach to the testing process, based on the principle of specification over validation, which combines test-first development and refactoring. With TDD, holding specification over validation ensures quality code and stable performance.

## References

Ambler, S. W. (n.d.). Acceptance/Customer Tests as Requirements Artifacts: An Agile Introduction. Retrieved November 20, 2016, from [http://www.agilemodeling.com/artifacts/acceptanceTests.htm](http://www.agilemodeling.com/artifacts/acceptanceTests.htm)

Barber, D. (n.d.). Why Test-driven Development? -. Retrieved November 20, 2016, from [http://derekbarber.ca/blog/2012/03/27/why-test-driven-development/](http://derekbarber.ca/blog/2012/03/27/why-test-driven-development/)

Dustin, E., Garrett, T., & Gauf, B. (2009). Implementing automated software testing: How to save time and lower costs while raising quality. Retrieved November 20, 2016, from [http://www.informit.com/articles/article.aspx?p=1332758&seqNum=3](http://www.informit.com/articles/article.aspx?p=1332758&seqNum=3)

Introduction to Test Driven Development (TDD). (n.d.). Retrieved November 20, 2016, from [http://agiledata.org/essays/tdd.html](http://agiledata.org/essays/tdd.html)

TDD. (n.d.). Retrieved November 20, 2016, from [https://www.agilealliance.org/glossary/tdd/](https://www.agilealliance.org/glossary/tdd/)

Test Driven Development. (n.d.). Retrieved November 20, 2016, from [https://www.tutorialspoint.com/software\_testing\_dictionary/test\_driven\_development.htm](https://www.tutorialspoint.com/software_testing_dictionary/test_driven_development.htm)
