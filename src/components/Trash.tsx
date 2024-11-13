import React from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import { useDroppable } from '@dnd-kit/core';

import { TRASH_ID } from '../constants';

import './Trash.css';

const Trash: React.FC = () => {
  const {isOver, setNodeRef} = useDroppable({
    id: TRASH_ID,
  });
  const style = {
    backgroundColor: isOver ? 'lightgray' : undefined,
  };
  
  return (
    <div id="Trash"
      ref={setNodeRef} 
      style={style}
    >
      <FaRegTrashAlt />
    </div>
  );
}

export default Trash;