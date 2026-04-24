import type { Metadata } from "next"
import AccountPageClient from "./AccountPageClient"

export const metadata: Metadata = {
  title: "My Account - GlamUp",
  description: "Manage your GlamUp account, view booking history, and update your profile.",
}

export default function AccountPage() {
  return <AccountPageClient />
}
