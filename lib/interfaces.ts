/**
 * Configuration definition of a feed. Used "key" instead of "id" because too many "id" fields
 */
export interface ConfigFeed {
  key: string;
  url: string;
  enabled: boolean;
}

export interface ExcludeItem {
  key: string;
  itemId: string;
  createdOn: string;
}

/**
 * Feed shape for dispolay
 */
export interface DisplayFeed {
  key: string;
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
