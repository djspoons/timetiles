import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useAppDispatch as useDispatch} from '../hooks';
import { addTile } from '../reducer';
import { SUPPLY_ID } from '../constants';

import './Generator.css';

export const Generator: React.FC = () => {
    const [labelValue, setLabelValue] = useState('');
    const handleLabelChange = (e : React.ChangeEvent<HTMLInputElement>) => {
         setLabelValue(e.target.value)
    };

    const [classNameValue, setClassNameValue] = useState('');
    const handleColorChange = (e : React.PointerEvent<HTMLDivElement>) => {
      const className = Array.from(e.currentTarget.classList).find(
        (className) => className.startsWith('tile-color-'));
      if (className === undefined || className === classNameValue) {
        setClassNameValue('');
      } else {
        setClassNameValue(className);
      }
    };

    const buttonEnabled = labelValue !== '' && classNameValue !== '';
    const dispatch = useDispatch();
    const buttonClicked = () => {
      dispatch(addTile({
        index: -1, // Put it at the end
        containerId: SUPPLY_ID,
        tile: {
          uuid: uuid(),
          className: classNameValue,
          label: labelValue,
        },
      }));
    };

    return (
        <div id="Generator">
          <input type="text" id="label-input" placeholder="Label" 
            value={labelValue} onChange={handleLabelChange} />
          <div className="color-picker">
            {
              Array.from({ length: 8 }, (_, index) => (
                <div
                  className={'colored color-chip tile-color-' + (index + 1) +
                    (classNameValue === 'tile-color-' + (index + 1) ? ' selected' : '')}
                  key={'chip-' + index}
                  onClick={handleColorChange}
                  style={{
                    height: '30px', // XXX move to css
                }}></div>))
            }
          </div>
          <button
            className="button"
            onClick={buttonClicked}
            disabled={!buttonEnabled}
          >
            New Tile
          </button>
        </div>
    );
}

export default Generator;