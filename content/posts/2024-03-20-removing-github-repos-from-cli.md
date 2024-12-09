---
template: article
title: Removing Github Repos from CLI
date: 2024-03-20
stage: published
tags: ['github', 'cli']
---

This little snippet leans on the multi-select UX of `fzf`. It's a quick way to delete multiple repos from the command line.

### Without GitHub CLI

```sh
http https://api.github.com/user/repos "Authorization:token $GITHUB_TOKEN" per_page==100 type==owner \
    | jq '.[] | .full_name' \
    | fzf -m \
    | xargs -I '{}' http DELETE https://api.github.com/repos/'{}' "Authorization:token $GITHUB_TOKEN"
```

needs:

- [jq](https://jqlang.github.io/jq/)
- [httpie](https://httpie.io/)
- [fzf](https://github.com/junegunn/fzf)

Tweak this part to customise the query

```
    | jq '.[] | .full_name' \
```

If you want to only list repos that are a fork and is a template repo:

```
    | jq '.[] | select(.fork==true) | select(.is_template==true) | .full_name' \
```

More info on githubs documentation on the [repo object](https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user)

### With GithubCli

> [!NOTE]
> this requires a personal access token with `delete_repo` scope
>
> ```sh
> gh auth refresh -s delete_repo
> ```

```sh
gh repo list \
    --json name \
    --limit 100
    --jq "-r '.[].name'" \
| fzf -m \
| xargs -I '{}' gh repo delete '{}'
```
