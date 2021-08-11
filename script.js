let modalQt = 1;
let cart = [];
let modalKey = 0;

//Listagem das pizzas.
pizzaJson.map((item, index)=>{

    //"clonando" a class pizza-item com todos os elementos. 
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    
    //Adcionando os respectivos itens que estão no objeto Json nas classes do HTML
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
   
    //Evento clique para "previnir" eventos padrões que irá atualizar a página ao clicar.
    pizzaItem.querySelector('a').addEventListener('click', (elemento)=>{
        elemento.preventDefault();

        // Ao pegar o atributo data-key, obteremos a chave.
        let key = elemento.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        //Atribuindo  aos elementos HTML a chave(index) Json.
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            //Ao fechar o modal e abri-lo novamente, ele irá abrir com o tamanho Grande como padrão
            if(sizeIndex == 2){ 
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //Add quantidade de pizza ao modal.
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;

        //Aplicando opacidade 0
        document.querySelector('.pizzaWindowArea').style.opacity = 0;

        //Mudando o style de none para flex, ao clicar, o display ficará visível.
        document.querySelector('.pizzaWindowArea').style.display = 'flex';

        //ao clicar, o setTimeout add 100 milissecundos e muda a opacidade para 1.
        setTimeout(()=>{
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        },100);
    })

    //pega o conteúdo já contido em pizza-area e add mais um conteúdo.
    document.querySelector('.pizza-area').append(pizzaItem);
});

//Eventod do Modal.

//Função para fechar o Modal.
function closeModal(){ 
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    },200);
}

//Fechando modal.
document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Botão para diminuir quantidade de pizzas.
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt >1){
        modalQt--;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//Botão para adcionar quant de pizzas.
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
});

//Desmarcando o item de tamanho da pizza que vem selecionado por padrão, e selecionar o tamanho que desejar.
document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', ()=>{
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Botao add ao carrinho.
document.querySelector('.pizzaInfo--addButton').addEventListener('click', ()=>{

    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));

        //Juntar as informações do ID da pizza com o tamanho dela.
        let identifier =  pizzaJson[modalKey].id+"@"+size;

        //Verificar se o item é igual ao identificador
        let keyIndex = cart.findIndex((item)=> item.identifier == identifier)

        //Se for igual adicionará +1 à quantidade
        if (keyIndex > -1){
            cart[keyIndex].qt += modalQt;
        //Se não for igual ele fará o processo de push normalmente.
        }else{
             //add o objeto com id da pizza, tamanho e quantidade ao array cart.
            cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt  
            });
        }
        updateCart();
        closeModal();
});
//Evento para abrir Carrinho ao clicar
document.querySelector('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        document.querySelector('aside').style.left = 0;
    }
    closeAside();
});

//Evento para fechar carrinho.
    document.querySelector('.menu-closer').addEventListener('click', ()=>{
            document.querySelector('aside').style.left = '100vw';
    });

//Evento para ao clicar em finalizar a compra, o carrinho fechar.
document.querySelector('.cart--finalizar').addEventListener('click', ()=>{
    document.querySelector('aside').style.left = '100vw';
})

//Função para fazer o carrinho aparecer e/ou desaparecer.
function updateCart(){
    document.querySelector('.menu-openner span').innerHTML = cart.length;
    
    //Se tiver algum item no carrinho, a aba do carrinho irá aparecer.
    if(cart.length > 0){
        //show é que fará o carrinho aparecer.
        document.querySelector('aside').classList.add('show');
        //Para zerar a quantidade de pizza no carrinho.
        document.querySelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //Percorre pelo objeto cart e acessa o id.
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
           
            //Clonando  a class .cart--item.
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            //Armazenando os nomes apropriados à cada tamanho, pelo index.
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //Atribuindo nome, img, quantidade ao display do carrinho.
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt'). innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                //reatualiza o carrinho toda vez que eu add um a pizza na quantidade.
                updateCart();
            });

            document.querySelector('.cart').append(cartItem);
        }
    
        //Aplicando os cálculos do desconto e do total.
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        //Aplicando os valores nas classes.
        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        //Se não tiver nada no carrinho, ele remove o show.
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}