function showLoading() {
    const div = document.createElement("div"); /*A função irá criar uma div*/
    div.classList.add("loading", "centralize"); /*A div criada receberá as classes loading e centralize*/

    const label = document.createElement("label"); /*Cria uma label */
    label.innerText = "Carregando..." /*Definimos o texto que irá aparecer na LABEL*/

    div.appendChild(label); /*Indica para a DIV que receberá um filho, que será o label*/

    document.body.appendChild(div); /*Indica ao BODY que ele receberá um elemento filho, que será a div*/
}

function hideLoading() {
    const loadings = document.getElementsByClassName("loading"); /*Cria uma constante que receberá uma lista de tudo que contem a classe LOADING*/
    if (loadings.length){        /*Da lista que for criada, será removida/elimidada o primeiro elemento [0] */
        loadings[0].remove();
    }
}