import {
  Configuration,
  OAuth2Api,
  IdentityApi,
  RelationshipApi,
} from "@ory/client-fetch";
import {
  hydraAdminUrl,
  ketoAdminUrl,
  ketoPublicUrl,
  kratosAdminUrl,
} from "../../../lib/sdk";

const jsonConfig = (basePath: string) =>
  new Configuration({
    basePath,
    headers: { Accept: "application/json" },
  });

export const identityAdminClient = () =>
  new IdentityApi(jsonConfig(kratosAdminUrl()));
export const relationshipPublicClient = () =>
  new RelationshipApi(jsonConfig(ketoPublicUrl()));
export const relationshipAdminClient = () =>
  new RelationshipApi(jsonConfig(ketoAdminUrl()));
export const oAuth2AdminClient = () =>
  new OAuth2Api(jsonConfig(hydraAdminUrl()));
