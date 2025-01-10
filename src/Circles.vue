<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { circlesMachine } from './circlesMachine'
import { createBrowserInspector } from '@statelyai/inspect'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Person } from './types'

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(circlesMachine, {
  inspect
})

</script>

<template>
  <main>
    <div id="canvas">
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <circle v-for="circle in snapshot.context.circles" :cx="circle.coordinates[0]" :cy="circle.coordinates[1]"
          :r="circle.radius" class="circle" />

      </svg>
    </div>

    <div id="buttons">
      <button>
        Undo
      </button>
      <button>
        Redo
      </button>
    </div>
  </main>
</template>