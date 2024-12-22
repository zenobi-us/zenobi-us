---
date: 2024-12-22
title: Code Standards: The Basics
draft: true
filepath: content/posts/2024-12-22-codestandards-thebasics.md
---

- [Explicit is better than implicit](#explicit-is-better-than-implicit)
  - [Variable names](#variable-names)
    - [Single character variable names](#single-character-variable-names)
  - [Write long variable names](#write-long-variable-names)
- [Be the change you want to see](#be-the-change-you-want-to-see)
  - [Assume people will copy your code to save time](#assume-people-will-copy-your-code-to-save-time)
  - [Write code that is easy to understand](#write-code-that-is-easy-to-understand)
  - [Make it obvious where to add new code](#make-it-obvious-where-to-add-new-code)

## Explicit is better than implicit

### Variable names

Variable names are the foundation of your business and app logic. They should be descriptive and easy to understand.

> ...the ratio of time spent reading versus writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code.
>
> -- [Robert C. Martin](https://www.goodreads.com/quotes/835238-indeed-the-ratio-of-time-spent-reading-versus-writing-is)

#### Single character variable names

Most junior and some senior developers have a tendency to use single character variable names.

I can only imagine why this happens; lazy, not concious of the impact it has on other team members, or just not knowing better.

I tend to think this behaviour is strongly correlated to that which results in bad or zero documentation.

Use long variable names that describe what the variable is used for.

```ts title="Bad 👎" caption="What does a, b and f mean?"
//
const f = (a: number, b: number) => a * b * 52;
```

```ts title="Good 👍"
const calculateAnnualSalary = (hoursWorked: number, hourlyRate: number) => {
  return hoursWorked * hourlyRate * 52;
};
```

### Write long variable names

This follows on from [Single character variable names](#single-character-variable-names); Most languages and projects are not targeting
embedded systems with limited memory.
So there is no reason to use short variable names.

```ts title="Bad 👎"
class Person {
  constructor(public n: number, public x: number) {}

  getHrs() {
    return this.n * this.x;
  }

  getSalary() {
    return this.getHrs() * 52;
  }
}
```

```ts title="Good 👍"
class Employee {
  constructor(public hoursWorked: number, public hourlyRate: number) {}

  getHoursWorked() {
    return this.hoursWorked;
  }

  getAnnualSalary() {
    return this.getHoursWorked() * this.hourlyRate * 52;
  }
}
```

The goal here is to make it easy for other developers to understand what the code does.

Don't be creating a situation where someone has to start building this grand
picture just to understand what a variable is used for.

## Be the change you want to see

### Assume people will copy your code to save time

If you're in a team where this just organically happens, then you're in a good place to implement good practices.

When and how you notice this happening... well, that's a different story.

If you see people mindlessly copying code; Don't get upset. Take a step back.
There's probably a lot of good reasons for the "mindless" part... but the "copying" part; That's something you can work with.

So assuming people will copy your code, you should structure it in such a way as
to be easy to understand and modify. "Composability" comes to mind.

### Write code that is easy to understand

Most developers are time poor. They don't have the luxury of time to sit and ponder
what your code does; honestly they probably don't care.

So you need to do anything and everything to make it easy for them to understand what your code does.

I'm not sure I have the space or time to go into detail about how to write code that is easy to understand (most of the time it's situational), but I wanted to make this point so that you can start thinking about it.

### Make it obvious where to add new code

This is a big one. If you're working on a project that has a lot of files and folders, you need to make it easy for developers to know where to add new code.

THis might be where new files go, when to make a new file, what to name the file... etc. Or it might be where to add new functions, conditions in a function, loop, etc.
