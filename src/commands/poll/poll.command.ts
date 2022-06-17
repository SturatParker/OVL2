import { CommandInteraction } from 'discord.js';
import { Command } from '../../common/models/command.model';
import { pollDefinition } from './poll.definition';

export const poll = new Command(
  pollDefinition,
  (interaction: CommandInteraction): Promise<void> => {
    this;
    const options = interaction.options;
    const subcommandName = options.getSubcommand();
    const replyFn = Command.getInteractionReplyFn(interaction);
    const channel = options.getChannel('channel');

    switch (subcommandName) {
      case 'set':
        const maxVotes = options.getInteger('maxVotes');
        const maxSelfVotes = options.getInteger('maxSelfVotes');
        return void replyFn({
          content: `Poll tracking enabled in <#${channel.id}>`,
          ephemeral: true,
        });
        break;
      case 'unset':
        return void replyFn({
          content: `Poll tracking disabled in <#${channel.id}>`,
          ephemeral: true,
        });
        break;
      case 'open':
        return void replyFn({
          content: `Opened voting in <#${channel.id}>`,
          ephemeral: true,
        });
        break;
      case 'close':
        return void replyFn({
          content: `Closed voting in <#${channel.id}>`,
          ephemeral: true,
        });
        break;
      case 'shuffle':
        return void replyFn({
          content: `Shuffling in <#${channel.id}>`,
          ephemeral: true,
        });
        break;
      case 'winner':
        return void replyFn({
          content: `Winner of <#${channel.id}> is \${topSubmission.toString()}`,
          ephemeral: true,
        });
        break;
      case 'random':
        return void replyFn({
          content: `Randomly selected winner of <#${channel.id}> is \${randomSubmission.toString()}`,
          ephemeral: true,
        });
        break;
      default:
        break;
    }
    return;
  }
);
