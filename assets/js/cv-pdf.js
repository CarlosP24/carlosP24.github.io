  // Capitalize first letter of month, rest lowercase
  function formatMonthYear(dateStr) {
    if (!dateStr) return '';
    var parts = String(dateStr).trim().split(/\s+/);
    if (parts.length < 2) return dateStr;
    var month = parts[0];
    var year = parts.slice(1).join(' ');
    var formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    return formattedMonth + ' ' + year;
  }
(function () {
  'use strict';

  var LOAD_TIMEOUT_MS = 20000;

  function esc(value) {
    return (value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(value) {
    return esc(value).replace(/`/g, '&#96;');
  }

  function replaceAuthor(text) {
    return esc(text).replace(/Carlos Paya|Carlos Paya Herrero|Carlos Pay\u00e1|Carlos Pay\u00e1 Herrero/g, '<strong>Carlos Payá</strong>');
  }

  function loadJsonp(srcPath, callbackName) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) {
          return;
        }
        settled = true;
        reject(new Error('Timeout while loading ' + srcPath));
      }, LOAD_TIMEOUT_MS);

      window[callbackName] = function (payload) {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        resolve(payload || { entries: [] });
      };

      var script = document.createElement('script');
      script.src = srcPath;
      script.async = true;
      script.onerror = function () {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        reject(new Error('Failed to load ' + srcPath));
      };
      document.head.appendChild(script);
    });
  }

  function parseMonthYear(text) {
    if (!text) {
      return 0;
    }
    var months = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12
    };
    var parts = String(text).trim().split(/\s+/);
    var month = months[(parts[0] || '').toLowerCase()] || 0;
    var year = parseInt(parts[parts.length - 1], 10) || 0;
    return year * 100 + month;
  }

  function parsePublishedDate(value) {
    if (!value) {
      return 0;
    }
    var t = Date.parse(value);
    return Number.isNaN(t) ? 0 : t;
  }

  function renderPublications(entries) {
    var sorted = entries.slice().sort(function (a, b) {
      return parsePublishedDate(b.published) - parsePublishedDate(a.published);
    });
    var total = sorted.length;

    function renderPublicationEntry(entry, i) {
      var displayIndex = total - i;
      var isPreprint = !(entry.journal_ref && entry.journal_ref.length > 1);
      var year = entry.published ? String(entry.published).slice(0, 4) : '';
      var journal = entry.journal_ref ? esc(entry.journal_ref) : '';
      var arxiv = entry.id ? esc(entry.id.replace(/^.*\/abs\//, '').replace(/v\d+$/, '')) : '';
      var metaParts = [];

      if (journal) {
        if (entry.doi) {
          metaParts.push('<a class="paper-card__journal-ref" href="https://dx.doi.org/' + escAttr(entry.doi) + '">' + journal + '</a>');
        } else {
          metaParts.push('<span class="paper-card__journal-ref">' + journal + '</span>');
        }
      }
      if (arxiv) {
        metaParts.push('<a class="paper-card__arxiv-ref" href="https://arxiv.org/abs/' + arxiv + '">arXiv:' + arxiv + (year ? ' (' + year + ')' : '') + '</a>');
      }

      return [
        '<div class="paper-card cv-pdf-compact-card">',
        '<div class="cv-pdf-entry-layout">',
        '<span class="cv-pdf-entry-ref">[P' + displayIndex + ']</span>',
        '<div class="cv-pdf-entry-body">',
        '<p class="paper-card__title">' + esc(entry.title || '') + '</p>',
        '<p class="paper-card__authors">' + replaceAuthor(entry.authors || '') + '</p>',
        '<p class="paper-card__meta">' + metaParts.join(' · ') + '</p>',
        '</div>',
        '</div>',
        '</div>'
      ].join('');
    }

    var preprints = [];
    var published = [];

    sorted.forEach(function (entry, i) {
      var html = renderPublicationEntry(entry, i);
      var isPreprint = !(entry.journal_ref && entry.journal_ref.length > 1);
      if (isPreprint) {
        preprints.push(html);
      } else {
        published.push(html);
      }
    });

    var output = '';
    if (preprints.length) {
      output += '<div class="cv-pdf-subsection">Preprints</div>' + preprints.join('');
    }
    if (published.length) {
      output += '<div class="cv-pdf-subsection">Published papers</div>' + published.join('');
    }

    return output;
  }

  function renderTalks(entries) {
    var sorted = entries.slice().sort(function (a, b) {
      return parseMonthYear(b.date) - parseMonthYear(a.date);
    });
    var total = sorted.length;

    return sorted.map(function (entry, i) {
      var displayIndex = total - i;
      var typeLabel = esc(entry.type || 'Talk');
      var venueLine = [entry.venue || '', entry.location || ''].filter(Boolean).map(esc).join(' · ');
      var resources = [];

      if (entry.pdf_url) {
        resources.push('<a href="' + escAttr(entry.pdf_url) + '">Presentation PDF</a>');
      }
      if (entry.references) {
        resources.push('<a href="/references/' + escAttr(entry.references) + '">Reference list</a>');
      }

      return [
        '<div class="paper-card paper-card--talk cv-pdf-compact-card">',
        '<div class="cv-pdf-entry-layout">',
        '<span class="cv-pdf-entry-ref">[C' + displayIndex + ']</span>',
        '<div class="cv-pdf-entry-body">',
        '<div class="cv-pdf-entry-title-line">',
        '<span class="cv-pdf-entry-title-text">' + esc(entry.title || '') + '</span>',
        '<span class="cv-pdf-entry-date">' + esc(formatMonthYear(entry.date || '')) + '</span>',
        '</div>',
        '<div class="cv-pdf-entry-type-line">',
        '<span class="cv-pdf-entry-type-spacer"></span>',
        '<span class="paper-card__badge paper-card__badge--contributed">' + typeLabel + '</span>',
        '</div>',
        (entry.cont_title ? '<p class="paper-card__authors"><em>' + esc(entry.cont_title) + '</em></p>' : ''),
        '<p class="paper-card__meta">' + venueLine + '</p>',
        (resources.length ? '<p class="paper-card__meta cv-pdf-resource-line">Materials: ' + resources.join(' · ') + '</p>' : ''),
        '</div>',
        '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderOutreach(entries) {
    var sorted = entries.slice().sort(function (a, b) {
      return parseMonthYear(b.date) - parseMonthYear(a.date);
    });
    var total = sorted.length;

    return sorted.map(function (entry, i) {
      var displayIndex = total - i;
      return [
        '<div class="paper-card paper-card--outreach cv-pdf-compact-card">',
        '<div class="cv-pdf-entry-layout">',
        '<span class="cv-pdf-entry-ref">[O' + displayIndex + ']</span>',
        '<div class="cv-pdf-entry-body">',
        '<div class="cv-pdf-entry-title-line">',
        '<span class="cv-pdf-entry-title-text">' + esc(entry.title || '') + '</span>',
        '<span class="cv-pdf-entry-date">' + esc(formatMonthYear(entry.date || '')) + '</span>',
        '</div>',
        '<div class="cv-pdf-entry-type-line">',
        '<span class="cv-pdf-entry-type-spacer"></span>',
        '<span class="paper-card__badge paper-card__badge--cv-out">' + esc(entry.type || 'Outreach') + '</span>',
        '</div>',
        '<p class="paper-card__meta">' + [entry.venue || '', entry.location || ''].filter(Boolean).map(esc).join(' · ') + '</p>',
        '</div>',
        '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderFunding(entries) {
    var sorted = entries.slice().sort(function (a, b) {
      var aYear = parseInt(a.begin || '0', 10) || 0;
      var bYear = parseInt(b.begin || '0', 10) || 0;
      return bYear - aYear;
    });

    return sorted.map(function (entry, i) {
      var years = (entry.begin || '') + '-' + (entry.end || '');
      return [
        '<div class="paper-card cv-pdf-compact-card">',
        '<div class="cv-pdf-entry-layout">',
        '<span class="cv-pdf-entry-ref">[F' + (sorted.length - i) + ']</span>',
        '<div class="cv-pdf-entry-body">',
        '<p class="cv-pdf-entry-title-line"><span class="cv-pdf-entry-title-text">' + esc(entry.title || '') + '</span><span class="cv-pdf-entry-date">' + esc(years) + '</span></p>',
        '<p class="paper-card__authors">' + esc(entry.agency || '') + ' · ' + esc(entry.code || '') + '</p>',
        '<p class="paper-card__meta">' + esc(entry.institution || '') + '</p>',
        (entry.PI ? '<p class="paper-card__meta">PI: ' + esc(entry.PI) + '</p>' : ''),
        '</div>',
        '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderAwards(entries) {
    var sorted = entries.slice().sort(function (a, b) {
      var aYear = parseInt(a.year || '0', 10) || 0;
      var bYear = parseInt(b.year || '0', 10) || 0;
      return bYear - aYear;
    });

    return sorted.map(function (entry, i) {
      var dateLabel = entry.editions || entry.year || '';
      if ((entry.code || '').toUpperCase() === 'MM') {
        dateLabel = '2017-2021';
      }

      return [
        '<div class="paper-card cv-pdf-compact-card">',
        '<div class="cv-pdf-entry-layout">',
        '<span class="cv-pdf-entry-ref">[A' + (sorted.length - i) + ']</span>',
        '<div class="cv-pdf-entry-body">',
        '<p class="cv-pdf-entry-title-line"><span class="cv-pdf-entry-title-text">' + esc(entry.title || '') + '</span><span class="cv-pdf-entry-date">' + esc(dateLabel) + '</span></p>',
        '<p class="paper-card__authors">' + esc(entry.institution || '') + '</p>',
        (entry.note ? '<p class="paper-card__meta">' + esc(entry.note) + '</p>' : ''),
        (entry.worktitle ? '<p class="paper-card__meta"><em>' + esc(entry.worktitle) + '</em></p>' : ''),
        '</div>',
        '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function setStatus(message, isError) {
    var el = document.getElementById('cvpdf-status');
    if (!el) {
      return;
    }
    el.textContent = message;
    if (isError) {
      el.className = 'cv-pdf-status cv-pdf-status--error';
    }
  }

  function setSectionHtml(id, html) {
    var el = document.getElementById(id);
    if (el) {
      el.innerHTML = html;
    }
  }

  function buildCvPdfPage() {
    window.__cvPdfReady = false;

    Promise.all([
      loadJsonp('/js/publications.js', 'jsonarXivFeed'),
      loadJsonp('/js/talks.js', 'talksFeed'),
      loadJsonp('/js/outreach.js', 'outreachFeed'),
      loadJsonp('/js/funding.js', 'fundingFeed'),
      loadJsonp('/js/awards.js', 'awardsFeed')
    ]).then(function (results) {
      var publications = (results[0] && results[0].entries) || [];
      var talks = (results[1] && results[1].entries) || [];
      var outreach = (results[2] && results[2].entries) || [];
      var funding = (results[3] && results[3].entries) || [];
      var awards = (results[4] && results[4].entries) || [];

      setSectionHtml('cvpdf-publications', renderPublications(publications));
      setSectionHtml('cvpdf-talks', renderTalks(talks));
      setSectionHtml('cvpdf-outreach', renderOutreach(outreach));
      setSectionHtml('cvpdf-funding', renderFunding(funding));
      setSectionHtml('cvpdf-awards', renderAwards(awards));

      setStatus('Printable CV is ready.');
      window.__cvPdfReady = true;
    }).catch(function (error) {
      setStatus('Error while building CV page: ' + error.message, true);
      window.__cvPdfReady = true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildCvPdfPage);
  } else {
    buildCvPdfPage();
  }
})();
