import { type Map } from '@/app/types/Map';
import { type MarkdownMatch } from '../types/MarkdownMatch';

export default class MarkdownParser {
  static MARKDOWN_REGEX: Map = {
    h1: `^(#{1}\\s)(.*)$`,
    h2: `^(#{2}\\s)(.*)$`,
    h3: `^(#{3}\\s)(.*)$`,
    h4: `^(#{4}\\s)(.*)$`,
    h5: `^(#{5}\\s)(.*)$`,
    h6: `^(#{6}\\s)(.*)$`,
    boldItalic: `(\\*\\*\\*)(\\S+)(\\*\\*\\*)`,
    boldItalic2: `(\\_\\_\\_)(\\S+)(\\_\\_\\_)`,
    boldItalic3: `(\\*\\_\\_)(\\S+)(\\_\\_\\*)`,
    boldItalic4: `(\\_\\*\\*)(\\S+)(\\*\\*\\_)`,
    bold: `(\\*\\*|\\_\\_)(\\S+)(\\*\\*|\\_\\_)`,
    italic: `(\\*|\\_)(\\S+)(\\*|\\_)`,
    link: `(\\[.*\\])(\\((http)(?:s)?(\\:\\/\\/).*\\))`,
    image: `(\\!)(\\[(?:.*)?\\])(\\(.*(\\.(jpg|png|gif|tiff|bmp))(?:(\\s\\"|\\')(\\w|\\W|\\d)+(\\"|\\'))?\\)`,
    unorderedList: `(^(\\W{1})(\\s)(.*)(?:$)?)+`, // revisar
    orderedList: `(^(\\d+\\.)(\\s)(.*)(?:$)?)+`, //revisar
    blockQuote: `((^(\\>{1})(\\s)(.*)(?:$)?)+`, //revisar
    inlineCode: '(`)(.*)(`)',
    codeBlockInitMark: '^(`{3})$',
    codeBlock: '(`{3}\\n+)(.*)(\\n+`{3})',
    horizontalLane: `^(\\=|\\-|\\*){3}$`,
    email: `(\\<{1})(\\S+@\\S+)(\\>{1})`,
    table: `(((\|)([a-zA-Z\d+\s#!@'"():;\\\/.\[\]\^<={$}>?(?!-))]+))+(\|))(?:\n)?((\|)(-+))+(\|)(\n)((\|)(\W+|\w+|\S+))+(\|$)`, //revisar
  };

  public static matchMarkdownRegex(markdown: string): MarkdownMatch[] {
    let matchResult: MarkdownMatch | null;
    const matchCoincidences: MarkdownMatch[] = [];
    if (
      (matchResult = this.match(
        markdown,
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'unorderedList',
        'orderedList',
        //'blockQuote',
        'inlineCode',
        'codeBlock',
        'horizontalLane'
        //'table'
      ))
    )
      matchCoincidences.push(matchResult);

    if (
      (matchResult = this.match(
        markdown,
        'boldItalic',
        'boldItalic2',
        'boldItalic3',
        'boldItalic4',
        'bold',
        'italic'
      ))
    )
      matchCoincidences.push(matchResult);

    if ((matchResult = this.match(markdown, 'link')))
      matchCoincidences.push(matchResult);

    // if ((matchResult = this.match(markdown, 'image')))
    //   matchCoincidences.push(matchResult);

    return matchCoincidences;
  }

  static match(input: string, ...regexList: string[]): MarkdownMatch | null {
    let matchResult;
    for (let regex of regexList) {
      if ((matchResult = input.match(MarkdownParser.MARKDOWN_REGEX[regex]))) {
        return {
          type: regex,
          index: matchResult.index ?? -1,
          length: matchResult[0].length,
          content: matchResult[0],
        };
      }
    }
    return null;
  }
}
