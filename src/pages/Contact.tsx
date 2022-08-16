import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

interface Content {
  key: number;
  icon: JSX.Element;
  available: boolean;
  href: string;
}

const buildLineDiv = (children: JSX.Element) => {
  return <div className="m-1 p-2 border-2 hover:border-neutral-900">{children}</div>;
};

const buildAvailableLink = (href: string, children: JSX.Element) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {buildLineDiv(children)}
    </a>
  );
};

const buildLineContent = (c: Content) => {
  return <>{c.icon}</>;
};

function Contact() {
  const { t } = useTranslation();

  const contents: Array<Content> = [
    {
      key: 1,
      icon: <FontAwesomeIcon icon={faGithub} size="3x" />,
      available: true,
      href: "https://github.com/rcmilan",
    },
    {
      key: 2,
      icon: <FontAwesomeIcon icon={faLinkedin} size="3x" />,
      available: true,
      href: "https://www.linkedin.com/in/ricardo-silva-milan-044268b5/",
    },
    {
      key: 3,
      icon: <FontAwesomeIcon icon={faSpotify} size="3x" />,
      available: true,
      href: "https://open.spotify.com/user/22wpi4nobprbbzofphwudzuuq",
    },
  ];

  return (
    <>
      <h1>{t("translation.contact.header")}</h1>
      <div className="flex flex-col">
        {contents
          .sort((a, b) => a.key - b.key)
          .map((c) => {
            const childrenLineContent = buildLineContent(c);

            return (
              <div key={c.key}>
                {c.available
                  ? buildAvailableLink(c.href, childrenLineContent)
                  : buildLineDiv(childrenLineContent)}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Contact;
