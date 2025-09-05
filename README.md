# My Website

A modern, responsive website with three pages: Home, About, and Shop.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with Poppins font
- **Admin Panel**: Easy content management without editing code
- **Dynamic Content**: JSON-based backend for easy updates

## Pages

### Home Page
- Hero section with customizable image and description
- Perfect for announcements and updates

### About Page
- Personal information and story
- Clean, readable layout

### Shop Page
- Product showcase with images and descriptions
- Robux pricing display
- Buy buttons for each item

## Admin Panel

The website includes a built-in admin panel that allows you to:

1. **Update Home Content**: Change the hero image, title, and description
2. **Manage Products**: Add, edit, or remove shop items
3. **Export/Import Data**: Backup and restore your content

### How to Use the Admin Panel

1. Look for the "ADMIN" button on the right side of the screen
2. Click it to open the admin panel
3. Make your changes and click the appropriate update buttons
4. Changes are automatically saved to your browser's local storage

## File Structure

```
MyWebsite2/
├── index.html          # Home page
├── about.html          # About page
├── shop.html           # Shop page
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── data/
│   └── content.json    # Sample content data
└── README.md           # This file
```

## Customization

### Adding Your Own Images
1. Place your images in the `data/` folder
2. Update the image URLs in the admin panel
3. Or use external image URLs

### Styling
- Edit `styles.css` to change colors, fonts, or layout
- The design uses CSS Grid and Flexbox for responsive layouts

### Content
- Use the admin panel for easy content management
- Or edit `data/content.json` directly for bulk changes

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Getting Started

1. Open `index.html` in your web browser
2. Navigate between pages using the navbar
3. Click the "ADMIN" button to manage content
4. Customize your content and enjoy your new website!

## Tips

- The admin panel saves data to your browser's local storage
- Use the Export/Import feature to backup your content
- All placeholder images can be replaced with your own
- The design is fully responsive and will work on any device
