import {ref} from "vue";
import {$fetch} from "ohmyfetch";
import {createFetch} from "@vueuse/core/index";

export type Client = {
    id: string;
    first_name: string;
    last_name: string;
    client_since: string;
    previous_period_balance: number;
}

export type ClientsList = {
    count: number;
    next: string;
    previous: string;
    results: Client[];
}

export default () => {
    const URL = "https://inscope-takehome-service.onrender.com"

    const clients = ref<Client | []>([])
    const isRequestPending = ref<boolean>(false);
    const isRequestFailed = ref<boolean>(false);
    const clientTransactionsBalance = ref<number>(0);
    const totalPages = ref<number>(0);
    const loadingTransactions = ref<boolean>(false);
    const failedTransactions = ref<boolean>(false);
    const transactionsNumber = ref<number>(0);


    const getClients = async () => {
        isRequestPending.value = true;
        isRequestFailed.value = false;
        try {
            let nextPage = '/clients';
            const allClients = [];
            while (nextPage) {
                const response = await $fetch(`${URL}${nextPage}`);
                allClients.push(...response.results);
                nextPage = response.next
            }
            totalPages.value = Math.ceil(allClients.length / 9);
            clients.value = allClients;
        } catch (e) {
            isRequestFailed.value = true;
        } finally {
            isRequestPending.value = false;
        }
    }

    const getClientTransactions = async (id: string) => {
        clientTransactionsBalance.value = 0;
        transactionsNumber.value = 0;
        loadingTransactions.value = true;
        failedTransactions.value = false
        try {
            let nextPage = `/clients/${id}/transactions`;
            while (nextPage) {
                const response = await $fetch(`${URL}${nextPage}`)
                const transactions = response.results;
                for (const transaction of transactions) {
                    clientTransactionsBalance.value += transaction.amount;
                }
                nextPage = response.next;
                transactionsNumber.value = response.count
            }
        } catch (e) {
            failedTransactions.value = true;
        } finally {
            loadingTransactions.value = false;
        }
    }

    return {
        getClients,
        clientTransactionsBalance,
        clients,
        loadingTransactions,
        failedTransactions,
        isRequestPending,
        isRequestFailed,
        getClientTransactions,
        totalPages,
        transactionsNumber,

    }
}
