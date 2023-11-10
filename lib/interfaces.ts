
// change id to key
export interface ConfigFeed {
  id: string;
  url: string;
  enabled: boolean;
}

/**
 * Feed shape for dispolay
 */

// add key
export interface DisplayFeed {
  id: string;
  title: string;
  type: string;
  published: string;
  items: Item[];
  link?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  published: string;
  link?: string;
}
