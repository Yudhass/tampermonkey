// ==UserScript==
// @name         Auto Click Shortlink on HelpFPCoin
// @namespace    auto-click-helpfpcoin
// @version      1.2
// @description  Auto click shortlink buttons on HelpFPCoin site and handle popups
// @author       You
// @match        https://helpfpcoin.site/link/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Daftar kategori shortlink yang diperbolehkan
    const allowedShortlinks = ["Adlink", "Earnow", "Clk", "Shrinkme", "Shrinkearn", "Fc", "Cuty", "Shortano", "Shortino"];

    function clickShortlinkButton() {
        // Cari semua elemen dengan class "link-div"
        const linkDivs = document.querySelectorAll('.link-div');

        for (const div of linkDivs) {
            // Ambil teks kategori shortlink
            const category = div.querySelector('span')?.innerText.trim();

            // Jika kategori ada dalam daftar yang diperbolehkan
            if (category && allowedShortlinks.includes(category)) {
                const button = div.querySelector('a.link-go');
                if (button) {
                    console.log("Menekan tombol:", button.innerText);
                    setTimeout(() => {
                        button.click();
                        waitForPopup(); // Tunggu pop-up setelah reload
                    }, 2000);
                    return; // Berhenti setelah menemukan tombol pertama yang cocok
                }
            }
        }

        console.log("Tidak ada tombol yang cocok ditemukan!");
    }

    function waitForPopup() {
        const observer = new MutationObserver((mutations, obs) => {
            const popup = document.querySelector('.pop-box');
            if (popup) {
                const newLinkButton = popup.querySelector('button a[href*="cancel"]');
                if (newLinkButton) {
                    console.log("Menekan tombol Go New Link, Yes!");
                    setTimeout(() => {
                        newLinkButton.click();
                    }, 1000);
                    obs.disconnect(); // Hentikan observer setelah klik
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.onload = () => {
        clickShortlinkButton();
    };
})();
