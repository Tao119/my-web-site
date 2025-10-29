import PortfolioLayout from "@/components/portfolio/PortfolioLayout";

export const metadata = {
  title: "Tao Matsumura - Portfolio",
  description: "エンジニア松村タオのポートフォリオサイト。Web開発、Unity、AI開発などの実績を紹介。",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortfolioLayout>
      {children}
    </PortfolioLayout>
  );
}
