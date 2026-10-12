// --- LOADER ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 800);
});

// --- CURRENT YEAR ---
const currentYear = document.getElementById('current-year');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
}
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// --- MOBILE MENU ---
const menuBtn = document.getElementById('menu-btn');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
    mobileMenu.style.display = 'flex';
    menuBtn.setAttribute('aria-expanded', 'true');
    menuClose.focus();
});
menuClose.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
});
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        menuBtn.setAttribute('aria-expanded', 'false');
    });
});

// --- NAVBAR SCROLL ---
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('glass', 'shadow-sm');
    } else {
        navbar.classList.remove('glass', 'shadow-sm');
    }

    // Scroll Progress
    const winHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = winHeight > 0 ? (window.scrollY / winHeight) * 100 : 0;
    scrollProgress.style.width = `${scrolled}%`;
});

// --- SCROLL REVEAL ---
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Animate skill bars
            if (entry.target.querySelector('.skill-bar-fill')) {
                const bars = entry.target.querySelectorAll('.skill-bar-fill');
                bars.forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
            }
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// --- MAGNETIC BUTTONS ---
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// --- PROJECT FILTER & SEARCH ---
const projectItems = document.querySelectorAll('.project-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('project-search');

function filterProjects() {
    const filter = document.querySelector('.filter-btn.active').dataset.filter;
    const searchText = searchInput.value.toLowerCase();

    projectItems.forEach(item => {
        const category = item.dataset.category;
        const title = item.dataset.title.toLowerCase();
        const matchesFilter = filter === 'all' || category === filter;
        const matchesSearch = title.includes(searchText);

        if (matchesFilter && matchesSearch) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active', 'bg-accent', 'text-white'));
        btn.classList.add('active', 'bg-accent', 'text-white');
        filterProjects();
    });
});
// Trigger initial active state
document.querySelector('.filter-btn.active').classList.add('bg-accent', 'text-white');

searchInput.addEventListener('input', filterProjects);

// --- PROJECT MODAL ---
const modal = document.getElementById("project-modal");

document.querySelectorAll(".open-project").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        // Isi Informasi Project
        document.getElementById("modal-title").innerText = btn.dataset.title;
        document.getElementById("modal-category").innerText = btn.dataset.category;
        document.getElementById("modal-overview").innerText = btn.dataset.overview;
        document.getElementById("modal-contribution").innerText = btn.dataset.contribution;
        document.getElementById("modal-tools").innerText = btn.dataset.tools;
        document.getElementById("modal-timeline").innerText = btn.dataset.timeline;
        document.getElementById("modal-challenges").innerText = btn.dataset.challenges;
        document.getElementById("modal-solutions").innerText = btn.dataset.solutions;
        document.getElementById("modal-reflection").innerText = btn.dataset.reflection;

        // Github & Demo
        const githubBtn = document.getElementById("modal-github");
        const demoBtn = document.getElementById("modal-demo");

        githubBtn.href = btn.dataset.github || "#";
        demoBtn.href = btn.dataset.demo || "#";

        githubBtn.style.display =
            btn.dataset.github && btn.dataset.github !== "#"
                ? "inline-flex"
                : "none";

        demoBtn.style.display =
            btn.dataset.demo && btn.dataset.demo !== "#"
                ? "inline-flex"
                : "none";

        // ===========================
        // Gallery
        // ===========================

        const gallery = (btn.dataset.gallery || "")
            .split(",")
            .map(img => img.trim())
            .filter(img => img !== "");

        const mainImage = document.getElementById("modal-main-image");
        const galleryEl = document.getElementById("modal-gallery");

        galleryEl.innerHTML = "";

        if (gallery.length > 0) {

            mainImage.src = gallery[0];

            gallery.forEach((imgSrc) => {

                const img = document.createElement("img");

                img.src = imgSrc;
                img.alt = `${btn.dataset.title} preview`;

                img.className =
                    "aspect-video w-full rounded-xl object-cover cursor-pointer border border-transparent hover:border-blue-500 transition";

                img.onclick = () => {
                    mainImage.src = imgSrc;
                };

                img.addEventListener("dblclick", () => {
                    openLightbox(imgSrc);
                });

                galleryEl.appendChild(img);

            });

        } else {

            mainImage.src = "https://via.placeholder.com/900x500?text=No+Image";

        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
        document.getElementById("close-modal").focus();
    });
});

let lastFocusedElement = null;

function closeProjectModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
}

document.querySelectorAll(".open-project").forEach((btn) => {
    btn.addEventListener("click", () => {
        lastFocusedElement = btn;
    }, true);
});

document.getElementById("close-modal").addEventListener("click", closeProjectModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeProjectModal();
    }
});

// --- LIGHTBOX ---
function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').style.display = 'flex';
}
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

document.querySelectorAll('#certificates [role="button"]').forEach((certificate) => {
    certificate.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            certificate.click();
        }
    });
});

const modalMainImage = document.getElementById('modal-main-image');
modalMainImage.addEventListener('click', () => openLightbox(modalMainImage.src));
modalMainImage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(modalMainImage.src);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'flex') {
        closeLightbox();
    } else if (modal.style.display === 'flex') {
        closeProjectModal();
    } else if (mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
    }
});

// --- COPY EMAIL ---
document.getElementById('copy-email').addEventListener('click', () => {
    navigator.clipboard.writeText('adityasaputraa0269@gmail.com').then(() => {
        const btn = document.getElementById('copy-email');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check text-xs"></i> <span>Copied!</span>`;
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
});

// --- BACK TO TOP ---
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- TILT CARDS ---
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// =====================================
// DRAG SCROLL MY PROCESS
// =====================================

const slider = document.querySelector(".custom-scroll");

if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDown = true;
        slider.classList.add("active");

        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;

        e.preventDefault();

        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;

        slider.scrollLeft = scrollLeft - walk;
    });
}

// --- LOGIKA SLIDER PANAH & AUTO-LOOP ---
const sliderContainer = document.querySelector(".custom-scroll");
const btnLeft = document.getElementById("slide-left");
const btnRight = document.getElementById("slide-right");

if (sliderContainer && btnLeft && btnRight) {
    // Tentukan seberapa jauh scroll setiap kali panah diklik (sesuaikan dengan lebar kartu Anda)
    const scrollAmount = 350; 
    let autoSlideInterval;

    // Fungsi Scroll Kanan & Looping
    const scrollRight = () => {
        // Cek apakah slider sudah mencapai akhir (ujung paling kanan)
        // Kita kurangi 10px untuk toleransi akurasi perhitungan piksel browser
        if (sliderContainer.scrollLeft + sliderContainer.clientWidth >= sliderContainer.scrollWidth - 10) {
            // Jika mentok akhir, kembalikan ke 0 (awal) dengan mulus
            sliderContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Jika belum mentok, geser ke kanan
            sliderContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Fungsi Scroll Kiri
    const scrollLeft = () => {
        if (sliderContainer.scrollLeft <= 0) {
            // Jika mentok kiri, lempar ke ujung paling akhir
            sliderContainer.scrollTo({ left: sliderContainer.scrollWidth, behavior: 'smooth' });
        } else {
            sliderContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    // Event Listener untuk Tombol
    btnRight.addEventListener("click", scrollRight);
    btnLeft.addEventListener("click", scrollLeft);

    // --- FITUR AUTO SLIDE ---
    // Atur interval perpindahan otomatis (misal: setiap 3 detik atau 3000ms)
    const startAutoSlide = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(scrollRight, 3000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Mulai auto-slide saat halaman dimuat, kecuali pengguna mengurangi animasi.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        startAutoSlide();
    }

    // Hentikan auto-slide jika pengguna sedang menyorot (hover) slider agar mereka bisa membaca
    sliderContainer.parentElement.addEventListener('mouseenter', stopAutoSlide);
    
    // Lanjutkan auto-slide saat kursor pengguna pergi dari area slider
    sliderContainer.parentElement.addEventListener('mouseleave', () => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startAutoSlide();
        }
    });
}
