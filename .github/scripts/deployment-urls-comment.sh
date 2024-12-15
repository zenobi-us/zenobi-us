#!/usr/bin/env bash
HEREPATH=$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd
)

# shellcheck disable=SC1091
source "$HEREPATH"/../../.mise/helpers.sh

# use jq to interpolate a message that contains both the url and the alias_url for the release
extract_and_write() {
    local pr_number
    local template

    pr_number=$1
    template=$2

    jq -r ". | ${template}" |
        gh pr comment "$pr_number" -b -m "$(cat)"

}

requires_command "jq" "jq is required to run this script"
requires_command "gh" "gh is required to run this script"
requires_arg "$1" "Pull request number is required"
requires_arg "$2" "Template is required"

extract_and_write "$1" "$2"
