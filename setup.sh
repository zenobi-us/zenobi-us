#!/usr/bin/env bash

# Local vars
ASDF_VERSION=${ASDF_VERSION:-v0.8.1}
ASDF_HOME=$HOME/.asdf
ASDF_BIN=$ASDF_HOME/asdf.sh

set -e

require() {
  if ! command -v "$1" &>/dev/null; then
    echo "📛📦 Missing $1"
    exit 1
  fi
}

append_uniquely() {
  if ! grep -q "$2" "$1"; then
    echo "====> ✍ Writing \"$2\" into \"$1\" "
    echo "${2}" >>$1
  fi
}

get_shell_profile() {
  case "${SHELL}" in
  /bin/bash)
    echo ~/.bashrc
    return 0
    ;;
  /bin/zsh)
    echo ~/.zshrc
    return 0
    ;;
  esac
}

install_asdf() {
  if [ ! -f "$ASDF_BIN" ]; then
    echo "===> ⤵️ ASDF not detected ... installing"
    git clone https://github.com/asdf-vm/asdf.git "$ASDF_HOME" --branch $ASDF_VERSION
    # if asdf is not on the path, add it and refresh the shell
    [ ! command -v asdf ] &>/dev/null && {
      echo "====> ⚕️ adding to shell profile"
      append_uniquely "$(get_shell_profile)" ". $ASDF_HOME/asdf.sh"
      append_uniquely "$(get_shell_profile)" ". $ASDF_HOME/completions/asdf.bash"
    }
  fi

  source "$ASDF_BIN"
}

require git
require curl

echo "=> 💁 [ASDF] install with plugins"
install_asdf

asdf plugin add asdf-plugin-manager https://github.com/asdf-community/asdf-plugin-manager.git
asdf plugin update asdf-plugin-manager v1.2.0
asdf install asdf-plugin-manager 1.2.0
asdf global asdf-plugin-manager 1.2.0
asdf reshim
asdf-plugin-manager add-all

echo "==> 💁 [ASDF] install tools"
asdf install

echo "==> 💁 [ASDF] reshim binaries"
asdf reshim

echo "==> 💁 [ASDF] Done ✅"
