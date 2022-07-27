import React from "react";

type Item = {
  content: string;
  uri: string;
};

function App() {
  const items = [
    {
      content: "opt: a!!!",
      uri: "#!",
    },
    {
      content: "opt: b!!!",
      uri: "#!",
    },
    {
      content: "opt: c!!!",
      uri: "#!",
    },
    {
      content: "opt: d!!!",
      uri: "#!",
    },
  ];

  const generateLi = (item: Item) => {
    return (
      <li className="transition ease-in-out delay-10 bg-green-200 hover:translate-x-6 hover:scale-110 hover:bg-green-600 hover:text-white duration-100 ">
        <a href={item.uri}>
          <p className="text-right text-9xl font-thin">{item.content}</p>
        </a>
      </li>
    );
  };

  return (
    <div className="">
      <div className="flex">
        <div className="flex-initial w-full">
          <div>
            <ul className="list-none">{items.map((i) => generateLi(i))}</ul>
          </div>
        </div>

        <div className="flex-initial w-64">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          vehicula turpis eget erat pulvinar euismod. Vestibulum consectetur
          lacus quis erat facilisis, et sodales ex facilisis. Proin tempor
          turpis velit, vel faucibus eros faucibus et. Maecenas a semper quam,
          et finibus velit. Duis at turpis risus. Quisque varius volutpat ex,
          vitae aliquam magna maximus sed. Vestibulum ante ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum
          tempus diam sed arcu aliquet convallis. Aliquam metus sapien, sodales
          nec purus eget, venenatis laoreet magna. Sed mattis ac quam eu
          sodales. Curabitur pharetra tempus ultrices. Duis sit amet enim quis
          justo convallis venenatis. Proin tincidunt scelerisque accumsan.
        </div>
      </div>
    </div>
  );
}

export default App;
