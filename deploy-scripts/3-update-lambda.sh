#!/usr/bin/env bash

# Deploys the Lambda .zip file to AWS Lambda as version $LATEST

set -e

script_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
zip_file="$script_dir/../target/eenymeeny-lambda.zip"
lambda_name=EenyMeenyMineyMoe

if [ -z "$AWS_DEFAULT_REGION" ]; then
    aws_region="us-east-1"
else
    aws_region=$AWS_DEFAULT_REGION
fi

aws lambda update-function-code --function-name $lambda_name --zip-file fileb://$zip_file --region $aws_region
