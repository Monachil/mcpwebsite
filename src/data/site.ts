const FOUNDED_YEAR = 2019;

export const site = {
  title: 'Monachil Capital Partners',
  description: 'Greenwich, CT based investment manager focused on asset-backed lending and specialty finance',
  address: '1 Sound Shore Drive, Suite 303',
  city: 'Greenwich, CT 06830',
  phone: '(212) 393-4120',
  email: 'info@monachilpartners.com',
  fundURL: 'https://monachilfunds.com',
  techURL: 'https://monachiltech.com',
  copyright: 'Monachil Capital Partners LP',
  baseURL: 'https://monachill.com',
  linkedin: 'https://www.linkedin.com/company/monachil-capital-partners-lp/',
  formInfoEmail: 'info@monachilpartners.com',
  formIrEmail: 'ir@monachilpartners.com',
  formHrEmail: 'hr@monachilpartners.com',
  mailchimpAction: 'https://monachilpartners.us21.list-manage.com/subscribe/post',
  mailchimpU: 'c7650375616475ed2ad041889',
  mailchimpId: 'b6587dd9f2',
  foundedYear: FOUNDED_YEAR,
  yearsTrackRecord: new Date().getFullYear() - FOUNDED_YEAR,
} as const;
