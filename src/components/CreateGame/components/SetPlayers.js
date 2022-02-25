import { useState } from 'react';
import Input from 'components/shared/Input';

export default function SetPlayers() {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2User, setPlayer2User] = useState('CPU');
  const [player2Name, setPlayer2Name] = useState('CPU');

  function handleSelectCPUAsPlayer2() {
    if (player2User !== 'CPU') {
      setPlayer2User('CPU');
    }
    if (player2Name !== 'CPU') {
      setPlayer2Name('CPU');
    }
  }

  function handleSelectUserAsPlayer2() {
    if (player2User !== 'User') {
      setPlayer2User('User');
    }
    setPlayer2Name('Player 2');
  }

  return (
    <div className="set-players-wrapper">
      <Input
        label="Player 1 Name"
        value={player1Name}
        placeholder="Player 1 as default"
        onChange={(e) => setPlayer1Name(e.target.value)}
      />
      <div>Player 2</div>
      <button type="button" onClick={() => handleSelectUserAsPlayer2()}>Player 2</button>
      <button type="button" onClick={() => handleSelectCPUAsPlayer2()}>CPU</button>
      { player2User === 'User' && (
        <Input
          label="Player 2 Name"
          value={player2Name}
          placeholder="Player 2 as default"
          onChange={(e) => setPlayer2Name(e.target.value)}
        />
      )}
      <div>{player1Name}</div>
      <div>{player2Name}</div>
    </div>
  );
}
