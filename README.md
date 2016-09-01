# AWS Cognito Lambda Auth system [![Build Status](https://travis-ci.org/digitalXlabs/aaas.svg?branch=master)](https://travis-ci.org/digitalXlabs/aaas)

(this is not ready for production AT ALL)

This project is all about using the AWS Cognito service to create an Authentication As A Service platform.
We will add more to this readme as more of the project evolves

## Encrypting configuration using AWS Key Management Service (KMS)

### Things you will need

1. An AWS account
2. A config file
3. A terminal

### Create your AWS account

You need to do this over at http://aws.amazon.com
Once you have created your account, check out the docs for the AWS Key management service over at http://docs.aws.amazon.com/kms/latest/developerguide/getting-started.html

### Create your config.json file
Set up a file with the following contents
```
{
      "region": "<amazon-region>",
      "pool_id": "<cognito-identity-pool-id>",
      "user_pool_id": "<cognito-user-pool-id>",
      "client_id": "<cognito-client-id>"
}
```



### Create the encrypted secret

1. Login to AWS console and go to IAM > Encryption Keys
2. Change the Region Filter to EU(Ireland)
3. Select the key you created
4. Copy the ARN for this Master key
5. Use the AWS cli to produce the ./encrypted-secret used in the Lambda function on the command line issue this command
```
aws kms encrypt --profile <your-profile> --key-id <arn> --plaintext file://config.json --query CiphertextBlob --output text | base64 -D > ./encrypted-secret
```



## Deploy using Serverless Framework (beta)

This proiject uses serverless Framework https://serverless.com.

Unfortunately to deploy you have to set the AWS_PROFILE environment variable unless you have a default profile set in your .aws/credentials file

It will then use this as the default deployment profile

issue command `sls deploy` from within your serverless project directory
