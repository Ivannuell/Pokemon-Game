/* eslint-disable @typescript-eslint/no-explicit-any */
Array.prototype.filterCollectionByProperty = function (property: string, value?: any) {
  if (!value) {
    console.log('no value call')
    return this.filter(obj => {
      return obj.properties.getGameObjProperty(property)
    })
  }

  return this.filter(obj => {
    return obj.properties.getGameObjProperty(property) === value
  })
}


Array.prototype.filterByPropertyUsingFlagMap = function (flagMap: any) {
  return this.filter(event => {
    return flagMap.get(event.properties.getGameObjProperty('event_id'))
  })
}


Array.prototype.changeNpcMessageProperty = function (npcName: string, newMsg: string) {
  const prop = { name: 'message', type: 'string', value: newMsg }

  const value = this.filter(npc => { return npc.name === npcName })
    .map(npc => {
      return { ...npc, properties: [prop] }
    })

  const index = this.findIndex((value) => value.name === npcName)
  this.splice(index, 1)

  return [...this, ...value]
}


Array.prototype.getGameObjProperty = function (propertyName: string): any {
  const props = ['name', 'value', 'type']
  if (!this.every(properties => {
    return props.every(prop => prop in properties)
  })) {
    throw new Error('This is not an array of game object properties.')
  }

  let propVal: any;
  this.forEach(prop => {
    if (prop.name === propertyName) {
      propVal = prop.value
      return
    }
  })
  return propVal
}