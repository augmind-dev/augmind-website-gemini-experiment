The phone menu, also called a hamburger menu: one "Menu" button that opens the four links as a list.

Shown below 721px. The button carries the three-bar icon and the word "Menu"; open, it shows a cross and "Close". It is a disclosure (`aria-expanded`, `aria-controls`), not a dialog: the list opens inside the header and pushes the page down. Escape closes it and returns focus to the button; choosing a link closes it. Links are 52px tall.

Without script the button is hidden and the links stay in a row under the logo.

You provide: nothing new; it reuses the Header links.

Don't: hide the word and leave the icon alone; trap focus; cover the page with an overlay.
