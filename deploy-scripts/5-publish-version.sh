#!/usr/bin/env bash

# Publishes the version $LATEST Lambda with the build number as description
#
# Usage:
#   5-publish-version.sh build_number

set -e

lambda_name=EenyMeenyMineyMoe
build_number=$1

if [ -z "$AWS_DEFAULT_REGION" ]; then
    aws_region="us-east-1"
else
    aws_region=$AWS_DEFAULT_REGION
fi

aws lambda publish-version --function-name $lambda_name --description $build_number --region $aws_region

# Add trigger for alexa skils kit
# https://forums.developer.amazon.com/questions/3639/does-anyone-know-the-arn-of-the-alexa-event-source.html
# http://docs.aws.amazon.com/cli/latest/reference/lambda/add-permission.html
aws lambda add-permission --function-name $lambda_name --qualifier $build_number --statement-id 1 --action lambda:invokeFunction --principal alexa-appkit.amazon.com --region $aws_region