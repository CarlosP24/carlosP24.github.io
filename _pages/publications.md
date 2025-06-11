---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
{% include base_path %}

## Preprints
<div id="arxivfeed"></div>
<div id="arxivfeed"></div>
<script type="text/javascript">
fetch('https://arxiv.org/a/paya_c_1.json')
  .then(response => response.json())
  .then(data => {
    // Reverse the entries for reverse numbering
    const entries = data.entries.reverse();
    let html = '<ol reversed>';
    entries.forEach((entry, idx) => {
      html += `<li>
        <h3>${entry.title}</h3>
        <p><a href="${entry.id}">arXiv link</a></p>
        <p>${entry.summary}</p>
      </li>`;
    });
    html += '</ol>';
    document.getElementById('arxivfeed').innerHTML = html;
  });
</script>
<!-- <script type="text/javascript">
var arxiv_authorid = "paya_c_1";
var arxiv_format = "arxiv";
var arxiv_includeComments = 0;
var arxiv_includeSubjects = 0;
var arxiv_max_entries = 0;
</script>
<script type="text/javascript" src="https://arxiv.org/js/myarticles.js"></script>


{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
