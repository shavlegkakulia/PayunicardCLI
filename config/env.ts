import { DEV_API_URL, PROD_API_URL } from '@env';

const devEnvironmentVariables = {
    API_URL: DEV_API_URL
}

const prodEnvironmentVariables = {
    API_URL: PROD_API_URL
}

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;