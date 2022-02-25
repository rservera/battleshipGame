import { useSelector, useDispatch } from 'react-redux';
import {
  getPlayer1Name, getPlayer2Name, getPlayer2User,
  setPlayer1Name, setPlayer2Name, setPlayer2User,
} from 'store/gameConfiguration/gameConfigurationSlice';
import Input from 'components/shared/Input';

export default function SetPlayers() {
  const dispatch = useDispatch();
  const player1Name = useSelector(getPlayer1Name);
  const player2Name = useSelector(getPlayer2Name);
  const player2User = useSelector(getPlayer2User);

  function handleSelectCPUAsPlayer2() {
    if (player2User !== 'CPU') {
      dispatch(setPlayer2User('CPU'));
    }
    if (player2Name !== 'CPU') {
      dispatch(setPlayer2Name('CPU'));
    }
  }

  function handleSelectUserAsPlayer2() {
    if (player2User !== 'User') {
      dispatch(setPlayer2User('User'));
    }
    dispatch(setPlayer2Name('Player 2'));
  }

  return (
    <div className="set-players-wrapper">
      <Input
        label="Player 1 Name"
        value={player1Name}
        placeholder="Player 1 as default"
        onChange={(e) => dispatch(setPlayer1Name(e.target.value))}
      />
      <div>Player 2</div>
      <button type="button" onClick={() => handleSelectUserAsPlayer2()}>Player 2</button>
      <button type="button" onClick={() => handleSelectCPUAsPlayer2()}>CPU</button>
      { player2User === 'User' && (
        <Input
          label="Player 2 Name"
          value={player2Name}
          placeholder="Player 2 as default"
          onChange={(e) => dispatch(setPlayer2Name(e.target.value))}
        />
      )}
    </div>
  );
}
