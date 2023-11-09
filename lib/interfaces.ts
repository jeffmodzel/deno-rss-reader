export interface ConfigFeed {
  id: string;
  url: string;
  enabled: boolean;
}

/**
 * Feed shape for dispolay
 */
export interface DisplayFeed {
  id: string;
  title: string;
  type: string;
  items: Item[];
}

export interface Item {
  id: string;
  title: string;
  description: string;
}
