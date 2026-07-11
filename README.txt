Substitui apenas estes três ficheiros no projeto:

- server/waitlist.js
- api/waitlist.js
- vite.config.js

Depois reinicia `npm run dev`.

No Waitlister, adiciona à lista de Whitelisted Domains:
- localhost
- localhost:5173
- o domínio final da Vercel, por exemplo vaga.vercel.app
- o domínio próprio, quando existir

A variável local continua a ser:
WAITLIST_KEY=...
