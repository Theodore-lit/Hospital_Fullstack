export async function apiFetch(url, options = {}){

  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`,{
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  })

  if(res.status === 401){
    
    // window.location.href = "/login"
    // return
  }
    
  return res.json()
}

