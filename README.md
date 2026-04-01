Södertörns Team CRM - nästa version

Innehåll:
- mörkröd landningssida
- logo stöd via public/sodertorns-team-logo.png
- leads, kunder, order, aktiviteter
- företagslookup med segmentering
- förberedelse för Fortnox-skicka-kund
- enkel AI-panel på landningssidan

API-routes:
- POST /api/company-lookup
- POST /api/fortnox/send-customer
- POST /api/ai-assistant

Viktigt:
- company-lookup använder lokal demo-logik nu
- Fortnox-routen är en säker mock som visar payload
- AI-routen är en lokal placeholder tills riktig OpenAI/Fortnox/Telavox kopplas in
