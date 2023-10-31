/* Serviço de autenticação que o firebase possui. on.AuthStateChanged (quando o estado de autenticação mudar)
recebe como parâmetro o usuário (user).. como ele reconheçe? Ao logar, ele verifica o UserID que esta salvo 
na base dados dele... if (SE) (!user) (for diferente do usuário), redireciona para a página inicial
Então, se tentarmos acessar atraves da URL 127.0.0.1:5500/pages/home/home.html não conseguiremos, seremos 
redirecionados para a pagina inicial para fazermos o logon
LEMBRANDO QUE O USUARIO PRECISA FAZER LOGOUT, pois caso contrario iremos acessar suas informações */


firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    }
})