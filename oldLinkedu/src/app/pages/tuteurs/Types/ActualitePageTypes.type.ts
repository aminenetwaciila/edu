
export type ActualiteMedia = {
  ActMed_Id: string,
  ActMed_type: string,
  ActMed_adresse: string
}

export type ActualiteComment = {
  ActCom_Id: string,
  ActCom_Pers_Id: string,
  ActCom_contenu: string,
  ActCom_created_at : string,
  Pers_Nom: string,
  Pers_Prenom: string,
  Pers_Photo ?: string,
  UserName ?: string
}

export type ActualiteT ={
    Act_Id: string,
    Act_Titre: string,
    Act_contenu ?: string,
    Act_created_at ?: Date,
    Act_updated_at ?: Date,
    num_comments ?: number,
    medias ?: ActualiteMedia[],
    comments: ActualiteComment[],
    shortened ?: boolean,
    num_likes :number,
    liked : boolean,
  }

export type ActualitePage = 
  {
  size: number,
  skip: number,
  data: ActualiteT[]
}


export type CreateCommentRequest = {
  ActCom_Id: string,
  ActCom_User_Id: string,
  ActCom_Act_Id: string,
  ActCom_contenu: string,
  ActCom_created_at: Date
}