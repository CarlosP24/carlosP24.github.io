---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
{% include base_path %}

## Preprints
<div id="arxivfeed"></div>
<script>
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

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
