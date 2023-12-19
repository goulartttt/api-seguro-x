const utils = {
    //criar regra para hash
    //hash ex: APO.2023.0012.0001
    //Sempre começar como APO + ANO ATUAL + O MÊS COM 2 ZEROS A ESQUERDA + N_PROPOSTA COM 2 ZEROS A ESQUERDA
     geraNumDoc: (n_proposta) => {
        const dataAtual = new Date();
        console.log(dataAtual)
        return `APO.${dataAtual.getFullYear()}.00${dataAtual.getMonth()+1}.${n_proposta.toString().padStart(4, '0')}`
    
    }
}

module.exports = utils 
