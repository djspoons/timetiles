import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import { useAppSelector as useSelector } from '../hooks';
import { SUPPLY_INDEX } from '../constants';

import './Supply.css';
import Tile, { TileProps } from './Tile';

const Supply: React.FC = () => {
    const tiles = useSelector((state) => state.containers)[SUPPLY_INDEX];
    const {setNodeRef} = useDroppable({
        id: "supply",
        data: {
            index: SUPPLY_INDEX,
        },
    });
    return (
        <div className="Supply container" ref={setNodeRef}>
        {
            tiles.map((tile, index) => {
                return (
                    <Tile key={tile.uuid}
                      {...tile}
                    />
                );
            })
        }
        </div>

    );
};

export default Supply;