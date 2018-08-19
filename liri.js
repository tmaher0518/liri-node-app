require("dotenv").config();

var keys = require('./keys.js');


// require the spotify npm app
var spotify = require('spotify');

// require the requst npm app
var request = require('request');

// require the file system node app
var fs = require('fs');

// Get input from the command line


// build a new array by removing the first two items
var arguments = process.argv.slice(2);

// grab the action from input
var action = arguments[0];
// grab the data from input
var data = arguments[1];


// Function to append data to log.txt file


function append(append) {
    fs.appendFile('log.txt', append, (err) => {
        if (err) throw err;
    });
}

// Main function

// create a function that takes the input of an action and data.
function doit(action,data) {
    append('\n***** New Search - '+action+' - '+data+' *****\n\n');
    // create a switch case function based on the action from the input
    switch(action) {
        

        // if the action is "spotify-this-song"
        case 'spotify-this-song':
            // use spoify tool to request a search for the track name as the "data" variable
            spotify.search({ type: 'track', query: data }, function(err, results) {
                // if there is an error console log it
                if ( err ) {
                    console.log('Error occurred: ' + err);
                    append('Error: '+err+'\n');
                    return;
                }
                // if there are results
                if (results.tracks.items[0].artists[0].name) {
                    // tell the user the results
                    console.log('Artist Name: '+results.tracks.items[0].artists[0].name);
                    console.log('Song Name: '+results.tracks.items[0].name);
                    console.log('Spotify URL: '+results.tracks.items[0].artists[0].external_urls.spotify);
                    console.log('Album Name: '+results.tracks.items[0].album.name);
                    append('Artist Name: '+results.tracks.items[0].artists[0].name+'\n');
                    append('Song Name: '+results.tracks.items[0].name+'\n');
                    append('Spotify URL: '+results.tracks.items[0].artists[0].external_urls.spotify+'\n');
                    append('Album Name: '+results.tracks.items[0].album.name+'\n');
                
                // if there are no results
                } else {
                    // tell the user to choose a new song
                    console.log('We did not find any results for that song.');
                    append('We did not find any results for that song.\n');
                } 
            });
            // end the switch case here
            break;

        // if the action is "spotify-this-song"
        case 'movie-this':
            // use the request app to send a request to the OMDB api
            request('http://www.omdbapi.com/?t='+data+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
                // if there is no error and a status of 200
                if (!error && response.statusCode == 200) {
                    // convert the result string to actionable JSON
                    body = JSON.parse(body);
                    // console log the specific results that we want
                    // Title
                    console.log('Title: '+body.Title);
                    append('Title: '+body.Title+'\n');
                    // Year
                    console.log('Year: '+body.Year);
                    append('Year: '+body.Year+'\n');
                    // IMDB Rating
                    console.log('IMDB Rating: '+body.imdbRating);
                    append('IMDB Rating: '+body.imdbRating+'\n');
                    // Country
                    console.log('Country: '+body.Country);
                    append('Country: '+body.Country+'\n');
                    // Language
                    console.log('Language: '+body.Language);
                    append('Language: '+body.Language+'\n');
                    // Plot
                    console.log('Short Plot: '+body.Plot);
                    append('Short Plot: '+body.Plot+'\n');
                    // Actors
                    console.log('Actors: '+body.Actors);
                    append('Actors: '+body.Actors+'\n');
                    // Rotten Tomatoes Rating
                    console.log('Rotten Tomatoes Rating: '+body.tomatoUserRating);
                    append('Rotten Tomatoes Rating: '+body.tomatoUserRating+'\n');
                    // Rotton Tomatoes UrL
                    console.log('Rotton Tomatoes URL: '+body.tomatoURL);
                    append('Rotton Tomatoes URL: '+body.tomatoURL+'\n');
                // if there is an error
                } else {
                    // tell the user the error
                    console.log('Error: '+error);
                    append('Error: '+error+'\n');

                }
            })
            // end the switch case here
            break;

        // if the action is "spotify-this-song"
        case 'do-what-it-says':
            // use Node file system to get and read the file
            fs.readFile(data, "utf8", function(err,data){
                // split the info on the file at the comma
                var array = data.split(',');
                // create new variables with the array data
                var fileAction = array[0];
                var fileData = array[1];
                // run the main function again with the data from the file.
                doit(fileAction,fileData);
            });
            // end switch case here
            break;
        // if the action does not meet any case
        default:
            // ask them to submit a valid action
            console.log('That is not a valid action.');
            append('That is not a valid action.\n');
    }
}

// Run function with the initial action and data

doit(action,data);
