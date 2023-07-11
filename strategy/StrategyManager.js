export class StrategyManager{
    constructor(){
        this._strategy = null;
    }

    addStrategy(strategy){
        this._strategy = [...this._strategies, strategy]
    }

    getStrategy(name){
        return this._strategies.find(strategy => strategy.name === name);
    }

}
