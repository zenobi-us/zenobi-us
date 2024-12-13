#!/usr/bin/env bash

requires_command() {
    local command
    local message

    command=$1
    message=$2

    if ! command -v "$command" &>/dev/null; then
        echo "$message"
        exit 1
    fi
}

requires_arg() {
    local arg
    local message

    arg=$1
    message=$2

    if [[ -z $arg ]]; then
        echo "$message"
        exit 1
    fi

}

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
