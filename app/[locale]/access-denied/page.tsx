import { AccessDenied } from "@/components/ui/access-denied"

export default function AccessDeniedPage() {
  return (
    <AccessDenied
      title="Access Denied"
      message="You don't have permission to access the requested page. Please contact your administrator if you believe this is an error."
      showBackButton={true}
      showHomeButton={true}
    />
  )
}
