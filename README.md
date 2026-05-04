# NAS — Neonatal Abstinence Syndrome Dashboard (Texas)

An interactive public health dashboard visualizing **Neonatal Abstinence Syndrome (NAS)** and **Prenatal Drug Exposure (PND)** rates across Texas counties, built for UT Health researchers and public health practitioners.

## Overview

NAS occurs when a newborn experiences opioid withdrawal after in-utero drug exposure. This dashboard lets users explore county-level NAS and PND data across Texas, see 15-year statewide trend lines, and compare geographic variation. It is part of the broader [Texas Health Maps](https://github.com/karimifar/texashealthmaps) portfolio and is powered by the [TXHealth API](https://github.com/karimifar/TXhealth-api-uts).

## Features

- **Texas county choropleth map** — D3.js GeoJSON map with county-level NAS/PND rates
- **County and ZIP code search** — autocomplete lookup (`assets/js/autocomplete.js`)
- **Statewide trend charts** — 15-year trend lines for both NAS and PND rates
- **GSAP animations** — smooth transitions between map states and panels (`TweenMax`, `TimelineMax`)
- **Drag interaction** — D3-based draggable UI elements

## Tech Stack

- **D3.js** — choropleth map rendering and trend charts
- **GSAP / TweenMax / TimelineMax** — animation sequencing
- **GeoJSON** — Texas county boundary data (`assets/geojsons/counties.json`)
- **texashealthdata.com API** — county- and ZIP-level NAS data
- **Vanilla JavaScript / jQuery** — interactions and data fetching

## Data

Trend data spans 15 years of Texas statewide NAS and prenatal drug exposure rates. County-level data is served from the shared TXHealth MySQL database.

## Running Locally

```bash
npx serve .
```

The app calls the live `texashealthdata.com` API — no local database setup required for the front end.
