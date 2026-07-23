document.addEventListener('DOMContentLoaded', () => {
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

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
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

    // EmailJS
const form = document.querySelector(".reservation-form");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const btn = form.querySelector("button");

        btn.disabled = true;
        btn.innerText = "Sending...";

        emailjs.send(
            "service_uhas1rw",
            "template_hhyfys3",
            {
                name: document.getElementById("name").value,
                booking_date: document.getElementById("date").value,
                hour: document.getElementById("time").value,
                quantity: document.getElementById("guests").value,
                number: document.getElementById("phone").value
            }
        )
        .then(function () {
            alert("🎉 Reservation sent successfully!\n\nThank you for your reservation.");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
        .catch(function (error) {

            console.log(error);

            alert(error.text || error.message);

        })
        .finally(function () {

            btn.disabled = false;
            btn.innerText = "Send Reservation Request";

        });

    });

}
});
