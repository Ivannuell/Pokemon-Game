/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Array {
    getGameObjProperty(string): any
    filterCollectionByProperty(string, any?): any
    filterByIdUsingFlagMap(Map): any[]
  }
}

export {}