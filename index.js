//only checking this key in because it's for an assignment
const key = 'AlO84VB685pEGDtDVHnOc8ggaoGXKOQNpx4RAz07';
const parksEndpoint = 'https://developer.nps.gov/api/v1/parks';

//format query parameters to be match API documentation
function formatQueryParams(params){
    console.log(`formatQueryParams ran`);
    const queryItems = Object.keys(params).map(key=> `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//show national parks by state to user
function displayResults(responseJson){
    console.log(`displayResults Ran`);
    console.log(responseJson);
    $('#search-results').empty();
    for(i = 0; i < responseJson.data.length; i++){
        $('#search-results').append(`
        <h2>${responseJson.data[i].fullName}</h2>
        <ul>
            <li>${responseJson.data[i].description}</li>
            <li><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></li>
        </ul>`);
    }
    $('#search-results').removeClass('hidden');
}

//fetch national parks by state data up to a certain limit using nps API
function getParks(state, maxResults){
    console.log(`getParks ran`);
    //will be used to build query parametrrs
    const params = {
        api_key: key,
        stateCode: state,
        limit: maxResults
    };
    //build URL
    const queryString = formatQueryParams(params);
    const url = parksEndpoint + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok){ 
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
           $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

//grab user's selection for which state they want to see national park data for and how many results
function watchForm(){
    $('#search-form').submit(event => {
        event.preventDefault();
        console.log('watchForm ran');
        const state = $('#state').val();
        const maxResults = $('#maxResults').val();
        getParks(state, maxResults);
      //  $('#search-form')[0].reset(); //removed this so it's easier for user to tell which state they're looking at
    })
}

$(watchForm);