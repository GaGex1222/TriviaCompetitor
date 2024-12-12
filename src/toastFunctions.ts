import toast from "react-hot-toast"


export const handleSuccesToast = (message: string) => {
    toast.success(message, {
        duration: 4000, 
        position: "bottom-right",
        style: {
            border: "2px solid #61d345"
        }
    })
}

export const handleErrorToast = (message: string) => {
    toast.error(message, {
        duration: 4000, 
        position: "bottom-right",
        style: {
            border: "2px solid #ff4b4b"
        }
    })
}
