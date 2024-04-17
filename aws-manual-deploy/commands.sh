#!/bin/bash

echo 'Deploying static content do S3'
echo '======================================='

echo 'Creating S3 Bucket'
aws s3api create-bucket --bucket bruno-ravanhani-site --region us-east-1

echo 'Uploading content'
aws s3 sync ./ s3://bruno-ravanhani-site

echo 'Creating Origin Access Control (OAC)'
aws cloudfront create-origin-access-control --origin-access-control-config '{"Name": "bruno-ravanhani-site-oac", "SigningProtocol": "sigv4", "SigningBehavior": "no-override", "OriginAccessControlOriginType": "s3"}'

echo 'Creating distribution CloudFront'
aws cloudfront create-distribution --distribution-config file://aws-manual-deploy/dist-config.json

echo 'Upload policy'
aws s3api put-bucket-policy --bucket bruno-ravanhani-site --policy file://aws-manual-deploy/policy.json

echo '======================================='
echo 'Deploy finished!'

