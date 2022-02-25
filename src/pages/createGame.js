import { Link } from 'react-router-dom';
import SetPlayers from 'components/CreateGame/components/SetPlayers';
import SetBoardSize from 'components/CreateGame/components/SetBoardSize';
import { useSelector, useDispatch } from 'react-redux';
import { getShipSunkFeedback, setShipSunkFeedback } from 'store/gameConfiguration/gameConfigurationSlice';

export default function CreateGame() {
  const dispatch = useDispatch();
  const shipSunkFeedback = useSelector(getShipSunkFeedback);
  return (
    <>
      <h1>CreateGame</h1>
      <SetPlayers />
      <SetBoardSize />
      <div className="allow-sink-ship-feedback-wrapper">
        <label htmlFor="sink-feedback-option">
          <input
            type="checkbox"
            checked={shipSunkFeedback}
            onChange={() => dispatch(setShipSunkFeedback(!shipSunkFeedback))}
            id="sink-feedback-option"
          />
          Let me know when a ship has been sunk
        </label>
      </div>
      <div>
        send feedback:
        {' '}
        {shipSunkFeedback ? 'true' : 'false'}
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
