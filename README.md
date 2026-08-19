# JobMatch ATS

Uma plataforma web inteligente para **comparar currículos com vagas de emprego**, identificar o nível de compatibilidade e **gerar currículos personalizados e otimizados para sistemas ATS**.

O projeto foi pensado para proporcionar uma experiência simples: o usuário entra, adiciona seu currículo, informa uma vaga e recebe uma análise completa, recomendações e uma nova versão do currículo pronta para candidatura.

---

## 🚀 Sobre o projeto

O **JobMatch ATS** combina análise de vagas, avaliação de compatibilidade e otimização de currículos em uma única plataforma.

A aplicação permite:

* 📄 Enviar ou criar um currículo.
* 💼 Inserir uma vaga de emprego.
* 🎯 Calcular o nível de compatibilidade entre candidato e vaga.
* 🔎 Identificar palavras-chave importantes.
* 📊 Analisar pontos fortes e lacunas do perfil.
* 🤖 Gerar uma versão personalizada do currículo.
* ✅ Otimizar o currículo para ATS.
* ✏️ Editar o currículo gerado.
* 👀 Visualizar o currículo antes do download.
* 📥 Baixar o currículo em PDF ou DOCX.
* 🕐 Manter histórico das análises durante a sessão.

O sistema **não possui login ou cadastro**. O usuário pode utilizar a aplicação imediatamente.

---

# 🎯 Objetivo

O objetivo do projeto é ajudar candidatos a aumentarem a qualidade de suas candidaturas, adaptando o currículo às necessidades específicas de cada vaga.

Em vez de utilizar o mesmo currículo para todas as oportunidades, o usuário pode analisar cada vaga e gerar uma versão específica, mantendo apenas informações verdadeiras do seu histórico profissional.

> **Importante:** o sistema não deve inventar experiências, tecnologias, empresas, certificações, cargos ou resultados que não tenham sido fornecidos pelo usuário.

---

# ✨ Principais funcionalidades

## Match com vagas

A plataforma compara o currículo do usuário com a descrição da vaga e gera um **Match Score**.

A análise considera fatores como:

* Habilidades técnicas.
* Experiência profissional.
* Formação acadêmica.
* Senioridade.
* Palavras-chave.
* Idiomas.
* Certificações.

Exemplo:

```text
Match Score
89%

Habilidades técnicas     94%
Experiência              91%
Palavras-chave           86%
Senioridade              95%
Formação                 82%
```

---

## 🔑 Análise de palavras-chave

A plataforma identifica termos importantes da vaga e verifica sua presença no currículo.

As palavras-chave são classificadas como:

* Encontradas.
* Ausentes.
* Correspondência parcial.

Exemplo:

```text
Encontradas
React
TypeScript
JavaScript

Ausentes
Docker
AWS

Correspondência parcial
Node.js
CI/CD
```

---

## 🤖 Geração de currículo personalizado

Com base na vaga analisada, o sistema pode gerar uma nova versão do currículo.

A IA pode:

* Reescrever o resumo profissional.
* Priorizar experiências relevantes.
* Destacar habilidades relacionadas à vaga.
* Reorganizar informações.
* Melhorar descrições profissionais.
* Incorporar palavras-chave relevantes.
* Tornar o conteúdo mais objetivo.

Sempre preservando a veracidade das informações fornecidas pelo candidato.

---

## ✅ Otimização ATS

O currículo gerado passa por uma análise específica para sistemas ATS.

A plataforma verifica aspectos como:

* Estrutura do documento.
* Hierarquia das informações.
* Palavras-chave.
* Clareza das seções.
* Formatação.
* Legibilidade.
* Uso de elementos potencialmente incompatíveis com ATS.

Exemplo:

```text
ATS Score
96/100

✓ Estrutura compatível
✓ Palavras-chave relevantes
✓ Seções padronizadas
✓ Formatação simples
✓ Boa legibilidade
```

---

## ✏️ Editor de currículo

O usuário pode editar o currículo gerado antes de realizar o download.

O editor permite alterar:

* Informações pessoais.
* Título profissional.
* Resumo.
* Experiência profissional.
* Formação.
* Habilidades.
* Idiomas.
* Certificações.
* Projetos.

O preview do currículo é atualizado em tempo real.

---

## 📥 Download

O currículo final pode ser exportado em:

* PDF ATS Friendly.
* DOCX.

O documento utiliza uma estrutura simples e profissional, evitando elementos que possam prejudicar sua leitura por sistemas de recrutamento.

---

# 🎨 Design System

O projeto utiliza **ShadCN UI** como design system.

A interface foi projetada para ser:

* Moderna.
* Minimalista.
* Profissional.
* Responsiva.
* Acessível.
* Fácil de utilizar.

### Paleta

A identidade visual utiliza principalmente:

* 🟢 Verde claro.
* ⚪ Branco.
* Cinza neutro para textos e elementos secundários.
* Verde escuro para contrastes e estados de sucesso.

A interface deve transmitir:

**Tecnologia + Carreira + Confiança + Simplicidade**

---

# 🧭 Fluxo da aplicação

O fluxo principal do usuário é:

```text
Entrar no site
      ↓
Adicionar currículo
      ↓
Adicionar vaga
      ↓
Analisar compatibilidade
      ↓
Visualizar Match Score
      ↓
Ver palavras-chave e recomendações
      ↓
Gerar currículo personalizado
      ↓
Otimizar para ATS
      ↓
Editar currículo
      ↓
Visualizar preview
      ↓
Baixar PDF / DOCX
```

---

# 🖥️ Estrutura da aplicação

A aplicação possui as principais áreas:

```text
Home
│
├── Meu currículo
│
├── Match com vagas
│
├── Currículo ATS
│
└── Histórico
```

### Home

Página inicial e principal ponto de entrada da aplicação.

### Meu currículo

Área para upload ou criação manual do currículo.

### Match com vagas

Área para inserir uma vaga e visualizar a análise de compatibilidade.

### Currículo ATS

Editor e visualização do currículo personalizado.

### Histórico

Lista de análises e currículos gerados durante a utilização.

---

# 🛠️ Tecnologias

O projeto foi pensado para ser desenvolvido utilizando:

* **Lovable**
* **React**
* **TypeScript**
* **ShadCN UI**
* **Tailwind CSS**
* **Vite**
* **Lucide Icons**
* **Local Storage**

A arquitetura deve permanecer preparada para integração com serviços externos de IA.

---

# 🤖 Integração com IA

A camada de inteligência artificial deve ser isolada da interface para facilitar futuras alterações de fornecedor ou modelo.

Estrutura conceitual:

```text
Frontend
   ↓
AI Service
   ↓
LLM / API de IA
   ↓
Structured Response
   ↓
Match + Recommendations + Resume
```

Um retorno esperado pode seguir esta estrutura:

```json
{
  "matchScore": 89,
  "atsScore": 96,
  "skillsMatch": [],
  "missingSkills": [],
  "partialSkills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "keywords": [],
  "optimizedResume": {}
}
```

---

# 🔐 Privacidade

O projeto não utiliza autenticação.

Não existe:

* Login.
* Cadastro.
* Senha.
* E-mail obrigatório.

Os dados utilizados durante a sessão podem ser armazenados localmente no navegador por meio de `localStorage`.

A aplicação deve evitar armazenar dados desnecessários.

---

# 📱 Responsividade

A aplicação deve funcionar em:

* Desktop.
* Tablet.
* Smartphone.

No mobile, as interfaces mais complexas, como o editor de currículo, devem utilizar um fluxo vertical:

```text
Editor
  ↓
Preview
```

---

# 📂 Estrutura sugerida

```text
src/
├── components/
│   ├── layout/
│   ├── resume/
│   ├── jobs/
│   ├── matchmaking/
│   ├── ats/
│   └── ui/
│
├── pages/
│   ├── Home/
│   ├── Resume/
│   ├── JobMatch/
│   ├── ATSResume/
│   └── History/
│
├── hooks/
├── services/
├── utils/
├── types/
└── lib/
```

---

# 🧩 Princípios do projeto

O desenvolvimento deve seguir alguns princípios fundamentais:

### Simplicidade

O usuário deve conseguir começar a utilizar o produto sem tutorial ou cadastro.

### Veracidade

A IA não deve inventar informações profissionais.

### ATS First

Os currículos gerados devem priorizar compatibilidade com sistemas ATS.

### Personalização

Cada currículo deve ser adaptado à vaga analisada.

### Responsividade

Todas as funcionalidades devem funcionar em diferentes tamanhos de tela.

### Consistência

Todos os componentes devem seguir o padrão visual do ShadCN UI.

---

# 🚧 Futuras funcionalidades

Possíveis evoluções do projeto:

* Cadastro opcional de usuários.
* Armazenamento permanente de currículos.
* Integração com LinkedIn.
* Importação automática de vagas.
* Integração com plataformas de emprego.
* Histórico permanente.
* Comparação entre diferentes versões do currículo.
* Analytics de candidaturas.
* Acompanhamento de processos seletivos.
* Sugestões de vagas baseadas no perfil.
* Personalização avançada dos templates.
* Múltiplos idiomas.
* Assistente de preparação para entrevistas.

---

# 📌 Status

**Em desenvolvimento 🚧**

O projeto está sendo construído utilizando **Lovable**, com foco inicial no fluxo principal de:

**Currículo → Vaga → Match → Otimização ATS → Edição → Download**

---

# 📄 Licença

Definir posteriormente conforme a estratégia de distribuição do projeto.
