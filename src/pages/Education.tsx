import React from "react";
import { useTranslation } from "react-i18next";
import Accordion, { AccordionProps } from "../components/accordion";
import Header1 from "../components/header1";

function Education() {
  const { t } = useTranslation();

  const contents: Array<AccordionProps> = [
    {
      title: <>title</>,
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          varius sem vel libero iaculis, eget euismod erat laoreet. Morbi nec
          volutpat sem, eget euismod nisl. Phasellus nec faucibus magna. Sed
          gravida et augue ac molestie. Maecenas turpis tellus, commodo id
          lacinia id, consectetur vitae sapien. Curabitur euismod placerat
          auctor. Phasellus at dui nec lectus imperdiet lacinia. Morbi convallis
          neque ut sodales egestas. Morbi augue arcu, tempor a dictum mattis,
          finibus a lacus. Sed id libero aliquam urna tincidunt placerat.
        </p>
      ),
    },
    {
      title: <>title</>,
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          varius sem vel libero iaculis, eget euismod erat laoreet. Morbi nec
          volutpat sem, eget euismod nisl. Phasellus nec faucibus magna. Sed
          gravida et augue ac molestie. Maecenas turpis tellus, commodo id
          lacinia id, consectetur vitae sapien. Curabitur euismod placerat
          auctor. Phasellus at dui nec lectus imperdiet lacinia. Morbi convallis
          neque ut sodales egestas. Morbi augue arcu, tempor a dictum mattis,
          finibus a lacus. Sed id libero aliquam urna tincidunt placerat.
        </p>
      ),
    },
    {
      title: <>title</>,
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          varius sem vel libero iaculis, eget euismod erat laoreet. Morbi nec
          volutpat sem, eget euismod nisl. Phasellus nec faucibus magna. Sed
          gravida et augue ac molestie. Maecenas turpis tellus, commodo id
          lacinia id, consectetur vitae sapien. Curabitur euismod placerat
          auctor. Phasellus at dui nec lectus imperdiet lacinia. Morbi convallis
          neque ut sodales egestas. Morbi augue arcu, tempor a dictum mattis,
          finibus a lacus. Sed id libero aliquam urna tincidunt placerat.
        </p>
      ),
    },
  ];

  return (
    <>
      <Header1>{t("translation.education.header")}</Header1>
      {contents.map((c, i) => (
        <div key={i} className="m-1">{Accordion(c)}</div>
      ))}
    </>
  );
}

export default Education;
