import TopBar from '@/components/TopBar';
import Masthead from '@/components/Masthead';
import SurveyForm from '@/components/SurveyForm';
import SurveyFooter from '@/components/SurveyFooter';

export default function SurveyPage() {
  return (
    <>
      <TopBar />
      <div className="page">
        <Masthead />
        <SurveyForm />
      </div>
      <SurveyFooter />
    </>
  );
}
