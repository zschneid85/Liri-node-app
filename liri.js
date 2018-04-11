//Grabs the keys from keys.js file
require("dotenv").config();

var keys = require("./keys.js");
//requiring twitter npm
var Twitter = require('twitter');
//requiring spotify npm
var Spotify = require('node-spotify-api');
//requiring request npm
var request = require("request");
//requiring fs npm
var fs = require("fs");



//Gets all of the keys from the keys.js file
var spotify = new Spotify(keys.spotify);
var keyList = new Twitter(keys.twitter);

//Takes in argument which will be an action telling liri what to do
var action = process.argv[2];
console.log(action);

//Assigning movie if nothing is entered
// if (action === undefined){
//  	console.log("Please input an action")
// } else{

// }
//Takes in argument which will be a song for the spotify command
var parameter = process.argv[3];

//Runs the if statement to check which command to run
command();
log();



//Creating a switch-case statement. This will direct which function gets to run.
function command() {

	switch (action) {
		case "my-tweets":
			tweet();
			break;

		case "spotify-this-song":
			thisSpotify();
			break;

		case "movie-this":
			movie();
			break;

		case "do-what-it-says":
			justDoIt();
			break;
	}
}

//if the function tweet is called
function tweet() {
	//What screen name do you want it to search through
	var params = { screen_name: 'MrMulletWatch' };
	keyList.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (!error) {
			//for loop to run through and print only the tweet and time created at
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].created_at + ": " + tweets[i].text);
			}
		}
	});
}

//if the function spotify is called
function thisSpotify() {
	//Assigning movie if nothing is entered


	if (parameter === "") {
		parameter = "The sign by ace of base";
		//console.log("blank input")
	} else {
		//console.log("Song entered")
	}



	spotify.search({ type: 'track', query: parameter }, function (err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		}
		else if (!err) {
			console.log(data.tracks.items[0].artists[0].name);
			console.log(data.tracks.items[0].name);
			console.log(data.tracks.items[0].preview_url);
			console.log(data.tracks.items[0].album.name);
		}

	});
}

//if the function movie is called
function movie() {
	//Assigning movie if nothing is entered
	if (parameter === "") {
		parameter = "Mr. Nobody";
		console.log("blank input");
	} else {
		console.log("Song entered");
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&tomatoes=True&apikey=trilogy";

	request(queryUrl, function (error, response, body) {


		// If the request is successful
		if (!error && response.statusCode === 200) {

			// Parse the body of the site and recover just the imdbRating
			// (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
			console.log("Production Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
		}
	});
}

//if the function justDoIT is called
function justDoIt() {

	// This block of code will read from the "random.txt" file.
	// The code will store the contents of the reading inside the variable "data"
	fs.readFile("random.txt", "utf8", function (error, data) {

		//split it by commas (to make it more readable)
		var dataArr = data.split(",");
		console.log(dataArr);

		var randomCommand = dataArr[0];
		parameter = dataArr[1];

		switch (parameter) {
			case "my-tweets":
				tweet();
				break;

			case "spotify-this-song":
				thisSpotify();
				break;

			case "movie-this":
				movie();
				break;

			case "do-what-it-says":
				justDoIt();
				break;
		}

	});

}


function log() {

	action = "Log Action: " + action + "\n";

	fs.appendFile('log.txt', action, function (err) {

		// If an error was experienced we say it.
		if (err) {
			console.log(err);
		}

		// If no error is experienced, we'll log the phrase "Content Added" to our node console.
		else {
			console.log("Content Added!");
		}

	});

}
