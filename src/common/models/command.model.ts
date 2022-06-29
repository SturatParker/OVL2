import {
  APIMessage,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9';
import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  MessageEmbed,
} from 'discord.js';
import { CommandDefinition } from '../types/command-definition.type';
import { ColourUtils } from '../utils/colour.utils';

export abstract class Command {
  constructor(private data: CommandDefinition) {}

  get name(): string {
    return this.data.name;
  }

  abstract execute(interaction: CommandInteraction): Promise<void>;

  getInteractionReplyFn(
    interaction: CommandInteraction
  ): (options: InteractionReplyOptions) => Promise<APIMessage | Message> {
    return (options: InteractionReplyOptions): Promise<APIMessage | Message> =>
      interaction.reply({ ...options, fetchReply: true });
  }

  public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
    return this.data.toJSON();
  }

  protected refuseCommand(
    interaction: CommandInteraction,
    reason: string
  ): Promise<void> {
    const embed = new MessageEmbed({
      title: 'Command failed',
      description: reason,
      color: ColourUtils.error,
      footer: { text: this.name },
      timestamp: new Date(),
    });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  protected notYetImplemented(interaction: CommandInteraction): Promise<void> {
    return this.refuseCommand(
      interaction,
      `Sorry, this command hasn't been implemented yet`
    );
  }
}
