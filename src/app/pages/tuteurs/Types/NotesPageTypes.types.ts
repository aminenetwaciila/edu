export type SemesterNotes = {
    Spec_Name: string;
    moyenne_semestre: number;
    semester_mention: string;
    status: string;
    modules: ModuleNotes[];
}

export type ModuleNotes = {
    module_code: string;
    intitule_module: string;
    status: string;
    moyenne_module: number;
    elements: ElementNotes[];
}

export type ElementNotes = {
    intitule_element: string;
    crs_code: string;
    note_element: number;
    nbr_absence: number;
    EtdCrs_Rattrape: boolean;
    EtdCrs_NoteRattrap: number;
    Crs_NbrCredit: number;
    evaluations: EvaluationNotes[];
}

export type EvaluationNotes = {
    ElemEval_Nom: string;
    ElemEval_Dim: string;
    EtdCrsEval_Note: number;
    CrsEval_Pourcentage: number;
}


