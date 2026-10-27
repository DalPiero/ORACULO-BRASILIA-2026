# ORÁCULO DE BRASÍLIA — 2026

## Execução no Render

Publique este repositório como **Web Service Node** (não Static Site). Use o arquivo render.yaml (Blueprint) ou configure manualmente `npm install --omit=dev` e `npm start`.

- `DATABASE_URL`: Internal Database URL do PostgreSQL já usado pelo RASTRO, mantida **somente** no ambiente privado do novo serviço. O Oráculo usa suas próprias tabelas `oraculo_passes_33d` e `oraculo_queries_33d`; nenhuma tabela RASTRO é alterada.
- `OPENAI_API_KEY`: configure no Render sem publicá-la no GitHub ou em HTML. Preferir uma chave de projeto específica para o Oráculo, dentro da mesma conta OpenAI.
- `ORACULO_ADMIN_TOKEN`: credencial aleatória com pelo menos 24 caracteres, independente da chave administrativa do RASTRO.
- `ORACULO_MODEL`: padrão `gpt-4.1-mini`; pesquisa utiliza Responses API com ferramenta web_search.
- `ORACULO_MAX_QUERIES`: padrão 100 consultas por acesso, teto de segurança para custos da API.

## Cobrança

R$ 30,00 por 33 dias corridos contados da emissão; pagamento na **mesma instituição bancária já utilizada pelo RASTRO**. Este pacote **não processa Pix, cartão nem reconciliação bancária automática**, e não armazena dados bancários. O administrador confere o recebimento no banco, insere e-mail e referência única do pagamento e emite um código de acesso pelo painel privado na página. O código deve ser enviado por canal privado. Sem integração financeira oficial não se deve anunciar pagamentos como confirmados automaticamente.

## Testes seguros

1. Abra `/api/health`; confirme `database: true` e `aiConfigured: true`.
2. Após confirmar um pagamento real ou de teste administrativamente, emita um acesso; verifique o prazo de 33 dias em `/api/access`.
3. Teste pesquisa breve no painel, confira fontes e o desconto de uma consulta do limite.
4. Testes reais de pesquisa web podem consumir créditos da API.

**Atenção:** não há publicação automática neste pacote. Nenhum valor é cobrado, nenhuma chave é criada, e nenhum serviço Render é contratado por sua geração.


## Pedidos de pagamento
O cliente pode informar e-mail e referência da transação; o pedido fica **pendente**. Somente o administrador, após verificar o recebimento na instituição bancária, emite um código de 33 dias. Isso não equivale a um sistema de pagamentos online automático; não inclua QR PIX sem dados reais autorizados. Evite expor segredos no frontend.

## Segurança e limitações
A conta OpenAI deve usar uma chave de projeto própria, com limites de gasto. O acesso concede até 100 pesquisas; reinícios de requisições falhadas ainda podem consumir cota. Requer revisão de termos/LGPD e teste operacional antes de venda pública.

## Acesso promocional gratuito — 10 consultas
- Cadastro simplificado em `#oraculo-gratis`: nome, e-mail, aceite específico da Política de Privacidade; sem pagamento.
- O PostgreSQL mantém limite **permanente de 10 consultas por e-mail e dispositivo**, com limitação complementar de até três inscrições por IP/dia, sem impedir automaticamente famílias ou escolas que compartilham um IP. O vínculo com navegador é um controle de abuso, não prova de identidade nem promessa absoluta de não transferência.
- O dispositivo usa um identificador aleatório guardado localmente, do qual só o hash é salvo no banco. `ORACULO_FREE_SALT` (segredo de pelo menos 24 caracteres) deve ser configurado em Render. Fallback provisório: `ORACULO_ADMIN_TOKEN`. Não coloque nenhum deles no frontend.
- Após cadastro, clicar em “Investigar com fontes”; a API debita uma consulta quando aceita a pesquisa. Falhas da API podem consumir consulta; revisar futura reconciliação antes de produção.
- A segunda inscrição, **opcional e independente**, serve para manifestar interesse em bônus futuros e pode ser cancelada na página; **não cria, promete ou garante prêmios**. Para mensagens reais, providenciar duplo opt-in por e-mail e descadastro por link autenticado.
- Transparência/LGPD: publicar política de privacidade e política de retenção, explicar finalidade e bases legais, fornecer meios para acesso/correção/exclusão e limitar a coleta ao necessário antes de lançamento público.
- A cobrança de R$30/33 dias permanece separada e inalterada, sujeita a confirmação manual. Publique como Web Service Node no Render, não Static Site. Preserve o RASTRO em outro serviço.


## Seleção de idiomas
O Oráculo oferece um seletor de 15 idiomas com tradução **externa e opcional** da página pública. Não traduz automaticamente consultas privadas nem dados enviados ao backend. O botão informa quando a tradução externa será usada. Arquivo: `public/oraculo-idiomas.js`.
