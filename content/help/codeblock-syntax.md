---
title: Writing codeblocks
---

This is a reminder to myself.

I use shiki (via `rehypePrettyCode`) to make codeblocks more expressive and useful.

It starts in [`app/services/Content/mdx.ts`](../../app/services/Content/mdx.ts).

Specifically we use some transformers supplied by shiki to make this work.

## Meta Strings

### Highlight Lines

Place a numeric range inside {}.

```js {1-3,4}
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
```

Styling: The line `<span>` receives a `data-highlighted-line` attribute that enables you to style via CSS.

### Group Highlighted Lines By Id

Place an id after # after the {}. This allows you to color or style lines differently based on their id.

```js {1,2}#a {3,4}#b
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
```

Styling: The line `<span>` receives a `data-highlighted-line-id="<id>"` attribute that enables you to style via CSS.

### Highlight Chars

You can use either `/`:

```js /carrot/
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
```

Or `"` as a delimiter:

```js "carrot"
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
```

Different segments of chars can also be highlighted:

```js /carrot/ /apple/
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
```

Styling: The chars `<span>` receives a `data-highlighted-chars` attribute to style via CSS.

To highlight only the third to fifth instances of carrot, a numeric range can be placed after the last /.

```js /carrot/3-5
const carrot = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
```

Highlight only the third to fifth instances of carrot and any instances of apple.

```js /carrot/3-5 /apple/
const carrot = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const apple = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const something = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
const carrot = [1, 2, 3, 4, 5];
```

### Group Highlighted Chars By Id

Place an id after # after the chars. This allows you to color chars differently based on their id.

```js /age/#v /name/#v /setAge/#s /setName/#s /50/#i /'Taylor'/#i
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```

const [age, setAge] = useState(50);
const [name, setName] = useState("Taylor");

Styling: The chars `<span>` receives a `data-chars-id="<id>"` attribute to style via CSS.

### Highlight Inline Code

Append `:lang` (e.g. `:js`) to the end of inline code to highlight it like a regular code block.

```txt
`[1, 2, 3]{:js}`
```

becomes `[1, 2, 3]{:js}`

### Highlight Plain Text

Append `{:.token}` to the end of the inline code to highlight it based on a token specified in your VS Code theme. Tokens start with a . to differentiate them from a language.

The name of the function is `getStringLength{:.entity.name.function}`.

You can create a map of tokens to shorten this usage throughout your docs:

```js
const options = {
  tokensMap: {
    fn: 'entity.name.function',
  },
};
```

The name of the function is `getStringLength{:.fn}`.

### Titles

Add a file title to your code block, with text inside double quotes (`""`):

```js title="Filename title"

```

### Captions

Add a caption underneath your code block, with text inside double quotes (`""`):

```js caption="Your captions to show"

```

If you want to conditionally show them, use `showLineNumbers`:

```js showLineNumbers
export {
    something,
    else,
    to,
    export
}
```

## Line Numbers

CSS counters can be used to add line numbers.

```css
code[data-line-numbers] {
  counter-reset: line;
}

code[data-line-numbers] > [data-line]::before {
  counter-increment: line;
  content: counter(line);

  /* Other styling */
  display: inline-block;
  width: 0.75rem;
  margin-right: 2rem;
  text-align: right;
  color: gray;
}

code[data-line-numbers-max-digits='2'] > [data-line]::before {
  width: 1.25rem;
}

code[data-line-numbers-max-digits='3'] > [data-line]::before {
  width: 1.75rem;
}

code[data-line-numbers-max-digits='4'] > [data-line]::before {
  width: 2.25rem;
}
```

Styling: `<code>` will have attributes `data-line-numbers` and `data-line-numbers-max-digits="n"`.

If you want to start line numbers at a specific number, use `showLineNumbers{number}`:

```js showLineNumbers{2}
const items = [1, 2, 3];
const moreItems = [1, 2, 3];
```
