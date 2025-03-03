export type MatriculeState = {
    matricule: string;
    error : boolean;
    submitted : boolean;
}

export type SubmitChildrenMatriculesResponse = {
    matricule: string,
    added: boolean,
    error: boolean
}