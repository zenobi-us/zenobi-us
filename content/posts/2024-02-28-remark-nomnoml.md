---
template: article
title: '@zenobius/remark-nomnoml'
date: 2024-02-28
stage: published
tags:
  - markdown
  - diagrams as code
  - package
---

I've always liked having my documentations diagrams embedded in my markdown files.

When i discovered [nomnoml](https://nomnoml.com/), i was impressed by it's simple yet clean appearance.

Here I introduce a [remark](https://remark.js.org/) plugin that allows you to embed nomnoml diagrams in your markdown files.

## Installation

```bash
yarn add --dev @zenobius/remark-nomnoml
```

## Usage

````md title="docs/decorator-pattern.md" showLineNumbers
# Decorator Pattern

Want to know how a pirates mind works? here's a diagram:

```nomnoml
#direction: down
#edges: rounded
#bendSize: 0.6

[<frame>Decorator pattern|
  [<abstract>Component||+ operation()]
  [Client] depends --> [Component]
  [Decorator|- next: Component]
  [Decorator] decorates -- [ConcreteComponent]
  [Component] <:- [Decorator]
  [Component] <:- [ConcreteComponent]
]
```

**yep**. aren't you glad you know this now?
````

```ts title="render.js" {5-7}
import unified from 'unified';
import type { VFile } from 'vfile';
import { read } from 'to-vfile';
import markdown from 'remark-parse';
import nomnoml from '@zenobius/remark-nomnoml';

const processor = unified().use(markdown).use(nomnoml);

async function render(filename: string) {
  const file = await read(filename);
  return processor.processSync(file.value);
}

// ensure stdin is a filename
const filename = process.argv[2];
if (!filename) {
  console.error('usage: node render.js <filename>');
  process.exit(1);
}

// render stdin filename
const output = render(filename);
console.log(output);
```

you'll end up with

```nomnoml
#direction: down
#edges: rounded
#bendSize: 0.6
[<frame>Decorator pattern|
  [<abstract>Component||+ operation()]
  [Client] depends --> [Component]
  [Decorator|- next: Component]
  [Decorator] decorates -- [ConcreteComponent]
  [Component] <:- [Decorator]
  [Component] <:- [ConcreteComponent]
]
```

If that wasn't enough to convince you, [here's the diagram on the official Nomnoml editor](<[https://nomnoml.com/#view/%23direction%3A%20down%0A%23edges%3A%20rounded%0A%23bendSize%3A%200.6%0A%5B%3Cframe%3EDecorator%20pattern%7C%0A%20%20%5B%3Cabstract%3EComponent%7C%7C%2B%20operation()%5D%0A%20%20%5BClient%5D%20depends%20--%3E%20%5BComponent%5D%0A%20%20%5BDecorator%7C-%20next%3A%20Component%5D%0A%20%20%5BDecorator%5D%20decorates%20--%20%5BConcreteComponent%5D%0A%20%20%5BComponent%5D%20%3C%3A-%20%5BDecorator%5D%0A%20%20%5BComponent%5D%20%3C%3A-%20%5BConcreteComponent%5D%0A%5D]>).

<Notice tone="positive">
You can read more over at 👉 [https://github.com/zenobi-us/remark-nomnoml](https://github.com/zenobi-us/remark-nomnoml)
</Notice>
