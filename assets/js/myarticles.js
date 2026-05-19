// Based on https://arxiv.org/help/myarticles
function manageDefaults() {
    if (typeof arxiv_includeTitle === 'undefined') {
        arxiv_includeTitle = 1; }
    if (typeof arxiv_includeSummary === 'undefined') {
        arxiv_includeSummary = 0; }
    if (typeof arxiv_includeComments === 'undefined') {
        arxiv_includeComments = 1; }
    if (typeof arxiv_includeSubjects === 'undefined') {
        arxiv_includeSubjects = 1; }
    if (typeof arxiv_includeJournalRef === 'undefined') {
        arxiv_includeJournalRef = 1; }
    if (typeof arxiv_includeDOI === 'undefined') {
        arxiv_includeDOI = 1; }
    if (typeof arxiv_max_entries === 'undefined') {
        arxiv_max_entries = 10;	}
    return 1;	
}

// IE doesn't like &apos; which we have in JSON data, so change to numeric entity
function htmlFix(html) {
      var re = new RegExp('&apos;', 'g');
    html = html.replace(re,'&#39;');
    return html;
}

// This function will be called by js/publications.js (JSONP style)
function jsonarXivFeed(feed) {
    manageDefaults();
    makearXiv(feed);
}

// Dynamically load js/publications.js as a script
(function() {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = '/js/publications.js'; // Local JS file
    headID.appendChild(newScript);
})();

/* ── Journal lookup (mirrors highlights.js) ─────────────────────────────── */
var PUB_JOURNALS = [
    { match: 'Phys. Rev. Lett.',        label: 'Phys. Rev. Lett.',   highIF: true  },
    { match: 'Physical Review Letters', label: 'Phys. Rev. Lett.',   highIF: true  },
    { match: 'Phys. Rev. B',            label: 'Phys. Rev. B',       highIF: false },
    { match: 'Physical Review B',       label: 'Phys. Rev. B',       highIF: false },
    { match: 'Phys. Rev. X',            label: 'Phys. Rev. X',       highIF: true  },
    { match: 'PRX Quantum',             label: 'PRX Quantum',        highIF: true  },
    { match: 'SciPost Phys.',           label: 'SciPost Phys.',      highIF: true  },
    { match: 'SciPost Physics',         label: 'SciPost Phys.',      highIF: true  },
    { match: 'npj Quantum Mat',         label: 'npj Quantum Mat.',   highIF: true  },
    { match: 'Nature Physics',          label: 'Nature Phys.',       highIF: true  },
    { match: 'Nature',                  label: 'Nature',             highIF: true  },
    { match: 'Science',                 label: 'Science',            highIF: true  },
];

function pubGetJournalInfo(ref) {
    if (!ref || ref.length <= 1) return null;
    for (var i = 0; i < PUB_JOURNALS.length; i++) {
        if (ref.indexOf(PUB_JOURNALS[i].match) !== -1) {
            return { label: PUB_JOURNALS[i].label, highIF: PUB_JOURNALS[i].highIF };
        }
    }
    var m = ref.match(/^([A-Za-z][A-Za-z.\s\-]+?)\s+\d/);
    return { label: m ? m[1].trim() : 'Journal', highIF: false };
}

function makearXiv(feed) {
    var x = 0;
    var html = '';

    // Read featured DOIs from the container element
    var feedEl = document.getElementById('arxivfeed');
    var featuredDois = {};
    var notableDois = {};
    if (feedEl) {
        var raw = feedEl.getAttribute('data-featured-dois') || '';
        raw.split(',').forEach(function(d) { var doi = d.trim(); if (doi) featuredDois[doi] = true; });
        var raw2 = feedEl.getAttribute('data-notable-dois') || '';
        raw2.split(',').forEach(function(d) { var doi = d.trim(); if (doi) notableDois[doi] = true; });
    }

    // Determine number of entries to show
    var num_entries;
    if (arxiv_max_entries === 0 || arxiv_max_entries >= feed.entries.length) {
        num_entries = feed.entries.length;
    } else {
        num_entries = arxiv_max_entries;
    }

    // Separate entries with and without journal_ref
    var entriesWithJournalRef = [];
    var entriesWithoutJournalRef = [];
    for (x = 0; x < num_entries; x++) {
        if (feed.entries[x].journal_ref && feed.entries[x].journal_ref.length > 1) {
            entriesWithJournalRef.push(feed.entries[x]);
        } else {
            entriesWithoutJournalRef.push(feed.entries[x]);
        }
    }

    // ── Card renderer ────────────────────────────────────────────────────────
    function renderEntry(entry, displayIndex) {
        var isPreprint = !entry.journal_ref || entry.journal_ref.length <= 1;
        var isFeatured = !!(entry.doi && featuredDois[entry.doi]);
        var isNotable  = !isFeatured && !!(entry.doi && notableDois[entry.doi]);
        var cardClass  = isFeatured ? ' paper-card--featured' : (isNotable ? ' paper-card--notable' : '');
        var tierTag    = isFeatured
            ? '<span class="paper-card__featured-tag">&#9733;&nbsp;Featured</span>'
            : (isNotable ? '<span class="paper-card__notable-tag">&#9733;&nbsp;Notable</span>' : '');

        // arXiv ID
        var arxivId = null;
        var absMatch = entry.id.match(/arxiv\.org\/abs\/([^\/\?#]+)/i);
        if (absMatch && absMatch[1]) {
            arxivId = absMatch[1].replace(/v\d+$/, '');
        }

        // Badge
        var jInfo = isPreprint ? null : pubGetJournalInfo(entry.journal_ref);
        var badgeClass, badgeLabel;
        if (isPreprint) {
            badgeClass = 'paper-card__badge--preprint';
            badgeLabel = 'Preprint';
        } else if (jInfo && jInfo.highIF) {
            badgeClass = 'paper-card__badge--highif';
            badgeLabel = jInfo.label;
        } else {
            badgeClass = 'paper-card__badge--lowif';
            badgeLabel = jInfo ? jInfo.label : 'Journal';
        }

        // Title link: DOI preferred, fall back to arXiv page
        var titleLink = (!isPreprint && entry.doi && entry.doi.length > 0)
            ? 'https://dx.doi.org/' + entry.doi
            : entry.id;

        // Authors – bold Carlos Payá
        var authorsHtml = (entry.authors || '').replace(/Carlos Payá/g, '<strong>Carlos Payá</strong>');

        // Year from published field
        var year = entry.published ? entry.published.substring(0, 4) : '';

        // Meta line parts
        var metaParts = [];
        if (!isPreprint && entry.journal_ref) {
            var jrefHtml = (entry.doi && entry.doi.length > 0)
                ? '<a href="https://dx.doi.org/' + entry.doi + '" class="paper-card__journal-ref">' + entry.journal_ref + '</a>'
                : '<span class="paper-card__journal-ref">' + entry.journal_ref + '</span>';
            metaParts.push(jrefHtml);
        }
        if (arxivId) {
            metaParts.push(
                '<a href="https://arxiv.org/abs/' + arxivId + '" class="paper-card__arxiv-ref">'
                + 'arXiv:' + arxivId + (year ? ' (' + year + ')' : '') + '</a>'
            );
        }

        // Altmetric + Dimensions badges (published papers with DOI only)
        var badgesHtml = '';
        if (!isPreprint && entry.doi && entry.doi.length > 0) {
            badgesHtml = '<div class="altmetric-embed" data-badge-popover="bottom" data-doi="' + entry.doi + '"></div>'
                + '<span class="__dimensions_badge_embed__" data-doi="' + entry.doi
                + '" data-style="small_rectangle" data-hide-zero-citations="true" data-legend="hover-right"></span>';
        }

        var metaHtml = metaParts.join(' &middot; ');

        return '<div class="paper-card' + cardClass + '">'
            + '<span class="paper-card__index">'
            + tierTag
            + '[P' + displayIndex + ']</span>'
            + '<span class="paper-card__badge ' + badgeClass + '">' + badgeLabel + '</span>'
            + '<p class="paper-card__title"><a href="' + titleLink + '">' + entry.title + '</a></p>'
            + '<p class="paper-card__authors">' + authorsHtml + '</p>'
            + '<p class="paper-card__meta">' + metaHtml + '</p>'
            + (badgesHtml ? '<div class="paper-card__badges">' + badgesHtml + '</div>' : '')
            + '<div class="paper-card__abstract-hover">'
            +   '<p class="paper-card__summary">' + (entry.summary || '') + '</p>'
            + '</div>'
            + '</div>';
    }

    // ── Render all entries ───────────────────────────────────────────────────
    if (entriesWithoutJournalRef.length > 0) {
        for (x = 0; x < entriesWithoutJournalRef.length; x++) {
            html += renderEntry(entriesWithoutJournalRef[x], num_entries - x);
        }
    }

    for (var y = 0; y < entriesWithJournalRef.length; y++) {
        html += renderEntry(entriesWithJournalRef[y], num_entries - (entriesWithoutJournalRef.length + y));
    }

    document.getElementById('arxivfeed').innerHTML = html;

    // Initialise metric badges (retry after short delay for async badge scripts)
    function initBadges() {
        if (window._altmetric_embed_init) window._altmetric_embed_init();
        if (window.__dimensions_embed && window.__dimensions_embed.addBadges) window.__dimensions_embed.addBadges();
    }
    initBadges();
    setTimeout(initBadges, 300);
}