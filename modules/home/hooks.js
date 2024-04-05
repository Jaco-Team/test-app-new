import { useEffect, useState } from 'react';

function useCheckCat(CatsItems) {

  const [activeID, setActiveID] = useState({id: 0, parent_id: 0});
  
  var lastPOS = 0;

  function scrollFunc(){
    const thisPOS = document.documentElement.scrollTop;

    if( CatsItems.length > 0 ){
      if( thisPOS - lastPOS > 200 || lastPOS - thisPOS > 200 ){
        
        let arrMax = [];
        
        CatsItems.map( (item, key) => {
          var elem = document.getElementById('cat'+item.id);

          if( elem ){
            var top = elem.getBoundingClientRect().top + document.body.scrollTop - 250;
            
            if(top < 0){
              arrMax.push({ name: item.name, Y: top, parent_id: item.parent_id, id: item.id })
            }
          }else{
            item.cats.map( (it) => {
              elem = document.getElementById('cat'+it.id);

              if( elem ){
                top = elem.getBoundingClientRect().top + document.body.scrollTop - 250;
                
                if(top < 0){
                  arrMax.push({ name: it.name, Y: top, parent_id: it.parent_id, id: it.id })
                }
              }
            } )
          }
        })
            
        if( arrMax.length > 0 ){
          let max = arrMax[ arrMax.length-1 ];
          
          arrMax = [];
          
          if( max ){
            if( parseInt(activeID.id) != parseInt(max.id) || parseInt(activeID.parent_id) != parseInt(max.parent_id) ){
              
              setActiveID( {id: max.id, parent_id: max.parent_id} )

              setTimeout( () => {
                if( document.querySelector('.Cat') ){
                  document.querySelector('.Cat').classList.remove('active');
                }
  
                if( document.querySelector('#link_'+max.parent_id) ){
                  document.querySelector('.Cat').classList.remove('active');
                  document.querySelector('#link_'+max.parent_id).classList.add('active');
                }
              }, 200 )
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
