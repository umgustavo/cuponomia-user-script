// ==UserScript==
// @name         Cuponomia User Script
// @namespace    https://github.com/umgustavo/cuponomia-user-script
// @version      1.0
// @description  User Script para o Cuponomia.
// @author       Gustavo (https://github.com/umgustavo)
// @license      MIT License
// @homepage     https://github.com/umgustavo/cuponomia-user-script
// @homepageURL  https://github.com/umgustavo/cuponomia-user-script
// @match        https://*.cuponomia.com.br/desconto/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function app() {
        function success(message) {
            require(['views/Feedback'], (t) => {
                t.showSuccess(message);
            });
        }

        function removeData(el) {
            let nodes = [];
            for (
                let att, i = 0, atts = el.attributes, n = atts.length;
                i < n;
                i++
            ) {
                att = atts[i];
                nodes.push(att.nodeName);
            }

            nodes.forEach((node) => {
                if (node.startsWith('data-')) {
                    el.removeAttribute(node);
                }
            });
        }

        function removeAds() {
            const ads = document.querySelectorAll(
                '.js-get-container.get-container.item, .sidebar-store.js-sidebar-store, .sidebar-extension.js-sidebar-extension, .storeHeader-logo.js-storeLogo, #modalRedeem'
            );
            ads.forEach((ad) => {
                ad.remove();
            });
        }

        function copy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.opacity = 0;
            ta.style.width = 0;
            ta.style.top = 0;
            ta.style.left = 0;
            ta.style.position = 'fixed';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }

        function log() {
            console.log(
                '%c[Cuponomia User Script]%c',
                'color: #f0f;',
                '\x1B[0m',
                ...arguments
            );
        }

        log('Iniciando...');
        log('Removendo anúncios...');
        removeAds();

        log('Removendo covers...');
        const covers = document.querySelectorAll('.item-promo-link.item-cover');
        covers.forEach((cover) => {
            cover.remove();
        });

        log('Alinhando cupons...');
        const links = document.querySelectorAll('.item-code-link');
        links.forEach((link) => {
            link.style.textAlign = 'center';
        });

        log('Hooking nos botões...');
        const buttons = document.querySelectorAll('.item-promo.item-code');
        let cupomCounter = 0;
        buttons.forEach((button) => {
            const parent = button.parentElement;
            removeData(parent);
            removeData(button);
            button.removeEventListener('click', button.onclick);

            const cupom = button.children[0].children[0].innerText;
            if (cupom) {
                cupomCounter++;
            }

            button.addEventListener('click', (e) => {
                e.preventDefault();
                const cupom = button.children[0].children[0].innerText;
                log('Cupom detectado: ' + cupom);
                copy(cupom);
                success('Cupom copiado para a área de transferência!');
            });
        });
        log('' + cupomCounter + ' cupons encontrados!');
    }

    app();
})();
