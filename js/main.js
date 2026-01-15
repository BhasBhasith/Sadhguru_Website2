// ============================================
// Mobile Navigation Toggle
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// Active Navigation Link on Scroll (for same-page sections)
// ============================================
// Note: This is now handled by page navigation, but kept for any internal section scrolling
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    // Only activate if we're scrolling within the current active page
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    
    const scrollY = window.pageYOffset;
    const activePageSections = activePage.querySelectorAll('section[id]');

    activePageSections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Don't change active nav if it's a page-level link
            const pageHref = `#${sectionId}`;
            if (navPageMap[pageHref]) {
                // This is a page-level link, update it
                updateActiveNavLink(pageHref);
            }
        }
    });
}

// Only listen to scroll for internal section navigation within pages
// window.addEventListener('scroll', activateNavLink);

// ============================================
// Carousel Functionality
// ============================================
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let carouselInterval;

// Function to split h1 text into animated letters
function animateHeaderLetters(slide) {
    const h1 = slide.querySelector('.slide-content h1');
    if (!h1) return;
    
    // Check if already animated
    if (h1.querySelector('.letter')) return;
    
    const text = h1.textContent.trim();
    
    // Clear and rebuild with letter spans, wrapping words to prevent breaking
    h1.innerHTML = '';
    let letterIndex = 0;
    
    // Split text into words
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
        // Create a word container to keep letters together
        const wordContainer = document.createElement('span');
        wordContainer.className = 'word-container';
        wordContainer.style.display = 'inline-block';
        wordContainer.style.whiteSpace = 'nowrap';
        
        // Add each letter of the word
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = char;
            letterSpan.style.animationDelay = `${letterIndex * 0.05}s`;
            wordContainer.appendChild(letterSpan);
            letterIndex++;
        }
        
        h1.appendChild(wordContainer);
        
        // Add space between words (except after last word)
        if (wordIndex < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'letter-space';
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.width = '0.4em';
            spaceSpan.style.display = 'inline-block';
            h1.appendChild(spaceSpan);
        }
    });
}

// Initialize animated letters for all slides
function initAnimatedHeaders() {
    slides.forEach(slide => {
        animateHeaderLetters(slide);
    });
}

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
    
    // Re-animate letters for the active slide
    const activeSlide = slides[index];
    const h1 = activeSlide.querySelector('.slide-content h1');
    if (h1) {
        // Reset animation by removing and re-adding letters
        const letters = h1.querySelectorAll('.letter');
        let letterIndex = 0;
        letters.forEach((letter) => {
            const delay = letterIndex * 0.05;
            letter.style.animation = 'none';
            letter.style.opacity = '0';
            letter.style.transform = 'translateY(-100px)';
            // Force reflow
            void letter.offsetWidth;
            letter.style.animation = `letterFall 0.6s ease ${delay}s forwards`;
            letterIndex++;
        });
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Event listeners for carousel controls
nextBtn.addEventListener('click', () => {
    nextSlide();
    stopCarousel();
    startCarousel();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    stopCarousel();
    startCarousel();
});

// Indicator click handlers
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        stopCarousel();
        startCarousel();
    });
});

// Initialize animated headers
initAnimatedHeaders();

// Trigger animation for initial active slide on page load
setTimeout(() => {
    const firstSlide = slides[0];
    if (firstSlide) {
        const h1 = firstSlide.querySelector('.slide-content h1');
        if (h1) {
            const letters = h1.querySelectorAll('.letter');
            let letterIndex = 0;
            letters.forEach((letter) => {
                const delay = letterIndex * 0.05;
                letter.style.animation = `letterFall 0.6s ease ${delay}s forwards`;
                letterIndex++;
            });
        }
    }
}, 100);

// Start carousel on page load
startCarousel();

// Pause carousel on hover
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
}

// ============================================
// Page Navigation System
// ============================================
const pages = document.querySelectorAll('.page');
const mainContent = document.getElementById('main-content');

// Map navigation links to page IDs
const navPageMap = {
    '#home': 'page-home',
    '#about': 'page-about',
    '#people': 'page-people',
    '#services': 'page-services',
    '#projects': 'page-projects',
    '#gallery': 'page-gallery',
    '#contact': 'page-contact'
};

// Function to show a specific page
function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // Scroll to top of main content
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Initialize gallery tabs if gallery page is shown
        if (pageId === 'page-gallery') {
            setTimeout(initGalleryTabs, 100);
        }
        
        // Initialize charts if home page is shown
        if (pageId === 'page-home') {
            setTimeout(() => {
                if (!combinedChart) {
                    initCharts();
                }
            }, 300);
        }
        
        // Initialize projects page if projects page is shown
        if (pageId === 'page-projects') {
            setTimeout(initProjectsPage, 100);
        }
    }
}

// Function to update active navigation link
function updateActiveNavLink(href) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

// Initialize: Show only home page on load
document.addEventListener('DOMContentLoaded', () => {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    const homePage = document.getElementById('page-home');
    if (homePage) {
        homePage.classList.add('active');
    }
    updateActiveNavLink('#home');
});

// ============================================
// Navigation Link Click Handlers
// ============================================
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetHref = this.getAttribute('href');
        
        if (targetHref === '#' || !targetHref) return;
        
        // Get the corresponding page ID
        const pageId = navPageMap[targetHref];
        if (pageId) {
            showPage(pageId);
            updateActiveNavLink(targetHref);
        }
    });
});

// Handle logo click to go to home
const logoLink = document.querySelector('.logo a');
if (logoLink) {
    logoLink.addEventListener('click', function (e) {
        e.preventDefault();
        showPage('page-home');
        updateActiveNavLink('#home');
    });
}

// ============================================
// Handle "Learn More" buttons and other hash links
// ============================================
// Get all anchor tags with hash links (like #services, #about, etc.)
const hashLinks = document.querySelectorAll('a[href^="#"]');
hashLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const targetHref = this.getAttribute('href');
        
        // Skip if it's just # or empty
        if (targetHref === '#' || !targetHref) return;
        
        // Skip if it's already handled by nav-link (to avoid duplicate handling)
        if (this.classList.contains('nav-link')) return;
        
        // Get the corresponding page ID
        const pageId = navPageMap[targetHref];
        if (pageId) {
            e.preventDefault();
            showPage(pageId);
            updateActiveNavLink(targetHref);
        }
    });
});

// ============================================
// Scroll to Top Button
// ============================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// Tab Functionality (About Section)
// ============================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ============================================
// Company Insights Tab Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const insightTabsSection = document.querySelector('.tabbed-data-section');
  if (insightTabsSection) {
    const insightTabBtns = insightTabsSection.querySelectorAll('.data-tab-btn');
    const insightTabContents = insightTabsSection.querySelectorAll('.data-tab-content');
    if (insightTabBtns.length && insightTabContents.length) {
      insightTabBtns.forEach(btn => btn.classList.remove('active'));
      insightTabContents.forEach(tab => tab.classList.remove('active'));
      // Activate the first tab/button (Projects Overview) and its content
      insightTabBtns[0].classList.add('active');
      insightTabContents[0].classList.add('active');
    }
    // Tab button click handler
    insightTabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        insightTabBtns.forEach(b => b.classList.remove('active'));
        insightTabContents.forEach(tab => tab.classList.remove('active'));
        btn.classList.add('active');
        const tabPanel = document.getElementById(btn.dataset.tab + '-tab');
        if (tabPanel) tabPanel.classList.add('active');
      });
    });
  }
});
function renderAllServices() {
  const container = document.getElementById('servicesList');
  if (!container) return;

  const order = [
    { id: 'road-tab', title: 'Road Construction' },
    { id: 'layout-tab', title: 'Layout Developer' },
    { id: 'cement-tab', title: 'Wholesale Cement Dealer' },
    { id: 'tmt-tab', title: 'Wholesale TMT Dealer' },
    { id: 'materialsfact-tab', title: 'Building Materials Supplier' },
    { id: 'building-tab', title: 'Residential Building Construction' },
    { id: 'vehicle-tab', title: 'Rent/Hire Vehicles' }
  ];

  container.innerHTML = '';

  order.forEach(sec => {
    const tab = servicesImages[sec.id];
    if (!tab) return;

    const section = document.createElement('div');
    section.className = 'service-section reveal-on-scroll'; // 👈 important

    section.innerHTML = `
     <div class="service-heading">
  <h2 class="service-title">${sec.title}</h2>
  <p class="service-subtitle">Quality work • Trusted team • On-time delivery</p>
</div>
      <div class="services-grid">
        ${tab.images.map(img => `
          <div class="service-card reveal-on-scroll">
            <div class="service-image">
              <img src="${tab.folder}/${img.file}" alt="${img.title}">
            </div>
            <h4>${img.title}</h4>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(section);
  });

  initScrollReveal(); // 👈 important
}
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');

  // if observer already exists in your project, we can create a separate one for services
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  items.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllServices();
});


// ============================================
// Our Services: Dynamic Images per Tab
// ============================================
const servicesImages = {
  'road-tab': {
    folder: 'images/our services/ROAD CONSTRUCTION',
    images: [
      { file: 'bitumen concrete.jpg', title: 'Bitumen Road Work' },
	  { file: '14.DRIANAGE FINAL.jpeg', title: 'Drainage' },
	  { file: 'LAYOUT.jpg', title: 'Layout' },
	  { file: 'COMPOUND WALL.jpeg', title: 'Compound Wall' },
	  { file: 'CULVERT.jpeg', title: 'Culvert' },
	  { file: 'ARCH.jpeg', title: 'Arch' },
	  { file: 'Copy of COLOR CODE.jpeg', title: 'Color Code' },
	  { file: '10.jpeg', title: 'Road Marking' },
	  { file: 'WET-MIX.webp', title: 'Wet Mix Spreading & Laying' },
	  { file: 'rodstud.webp', title: 'Stud' },
	  { file: 'WaterTank1.jfif', title: 'Water Tank' },
	  { file: 'CCWork.webp', title: 'CC Work' },
	  { file: 'MINI BRIDGE.jpeg', title: 'Mini Bridge' }
     
    ]
  },
  'layout-tab': {
    folder: 'images/our services/lAYOUT',
    images: [
      { file: 'ARCH.jpeg', title: 'Arch' },
      { file: 'COLOR CODE.jpeg', title: 'Color Code' },
      { file: 'COMPOUND WALL.jpeg', title: 'Compound Wall' },
      { file: 'CULVERT.jpeg', title: 'Culvert' },
      { file: 'DRAINAGE.jpeg', title: 'Drainage' },
      { file: 'LAYOUT.jpg', title: 'Layout' },
      { file: 'MINI BRIDGE.jpeg', title: 'Mini Bridge' },
      { file: 'Road marking_.jpg', title: 'Road Marking' },
      { file: 'STUD.jpeg', title: 'Stud' }
    ]
  },
  'cement-tab': {
    folder: 'images/our services/Cement',
    images: [
      { file: 'rep Ramco logo.jpeg', title: 'RAMCO' },
      { file: 'rep 2 chettinat.jpg', title: 'CHETTINAD' },
      { file: 'rep Dalmia-Cement.jpg', title: 'DALMIA' },
      { file: 'rep Ambuja cement.jpg', title: 'AMBUJA' },
      { file: 'Rep Sankar Cement.webp', title: 'SANKAR' },
      { file: 'rep ultratech.jpg', title: 'ULTRATECH' },
      { file: 'rep1 Valimai cement.png', title: 'VALIMAI' }
    ]
  },
  'tmt-tab': {
    folder: 'images/our services/Steel',
    images: [
      { file: 'rep-agni-tmt-bars-1000x1000.webp', title: 'AGNI' },
      { file: 'rep2- amman-try-logo-png-1000x1000.png', title: 'AMMAN TRY TMT' },
      { file: 'rep-jswsteelmsme-logo.png', title: 'JSW STEEL' },
      { file: 'Rep-AjoyTi-sg-logo.avif', title: 'JYOTI TMT' },
      { file: 'rep-tiscon-logo.jpg', title: 'TATA STEEL' },
      { file: 'Rep-indrola-tmt-steel-500x500.webp', title: 'INDROLA TMT' },
      { file: 'rep-SAIL-logo.png', title: 'SAIL TMT' },
      { file: 'rep-Covan.png', title: 'COVAN TMT' },
      { file: 'rep-vizag-steel-logo-png_seeklogo-305380.png', title: 'VIZAG STEEL' },
	  { file: 'Gowri.jfif', title: 'Gowri Steel' }
    ]
  },
  'materialsfact-tab': {
    folder: 'images/our services/BuildingSupplier',
    images: [
      { file: 'FLY-ASH-BRICK.webp', title: 'FLY ASH BRICKS' },
      { file: 'GSB.webp', title: 'GSB' },
      { file: 'HOLLOW-BLOCK.webp', title: 'HOLLOW BLOCKS' },
      { file: 'jalli-manal.webp', title: 'Jally, Metal' },
      { file: 'msand.webp', title: 'MSAND, PSAND' },
      { file: 'New-Project-16.webp', title: 'BRICKS' },
      { file: 'SOLID-BLOCKS.webp', title: 'SOLID BLOCKS' },
      { file: 'WET-MIX.webp', title: 'WETMIX,GSB' },
	  { file: 'renacon-aac-blocks.jpeg', title: 'Renacon Block / AAC Block' },
	  { file: 'tmtring.png', title: 'Ring,Readymade TMT Bars' },
	  { file: 'squarepipe.jfif', title: 'Square Pipe' },
	  { file: 'concreteoil.jfif', title: 'Concrete Oil' },
	  { file: 'Tilepaste.jfif', title: 'Tile Paste' }
    ]
  },
  'building-tab': {
    folder: 'images/our services/BUILDING CONSTRUCTION',
    images: [    
       { file: 'build44.jpeg', title: 'Structures' },
       { file: 'build55.jpeg', title: 'Architectural Landmarks' },
       { file: 'build66.jpeg', title: 'Smart Buildings' }       
    ]
  },
  'vehicle-tab': {
    folder: 'images/our services/RentVehicles',
    images: [    
       { file: 'ajax.jpg', title: 'Ajx' },  
	   { file: 'BABY ROLLER.jpg', title: 'Baby Roller' },	 
	   { file: 'jcb (2).jpg', title: 'JCB' },  
	   { file: 'JOSEPH  ROLLER.jpg', title: 'Joseph Roller' },  
	   { file: 'paver.jpg', title: 'Paver' },  
	   { file: 'pickup and 407.jpg', title: 'Pickup and 407' },   
	   { file: 'roller.jpg', title: 'Roller' },  
	   { file: 'TANDEM ROLLER.jpg', title: 'Tandem Roller' },  
	   { file: 'tipper.jpg', title: 'Tipper' },  
	   { file: 'TRACTOR MOUNT SPRAYER.jpg', title: 'Tractor Mount Sprayer' },  
	   { file: 'water-tanker-lorry.webp', title: 'Tanker Lorry' },
	   { file: 'earth-rammer-1-tonne.jpg', title: 'Earth Rammer' }, 
	   { file: 'power-trowel-floater-machine.jpg', title: 'Power Rowel' },  
	   { file: 'SOIL COMPACTOR.jpg', title: 'Soil Compactor' }	   
    ]
  }
}

function renderServiceCards(tabId) {
  const tab = servicesImages[tabId];
  if (!tab) return;
  const grid = document.querySelector(`#${tabId} .services-grid`);
  if (!grid) return;
  grid.innerHTML = '';
  tab.images.forEach(img => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      <div class="service-image">
        <img src="${tab.folder}/${img.file}" alt="${img.title}">
      </div>
      <h4>${img.title}</h4>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.data-tab-btn');
  const tabContents = document.querySelectorAll('.services-tab-content');

  // ------------------------------------
  // RESET ACTIVE STATES
  // ------------------------------------
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(tc => tc.classList.remove('active'));

  // ------------------------------------
  // DEFAULT TAB = road-tab
  // ------------------------------------
  const defaultTabId = 'road-tab';
  const defaultBtn = document.querySelector(`.data-tab-btn[data-tab="${defaultTabId}"]`);
  const defaultContent = document.getElementById(defaultTabId);

  if (defaultBtn && defaultContent) {
    defaultBtn.classList.add('active');
    defaultContent.classList.add('active');

    // 🔥 AUTO LOAD ROAD IMAGES
    renderServiceCards(defaultTabId);
  }

  // ------------------------------------
  // CLICK HANDLER
  // ------------------------------------
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const content = document.getElementById(tabId);

      if (content) {
        content.classList.add('active');
        renderServiceCards(tabId);
      }
    });
  });
});

// ============================================
// Data Tab Functionality (Home Page)
// ============================================
function initDataTabs() {
    const dataTabButtons = document.querySelectorAll('.data-tab-btn');
    const dataTabContents = document.querySelectorAll('.data-tab-content');

    dataTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            dataTabButtons.forEach(btn => btn.classList.remove('active'));
            dataTabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ============================================
// Gallery Tab Functionality
// ============================================
function initGalleryTabs() {
    const galleryTabButtons = document.querySelectorAll('.gallery-tab-btn');
    const galleryGrids = document.querySelectorAll('.gallery-grid');

    galleryTabButtons.forEach(button => {
        // Remove existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
            const targetGallery = newButton.getAttribute('data-gallery');

            // Remove active class from all buttons and grids
            document.querySelectorAll('.gallery-tab-btn').forEach(btn => btn.classList.remove('active'));
            galleryGrids.forEach(grid => grid.classList.remove('active'));

            // Add active class to clicked button and corresponding grid
            newButton.classList.add('active');
            const targetGrid = document.getElementById(`${targetGallery}-gallery`);
            if (targetGrid) {
                targetGrid.classList.add('active');
            }
        });
    });
}

// Initialize gallery tabs on page load if gallery page is active
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const galleryPage = document.getElementById('page-gallery');
        if (galleryPage && galleryPage.classList.contains('active')) {
            initGalleryTabs();
        }
    }, 100);
});

// ============================================
// Header Scroll Effect
// ============================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});
// ============================================
// Contact Form – EmailJS (NO BACKEND)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  // Initialize EmailJS
  emailjs.init('AvwTaoskwG3mgaN8A'); // 🔴 Replace this

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm(
      'service_8bln3yk',   // 🔴 Replace this
      'template_6bey86k',  // 🔴 Replace this
      this
    )
    .then(() => {
      alert('✅ Message sent successfully!');
      contactForm.reset();
    })
    .catch((error) => {
      alert('❌ Message failed. Please try again.');
      console.error('EmailJS Error:', error);
    });
  });
});


// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animateElements = document.querySelectorAll('.feature-card, .service-card, .team-member, .testimonial-card, .city-item');

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// Lazy Loading Images (if images are added later)
// ============================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================
// Form Validation Enhancement
// ============================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#28a745';
        }
    });

    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = '#28a745';
        }
    });
});

// ============================================
// Chart Initialization
// ============================================
let combinedChart;

// Custom plugin for top-to-bottom animation
const topToBottomAnimationPlugin = {
    id: 'topToBottomAnimation',
    beforeDatasetsDraw: function(chart) {
        // This can be used to modify drawing if needed
    }
};

function initCharts() {
    // Combined Chart - Multi-dataset visualization
    const combinedCtx = document.getElementById('combinedChart');
    if (combinedCtx) {
        // Register the plugin
        Chart.register(topToBottomAnimationPlugin);
        
        combinedChart = new Chart(combinedCtx, {
            type: 'bar',
            data: {
                labels: ['Road Construction', 'Building Projects', 'Layout Development', 'Drainage Systems', 'Other'],
                datasets: [
                    {
                        label: 'Project Distribution (%)',
                        data: [40, 25, 20, 10, 5],
                        backgroundColor: [
                            'rgba(212, 175, 55, 0.8)',
                            'rgba(26, 26, 26, 0.8)',
                            'rgba(44, 62, 80, 0.8)',
                            'rgba(184, 148, 31, 0.8)',
                            'rgba(102, 102, 102, 0.8)'
                        ],
                        borderColor: [
                            '#d4af37',
                            '#1a1a1a',
                            '#2c3e50',
                            '#b8941f',
                            '#666'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Annual Growth Trend',
                        type: 'line',
                        data: [35, 45, 60, 75, 90],
                        borderColor: '#d4af37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: '#d4af37',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart',
                    onProgress: function(animation) {
                        const chart = animation.chart;
                        const progress = Math.min(animation.currentStep / animation.numSteps, 1);
                        
                        // Animate bars from top to bottom
                        const barMeta = chart.getDatasetMeta(0);
                        if (barMeta && barMeta.data) {
                            barMeta.data.forEach((bar, index) => {
                                const value = chart.data.datasets[0].data[index];
                                const yScale = chart.scales.y;
                                
                                // Calculate final top position of the bar (y is the top of the bar)
                                const finalTopY = yScale.getPixelForValue(value);
                                const baseY = yScale.bottom;
                                
                                // Start from top of chart and animate down to final position
                                const startY = yScale.top;
                                
                                // Animate the top of the bar from chart top to final position
                                bar.y = startY + (finalTopY - startY) * progress;
                                // Base stays at bottom
                                bar.base = baseY;
                            });
                        }
                        
                        // Animate line points from top to bottom
                        const lineMeta = chart.getDatasetMeta(1);
                        if (lineMeta && lineMeta.data) {
                            lineMeta.data.forEach((point, index) => {
                                const value = chart.data.datasets[1].data[index];
                                const yScale = chart.scales.y1;
                                
                                // Calculate final Y position for the point
                                const finalY = yScale.getPixelForValue(value);
                                const startY = yScale.top;
                                
                                // Animate point from top to final position
                                point.y = startY + (finalY - startY) * progress;
                            });
                        }
                    },
                    onComplete: function(animation) {
                        // Animation complete - ensure final positions are correct
                        const chart = animation.chart;
                        // Final positions should already be correct, but we can force an update if needed
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Metrics Overview',
                        font: {
                            size: 20,
                            weight: 'bold'
                        },
                        color: '#1a1a1a',
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 13,
                                weight: '500'
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 15,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        borderColor: '#d4af37',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Project Distribution (%)',
                            font: {
                                size: 12,
                                weight: '600'
                            },
                            color: '#1a1a1a'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Growth Index',
                            font: {
                                size: 12,
                                weight: '600'
                            },
                            color: '#d4af37'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }
}

// ============================================
// Initialize on DOM Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize first slide (only if carousel exists on current page)
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    if (carouselSlides.length > 0) {
        showSlide(0);
    }
    
    // Initialize data tabs
    initDataTabs();
    
    // Initialize charts when home page is active
    const homePage = document.getElementById('page-home');
    if (homePage && homePage.classList.contains('active')) {
        setTimeout(initCharts, 500);
    }
    
    console.log('Sathguru Babaji Traders website initialized successfully!');
});

// ============================================
// Performance Optimization: Debounce Function
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events for better performance (disabled for page navigation)
// const debouncedActivateNav = debounce(activateNavLink, 10);
// window.addEventListener('scroll', debouncedActivateNav);

// ============================================
// Projects Page Functionality
// ============================================
const projectsData = {
    'POONJOLAI GARDEN - MK GROUP OF COMPANIES KAALAPATTI': {
        folder: 'POONJOLAI GARDEN - MK GROUP OF COMPANIES KAALAPATTI',
        thumbnail: '14.FINAL OUTCOME.jpg',
        category: 'road',
        icon: 'fa-road',
        images: [
            'POOJA.jpg',
            '1.jpg',
            '2.EXISTING ROAD.jpg',
            '3.DISPOSAL OF OLD ROAD.jpg',
            '4.EARTH WORK SOIL REMOVAL.jpg',
            '5.EARTH WORK SECTIONING.jpg',
            '6.BED FORMATION.jpg',
            '6.GSB SPREADING AND LAYING.jpg',
            '8.GSB SPREADING AND LAYING WITH PAVER.jpg',
            '9.GSB WMM BED FORMATION ROLLED.jpg',
            '10.WATER CURING.jpg',
            '11.TACK COAT.jpg',
            '12.BITUMEN MACADAM.jpg',
            '13.BITUMEN CONCRETE.jpg',
            '14.FINAL OUTCOME.jpg'
        ]
    },
	'SANCTUARY VILLAS': {
        folder: 'SANCTUARY VILLAS',
        thumbnail: 'San8.JPG',
        category: 'road',
        icon: 'fa-road',
        images: [
             'San1.JPG',
			  'San2.JPG',
			   'San3.JPG',
			    'San4.JPG',
				 'San5.JPG',
				  'San6.JPG',
				   'San7.JPG',
				    'San8.JPG',
                    'san9.JPG'

        ]
    },
    'VISHAKA VILLAS': {
        folder: 'VISHAKA VILLAS',
        thumbnail: '11.2 FINAL OUTCOME.jpg',
        category: 'building',
        icon: 'fa-building',
        images: [
            '1.1POOJA.jpg',
            'EXISTING.jpg',
            '1.earth work soil removal.jpg',
            '2.sectioning.jpg',
            '2.1.sectioning1.jpg',
            '3.bed fromation.jpg',
            '3.1monitor levelling.jpg',
            '4.GSB SPREADING AND LAYING.jpg',
            '4.1 GSB SPREADING AND LAYING 1.jpg',
            '4.1BED FORMATION ROLLED.jpg',
            '5.GSB & WMM BED FORMATION ROLLED.jpg',
            '5.1GSB & WMM BED FORMATION ROLLED 1.jpg',
            '6.WATER CURING.jpg',
            '7.TACK COAT SPRAYING 1.jpg',
            '7.1.TACK COAT SPRAYING.jpg',
            '8.BITUMEN MACADAM.jpg',
            '8.1 BITUMEN MACADAM1.jpg',
            '8.2BITUMEN MACADAM2.jpg',
            '9. BITUMEN CONCRETE 3.jpg',
            '9.1 BITUMEN CONCRETE.jpg',
            '9.2 BITUMENT CONCRETE 1.jpg',
            '10. DUST SPREADING.jpg',
            '11.FINAL OUTCOME OF ROAD 1.jpg',
            '11.1 FINAL OUTCOME OF ROAD.jpg',
            '11.2 FINAL OUTCOME.jpg',
            'visaka villas2.jpeg'
        ]
    },
    'compound wall': {
        folder: 'compound wall',
        thumbnail: 'FINAL.jpeg',
        category: 'infrastructure',
        icon: 'fa-shield-alt',
        images: [
            '2.FILE CONCRETE.jpeg',
            '3.BELT CONCRETE.jpeg',
            '4.POST CONCRETE.jpeg',
            '5.BLOCK WORK.jpeg',
            '6.BLOCK WORK CURING.jpeg',
            '7.PLASTERING WORK.jpeg',
            '8.PLASTERING CURING.jpeg',
            'FINAL.jpeg'
        ]
    },
    'Drainage': {
        folder: 'Drainage',
        thumbnail: '13.DRAINAGE FINAL.jpeg',
        category: 'infrastructure',
        icon: 'fa-tint',
        images: [
            '1.POOJA.jpeg',
            '2.EARTH WORK.jpeg',
            '2.1 EARTH WORK WITH VIBRATOR.jpeg',
            '2.2 EARTH WORK.jpeg',
            '4.BASE CONCRETE.jpeg',
            '5.TMT FIXING.jpeg',
            '6.TMT FIXING.jpeg',
            '7.MAT CONCRETE.jpeg',
            '8.SHUTTERING.jpeg',
            '8.1.SHUTTERING.jpeg',
            '9.CONCRETE FILLING.jpeg',
            '10.CONCRETE FILLING.jpeg',
            '11.SHUTTERING REMOVAL.jpeg',
            '11.1 SHUTTERING REMOVAL.jpeg',
            '12.WATER CURING.jpeg',
            '13.DRAINAGE FINAL.jpeg',
            '14.DRIANAGE FINAL.jpeg'
        ]
    },
    'ROAD MARKING': {
        folder: 'ROAD MARKING',
        thumbnail: '1.jpeg',
        category: 'road',
        icon: 'fa-road',
        images: [
            '1.jpeg',
            '2.jpeg',
            '3.jpeg',
            '4.jpeg',
            '5.jpeg',
            '6.jpeg',
            '7.jpeg',
            '8.jpeg',
            '9.jpeg',
            '10.jpeg'
        ]
    },
    'COLOR CODE': {
        folder: 'COLOR CODE',
        thumbnail: '2.jpeg',
        category: 'road',
        icon: 'fa-paint-brush',
        images: [
            '2.jpeg',
            '3.jpeg'
        ]
    },
    'Layout': {
        folder: 'lAYOUT',
        thumbnail: 'LAYOUT.jpg',
        category: 'infrastructure',
        icon: 'fa-drafting-compass',
        images: [
            'LAYOUT.jpg',
            'ARCH.jpeg',
            'ARCH...jpeg',
            'Road marking_.jpg',
            'STUD.jpeg',
            'COMPOUND WALL.jpeg',
            'COMPOUND WALL...jpeg',
            'CULVERT.jpeg',
            'MINI BRIDGE.jpeg',
            'DRAINAGE.jpeg',
            'COLOR CODE.jpeg',
            '1.jpeg',
            '2.jpeg',
            '3.jpeg',
            '4.jpeg',
            


        ]
    },
	'STUD': {
        folder: 'lAYOUT',
        thumbnail: 'STUD.jpeg',
        category: 'infrastructure',
        icon: 'fa-drafting-compass',
        images: [
            'STUD.jpeg'
        ]
    },
    'Water Tank': {
        folder: 'WaterTank',
        thumbnail: 'WaterTank1.jfif',
        category: 'infrastructure',
        icon: 'fa-tint',
        images: [
            'WaterTank1.jfif',
            '1.jpeg',
            '2.jpeg',
            '3.jpeg',
            '4.jpeg',
            '5.jpeg',
            
        ]
    },
	 'Arch': {
        folder: 'lAYOUT',
        thumbnail: 'LAYOUT.jpg',
        category: 'infrastructure',
        icon: 'fa-drafting-compass',
        images: [
            'ARCH...jpeg',
			'ARCH.jpeg'			
        ]
    },
    'Asokapuram Library': {
        folder: 'asokapuram library',
        thumbnail: 'WhatsApp Image 2024-04-10 at 19.37.29_1adf42ec.jpg',
        category: 'building',
        icon: 'fa-building',
        images: [
            'WhatsApp Image 2024-04-10 at 19.37.29_1adf42ec.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.30_02e85f2f.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.30_5c789c42.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.30_dd3565a6.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.31_0dfec17c.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.31_9d2f6f95.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.31_f64db706.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.32_3cf1ef24.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.32_6056f792.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.33_17da54c2.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.33_9adf8f0a.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.33_ffdc6f12.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.34_28d68fcc.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.34_85fd2fdc.jpg',
            'WhatsApp Image 2024-04-10 at 19.37.34_c4d4f873.jpg',
            'WhatsApp Image 2024-04-11 at 08.43.50_8f6a44d1.jpg',
            'WhatsApp Image 2024-04-11 at 09.14.19_69ef5672.jpg',
            'WhatsApp Image 2024-04-25 at 17.34.56_6ab436e9.jpg',
            'WhatsApp Image 2024-05-13 at 16.29.36_fe112e13.jpg',
            'WhatsApp Image 2024-05-16 at 09.17.57_9a87a657.jpg',
            'WhatsApp Image 2024-05-21 at 15.08.01_4996bc3b.jpg',
            'WhatsApp Image 2024-08-10 at 12.58.19_d426426f.jpg',
            'WhatsApp Image 2024-08-10 at 12.58.20_449af682.jpg',
            'WhatsApp Image 2024-08-10 at 12.58.20_45a48883.jpg',
            'WhatsApp Image 2024-08-10 at 12.58.20_c0a91b3c.jpg',
            'WhatsApp Image 2024-08-10 at 12.58.21_809a1344.jpg',
            'WhatsApp Image 2024-09-26 at 17.38.28_3f038311.jpg',
            'WhatsApp Image 2024-09-26 at 17.38.30_aaab9935.jpg',
            'WhatsApp Image 2024-10-16 at 16.04.49_3485f19d.jpg',
            'WhatsApp Image 2024-10-16 at 16.04.49_9b042070.jpg',
            'WhatsApp Image 2024-10-16 at 16.04.49_9c610bf1.jpg',
            'WhatsApp Image 2024-10-16 at 16.04.50_974aa31c.jpg',
            'WhatsApp Image 2024-10-16 at 16.04.50_db9b718d.jpg',
            'WhatsApp Image 2024-10-16 at 16.04.50_ea4fdb0a.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.55_0cdd842c.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.56_71c39b56.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.56_fc5f4e37.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.57_3965af2b.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.57_437174e0.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.57_e88c5ba1.jpg',
            'WhatsApp Image 2024-10-16 at 16.11.58_2a896649.jpg',
            'WhatsApp Image 2024-10-17 at 13.49.13_eff6b479.jpg',
            'WhatsApp Image 2024-10-17 at 13.49.14_09294404.jpg',
            'WhatsApp Image 2024-10-17 at 13.52.11_04a50f37.jpg',
            'WhatsApp Image 2024-10-17 at 13.52.11_e1f4aa7f.jpg',
            'WhatsApp Image 2024-10-17 at 13.52.12_2b3b90ac.jpg',
            'WhatsApp Image 2024-10-17 at 13.52.12_718bd17a.jpg',
            'WhatsApp Image 2024-10-17 at 13.52.12_88bf9a6b.jpg',
            'WhatsApp Image 2024-10-21 at 18.14.07_88f90c2a.jpg',
            'WhatsApp Image 2024-10-21 at 18.14.07_9615ca12.jpg',
            'WhatsApp Image 2024-10-22 at 11.31.01_d99677ef.jpg',
            'WhatsApp Image 2024-10-22 at 11.33.57_81fb2935.jpg',
            'WhatsApp Image 2024-10-23 at 14.05.59_e3950215.jpg',
            'WhatsApp Image 2024-10-23 at 14.06.00_8e06c7a1.jpg',
            'WhatsApp Image 2024-10-23 at 14.06.01_1099a4e4.jpg',
            'WhatsApp Image 2024-10-23 at 14.06.01_f1b11721.jpg',
            'WhatsApp Image 2024-10-23 at 14.06.02_365452d1.jpg',
            'WhatsApp Image 2024-10-23 at 14.19.49_b2e5c90f.jpg',
            'WhatsApp Image 2024-10-23 at 15.10.48_c5325ec4.jpg',
            'WhatsApp Image 2024-10-23 at 15.10.51_43792061.jpg',
            'WhatsApp Image 2024-10-23 at 15.10.54_f60f2f5d.jpg'
        ]
    }
};

function initProjectsPage() {
    // Initialize project tabs
    initProjectTabs();
    
    // Load all projects
    loadProjectsByCategory('all');
    loadProjectsByCategory('road');
    loadProjectsByCategory('building');
    loadProjectsByCategory('infrastructure');
    
    // Initialize gallery modal
    initGalleryModal();
}

function initProjectTabs() {
    const projectTabButtons = document.querySelectorAll('#page-projects .data-tab-btn');
    const projectTabContents = document.querySelectorAll('#page-projects .data-tab-content');
    
    projectTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            projectTabButtons.forEach(btn => btn.classList.remove('active'));
            projectTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Trigger slide-in animation
                const dataGrid = targetContent.querySelector('.data-grid');
                if (dataGrid) {
                    animateCardsSlideIn(dataGrid);
                }
            }
        });
    });
}

function animateCardsSlideIn(grid) {
    const cards = grid.querySelectorAll('.data-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(100px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

function loadProjectsByCategory(category) {
    let gridId;
    let projectsToShow = [];
    
    if (category === 'all') {
        gridId = 'allProjectsGrid';
        projectsToShow = Object.keys(projectsData);
    } else if (category === 'road') {
        gridId = 'roadProjectsGrid';
        projectsToShow = Object.keys(projectsData).filter(name => 
            projectsData[name].category === 'road'
        );
    } else if (category === 'building') {
        gridId = 'buildingProjectsGrid';
        projectsToShow = Object.keys(projectsData).filter(name => 
            projectsData[name].category === 'building'
        );
    } else if (category === 'infrastructure') {
        gridId = 'infrastructureProjectsGrid';
        projectsToShow = Object.keys(projectsData).filter(name => 
            projectsData[name].category === 'infrastructure'
        );
    }
    
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (projectsToShow.length === 0) {
        grid.innerHTML = '<div class="no-projects"><p>No projects in this category</p></div>';
        return;
    }
    
    projectsToShow.forEach(projectName => {
        const project = projectsData[projectName];
        const projectCard = createProjectCard(projectName, project);
        grid.appendChild(projectCard);
    });
}

function createProjectCard(projectName, project) {
    const card = document.createElement('div');
    card.className = 'data-item project-card';
    card.dataset.projectName = projectName;
    
    const imageCount = project.images ? project.images.length : 0;
    
    card.innerHTML = `
        <div class="data-icon">
            <i class="fas ${project.icon || 'fa-folder'}"></i>
        </div>
        <h4>${projectName}</h4>
        <p class="data-number">${imageCount}</p>
        <p class="data-desc">Project Images Available</p>
    `;
    
    // Add click handler to open gallery modal
    card.addEventListener('click', () => {
        openProjectGallery(projectName);
    });
    
    return card;
}

function initGalleryModal() {
    const modal = document.getElementById('projectGalleryModal');
    const backdrop = document.getElementById('galleryModalBackdrop');
    const closeBtn = document.getElementById('galleryModalClose');
    
    if (!modal || !closeBtn) return;
    
    // Close button handler
    closeBtn.addEventListener('click', () => {
        closeProjectGallery();
    });
    
    // Close on backdrop click
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeProjectGallery();
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectGallery();
        }
    });
}

function openProjectGallery(projectName) {
    const project = projectsData[projectName];
    const modal = document.getElementById('projectGalleryModal');
    const backdrop = document.getElementById('galleryModalBackdrop');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalBody = document.getElementById('galleryModalBody');
    
    if (!project || !modal || !modalBody) return;
    
    // Update title
    if (modalTitle) {
        modalTitle.textContent = projectName;
    }
    
    // Clear and load images
    modalBody.innerHTML = '<div class="gallery-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading images...</p></div>';
    
    // Show backdrop and modal with slide-in animation
    if (backdrop) {
        backdrop.classList.add('active');
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load images
    setTimeout(() => {
        loadGalleryImages(project, modalBody);
    }, 300);
}

function loadGalleryImages(project, container) {
    if (!project.images || project.images.length === 0) {
        container.innerHTML = '<div class="gallery-placeholder"><i class="fas fa-images"></i><p>No images available for this project</p></div>';
        return;
    }
    
    container.innerHTML = '';
    container.className = 'gallery-modal-body gallery-grid';
    
    project.images.forEach(imageName => {
        const imagePath = `images/COMPLETED PROJECTS/${project.folder}/${imageName}`;
        const imageItem = document.createElement('div');
        imageItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `${project.folder} - ${imageName}`;
        img.loading = 'lazy';
        
        // Add click handler to open full-size modal
        img.addEventListener('click', () => {
            openImageModal(imagePath);
        });
        
        // Handle image load error
        img.onerror = function() {
            this.style.display = 'none';
        };
        
        imageItem.appendChild(img);
        container.appendChild(imageItem);
    });
}

function closeProjectGallery() {
    const modal = document.getElementById('projectGalleryModal');
    const backdrop = document.getElementById('galleryModalBackdrop');
    
    if (modal) {
        modal.classList.remove('active');
    }
    if (backdrop) {
        backdrop.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function openImageModal(imagePath) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <span class="modal-close">&times;</span>
            <img class="modal-content" src="" alt="Project Image">
        `;
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeImageModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeImageModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }
    
    // Set image and show modal
    const modalImg = modal.querySelector('.modal-content');
    modalImg.src = imagePath;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Also initialize on DOM load if projects page is active
document.addEventListener('DOMContentLoaded', () => {
    const projectsPage = document.getElementById('page-projects');
    if (projectsPage && projectsPage.classList.contains('active')) {
        setTimeout(initProjectsPage, 100);
    }
});


