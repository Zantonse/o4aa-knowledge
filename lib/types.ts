export interface ContentCardData {
  heading: string;
  paragraphs: string[]; // array of plain-text paragraphs — rendered as <p> tags
}

export interface SectionContent {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;           // emoji fallback when PNG icon is missing
  hasDiagram: boolean;
  diagramPrompt: string;  // prompt sent to Gemini for diagram generation
  cards: ContentCardData[];
}

export interface NavSection {
  slug: string;
  label: string;
  icon: string;
  isNew?: boolean;
}

export interface NavGroup {
  groupLabel: string;
  items: NavSection[];
}
