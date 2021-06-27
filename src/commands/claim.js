const { ALREADY_HAS_ROLE, ALREADY_CLAIMED, PUNT_TO_DM, MEMBER_ROLE_DOES_NOT_EXIST, informOfficer } = require('../copy');
const { fetchRoles } = require("../util");
const Cache = require('../cache');
const mongoose = require('mongoose');
const { DiscordAPIError } = require('discord.js');

module.exports = {
	name: 'claim',
	description: 'use to claim your Membership role.',
	async execute(message) {
		// Check if member role exists. If not, shout out to an officer.
		const [memberRole, officerRole] = fetchRoles(message);
		if (memberRole === undefined) {
			await message.reply(MEMBER_ROLE_DOES_NOT_EXIST);
			if (officerRole) await message.channel.send(informOfficer(officerRole));
			return;
		}

		// Check if user already has role, if so, exit.
		if (message.member.roles.cache.has(role.id)) {
			await message.reply(ALREADY_HAS_ROLE);
			return;
		}

		// Check if user already in cache, if so, grant role and exit.
		if (await Cache.exists({ discordId: { $eq : message.author.id } })) {
			await message.member.roles.add(role);
			await message.reply(ALREADY_CLAIMED);
			return;
		}

		// Otherwise, send DM for PSID and exit.
		await message.reply(PUNT_TO_DM);
		await message.author.send(PSID_PROMPT_QUALIFIER);
		await message.author.send(PSID_PROMPT);
		await message.author.send(INPUT_EXAMPLE);
	},
};