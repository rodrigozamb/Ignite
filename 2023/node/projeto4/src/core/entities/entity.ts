import { uniqueEntityId } from "./unique-entity-id"

export class Entity<Props>{

    private _id: uniqueEntityId
    protected props: Props

    get id(){
        return this._id
    }

    constructor(props: Props, id?:string){
        this.props = props
        this._id = new uniqueEntityId(id)
    }
}