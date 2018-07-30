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
