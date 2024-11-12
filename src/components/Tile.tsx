import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

import './Tile.css';

export interface TileProps {
    uuid: string;
    label: string;
    minutes: number;
    className: string; // should set a background color
    containerIndex: number; // sort of redundant with the state structure, but nice to have to set data
}

export const Tile: React.FC<TileProps> = ({uuid, minutes, className, label, containerIndex}) => {
    const dayLength = 60 * 4;
    const {attributes, listeners, setNodeRef: setDraggableNodeRef, transform} = useDraggable({
        id: uuid,
        data: {
            containerIndex,
        },
    });
    const {setNodeRef: setDroppableNodeRef} = useDroppable({
        id: 'placeholder-' + uuid,
        data: {
            tileId: uuid,
        },
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 100px)`,
    } : undefined;

    return (
        <div ref={setDroppableNodeRef}>
            <div className={'Tile colored ' + className}
                ref={setDraggableNodeRef} {...listeners} {...attributes}
                style={{
                    ...style,
                    height: 100 * (minutes / dayLength) + '%',
                    /* lineHeight: width / 2 + 'px', */
                }}
            >
                <span>{label}</span>
            </div>
        </div>
    );
}

export default Tile;