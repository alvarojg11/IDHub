# HistorID Direct Image Source Audit

Date: 2026-04-24

## Updated To Direct Sources

- `the-general-who-inoculated-an-army`
  - direct source: `https://www.clarkart.edu/ArtPiece/Detail/George-Washington`
  - institution: Clark Art Institute

- `the-hotel-outbreak-that-named-a-pathogen`
  - direct source: `https://www.cdc.gov/museum/online/story-of-cdc/legionnaires/index.html`
  - institution: CDC Museum / CDC

- `the-disease-that-changed-its-passport`
  - direct source: `https://www.loc.gov/pictures/item/98514501/`
  - institution: Library of Congress

- `when-disease-reached-the-inca-first`
  - direct source: `https://www.kb.dk/permalink/2006/poma/112/en/text/`
  - institution: Royal Danish Library

- `when-plague-taught-ports-to-wait`
  - direct source: `http://www.art-bin.com/art/medhistorypix/omedicalimages19.html`
  - source type: direct history-of-medicine image page

- `the-medical-student-who-became-the-experiment`
  - direct source recorded on Commons: `http://courret.perucultural.org.pe/muestraimagen.asp?imagen=10D4802&nitem=1&tipoimagen=P&numid=772099793`
  - source type: Archivo Courret / Peru Cultural
  - note: the archive URL was cited on the Commons record, but direct fetch from this environment failed

- `the-mold-that-went-to-war`
  - direct source: `https://web.archive.org/web/20210118164948/https://wellcomecollection.org/works/xkbnmutd`
  - institution: Wellcome Collection (archived record)

- `the-rsv-vaccine-that-went-wrong`
  - direct source: `https://www.flickr.com/photos/niaid/52456711008/`
  - institution: NIAID Flickr
  - note: browser-style fetch via shell returned page content; tool-based fetch returned 404

## Verified But Not Yet Migrated

- `the-map-that-rewired-epidemiology`
  - Commons record points to Wellcome source `https://wellcomeimages.org/indexplus/image/M0009238.html`
  - note: the direct Wellcome record resolves to a current Wellcome Collection entry, but its rights statement differs from the current Commons-based metadata and should be reconciled before swapping

- `the-man-who-made-the-canal-possible`
  - Commons record cites U.S. Army Center of Military History book source
  - note: the cited old CMH URL was not live from this environment; needs a current CMH/NLM/archive replacement

- `pasteurs-rabies-gamble`
  - Commons metadata suggests a Smithsonian Institution Libraries source for the Pasteur portrait
  - note: Smithsonian search/object endpoints were blocked from this environment, so no stable record URL was verified yet

- `the-antibiotic-that-opened-a-new-class`
  - Commons file is a self-made structural drawing rather than an institutional archive record
  - note: this one likely needs either a replacement hero image from an official chemistry source such as PubChem or a conscious decision to keep Commons for the structure art

- `when-consumption-looked-beautiful`
  - Commons file is a self-scanned page from *L'Illustration* rather than a linked institutional record
  - note: a Gallica/BnF or equivalent periodical archive record should be identified before replacing Commons

## Still Using Commons For Now

- `pasteurs-rabies-gamble`
- `the-antibiotic-that-opened-a-new-class`
- `the-map-that-rewired-epidemiology`
- `the-man-who-made-the-canal-possible`
- `when-consumption-looked-beautiful`

## Working Rule Going Forward

- Prefer direct archive/institution record pages for `heroImageSourceUrl`
- Treat Wikimedia Commons as a discovery layer and fallback, not the preferred published source
- Update `heroImageLicense` when source attribution changes so it matches the cited source
