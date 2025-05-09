# Controle Veicular App

![App Screenshot Light](link_para_screenshot_light.png) <!-- Substitua pelo link de um screenshot real -->
![App Screenshot Dark](link_para_screenshot_dark.png) <!-- Substitua pelo link de um screenshot real do modo escuro -->

Aplicativo simples para controle de manutenção veicular, permitindo registrar informações sobre veículos, abastecimentos, calibragens, trocas de óleo, revisões e visualizar um dashboard com informações relevantes.

Este projeto é construído com HTML, CSS e JavaScript puro, utilizando o Capacitor para potencial empacotamento como aplicativo móvel (embora o foco atual seja a funcionalidade web).

## Funcionalidades

*   **Gerenciamento de Múltiplos Veículos:**
    *   Cadastro de veículos (Carro, Moto) com informações como Marca, Modelo, Ano, Placa e KM Atual.
    *   Listagem e exclusão de veículos.
*   **Acesso Rápido para Abastecimento:**
    *   Interface simplificada na tela inicial para registrar rapidamente um abastecimento.
    *   Exibição do consumo (KM/L) do último abastecimento para o veículo selecionado.
*   **Registro Detalhado de Manutenções por Veículo:**
    *   **Abastecimento:** Data, KM, Tipo de combustível, Litros, Valor total, Posto e Observações. Cálculo automático de consumo (KM/L).
    *   **Calibragem de Pneus:** Data, KM, Pressão Dianteira/Traseira (PSI) e Observações.
    *   **Troca de Óleo/Filtros:** Data, KM, Tipo de óleo, Filtros trocados, Próxima troca (KM/Data) e Observações.
    *   **Revisões:** Data, KM, Itens verificados/trocados, Próxima revisão (KM/Data) e Observações.
*   **Histórico de Manutenções:**
    *   Tabelas de histórico para cada tipo de manutenção, com opção de excluir registros.
*   **Alertas de Manutenção:**
    *   Exibição de alertas para próximas trocas de óleo e revisões baseadas em KM ou data.
*   **Dashboard por Veículo:**
    *   Consumo médio geral (KM/L).
    *   Gasto total no mês atual e no ano atual.
    *   Gráficos de consumo de combustível e distribuição de gastos (estrutura básica implementada, requer mais lógica para dados precisos).
*   **Persistência de Dados:**
    *   Os dados são salvos localmente no navegador usando `localStorage`.
*   **Tema Escuro:**
    *   Opção para alternar entre tema claro e escuro, com preferência salva.
*   **Responsividade:**
    *   Interface adaptada para diferentes tamanhos de tela.

## Tecnologias Utilizadas

*   **HTML5**
*   **CSS3**
    *   Variáveis CSS para temas.
    *   Flexbox e Grid Layout para estrutura.
*   **JavaScript (ES6+)**
    *   Manipulação do DOM.
    *   Gerenciamento de eventos.
    *   Lógica de persistência de dados com `localStorage`.
*   **Font Awesome:** Para ícones.
*   **Chart.js:** Para gráficos no dashboard.
*   **Capacitor (opcional):** Configurado no `package.json` e `capacitor.config.ts` para potencial build nativo.

## Como Executar o Projeto

### Pré-requisitos

*   Um navegador web moderno (Chrome, Firefox, Edge, Safari).
*   Node.js e npm (opcional, se for usar os scripts do Capacitor).

### Executando no Navegador (PWA/Web)

1.  Clone o repositório:
    ```bash
    git clone https://github.com/SEU_USUARIO/controle-veicular.git
    cd controle-veicular
    ```
2.  Abra o arquivo `www/index.html` diretamente no seu navegador.

    OU

3.  Se você tem o Capacitor CLI instalado e quer simular o ambiente web via Capacitor:
    ```bash
    npm install
    npx cap serve
    ```
    Isso iniciará um servidor de desenvolvimento local e abrirá o aplicativo no seu navegador.

### (Opcional) Executando com Capacitor em Plataformas Nativas

Se desejar construir e executar como um aplicativo nativo (Android/iOS):

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Adicione a plataforma desejada (exemplo para Android):
    ```bash
    npx cap add android
    # ou
    # npx cap add ios
    ```
3.  Sincronize o projeto web com a plataforma nativa:
    ```bash
    npx cap sync
    ```
4.  Abra o projeto na IDE da plataforma (Android Studio ou Xcode):
    ```bash
    npx cap open android
    # ou
    # npx cap open ios
    ```
5.  Compile e execute o aplicativo a partir da IDE.

## Estrutura do Projeto

controle-veicular/
├── www/ # Diretório web principal (webDir do Capacitor)
│ ├── index.html # Estrutura principal da aplicação
│ ├── style.css # Estilos da aplicação
│ └── script.js # Lógica JavaScript da aplicação
├── capacitor.config.ts # Configuração do Capacitor
├── package.json # Dependências e scripts do projeto
└── README.md # Este arquivo

## Melhorias Futuras (Sugestões)

*   **Edição de Registros:** Permitir editar entradas de manutenção existentes.
*   **Validação de Formulários Avançada:** Implementar validação mais robusta com feedback visual em JavaScript.
*   **Dados para Gráficos:** Lógica completa para agregação e exibição de dados nos gráficos do dashboard.
*   **Internacionalização (i18n):** Suporte para múltiplos idiomas.
*   **Backup/Restauração de Dados:** Opção para exportar e importar os dados do usuário.
*   **Plugins do Capacitor:**
    *   Utilizar `@capacitor/storage` para uma persistência de dados mais robusta.
    *   Implementar `@capacitor/local-notifications` para lembretes de manutenção.
*   **Modularização do JavaScript:** Dividir `script.js` em módulos menores para melhor organização.
*   **Testes Unitários/Integração.**

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir *issues* para reportar bugs ou sugerir novas funcionalidades. Se desejar contribuir com código, por favor, crie um *pull request*.

## Licença

Este projeto é de código aberto e está disponível sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes (se você adicionar um).

---

Desenvolvido por geekcodebrazil
