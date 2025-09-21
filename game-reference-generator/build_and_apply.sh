#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR

python build.py

DELTARUNE_DIRECTORY=$1
DATA_FILE_NAME=data.orig.win
export TMPDIR="$(mktemp -d /tmp/deltarune-modding-docs-gen.XXXXXX)"
echo "Exporting to $TMPDIR"
# ./UTMT_CLI_v0.8.3.0-Ubuntu/UndertaleModCli load $DELTARUNE_DIRECTORY/chapter1_windows/$DATA_FILE_NAME -s ./build/main.csx &
# ./UTMT_CLI_v0.8.3.0-Ubuntu/UndertaleModCli load $DELTARUNE_DIRECTORY/chapter2_windows/$DATA_FILE_NAME -s ./build/main.csx &
# ./UTMT_CLI_v0.8.3.0-Ubuntu/UndertaleModCli load $DELTARUNE_DIRECTORY/chapter3_windows/$DATA_FILE_NAME -s ./build/main.csx &
./UTMT_CLI_v0.8.3.0-Ubuntu/UndertaleModCli load $DELTARUNE_DIRECTORY/chapter4_windows/$DATA_FILE_NAME -s ./build/main.csx &

wait 
echo Finished?
