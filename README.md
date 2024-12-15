# Serverless Recipe Scraper API

[![CI](https://github.com/adams-k/recipe-to-google-sheets/actions/workflows/sam-ci.yml/badge.svg)][![CD](https://github.com/adams-k/recipe-to-google-sheets/actions/workflows/sam-cd.yml/badge.svg)]

## About

This repo utilizes the AWS SAM CLI to deploy a REST API connected to an AWS Lambda function. The Lambda function uses the [recipe-scrapers](https://github.com/hhursev/recipe-scrapers) Python package to scrape recipes from various websites and return them through the API Gateway. This can be connected to a Google App Scripts to display these recipes on a Google Sheet. 

## Getting Started

These instructions will walk you through setting up this project to deploy to the AWS Cloud (both locally and using Github) and how to set up Google Sheets

### Prerequisites

- AWS Account with permissions to IAM, Lambda, S3, Cloudformations, and API Gateway
- AWS Role for [OIDC](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/) to the Github Repo
- The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed locally
- An S3 bucket to store AWS CloudFormation template on deployment
    - In AWS CloudFormations, select "Create Stack" >> "With new resources" >> "Choose an existing template" >> "Upload a template file" and upload the `s3_template.json` file.

### Deploying Manually

First, set up your AWS CLI configuration for access to the AWS Account. 

Verify you are connected.

```
aws sts get-caller-identity
```

Then, you can build the package.

```
sam build --use-container
```

Once the package is built, it is ready to be deployed. Replace $REGION with your region and $BUCKET with the name (not arn) of the bucket built previously.

```
sam deploy --no-fail-on-empty-changeset --stack-name recipe-app --region $REGION --s3-bucket $BUCKET
```

Check the output and verify everything completed in AWS.

## Deploying via Github Actions

In Github, clone this repository to your account. Then add repository secrets `AWS_REGION` and `S3_BUCKET` for the Actions to use. From here, you can head to the `Actions` tab in AWS and manually trigger the `Deploy Serverless App` action. Verify the action completes and double check everything is built in AWS.

## Setup Google Sheets and App Scripts

The `google_script.js` works specifically with a Google Sheet I have created. This [template](https://docs.google.com/spreadsheets/d/1ESUiW-vuoyLOrVWDuzIRn2kYmaeSbVwK-AAviz-JlCY/edit?usp=sharing) can be copied to your Google account. 

Within the Sheet, go to the `Extensions` menu and click `Apps Script`. Copy the script from `google_script.js` and paste it into the Apps Script. 

From here, click `Project Settings` and scroll down to `Add Script Properties`. Add a property `api` with the API Invoke URL and another `api-key` that is found in AWS. Run once to make sure the function is set up. 

Once this is done, you can enjoy grabbing recipes easily from online!

## Built With

* [AWS](https://aws.amazon.com/) - Cloud Services
* [Python](https://www.python.org/) - Language for AWS Lambda
* [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/) - Deploys resources using CloudFormation
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Language for Google Apps Script
* [Github](https://github.com) - Stores repo and proves Github Actions for automation
* [Google Sheets](https://workspace.google.com/products/sheets/) - Used to output Recipes and submit URLs