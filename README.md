# Vaga landing page v5

## Lista de espera

O formulário envia para `/api/waitlist`.

- Em produção, a rota é uma função serverless da Vercel.
- Em desenvolvimento, o `vite.config.js` disponibiliza a mesma rota, portanto `npm run dev` já não devolve 404.

Cria um ficheiro `.env.local` na raiz:

```env
WAITLIST_KEY=coloca_a_tua_chave_aqui
```

Na Vercel, cria a mesma variável em **Project Settings > Environment Variables**.

Não uses o prefixo `VITE_`, porque isso colocaria a chave no JavaScript público.

## Executar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Logótipos e fontes

- `public/vaga-logo.svg`: logótipo vetorial da Vaga.
- `public/cml-logo.svg`: conversão vetorial do EPS fornecido.
- O logótipo EMEL é carregado através do URL SVG fornecido e apresentado em máscara monocromática.

A secção de fontes inclui uma nota explícita de independência e ausência de afiliação institucional.
