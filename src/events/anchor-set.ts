import { Anchor } from "../transformer/anchor";

declare type AnchorRecord = {identifier: number, anchor: Anchor, externalIdentifier?: any};
export class AnchorSet {
    private records: AnchorRecord[];
    private latestIdentifier: number;
    constructor(private readonly onCreateFirstAnchor: () => void){
        this.latestIdentifier = 0;
        this.records = [];
    }
    public get isEmpty(): boolean{
        return this.records.length === 0;
    }
    public addAnchor(anchor: Anchor, externalIdentifier?: any): number{
        const wasEmpty: boolean = this.isEmpty;
        const newIdentifier: number = ++this.latestIdentifier;
        this.records.push({identifier: newIdentifier, anchor: anchor, externalIdentifier: externalIdentifier});
        if(wasEmpty){
            this.onCreateFirstAnchor();
        }
        return newIdentifier;
    }
    public getAnchorByIdentifier(identifier: number): Anchor{
        const anchorRecord: AnchorRecord = this.records.find(r => r.identifier === identifier);
        if(anchorRecord){
            return anchorRecord.anchor;
        }
    }
    public getAnchorByExternalIdentifier(externalIdentifier: any){
        const anchorRecord: AnchorRecord = this.records.find(r => r.externalIdentifier === externalIdentifier);
        if(anchorRecord){
            return anchorRecord.anchor;
        }
    }
    public removeAnchorByIdentifier(identifier: number){
        const index: number = this.records.findIndex(r => r.identifier === identifier);
        if(index > -1){
            this.records.splice(index, 1);
        }
    }
    public removeAnchorByExternalIdentifier(externalIdentifier: any){
        const index: number = this.records.findIndex(r => r.externalIdentifier === externalIdentifier);
        if(index > -1){
            this.records.splice(index, 1);
        }
    }
}