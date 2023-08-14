<template>
  <button
    class="client-card-container"
    :class="isSelected ? 'bg-blue-200' : 'bg-white', loading ? 'cursor-not-allowed': 'cursor-pointer'"
    @click="toggleSelection"
    :disabled="loading"
  >
    <h2 class="name-text">{{ fullName }}</h2>
    <p class="date">Customer Since: {{ formattedDate }}</p>
  </button>
</template>

<script lang="ts" setup>
import  { computed, type PropType } from "vue";
import type { Client } from "../../composables/useClients";
import {formatDate} from "../../utils/formatters";

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    default: null
  },
  selectedId: {
    type: String,
    default: ""
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: "toggle-selection", value: string): void;
}>();

const isSelected = computed(() => {
    return props.client.id === props.selectedId;
})

function toggleSelection() {
  if (!isSelected.value) {
    emit('toggle-selection', props.client.id);
  }
}

const fullName = computed(() => `${props.client.first_name} ${props.client.last_name}`)

const formattedDate = computed(() => {
    return formatDate(props.client.client_since);
})
</script>

<style scoped lang="scss">

.client-card-container {
  @apply rounded-lg p-4 opacity-90 shadow-lg min-w-[300px] hover:bg-blue-200 text-left;
  .name-text {
    @apply text-xl font-semibold;
  }
  .date {
    @apply text-gray-600;
  }
}

</style>
