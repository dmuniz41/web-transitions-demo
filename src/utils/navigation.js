const checkIsNavigationSupported = ()=>{
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url)=>{
  //aqui se carga la pagina destino en formato de texto plano haciendo un fetch para obtener el HTML
  const response = await fetch(url)
  const text = await response.text()
  // extrae solo el contenido HTML dentro de la etiqueta <body></body> usando una regex
  const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  return data
}

export const startViewTransition = () =>{
  if(!checkIsNavigationSupported()) return
  window.navigation.addEventListener('navigate', (event)=>{
    const toUrl = new URL(event.destination.url)
    // si es una navegacion externa la ingnora
    if(location.origin !== toUrl.origin){
      return
    }
    // si es una navegacion en el mismo dominio (origen)
    event.intercept({
      
      async handler(){
        const data= fetchPage(toUrl.pathname)
        // utilizar la API de View Transition APi
        document.startViewTransition(()=>{
          document.body.innerHTML = data
          document.documentElement.scrollTop = 0

        })
      }
    })
  })
}