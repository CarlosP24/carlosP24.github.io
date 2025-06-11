---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
{% include base_path %}

## Preprints
<div id="arxivfeed"></div>
<script type="text/javascript">
var arxiv_authorid = "paya_c_1";
var arxiv_format = "arxiv";
var arxiv_includeComments = 0;
</script>
<script type="text/javascript" src="https://arxiv.org/js/myarticles.js"></script>

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
