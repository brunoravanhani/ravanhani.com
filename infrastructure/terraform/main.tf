terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  # Remote state in S3 — create the bucket and DynamoDB table once
  # with the bootstrap script before running terraform init.
  backend "s3" {
    bucket  = "tf-state-bucket-087730237728"
    key     = "contact-lambda/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "ravanhani.com"
      Component   = "contact-mailer"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
