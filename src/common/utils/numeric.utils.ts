export class Numeric {
  static toOrdinal(value: number): string {
    value = Math.floor(value);
    const remainder = value % 10;
    switch (remainder) {
      case 1:
        return `${value}st`;
      case 2:
        return `${value}nd`;
      case 3:
        return `${value}rd`;
      default:
        return `${value}th`;
    }
  }

  static toMedal(value: number): string {
    value = Math.floor(value);
    switch (value) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return Numeric.toOrdinal(value);
    }
  }
}
