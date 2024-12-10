export interface OnboardingData {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
}
const onboardingData: OnboardingData[] = [
  {
    id: 1,
    title: "Haasta.",
    description: "Haasta ystäväsi otteluihin ja liity turnauksiin!",
    backgroundColor: "#FCF596",
  },
  {
    id: 2,
    title: "Voita.",
    description: "Näytä taitosi ja ansaitse kunniaa!",
    backgroundColor: "#C2FFC7",
  },
  {
    id: 3,
    title: "Seuraa.",
    description: "Seuraa tuloksiasi ja paranna suoritustasi.",
    backgroundColor: "#FFF1DB",
  },
];
export default onboardingData;
