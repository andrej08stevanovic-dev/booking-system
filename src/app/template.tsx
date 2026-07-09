// Next remount-uje template pri SVAKOJ navigaciji, pa .page-enter animacija
// (fade + slide-up) krene za sadržaj svake nove stranice — čista CSS
// tranzicija bez biblioteka, radi zajedno sa TopProgressBar-om.
// "flex flex-1 flex-col" je obavezan: stranice sa vertikalno centriranim
// sadržajem (prijava, moja-zakazivanja…) računaju na flex lanac iz layout-a.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter flex flex-1 flex-col">{children}</div>;
}
