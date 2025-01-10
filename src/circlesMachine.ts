
import { setup, assign, assertEvent } from 'xstate'
import type { Circle } from './types'

const DEFAULT_RADIUS = 50;
const INITIAL_CIRCLES: Circle[] = [
  {
    coordinates: [100, 100],
    radius: DEFAULT_RADIUS,
    id: 0
  }
];


export const circlesMachine = setup({
  "types": {
    "context": {} as { 'circles': Circle[], lastID: number },
    "events": {} as { type: 'CREATE', coordinates: [number, number] } | { type: 'UPDATE', id: number, radius: number }
  },
  "actions": {
    "create": assign(({ context, event }) => {
      assertEvent(event, 'CREATE');

      const newCircle = {
        coordinates: event.coordinates,
        radius: DEFAULT_RADIUS,
        id: context.lastID + 1
      }
      return {
        circles: context.circles.toSpliced(context.circles.length, 0, newCircle),
        lastID: context.lastID + 1
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
      "lastID": INITIAL_CIRCLES.length - 1
    },
    "id": "Circles",
    "initial": "ready",
    "states": {
      "ready": {
        "on": {
          "CREATE": {
            "target": "ready",
            "actions": {
              "type": "create"
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
          "DELETE": {
            "target": "ready",
            "actions": {
              "type": "delete"
            }
          }
        }
      }
    }
  })
