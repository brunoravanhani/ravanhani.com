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

resource "terraform_data" "clear_cloudfront_cache" {
  lifecycle {
    replace_triggered_by = [
      module.website_s3_bucket_upload
    ]
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${module.website_s3_bucket.distribution_id} --paths '/*'"
  }
}