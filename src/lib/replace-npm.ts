export async function replaceNpm() {
	console.info('If you use Linux, add this to your .zshrc or .bashrc:');
	console.info('-----------------------------------------------------');
	console.info(`replacenpm() {
  alias realnpm=$(which npm)
  alias npm=anypm
}

loadnvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc  )"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "\${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
      replacenpm()
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
      replacenpm()
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
    replacenpm()
  fi
}
loadnvmrc
cd() {
  builtin cd "$1"
  loadnvmrc
}`);
}
