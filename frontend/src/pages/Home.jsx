import React, { useState } from "react";
import Envelope from "../components/Envelope";
import Invitation from "../components/Invitation";
import MusicToggle from "../components/MusicToggle";

const Home = () => {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
  };

  return (
    <div className="min-h-screen w-full paper-bg overflow-x-hidden">
      {!opened ? <Envelope onOpen={handleOpen} /> : <Invitation />}
      {opened && <MusicToggle />}
    </div>
  );
};

export default Home;
