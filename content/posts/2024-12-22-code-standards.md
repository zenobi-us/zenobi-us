---
date: 2024-12-22
title: Code Standards
draft: true
filepath: content/posts/2024-12-22-code-standards.md
---

Writing code for applications can quickly get messy. Over the years I've followed som
simple guidelines as to how I structure files, folders and the code therein.

The topic is large and deserves to be sectioned, thus this will be a meta post that outlines
those sections and briefly describes them.

## Principles

### The Basics

- [Explicit is better than implicit](/b/2024-12-22-code-standards-thebasics#explicit-is-better-than-implicit)

  - Don't use single character variables.
  - Don't be afraid to write long variable names.

- [Be the change you want to see](/b/2024-12-22-code-standards-thebasics#be-the-change-you-want-to-see)

  - Assume people will copy your code to save time.
  - Write code that is easy to understand.
  - Make it obvious where to add new code.

- [Isolate yourself from third party frameworks and libraries](/b/2024-12-22-code-standards-thebasics#isolate-yourself-from-third-party-frameworks-and-libraries)

  - Use interfaces to abstract away third party code.
  - Don't mix your business logic with third party code.
  - Don't mix your design/ui logic with your network data layer.

- [Make testing a first class citizen](/b/2024-12-22-code-standards-thebasics#make-testing-a-first-class-citizen)

  - Implement ways to run tests from the project start.
  - Implement a way to run unit tests for changed files.
  - Implement a way to associate e2e tests with your project management system.

- [Make your project configurable](/b/2024-12-22-code-standards-thebasics#make-your-project-configurable)

  - Use environment variables for configuration.
  - Always treat environment variables as strings, never as complex objects.
  - Use a schema validation library to validate your environment variables.
  - Some configuration is sensitive, take a layered approach to protect it.

### Typescript

- Be a never nester.

- Control Flow

  - Avoid ternary operator `? :` use `&& ||` instead. `#performance`
  - Don't bother with `switch` statements, use `if` instead.
  - Avoid the array methods `map`, `filter`, `reduce` and `forEach`. use `for` instead. `#performance`

- Types

  - In most cases you shouldn't be using `any`.
  - Avoid function signatures whose postional parameters have different types.
  - Don't bother with `interface`, use `type` instead.

### React

- Avoid using javascript `class`.
