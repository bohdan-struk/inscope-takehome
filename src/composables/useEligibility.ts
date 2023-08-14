import {ref} from "vue";
import {$fetch} from "ohmyfetch";

export type Eligibility = {
    amount: number
    bp_rate: number
    eligible: boolean
    reason: string | null
}
export default () => {
    const URL = "https://inscope-takehome-service.onrender.com"

    const eligibility = ref<Eligibility | null>(null);

    const checkEligibility = async (currentBalance: number, previousPeriodBalance: number, numTransaction: number, clientSince: string) => {
        try {
            eligibility.value = await $fetch(`${URL}/underwrite`, {
                method: "POST",
                body: {
                    current_balance: currentBalance,
                    previous_period_balance: previousPeriodBalance,
                    num_transactions: numTransaction,
                    client_since: clientSince
                }
            });
        } catch (e) {
            console.error(e)
        } finally {

        }
    }
    const reset = () => {
        eligibility.value = null;
    }
    return {
        checkEligibility,
        eligibility,
        reset
    }
}
