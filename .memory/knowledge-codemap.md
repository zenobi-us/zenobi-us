# Knowledge Codemap

```text
[Repo Start]
   |
   v
[Remix Route Resolution]
   |
   +--> [Matched route module]
   |         |
   |         v
   |     [Loader/Meta/Component]
   |         |
   |         v
   |     [Rendered HTML]
   |
   +--> [No match]
             |
             v
        [404 fallback route]
             |
             v
        [Static output]
```
