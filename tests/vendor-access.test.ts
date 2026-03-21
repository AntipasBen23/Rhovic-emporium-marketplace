import { describe, expect, it } from "vitest";
import { resolveVendorEntryDestination, shouldRedirectToLogin, vendorLoginRedirect } from "../src/lib/vendor-access";

describe("vendor access helpers", () => {
  it("builds the login redirect with the vendor register next hop", () => {
    expect(vendorLoginRedirect()).toBe("/login?next=%2Fvendor%2Fregister");
    expect(vendorLoginRedirect("/vendor/dashboard")).toBe("/login?next=%2Fvendor%2Fdashboard");
  });

  it("detects 401 auth failures and ignores unrelated errors", () => {
    expect(shouldRedirectToLogin("Request failed with status 401")).toBe(true);
    expect(shouldRedirectToLogin("Forbidden")).toBe(false);
  });

  it("only sends approved vendor applications to the dashboard", () => {
    expect(resolveVendorEntryDestination({ has_application: true, status: "approved" })).toBe("/vendor/dashboard");
    expect(resolveVendorEntryDestination({ has_application: true, status: "pending" })).toBeNull();
    expect(resolveVendorEntryDestination({ has_application: false })).toBeNull();
  });
});
