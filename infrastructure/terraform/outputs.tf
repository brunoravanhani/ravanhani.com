output "api_endpoint" {
  description = "HTTPS endpoint to POST contact form submissions to."
  value       = aws_lambda_function_url.contact_mailer.function_url
}

output "lambda_function_name" {
  description = "Name of the deployed Lambda function."
  value       = aws_lambda_function.contact_mailer.function_name
}

output "lambda_function_arn" {
  description = "ARN of the deployed Lambda function."
  value       = aws_lambda_function.contact_mailer.arn
}

output "github_actions_role_arn" {
  description = "IAM role ARN to use as AWS_ROLE_TO_ASSUME in GitHub repository secrets."
  value       = aws_iam_role.github_actions.arn
}
