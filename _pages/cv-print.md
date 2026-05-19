---
layout: archive
title: ""
excerpt: "Printable Curriculum Vitae"
description: "Print-oriented CV page used to generate CV.pdf"
permalink: /cv-print/
author_profile: false
sitemap: false
---

{% include base_path %}

<div id="cv-pdf-root" class="cv-pdf-root">
  <div class="cv-pdf-header">
    <h1>Curriculum Vitae - Carlos Payá</h1>
    <p>
      {{ site.author.bio }}<br>
      {{ site.author.location }} · <a href="{{ site.author.employer_webpage }}">{{ site.author.employer }}</a><br>
      <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a> · <a href="https://carlosp24.github.io/">carlosp24.github.io</a>
      {% if site.author.orcid %} · <a href="{{ site.author.orcid }}">ORCID</a>{% endif %}
      {% if site.author.googlescholar %} · <a href="{{ site.author.googlescholar }}">Google Scholar</a>{% endif %}
    </p>
    <p class="cv-pdf-fullname"><strong>Full name:</strong> Carlos Payá Herrero</p>
  </div>

  <div class="pub-section-header">Profile</div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card cv-pdf-profile-card">
    <p class="paper-card__meta">
      I am a theoretical condensed matter physicist pursuing my PhD at the <a href="https://sites.google.com/view/qudyma-icmm">QUDYMA</a> and <a href="https://wp.icmm.csic.es/tqe/">Q4Q</a> groups at <a href="https://www.icmm.csic.es/">ICMM, CSIC</a>, in Madrid, under the supervision of <a href="https://elsaprada.github.io/">Elsa Prada</a> and <a href="https://wp.icmm.csic.es/tqe/people/ramon-aguado/">Ramón Aguado</a>.
    </p>
    <p class="paper-card__meta">
      My research focuses on one-dimensional hybrid semiconductor-superconductor systems, with particular emphasis on full-shell nanowires. I combine large-scale numerical simulations with analytical modelling to address open questions spanning topological superconductivity, transport phenomena, and the phase structure of these devices.
    </p>
    <p class="paper-card__meta">
      I collaborate closely with several experimental groups (see <a href="https://carlospaya.github.io/publications/">publications</a>) and carried out a research visit to <a href="https://nbi.ku.dk/english/research/condensed-matter-physics/condensed-matter-theory/">Karsten Flensberg's group</a> at the University of Copenhagen.
    </p>
  </div>

  <div class="pub-section-header">Education</div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="cv-pdf-headline"><span class="cv-pdf-entry-date">2023–present</span><span class="cvpdf-sep">&middot;</span><span class="cv-pdf-headline-title">PhD in Condensed Matter Physics</span></p>
    <p class="paper-card__authors">Universidad Autónoma de Madrid</p>
    <p class="paper-card__meta">Tentative completion: February 2027</p>
  </div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="cv-pdf-headline"><span class="cv-pdf-entry-date">2021–2022</span><span class="cvpdf-sep">&middot;</span><span class="cv-pdf-headline-title">MSc in Condensed Matter Physics</span></p>
    <p class="paper-card__authors">Universidad Autónoma de Madrid</p>
    <p class="paper-card__meta">MSc thesis: <a href="/files/TFM.pdf" target="_blank">Topological phase and Majorana zero modes in full-shell nanowires</a></p>
  </div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="cv-pdf-headline"><span class="cv-pdf-entry-date">2017–2021</span><span class="cvpdf-sep">&middot;</span><span class="cv-pdf-headline-title">BSc in Physics</span></p>
    <p class="paper-card__authors">Universidad Autónoma de Madrid</p>
    <p class="paper-card__meta">BSc thesis: <a href="/files/TFG.pdf" target="_blank">Josephson junctions between full-shell Majorana nanowires</a></p>
  </div>

  <div class="pub-section-header">Research positions</div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="cv-pdf-headline"><span class="cv-pdf-entry-date">2023–present</span><span class="cvpdf-sep">&middot;</span><span class="cv-pdf-headline-title">PhD Candidate</span></p>
    <p class="paper-card__title">Instituto de Ciencia de Materiales de Madrid (ICMM), CSIC</p>
    <p class="paper-card__authors">Supervisors: Elsa Prada and Ramón Aguado · Groups: QUDYMA and Q4Q</p>
    <p class="paper-card__sub-entry"><span class="cv-pdf-entry-date">Apr–Jul 2025</span><span class="cvpdf-sep">&middot;</span>Visiting PhD Candidate · Niels Bohr Institute, University of Copenhagen · Supervisor: Karsten Flensberg</p>
  </div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="cv-pdf-headline"><span class="cv-pdf-entry-date">2021–2022</span><span class="cvpdf-sep">&middot;</span><span class="cv-pdf-headline-title">Research Assistant</span></p>
    <p class="paper-card__title">Instituto de Ciencia de Materiales de Madrid (ICMM), CSIC</p>
    <p class="paper-card__authors">Supervisor: Elsa Prada</p>
  </div>

  <div class="pub-section-header">Teaching</div>

  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="cv-pdf-headline"><span class="cv-pdf-entry-date">2024–2025</span><span class="cvpdf-sep">&middot;</span><span class="cv-pdf-headline-title">BSc Thesis Co-supervision</span></p>
    <p class="paper-card__title">César Robles</p>
    <p class="paper-card__meta">Main supervisor: Elsa Prada</p>
    <p class="paper-card__meta"><em>Quasi-Majoranas in inhomogeneous full-shell hybrid nanowires</em></p>
  </div>

  <div class="pub-section-header">Publications</div>
  <div id="cvpdf-publications"></div>

  <div class="pub-section-header">Conference contributions</div>
  <div id="cvpdf-talks"></div>

  <div class="pub-section-header">Outreach events</div>
  <p class="cv-pdf-section-intro">Since 2023, I have been a member of the <a href="https://wp.icmm.csic.es/superconductividad/">Superconductivity Outreach Team</a> at ICMM, CSIC. The group is coordinated by María José Calderón and Leni Bascones, and we run regular talks and demonstrations for high-school students and the general public.</p>
  <div id="cvpdf-outreach"></div>

  <div class="pub-section-header">Funding</div>
  <div id="cvpdf-funding"></div>

  <div class="pub-section-header">Awards</div>
  <div id="cvpdf-awards"></div>

  <div class="pub-section-header">Skills</div>
  <div class="paper-card paper-card--cv cv-pdf-compact-card">
    <p class="paper-card__meta"><strong>Research methods:</strong> Analytical modelling, numerical simulation of quantum transport and hybrid superconducting devices, data analysis and visualization.</p>
    <p class="paper-card__meta"><strong>Programming:</strong> Python, Julia, Matlab, scientific scripting and reproducible computational workflows.</p>
    <p class="paper-card__meta"><strong>Scientific tools:</strong> Git/GitHub, LaTeX, Jupyter, Linux-based HPC environments.</p>
    <p class="paper-card__meta"><strong>Languages:</strong> Spanish (native), English (C1), French (C1).</p>
  </div>

  <p id="cvpdf-status" class="cv-pdf-status">Building printable CV from local data feeds...</p>
</div>

<script type="text/javascript" src="{{ '/assets/js/cv-pdf.js' | relative_url }}"></script>
