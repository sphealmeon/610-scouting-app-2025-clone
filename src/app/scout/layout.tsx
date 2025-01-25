import { MainHeader } from "@/components/MainHeader";

export default function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
} 