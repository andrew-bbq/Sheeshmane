const { DiscordProxy } = require("../../src/classes/discordProxy");
const Discord = require('discord.js');
const mockClient = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS]
});

let proxy;

class MockMessage {
    constructor () {
        this.message = {reactions: {cache: new Map()}};
    }

    set(key, value) {
        this.message.reactions.cache.set(key, value);
    }
}

beforeEach(() => {
    proxy = new DiscordProxy(mockClient, "frog", "dog");
});

test('if important reactions is x higher than unimportant, check reactions should evaluate to true', () => {
    const mockMessage = {reactions: {cache: new Map()}};
    mockMessage.reactions.cache.set("💯", {count: 6});
    mockMessage.reactions.cache.set("💩", {count: 1});
    const result = proxy.checkReactions(mockMessage);
    expect(result).toBe(true);
});

test('if important reactions is lower than unimportant, check reactions should evaluate to false', () => {
    const mockMessage = {reactions: {cache: new Map()}};
    mockMessage.reactions.cache.set("💯", {count: 6});
    mockMessage.reactions.cache.set("💩", {count: 2});
    const result = proxy.checkReactions(mockMessage);
    expect(result).toBe(false);
});

test('if important reactions is unset, check reactions should evaluate to false', () => {
    const mockMessage = {reactions: {cache: new Map()}};
    mockMessage.reactions.cache.set("💩", {count: 2});
    const result = proxy.checkReactions(mockMessage);
    expect(result).toBe(false);
});

test('if unimportant reactions is unset but lower than threshold, check reactions should evaluate to false', () => {
    const mockMessage = {reactions: {cache: new Map()}};
    mockMessage.reactions.cache.set("💯", {count: 2});
    const result = proxy.checkReactions(mockMessage);
    expect(result).toBe(false);
});

test('if unimportant reactions is unset and above threshold, check reactions should evaluate to true', () => {
    const mockMessage = {reactions: {cache: new Map()}};
    mockMessage.reactions.cache.set("💯", {count: 5});
    const result = proxy.checkReactions(mockMessage);
    expect(result).toBe(true);
});