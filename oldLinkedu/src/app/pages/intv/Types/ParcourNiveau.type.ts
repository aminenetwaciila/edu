
export type EnfantParcoursSms = {
  EtdSpecSms_Id: string;
  Sms_Nom: string;
  Sms_NomComplet: string;
  SmsMoyenne: number;
  SmsValidation: string;
  SmsMention: string;
  SmsObservation: string;
  Niv_Nom: string;
  Ann_Nom: string;

  _complete : boolean;
  _valide : boolean|null;
};
