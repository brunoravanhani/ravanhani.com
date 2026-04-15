# GitHub OIDC provider — allows GitHub Actions to assume AWS roles without
# long-lived access keys. Run this file ONCE as a bootstrap step with an
# admin-level AWS profile before wiring up the pipeline.
#
# Usage:
#   terraform init
#   terraform apply -target=aws_iam_openid_connect_provider.github_actions \
#                   -target=aws_iam_role.github_actions \
#                   -target=aws_iam_role_policy.github_actions_deploy

data "tls_certificate" "github_actions" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github_actions.certificates[0].sha1_fingerprint]
}
