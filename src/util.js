export const sortUrl = (a, b) => {
  a = a.replace('/', '').split()[0]
  b = b.replace('/', '').split()[0]
  return a.toUpperCase().charCodeAt()-b.toUpperCase().charCodeAt()
}

export const sortFirstWord = (a, b) => {
  a = a.split()[0]
  b = b.split()[0]
  return a.toUpperCase().charCodeAt()-b.toUpperCase().charCodeAt()
}

export const listMapTree= (list) =>{
  if(list instanceof Array) {
   return list.map(item=>({
      value:item.id,
      label:item.name,
      children:listMapTree(item.children)
    }))
  }
  return [];
}