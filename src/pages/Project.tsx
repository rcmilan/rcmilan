import React, { useState, useEffect } from "react";
import axios from "axios";
import Markdown from "../components/markdown";

function Project() {
  const [cont, setCont] = useState<string>("# loading");

  useEffect(() => {
    let fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/rcmilan/rcmilan/trunk/README.md"
        );

        setCont(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return <Markdown content={cont} />;
}

export default Project;
