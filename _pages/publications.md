---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
{% include base_path %}

You can also find my articles on [my Google Scholar profile](https://scholar.google.com/citations?user=hiK2lg4AAAAJ&hl=es).

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
