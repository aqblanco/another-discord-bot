var Command = require("./command.class.js");

module.exports =
    class discordBot {

        constructor(cmdPrefix) {
            this.commands = [];
            this.cmdPrefix = cmdPrefix;
        }

        reply(message) {
            var functions = require.main.require("./functions.js");
            var formatError = functions.formatError;

            console.log("Comando recibido: " + message.content);
            // Process request string
            var reqArray = message.content.split(/\s+/g);
            var request = reqArray[0];
            var args = [];
            if (reqArray.length > 1) {
                reqArray.splice(0, 1); // Remove command
                args = reqArray;
            }

            var cmd = this.matchCommand(request);
            if (cmd != null) {
                // Send the message object to the command
                cmd.addFParams({ 'message': message });

                cmd.execute(args, function(err, msg, isEmbed = false) {

                    if (err) {
                        console.log(err);
                        // Beautify error message: TODO
                        var embed = formatError(err.message);
                        message.channel.send({ embed })
                            .then(m => console.log('Mensaje enviado: ' + err))
                            .catch(console.error);
                        return;
                    }

                    var formatedMsg;
                    // Correctly generate embed object if needed
                    if (isEmbed) {
                        var embed = msg;
                        formatedMsg = { embed };
                    } else {
                        formatedMsg = msg;
                    };
                    // Filter both empty embed and normal messages
                    if (Object.keys(formatedMsg).length > 0 || formatedMsg.length > 0) {
                        message.channel.send(formatedMsg)
                            .then(m => console.log('Mensaje enviado: ' + JSON.stringify(formatedMsg)))
                            .catch(console.error);
                    }
                });
            } else {
                // Command is not valid
                var err = new Error("Comando no válido. Mencióname y escríbeme ayuda o escribe |rue ayuda para ver la lista de comandos disponibles.");
                var embed = formatError(err.message);
                message.channel.send({ embed })
                    .then(m => console.log('Mensaje enviado: ' + err))
                    .catch(console.error);
                return;
            }
        }

        addCommand(cmd) {
            this.commands.push(cmd);
        }

        matchCommand(cmd) {
            var res = null;
            this.commands.forEach(function(e) {
                if (res === null && e.getLabel() === cmd) {
                    res = e;
                }
            });
            return res;
        }
    }