// Based on https://arxiv.org/help/myarticles

var headID = document.getElementsByTagName("head")[0];
var newScript = document.createElement('script');
var urlPrefix = 'https://arxiv.org/a/';

newScript.type = 'text/javascript';
if (typeof arxiv_authorid === 'undefined') {
	// At present support only list associated with author id
	// (maybe later list "latest papers" or something, for now we just dodge it)
	var arxiv_authorid="default";
} else if (typeof arxiv_authorid !== 'string') {
	arxiv_authorid="bad_authorid";
} else {
	// Get local part of author id from local part or complete arXiv author 
	// id (https://arxiv.org/a/local). Sanitize result.
	if (arxiv_authorid.indexOf(urlPrefix) === 0) {
	  arxiv_authorid=arxiv_authorid.substr(urlPrefix.length, 50);
	}
}
newScript.src = urlPrefix + arxiv_authorid + '.js';


headID.appendChild(newScript);


function manageDefaults()
{
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
function htmlFix(html)
{
  	var re = new RegExp('&apos;', 'g');
	html = html.replace(re,'&#39;');
	return html;
}


function jsonarXivFeed(feed)
{
    //First get/set defaults
    manageDefaults();
    //Detect missing authorid
    if (arxiv_authorid === "default") {
	    var html = '<strong>missing the arxiv_authorid variable!</strong>';
	    document.getElementById('arxivfeed').innerHTML=html;
	    return 1;
    }
	makearXiv(feed); 
}

function makearXiv(feed)
{
    var x = 0;
    //Much of this style is taken from https://arxiv.org/arXiv.css
    var html = '<div id="arxivcontainer" style="font-family:Lucida Grande,helvetica, arial, verdana,sans-serif;margin:.7em;font-size:90%">\n';
    var format_name = '';
    //Everything is contained in a dl
    html += '<dl>\n';
    //Add each entry
    if (arxiv_max_entries === 0) {
	    num_entries = feed.entries.length;
	    extra_entries = false;
    }
    else if (arxiv_max_entries >= feed.entries.length) {
	    num_entries = feed.entries.length;
	    extra_entries = false;
    }
    else {
	    num_entries = arxiv_max_entries;
	    extra_entries = true;
    }
    // First, collect entries with and without journal_ref
    var entriesWithJournalRef = [];
    var entriesWithoutJournalRef = [];
    for (x = 0; x < num_entries; x++) {
        if (feed.entries[x].journal_ref && feed.entries[x].journal_ref.length > 1) {
            entriesWithJournalRef.push(feed.entries[x]);
        } else {
            entriesWithoutJournalRef.push(feed.entries[x]);
        }
    }

    // Helper function to render an entry, given the entry and its display index
    function renderEntry(entry, displayIndex) {
        var html = '';
        html += '<dt>[P' + displayIndex + ']&nbsp\n';
        if (entry.journal_ref && entry.journal_ref.length > 1 && entry.doi && entry.doi.length > 0) {
            html += '\t<span class="list-identifier" style="font-size:large;font-weight:bold;margin:0.25em 0 0 0;line-height:120%"><a href="https://dx.doi.org/' + entry.doi + '" title="Journal" style="text-decoration:none;color:inherit;">' + entry.title + '</a>';
        } else {
            html += '\t<span class="list-identifier" style="font-size:large;font-weight:bold;margin:0.25em 0 0 0;line-height:120%"><a href="' + entry.id + '" title="Preprint" style="text-decoration:none;color:inherit;">' + entry.title + '</a>';
        }
        html += "</span>\n</dt>\n";
        html += '<dd style="padding-bottom:1em;">\n\t<div class="meta" style="line-height:130%;">\n';
        // Highlight "Carlos Payá" and link other authors to arXiv
        // Split authors by comma, trim, and process each
        var authorsList = entry.authors.split(',').map(function(name) { return name.trim(); });
        var authorsHtml = authorsList.map(function(name) {
            if (name === "Carlos Payá") {
            return '<b>Carlos Payá</b>';
            } else if (name.length > 0) {
            var encodedName = encodeURIComponent(name);
            return '<a href="https://arxiv.org/search/?query=' + encodedName + '&searchtype=author" target="_blank" title="Author\'s arXiv" style="text-decoration:none;color:inherit;font-weight:normal;">' + name + '</a>';
            } else {
            return '';
            }
        }).join(', ');
        html += '\t\t<div class="list-authors" style="font-weight:normal;font-size:100%;text-decoration:none;">' + authorsHtml + '</div>\n';
        // Add journal_ref if present and not disabled
        if (arxiv_includeJournalRef && entry.journal_ref && entry.journal_ref.length > 1) {
            html += '\t\t<div class="list-journal-ref" style="font-weight:normal;font-size:100%;color:#6A994E;text-decoration:none;">';
            if (entry.doi && entry.doi.length > 0) {
                html += '<a href="https://dx.doi.org/' + entry.doi + '" title="Journal" style="color:#6A994E;text-decoration:none;">' + entry.journal_ref + '</a>';
            } else {
                html += entry.journal_ref;
            }
            html += '</div>\n';
        }
        // Add arXiv code block with link to the abstract
        var absMatch = entry.id.match(/arxiv\.org\/abs\/([^\/\?#]+)/i);
        if (absMatch && absMatch[1]) {
            absMatch[1] = absMatch[1].replace(/v\d+$/, '');
        }
        if (absMatch && absMatch[1]) {
            // Extract year from entry.updated (format: "YYYY-MM-DD..." or ISO string)
            var year = '';
            if (entry.updated) {
            var match = entry.updated.match(/^(\d{4})/);
            if (match) {
                year = match[1];
            }
            }
            html += '\t\t<div class="list-arxiv-id" style="font-weight:normal;font-size:100%;">' +
            '<a href="' + entry.id + '" title="Preprint" style="text-decoration:none;color:#BC4749;">arXiv:' + absMatch[1] + (year ? ' (' + year + ')' : '') + '</a></div>\n';
        }
        // Add summary in a paragraph if requested
        // if (arxiv_includeSummary != 0) {
        //     html += '\t\t<p>' + entry.summary + '</p>\n';
        // }
        html += '\t</div>\n</dd>';
        return html;
    }

    // Render entries without journal_ref first
    html += '<div style="font-weight:bold; font-size:110%; margin-bottom:0.5em;">Preprints:</div>\n';
    for (x = 0; x < entriesWithoutJournalRef.length; x++) {
        html += renderEntry(entriesWithoutJournalRef[x], num_entries - x);
    }
    html += '<hr style="border:0; border-top:2px solid #F2F2F3; margin:1em 0;">\n';

    // Then render entries with journal_ref
    html += '<div style="font-weight:bold; font-size:110%; margin-top:1em; margin-bottom:0.5em;">Journals:</div>\n';
    for (var y = 0; y < entriesWithJournalRef.length; y++) {
        html += renderEntry(entriesWithJournalRef[y], num_entries - (entriesWithoutJournalRef.length + y));
    }
    html += '</dl>\n</div>\n'
    document.getElementById('arxivfeed').innerHTML=html;
}

