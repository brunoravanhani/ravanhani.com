locals {
  s3_domain = "${var.bucket_name}.s3.${var.region}.amazonaws.com"
}


resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.bucket_name

  tags = var.tags
}

resource "aws_cloudfront_origin_access_control" "oac" {
  depends_on                        = [aws_s3_bucket.s3_bucket]
  name                              = var.oac_name
  description                       = "OAC to allow cloudfront access S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "no-override"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "CachingOptimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "s3_distribution" {

  depends_on = [aws_cloudfront_origin_access_control.oac]

  origin {
    domain_name              = local.s3_domain
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    origin_id                = local.s3_domain
  }

  aliases = [ "bruno.ravanhani.com" ]
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Distribution to site bruno.ravanhani.com"
  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_domain

    cache_policy_id = data.aws_cloudfront_cache_policy.CachingOptimized.id

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn = "arn:aws:acm:us-east-1:087730237728:certificate/aa2f6bf4-5421-4ea4-8781-87f3eb8e28c7"
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_s3_bucket_policy" "allow_access_from_cloudfront" {

  depends_on = [aws_cloudfront_distribution.s3_distribution]

  bucket = var.bucket_name
  policy = data.aws_iam_policy_document.allow_access_from_cloudfront.json
}

data "aws_iam_policy_document" "allow_access_from_cloudfront" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.s3_bucket.arn}/*",
    ]

    condition {
      test     = "StringLike"
      variable = "AWS:SourceArn"

      values = [
        aws_cloudfront_distribution.s3_distribution.arn
      ]
    }
  }
}