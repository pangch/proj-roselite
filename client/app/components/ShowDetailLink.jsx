import * as React from "react";
import { useState } from "react";

function DetailView({ isShown, setIsShown, details }) {
  if (!isShown) {
    return null;
  }
  return (
    <div className="details-container">
      <div className="details-content flex flex-col">
        <header>
          <i
            className="fa fa-window-close close-button"
            onClick={() => setIsShown(false)}
          ></i>
        </header>
        <div className="details-content-body overflow-scroll">{details}</div>
      </div>
    </div>
  );
}

export default function ShowDetailLink({ label, details }) {
  const [isShown, setIsShown] = useState(false);
  const handleOnClick = () => {
    setIsShown(true);
  };
  return (
    <>
      <div className="details-link" onClick={handleOnClick}>
        {label}
      </div>
      <DetailView isShown={isShown} setIsShown={setIsShown} details={details} />
    </>
  );
}
