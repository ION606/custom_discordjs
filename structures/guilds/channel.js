const axios = require("axios").create({baseUrl: "https://jsonplaceholder.typicode.com/"});

class Channel {
    /** @type {String} */
    id;

    /**
     * @param {Object} inp 
     */
    async send(inp) {
        const toSend = (typeof inp == 'string') ? {content: inp} : inp;
        const response = axios.post(`${id}/messages`, {
            // Authorization: 

        });
    }
}