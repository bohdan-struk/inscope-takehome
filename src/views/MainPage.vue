<template>
  <div class="page-container">
    <div class="admin-panel-container">
      <span class="panel-text">Admin Portal</span>
    </div>
    <div class="content-container">
      <div class="p-10">
        <div class="h-[200px]">
          <div v-if="failedTransactions && !loadingTransactions">
            <div class="error-text">An Error Occurred</div>
          </div>
          <div v-else-if="loadingTransactions" class="relative">
            <div class="info-loading"></div>
          </div>
          <ClientInfo
            v-if="selectedClient && !loadingTransactions"
            :client="selectedClient"
            :transactions-amount="clientTransactionsBalance"
            :transactions-number="transactionsNumber"
          />
        </div>
        <div>
          <div v-if="isRequestFailed && !isRequestPending">
            <div class="error-text">An Error Occurred</div>
            <button @click="getClients()"
                    class="custom-button">
              <span
                class="custom-button-arrow"></span>
              <span class="custom-button-text">Try Again</span>
            </button>
          </div>
          <div v-if="isRequestPending" class="loading-content-container">
            <div
              class="content-loader"></div>
          </div>
          <div v-if="clients.length" class="client-container">
            <div class="flex justify-between">
              <h1 class="client-title">Existing Customers</h1>
              <select v-model="selectedSortOption" class="p-2 rounded border cursor-pointer">
                <option v-for="option in sortOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div>
              <div class="card-container">
                <ClientCard
                  :loading="loadingTransactions || isRequestPending"
                  v-for="client in paginatedClients"
                  :key="client.id" :client="client"
                  :selected-id="selectedCardId"
                  @toggle-selection="toggleCardSelection"
                />
              </div>
            </div>
            <div
              class="pagination-container">
              <ul class="pagination-wrap">
                <li>
                  <button
                    aria-label="left-arrow"
                    @click="goToPreviousPage" :disabled="currentPage === 1"
                    class="pagination-arrow-left">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" fill-rule="evenodd"></path>
                    </svg>
                  </button>
                </li>
                <li v-for="page in totalPages">
                  <button
                    @click="goToPage(page)"
                    :disabled="currentPage === page"
                    :class="currentPage === page ? 'text-white bg-blue-600 border' : 'text-blue-600 hover:bg-blue-100'"
                    class="pagination-button">
                    {{ page }}
                  </button>
                </li>
                <li>
                  <button
                    aria-label="right-arrow"
                    @click="goToNextPage" :disabled="currentPage === totalPages"
                    class="pagination-arrow-right">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" fill-rule="evenodd"></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watchEffect} from "vue";
import useClients from "../composables/useClients";
import ClientCard from "../components/common/ClientCard.vue";
import ClientInfo from "../components/ClientInfo.vue";
import {computed} from "vue";


const {getClients, clients, getClientTransactions, clientTransactionsBalance, totalPages, isRequestPending, isRequestFailed, loadingTransactions, failedTransactions, transactionsNumber} = useClients();
const selectedCardId = ref("");
const currentPage = ref(1);
const sortOptions = [
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
  { label: 'Date Newest', value: 'date-newest' },
  { label: 'Date Oldest', value: 'date-oldest' },
];

const selectedSortOption = ref(sortOptions[0].value);

const paginatedClients = computed(() => {
  const startIndex = (currentPage.value - 1) * 9;
  const endIndex = startIndex + 9;

  let sortedClients = [...clients.value];

  if (selectedSortOption.value === 'name-asc') {
    sortedClients.sort((a, b) => a.first_name.localeCompare(b.first_name));
  } else if (selectedSortOption.value === 'name-desc') {
    sortedClients.sort((a, b) => b.first_name.localeCompare(a.first_name));
  } else if (selectedSortOption.value === 'date-newest') {
    sortedClients.sort((a, b) => new Date(b.client_since) - new Date(a.client_since));
  } else if (selectedSortOption.value === 'date-oldest') {
    sortedClients.sort((a, b) => new Date(a.client_since) - new Date(b.client_since));
  }

  return sortedClients.slice(startIndex, endIndex);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const toggleCardSelection = (cardId) => {
  selectedCardId.value = cardId;
  getClientTransactions(cardId);
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const selectedClient = computed(() => {
  if (selectedCardId.value && clients.value) {
    return clients.value.find((client) => client.id === selectedCardId.value)
  }
  return null
})

getClients();

</script>

<style scoped lang="scss">
.page-container {
  @apply overflow-x-hidden bg-gradient-to-r from-cyan-500 to-blue-500 min-h-[100vh];
  .admin-panel-container {
    @apply fixed left-0 bottom-0 bg-white w-[200px] min-h-[100vh] shadow-md text-center py-4;
    .panel-text {
      @apply text-2xl font-bold italic;
    }
  }
  .content-container {
    @apply flex justify-center text-start;
    .error-text {
      @apply text-2xl text-red-600;
    }

    .info-loading {
      @apply absolute left-[50px] top-[50px] animate-ping h-[30px] w-[30px] border-4 rounded-full;
    }

    .content-loader {
      @apply animate-ping h-[100px] w-[100px] border-4 rounded-full;
    }

    .loading-content-container {
      @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
    }

    .pagination-container {
      @apply bottom-0 mt-10 flex items-center flex-wrap justify-center;
      .pagination-wrap {
        @apply inline-flex bg-white p-1 rounded;
        .pagination-arrow-left {
          @apply h-10 px-5 text-blue-600 transition-colors duration-150 rounded-l-lg hover:bg-blue-100;
        }
        .pagination-button {
          @apply h-10 px-5 transition-colors duration-150;
        }
        .pagination-arrow-right {
          @apply h-10 px-5 text-blue-600 transition-colors duration-150 bg-white rounded-r-lg hover:bg-blue-100;
        }
      }
    }

    .custom-button {
      @apply mt-3 relative rounded px-5 py-2.5 overflow-hidden bg-blue-500 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 transition-all duration-300;

      .custom-button-arrow {
        @apply absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 hover:-translate-x-40;
      }

      .custom-button-text {
        @apply relative;
      }
    }

    .client-container {
      @apply relative;
      .client-title {
        @apply text-2xl font-bold;
      }

      .card-container {
        @apply grid grid-cols-3 gap-4 mt-[50px];
      }
    }
  }
}
</style>
