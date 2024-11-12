import React from 'react';

import { DndContext } from '@dnd-kit/core';
import dnd from '@dnd-kit/core';

import { removeTile, addTile } from '../reducer';
import { useAppDispatch as useDispatch,
  useAppSelector as useSelector} from '../hooks';
import { collisionDetection } from './utilities';
import { TRASH_ID } from '../constants';

import './App.css';
import Supply from './Supply';
import Generator from './Generator';
import Day from './Day';
import Trash from './Trash';
import Reset from './Reset';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const containers = useSelector((state) => state.tiles.containers);
  const dayLabels = useSelector((state) => state.days.labels);

  function handleDragEnd(event : dnd.DragEndEvent) {
    if (event.over === null) {
      console.log('Nothing to do');
      return;
    }

    // Handle this easy case first 
    if (event.over?.id === TRASH_ID) {
      dispatch(removeTile(event.active.id));
      return;
    }

    // Figure out which container the active tile is in and get the full tile.
    let activeContainerIndex = event.active.data.current?.containerIndex;
    if (activeContainerIndex < 0) {
      console.log('Active tile not found in supply or days!!');
      return;
    }
    let activeTile = containers[activeContainerIndex].find(
        (tile) => tile.uuid === event.active.id);

    // Figure out if 'over' is part of the supply or a day (and if more
    // than one, which one is colliding the most).
    const overContainerIndex = event.collisions?.reduce((acc, collision) => {
      const index = collision.data?.droppableContainer.data.current['index'];
      if (index === undefined) { // Not a container
        return acc;
      }
      if (acc !== undefined && acc.value < collision.data?.value) {
        return acc;
      } 
      return {index: index, value: collision.data?.value};
    }, undefined as {index: number, value: number} | undefined)?.index;
    if (overContainerIndex === undefined) {
      console.log('Over container not found');
      return;
    }

    // Figure out the index of the tile we're dropping over
    let overTileIndex = containers[overContainerIndex].findIndex(
      (tile) => tile.uuid === event.over?.data.current?.tileId)
    if (overTileIndex === -1) {
      overTileIndex = containers[overContainerIndex].length;
    }

    dispatch(removeTile(event.active.id));
    dispatch(addTile({
      tileIndex: overTileIndex,
      tile: {...activeTile, containerIndex: overContainerIndex},
    }));
  }

  return (
    <div className="App">
      <header className="App-header"/>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={collisionDetection}
      >
        {/* XXX try DndOverlay? */}
        <div className="TimeTiles" >
          {
            dayLabels.map((label, index) => (
                <Day key={'day' + (index + 1)} name={label} index={index + 1} />
            ))
          }
          <Generator />
          <Trash />
          <Reset />
          <Supply />
        </div>
      </DndContext>
    </div>
  );
}

export default App;