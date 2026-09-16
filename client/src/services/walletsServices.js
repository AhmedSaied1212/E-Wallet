import toast from "react-hot-toast";
import api from "./api";

const walletsServices = {
    getMyWallets: async () => {
        try {
            const response = await api.get("wallets/me");
            const data = await api.parseJson(response);
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

export default walletsServices;