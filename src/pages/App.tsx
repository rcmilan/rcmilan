import React from "react";
import FixedContent from "../components/fixedContent";

type Item = {
  id: number;
  content: string;
  uri: string;
};

const items = [
  {
    id: 1,
    content: "AAAAAAA!!!",
    uri: "#!",
  },
  {
    id: 2,
    content: "bbbbbbb!!!",
    uri: "#!",
  },
  {
    id: 3,
    content: "ccccccc!!!",
    uri: "#!",
  },
  {
    id: 4,
    content: "ddddddd!!!",
    uri: "#!",
  },
  {
    id: 5,
    content: "EeEeEeEe!!!",
    uri: "#!",
  }
];

function App() {
  const generateListHref = (item: Item) => {
    return (
      <li
        key={item.id}
        className="transition ease-in-out delay-10 bg-green-200 hover:translate-x-6 hover:scale-110 hover:bg-green-600 hover:text-white duration-100 "
      >
        <a href={item.uri}>
          <p className="text-right text-9xl font-thin">{item.content}</p>
        </a>
      </li>
    );
  };
  //blur-sm pointer-events-none

  return (
    <>
      <FixedContent />
      <div className="">
        <div className="flex ">
          <div className="flex-auto basis-3/4">
            <div>
              <ul className="list-none">
                {items.map((i) => generateListHref(i))}
              </ul>
            </div>
          </div>

          <div className="flex-auto basis-1/4 p-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              vehicula turpis eget erat pulvinar euismod. Vestibulum consectetur
              lacus quis erat facilisis, et sodales ex facilisis. Proin tempor
              turpis velit, vel faucibus eros faucibus et. Maecenas a semper
              quam, et finibus velit. Duis at turpis risus. Quisque varius
              volutpat ex, vitae aliquam magna maximus sed. Vestibulum ante
              ipsum primis in faucibus orci luctus et ultrices posuere cubilia
              curae; Vestibulum tempus diam sed arcu aliquet convallis. Aliquam
              metus sapien, sodales nec purus eget, venenatis laoreet magna. Sed
              mattis ac quam eu sodales. Curabitur pharetra tempus ultrices.
              Duis sit amet enim quis justo convallis venenatis. Proin tincidunt
              scelerisque accumsan.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              vehicula turpis eget erat pulvinar euismod. Vestibulum consectetur
              lacus quis erat facilisis, et sodales ex facilisis. Proin tempor
              turpis velit, vel faucibus eros faucibus et. Maecenas a semper
              quam, et finibus velit. Duis at turpis risus. Quisque varius
              volutpat ex, vitae aliquam magna maximus sed. Vestibulum ante
              ipsum primis in faucibus orci luctus et ultrices posuere cubilia
              curae; Vestibulum tempus diam sed arcu aliquet convallis. Aliquam
              metus sapien, sodales nec purus eget, venenatis laoreet magna. Sed
              mattis ac quam eu sodales. Curabitur pharetra tempus ultrices.
              Duis sit amet enim quis justo convallis venenatis. Proin tincidunt
              scelerisque accumsan.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
