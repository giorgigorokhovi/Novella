const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');


burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    const icon = burger.querySelector('i');
    if(nav.classList.contains('nav-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        burger.querySelector('i').classList.remove('fa-times');
        burger.querySelector('i').classList.add('fa-bars');
    });
});

//API 

async function fetchBooks() {
    try {
       
        const response = await fetch('books.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
       
        populateTrack(document.getElementById('track-novels'), data.novels);
        populateTrack(document.getElementById('track-scifi'), data.scifi);
        populateTrack(document.getElementById('track-mystery'), data.mystery);
        populateTrack(document.getElementById('track-webnovels'), data.webnovels);
        
       
        setupDragScroll();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// HTML books
function populateTrack(trackElement, books) {
    trackElement.innerHTML = '';
    let cardsHtml = '';
    
    books.forEach(book => {
        const bookPageLink = `book.html?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&image=${encodeURIComponent(book.image)}&synopsis=${encodeURIComponent(book.synopsis || '')}&pdf=${encodeURIComponent(book.pdf)}&chapters=${encodeURIComponent(book.chapters)}&views=${encodeURIComponent(book.views)}&rating=${encodeURIComponent(book.rating)}&genre=${encodeURIComponent(book.genre)}&status=${encodeURIComponent(book.status)}`;

        cardsHtml += `
            <div class="h-card">
                <img src="${book.image}" alt="${book.title}" loading="lazy" draggable="false">
                <div class="h-info">
                    <h4>${truncateText(book.title, 20)}</h4>
                    <span>${truncateText(book.author, 15)}</span>
                    <a href="${bookPageLink}" class="h-btn">Read Now <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        `;
    });

    
    trackElement.innerHTML = cardsHtml + cardsHtml + cardsHtml; 
}

function truncateText(text, limit) {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    }
    return text;
}

//call API
fetchBooks();


function setupDragScroll() {
    const containers = document.querySelectorAll('.marquee-container');

    containers.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            slider.querySelector('.marquee-track').style.animationPlayState = 'paused';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
            slider.querySelector('.marquee-track').style.animationPlayState = 'running';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
            slider.querySelector('.marquee-track').style.animationPlayState = 'running';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        
        slider.style.cursor = 'grab';
    });
}


const form = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

if(togglePassword) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
    });
}

if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            setError(emailInput, 'Enter a valid email address');
            isValid = false;
        } else {
            setSuccess(emailInput);
        }
        
        if (passwordInput.value.length < 6) {
            setError(passwordInput, 'Min 6 characters required');
            isValid = false;
        } else {
            setSuccess(passwordInput);
        }

        if(isValid) {
            alert('Account Created Successfully!');
            form.reset();
        }
    });
}

function setError(input, message) {
    const group = input.parentElement.parentElement.classList.contains('input-group') 
        ? input.parentElement 
        : input.parentElement.parentElement;
    const small = group.querySelector('.error-msg');
    small.innerText = message;
    small.style.display = 'block';
    input.classList.add('input-error');
}

function setSuccess(input) {
    const group = input.parentElement.parentElement.classList.contains('input-group') 
        ? input.parentElement 
        : input.parentElement.parentElement;
    const small = group.querySelector('.error-msg');
    small.style.display = 'none';
    input.classList.remove('input-error');
}

const scrollBtn = document.getElementById("scrollToTopBtn");
const header = document.getElementById("header");
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookieBtn = document.getElementById('acceptCookie');

window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "none";
    }

    if (scrollBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    }
});

if(scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => { cookieBanner.classList.remove('hidden'); }, 2000);
} else if (cookieBanner) {
    cookieBanner.classList.add('hidden');
}

if(acceptCookieBtn) {
    acceptCookieBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.add('hidden');
    });
}