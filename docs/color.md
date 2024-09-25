# Project Color Palette

This document provides an overview of the color palette used in the project. The following colors have been declared as CSS variables in the `:root` section of the stylesheet for easy customization.

## Palette

| Color Name      | Hex Code    | Description       |
|-----------------|-------------|-------------------|
| Dark Blue       | `#141c34`   | Used as the primary dark background color. |
| White           | `#f6f8ff`   | Primary light color used for text and backgrounds. |
| Dark            | `#000212`   | Deep dark color used for high contrast elements. |
| Light Blue      | `#5f8df7`   | Accent color used for buttons, links, and hover effects. |

## Usage

In your CSS, these colors are accessible via CSS variables, making it easy to apply and maintain consistency across the project:

```css
:root {
  --color-dark-blue: #141c34;
  --color-white: #f6f8ff;
  --color-dark: #000212;
  --color-light-blue: #5f8df7;
}