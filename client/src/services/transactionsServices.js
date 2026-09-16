import toast from "react-hot-toast";
import api from "./api";

const transactionsServices = {
    getMyTransactions: async (limit) => {
        try {
            const response = await api.get(`transactions/me?limit=${limit}`);
            const data = await api.parseJson(response);
            console.log(data)
            if (data?.success) {
                return data;
            } else {
                toast.error(data?.error)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
}

export default transactionsServices;