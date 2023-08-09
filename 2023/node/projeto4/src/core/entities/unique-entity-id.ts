import { randomUUID } from "crypto";

export class  uniqueEntityId {

    private value: string;

    toString(){
        return this.value
    }

    toValue(){
        return this.value
    }
    constructor(value?: string){
        this.value = value ?? randomUUID()
    }
}