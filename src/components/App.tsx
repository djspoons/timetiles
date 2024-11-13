import React from 'react';

import { DndContext } from '@dnd-kit/core';
import dnd from '@dnd-kit/core';

import { removeTile, addTile } from '../reducer';
import { useAppDispatch as useDispatch,
  useAppSelector as useSelector} from '../hooks';
import { collisionDetection } from './utilities';
import { SUPPLY_ID, TRASH_ID } from '../constants';

import './App.css';
import Supply from './Supply';
import Generator from './Generator';
import Day from './Day';
import { TileSpec } from './Tile';
import Trash from './Trash';
import Reset from './Reset';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const supply = useSelector((state) => state.tiles.supply);
  const days = useSelector((state) => state.tiles.days);
  const dayLabels = useSelector((state) => state.days.labels);

  function handleDragEnd(event : dnd.DragEndEvent) {
    if (event.over === null) {
      return;
    }

    let tile = undefined as TileSpec | undefined;
    for (let i = 0; i < days.length; i++) {
      const found = days[i].find((tile) => tile?.uuid === event.active.id);
      if (found !== undefined) {
        const {index, ...rest} = found;
        tile = rest;
        break;
      }
    }
    if (tile === undefined) {
      const found = supply.find((tile) => tile?.uuid === event.active.id);
      if (found !== undefined) {
        tile = found;
      }
    }
    if (tile === undefined) {
      console.log('Tile not found');
      return;
    }

    // ==> Trash
    if (event.over?.id === TRASH_ID) {
      dispatch(removeTile(event.active.id));
      return;
    }

    // ==> Supply
    if (event.over?.data.current?.containerId === SUPPLY_ID &&
      event.over?.data.current?.tileId === undefined) {
      dispatch(removeTile(event.active.id));
      dispatch(addTile({
        containerId: SUPPLY_ID,
        index: -1,
        tile,
      }));
      return;
    }

    // ==> Gap in Day
    if (event.over?.data.current?.empty) {
      dispatch(removeTile(event.active.id));
      dispatch(addTile({
        containerId: event.over?.data.current?.containerId,
        index: event.over?.data.current?.index,
        tile,
      }));
      return;
    }

    // ==> Tile in Supply
    if (event.over?.data.current?.containerId === SUPPLY_ID &&
      event.over?.data.current?.tileId !== event.active.id){
      dispatch(removeTile(event.active.id));
      dispatch(addTile({
        containerId: SUPPLY_ID,
        index: event.over?.data.current?.index,
        tile,
      }));
      return;
    }
  }

  return (
    <div className="App">
      <header className="App-header"/>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={collisionDetection}
      >
        {/* XXX try DndOverlay? */}
        <div id="TimeTiles" >
          {
            dayLabels.map((label, index) => (
                <Day key={'day-' + index} label={label} id={index} />
            ))
          }
          <div id="Controls">
            <Generator />
            <div className="button-container">
              <Reset />
              <Trash />
            </div>
          </div>
          <Supply />
        </div>
      </DndContext>
    </div>
  );
}

export default App;