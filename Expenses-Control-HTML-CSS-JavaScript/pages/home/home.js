function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}


/*função que verifica se há usuario logado, recebe como parametro o usuario.. SE o usuario estiver logado
aciona a função de buscar as informações no firebase, vinculadas ao usuario
Após criar a pasta Expense-Control-NodeJS e vincular o BACK END ao fireSTORE, foi necessário vir aqui e 
alterar a função, para que recebe o Token de identificação do usuário para que o servidor saiba quem é,
necessário incluir a instrução: user.getIdToken().. ler o READ*/
firebase.auth().onAuthStateChanged(user => {
    if (user){
        user.getIdToken().then(token => console.log(token));
        findTransactions(user);
    }
})


/*Criando a função que permitira adicional transações a tabela
informando que ao clicar no botão, seremos redirecionados para esta pagina*/
function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}


/*função de buscar as informações no firebase, vinculadas a um usuario...
Chama o tela de carregando dados.. então chama a função criada no arquivo
transactions.services.js.. retorna uma promisse que se tudo der certo,
retorna as transações que existem no fireSTORE para a tela, alem de esconder
o Loading... depois Tratando um possivel erro, que pode vir a surgir, caso 
não se consigo recuperar as informações.. Desaparece com a tela de carregando de dados..
instrução de apresentar erro.. mensagem do erro*/
function findTransactions(user) {
    showLoading();
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar transacoes');
        })
}


/*Esta função adiciona cada item, cada elemento para a tela de visualização*/
function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));

        li.appendChild(createParagraph(formatDate(transaction.date)));
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.type));
        if (transaction.description) {
            li.appendChild(createParagraph(transaction.description));
        }

        orderedList.appendChild(li);
    });
}

/*Esta função foi criada para organizar melhor o código, pois o que esta dentro desta função
antes, estava dentro da função addTransactionsToScreen, código ficava confusão, repetitivo e
mal organizado.*/
function createTransactionListItem(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type);
    li.id = transaction.uid;
    li.addEventListener('click', () => {
        window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
    })
    return li;
}


/*Esta função foi criada para organizar melhor o código, pois o que esta dentro desta função
antes, estava dentro da função addTransactionsToScreen, código ficava confusão, repetitivo e
mal organizado.
const deletebutton = document.createElement('button');
const pois sempre existira dentro desta função addTransationsToScreen, recebe um 
elementro do tipo button.. logo abaixo informação que o deleteButton terá um texto
dentro de si, com o termo de Remover.. innerHTML então serve para colocar texto dentro
de um elemento.. por fim, iremos adicionar/incluir o deleteButton como um filho 
(appenChild) da lista (li).. o botão criado ficara "cobrindo" todo o espaço que há..
todo a largura da caixa texto da linha, para corrigir, criado o deleteButton.classList
.add('outline'), classList importa elementos que foram criados no CSS Global e traz para o 
JavaScript.. outline faz com que ele fique escondido, como se fosse transparente, mas se 
passar o mouse por cima, observasse que existe algo ali.. danger é um termo que iremos 
importar o estilo do CSS, para que fique em vermelho.. tambem criamos estilo CSS ao botão
na pasta home.css... ao botão foi add um evento a clicar, que chama a função confirmar
exclusão, que recebe como parametro o documento transaction.. também adicionado um event
que diz para parar a propagação.. o que ocorre é que como estamos trabalhando com um 
elemento filho (appenChild), que esta sendo adicionado a um item da lista, ao executar
o click no botão e confirmar, o usuário era transferido para a tela de transação, pois
o sistema interpretava que ao clicar SOB o item da lista, o usuário desejava Editar
quando a um filho e um pai, SEMPRE devemos criar um evente de stopPropagation*/
function createDeleteButton(transaction) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Remover";
    deleteButton.classList.add('outline', 'danger');
    deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    })
    return deleteButton;
}


/*Esta função foi criada para organizar melhor o código, pois o que esta dentro desta função
antes, estava dentro da função addTransactionsToScreen, código ficava confusão, repetitivo e
mal organizado.
Esta função possui uma const chamada elemento que cria um paragrafo dentro da lista, e dentro
do paragrafo será inserido um texto (innerHTML) que receberá valor(dado) como parâmetro e então
cria, insere e retorna a informação.
(podesse sub entender como paragrafo a linha.. cada informação em uma linha.. em um paragrafo)*/
function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;
    return element;
}


/*funçao é chamada quando usuário clica no botão remover(deleteButton), criado acima
const shouldRemove é igual a um "alert" a qual aparece a mensagem perguntando se
realmente deseja remover.. o confirm é do JavaScript, funciona como um alert, mas
já vem com 2 botões: um de confirma e um de cancelar.. para o sistema isto gera um
boolean, aonde false é cancelar ação e true é igual a OK*/
function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transaçao?');
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}


/*Nesta função chamamos a função criada no arquivo transactions.services.js com a finalidade
de remover algo dentro do fireSTORE... o fireSTORE efetuando isto, retorna uma promisse
que se tudo der certo, devemos esconder o Loading e agora remover aquela transação da tela
o documento com o uid em específico, será remove da tela.. os elementos da tela possuem
uid pois acicionamos tal informação em uma chamada acima.. tratando o erro com CATCH..
escondemos o Loading, no console log aparece e mensagem de erro e na tela também*/
function removeTransaction(transaction) {
    showLoading();

    transactionService.remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover transaçao');
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}
