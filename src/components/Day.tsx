import React from "react";
import { useDroppable } from '@dnd-kit/core';

import { useAppSelector as useSelector } from '../hooks';

import Tile from './Tile';
import './Day.css';

export type DayProps = {
  name: string;
  index: number;
}

const Day: React.FC<DayProps> = ({name, index}) => {
  const id = 'day-' + index;
  const tiles = useSelector((state) => state.containers)[index];
  const {setNodeRef} = useDroppable({
    id,
    data: {
      index,
    },
  });

  return (
    <div className="Day container" id={id} ref={setNodeRef}>
      <div className="day-header">{name}</div>
      <div className="day-container">
      {
        tiles.map((tile) => {
          return (
            <Tile key={tile.uuid}
                  {...tile}
            />
          );
        })
      }
      </div>
    </div>
  );
}
  
export default Day;