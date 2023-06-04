export interface BookTocContents {
  [key: string]: {
    title: string;
    url: string;
    pageNumber?: number | null;
  }

}

export interface BookToc {
  toc: [
    {
      headline?: string;
      contents?: BookTocContents;
    }
  ];
}
