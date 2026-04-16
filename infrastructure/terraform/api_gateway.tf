resource "aws_lambda_function_url" "contact_mailer" {
  function_name      = aws_lambda_function.contact_mailer.function_name
  authorization_type = "NONE"

  cors {
    allow_headers = ["Content-Type"]
    allow_methods = ["POST"]
    allow_origins = split(",", var.allowed_origins)
    max_age       = 300
  }
}
