import { BookingApi } from "./booking-api.js";
import { MenuFlipbook } from "./menu-flipbook.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Flipbook Menu
    new MenuFlipbook('#flipbook');

    // View Toggle Handler (Flipbook View vs Grid View)
    const btnFlipbook = document.getElementById('btn-view-flipbook');
    const btnGrid = document.getElementById('btn-view-grid');
    const flipbookContainer = document.getElementById('flipbook-container');
    const gridViewContainer = document.getElementById('grid-view-container');

    if (btnFlipbook && btnGrid && flipbookContainer && gridViewContainer) {
        btnFlipbook.addEventListener('click', () => {
            btnFlipbook.classList.add('active');
            btnGrid.classList.remove('active');
            flipbookContainer.classList.remove('hidden');
            gridViewContainer.classList.add('hidden');
        });

        btnGrid.addEventListener('click', () => {
            btnGrid.classList.add('active');
            btnFlipbook.classList.remove('active');
            gridViewContainer.classList.remove('hidden');
            flipbookContainer.classList.add('hidden');
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking a navigation link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // // Form submission for Unicode support
    // const form = document.querySelector('.reservation-form');
    // if (form) {
    //     form.addEventListener('submit', (e) => {
    //         e.preventDefault();
    //         const name = document.getElementById('name').value;
    //         const date = document.getElementById('date').value;
    //         const time = document.getElementById('time').value;
    //         const guests = document.getElementById('guests').value;

    //         const subject = "Table Reservation";
    //         const body = `Name: ${name}\r\nDate: ${date}\r\nTime: ${time}\r\nGuests: ${guests}`;

    //         window.location.href = `mailto:reservations@akaisushi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    //     });
    // }

const form = document.querySelector(".reservation-form");

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const button = form.querySelector("button");

        button.disabled = true;
        button.innerText = "Sending...";

        try {

            const payload = {

                name: document.getElementById("name").value.trim(),

                phone: document.getElementById("phone").value.trim(),

                booking_date: document.getElementById("date").value,

                booking_time: document.getElementById("time").value,

                guest_count: Number(
                    document.getElementById("guests").value
                )

            };

            const result = await BookingApi.create(payload);

            alert(result.data.message);

            form.reset();

        }
        catch (error) {

            alert(error.message);

        }
        finally {

            button.disabled = false;

            button.innerText = "Send Reservation Request";

        }

    });

}
});
