var url = "http://127.0.0.1:5001/cars"
var editMode = false

window.onload = getCars()

document.getElementById('formAdd').onsubmit = (e) => {
e.preventDefault()
postContact()
}

// Função para remover o form de edição, caso ele exista, do dom.
function removeEditFields() { 
    editMode = false // Desative o modo edição
    let popEdit = document.getElementById('popEdit')
    popEdit ? document.body.removeChild(popEdit) : null
}

// Requisição GET para recuperar todos os contatos
function getCars(){
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log("json", json)
        document.getElementById('cars').innerHTML = ""
        if (json.cars) {
            json.cars.forEach(car => {
                document.getElementById('cars').innerHTML += `<p>Modelo: ${car['modelo']}  Marca: ${car['marca']} Ano: ${car['ano']} Observações: ${car['observacoes']} Diaria: ${car['diaria']} Status: ${car['status']}  <button onclick='showUpdateFields(${car['id']})'>Editar </button><button onclick='deleteContact(${car['id']})'>Deletar </button></p>`
            });
        } else {
            document.getElementById('cars').innerHTML = "Não há nenhum carro na lista!"
        }
        
    })
    .catch(error => console.error(error))
    removeEditFields()
}

// Requisição POST para adicionar um contato na lista no servidor
function postContact(){
    const modelo = document.getElementById('modelo');
    const marca = document.getElementById('marca');
    const ano = document.getElementById('ano');
    const observacoes = document.getElementById('observacoes');
    const diaria = document.getElementById('diaria');
    const selectStatus = document.getElementById('status');
    const defaultOption = document.getElementById('default');
    let estado = defaultOption.innerText;
    for (option of selectStatus) {
        if(option.selected) {
            estado = option.innerText;
        }
    }

    const data = {"modelo":modelo.value,"marca":marca.value,"ano":ano.value,"observacoes":observacoes.value,"diaria":diaria.value,"status":estado}

    console.log(data)
    // Usando o framework axios
    // axios.post(url,{'name':name.value,"phone":phone.value})
    // .then(response => {
    //     console.log(response)
    // })
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        console.log("Contato adicionado: ", json)
        getCars()
    })
    .catch(error => console.error(error));
    modelo.value = "";
    marca.value = "";
    ano.value = "";
    diaria.value = "";
    observacoes.value = "";
    defaultOption.selected = true;
}

// Função chamada ao clicar no botão para editar um contato, cria e exibe os campos para editar o contato.
function showUpdateFields(id){
    if(!editMode) { // Se ele não estiver em modo de edição
        editMode = true // Ative o modo edição
        
        let popEdit = document.createElement('div')
        popEdit.setAttribute('id', 'popEdit')

        let container = document.createElement('div')
        container.setAttribute('id', 'containerPop')

        let title = document.createElement('p')
        title.setAttribute('id', 'title')
        title.innerText = "Atualize as informações do veículo"

        let inputMarca = document.createElement('input')
        inputMarca.type = "text";
        inputMarca.setAttribute('name', 'updateMarca')
        inputMarca.setAttribute('id', 'updateMarca')
        inputMarca.setAttribute('placeholder', 'Insira a nova marca')
        
        let inputModelo = document.createElement('input')
        inputModelo.type = "text";
        inputModelo.setAttribute('name', 'updateModelo')
        inputModelo.setAttribute('id', 'updateModelo')
        inputModelo.setAttribute('placeholder', 'Insira o novo modelo')

        let inputDiaria = document.createElement('input')
        inputDiaria.type = "text";
        inputDiaria.setAttribute('name', 'updateDiaria')
        inputDiaria.setAttribute('id', 'updateDiaria')
        inputDiaria.setAttribute('placeholder', 'Insira o novo valor dz diária')

        let inputAno = document.createElement('input')
        inputAno.type = "text";
        inputAno.setAttribute('name', 'updateAno')
        inputAno.setAttribute('id', 'updateAno')
        inputAno.setAttribute('placeholder', 'Insira o novo ano')

        let inputObs = document.createElement('textarea')
        inputObs.setAttribute('name', 'updateObs')
        inputObs.setAttribute('id', 'updateObs')
        inputObs.setAttribute('placeholder', 'Insira as novas observações')

        let selectStatus = document.createElement('select')
        selectStatus.setAttribute('name', 'updateStatus')
        selectStatus.setAttribute('id', 'updateStatus')

        let optDisponivel = document.createElement("option");
        optDisponivel.value = "disponivel"
        optDisponivel.text = "Disponível";

        let optAlugado = document.createElement("option");
        optAlugado.value = "alugado"
        optAlugado.text = "Alugado";

        let optManutencao = document.createElement("option");
        optManutencao.value = "manutencao"
        optManutencao.text = "Em manutenção";
        selectStatus.add(optDisponivel);
        selectStatus.add(optAlugado);
        selectStatus.add(optManutencao);
        
        let confirmEditButton = document.createElement("button") 
        confirmEditButton.setAttribute("id", "confirmEditButton")
        confirmEditButton.innerText = "Confirmar"

        
        let formEdit = document.createElement('form')
        formEdit.setAttribute('id', 'formEdit')
        formEdit.append(title, inputMarca, inputModelo, inputAno, inputObs, inputDiaria, selectStatus, confirmEditButton)
        formEdit.onsubmit = (e) => {
            e.preventDefault();
            let estado = "Disponível";
            for (option of selectStatus) {
                if(option.selected) {
                    estado = option.innerText ;
                }
            }
            updateContact(id,inputMarca.value,inputModelo.value, inputAno.value, inputObs.value, inputDiaria.value, estado);
        }

        container.append(formEdit)
        popEdit.append(container)
        
        document.body.appendChild(popEdit); 
    }
}

// Função chamada após clicar no botão "Confirmar" ao editar um contato.
// Requisição PUT para atualizar o contato em questão (que está salvo na lista no servidor) com os campos alterados pelo usuário
function updateContact(id, modelo, marca, ano, observacoes, diaria, estado) {
    let urlUpdate = url + `/${parseInt(id)}`
    const data = {"modelo":modelo,"marca":marca,"ano":ano,"observacoes":observacoes,"diaria":diaria,"status":estado}
    fetch(urlUpdate, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        console.log("Contado editado: ", json)
        getCars()
    })
    .catch(error => console.error(error));

}

// DELETE para remover o carro da lista de carros presente no servidor.
function deleteContact(id){
    let urlDelete = url + `/${parseInt(id)}`
    fetch(urlDelete, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json)
        getCars()
    })
    .catch(error => console.error(error));
}