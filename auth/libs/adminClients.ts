import { Configuration, OAuth2Api } from "@ory/client-fetch";

export const OAuth2Client = new OAuth2Api(new Configuration({ basePath: 'http://hydra:4445' }))