import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MenuItem {
  key: number;
  text: string;
  href: string;
}

function Sidebar() {
  const { t } = useTranslation();

  const links: Array<MenuItem> = [
    {
      key: 1,
      text: "> " + t("translation.sidebar.start"),
      href: "/",
    },
    {
      key: 2,
      text: "> " + t("translation.sidebar.projects"),
      href: "/projects",
    },
    {
      key: 3,
      text: "> " + t("translation.sidebar.contact"),
      href: "/contact",
    },
  ];

  return (
    <aside aria-label="Sidebar" className="h-screen sticky top-0">
      <ul className="w-32 m-3">
        {links.map((l) => (
          <li key={l.key} className="transition ease-out hover:scale-110 m-3">
            <Link to={l.href}>
              <p className="text-left hover:font-bold text-transform: uppercase">
                {l.text}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
