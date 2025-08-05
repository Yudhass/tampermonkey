// ==UserScript==
// @name         Auto Click Ad - Maqal360 & CryptoWidgets (Dynamic Button)
// @namespace    auto-click-ad-mq360-cryptow
// @version      1.5
// @description  Klik iklan otomatis di Maqal360 dan tombol acak di cryptowidgets.net
// @author       You
// @match        https://www.maqal360.com/*
// @match        https://cryptowidgets.net/*
// @match        https://freeoseocheck.com/*
// @match        https://freeoseocheck.com/*
// @match        https://giftmagic.net/*
// @match        https://coinsvalue.net/blog/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const adKeywords = [
        "ads", "advertisement", "themoneytizer", "doubleclick", "adservice", "clickadu", "propellerads"
    ];

    function isAdElement(el) {
        if (!el) return false;

        const tag = el.tagName.toLowerCase();
        const src = el.src || "";
        const href = el.href || "";
        const outerHTML = el.outerHTML || "";

        return (
            (tag === "a" || tag === "iframe" || tag === "img" || tag === "div") &&
            adKeywords.some(keyword =>
                src.includes(keyword) || href.includes(keyword) || outerHTML.includes(keyword)
            )
        );
    }

    function clickFirstAd() {
        const elements = document.querySelectorAll('a, iframe, img, div');

        for (let el of elements) {
            if (isAdElement(el)) {
                console.log("✅ Iklan ditemukan:", el);

                if (el.tagName.toLowerCase() === "a" && el.href) {
                    const adUrl = el.href;
                    console.log("👉 Membuka iklan:", adUrl);
                    el.setAttribute("target", "_blank");
                    window.open(adUrl, "_blank");
                    return;
                }

                if (el.tagName.toLowerCase() === "iframe") {
                    try {
                        const iframeDoc = el.contentDocument || el.contentWindow.document;
                        const linkInIframe = iframeDoc.querySelector('a[href]');
                        if (linkInIframe) {
                            console.log("👉 Klik link dalam iframe:", linkInIframe.href);
                            window.open(linkInIframe.href, "_blank");
                            return;
                        }
                    } catch (e) {
                        console.warn("⚠️ Tidak bisa akses isi iframe (cross-origin).");
                    }
                }
            }
        }

        console.log("🚫 Tidak ada iklan yang cocok ditemukan.");
    }

    function assistUserToClickRealButton() {
        const loadingDiv = document.getElementById("loadingDiv");
        if (!loadingDiv) return;

        const textSpan = loadingDiv.querySelector('span');
        if (!textSpan) return;

        const match = textSpan.textContent.match(/Click (\w+) To Start/i);
        if (!match) return;

        const buttonText = match[1].trim();
        const buttons = loadingDiv.querySelectorAll("button");

        for (let btn of buttons) {
            if (btn.textContent.trim() === buttonText) {
                console.log(`🧠 Tombol '${buttonText}' ditemukan.`);

                // Salin teks tombol ke clipboard agar user bisa klik manual
                navigator.clipboard.writeText(buttonText);

                alert(`Klik tombol "${buttonText}" untuk melanjutkan. Sudah disalin ke clipboard.`);

                // Fokus ke tombol
                btn.scrollIntoView({ behavior: "smooth", block: "center" });
                btn.style.outline = "3px solid red";
                btn.focus();
                return;
            }
        }

        console.log(`❌ Tombol '${buttonText}' tidak ditemukan.`);
    }
    window.addEventListener('load', () => {
        console.log("⏳ Halaman selesai dimuat. Menunggu 3 detik...");

        setTimeout(() => {
            if (location.hostname.includes("maqal360.com")) {
                clickFirstAd();
            } else if (location.hostname.includes("cryptowidgets.net")) {
                assistUserToClickRealButton();
            }
        }, 3000);
    });
})();
