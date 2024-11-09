import React, { useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

import { useAppSelector as useSelector,
    useAppDispatch as useDispatch } from '../hooks';

import './Tile.css';

export interface TileProps {
    uuid: string;
    label: string;
    minutes: number;
    className: string; // should set a background color
}

export const Tile: React.FC<TileProps> = ({uuid, minutes, className, label}) => {
    const dispatch = useDispatch();
    const dayLength = 60 * 4;
    const {attributes, listeners, setNodeRef: setDraggableNodeRef, transform} = useDraggable({
        id: uuid,
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