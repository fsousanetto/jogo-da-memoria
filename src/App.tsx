import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';

import { Button } from './components/button';
import { InfoItem } from './components/infoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { Items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';


const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() => {
    if (shownCount == 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if (opened.length === 2) {

        // Verify 1 - if both are equal, make every "shown" permanent
        if (opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[1].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        }
      }
    }
  }, [shownCount, gridItems])

  const resetAndCreateGrid = () => {
    // Step 1 reset game
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);
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
    if (playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];

      if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href=''>
          <img src={logoImage} width='200' alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
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