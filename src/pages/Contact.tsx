import React from "react";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("translation.contact.header")}</h1>

      <div className="flex">
        <div className="flex-1">Link 1</div>
        <div className="flex-1">Link 1</div>
      </div>
    </>
  );
}

export default Contact;
