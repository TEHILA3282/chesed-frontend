import { LoansListComponent } from './loans-list';

describe('LoansListComponent', () => {
  it('should create', () => {
    const component = new LoansListComponent(null as any, null as any);
    expect(component).toBeTruthy();
  });

  it('should load loan types on init', () => {
    const mockService = {
      getLoanTypes: () => ({
        subscribe: (fn: any) => fn([
          { id: 1, name: 'הלוואה לדירה', description: 'הלוואה לרכישת דירה או שיפוץ' }
        ])
      })
    };
    const component = new LoansListComponent(null as any, mockService as any);
    component.ngOnInit();
    expect(component.loanTypes.length).toBe(1);
    expect(component.loanTypes[0].name).toBe('הלוואה לדירה');
  });
});