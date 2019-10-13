export const config = {
  "dev": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host":     process.env.POSTGRES_HOST,
    "dialect": "postgres",
  },
  "aws": {
    "aws_region": process.env.POSTGRES_REGION,
    "aws_profile": process.env.POSTGRES_PROFILE,
    "aws_media_bucket": process.env.POSTGRES_MEDIA_BUCKET
  },
  "jwt": {
    "secret": process.env.SECRET_KEY
  }
}
