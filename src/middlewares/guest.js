import storeUser from "@/store/user";
export default function auth({next, router}) {
    if(localStorage.getItem('token')) {
        
    }
    return next();
}