export class EnvUtils {
  static get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}
