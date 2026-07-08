import Link from "next/link"
import JikoIcon from "@/components/icons/jiko-icon"
import { getLogoutFlow, getServerSession } from "@/features/ory-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, LogIn, Settings } from "lucide-react"

export default async function RootLayout() {
  const session = await getServerSession()
  const traits = session?.identity?.traits as {
    email: string
    username: string
    phone: string
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex mb-10">
          <JikoIcon className="h-16 w-auto" />
        </div>
        {!session && (
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-center">Join to Collaborate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/auth/registration">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registration
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {session && (
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-center">
                Welcome, {traits.username ?? traits.phone}!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link prefetch={false} href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost">
                <LogoutLink />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

async function LogoutLink() {
  const flow = await getLogoutFlow({})

  return (
    <Link
      prefetch={false}
      className="underline block w-full"
      href={flow.logout_url}
    >
      Logout
    </Link>
  )
}
