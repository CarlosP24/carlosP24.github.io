---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
{% include base_path %}


<script type="text/javascript">
  var headID = document.getElementsByTagName("head")[0];
  var newScript = document.createElement('script');
  var urlPrefix = 'https://arxiv.org/a/';
  var arxiv_authorid = "paya_c_1";
  newScript.type = 'text/javascript';

if (arxiv_authorid.indexOf(urlPrefix) === 0) {
	arxiv_authorid=arxiv_authorid.substr(urlPrefix.length, 50);
}
newScript.src = urlPrefix + arxiv_authorid + '.js';

headID.appendChild(newScript);

function htmlFix(html)
{
  var re = new RegExp('&apos;', 'g');
	html = html.replace(re,'&#39;');
	return html;
}


function jsonarXivFeed(feed)
{
	makearXiv(feed); 
}

function makearXiv(feed)
{
  var x = 0;
  var html = '<div id="arxivcontainer" style="font-family:Lucida Grande,helvetica, arial, verdana,sans-serif;margin:.7em;font-size:90%">\n';
  var format_name = '';

  html += '<h3 style="padding-bottom:2px; margin-bottom:3px;">' + htmlFix(feed.title) + '</h3>\n';
  html += '<dl>\n';
  num_entries = feed.entries.length;
  extra_entries = false;
  for (x=0; x<num_entries; x++){
    html += '<dt>['+(num_entries-x)+']&nbsp\n';
    html += '\t<span class="list-identifier" style="font-weight:bold"><a href="'+feed.entries[x].id+'" title="Abstract">'+feed.entries[x].id+'</a> [ ';
    for (format_name in feed.entries[x].formats) {
      if (feed.entries[x].formats.hasOwnProperty(format_name)) {
        var format_value = feed.entries[x].formats[format_name]
        html += '<a href="' + format_value +'" title="Download '+format_name+'">'+ format_name+'</a> ';
      }
    }
    html += "]</span>\n</dt>\n";  
    html+='<dd style="padding-bottom:1em;">\n\t<div class="meta" style="line-height:130%;">\n\t\t<div class="list-title" style="font-size:large;font-weight:bold;margin:0.25em 0 0 0;line-height:120%">\n'
    html += '\t\t\t'+ feed.entries[x].title+'\n\t\t</div>';
    html += '\t\t<div class="list-authors" style="font-weight:normal;font-size:110%;text-decoration:none;">'+feed.entries[x].authors+'</div>\n';
    if (feed.entries[x].journal_ref.length > 1){
      html += '\t\t<div class="list-journal-ref" style="font-weight:normal;font-size:90%;"><span class="descriptor">Journal ref:</span> ' + feed.entries[x].journal_ref + '</div>\n';
    }
    if (feed.entries[x].doi && feed.entries[x].doi.length > 0){
      html += '\t\t<div class="list-doi" style="font-weight:normal;font-size:90%;"><span class="descriptor">DOI:</span> ';
		    var dois = feed.entries[x].doi.split(' ');
		    for (var j in dois) {
		       html += '<a href="https://dx.doi.org/'+dois[j]+'">'+dois[j]+'</a> '; 
		    }
		    html += '</div>\n';
    }
    html += '\t</div>\n</dd>';
  }
  if (extra_entries) {
	    html +='<br /><span style="font-size:80%">[ Showing '+num_entries+' of '+feed.entries.length+' total entries, additional <a href="https://arxiv.org/a/'+arxiv_authorid+'">'+(feed.entries.length-num_entries)+'</a> entries available at arXiv.org ]</span>';
    } else {
	    html +='<br /><span style="font-size:80%">[ Showing '+num_entries+' of '+feed.entries.length+' total entries]</span>\n';
    }
    html += '<br /><span id="authorid_hook" style="font-size:80%; padding-left:0px">[ This list is powered by an <a href="https://arxiv.org/a/'+arxiv_authorid + '">arXiv author id</a> and the <a href="https://arxiv.org/help/myarticles">myarticles</a> widget ]</span>';
    html += '</dl>\n</div>\n'
    document.getElementById('arxivfeed').innerHTML=html;
}
</script>

## Preprints
<div id="arxivfeed"></div>


{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
