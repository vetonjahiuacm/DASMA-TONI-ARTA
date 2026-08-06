import React, { useState } from "react";
import Envelope from "../components/Envelope";
import Invitation from "../components/Invitation";

const Home = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="min-h-screen w-full paper-bg overflow-x-hidden">
      {!opened ? (
        <Envelope onOpen={() => setOpened(true)} />
      ) : (
        <Invitation />
      )}
    </div>
  );
};

export default Home;
