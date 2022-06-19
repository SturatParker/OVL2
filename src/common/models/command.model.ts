import { APIMessage } from 'discord-api-types/v9';
import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
} from 'discord.js';
import { CommandData } from '../types/CommandData.type';

export class Command<Data extends CommandData = any> {
  constructor(
    public data: Data,
    private callback: (
      this: Command<Data>,
      interaction: CommandInteraction
    ) => Promise<void>
  ) {}
  get name(): string {
    return this.data.name;
  }
  execute(interaction: CommandInteraction): Promise<void> {
    return this.callback(interaction);
  }

  get isSubcommand(): boolean {
    return this.data.type === 'SUB_COMMAND';
  }

  get isSubcommandGroup(): boolean {
    return this.data.type === 'SUB_COMMAND_GROUP';
  }

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
}
