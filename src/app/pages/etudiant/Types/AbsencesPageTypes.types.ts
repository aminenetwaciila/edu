export type SemesterAbsences = {
    Spec_Name: string;
    moyenne_semestre: number;
    status: string;
    modules: ModuleAbsence[];
}

export type ModuleAbsence = {
    module_code: string;
    intitule_module: string;
    status: string;
    elements: ElementAbsence[];
}


export type ElementAbsence = {
    intitule_element: string;
    crs_code: string;
    nbr_absence: number;
    absences: AbsenceEntity[];
}


export type AbsenceEntity = {
    abs_id: string;
    date: string;
    debut: string;
    fin: string;
    justif: string;
    type: string;
    prof: string;
    remarque: string;
    type_seance: string;
}

