import { useState } from 'react';
import { Link } from 'react-router-dom';
import SetPlayers from 'components/SetPlayers';
import SetBoardSize from 'components/SetBoardSize';

export default function CreateGame() {
  const [allowSinkShipFeedback, setAllowSinkShipFeedback] = useState(true);
  return (
    <>
      <h1>CreateGame</h1>
      <SetPlayers />
      <SetBoardSize />
      <div className="allow-sink-ship-feedback-wrapper">
        <label htmlFor="sink-feedback-option">
          <input
            type="checkbox"
            checked={allowSinkShipFeedback}
            onChange={() => setAllowSinkShipFeedback(!allowSinkShipFeedback)}
            id="sink-feedback-option"
          />
          Let me know when a ship has been sunk
        </label>
      </div>
      <div>
        send feedback:
        {' '}
        {allowSinkShipFeedback ? 'true' : 'false'}
      </div>
      <div><button type="submit">Create new game</button></div>
      <Link to="/game">
        <button type="button">Go to game</button>
      </Link>
      <Link to="/game-result">
        <button type="button">Go to result</button>
      </Link>
      <Link to="/place-ships">
        <button type="button">Go to place ships</button>
      </Link>
    </>
  );
}
