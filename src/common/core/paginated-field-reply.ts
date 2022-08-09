import {
  CommandInteraction,
  EmbedField,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageEmbed,
} from 'discord.js';
import { PaginationActionRow } from './pagination-action-row';
export class PaginatedFieldReply implements InteractionReplyOptions {
  readonly fetchReply = true;
  private pages: number;
  private buttonRow: PaginationActionRow;
  private allFields: EmbedField[];

  embeds: MessageEmbed[];
  components: MessageActionRow[];

  constructor(
    private embed: MessageEmbed,
    private interaction: CommandInteraction<'cached'>,
    public ephemeral: boolean,
    private perPage: number = 5
  ) {
    this.embeds = [this.embed];
    this.allFields = [...embed.fields];
    this.perPage = Math.min(25, this.perPage);
    this.pages = Math.ceil(this.allFields.length / this.perPage);
    this.buttonRow = new PaginationActionRow(this.pages);
    this.updateEmbeds();
    this.components = this.hasPages ? [this.buttonRow] : [];
  }

  private get hasPages(): boolean {
    return this.pages > 1;
  }

  async send(): Promise<Message<true>> {
    const reply = await this.interaction.reply(this);
    this.collectFrom(reply);
    return reply;
  }

  collectFrom(reply: Message<true>): void {
    const collector = this.buttonRow.collect(reply);

    collector.on('collect', () => {
      return this.updatePages();
    });

    collector.on('end', async () => {
      await this.disable();
    });

    collector.on('dispose', async () => {
      await this.disable();
    });
  }

  private async updatePages(): Promise<void> {
    this.updateEmbeds();
    await this.interaction.editReply(this);
  }

  private async disable(): Promise<void> {
    this.buttonRow.disable();
    await this.interaction.editReply(this);
  }

  private updateEmbeds(): void {
    const end = this.buttonRow.currentPage * this.perPage;
    const start = end - this.perPage;
    this.embed.setFields(this.allFields.slice(start, end));
  }
}
