// Requires section
var Plugin = require.main.require("./classes/plugin.class.js");
var Command = require.main.require("./classes/command.class.js");
var ResourceManager = require.main.require("./classes/resource-manager.class.js");
var resources = require.main.require("./resources.js");
var functions = require.main.require("./functions.js");
var i18n = functions.i18n;

var rm = new ResourceManager(require('path').dirname(require.main.filename) + '/assets/audio/', resources);

// Main code section
function playSound(fParams, args, callback) {
    var message = fParams.message;
    if (args.length > 0) {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    //message.reply('I have successfully connected to the channel!');
                    var file = "";
                    var rName = args[0];
                    //var resources = [{'name': 'pelele', 'file': 'junkrat-pelele.ogg'}];
                    file = rm.getResourcePath(rName);
                    console.log(i18n.__("plugin.playAudio.log.playingFile", file));
                    // file not empty check
                    const dispatcher = connection.playFile(file);
                    dispatcher.on('end', () => {
                        connection.disconnect();
                    });
                    dispatcher.on('error', e => {
                        // Catch any errors that may arise
                        console.log(e);
                    });

                })
                .catch(console.log);
        } else {
            // No voice channel
            callback(new Error(i18n.__("plugin.playAudio.error.noVoiceChannel") /*'You need to join a voice channel first!'*/ ));
            return;
        }
    } else {
        // No args
        callback(new Error(i18n.__("plugin.playAudio.error.noAudio") /*'No audio selected!'*/ ));
        return;
    }
    callback(null, "");
}

var playAudioArgs = [{
    "tag": i18n.__("plugin.playAudio.args.audio.tag"),
    "desc": i18n.__("plugin.playAudio.args.audio.desc") + "\n\n\t**" + i18n.__("argsPossibleValues") + "**\n\t\t`" + rm.getResourceList().join("`\n\t\t`") + "`",
    "optional": false
}];


var commands = [];
var eventHandlers = [];

var playAudioCmd = new Command('audio', i18n.__("plugin.playAudio.desc") /*'Reproduce el audio indicado por tu canal de voz actual.'*/ , playSound, 0, [], playAudioArgs);
commands.push(playAudioCmd);

var playAudio = new Plugin(commands, eventHandlers);


// Exports section
module.exports = playAudio;