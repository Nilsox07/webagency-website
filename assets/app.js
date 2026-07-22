
/* =============================================================
   NILS WEBDESIGN – Gemeinsames JavaScript (Vanilla JS)
   Wird von allen Seiten eingebunden.
   ============================================================= */
(function () {
    'use strict';

    /* ---- 1. Header: Glas-Effekt / Schatten beim Scrollen ---- */
    var header = document.getElementById('header');
    if (header) {
        var onScroll = function () {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---- 2. Mobiles Menü öffnen / schließen ---- */
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (toggle && nav) {
        var toggleMenu = function () {
            var open = nav.classList.toggle('open');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        toggle.addEventListener('click', toggleMenu);

        // Beim Klick auf einen echten Link (kein Dropdown-Öffner) schließen
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                if (nav.classList.contains('open')) { toggleMenu(); }
            });
        });
    }

    /* ---- 3. Scroll-Reveal: Elemente sanft einblenden ---- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        // Fallback: sofort sichtbar
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---- 4. Kontaktformular (Demo ohne Backend) ---- */
    var form = document.getElementById('contactForm');
    if (form) {
        var success = document.getElementById('formSuccess');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            if (success) { success.classList.add('show'); }
            form.reset();
            setTimeout(function () {
                if (success) { success.classList.remove('show'); }
            }, 6000);
        });
    }

    /* ---- 5. FAQ-Akkordeon (falls vorhanden) ---- */
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        var q = item.querySelector('.faq-q');
        var a = item.querySelector('.faq-a');
        if (!q || !a) { return; }
        q.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            // andere schließen (Akkordeon-Verhalten)
            faqItems.forEach(function (other) {
                other.classList.remove('open');
                var oa = other.querySelector('.faq-a');
                if (oa) { oa.style.maxHeight = null; }
            });
            if (!isOpen) {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });

    /* ---- 6. Aktuelles Jahr im Footer ---- */
    var yearEls = document.querySelectorAll('[data-year]');
    if (yearEls.length) {
        var year = new Date().getFullYear();
        yearEls.forEach(function (el) { el.textContent = year; });
    }

    /* =========================================================
       6b. COOKIE-/CONSENT-BANNER (§ 25 TDDDG + DSGVO)
       Granular, Opt-in, „Ablehnen" gleichwertig zu „Akzeptieren",
       Widerruf jederzeit, Einwilligung dokumentiert (Zeitstempel +
       Version). Schriften werden NICHT mehr extern geladen (lokal),
       daher gibt es derzeit keine aktiven, einwilligungspflichtigen
       Dienste – die Architektur ist aber für künftige (Maps, Statistik …)
       bereits vorbereitet (NWConsent.onConsent / loadScript).
       ========================================================= */
    (function () {
        var VERSION = 1;
        var KEY = 'nw_consent_v1';
        var MAX_AGE_DAYS = 180;

        // Kategorien + dahinterliegende Dienste (transparent gelistet)
        var CATS = [
            { id: 'essential', name: 'Notwendig', required: true,
              desc: 'Für den Betrieb der Seite technisch erforderlich. Speichert nur Ihre Cookie-Auswahl und Sitzungsinfos – kein Tracking.',
              services: 'First-Party-Speicher: nw_consent_v1 (Ihre Auswahl), lumi_seen (Anzeige des Lumi-Buttons). Keine Drittanbieter.' },
            { id: 'statistics', name: 'Statistik', required: false,
              desc: 'Hilft uns, die Nutzung anonymisiert zu verstehen und die Seite zu verbessern.',
              services: 'Derzeit keine Dienste aktiv. (Vorbereitet, z. B. für eine datensparsame Statistik.)' },
            { id: 'marketing', name: 'Marketing', required: false,
              desc: 'Für Reichweitenmessung und passende Werbung.',
              services: 'Derzeit keine Dienste aktiv.' },
            { id: 'external_media', name: 'Externe Medien', required: false,
              desc: 'Inhalte von Drittanbietern, die erst auf Wunsch geladen werden.',
              services: 'Derzeit keine Dienste aktiv. (Würde z. B. Google Maps oder Video-Einbettungen umfassen, sobald sie eingebunden werden.)' }
        ];

        var gates = { statistics: [], marketing: [], external_media: [] };

        function readConsent() {
            try {
                var raw = localStorage.getItem(KEY);
                if (!raw) { return null; }
                var data = JSON.parse(raw);
                if (!data || data.version !== VERSION || !data.ts) { return null; }
                if ((Date.now() - data.ts) > MAX_AGE_DAYS * 864e5) { return null; }
                return data;
            } catch (e) { return null; }
        }
        function writeConsent(cats) {
            var data = { version: VERSION, ts: Date.now(), categories: cats };
            try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
            return data;
        }
        function applyConsent(cats) {
            ['statistics', 'marketing', 'external_media'].forEach(function (c) {
                if (cats[c]) { while (gates[c].length) { try { gates[c].shift()(); } catch (e) {} } }
            });
        }

        // Öffentliche API für künftige Skripte
        window.NWConsent = {
            open: function () { showBanner(true); },
            get: function () { var d = readConsent(); return d ? d.categories : null; },
            onConsent: function (cat, fn) {
                var d = readConsent();
                if (d && d.categories[cat]) { try { fn(); } catch (e) {} }
                else if (gates[cat]) { gates[cat].push(fn); }
            }
        };

        /* ---- Styles ---- */
        var css =
            '.nwc-ov{position:fixed;inset:0;z-index:1600;display:none;}' +
            '.nwc-ov.show{display:block;}' +
            '.nwc-ov.modal{background:rgba(11,37,69,.45);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);}' +
            '.nwc{position:fixed;left:16px;right:16px;bottom:16px;z-index:1601;max-width:560px;margin:0 auto;background:#F9F9F6;color:#1C1E21;border:1px solid #e2e0d8;border-radius:16px;box-shadow:0 24px 60px rgba(11,37,69,.35);padding:22px 22px 18px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:nwcUp .35s ease;}' +
            '@keyframes nwcUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}' +
            '.nwc h2{font-family:"Playfair Display",Georgia,serif;font-size:1.3rem;margin:0 0 8px;color:#0B2545;}' +
            '.nwc p{font-size:.9rem;line-height:1.55;color:#3a4048;margin:0 0 16px;}' +
            '.nwc a{color:#0B2545;}' +
            '.nwc-actions{display:flex;gap:10px;flex-wrap:wrap;}' +
            '.nwc-btn{flex:1 1 auto;min-width:130px;font-family:inherit;font-weight:600;font-size:.92rem;padding:13px 16px;border-radius:10px;cursor:pointer;border:1.5px solid #0B2545;background:#fff;color:#0B2545;transition:background .2s,color .2s;}' +
            '.nwc-btn:hover{background:#0B2545;color:#fff;}' +
            '.nwc-btn:focus-visible{outline:2px solid #0B2545;outline-offset:2px;}' +
            '.nwc-link{display:block;margin:10px auto 0;background:none;border:none;color:#0B2545;text-decoration:underline;font-family:inherit;font-size:.86rem;cursor:pointer;}' +
            '.nwc-cats{display:flex;flex-direction:column;gap:10px;margin:0 0 16px;max-height:46vh;overflow:auto;}' +
            '.nwc-cat{border:1px solid #e2e0d8;border-radius:12px;background:#fff;padding:12px 14px;}' +
            '.nwc-ch{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}' +
            '.nwc-ch .t{font-weight:700;font-size:.95rem;color:#1C1E21;}' +
            '.nwc-cat .d{font-size:.82rem;margin:6px 0 0;color:#5a5f66;line-height:1.45;}' +
            '.nwc-sw{position:relative;width:46px;height:26px;flex-shrink:0;}' +
            '.nwc-sw input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer;}' +
            '.nwc-sw .tr{position:absolute;inset:0;background:#cdd2d8;border-radius:26px;transition:background .2s;}' +
            '.nwc-sw .kn{position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3);}' +
            '.nwc-sw input:checked~.tr{background:#0B2545;}' +
            '.nwc-sw input:checked~.kn{transform:translateX(20px);}' +
            '.nwc-sw input:disabled~.tr{background:#E6D8C3;}' +
            '.nwc-sw input:focus-visible~.tr{outline:2px solid #0B2545;outline-offset:2px;}' +
            '.nwc-det{margin-top:8px;font-size:.78rem;color:#5a5f66;}' +
            '.nwc-det summary{cursor:pointer;color:#0B2545;}' +
            '.nwc-det p{font-size:.78rem;margin:6px 0 0;color:#5a5f66;}' +
            '@media(max-width:560px){.nwc{left:8px;right:8px;bottom:8px;}.nwc-btn{min-width:0;}}';
        var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

        var ov = document.createElement('div');
        ov.className = 'nwc-ov';
        document.body.appendChild(ov);
        var lastFocus = null;

        function close() {
            ov.classList.remove('show', 'modal');
            ov.innerHTML = '';
            if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
        }

        function finish(cats) { writeConsent(cats); applyConsent(cats); close(); }

        function level1() {
            ov.classList.remove('modal');
            ov.innerHTML =
                '<div class="nwc" role="dialog" aria-modal="false" aria-labelledby="nwcT" aria-describedby="nwcD">' +
                '<h2 id="nwcT">Datenschutz-Einstellungen</h2>' +
                '<p id="nwcD">Wir verwenden Cookies und ähnliche Technologien. Notwendige sind für den Betrieb erforderlich. Optionale (Statistik, Marketing, externe Medien) setzen wir nur mit Ihrer Einwilligung – Sie können frei wählen und jederzeit widerrufen. Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
                '<div class="nwc-actions">' +
                '<button class="nwc-btn" type="button" data-reject>Alle ablehnen</button>' +
                '<button class="nwc-btn" type="button" data-accept>Alle akzeptieren</button>' +
                '</div><button class="nwc-link" type="button" data-settings>Einstellungen anpassen</button></div>';
            ov.querySelector('[data-accept]').onclick = function () { finish(all(true)); };
            ov.querySelector('[data-reject]').onclick = function () { finish(all(false)); };
            ov.querySelector('[data-settings]').onclick = level2;
            focusFirst();
        }

        function level2() {
            ov.classList.add('modal');
            var rows = CATS.map(function (c, i) {
                var sw = '<span class="nwc-sw"><input type="checkbox" id="nwc_' + c.id + '" ' +
                    (c.required ? 'checked disabled' : '') + ' aria-describedby="nwcd_' + c.id + '"><span class="tr"></span><span class="kn"></span></span>';
                return '<div class="nwc-cat"><div class="nwc-ch"><label class="t" for="nwc_' + c.id + '">' + c.name + (c.required ? ' (immer aktiv)' : '') + '</label>' + sw + '</div>' +
                    '<div class="d" id="nwcd_' + c.id + '">' + c.desc + '</div>' +
                    '<details class="nwc-det"><summary>Dienste anzeigen</summary><p>' + c.services + '</p></details></div>';
            }).join('');
            ov.innerHTML =
                '<div class="nwc" role="dialog" aria-modal="true" aria-labelledby="nwcT2">' +
                '<h2 id="nwcT2">Datenschutz-Einstellungen</h2>' +
                '<p>Wählen Sie, welche Kategorien Sie zulassen möchten. Sie können dies jederzeit über „Cookie-Einstellungen" im Footer ändern.</p>' +
                '<div class="nwc-cats">' + rows + '</div>' +
                '<div class="nwc-actions">' +
                '<button class="nwc-btn" type="button" data-reject>Alle ablehnen</button>' +
                '<button class="nwc-btn" type="button" data-save>Auswahl speichern</button>' +
                '<button class="nwc-btn" type="button" data-accept>Alle akzeptieren</button>' +
                '</div></div>';
            ov.querySelector('[data-accept]').onclick = function () { finish(all(true)); };
            ov.querySelector('[data-reject]').onclick = function () { finish(all(false)); };
            ov.querySelector('[data-save]').onclick = function () {
                var cats = { essential: true };
                ['statistics', 'marketing', 'external_media'].forEach(function (id) {
                    var el = ov.querySelector('#nwc_' + id); cats[id] = !!(el && el.checked);
                });
                finish(cats);
            };
            focusFirst();
        }

        function all(v) { return { essential: true, statistics: v, marketing: v, external_media: v }; }

        function focusFirst() {
            var b = ov.querySelector('.nwc-btn'); if (b) { b.focus(); }
        }

        function showBanner(force) {
            lastFocus = document.activeElement;
            ov.classList.add('show');
            level1();
        }

        // ESC: nur schließen, wenn bereits eine Einwilligung existiert (sonst Auswahl nötig)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && ov.classList.contains('show') && readConsent()) { close(); }
        });

        // Footer-Link „Cookie-Einstellungen" (Widerruf jederzeit) injizieren
        function injectFooterLink() {
            var foot = document.querySelector('.footer-bottom');
            if (foot && !foot.querySelector('[data-cookie-settings]')) {
                var sep = document.createTextNode(' · ');
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('data-cookie-settings', '');
                btn.textContent = 'Cookie-Einstellungen';
                btn.style.cssText = 'background:none;border:none;color:inherit;text-decoration:underline;cursor:pointer;font:inherit;padding:0;';
                btn.addEventListener('click', function () { showBanner(true); });
                var span = foot.querySelector('span:last-child') || foot;
                span.appendChild(sep); span.appendChild(btn);
            }
        }
        injectFooterLink();

        // Beim ersten Besuch (oder abgelaufener/alter Einwilligung) Banner zeigen
        var existing = readConsent();
        if (existing) { applyConsent(existing.categories); }
        else { showBanner(false); }
    })();

    /* =========================================================
       6b2. LUMI – gemeinsame Engine (echte API + Fallback) und
       die (gezielteren, ausführlicheren) Fragen. Wird sowohl vom
       schwebenden Widget als auch vom Buchungs-Modal genutzt.
       ========================================================= */
    var LUMI_ENDPOINT = '/api/lumi-chat';   // serverseitiger Gemini-Proxy (api/lumi-chat.js)
    var LUMI_MAX_TURNS = 25;                // Missbrauchs-/Kostenschutz (B1)

    // Eindeutiges, anonymes Session-Token (für Rate-Limiting in chat_sessions)
    function lumiNewToken() {
        try { if (window.crypto && window.crypto.randomUUID) { return 'lumi-' + window.crypto.randomUUID(); } } catch (e) {}
        return 'lumi-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    }

    // Erste Nachricht (clientseitig fix – spart einen API-Aufruf)
    var LUMI_GREETING = 'Hallo, ich bin Lumi 👋 Ich stelle Ihnen ein paar gezielte Fragen, damit wir Ihre Website genau richtig bauen – ganz in Ruhe, Schritt für Schritt. Womit fangen wir an: Was machen Sie beruflich, und was genau bieten Sie an?';

    // Gezielte Folgefragen (Thema 2…). Reihenfolge dient zugleich dem Fallback ohne Backend.
    var LUMI_QUESTIONS = [
        'Was soll Ihre Website vor allem bewirken? Zum Beispiel mehr Anrufe, Terminbuchungen, Angebotsanfragen, Bewerbungen – oder einfach seriös präsentieren?',
        'Wer sind Ihre typischen Kundinnen und Kunden? (Privatpersonen oder Firmen, Region, Altersgruppe – und was ist diesen Menschen besonders wichtig?)',
        'Wie heißt Ihr Unternehmen genau, und wer ist Inhaber/in bzw. Ansprechpartner/in?',
        'Welche Kontaktdaten sollen auf die Seite? Bitte Adresse, Telefon und E-Mail – und, falls vorhanden, Rechtsform (z. B. GmbH) und Registernummer.',
        'Wie viele Mitarbeitende haben Sie ungefähr, und liegt der Jahresumsatz eher über oder unter 2 Mio. €? (Nur zur Einordnung, z. B. für Barrierefreiheits-Pflichten.)',
        'Welche Seiten brauchen Sie konkret? Häufig: Start, Leistungen/Angebot, Über uns, Referenzen/Galerie, Preise, Kontakt – was davon, und gibt es etwas Besonderes?',
        'Was sind Ihre 3–5 wichtigsten Leistungen oder Produkte, die unbedingt auf die Seite sollen?',
        'Haben Sie die Texte schon, oder sollen wir sie aus Ihren Stichpunkten schreiben? Und welche Ansprache passt – „Sie“ oder „Du“?',
        'Haben Sie ein Logo und eigene Fotos? Falls nicht: Sollen wir mit passenden Symbolbildern oder Illustrationen arbeiten?',
        'Welche Wirkung soll das Design haben – z. B. hochwertig/seriös, modern/minimalistisch, freundlich/warm oder kräftig/auffällig? Nennen Sie gern 1–3 Websites, die Ihnen gefallen, und was genau Ihnen daran zusagt.',
        'Welche Funktionen brauchen Sie? Z. B. Kontaktformular, Klick-Anruf, Karte/Anfahrt, Öffnungszeiten, Online-Terminbuchung, Bildergalerie, Bewertungen, Newsletter, Social-Media, Mehrsprachigkeit oder Shop.',
        'Bei welchen Suchbegriffen sollen Kunden Sie bei Google finden – und in welchem Ort bzw. Umkreis sind Sie tätig?',
        'Haben Sie schon eine Domain (z. B. ihre-firma.de)? Falls nein: Welchen Namen hätten Sie gern?',
        'Gibt es Vorgaben oder No-Gos? Z. B. feste Farben/Schriften aus Ihrem Briefpapier, Inhalte die nicht erscheinen dürfen, oder einen Wunschtermin?',
        'Wer ist Ihr stärkster Wettbewerber im Internet – und was möchten Sie besser machen?',
        'Gibt es sonst noch etwas, das wir wissen sollten?'
    ];
    var LUMI_LABELS = [
        'Tätigkeit & Angebot', 'Ziel der Website', 'Zielgruppe', 'Unternehmen & Ansprechpartner',
        'Kontakt & Rechtsform', 'Betriebsgröße', 'Gewünschte Seiten', 'Wichtigste Leistungen',
        'Texte & Tonalität', 'Logo & Bilder', 'Design-Wirkung & Vorbilder', 'Funktionen',
        'Suchbegriffe & Ort', 'Domain', 'Vorgaben & No-Gos', 'Wettbewerb', 'Sonstiges'
    ];
    var LUMI_TOTAL = LUMI_QUESTIONS.length + 1; // inkl. Begrüßungsfrage

    // Antwort zerlegen: trennt eine etwaige BRIEFING_JSON-Ausgabe ab
    function lumiParseReply(text) {
        var marker = 'BRIEFING_JSON:';
        var i = text.indexOf(marker);
        if (i < 0) { return { spoken: text.trim(), briefing: null }; }
        var spoken = text.slice(0, i).trim();
        var rest = text.slice(i + marker.length).trim();
        var briefing = null;
        try { briefing = JSON.parse(rest); } catch (e) { briefing = { _unparsed: rest }; }
        if (!spoken) { spoken = 'Vielen Dank! Ich habe alles notiert.'; }
        return { spoken: spoken, briefing: briefing };
    }

    // Fallback ohne Backend: nächste gescriptete Frage bzw. Abschluss-JSON
    function lumiScripted(messages) {
        var answers = [];
        messages.forEach(function (m) { if (m.role === 'user') { answers.push(m.content); } });
        var idx = answers.length - 1;
        if (idx < LUMI_QUESTIONS.length) { return LUMI_QUESTIONS[idx]; }
        var obj = { _quelle: 'fallback_ohne_ki', antworten: [] };
        answers.forEach(function (a, k) { obj.antworten.push({ thema: LUMI_LABELS[k] || ('Antwort ' + (k + 1)), text: a }); });
        return 'Vielen Dank, das war sehr hilfreich! 🙌 Ich habe alles notiert.\n\n' +
            'Hinweis: Dies war ein Briefing-Gespräch – Ihre Website wird danach von Hand gebaut, nicht sofort hier erzeugt. Das Team meldet sich mit der Bestätigung.\n\n' +
            'BRIEFING_JSON:\n' + JSON.stringify(obj);
    }

    // Eine Lumi-Antwort holen. Server erkennt das BRIEFING_JSON selbst und meldet
    // { reply, done, leadId }. Bei Netzwerk-/Serverfehler: gescripteter Fallback.
    // Rückgabe immer: { reply, done, leadId, blocked?, fallback? }
    function lumiAsk(message, history, pkg, token) {
        return fetch(LUMI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: token, message: message, history: history || [], package: pkg || null })
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (res.status === 429) { return { reply: (data && data.error) || 'Tageslimit erreicht. Bitte später erneut versuchen oder über das Kontaktformular melden.', done: false, blocked: true }; }
                if (!res.ok || !data || typeof data.reply !== 'string') { throw new Error('bad-response'); }
                return { reply: data.reply, done: !!data.done, leadId: data.leadId || null };
            });
        }).catch(function () {
            // Fallback ohne erreichbares Backend: gescriptetes Gespräch
            var hist = (history || []).concat([{ role: 'user', content: message }]);
            var parsed = lumiParseReply(lumiScripted(hist));
            return { reply: parsed.spoken, done: !!parsed.briefing, leadId: null, fallback: true };
        });
    }

    /* =========================================================
       6c. LUMI – schwebendes Briefing-Chat-Widget (Frontend)
       Läuft auf allen Seiten. Antworten aktuell als Dummy-Skript;
       in Teil B wird lumiReply() durch einen API-Aufruf ersetzt.
       ========================================================= */
    (function () {
        if (document.getElementById('lumiFab')) { return; }

        var SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.8 5.4a3 3 0 0 0 1.9 1.9L21 11l-5.3 1.7a3 3 0 0 0-1.9 1.9L12 20l-1.8-5.4a3 3 0 0 0-1.9-1.9L3 11l5.3-1.7a3 3 0 0 0 1.9-1.9z"/></svg>';
        var SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="#0B2545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

        /* ---- Styles injizieren ---- */
        var css =
        '.lumi-fab{position:fixed;right:22px;bottom:22px;z-index:1400;display:inline-flex;align-items:center;gap:10px;padding:13px 20px 13px 14px;border:none;border-radius:50px;background:#0B2545;color:#fff;font-family:Inter,sans-serif;font-weight:600;font-size:.94rem;cursor:pointer;box-shadow:0 12px 30px rgba(11,37,69,.35);transition:transform .2s,box-shadow .2s;}' +
        '.lumi-fab:hover{transform:translateY(-2px);box-shadow:0 16px 38px rgba(11,37,69,.45);}' +
        '.lumi-fab .lumi-spark{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#E6D8C3,#d8c4a6);display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
        '.lumi-fab .lumi-spark svg{width:18px;height:18px;fill:#0B2545;}' +
        '.lumi-fab.pulse{animation:lumiPulse 2.2s ease-out 3;}' +
        '@keyframes lumiPulse{0%{box-shadow:0 0 0 0 rgba(230,216,195,.7),0 12px 30px rgba(11,37,69,.35);}70%{box-shadow:0 0 0 18px rgba(230,216,195,0),0 12px 30px rgba(11,37,69,.35);}100%{box-shadow:0 0 0 0 rgba(230,216,195,0),0 12px 30px rgba(11,37,69,.35);}}' +
        '.lumi-fab[hidden],.lumi-win[hidden],.lumi-entry[hidden],.lumi-progress[hidden]{display:none;}' +
        '.lumi-win{position:fixed;right:22px;bottom:22px;z-index:1401;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 32px);background:#F9F9F6;border-radius:20px;box-shadow:0 30px 70px rgba(11,37,69,.4);display:flex;flex-direction:column;overflow:hidden;font-family:Inter,sans-serif;animation:lumiUp .35s ease;}' +
        '@keyframes lumiUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:none;}}' +
        '@media(max-width:480px){.lumi-win{right:8px;left:8px;bottom:8px;width:auto;height:calc(100vh - 16px);max-height:none;}}' +
        '.lumi-head{background:#0B2545;color:#fff;padding:13px 16px;display:flex;align-items:center;gap:12px;}' +
        '.lumi-head .lumi-ava-lg{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#E6D8C3,#d8c4a6);display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
        '.lumi-head .lumi-ava-lg svg{width:23px;height:23px;fill:#0B2545;}' +
        '.lumi-id{flex:1;line-height:1.25;}' +
        '.lumi-id strong{font-family:"Playfair Display",Georgia,serif;font-size:1.15rem;display:block;}' +
        '.lumi-id span{font-size:.75rem;color:#9fb0c5;display:inline-flex;align-items:center;gap:6px;}' +
        '.lumi-id span::before{content:"";width:7px;height:7px;border-radius:50%;background:#5fcf80;}' +
        '.lumi-x{margin-left:auto;background:rgba(255,255,255,.12);border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:1.2rem;line-height:1;cursor:pointer;}' +
        '.lumi-x:hover{background:rgba(255,255,255,.25);}' +
        '.lumi-progress{font-size:.72rem;color:#5a5f66;padding:8px 16px;background:#F2F1EC;border-bottom:1px solid #e2e0d8;display:flex;align-items:center;gap:10px;}' +
        '.lumi-progress .dots{display:flex;gap:3px;flex:1;}' +
        '.lumi-progress .dots i{height:4px;flex:1;border-radius:2px;background:#e2e0d8;transition:background .3s;}' +
        '.lumi-progress .dots i.on{background:#0B2545;}' +
        '.lumi-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:11px;}' +
        '.lumi-msg{display:flex;gap:8px;align-items:flex-end;max-width:92%;}' +
        '.lumi-msg.bot{align-self:flex-start;}.lumi-msg.me{align-self:flex-end;}' +
        '.lumi-msg .lumi-ava-sm{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#E6D8C3,#d8c4a6);display:flex;align-items:center;justify-content:center;flex-shrink:0;}' +
        '.lumi-msg .lumi-ava-sm svg{width:15px;height:15px;fill:#0B2545;}' +
        '.lumi-msg .bubble{padding:11px 14px;border-radius:16px;font-size:.92rem;line-height:1.5;}' +
        '.lumi-msg.bot .bubble{background:#fff;border:1px solid #e2e0d8;border-bottom-left-radius:5px;color:#1C1E21;}' +
        '.lumi-msg.bot .bubble a{color:#0B2545;}' +
        '.lumi-msg.me .bubble{background:#0B2545;color:#fff;border-bottom-right-radius:5px;}' +
        '.lumi-msg.typing .bubble{display:flex;gap:4px;}' +
        '.lumi-msg.typing .td{width:7px;height:7px;border-radius:50%;background:#c4b89f;animation:lumiBlink 1.2s infinite both;}' +
        '.lumi-msg.typing .td:nth-child(2){animation-delay:.2s;}.lumi-msg.typing .td:nth-child(3){animation-delay:.4s;}' +
        '@keyframes lumiBlink{0%,80%,100%{opacity:.3;}40%{opacity:1;}}' +
        '.lumi-gate{display:flex;flex-direction:column;gap:14px;padding:6px 2px;}' +
        '.lumi-gate h4{font-family:"Playfair Display",Georgia,serif;font-size:1.25rem;margin:0;color:#1C1E21;}' +
        '.lumi-gate p{font-size:.86rem;color:#5a5f66;line-height:1.55;margin:0;}' +
        '.lumi-gate label{display:flex;gap:9px;font-size:.82rem;color:#3a4048;align-items:flex-start;line-height:1.4;cursor:pointer;}' +
        '.lumi-gate input{margin-top:3px;}' +
        '.lumi-entry{display:flex;gap:8px;padding:11px;border-top:1px solid #e2e0d8;background:#fff;align-items:flex-end;}' +
        '.lumi-entry textarea{flex:1;border:1.5px solid #e2e0d8;border-radius:12px;padding:10px 12px;font-family:inherit;font-size:.92rem;resize:none;max-height:90px;min-height:42px;color:#1C1E21;}' +
        '.lumi-entry textarea:focus{outline:none;border-color:#0B2545;}' +
        '.lumi-entry button{width:42px;height:42px;border:none;border-radius:12px;background:#E6D8C3;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background .2s;}' +
        '.lumi-entry button:hover{background:#dcc9a8;}' +
        '.lumi-disclaimer{font-size:.67rem;color:#9aa0a6;text-align:center;padding:7px 14px 10px;background:#fff;line-height:1.45;}' +
        '.lumi-cta{width:100%;border:none;border-radius:12px;background:#E6D8C3;color:#0B2545;font-weight:700;padding:13px;cursor:pointer;font-family:inherit;font-size:.95rem;transition:background .2s;}' +
        '.lumi-cta:hover{background:#f1e7d6;}.lumi-cta:disabled{opacity:.5;cursor:not-allowed;}' +
        '.lumi-pkgs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;}' +
        '.lumi-pkg{display:flex;flex-direction:column;align-items:flex-start;gap:2px;border:1.5px solid #e2e0d8;border-radius:12px;background:#fff;padding:12px 14px;cursor:pointer;font-family:inherit;text-align:left;transition:border-color .15s,transform .15s;}' +
        '.lumi-pkg:hover{border-color:#0B2545;transform:translateY(-2px);}' +
        '.lumi-pkg strong{font-size:.95rem;color:#1C1E21;}.lumi-pkg span{font-size:.8rem;color:#5a5f66;}' +
        '.lumi-pkg.ghost{grid-column:1 / -1;align-items:center;background:#F2F1EC;}' +
        '.lumi-sum .s-card{background:#fff;border:1px solid #e2e0d8;border-radius:12px;padding:6px 14px;margin-bottom:12px;}' +
        '.lumi-sum .s-row{padding:9px 0;border-bottom:1px solid #f0eee7;}.lumi-sum .s-row:last-child{border-bottom:none;}' +
        '.lumi-sum .s-q{font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:#9aa0a6;font-weight:700;margin-bottom:2px;}' +
        '.lumi-sum .s-a{font-size:.88rem;color:#1C1E21;line-height:1.4;white-space:pre-wrap;}' +
        '.lumi-drop{border:2px dashed #d8c4a6;border-radius:12px;padding:18px;text-align:center;cursor:pointer;font-size:.83rem;color:#5a5f66;background:#fff;margin-bottom:8px;}' +
        '.lumi-drop:hover{background:#F2F1EC;border-color:#0B2545;}.lumi-drop strong{display:block;color:#1C1E21;margin-bottom:2px;}' +
        '.lumi-files{font-size:.8rem;color:#5a5f66;margin-bottom:10px;}.lumi-files div{padding:2px 0;}' +
        '.lumi-done{text-align:center;padding:24px 6px;}' +
        '.lumi-done .ic{width:70px;height:70px;border-radius:50%;background:#E6D8C3;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;}' +
        '.lumi-done .ic svg{width:34px;height:34px;stroke:#0B2545;}' +
        '.lumi-done h4{font-family:"Playfair Display",Georgia,serif;font-size:1.4rem;margin:0 0 10px;color:#1C1E21;}' +
        '.lumi-done p{font-size:.9rem;color:#5a5f66;line-height:1.5;margin:0;}';
        var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

        /* Fragen/Labels stammen aus der gemeinsamen Engine:
           LUMI_GREETING, LUMI_QUESTIONS, LUMI_LABELS, LUMI_TOTAL. */

        /* ---- DOM aufbauen ---- */
        var fab = document.createElement('button');
        fab.id = 'lumiFab'; fab.type = 'button'; fab.className = 'lumi-fab';
        fab.setAttribute('aria-label', 'Chat mit Lumi öffnen');
        fab.innerHTML = '<span class="lumi-spark">' + SPARK + '</span><span>Mit Lumi starten</span>';
        var firstVisit = false;
        try { firstVisit = !localStorage.getItem('lumi_seen'); } catch (e) {}
        if (firstVisit) { fab.classList.add('pulse'); }
        document.body.appendChild(fab);

        var win = document.createElement('div');
        win.id = 'lumiWin'; win.className = 'lumi-win'; win.hidden = true;
        win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'Lumi – Briefing-Assistentin');
        win.innerHTML =
            '<div class="lumi-head"><span class="lumi-ava-lg">' + SPARK + '</span>' +
            '<div class="lumi-id"><strong>Lumi</strong><span>Briefing-Assistentin · online</span></div>' +
            '<button class="lumi-x" id="lumiX" type="button" aria-label="Schließen">&times;</button></div>' +
            '<div class="lumi-progress" id="lumiProgress" hidden><span id="lumiStep"></span><span class="dots" id="lumiDots"></span></div>' +
            '<div class="lumi-body" id="lumiBody"></div>' +
            '<div class="lumi-entry" id="lumiEntry" hidden><textarea id="lumiInput" rows="1" placeholder="Ihre Antwort … (Enter zum Senden)"></textarea><button id="lumiSend" type="button" aria-label="Senden">' + SEND + '</button></div>' +
            '<div class="lumi-disclaimer">Dieses Gespräch dient der Projektbeschreibung und ist unverbindlich. Verbindlich sind allein die Paketbeschreibungen und der Vertrag.</div>';
        document.body.appendChild(win);

        var body = win.querySelector('#lumiBody');
        var entry = win.querySelector('#lumiEntry');
        var input = win.querySelector('#lumiInput');
        var sendBtn = win.querySelector('#lumiSend');
        var progress = win.querySelector('#lumiProgress');
        var stepLabel = win.querySelector('#lumiStep');
        var dotsWrap = win.querySelector('#lumiDots');

        var state = { started: false, done: false, busy: false, files: [], messages: [], qa: [], briefing: null, lastQ: '', pkg: null, token: null, leadId: null };

        /* ---- Öffnen / Schließen ---- */
        function openWin() {
            win.hidden = false; fab.hidden = true; fab.classList.remove('pulse');
            try { localStorage.setItem('lumi_seen', '1'); } catch (e) {}
            if (!state.started) { renderGate(); }
        }
        function closeWin() { win.hidden = true; fab.hidden = false; }
        fab.addEventListener('click', openWin);
        win.querySelector('#lumiX').addEventListener('click', closeWin);

        /* ---- DSGVO-Gate vor dem ersten Chat (B5) ---- */
        function renderGate() {
            progress.hidden = true; entry.hidden = true;
            body.innerHTML =
                '<div class="lumi-gate"><h4>Kurz vorab</h4>' +
                '<p>Lumi nutzt den KI-Dienst <strong>Google Gemini</strong> zur Verarbeitung Ihrer Eingaben. Die Verarbeitung kann <strong>außerhalb der EU</strong> erfolgen. Bitte geben Sie hier <strong>keine sensiblen Daten</strong> ein. Mehr dazu in der <a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>' +
                '<label><input type="checkbox" id="lumiAgree"> Ich bin einverstanden, dass meine Eingaben über Google Gemini zur Erstellung des Briefings verarbeitet werden.</label>' +
                '<button class="lumi-cta" id="lumiStart" type="button" disabled>Weiter</button></div>';
            var agree = body.querySelector('#lumiAgree');
            var start = body.querySelector('#lumiStart');
            agree.addEventListener('change', function () { start.disabled = !agree.checked; });
            start.addEventListener('click', renderPackagePick);
        }

        /* ---- Paketwahl vor dem Chat (Kostenschutz: Lumi erst nach Paketwahl) ---- */
        function renderPackagePick() {
            progress.hidden = true; entry.hidden = true;
            var pakete = [
                { id: 'basis', name: 'Basis', preis: '990 €' },
                { id: 'pro', name: 'Pro', preis: '2.990 €' },
                { id: 'platin', name: 'Platin', preis: '5.990 €' },
                { id: 'enterprise', name: 'Enterprise', preis: 'ab 9.990 €' }
            ];
            var cards = pakete.map(function (p) {
                return '<button type="button" class="lumi-pkg" data-pkg="' + p.id + '"><strong>' + p.name + '</strong><span>' + p.preis + '</span></button>';
            }).join('');
            body.innerHTML =
                '<div class="lumi-gate"><h4>Welches Paket interessiert Sie?</h4>' +
                '<p>So kann Lumi Ihr Briefing passend aufnehmen. Noch unsicher? Wählen Sie einfach „Noch unsicher“ – Sie legen sich damit nicht fest.</p>' +
                '<div class="lumi-pkgs">' + cards +
                '<button type="button" class="lumi-pkg ghost" data-pkg=""><strong>Noch unsicher</strong><span>einfach starten</span></button>' +
                '</div></div>';
            body.querySelectorAll('.lumi-pkg').forEach(function (b) {
                b.addEventListener('click', function () { startChat(b.getAttribute('data-pkg') || null); });
            });
        }

        /* ---- Chat starten (nach Consent + Paketwahl) ---- */
        function startChat(pkg) {
            state.started = true;
            state.pkg = pkg || null;
            state.token = lumiNewToken();
            body.innerHTML = '';
            entry.hidden = false; progress.hidden = false;
            buildDots();
            updateProgress();
            state.lastQ = LUMI_GREETING;
            botSay(LUMI_GREETING);
            setTimeout(function () { input.focus(); }, 300);
        }

        function buildDots() {
            dotsWrap.innerHTML = '';
            for (var i = 0; i < LUMI_TOTAL; i++) { dotsWrap.appendChild(document.createElement('i')); }
        }
        function updateProgress() {
            var answered = state.qa.length;
            var n = Math.min(answered + 1, LUMI_TOTAL);
            stepLabel.textContent = state.done ? 'Briefing erfasst ✓' : ('Frage ' + n + ' von ca. ' + LUMI_TOTAL);
            var ds = dotsWrap.querySelectorAll('i');
            for (var i = 0; i < ds.length; i++) { ds[i].classList.toggle('on', i < (state.done ? LUMI_TOTAL : answered)); }
        }

        /* ---- Nachrichten ---- */
        function addMsg(text, who) {
            var m = document.createElement('div');
            m.className = 'lumi-msg ' + who;
            if (who === 'bot') {
                m.innerHTML = '<span class="lumi-ava-sm">' + SPARK + '</span><div class="bubble"></div>';
                m.querySelector('.bubble').innerHTML = text;
            } else {
                m.innerHTML = '<div class="bubble"></div>';
                m.querySelector('.bubble').textContent = text;
            }
            body.appendChild(m); body.scrollTop = body.scrollHeight;
        }
        function showTyping() {
            var t = document.createElement('div');
            t.className = 'lumi-msg bot typing';
            t.innerHTML = '<span class="lumi-ava-sm">' + SPARK + '</span><div class="bubble"><span class="td"></span><span class="td"></span><span class="td"></span></div>';
            body.appendChild(t); body.scrollTop = body.scrollHeight;
            return t;
        }
        function botSay(text, cb) {
            state.busy = true;
            var t = showTyping();
            setTimeout(function () {
                t.remove(); addMsg(text, 'bot'); state.busy = false;
                if (cb) { cb(); }
            }, 650);
        }

        /* ---- Antwort-Logik: echte Lumi-API mit Fallback ---- */
        function send() {
            if (state.done || state.busy) { return; }
            var v = input.value.trim();
            if (!v) { return; }
            addMsg(v, 'me');
            state.qa.push({ q: state.lastQ, a: v });
            var hist = state.messages.slice();        // bisherige Turns (ohne aktuelle Nachricht)
            state.messages.push({ role: 'user', content: v });
            input.value = ''; input.style.height = 'auto';
            updateProgress();

            state.busy = true;
            var t = showTyping();
            // Server (lumi-chat) erkennt das Briefing selbst und meldet done/leadId.
            lumiAsk(v, hist, state.pkg, state.token).then(function (resp) {
                t.remove(); state.busy = false;
                addMsg(resp.reply, 'bot');
                state.messages.push({ role: 'assistant', content: resp.reply });
                state.lastQ = resp.reply;
                if (resp.leadId) { state.leadId = resp.leadId; }
                if (resp.blocked) { return; }   // Tageslimit erreicht – höflich gestoppt
                if (resp.done) { state.done = true; updateProgress(); setTimeout(renderSummary, 500); }
                else { updateProgress(); }
            });
        }
        sendBtn.addEventListener('click', send);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        });
        input.addEventListener('input', function () {
            input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 90) + 'px';
        });

        /* ---- Abschluss: Zusammenfassung (editierbar) + Upload + Absenden (B4) ---- */
        function renderSummary() {
            entry.hidden = true; progress.hidden = false;
            var rows = '';
            state.qa.forEach(function (p, i) {
                var label = LUMI_LABELS[i] || ('Frage ' + (i + 1));
                rows += '<div class="s-row"><div class="s-q">' + label + '</div><textarea class="s-a" data-qa="' + i + '" rows="1"></textarea></div>';
            });
            body.innerHTML =
                '<div class="lumi-sum">' +
                '<p style="font-size:.86rem;color:#5a5f66;margin:0 0 12px;">Bitte prüfen Sie Ihre Angaben – Sie können jedes Feld direkt anpassen.</p>' +
                '<div class="s-card" id="lumiSumCard">' + rows + '</div>' +
                '<div class="lumi-drop" id="lumiDrop"><strong>Dateien hochladen (optional)</strong>Logo, Bilder, Texte – hier ablegen oder klicken<input type="file" id="lumiFile" multiple hidden></div>' +
                '<div class="lumi-files" id="lumiFiles"></div>' +
                '<button class="lumi-cta" id="lumiSubmit" type="button">Briefing absenden</button>' +
                '</div>';
            var areas = body.querySelectorAll('#lumiSumCard .s-a');
            state.qa.forEach(function (p, i) {
                if (areas[i]) {
                    areas[i].value = p.a;
                    var grow = function () { areas[i].style.height = 'auto'; areas[i].style.height = areas[i].scrollHeight + 'px'; };
                    grow(); areas[i].addEventListener('input', grow);
                }
            });
            var drop = body.querySelector('#lumiDrop');
            var fileInput = body.querySelector('#lumiFile');
            var fileList = body.querySelector('#lumiFiles');
            function renderFiles() {
                fileList.innerHTML = '';
                state.files.forEach(function (f) { var d = document.createElement('div'); d.textContent = '📎 ' + f.name; fileList.appendChild(d); });
            }
            drop.addEventListener('click', function () { fileInput.click(); });
            fileInput.addEventListener('change', function () {
                Array.prototype.forEach.call(fileInput.files, function (f) { state.files.push(f); });
                renderFiles();
            });
            body.querySelector('#lumiSubmit').addEventListener('click', submitBriefing);
        }

        function submitBriefing() {
            body.querySelectorAll('#lumiSumCard .s-a').forEach(function (t) {
                var i = +t.getAttribute('data-qa'); if (state.qa[i]) { state.qa[i].a = t.value.trim(); }
            });
            // Hinweis: Das Briefing wurde bereits serverseitig gespeichert
            // (lumi-chat → done, Lead + Briefing in Supabase). Der echte Datei-Upload
            // zum Lead (state.leadId) folgt in Teil 5 über /api/upload-url.
            body.innerHTML =
                '<div class="lumi-done"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' +
                '<h4>Ihr Briefing ist eingegangen</h4>' +
                '<p>Vielen Dank! Wir melden uns innerhalb von 24 Stunden mit der Bestätigung und den nächsten Schritten.</p></div>';
            progress.hidden = true;
        }
    })();

    /* =========================================================
       7. SHOP-BUCHUNG + KI-CHATBOT „LUMI"
       Läuft nur auf der Paket-Seite (wenn das Modal existiert).
       ========================================================= */
    var modal = document.getElementById('bookingModal');
    if (!modal) { return; }

    // Lumi-Avatar als kleines Inline-SVG
    var LUMI_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3"></path><rect x="4" y="5" width="16" height="13" rx="3"></rect><circle cx="9" cy="11.5" r="1.4" fill="currentColor" stroke="none"></circle><circle cx="15" cy="11.5" r="1.4" fill="currentColor" stroke="none"></circle><path d="M9.5 15h5"></path></svg>';

    // Lumi-Fragen kommen aus der gemeinsamen Engine (LUMI_GREETING, LUMI_QUESTIONS …).

    // Zustand der Buchung
    var state = {
        pkg: null, price: null, pkgId: null,
        method: null,       // 'lumi' | 'text'
        chatMessages: [],   // API-Verlauf (role/content)
        qa: [],             // {q,a}-Paare für die Zusammenfassung
        briefing: null,
        lastQ: '',
        chatStarted: false,
        chatConsented: false,
        chatDone: false,
        busy: false,
        token: null,
        leadId: null,
        projectText: '',
        files: [],
        contact: { name: '', email: '', phone: '' }
    };

    // Reihenfolge der Schritte je nach Methode
    function stepFlow() {
        var mid = state.method === 'text' ? 'text' : 'chat';
        return ['method', mid, 'upload', 'contact', 'summary', 'done'];
    }
    var stepPos = 0;

    // DOM-Referenzen
    var $ = function (id) { return document.getElementById(id); };
    var stepsBar = $('stepsBar');
    var modalPkg = $('modalPkg');
    var btnNext = $('btnNext');
    var btnBack = $('btnBack');
    var steps = modal.querySelectorAll('.bstep');

    function showStep(key) {
        steps.forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-step') === key); });
        // Fortschrittsbalken (ohne 'done')
        var flow = stepFlow().filter(function (k) { return k !== 'done'; });
        var idx = flow.indexOf(key);
        if (stepsBar) {
            stepsBar.innerHTML = '';
            flow.forEach(function (k, i) {
                var seg = document.createElement('span');
                seg.className = 'seg' + (i < idx ? ' done' : (i === idx ? ' active' : ''));
                stepsBar.appendChild(seg);
            });
        }
        // Footer-Buttons steuern
        btnBack.hidden = (key === 'method' || key === 'done');
        if (key === 'done') {
            btnNext.hidden = true;
        } else if (key === 'summary') {
            btnNext.hidden = false;
            btnNext.textContent = 'Verbindlich absenden';
        } else {
            btnNext.hidden = false;
            btnNext.textContent = 'Weiter';
        }
        // Chat ggf. starten
        if (key === 'chat') { startChat(); btnNext.hidden = !state.chatDone; }
    }

    function goTo(key) {
        var flow = stepFlow();
        stepPos = flow.indexOf(key);
        showStep(key);
        var body = modal.querySelector('.modal-body');
        if (body) { body.scrollTop = 0; }
    }

    function openModal(pkg, price) {
        state.pkg = pkg; state.price = price;
        var m = (pkg || '').toLowerCase();
        state.pkgId = m.indexOf('basis') >= 0 ? 'basis' : m.indexOf('pro') >= 0 ? 'pro' : m.indexOf('platin') >= 0 ? 'platin' : m.indexOf('enterprise') >= 0 ? 'enterprise' : null;
        modalPkg.innerHTML = 'Dein gewähltes Paket<strong>' + pkg + ' · ' + price + '</strong>';
        goTo('method');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Paket-Buttons
    document.querySelectorAll('[data-book]').forEach(function (b) {
        b.addEventListener('click', function () {
            openModal(b.getAttribute('data-pkg'), b.getAttribute('data-price'));
        });
    });
    $('modalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) { closeModal(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) { closeModal(); } });

    /* ---- Methodenwahl ---- */
    modal.querySelectorAll('[data-method]').forEach(function (card) {
        card.addEventListener('click', function () {
            state.method = card.getAttribute('data-method');
            modal.querySelectorAll('[data-method]').forEach(function (c) { c.classList.remove('selected'); });
            card.classList.add('selected');
        });
    });

    /* ---- Lumi-Chat ---- */
    var chatLog = $('chatLog');
    var chatInput = $('chatInput');
    var chatSend = $('chatSend');
    var chatProgress = $('chatProgress');

    function addBubble(text, who) {
        var b = document.createElement('div');
        b.className = 'bubble ' + who;
        if (who === 'bot') {
            b.innerHTML = '<span class="lumi-ava">' + LUMI_SVG + '</span><span>' + text + '</span>';
        } else {
            b.textContent = text;
        }
        chatLog.appendChild(b);
        chatLog.scrollTop = chatLog.scrollHeight;
        return b;
    }
    function showTyping() {
        var t = document.createElement('div');
        t.className = 'bubble bot typing';
        t.innerHTML = '<span class="lumi-ava">' + LUMI_SVG + '</span><span><span></span><span></span><span></span></span>';
        chatLog.appendChild(t);
        chatLog.scrollTop = chatLog.scrollHeight;
        return t;
    }
    function updateProgress() {
        var answered = state.qa.length;
        var n = Math.min(answered + 1, LUMI_TOTAL);
        chatProgress.textContent = state.chatDone ? 'Briefing erfasst ✓' : ('Frage ' + n + ' von ca. ' + LUMI_TOTAL);
    }
    function startChat() {
        if (state.chatStarted) { return; }
        state.chatStarted = true;
        state.token = lumiNewToken();
        updateProgress();
        if (state.chatConsented) { beginChat(); return; }
        // DSGVO: aktive Bestätigung vor dem ersten KI-Aufruf
        if (chatInput) { chatInput.disabled = true; }
        var c = document.createElement('div');
        c.className = 'bubble bot';
        c.innerHTML = '<span class="lumi-ava">' + LUMI_SVG + '</span><span>Bevor wir starten: Lumi nutzt den KI-Dienst <strong>Google Gemini</strong>; Ihre Eingaben können außerhalb der EU verarbeitet werden. Bitte geben Sie keine sensiblen Daten ein. Mehr in der <a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerklärung</a>.<br><button type="button" class="btn btn-primary" id="chatConsentBtn" style="margin-top:10px;">Einverstanden – Gespräch starten</button></span>';
        chatLog.appendChild(c); chatLog.scrollTop = chatLog.scrollHeight;
        c.querySelector('#chatConsentBtn').addEventListener('click', function () {
            state.chatConsented = true; c.remove();
            if (chatInput) { chatInput.disabled = false; }
            beginChat();
        });
    }
    function beginChat() {
        var typing = showTyping();
        setTimeout(function () {
            typing.remove();
            addBubble(LUMI_GREETING, 'bot');
            state.lastQ = LUMI_GREETING;
            if (chatInput) { chatInput.focus(); }
        }, 500);
    }
    function sendChat() {
        if (state.chatDone || state.busy) { return; }
        var val = chatInput.value.trim();
        if (!val) { return; }
        addBubble(val, 'me');
        state.qa.push({ q: state.lastQ, a: val });
        var hist = state.chatMessages.slice();
        state.chatMessages.push({ role: 'user', content: val });
        chatInput.value = '';
        updateProgress();
        state.busy = true;
        var typing = showTyping();
        // Server (lumi-chat) übernimmt Rate-Limit + Briefing-Erkennung; gibt done/leadId zurück.
        lumiAsk(val, hist, state.pkgId, state.token).then(function (resp) {
            typing.remove(); state.busy = false;
            addBubble(resp.reply, 'bot');
            state.chatMessages.push({ role: 'assistant', content: resp.reply });
            state.lastQ = resp.reply;
            if (resp.leadId) { state.leadId = resp.leadId; }
            if (resp.blocked) { updateProgress(); return; }
            if (resp.done) { state.chatDone = true; btnNext.hidden = false; }
            updateProgress();
        });
    }
    if (chatSend) { chatSend.addEventListener('click', sendChat); }
    if (chatInput) {
        chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
        });
    }

    /* ---- Datei-Upload ---- */
    var dropzone = $('dropzone');
    var fileInput = $('fileInput');
    var fileList = $('fileList');

    function fmtSize(bytes) {
        if (bytes < 1024) { return bytes + ' B'; }
        if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + ' KB'; }
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
    function renderFiles() {
        fileList.innerHTML = '';
        state.files.forEach(function (f, i) {
            var row = document.createElement('div');
            row.className = 'file-row';
            row.innerHTML =
                '<span class="f-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></span>' +
                '<div class="f-info"><div class="f-name"></div><div class="f-size">' + fmtSize(f.size) + '</div></div>' +
                '<button class="f-del" type="button" aria-label="Entfernen">&times;</button>';
            row.querySelector('.f-name').textContent = f.name;
            row.querySelector('.f-del').addEventListener('click', function () {
                state.files.splice(i, 1); renderFiles();
            });
            fileList.appendChild(row);
        });
    }
    function addFiles(list) {
        Array.prototype.forEach.call(list, function (f) { state.files.push(f); });
        renderFiles();
    }
    if (dropzone) {
        dropzone.addEventListener('click', function () { fileInput.click(); });
        fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });
        ['dragover', 'dragenter'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('dragover'); });
        });
        dropzone.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) { addFiles(e.dataTransfer.files); } });
    }

    /* ---- Zusammenfassung (editierbar) ---- */
    function buildSummary() {
        var mount = $('summaryMount');
        var html = '<div class="summary-pkg"><span class="sp-name">' + state.pkg + '</span><span class="sp-price">' + state.price + '</span></div>';
        html += '<div class="summary-box">';
        if (state.method === 'lumi') {
            state.qa.forEach(function (p, i) {
                var label = LUMI_LABELS[i] || ('Frage ' + (i + 1));
                html += '<div class="summary-row"><div class="s-q">' + label + '</div>' +
                        '<textarea class="s-a" data-qa="' + i + '" rows="1"></textarea></div>';
            });
        } else {
            html += '<div class="summary-row"><div class="s-q">Projektbeschreibung</div>' +
                    '<textarea class="s-a" data-text rows="4">' + (state.projectText || '').replace(/</g, '&lt;') + '</textarea></div>';
        }
        // Kontakt
        html += '<div class="summary-row"><div class="s-q">Name</div><textarea class="s-a" data-c="name" rows="1">' + state.contact.name + '</textarea></div>';
        html += '<div class="summary-row"><div class="s-q">E-Mail</div><textarea class="s-a" data-c="email" rows="1">' + state.contact.email + '</textarea></div>';
        html += '<div class="summary-row"><div class="s-q">Telefon</div><textarea class="s-a" data-c="phone" rows="1">' + (state.contact.phone || '–') + '</textarea></div>';
        // Dateien
        var fileNames = state.files.length ? state.files.map(function (f) { return f.name; }).join(', ') : 'Keine Dateien hochgeladen';
        html += '<div class="summary-row"><div class="s-q">Hochgeladene Dateien</div><div class="s-a" style="background:transparent;">' + fileNames + '</div></div>';
        html += '</div>';
        html += '<p class="summary-note"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Du kannst alle Angaben hier direkt bearbeiten. Mit „Verbindlich absenden“ bestätigst du deine Buchungsanfrage.</p>';
        mount.innerHTML = html;
        // Lumi-Antworten sicher als Werte einsetzen
        mount.querySelectorAll('[data-qa]').forEach(function (t) { var i = +t.getAttribute('data-qa'); if (state.qa[i]) { t.value = state.qa[i].a; } });
        // Auto-Höhe der Textareas
        mount.querySelectorAll('.s-a').forEach(function (t) {
            if (t.tagName === 'TEXTAREA') {
                var grow = function () { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
                grow(); t.addEventListener('input', grow);
            }
        });
    }
    function saveSummaryEdits() {
        var mount = $('summaryMount');
        mount.querySelectorAll('[data-qa]').forEach(function (t) { var i = +t.getAttribute('data-qa'); if (state.qa[i]) { state.qa[i].a = t.value.trim(); } });
        var txt = mount.querySelector('[data-text]'); if (txt) { state.projectText = txt.value.trim(); }
        mount.querySelectorAll('[data-c]').forEach(function (t) { state.contact[t.getAttribute('data-c')] = t.value.trim(); });
    }

    /* ---- Navigation: Weiter ---- */
    btnNext.addEventListener('click', function () {
        var flow = stepFlow();
        var key = flow[stepPos];

        // Validierungen je Schritt
        if (key === 'method') {
            if (!state.method) { alert('Bitte wähle, wie du dein Projekt beschreiben möchtest.'); return; }
        }
        if (key === 'chat' && !state.chatDone) {
            alert('Bitte beantworte zuerst alle Fragen von Lumi.'); return;
        }
        if (key === 'text') {
            var pt = $('projectText').value.trim();
            if (pt.length < 10) { alert('Bitte beschreibe dein Projekt in ein paar Worten.'); return; }
            state.projectText = pt;
        }
        if (key === 'contact') {
            state.contact.name = $('cName').value.trim();
            state.contact.email = $('cEmail').value.trim();
            state.contact.phone = $('cPhone').value.trim();
            if (!state.contact.name || !state.contact.email) { alert('Bitte gib Name und E-Mail an.'); return; }
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.contact.email)) { alert('Bitte gib eine gültige E-Mail-Adresse an.'); return; }
        }
        if (key === 'summary') {
            saveSummaryEdits();
            // Lumi-Pfad: Lead + Briefing wurden bereits serverseitig gespeichert
            // (lumi-chat → done, state.leadId). Datei-Upload folgt in Teil 5.
            // Text-Pfad (ohne KI): Speicherung über eine eigene Function (/api/lead)
            // wird in Teil 4/5 ergänzt.
            goTo('done');
            return;
        }

        // Nächsten Schritt anzeigen
        var next = flow[stepPos + 1];
        if (next === 'summary') { buildSummary(); }
        goTo(next);
    });

    /* ---- Navigation: Zurück ---- */
    btnBack.addEventListener('click', function () {
        var flow = stepFlow();
        var prev = flow[stepPos - 1];
        if (prev) { goTo(prev); }
    });
})();
