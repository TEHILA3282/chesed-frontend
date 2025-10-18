import { ProgramsData } from '../programs.model';

export const ChaiadPrograms: ProgramsData = {
  meta: {
    title: 'פרסומות הגמ"ח | חי עד',
    subtitle: 'עלונים לפרסום | PDF | סרטון תדמית',
  },
  items: [
    { kind:'video', title:'סרטון פרסומי | חי עד', href:'https://youtu.be/VIDEO_ID', note:'צפייה ביוטיוב' },
    { kind:'pdf', title:'עלון הצטרפות', subtitle:'עמוד פרסום לחברים', href:'/assets/chavurat/join.pdf' },
    { kind:'pdf', title:'עלון תורמים', subtitle:'מידע לתורמים', href:'/assets/chavurat/donors.pdf' },
    { kind:'pdf', title:'פרוספקט חי עד', subtitle:'חומר שיווקי', href:'/assets/chavurat/prospect.pdf' },
  ]
};
