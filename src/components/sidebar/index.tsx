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
    <aside aria-label="Sidebar" className="h-screen sticky top-0">
      <ul className="w-32 m-3">
        {links.map((l) => (
          <li key={l.key} className="transition ease-out hover:scale-110 m-3">
            <a href={l.href}>
              <p className="text-left hover:font-bold text-transform: uppercase">
                {l.text}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
