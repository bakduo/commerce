'use strict';

class Repository {
  #strategy

  constructor(st){
    this.#strategy = st;
  }

  getStrategy(){
    return this.#strategy
  }

}

module.exports = Repository;
