import './Promokody.scss';

export const Promokody = ({ promokody }: Record<string, any>) => {
  return (
    <div className="promo-code-card">
      <span className="title">{promokody.promo_action_text}</span>
      <span className="text">{promokody.promo_text}</span>
      <span className="endText">До окончания срока осталось:</span>
      <span className="endDate">{promokody.diff_days_text}</span>
      <span className="name">{promokody.promo_name}</span>
    </div>
  );
};
