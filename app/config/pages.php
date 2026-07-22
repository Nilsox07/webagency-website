<?php
/**
 * Seiten-Register (datengetrieben). Aus den Originalseiten extrahiert.
 *
 * Pflichtfelder je Seite: title, description, canonical.
 * Optional: active (aktiver Nav-href), robots (Default: Site-Standard),
 *   og / twitter (Overrides ODER false = weglassen), jsonld (['ORG', '<raw>' ...]),
 *   footer_about (Text-Override), cta (['href','label']), extra_css (['/assets/x.css']),
 *   fragment (Default: Slug).
 *
 * NEUE SEITE: hier Eintrag ergaenzen + app/views/fragments/<slug>.html anlegen,
 * dann `php app/build.php` ausfuehren. Details siehe MIGRATION_NOTES.md.
 */
return [
    'index' => [
        'title'       => 'Webdesign, Hosting & SEO zum Festpreis | Nils Webdesign',
        'description' => 'Webdesign, Hosting & SEO zum Festpreis für Unternehmen in Brandenburg & Sachsen. Klare Pakete, planbare Termine, persönlich betreut. Jetzt Projekt mit Lumi starten.',
        'canonical'   => 'https://nils.w500.de/',
        'active'      => 'index.html',
        'og'          => ['description' => 'Professionelle Websites zum Festpreis für Unternehmen in Brandenburg & Sachsen – persönlich betreut, planbare Termine.'],
        'twitter'     => ['description' => 'Professionelle Websites zum Festpreis für Unternehmen in Brandenburg & Sachsen – persönlich betreut, planbare Termine.'],
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"Nils Webdesign","url":"https://nils.w500.de/","inLanguage":"de-DE"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was kostet eine professionelle Website?","acceptedAnswer":{"@type":"Answer","text":"Wir arbeiten mit festen Paketpreisen ab 990 € (einmalig, inkl. MwSt.). Welcher Preis für Sie gilt, hängt vom Umfang ab – vom One-Pager bis zur mehrseitigen Unternehmenswebsite. Alle Preise sehen Sie transparent auf der Paket-Seite."}},{"@type":"Question","name":"Wie lange dauert die Umsetzung?","acceptedAnswer":{"@type":"Answer","text":"In der Regel zwischen zwei und acht Wochen ab vollständigem Briefing – abhängig vom Paket und davon, wie schnell Inhalte und Feedback vorliegen. Einen konkreten Zeitplan erhalten Sie mit dem Angebot."}},{"@type":"Question","name":"Für welche Regionen arbeiten Sie?","acceptedAnswer":{"@type":"Answer","text":"Unser regionaler Schwerpunkt liegt in Brandenburg und Sachsen – darunter Spremberg, Cottbus, Dresden, Bautzen und Görlitz. Bundesweit arbeiten wir per Telefon, Video und Online-Übergabe."}},{"@type":"Question","name":"Wie läuft die Zusammenarbeit ab?","acceptedAnswer":{"@type":"Answer","text":"Sie wählen ein Festpreis-Paket, beschreiben Ihr Projekt geführt mit unserer Assistentin Lumi oder per Textfeld und laden vorhandene Materialien hoch. Danach gestalten und bauen wir Ihre Website und stimmen Korrekturen mit Ihnen ab."}},{"@type":"Question","name":"Übernehmen Sie auch Hosting und Wartung?","acceptedAnswer":{"@type":"Answer","text":"Ja. Auf Wunsch kümmern wir uns zum festen Monatspreis um Hosting, Updates, Backups und Sicherheit, damit Ihre Website dauerhaft sicher und aktuell bleibt."}},{"@type":"Question","name":"Muss ich die KI-Assistentin Lumi nutzen?","acceptedAnswer":{"@type":"Answer","text":"Nein. Lumi macht die Projektbeschreibung bequemer, ist aber freiwillig. Sie können Ihr Vorhaben genauso gut in einem klassischen Textfeld beschreiben oder uns direkt kontaktieren."}}]}]}',
        ],
        'footer_about'=> 'Webdesign, Hosting & SEO zum Festpreis für Unternehmen in Brandenburg & Sachsen – persönlich betreut, ehrlich beraten, technisch makellos.',
    ],
    'webdesign' => [
        'title'       => 'Webdesign Agentur – Homepage erstellen lassen | Nils Webdesign',
        'description' => 'Webdesign Agentur für Unternehmen & Start-ups. Homepage erstellen lassen – individuell, mobil optimiert und schnell. Vom Konzept bis zum Live-Gang aus einer Hand.',
        'canonical'   => 'https://nils.w500.de/webdesign',
        'active'      => 'leistungen.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"Webdesign","serviceType":"Webdesign / Website-Erstellung","provider":{"@id":"https://nils.w500.de/#localbusiness"},"areaServed":["Brandenburg","Sachsen","Deutschland"],"url":"https://nils.w500.de/webdesign"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://nils.w500.de/leistungen"},{"@type":"ListItem","position":3,"name":"Webdesign","item":"https://nils.w500.de/webdesign"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was kostet eine professionelle Website?","acceptedAnswer":{"@type":"Answer","text":"Das hängt vom Umfang ab. Wir arbeiten mit transparenten Festpreis-Paketen ab 990 € – vom One-Pager bis zum umfangreichen Unternehmensauftritt."}},{"@type":"Question","name":"Wie lange dauert die Umsetzung?","acceptedAnswer":{"@type":"Answer","text":"In der Regel zwischen zwei und acht Wochen ab vollständigem Briefing, je nach Paket und Zuarbeit."}},{"@type":"Question","name":"Können wir die Website später selbst pflegen?","acceptedAnswer":{"@type":"Answer","text":"Ja. Auf Wunsch richten wir ein leicht bedienbares System ein und weisen Sie ein; alternativ übernimmt das unsere Wartung."}}]}]}',
        ],
    ],
    'webdesign-dresden' => [
        'title'       => 'Webdesign Dresden – Website erstellen lassen | Nils Webdesign',
        'description' => 'Webdesign aus der Region für Dresden: moderne, schnelle Websites zum Festpreis für Handwerk, Praxen, Gastronomie & Dienstleister. Persönlich betreut, bundesweit per Remote.',
        'canonical'   => 'https://nils.w500.de/webdesign-dresden',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"Webdesign Dresden","serviceType":"Webdesign / Website-Erstellung","provider":{"@id":"https://nils.w500.de/#localbusiness"},"areaServed":{"@type":"City","name":"Dresden"},"url":"https://nils.w500.de/webdesign-dresden"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Lokales SEO","item":"https://nils.w500.de/local-seo"},{"@type":"ListItem","position":3,"name":"Webdesign Dresden","item":"https://nils.w500.de/webdesign-dresden"}]}]}',
        ],
    ],
    'seo' => [
        'title'       => 'Technisches SEO – saubere Grundlagen für deine Website | Nils Webdesign',
        'description' => 'Technisches SEO: saubere Struktur, schnelle Ladezeiten und korrekte Auszeichnung – die Grundlage, damit Suchmaschinen deine Seite richtig erfassen. Ohne Versprechen zu Platzierungen.',
        'canonical'   => 'https://nils.w500.de/seo',
        'active'      => 'leistungen.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"Technisches SEO","serviceType":"Suchmaschinenoptimierung","provider":{"@id":"https://nils.w500.de/#localbusiness"},"areaServed":["Brandenburg","Sachsen","Deutschland"],"url":"https://nils.w500.de/seo"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://nils.w500.de/leistungen"},{"@type":"ListItem","position":3,"name":"SEO","item":"https://nils.w500.de/seo"}]}]}',
            '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was ist technisches SEO?","acceptedAnswer":{"@type":"Answer","text":"Technisches SEO umfasst alle Maßnahmen an Struktur, Tempo und Auszeichnung einer Website, damit Suchmaschinen sie fehlerfrei erfassen und einordnen können – etwa schnelle Ladezeiten, saubere Überschriften, Meta-Angaben, Sitemap und strukturierte Daten."}},{"@type":"Question","name":"Können Sie eine bestimmte Platzierung garantieren?","acceptedAnswer":{"@type":"Answer","text":"Nein. Rankings hängen von vielen Faktoren ab, die niemand vollständig steuert. Wir schaffen eine saubere, regelkonforme Grundlage mit nachvollziehbaren Maßnahmen – ohne leere Versprechen."}},{"@type":"Question","name":"Wie lange dauert es, bis SEO wirkt?","acceptedAnswer":{"@type":"Answer","text":"Technische Verbesserungen greifen oft schnell, inhaltliche und strukturelle Effekte zeigen sich meist über Wochen bis Monate. SEO ist eine fortlaufende Aufgabe."}},{"@type":"Question","name":"Ist SEO im Webdesign-Paket enthalten?","acceptedAnswer":{"@type":"Answer","text":"Eine solide technische SEO-Grundlage ist bei unseren Websites von Anfang an dabei. Den genauen Umfang je Paket sehen Sie auf der Paket-Seite."}}]}',
        ],
    ],
    'local-seo' => [
        'title'       => 'Lokales SEO – vor Ort bei Google gefunden werden | Nils Webdesign',
        'description' => 'Lokales SEO für Unternehmen in Brandenburg & Sachsen: Google-Unternehmensprofil, lokale Keywords, NAP-Konsistenz und Struktur, damit Kunden Sie in Ihrer Region finden.',
        'canonical'   => 'https://nils.w500.de/local-seo',
        'active'      => 'leistungen.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"Lokales SEO","serviceType":"Lokale Suchmaschinenoptimierung","provider":{"@id":"https://nils.w500.de/#localbusiness"},"areaServed":["Spremberg","Cottbus","Dresden","Brandenburg","Sachsen"],"url":"https://nils.w500.de/local-seo"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://nils.w500.de/leistungen"},{"@type":"ListItem","position":3,"name":"Lokales SEO","item":"https://nils.w500.de/local-seo"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was ist lokales SEO?","acceptedAnswer":{"@type":"Answer","text":"Lokales SEO umfasst alle Maßnahmen, damit ein Betrieb bei standortbezogenen Suchanfragen und in Google Maps korrekt erfasst und angezeigt werden kann."}},{"@type":"Question","name":"Können Sie Platz 1 bei Google garantieren?","acceptedAnswer":{"@type":"Answer","text":"Nein. Rankings hängen von vielen Faktoren ab, die niemand vollständig steuert. Wir sorgen für eine saubere Grundlage, nicht für leere Versprechen."}},{"@type":"Question","name":"Für welche Orte arbeiten Sie?","acceptedAnswer":{"@type":"Answer","text":"Regionaler Schwerpunkt ist Brandenburg und Sachsen (u. a. Spremberg, Cottbus, Dresden); bundesweit per Remote."}}]}]}',
        ],
    ],
    'ki-suche-geo' => [
        'title'       => 'GEO: Sichtbarkeit in KI-Suchmaschinen | Nils Webdesign',
        'description' => 'GEO (Generative Engine Optimization): Inhalte so aufbereiten, dass KI-Suchsysteme wie Google AI-Overviews oder ChatGPT sie verstehen und als Quelle nutzen können.',
        'canonical'   => 'https://nils.w500.de/ki-suche-geo',
        'active'      => 'leistungen.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"GEO – Generative Engine Optimization","serviceType":"Optimierung für KI-Suchmaschinen","provider":{"@id":"https://nils.w500.de/#localbusiness"},"areaServed":["Deutschland"],"url":"https://nils.w500.de/ki-suche-geo"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://nils.w500.de/leistungen"},{"@type":"ListItem","position":3,"name":"KI-Suche (GEO)","item":"https://nils.w500.de/ki-suche-geo"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was ist der Unterschied zwischen SEO und GEO?","acceptedAnswer":{"@type":"Answer","text":"SEO zielt auf klassische Suchergebnisse, GEO bereitet Inhalte zusätzlich so auf, dass KI-Systeme sie verstehen und als Quelle zitieren können. Beide ergänzen sich."}},{"@type":"Question","name":"Können Sie garantieren, dass ich in ChatGPT erscheine?","acceptedAnswer":{"@type":"Answer","text":"Nein. Ob ein KI-System eine Quelle nutzt, entscheidet dessen Anbieter. Wir schaffen die bestmöglichen Voraussetzungen, garantieren die Aufnahme aber nicht."}},{"@type":"Question","name":"Lohnt sich GEO schon heute?","acceptedAnswer":{"@type":"Answer","text":"Ja, denn klare Struktur, Fakten, Schema und Aktualität verbessern ohnehin die klassische Auffindbarkeit und die Lesbarkeit für Menschen."}}]}]}',
        ],
    ],
    'hosting' => [
        'title'       => 'Webhosting & Wartung zum Festpreis | Nils Webdesign',
        'description' => 'Sicheres Webhosting & Website-Wartung zum festen Monatspreis: Updates, Backups, SSL und Monitoring. Für Unternehmen in Brandenburg & Sachsen, bundesweit per Remote.',
        'canonical'   => 'https://nils.w500.de/hosting',
        'active'      => 'leistungen.html',
        'og'          => ['title' => 'Webhosting &amp; Wartung zum Festpreis | Nils Webdesign'],
        'twitter'     => ['title' => 'Webhosting &amp; Wartung zum Festpreis | Nils Webdesign'],
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"Webhosting & Wartung","serviceType":"Webhosting / Website-Wartung","provider":{"@id":"https://nils.w500.de/#localbusiness"},"areaServed":["Brandenburg","Sachsen","Deutschland"],"url":"https://nils.w500.de/hosting"},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://nils.w500.de/leistungen"},{"@type":"ListItem","position":3,"name":"Hosting & Wartung","item":"https://nils.w500.de/hosting"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was kostet Hosting & Wartung?","acceptedAnswer":{"@type":"Answer","text":"Wir arbeiten mit festen monatlichen Wartungspreisen ab 49 € pro Monat, gestaffelt nach Paket. Den genauen Umfang sehen Sie auf der Paket-Seite."}},{"@type":"Question","name":"Können Sie meine bestehende Website übernehmen?","acceptedAnswer":{"@type":"Answer","text":"In vielen Fällen ja. Wir prüfen vorab den technischen Stand und sagen ehrlich, ob eine Übernahme sinnvoll ist oder eine Neugestaltung der bessere Weg wäre."}},{"@type":"Question","name":"Wo werden die Daten gehostet?","acceptedAnswer":{"@type":"Answer","text":"Wir setzen auf datenschutzfreundliches Hosting; Anbieter und Serverstandort werden im Vertrag festgehalten."}},{"@type":"Question","name":"Bin ich an eine lange Laufzeit gebunden?","acceptedAnswer":{"@type":"Answer","text":"Nein. Konditionen und Kündigungsfristen sind transparent in den AGB geregelt, ohne versteckte Mindestlaufzeiten über das Vereinbarte hinaus."}}]}]}',
        ],
    ],
    'leistungen' => [
        'title'       => 'Leistungen – Webdesign, SEO & Betreuung | Nils Webdesign',
        'description' => 'Webdesign, technisches SEO sowie Wartung & Hosting – ein Überblick über unsere Leistungen. Hochwertige Websites aus einer Hand, persönlich betreut.',
        'canonical'   => 'https://nils.w500.de/leistungen',
        'active'      => 'leistungen.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://nils.w500.de/leistungen"}]}',
        ],
    ],
    'pakete' => [
        'title'       => 'Pakete & Preise – Website direkt buchen | Nils Webdesign',
        'description' => 'Feste Preise, klare Termine: Vier Website-Pakete zum Durchbuchen – Basis, Pro, Platin, Enterprise. Inkl. festem Wartungspreis. Projekt beschreiben per KI-Assistentin Lumi oder Textfeld.',
        'canonical'   => 'https://nils.w500.de/pakete',
        'active'      => 'pakete.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@graph":[{"@type":"Service","name":"Website-Pakete","provider":{"@id":"https://nils.w500.de/#localbusiness"},"offers":{"@type":"AggregateOffer","priceCurrency":"EUR","lowPrice":"990","highPrice":"9990","offerCount":"4","offers":[{"@type":"Offer","name":"Basis","price":"990","priceCurrency":"EUR"},{"@type":"Offer","name":"Pro","price":"2990","priceCurrency":"EUR"},{"@type":"Offer","name":"Platin","price":"5990","priceCurrency":"EUR"},{"@type":"Offer","name":"Enterprise","price":"9990","priceCurrency":"EUR"}]}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Pakete","item":"https://nils.w500.de/pakete"}]}]}',
            '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Sind die Preise wirklich fix?","acceptedAnswer":{"@type":"Answer","text":"Ja. Jedes Paket hat einen festen Preis inkl. MwSt. und einen klar definierten Leistungsumfang. Wünsche darüber hinaus bieten wir transparent als Zusatzleistungen mit ebenfalls festen Preisen an."}},{"@type":"Question","name":"Welches Paket passt zu mir?","acceptedAnswer":{"@type":"Answer","text":"Für eine schlanke Online-Visitenkarte genügt oft Basis. Für Kundengewinnung mit mehreren Bereichen eignet sich Pro; Platin und Enterprise sind für umfangreiche Auftritte gedacht. Auf Wunsch geben wir eine ehrliche Empfehlung."}},{"@type":"Question","name":"Was passiert, nachdem ich gebucht habe?","acceptedAnswer":{"@type":"Answer","text":"Sie beschreiben Ihr Projekt mit Lumi oder per Textfeld und laden Materialien hoch. Die Buchung ist eine Anfrage; verbindlich wird der Auftrag mit unserer Auftragsbestätigung."}},{"@type":"Question","name":"Fallen laufende Kosten an?","acceptedAnswer":{"@type":"Answer","text":"Der Erstellungspreis ist einmalig. Für den laufenden Betrieb (Hosting, Updates, Backups, Sicherheit) gibt es eine feste monatliche Wartung."}},{"@type":"Question","name":"Habe ich als Verbraucher ein Widerrufsrecht?","acceptedAnswer":{"@type":"Answer","text":"Als Verbraucher haben Sie ein 14-tägiges Widerrufsrecht. Einzelheiten, auch zum vorzeitigen Erlöschen bei gewünschtem Leistungsbeginn, stehen in der Widerrufsbelehrung."}}]}',
        ],
        'cta'         => ['href' => '#pakete', 'label' => 'Jetzt buchen'],
        'extra_css'   => ['/assets/pakete.css'],
    ],
    'portfolio' => [
        'title'       => 'Portfolio & Referenzen | Nils Webdesign',
        'description' => 'Ausgewählte Projekte und Referenzen von Nils Webdesign – moderne Websites für Handwerk, Start-ups, Gastronomie und mehr.',
        'canonical'   => 'https://nils.w500.de/portfolio',
        'active'      => 'portfolio.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Portfolio","item":"https://nils.w500.de/portfolio"}]}',
        ],
    ],
    'ueber-uns' => [
        'title'       => 'Über uns – Dein Partner für die digitale Welt | Nils Webdesign',
        'description' => 'Lerne uns kennen – Nils Webdesign. Persönliche Betreuung, ehrliche Beratung und technisch makellose Umsetzung deiner Vision.',
        'canonical'   => 'https://nils.w500.de/ueber-uns',
        'active'      => 'ueber-uns.html',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Über uns","item":"https://nils.w500.de/ueber-uns"}]}',
        ],
    ],
    'kontakt' => [
        'title'       => 'Kontakt – Lass uns sprechen | Nils Webdesign',
        'description' => 'Kontaktiere Nils Webdesign für ein kostenloses Erstgespräch. Schreib uns über das Formular oder direkt per E-Mail und Telefon – Antwort innerhalb von 24 Stunden.',
        'canonical'   => 'https://nils.w500.de/kontakt',
        'jsonld'      => [
            'ORG',
            '{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Start","item":"https://nils.w500.de/"},{"@type":"ListItem","position":2,"name":"Kontakt","item":"https://nils.w500.de/kontakt"}]}',
        ],
    ],
    'impressum' => [
        'title'       => 'Impressum | Nils Webdesign',
        'description' => 'Impressum von Nils Webdesign.',
        'canonical'   => 'https://nils.w500.de/impressum',
        'robots'      => 'noindex',
        'og'          => false,
        'twitter'     => false,
    ],
    'datenschutz' => [
        'title'       => 'Datenschutzerklärung | Nils Webdesign',
        'description' => 'Datenschutzerklärung von Nils Webdesign.',
        'canonical'   => 'https://nils.w500.de/datenschutz',
        'robots'      => 'noindex',
        'og'          => false,
        'twitter'     => false,
    ],
    'agb' => [
        'title'       => 'AGB | Nils Webdesign',
        'description' => 'Allgemeine Geschäftsbedingungen von Nils Webdesign.',
        'canonical'   => 'https://nils.w500.de/agb',
        'robots'      => 'noindex',
        'og'          => false,
        'twitter'     => false,
    ],
    'widerruf' => [
        'title'       => 'Widerrufsbelehrung | Nils Webdesign',
        'description' => 'Widerrufsbelehrung und Muster-Widerrufsformular von Nils Webdesign.',
        'canonical'   => 'https://nils.w500.de/widerruf',
        'robots'      => 'noindex',
        'og'          => false,
        'twitter'     => false,
    ],
];
