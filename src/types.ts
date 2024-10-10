export interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
  parentId: string;
}

export interface Topic {
  id: string;
  name: string;
  color: string;
}

export interface ParentNode {
  id: string;
}