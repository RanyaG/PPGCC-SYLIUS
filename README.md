[![DOI](https://zenodo.org/badge/1302052124.svg)](https://doi.org/10.5281/zenodo.21400917)

# Avaliação da Qualidade de Testes de GUI em Ambientes Educacionais

Kit de reprodução do estudo empírico que compara suítes de teste de GUI (Cypress) produzidas por estudantes de graduação com suítes de referência elaboradas sob critérios especialistas, no sistema de e-commerce **Sylius**. A avaliação usa três critérios: **capacidade de detecção de defeitos**, **presença de test smells** e **redundância**.

Este repositório contém os artefatos necessários para reproduzir a análise dos dados e as figuras do artigo, bem como as suítes de referência, os códigos brutos anonimizados dos discentes e o catálogo de defeitos utilizados no experimento.

## 🛡️ Política de Privacidade e Anonimização de Dados (LGPD)

Este pacote de replicação foi estruturado em estrita conformidade com as diretrizes de ética em pesquisa. Durante a coleta, identificou-se que as suítes originais submetidas pelos discentes continham dados pessoais identificáveis (nomes, e-mails institucionais e matrículas). Para proteger a privacidade dos participantes, adotou-se a seguinte estratégia:

1. **Anonimização:** A identidade dos estudantes foi substituída por IDs sequenciais (P1–P8, PG1–PG6, CL1–CL5, EN1–EN3). A correspondência aos autores originais não é divulgada.
2. **Disponibilização Segura:** Foram extraídos e disponibilizados apenas os scripts de teste brutos e anonimizados (`.cy.js`). Os arquivos originais completos (`.zip` e configurações locais) contendo o histórico e metadados dos alunos foram omitidos deste repositório para evitar exposição inadvertida.
3. **Reprodutibilidade:** A reprodutibilidade está garantida pelos dados de coleta tabulados, scripts estatísticos, catálogo de defeitos e o uso do Starter Kit oficial da disciplina.

## Estrutura do repositório

```text
.
├── data/
│   └── coleta_ampliada.xlsx        # Planilha anonimizada com a classificação das 22 suítes
├── scripts/
│   ├── analise_estatistica.py      # Testes estatísticos (Shapiro-Wilk, Wilcoxon, Spearman, IC)
│   └── grafico_estatistica.py      # Gera a figura de correlação + intervalos de confiança
├── reference-suites/               # As 4 suítes de referência (Cypress) construídas
│   ├── products-reference.cy.js
│   ├── payment-methods-reference.cy.js
│   ├── customers-reference.cy.js
│   └── shipping-methods-reference.cy.js
├── student-suites-*/               # Pastas contendo os códigos anonimizados dos discentes (.cy.js)
├── docs/
│   └── catalogo_defeitos.md        # Catálogo de defeitos, pontos e roteiro de injeção
├── results/                        # Figuras geradas pelos scripts
├── requirements.txt                # Dependências Python
└── README.md
```

## Requisitos

- **Python 3.12+** (para a análise estatística)
- **Node.js 22+** e **Cypress 12.12** (para reexecutar as suítes)
- **Docker** com a instância da loja de demonstração do **Sylius 1.x** (porta 9990)

## Reproduzindo a análise estatística

A análise estatística e as figuras são reproduzíveis diretamente a partir da planilha de coleta anonimizada.

# 1. Instalar as dependências
pip install -r requirements.txt

# 2. Entrar na pasta de scripts
cd scripts

# 3. Rodar os testes estatísticos (imprime resultados no terminal)
python analise_estatistica.py

# 4. Gerar a figura de correlação
python grafico_estatistica.py


## 🔄 Reproduzindo os Testes via Starter Kit

Para garantir a total fidelidade ao ambiente de desenvolvimento original, a execução tanto das suítes de referência quanto das suítes dos discentes deve ser feita utilizando o *Starter Kit* oficial da disciplina. 

Para reproduzir localmente:

1. Faça o clone do repositório base oficial do experimento:
   git clone https://github.com/mourats/gui-testing-cypress-selenium
   
2. Siga as instruções no README do `gui-testing-cypress-selenium` para subir os contêineres Docker (a aplicação Sylius estará mapeada na porta `9990`).
3. Para testar as suítes deste repositório, substitua o conteúdo da pasta `cypress/e2e` do *Starter Kit* pelos arquivos `.cy.js` desejados (das pastas `student-suites-*` ou `reference-suites`).
4. *Nota:* Caso alguma suíte discente possua dependência de um arquivo `commands.js` customizado, ele também foi disponibilizado e deve ser alocado na pasta `cypress/support` do *Starter Kit*.

Como a `baseUrl` já está configurada no Starter Kit para a porta 9990, os testes rodarão perfeitamente sem a necessidade de alterar os códigos originais fornecidos.

## Composição da amostra

As 22 suítes discentes analisadas distribuem-se em quatro funcionalidades administrativas do Sylius:

| Funcionalidade        | Suítes |
|-----------------------|:------:|
| Produtos              |   8    |
| Métodos de Pagamento  |   6    |
| Clientes              |   5    |
| Métodos de Envio      |   3    |
| **Total**             | **22** |

## Licença

Os artefatos deste repositório destinam-se a fins acadêmicos e de reprodução do estudo.
