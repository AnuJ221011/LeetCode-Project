const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        'c++':54,
        'java':62,
        'javascript':63
    }

    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'x-rapidapi-key': 'faf32c8131msh60389f80b2381e1p16962bjsn5e0ffb9355e2',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        submissions
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return await fetchData();

}

// helper function to wait
const waiting = async (timer) => {
    setTimeout(() => {
        return 1;
    }, timer);
} 

const submitToken = async (resultToken) => {

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens: resultToken.join(','),
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': 'faf32c8131msh60389f80b2381e1p16962bjsn5e0ffb9355e2',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }


    while(true) {
        
        const result = await fetchData();
        
        const IsResultObtain = result.submissions.every((r) => r.status_id > 2);
        
        if(IsResultObtain) {
            return result.submissions;
        }

        await waiting(1000);
    }
}

module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
}










// const axios = require('axios');

// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'true'
//   },
//   headers: {
//     'x-rapidapi-key': 'faf32c8131msh60389f80b2381e1p16962bjsn5e0ffb9355e2',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions: [
//       {
//         language_id: 46,
//         source_code: 'ZWNobyBoZWxsbyBmcm9tIEJhc2gK'
//       },
//       {
//         language_id: 71,
//         source_code: 'cHJpbnQoImhlbGxvIGZyb20gUHl0aG9uIikK'
//       },
//       {
//         language_id: 72,
//         source_code: 'cHV0cygiaGVsbG8gZnJvbSBSdWJ5IikK'
//       }
//     ]
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		console.log(response.data);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// fetchData();