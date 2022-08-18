import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface MenuItem {
  key: number;
  linkText: string;
  href: string;
  icon: JSX.Element;
}

function Sidebar() {
  const { t } = useTranslation();

  const links: Array<MenuItem> = [
    {
      key: 1,
      linkText: t("translation.sidebar.start"),
      href: "/",
      icon: <FontAwesomeIcon icon={faChevronRight} size={"1x"} />,
    },
    {
      key: 2,
      linkText: t("translation.sidebar.education"),
      href: "/education",
      icon: <FontAwesomeIcon icon={faChevronRight} size={"1x"} />,
    },
    {
      key: 3,
      linkText: t("translation.sidebar.projects"),
      href: "/projects",
      icon: <FontAwesomeIcon icon={faChevronRight} size={"1x"} />,
    },
    {
      key: 4,
      linkText: t("translation.sidebar.contact"),
      href: "/contact",
      icon: <FontAwesomeIcon icon={faChevronRight} size={"1x"} />,
    },
  ];

  return (
    <aside aria-label="Sidebar" className="h-screen sticky top-0">
      <ul className="w-32 m-3">
        {links
          .sort((c1, c2) => c1.key - c2.key)
          .map((l) => (
            <li key={l.key} className="transition ease-out hover:scale-110 m-3">
              <Link to={l.href}>
                <p className="text-left hover:font-bold text-transform: uppercase">
                  {l.icon} {l.linkText}
                </p>
              </Link>
            </li>
          ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
