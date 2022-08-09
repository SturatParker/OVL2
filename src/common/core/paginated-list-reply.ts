import {
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageEmbed,
} from 'discord.js';
import { PaginationActionRow } from './pagination-action-row';

export class PaginatedListReply {
  private header: string;
  private paginationButtonRow: PaginationActionRow;

  constructor(
    private interaction: CommandInteraction<'cached'>,
    private embed: MessageEmbed,
    private items: string[],
    private perPage: number = 5
  ) {
    this.header = embed.description ?? '';
    this.paginationButtonRow = new PaginationActionRow(this.pageCount);
  }

  private get pageCount(): number {
    return Math.ceil(this.items.length / this.perPage);
  }
  private get hasPages(): boolean {
    return this.pageCount > 1;
  }

  private get components(): MessageActionRow[] {
    return this.hasPages ? [this.paginationButtonRow] : [];
  }

  getPage(): string {
    const pageIndex = this.paginationButtonRow.currentPage;
    const endIndex = pageIndex * this.perPage;
    const startIndex = endIndex - this.perPage;
    return this.items.slice(startIndex, endIndex).join(`\n`);
  }

  getReplyPayload(): InteractionReplyOptions {
    const description = `${this.header}\n\n${this.getPage()}`;
    this.embed.setDescription(description);
    this.embed.setFooter({
      text: `Page ${this.paginationButtonRow.currentPage} of ${this.pageCount}`,
    });
    return {
      embeds: [this.embed],
      components: this.components,
    };
  }

  public async send(ephemeral?: boolean): Promise<Message> {
    const reply = await this.interaction.reply({
      ...this.getReplyPayload(),
      fetchReply: true,
      ephemeral,
    });
    this.collectPaginationActions(reply);
    return reply;
  }

  private update(): Promise<Message> {
    return this.interaction.editReply(this.getReplyPayload());
  }

  private disable(): Promise<Message> {
    this.paginationButtonRow.disable();
    return this.update();
  }

  private collectPaginationActions(message: Message<true>): void {
    const collector = this.paginationButtonRow.collect(message);

    collector.on('collect', async () => {
      await this.update();
    });

    collector.on('end', async () => {
      await this.disable();
    });

    collector.on('dispose', async () => {
      await this.disable();
    });
  }
}
