variable "region" {
  description = "Name of the region"
  type        = string
}

variable "bucket_name" {
  description = "Name of the s3 bucket. Must be unique."
  type        = string
}

variable "oac_name" {
  description = "Name of the OAC. Must be unique."
  type        = string
}


variable "tags" {
  description = "Tags to set on the resources."
  type        = map(string)
  default     = {}
}
