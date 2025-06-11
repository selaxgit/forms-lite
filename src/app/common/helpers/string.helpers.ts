export class StringHelpers {
  public static uuidv4(): string {
    const FOUR = 4;
    const FIFTEEN = 15;
    const SIXTEEN = 16;
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (char: string) => {
      const charNumber = Number(char);
      return document.defaultView
        ? (
            charNumber ^
            (document.defaultView.crypto.getRandomValues(new Uint8Array(1))[0] & (FIFTEEN >> (charNumber / FOUR)))
          ).toString(SIXTEEN)
        : char;
    });
  }
}
