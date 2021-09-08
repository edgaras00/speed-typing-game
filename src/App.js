import React, { useState, useEffect, useRef } from "react";
import Word from "./Components/Word";
import texts from "./texts";

function App() {
  // Set game time to 60 seconds
  const GAME_TIME = 60;
  const inputRef = useRef(null);
  const referenceRef = useRef(null);

  // App states

  // Reference text that is rendered on the player's screen
  const [referenceText, setReferenceText] = useState("");
  // displayText is the text being displayed as the "typing" animation
  // function is running. Text on the screen is later changed by the
  // referenceText
  const [displayText, setDisplayText] = useState("");
  // User's input text that is in the text input element
  const [inputText, setInputText] = useState("");
  // State that tracks if the game is started
  const [isPlaying, setIsPlaying] = useState(false);
  // Stores the number of total typed words in the game
  const [numberOfWords, setNumberOfWords] = useState(0);
  // Time remaining in the game (constant for now)
  const [timeRemaining, setTimeRemaining] = useState(GAME_TIME);
  // State that tracks user's "space" button clicks
  // It is used to highlight typed words in the reference text
  const [spaceCount, setSpaceCount] = useState(0);
  // Typed word index array. Each typed word index is added/removed
  const [typedIndex, setTypedIndex] = useState([]);
  // Count the number of mistyped words
  const [mistypedWordCount, setMistypedWordCount] = useState(0);
  // Track indexes of user's typos
  const [typoIndexes, setTypoIndexes] = useState([]);

  const [titleText, setTitleText] = useState("");
  const [startText, setStartText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [wordNumberText, setWordNumberText] = useState("");
  const [mistypedText, setMistypedText] = useState("");
  const [robcoText, setRobcoText] = useState("");
  const [loading, setLoading] = useState(false);

  function countWords() {
    // Function that counts the number of words typed by the end of the game

    // Split the input text string into an array of words
    // const wordArray = inputText.trim().split(" ");
    // Take out any empty strings
    // const filteredWordArray = wordArray.filter((word) => word !== "");
    // Set the numberOfWords state as the length of the wordArray
    // setNumberOfWords(filteredWordArray.length);

    setNumberOfWords(typedIndex.length);
  }

  function countTypos() {
    // Function that counts typos in the player's input

    // Split the reference string into an array of words
    const refArray = referenceText.split(" ");
    // Split the user's input string into an array of words
    const inputArray = inputText.trim().split(" ");

    // Count the number of typos and capture their indexes
    let typos = 0;
    const typoIdx = [];
    for (let i = 0; i < inputArray.length; i++) {
      if (refArray[i] !== inputArray[i]) {
        typos++;
        typoIdx.push(i);
      }
    }
    // Number of typos and their indexes
    setMistypedWordCount(typos);
    setTypoIndexes(typoIdx);
  }

  // Function that picks a random item from an array
  function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function typeRefText(string) {
    // Function that displays the typing animation on the screen
    // and then sets the referenceText state which is used in the real game
    setLoading(true);
    // Display the typing animation
    // Just for show. Real reference text is stored in referenceText state
    for (let i = 0; i < string.length; i++) {
      setTimeout(() => {
        setDisplayText((text) => (text += string[i]));
      }, i * 5);
    }
    // Set the text string as the reference text that will is used in the game
    setTimeout(() => {
      setLoading(false);
      setDisplayText("");
      setReferenceText(string);
      //  Enable the text input element to allow the player to start typing
      inputRef.current.disabled = false;
      //  Focus on the input text input as soon as the game starts
      inputRef.current.focus();
    }, string.length * 5);
  }

  function startGame() {
    // Function that starts the game
    setIsPlaying(true);
    setTypedIndex([]);
    setTypoIndexes([]);
    setSpaceCount(0);
    setTimeRemaining(GAME_TIME);
    setNumberOfWords(0);
    setMistypedWordCount(0);
    // setReferenceText(pickRandom(texts));
    typeRefText(pickRandom(texts));
    setInputText("");
    // inputRef.current.disabled = false;
    // inputRef.current.focus();
  }

  function endGame() {
    // Function that runs once the game ends
    setIsPlaying(false);
    countWords();
    countTypos();
  }

  function handleChange(event) {
    // Function to handle text input's change event
    // Store input text as inputTextState
    const { value } = event.target;
    setInputText(value);
  }

  function handleKeyPress(event) {
    // Function that tracks keyboard key press events

    // Tracks the (space) count which is used for user typed word
    // highlighting
    if (event.which === 32) {
      // Don't let more than one (space) to be clicked
      if (event.target.value[event.target.value.length - 1] === " ") {
        event.preventDefault();
        return false;
      } else {
        // Increase (space) count
        setSpaceCount((prevCount) => prevCount + 1);
        // Track the typed word index
        setTypedIndex((prevData) => [...prevData, spaceCount]);
      }
      // If the clicked button is "backspace" / "delete"
      // Check if a word gets deleted
      // Decrease (space) count and modify the typed word index array
    } else if (event.which === 8) {
      if (
        spaceCount > 0 &&
        event.target.value[event.target.value.length - 1] === " "
      ) {
        setSpaceCount((prevCount) => prevCount - 1);
        const modifiedIndices = typedIndex.slice(0, typedIndex.length - 1);
        setTypedIndex(modifiedIndices);
      }
    }
  }

  function scroll() {
    // Function that scrolls down the reference text as the user is typing
    referenceRef.current.scrollBy(0, 10);
  }

  function typeText([word, index]) {
    // Function that runs the loading animation
    // where the title menu texts are typed on the screen
    return new Promise((resolve, reject) => {
      for (let i = 0; i < word.length; i++) {
        // Delay between each item/promise
        setTimeout(() => {
          switch (index) {
            case 0:
              setTitleText((text) => (text += word[i]));
              break;
            case 1:
              setStartText((text) => (text += word[i]));
              break;
            case 2:
              setTimeText((text) => (text += word[i]));
              break;
            case 3:
              setWordNumberText((text) => (text += word[i]));
              break;
            case 4:
              setMistypedText((text) => (text += word[i]));
              break;
            case 5:
              setRobcoText((text) => (text += word[i]));
              break;
            default:
              break;
          }
        }, i * 40);

        setTimeout(() => {
          resolve("Success");
        }, word.length * 40);
      }
    });
  }

  const mapSeries = async (iterable, action) => {
    // Function that executes promises in an array sequentially
    for (const x of iterable) {
      await action(x);
    }
  };

  useEffect(() => {
    // Type out the loading text (title and menu) on first render

    // The text that is being typed/presented on the screen as the game loads
    const loadingText = [
      ["HOW FAST CAN YOU TYPE?", 0],
      ['CLICK "START GAME" TO START', 1],
      ["TIME REMAINING:", 2],
      ["NUMBER OF WORDS:", 3],
      ["MISTYPED WORDS:", 4],
      ["ROBCO INDUSTRIES", 5],
    ];
    mapSeries(loadingText, typeText);
  }, []);

  useEffect(() => {
    // Start the counter
    setTimeout(() => {
      if (timeRemaining > 0 && isPlaying && !loading) {
        setTimeRemaining((prevTime) => prevTime - 1);
      }
    }, 1000);

    // If time runs out or the game is ended by the player
    // the game ends
    if (timeRemaining === 0 || !isPlaying) {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isPlaying, loading]);

  useEffect(() => {
    // Scroll the reference text as the player is typing
    // Every 20 words
    if ((typedIndex.length + 1) % 20 === 0) {
      scroll();
    }
  }, [typedIndex]);

  useEffect(() => {
    // End the game once the user types out all the text
    if (typedIndex.length >= referenceText.split(" ").length) {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedIndex]);

  // Create the components for each word in the reference text
  const textComponents = referenceText.split(" ").map((word, index) => {
    // Check if the word is typed or mistyped
    // Typed words will be highlighted
    const typed = typedIndex.includes(index) ? true : false;
    // Mistyped words will have a strikethrough at the end of the game
    const isMistyped = typoIndexes.includes(index) ? true : false;
    return (
      <Word
        word={word}
        key={index + word}
        id={index}
        typed={typed}
        typo={isMistyped}
        playing={isPlaying}
      />
    );
  });

  let referenceDisplay;
  if (displayText) {
    referenceDisplay = <p>{displayText}</p>;
  } else if (referenceText) {
    referenceDisplay = <p>{textComponents}</p>;
  } else {
    referenceDisplay = <h2>{startText}</h2>;
  }

  return (
    <div className="container">
      <h1>{titleText}</h1>
      <div
        className="ref-text"
        ref={referenceRef}
        style={{
          border:
            titleText === "HOW FAST CAN YOU TYPE?"
              ? "3px dashed #2df126"
              : null,
        }}
      >
        {referenceDisplay}
      </div>
      <div
        className="text"
        style={{
          border:
            startText === 'CLICK "START GAME" TO START'
              ? "3px dashed #2df126"
              : null,
        }}
      >
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          disabled={!isPlaying}
        />
      </div>
      <h4>
        {timeText} {timeText === "TIME REMAINING:" ? timeRemaining : null}
      </h4>

      {robcoText === "ROBCO INDUSTRIES" ? (
        !isPlaying ? (
          <button onClick={startGame}>Start Game!</button>
        ) : (
          <button onClick={endGame}>End Game</button>
        )
      ) : null}
      <br />
      <div className="results">
        <span>
          {wordNumberText}{" "}
          {wordNumberText === "NUMBER OF WORDS:" ? numberOfWords : null}
        </span>
        <span>
          {mistypedText}{" "}
          {mistypedText === "MISTYPED WORDS:" ? mistypedWordCount : null}
        </span>
      </div>
      <div className="robco">
        <span>{robcoText}</span>
      </div>
    </div>
  );
}

export default App;
