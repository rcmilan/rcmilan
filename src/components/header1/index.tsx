import React from "react";

interface Props {
  children: JSX.Element;
}

function Header1({ children }: Props) {
  return <h1 className=" uppercase font-extrabold text-2xl">{children}</h1>;
}

export default Header1;
