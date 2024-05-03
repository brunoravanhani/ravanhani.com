provider "aws" {
  region = "us-east-1"
}

module "website_s3_bucket" {
  source = "./modules/static-s3-cloudfront"

  bucket_name = "bruno-ravanhani-static-site"
  region = "us-east-1"
  oac_name = "bruno-ravanhani-static-site-oac"
  tags = {
    Terraform   = "true"
    Context     = "ravanhani-site"
  }
}

module "website_s3_bucket_upload" {
  depends_on = [ module.website_s3_bucket ]

  source = "./modules/aws-upload-site-s3"

  bucket_name = "bruno-ravanhani-static-site"
  path = var.content_path
}