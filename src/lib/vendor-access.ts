export type VendorApplicationState = {
  has_application: boolean;
  status?: "pending" | "approved" | "rejected" | "suspended";
};

export function vendorLoginRedirect(next = "/vendor/register"): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

export function shouldRedirectToLogin(message: string): boolean {
  return message.toLowerCase().includes("401");
}

export function resolveVendorEntryDestination(application: VendorApplicationState | null): string | null {
  if (application?.has_application && application.status === "approved") {
    return "/vendor/dashboard";
  }
  return null;
}
