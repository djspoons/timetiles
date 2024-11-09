import React, { useState, RefObject } from 'react';

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
import { TileProps } from './Tile';
import Trash from './Trash';
import Reset from './Reset';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const containers = useSelector((state) => state.containers);

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

    // Figure out which container the active tile is in and its 
    // index in that container.
    let activeContainerIndex = -1;
    let activeTile = undefined;
    for (let i = 0; i < containers.length; i++) {
      activeTile = containers[i].find(
        (tile) => tile.uuid === event.active.id);
      if (activeTile !== undefined) {
        activeContainerIndex = i;
        break;
      }
    }
    if (activeContainerIndex < 0) {
      console.log('Active tile not found in supply or days!!');
      return;
    }

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
    dispatch(addTile({containerIndex: overContainerIndex, tileIndex: overTileIndex, tile: activeTile}));
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
          <Day name="S" index={1} />
          <Day name="M" index={2} />
          <Day name="T" index={3} />
          <Day name="W" index={4} />
          <Day name="ϴ" index={5} />
          <Day name="F" index={6} />
          <Day name="Σ" index={7} />
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