import { useState } from 'react';
import Input from './Input';

export default function setPlayers(/* props */) {
  /* const {} = props;
  const { player1Name, setPlayer1Name } = useState('Player 1'); */
  const { player2User, setPlayer2User } = useState('CPU');
  // const { player2Name, setPlayer2Name } = useState('CPU');

  return (
    <div className="set-players-wrapper">
      <Input
        label="Player 1 Name"
      />
      <div>Player 2</div>
      <button type="button" onClick={() => setPlayer2User('User')}>Player 2</button>
      <button type="button" onClick={() => setPlayer2User('CPU')}>CPU</button>
      { player2User === 'User' && (
      <Input
        label="Player 2 Name"
      />
      )}
    </div>
  );
}
