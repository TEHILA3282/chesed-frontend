export type PromoPdfItem = {
  kind: 'pdf';
  title: string;
  subtitle?: string;
  href: string;     
  note?: string;    
};
export type PromoVideoItem = {
  kind: 'video';
  title: string;
  subtitle?: string;
  href: string;      
  note?: string;
};
export type PromoItem = PromoPdfItem | PromoVideoItem;

export interface ProgramsMeta {
  title: string;       
  subtitle?: string;   
}

export interface ProgramsData {
  meta: ProgramsMeta;
  items: PromoItem[];  
}
