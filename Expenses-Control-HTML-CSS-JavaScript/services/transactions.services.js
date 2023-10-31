/*a const criada fara a chamada do backend ao fireSTORE
dentro dela temos uma função chamada buscar o usuário e recebe o usuário como parâmetro
comparado ao projeto original, aqui, foi alterado para que seja retornado apenas o que
é importante para a tela, que é as transações e seus documentos.. lembrando.. esta parte 
aqui é o serviço de comunicação (BACKEND), qualquer coisa que não for relacionado, deve 
ser removida
A sintaxe padrão de buscar dados no banco não relacional do firebase
informa o nome da coleção.. condição WHERE, aonde, o userID no firebase deve ser IGUAL 
ao userID de quem esta logado ordenar as informações por DATA, descrescente get porque 
queremos recuperar as informações..snapshot é uma sintaxe para expor.. mapear os 
documentos retornador=snapshot pelo fireSTORE, mas não somente os dados=data que estão do 
documento=doc, mas TAMBÉM o uid do documento, cada documento possui um id na base do 
fireSTORE e esse id que queremos saber qual é, esta instrução esta relacionada a função 
criada mais a baixo no arquivo home.js (li.addEventListener('click', () => {)..

Criado também uma função que busca a transação no fireSTORE pelo id dela.
A função irá acesssar o fireSTORE, na coleção transaction e obter=GET o uid do documento, 
a função retorna uma promisse com os documentos que desejamos.

Também criado uma função chamada de remove que recebe as transações como parâmetro e toda
a chamada para o fireSTORE com a finalidade de exclusão.. função envia uma requisição ao 
fireSTORE para que acesse a coleção transactions, no documento em específico com o UID que 
o usuário clicou para remover e ordena ao fireSTORE que delete aquele documento..

Criado a função save que envia as informações da transação que esta sendo salva, 
estas serão exportadas ao Firebase.. basta informar para a função fireSTORE que: na coleção 
de nome transaction deve ser adicionado a transaction.

Por fim criamos a função update que acessa o fireSOTRE, na coleção/tabela transaction, 
identificamos lá na tabela qual o item possui o uid que estamos informando e efetuamos o 
update*/

const transactionService = {
    findByUser: () => {
        return callApi({
            method: "GET",
            url: "http://localhost:3000/transactions"
        })
    },
    findByUid: uid => {
        return callApi({
            method: "GET",
            url: `http://localhost:3000/transactions/${uid}`
        })
    },
    remove: transaction => {
        return callApi({
            method: "DELETE",
            url: `http://localhost:3000/transactions/${transaction.uid}`
        })
    },
    save: transaction => {
        return callApi({
            method: "POST",
            url: "http://localhost:3000/transactions",
            params: transaction
        })
    },
    update: transaction => {
        return callApi({
            method: "PATCH",
            url: `http://localhost:3000/transactions/${transaction.uid}`,
            params: transaction
        })
    }
}

function callApi({method, url, params}) {
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        xhr.setRequestHeader('Authorization', await firebase.auth().currentUser.getIdToken())
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                const json = JSON.parse(this.responseText);
                if (this.status != 200) {
                    reject(json);
                } else {
                    resolve(json);
                }
            }
        };

        xhr.send(JSON.stringify(params));
    })
}