import { logos } from '../assets'
import { OryComponents } from '../types'
import { defaultGroupSorter, defaultNodeSorter } from '../lib/nodes'

export const DefaultComponents: OryComponents = {
  Card: {
    Default: ({ options, attached }) => {
      const { title, description } = options ?? {}
      return (
        <fieldset>
          {title && <legend>{title}</legend>}
          {description && <p>{description}</p>}
          {attached}
        </fieldset>
      )
    },
  },
  Node: {
    Image: ({ node, props }) => (
      <figure>
        <img {...props} alt={node.meta.label?.text || ''} />
      </figure>
    ),
    Label: ({ options, children }) => {
      const { label } = options
      return (
        <div>
          {label && <label>{label}</label>}
          {children}
        </div>
      )
    },

    Button: ({ props, options }) => {
      const { label } = options
      return <button {...props}>{label}</button>
    },
    Input: ({ props }) => {
      return (
        <div>
          <input {...props} />
        </div>
      )
    },
    Code: ({ props }) => {
      return (
        <div>
          <input {...props} />
        </div>
      )
    },
    Text: ({ options }) => {
      const { text, label } = options
      return <p>{text || label || ''}</p>
    },
    Anchor: ({ props, options }) => {
      const { label } = options
      return (
        <a {...props} title={label}>
          {label || props.href}
        </a>
      )
    },
    Checkbox: ({ props, options }) => {
      const { label } = options
      return (
        <label>
          <input {...props} />
          {label}
        </label>
      )
    },
  },
  Icons: {
    Providers: {
      Apple: logos.Apple,
      Auth0: logos.Auth0,
      Discord: logos.Discord,
      Facebook: logos.Facebook,
      Github: logos.Github,
      Gitlab: logos.Gitlab,
      Google: logos.Google,
      Linkedin: logos.Linkedin,
      Microsoft: logos.Microsoft,
      Slack: logos.Slack,
      Spotify: logos.Spotify,
      X: logos.X,
      Yandex: logos.Yandex,
    },
  },
  nodeSorter: defaultNodeSorter,
  groupSorter: defaultGroupSorter,
}
