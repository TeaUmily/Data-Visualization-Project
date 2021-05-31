

function myFunction() {
  const APIKEY = "c6d22ce1aec441c2fa99e52b64a8aa25"
  const appID = "f88bcc7a"

  var input = document.getElementById('myInput')
  var query = input.value

  var cont = document.getElementById('container');


  if(query.length != 0) {
    const apiData = fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${appID}&app_key=${APIKEY}&category=generic-foods`)
    apiData.then((response) => {
      return response.json()
    }).then((jsonData) => {
      console.log(jsonData)
      let hints = jsonData.hints
      let names = hints.map(item => {
        return item.food.label
      })
      console.log(names)

      var elUL = document.getElementById('theList');
      if(elUL != null) {
        elUL.remove();
      }

      var ul = document.createElement('ul');
      ul.setAttribute('style', 'padding: 0; margin: 0;');
      ul.setAttribute('id', 'theList');

        // clear search results list
      while (ul.firstChild) {
           ul.removeChild(element.firstChild);
      }

       var filtered = names.slice(0, 5)

       for (i = 0; i <= filtered.length - 1; i++) {
       var li = document.createElement('li');
       li.innerHTML = `<a href="#">${filtered[i]}</a>`;
       li.setAttribute('style', 'display: block;');
       li.setAttribute('id', 'search_result');
       ul.appendChild(li);
     }

      cont.appendChild(ul);
    })
    } else {
      li.innerHTML = `<a href="#">Sorry, no results ... </a>`;
      li.setAttribute('style', 'display: block;');
      li.setAttribute('id', 'search_result');
      ul.appendChild(li);
    var elUL = document.getElementById('theList');
    if(elUL != null) {
      elUL.remove();
    }
  }



}
