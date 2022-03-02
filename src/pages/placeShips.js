import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getColumns, getPlayer1Name, getPlayer2Name, getPlayer2User,
} from 'store/gameConfiguration/gameConfigurationSlice';
import {
  getPlayer1Board, getPlayer1Ships, getPlayer1ShipsPositions,
  setPlayer1ShipsPositions, setPlayer1Board,
} from 'store/boardConfiguration/player1BoardSlice';
import {
  getPlayer2Board, getPlayer2Ships, getPlayer2ShipsPositions,
  setPlayer2ShipsPositions, setPlayer2Board,
} from 'store/boardConfiguration/player2BoardSlice';

export default function PlaceShips() {
  const [currentUser, setCurrentUser] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const player1Name = useSelector(getPlayer1Name);
  const player1Board = useSelector(getPlayer1Board);
  const player1Ships = useSelector(getPlayer1Ships);
  const player1ShipsPositions = useSelector(getPlayer1ShipsPositions);

  const player2Name = useSelector(getPlayer2Name);
  const player2User = useSelector(getPlayer2User);
  const player2Board = useSelector(getPlayer2Board);
  const player2Ships = useSelector(getPlayer2Ships);
  const player2ShipsPositions = useSelector(getPlayer2ShipsPositions);

  const columns = useSelector(getColumns);

  // Redirect user to Create Game page if this page is reloaded
  useEffect(() => {
    if (player1Board.length === 0) {
      navigate('/create-game');
    }
  });

  function getUsersHeader(activeUser, player2UserMode) {
    return (
      <div className="place-ships-user-header">
        <h1>
          {activeUser === 1 ? player1Name : player2Name }
          {' '}
          place your boats
        </h1>
        { player2UserMode === 'User' && (
        <h2>
          {activeUser === 1 ? player2Name : player1Name }
          {' '}
          please dont look
        </h2>
        )}
      </div>
    );
  }

  function handleStartGame() {
    // Map players ships and dispatch ship positions to state
    const tempPlayer1ShipsPositions = JSON.parse(JSON.stringify(player1ShipsPositions));
    const tempPlayer2ShipsPositions = JSON.parse(JSON.stringify(player2ShipsPositions));
    player1Ships.map((ship) => (
      tempPlayer1ShipsPositions.push(...ship.position)
    ));
    player2Ships.map((ship) => (
      tempPlayer2ShipsPositions.push(...ship.position)
    ));
    dispatch(setPlayer1ShipsPositions(tempPlayer1ShipsPositions));
    dispatch(setPlayer2ShipsPositions(tempPlayer2ShipsPositions));
    // Update players board cells indicating which cells has ships
    const tempPlayer1Board = JSON.parse(JSON.stringify(player1Board));
    tempPlayer1ShipsPositions.forEach((id) => {
      tempPlayer1Board[id].hasShip = true;
    });
    dispatch(setPlayer1Board(tempPlayer1Board));
    const tempPlayer2Board = JSON.parse(JSON.stringify(player2Board));
    tempPlayer2ShipsPositions.forEach((id) => {
      tempPlayer2Board[id].hasShip = true;
    });
    dispatch(setPlayer2Board(tempPlayer2Board));
    // Redirect user to game
    navigate('/game');
  }

  const goToGameButton = <button type="button" onClick={() => handleStartGame()}>Go to game</button>;

  return (
    <div className="place-ships-wrapper">
      { getUsersHeader(currentUser, player2User) }
      <div className="place-ships-board-wrapper">
        <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {(currentUser === 1)
            ? player1Board.map((cell, index) => {
              const key = `PLAYER_1_BOARD_CELL_${index}`;
              return (
                <div className="board-cell" key={key}>
                  <div>{cell.hasShip ? 'X' : ''}</div>
                </div>
              );
            })
            : player2Board.map((cell, index) => {
              const key = `PLAYER_2_BOARD_CELL_${index}`;
              return (
                <div className="board-cell" key={key}>
                  <div>{cell.id}</div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="ship-selection-wrapper">
        { (currentUser === 1 && player2User === 'User')
          ? <button type="button" onClick={() => setCurrentUser(2)}>Place Player 2 boats</button>
          : goToGameButton }
      </div>
    </div>
  );
}
