import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import { SUPPLY_ID } from '../constants';

import './Supply.css';
import Tile, { TileSpec } from './Tile';

interface SupplyProps {
    tiles: TileSpec[];
}

const Supply: React.FC<SupplyProps> = ({tiles}) => {
    const {setNodeRef} = useDroppable({
        id: 'supply',
        data: {
            containerId: SUPPLY_ID,
        },
    });
    return (
        <div id="Supply" className="tile-container" ref={setNodeRef}>
        {
            tiles.map((tile, index) => (
                <Tile {...tile}
                    key={tile.uuid}
                    containerId={SUPPLY_ID}
                    index={index}
                />
            ))
        }
        </div>

    );
};

export default Supply;