import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v9';

export const poll = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Poll controls')
  .setDMPermission(false)
  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('set')
      .setDescription('Set a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName('max_votes')
          .setDescription(
            'Maximum number of votes each member may cast in this poll'
          )
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName('max_self_votes')
          .setDescription(
            'Maximum number of votes each member may cast for their own submissions in this poll'
          )
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName('max_cancels')
          .setDescription('Maximum number of times a member may cancel a vote')
          .setRequired(true)
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('unset')
      .setDescription('Unset a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('open')
      .setDescription('Open a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('close')
      .setDescription('Suspend voting in a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('shuffle')
      .setDescription('Shuffle items in a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('winner')
      .setDescription('Select the winning entry from a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName('top_n')
          .setDescription('Include the top N entries')
          .setMinValue(1)
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName('random')
      .setDescription('Select a random entry from a poll')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('Channel').setRequired(true)
      )
  );
