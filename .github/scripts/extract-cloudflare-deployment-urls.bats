#!/usr/bin/env bats

@test "exported json" {
    run bats_pipe cat "${BATS_TEST_DIRNAME}/extract-cloudflare-deployment-urls.fixture.txt" \| "${BATS_TEST_DIRNAME}/extract-cloudflare-deployment-urls.sh" json

    echo "output: ${output}" >&3
    [[ "$output" = '{"url":"https://the.url","alias_url":"https://the.alias.url"}' ]]
}
