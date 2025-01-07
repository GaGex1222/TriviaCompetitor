import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"


export const handleSuccesToast = (message: string) => {
    toast.success(message, {
        duration: 3000, 
        position: "bottom-right",
        style: {
            border: "2px solid #61d345"
        }
    })
}

export const handleErrorToast = (message: string) => {
    toast.error(message, {
        duration: 3000, 
        position: "bottom-right",
        style: {
            border: "3px solid #ff4b4b"
        }
    })
}

export const handleNotLoggedIn = (session: Session ,router: ReturnType<typeof useRouter>) => {
    if(!session){
        handleErrorToast("You have to be logged in to use this feature!")
        router.push('/')
    }
}
