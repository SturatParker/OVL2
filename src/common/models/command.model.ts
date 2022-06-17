import { APIMessage } from 'discord-api-types/v9';
import {
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  CommandInteraction,
  InteractionReplyOptions,
  Message,
} from 'discord.js';

export class Command<
  Data extends ApplicationCommandSubGroupData | ApplicationCommandSubCommandData
> {
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

  static getInteractionReplyFn(
    interaction: CommandInteraction
  ): (options: InteractionReplyOptions) => Promise<APIMessage | Message> {
    return (options: InteractionReplyOptions): Promise<APIMessage | Message> =>
      interaction.reply({ ...options, fetchReply: true });
  }
}
