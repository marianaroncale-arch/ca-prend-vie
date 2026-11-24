# Protótipo AURORA — dashboard

Atividade em francês baseada no roteiro revisado do Acte I, telas 07–09. A tela 08 corresponde aos painéis de detalhe da tela 07, e não a um segundo dashboard. Os materiais anteriores do projeto não foram alterados.

## O papel de cada arquivo

- `index.html`: estrutura da página, janela de detalhe, área de hipótese e textos comuns. HTML define os elementos da atividade.
- `style.css`: cores, tamanhos, espaçamento e adaptação ao celular. CSS define a apresentação.
- `script.js`: cinco indicadores, três hipóteses, feedbacks, notas, contador e reinício. JavaScript define o comportamento.
- `README.md`: este guia, que você pode abrir no VS Code.

## Abrir no VS Code e testar com Live Server

1. Abra o VS Code.
2. Escolha **Arquivo → Abrir Pasta** (File → Open Folder).
3. Selecione **esta pasta `prototype-dashboard`**, dentro da pasta local do projeto. Codex e VS Code trabalham sobre os mesmos arquivos; não é necessário copiá-los.
4. Se aparecer a pergunta de confiança da pasta, confirme somente depois de conferir que é a pasta deste protótipo.
5. Abra Extensões e procure **Live Server**, de **Ritwick Dey**. Instale se ainda não estiver instalado.
6. Abra `index.html`, clique com o botão direito no editor e escolha **Open with Live Server**. Também pode aparecer **Go Live** na barra inferior.
7. O navegador abre um endereço local, normalmente `http://127.0.0.1:5500`. A porta pode variar. Esse endereço funciona no seu computador; ainda não é uma publicação na internet.
8. Para parar, use o controle do Live Server na barra inferior do VS Code.

Não é necessário instalar Node.js nem um framework para executar esta atividade. Como alternativa simples, abra `index.html` diretamente em um navegador moderno. O Live Server facilita a atualização durante a edição.

## Primeiro teste guiado

1. Confirme que o contador começa em 0/5 e a hipótese está bloqueada.
2. Abra um indicador: apenas abrir a janela não conta. Clique em **Voir le détail** para registrar a consulta.
3. Digite uma pergunta. Feche e reabra: a nota e o detalhe continuam disponíveis.
4. Reabra um detalhe já consultado: ele não deve contar duas vezes.
5. Consulte os cinco detalhes: o contador chega a 5/5 e libera **Formuler mon hypothèse**.
6. Escolha cada uma das três hipóteses para comparar seus feedbacks. Não há pontuação ou penalidade; o roteiro distingue o nível de apoio de cada interpretação.
7. Volte ao dashboard e depois à hipótese: sua última escolha permanece selecionada.
8. Clique em **Recommencer**: notas, escolha e progresso são apagados.
9. Teste também a navegação com Tab, Enter, Espaço e Escape para fechar a janela, e uma janela estreita de navegador.

## Uma primeira alteração para aprender

Em `style.css`, procure `--rust` e altere a cor do botão. Salve e observe o navegador. Depois peça ao Codex uma alteração específica e compare os arquivos modificados.

## Limites desta versão

- Tudo fica somente na memória da página. Recarregar, fechar ou reiniciar apaga as escolhas. Não há cookies, conta, banco de dados ou comunicação externa.
- As telas 06 e 10 pertencem ao percurso Genially. Esta versão termina após o feedback da hipótese e informa qual será a próxima etapa; não concede a carta e não inclui um botão de integração fictício.
- A integração com Genially, a publicação, o Git e o GitHub serão etapas seguintes. Um acesso externo ou uma incorporação pode abrir uma nova sessão, sem recuperar os dados anteriores.
- A interface não atribui um perfil nem interpreta os 12% de J+30 como prova causal de impacto. Nenhum número de respondentes foi inventado.


## Teste de memória e primeira carta (nova versão)

Esta seção substitui as descrições anteriores de memória temporária e de ausência de coleta. O protótipo agora guarda progresso no localStorage, quando disponível. A carta da tela 10 é apresentada em uma janela de teste dentro do código; a navegação do Genially não foi automatizada.

1. No perfil Joueur test A, consulte cinco detalhes, anote uma pergunta e escolha uma hipótese.
2. Clique em Découvrir mon repère e depois Ajouter à mon kit de transformation.
3. Confira 1/10 e uma entrada com data no histórico.
4. Recarregue a página Wix publicada, percorra novamente o Genially e abra Mon kit: a carta deve continuar lá. Confira o aviso de salvamento.
5. Recomece a atividade e conquiste novamente: a carta e a data original não devem se duplicar.
6. Troque para Joueur test B: a coleção deve estar vazia. Ao voltar ao A, confira sua coleção.
7. Effacer la progression apaga somente o perfil selecionado e pede confirmação. Recommencer l’activité conserva cartas e histórico.

Os perfis A e B são simulações locais, não identidades nem contas Wix. Outro dispositivo, navegador ou contexto de incorporação pode ter armazenamento separado. Não há banco de dados, painel administrativo ou sincronização. Em dispositivo compartilhado, os perfis não oferecem privacidade ou autenticação. Não use dados reais de alunos neste teste. Bloqueio de armazenamento gera um aviso e mantém a atividade funcional apenas em memória.

Publicação: registre as alterações e envie-as ao GitHub; só então a versão pública usada pelo Genially e Wix será atualizada. Testar no Live Server não atualiza o site publicado.
