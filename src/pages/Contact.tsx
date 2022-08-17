import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import Header1 from "../components/header1";

interface Content {
  key: number;
  icon: JSX.Element;
  available: boolean;
  contactURL: URL;
  description: string;
}

const buildLine = (children: JSX.Element) => {
  return (
    <div className="m-1 p-2 border-2 border-neutral-300 hover:border-neutral-900">
      {children}
    </div>
  );
};

const buildAvailableLink = (href: string, children: JSX.Element) => (
  <a href={href} target="_blank" rel="noreferrer">
    {buildLine(children)}
  </a>
);

const buildContent = (c: Content) => {
  return (
    <>
      <span className="inline-block align-middle">{c.icon}</span>
      <span className="inline-block align-middle uppercase text-right text-2xl ml-5">
        {c.description}
      </span>
    </>
  );
};

const iconSize = "3x";
const contents: Array<Content> = [
  {
    key: 1,
    icon: <FontAwesomeIcon icon={faGithub} size={iconSize} />,
    available: true,
    contactURL: new URL("https://github.com/rcmilan"),
    description: "Github",
  },
  {
    key: 2,
    icon: <FontAwesomeIcon icon={faLinkedin} size={iconSize} />,
    available: true,
    contactURL: new URL(
      "https://www.linkedin.com/in/ricardo-silva-milan-044268b5/"
    ),
    description: "LinkedIn",
  },
  {
    key: 3,
    icon: <FontAwesomeIcon icon={faSpotify} size={iconSize} />,
    available: true,
    contactURL: new URL(
      "https://open.spotify.com/user/22wpi4nobprbbzofphwudzuuq"
    ),
    description: "Spotify",
  },
];

function Contact() {
  const { t } = useTranslation();

  return (
    <>
      <Header1>{t("translation.contact.header")}</Header1>
      <div className="flex flex-col">
        {contents
          .sort((c1, c2) => c1.key - c2.key)
          .map((c) => {
            const childrenLineContent = buildContent(c);

            return (
              <div key={c.key}>
                {c.available
                  ? buildAvailableLink(c.contactURL.href, childrenLineContent)
                  : buildLine(childrenLineContent)}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Contact;
