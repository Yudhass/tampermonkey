// ==UserScript==
// @name         Auto Login & Redirect lemeclaim + Auto Click Specific Buttons
// @namespace    autologin-lemeclaim
// @version      1.0
// @description  Auto-fill email, login, redirect, and click a specific button on short.php
// @author       You
// @match        https://lemeclaim.xyz/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const email = "bimaboim8@gmail.com"; // Ganti dengan email Faucetpay Anda

    // Daftar tombol yang diperbolehkan untuk diklik
    const allowedButtons = [
        "linksflame", "oii", "flyad", "gplinks", "shrinkearn",
        "megaurl", "fc", "megafly", "clk", "shortano", "shrinkme"
    ];

    // Fungsi untuk mengisi email dan klik tombol login
    //<input type="text" name="email" class="form-control" placeholder="Your Email from Faucetpay" value="" maxlength="100" required="">
    function autoLogin() {
        let emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.value = email;
            console.log("Email diisi:", email);

            setTimeout(() => {
                let loginButton = document.querySelector('button[name="btn-start"]');
                if (loginButton) {
                    console.log("Menekan tombol login...");
                    loginButton.click();
                } else {
                    console.log("Tombol login tidak ditemukan!");
                }
            }, 2000);
        } else {
            console.log("Input email tidak ditemukan!");
        }
    }

    // Fungsi untuk mengecek halaman home dan redirect ke short.php
    function checkAndRedirect() {
        if (window.location.href.includes("home.php")) {
            console.log("Berada di halaman home, mengarahkan ke short.php...");
            setTimeout(() => {
                window.location.href = "https://lemeclaim.xyz/short.php";
            }, 2000);
        }
    }

    // Fungsi untuk mengklik tombol yang sesuai
    function autoClickButton() {
        const buttons = document.querySelectorAll('form button[type="submit"]');
        const filteredButtons = Array.from(buttons).filter(button =>
            allowedButtons.includes(button.name)
        );

        if (filteredButtons.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredButtons.length);
            const buttonToClick = filteredButtons[randomIndex];

            console.log("Menekan tombol:", buttonToClick.innerText);
            setTimeout(() => {
                buttonToClick.click();
            }, 2000);
        } else {
            console.log("Tidak ada tombol yang cocok ditemukan!");
        }
    }

    // Eksekusi berdasarkan halaman
    if (window.location.pathname === "/") {
        window.onload = autoLogin;
    } else if (window.location.pathname === "/home.php") {
        window.onload = checkAndRedirect;
    } else if (window.location.pathname === "/short.php") {
        window.onload = autoClickButton;
    }
})();