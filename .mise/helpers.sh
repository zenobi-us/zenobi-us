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
