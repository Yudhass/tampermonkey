// ==UserScript==
// @name         Auto Redirect & Random Click Button cashbux
// @namespace    cashbux-auto
// @version      1.1
// @description  Redirects to /ptc and randomly clicks a button on Cashbux
// @author       You
// @match        https://cashbux.work/dashboard
// @match        https://cashbux.work/ptc
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Jika berada di /dashboard, arahkan ke /ptc
    if (window.location.pathname === "/dashboard") {
        window.location.href = "https://cashbux.work/ptc";
        return;
    }

    // Fungsi untuk memilih tombol secara acak dan mengkliknya
    function clickRandomButton() {
        let buttons = document.querySelectorAll('button.btn-primary.btn-block');
        if (buttons.length > 0) {
            let randomIndex = Math.floor(Math.random() * buttons.length);
            console.log("Menemukan tombol, mengklik tombol ke-", randomIndex);
            buttons[randomIndex].click();
        } else {
            console.log("Tidak ada tombol yang ditemukan!");
        }
    }

    // Jalankan setelah halaman dimuat
    window.onload = function() {
        setTimeout(clickRandomButton, 2000);
    };
})();
