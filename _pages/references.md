---
layout: archive
title: "References"
excerpt: "References used in posters and presentations"
permalink: /references/
author_profile: true
---

A list of all reference pages:

<ul>
{% for ref in site.references %}
  {% if ref.title and ref.title != "" and ref.sitemap != false %}
    <li><a href="{{ ref.url }}">{{ ref.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>