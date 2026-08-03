'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Error({ reset }: { reset: () => void }) {
  const handleGoHome = () => {
    if (reset) {
      reset()
    }
    window.location.href = '/'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            An unexpected error occurred. Please try returning to the home
            page.
          </p>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
          >
            Go back to home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
