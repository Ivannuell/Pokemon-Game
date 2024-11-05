/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Array {
    getGameObjProperty(string): any
    filterCollectionByProperty(string, any?): any
    filterByPropertyUsingFlagMap(Map): any[]
    changeNpcMessageProperty(npcName: string, newMsg: string)
  }
}

export {}