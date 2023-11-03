const axios = require("axios");
const API_KEY = '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';

function callApi(apiName, data) {
    return axios({
        data,
        method: data? 'post' : 'get',
        url: `https://api.openai.com/v1/${apiName}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
    })
        .then(response => response.data)
        .catch(error => (console.log(error), error.response.data));
}

async function completions() {
    const answer = await callApi('completions', {
        model: "text-davinci-003",
        prompt: "Say this is a test",
        max_tokens: 7,
        temperature: 0
    });
    console.log('completions: \n', answer);
}

async function models() {
    const answer = await callApi('models');
    console.log('models: \n', answer);
}

async function retrieveModel() {
    const answer = await callApi('models/text-davinci-003');
    console.log('retrieveModel: \n', answer);
}

async function edits() {
    const answer = await callApi('edits', {
        model: "text-davinci-edit-001", // code-davinci-edit-001
        input: "What day of the wek is it?",
        instruction: "Fix the spelling mistakes"
    });
    console.log('edits: \n', answer);
}

async function imagesGenerations() {
    const answer = await callApi('images/generations', {
        prompt: "雪景",
        n: 2,
        size: "1024x1024", //256x256, 512x512, or 1024x1024
        response_format: 'url' //b64_json
    });
    console.log('imagesGenerations: \n', answer);
}

// images/edits
// images/variations

// completions();
// models();
// retrieveModel();
// edits();
imagesGenerations();
