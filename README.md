# Cabala Dice (Owlbear Rodeo)

Extensão de rolagem para Owlbear Rodeo.

## URL correta para instalar no Owlbear

Use a URL **completa** do manifesto (CDN para evitar 404 em iframe do Owlbear):

- `https://murilomath.github.io/cabala-dice/manifest.json`

Manifesto alternativo (CDN):
- `https://cdn.jsdelivr.net/gh/murilomath/cabala-dice@main/manifest.json`

Se você usar só `murilomath.github.io` ou só a página inicial do repositório, o Owlbear não consegue localizar o `manifest.json` e retorna erro de carregamento.

## Publicação no GitHub Pages

Este repositório mantém os arquivos de build em `docs/` e também na raiz para compatibilidade com as duas configurações de Pages:

- Deploy pela pasta `docs/`
- Deploy pela raiz do branch

## Correção para erro 404 dentro da sala

Para evitar `404` no pop-up da extensão dentro da sala do Owlbear, o `manifest.json` agora usa URLs absolutas para `icon` e `action.popover`. Isso evita que o Owlbear tente resolver os caminhos relativos em uma rota interna da própria aplicação.

Se você já tinha a extensão instalada, remova e adicione novamente usando:

- `https://murilomath.github.io/cabala-dice/manifest.json`

## Ajuste de compatibilidade no popover

Se o Owlbear exibir o conteúdo HTML bruto dentro da janela da extensão, use a versão mais recente do manifesto.
Nesta versão, o `action.popover` aponta para o GitHub Pages (`murilomath.github.io`) para evitar problemas de renderização via CDN em alguns ambientes do Owlbear.


## Popover dedicado

Para evitar que o Owlbear abra a página `index.html` do site em vez da interface da extensão, o manifesto agora aponta para `popover.html`, um arquivo dedicado da UI da extensão.
