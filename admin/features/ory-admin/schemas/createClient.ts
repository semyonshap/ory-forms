import { z } from "zod";
import { formRegistry } from "../../form-builder";

export const createClientSchema = z.object({
  client_name: z.string().min(3).register(formRegistry, {
    label: "Client Name",
    placeholder: "My OAuth Client",
  }),
  redirect_uris: z.array(z.string()).optional().register(formRegistry, {
    label: "Redirect URIs",
    placeholder: "https://example.com/callback",
  }),
  post_logout_redirect_uris: z
    .array(z.string())
    .optional()
    .register(formRegistry, {
      label: "Post Logout Redirect URIs",
      placeholder: "https://example.com/logout",
    }),
  grant_types: z
    .array(
      z.enum([
        "authorization_code",
        "refresh_token",
        "client_credentials",
        "implicit",
        "device_authorization",
      ]),
    )
    .default(["authorization_code", "refresh_token"])
    .optional()
    .register(formRegistry, {
      label: "Grant Types",
      interface: "multiselect",
    }),
  scope: z
    .array(
      z.enum(["openid", "profile", "email", "offline_access", "introspect"]),
    )
    .optional()
    .default(["openid"])
    .register(formRegistry, {
      label: "Scopes",
      placeholder: "Select or enter custom scopes",
      interface: "multiselect",
    }),
  audience: z.array(z.string()).optional().register(formRegistry, {
    label: "Audience",
    placeholder: "Enter URI https://api.example.com",
  }),
  token_endpoint_auth_method: z
    .enum([
      "client_secret_basic",
      "client_secret_post",
      "private_key_jwt",
      "none",
    ])
    .default("client_secret_basic")
    .optional()
    .register(formRegistry, {
      label: "Token Endpoint Auth Method",
      interface: "select",
    }),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
