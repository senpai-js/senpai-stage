export interface IFontSourceMap {
  [name: string]: {
    otf?: string;
    ttf?: string;
    woff?: string;
    woff2?: string;
    eot?: string;
    svg?: string;
  };
}

export async function loadFonts(index: IFontSourceMap): Promise<void> {
  await Promise.all(
    Object.entries(index).map(async ([name, src]) => {
      const response = await fetch(
        src.otf
        || src.ttf
        || src.woff
        || src.woff2
        || src.svg
        || src.eot,
      );
      const buffer = await response.arrayBuffer();
      const font = new FontFace(name, buffer);
      await font.loaded;
      document.fonts.add(font);
    }),
  );
}
