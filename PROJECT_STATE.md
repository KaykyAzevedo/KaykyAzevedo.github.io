# PROJECT_STATE — Portfólio Kayky Freitas de Azevedo

## Arquitetura
Site estático de uma página, sem build. Pensado para GitHub Pages (repo de usuário `KaykyAzevedo.github.io` → URL raiz).

## Stack
HTML + CSS + JavaScript puro. Fontes Google: Inter Tight, Instrument Serif, JetBrains Mono.

## Estrutura
- `index.html` — hero, marquee, 6 projetos, sobre, stack, contato
- `css/style.css` — design system (tokens em `:root`, acento `--accent` lima)
- `js/main.js` — campo de pontos (canvas), palavra que se reescreve, cursor/magnético, tilt, reveal, contadores, menu
- `assets/shots/*.webp` — capturas reais dos sites no ar (1280×800)

## Decisões importantes
- Projetos: Temp Rio, JJ's TCG, Union Veículos, Sophia Festas, Encarte Gerador, App RH (privado, sem link de código). `Gest-o-de-RH` ficou de fora (repo vazio).
- Encarte e App RH não têm site público: mockups feitos em HTML/CSS.
- Cada projeto tem cor própria via `--c` / `--c-soft` no `<article>`.
- Conteúdo só aparece escondido para animar quando JS está ativo (classe `js` no `<html>`).
- `og:image` aponta para `https://kaykyazevedo.github.io/` — ajustar se publicar em outro repo.

## Funcionalidades concluídas
Publicado em https://kaykyazevedo.github.io (repo KaykyAzevedo.github.io). Contato: e-mail, LinkedIn e GitHub. Site completo, responsivo (verificado 360/390/430/1440px sem overflow), revisado por QA; achados ALTO/MÉDIO corrigidos.

## Bugs conhecidos
Nenhum conhecido.

## Regras do projeto
Não inventar projetos/dados. Texto em 1ª pessoa e neutro em gênero. Separado do projeto Sophia Festas.

## Próximos passos
Ao criar projeto novo, recapturar tela e adicionar card.
