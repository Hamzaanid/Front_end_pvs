 const  baseURL = {
    api:"http://127.0.0.1:8000/api",
    token:localStorage.getItem("token"), // token authorization
    backendPDF:"http://127.0.0.1:8000" // lien  vers backend
}

export default baseURL