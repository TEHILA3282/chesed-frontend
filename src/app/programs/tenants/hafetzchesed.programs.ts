import { ProgramsData } from '../programs.model';

export const hafetzChesedPrograms: ProgramsData = {
  meta: {
    title: 'פרסומות הגמ"ח | חפץ חסד',
    subtitle: 'עלונים לפרסום | PDF | סרטון תדמית',
  },
  items: [
    { kind:'video', title:'סרטון פרסומי | חפץ חסד', href:'https://youtu.be/VIDEO_ID', note:'צפייה ביוטיוב' },
    { kind:'pdf', title:'עלון הצטרפות', subtitle:'עמוד פרסום לחברים', href:'/assets/chavurat/join.pdf' },
    { kind:'pdf', title:'עלון תורמים', subtitle:'מידע לתורמים', href:'/assets/chavurat/donors.pdf' },
    { kind:'pdf', title:'פרוספקט חפץ חסד', subtitle:'חומר שיווקי', href:'/assets/chavurat/prospect.pdf' },
  ]
};
