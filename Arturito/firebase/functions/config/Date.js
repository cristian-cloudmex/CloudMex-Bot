
//Permite calcular la fecha actual

module.exports = {
    getDate : function (){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return (month + "/" + day + "/" + year);
    }
    
}