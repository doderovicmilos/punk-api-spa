# punk-api-spa

Punk api spa is a single page app built using VanillaJS.

It contains Home List and Details page.

List page shows list of beers who's details can be viewed by clicking on them.

Lists page size and page number can be altered via query params 'pageSize' and 'pageNumber' for now.

Error can be provoked by setting pageSize query param to 1000 or id parameter on details page to 500. 

Does not contain any css for now.

## Installation

```bash
git clone https://github.com/doderovicmilos/punk-api-spa.git
cd punk-api-spa
npm install
```

## Get started

```bash
npm run dev-server
```