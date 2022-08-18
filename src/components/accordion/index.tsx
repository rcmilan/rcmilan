import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export interface AccordionProps {
  title: JSX.Element;
  content: JSX.Element;
}

const Accordion = ({ title, content }: AccordionProps) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const [rotate, setRotate] = useState("transform duration-700 ease");

  const contentSpace = useRef<HTMLDivElement>(null);

  function toggle() {
    setActive((prevState) => !prevState);

    setHeight(active ? "0px" : `${contentSpace.current?.scrollHeight}px`);
    setRotate(
      active
        ? "transform duration-700 ease"
        : "transform duration-700 ease rotate-180"
    );
  }

  return (
    <div className="flex flex-col">
      <button
        className="py-3 box-border appearance-none cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={toggle}
      >
        <p className="inline-block text-footnote light">{title}</p>
        <FontAwesomeIcon
          className={`${rotate} inline-block`}
          icon={faChevronDown}
          size={"1x"}
        />
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className="overflow-hidden transition-max-height duration-700 ease-in-out"
      >
        <div className="m-1 pb-5">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
