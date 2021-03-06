#!/usr/bin/env bash

# Creates the deployable Lambda zip

set -e

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd "$script_dir/.."

rm -rf target
mkdir -p target

cp -r package.json src target/

pushd target
npm install --production
zip -r eenymeeny-lambda.zip .
popd