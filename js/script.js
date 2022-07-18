import html2canvas from '../node_modules/html2canvas/dist/html2canvas.esm.js';

"use strict";

const names = document.querySelector(".nome");
const visualizadorName = document.querySelector(".nome-visualizado");
const setor = document.querySelector(".setor")
const setorInner = document.querySelector(".visualiza-setor")
const telefone = document.querySelector(".telefone");
const telefoneInner = document.querySelector(".visualiza-telefone");
const celular = document.querySelector(".celular");
const celularInner = document.querySelector(".visualiza-celular");
const imagemButton = document.querySelector(".gerar-imagem");

let cont = 0;
let num = 0;



const teclasPermitidas = (key) => {
    const teclas = {
        1: 'ArrowLeft',
        2: 'ArrowRight',
        3: 'Tab',
        4: 'Control',
        5: 'Alt',
        6: 'Home',
        7: 'End',
        8: 'Shift',
        9: 'CapsLock',
        10: 'Dead'
    }

    for(let i in teclas) {
        if(key === teclas[i])
            return true
    }
    return false;
}

// Verifica se os inputs estão vazios
const verificaInput = campo => document.getElementById(campo).value === '';

// Verifica se a tecla digitada é um número
const verificaNumero = isNumber => !isNaN(isNumber)


const verificaLetras = charCode1 => {
    let charCode = charCode1.charCodeAt(charCode1)
    if(charCode1.length > 1 ) return false
    else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) ||(charCode > 191 && charCode <= 255)) {
        return true
    }
    else return false;
}


const insereCaracter = (key, nameElement) => {    
    if(!teclasPermitidas(key)) {
        nameElement.textContent += `${key.toUpperCase()}`
        nameElement.style.color = '#1c1c1d';
    }
}


const removeCaracter = (key, nameElement) => {
    if(key === "Backspace")
        nameElement.innerHTML = nameElement.textContent.slice(0, -1);
}


const editaTexto = (nomeCampo, visualizaCampo) => {
    nomeCampo.addEventListener("keydown", (e)=> {
        document.onmouseup = algumTextoSelecionado(visualizaCampo);
        document.onkeyup = algumTextoSelecionado(visualizaCampo);
        if(teclasPermitidas(e.key) || verificaLetras(e.key) || e.key === ' ')
            insereCaracter(e.key, visualizaCampo);
        else if(e.key === "Backspace")
            removeCaracter(e.key, visualizaCampo)
        else {
            e.preventDefault()
            alert("Digite somente letras!")
        }
    });
}

const removeTextoSelecionado = (Element, texto) => {
    const a = Element.textContent;
    Element.innerHTML = a.replace(texto.toUpperCase(), " ");

}

function algumTextoSelecionado(Element) {
    var texto = "";
    
    if (typeof window.getSelection != "undefined")
        texto = window.getSelection().toString();
    else if (typeof document.selection != "undefined" && document.selection.type == "Text")
        texto = document.selection.createRange().text;
    
    if (texto.trim()) {
        let a;
        a = Element.textContent;
        Element.innerHTML = a.replace(texto.toUpperCase(), " ");
        // console.log(texto);
        // console.log(window.getSelection().anchorNode.firstElementChild.id)
    }
}


// const focus = ele => {
//     ele.addEventListener("focus", () => {
//         ele.style.backgroundColor = "red"
//     })
// }

// focus(names);


const insereNumeroContainerImage = (key, tipoNumero, elementoNumero, tipoNumeroInner) => {
    let numero;
    let tamInput = elementoNumero.attributes.maxlength.value;

    tipoNumero.toUpperCase() === 'TELEFONE' ? numero = 6 : tipoNumero.toUpperCase() === 'CELULAR' 
        ? numero = 7 : console.log("Tipo de Número Inválido");

    if(teclasPermitidas(key) || verificaNumero(key)) {
        if(!teclasPermitidas(key) && elementoNumero.value.length < tamInput) {
            num++;
            tipoNumeroInner.textContent += `${key}`
            if(num === 2) {
                tipoNumeroInner.textContent = `(${tipoNumeroInner.textContent}) `
            }
            else if(num === numero) {
                tipoNumeroInner.textContent = `${tipoNumeroInner.textContent}-`
            }
            return true;
        }
        num = 0;
    }
    return false;
}


const apagaNumero = (key, elementoNumero, tipoNumeroInner) => {
    let ultimoCaracter = tipoNumeroInner.textContent.at(-1)
    let tamInput = elementoNumero.attributes.maxlength.value;

    if(key === "Backspace" && tipoNumeroInner.textContent.length > 0) {
        if(ultimoCaracter === '(' || ultimoCaracter === ')' || ultimoCaracter === '-' || ultimoCaracter === ' ') {
            elementoNumero.value = tipoNumeroInner.textContent;
            // tipoNumeroInner.textContent = elementoNumero.value; 
            // key.preventDefault()
            removeCaracter(key, tipoNumeroInner);
            return true;
        }
        else {
            num > 0 ? num-- : num = 0;
            removeCaracter(key, tipoNumeroInner);
            return true;
        }
    }
    return false;
}


const insereNumero = (idNome, classNome, classRemoveElement, tipoInput, visualizaInnerImage) => {
    num = 0;

    tipoInput.addEventListener("keydown", (e) => {
        document.getElementById(idNome).classList.remove(classRemoveElement);

        if(!insereNumeroContainerImage(e.key, classNome, tipoInput, visualizaInnerImage) && !teclasPermitidas(e.key) && e.key !== "Backspace") {
            if(visualizaInnerImage.textContent.length > tipoInput.attributes.maxlength.value) {
                e.preventDefault();
                alert("Número Máximo Atingido!")
            }
            else {
                e.preventDefault();
                alert("Insira Somente Números!");
            }
        }
        else if(!apagaNumero(e.key, tipoInput, visualizaInnerImage) && e.key === "Backspace" && visualizaInnerImage.textContent.length > 0) {
            alert("Não há número para apagar!")
        }
    })
}


const gerarImagem = () => {
    const downloadClick = document.querySelector(".download");
    imagemButton.addEventListener("click", e => {
        if(telefoneInner.textContent.length !== 14 || celularInner.textContent.length !== 15) {
            alert("Verifique os dados de contato! Eles não estão completos.")
            e.preventDefault();
            return;
        }

        if(!verificaInput("campo-nome") && !verificaInput("campo-setor") && !verificaInput("campo-telefone") && !verificaInput("campo-celular")) {
                e.preventDefault();
                html2canvas(document.querySelector(".container-visualizador")).then(function(canvas) {
                downloadClick.href = canvas.toDataURL("image/png");
                downloadClick.download = visualizadorName.textContent.replaceAll(" ", "-");
                downloadClick.click()
                // document.body.appendChild(canvas);
            });
        }
        else {
            alert("Todos os campos são obrigatórios.");
        }
        
    })
}



editaTexto(names, visualizadorName);
editaTexto(setor, setorInner);
insereNumero("cel", "celular", "hide-cel", celular, celularInner);
insereNumero("tel", "telefone", "hide-tel", telefone, telefoneInner);
gerarImagem()
