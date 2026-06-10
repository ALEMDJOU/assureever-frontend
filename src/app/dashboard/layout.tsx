import { ReactNode } from "react";
import Providers from "@/components/dashboard/Providers";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  );
}
