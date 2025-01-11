
import { setup, assign, assertEvent } from 'xstate'
import type { Circle } from './types'

const DEFAULT_RADIUS = 100;
const INITIAL_CIRCLES: Circle[] = [
  {
    coordinates: { x: 100, y: 100 },
    radius: DEFAULT_RADIUS,
    id: 0
  },
  {
    coordinates: { x: 200, y: 400 },
    radius: DEFAULT_RADIUS / 2,
    id: 0
  },
  {
    coordinates: { x: 200, y: 200 },
    radius: DEFAULT_RADIUS / 6,
    id: 0
  }
];

function findCircleToSelect(circles: Circle[], coordinates: { x: number, y: number }) {

  let bestCandidateSoFar = { index: -1, distance: 999999 };

  for (let index = 0; index < circles.length; index++) {
    const circle = circles[index];
    const r = circle.radius
    const deltaX = Math.abs(circle.coordinates.x - coordinates.x);
    const deltaY = Math.abs(circle.coordinates.y - coordinates.y);

    if (deltaX <= r && deltaY <= r) {
      const distance = Math.hypot(deltaX, deltaY)

      if (distance <= r && distance <= bestCandidateSoFar.distance) {
        bestCandidateSoFar = {
          index,
          distance
        }
      }

    }
  }

  return bestCandidateSoFar.index;
}

export const circlesMachine = setup({
  "types": {
    "context": {} as { 'circles': Circle[], 'indexOfSelectedCircle': number, 'lastID': number },
    "events": {} as { type: 'CLICK', coordinates: { x: number, y: number } } | { type: 'UPDATE', id: number, radius: number }
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
