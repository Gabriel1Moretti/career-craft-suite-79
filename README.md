# Career Match Pro

Prompt para Lovable — Plataforma de Matchmaking de Vagas e Currículos ATS

Crie um aplicativo web completo, moderno, responsivo e funcional do zero, focado em matchmaking entre candidatos e vagas de emprego, além da criação automática de versões do currículo otimizadas para ATS (Applicant Tracking Systems).

O projeto deve ser desenvolvido integralmente no Lovable, utilizando ShadCN UI como design system.

1. Objetivo principal

A plataforma deve permitir que qualquer usuário entre no site e utilize a aplicação imediatamente, sem necessidade de cadastro, login, senha ou autenticação.

O objetivo é permitir que o usuário:

Cadastre ou envie seu currículo.

Informe ou cole uma vaga de emprego.

Analise o nível de compatibilidade entre seu perfil e a vaga.

Identifique pontos fortes, pontos fracos e lacunas do currículo.

Gere uma nova versão do currículo personalizada para aquela vaga.

Gere um currículo otimizado para sistemas ATS.

Visualize o currículo antes de baixar.

Baixe o currículo final em formato ATS friendly.

A experiência deve ser extremamente simples, intuitiva e profissional.

2. Identidade visual

Utilize ShadCN UI como base de todos os componentes.

Paleta de cores

A interface deve utilizar predominantemente:

Verde claro como cor principal.

Branco como cor de fundo predominante.

Tons neutros suaves para textos, bordas e elementos secundários.

Verde mais escuro apenas para contraste, estados de sucesso e textos importantes.

Sugestão visual:

Primary: verde claro.

Background: branco.

Cards: branco.

Borders: cinza muito claro.

Text: cinza escuro.

Success: verde.

Warning: amarelo suave.

Error: vermelho suave.

A interface deve transmitir:

tecnologia + carreira + confiança + simplicidade + profissionalismo.

Evite aparência excessivamente corporativa ou pesada.

3. Estrutura da aplicação

Crie uma aplicação com navegação simples e poucas páginas.

Página principal

A página inicial deve funcionar como um dashboard central.

Estrutura:

Header

Criar um header minimalista com:

Logo/nome da plataforma.

Navegação:

Início

Meu currículo

Match com vagas

Currículos gerados

Não criar botão de login ou cadastro.

Adicionar apenas um botão principal como:

"Analisar uma vaga"

4. Hero Section

Na página inicial, criar uma seção de destaque explicando claramente o produto.

Título sugerido:

"Encontre vagas que combinam com você e adapte seu currículo para cada oportunidade."

Subtítulo:

"Compare seu currículo com uma vaga, descubra seu nível de compatibilidade e gere uma versão otimizada para ATS em poucos minutos."

Adicionar CTA:

"Começar agora"

Ao clicar, levar o usuário diretamente para o fluxo de análise.

5. Fluxo principal

O fluxo principal da aplicação deve funcionar como um processo guiado.

Criar um stepper visual:

1. Meu currículo → 2. Vaga → 3. Match → 4. Currículo ATS → 5. Download

Cada etapa deve mostrar claramente o progresso.

6. Etapa 1 — Meu currículo

Criar uma área onde o usuário possa fornecer seu currículo.

Permitir duas opções:

Upload

Aceitar:

PDF

DOCX

Criar área de drag & drop.

Texto:

"Arraste seu currículo aqui ou clique para selecionar um arquivo."

Inserção manual

Adicionar opção:

"Criar currículo manualmente"

Quando selecionada, abrir formulário dividido em seções:

Informações pessoais

Resumo profissional

Experiência profissional

Formação acadêmica

Habilidades

Idiomas

Certificações

Cursos

Projetos

Links profissionais

Permitir adicionar e remover experiências.

7. Etapa 2 — Inserção da vaga

Criar uma interface para inserir a oportunidade desejada.

Permitir:

Colar descrição da vaga

Textarea grande com placeholder:

"Cole aqui a descrição completa da vaga..."

Informações adicionais

Campos opcionais:

Empresa

Cargo

Localização

Senioridade

Modelo de trabalho

Adicionar botão:

"Analisar vaga"

8. Etapa 3 — Match entre currículo e vaga

Após analisar os dados, criar uma página visual de matchmaking.

Mostrar um score principal de compatibilidade.

Exemplo:

82%

Compatibilidade com a vaga

Criar um gráfico circular ou progress indicator utilizando ShadCN.

Dividir a análise em categorias:

Habilidades técnicas

Experiência profissional

Formação

Senioridade

Palavras-chave

Idiomas

Certificações

Cada categoria deve possuir:

Score

Status

Explicação

Exemplo:

Habilidades técnicas — 91%

"Seu currículo possui a maioria das tecnologias mencionadas na vaga."

9. Palavras-chave da vaga

Criar uma seção mostrando as principais palavras-chave detectadas.

Separar em:

Encontradas no currículo

Exemplo:

React

JavaScript

TypeScript

Git

APIs

Ausentes

Exemplo:

Next.js

Docker

AWS

Correspondência parcial

Exemplo:

Node.js

CI/CD

Utilizar badges do ShadCN.

10. Análise do currículo

Criar uma seção chamada:

"O que pode melhorar no seu currículo"

Mostrar recomendações como:

Adicionar palavras-chave específicas.

Melhorar descrição das experiências.

Quantificar resultados.

Remover informações pouco relevantes.

Melhorar resumo profissional.

Ajustar título profissional.

Cada recomendação deve apresentar:

Problema identificado.

Por que isso importa.

Sugestão de melhoria.

11. Geração de currículo personalizado

Criar um botão principal:

"Criar currículo para esta vaga"

Ao clicar, gerar automaticamente uma nova versão do currículo baseada na vaga.

O sistema deve:

Adaptar o resumo profissional.

Priorizar experiências relevantes.

Destacar habilidades relacionadas à vaga.

Reorganizar informações.

Incorporar palavras-chave relevantes.

Melhorar descrições das experiências.

Utilizar linguagem profissional.

Evitar inventar informações que não estejam presentes no currículo original.

IMPORTANTE:

Nunca inventar:

Experiências.

Empresas.

Tecnologias.

Certificações.

Resultados.

Formação acadêmica.

Cargos.

A IA deve apenas reorganizar, melhorar e adaptar informações verdadeiras fornecidas pelo usuário.

12. Otimização ATS

Criar uma área específica chamada:

"Otimização ATS"

Mostrar um checklist de boas práticas.

Exemplo:

✓ Estrutura simples
✓ Títulos de seção padronizados
✓ Palavras-chave relevantes
✓ Formatação compatível com ATS
✓ Sem tabelas complexas
✓ Sem elementos gráficos desnecessários
✓ Sem caixas de texto complexas
✓ Sem informações importantes dentro de imagens

Mostrar também um:

ATS Score

Exemplo:

94/100

Adicionar explicação do score e sugestões para melhorar.

13. Editor do currículo

Criar uma interface de edição do currículo gerado.

Layout:

Esquerda

Editor/formulário das informações.

Direita

Preview do currículo em tempo real.

O usuário deve poder editar:

Nome

Cargo

Contato

Resumo

Experiência

Formação

Habilidades

Idiomas

Certificações

Projetos

Alterações realizadas devem aparecer imediatamente no preview.

14. Design do currículo ATS

Criar templates extremamente simples e profissionais.

O template principal deve possuir:

Fundo branco.

Tipografia profissional.

Hierarquia clara.

Títulos simples.

Espaçamento consistente.

Sem gráficos.

Sem barras de habilidades.

Sem ícones excessivos.

Sem fotografias.

Sem elementos decorativos que possam prejudicar ATS.

O objetivo é garantir máxima legibilidade tanto para recrutadores quanto para sistemas ATS.

15. Download do currículo

Criar uma seção específica:

"Baixar currículo ATS"

Mostrar um card com:

Seu currículo está pronto.

Mostrar:

ATS Score

Número de páginas

Quantidade de palavras-chave encontradas

Compatibilidade com a vaga

Adicionar botão principal:

"Baixar currículo ATS em PDF"

Adicionar também:

"Baixar currículo em DOCX"

O PDF deve possuir estrutura limpa, profissional e adequada para ATS.

16. Currículos gerados

Criar uma área chamada:

"Meus currículos"

Como não existe login, os currículos podem ser mantidos durante a sessão atual no navegador/local storage.

Mostrar cards contendo:

Nome do cargo.

Empresa.

Data de criação.

Match Score.

ATS Score.

Botão "Abrir".

Botão "Baixar".

Botão "Excluir".

Exemplo:

Frontend Developer — Empresa XYZ

Match: 89%

ATS: 96%

17. Histórico de análises

Criar uma seção:

"Histórico"

Mostrar análises realizadas anteriormente durante a utilização da aplicação.

Cada item deve mostrar:

Cargo.

Empresa.

Match Score.

ATS Score.

Data.

Ação para visualizar novamente.

Persistir os dados no navegador utilizando localStorage enquanto não houver backend/autenticação.

18. UX/UI

A aplicação deve possuir UX extremamente simples.

Prioridades:

Clareza.

Rapidez.

Facilidade de uso.

Aparência profissional.

Feedback visual.

Utilizar componentes ShadCN como:

Button

Card

Input

Textarea

Badge

Progress

Tabs

Dialog

Dropdown Menu

Accordion

Tooltip

Alert

Separator

Scroll Area

Sheet

Select

Criar estados:

Loading

Success

Empty

Error

Adicionar skeleton loaders durante processamento de IA.

19. Responsividade

A aplicação deve funcionar perfeitamente em:

Desktop

Tablet

Mobile

No mobile, o editor do currículo deve mudar para um layout vertical:

Editor → Preview

O header deve possuir menu mobile.

20. Arquitetura

Criar código organizado e escalável.

Separar componentes por responsabilidade.

Estrutura sugerida:

src/
  components/
    layout/
    resume/
    jobs/
    matchmaking/
    ats/
    ui/

  pages/
    Home
    Resume
    JobMatch
    ATSResume
    History

  hooks/
  services/
  utils/
  types/


Utilizar TypeScript.

Manter componentes reutilizáveis.

21. Inteligência artificial

Estruturar o projeto para utilização de IA na análise.

A IA deverá receber:

Currículo

Dados estruturados do candidato.

Vaga

Descrição da vaga.

E retornar dados estruturados contendo:

{
  "matchScore": 0,
  "atsScore": 0,
  "skillsMatch": [],
  "missingSkills": [],
  "partialSkills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "keywords": [],
  "optimizedResume": {}
}


O sistema deve estar preparado para integrar posteriormente com uma API de IA.

Não deixar a lógica de IA espalhada pela interface.

Criar uma camada de serviço específica para isso.

22. Segurança e privacidade

Como não existe login, deixar claro para o usuário que os dados são utilizados apenas para a finalidade de gerar e analisar o currículo.

Não armazenar informações desnecessárias.

Não criar sistema de autenticação.

Não criar página de login.

Não criar cadastro.

Não exigir e-mail para utilizar o produto.

23. Landing page

A homepage deve também funcionar como uma landing page moderna.

Criar as seguintes seções:

Hero

Explicar o produto.

Como funciona

Mostrar 3 passos:

1. Envie seu currículo

2. Adicione a vaga

3. Gere seu currículo otimizado

Benefícios

Cards:

Match inteligente com vagas.

Currículos personalizados.

Otimização ATS.

Análise de palavras-chave.

Download rápido.

Sem necessidade de cadastro.

CTA final

Título:

"Prepare seu currículo para a próxima oportunidade."

Botão:

"Começar agora"

24. Regras importantes de produto

Não implementar autenticação.

Não criar onboarding obrigatório.

Não exigir cadastro.

O usuário deve conseguir chegar ao produto principal imediatamente.

Não utilizar designs complexos.

Não utilizar gradientes exagerados.

Não utilizar excesso de animações.

Priorizar acessibilidade.

Utilizar componentes semânticos.

Garantir bom contraste.

Utilizar estados de foco e hover.

25. Resultado esperado

Entregar uma aplicação completa, funcional e visualmente refinada, com aparência de um produto SaaS profissional.

O fluxo principal deve ser:

Entrar no site → adicionar currículo → adicionar vaga → analisar match → visualizar recomendações → gerar currículo personalizado → otimizar para ATS → editar → visualizar → baixar PDF/DOCX.

O produto deve transmitir a sensação de uma ferramenta moderna de carreira baseada em inteligência artificial, mas com interface simples e extremamente fácil de utilizar.

Use ShadCN UI em toda a interface, mantenha o design baseado em verde claro + branco, e garanta que todas as telas estejam visualmente consistentes.

Antes de finalizar, revise toda a aplicação para garantir que:

Não exista qualquer tela de login.

Não exista cadastro.

Todos os fluxos principais estejam navegáveis.

Os dados sejam preservados durante a sessão.

O currículo possa ser editado.

O currículo possa ser visualizado antes do download.

O currículo ATS possa ser baixado.

A interface seja responsiva.

Os componentes estejam consistentes com ShadCN.

O design seja limpo, moderno e profissional.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://career-craft-suite-79.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/24b3e11f-e21e-4687-9d21-76386fe1edd1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
