---
title: "Lombok: The Most Useful Java Library"
date: 2026-09-18
description: "Project Lombok removes Java boilerplate like getters, setters, constructors, and builders with a few annotations. In this post, you will learn how it works and when to use it."
image: "/images/lombok-the-most-useful-java-library.jpg"
wpPath: "/lombok-the-most-useful-java-library/"
---

Java is well known for boilerplate. A simple class with a few fields can need dozens of lines of getters, setters, constructors, `equals`, `hashCode`, and `toString`, and all of that code has to be kept up to date by hand. [Project Lombok](https://projectlombok.org) is a library that generates that code for you at compile time. In this article, you will learn what Lombok does, how it compares to features in other languages, and what to be careful of.

# The Problem: Boilerplate

Here is a plain Java class that holds a user:

```java
public class User {
    private final String name;
    private final String email;
    private int age;

    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return age == user.age
            && Objects.equals(name, user.name)
            && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() { return Objects.hash(name, email, age); }

    @Override
    public String toString() {
        return "User{name='" + name + "', email='" + email + "', age=" + age + "}";
    }
}
```

Three fields turned into around thirty lines of code, and every one of those lines needs to change when a field is added or renamed.

# The Lombok Version

Now here is the same class with Lombok:

```java
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
    private final String name;
    private final String email;
    private int age;
}
```

The `@Data` annotation generates the getters, the setters (for fields that aren't final), `equals`, `hashCode`, and `toString`. The `@AllArgsConstructor` annotation generates the constructor. The behavior is exactly the same, with about a tenth of the code, and adding a new field is a one-line change.

# Setting Up Lombok

Lombok only needs to be there at compile time, so you add it as a compile-only dependency. With Gradle, it looks like this:

```groovy
dependencies {
    compileOnly 'org.projectlombok:lombok:<version>'
    annotationProcessor 'org.projectlombok:lombok:<version>'
}
```

And with Maven:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>${lombok.version}</version>
    <scope>provided</scope>
</dependency>
```

Replace the version with the latest release from the Lombok website. You will also want to make sure that your IDE has the Lombok plugin enabled so that it understands the generated methods. IntelliJ IDEA bundles it in recent versions.

# The Most Useful Annotations

Lombok has a lot of annotations, but these are the ones that I would use the most:

- **`@Getter` and `@Setter`:** Generate accessors for a single field or for a whole class.
- **`@ToString` and `@EqualsAndHashCode`:** Generate those methods, with options to leave out certain fields.
- **`@NoArgsConstructor`, `@AllArgsConstructor`, and `@RequiredArgsConstructor`:** Generate constructors. The last one covers `final` fields and fields marked with `@NonNull`, which makes it great for dependency injection.
- **`@Value`:** An immutable version of `@Data`. All of the fields are private and final, there are no setters, and the class itself is final.
- **`@Builder`:** Generates the builder pattern for you.
- **`@Slf4j`:** Adds a logger field to the class, so you can log without declaring one.
- **`@NonNull`:** Adds a null check that throws a `NullPointerException` with a helpful message.

## The Builder Pattern in a Single Annotation

Writing a builder by hand is one of the most tedious things in Java. With Lombok, it is one line:

```java
import lombok.Builder;

@Builder
public class Order {
    private final String id;
    private final int quantity;
    private final String note;
}

Order order = Order.builder()
    .id("A-100")
    .quantity(3)
    .build();
```

## No More Logger Boilerplate

The same goes for loggers. Instead of declaring a logger in every class, you can do this:

```java
@Slf4j
public class PaymentService {
    public void charge() {
        log.info("Charging card");
    }
}
```

# How it Compares to Other Languages

Many other languages handle this problem as part of the language itself, and Lombok basically brings the same ideas to Java. Python has `@dataclass`, which generates `__init__`, `__repr__`, and `__eq__` from the field declarations. Kotlin has `data class`, which generates `equals`, `hashCode`, `toString`, and `copy`, and its properties remove the need for getters and setters in the first place. C# has auto-properties and `record` types.

Java has also been catching up with **records**, which were added in Java 16. For simple immutable data classes, `record User(String name, String email, int age) {}` may be all that you need. Lombok still shines for mutable classes, builders, loggers, and generating constructors for dependency injection.

# How it Works

Lombok is an annotation processor that hooks into the compiler. While your code is being compiled, it modifies the abstract syntax tree of your classes to add the generated methods. This means that the compiled `.class` file contains real getters, constructors, and so on, so there is no extra library at runtime and no reflection involved. One thing to know is that it relies on internal compiler APIs, which is why you sometimes need to update Lombok when you upgrade your JDK.

# Things to Watch Out For

Lombok is very handy, but it comes with some trade-offs. Since the generated code isn't in your source files, it can feel a little like magic, and new team members may be confused by it. Stack traces can also point to a line that has only an annotation on it. Every IDE and build tool needs to support it, which is rarely a problem anymore but is one more thing to configure.

It is also easy to misuse. Putting `@Data` on a JPA entity can cause problems, because the generated `equals` and `hashCode` use all of the fields, and that interacts badly with lazy loading and bidirectional relationships. `@ToString` on classes that reference each other can recurse forever. Be explicit about which fields should take part.

If you are ever curious about what Lombok is actually generating, you can run `delombok`, which turns annotated source code into the plain Java that it produces.

# Conclusion

Lombok takes away the repetitive code that makes Java so verbose, like accessors, constructors, `equals`, `hashCode`, `toString`, builders, and loggers. Use it for the boilerplate it removes, prefer records when they fit, and be careful with `@Data` on entities. Used with a little care, it makes your classes shorter and a lot easier to read.
