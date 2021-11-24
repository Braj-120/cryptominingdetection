###The Reporting Server containing the Dashboard for the module.
This needs to be hosted seperately than agent.

Contains API access to 
1. Authenticate agent - /api/authenticate
2. POST alerts - /api/alerts - requires bearer token from pervious api
3. GET alerts - /api/alerts - Supports sort - ```{sort : {"col": "asc/desc"}}``` and filter ```{filter:[{"col":"val"}]}``` format

Contains UI API for Dashboard.
Dashboard is accessible at http://<host>:<port>/ and access requires authentication.