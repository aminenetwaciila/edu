export type EtudiantAnneesEtSemesters = {
    Ann_Nom: string;
    Ann_Id: string;
    semesters: EtudiantSemester[];
}


export type EtudiantSemester = {
    Sms_Nom: string;
    SpecSms_Id: string;
    EtdSpecSms_Id: string;
    Sms_NomComplet: string;
}

