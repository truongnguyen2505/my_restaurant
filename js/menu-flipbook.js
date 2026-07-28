export class MenuFlipbook {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.pages = Array.from(this.container.querySelectorAll('.fb-page'));
        this.totalPages = this.pages.length;
        this.currentPage = 0;
        this.isMobile = window.innerWidth <= 768;

        this.prevBtn = document.getElementById('fb-prev');
        this.nextBtn = document.getElementById('fb-next');
        this.pageCounter = document.getElementById('fb-page-num');

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateView();

        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            if (wasMobile !== this.isMobile) {
                this.updateView();
            }
        });
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevPage());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextPage());
        }

        // Direct click on book pages to flip
        this.pages.forEach((page, index) => {
            page.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;

                if (this.isMobile) {
                    if (this.currentPage < this.totalPages - 1) {
                        this.nextPage();
                    } else {
                        this.currentPage = 0;
                        this.updateView();
                    }
                } else {
                    if (this.currentPage === 0 || index % 2 === 0) {
                        this.nextPage();
                    } else {
                        this.prevPage();
                    }
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const flipbookSection = document.getElementById('flipbook-container');
            if (!flipbookSection || flipbookSection.classList.contains('hidden')) return;

            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                this.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                this.prevPage();
            }
        });

        // Touch Swipe Navigation for Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const threshold = 40;
        if (startX - endX > threshold) {
            this.nextPage(); // Swipe Left -> Next
        } else if (endX - startX > threshold) {
            this.prevPage(); // Swipe Right -> Prev
        }
    }

    nextPage() {
        if (this.isMobile) {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.updateView();
            }
        } else {
            // Desktop spread steps: 0 (Front Cover) -> 1 (Intro+Sushi) -> 3 (Hot Kitchen+Sake) -> 5 (Back Cover)
            if (this.currentPage === 0) {
                this.currentPage = 1;
            } else if (this.currentPage === 1 || this.currentPage === 2) {
                this.currentPage = 3;
            } else if (this.currentPage === 3 || this.currentPage === 4) {
                this.currentPage = 5;
            }
            this.updateView();
        }
    }

    prevPage() {
        if (this.isMobile) {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.updateView();
            }
        } else {
            // Desktop spread reverse steps: 5 -> 3 -> 1 -> 0
            if (this.currentPage === 5) {
                this.currentPage = 3;
            } else if (this.currentPage === 3 || this.currentPage === 4) {
                this.currentPage = 1;
            } else if (this.currentPage === 1 || this.currentPage === 2) {
                this.currentPage = 0;
            }
            this.updateView();
        }
    }

    updateView() {
        if (this.isMobile) {
            // Mobile: 1 page at a time
            this.pages.forEach((page, index) => {
                page.classList.remove('flipped', 'active-page', 'visible', 'left-spread', 'right-spread');
                if (index === this.currentPage) {
                    page.classList.add('visible', 'active-page');
                }
            });

            if (this.pageCounter) {
                this.pageCounter.innerText = `Page ${this.currentPage + 1} of ${this.totalPages}`;
            }
            if (this.prevBtn) this.prevBtn.disabled = this.currentPage === 0;
            if (this.nextBtn) this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
        } else {
            // Desktop: Cover at 0, Cover at 5, Spreads at 1-2 and 3-4
            this.pages.forEach((page, index) => {
                page.classList.remove('flipped', 'active-page', 'visible', 'left-spread', 'right-spread');

                if (this.currentPage === 0) {
                    if (index === 0) page.classList.add('visible');
                } else if (this.currentPage === 5) {
                    if (index === 5) page.classList.add('visible');
                } else if (this.currentPage === 1 || this.currentPage === 2) {
                    if (index === 1) page.classList.add('visible', 'left-spread');
                    if (index === 2) page.classList.add('visible', 'right-spread');
                } else if (this.currentPage === 3 || this.currentPage === 4) {
                    if (index === 3) page.classList.add('visible', 'left-spread');
                    if (index === 4) page.classList.add('visible', 'right-spread');
                }
            });

            if (this.pageCounter) {
                if (this.currentPage === 0) {
                    this.pageCounter.innerText = `Front Cover (1 / ${this.totalPages})`;
                } else if (this.currentPage === 5) {
                    this.pageCounter.innerText = `Back Cover (${this.totalPages} / ${this.totalPages})`;
                } else if (this.currentPage === 1 || this.currentPage === 2) {
                    this.pageCounter.innerText = `Pages 2-3 / ${this.totalPages}`;
                } else if (this.currentPage === 3 || this.currentPage === 4) {
                    this.pageCounter.innerText = `Pages 4-5 / ${this.totalPages}`;
                }
            }

            if (this.prevBtn) this.prevBtn.disabled = this.currentPage === 0;
            if (this.nextBtn) this.nextBtn.disabled = this.currentPage === 5;
        }
    }
}
