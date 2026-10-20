export enum ElementType {
  HEADER = 'HEADER',
  PARAGRAPH = 'PARAGRAPH',
  BUTTON = 'BUTTON',
  IMAGE = 'IMAGE',
  CONTAINER = 'CONTAINER',
  TWO_COL = 'TWO_COL',
  NAVBAR = 'NAVBAR',
  HERO = 'HERO',
  FEATURES = 'FEATURES',
  GALLERY = 'GALLERY',
  PRODUCT_GRID = 'PRODUCT_GRID',
  CONTACT_FORM = 'CONTACT_FORM',
  FOOTER = 'FOOTER'
}

export interface ElementStyles {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  width?: string;
  height?: string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  gap?: string;
  lineHeight?: string;
  gridTemplateColumns?: string;
  border?: string; // Shorthand or specific
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  boxShadow?: string;
}

export interface EditorElement {
  id: string;
  type: ElementType;
  content: string; // Text content or JSON string for complex blocks
  src?: string; // For images
  alt?: string; // For images
  href?: string; // For links (Buttons, etc)
  styles: ElementStyles;
  children?: EditorElement[]; // For containers/columns
}

export interface Template {
  name: string;
  elements: EditorElement[];
}