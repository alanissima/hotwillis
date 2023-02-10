/*
 * Arquivo JavaScript para acessar a API de clientes,
 * exibindo e manipulando os dados do DOM da página HTML
 */

//Constantes
const ALTERAR = 1;
const EXCLUIR = 2;

const URL_API = "http://localhost:8080/clientes"

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const IDX_STORAGE_ID = 'idCliente';
const IDX_STORAGE_MSG_SUCESSO = 'msgSucesso';
const IDX_STORAGE_MSG_ERRO = 'msgErro';

//Função para carregar a lista de clientes da API
function carregarClientes() {
    //console.log("Teste");
    //Carregar os clientes a partir da API
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", URL_API, false);
    xhttp.send();

    var retorno = xhttp.responseText;
    //console.log(retorno);
    var clientes = JSON.parse(retorno);

    var tabela = document.getElementById('tblClientes');
    
    //Remover o body na tabela caso exista
    var corpo = tabela.getElementsByTagName('tbody');
    if(corpo && corpo.length > 0)
        tabela.removeChild(corpo[0]);
    
    //Criar o body na tabela
    corpo = document.createElement('tbody');
    tabela.appendChild(corpo);

    //Criar as linhas com os clientes
    for(var i=0; i<clientes.length; i++) {
        var linha = corpo.insertRow();
        linha.insertCell().innerHTML = clientes[i].nome;
        linha.insertCell().innerHTML = clientes[i].email;
        linha.insertCell().innerHTML = clientes[i].telefone;
        var botao = criarBotao("Alterar", "btn btn-primary", 
            ALTERAR, clientes[i].id);
        linha.insertCell().appendChild(botao);
        var botao2 = criarBotao("Excluir", "btn btn-danger", 
            EXCLUIR, clientes[i].id);
        linha.insertCell().appendChild(botao2);
    }
    
}

//Função para carregar os dados de um único cliente a partir da API
function carregarDadosCliente() {
    
}

//Função para iniciar a inclusão de um cliente
function incluirCliente() {
    window.location = "clientes_form.html";
}

//Função para iniciar a alteração de um cliente
function alterarCliente(id) {
    window.location = 'clientes_form.html';
}

//Função para salvar um cliente (inclusão ou alteração)
function salvarCliente() {
    //Capturar os valores do formulário e criar o JSON para enviar a API
    var nome = document.getElementById('txtNome').value;
    var email = document.getElementById('txtEmail').value;
    var fone = document.getElementById('txtTelefone').value;

    var cliente = { "nome": nome,
                    "email": email,
                    "telefone": fone };

    //Salvar o cliente a partir da API
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', URL_API, false);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(cliente));

    if(xhttp.status == STATUS_CREATED) {
        window.location = 'clientes_listar.html';
    } else {
        var msg = retornaMsgErro(xhttp.responseText);

        //Exibe a mensagem de erro na tela
        var divErro = document.getElementById('divErro');
        divErro.innerHTML = msg;
        divErro.style.display = 'block';
    }
    
}

//Função para excluir um cliente
function excluirCliente(id) {
    //Confirma a exclusão
    if(! confirm('Confirma a exclusão do cliente?'))
        return;

        //excluir o cliente a partir da api
        var xhttp = new XMLHttpRequest();
        var url = URL_API + "/" + id;
        xhttp.open("DELETE", url, false);
        xhttp.send();

        if(xhttp.status == STATUS_OK){
            carregarClientes();
            var divMsg = document.getElementById('divSucesso');
            divMsg.innerHTML = "Cliente excluido com sucesso";
            divMsg.style.display = "block";
        }else{
            var divMsg = document.getElementById('divErro');
            divMsg.innerHTML = "Erro na exclusão";
            divMsg.style.display = "block";
            
        }
    

    //Exclui o cliente a partir da API
}

//Função AUXILIAR que cria um botão no HTML
function criarBotao(texto, classeEstilo, acao, id) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = texto;
    btn.className = classeEstilo;
    
    if(acao == ALTERAR)
        btn.addEventListener("click", function() {
            alterarCliente(id);
        });
    else if(acao == EXCLUIR)
        btn.addEventListener("click", function() {
            excluirCliente(id);
        });

    return btn;
}

//Função AUXILIAR para retornar uma mensagem de erro extraida de um JSON
function retornaMsgErro(jsonErro) {
    var objErro = JSON.parse(jsonErro);
    return objErro.titulo;
}

//Função AUXILIAR para exibir uma mensagem em um componente HTML da tela
function exibeMsgTela(idComponente, mensagem) {
    document.getElementById(idComponente).innerHTML = mensagem;
    document.getElementById(idComponente).style.display = "block";    
}
