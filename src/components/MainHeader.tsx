import { Geist } from "next/font/google";

const links = [
  { link: "/scout", label: "Scout" },
  { link: "/stats", label: "Stats" },
  { link: "/compare", label: "Compare" },
  { link: "/history", label: "History"},
  { link: "/matchsummary", label: "Match Summary"},
  { link: "/compare/custom", label: "Team Summary" }
];

export function MainHeader() {
  const items = links.map((link) => (
    <a key={link.label} href={link.link} className="px-3 py-2 hover:bg-gray-100">
      {link.label}
    </a>
  ));

  return (
    <header className="border-b border-gray-200 bg-blue-100">
      <div className="max-w-7xl mx-auto px-4"> 
        <nav className="flex gap-0 py-2"> 
          {items}
        </nav>
      </div>
    </header>
  );
} 