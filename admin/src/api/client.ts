import axios from 'axios';
import qs from 'qs';

const client = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5_000,
    paramsSerializer: {
        serialize: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        },
    },
});

export default client;