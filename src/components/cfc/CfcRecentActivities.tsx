import { formatCfcEventDate, sortCfcActivitiesDesc } from "@/lib/cfc/events";
import { listPublicCfcActivities } from "@/services/public-cfc.service";

type CfcRecentActivitiesProps = {
  cfcId: string | number;
  cfcName: string;
  isHi: boolean;
  limit?: number;
};

export default async function CfcRecentActivities({
  cfcId,
  cfcName,
  isHi,
  limit = 6,
}: CfcRecentActivitiesProps) {
  let activities: Awaited<ReturnType<typeof listPublicCfcActivities>>["items"] = [];

  try {
    const result = await listPublicCfcActivities({
      cfc_id: cfcId,
      page: 1,
      limit: Math.max(limit, 8),
    });
    activities = sortCfcActivitiesDesc(result.items).slice(0, limit);
  } catch {
    activities = [];
  }

  if (activities.length === 0) return null;

  return (
    <section className="cfc-section cfc-recent-activities">
      <div className="cfc-recent-events__head">
        <div>
          <h2>{isHi ? "हाल की गतिविधियां" : "Recent Activities"}</h2>
          <p className="cfc-section-note">
            {isHi
              ? `${cfcName} द्वारा दर्ज की गई नवीनतम गतिविधियां।`
              : `Latest activities recorded by ${cfcName}.`}
          </p>
        </div>
      </div>

      <div className="cfc-recent-activities__list">
        {activities.map((activity) => (
          <article key={activity.id} className="cfc-recent-activities__item">
            <strong>{activity.activity_name}</strong>
            <time dateTime={activity.activity_date}>
              {formatCfcEventDate(activity.activity_date, isHi)}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
