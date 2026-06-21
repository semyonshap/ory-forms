import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RootPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Jiko Auth Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Use the sidebar to navigate through the admin panel.
        </p>
      </CardContent>
    </Card>
  );
}
