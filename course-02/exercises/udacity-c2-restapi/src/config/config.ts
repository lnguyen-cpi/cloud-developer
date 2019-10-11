export const config = {
  "dev": {
    "username": "postgres",
    "password": "Nguyenbalam123",
    "database": "database1",
    "host": "database1.cclq1q9xkgq2.us-east-1.rds.amazonaws.com",
    "dialect": "postgres",
  },
  "aws": {
    "aws_region": "us-east-1",
    "aws_profile": "default",
    "aws_media_bucket": "udagram-nguyen-dev"
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
  "jwt": {
    "secret": "helloworld";
  }
}
