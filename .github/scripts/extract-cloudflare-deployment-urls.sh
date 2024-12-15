#!/usr/bin/env bash

HEREPATH=$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd
)

# shellcheck disable=SC1091
source "$HEREPATH"/../../.mise/helpers.sh

extract_deployment_urls() {
    local log_output

    log_output=$1

    url=$(match "https://(.+)" 0 "$log_output")
    alias_url=$(match "alias URL: (https://(.+))" 1 "$log_output")

    # echo as jq output

    # create new empty object
    output=$(jq -n '{}')

    # add key-value pair to object
    output=$(jq --arg key "url" --arg value "$url" '.[$key] = $value' <<<"$output")
    output=$(jq --arg key "alias_url" --arg value "$alias_url" '.[$key] = $value' <<<"$output")

    echo "$output" | jq . -c
}

requires_command jq "jq is required to parse the output"

# some subcommands that allow use to either:
# - extract the urls into json
# - extract the urls into github output format
# - extract the urls and print them to stdout

case $1 in
json)
    extract_deployment_urls "$(cat)"
    ;;
github_output)
    requires_arg "$2" "GITHUB_OUTPUT environment variable is required"
    output=$2
    entries=$(extract_deployment_urls "$(cat)" |
        jq -r 'to_entries | .[] | "\(.key)=\(.value)"')

    for entry in $entries; do
        echo "$entry" >>"$output"
    done
    ;;
*)
    extract_deployment_urls "$(cat)" |
        jq -r '.url, .alias_url'
    ;;
esac
