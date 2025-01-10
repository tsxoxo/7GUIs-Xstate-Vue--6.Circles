
import { setup, assign, assertEvent } from 'xstate'
import type { Circle } from './types'

const DEFAULT_RADIUS = 100;
const INITIAL_CIRCLES: Circle[] = [
  {
    coordinates: [100, 100],
    radius: DEFAULT_RADIUS,
    id: 0
  }
];
function getAllIndexes(arr: Array, val: number) {
  var indexes = [], i;
  for (i = 0; i < arr.length; i++)
    if (arr[i] === val)
      indexes.push(i);
  return indexes;
}

function findCircleToSelect(circles: Circle[], clickXY: [number, number]) {

  const indexesOfCandidates: number[] = []
  let smallestDeltaX = 99999;
  let smallestDeltaY = 99999;

  circles.forEach(
    (circle, index) => {
      const [x, y] = circle.coordinates;
      const deltaX = Math.abs(x - clickXY[0]);
      const deltaY = Math.abs(y - clickXY[1]);

      if (deltaX <= smallestDeltaX) {
        indexesOfCandidates.push(index);
        smallestDeltaX = deltaX;
        return
      }
      if (deltaY <= smallestDeltaY) {
        indexesOfCandidates.push(index);
        smallestDeltaY = deltaY;
        return
      }
    }
  )
  const arrayOfDistances: number[] = indexesOfCandidates.map((index: number) => {
    const [x, y] = circles[index].coordinates;
    const distance: number = Math.hypot(x - clickXY[0], y - clickXY[1])
    return distance;
  })
  console.log(arrayOfDistances)
  const smallestDistance: number = Math.min(...arrayOfDistances)
  const indexOfNearestCandidate = arrayOfDistances.indexOf(smallestDistance)
  console.log(indexOfNearestCandidate)
  const isInsideCircle = smallestDistance <= circles[indexOfNearestCandidate].radius

  if (isInsideCircle) {
    return indexOfNearestCandidate;
  }
  return -1
}

export const circlesMachine = setup({
  "types": {
    "context": {} as { 'circles': Circle[], 'indexOfSelectedCircle': number, 'lastID': number },
    "events": {} as { type: 'CLICK', coordinates: [number, number] } | { type: 'UPDATE', id: number, radius: number }
  },
  "actions": {
    "handleClick": assign(({ context, event }) => {
      assertEvent(event, 'CLICK');

      const indexOfCircleToSelect: number = findCircleToSelect(context.circles, event.coordinates)

      if (indexOfCircleToSelect > -1)
        return {
          indexOfSelectedCircle: indexOfCircleToSelect,
        }
      else {
        const newCircle = {
          coordinates: event.coordinates,
          radius: DEFAULT_RADIUS,
          id: context.lastID + 1
        }
        return {
          circles: context.circles.toSpliced(context.circles.length, 0, newCircle),
          indexOfSelectedCircle: -1,
          lastID: context.lastID + 1
        }
      }
    }
    ),
    "update": assign(({ context, event }) => {
      assertEvent(event, 'UPDATE');

      const updatedCircle = {
        id: event.id
      }
      return {
        // people: context.people.toSpliced(context.people.findIndex((el: Person) => el.id === event.id), 1, updatedPerson),
      }
    }
    ),
  }
})
  .createMachine({
    "context": {
      "circles": INITIAL_CIRCLES,
      'indexOfSelectedCircle': -1,
      "lastID": INITIAL_CIRCLES.length - 1
    },
    "id": "Circles",
    "initial": "ready",
    "states": {
      "ready": {
        "on": {
          "CLICK": {
            "target": "ready",
            "actions": {
              "type": "handleClick"
            }
          },
          "UPDATE": {
            "target": "ready",
            "actions": {
              "type": "update",
              "params": {
                "id": "number"
              }
            }
          },
        }
      }
    }
  })
