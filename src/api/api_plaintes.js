import axios from "axios";
class api_plaintes {
  static #api = "http://127.0.0.1:8000/api";
  static #token = localStorage.getItem("token");

  static  getData(cheminApi) {
    
   axios.get(this.#api + cheminApi, {
        headers: {
          Authorization: `Bearer ${this.#token}`,
        },
      });
  }

  static addPlaint(plaint) {
    const response = axios
      .post(
        this.#api + "/plaint/store",
        {
          plaint: plaint,
        },
        { headers: { Authorization: `Bearer ${this.#token}` } }
      )
      .catch((er) => {
        console.log(er);
        return er;
      });

    return response;
  }
}
export default api_plaintes;
