import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder landing page. Verifies Tailwind + shadcn/ui (Radix) render correctly.
// Replaced by the dashboard shell in Phase 2.
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Champ Dashboard</CardTitle>
            <Badge variant="secondary">Phase 1</Badge>
          </div>
          <CardDescription>
            Next.js, TypeScript, Tailwind CSS and shadcn/ui are set up.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The dashboard shell lands in the next phase.
        </CardContent>
        <CardFooter className="gap-2">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
