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

arg_or_prompt() {
    local message
    local value
    local output

    message="${1}"
    value="${2}"
    output=""

    if [ -z "${value}" ]; then
        read -r -p "$message : " output
        echo "${output}"
    else
        echo "${value}"
    fi
}

match() {
    local pattern
    local group

    pattern=$1
    group=$2
    # split string by newline
    IFS=$'\n' read -rd '' -a lines <<<"$3"
    for line in "${lines[@]}"; do
        # echo "[TEST] $line"
        if [[ $line =~ $pattern ]]; then
            echo "${BASH_REMATCH[$group]}"
            break
        fi
    done
}

# remove first blank line and any leading whitespace
dedent() {
    local text="${1}"
    local output

    output=$(echo "${text}" | sed 's/^[ \t]*//')
    output=$(echo "${output}" | sed '1d')

    echo "${output}"
}

# renders a jq template string with supplied object
template() {
    local template
    local object

    template=$1
    object=$2

    echo "$object" | jq -r -c "$template"
}
