import {
  CommandInteraction,
  EmbedFieldData,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js';

export class FieldPaginatorRow extends MessageActionRow {
  private currentPage = 1;

  private previousButton = new MessageButton()
    .setCustomId('next')
    .setLabel('>')
    .setStyle('PRIMARY');

  private nextButton = new MessageButton()
    .setCustomId('previous')
    .setLabel('<')
    .setStyle('PRIMARY');

  constructor(private fields: EmbedFieldData[], private perPage: number = 10) {
    super();
    this.perPage = Math.min(25, this.perPage);
    this.updateDisabledStates();
    this.addComponents([this.previousButton, this, this.nextButton]);
  }

  get canNext(): boolean {
    return this.currentPage * this.perPage > this.fields.length;
  }

  get canPrevious(): boolean {
    return this.currentPage > 1;
  }

  next(): this {
    if (!this.canNext) return this;
    this.currentPage++;
    this.updateDisabledStates();
    return this;
  }

  previous(): this {
    if (!this.canPrevious) return this;
    this.currentPage--;
    this.updateDisabledStates();
    return this;
  }

  currentFields(): EmbedFieldData[] {
    return this.pageFields(this.currentPage);
  }

  collect(
    interaction: CommandInteraction<'cached'>,
    reply: Message<true>
  ): void {
    const collector = reply.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 120000,
      filter: (collected) =>
        collected.customId == this.previousButton.customId ||
        collected.customId === this.nextButton.customId,
    });

    const rowIndex = reply.components.findIndex(
      (row) =>
        row.components.length === 2 &&
        row.components[0].customId === this.previousButton.customId &&
        row.components[1].customId === this.nextButton.customId
    );

    collector.on('collect', async (collected) => {
      const action = collected.customId;
      switch (true) {
        case action === this.nextButton.customId && this.canNext:
          this.next();
          break;
        case action === this.previousButton.customId && this.canPrevious:
          this.previous();
          break;
        default:
          return;
      }

      reply.components[rowIndex] = this;
      await interaction.editReply({
        embeds: reply.embeds,
        components: reply.components,
      });
      return;
    });

    collector.on('end', async () => {
      reply.components[rowIndex] = this;
      await interaction.editReply({
        embeds: reply.embeds,
        components: reply.components,
      });
    });

    collector.on('dispose', async () => {
      reply.components[rowIndex] = this;
      await interaction.editReply({
        embeds: reply.embeds,
        components: reply.components,
      });
    });
  }

  private pageFields(page: number): EmbedFieldData[] {
    const end = page * this.perPage;
    const start = end - this.perPage;
    return this.fields.slice(start, end);
  }

  private updateDisabledStates(): void {
    this.previousButton.setDisabled(this.canPrevious);
    this.nextButton.setDisabled(this.canNext);
  }

  private disable(): void {
    this.previousButton.setDisabled(false);
    this.nextButton.setDisabled(false);
  }
}
