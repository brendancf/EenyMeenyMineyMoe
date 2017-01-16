rem Create stack
rem TODO Take ENV variable and include as part of stack name

aws cloudformation create-stack \
    --stack-name EenyMeenyMineyMoeStaging \
    --template-body fileb://cloud_formation.template \
    --capabilities CAPABILITY_IAM \
    --region eu-west-1

rem Package up lambda files
rm -rf target
mkdir -p target

cp -r *.js package.json lib target/

pushd target
npm install --production
zip -r eeny-meeny-lambda.zip .
popd

rem Update lambda function
aws lambda update-function-code \
    --function-name GreetingLambda \
    --zip-file fileb://greeting-lambda.zip \
    --region eu-west-1

rem Publish new version
aws lambda publish-version \
    --function-name GreetingLambda \
    --description $build_number \
    --region eu-west-1

rem Update staging/development alias to point at new version
# Find the Lambda version that is not the $LATEST version and has the ${build_number} as its description
lambda_version=$(aws lambda list-versions-by-function \
    --function-name GreetingLambda \
    --region eu-west-1 \
    --output json| jq -r ".Versions[] | select(.Version!=\"\$LATEST\") | select(.Description == \"${build_number}\").Version")

existing_aliases=$(aws lambda list-aliases \
    --function-name GreetingLambda \
    --region $aws_region \
    --output json| jq -r '.Aliases[] | {Name: .Name}')

aws lambda update-alias \
    --function-name GreetingLambda \
    --name STAGE \
    --function-version $lambda_version \
    --description $build_number \
    --region eu-west-1