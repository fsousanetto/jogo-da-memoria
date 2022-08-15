import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/button';
import { InfoItem } from './components/infoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { Items } from './data/items';


const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  const resetAndCreateGrid = () => {
    // Step 1 reset game
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);
    setGridItems([]);

    // Step 2 - Create grid
    // Step 2.1 - Create grid empty
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (Items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    };
    // Step 2.2 - Fill the grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < Items.length; i++) {
        let position = -1;
        while (position < 0 || tmpGrid[position].item !== null) {
          position = Math.floor(Math.random() * (Items.length * 2));
        }
        tmpGrid[position].item = i;
      }
    }

    // Step 2.3 - add to state
    setGridItems(tmpGrid)

    // Step 3 - Start game
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {

  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href=''>
          <img src={logoImage} width='200' alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value='00:00' />
          <InfoItem label='Movimentos' value='0' />
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;