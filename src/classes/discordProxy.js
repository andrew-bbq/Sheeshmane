class DiscordProxy {
    constructor (client, unimportant, important) {
        this.client = client;
        this.unimportant = unimportant;
        this.important = important;

        this.client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });

        this.setupReactionAddTrigger();
        this.setupReactionRemoveTrigger();
        this.setupMsgReceiveTrigger();
    }

    setupReactionAddTrigger() {
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (exception) {
                    console.error(exception);
                    return;
                }
            }
            if (this.checkReactions(reaction.message)) {
                this.propagateMessage(reaction.message);
            }
        });
    }

    setupReactionRemoveTrigger() {
        this.client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (exception) {
                    console.error(exception);
                    return;
                }
            }
            if (this.checkReactions(reaction.message)) {
                this.propagateMessage(reaction.message);
            }
        });
    }

    setupMsgReceiveTrigger() {
        this.client.on('messageCreate', msg => {
            // if message has a link and is in unimportant channel, add emojis
            if ((msg.content.includes(".com/") || msg.content.includes("youtu.be") || msg.content.includes('.org/')) && msg.channelId == this.unimportant) {
                msg.react("💯");
                msg.react("💩");
            }
        });
    }

    // return true if important reaction is greater than 
    checkReactions (message) {
        if (message.channelId != this.unimportant) {
            return false;
        }
        const imp_reacts = message.reactions.cache.get("💯");
        const unimp_reacts = message.reactions.cache.get("💩");
        const imp_count = imp_reacts ? imp_reacts.count : 0;
        const unimp_count = unimp_reacts ? unimp_reacts.count : 0;
        return ((imp_count - unimp_count) >= 5);
    }

    propagateMessage (message) {
        const channel = this.client.channels.cache.get(this.important);
        channel.messages.fetch({ limit: 100 }).then(msgs => {
            let exit = false;
            msgs.forEach(msg => {
                if (msg.content.includes(message.content)) {
                    exit = true;
                }
            });
            if ( exit ) return false;
            channel.send(message.content + ", submitted by <@" + message.author + ">");
            return true;
        });
    }
}

module.exports = {DiscordProxy};