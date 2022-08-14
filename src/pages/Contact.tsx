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
}

function Contact() {
  const { t } = useTranslation();

  const contents: Array<Content> = [
    {
      key: 1,
      icon: <FontAwesomeIcon icon={faGithub} size="3x" />,
      available: true,
    },
    {
      key: 2,
      icon: <FontAwesomeIcon icon={faLinkedin} size="3x" />,
      available: true,
    },
    {
      key: 3,
      icon: <FontAwesomeIcon icon={faSpotify} size="3x" />,
      available: true,
    },
  ];

  return (
    <>
      <h1>{t("translation.contact.header")}</h1>
      {contents.map((c) => (
        <div key={c.key} className="flex m-5">
          <div className="transition ease-out hover:scale-110">{c.icon}</div>
        </div>
      ))}
    </>
  );
}

export default Contact;
