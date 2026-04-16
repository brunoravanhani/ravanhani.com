variable "aws_region" {
  description = "AWS region where resources will be created."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g. production, staging)."
  type        = string
  default     = "production"
}

variable "personal_email" {
  description = "Personal email address that will receive contact form submissions. Must be verified in SES."
  type        = string
  sensitive   = true
}

variable "ses_from_email" {
  description = "Verified SES sender email address (the From: address). Must be verified in SES."
  type        = string
}

variable "allowed_origins" {
  description = "Comma-separated list of allowed CORS origins (e.g. https://ravanhani.com)."
  type        = string
  default     = "https://ravanhani.com"
}

variable "github_org" {
  description = "GitHub organisation or username that owns the repository (used for the OIDC trust policy)."
  type        = string
  default     = "ravanhani"
}

variable "github_repo" {
  description = "GitHub repository name (used for the OIDC trust policy)."
  type        = string
  default     = "ravanhani.com"
}

variable "recaptcha_secret_key" {
  description = "Google reCAPTCHA v3 secret key used by the Lambda to verify tokens."
  type        = string
  sensitive   = true
}
