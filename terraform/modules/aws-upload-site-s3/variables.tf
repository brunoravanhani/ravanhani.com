variable "bucket_name" {
  description = "Name of the s3 bucket. Must be unique."
  type        = string
}

variable "path" {
  description = "Path of the local files"
  type        = string
}

variable "distribution_id" {
  description = "Id Cloudfront distribution"
  type        = string
}
