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

## The Basics

### Explicit is better than implicit

> ...the ratio of time spent reading versus writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code.
>
> -- [Robert C. Martin](https://www.goodreads.com/quotes/835238-indeed-the-ratio-of-time-spent-reading-versus-writing-is)

#### Single character variable names

Variable names are the foundation of your business and app logic. They should be descriptive and easy to understand.

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

#### Write long variable names

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

### Be the change you want to see

#### Assume people will copy your code to save time

If you're in a team where this just organically happens, then you're in a good place to implement good practices.

When and how you notice this happening... well, that's a different story.

If you see people mindlessly copying code; Don't get upset. Take a step back.
There's probably a lot of good reasons for the "mindless" part... but the "copying" part; That's something you can work with.

So assuming people will copy your code, you should structure it in such a way as
to be easy to understand and modify. "Composability" comes to mind.

#### Write code that is easy to understand

Most developers are time poor. They don't have the luxury of time to sit and ponder
what your code does; honestly they probably don't care.

So you need to do anything and everything to make it easy for them to understand what your code does.

Say we want to calculate overtime for an employee. We could write the following code:

```ts title="Bad 👎" caption="There's too much going on here"
const employeePaySetupSchema = z.object({
  type: z.union([z.literal('overtime'), z.literal('regular'), z.literal('bonus'), z.literal('commission'), z.literal('unit')]),
  multiplier: z.number(),
})
type EmployeePaySetup = z.infer<typeof employeePaySetupSchema>;


const employeeSchema  z.object({
  id: z.string(),
  rate: z.number(),
  payRateBasis: z.union([z.literal('hourly'), z.literal('salary')]),
  weeklyHours: z.number(),
  paySetup: z.array(employeePaySetupSchema),
})
type Employee = z.infer<typeof employeeSchema>;


async function getEmployeeOvertimePay({
  id,
  hoursWorked,
}: {
  id: string;
  hoursWorked: number;
}) {
  const data = await fetchWithSchema<Employee>(`/api/employee/${id}`);

  return data.paySetup.reduce((total, paySetup) => {
    if (paySetup.type === 'overtime') {
      return;
    }
    return (total +=
      paySetup.multiplier *
      (data.payRateBasis === 'salary'
        ? data.rate / data.weeklyHours / 52
        : data.rate) *
      hoursWorked);
  }, 0);
}
```

The only thing going for this code is that there's not much of it.

```ts title="Good 👍"
const employeePaySetupSchema = z.object({
  type: z.union([z.literal('overtime'), z.literal('regular'), z.literal('bonus'), z.literal('commission'), z.literal('unit')]),
  multiplier: z.number(),
})
type EmployeePaySetup = z.infer<typeof employeePaySetupSchema>;


const employeeSchema  z.object({
  id: z.string(),
  rate: z.number(),
  payRateBasis: z.union([z.literal('hourly'), z.literal('salary')]),
  weeklyHours: z.number(),
  paySetup: z.array(employeePaySetupSchema),
})
type Employee = z.infer<typeof employeeSchema>;

async function getEmployee({ id }: { id: string }): Promise<Employee> {
  const data = await fetchWithSchema(`/api/employee/${id}`, employeeSchema);

  return data;
}


function getEmployeeOvertimePaySetup({ id }: { employee: Employee }): EmployeePaySetup[] {
  const output: {
    type: 'overtime';
    rate: number;
  }[] = [];
  } = []

  for (const paySetup of employee.paySetup) {
    if (paySetup.type !== 'overtime') {
      continue;
    }

    output.push(paySetup);
  }

  return output;
}

function getEmployeeHourlyRate( { employee }: { employee: Employee }) {
  if (employee.payRateBasis === 'salary') {
    return employee.rate / employee.weeklyHours / 52;
  }
  return employee.rate;
}

function computeOvertimePay({ hoursWorked, employeeHourlyRate, overtimePaySetup }) {
  const output:number = 0;

  for (const paySetup of overtimePaySetup) {
    output += paySetup.multiplier * employeeHourlyRate * hoursWorked;
  }

  return output
}

async function getEmployeeOvertimePay({ id, hoursWorked }: { id: string, hoursWorked: number }) {
  const employee = await getEmployee({ id });
  const employeeHourlyRate = getEmployeeHourlyRate({ employee });
  const overtimePaySetup = getEmployeeOvertimePaySetup({ employee });
  const output = computeOvertimePay({ hoursWorked, employeeHourlyRate, overtimePaySetup });

  return output;
}
```

This code is a lot longer, but it's easier to understand. It's broken down into smaller functions that do one thing and do it well.

### Make it obvious where to add new code

This is a big one. If you're working on a project that has a lot of files and folders, you need to make it easy for developers to know where to add new code.

THis might be where new files go, when to make a new file, what to name the file... etc. Or it might be where to add new functions, conditions in a function, loop, etc.

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

- Control Flow

  - Be a never nester.
  - Avoid ternary operators.
  - Don't bother with `switch` statements.
  - Avoid the inbuilt array methods.

- Types

  - Never use `//@ts-ignore`.
  - In most cases you shouldn't be using `any`.
  - Avoid function signatures whose postional parameters have different types.
  - Don't bother with `interface`. `type` is good enough.

### React

#### Code

##### Don't bother using javascript `class` components

##### Flatten or narrow the focus of the object types you pass into component props

#### State

- Lean on lots of isolated Context Providers instead of prop drilling.

#### Composition

- Separate your components into presentational and network layer components.
- Never import a data layer component inside a presentational component. pass it by reference through props.
- Always keep your components as small as possible.
- Always split large components up into composible parts.

#### Hooks

- `useEffect` should be the last hook in your component.
- `useEffect` should make you feel dirty and unsafe.
- 90% of `useEffect` can be thrown out and the component re-thought with `useMemo` in mind.

#### Network Layer

- Never use `fetch`, `useQuery`, `useMutation` or any other network layer hook directly inside a component. abstract it into a hook with any related transforms.
- Never use `fetch` directly. use a client that abstracts and manages the cache for you.

#### Design

- When loading modals whose content is dynamic, show the modal with a spinner and then load the content and swap it out.
- Always have an error boundary for your components that have dynamic content.
- Always have an empty state/onboarding guidance for your list components.
- When pagination and sorting/filtering are needed, the filtering must be done on the server.
