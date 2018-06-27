// Use this presets array inside your presetHandler
const presets = require('./presets');

// Complete this function:
const presetHandler = (requestType, index, newPresetArray) => {
    let response = [];

    if(requestType === 'PUT' || requestType === 'GET') {
        if (index > 15 || index < 0) {
            response.push('404');
            return response;
        } else {
            response.push('200');
            if (requestType === 'GET') {
                response.push(presets[index]);
                return response;
            } else {
                presets[index] = newPresetArray;
                response.push(presets[index]);
                return response;
            }
        }   
    } else {
        response.push ('400');
        return response;
    }
};

console.log(presets);
console.log(presetHandler('GET', 18, []))
// Leave this line so that your presetHandler function can be used elsewhere:
module.exports = presetHandler;
