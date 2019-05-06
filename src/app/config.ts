
// const baseUrl = "https://raoinfotech-conduct.tk:4001/";
const baseUrl = "http://132.140.160.61:4001/";
// const baseUrl = "http://localhost:4001/";

// const baseUrl = "https://raoinfotech-conduct.tk:4001/";
// const baseUrl = "http://132.140.160.61:4001/";
// const baseUrl = "http://localhost:4001/";
// const baseUrl = "http://192.168.43.66:4001/";



const baseMediaUrl = "https://raoinfotech-conduct.tk/server/uploads/";

export const config = {
    baseApiUrl: baseUrl,
    baseMediaUrl: baseMediaUrl,
    "priorityList": [
    // { id: "1", value: 'low', colorCode: 'blue' },
    { id: "2", value: 'medium', colorCode: 'yellow' },
    { id: "3", value: 'high', colorCode: 'red' }
    ],
    "statuslist": [
    { id: "1", value: 'to do', colorCode: 'primary' },
    // { id: "2", value: 'in progress', colorCode: 'info' },
    { id: "3", value: 'testing', colorCode: 'warning' },
    { id: "4", value: 'complete', colorCode: 'success' }
    ],
}
