import { logos } from '../assets'
import { OryComponents } from '../types'
import { defaultGroupSorter, defaultNodeSorter } from '../lib/nodes'

export const DefaultComponents: OryComponents = {
  Layout: {
    Card: ({ props, options, attached }) => {
      const { title, description, messages } = options
      return (
        <form
          {...props}
          style={{
            background: '#212121',
            width: '400px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderRadius: '16px',
          }}
        >
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
          {messages?.map((msg) => (
            <p
              key={msg.id}
              style={{
                color: msg.type === 'error' ? 'red' : msg.type === 'success' ? 'green' : 'white',
              }}
            >
              {msg.text}
            </p>
          ))}
          {attached}
        </form>
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
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {label && <label>{label}</label>}
          {children}
        </div>
      )
    },

    Button: ({ props, options }) => {
      const { label, icon: Icon } = options
      return (
        <button
          style={{
            width: '100%',
            maxHeight: '32px',
            padding: '4px',
            background: '#424242',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
          {...props}
        >
          {Icon && <Icon />}
          {label}
        </button>
      )
    },
    Input: ({ props }) => {
      return (
        <input
          {...props}
          style={{
            width: '100%',
            padding: '4px 16px',
            borderRadius: '8px',
            background: '#323232',
          }}
        />
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
