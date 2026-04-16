# Zip the lambda directory (node_modules must be installed before terraform apply)
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda"
  output_path = "${path.module}/dist/lambda.zip"
  excludes = [
    "package-lock.json",
    ".gitignore",
    "*.md",
  ]
}

resource "aws_cloudwatch_log_group" "contact_lambda" {
  name              = "/aws/lambda/contact-mailer"
  retention_in_days = 14
}

resource "aws_lambda_function" "contact_mailer" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "contact-mailer"
  role             = aws_iam_role.contact_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  timeout          = 30
  memory_size      = 128

  environment {
    variables = {
      PERSONAL_EMAIL       = var.personal_email
      SES_FROM_EMAIL       = var.ses_from_email
      ALLOWED_ORIGINS      = var.allowed_origins
      RECAPTCHA_SECRET_KEY = var.recaptcha_secret_key
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.contact_lambda,
  ]
}
