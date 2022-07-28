import React from "react";

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
];

function App() {
  const generateLi = (item: Item) => {
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

  return (
    <>
      <div className="fixed top-0 left-0 p-4 z-10">
        <p>Absolute Element 1</p>
        <p>Absolute Element 2</p>
        <p>Absolute Element 3</p>
      </div>
      <div className="fixed bottom-0 right-0 p-4 z-10">
        <p>Absolute Element 4</p>
        <p>Absolute Element 5</p>
        <p>Absolute Element 6</p>
      </div>
      <div className="flex">
        <div className="flex-auto basis-3/4">
          <div>
            <ul className="list-none">{items.map((i) => generateLi(i))}</ul>
          </div>
        </div>

        <div className="flex-auto basis-1/4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            vehicula turpis eget erat pulvinar euismod. Vestibulum consectetur
            lacus quis erat facilisis, et sodales ex facilisis. Proin tempor
            turpis velit, vel faucibus eros faucibus et. Maecenas a semper quam,
            et finibus velit. Duis at turpis risus. Quisque varius volutpat ex,
            vitae aliquam magna maximus sed. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum
            tempus diam sed arcu aliquet convallis. Aliquam metus sapien,
            sodales nec purus eget, venenatis laoreet magna. Sed mattis ac quam
            eu sodales. Curabitur pharetra tempus ultrices. Duis sit amet enim
            quis justo convallis venenatis. Proin tincidunt scelerisque
            accumsan.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            vehicula turpis eget erat pulvinar euismod. Vestibulum consectetur
            lacus quis erat facilisis, et sodales ex facilisis. Proin tempor
            turpis velit, vel faucibus eros faucibus et. Maecenas a semper quam,
            et finibus velit. Duis at turpis risus. Quisque varius volutpat ex,
            vitae aliquam magna maximus sed. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum
            tempus diam sed arcu aliquet convallis. Aliquam metus sapien,
            sodales nec purus eget, venenatis laoreet magna. Sed mattis ac quam
            eu sodales. Curabitur pharetra tempus ultrices. Duis sit amet enim
            quis justo convallis venenatis. Proin tincidunt scelerisque
            accumsan.
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
