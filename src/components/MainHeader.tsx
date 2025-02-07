import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBarChart, faCodeCompare, faClockRotateLeft, faClipboardList, faListOl} from '@fortawesome/free-solid-svg-icons';

const links = [
  { link: "/scout", label: "Scout" },
  { link: "/stats", label: "Stats" },
  { link: "/compare", label: "Compare" },
  { link: "/history", label: "History" },
  { link: "/matchsummary", label: "Match Summary" },
  { link: "/compare/custom", label: "Team Summary" }
];

export function MainHeader() {
  console.log(links);
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className="px-3 py-2 hover:bg-green-200 text-lg flex items-center gap-2"
    >
      {link.label === "Scout" && (
        <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
      )}
      {link.label === "Stats" && (
        <FontAwesomeIcon icon={faBarChart} className="w-4 h-4" />
      )}
      {link.label === "Compare" && (
        <FontAwesomeIcon icon={faCodeCompare} className="w-4 h-4" />
      )}
      {link.label === "History" && (
        <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4" />
      )}
      {link.label === "Match Summary" && (
        <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4" />
      )}
      {link.label === "Team Summary" && (
        <FontAwesomeIcon icon={faListOl} className="w-4 h-4" />
      )}
      {link.label}
    </a>
  ));

  return (
    <header className="border-b border-gray-200 bg-black-300">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex gap-0 py-2 justify-center">
          {items}
        </nav>
      </div>
    </header>
  );
}


