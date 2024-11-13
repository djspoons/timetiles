import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import { useAppSelector as useSelector } from '../hooks';
import { SUPPLY_ID } from '../constants';

import './Supply.css';
import Tile from './Tile';

const Supply: React.FC = () => {
    const tiles = useSelector((state) => state.tiles.supply);
    const {setNodeRef} = useDroppable({
        id: 'supply',
        data: {
            containerId: SUPPLY_ID,
        },
    });
    return (
        <div id="Supply" className="tile-container" ref={setNodeRef}>
        {
            tiles.map((tile, index) => {
                return (
                    tile ? <Tile {...tile}
                                key={tile.uuid}
                                containerId={SUPPLY_ID}
                                index={index}
                            /> : undefined
                );
            })
        }
        </div>

    );
};

export default Supply;