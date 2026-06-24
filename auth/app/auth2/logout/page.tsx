import { logger } from "@/libs/logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { oauth2Client } from "@/features/ory-elements/client/clients";

const api = oauth2Client();

async function confirmLogout(formData: FormData) {
  "use server";

  const challenge = formData.get("challenge") as string;
  const action = formData.get("action") as string;

  if (action === "accept") {
    const { redirect_to } = await api.acceptOAuth2LogoutRequest({
      logoutChallenge: challenge,
    });
    redirect(redirect_to);
  } else if (action === "reject") {
    await api.rejectOAuth2LogoutRequest({
      logoutChallenge: challenge,
    });
    redirect("/");
  }
}

export default async function OAuth2LogoutPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const logoutChallenge = searchParams.logout_challenge as string;

  if (!logoutChallenge) {
    logger.error("No logout challenge provided");
    return <div>Invalid logout challenge</div>;
  }

  try {
    const logoutRequest = await api.getOAuth2LogoutRequest({
      logoutChallenge,
    });
    const { challenge, subject, sid, client } = logoutRequest;

    logger.info("Logout request received", {
      subject: subject,
      sid: sid,
      challenge: challenge,
    });

    const redirectUrl =
      client?.post_logout_redirect_uris?.[0] || "the application";

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Confirm Logout</CardTitle>
            <CardDescription>Are you sure you want to log out?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will end your current session <br /> and redirect you to{" "}
              <span className="text-primary">{redirectUrl}</span>.
            </p>
            <form action={confirmLogout} className="space-y-4">
              <input
                type="hidden"
                name="challenge"
                value={challenge || logoutChallenge}
              />
              <Button
                type="submit"
                name="action"
                value="accept"
                variant="destructive"
                className="w-full"
              >
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    logger.error("Error handling OAuth2 logout", { error, logoutChallenge });
    return <div>Error during logout</div>;
  }
}
