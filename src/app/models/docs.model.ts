type DocType = 'ts' | 'html' | 'scss' | 'css' | 'json' | 'md';
export type DocFile = {
  name: string;
  content: string;
  type: DocType;
}
export type Doc = {
  header: string;
  // description: string;
  component: any;
  files: DocFile[]
}
