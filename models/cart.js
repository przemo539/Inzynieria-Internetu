var PayU = require('payu-pl');

module.exports = function Cart(initItems){
    this.items = initItems.items || {};
    this.totalyQty = initItems.totalyQty || 0;
    this.totalPrice = initItems.totalPrice || 0;

    this.add = function(item, id){
        if(!this.items[id]){
            var storedItem = this.items[id];
            if(!storedItem){
                storedItem = this.items[id] = {item:item, qty: 0, price: 0};
            }
            storedItem.qty++;
            storedItem.price = storedItem.item.price * storedItem.qty;
            this.totalyQty++;
            this.totalPrice+=storedItem.item.price;
        }else{
            console.log("jest tylko 1 samochod");
        }
    };

    this.removeItem = function(id){
        this.totalyQty-=this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    this.generateArray = function() {
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
    
    this.generatePayU = function(){
        var arr = [];
        for(var id in this.items){
            arr.push({
                name: this.items[id].item.brand+" "+this.items[id].item.model,
                unitPrice: PayU.parsePrice(this.items[id].item.price),
                quantity: this.items[id].qty
              });
        }
        //console.log(arr);
        return arr;
    }
};