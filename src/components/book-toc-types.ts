export interface BookToc {
  toc: {
    headline?: string;
    contents?: {
      title: string;
      url: string;
      pageNumber?: string | null;
    }[];
  }[];
}
