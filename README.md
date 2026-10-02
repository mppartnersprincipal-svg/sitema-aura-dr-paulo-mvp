# AURA · Canal de Denúncias — MVP de demonstração

Versão navegável para apresentar ao Dr. Paulo. **Não há banco de dados**: tudo fica salvo no
`localStorage` do navegador, com empresas e denúncias fictícias já carregadas.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

## Acessos de demonstração

| Onde | Acesso |
|---|---|
| Painel admin (`/admin/login`) | `paulo@auracanal.com.br` / `aura2026` (há botão "Preencher automaticamente") |
| Acompanhar denúncia (`/denuncia/acompanhar`) | protocolo `AURA-2026-H4R7KM` / senha `aurademo26` (vale para todas as denúncias de exemplo) |

No painel, **"Restaurar demonstração"** (menu lateral) volta aos dados iniciais.

## Roteiro sugerido para a reunião (≈10 min)

1. **Home (`/`)**: proposta de valor e comparação "canal caseiro × AURA".
2. **Fazer denúncia**: aviso LGPD → empresa (logo) → tipo (ícones grandes) → relato → provas → envio.
   Mostrar o protocolo e a senha, o "Baixar comprovante" e o aviso de que nada é enviado por e-mail.
3. **Acompanhar**: entrar com o protocolo e a senha recém-gerados e ver a linha do tempo.
4. **Painel admin**: abrir em outra aba. A denúncia nova já aparece, com o alerta de WhatsApp (sino).
5. **Detalhe da denúncia**: avançar etapa (observação pública × interna), prorrogar prazo, concluir com parecer.
6. **PDF do procedimento**: botão "Baixar PDF" → Imprimir / Salvar PDF.
7. **Empresa**: link exclusivo + QR Code, **cartaz para imprimir**, **emitir Certidão de Implementação**,
   "Exportar procedimentos" (dossiê para requisição judicial).
8. **QR Code no celular**: `/denuncia?empresa=supermercados-bom-preco` já abre com a empresa escolhida.

## O que é simulado nesta versão

| Na demo | Na versão de produção (PRD) |
|---|---|
| Dados no `localStorage` | Supabase (Postgres + RLS + Storage) |
| Hash SHA-256 no navegador | argon2id no servidor |
| Login admin fixo | Supabase Auth |
| Verificação anti-robô simulada | Cloudflare Turnstile |
| Limite de 5 tentativas/hora por aba | Rate limit no servidor |
| Alertas de WhatsApp na tela | WAHA / Z-API |
| PDF via impressão do navegador | PDF gerado e arquivado por 5 anos |
| Anexos: só imagens pequenas têm prévia | Upload direto ao Storage, remoção de metadados |

Dados provisórios (CNPJ do canal, OAB, WhatsApp) ficam em `lib/config.ts`.
