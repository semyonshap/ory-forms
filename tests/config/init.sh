#!/bin/sh

wait_for() {
  local url="$1"
  echo "[init.sh] Waiting for $url..."
  until curl --silent --fail "$url" > /dev/null 2>&1; do
    sleep 2
  done
  echo "[init.sh] $url is ready"
}

wait_for "http://kratos:4434/health/ready"
wait_for "http://hydra:4445/health/ready"
wait_for "http://keto:4467/health/ready"

IDENTITY=$(curl -s --request POST \
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

IDENTITY_ID=$(echo "$IDENTITY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "[init.sh] Identity ID: $IDENTITY_ID"

curl -s -o /dev/null --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "client_id": "my-client",
    "client_secret": "my-secret",
    "client_name": "My OAuth2 Client",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "scope": "openid email profile offline",
    "redirect_uris": ["http://127.0.0.1:5555/callback"],
    "token_endpoint_auth_method": "client_secret_post"
  }' \
  http://hydra:4445/admin/clients

echo "[init.sh] OAuth client created"

curl -s -o /dev/null --request PUT \
  --header "Content-Type: application/json" \
  --data "{
    \"namespace\": \"Group\",
    \"object\": \"admins\",
    \"relation\": \"members\",
    \"subject_id\": \"$IDENTITY_ID\"
  }" \
  http://keto:4467/admin/relation-tuples

echo "[init.sh] Keto relationship created"