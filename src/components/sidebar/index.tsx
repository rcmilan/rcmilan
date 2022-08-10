import React from "react";

interface MenuItem {
  key: number;
  text: string;
  href: string;
}

const links: Array<MenuItem> = [
  {
    key: 1,
    text: "> Start",
    href: "#",
  },
  {
    key: 2,
    text: "> Projetos",
    href: "#",
  },
  {
    key: 3,
    text: "> Contato",
    href: "#",
  },
];

function Sidebar() {
  return (
    <aside aria-label="Sidebar" className="h-screen sticky top-0 w-32 p-2">
      <ul>
        {links.map((l) => (
          <li key={l.key}>
            <a href={l.href}>
              <p className="hover:font-bold">{l.text}</p>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
