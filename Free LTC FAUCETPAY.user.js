// ==UserScript==
// @name         Free LTC FAUCETPAY
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Free LTC FAUCETPAY
// @author       FPS
// @match        https://freebitmail.pp.ua/*
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let postParams = null;
    let intervalId = null; // Variable para almacenar el ID del intervalo

    // Función para agregar el textarea al HTML
    function addTextarea() {
        const textarea = document.createElement('textarea');
        textarea.id = 'postDataTextarea';
        textarea.style.width = '90%';
        textarea.style.height = '600px';
        document.body.appendChild(textarea);
    }
    function clearPage() {
        document.body.innerHTML = '';
        addTextarea();
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const tokenElement = document.querySelector('[name="token"]');
            if (tokenElement) {
                observer.disconnect();
                setupPostCapture();
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    function setupPostCapture() {
        const button = document.querySelector('#nextbutton');
        if (button) {
            button.addEventListener('click', (event) => {
                clearPage();
                const formData = new FormData(event.target.form);
                postParams = [];
                formData.forEach((value, key) => {
                    postParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                });
                postParams.push('claim=' + encodeURIComponent(''));
                const postDataString = postParams.join('&');
                document.getElementById('postDataTextarea').value = "Wait for Claim"

                event.preventDefault();
                startPostRequestLoop(postDataString);
            });
        }
    }
    function startPostRequestLoop(postDataString) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            axios.post('https://freebitmail.pp.ua/', postDataString, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                console.log('POST exitoso:', response.data);
                document.getElementById('postDataTextarea').value += '\nClaim: 0.00000001 LTC';
            })
            .catch(error => {
                console.error('Error en el POST:', error);
            });
        }, 2000);
    }

})();