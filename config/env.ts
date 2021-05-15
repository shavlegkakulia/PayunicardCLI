import { DEV_API_URL, PROD_API_URL, PROD_API_CONNECT_URL, DEV_API_CONNECT_URL } from '@env';
const devEnvironmentVariables = {
    API_URL: DEV_API_URL,
    CONNECT_URL: PROD_API_CONNECT_URL
} 
 
const prodEnvironmentVariables = {
    API_URL: PROD_API_URL,
    CONNECT_URL: DEV_API_CONNECT_URL
}

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;