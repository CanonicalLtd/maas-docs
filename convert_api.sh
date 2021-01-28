#!/bin/bash

API_RST=./api.rst
API_MD_DIR=.

function usage {
  echo "usage: convert_api.sh [-a /path/to/api.rst] [-p /path/to/api.md/directory]"
  echo "       If -a is omitted, assume './api.rst'"
  echo "       If -p is omitted, assume './'"
}

while getopts ":a:p:" opt; do
  case ${opt} in
    a )
      API_RST=$OPTARG
      ;;
    p )
      API_MD_DIR=$OPTARG
      ;;
    \? )
      usage
      exit
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! -r $API_RST ]] ; then
  echo "$API_RST is not readable."
  exit 2
fi

if [[ ! -r $API_MD_DIR/api.md ]] ; then
  echo "$API_MD_DIR doesn't contain api.md"
  exit 3
fi


(
  set -x
  cd $API_MD_DIR
  printf "Title: API\ntable_of_contents: True\n\n" > api.md; cat $API_RST | sed -n '/========/,$p' | pandoc --from=rst --to=markdown >> api.md
  set +x
  echo "Conversion completed. See $API_MD_DIR/api.md."
)
