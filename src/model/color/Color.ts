/**
 * This class represents a color in hex format.
 * @public
 */
export class Color {
  /**
   * A valid string that represents a color in hex format.
   * @public
   */
  public readonly color: string

  private constructor(color: string) {
    this.color = this.mapColor(color)
    this.assertHexColor()
  }

  /**
   * Creates an instance of {@link Color} class. Before creating an instance of
   * {@link Color} class, it (if applicable) maps CI status into the hex color,
   * and also validates color parameter to be a valid string that represents a
   * color in hex format.
   * @param color - Can be either undefined, valid color in hex format or GitHub
   * CI status (one of: success, failure, cancelled, skipped).
   * @returns An instance of {@link Color} or undefined if color parameter is falsy.
   * @public
   */
  public static from(color: string | undefined): Color | undefined {
    return color ? new Color(color) : undefined
  }

  private assertHexColor(): void {
    if (this.color) {
      const hexColorRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/

      if (!hexColorRegex.test(this.color)) {
        throw new Error(`Invalid hex color: "${this.color}"`)
      }
    }
  }

  private mapColor(from: string): string {
    const map = new Map<string, string>([
      ['success', '#008000'],
      ['failure', '#ff0000'],
      ['cancelled', '#0047ab'],
      ['skipped', '#808080'],
    ])
    return map.get(from) ?? from
  }
}
