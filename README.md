# LAM-OS — Portfólio de Lucas Andrade Martins

Portfólio pessoal com tema de **área de trabalho Linux + terminal hacker** (grafite e verde neon),
feito apenas com **HTML, CSS e JavaScript puros** — sem bibliotecas ou frameworks.

## Como abrir

**Opção 1 — direto do arquivo:** dê dois cliques em `index.html`.
Tudo funciona, mas alguns navegadores abrem o PDF em vez de baixá-lo quando a página é aberta como arquivo local.

**Opção 2 — servidor local (recomendado para testar como no site publicado):**

```bash
# dentro da pasta novo-portfolio
python -m http.server 5500
```

Depois acesse <http://localhost:5500>.

## Publicar no GitHub Pages

1. Envie o **conteúdo** desta pasta (o `index.html` precisa ficar na raiz do repositório).
2. No GitHub: *Settings → Pages → Deploy from a branch → main / (root)*.
3. O site fica em `https://<usuario>.github.io/<repositorio>/`.

Todos os caminhos são relativos, então funcionam em qualquer hospedagem estática.

## Estrutura

```
novo-portfolio/
├── index.html                  estrutura e conteúdo
├── README.md
└── assets/
    ├── css/style.css           identidade visual, temas, responsividade, animações
    ├── js/
    │   ├── tema.js             tema claro/escuro (salvo no navegador)
    │   ├── janelas.js          janelas/diálogos (abrir, fechar, Esc, clique fora)
    │   ├── painel.js           menu responsivo, relógio, seção ativa, ano do rodapé
    │   ├── digitacao.js        efeito de digitação + glitch no nome (toque)
    │   ├── revelar.js          animações ao rolar a página
    │   ├── chuva.js            chuva de código no fundo
    │   ├── projetos.js         pastas 3D + janela de detalhes dos projetos
    │   ├── formulario.js       validação, máscara de telefone, contador, confirmação
    │   └── terminal.js         terminal interativo
    ├── img/
    │   ├── foto-perfil.jpg     foto original (sem alterações; o recorte é feito no CSS)
    │   └── favicon.svg
    └── docs/
        └── Curriculo_Lucas_Andrade_Martins.pdf   currículo oficial (cópia idêntica)
```

## Como editar o conteúdo

| O que mudar | Onde |
|---|---|
| Textos das seções | `index.html` |
| Frases do efeito de digitação | `assets/js/digitacao.js` → `frases` |
| Projetos (pastas e janela de detalhes) | `index.html` (seção `#projetos`) **e** `assets/js/projetos.js` → `PROJETOS` |
| Comandos do terminal | `assets/js/terminal.js` → `COMANDOS` |
| Cores dos temas | `assets/css/style.css` → início do arquivo (tokens) |
| Trocar o currículo | substitua o PDF em `assets/docs/` mantendo o mesmo nome |

## Comandos do terminal

`help`, `whoami`, `sobre`, `habilidades`, `formacao`, `projetos`, `abrir <pasta>`, `contato`,
`curriculo` (baixa o PDF), `github`, `linkedin`, `whatsapp`, `ir <seção>`, `tema`, `ls`, `clear`, `sair`.
Tab completa comandos; ↑/↓ navega pelo histórico.

## Observações

- O formulário de contato é **simulado**: valida, mostra a confirmação, mas não envia a mensagem.
  Para envio real, é possível integrar um serviço gratuito como o Formspree.
- Se o sistema do visitante estiver com "reduzir movimento" ativado, os efeitos continuam, porém
  mais suaves, e a chuva de código aparece como uma imagem estática.
