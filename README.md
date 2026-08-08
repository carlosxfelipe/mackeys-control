# MacKeys Control - Deno Desktop

![MacKeys Control Preview](./preview/preview.png)

O MacKeys Control é um utilitário desenvolvido para replicar de forma contínua a
experiência do teclado do macOS no Linux. Ele foi criado a partir da necessidade de usar um
teclado Logitech K380s em ambos os sistemas operacionais, mantendo exatamente a mesma memória 
muscular, atalhos (como trocar Ctrl/Command ou usar Cmd+Q) e comportamentos de layout 
em ambientes macOS e Linux.

## Requisitos

- [Deno](https://deno.land/) instalado em seu sistema.
- [Extensão do Deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
  para o VS Code (recomendado).

## Desenvolvimento

```sh
deno task dev
```

## Build

Para compilar a aplicação e gerar um arquivo `.AppImage` autônomo para 
distribuição no Linux, execute:

```sh
deno task build
```

Este único comando irá:

1. Compilar nativamente a aplicação Deno.
2. Empacotar os ícones necessários.
3. Gerar um `MacKeysControl-v1.0.0-x86_64.AppImage` (com a versão atual)
   no diretório raiz.

Você pode então executar o AppImage diretamente ou executar o binário puro dentro da
pasta `MacKeysControl/` para testes.

## Formatação de Código

Este projeto usa o formatador integrado do Deno. Para garantir um estilo de código consistente
em todo o projeto, execute:

```sh
deno fmt
```

As regras de formatação e exclusões de arquivos são gerenciadas no [`deno.json`](./deno.json).

### Configuração no VS Code

Se você usa o VS Code e tem a extensão **Prettier** instalada, ela pode
entrar em conflito com o formatador do Deno. Para usar o formatador do Deno automaticamente ao salvar,
adicione o seguinte ao seu arquivo `.vscode/settings.json`:

```json
"[typescript]": {
  "editor.defaultFormatter": "denoland.vscode-deno"
},
"[typescriptreact]": {
  "editor.defaultFormatter": "denoland.vscode-deno"
}
```

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE)
para mais detalhes.
