CRM med mörkröd enkel UI och integrationsförberedelse.

Innehåll:
- mörkröd startsida inspirerad av enkel produkt/handels-layout
- leads, kunder, order, aktiviteter
- lokal lagring i browsern
- integrationssektion för Fortnox, Telavox och ABR
- API-routes för status och testanrop

API-routes:
- /api/integrations/fortnox/status
- /api/integrations/telavox/status
- /api/integrations/abr/status
- /api/integrations/fortnox/test
- /api/integrations/telavox/test
- /api/integrations/abr/test

Obs:
- Tokens sparas i browsern i denna enkla version.
- Vill du köra live-koppling senare kan vi flytta tokens till server-side miljövariabler.
