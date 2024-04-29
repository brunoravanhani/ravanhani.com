variable "bucket_name" {
  description = "Name of the s3 bucket. Must be unique."
  type        = string
}

variable "path" {
  description = "Path of the local files"
  type        = string
}
