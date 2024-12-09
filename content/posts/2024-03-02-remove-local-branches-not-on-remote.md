---
title: Remove local branches not on remote
date: 2024-03-02
stage: published
tags:
  - git
---

```bash
git fetch --prune;
pruned_branches=$(git for-each-ref --format '%(refname) %(upstream:track)' refs/heads refs/remotes/origin | grep gone | cut -d " " -f 1 | sed 's/refs\/heads\///');
for branch in $pruned_branches; do
  git branch -d $branch;
done
```

or for you one liner masochists:

```bash
git fetch --prune; git for-each-ref --format '%(refname) %(upstream:track)' refs/heads refs/remotes/origin | grep gone | cut -d " " -f 1 | sed 's/refs\/heads\///' | xargs git branch -d;
```

## Explanation

1. `git fetch --prune` - Fetches the latest changes from the remote and prunes (deletes) any remote-tracking references that no longer exist on the remote.
2. `git for-each-ref --format '%(refname) %(upstream:track)' refs/heads refs/remotes/origin` - Lists all local and remote branches and their tracking status.
3. `grep gone` - Filters out the branches that no longer exist on the remote.
4. `cut -d " " -f 1` - Extracts the branch name from the output.
5. `sed 's/refs\/heads\///'` - Removes the `refs/heads/` prefix from the branch name.
6. `xargs git branch -d` - Deletes each pruned branch.

🙇
