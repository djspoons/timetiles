import React from "react";
import { useDroppable } from '@dnd-kit/core';

import './Day.css';
import Tile, { TileSpec } from './Tile';

const DAY_SLOTS = 3;

const Gap: React.FC<{index: number, containerId: number}> = ({index, containerId}) => {
  const {setNodeRef} = useDroppable({
    id: 'gap-' + containerId + '-' + index,
    data: {
        containerId,
        index,
        empty: true,
    },
  });
  return (
    <div ref={setNodeRef} className="Gap tile-holder" />
  );
}

export type DayProps = {
  label: string;
  id: number;
  tiles: (TileSpec & {index: number})[];
}

const Day: React.FC<DayProps> = ({label, id, tiles}) => {
  const children = Array.from({length: DAY_SLOTS}, 
    (_, index) => {
      return tiles.find((tile) => tile?.index === index);
    });

  return (
    <div className="Day tile-container" id={'day-' + id}>
      <div className="day-header">{label}</div>
        {
          children.map((tile, index) => (
            tile === undefined ?
              <Gap key={'gap-' + index} index={index} containerId={id} />
            :
              <Tile {...tile}
                key={tile.uuid}
                containerId={id}
              />
          ))
        }
    </div>
  );
}
  
export default Day;