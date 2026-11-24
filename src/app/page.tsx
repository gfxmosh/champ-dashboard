import { redirect } from "next/navigation"

// The app lives under /dashboard; send the root there.
export default function Home() {
  redirect("/dashboard")
}
