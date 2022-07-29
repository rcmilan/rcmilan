import React from "react";

const FixedContent = () => {
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
      </>
    );
  };

  export default FixedContent;