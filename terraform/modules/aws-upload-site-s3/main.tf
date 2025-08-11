
locals {
  content_type_map = {
   "js" = "application/json"
   "html" = "text/html"
   "css"  = "text/css"
   "png"  = "image/png"
   "webp"  = "image/webp"
   "ico"  = "image/ico"
   "xml"  = "text/xml"
   "svg"  = "image/svg+xml"
   "webmanifest"  = "application/manifest+json"
  }
}

resource "aws_s3_object" "upload" {
  for_each   = fileset(var.path, "**")

  bucket = var.bucket_name
  key    = each.value
  source = "${var.path}\\${each.value}"
  etag   = filemd5("${var.path}\\${each.value}")
  content_type = lookup(local.content_type_map, split(".", "C:\\Projetos\\Iteris\\aws\\corrida-static\\${each.value}")[1], "text/html")
}

resource "null_resource" "invalidate_cf_cache" {
  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${var.distribution_id} --paths '/*'"
  }

  triggers = {
    website_version_changed = aws_s3_object.upload.version_id
  }
}