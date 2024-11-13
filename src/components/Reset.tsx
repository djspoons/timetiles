import React from 'react';
import { FaArrowsRotate } from "react-icons/fa6";

import { resetTiles } from '../reducer';
import { useAppDispatch as useDispatch } from '../hooks';

import './Reset.css';

const Reset: React.FC = () => {
    const dispatch = useDispatch();

    function buttonHandler(e : React.PointerEvent<HTMLButtonElement>) {
        dispatch(resetTiles());
    }
    return (
        <div id="Reset">
            <button className="button" onClick={buttonHandler}>
              <FaArrowsRotate />
            </button>
        </div>
    )
}

export default Reset;