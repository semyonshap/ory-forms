import Apple from "./apple"
import Auth0 from "./auth0"
import Discord from "./discord"
import Facebook from "./facebook"
import Github from "./github"
import Gitlab from "./gitlab"
import Google from "./google"
import Linkedin from "./linkedin"
import Microsoft from "./microsoft"
import Slack from "./slack"
import Spotify from "./spotify"
import X from "./x"
import Yandex from "./yandex"

const logos: Record<string, React.FC<import("../types").IconProps>> = {
  apple: Apple,
  auth0: Auth0,
  discord: Discord,
  facebook: Facebook,
  github: Github,
  gitlab: Gitlab,
  google: Google,
  linkedin: Linkedin,
  microsoft: Microsoft,
  slack: Slack,
  spotify: Spotify,
  yandex: Yandex,
  x: X,
}
export default logos
