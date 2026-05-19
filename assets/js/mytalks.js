function htmlFix(html) {
    return (html || '').replace(/&apos;/g, '&#39;');
}

function talksFeed(feed) {
    makeTalks(feed);
}

// Dynamically load js/talks.js as a script
(function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '/js/talks.js';
    document.head.appendChild(s);
})();

function makeTalks(feed) {
    var MONTHS = {
        january:1, february:2, march:3, april:4, may:5, june:6,
        july:7, august:8, september:9, october:10, november:11, december:12
    };
    function parseDate(str) {
        if (!str) return 0;
        var parts = (str + '').trim().split(/\s+/);
        var m = MONTHS[(parts[0] || '').toLowerCase()] || 0;
        var y = parseInt(parts[parts.length - 1], 10) || 0;
        return y * 100 + m;
    }

    var BADGE = {
        invited:     { cls: 'paper-card__badge--invited',     label: 'Invited'     },
        tutorial:    { cls: 'paper-card__badge--tutorial',    label: 'Tutorial'    },
        contributed: { cls: 'paper-card__badge--contributed', label: 'Contributed' },
        poster:      { cls: 'paper-card__badge--poster',      label: 'Poster'      },
        attended:    { cls: 'paper-card__badge--attended',    label: 'Attended'    }
    };

    // Sort all entries newest-first for display; chronological index C1=oldest, Cn=newest
    var entries = feed.entries.slice().sort(function(a, b) {
        return parseDate(b.date) - parseDate(a.date);
    });
    var total = entries.length;

    function renderTalk(entry, idx) {
        var typeKey = (entry.type || '').toLowerCase();
        var badge   = BADGE[typeKey] || { cls: 'paper-card__badge--attended', label: entry.type || 'Talk' };

        // Date badge + type badge (date left, type right)
        var badgesTop = '';
        if (entry.date) {
            badgesTop += '<span class="paper-card__badge paper-card__badge--date">' + htmlFix(entry.date) + '</span> ';
        }
        badgesTop += '<span class="paper-card__badge ' + badge.cls + '">' + badge.label + '</span>';

        // Meta line: venue — location (date is now a badge)
        var meta = [];
        if (entry.venue)    meta.push(htmlFix(entry.venue));
        if (entry.location) meta.push(htmlFix(entry.location));

        // Contribution title
        var contHtml = entry.cont_title
            ? '<p class="paper-card__meta"><span class="talk-card__cont-title"><em>'
              + htmlFix(entry.cont_title) + '</em></span></p>'
            : '';

        // Aesthetic action buttons (PDF + references)
        var linksHtml = '';
        if (entry.pdf_url || entry.references) {
            linksHtml = '<div class="paper-card__badges">';
            if (entry.pdf_url) {
                linksHtml += '<a href="' + entry.pdf_url + '" target="_blank"'
                    + ' class="talk-card__btn talk-card__btn--pdf">'
                    + '<i class="fas fa-file-pdf" aria-hidden="true"></i> PDF</a>';
            }
            if (entry.references) {
                linksHtml += '<a href="/references/' + entry.references + '"'
                    + ' class="talk-card__btn talk-card__btn--refs">'
                    + '<i class="fas fa-book" aria-hidden="true"></i> References</a>';
            }
            linksHtml += '</div>';
        }

        // Description revealed on hover
        var abstractHtml = entry.description
            ? '<div class="paper-card__abstract-hover">'
              + '<p class="paper-card__summary">' + htmlFix(entry.description) + '</p>'
              + '</div>'
            : '';

        var titleInner = entry.talk_url
            ? '<a href="' + entry.talk_url + '" target="_blank">' + htmlFix(entry.title) + '</a>'
            : htmlFix(entry.title);

        return '<div class="paper-card paper-card--talk">'
            + '<span class="paper-card__index">[C' + idx + ']</span>'
            + badgesTop
            + '<p class="paper-card__title">' + titleInner + '</p>'
            + (meta.length ? '<p class="paper-card__authors">' + meta.join(' &mdash; ') + '</p>' : '')
            + contHtml
            + linksHtml
            + abstractHtml
            + '</div>';
    }

    var html = '';
    entries.forEach(function(entry, i) {
        html += renderTalk(entry, total - i);
    });

    document.getElementById('talksfeed').innerHTML = html;
}