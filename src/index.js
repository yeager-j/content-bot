import Commando from 'discord.js-commando';
import { oneLine } from 'common-tags';
import * as path from 'path';
import * as sqlite from 'sqlite';
import * as secret from '../secret.json';
import * as npmPackage from '../package.json';

/*
TODO: Review the 'Before Release' checklist.

- Update README
- Update npmPackage
- Update env variable
 */

const env = "DEV";
const client = new Commando.Client({
    owner: '223596463777775617'
});

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        client.user.setGame(`Running v${npmPackage.version}`);
    })
    .on('disconnect', () => {
        console.warn('Disconnected!');
    })
    .on('reconnecting', () => {
        console.warn('Reconnecting...');
    })
    .on('commandError', (cmd, err) => {
        if (err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    });

client.registry
    .registerGroups([
        ['admin', 'Admin'],
        ['general', 'General'],
        ['fun', 'Fun'],
        ['agile', 'Agile'],
        ['music', 'Music']
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open('settings.sqlite3').then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.dispatcher.addInhibitor(msg => {
    let role;

    try {
        role = msg.member.roles.find('name', (env === "DEV" ? 'Testers' : 'Undead'));
    } catch (e) {
        throw new Error('Cannot find role.');
    }

    return !role
});

client.login(secret.token);
