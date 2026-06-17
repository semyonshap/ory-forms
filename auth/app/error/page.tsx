import { redirect } from "next/navigation";
import ErrorCard from "@/components/errorCard";
import { Configuration, FrontendApi } from "@ory/client-fetch";
import { oryConfig } from "@/ory.config";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; lid?: string }>;
}) {
  const params = await searchParams;
  let userMessage;

  if (params.id) {
    const client = new FrontendApi(
      new Configuration({
        basePath: oryConfig.sdk.url,
        headers: { Accept: "application/json" },
      }),
    );

    const flow = await client.getFlowError({ id: params.id }).catch(() => null);
    if (flow) {
      const err = flow.error as
        | { message?: string; reason?: string }
        | undefined;
      userMessage = err?.message || err?.reason;
    }
  } else {
    redirect("/");
  }

  return <ErrorCard message={userMessage || "No error details available."} />;
}
