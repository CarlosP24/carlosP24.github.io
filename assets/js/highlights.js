/* Auto-generate the "Latest preprint" and "Latest published" highlight cards
   on the about page from the arXiv publications feed (/js/publications.js).

   Card order:
     1. Latest unsubmitted preprint  (if any)
     2. Latest published paper

   Abstracts are revealed on hover via CSS (.paper-card__abstract-hover).
   Badge colour encodes journal impact factor:
     orange  – preprint
     green   – published journal with IF > 5
     blue    – published journal with IF ≤ 5
*/

(function () {
  'use strict';

  /* ── Journal lookup table ─────────────────────────────────────────────── */
  var JOURNALS = [
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

  function getJournalInfo(ref) {
    if (!ref || ref.length <= 1) return null;
    for (var i = 0; i < JOURNALS.length; i++) {
      if (ref.indexOf(JOURNALS[i].match) !== -1) {
        return { label: JOURNALS[i].label, highIF: JOURNALS[i].highIF };
      }
    }
    // Fallback: extract text before the first digit (volume number)
    var m = ref.match(/^([A-Za-z][A-Za-z.\s\-]+?)\s+\d/);
    return { label: m ? m[1].trim() : 'Journal', highIF: false };
  }

  function getArxivId(entry) {
    var m = (entry.id || '').match(/abs\/(\d{4}\.\d+)/);
    return m ? m[1] : null;
  }

  function boldMyName(authors) {
    return (authors || '').replace(/Carlos Payá/g, '<strong>Carlos Payá</strong>');
  }

  /* Light LaTeX cleanup for plain-text display */
  function cleanLatex(text) {
    return (text || '')
      .replace(/\$([^$]*)\$/g, '$1')                     // inline math: keep content
      .replace(/\\textit\{([^}]+)\}/g, '$1')             // \textit{x} → x
      .replace(/\\textbf\{([^}]+)\}/g, '$1')             // \textbf{x} → x
      .replace(/\\text\{([^}]+)\}/g, '$1')               // \text{x}   → x
      .replace(/\\[a-zA-Z]+\{([^}]+)\}/g, '$1')         // \cmd{x}    → x
      .replace(/\\[a-zA-Z]+/g, '')                       // lone \cmd  → ''
      .replace(/\\\\/g, '');                             // \\ → ''
  }

  function buildCard(entry, featured) {
    var isPreprint = !entry.journal_ref || entry.journal_ref.length <= 1;
    var arxivId    = getArxivId(entry);
    var jInfo      = isPreprint ? null : getJournalInfo(entry.journal_ref);

    /* Badge */
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

    /* Title link: DOI preferred, fall back to arXiv abstract page */
    var titleLink = entry.doi
      ? 'https://dx.doi.org/' + entry.doi
      : (entry.formats && entry.formats.html ? entry.formats.html : '#');

    /* Meta line */
    var metaParts = [];
    if (!isPreprint && entry.journal_ref) {
      metaParts.push('<a href="' + titleLink + '" class="paper-card__journal-ref">' + entry.journal_ref + '</a>');
    }
    if (arxivId) {
      var year = entry.published ? entry.published.substring(0, 4) : '';
      var yearLabel = year ? ' (' + year + ')' : '';
      metaParts.push(
        '<a href="https://arxiv.org/abs/' + arxivId + '" class="paper-card__arxiv-ref">'
        + 'arXiv:' + arxivId + yearLabel + '</a>'
      );
    }

    return '<div class="paper-card' + (featured ? ' paper-card--featured' : '') + '">'
      + (featured ? '<span class="paper-card__featured-tag">&#9733;&nbsp;Featured</span>' : '')
      + '<span class="paper-card__badge ' + badgeClass + '">' + badgeLabel + '</span>'
      + '<p class="paper-card__title"><a href="' + titleLink + '">' + entry.title + '</a></p>'
      + '<p class="paper-card__authors">' + boldMyName(entry.authors) + '</p>'
      + '<p class="paper-card__meta">' + metaParts.join(' &middot; ') + '</p>'
      + '<div class="paper-card__abstract-hover">'
      +   '<p class="paper-card__summary">' + cleanLatex(entry.summary) + '</p>'
      + '</div>'
      + '</div>';
  }

  /* ── arXiv feed callback ──────────────────────────────────────────────── */
  window.jsonarXivFeed = function (feed) {
    var entries        = feed.entries || [];
    var latestPreprint = null;
    var latestPub      = null;

    /* ── Featured cards (one per DOI in data-dois) ──────────────────── */
    var featuredDois = {};
    var featuredContainer = document.getElementById('featured-highlights');
    if (featuredContainer) {
      var rawDois = featuredContainer.getAttribute('data-dois') || '';
      rawDois.split(',').forEach(function(d) { var doi = d.trim(); if (doi) featuredDois[doi] = true; });
      var featuredHtml = '';
      for (var fi = 0; fi < entries.length; fi++) {
        if (entries[fi].doi && featuredDois[entries[fi].doi]) {
          featuredHtml += buildCard(entries[fi], true);
        }
      }
      featuredContainer.outerHTML = featuredHtml;
    }

    /* Skip featured papers in the auto-highlights so they don't appear twice */
    for (var i = 0; i < entries.length; i++) {
      var e      = entries[i];
      if (e.doi && featuredDois[e.doi]) continue;
      var hasPub = e.journal_ref && e.journal_ref.length > 1;
      if (!latestPreprint && !hasPub) latestPreprint = e;
      if (!latestPub      &&  hasPub) latestPub      = e;
      if (latestPreprint && latestPub) break;
    }

    var html = '';
    if (latestPreprint) html += '<p class="paper-card__section-label">Latest preprint</p>' + buildCard(latestPreprint, false);
    if (latestPub)      html += '<p class="paper-card__section-label">Latest publication</p>' + buildCard(latestPub, false);

    var el = document.getElementById('auto-highlights');
    if (el) el.innerHTML = html;
  };

  /* Dynamically load the publications feed */
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src  = '/js/publications.js';
  document.head.appendChild(s);
}());
