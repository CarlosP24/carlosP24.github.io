// Based on mytalks.js, but for outreach activities (no categories)

function manageDefaults() {
    if (typeof outreach_includeDescription === 'undefined') {
        outreach_includeDescription = 1;
    }
    return 1;
}

function htmlFix(html) {
    var re = new RegExp('&apos;', 'g');
    html = html.replace(re, '&#39;');
    return html;
}

function outreachFeed(feed) {
    manageDefaults();
    makeOutreach(feed);
}

// Dynamically load js/outreach.js as a script
(function() {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = '/js/outreach.js'; // Local JS file
    headID.appendChild(newScript);
})();

function makeOutreach(feed) {
    var html = '<div id="outreachcontainer" style="font-family:Lucida Grande,helvetica,arial,verdana,sans-serif;margin:.7em;font-size:90%">\n';
    html += '<dl style="margin:0;">\n';

    // Reverse for chronological order (earliest first)
    var entries = feed.entries.slice().reverse();

    // Single global counter
    var total = entries.length;
    var counter = total;

    function renderEntry(entry, counter) {
        var html = '';
        html += '<dt style="display:flex;align-items:flex-start;margin-bottom:0.25em;">';
        html += '<span style="display:inline-block;min-width:3.5em;text-align:right;font-family:monospace;">[o' + counter + ']</span>';
        html += '<span class="list-identifier" style="font-size:large;font-weight:bold;margin-left:0.5em;line-height:120%">';
        if (entry.talk_url) {
            html += '<a href="' + entry.talk_url + '" title="Event page" style="text-decoration:none;color:inherit;" target="_blank">' + htmlFix(entry.title) + '</a>';
        } else {
            html += htmlFix(entry.title);
        }
        html += '</span></dt>\n';

        html += '<dd style="margin:0 0 1em 0; padding:0 0 0 4.2em;">';
        html += '<div class="meta" style="line-height:130%;">\n';

        // Date, venue, location
        var details = [];
        if (entry.date) details.push(htmlFix(entry.date));
        if (entry.venue) details.push(htmlFix(entry.venue));
        if (entry.location) details.push(htmlFix(entry.location));
        if (details.length > 0) {
            html += '<div class="list-journal-ref" style="font-weight:normal;font-size:100%;text-decoration:none;">' + details.join(' — ') + '</div>\n';
        }

        // Description (if present)
        if (outreach_includeDescription && entry.description) {
            html += '<div class="list-description" style="font-weight:normal;font-size:100%;margin-top:0.2em;">' + htmlFix(entry.description) + '</div>\n';
        }

        html += '</div>\n</dd>\n';
        return html;
    }

    entries.forEach(function(entry) {
        html += renderEntry(entry, counter);
        counter--;
    });

    html += '</dl>\n</div>\n';
    document.getElementById('outreachfeed').innerHTML = html;
}