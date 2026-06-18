import { Settings } from "@/features/ory-elements/features/flows";
import { getSettingsFlow, OryPageParams } from "@ory/nextjs/app";
import { SessionProvider } from "@/features/ory-elements/client";

import { oryConfig } from "@/ory.config";

export default async function SettingsPage(props: OryPageParams) {
  const flow = await getSettingsFlow(oryConfig, props.searchParams);

  if (!flow) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 items-center mb-8">
      <SessionProvider>
        <Settings flow={flow} config={oryConfig} />
      </SessionProvider>
    </div>
  );
}
