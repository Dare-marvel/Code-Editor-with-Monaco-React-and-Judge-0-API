import axios from "axios";

export const checkStatus = async (token) => {
    const options = {
        method: "GET",
        url: 'http://localhost:2358/submissions/' + token,
        params: { base64_encoded: "true", fields: "*" },
        headers: {},
    };

    try {
        let response = await axios.request(options);
        let statusId = response.data.status?.id;

        if (statusId === 1 || statusId === 2) {
            // Still processing --> re-run the same token check after 2 seconds
            return new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await checkStatus(token);
                    resolve(result);  // Pass the result up the chain
                }, 2000);
            });
        } else {
            const { data } = response;
            console.log("success ", data);
            return { success: true, data };  // Return success with data
        }
    } catch (err) {
        return { success: false, err };  // Return error object in case of failure
    }
};


export const submitCode = async (formData) => {
    const options = {
        method: "POST",
        url: 'http://localhost:2358/submissions',
        params: { base64_encoded: "true", fields: "*" },
        headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
        },
        data: formData,
    };

    try {
        const { data } = await axios.request(options);

        console.log(data)

        return { success: true, data };
    } catch (err) {
        return { success: false, err }
    }
}