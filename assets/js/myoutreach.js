function htmlFix(html) {
    return (html || '').replace(/&apos;/g, '&#39;');
}

function outreachFeed(feed) {
    makeOutreach(feed);
}

// Dynamically load js/outreach.js as a script
(function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '/js/outreach.js';
    document.head.appendChild(s);
})();

function makeOutreach(feed) {
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
        workshopper: { cls: 'paper-card__badge--workshopper', label: 'Workshopper' },
        logistics:   { cls: 'paper-card__badge--logistics',   label: 'Logistics'   }
    };

    // Newest first for display; O1 = oldest, On = newest
    var entries = feed.entries.slice().sort(function(a, b) {
        return parseDate(b.date) - parseDate(a.date);
    });
    var total = entries.length;

    function renderEntry(entry, idx) {
        var typeKey = (entry.type || '').toLowerCase();
        var badge   = BADGE[typeKey] || { cls: 'paper-card__badge--logistics', label: entry.type || 'Outreach' };

        // Date badge + type badge
        var badgesTop = '';
        if (entry.date) {
            badgesTop += '<span class="paper-card__badge paper-card__badge--date">' + htmlFix(entry.date) + '</span> ';
        }
        badgesTop += '<span class="paper-card__badge ' + badge.cls + '">' + badge.label + '</span>';

        // Meta: venue — location
        var meta = [];
        if (entry.venue)    meta.push(htmlFix(entry.venue));
        if (entry.location) meta.push(htmlFix(entry.location));

        // Description revealed on hover
        var abstractHtml = entry.description
            ? '<div class="paper-card__abstract-hover">'
              + '<p class="paper-card__summary">' + htmlFix(entry.description) + '</p>'
              + '</div>'
            : '';

        var titleInner = entry.talk_url
            ? '<a href="' + entry.talk_url + '" target="_blank">' + htmlFix(entry.title) + '</a>'
            : htmlFix(entry.title);

        return '<div class="paper-card paper-card--outreach">'
            + '<span class="paper-card__index">[O' + idx + ']</span>'
            + badgesTop
            + '<p class="paper-card__title">' + titleInner + '</p>'
            + (meta.length ? '<p class="paper-card__authors">' + meta.join(' &mdash; ') + '</p>' : '')
            + abstractHtml
            + '</div>';
    }

    var html = '';
    entries.forEach(function(entry, i) {
        html += renderEntry(entry, total - i);
    });

    document.getElementById('outreachfeed').innerHTML = html;
}
