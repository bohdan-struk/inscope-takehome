<template>
  <div class="receipt-overlay">
    <div class="receipt-modal">
      <div v-if="eligibility.eligible && eligibility.amount > 0" class="custom-approved">
        <div class="approve-text">
          Approved
        </div>
        <div><span class="bold-text">Amount:</span> {{ formatMoney(eligibility.amount) }}</div>
        <div><span class="bold-text">Rate:</span> {{ eligibility.bp_rate / 100 }}%</div>
      </div>
      <div v-else>
        <div class="decline-text">
          Declined
        </div>
        <div v-if="eligibility.reason" class="reason-container">
          <span class="bold-text">Reason:</span> {{ eligibility.reason }}
        </div>
        <div v-else class="reason-container">
          <span class="bold-text">Reason:</span> Customer current balance is negative
        </div>
      </div>
      <div class="custom-button-container">
        <button @click="resetHandler" class="custom-button">
          <span class="custom-button-arrow"></span>
          <span class="custom-button-text">Close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { Eligibility } from "../composables/useEligibility";
import { formatMoney } from "../utils/formatters";

const props = defineProps({
  eligibility: {
    type: Object as PropType<Eligibility>
  }
})

const emit = defineEmits<{
  (e: "reset"): void;
}>();

const resetHandler = () => {
  emit("reset");
}
</script>

<style scoped lang="scss">
.receipt-overlay {
  @apply h-[100vh] w-full top-0 left-0 bg-black/40 absolute z-10 flex justify-center items-center;
  .receipt-modal {
    @apply bg-white w-[500px] p-5 rounded-lg z-20;

    .approve-text {
      @apply text-green-500 text-center text-2xl;
    }

    .decline-text {
      @apply text-red-500 text-center text-2xl;
    }

    .bold-text {
      @apply font-semibold text-lg;
    }

    .reason-container {
      @apply text-lg font-normal capitalize py-4;
    }

    .custom-button-container {
      @apply flex justify-end;
    }

    .custom-button {
      @apply mt-3 relative rounded px-5 py-2.5 overflow-hidden bg-blue-800 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 transition-all duration-300;

      .custom-button-arrow {
        @apply absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 hover:-translate-x-40;
      }

      .custom-button-text {
        @apply relative;
      }
    }
  }
}

</style>
