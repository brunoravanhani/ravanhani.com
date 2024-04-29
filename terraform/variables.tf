
variable "folders" {
  description = "Name of the s3 bucket. Must be unique."
  type        = set(string)
  default = ["images", "css"]
}
