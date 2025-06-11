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
var arxiv_includeSubjects = 0;
var arxiv_max_entries = 0;
</script>
<script type="text/javascript" src="https://arxiv.org/js/myarticles.js"></script>

<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
  // Wait a bit for the widget to populate (since it loads asynchronously)
  setTimeout(function() {
    // Find the arxivfeed container
    var container = document.getElementById("arxivfeed");
    if (!container) return;

    // Find all numbered entries (adjust selector as needed for your widget format)
    var entries = container.querySelectorAll(".arxiv-entry, li, .arxivfeed-entry");
    var total = entries.length;

    // Assign reversed numbers
    entries.forEach(function(entry, idx) {
      // Find the number element (adjust as needed)
      var numberElem = entry.querySelector(".arxiv-number");
      if (numberElem) {
        numberElem.textContent = (total - idx) + ".";
      }
      // If the number is just text at the start, you may need to manipulate entry.innerHTML
    });
  }, 1000); // Adjust delay if needed
});
</script>

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

## Other publications

{% for post in site.other reversed %}
  {% include archive-single.html %}
{% endfor %}
