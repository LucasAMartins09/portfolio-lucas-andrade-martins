# LAM-OS — Processo de criação

> Como o novo portfólio de **Lucas Andrade Martins** saiu de uma página simples para uma
> "área de trabalho Linux" com janelas de terminal hacker — da análise à última correção.

---

## Sumário

1. [Ponto de partida](#1-ponto-de-partida)
2. [Análise do portfólio anterior](#2-análise-do-portfólio-anterior)
3. [Levantamento de preferências](#3-levantamento-de-preferências)
4. [Pesquisa de referências](#4-pesquisa-de-referências)
5. [Conceito: LAM-OS](#5-conceito-lam-os)
6. [Identidade visual](#6-identidade-visual)
7. [Conteúdo](#7-conteúdo)
8. [Arquitetura do código](#8-arquitetura-do-código)
9. [Desenvolvimento, etapa por etapa](#9-desenvolvimento-etapa-por-etapa)
10. [Decisões técnicas](#10-decisões-técnicas)
11. [Testes](#11-testes)
12. [Problemas encontrados e correções](#12-problemas-encontrados-e-correções)
13. [Aprendizados](#13-aprendizados)

---

## 1. Ponto de partida

O projeto começou com um portfólio já funcional (HTML, CSS e JavaScript) e um **currículo novo em PDF**.
A meta não era recolorir a página existente, e sim criar um projeto com **identidade própria**,
mantendo todos os recursos que já funcionavam:

- alternância de tema claro/escuro salva no navegador;
- menu responsivo para celular;
- efeito de digitação com cursor piscando;
- animações de entrada durante a rolagem;
- cartões de projeto com inclinação 3D;
- formulário com validação, máscara de telefone e contador de caracteres;
- modal de confirmação;
- rolagem suave e feedback visual em botões e links.

A regra do processo foi simples: **nada de código antes de entender o que existia e o que se queria.**

---

## 2. Análise do portfólio anterior

Antes de qualquer decisão, os três arquivos (HTML, CSS e JS) foram lidos por completo para entender
como trabalhavam juntos. O diagnóstico:

| Recurso | Como estava | O que dava para melhorar |
|---|---|---|
| Tema | Salvo no `localStorage`, troca instantânea | Transição suave e evitar o "piscar" no tema errado ao carregar |
| Menu mobile | Apenas mostrava/escondia | Animação, ícone ☰ → ✕, `aria-expanded`, fechar com Esc |
| Rolagem | Evento `scroll` revelando a seção inteira | `IntersectionObserver` e entrada em sequência |
| Cartões 3D | Só com mouse | Brilho, profundidade e alternativa para toque |
| Formulário | Validação de e-mail fraca, erros só ao enviar | Validação ao sair do campo e mensagens específicas |
| Modal | Sem animação, sem Esc | Animação, Esc, foco controlado, rolagem travada |

Também apareceram problemas de **conteúdo**:

- o botão de download apontava para o **currículo antigo**;
- o site citava itens que não estavam no currículo novo, que precisaram ser confirmados;
- a foto era de um evento, em formato paisagem e com outras pessoas ao redor, então exigia um
  recorte bem fechado;
- o currículo trazia o endereço completo, o que levantou uma questão de privacidade.

---

## 3. Levantamento de preferências

Em vez de presumir gostos, o planejamento foi feito como uma **entrevista em 5 etapas**, com
alternativas e espaço para respostas abertas. Quando uma resposta mudava o rumo do projeto, vinham
perguntas complementares.

| Etapa | Tema | Decisão |
|---|---|---|
| 1 | Identidade visual | Vibe cibersegurança/terminal, **sem exagero**, com minimalismo; verde neon + grafite; escuro por padrão |
| 2 | Layout | Área de trabalho Linux; abertura centralizada; foto dentro de uma "janela"; barra flutuante |
| — | Complemento | Desktop **+ rolagem** (para manter os recursos de rolagem); painel superior estilo GNOME; janelas com **CRT leve** |
| 3 | Animações | Equilibradas; extras: chuva de código sutil, glitch no nome e terminal interativo; projetos como **pastas que abrem**; tema claro "papel de terminal" |
| 4 | Conteúdo | 3 projetos; manter cibersegurança, soft skills, robótica e MCC; seção própria de Formação; mostrar cidade, telefone e idade, mas **não** o endereço |
| 5 | Funcionalidades | Formulário simulado; currículo no painel e no terminal; GitHub, LinkedIn, WhatsApp e e-mail; impressão "criativo e técnico" |

Ao final, um **resumo da proposta** foi aprovado antes do desenvolvimento.

---

## 4. Pesquisa de referências

Dois portfólios serviram **apenas como inspiração**:

- um que simula uma **área de trabalho Linux**, com ícones e janelas de gerenciador de arquivos;
- um que simula um **monitor CRT verde** com sequência de inicialização e menu numerado.

Os dois são imersivos, quase uma simulação. Como o pedido era "sem exagerar", a decisão foi
**misturar**: a primeira tela é uma área de trabalho e o resto do site rola normalmente, com cada seção
em formato de janela.

Para não parecer cópia, o LAM-OS tem identidade própria: nada de roxo ou elementos de uma distribuição
específica, nada de tela de boot obrigatória, e uma paleta e uma tipografia escolhidas do zero.

---

## 5. Conceito: LAM-OS

**LAM** (Lucas Andrade Martins) + **OS** (sistema operacional). O site funciona como um sistema fictício:

```
┌─ painel superior ────────────────────────────────────────────┐
│ ● LAM-OS   ./sobre ./habilidades ./formacao ...   ☀  ⤓ cv  │
└──────────────────────────────────────────────────────────────┘
  [sobre.txt]            lucas@lam-os:~$ whoami
  [projetos/]          Lucas Andrade Martins
  [contato.sh]          > Técnico em Informática▌
  [terminal]          [Ver projetos] [>_ Abrir terminal]

┌─ ~/sobre — cat sobre.txt ────────────────────────────────────┐
│  (cada seção é uma janela que "abre" ao aparecer na tela)    │
└──────────────────────────────────────────────────────────────┘
```

- Os **ícones** da área de trabalho abrem janelas de prévia no estilo hacker.
- Os **projetos** são pastas; ao abrir uma, aparece o `README.md` do projeto.
- O **terminal** aceita comandos de verdade (`help`, `projetos`, `curriculo`...).
- O **rodapé** é uma barra de status do sistema.

---

## 6. Identidade visual

### Paleta

| Token | Escuro (padrão) | Claro ("papel de terminal") |
|---|---|---|
| Fundo | `#0a0d0c` | `#f2eee2` |
| Janela | `#101513` | `#fbf8ef` |
| Texto | `#d8e3dd` | `#1c2a21` |
| Destaque | `#3dff7a` (verde neon) | `#1f7a3f` (verde-escuro) |

O verde neon é usado com moderação (prompts, rótulos, botões principais), para que o visual
"hacker" não canse a leitura. No tema claro, o verde escurece e o brilho é removido, para manter o contraste.

### Tipografia

- **JetBrains Mono**: títulos, prompts, terminal e rótulos, a "voz" de código do site.
- **IBM Plex Sans**: textos longos, para garantir leitura confortável.

### Elementos

- Fundo com **grade de pontos** sutil.
- **Janelas** com barra de título (`~/secao — comando`) e três marcadores.
- **Efeito CRT leve** nas janelas de terminal: scanlines finas, vinheta e brilho no texto verde.
- **Chuva de código** bem fraca no fundo da área de trabalho.

---

## 7. Conteúdo

Regras seguidas na escrita:

- **O currículo oficial é a fonte principal.** Nada de experiências, certificados ou níveis de
  conhecimento inventados. Por isso não há barras de porcentagem nas habilidades.
- Itens que não estavam no currículo (cibersegurança, soft skills, MCC) **só entraram depois de confirmados**.
- **Privacidade:** o site mostra a cidade, mas não o endereço completo, que fica apenas no PDF.
- O PDF do currículo foi integrado **sem nenhuma alteração**, e a cópia foi conferida por checksum.

---

## 8. Arquitetura do código

### Por que HTML, CSS e JS puros?

- O projeto não precisa de framework, e cada recurso cabe em poucas linhas.
- O site abre com **dois cliques** no `index.html` e publica direto no GitHub Pages, sem etapa de build.
- O código fica fácil de ler e estudar.

### Por que vários arquivos JS e não módulos (`import`)?

Módulos ES não funcionam quando a página é aberta como arquivo local (`file://`). Por isso, cada
recurso virou um script comum com `defer`, isolado em uma função, e eles conversam por um objeto
compartilhado (`window.LAM`):

```
tema.js        → LAM.alternarTema()
janelas.js     → LAM.abrirJanela() / LAM.fecharJanela()
projetos.js    → LAM.projetos / LAM.abrirProjeto()
terminal.js    → usa os três acima
formulario.js  → usa LAM.abrirJanela() para o modal
```

### Organização do CSS

O `style.css` é dividido em 11 blocos numerados: tokens, base, componentes, painel, área de trabalho,
seções, rodapé, diálogos, animações, responsividade e movimento reduzido. As cores são todas
**variáveis CSS**, então trocar de tema é só trocar o atributo `data-tema` no `<html>`.

---

## 9. Desenvolvimento, etapa por etapa

1. **Estrutura de pastas** (`assets/css`, `js`, `img`, `docs`), com cópia da foto e do currículo.
2. **HTML semântico:** `header`, `nav`, `main`, `section` com `aria-labelledby`, `dialog` para
   as janelas, `dl` para os dados pessoais e link "Pular para o conteúdo".
3. **CSS:** tokens dos dois temas, componentes (botões, janelas, chips, pastas) e layout.
4. **JavaScript**, um recurso por arquivo: tema → janelas → painel → digitação → rolagem →
   chuva → projetos → formulário → terminal.
5. **Integração da foto e do PDF**, com os caminhos relativos conferidos.
6. **Testes em navegador** em quatro larguras de tela.
7. **Correções** e um novo ciclo de testes.

---

## 10. Decisões técnicas

### Tema sem "piscar"
Um pequeno script no `<head>` aplica o tema salvo **antes** de a página ser desenhada. A transição
suave só é ligada durante a troca (classe `trocando-tema`, por 500 ms), para não deixar o resto da
navegação mais lento.

### Janelas com `<dialog>` nativo
O elemento `<dialog>` com `showModal()` já oferece foco preso dentro da janela e tecla Esc. Por cima
disso foram adicionados:
- animação de abrir e fechar (o Esc foi interceptado para fechar **com** animação);
- fechar clicando no fundo escurecido;
- travar a rolagem da página e devolver o foco ao botão que abriu a janela.

### Recorte da foto sem editar a imagem
A foto original (1035×690, paisagem, com outras pessoas) **não foi alterada**. O recorte é feito no
CSS: a imagem é ampliada e posicionada por porcentagens dentro de uma moldura 350×450, mostrando só a
região do rosto.

### Chuva de código leve
- Desenhada em `<canvas>` a cerca de 14 quadros por segundo.
- Os rastros usam `destination-out`, que apaga aos poucos e funciona sobre qualquer cor de fundo,
  por isso serve aos dois temas.
- Pausa quando sai da tela ou quando a aba fica oculta.

### Inclinação 3D eficiente
- O movimento do mouse é processado no máximo uma vez por quadro (`requestAnimationFrame`).
- O ângulo vai para variáveis CSS (`--rx`, `--ry`), e o brilho segue o cursor (`--gx`, `--gy`).
- Em telas de toque não há inclinação, só um leve "pressionar".

### Formulário
- A máscara aceita **fixo** `(00) 0000-0000` e **celular** `(00) 00000-0000`.
- Cada campo tem regras com mensagens diferentes para vazio, incompleto ou formato errado.
- A validação acontece ao sair do campo e, depois disso, a cada tecla.

### Terminal interativo
Os comandos ficam em um objeto (`COMANDOS`), fácil de ampliar. Tudo o que o visitante digita é
inserido como **texto puro** (`textContent`), nunca como HTML, o que impede injeção de código.

### Acessibilidade
- Navegação completa pelo teclado, com foco visível.
- `aria-expanded` no menu e `aria-invalid`/`aria-describedby` no formulário.
- Respeito à preferência "reduzir movimento" do sistema (detalhes na seção 12).

---

## 11. Testes

Os testes foram feitos em navegador, combinando scripts automatizados e revisão visual.

| Área | O que foi verificado |
|---|---|
| Telas | 1280px, 768px, 375px e 360px, sem rolagem horizontal |
| Links | Todas as âncoras internas existem; links externos com `noopener` |
| Currículo | PDF responde corretamente e é idêntico ao original (checksum) |
| Foto | Carrega e o recorte mostra o rosto |
| Tema | Alterna, salva e mantém a escolha após recarregar |
| Menu | Abre com animação; fecha ao escolher seção, ao clicar fora e com Esc |
| Digitação | Escreve, apaga e troca as frases |
| Rolagem | Elementos aparecem em sequência |
| Pastas 3D | Inclinam com o mouse e voltam à posição original |
| Formulário | Erros específicos para cada caso, máscara, contador, botão "Enviando" e modal |
| Janelas | Abrem e fecham pelo ×, por Esc, clicando fora e pelos links internos |
| Terminal | Todos os comandos, Tab, histórico e teste de injeção de HTML |
| Console | Sem erros |
| Código | Sem IDs duplicados e sem referências ao currículo antigo |

---

## 12. Problemas encontrados e correções

| Problema | Causa | Correção |
|---|---|---|
| Nome ficava tingido de ciano depois do glitch | A opacidade das camadas do efeito continuava ativa após a animação | A opacidade passou a existir só dentro da animação |
| "LAM -OS" com um espaço estranho | O `gap` do flexbox separava os dois trechos de texto | O espaçamento passou a ser só a margem do indicador |
| Foto cortando o topo do cabelo | Recorte vertical apertado | Moldura deslocada para mostrar mais acima |
| `help` do terminal ilegível no celular | Colunas alinhadas quebravam em telas estreitas | Formato compacto em telas pequenas e descrições mais curtas |
| **Efeitos sumiam em alguns computadores** | Com "reduzir movimento" ativo no sistema, o CSS desligava quase todas as animações, incluindo os efeitos obrigatórios | Os efeitos continuam em versão mais suave (fade, inclinação de 4°) e a chuva vira um quadro estático |
| Chuva estática forte demais | Caracteres com opacidade máxima | Intensidade reduzida pela metade |
| Requisição de `favicon.ico` com erro 404 | Ícone embutido como texto no HTML | Ícone movido para um arquivo `favicon.svg` |

---

## 13. Aprendizados

- **Perguntar antes de codar economiza retrabalho.** A ideia do "desktop Linux" só apareceu na
  entrevista e mudou todo o layout.
- **Testar em condições reais revela o inesperado.** A configuração de acessibilidade do sistema
  quase escondeu os principais efeitos do site.
- **Acessibilidade e efeitos podem conviver.** Em vez de desligar tudo, a solução foi suavizar.
- **Conteúdo honesto vale mais que conteúdo bonito.** Tudo no site está documentado no currículo
  ou foi confirmado.

---

<sub>Desenvolvido com HTML, CSS e JavaScript puros, com apoio do Claude Code (IA) no planejamento, na
implementação e nos testes.</sub>

