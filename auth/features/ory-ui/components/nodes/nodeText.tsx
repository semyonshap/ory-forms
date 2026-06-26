import { getNodeLabel } from "@ory/client-fetch";
import { UiNode, UiNodeTextAttributes, UiText } from "@ory/client-fetch";

interface Props {
  node: UiNode;
  attributes: UiNodeTextAttributes;
}

const Content = ({ attributes }: Props) => {
  switch (attributes.text.id) {
    case 1050015: {
      const secrets = (attributes.text.context as any).secrets.map(
        (text: UiText, k: number) => (
          <div key={k} data-testid={`node/text/${attributes.id}/lookup_secret`}>
            <code>{text.id === 1050014 ? "Used" : text.text}</code>
          </div>
        ),
      );
      return (
        <div
          data-testid={`node/text/${attributes.id}/text`}
          className="grid grid-cols-3 gap-2"
        >
          {secrets}
        </div>
      );
    }
    default:
      return (
        <pre
          data-testid={`node/text/${attributes.id}/text`}
          className="bg-muted p-4 rounded-md overflow-x-auto"
        >
          <code>{attributes.text.text}</code>
        </pre>
      );
  }
};

export const NodeText = ({ node, attributes }: Props) => {
  const label = getNodeLabel(node);
  const labelText = label?.text || "";

  return (
    <div className="mb-2">
      {labelText && (
        <p
          data-testid={`node/text/${attributes.id}/label`}
          className="text-sm font-medium"
        >
          {labelText}
        </p>
      )}
      <Content node={node} attributes={attributes} />
    </div>
  );
};
