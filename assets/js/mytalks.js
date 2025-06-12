// Based on https://arxiv.org/help/myarticles

function manageDefaults() {
    if (typeof talks_includeDescription === 'undefined') {
        talks_includeDescription = 0; }
    return 1;	
}

function htmlFix(html) {
    var re = new RegExp('&apos;', 'g');
    html = html.replace(re, '&#39;');
    return html;
}

function talksFeed(feed) {
    manageDefaults();
    makeTalks(feed);
}

// Dynamically load js/talks.js as a script
(function() {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = '/js/talks.js'; // Local JS file
    headID.appendChild(newScript);
})();

function makeTalks(feed) {
    var html = '<div id="arxivcontainer" style="font-family:Lucida Grande,helvetica,arial,verdana,sans-serif;margin:.7em;font-size:90%">\n';
    html += '<dl style="margin:0;">\n';

    // Categorize talks by type
    var attended = [], poster = [], contributed = [], invited = [];
    feed.entries.forEach(function(entry) {
        var type = (entry.type || '').toLowerCase();
        if (type === 'attended') attended.push(entry);
        else if (type === 'poster') poster.push(entry);
        else if (type === 'contributed') contributed.push(entry);
        else if (type === 'invited') invited.push(entry);
    });

    // Prepare ordered categories
    var categories = [
        { name: "Invited Talks", entries: invited },
        { name: "Contributed Talks", entries: contributed },
        { name: "Poster Presentations", entries: poster },
        { name: "Attended Conferences/Workshops", entries: attended }
    ];

    // Single global counter
    var total = invited.length + contributed.length + poster.length + attended.length;
    var counter = total;

    function renderTalk(entry, counter) {
        // Use flex to align the counter and the rest, and a fixed-width counter box
        var html = '';
        html += '<dt style="display:flex;align-items:flex-start;margin-bottom:0.25em;">';
        html += '<span style="display:inline-block;min-width:3.5em;text-align:right;font-family:monospace;">[C' + counter + ']</span>';
        html += '<span class="list-identifier" style="font-size:large;font-weight:bold;margin-left:0.5em;line-height:120%">';
        if (entry.talk_url) {
            html += '<a href="' + entry.talk_url + '" title="Event page" style="text-decoration:none;color:inherit;" target="_blank">' + htmlFix(entry.title) + '</a>';
        } else {
            html += htmlFix(entry.title);
        }
        html += '</span></dt>\n';

        html += '<dd style="margin:0 0 1em 0; padding:0 0 0 4.2em;">';
        html += '<div class="meta" style="line-height:130%;">\n';

        // Venue, date, location
        var details = [];
        if (entry.venue) details.push(htmlFix(entry.venue));
        if (entry.date) details.push(htmlFix(entry.date));
        if (entry.location) details.push(htmlFix(entry.location));
        if (details.length > 0) {
            html += '<div class="list-journal-ref" style="font-weight:normal;font-size:100%;text-decoration:none;">' + details.join(' — ') + '</div>\n';
        }
        // Description (if present)
        if (talks_includeDescription && entry.description) {
            html += '<div class="list-description" style="font-weight:normal;font-size:100%;margin-top:0.2em;">' + htmlFix(entry.description) + '</div>\n';
        }

        // Contribution title and PDF (if present)
        if (entry.cont_title) {
            html += '<div class="list-authors" style="font-weight:normal;font-size:100%;color:#6A994E;text-decoration:none;">';
            html += '<span style="font-style:normal;font-weight:bold;">Title:</span> <span style="font-style:italic;">' + htmlFix(entry.cont_title) + '</span>';
            if (entry.pdf_url) {
            html += ' <a href="' + entry.pdf_url + '" target="_blank" style="color:#BC4749;text-decoration:none;">[PDF]</a>';
            if (entry.references) {
                html += ' <a href="/' + entry.references + '" style="color:#386641;text-decoration:none;">[references]</a>';
            }
            } else if (entry.references) {
            html += ' <a href="/' + entry.references + '" style="color:#386641;text-decoration:none;">[references]</a>';
            }
            html += '</div>\n';
        } else if (entry.pdf_url) {
            // If no cont_title but PDF exists, show PDF link alone
            html += '<div class="list-pdf" style="font-weight:normal;font-size:100%;margin-top:0.2em;">';
            html += '<a href="' + entry.pdf_url + '" target="_blank" style="color:#BC4749;text-decoration:none;">[PDF]</a>';
            if (entry.references) {
            html += ' <a href="/' + entry.references + '" style="color:#386641;text-decoration:none;">[references]</a>';
            }
            html += '</div>\n';
        } else if (entry.references) {
            // If only references exist
            html += '<div class="list-references" style="font-weight:normal;font-size:100%;margin-top:0.2em;">';
            html += '<a href="/' + entry.references + '" style="color:#386641;text-decoration:none;">[references]</a>';
            html += '</div>\n';
        }

        html += '</div>\n</dd>\n';
        return html;
    }

    // Render each category with section header if not empty, using a single counter
    categories.forEach(function(cat) {
        if (cat.entries.length) {
            html += '<div style="font-weight:bold; font-size:110%; margin-bottom:0.5em;">' + cat.name + ':</div>\n';
            cat.entries.forEach(function(entry) {
                html += renderTalk(entry, counter);
                counter--;
            });
        }
    });

    html += '</dl>\n</div>\n';
    document.getElementById('talksfeed').innerHTML = html;
}