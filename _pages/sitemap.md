---
layout: archive
title: "Sitemap"
permalink: /sitemap/
author_profile: true
---

{% include base_path %}

A list of all the posts and pages found on the site. For you robots out there is an [XML version]({{ base_path }}/sitemap.xml) available for digesting as well.

<h2>Pages</h2>
<ul>
{% for page in site.pages %}
  {% if page.title and page.title != "" and page.sitemap != false and page.url != "/_references/refs-josephson/" %}
    <li>
      <a href="{{ page.url }}">{{ page.title }}</a>
      {% if page.excerpt and page.excerpt != "" %}
        : {{ page.excerpt }}
      {% endif %}
    </li>
  {% endif %}
{% endfor %}
</ul>

<h2>References</h2>
<ul>
{% for ref in site.references %}
  {% if ref.title and ref.title != "" and ref.sitemap != false %}
    <li><a href="{{ ref.url }}">{{ ref.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>

<h2>Files</h2>
<ul>
{% assign files = site.static_files | where_exp: "file", "file.path contains '/files/'" %}
{% for file in files %}
  <li><a href="{{ file.path }}">{{ file.name }}</a></li>
{% endfor %}
</ul>