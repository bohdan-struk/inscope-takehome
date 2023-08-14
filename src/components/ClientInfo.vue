<template>
  <div class="client-info-container">
    <div class="client-info-title">{{ fullName }}</div>
    <div class="client-info-balance">Current balance: {{ formatMoney(currentBalance) }}</div>
    <button @click="checkEligibilityHandler" class="client-info-button">
      <span class="client-info-button-arrow"></span>
      <span class="client-info-button-text">Check eligibility</span>
    </button>
    <Receipt v-if="eligibility" :eligibility="eligibility" @reset="reset" />
  </div>
</template>

<script lang="ts" setup>
import type {PropType} from "vue";
import type {Client} from "../composables/useClients";
import {computed} from "vue";
import {formatMoney, underwriteDateFormat} from "../utils/formatters";
import useEligibility from "../composables/useEligibility";
import Receipt from "../components/Receipt.vue";

const props = defineProps({
  client: {
    type: Object as PropType<Client | null>,
    default: null
  },
  transactionsAmount: {
    type: Number,
    default: 0
  },
  transactionsNumber: {
    type: Number,
    default: 0
  }
})

const {checkEligibility, eligibility, reset} = useEligibility();

const emit = defineEmits<{
  (e: "check-Eligibility", value): void;
}>();

const checkEligibilityHandler = () => {
  checkEligibility(currentBalance.value, props.client.previous_period_balance, props.transactionsNumber, underwriteDateFormat(props.client.client_since));
}

const currentBalance = computed(() => props.client.previous_period_balance + props.transactionsAmount)

const fullName = computed(() => `${props.client.first_name} ${props.client.last_name}`)
</script>

<style scoped lang="scss">
.client-info-container {
  @apply py-4;

  .client-info-title {
    @apply text-4xl font-bold;
  }

  .client-info-balance {
    @apply text-lg;
  }

  .client-info-button {
    @apply mt-3 relative rounded px-5 py-2.5 overflow-hidden bg-blue-800 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 transition-all duration-300;
  }

  .client-info-button-arrow {
    @apply absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 hover:-translate-x-40;
  }

  .client-info-button-text {
    @apply relative;
  }
}

</style>
