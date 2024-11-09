import { CollisionDetection, closestCenter, closestCorners, rectIntersection } from '@dnd-kit/core';

export const collisionDetection : CollisionDetection = function({
  droppableContainers,
  active,
  ...args
}) {
  const trashCollisions = rectIntersection({
    ...args,
    active,
    droppableContainers: droppableContainers.filter(({id}) => id === 'trash')
  });
  
  if (trashCollisions.length > 0) {
    return trashCollisions;
  }

  // Find all of the rect intersections
  const rectCollisions = rectIntersection({
    ...args,
    active,
    droppableContainers: droppableContainers,
  });
  // Now do closest corners on those intersections
  return closestCenter({
    ...args,
    active,
    droppableContainers: droppableContainers.filter(
        ({id}) => rectCollisions.some(({id: rectId}) => rectId === id)),
  });
};