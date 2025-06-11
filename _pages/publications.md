---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
{% include base_path %}

<script type="text/javascript">
 var xiv_authorid = "paya_c_1";
</script>
<script type="text/javascript" src="https://arxiv.org/js/myarticles.js">
## Preprints
<div id="arxivfeed"></div>


{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
