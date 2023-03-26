import { useEffect, useState } from 'react';

function useCheckCat(CatsItems) {

  const [activeID, setActiveID] = useState({id: 0, main_id: 0});
  
  var lastPOS = 0;

  function scrollFunc(){
    const thisPOS = document.documentElement.scrollTop;

    if( CatsItems.length > 0 ){
      if( thisPOS - lastPOS > 300 || lastPOS - thisPOS > 300 ){
        
        let arrMax = [];
        
        CatsItems.map( (item, key) => {
          var elem = document.getElementById('cat'+item.id);

          if( elem ){
            var top = elem.getBoundingClientRect().top + document.body.scrollTop - 200;
            
            if(top < 0){
              arrMax.push({ name: item.name, Y: top, main_id: item.main_id, id: item.id })
            }
          }
        })
            
        let is_find = false;

        if( arrMax.length > 0 ){
          let max = arrMax[ arrMax.length-1 ];
          
          arrMax = [];
          
          let doubleCatList = CatsItems.filter( (item) => parseInt(item.main_id) == parseInt(max.main_id) )

          if( max ){
            if( parseInt(activeID.id) != parseInt(max.id) && parseInt(max.main_id) != 0 ){
              is_find = true;

              if( document.querySelector('#link_'+max.main_id) ){
                if( document.querySelector('.activeCat') ){
                    document.querySelector('.activeCat').classList.remove('activeCat');
                }
                document.querySelector('#link_'+max.main_id).classList.add('activeCat');
              }

              if( doubleCatList.length > 1 ){
                  //this.setState({
                  //    doubleCatList: doubleCatList
                  //})
              }else{
                  //this.setState({
                  //    doubleCatList: []
                  //})
              }

              setActiveID( {id: max.id, main_id: max.main_id} )
            }
          }
        }
      
        lastPOS = thisPOS;
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollFunc);

    return () => {
      window.removeEventListener('scroll', scrollFunc);
    };
  });

  return activeID;
}

export default useCheckCat;