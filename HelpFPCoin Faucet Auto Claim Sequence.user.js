// ==UserScript==
// @name         HelpFPCoin Faucet Auto Claim Sequence
// @namespace    helpfpcoin-auto
// @version      2.4
// @description  Auto claim faucets with reload handling & sequence tracking
// @author       You
// @match        https://helpfpcoin.site/faucet/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const claimDelay = 7000; // 7 detik sebelum pindah halaman
    const claimButtonSelector = '.claim-btn input[type="submit"][name="claim_button_claim"]';

    // Daftar halaman dalam urutan klaim
    const faucetPages = ["sol"];

    function getCurrentPage() {
        return window.location.pathname.split('/').pop();
    }

    function getClaimStatus() {
        return JSON.parse(localStorage.getItem("claimStatus")) || {};
    }

    function updateClaimStatus(page) {
        let status = getClaimStatus();
        status[page] = 1;
        localStorage.setItem("claimStatus", JSON.stringify(status));
    }

    function resetClaimStatus() {
        let newStatus = {};
        faucetPages.forEach(page => newStatus[page] = 0);
        localStorage.setItem("claimStatus", JSON.stringify(newStatus));
    }

    function allClaimed() {
        let status = getClaimStatus();
        return faucetPages.every(page => status[page] === 1);
    }

    function getNextPage() {
        let status = getClaimStatus();
        let nextPage = faucetPages.find(page => !status[page]);
        return nextPage || faucetPages[0]; // Jika semua sudah diklaim, mulai dari awal
    }

    function startCountdown(seconds, callback) {
        let timeLeft = seconds;
        const timer = setInterval(() => {
            console.log(`⏳ Redirecting in ${timeLeft} seconds...`);
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timer);
                callback();
            }
        }, 1000);
    }

    function clickClaimButton() {
        const submitInput = document.querySelector('#submitFaucet');
        const visibleButton = document.querySelector('.claim-btn');
        const currentPage = getCurrentPage();

        if (submitInput) {
            console.log(`✅ Claiming ${currentPage}...`);
            submitInput.disabled = false;
            submitInput.removeAttribute('disabled');
            sessionStorage.setItem("claimClicked", "true");
            submitInput.click();
        } else if (visibleButton) {
            console.log(`✅ Claiming via visible button ${currentPage}...`);
            visibleButton.click();
        } else {
            console.log(`❌ Claim button not found. Redirecting in ${claimDelay / 1000} seconds.`);
            startCountdown(claimDelay / 1000, () => {
                const nextPage = getNextPage();
                console.log(`⏭️ Redirecting to: /faucet/${nextPage}`);
                window.location.href = `https://helpfpcoin.site/faucet/${nextPage}`;
            });
        }
    }


    function handlePostReload() {
        const currentPage = getCurrentPage();
        if (sessionStorage.getItem("claimClicked") === "true") {
            console.log(`🔄 Detected reload after claim on ${currentPage}. Proceeding to next page...`);
            sessionStorage.removeItem("claimClicked"); // Hapus status setelah reload

            // Tandai halaman sebagai diklaim
            updateClaimStatus(currentPage);

            startCountdown(claimDelay / 1000, () => {
                if (allClaimed()) {
                    console.log(`🔄 Semua halaman sudah diklaim! Resetting status...`);
                    resetClaimStatus();
                }
                const nextPage = getNextPage();
                console.log(`⏭️ Redirecting to: /faucet/${nextPage}`);
                window.location.href = `https://helpfpcoin.site/faucet/${nextPage}`;
            });
        } else {
            console.log(`⌛ Waiting 12 seconds before first claim...`);
            startCountdown(10, clickClaimButton);
        }
    }

    function init() {
        console.log(`🚀 Auto claim script started on ${window.location.href}`);
        if (!localStorage.getItem("claimStatus")) {
            resetClaimStatus();
        }
        handlePostReload();
    }

    init();
})();
