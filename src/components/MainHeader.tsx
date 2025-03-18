"use client"

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHouse, 
  faBarChart, 
  faCodeCompare, 
  faClockRotateLeft, 
  faClipboardList, 
  faListOl,
  faHammer,
  faChessKing,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'

// Prevent fontawesome from dynamically adding its css
config.autoAddCss = false

const links = [
  { link: "/scout", label: "Scout" },
  { link: "/stats", label: "Stats" },
  { link: "/compare", label: "Compare" },
  { link: "/pitscout", label: "Pit Scouting" },
  { link: "/matchsummary", label: "Match Summary" },
  { link: "/stats/teams", label: "Team Stats" },
  { link: "/picklist", label: "Picklist" },
  { link: "/history", label: "History"},
  { link: "/thirdpick", label: "Third Bot"}
];

export function MainHeader() {
  console.log(links);
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className="px-2 sm:px-3 py-1 sm:py-2 hover:bg-gray-200 hover:text-black text-sm sm:text-lg flex items-center gap-1 sm:gap-2 rounded text-white transition-colors whitespace-nowrap"
    >
      {link.label === "Scout" && (
        <FontAwesomeIcon icon={faHouse} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Stats" && (
        <FontAwesomeIcon icon={faBarChart} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Compare" && (
        <FontAwesomeIcon icon={faCodeCompare} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "History" && (
        <FontAwesomeIcon icon={faClockRotateLeft} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Match Summary" && (
        <FontAwesomeIcon icon={faClipboardList} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Team Stats" && (
        <FontAwesomeIcon icon={faListOl} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Pit Scouting" && (
        <FontAwesomeIcon icon={faHammer} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Picklist" && (
        <FontAwesomeIcon icon={faChessKing} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label === "Third Bot" && (
        <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3 sm:w-4 sm:h-4" />
      )}
      {link.label}
    </a>
  ));

  return (
    <header className="border-b border-gray-200 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <nav className="flex flex-wrap gap-1 sm:gap-2 py-1 sm:py-2 justify-center items-center">
          {items}
        </nav>
      </div>
    </header>
  );
}


