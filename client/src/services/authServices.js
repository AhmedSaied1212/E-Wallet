import api from "./api.js";
import toast from "react-hot-toast";

const authServices = {
    login: async (credentials) => {
        try {
            const response = await api.post("auth/login", credentials);
            const data = await api.parseJson(response);

            if (data?.success) {
                toast.success(data.message);
                return data;
            } else {
                toast.error(data?.error || "Login failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    },

    register: async (credentials) => {
        try {
            const response = await api.post("auth/register", credentials);
            const data = await api.parseJson(response);

            if (data?.success) {
                toast.success(data.message);
                return data;
            } else {
                toast.error(data?.error || "Register failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await api.get(`auth/verify-email?token=${token}`);

            const data = await api.parseJson(response);

            return data;
        } catch (error) {
            toast.error(error.message)
        }
    },

    resendVerify: async (email) => {
        try {
            const response = await api.post("auth/resend-verification", {email});
            const data = await api.parseJson(response);

            if (data?.success) {
                toast.success(data.message);
                return data;
            } else {
                toast.error(data?.error || "Resend verification failed");
            }
        } catch (error) {
            toast.error(error.message);
        }
    },
    
    profile: async () => {
        try {
            const response = await api.get("auth/me");
            const data = await api.parseJson(response);

            if (data?.success) {
                return data;
            } else {
                console.log(data?.error)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
};

export default authServices