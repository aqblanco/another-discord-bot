// Requires section
var Command = require.main.require("./classes/command.class.js");

// Main code section
function getLogs(fParams, args, callback) {
    // Warcraft Logs api
    const api = require('weasel.js');

    // Set the public WCL api-key that you get from https://www.warcraftlogs.com/accounts/changeuser 
    api.setApiKey('56503c747edc90d3caffd50accab1237');

    // Optional parameters for the api call. 
    var params = {};

    // Call the function to list guild reports, can be filtered on start time and end time as a UNIX timestamp with the optional parameters @params. 
    api.getReportsGuild('Rue del Percebe', 'cthun', 'eu', params, function(err, data) {
        if (err) {
            //We caught an error, log the error object to the console and exit. 
            console.log(err);
            return;
        }
        // Success, log the whole data object to the console. 
        var lastN = 5;
        var logsObj = data.slice(-lastN);
        var logInfo = [];
        logsObj.forEach(function(e) {
            var d = new Date(e.start);
            var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            var date = d.toLocaleString('es-ES', options);
            var info = [{
                name: e.title + " - https://www.warcraftlogs.com/reports/" + e.id,
                value: "Log del **" + date + "** por **" + e.owner + "**"
            }];
            logInfo = logInfo.concat(info);
        })

        var embedMsg = {
            author: {
                name: "WarCraft Logs",
                icon_url: "https://www.warcraftlogs.com/img/warcraft/header-logo.png"
            },
            color: 3447003,
            title: "Rue del Percebe en WarCraft Logs",
            url: "https://www.warcraftlogs.com/guilds/154273",
            fields: logInfo,
        };
        callback(embedMsg, true);
    });
}

var getLogs = new Command('logs', 'Obtiene los últimos logs de Warcraft Logs', getLogs);


// Exports section
module.exports = getLogs;