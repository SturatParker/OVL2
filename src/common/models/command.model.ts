import {
  APIMessage,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9';
import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
} from 'discord.js';
import { CommandDefinition } from '../types/command-definition.type';

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

  static notYetImplemented(interaction: CommandInteraction): Promise<void> {
    return interaction.reply({
      content: 'Sorry, not yet implemented',
      ephemeral: true,
    });
  }

  public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
    return this.data.toJSON();
  }
}
