# SENAIgo — Frontend

React + Vite (JavaScript). Consome a API `projeto_senaigo` (Express + JWT).

## Rodando

```bash
npm install
npm run dev
```

O arquivo `.env` já vem com valores padrão (API em `http://localhost:3000`). Para recriá-lo: `cp .env.example .env`.
Atenção: variáveis `VITE_*` vão para o navegador — nunca coloque segredos (como o `JWT_SECRET`) aqui.

## Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `VITE_API_URL` | URL base da API |
| `VITE_API_TIMEOUT_MS` | Tempo máximo de resposta da API |
| `VITE_TOTAL_AREAS` | Total de áreas na barra de progresso |
| `VITE_SCAN_COOLDOWN_MS` | Tempo em que o mesmo QR Code é ignorado após a leitura |
| `VITE_DEV_PORT` / `VITE_DEV_HTTPS` / `VITE_DEV_PROXY_TARGET` | Só no desenvolvimento (veja abaixo) |

## Scanner de QR Code

- Usa a câmera (`getUserMedia`) + `jsQR`. Pede permissão ao abrir o scanner e trata permissão negada, câmera ausente/ocupada e navegador sem suporte.
- Os QR Codes das salas contêm `senaigo:sala:<salaId>` (ex.: `senaigo:sala:1`). Para gerar os PNGs: `npm run qrcodes` (saída em `qrcodes/`).
- Ao ler o QR Code da sala escolhida, o app chama `POST /registrarLocal`. O mesmo QR Code não é processado duas vezes em sequência.
- Novas salas: adicione em `src/constants/salas.js` (e o ícone em `src/constants/salaIcons.js`).

### Testando no celular

Navegadores só liberam a câmera em **HTTPS** (ou `localhost`). Para testar no celular pela rede local, no `.env`:

```
VITE_DEV_HTTPS=true
VITE_API_URL=/api
VITE_DEV_PROXY_TARGET=http://localhost:3000
```

Rode `npm run dev` e abra `https://<IP-do-seu-PC>:5173` no celular (aceite o aviso do certificado de desenvolvimento). O Vite encaminha `/api` para a sua API, sem problemas de CORS ou *mixed content*.

## Rotas da API usadas

| Tela | Método e rota |
|---|---|
| Login | `POST /auth/login` |
| Cadastro | `POST /cadastrarUsuario` |
| Registrar visita | `POST /registrarLocal` (Bearer token) |
| Progresso e pontos | `GET /locais` (filtrado pelo id do usuário) |

> Antes de usar, aplique os arquivos de `backend-ajustes.zip` na API (CORS, regra de visita duplicada, senha fora das respostas).

## Estrutura

```
src/
  components/   componentes reutilizáveis (Alert, Button, QrScanner, ...)
  config/       leitura das variáveis de ambiente
  constants/    catálogo de salas e ícones
  context/      AuthContext (sessão, visitas e pontos)
  hooks/        useAuth, useQrScanner
  pages/        Tutorial, Cadastro, Login, Home, Loja
  routes/       AppRoutes e PrivateRoute
  services/     httpClient, authService, visitasService
  utils/        masks, validators, qrCode, storage
scripts/        gerar-qrcodes.mjs
```
