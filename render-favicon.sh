#!/bin/bash

# use rose pine moon colors

declare -A seashell

seashell[bgFill]='#3e8fb0'
seashell[bgStroke]='#3e8fb0'
seashell[fgFill]='#9ccfd8'
seashell[fgStroke]='#faf4ed'
seashell[arrowStroke]='#286983'

declare -A moon

moon[bgFill]='#2e3440'
moon[bgStroke]='#2e3440'
moon[fgFill]='#c4a7e7'
moon[fgStroke]='#2e3440'
moon[arrowStroke]='#88c0d0'

declare -A pine

pine[bgFill]='#907aa9'
pine[bgStroke]='#907aa9'
pine[fgFill]='#c4a7e7'
pine[fgStroke]='#c4a7e7'
pine[arrowStroke]='#907aa9'

## http://brass.lan:4200/b/2024-07-06-logo-themer#?theme=eyJiZ0ZpbGwiOiIjOTA3YWE5IiwiYmdTdHJva2UiOiIjNTc1Mjc5IiwiZmdGaWxsIjoiIzU3NTI3OSIsImFycm93U3Ryb2tlIjoiIzkwN2FhOSIsImZnU3Ryb2tlIjoiI2M0YTdlNyJ9eyJiZ0ZpbGwiOiIjOTA3YWE5IiwiYmdTdHJva2UiOiIjNTc1Mjc5IiwiZmdGaWxsIjoiIzU3NTI3OSIsImFycm93U3Ryb2tlIjoiIzkwN2FhOSIsImZnU3Ryb2tlIjoiI2M0YTdlNyJ9
pinemoon[bgFill]="#907aa9"
pinemoon[bgStroke]="#575279"
pinemoon[fgFill]="#575279"
pinemoon[fgStroke]="#c4a7e7"
pinemoon[arrowStroke]="#907aa9"

declare -A rose

rose[bgFill]='#191724'
rose[bgStroke]='#191724'
rose[fgFill]='#f6f1e8'
rose[fgStroke]='#f6f1e8'
rose[arrowStroke]='#e63946'

declare -A golden

golden[bgFill]='#ea9d34'
golden[bgStroke]='#ea9d34'
golden[fgFill]='#f6c177'
golden[fgStroke]='#ea9d34'
golden[arrowStroke]='#ea9d34'

themename="${1:-pinemoon}"

declare -n colors="$themename"

echo "Using theme: $themename"
echo """
bgFill: ${colors[bgFill]}
bgStroke: ${colors[bgStroke]}
fgFill: ${colors[fgFill]}
fgStroke: ${colors[fgStroke]}
arrowStroke: ${colors[arrowStroke]}
"""

./render-favicon-cli.js \
    --output public/logo.svg \
    --bgFill "${colors[bgFill]}" \
    --bgStroke "${colors[bgStroke]}" \
    --fgFill "${colors[fgFill]}" \
    --fgStroke "${colors[fgStroke]}" \
    --arrowStroke "${colors[arrowStroke]}"
