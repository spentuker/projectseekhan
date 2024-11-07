import secrets

# Generate a secure secret key for `SECRET_KEY` and `JWT_SECRET_KEY`
secrets.token_hex(32)
