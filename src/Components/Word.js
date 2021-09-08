import React, { useState, useEffect } from "react";

function Word(props) {
  // Color of typed/not typed words
  const [color, setColor] = useState("");
  // Mistyped words will have a 'line-through' decoration when game ends
  const [decoration, setDecoration] = useState("null");

  useEffect(() => {
    // Typed words are grey
    if (props.typed) {
      setColor("grey");
    } else {
      setColor("");
    }
    if (props.typo && !props.playing) {
      // Put a line-through if there's a typo when game ends
      setDecoration("line-through");
    } else {
      // No line-through if no typo
      setDecoration(null);
    }
  }, [props]);

  // Wotd style
  let style = {
    color: "#2df126",
    backgroundColor: color,
    textDecoration: decoration,
    textDecorationThickness: "from-font",
  };

  return (
    <span style={style}>
      {props.word} {props.id !== 0 && props.id % 14 === 0 ? <br /> : null}
    </span>
  );
}

export default Word;
