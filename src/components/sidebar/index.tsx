import React from "react";

type SidebarItem = {
  label: string;
  link: string;
};

function Sidebar() {
  const sidebarItems = [
    {
      label: "Sidenav link 1",
      link: "#!",
    },
    {
      label: "Sidenav link 2",
      link: "#!",
    },
    {
      label: "Sidenav link 3",
      link: "#!",
    },
    {
      label: "Sidenav link 4",
      link: "#!",
    },
    {
      label: "Sidenav link 5",
      link: "#!",
    },
  ];

  const generateSidebarItem = (item: SidebarItem) => {
    return (
      <li className="relative">
        <a
          className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
          href={item.link}
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
        >
          {item.label}
        </a>
      </li>
    );
  };

  return (
    <div className="w-60 h-full shadow-md px-1 absolute">
      <ul className="relative">
        {sidebarItems.map((i) => generateSidebarItem(i))}
      </ul>
    </div>
  );
}

export default Sidebar;
