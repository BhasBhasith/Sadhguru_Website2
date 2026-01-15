# Sathguru Babaji Traders Website

A modern, responsive website for Sathguru Babaji Traders - a leading construction company specializing in road construction, layout development, and building materials supply in Coimbatore, The Nilgiris, Erode, and Tirupur districts.

## 📁 Folder Structure

```
sathguru-website/
│
├── index.html              # Main HTML file - contains all page sections
├── README.md               # Project documentation (this file)
│
├── css/
│   └── style.css          # Main stylesheet with all styling and responsive design
│
├── js/
│   └── main.js            # JavaScript file with all interactive features
│
├── images/                 # Directory for image assets
│   └── (add your images here)
│
└── assets/                 # Directory for additional assets
    └── (fonts, icons, etc.)
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone or download** this project to your local machine

2. **Open the website**:
   - Option 1: Simply open `index.html` in your web browser
   - Option 2: Use a local development server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Then navigate to `http://localhost:8000` in your browser

3. **For production deployment**:
   - Upload all files to your web hosting server
   - Ensure the folder structure is maintained
   - Make sure all file paths are correct

## 📋 Features

### Design Features
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern and professional UI/UX
- ✅ Smooth scrolling navigation
- ✅ Interactive image carousel/slider
- ✅ Animated elements on scroll
- ✅ Mobile-friendly hamburger menu
- ✅ Contact form with validation
- ✅ Social media integration ready

### Sections Included
1. **Header & Navigation** - Fixed header with top contact bar
2. **Hero Section** - Image carousel with call-to-action buttons
3. **Features Section** - Key highlights (Quality Materials, Experienced Team, Unique Technologies)
4. **About Section** - Company information with vision/mission tabs
5. **Why Choose Us** - Feature grid with benefits
6. **Services Section** - Four main services (Road Construction, Layout Developer, Sales & Services, Vehicles for Hire)
7. **Cities Section** - Serviceable areas
8. **Team Section** - Team member profiles
9. **Testimonials** - Customer reviews
10. **Contact Section** - Contact form and information
11. **Footer** - Additional links and social media

## 🎨 Customization

### Colors
The website uses CSS custom properties (variables) for easy color customization. Edit the `:root` section in `css/style.css`:

```css
:root {
    --primary-color: #d4af37;      /* Gold/Yellow accent */
    --secondary-color: #1a1a1a;    /* Dark background */
    --accent-color: #2c3e50;      /* Blue-gray */
    /* ... more variables */
}
```

### Content
- Edit `index.html` to update text content, contact information, and sections
- Replace placeholder images in the `images/` folder
- Update service descriptions, team member info, etc.

### Styling
- All styles are in `css/style.css`
- Responsive breakpoints are defined at the bottom of the CSS file
- Modify media queries to adjust responsive behavior

### Functionality
- All JavaScript functionality is in `js/main.js`
- Carousel timing can be adjusted (currently 5 seconds per slide)
- Form submission can be connected to a backend service

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🔧 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons (loaded via CDN)
- **Google Fonts** - Poppins font family (loaded via CDN)

## 📝 File Descriptions

### `index.html`
- Main HTML structure
- Contains all sections and content
- Links to external resources (Font Awesome, Google Fonts)
- References local CSS and JavaScript files

### `css/style.css`
- Complete styling for the entire website
- Responsive design with media queries
- CSS custom properties for easy theming
- Animations and transitions
- Mobile-first approach

### `js/main.js`
- Carousel/slider functionality
- Mobile navigation toggle
- Smooth scrolling
- Active navigation link highlighting
- Scroll-to-top button
- Form handling
- Intersection Observer for scroll animations
- Tab functionality (Vision/Mission)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Contact Information

**Sathguru Babaji Traders**
- Phone: +919080402204
- Email: sathgurubabajitraders@gmail.com
- Address: SF.No:733/5A & SF.No:733/5D, Kurumbanoor, Mettupalayam – 641305

## 🚀 Deployment

### Steps for Production Deployment:

1. **Optimize Images**
   - Compress images in the `images/` folder
   - Use appropriate formats (WebP, optimized JPG/PNG)

2. **Minify Files** (Optional)
   - Minify CSS and JavaScript for better performance
   - Use tools like UglifyJS, CSSNano, or online minifiers

3. **Upload Files**
   - Upload all files maintaining the folder structure
   - Ensure `index.html` is in the root directory

4. **Configure Server**
   - Set up proper MIME types
   - Enable GZIP compression
   - Configure caching headers

5. **Test**
   - Test on multiple devices and browsers
   - Check all links and forms
   - Verify responsive design

## 📄 License

This website template is created for Sathguru Babaji Traders. All rights reserved.

## 🔄 Updates & Maintenance

### To Update Content:
1. Edit `index.html` for text changes
2. Replace images in the `images/` folder
3. Update contact information in the header, contact section, and footer

### To Update Styling:
1. Modify `css/style.css`
2. Adjust colors using CSS variables
3. Modify responsive breakpoints if needed

### To Add Features:
1. Add HTML structure in `index.html`
2. Add styles in `css/style.css`
3. Add functionality in `js/main.js`

## 🐛 Troubleshooting

### Images Not Loading
- Check image file paths in HTML
- Ensure images are in the `images/` folder
- Verify file names match exactly (case-sensitive)

### Styles Not Applying
- Clear browser cache
- Check CSS file path in HTML
- Verify CSS syntax is correct

### JavaScript Not Working
- Check browser console for errors
- Verify JavaScript file path in HTML
- Ensure JavaScript is enabled in browser

### Carousel Not Working
- Check that all carousel elements exist in HTML
- Verify JavaScript is loaded correctly
- Check browser console for errors

## 📚 Additional Resources

- [Font Awesome Icons](https://fontawesome.com/icons)
- [Google Fonts](https://fonts.google.com/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## ✨ Future Enhancements

Potential features to add:
- [ ] Image gallery with lightbox
- [ ] Blog section
- [ ] Project portfolio with filters
- [ ] Multi-language support
- [ ] Backend integration for contact form
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Live chat widget
- [ ] Online quote request form

---

**Developed for Sathguru Babaji Traders**  
*Building The Future - Excellence in Road & Building Construction*


"# Sadhguru_Website1" 
"# Sadhguru_Website1" 
"# Sadhguru_Website1" 
