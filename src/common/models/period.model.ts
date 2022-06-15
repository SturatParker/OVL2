export class Period {
  public readonly days: number;
  public readonly months: number;
  public readonly years: number;

  constructor(private firstDate: Date, private secondDate: Date) {
    const [earlier, later] = [firstDate, secondDate].sort((a, b) => {
      return b.getTime() - a.getTime();
    });
    let dday = earlier.getDate() - later.getDate();
    let dmonth = earlier.getMonth() - later.getMonth();
    if (dday < 0) {
      dmonth--;
      const daysInMonth = new Date(
        earlier.getFullYear(),
        earlier.getMonth(),
        0
      ).getDate();
      dday += daysInMonth;
    }
    let dyear = earlier.getFullYear() - later.getFullYear();
    if (dmonth < 0) {
      dyear--;
      dmonth += 12;
    }
    this.days = dday;
    this.months = dmonth;
    this.years = dyear;
  }

  public toString(): string {
    const ageStrings: string[] = [];
    if (this.years) ageStrings.push(`${this.years} Years`);
    if (ageStrings.length || this.months)
      ageStrings.push(`${this.months} Months`);
    ageStrings.push(`${this.days} days`);

    return ageStrings.join(' ');
  }
}
