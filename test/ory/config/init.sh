#!/bin/sh

wait_for() {
  local url="$1"
  echo "Waiting for $url..."
  until curl --silent --fail "$url" > /dev/null 2>&1; do
    sleep 2
  done
  echo "$url is ready"
}

wait_for "http://kratos:4434/health/ready"
wait_for "http://hydra:4445/health/ready"
wait_for "http://keto:4467/health/ready"

echo "=== Creating Kratos identity ==="
IDENTITY=$(curl --silent --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "schema_id": "default",
    "traits": {
      "username": "admin",
      "name": {
        "first": "Admin",
        "last": "User"
      },
      "email": "admin@example.com"
    },
    "credentials": {
      "password": {
        "config": { "password": "admin123" }
      }
    }
  }' \
  http://kratos:4434/admin/identities)

echo "Identity response: $IDENTITY"
IDENTITY_ID=$(echo "$IDENTITY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Identity ID: $IDENTITY_ID"

echo "=== Creating Hydra OAuth2 client ==="
curl --silent --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "client_id": "my-client",
    "client_secret": "my-secret",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "scope": "openid offline",
    "redirect_uris": ["http://127.0.0.1:5555/callback"],
    "token_endpoint_auth_method": "client_secret_post"
  }' \
  http://hydra:4445/admin/clients
echo "OAuth client created"

echo "=== Creating Keto relationship ==="
curl --silent --request PUT \
  --header "Content-Type: application/json" \
  --data "{
    \"namespace\": \"Group\",
    \"object\": \"admins\",
    \"relation\": \"members\",
    \"subject_id\": \"$IDENTITY_ID\"
  }" \
  http://keto:4467/admin/relation-tuples
echo "Keto relationship created"

echo "=== Init complete ==="