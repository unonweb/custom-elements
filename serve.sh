#!/bin/bash

SCRIPT_NAME=$(basename -- "$(readlink -f "${BASH_SOURCE}")")
SCRIPT_DIR=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")
SCRIPT_PATH="$(readlink -f "${BASH_SOURCE}")"
RESET="\033[0m"
BOLD="\033[1m"
UNDERLINE="\033[4m"
PEACH="\033[48;5;209m"
WEB_ROOT="${SCRIPT_DIR}"
HTML_DIR="${SCRIPT_DIR}"

function main {
	# ARGS
	# ----
	# ${1}	a) path to directory with index.html or b) path to index.html itself
	
	# REQUIRES
	# --------
	# web-dev-server to be installed globally
	
	local html_path

	if [[ -n "${1}" ]]; then
		if [[ -e "${1}" ]]; then
			html_path="${1}"
		else
			echo "Directory ${1} not found."
		fi
	else
		# no argument provided, prompt user to select a directory
		local html_paths=("${HTML_DIR}/"*.html)
		
		# convert path to directory name
		local html_names=()
		for path in "${html_paths[@]}"; do
			if [[ -f "${path}" ]]; then
				local name=$(basename ${path})
				html_names+=("${name}")
			fi
		done

		# select html to open
		echo -e "${BOLD}Please select:${RESET}"
		select file in "${html_names[@]}"; do
			if [[ -n "${file}" ]]; then
				html_path="${HTML_DIR}/${file}"
				# remove the longest match from the beginning
				html_path=${html_path##${WEB_ROOT}} # remove path to web root
				break
			else
				echo "Invalid selection. Please try again."
			fi
		done
		echo
	fi

	# SERVE
	echo -e "Serving ${PEACH}${html_path}${RESET}"
	npx -g wds --root-dir ${WEB_ROOT} --open ${html_path}
}

main ${@}