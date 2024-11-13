import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

import './Tile.css';

export interface TileSpec {
    uuid: string;
    label: string;
    className: string; // should set a background color
}

export const Tile: React.FC<TileSpec & { index: number, containerId: number}> = ({uuid, className, label, index, containerId}) => {
    const {attributes, listeners, setNodeRef: setDraggableNodeRef, transform} = useDraggable({
        id: uuid,
    });
    const {setNodeRef: setDroppableNodeRef} = useDroppable({
        id: 'tile-' + uuid,
        data: {
            tileId: uuid,
            containerId,
            index,
            empty: false,
        },
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 100px)`,
    } : undefined;

    return (
        <div className="tile-holder" ref={setDroppableNodeRef}>
            <div className={'Tile colored ' + className}
                ref={setDraggableNodeRef} {...listeners} {...attributes}
                style={style}
            >
                <span>{label}</span>
            </div>
        </div>
    );
}

export default Tile;