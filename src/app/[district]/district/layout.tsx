import "@/styles/spacing.css";
import "@/styles/responsive.css";
import "./district-admin.css";
import "@/app/(public)/login/portal.css";
import { AppToaster } from "@/components/ui/AppToaster";

export default function DistrictAdministratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
