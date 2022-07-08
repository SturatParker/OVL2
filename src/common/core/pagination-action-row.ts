import { MessageActionRow, MessageButton } from 'discord.js';

export class PaginationActionRow extends MessageActionRow {
  currentPage = 1;
  readonly previousId = 'previous';
  readonly nextId = 'next';

  private previousButton = new MessageButton()
    .setCustomId(this.previousId)
    .setLabel('<')
    .setStyle('PRIMARY');

  private nextButton = new MessageButton()
    .setCustomId(this.nextId)
    .setLabel('>')
    .setStyle('PRIMARY');

  constructor(private pages: number) {
    super();
    this.setDisabledStates();
    this.addComponents(this.previousButton, this.nextButton);
  }

  get canNext(): boolean {
    return this.currentPage < this.pages;
  }

  get canPrevious(): boolean {
    return this.currentPage > 1;
  }

  next(): this {
    if (!this.canNext) return this;
    this.currentPage++;
    this.setDisabledStates();
    return this;
  }
  previous(): this {
    if (!this.canPrevious) return this;
    this.currentPage--;
    this.setDisabledStates();
    return this;
  }

  private setDisabledStates(): void {
    this.previousButton.setDisabled(!this.canPrevious);
    this.nextButton.setDisabled(!this.canNext);
  }

  disable(): this {
    this.previousButton.setDisabled(true);
    this.nextButton.setDisabled(true);
    return this;
  }
}
